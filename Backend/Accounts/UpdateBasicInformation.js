const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');

const authenticateToken = require('../Middlewares/auth');

router.put('/basic-information', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user?.userId;  
        const emp_id = req.user?.emp_id;
        const pwd_id = req.user?.pwd_id;
        const user_type = req.user?.user_type;

        const {
            firstname,
            companyname,
            middlename,
            lastname,
            email,
            phone_number,
            birthdate,
            disability_type,
            location,
        } = req.body;

        if (!user_id) {
        return res.status(400).json({ success: false, message: 'User ID missing.' });
        }

        // Update Users table commonfield
        const updatedUser = await prisma.users.update({
        where: { user_id: user_id },
        data: {
            email,
            phone_number
        },
        select: {
            user_id: true,
            email: true,
            phone_number: true,
        }
        });

        let updatedProfile;

        if (user_type === "PWD" && pwd_id) {
        updatedProfile = await prisma.pwd_Profile.update({
            where: { pwd_id },
            data: {
            first_name: firstname,
            middle_name: middlename,
            last_name: lastname,
            date_of_birth: birthdate,
            disability_Type: disability_type,
            address: location,
            },
        });
        } else if (user_type === "EMPLOYER" && emp_id) {
        updatedProfile = await prisma.employer_Profile.update({
            where: { employer_id: emp_id },
            data: {
            company_name: companyname, 
            address: location,
            // Add other employer fields if needed
            },
        });
        } else {
        return res.status(400).json({ success: false, message: 'Invalid user type or profile ID missing.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Basic information updated successfully.',
            user: updatedUser,
            profile: updatedProfile,
        });
    } catch (error) {
        console.error('Error updating basic information:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
})

router.put('/professional-experience', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user?.userId;   
        const emp_id = req.user?.emp_id;
        const pwd_id = req.user?.pwd_id;
        const user_type = req.user?.user_type; 

        const {
            jobtitle,
            professionalSummary,
            hourlyRate
        } = req.body;

        if (!user_id) {
        return res.status(400).json({ success: false, message: 'User ID missing.' });
        }

        const updatedProfile = await prisma.pwd_Profile.update({
            where: { pwd_id },
            data: {
                professional_role: jobtitle,
                professional_summary: professionalSummary,
                hourly_rate: hourlyRate
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Professional experience updated successfully.',
            profile: updatedProfile,
        });
    } catch (error) {
        console.error('Error updating basic information:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
})

router.put('/skills-expertise', authenticateToken, async (req, res) => {
    try {
        const pwd_id = req.user?.pwd_id;

        const {
            skills // expects array
        } = req.body;

        if (!pwd_id) {
        return res.status(400).json({ success: false, message: 'User ID missing.' });
        }

        const updateSkills = await prisma.pwd_Profile.update({
            where: { pwd_id },
            data: {
                skills: Array.isArray(skills) ? skills : [skills]
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Skills updated successfully.',
            updatedSkills: updateSkills,
        });
    } catch (error) {
        console.error('Error updating basic information:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
})

module.exports = router;