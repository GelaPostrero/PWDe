const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const authenticateToken = require('../Middlewares/auth');

// Create a review
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const userType = req.user?.userType;
    const pwd_id = req.user?.pwd_id;
    const emp_id = req.user?.emp_id;
    const {
      applicationId,
      revieweeId,
      revieweeType,
      rating,
      comment,
      isPublic = true
    } = req.body;

    // Validate required fields
    if (!applicationId || !revieweeId || !revieweeType || !rating) {
      return res.status(400).json({ 
        success: false, 
        message: 'applicationId, revieweeId, revieweeType, and rating are required' 
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Validate reviewee type
    if (!['PWD', 'Employer'].includes(revieweeType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'revieweeType must be either PWD or Employer' 
      });
    }

    // Get application details
    const application = await prisma.applications.findUnique({
      where: { application_id: parseInt(applicationId) },
      include: {
        job: true,
        pwd: true
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify user has permission to review
    const canReview = 
      (userType === 'PWD' && application.pwd_id === pwd_id) ||
      (userType === 'Employer' && application.job.employer_id === emp_id);

    if (!canReview) {
      return res.status(403).json({ success: false, message: 'You cannot review this application' });
    }

    // Check if application is in a reviewable state
    if (!['accepted', 'rejected'].includes(application.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Can only review accepted or rejected applications' 
      });
    }

    // Check if user has already reviewed this application
    const existingReview = await prisma.reviews.findFirst({
      where: {
        application_id: parseInt(applicationId),
        reviewer_id: userId
      }
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this application' 
      });
    }

    // Create review
    const review = await prisma.reviews.create({
      data: {
        application_id: parseInt(applicationId),
        reviewer_id: userId,
        reviewee_id: parseInt(revieweeId),
        reviewer_type: userType,
        rating: parseInt(rating),
        comment: comment || '',
        is_public: isPublic,
        created_at: new Date()
      }
    });

    // Update average rating for the reviewee
    await updateAverageRating(revieweeId, revieweeType);

    // Create notification for the reviewee
    const revieweeUserId = revieweeType === 'PWD' ? 
      (await prisma.pwd_Profile.findUnique({
        where: { pwd_id: parseInt(revieweeId) },
        select: { user_id: true }
      }))?.user_id :
      (await prisma.employer_Profile.findUnique({
        where: { employer_id: parseInt(revieweeId) },
        select: { user_id: true }
      }))?.user_id;

    if (revieweeUserId) {
      await prisma.notifications.create({
        data: {
          user_id: revieweeUserId,
          type: 'new_review',
          title: 'New Review Received',
          content: `You have received a ${rating}-star review`,
          is_read: false
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Failed to create review' });
  }
});

// Get reviews for a user (PWD or Employer)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType, page = 1, limit = 10 } = req.query;

    if (!userType || !['PWD', 'Employer'].includes(userType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'userType must be either PWD or Employer' 
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get profile ID based on user type
    let profileId;
    if (userType === 'PWD') {
      const pwdProfile = await prisma.pwd_Profile.findFirst({
        where: { user_id: parseInt(userId) },
        select: { pwd_id: true }
      });
      profileId = pwdProfile?.pwd_id;
    } else {
      const empProfile = await prisma.employer_Profile.findFirst({
        where: { user_id: parseInt(userId) },
        select: { employer_id: true }
      });
      profileId = empProfile?.employer_id;
    }

    if (!profileId) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    const [reviews, totalCount] = await Promise.all([
      prisma.reviews.findMany({
        where: {
          reviewee_id: profileId,
          is_public: true
        },
        include: {
          application: {
            include: {
              job: {
                select: {
                  jobtitle: true,
                  company_name: true
                }
              }
            }
          },
          reviewer: {
            select: {
              user_type: true,
              pwd_Profile: {
                select: {
                  first_name: true,
                  last_name: true,
                  profile_picture: true
                }
              },
              employer_Profile: {
                select: {
                  company_name: true,
                  profile_picture: true
                }
              }
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.reviews.count({
        where: {
          reviewee_id: profileId,
          is_public: true
        }
      })
    ]);

    // Format reviews with reviewer info
    const formattedReviews = reviews.map(review => {
      const reviewer = review.reviewer;
      let reviewerInfo = {};

      if (reviewer.user_type === 'PWD') {
        reviewerInfo = {
          name: `${reviewer.pwd_Profile.first_name} ${reviewer.pwd_Profile.last_name}`,
          type: 'PWD',
          profile_picture: reviewer.pwd_Profile.profile_picture
        };
      } else {
        reviewerInfo = {
          name: reviewer.employer_Profile.company_name,
          type: 'Employer',
          profile_picture: reviewer.employer_Profile.profile_picture
        };
      }

      return {
        review_id: review.review_id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        reviewer: reviewerInfo,
        job_title: review.application.job.jobtitle
      };
    });

    // Get average rating
    const avgRating = await prisma.reviews.aggregate({
      where: {
        reviewee_id: profileId,
        is_public: true
      },
      _avg: { rating: true },
      _count: { rating: true }
    });

    res.json({
      success: true,
      data: {
        reviews: formattedReviews,
        averageRating: avgRating._avg.rating || 0,
        totalReviews: avgRating._count.rating || 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// Get user's own reviews (reviews they've given)
router.get('/my-reviews', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, totalCount] = await Promise.all([
      prisma.reviews.findMany({
        where: { reviewer_id: userId },
        include: {
          application: {
            include: {
              job: {
                select: {
                  jobtitle: true
                }
              },
              pwd: {
                select: {
                  first_name: true,
                  last_name: true,
                  profile_picture: true,
                  user_id: true
                }
              }
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.reviews.count({
        where: { reviewer_id: userId }
      })
    ]);

    const formattedReviews = reviews.map(review => ({
      review_id: review.review_id,
      rating: review.rating,
      comment: review.comment,
      is_public: review.is_public,
      created_at: review.created_at,
      job_title: review.application.job.jobtitle,
      reviewee_name: `${review.application.pwd.first_name} ${review.application.pwd.last_name}`,
      reviewee_photo: review.application.pwd.profile_picture 
        ? `http://localhost:4000/uploads/PWDs/${review.application.pwd.user_id}/${review.application.pwd.profile_picture}`
        : null
    }));

    res.json({
      success: true,
      data: formattedReviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user reviews' });
  }
});

// Update a review
router.put('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.userId;
    const { rating, comment, isPublic } = req.body;

    // Check if review exists and belongs to user
    const existingReview = await prisma.reviews.findFirst({
      where: {
        review_id: parseInt(reviewId),
        reviewer_id: userId
      }
    });

    if (!existingReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Update review
    const updatedReview = await prisma.reviews.update({
      where: { review_id: parseInt(reviewId) },
      data: {
        rating: rating || existingReview.rating,
        comment: comment !== undefined ? comment : existingReview.comment,
        is_public: isPublic !== undefined ? isPublic : existingReview.is_public,
        updated_at: new Date()
      }
    });

    // Update average rating for the reviewee
    await updateAverageRating(existingReview.reviewee_id, existingReview.reviewer_type === 'PWD' ? 'Employer' : 'PWD');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ success: false, message: 'Failed to update review' });
  }
});

// Delete a review
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.userId;

    // Check if review exists and belongs to user
    const existingReview = await prisma.reviews.findFirst({
      where: {
        review_id: parseInt(reviewId),
        reviewer_id: userId
      }
    });

    if (!existingReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Delete review
    await prisma.reviews.delete({
      where: { review_id: parseInt(reviewId) }
    });

    // Update average rating for the reviewee
    await updateAverageRating(existingReview.reviewee_id, existingReview.reviewer_type === 'PWD' ? 'Employer' : 'PWD');

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

// Get rating statistics for a user
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType } = req.query;

    if (!userType || !['PWD', 'Employer'].includes(userType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'userType must be either PWD or Employer' 
      });
    }

    // Get profile ID based on user type
    let profileId;
    if (userType === 'PWD') {
      const pwdProfile = await prisma.pwd_Profile.findFirst({
        where: { user_id: parseInt(userId) },
        select: { pwd_id: true }
      });
      profileId = pwdProfile?.pwd_id;
    } else {
      const empProfile = await prisma.employer_Profile.findFirst({
        where: { user_id: parseInt(userId) },
        select: { employer_id: true }
      });
      profileId = empProfile?.employer_id;
    }

    if (!profileId) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    // Get rating statistics
    const [ratingStats, ratingDistribution] = await Promise.all([
      prisma.reviews.aggregate({
        where: {
          reviewee_id: profileId,
          is_public: true
        },
        _avg: { rating: true },
        _count: { rating: true },
        _min: { rating: true },
        _max: { rating: true }
      }),
      prisma.reviews.groupBy({
        by: ['rating'],
        where: {
          reviewee_id: profileId,
          is_public: true
        },
        _count: { rating: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        averageRating: ratingStats._avg.rating || 0,
        totalReviews: ratingStats._count.rating || 0,
        minRating: ratingStats._min.rating || 0,
        maxRating: ratingStats._max.rating || 0,
        ratingDistribution: ratingDistribution.map(rating => ({
          rating: rating.rating,
          count: rating._count.rating
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching rating statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rating statistics' });
  }
});

// Helper function to update average rating
async function updateAverageRating(profileId, userType) {
  try {
    const avgRating = await prisma.reviews.aggregate({
      where: {
        reviewee_id: profileId,
        is_public: true
      },
      _avg: { rating: true }
    });

    const newRating = Math.round((avgRating._avg.rating || 0) * 10) / 10; // Round to 1 decimal place

    if (userType === 'PWD') {
      await prisma.pwd_Profile.update({
        where: { pwd_id: profileId },
        data: { rating: newRating }
      });
    } else {
      await prisma.employer_Profile.update({
        where: { employer_id: profileId },
        data: { rating: newRating }
      });
    }
  } catch (error) {
    console.error('Error updating average rating:', error);
  }
}

module.exports = router;
