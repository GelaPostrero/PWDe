const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const authenticateToken = require('../Middlewares/auth');

// Generate AI job matches for a PWD user
router.post('/generate-matches', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Get PWD profile and preferences
    const pwdProfile = await prisma.pwd_Profile.findUnique({
      where: { pwd_id },
      include: {
        job_preferences: true,
        accessibility_needs: true,
        experiences: true,
        educations: true
      }
    });

    if (!pwdProfile) {
      return res.status(404).json({ success: false, message: 'PWD profile not found' });
    }

    // Get all active jobs
    const activeJobs = await prisma.Job_Listings.findMany({
      where: {
        application_deadline: { gte: new Date().toISOString() }
      },
      include: {
        employer: {
          select: {
            company_name: true,
            profile_picture: true,
            user_id: true,
            rating: true
          }
        },
        _count: {
          select: { applications: true }
        }
      }
    });

    // Calculate match scores for each job
    const jobMatches = activeJobs.map(job => {
      const matchScore = calculateMatchScore(pwdProfile, job);
      return {
        job_id: job.job_id,
        match_score: matchScore.overall,
        scores: matchScore.breakdown,
        job: {
          ...job,
          employer: {
            ...job.employer,
            profile_picture: job.employer.profile_picture 
              ? `http://localhost:4000/uploads/Employer/${job.employer.user_id}/${job.employer.profile_picture}`
              : null
          }
        }
      };
    });

    // Sort by match score and get top matches
    const topMatches = jobMatches
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 20);

    // Store matches in database
    const matchRecords = topMatches.map(match => ({
      pwd_id: pwd_id,
      job_id: match.job_id,
      overall_score: match.match_score,
      skills_match_score: match.scores.skills,
      experience_match_score: match.scores.experience,
      location_match_score: match.scores.location,
      accessibility_match_score: match.scores.accessibility,
      matched_on: new Date()
    }));

    // Delete existing matches for this user
    await prisma.ai_match_results.deleteMany({
      where: { pwd_id: pwd_id }
    });

    // Insert new matches
    await prisma.ai_match_results.createMany({
      data: matchRecords
    });

    res.json({
      success: true,
      message: 'AI matches generated successfully',
      data: {
        matches: topMatches,
        totalJobsAnalyzed: activeJobs.length,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error generating AI matches:', error);
    res.status(500).json({ success: false, message: 'Failed to generate AI matches' });
  }
});

// Get AI matches for a PWD user
router.get('/my-matches', authenticateToken, async (req, res) => {
  try {
    console.log('AI Matching /my-matches endpoint called');
    console.log('User data:', req.user);
    
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const { page = 1, limit = 10, minScore = 0 } = req.query;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [matches, totalCount] = await Promise.all([
      prisma.ai_match_results.findMany({
        where: {
          pwd_id: pwd_id,
          overall_score: { gte: parseFloat(minScore) }
        },
        include: {
          job: {
            include: {
              employer: {
                select: {
                  company_name: true,
                  profile_picture: true,
                  user_id: true,
                  rating: true
                }
              },
              _count: {
                select: { applications: true }
              }
            }
          }
        },
        orderBy: { overall_score: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.ai_match_results.count({
        where: {
          pwd_id: pwd_id,
          overall_score: { gte: parseFloat(minScore) }
        }
      })
    ]);

    const matchesWithUrls = matches.map(match => ({
      match_id: match.match_id,
      overall_score: match.overall_score,
      skills_match_score: match.skills_match_score,
      experience_match_score: match.experience_match_score,
      location_match_score: match.location_match_score,
      accessibility_match_score: match.accessibility_match_score,
      matched_on: match.matched_on,
      job: {
        ...match.job,
        employer: {
          ...match.job.employer,
          profile_picture: match.job.employer.profile_picture 
            ? `http://localhost:4000/uploads/Employer/${match.job.employer.user_id}/${match.job.employer.profile_picture}`
            : null
        }
      }
    }));

    res.json({
      success: true,
      data: matchesWithUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching AI matches:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch AI matches',
      error: error.message,
      stack: error.stack
    });
  }
});

// Get match details
router.get('/matches/:matchId', authenticateToken, async (req, res) => {
  try {
    const { matchId } = req.params;
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const match = await prisma.ai_match_results.findFirst({
      where: {
        match_id: parseInt(matchId),
        pwd_id: pwd_id
      },
      include: {
        job: {
          include: {
            employer: {
              select: {
                company_name: true,
                company_description: true,
                profile_picture: true,
                user_id: true,
                rating: true,
                location_city: true,
                location_province: true,
                location_country: true
              }
            },
            _count: {
              select: { applications: true }
            }
          }
        }
      }
    });

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    // Get detailed match analysis
    const pwdProfile = await prisma.pwd_Profile.findUnique({
      where: { pwd_id },
      include: {
        job_preferences: true,
        accessibility_needs: true,
        experiences: true,
        educations: true
      }
    });

    const matchAnalysis = generateDetailedMatchAnalysis(pwdProfile, match.job, match);

    const matchWithUrls = {
      ...match,
      analysis: matchAnalysis,
      job: {
        ...match.job,
        employer: {
          ...match.job.employer,
          profile_picture: match.job.employer.profile_picture 
            ? `http://localhost:4000/uploads/Employer/${match.job.employer.user_id}/${match.job.employer.profile_picture}`
            : null
        }
      }
    };

    res.json({
      success: true,
      data: matchWithUrls
    });
  } catch (error) {
    console.error('Error fetching match details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch match details' });
  }
});

// Get match statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const [
      totalMatches,
      averageScore,
      scoreDistribution,
      lastGenerated
    ] = await Promise.all([
      prisma.ai_match_results.count({
        where: { pwd_id: pwd_id }
      }),
      prisma.ai_match_results.aggregate({
        where: { pwd_id: pwd_id },
        _avg: { overall_score: true }
      }),
      prisma.ai_match_results.groupBy({
        by: ['overall_score'],
        where: { pwd_id: pwd_id },
        _count: { overall_score: true }
      }),
      prisma.ai_match_results.findFirst({
        where: { pwd_id: pwd_id },
        orderBy: { matched_on: 'desc' },
        select: { matched_on: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalMatches,
        averageScore: Math.round((averageScore._avg.overall_score || 0) * 10) / 10,
        scoreDistribution: scoreDistribution.map(score => ({
          score: score.overall_score,
          count: score._count.overall_score
        })),
        lastGenerated: lastGenerated?.matched_on || null
      }
    });
  } catch (error) {
    console.error('Error fetching match statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch match statistics' });
  }
});

// Helper function to calculate match score
function calculateMatchScore(pwdProfile, job) {
  let skillsScore = 0;
  let experienceScore = 0;
  let locationScore = 0;
  let accessibilityScore = 0;

  // Skills matching (40% weight)
  if (pwdProfile.skills && job.skills_required) {
    const matchingSkills = pwdProfile.skills.filter(skill => 
      job.skills_required.includes(skill)
    );
    skillsScore = (matchingSkills.length / job.skills_required.length) * 100;
  }

  // Experience matching (25% weight)
  if (pwdProfile.job_preferences?.experience_level === job.experience_level) {
    experienceScore = 100;
  } else {
    // Partial matching based on experience level hierarchy
    const experienceLevels = ['entry', 'junior', 'mid', 'senior', 'executive'];
    const pwdLevel = experienceLevels.indexOf(pwdProfile.job_preferences?.experience_level || 'entry');
    const jobLevel = experienceLevels.indexOf(job.experience_level || 'entry');
    
    if (pwdLevel >= jobLevel) {
      experienceScore = 80; // Can handle higher level
    } else if (Math.abs(pwdLevel - jobLevel) === 1) {
      experienceScore = 60; // One level difference
    } else {
      experienceScore = 20; // Multiple levels difference
    }
  }

  // Location matching (15% weight)
  if (pwdProfile.job_preferences?.work_arrangement === 'remote' && 
      job.work_arrangement === 'remote') {
    locationScore = 100;
  } else if (pwdProfile.job_preferences?.work_arrangement === 'hybrid' && 
             ['remote', 'hybrid'].includes(job.work_arrangement)) {
    locationScore = 80;
  } else if (pwdProfile.job_preferences?.work_arrangement === 'onsite' && 
             job.work_arrangement === 'onsite') {
    locationScore = 100;
  } else {
    locationScore = 40; // Partial match
  }

  // Accessibility matching (20% weight)
  if (pwdProfile.accessibility_needs && job.workplace_accessibility_features) {
    const matchingFeatures = pwdProfile.accessibility_needs.visual_support?.filter(feature =>
      job.workplace_accessibility_features.includes(feature)
    ) || [];
    accessibilityScore = (matchingFeatures.length / Math.max(pwdProfile.accessibility_needs.visual_support?.length || 1, 1)) * 100;
  } else {
    accessibilityScore = 50; // Neutral score if no accessibility needs specified
  }

  // Calculate overall score
  const overallScore = Math.round(
    (skillsScore * 0.4) + 
    (experienceScore * 0.25) + 
    (locationScore * 0.15) + 
    (accessibilityScore * 0.2)
  );

  return {
    overall: overallScore,
    breakdown: {
      skills: Math.round(skillsScore),
      experience: Math.round(experienceScore),
      location: Math.round(locationScore),
      accessibility: Math.round(accessibilityScore)
    }
  };
}

// Helper function to generate detailed match analysis
function generateDetailedMatchAnalysis(pwdProfile, job, match) {
  const analysis = {
    strengths: [],
    considerations: [],
    recommendations: []
  };

  // Analyze skills match
  if (match.skills_match_score >= 80) {
    analysis.strengths.push('Strong skills alignment with job requirements');
  } else if (match.skills_match_score >= 60) {
    analysis.considerations.push('Moderate skills match - consider highlighting relevant experience');
  } else {
    analysis.considerations.push('Limited skills match - may need additional training or experience');
  }

  // Analyze experience match
  if (match.experience_match_score >= 80) {
    analysis.strengths.push('Experience level aligns well with job requirements');
  } else {
    analysis.considerations.push('Experience level may not fully match job requirements');
  }

  // Analyze accessibility match
  if (match.accessibility_match_score >= 80) {
    analysis.strengths.push('Excellent accessibility support match');
  } else if (match.accessibility_match_score >= 60) {
    analysis.considerations.push('Good accessibility support available');
  } else {
    analysis.considerations.push('Limited accessibility support - consider discussing accommodations');
  }

  // Generate recommendations
  if (match.overall_score >= 80) {
    analysis.recommendations.push('This is an excellent match - highly recommended to apply');
  } else if (match.overall_score >= 60) {
    analysis.recommendations.push('Good match - worth applying with a strong cover letter');
  } else {
    analysis.recommendations.push('Consider if this role aligns with your career goals');
  }

  return analysis;
}

module.exports = router;
