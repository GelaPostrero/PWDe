const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const path = require('path');
const fs = require('fs');

const authenticateToken = require('../Middlewares/auth');
const memoryUploadForPWD = require('../Middlewares/multerPwd');

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
                select: {
                    is_verified: true,         // Email verification status from users table
                    document_verification_status: true,
                    document_rejection_reason: true,
                    verification_documents: true,
                    pwd_Profile: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                            professional_role: true,
                            rating: true,
                            interviews: true,
                            profile_views: true,
                            profile_picture: true,
                            basic_information: true,
                            professional_summary_completed: true,
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
                    fullname: `${user.pwd_Profile?.first_name || ''} ${user.pwd_Profile?.middle_name || ''} ${user.pwd_Profile?.last_name || ''}`.trim().replace(/\s+/g, ' '),
                    firstname: user.pwd_Profile?.first_name,
                    middlename: user.pwd_Profile?.middle_name,
                    lastname: user.pwd_Profile?.last_name,
                    professional_role: user.pwd_Profile?.professional_role,
                    profile_views: user.pwd_Profile?.profile_views,
                    interviews: user.pwd_Profile?.interviews,
                    saved_jobs: user.pwd_Profile?._count.Saved_Jobs,
                    applications: user.pwd_Profile?._count.applications,
                    rating: user.pwd_Profile?.rating,
                    basic_information: user.pwd_Profile?.basic_information,
                    professional_summary_completed: user.pwd_Profile?.professional_summary_completed,
                    skills: user.pwd_Profile?.skills,
                    education: user.pwd_Profile?.education,
                    workexperience: user.pwd_Profile?.professional_experience,
                    set_accessibility_preferences: user.pwd_Profile?.set_accessibility_preferences,
                    portfolio_items: user.pwd_Profile?.portfolio_items,
                    is_verified: user.is_verified,         // Email verification status
                    document_verification_status: user.document_verification_status || 'not_submitted',
                    document_rejection_reason: user.document_rejection_reason || null,
                    verification_documents: user.verification_documents || []
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
            console.log('Profile API - Fetching profile for user:', { userId, pwd_id, userType });
            
            profile = await prisma.users.findUnique({
                where: { user_id: userId },
                select: {
                    user_id: true,
                    email: true,
                    phone_number: true,
                    is_verified: true,         // Email verification status from users table
                    document_verification_status: true,
                    document_rejection_reason: true,
                    verification_documents: true,
                    pwd_Profile: {
                        include: {
                            experiences: true,          // Pwd_Experience[]
                            educations: true,           // Pwd_Education[]
                            accessibility_needs: true,  // Pwd_Accessibility_Needs[]
                            job_preferences: true       // Pwd_Job_Preferences_Requirements[]
                        }
                    }
                }
            });

            console.log('Profile API - Database query result:', profile);

            if(!profile) {
                return res.status(404).json({ error: "PWD not found." });
            }

            // Debug: Log profession data before sending response
            console.log('Profile API - profession field:', profile.pwd_Profile?.profession);
            console.log('Profile API - Complete pwd_Profile object:', profile.pwd_Profile);
            
            return res.json({
                success: true,
                data: {
                    user_id: profile.user_id,
                    profile_picture: profile.pwd_Profile?.profile_picture
                    ? `http://localhost:4000/uploads/PWDs/${userId}/${profile.pwd_Profile?.profile_picture}`
                    : null,
                    fullname: `${profile.pwd_Profile?.first_name || ''} ${profile.pwd_Profile?.middle_name || ''} ${profile.pwd_Profile?.last_name || ''}`.trim().replace(/\s+/g, ' '),
                    firstname: profile.pwd_Profile?.first_name,
                    middlename: profile.pwd_Profile?.middle_name,
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
                    linkedin_url: profile.pwd_Profile?.linkedin_url,
                    otherPlatform: profile.pwd_Profile?.otherPlatform,
                    professional_summary: profile.pwd_Profile?.professional_summary,
                    profession: profile.pwd_Profile?.profession,
                    basic_information: profile.pwd_Profile?.basic_information,
                    professional_summary_completed: profile.pwd_Profile?.professional_summary_completed || false,
                    skills: profile.pwd_Profile?.skills,
                    skills_assessment: profile.pwd_Profile?.skills_assessment || false,
                    education: profile.pwd_Profile?.education,
                    workexperience: profile.pwd_Profile?.professional_experience,
                    portfolio_items: profile.pwd_Profile?.portfolio_items,
                    set_accessibility_preferences: profile.pwd_Profile?.set_accessibility_preferences,
                    experiences: profile.pwd_Profile.experiences,
                    educations: profile.pwd_Profile.educations,
                    accessibility_needs: profile.pwd_Profile.accessibility_needs,
                    is_verified: profile.is_verified,
                    document_verification_status: profile.document_verification_status || 'not_submitted',
                    document_rejection_reason: profile.document_rejection_reason || null,
                    verification_documents: profile.verification_documents || [],
                    job_preferences: profile.pwd_Profile.job_preferences?.map(pref => ({
                        ...pref,
                        salary_range: pref.salary_range ? (() => {
                            try {
                                return JSON.parse(pref.salary_range);
                            } catch (e) {
                                console.error('Error parsing salary_range:', pref.salary_range, e);
                                return pref.salary_range; // Return original value if parsing fails
                            }
                        })() : null
                    })),
                    // Profile visibility settings
                    make_profile_searchable: profile.pwd_Profile?.make_profile_searchable || false,
                    display_personal_information: profile.pwd_Profile?.display_personal_information || false,
                    display_portfolio_links: profile.pwd_Profile?.display_portfolio_links || false,
                    show_professional_summary: profile.pwd_Profile?.show_professional_summary || false,
                    show_skills_and_expertise: profile.pwd_Profile?.show_skills_and_expertise || false,
                    show_education: profile.pwd_Profile?.show_education || false,
                    show_experience: profile.pwd_Profile?.show_experience || false,
                    display_accommodation_needs: profile.pwd_Profile?.display_accommodation_needs || false,
                    display_employment_preferences: profile.pwd_Profile?.display_employment_preferences || false
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
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).json({ success: false, message: 'Internal Server error', error: "Failed to fetch user profile.", details: error.message });
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
            success: true,
            message: 'Profile updated successfully', 
            data: updatePersonalInfo 
        });
    } catch(error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update profile',
            message: error
        });
    }
});

// Update professional summary
router.put('/update/professional-summary', authenticateToken, async (req, res) => {
    try {
        const { professionalSummary, jobTitle } = req.body;
        const pwd_id = req.user?.pwd_id;

        const updateData = {
            professional_summary: professionalSummary,
            professional_summary_completed: !!(professionalSummary && professionalSummary.trim() !== "")
        };

        // Update professional role if provided
        if (jobTitle) {
            updateData.professional_role = jobTitle;
        }

        const updated = await prisma.pwd_Profile.update({
            where: { pwd_id },
            data: updateData
        });

        res.json({ 
            success: true,
            message: 'Professional summary updated successfully', 
            data: updated 
        });
    } catch(error) {
        console.error('Error updating professional summary:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update professional summary',
            message: error
        });
    }
});

// Update skills
router.put('/update/skills', authenticateToken, async (req, res) => {
    try {
        const { skills, profession } = req.body;
        const pwd_id = req.user?.pwd_id;

        console.log('Skills update API - Received data:', { skills, profession, pwd_id });

        const updated = await prisma.pwd_Profile.update({
            where: { pwd_id },
            data: {
                skills: skills || [],
                profession: profession || ''
            }
        });

        console.log('Skills update API - Updated profile:', updated);

        res.json({ 
            success: true,
            message: 'Skills updated successfully', 
            data: updated 
        });
    } catch(error) {
        console.error('Error updating skills:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update skills',
            message: error
        });
    }
});

// Update portfolio links
router.put('/update/portfolio-links', authenticateToken, async (req, res) => {
    try {
        const { portfolioUrl, githubUrl, linkedinUrl, otherPlatform } = req.body;
        const pwd_id = req.user?.pwd_id;

        let parsedOtherPlatform;
        try {
            parsedOtherPlatform = JSON.parse(otherPlatform || '[]');
        } catch (error) {
            parsedOtherPlatform = [];
        }

        const hasPortfolioItems = 
            (portfolioUrl && portfolioUrl.trim() !== "") ||
            (githubUrl && githubUrl.trim() !== "") ||
            (linkedinUrl && linkedinUrl.trim() !== "") ||
            (Array.isArray(parsedOtherPlatform) && parsedOtherPlatform.some(platform => {
                if (typeof platform === 'string') {
                    return platform.trim() !== "";
                }
                if (typeof platform === 'object' && platform !== null) {
                    return platform.url && platform.url.trim() !== "";
                }
                return false;
            }));

        const updated = await prisma.pwd_Profile.update({
            where: { pwd_id },
            data: {
                portfolio_url: portfolioUrl,
                github_url: githubUrl,
                linkedin_url: linkedinUrl,
                otherPlatform: parsedOtherPlatform,
                portfolio_items: hasPortfolioItems
            }
        });

        res.json({ 
            success: true,
            message: 'Portfolio links updated successfully', 
            data: updated 
        });
    } catch(error) {
        console.error('Error updating portfolio links:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update portfolio links',
            message: error
        });
    }
});

// Update education
router.put('/update/education', authenticateToken, async (req, res) => {
    try {
        const { education } = req.body;
        const pwd_id = req.user?.pwd_id;

        console.log('Education update API - Received data:', { education, pwd_id });
        console.log('Education update API - Education type:', typeof education, Array.isArray(education));

        // Delete existing education records
        await prisma.pwd_Education.deleteMany({
            where: { pwd_id }
        });

        // Create new education records
        if (education && education.length > 0) {
            console.log('Education update API - Mapping education data:', education);
            const educationData = education.map(edu => {
                console.log('Education update API - Processing education entry:', edu);
                console.log('Education update API - Entry fields:', {
                    highestLevel: edu.highestLevel,
                    institution: edu.institution,
                    location: edu.location,
                    degree: edu.degree,
                    fieldOfStudy: edu.fieldOfStudy,
                    graduationDetails: edu.graduationDetails,
                    yearGraduated: edu.yearGraduated
                });
                const mappedData = {
                    pwd_id,
                    highest_level: edu.highestLevel || '',
                    institution: edu.institution || '',
                    location: edu.location || '',
                    degree: edu.degree || '',
                    field_of_study: edu.fieldOfStudy || '',
                    graduation_details: edu.graduationDetails || '',
                    year_graduated: edu.yearGraduated || ''
                };
                console.log('Education update API - Mapped data for database:', mappedData);
                return mappedData;
            });
            console.log('Education update API - Final education data:', educationData);
            await prisma.pwd_Education.createMany({
                data: educationData
            });
        }

        const updated = await prisma.pwd_Profile.update({
            where: { pwd_id },
            data: {
                education: education && education.length > 0
            }
        });

        res.json({ 
            success: true,
            message: 'Education updated successfully', 
            data: updated 
        });
    } catch(error) {
        console.error('Error updating education:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update education',
            message: error.message,
            details: error.stack
        });
    }
});

// Update work experience
router.put('/update/work-experience', authenticateToken, async (req, res) => {
    try {
        const { workExperience } = req.body;
        const pwd_id = req.user?.pwd_id;

        // Delete existing work experience records
        await prisma.pwd_Experience.deleteMany({
            where: { pwd_id }
        });

        // Create new work experience records
        if (workExperience && workExperience.length > 0) {
            await prisma.pwd_Experience.createMany({
                data: workExperience.map(exp => ({
                    pwd_id,
                    company: exp.company,
                    job_title: exp.jobTitle,
                    location: exp.location,
                    country: exp.country,
                    currently_working_on_this_role: exp.currentlyWorking || false,
                    start_date: exp.startDate,
                    end_date: exp.endDate,
                    employment_type: exp.employmentType,
                    description: exp.description
                }))
            });
        }

        const updated = await prisma.pwd_Profile.update({
            where: { pwd_id },
            data: {
                professional_experience: workExperience && workExperience.length > 0
            }
        });

        res.json({ 
            success: true,
            message: 'Work experience updated successfully', 
            data: updated 
        });
    } catch(error) {
        console.error('Error updating work experience:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update work experience',
            message: error
        });
    }
});

// Update accessibility needs
router.put('/update/accessibility-needs', authenticateToken, async (req, res) => {
    try {
        const { visual_support, hearing_support, mobility_support, cognitive_support, additionalInfo } = req.body;
        const pwd_id = req.user?.pwd_id;

        console.log('Accessibility needs update API - Received data:', { 
            visual_support, 
            hearing_support, 
            mobility_support, 
            cognitive_support, 
            additionalInfo, 
            pwd_id 
        });

        // Delete existing accessibility needs records
        await prisma.pwd_Accessibility_Needs.deleteMany({
            where: { pwd_id }
        });

        // Create new accessibility needs record
        const accessibilityData = {
            pwd_id,
            visual_support: visual_support || [],
            hearing_support: hearing_support || [],
            mobility_support: mobility_support || [],
            cognitive_support: cognitive_support || [],
            additional_information: additionalInfo || ''
        };

        console.log('Accessibility needs update API - Creating accessibility data:', accessibilityData);

        await prisma.pwd_Accessibility_Needs.create({
            data: accessibilityData
        });

        const updated = await prisma.pwd_Profile.update({
            where: { pwd_id },
            data: {
                set_accessibility_preferences: true
            }
        });

        console.log('Accessibility needs update API - Updated profile:', updated);

        res.json({ 
            success: true,
            message: 'Accessibility needs updated successfully', 
            data: updated 
        });
    } catch(error) {
        console.error('Error updating accessibility needs:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update accessibility needs',
            message: error.message,
            details: error.stack
        });
    }
});

// Update employment preferences
router.put('/update/employment-preferences', authenticateToken, async (req, res) => {
    try {
        const { workArrangement, employmentTypes, experienceLevel, salaryRange } = req.body;
        const pwd_id = req.user?.pwd_id;

        console.log('Employment preferences update API - Received data:', { 
            workArrangement, 
            employmentTypes, 
            experienceLevel, 
            salaryRange, 
            pwd_id 
        });

        // Delete existing job preferences records
        await prisma.pwd_Job_Preferences_Requirements.deleteMany({
            where: { pwd_id }
        });

        // Create new job preferences record
        const preferencesData = {
            pwd_id,
            employment_types: employmentTypes || [],
            experience_level: experienceLevel || '',
            salary_range: JSON.stringify(salaryRange || {}),
            work_arrangement: workArrangement || ''
        };

        console.log('Employment preferences update API - Creating preferences data:', preferencesData);

        await prisma.pwd_Job_Preferences_Requirements.create({
            data: preferencesData
        });

        const updated = await prisma.pwd_Profile.update({
            where: { pwd_id },
            data: {
                set_accessibility_preferences: true
            }
        });

        console.log('Employment preferences update API - Updated profile:', updated);

        res.json({ 
            success: true,
            message: 'Employment preferences updated successfully', 
            data: updated 
        });
    } catch(error) {
        console.error('Error updating employment preferences:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update employment preferences',
            message: error.message,
            details: error.stack
        });
    }
});

// Update verification documents
router.put('/update/verification-documents', authenticateToken, memoryUploadForPWD, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 10 * 1024 * 1024) { // 10MB limit
      return res.status(400).json({ success: false, message: 'Total file size must not exceed 10MB' });
    }

    // Get user info for folder path
    const user = await prisma.Users.findUnique({
      where: { user_id: req.user.userId },
      select: { user_id: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create user's document folder if it doesn't exist
    const userFolder = path.join('./Documents/PWDs', String(user.user_id));
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    // Save new files and get their names
    const documentFiles = [];
    req.files.forEach(file => {
      const filePath = path.join(userFolder, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      documentFiles.push(file.originalname);
    });

    // Update both pwd_document field and verification status
    const updated = await prisma.pwd_Profile.update({
      where: { pwd_id },
      data: {
        pwd_document: {
          set: documentFiles
        }
      }
    });

    // Update the user's document verification status to 'pending'
    await prisma.users.update({
      where: { user_id: req.user.userId },
      data: {
        document_verification_status: 'pending',
        verification_documents: documentFiles
      }
    });

    console.log('Verification documents updated for user:', pwd_id);
    console.log('Documents saved:', documentFiles);

    res.json({ 
      success: true,
      message: 'Verification documents updated successfully', 
      data: {
        documents: documentFiles,
        documentCount: documentFiles.length
      }
    });
  } catch(error) {
    console.error('Error updating verification documents:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update verification documents',
      message: error.message
    });
  }
});

// Update profile visibility settings
router.put('/update/profile-visibility', authenticateToken, async (req, res) => {
  try {
    const {
      make_profile_searchable,
      display_personal_information,
      display_portfolio_links,
      show_professional_summary,
      show_skills_and_expertise,
      show_education,
      show_experience,
      display_accommodation_needs,
      display_employment_preferences
    } = req.body;

    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const updated = await prisma.pwd_Profile.update({
      where: { pwd_id },
      data: {
        make_profile_searchable: make_profile_searchable || false,
        display_personal_information: display_personal_information || false,
        display_portfolio_links: display_portfolio_links || false,
        show_professional_summary: show_professional_summary || false,
        show_skills_and_expertise: show_skills_and_expertise || false,
        show_education: show_education || false,
        show_experience: show_experience || false,
        display_accommodation_needs: display_accommodation_needs || false,
        display_employment_preferences: display_employment_preferences || false
      }
    });

    res.json({ 
      success: true,
      message: 'Profile visibility settings updated successfully', 
      data: updated 
    });
  } catch(error) {
    console.error('Error updating profile visibility:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update profile visibility settings',
      message: error.message
    });
  }
});

// Get public profile by user ID (for preview and public viewing)
router.get('/public/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const publicProfile = await prisma.users.findUnique({
      where: { user_id: parseInt(userId) },
      select: {
        user_id: true,
        email: true,
        phone_number: true,
        pwd_Profile: {
          select: {
            first_name: true,
            last_name: true,
            middle_name: true,
            profile_picture: true,
            professional_role: true,
            professional_summary: true,
            skills: true,
            portfolio_url: true,
            github_url: true,
            linkedin_url: true,
            otherPlatform: true,
            address: true,
            date_of_birth: true,
            disability_Type: true,
            // Profile visibility settings
            make_profile_searchable: true,
            display_personal_information: true,
            display_portfolio_links: true,
            show_professional_summary: true,
            show_skills_and_expertise: true,
            show_education: true,
            show_experience: true,
            display_accommodation_needs: true,
            display_employment_preferences: true,
            rating: true,
            experiences: {
              select: {
                company: true,
                job_title: true,
                start_date: true,
                end_date: true,
                description: true,
                location: true,
                country: true,
                employment_type: true
              }
            },
            educations: {
              select: {
                institution: true,
                degree: true,
                field_of_study: true,
                year_graduated: true,
                graduation_details: true
              }
            },
            accessibility_needs: {
              select: {
                visual_support: true,
                hearing_support: true,
                mobility_support: true,
                cognitive_support: true,
                additional_information: true
              }
            },
            job_preferences: {
              select: {
                employment_types: true,
                experience_level: true,
                salary_range: true,
                work_arrangement: true
              }
            }
          }
        }
      }
    });

    if (!publicProfile || !publicProfile.pwd_Profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Check if profile is searchable
    if (!publicProfile.pwd_Profile.make_profile_searchable) {
      return res.status(403).json({ success: false, message: 'Profile is not searchable' });
    }

    // Filter data based on visibility settings
    const filteredProfile = {
      user_id: publicProfile.user_id,
      name: `${publicProfile.pwd_Profile.first_name} ${publicProfile.pwd_Profile.middle_name} ${publicProfile.pwd_Profile.last_name}`.trim(),
      profile_picture: publicProfile.pwd_Profile.profile_picture 
        ? `http://localhost:4000/uploads/PWDs/${userId}/${publicProfile.pwd_Profile.profile_picture}`
        : null,
      professional_role: publicProfile.pwd_Profile.professional_role,
      rating: publicProfile.pwd_Profile.rating,
      
      // Only include data if user has allowed it
      personal_information: publicProfile.pwd_Profile.display_personal_information ? {
        email: publicProfile.email,
        phone: publicProfile.phone_number,
        location: publicProfile.pwd_Profile.address,
        birthdate: publicProfile.pwd_Profile.date_of_birth,
        disability_type: publicProfile.pwd_Profile.disability_Type
      } : null,
      
      professional_summary: publicProfile.pwd_Profile.show_professional_summary 
        ? publicProfile.pwd_Profile.professional_summary 
        : null,
      
      skills_and_expertise: publicProfile.pwd_Profile.show_skills_and_expertise 
        ? publicProfile.pwd_Profile.skills 
        : null,
      
      portfolio_links: publicProfile.pwd_Profile.display_portfolio_links ? {
        portfolio: publicProfile.pwd_Profile.portfolio_url,
        github: publicProfile.pwd_Profile.github_url,
        linkedin: publicProfile.pwd_Profile.linkedin_url,
        other: publicProfile.pwd_Profile.otherPlatform
      } : null,
      
      education: publicProfile.pwd_Profile.show_education 
        ? publicProfile.pwd_Profile.educations 
        : null,
      
      experience: publicProfile.pwd_Profile.show_experience 
        ? publicProfile.pwd_Profile.experiences 
        : null,
      
      accommodation_needs: publicProfile.pwd_Profile.display_accommodation_needs 
        ? publicProfile.pwd_Profile.accessibility_needs 
        : null,
      
      employment_preferences: publicProfile.pwd_Profile.display_employment_preferences 
        ? publicProfile.pwd_Profile.job_preferences 
        : null
    };

    res.json({
      success: true,
      data: filteredProfile
    });
  } catch(error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch public profile',
      message: error.message
    });
  }
});

// PUT endpoint to update profile visibility settings
router.put('/update/profile-visibility', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const visibilitySettings = req.body;

    console.log('Updating profile visibility for user:', userId);
    console.log('Visibility settings:', visibilitySettings);

    // Update the profile visibility settings in the database
    const updatedProfile = await prisma.pwd_Profile.update({
      where: { pwd_id: userId },
      data: {
        make_profile_searchable: visibilitySettings.make_profile_searchable || false,
        display_personal_information: visibilitySettings.display_personal_information || false,
        display_portfolio_links: visibilitySettings.display_portfolio_links || false,
        show_professional_summary: visibilitySettings.show_professional_summary || false,
        show_skills_and_expertise: visibilitySettings.show_skills_and_expertise || false,
        show_education: visibilitySettings.show_education || false,
        show_experience: visibilitySettings.show_experience || false,
        display_accommodation_needs: visibilitySettings.display_accommodation_needs || false,
        display_employment_preferences: visibilitySettings.display_employment_preferences || false
      }
    });

    res.json({
      success: true,
      message: 'Profile visibility settings updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile visibility:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile visibility settings',
      message: error.message
    });
  }
});

module.exports = router;