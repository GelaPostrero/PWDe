const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const authenticateToken = require('../Middlewares/auth');

// Test endpoint to check database connection
router.get('/test', async (req, res) => {
  try {
    const jobCount = await prisma.Job_Listings.count();
    res.json({ 
      success: true, 
      message: 'Database connection working',
      jobCount: jobCount 
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Get individual job details by ID
router.get('/job/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log('Fetching job details for ID:', jobId);
    
    const job = await prisma.Job_Listings.findUnique({
      where: {
        job_id: parseInt(jobId)
      },
      include: {
        employer: {
          select: {
            company_name: true,
            profile_picture: true,
            rating: true,
            company_description: true,
            accessibilityFeatures: true,
            user_id: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    console.log('Job found:', job);
    res.json({
      success: true,
      job: job
    });

  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job details',
      error: error.message
    });
  }
});

// Get all job listings with filters
router.get('/jobs', authenticateToken, async (req, res) => {
  try {
    console.log('JobSearch /jobs endpoint called');
    console.log('User data:', req.user);
    
    const {
      category,
      location,
      employmentType,
      workArrangement,
      experienceLevel,
      salaryMin,
      salaryMax,
      skills,
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause - temporarily remove deadline filter to see all jobs
    const where = {
      // application_deadline: {
      //   gte: new Date().toISOString() // Only show jobs that haven't expired
      // }
    };

    console.log('JobSearch query where clause:', JSON.stringify(where, null, 2));

    if (category) {
      where.jobCategory = category;
    }

    if (location) {
      where.OR = [
        { location_city: { contains: location, mode: 'insensitive' } },
        { location_province: { contains: location, mode: 'insensitive' } },
        { location_country: { contains: location, mode: 'insensitive' } }
      ];
    }

    if (employmentType) {
      where.employment_type = employmentType;
    }

    if (workArrangement) {
      where.work_arrangement = workArrangement;
    }

    if (experienceLevel) {
      where.experience_level = experienceLevel;
    }

    if (salaryMin || salaryMax) {
      where.AND = [];
      if (salaryMin) {
        where.AND.push({ salary_max: { gte: parseInt(salaryMin) } });
      }
      if (salaryMax) {
        where.AND.push({ salary_min: { lte: parseInt(salaryMax) } });
      }
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      where.skills_required = {
        hasSome: skillsArray
      };
    }

    // Build orderBy clause
    const orderBy = {};
    if (sortBy === 'salary') {
      orderBy.salary_min = sortOrder;
    } else if (sortBy === 'deadline') {
      orderBy.application_deadline = sortOrder;
    } else {
      orderBy.created_at = sortOrder;
    }

    // First, let's check what jobs exist in the database
    const allJobs = await prisma.Job_Listings.findMany({
      select: {
        job_id: true,
        jobtitle: true,
        application_deadline: true,
        job_status: true,
        created_at: true
      }
    });
    console.log('All jobs in database:', allJobs);

    const [jobs, totalCount] = await Promise.all([
      prisma.Job_Listings.findMany({
        where,
        include: {
          employer: {
            select: {
              company_name: true,
              profile_picture: true,
              rating: true,
              user_id: true
            }
          },
          _count: {
            select: {
              applications: true
            }
          }
        },
        orderBy,
        skip,
        take: parseInt(limit)
      }),
      prisma.Job_Listings.count({ where })
    ]);

    console.log('Filtered jobs count:', jobs.length);
    console.log('Total count:', totalCount);

    // Add profile picture URLs
    const jobsWithUrls = jobs.map(job => ({
      ...job,
      employer: {
        ...job.employer,
        profile_picture: job.employer.profile_picture 
          ? `http://localhost:4000/uploads/Employer/${job.employer.user_id}/${job.employer.profile_picture}`
          : null
      }
    }));

    res.json({
      success: true,
      data: jobsWithUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch jobs',
      error: error.message,
      stack: error.stack
    });
  }
});

// Get job recommendations for a PWD user
router.get('/recommendations', authenticateToken, async (req, res) => {
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

    // Build recommendation query based on PWD preferences
    const where = {
      application_deadline: {
        gte: new Date()
      }
    };

    // Filter by work arrangement preference
    if (pwdProfile.job_preferences?.work_arrangement) {
      where.work_arrangement = pwdProfile.job_preferences.work_arrangement;
    }

    // Filter by employment type preference
    if (pwdProfile.job_preferences?.employment_types?.length > 0) {
      where.employment_type = {
        in: pwdProfile.job_preferences.employment_types
      };
    }

    // Filter by experience level
    if (pwdProfile.job_preferences?.experience_level) {
      where.experience_level = pwdProfile.job_preferences.experience_level;
    }

    // Filter by salary range
    if (pwdProfile.job_preferences?.salary_range) {
      const salaryRange = pwdProfile.job_preferences.salary_range;
      const match = salaryRange.match(/(\d+)\s*-\s*(\d+)/);
      if (match) {
        where.AND = [
          { salary_min: { gte: parseInt(match[1]) } },
          { salary_max: { lte: parseInt(match[2]) } }
        ];
      }
    }

    // Filter by skills match
    if (pwdProfile.skills?.length > 0) {
      where.skills_required = {
        hasSome: pwdProfile.skills
      };
    }

    // Get recommended jobs
    const recommendedJobs = await prisma.Job_Listings.findMany({
      where,
      include: {
        employer: {
          select: {
            company_name: true,
            profile_picture: true,
            rating: true,
            user_id: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 20
    });

    // Calculate match scores and sort by relevance
    const jobsWithScores = recommendedJobs.map(job => {
      let score = 0;
      
      // Skills match score (40% weight)
      if (pwdProfile.skills && job.skills_required) {
        const matchingSkills = pwdProfile.skills.filter(skill => 
          job.skills_required.includes(skill)
        );
        score += (matchingSkills.length / job.skills_required.length) * 40;
      }

      // Work arrangement match (20% weight)
      if (pwdProfile.job_preferences?.work_arrangement === job.work_arrangement) {
        score += 20;
      }

      // Employment type match (20% weight)
      if (pwdProfile.job_preferences?.employment_types?.includes(job.employment_type)) {
        score += 20;
      }

      // Experience level match (10% weight)
      if (pwdProfile.job_preferences?.experience_level === job.experience_level) {
        score += 10;
      }

      // Accessibility features match (10% weight)
      if (pwdProfile.accessibility_needs && job.workplace_accessibility_features) {
        const matchingFeatures = pwdProfile.accessibility_needs.visual_support?.filter(feature =>
          job.workplace_accessibility_features.includes(feature)
        ) || [];
        score += (matchingFeatures.length / Math.max(pwdProfile.accessibility_needs.visual_support?.length || 1, 1)) * 10;
      }

      return {
        ...job,
        matchScore: Math.round(score),
        employer: {
          ...job.employer,
          profile_picture: job.employer.profile_picture 
            ? `http://localhost:4000/uploads/Employer/${job.employer.user_id}/${job.employer.profile_picture}`
            : null
        }
      };
    });

    // Sort by match score
    jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      data: jobsWithScores.slice(0, 10), // Return top 10 recommendations
      userPreferences: {
        workArrangement: pwdProfile.job_preferences?.work_arrangement,
        employmentTypes: pwdProfile.job_preferences?.employment_types,
        experienceLevel: pwdProfile.job_preferences?.experience_level,
        skills: pwdProfile.skills
      }
    });
  } catch (error) {
    console.error('Error fetching job recommendations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations' });
  }
});

// Get job categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.job_categories.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// Get single job details
router.get('/jobs/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const pwd_id = req.user?.pwd_id;

    const job = await prisma.Job_Listings.findUnique({
      where: { job_id: parseInt(jobId) },
      include: {
        employer: {
          select: {
            company_name: true,
            company_description: true,
            profile_picture: true,
            rating: true,
            user_id: true,
            location_city: true,
            location_province: true,
            location_country: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if user has already applied
    let hasApplied = false;
    if (pwd_id) {
      const existingApplication = await prisma.applications.findFirst({
        where: {
          job_id: parseInt(jobId),
          pwd_id: pwd_id
        }
      });
      hasApplied = !!existingApplication;
    }

    // Check if job is saved by user
    let isSaved = false;
    if (pwd_id) {
      const savedJob = await prisma.Saved_Jobs.findFirst({
        where: {
          job_id: parseInt(jobId),
          pwd_id: pwd_id
        }
      });
      isSaved = !!savedJob;
    }

    const jobWithUrls = {
      ...job,
      hasApplied,
      isSaved,
      employer: {
        ...job.employer,
        profile_picture: job.employer.profile_picture 
          ? `http://localhost:4000/uploads/Employer/${job.employer.user_id}/${job.employer.profile_picture}`
          : null
      }
    };

    res.json({
      success: true,
      data: jobWithUrls
    });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job details' });
  }
});

module.exports = router;
