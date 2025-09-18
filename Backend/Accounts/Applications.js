const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const authenticateToken = require('../Middlewares/auth');

// Apply to a job
router.post('/apply', authenticateToken, async (req, res) => {
  try {
    console.log('Application submission request received');
    console.log('User data:', req.user);
    console.log('Body data:', req.body);
    
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const { jobId, customMessage, proposedSalary, resumeId, workExperience, portfolioLinks } = req.body;
    
    console.log('Received work experience data:', workExperience);
    console.log('Received portfolio links data:', portfolioLinks);

    console.log('User type validation:', { userType, pwd_id });
    
    if (userType !== 'PWD' || !pwd_id) {
      console.log('Invalid user type or missing pwd_id');
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Check if job exists and is still open
    const job = await prisma.Job_Listings.findUnique({
      where: { job_id: parseInt(jobId) },
      include: {
        employer: true
      }
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    console.log('Job application deadline:', job.application_deadline);
    console.log('Current date:', new Date());
    
    // Parse the deadline date properly (format: MM/DD/YYYY)
    const deadlineDate = new Date(job.application_deadline);
    const currentDate = new Date();
    
    console.log('Parsed deadline date:', deadlineDate);
    console.log('Deadline comparison:', deadlineDate, '<', currentDate, '=', deadlineDate < currentDate);
    
    if (deadlineDate < currentDate) {
      console.log('Application deadline has passed');
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    }

    // Check if user has already applied
    const existingApplication = await prisma.Applications.findFirst({
      where: {
        job_id: parseInt(jobId),
        pwd_id: pwd_id
      }
    });

    console.log('Existing application check:', existingApplication);

    // Temporarily disable existing application check for debugging
    // if (existingApplication) {
    //   console.log('User has already applied to this job');
    //   return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    // }

    console.log('No existing application found, proceeding with application creation');

    // Get user's default resume if no resumeId provided
    let selectedResumeId = resumeId;
    console.log('Resume ID from request:', resumeId);
    
    if (!selectedResumeId) {
      console.log('No resume ID provided, looking for default resume');
      const defaultResume = await prisma.Resumes.findFirst({
        where: { pwd_id: pwd_id },
        orderBy: { created_at: 'desc' }
      });
      selectedResumeId = defaultResume?.resume_id;
      console.log('Default resume found:', defaultResume);
    }

    console.log('Selected resume ID:', selectedResumeId);

    if (!selectedResumeId) {
      console.log('No resume found, continuing without resume ID');
      // Allow application without resume for now
      // return res.status(400).json({ success: false, message: 'No resume found. Please upload a resume first.' });
    }

    // Create application
    console.log('Storing work experience in DB:', workExperience ? JSON.stringify(workExperience) : null);
    console.log('Storing portfolio links in DB:', portfolioLinks ? JSON.stringify(portfolioLinks) : null);
    
    const application = await prisma.Applications.create({
      data: {
        job_id: parseInt(jobId),
        pwd_id: pwd_id,
        employer_id: job.employer_id, // Get employer_id from the job
        resume_id: selectedResumeId,
        custom_message: customMessage || '',
        proposed_salary: proposedSalary || null,
        work_experience: workExperience ? JSON.stringify(workExperience) : null,
        portfolio_links: portfolioLinks ? JSON.stringify(portfolioLinks) : null,
        submitted_at: new Date(),
        status_changed_at: new Date()
      },
      include: {
        job_listing: {
          include: {
            employer: {
              select: {
                company_name: true,
                profile_picture: true,
                user_id: true
              }
            }
          }
        },
        resume: {
          select: {
            title: true,
            file_path: true
          }
        }
      }
    });

    // Create notification for employer
    await prisma.Notifications.create({
      data: {
        user_id: job.employer.user_id,
        type: 'new_application',
        title: 'New Job Application',
        content: `You have received a new application for the position: ${job.jobtitle}`,
        is_read: false
      }
    });

    // Create chat thread for this application
    await prisma.Chat_Thread.create({
      data: {
        application_id: application.application_id,
        pwd_id: pwd_id,
        employer_id: job.employer_id,
        is_active: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        ...application,
        job: {
          ...application.job_listing,
          employer: {
            ...application.job_listing.employer,
            profile_picture: application.job_listing.employer.profile_picture 
              ? `http://localhost:4000/uploads/Employer/${application.job_listing.employer.user_id}/${application.job_listing.employer.profile_picture}`
              : null
          }
        }
      }
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit application',
      error: error.message 
    });
  }
});

// Get user's applications (for PWD)
router.get('/my-applications', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const { status, page = 1, limit = 10 } = req.query;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = { pwd_id: pwd_id };
    if (status) {
      where.status = status;
    }

    const [applications, totalCount] = await Promise.all([
      prisma.Applications.findMany({
        where,
        include: {
          job_listing: {
            include: {
              employer: {
                select: {
                  company_name: true,
                  profile_picture: true,
                  user_id: true
                }
              }
            }
          },
          resume: {
            select: {
              title: true,
              file_path: true
            }
          }
        },
        orderBy: { submitted_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.Applications.count({ where })
    ]);

    const applicationsWithUrls = applications.map(app => ({
      ...app,
      job: {
        ...app.job_listing,
        employer: {
          ...app.job_listing.employer,
          profile_picture: app.job_listing.employer.profile_picture 
            ? `http://localhost:4000/uploads/Employer/${app.job_listing.employer.user_id}/${app.job_listing.employer.profile_picture}`
            : null
        }
      }
    }));

    res.json({
      success: true,
      data: applicationsWithUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

// Check if user has already applied to a job
router.get('/check/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const existingApplication = await prisma.Applications.findFirst({
      where: {
        job_id: parseInt(jobId),
        pwd_id: pwd_id
      },
      include: {
        job_listing: {
          include: {
            employer: {
              select: {
                company_name: true,
                profile_picture: true,
                user_id: true
              }
            }
          }
        },
        resume: {
          select: {
            title: true,
            file_path: true
          }
        }
      }
    });

    if (existingApplication) {
      console.log('Raw work experience from DB:', existingApplication.work_experience);
      console.log('Raw portfolio links from DB:', existingApplication.portfolio_links);
      
      const applicationWithUrls = {
        ...existingApplication,
        work_experience: existingApplication.work_experience ? JSON.parse(existingApplication.work_experience) : null,
        portfolio_links: existingApplication.portfolio_links ? JSON.parse(existingApplication.portfolio_links) : null,
        job: {
          ...existingApplication.job_listing,
          employer: {
            ...existingApplication.job_listing.employer,
            profile_picture: existingApplication.job_listing.employer.profile_picture 
              ? `http://localhost:4000/uploads/Employer/${existingApplication.job_listing.employer.user_id}/${existingApplication.job_listing.employer.profile_picture}`
              : null
          }
        }
      };

      res.json({
        success: true,
        hasApplied: true,
        application: applicationWithUrls
      });
    } else {
      res.json({
        success: true,
        hasApplied: false,
        application: null
      });
    }
  } catch (error) {
    console.error('Error checking application:', error);
    res.status(500).json({ success: false, message: 'Failed to check application status' });
  }
});

// Withdraw application endpoint
router.post('/withdraw/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;

    console.log('Withdrawing application for job:', jobId, 'by user:', pwd_id);

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Find the application
    const existingApplication = await prisma.Applications.findFirst({
      where: {
        job_id: parseInt(jobId),
        pwd_id: pwd_id
      },
      include: {
        job_listing: {
          include: {
            employer: {
              select: {
                company_name: true,
                user_id: true
              }
            }
          }
        }
      }
    });

    if (!existingApplication) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Delete the application
    await prisma.Applications.delete({
      where: {
        application_id: existingApplication.application_id
      }
    });

    // Create notification for employer about withdrawal
    await prisma.Notifications.create({
      data: {
        user_id: existingApplication.job_listing.employer.user_id,
        type: 'application_withdrawn',
        title: 'Application Withdrawn',
        content: `An application for the position "${existingApplication.job_listing.job_title}" at ${existingApplication.job_listing.employer.company_name} has been withdrawn.`,
        is_read: false,
        created_at: new Date()
      }
    });

    console.log('Application withdrawn successfully');

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });

  } catch (error) {
    console.error('Error withdrawing application:', error);
    res.status(500).json({ success: false, message: 'Failed to withdraw application' });
  }
});

// Get applications for a job (for employers)
router.get('/job/:jobId/applications', authenticateToken, async (req, res) => {
  try {
    const emp_id = req.user?.emp_id;
    const userType = req.user?.userType;
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    if (userType !== 'Employer' || !emp_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Verify job belongs to employer
    const job = await prisma.Job_Listings.findFirst({
      where: {
        job_id: parseInt(jobId),
        employer_id: emp_id
      }
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or access denied' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = { job_id: parseInt(jobId) };
    if (status) {
      where.status = status;
    }

    const [applications, totalCount] = await Promise.all([
      prisma.Applications.findMany({
        where,
        include: {
          pwd: {
            select: {
              first_name: true,
              last_name: true,
              profile_picture: true,
              professional_role: true,
              rating: true,
              user_id: true
            }
          },
          resume: {
            select: {
              title: true,
              file_path: true,
              summary: true,
              skill: true
            }
          }
        },
        orderBy: { submitted_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.Applications.count({ where })
    ]);

    const applicationsWithUrls = applications.map(app => ({
      ...app,
      pwd: {
        ...app.pwd,
        profile_picture: app.pwd.profile_picture 
          ? `http://localhost:4000/uploads/PWDs/${app.pwd.user_id}/${app.pwd.profile_picture}`
          : null
      }
    }));

    res.json({
      success: true,
      data: applicationsWithUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

// Update application status (for employers)
router.put('/:applicationId/status', authenticateToken, async (req, res) => {
  try {
    const emp_id = req.user?.emp_id;
    const userType = req.user?.userType;
    const { applicationId } = req.params;
    const { status, message } = req.body;

    if (userType !== 'Employer' || !emp_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Get application and verify employer owns the job
    const application = await prisma.Applications.findFirst({
      where: {
        application_id: parseInt(applicationId)
      },
      include: {
        job: true,
        pwd: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.job.employer_id !== emp_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Update application status
    const updatedApplication = await prisma.Applications.update({
      where: { application_id: parseInt(applicationId) },
      data: {
        status: status,
        status_changed_at: new Date()
      },
      include: {
        job: {
          select: {
            jobtitle: true
          }
        },
        pwd: {
          select: {
            first_name: true,
            last_name: true
          }
        }
      }
    });

    // Create notification for PWD
    const statusMessages = {
      'reviewing': 'Your application is being reviewed',
      'shortlisted': 'Congratulations! You have been shortlisted',
      'interview': 'You have been invited for an interview',
      'accepted': 'Congratulations! Your application has been accepted',
      'rejected': 'Unfortunately, your application was not successful this time'
    };

    await prisma.Notifications.create({
      data: {
        user_id: application.pwd.user_id,
        type: 'application_status_update',
        title: 'Application Status Update',
        content: `${statusMessages[status]} for the position: ${application.job.jobtitle}${message ? '. ' + message : ''}`,
        is_read: false
      }
    });

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: updatedApplication
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, message: 'Failed to update application status' });
  }
});

// Get application count for a PWD user
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const totalApplications = await prisma.Applications.count({
      where: { pwd_id: pwd_id }
    });

    const pendingApplications = await prisma.Applications.count({
      where: { 
        pwd_id: pwd_id,
        status: 'Pending'
      }
    });

    const acceptedApplications = await prisma.Applications.count({
      where: { 
        pwd_id: pwd_id,
        status: 'Accepted'
      }
    });

    const rejectedApplications = await prisma.Applications.count({
      where: { 
        pwd_id: pwd_id,
        status: 'Rejected'
      }
    });

    res.json({
      success: true,
      data: {
        total: totalApplications,
        pending: pendingApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications
      }
    });
  } catch (error) {
    console.error('Error fetching application count:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch application count',
      error: error.message 
    });
  }
});

// Get single application details
router.get('/:applicationId', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user?.userId;
    const userType = req.user?.userType;
    const pwd_id = req.user?.pwd_id;
    const emp_id = req.user?.emp_id;

    const application = await prisma.Applications.findUnique({
      where: { application_id: parseInt(applicationId) },
      include: {
        job: {
          include: {
            employer: {
              select: {
                company_name: true,
                profile_picture: true,
                user_id: true
              }
            }
          }
        },
        pwd: {
          select: {
            first_name: true,
            last_name: true,
            profile_picture: true,
            professional_role: true,
            rating: true,
            user_id: true
          }
        },
        resume: {
          select: {
            title: true,
            file_path: true,
            summary: true,
            skill: true,
            work_experience: true,
            education: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check access permissions
    const hasAccess = 
      (userType === 'PWD' && application.pwd_id === pwd_id) ||
      (userType === 'Employer' && application.job.employer_id === emp_id);

    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const applicationWithUrls = {
      ...application,
      job: {
        ...application.job,
        employer: {
          ...application.job.employer,
          profile_picture: application.job.employer.profile_picture 
            ? `http://localhost:4000/uploads/Employer/${application.job.employer.user_id}/${application.job.employer.profile_picture}`
            : null
        }
      },
      pwd: {
        ...application.pwd,
        profile_picture: application.pwd.profile_picture 
          ? `http://localhost:4000/uploads/PWDs/${application.pwd.user_id}/${application.pwd.profile_picture}`
          : null
      }
    };

    res.json({
      success: true,
      data: applicationWithUrls
    });
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch application details' });
  }
});

// Withdraw application (for PWD)
router.delete('/:applicationId/withdraw', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const { applicationId } = req.params;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const application = await prisma.Applications.findFirst({
      where: {
        application_id: parseInt(applicationId),
        pwd_id: pwd_id
      },
      include: {
        job: {
          include: {
            employer: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status === 'accepted') {
      return res.status(400).json({ success: false, message: 'Cannot withdraw accepted application' });
    }

    // Delete application
    await prisma.Applications.delete({
      where: { application_id: parseInt(applicationId) }
    });

    // Create notification for employer
    await prisma.Notifications.create({
      data: {
        user_id: application.job.employer.user_id,
        type: 'application_withdrawn',
        title: 'Application Withdrawn',
        content: `An application for the position: ${application.job.jobtitle} has been withdrawn`,
        is_read: false
      }
    });

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Error withdrawing application:', error);
    res.status(500).json({ success: false, message: 'Failed to withdraw application' });
  }
});

module.exports = router;
