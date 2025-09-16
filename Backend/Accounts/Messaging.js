const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const authenticateToken = require('../Middlewares/auth');

// Get user's chat threads
router.get('/threads', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const userType = req.user?.userType;
    const pwd_id = req.user?.pwd_id;
    const emp_id = req.user?.emp_id;

    let threads;

    if (userType === 'PWD') {
      threads = await prisma.chat_threads.findMany({
        where: { pwd_id: pwd_id },
        include: {
          application: {
            include: {
              job: {
                select: {
                  jobtitle: true,
                  job_id: true
                }
              }
            }
          },
          employer: {
            select: {
              company_name: true,
              profile_picture: true,
              user_id: true
            }
          },
          messages: {
            orderBy: { sent_at: 'desc' },
            take: 1
          }
        },
        orderBy: { created_at: 'desc' }
      });
    } else if (userType === 'Employer') {
      threads = await prisma.chat_threads.findMany({
        where: { employer_id: emp_id },
        include: {
          application: {
            include: {
              job: {
                select: {
                  jobtitle: true,
                  job_id: true
                }
              }
            }
          },
          pwd: {
            select: {
              first_name: true,
              last_name: true,
              profile_picture: true,
              user_id: true
            }
          },
          messages: {
            orderBy: { sent_at: 'desc' },
            take: 1
          }
        },
        orderBy: { created_at: 'desc' }
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Add profile picture URLs and format data
    const threadsWithUrls = threads.map(thread => {
      const lastMessage = thread.messages[0] || null;
      
      if (userType === 'PWD') {
        return {
          thread_id: thread.thread_id,
          application_id: thread.application_id,
          job_title: thread.application.job.jobtitle,
          job_id: thread.application.job.job_id,
          company_name: thread.employer.company_name,
          company_logo: thread.employer.profile_picture 
            ? `http://localhost:4000/uploads/Employer/${thread.employer.user_id}/${thread.employer.profile_picture}`
            : null,
          last_message: lastMessage,
          is_active: thread.is_active,
          created_at: thread.created_at
        };
      } else {
        return {
          thread_id: thread.thread_id,
          application_id: thread.application_id,
          job_title: thread.application.job.jobtitle,
          job_id: thread.application.job.job_id,
          candidate_name: `${thread.pwd.first_name} ${thread.pwd.last_name}`,
          candidate_photo: thread.pwd.profile_picture 
            ? `http://localhost:4000/uploads/PWDs/${thread.pwd.user_id}/${thread.pwd.profile_picture}`
            : null,
          last_message: lastMessage,
          is_active: thread.is_active,
          created_at: thread.created_at
        };
      }
    });

    res.json({
      success: true,
      data: threadsWithUrls
    });
  } catch (error) {
    console.error('Error fetching chat threads:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chat threads' });
  }
});

// Get messages for a specific thread
router.get('/threads/:threadId/messages', authenticateToken, async (req, res) => {
  try {
    const { threadId } = req.params;
    const userId = req.user?.userId;
    const userType = req.user?.userType;
    const pwd_id = req.user?.pwd_id;
    const emp_id = req.user?.emp_id;
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Verify user has access to this thread
    const thread = await prisma.chat_threads.findFirst({
      where: {
        thread_id: parseInt(threadId),
        OR: [
          { pwd_id: pwd_id },
          { employer_id: emp_id }
        ]
      }
    });

    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found or access denied' });
    }

    // Get messages
    const [messages, totalCount] = await Promise.all([
      prisma.chat_messages.findMany({
        where: { thread_id: parseInt(threadId) },
        include: {
          sender: {
            select: {
              user_id: true,
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
        orderBy: { sent_at: 'asc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.chat_messages.count({
        where: { thread_id: parseInt(threadId) }
      })
    ]);

    // Format messages with sender info
    const formattedMessages = messages.map(message => {
      const sender = message.sender;
      let senderInfo = {};

      if (sender.user_type === 'PWD') {
        senderInfo = {
          name: `${sender.pwd_Profile.first_name} ${sender.pwd_Profile.last_name}`,
          type: 'PWD',
          profile_picture: sender.pwd_Profile.profile_picture 
            ? `http://localhost:4000/uploads/PWDs/${sender.user_id}/${sender.pwd_Profile.profile_picture}`
            : null
        };
      } else {
        senderInfo = {
          name: sender.employer_Profile.company_name,
          type: 'Employer',
          profile_picture: sender.employer_Profile.profile_picture 
            ? `http://localhost:4000/uploads/Employer/${sender.user_id}/${sender.employer_Profile.profile_picture}`
            : null
        };
      }

      return {
        message_id: message.message_id,
        message: message.message,
        sent_at: message.sent_at,
        is_read: message.is_read,
        sender: senderInfo
      };
    });

    res.json({
      success: true,
      data: formattedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/threads/:threadId/messages', authenticateToken, async (req, res) => {
  try {
    const { threadId } = req.params;
    const { message } = req.body;
    const userId = req.user?.userId;
    const userType = req.user?.userType;
    const pwd_id = req.user?.pwd_id;
    const emp_id = req.user?.emp_id;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    // Verify user has access to this thread
    const thread = await prisma.chat_threads.findFirst({
      where: {
        thread_id: parseInt(threadId),
        OR: [
          { pwd_id: pwd_id },
          { employer_id: emp_id }
        ]
      }
    });

    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found or access denied' });
    }

    // Create message
    const newMessage = await prisma.chat_messages.create({
      data: {
        thread_id: parseInt(threadId),
        sender_id: userId,
        message: message.trim(),
        sent_at: new Date(),
        is_read: false
      },
      include: {
        sender: {
          select: {
            user_id: true,
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
      }
    });

    // Format sender info
    const sender = newMessage.sender;
    let senderInfo = {};

    if (sender.user_type === 'PWD') {
      senderInfo = {
        name: `${sender.pwd_Profile.first_name} ${sender.pwd_Profile.last_name}`,
        type: 'PWD',
        profile_picture: sender.pwd_Profile.profile_picture 
          ? `http://localhost:4000/uploads/PWDs/${sender.user_id}/${sender.pwd_Profile.profile_picture}`
          : null
      };
    } else {
      senderInfo = {
        name: sender.employer_Profile.company_name,
        type: 'Employer',
        profile_picture: sender.employer_Profile.profile_picture 
          ? `http://localhost:4000/uploads/Employer/${sender.user_id}/${sender.employer_Profile.profile_picture}`
          : null
      };
    }

    const formattedMessage = {
      message_id: newMessage.message_id,
      message: newMessage.message,
      sent_at: newMessage.sent_at,
      is_read: newMessage.is_read,
      sender: senderInfo
    };

    // Create notification for the other party
    const otherUserId = userType === 'PWD' ? 
      (await prisma.employer_Profile.findUnique({
        where: { employer_id: thread.employer_id },
        select: { user_id: true }
      }))?.user_id :
      (await prisma.pwd_Profile.findUnique({
        where: { pwd_id: thread.pwd_id },
        select: { user_id: true }
      }))?.user_id;

    if (otherUserId) {
      await prisma.notifications.create({
        data: {
          user_id: otherUserId,
          type: 'new_message',
          title: 'New Message',
          content: `You have received a new message in your conversation`,
          is_read: false
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: formattedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// Mark messages as read
router.put('/threads/:threadId/mark-read', authenticateToken, async (req, res) => {
  try {
    const { threadId } = req.params;
    const userId = req.user?.userId;
    const pwd_id = req.user?.pwd_id;
    const emp_id = req.user?.emp_id;

    // Verify user has access to this thread
    const thread = await prisma.chat_threads.findFirst({
      where: {
        thread_id: parseInt(threadId),
        OR: [
          { pwd_id: pwd_id },
          { employer_id: emp_id }
        ]
      }
    });

    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found or access denied' });
    }

    // Mark all messages in this thread as read (except user's own messages)
    await prisma.chat_messages.updateMany({
      where: {
        thread_id: parseInt(threadId),
        sender_id: { not: userId },
        is_read: false
      },
      data: {
        is_read: true
      }
    });

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark messages as read' });
  }
});

// Get unread message count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const pwd_id = req.user?.pwd_id;
    const emp_id = req.user?.emp_id;

    // Get threads where user is involved
    const threads = await prisma.chat_threads.findMany({
      where: {
        OR: [
          { pwd_id: pwd_id },
          { employer_id: emp_id }
        ]
      },
      select: { thread_id: true }
    });

    const threadIds = threads.map(thread => thread.thread_id);

    // Count unread messages (excluding user's own messages)
    const unreadCount = await prisma.chat_messages.count({
      where: {
        thread_id: { in: threadIds },
        sender_id: { not: userId },
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

// Create a new chat thread (usually done when application is submitted)
router.post('/threads', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.body;
    const pwd_id = req.user?.pwd_id;
    const emp_id = req.user?.emp_id;
    const userType = req.user?.userType;

    // Get application details
    const application = await prisma.applications.findUnique({
      where: { application_id: parseInt(applicationId) },
      include: {
        job: true
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify user has access to this application
    const hasAccess = 
      (userType === 'PWD' && application.pwd_id === pwd_id) ||
      (userType === 'Employer' && application.job.employer_id === emp_id);

    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check if thread already exists
    const existingThread = await prisma.chat_threads.findFirst({
      where: { application_id: parseInt(applicationId) }
    });

    if (existingThread) {
      return res.status(400).json({ success: false, message: 'Thread already exists for this application' });
    }

    // Create new thread
    const thread = await prisma.chat_threads.create({
      data: {
        application_id: parseInt(applicationId),
        pwd_id: application.pwd_id,
        employer_id: application.job.employer_id,
        is_active: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Chat thread created successfully',
      data: thread
    });
  } catch (error) {
    console.error('Error creating chat thread:', error);
    res.status(500).json({ success: false, message: 'Failed to create chat thread' });
  }
});

module.exports = router;
