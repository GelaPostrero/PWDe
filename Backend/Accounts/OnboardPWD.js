const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');

const authenticateToken = require('../Middlewares/auth');
const profilePhoto = require('../Middlewares/multerProfilePhoto');

// Professional Skills Assessment ni nga API for PWD
const tempOnboardPWDs = new Map();

function mergeStepData(pwd_id, stepName, stepData) {
  const key = String(pwd_id);
  const existingData = tempOnboardPWDs.get(key) || {};

  tempOnboardPWDs.set(key, {
    ...existingData,
    [stepName]: stepData
  });
}

router.post('/pwd/onboard/assessment', authenticateToken, async (req, res) => {
    console.log("Raw body:", req.body);

    const pwd_id = req.user?.pwd_id;
    const {
        profession,
        selectedSkill
    } = req.body;

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        mergeStepData(pwd_id, 'assessment', {
            profession,
            skills: Array.isArray(selectedSkill) ? selectedSkill : [selectedSkill],
            skills_assessment: true
        });
        console.log('Temporary Onboard PWD Data:', tempOnboardPWDs.get(String(pwd_id)))
        res.status(200).json({
            message: 'PWD onboarding assessment data received successfully.',
            data: tempOnboardPWDs.get(String(pwd_id)),
            success: true
        });
    } catch (error) {
        console.log('Error processing PWD onboarding assessment:', error);
        return res.status(500).json({ error: 'Failed to process PWD onboarding assessment.' });
    }
});
// Education & Qualification ni nga API for PWD
router.post('/pwd/onboard/education', authenticateToken, async (req, res) => {
    const pwd_id = req.user.pwd_id;
    const { educations, highestLevel } = req.body; // expects array

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    if (!Array.isArray(educations)) {
        return res.status(400).json({ error: 'Education must be an array.' });
    }

    if (educations.length >= 5) {
        return res.status(400).json({ error: 'You can only add up to 5 education entries.' });
    }

    try {
        mergeStepData(pwd_id, 'education', { educations, highestLevel, education: true });
        console.log('Temporary Onboard PWD Data:', tempOnboardPWDs.get(String(pwd_id)));
        res.status(200).json({
            message: 'PWD education data received successfully.',
            data: tempOnboardPWDs.get(String(pwd_id)),
            success: true
        });
    } catch (error) {
        console.log('Error processing PWD education data:', error);
        return res.status(500).json({ error: 'Failed to process PWD education data.' });
    }
});
// Work Experience ni nga API for PWD
router.post('/pwd/onboard/work-experience', authenticateToken, async (req, res) => {
    const pwd_id = req.user.pwd_id;
    const {experience} = req.body; //expeccts array

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    if (!Array.isArray(experience)) {
        return res.status(400).json({ error: 'Education must be an array.' });
    }

    if (experience.length >= 5) {
        return res.status(400).json({ error: 'You can only add up to 5 education entries.' });
    }

    try {
        mergeStepData(pwd_id, 'workExperience', experience);
        mergeStepData(pwd_id, 'work_experience', {professional_experience: true});
        console.log('Temporary Onboard PWD Data:', tempOnboardPWDs.get(String(pwd_id)));
        res.status(200).json({
            message: 'PWD work experience data received successfully.',
            data: tempOnboardPWDs.get(pwd_id),
            success: true
        });
    } catch (error) {
        console.log('Error processing PWD work experience data:', error);
        return res.status(500).json({ error: 'Failed to process PWD work experience data.' });
    }
});
// Accessibility Needs ni nga API for PWD
router.post('/pwd/onboard/accessibility-needs', authenticateToken, async (req, res) => {
    const pwd_id = req.user.pwd_id;
    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    const { 
        visualNeeds,
        hearingNeeds,
        mobilityNeeds,
        cognitiveNeeds,
        additionalInfo
    } = req.body;

    try {
        mergeStepData(pwd_id, 'accessibilityNeeds', {
            visual_support_needs: visualNeeds || [],
            hearing_support_needs: hearingNeeds || [],
            mobility_support_needs: mobilityNeeds || [],
            cognitive_support_needs: cognitiveNeeds || [],
            additional_information: additionalInfo || '',
            accessibility_needs: true
        });

        console.log('Temporary Onboard PWD Data:', tempOnboardPWDs.get(String(pwd_id)));
        res.status(200).json({
            message: 'PWD accessibility needs data received successfully.',
            data: tempOnboardPWDs.get(pwd_id),
            success: true
        });
    } catch (error) {
        console.log('Error processing PWD accessibility needs:', error);
        return res.status(500).json({ error: 'Failed to process PWD accessibility needs.' });
    }
});
// Job Preferences ni nga API for PWD
router.post('/pwd/onboard/job-preferences', authenticateToken, async (req, res) => {
    const pwd_id = req.user.pwd_id;
    const {
        workArrangement,
        employmentTypes,
        experienceLevel,
        salaryRange,
    } = req.body;

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        mergeStepData(pwd_id, 'jobPreferences', {
            workArrangement,
            employmentTypes,
            experienceLevel,
            salaryRange,
            job_preferences: true
        });
        console.log('Temporary Onboard PWD Data:', tempOnboardPWDs.get(String(pwd_id)));
        res.status(200).json({
            message: 'PWD job preferences data received successfully.',
            data: tempOnboardPWDs.get(pwd_id),
            success: true
        });
    } catch (error) {
        console.log('Error processing PWD job preferences:', error);
        return res.status(500).json({ error: 'Failed to process PWD job preferences.' });
    }
});
// TEST TEST 
router.get('/pwd/onboard/temp-data/:pwd_id', (req, res) => {
    const { pwd_id } = req.params;

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    const data = tempOnboardPWDs.get(pwd_id);
    if (!data) {
        return res.status(404).json({ error: 'No temporary data found for this PWD.' });
    }

    res.status(200).json({
        message: 'Temporary data retrieved successfully.',
        data
    });
});
// Last onboarding step ni nga API for PWD
router.post('/pwd/complete-profile', authenticateToken, profilePhoto, async (req, res) => {
    const user_id = req.user.userId;
    const userType = req.user.userType;
    const pwd_id = req.user.pwd_id;
    const {
        role,
        summary,
        portfolioUrl,
        githubUrl,
        linkedinUrl,
        otherPlatform,
        visibility
    } = req.body;

    let parsedOtherPlatform;
    try {
        parsedOtherPlatform = JSON.parse(otherPlatform || '[]');
    } catch (error) {
        parsedOtherPlatform = [];
    }

    const profilePhoto = req.files?.profilePhoto?.[0] || null;
    const resume = req.files?.resume?.[0] || null;

    if (!user_id || !pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    const hasPortfolioItems =
        (portfolioUrl && portfolioUrl.trim() !== "") || // non empty string
        (githubUrl && githubUrl.trim() !== "") ||       // non empty string
        (Array.isArray(parsedOtherPlatform) && 
        parsedOtherPlatform.some(platform => {
            // If platform is a string
            if (typeof platform === 'string') {
                return platform.trim() !== "";
            }
            // If platform is an object with url property
            if (typeof platform === 'object' && platform !== null) {
                return platform.url && platform.url.trim() !== "";
            }
            return false;
        }));
    try {
        console.log("PWD ID: ", pwd_id);
        console.log("USER ID: ", user_id);
        const tempdata = tempOnboardPWDs.get(String(pwd_id));
        let { educations, highestLevel } = tempdata?.education || {};
        console.log("Education data from frontend:", { educations, highestLevel });
        
        // Provide default value if highestLevel is undefined
        if (!highestLevel) {
            highestLevel = "Bachelor's";
            console.log("Set default highestLevel to:", highestLevel);
        }
        const workExperiences = tempdata?.workExperience || [];

        if (!tempdata) {
            console.log("No temoporary data found!")
            return res.status(404).json({ error: 'No temporary data found for this PWD.' });
        }

        if (!Array.isArray(educations)) {
            return res.status(400).json({ error: 'Education must be an array.' });
        }

        console.log("Temp Data: ", tempOnboardPWDs.get(String(pwd_id)))

        const profileCompletion = await prisma.pwd_Profile.updateMany({
            where: { pwd_id: pwd_id },
            data: {
                professional_role: role,
                professional_summary: summary,
                portfolio_url: portfolioUrl,
                github_url: githubUrl,
                linkedin_url: linkedinUrl,
                otherPlatform: parsedOtherPlatform,
                profile_visibility: visibility,
                profile_picture: profilePhoto ? profilePhoto.filename : null,
                resume_cv: resume ? resume.filename : null,
                profession: tempdata.assessment?.profession,
                skills: tempdata.assessment?.skills || [],
                basic_information: true, // Profile completion means basic info is complete
                professional_summary_completed: !!(summary && summary.trim() !== ""), // Track if professional summary is provided
                professional_experience: tempdata.work_experience?.professional_experience || false,
                education: tempdata.education?.education || false,
                skills_assessment: tempdata.assessment?.skills_assessment || false,
                set_accessibility_preferences: 
                    (tempdata.accessibilityNeeds?.accessibility_needs || false) 
                    && (tempdata.jobPreferences?.job_preferences || false),
                portfolio_items: hasPortfolioItems
            }
        });

        const educationRecords = (educations || [])
            .map((edu) => {
                const finalHighestLevel = highestLevel || edu?.degree || "Bachelor's";
                const year = edu?.graduationYear;
                console.log("Education record - RAW year:", year, "Type:", typeof year);
                console.log("Education record:", { 
                    pwd_id, 
                    highest_level: finalHighestLevel, 
                    institution: edu?.institutionName,
                    degree: edu?.degree,
                    year_graduated: year
                });
                
                const finalYear = year && year.toString().trim() !== '' ? year.toString() : null;
                console.log("Education record - FINAL year:", finalYear, "Type:", typeof finalYear);
                
                return {
                    pwd_id,
                    highest_level: finalHighestLevel,
                    institution: edu?.institutionName || '',
                    location: edu?.location || '',
                    field_of_study: edu?.fieldOfStudy || '',
                    degree: edu?.degree || '',
                    graduation_details: edu?.graduationStatus || '',
                    year_graduated: finalYear
                };
            })
            .filter(r => r.institution || r.degree || r.field_of_study);

        // Only create education records if we have valid data
        if (educationRecords.length > 0) {
            const educationData = await prisma.pwd_Education.createMany({
                data: educationRecords
            });
            console.log("Education records created successfully:", educationData);
        } else {
            console.log("Skipping education records creation - no valid data");
        }

        const startDate = `${tempdata.workExperience?.startMonth} ${tempdata.workExperience?.startYear} `;
        const endDate = `${tempdata.workExperience?.endMonth} ${tempdata.workExperience?.endYear}`;

        const workExperienceRecords = workExperiences
            .map((exp) => ({
                pwd_id,
                company: exp?.company || '',
                job_title: exp?.jobTitle || '',
                location: exp?.location || '',
                country: exp?.country || '',
                currently_working_on_this_role: !!exp?.isCurrent,
                start_date: exp?.startDate || '',
                end_date: exp?.endDate || '',
                description: exp?.description || '',
                employment_type: exp?.employmentType || ''
            }))
            .filter(r => r.company || r.job_title);

        if (workExperienceRecords.length > 0) {
            const workExperienceData = await prisma.pwd_Experience.createMany({
                data: workExperienceRecords
            });
            console.log("Work experience records created successfully:", workExperienceData);
        } else {
            console.log("Skipping work experience records creation - no valid data");
        }

        const accessibilityNeedsData = await prisma.pwd_Accessibility_Needs.create({
            data: {
                pwd_id: pwd_id,
                visual_support: tempdata.accessibilityNeeds?.visual_support_needs || [],
                hearing_support: tempdata.accessibilityNeeds?.hearing_support_needs || [],
                mobility_support: tempdata.accessibilityNeeds?.mobility_support_needs || [],
                cognitive_support: tempdata.accessibilityNeeds?.cognitive_support_needs || [],
                additional_information: tempdata.accessibilityNeeds?.additional_information || ''
            }
        });

        const jobPreferencesData = await prisma.pwd_Job_Preferences_Requirements.create({
            data: {
                pwd_id: pwd_id,
                work_arrangement: tempdata.jobPreferences?.workArrangement || '',
                employment_types: tempdata.jobPreferences?.employmentTypes || [],
                experience_level: tempdata.jobPreferences?.experienceLevel || '',
                salary_range: `${tempdata.jobPreferences?.salaryRange.currency || ''} ${tempdata.jobPreferences?.salaryRange.min || ''} - ${tempdata.jobPreferences?.salaryRange.max || ''}`
            }
        });


        res.status(200).json({
            message: 'Complete profile assembled successfully',
            success: true
        });
    } catch (error) {
        console.log('Error completing PWD profile:', error);
        console.log('Error details:', error.message);
        console.log('Error code:', error.code);
        return res.status(500).json({ 
            error: 'Failed to complete PWD profile.',
            details: error.message 
        });
    }
});

module.exports = router;