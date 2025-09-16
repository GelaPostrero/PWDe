const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const authenticateToken = require('../Middlewares/auth');

// Get user's notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = { user_id: userId };
    if (unreadOnly === 'true') {
      where.is_read = false;
    }

    const [notifications, totalCount] = await Promise.all([
      prisma.notifications.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.notifications.count({ where })
    ]);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// Get unread notifications count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;

    const unreadCount = await prisma.notifications.count({
      where: {
        user_id: userId,
        is_read: false
      }
    });

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unread count' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.userId;

    const notification = await prisma.notifications.findFirst({
      where: {
        notification_id: parseInt(notificationId),
        user_id: userId
      }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const updatedNotification = await prisma.notifications.update({
      where: { notification_id: parseInt(notificationId) },
      data: {
        is_read: true,
        read_at: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: updatedNotification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;

    const result = await prisma.notifications.updateMany({
      where: {
        user_id: userId,
        is_read: false
      },
      data: {
        is_read: true,
        read_at: new Date()
      }
    });

    res.json({
      success: true,
      message: `${result.count} notifications marked as read`,
      data: { updatedCount: result.count }
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.userId;

    const notification = await prisma.notifications.findFirst({
      where: {
        notification_id: parseInt(notificationId),
        user_id: userId
      }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await prisma.notifications.delete({
      where: { notification_id: parseInt(notificationId) }
    });

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
});

// Delete all notifications
router.delete('/delete-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;

    const result = await prisma.notifications.deleteMany({
      where: { user_id: userId }
    });

    res.json({
      success: true,
      message: `${result.count} notifications deleted`,
      data: { deletedCount: result.count }
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to delete all notifications' });
  }
});

// Get notification preferences (if implemented)
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;

    // For now, return default preferences
    // In the future, this could be stored in a user_preferences table
    const preferences = {
      email_notifications: true,
      push_notifications: true,
      application_updates: true,
      job_recommendations: true,
      message_notifications: true,
      system_notifications: true
    };

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notification preferences' });
  }
});

// Update notification preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const {
      email_notifications,
      push_notifications,
      application_updates,
      job_recommendations,
      message_notifications,
      system_notifications
    } = req.body;

    // For now, just return success
    // In the future, this could update a user_preferences table
    const preferences = {
      email_notifications: email_notifications !== undefined ? email_notifications : true,
      push_notifications: push_notifications !== undefined ? push_notifications : true,
      application_updates: application_updates !== undefined ? application_updates : true,
      job_recommendations: job_recommendations !== undefined ? job_recommendations : true,
      message_notifications: message_notifications !== undefined ? message_notifications : true,
      system_notifications: system_notifications !== undefined ? system_notifications : true
    };

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: preferences
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ success: false, message: 'Failed to update notification preferences' });
  }
});

// Create notification (admin/system use)
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const {
      user_id,
      type,
      title,
      content,
      is_read = false
    } = req.body;

    // Validate required fields
    if (!user_id || !type || !title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'user_id, type, title, and content are required' 
      });
    }

    const notification = await prisma.notifications.create({
      data: {
        user_id: parseInt(user_id),
        type,
        title,
        content,
        is_read,
        created_at: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, message: 'Failed to create notification' });
  }
});

// Get notification types
router.get('/types', async (req, res) => {
  try {
    const types = [
      {
        type: 'new_application',
        name: 'New Application',
        description: 'When someone applies to your job posting'
      },
      {
        type: 'application_status_update',
        name: 'Application Status Update',
        description: 'When your application status changes'
      },
      {
        type: 'new_message',
        name: 'New Message',
        description: 'When you receive a new message'
      },
      {
        type: 'job_recommendation',
        name: 'Job Recommendation',
        description: 'New job recommendations based on your profile'
      },
      {
        type: 'application_withdrawn',
        name: 'Application Withdrawn',
        description: 'When an application is withdrawn'
      },
      {
        type: 'system',
        name: 'System Notification',
        description: 'General system notifications'
      }
    ];

    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error('Error fetching notification types:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notification types' });
  }
});

module.exports = router;
