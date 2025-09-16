const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const authenticateToken = require('../Middlewares/auth');

// Get user's transactions
router.get('/my-transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const userType = req.user?.userType;
    const pwd_id = req.user?.pwd_id;
    const emp_id = req.user?.emp_id;
    const { page = 1, limit = 10, status, type } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause based on user type
    const where = {};
    if (userType === 'PWD') {
      where.pwd_id = pwd_id;
    } else if (userType === 'Employer') {
      where.employer_id = emp_id;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Add filters
    if (status) {
      where.status = status;
    }
    if (type) {
      where.transaction_type = type;
    }

    const [transactions, totalCount] = await Promise.all([
      prisma.transactions.findMany({
        where,
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
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.transactions.count({ where })
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
});

// Create a transaction (for job posting fees, premium features, etc.)
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const userType = req.user?.userType;
    const pwd_id = req.user?.pwd_id;
    const emp_id = req.user?.emp_id;
    const {
      amount,
      transactionType,
      paymentMethod,
      applicationId,
      description
    } = req.body;

    // Validate required fields
    if (!amount || !transactionType || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: 'amount, transactionType, and paymentMethod are required' 
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount must be greater than 0' 
      });
    }

    // Generate reference number
    const referenceNumber = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create transaction
    const transaction = await prisma.transactions.create({
      data: {
        employer_id: userType === 'Employer' ? emp_id : null,
        pwd_id: userType === 'PWD' ? pwd_id : null,
        application_id: applicationId ? parseInt(applicationId) : null,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        transaction_type: transactionType,
        status: 'pending',
        reference_number: referenceNumber,
        description: description || '',
        created_at: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ success: false, message: 'Failed to create transaction' });
  }
});

// Update transaction status (for payment processing)
router.put('/:transactionId/status', authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status, paymentReference } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid transaction status' 
      });
    }

    // Get transaction
    const transaction = await prisma.transactions.findUnique({
      where: { transaction_id: parseInt(transactionId) }
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Update transaction
    const updatedTransaction = await prisma.transactions.update({
      where: { transaction_id: parseInt(transactionId) },
      data: {
        status: status,
        payment_reference: paymentReference || transaction.payment_reference,
        processed_at: status === 'completed' ? new Date() : transaction.processed_at,
        updated_at: new Date()
      }
    });

    // If transaction is completed, create notification
    if (status === 'completed') {
      const userId = transaction.employer_id ? 
        (await prisma.employer_Profile.findUnique({
          where: { employer_id: transaction.employer_id },
          select: { user_id: true }
        }))?.user_id :
        (await prisma.pwd_Profile.findUnique({
          where: { pwd_id: transaction.pwd_id },
          select: { user_id: true }
        }))?.user_id;

      if (userId) {
        await prisma.notifications.create({
          data: {
            user_id: userId,
            type: 'transaction_completed',
            title: 'Payment Successful',
            content: `Your payment of $${transaction.amount} has been processed successfully`,
            is_read: false
          }
        });
      }
    }

    res.json({
      success: true,
      message: 'Transaction status updated successfully',
      data: updatedTransaction
    });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).json({ success: false, message: 'Failed to update transaction status' });
  }
});

// Get transaction details
router.get('/:transactionId', authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user?.userId;
    const userType = req.user?.userType;
    const pwd_id = req.user?.pwd_id;
    const emp_id = req.user?.emp_id;

    const transaction = await prisma.transactions.findUnique({
      where: { transaction_id: parseInt(transactionId) },
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
        }
      }
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Check if user has access to this transaction
    const hasAccess = 
      (userType === 'PWD' && transaction.pwd_id === pwd_id) ||
      (userType === 'Employer' && transaction.employer_id === emp_id);

    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transaction details' });
  }
});

// Get transaction statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const userType = req.user?.userType;
    const pwd_id = req.user?.pwd_id;
    const emp_id = req.user?.emp_id;
    const { period = '30' } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Build where clause based on user type
    const where = {
      created_at: { gte: daysAgo }
    };
    
    if (userType === 'PWD') {
      where.pwd_id = pwd_id;
    } else if (userType === 'Employer') {
      where.employer_id = emp_id;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Get transaction statistics
    const [
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      totalAmount,
      completedAmount,
      transactionsByType,
      transactionsByStatus
    ] = await Promise.all([
      prisma.transactions.count({ where }),
      prisma.transactions.count({
        where: { ...where, status: 'completed' }
      }),
      prisma.transactions.count({
        where: { ...where, status: 'pending' }
      }),
      prisma.transactions.aggregate({
        where,
        _sum: { amount: true }
      }),
      prisma.transactions.aggregate({
        where: { ...where, status: 'completed' },
        _sum: { amount: true }
      }),
      prisma.transactions.groupBy({
        by: ['transaction_type'],
        where,
        _sum: { amount: true },
        _count: { transaction_type: true }
      }),
      prisma.transactions.groupBy({
        by: ['status'],
        where,
        _count: { status: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        period: `${period} days`,
        overview: {
          totalTransactions,
          completedTransactions,
          pendingTransactions,
          totalAmount: totalAmount._sum.amount || 0,
          completedAmount: completedAmount._sum.amount || 0
        },
        transactionsByType: transactionsByType.map(type => ({
          type: type.transaction_type,
          count: type._count.transaction_type,
          amount: type._sum.amount || 0
        })),
        transactionsByStatus: transactionsByStatus.map(status => ({
          status: status.status,
          count: status._count.status
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching transaction statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transaction statistics' });
  }
});

// Create withdrawal request (for PWD users)
router.post('/withdrawal-request', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const { amount, paymentMethod, accountDetails } = req.body;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Validate required fields
    if (!amount || !paymentMethod || !accountDetails) {
      return res.status(400).json({ 
        success: false, 
        message: 'amount, paymentMethod, and accountDetails are required' 
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount must be greater than 0' 
      });
    }

    // Check if user has sufficient balance (this would need to be calculated from completed transactions)
    const completedEarnings = await prisma.transactions.aggregate({
      where: {
        pwd_id: pwd_id,
        status: 'completed',
        transaction_type: 'earnings'
      },
      _sum: { amount: true }
    });

    const totalEarnings = completedEarnings._sum.amount || 0;

    // Check existing withdrawal requests
    const pendingWithdrawals = await prisma.withdrawal_requests.aggregate({
      where: {
        pwd_id: pwd_id,
        status: { in: ['pending', 'processing'] }
      },
      _sum: { amount: true }
    });

    const pendingAmount = pendingWithdrawals._sum.amount || 0;
    const availableBalance = totalEarnings - pendingAmount;

    if (amount > availableBalance) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient balance. Available: $${availableBalance}` 
      });
    }

    // Create withdrawal request
    const withdrawalRequest = await prisma.withdrawal_requests.create({
      data: {
        pwd_id: pwd_id,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        account_details: accountDetails,
        status: 'pending',
        requested_at: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: withdrawalRequest
    });
  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    res.status(500).json({ success: false, message: 'Failed to create withdrawal request' });
  }
});

// Get withdrawal requests (for PWD users)
router.get('/withdrawal-requests', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const { page = 1, limit = 10, status } = req.query;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { pwd_id: pwd_id };
    if (status) {
      where.status = status;
    }

    const [withdrawalRequests, totalCount] = await Promise.all([
      prisma.withdrawal_requests.findMany({
        where,
        orderBy: { requested_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.withdrawal_requests.count({ where })
    ]);

    res.json({
      success: true,
      data: withdrawalRequests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch withdrawal requests' });
  }
});

// Get available balance (for PWD users)
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Calculate total earnings
    const totalEarnings = await prisma.transactions.aggregate({
      where: {
        pwd_id: pwd_id,
        status: 'completed',
        transaction_type: 'earnings'
      },
      _sum: { amount: true }
    });

    // Calculate pending withdrawals
    const pendingWithdrawals = await prisma.withdrawal_requests.aggregate({
      where: {
        pwd_id: pwd_id,
        status: { in: ['pending', 'processing'] }
      },
      _sum: { amount: true }
    });

    // Calculate total withdrawals
    const totalWithdrawals = await prisma.withdrawal_requests.aggregate({
      where: {
        pwd_id: pwd_id,
        status: 'completed'
      },
      _sum: { amount: true }
    });

    const availableBalance = (totalEarnings._sum.amount || 0) - (pendingWithdrawals._sum.amount || 0);
    const totalEarned = totalEarnings._sum.amount || 0;
    const totalWithdrawn = totalWithdrawals._sum.amount || 0;

    res.json({
      success: true,
      data: {
        availableBalance,
        totalEarned,
        totalWithdrawn,
        pendingWithdrawals: pendingWithdrawals._sum.amount || 0
      }
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch balance' });
  }
});

module.exports = router;
