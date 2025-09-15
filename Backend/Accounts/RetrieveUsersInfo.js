const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');

const authenticateToken = require('../Middlewares/auth');

// VERIFY TOKEN
router.get('/verify', authenticateToken, async (req, res) => {
    res.json({
        success: true,
        message: "Token is valid",
        user: req.user
  });
}) 

// HEADERS (KUWANG NOTIFICATIONS)
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
        const userId = req.user?.userId;
        const userType = req.user?.userType;

        let user = null;

        if(!userId) {
            return res.status(400).json({ error: "No ID found from this token." });
        }

        // If walay userType
        if(!userType) {
            return res.status(400).json({ error: "Invalid user type in token." });
        }

        if(userType === "PWD") {
            user = await prisma.users.findUnique({
                where: { user_id: userId },
                include: {
                    pwd_Profile: {
                        select: {
                            first_name: true,
                            last_name: true,
                            professional_role: true,
                            rating: true,
                            interviews: true,
                            profile_views: true,
                            profile_picture: true,
                            basic_information: true,
                            skills: true,
                            education: true,
                            professional_experience: true,
                            set_accessibility_preferences: true,
                            portfolio_items: true,
                            _count: {
                                select: { 
                                    applications: true,
                                    Saved_Jobs: true
                                }
                            }
                        }
                    }
                }
            });

            if (!user) {
                return res.status(404).json({ error: "PWD not found." });
            }

            return res.json({
                success: true,
                data: {
                    profile_picture: user.pwd_Profile?.profile_picture
                    ? `http://localhost:4000/uploads/PWDs/${userId}/${user.pwd_Profile?.profile_picture}`
                    : null,
                    fullname: `${user.pwd_Profile?.first_name} ${user.pwd_Profile?.last_name}`,
                    professional_role: user.pwd_Profile?.professional_role,
                    profile_views: user.pwd_Profile?.profile_views,
                    interviews: user.pwd_Profile?.interviews,
                    saved_jobs: user.pwd_Profile?._count.Saved_Jobs,
                    applications: user.pwd_Profile?._count.applications,
                    rating: user.pwd_Profile?.rating,
                    basic_information: user.pwd_Profile?.basic_information,
                    skills: user.pwd_Profile?.skills,
                    education: user.pwd_Profile?.education,
                    workexperience: user.pwd_Profile?.professional_experience,
                    set_accessibility_preferences: user.pwd_Profile?.set_accessibility_preferences,
                    portfolio_items: user.pwd_Profile?.portfolio_items,
                }
            });
        } else { // Fetch Employer profile
            user = await prisma.users.findUnique({
                where: { user_id: userId },
                include: {
                    employer_Profile: {
                        select: {
                            profile_picture: true,
                            company_name: true,
                            industryPreference: true,
                            rating: true,
                            profile_views: true,
                            interviews: true,
                            set_company_profile: true,
                            set_jobRoles_requirements: true,
                            set_work_environment: true,
                            _count: {
                                select: { 
                                    Applications: true,
                                    Saved_Jobs: true
                                }
                            }
                        }
                    }
                }
            })

            if (!user) {
                return res.status(404).json({ error: "PWD not found." });
            }

            return res.json({
                success: true,
                data: {
                    companylogo: user.employer_Profile?.profile_picture
                    ? `http://localhost:4000/uploads/Employer/${userId}/${user.employer_Profile?.profile_picture}`
                    : null,
                    company_name: user.employer_Profile?.company_name,
                    industryPreference: user.employer_Profile?.industryPreference,
                    rating: user.employer_Profile?.rating,
                    profile_views: user.employer_Profile?.profile_views,
                    applications: user.employer_Profile?._count.Applications,
                    interviews: user.employer_Profile?.interviews,
                    saved_jobs: user.employer_Profile?._count.Saved_Jobs,
                    set_company_profile: user.employer_Profile?.set_company_profile,
                    set_jobRoles_requirements: user.employer_Profile?.set_jobRoles_requirements,
                    set_work_environment: user.employer_Profile?.set_work_environment,
                }
            });
        }
        
    } catch(error) {
        res.status(500).json({ error: "Failed to fetch user dashboard." });
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const { pwd_id, emp_id, userId, userType } = req.user;

        let profile = null;

        if((!pwd_id && !emp_id) || !userId) {
            return res.status(400).json({ error: "No ID found from this token." });
        }

        // If walay userType
        if(!userType) {
            return res.status(400).json({ error: "Invalid user type in token." });
        }

        if(userType === "PWD") {
            profile = await prisma.users.findUnique({
                where: { user_id: userId },
                select: {
                    email: true,
                    phone_number: true,
                    pwd_Profile: {
                        select: {
                            profile_picture: true,
                            first_name: true,
                            last_name: true,
                            professional_role: true,
                            rating: true,
                            date_of_birth: true,
                            address: true,
                            disability_Type: true,
                            portfolio_url: true,
                            github_url: true,
                            otherPlatform: true,
                            professional_summary: true,
                            profession: true,
                            basic_information: true,
                            skills: true,
                            education: true,
                            professional_experience: true,
                            portfolio_items: true,
                            set_accessibility_preferences: true,
                            experiences: true,          // Pwd_Experience[]
                            educations: true,           // Pwd_Education[]
                            accessibility_needs: true,  // Pwd_Accessibility_Needs[]
                            job_preferences: true       // Pwd_Job_Preferences_Requirements[]
                        }
                    }
                }
            });

            if(!profile) {
                return res.status(404).json({ error: "PWD not found." });
            }

            return res.json({
                success: true,
                data: {
                    profile_picture: profile.pwd_Profile?.profile_picture
                    ? `http://localhost:4000/uploads/PWDs/${userId}/${profile.pwd_Profile?.profile_picture}`
                    : null,
                    firstname: profile.pwd_Profile?.first_name,
                    lastname: profile.pwd_Profile?.last_name,
                    professional_role: profile.pwd_Profile?.professional_role,
                    rating: profile.pwd_Profile?.rating,
                    birthdate: profile.pwd_Profile?.date_of_birth,
                    location: profile.pwd_Profile?.address,
                    email: profile.email,
                    phone: profile.phone_number,
                    disability_type: profile.pwd_Profile?.disability_Type,
                    portfolio_url: profile.pwd_Profile?.portfolio_url,
                    github_url: profile.pwd_Profile?.github_url,
                    otherPlatform: profile.pwd_Profile?.otherPlatform,
                    professional_summary: profile.pwd_Profile?.professional_summary,
                    profession: profile.pwd_Profile?.profession,
                    basic_information: profile.pwd_Profile?.basic_information,
                    skills: profile.pwd_Profile?.skills,
                    education: profile.pwd_Profile?.education,
                    workexperience: profile.pwd_Profile?.professional_experience,
                    portfolio_items: profile.pwd_Profile?.portfolio_items,
                    set_accessibility_preferences: profile.pwd_Profile?.set_accessibility_preferences,
                    experiences: profile.pwd_Profile.experiences,
                    educations: profile.pwd_Profile.educations,
                    accessibility_needs: profile.pwd_Profile.accessibility_needs,
                    job_preferences: profile.pwd_Profile.job_preferences
                }
            });
        } else { // Fetch Employer profile
            profile = await prisma.users.findUnique({
                where: { user_id: userId },
                include: {
                    employer_Profile: {
                        include: {
                            
                        }
                    }
                }
            });

            if(!profile) {
                return res.status(404).json({ error: "PWD not found." });
            }

            return res.json({
                success: true,
                data: {

                }
            });
        }
    } catch(error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: 'Internal Server error', error: "Failed to fetch user profile." });
    }
});

router.put('/update/basic-information', authenticateToken, async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            birthDate,
            disabilityType,
            location
        } = req.body;

        const pwd_id = req.user?.pwd_id;
        const user_id = req.user?.userId;

        const updatePersonalInfo = await prisma.users.update({
            where: { user_id },
            data: {
                email,
                phone_number: phone,
                pwd_Profile: {
                    update: {
                        first_name: firstName,
                        last_name: lastName,
                        date_of_birth: birthDate,
                        disability_Type: disabilityType,
                        address: location,
                    }
                }
            },
            include: {
                pwd_Profile: true
            }
        });

        res.json({ 
            message: 'Profile updated successfully', 
            data: updatePersonalInfo 
        });
    } catch(error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ 
            error: 'Failed to update profile',
            message: error
        });
    }
});

module.exports = router;