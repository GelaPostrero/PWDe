const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');

const authenticateToken = require('../Middlewares/auth');

// JOBSEEKER HEADERS
router.get('/header', authenticateToken, async (req, res) => {
    try {
        const pwd_id = req.user?.pwd_id;
        const emp_id = req.user?.emp_id;
        const userId = req.user?.userId;
        const userType = req.user?.userType;

        let user = null;

        if((!pwd_id && !emp_id) || !userId) {
            return res.status(400).json({ error: "No ID found from this token." });
        }

        // If walay userType
        if(!userType) {
            return res.status(400).json({ error: "Invalid user type in token." });
        }

        if(userType === "PWD") {
            // Fetch PWD profile
            user = await prisma.pwd_Profile.findUnique({
                where: { pwd_id: pwd_id },
                select: {
                    profile_picture: true,
                }
            });

            if (!user) {
                return res.status(404).json({ error: "PWD not found." });
            }

            return res.json({
                success: true,
                data: {
                    profile_picture: user.profile_picture
                    ? `http://localhost:4000/uploads/PWDs/${userId}/${user.profile_picture}`
                    : null,
                }
            });
        } else { // Fetch Employer profile
            user = await prisma.employer_Profile.findUnique({
                where: { employer_id: emp_id },
                select: {
                    profile_picture: true
                }
            });

            if (!user) {
                return res.status(404).json({ error: "Employer not found." });
            }

            return res.json({
                success: true,
                data: {
                    profile_picture: user.profile_picture
                    ? `http://localhost:4000/uploads/Employer/${userId}/${user.profile_picture}`
                    : null,
                }
            });
        }

        } catch (error) {
            res.status(500).json({ error: "Failed to fetch user header." });
        }
});

router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const pwd_id = req.user?.pwd_id;
        const emp_id = req.user?.emp_id;
        const userId = req.user?.userId;
        const userType = req.user?.userType;

        let user = null;

        if((!pwd_id && !emp_id) || !userId) {
            return res.status(400).json({ error: "No ID found from this token." });
        }

        // If walay userType
        if(!userType) {
            return res.status(400).json({ error: "Invalid user type in token." });
        }

        if(userType === "PWD") {
            user = await prisma.users.findUnique({
                where: { user_id: userId },
                
            })
        } else { // Fetch Employer profile

        }
        
    } catch(error) {
        res.status(500).json({ error: "Failed to fetch user dashboard." });
    }
})

module.exports = router;