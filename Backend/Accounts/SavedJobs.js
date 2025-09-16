const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const authenticateToken = require('../Middlewares/auth');

// Save a job
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const { jobId } = req.body;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Check if job exists
    const job = await prisma.Job_Listings.findUnique({
      where: { job_id: parseInt(jobId) },
      include: {
        employer: {
          select: {
            employer_id: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if job is already saved
    const existingSavedJob = await prisma.Saved_Jobs.findFirst({
      where: {
        job_id: parseInt(jobId),
        pwd_id: pwd_id
      }
    });

    if (existingSavedJob) {
      return res.status(400).json({ success: false, message: 'Job is already saved' });
    }

    // Save the job
    const savedJob = await prisma.Saved_Jobs.create({
      data: {
        job_id: parseInt(jobId),
        pwd_id: pwd_id,
        employer_id: job.employer.employer_id
      },
      include: {
        job_listings: {
          include: {
            employer: {
              select: {
                company_name: true,
                profile_picture: true,
                user_id: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: {
        ...savedJob,
        job: {
          ...savedJob.job_listings,
          employer: {
            ...savedJob.job_listings.employer,
            profile_picture: savedJob.job_listings.employer.profile_picture 
              ? `http://localhost:4000/uploads/Employer/${savedJob.job_listings.employer.user_id}/${savedJob.job_listings.employer.profile_picture}`
              : null
          }
        }
      }
    });
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ success: false, message: 'Failed to save job' });
  }
});

// Unsave a job
router.delete('/unsave/:jobId', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const { jobId } = req.params;

    console.log('Unsave request:', { pwd_id, userType, jobId });

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Check if job is saved
    const savedJob = await prisma.Saved_Jobs.findFirst({
      where: {
        job_id: parseInt(jobId),
        pwd_id: pwd_id
      }
    });

    console.log('Found saved job:', savedJob);

    if (!savedJob) {
      console.log('Job not found in saved jobs');
      return res.status(404).json({ success: false, message: 'Job is not saved' });
    }

    // Remove the saved job
    console.log('Deleting saved job with ID:', savedJob.savedJob_id);
    await prisma.Saved_Jobs.delete({
      where: { savedJob_id: savedJob.savedJob_id }
    });

    console.log('Successfully deleted saved job');

    res.json({
      success: true,
      message: 'Job removed from saved jobs'
    });
  } catch (error) {
    console.error('Error unsaving job:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to remove saved job',
      error: error.message 
    });
  }
});

// Get user's saved jobs
router.get('/my-saved-jobs', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const { page = 1, limit = 10, sortBy = 'recent', sortOrder = 'desc' } = req.query;

    console.log('Fetching saved jobs for user:', { pwd_id, userType, page, limit });

    if (userType !== 'PWD' || !pwd_id) {
      console.log('Invalid user type or missing pwd_id:', { userType, pwd_id });
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build orderBy clause
    const orderBy = {};
    if (sortBy === 'job_title') {
      orderBy.job_listings = { jobtitle: sortOrder };
    } else if (sortBy === 'company') {
      orderBy.job_listings = { employer: { company_name: sortOrder } };
    } else {
      // Use savedJob_id for default ordering (most recent saved jobs first)
      orderBy.savedJob_id = sortOrder;
    }

    console.log('Querying saved jobs with params:', { pwd_id, orderBy, skip, limit: parseInt(limit) });

    const [savedJobs, totalCount] = await Promise.all([
      prisma.Saved_Jobs.findMany({
        where: { pwd_id: pwd_id },
        include: {
          job_listings: {
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
                select: {
                  applications: true
                }
              }
            }
          }
        },
        orderBy,
        skip,
        take: parseInt(limit)
      }),
      prisma.Saved_Jobs.count({ where: { pwd_id: pwd_id } })
    ]);

    console.log('Found saved jobs:', savedJobs.length, 'Total count:', totalCount);

    // Filter out expired jobs and add URLs
    const validSavedJobs = savedJobs
      .filter(savedJob => {
        if (!savedJob.job_listings.application_deadline) return true; // No deadline means it's still valid
        return new Date(savedJob.job_listings.application_deadline) >= new Date();
      })
      .map(savedJob => ({
        ...savedJob,
        job: {
          ...savedJob.job_listings,
          employer: {
            ...savedJob.job_listings.employer,
            profile_picture: savedJob.job_listings.employer.profile_picture 
              ? `http://localhost:4000/uploads/Employer/${savedJob.job_listings.employer.user_id}/${savedJob.job_listings.employer.profile_picture}`
              : null
          }
        }
      }));

    console.log('Valid saved jobs after filtering:', validSavedJobs.length);

    res.json({
      success: true,
      data: validSavedJobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: validSavedJobs.length,
        pages: Math.ceil(validSavedJobs.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch saved jobs',
      error: error.message 
    });
  }
});

// Check if a job is saved by user
router.get('/check/:jobId', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const { jobId } = req.params;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const savedJob = await prisma.Saved_Jobs.findFirst({
      where: {
        job_id: parseInt(jobId),
        pwd_id: pwd_id
      }
    });

    res.json({
      success: true,
      data: {
        isSaved: !!savedJob,
        savedAt: savedJob ? new Date().toISOString() : null // Use current date as fallback
      }
    });
  } catch (error) {
    console.error('Error checking saved job:', error);
    res.status(500).json({ success: false, message: 'Failed to check saved job status' });
  }
});

// Get saved jobs count
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const count = await prisma.Saved_Jobs.count({
      where: { pwd_id: pwd_id }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error fetching saved jobs count:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch saved jobs count' });
  }
});

// Bulk unsave jobs
router.delete('/bulk-unsave', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const { jobIds } = req.body;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Job IDs array is required' });
    }

    // Remove multiple saved jobs
    const result = await prisma.Saved_Jobs.deleteMany({
      where: {
        pwd_id: pwd_id,
        job_id: {
          in: jobIds.map(id => parseInt(id))
        }
      }
    });

    res.json({
      success: true,
      message: `${result.count} jobs removed from saved jobs`,
      data: { removedCount: result.count }
    });
  } catch (error) {
    console.error('Error bulk unsaving jobs:', error);
    res.status(500).json({ success: false, message: 'Failed to remove saved jobs' });
  }
});

module.exports = router;
