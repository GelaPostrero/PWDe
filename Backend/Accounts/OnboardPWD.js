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
            skills: Array.isArray(selectedSkill) ? selectedSkill : [selectedSkill]
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
        mergeStepData(pwd_id, 'education', { educations, highestLevel });

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
            additional_information: additionalInfo || ''
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

    try {
        console.log("PWD ID: ", pwd_id);
        console.log("USER ID: ", user_id);
        const tempdata = tempOnboardPWDs.get(String(pwd_id));
        let { educations, highestLevel } = tempdata?.education || {};
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
                otherPlatform: parsedOtherPlatform,
                profile_visibility: visibility,
                profile_picture: profilePhoto ? profilePhoto.filename : null,
                resume_cv: resume ? resume.filename : null,
                profession: tempdata.assessment?.profession,
                skills: tempdata.assessment?.skills || []
            }
        });

        const educationRecords = educations.map((edu) => ({
            pwd_id,
            highest_level: highestLevel,
            institution: edu?.institutionName,
            location: edu?.location,
            field_of_study: edu?.fieldOfStudy,
            degree: edu?.degree,
            graduation_details: edu?.graduationStatus,
            year_graduated: edu?.graduationYear
        }));

        const educationData = await prisma.pwd_Education.createMany({
            data: educationRecords
        });

        const startDate = `${tempdata.workExperience?.startMonth} ${tempdata.workExperience?.startYear} `;
        const endDate = `${tempdata.workExperience?.endMonth} ${tempdata.workExperience?.endYear}`;

        const workExperienceRecords = workExperiences.map((exp) => ({
            pwd_id,
            company: exp?.company || '',
            job_title: exp?.jobTitle || '',
            location: exp?.location || '',
            country: exp?.country || '',
            currently_working_on_this_role: exp?.isCurrent || false,
            start_date: exp?.startDate ? new Date(exp.startDate).toISOString() : null,
            end_date: exp?.endDate ? new Date(exp.endDate).toISOString() : null,
            description: exp?.description || '',
            employment_type: exp?.employmentType || ''
        }));

        const workExperienceData = await prisma.pwd_Experience.createMany({
            data: workExperienceRecords
        });

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
        return res.status(500).json({ error: 'Failed to complete PWD profile.' });
    }
});

module.exports = router;