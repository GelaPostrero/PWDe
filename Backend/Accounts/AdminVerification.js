const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');

// Update document verification status (Admin only)
router.put('/admin/verify-documents/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, rejectionReason } = req.body; // status: 'pending', 'verified', 'rejected'

        if (!['pending', 'verified', 'rejected'].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid status. Must be: pending, verified, or rejected' 
            });
        }

        // Update document verification status
        const updatedUser = await prisma.users.update({
            where: { user_id: parseInt(userId) },
            data: {
                document_verification_status: status,
                document_rejection_reason: status === 'rejected' ? rejectionReason : null,
                // Only set is_verified to true if documents are verified
                is_verified: status === 'verified'
            }
        });

        res.json({
            success: true,
            message: `Document verification status updated to: ${status}`,
            data: {
                user_id: updatedUser.user_id,
                document_verification_status: updatedUser.document_verification_status,
                is_verified: updatedUser.is_verified,
                rejection_reason: updatedUser.document_rejection_reason
            }
        });

    } catch (error) {
        console.error('Error updating document verification:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update document verification status',
            message: error.message 
        });
    }
});

// Get users pending document verification (Admin only)
router.get('/admin/pending-verifications', async (req, res) => {
    try {
        const pendingUsers = await prisma.users.findMany({
            where: {
                document_verification_status: 'pending'
            },
            select: {
                user_id: true,
                email: true,
                user_type: true,
                created_at: true,
                document_verification_status: true,
                verification_documents: true,
                pwd_Profile: {
                    select: {
                        first_name: true,
                        last_name: true,
                        company_name: true
                    }
                },
                employer_Profile: {
                    select: {
                        company_name: true,
                        contact_person_fullname: true
                    }
                }
            }
        });

        res.json({
            success: true,
            data: pendingUsers,
            count: pendingUsers.length
        });

    } catch (error) {
        console.error('Error fetching pending verifications:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch pending verifications',
            message: error.message 
        });
    }
});

module.exports = router;
