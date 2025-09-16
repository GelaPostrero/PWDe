const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const authenticateToken = require('../Middlewares/auth');

// Get employer dashboard analytics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const emp_id = req.user?.emp_id;
    const userType = req.user?.userType;

    if (userType !== 'Employer' || !emp_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Get basic counts
    const [
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      acceptedApplications,
      totalMessages,
      unreadMessages
    ] = await Promise.all([
      // Total jobs posted
      prisma.Job_Listings.count({
        where: { employer_id: emp_id }
      }),
      // Active jobs (not expired)
      prisma.Job_Listings.count({
        where: {
          employer_id: emp_id,
          application_deadline: { gte: new Date().toISOString() }
        }
      }),
      // Total applications received
      prisma.Applications.count({
        where: {
          job: { employer_id: emp_id }
        }
      }),
      // Pending applications
      prisma.Applications.count({
        where: {
          job: { employer_id: emp_id },
          status: 'pending'
        }
      }),
      // Shortlisted applications
      prisma.Applications.count({
        where: {
          job: { employer_id: emp_id },
          status: 'shortlisted'
        }
      }),
      // Accepted applications
      prisma.Applications.count({
        where: {
          job: { employer_id: emp_id },
          status: 'accepted'
        }
      }),
      // Total messages
      prisma.chat_messages.count({
        where: {
          chat_threads: {
            employer_id: emp_id
          }
        }
      }),
      // Unread messages
      prisma.chat_messages.count({
        where: {
          chat_threads: {
            employer_id: emp_id
          },
          sender_id: { not: req.user.userId },
          is_read: false
        }
      })
    ]);

    // Get recent applications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentApplications = await prisma.Applications.count({
      where: {
        job: { employer_id: emp_id },
        submitted_at: { gte: sevenDaysAgo }
      }
    });

    // Get top performing jobs (by application count)
    const topJobs = await prisma.Job_Listings.findMany({
      where: { employer_id: emp_id },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: {
        applications: { _count: 'desc' }
      },
      take: 5
    });

    // Get application status distribution
    const applicationStatuses = await prisma.Applications.groupBy({
      by: ['status'],
      where: {
        job: { employer_id: emp_id }
      },
      _count: {
        status: true
      }
    });

    // Get monthly application trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyApplications = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', submitted_at) as month,
        COUNT(*) as count
      FROM applications a
      JOIN "Job_Listings" j ON a.job_id = j.job_id
      WHERE j.employer_id = ${emp_id}
        AND a.submitted_at >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', submitted_at)
      ORDER BY month ASC
    `;

    res.json({
      success: true,
      data: {
        overview: {
          totalJobs,
          activeJobs,
          totalApplications,
          pendingApplications,
          shortlistedApplications,
          acceptedApplications,
          totalMessages,
          unreadMessages,
          recentApplications
        },
        topJobs: topJobs.map(job => ({
          job_id: job.job_id,
          jobtitle: job.jobtitle,
          applications_count: job._count.applications,
          created_at: job.created_at
        })),
        applicationStatusDistribution: applicationStatuses.map(status => ({
          status: status.status,
          count: status._count.status
        })),
        monthlyTrends: monthlyApplications
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard analytics' });
  }
});

// Get job performance analytics
router.get('/jobs/:jobId/performance', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const emp_id = req.user?.emp_id;
    const userType = req.user?.userType;

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

    // Get job statistics
    const [
      totalApplications,
      applicationStatuses,
      applicationsByDay,
      topCandidates
    ] = await Promise.all([
      // Total applications
      prisma.Applications.count({
        where: { job_id: parseInt(jobId) }
      }),
      // Application status distribution
      prisma.Applications.groupBy({
        by: ['status'],
        where: { job_id: parseInt(jobId) },
        _count: { status: true }
      }),
      // Applications by day (last 30 days)
      prisma.$queryRaw`
        SELECT 
          DATE(submitted_at) as date,
          COUNT(*) as count
        FROM applications
        WHERE job_id = ${parseInt(jobId)}
          AND submitted_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(submitted_at)
        ORDER BY date ASC
      `,
      // Top candidates (by rating)
      prisma.Applications.findMany({
        where: { job_id: parseInt(jobId) },
        include: {
          pwd: {
            select: {
              first_name: true,
              last_name: true,
              rating: true,
              profile_picture: true,
              user_id: true
            }
          }
        },
        orderBy: {
          pwd: { rating: 'desc' }
        },
        take: 10
      })
    ]);

    res.json({
      success: true,
      data: {
        job: {
          job_id: job.job_id,
          jobtitle: job.jobtitle,
          created_at: job.created_at,
          application_deadline: job.application_deadline
        },
        statistics: {
          totalApplications,
          applicationStatusDistribution: applicationStatuses.map(status => ({
            status: status.status,
            count: status._count.status
          }))
        },
        dailyApplications: applicationsByDay,
        topCandidates: topCandidates.map(app => ({
          application_id: app.application_id,
          candidate_name: `${app.pwd.first_name} ${app.pwd.last_name}`,
          rating: app.pwd.rating,
          status: app.status,
          submitted_at: app.submitted_at,
          profile_picture: app.pwd.profile_picture 
            ? `http://localhost:4000/uploads/PWDs/${app.pwd.user_id}/${app.pwd.profile_picture}`
            : null
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching job performance analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job performance analytics' });
  }
});

// Get application analytics
router.get('/applications', authenticateToken, async (req, res) => {
  try {
    const emp_id = req.user?.emp_id;
    const userType = req.user?.userType;
    const { period = '30', status } = req.query;

    if (userType !== 'Employer' || !emp_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    const where = {
      job: { employer_id: emp_id },
      submitted_at: { gte: daysAgo }
    };

    if (status) {
      where.status = status;
    }

    // Get application statistics
    const [
      totalApplications,
      applicationsByStatus,
      applicationsByJob,
      applicationsByDay,
      averageResponseTime
    ] = await Promise.all([
      // Total applications
      prisma.Applications.count({ where }),
      // Applications by status
      prisma.Applications.groupBy({
        by: ['status'],
        where,
        _count: { status: true }
      }),
      // Applications by job
      prisma.Applications.groupBy({
        by: ['job_id'],
        where,
        _count: { job_id: true },
        _avg: {
          submitted_at: true
        }
      }),
      // Applications by day
      prisma.$queryRaw`
        SELECT 
          DATE(submitted_at) as date,
          COUNT(*) as count
        FROM applications a
        JOIN "Job_Listings" j ON a.job_id = j.job_id
        WHERE j.employer_id = ${emp_id}
          AND a.submitted_at >= ${daysAgo}
        GROUP BY DATE(a.submitted_at)
        ORDER BY date ASC
      `,
      // Average response time (time from application to status change)
      prisma.$queryRaw`
        SELECT 
          AVG(EXTRACT(EPOCH FROM (status_changed_at - submitted_at))/3600) as avg_hours
        FROM applications a
        JOIN "Job_Listings" j ON a.job_id = j.job_id
        WHERE j.employer_id = ${emp_id}
          AND a.status_changed_at IS NOT NULL
          AND a.submitted_at >= ${daysAgo}
      `
    ]);

    // Get job titles for applications by job
    const jobTitles = await prisma.Job_Listings.findMany({
      where: {
        job_id: { in: applicationsByJob.map(item => item.job_id) },
        employer_id: emp_id
      },
      select: {
        job_id: true,
        jobtitle: true
      }
    });

    const applicationsByJobWithTitles = applicationsByJob.map(item => {
      const job = jobTitles.find(j => j.job_id === item.job_id);
      return {
        job_id: item.job_id,
        job_title: job?.jobtitle || 'Unknown Job',
        count: item._count.job_id
      };
    });

    res.json({
      success: true,
      data: {
        period: `${period} days`,
        statistics: {
          totalApplications,
          averageResponseTimeHours: averageResponseTime[0]?.avg_hours || 0
        },
        applicationsByStatus: applicationsByStatus.map(status => ({
          status: status.status,
          count: status._count.status
        })),
        applicationsByJob: applicationsByJobWithTitles,
        dailyApplications: applicationsByDay
      }
    });
  } catch (error) {
    console.error('Error fetching application analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch application analytics' });
  }
});

// Get candidate analytics
router.get('/candidates', authenticateToken, async (req, res) => {
  try {
    const emp_id = req.user?.emp_id;
    const userType = req.user?.userType;

    if (userType !== 'Employer' || !emp_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Get unique candidates who applied to employer's jobs
    const candidates = await prisma.Applications.findMany({
      where: {
        job: { employer_id: emp_id }
      },
      include: {
        pwd: {
          select: {
            pwd_id: true,
            first_name: true,
            last_name: true,
            professional_role: true,
            rating: true,
            profile_picture: true,
            user_id: true,
            created_at: true
          }
        }
      },
      distinct: ['pwd_id']
    });

    // Get candidate statistics
    const candidateStats = await Promise.all(
      candidates.map(async (candidate) => {
        const [applicationCount, acceptedCount] = await Promise.all([
          prisma.Applications.count({
            where: {
              pwd_id: candidate.pwd_id,
              job: { employer_id: emp_id }
            }
          }),
          prisma.Applications.count({
            where: {
              pwd_id: candidate.pwd_id,
              job: { employer_id: emp_id },
              status: 'accepted'
            }
          })
        ]);

        return {
          pwd_id: candidate.pwd_id,
          name: `${candidate.pwd.first_name} ${candidate.pwd.last_name}`,
          professional_role: candidate.pwd.professional_role,
          rating: candidate.pwd.rating,
          profile_picture: candidate.pwd.profile_picture 
            ? `http://localhost:4000/uploads/PWDs/${candidate.pwd.user_id}/${candidate.pwd.profile_picture}`
            : null,
          application_count: applicationCount,
          accepted_count: acceptedCount,
          success_rate: applicationCount > 0 ? (acceptedCount / applicationCount) * 100 : 0,
          joined_date: candidate.pwd.created_at
        };
      })
    );

    // Sort by success rate and rating
    candidateStats.sort((a, b) => {
      if (b.success_rate !== a.success_rate) {
        return b.success_rate - a.success_rate;
      }
      return (b.rating || 0) - (a.rating || 0);
    });

    res.json({
      success: true,
      data: {
        totalCandidates: candidateStats.length,
        candidates: candidateStats.slice(0, 20) // Top 20 candidates
      }
    });
  } catch (error) {
    console.error('Error fetching candidate analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch candidate analytics' });
  }
});

// Get revenue analytics (if transactions are implemented)
router.get('/revenue', authenticateToken, async (req, res) => {
  try {
    const emp_id = req.user?.emp_id;
    const userType = req.user?.userType;
    const { period = '30' } = req.query;

    if (userType !== 'Employer' || !emp_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Get transaction statistics
    const [
      totalTransactions,
      totalRevenue,
      transactionsByType,
      monthlyRevenue
    ] = await Promise.all([
      prisma.transactions.count({
        where: {
          employer_id: emp_id,
          created_at: { gte: daysAgo }
        }
      }),
      prisma.transactions.aggregate({
        where: {
          employer_id: emp_id,
          created_at: { gte: daysAgo },
          status: 'completed'
        },
        _sum: { amount: true }
      }),
      prisma.transactions.groupBy({
        by: ['transaction_type'],
        where: {
          employer_id: emp_id,
          created_at: { gte: daysAgo }
        },
        _sum: { amount: true },
        _count: { transaction_type: true }
      }),
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          SUM(amount) as revenue,
          COUNT(*) as transaction_count
        FROM transactions
        WHERE employer_id = ${emp_id}
          AND status = 'completed'
          AND created_at >= ${daysAgo}
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month ASC
      `
    ]);

    res.json({
      success: true,
      data: {
        period: `${period} days`,
        overview: {
          totalTransactions,
          totalRevenue: totalRevenue._sum.amount || 0
        },
        transactionsByType: transactionsByType.map(type => ({
          type: type.transaction_type,
          count: type._count.transaction_type,
          revenue: type._sum.amount || 0
        })),
        monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch revenue analytics' });
  }
});

module.exports = router;
