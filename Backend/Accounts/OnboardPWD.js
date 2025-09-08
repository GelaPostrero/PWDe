const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../src/generated/prisma');
const { withAccelerate } = require('../node_modules/@prisma/extension-accelerate');
const prisma = new PrismaClient().$extends(withAccelerate());
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
    const {
        highestLevel,
        institutionName,
        location,
        fieldOfStudy,
        degree,
        graduationStatus,
        graduationYear,
    } = req.body;

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        const educationData = {
            pwd_id,
            highestLevel,
            institutionName,
            location,
            fieldOfStudy,
            degree,
            graduationStatus,
            graduationYear,
        };

        mergeStepData(pwd_id, 'education', {
            highestLevel,
            institutionName,
            location,
            fieldOfStudy,
            degree,
            graduationStatus,
            graduationYear,
        });
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
    const {
        jobTitle,
        company,
        location,
        country,
        startMonth,
        startYear,
        endMonth,
        endYear,
        isCurrent,
        employmentType,
        description,
    } = req.body;

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        const workExperienceData = {
            jobTitle,
            company,
            location,
            country,
            startMonth,
            startYear,
            endMonth,
            endYear,
            isCurrent,
            employmentType,
            description,
        };

        mergeStepData(pwd_id, 'workExperience', {
            jobTitle,
            company,
            location,
            country,
            startMonth,
            startYear,
            endMonth,
            endYear,
            isCurrent,
            employmentType,
            description,
        });

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
// MIC TEST MIC TEST
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

        if (!tempdata) {
            console.log("No temoporary data found!")
            return res.status(404).json({ error: 'No temporary data found for this PWD.' });
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
                profession: tempdata.assessment.profession,
                skills: tempdata.assessment.skills
            }
        });

        const educationData = await prisma.pwd_Education.create({
            data: {
                pwd_id: pwd_id,
                highest_level: tempdata.education.highestLevel,
                institution: tempdata.education.institutionName,
                location: tempdata.education.location,
                field_of_study: tempdata.education.fieldOfStudy,
                degree: tempdata.education.degree,
                graduation_details: tempdata.education.graduationStatus,
                year_graduated: tempdata.education.graduationYear
            }
        });

        const startDate = `${tempdata.workExperience.startMonth} ${tempdata.workExperience.startYear} `;
        const endDate = `${tempdata.workExperience.endMonth} ${tempdata.workExperience.endYear}`;

        const workExperienceData = await prisma.pwd_Experience.create({
            data: {
                pwd_id: pwd_id,
                company: tempdata.workExperience.company,
                job_title: tempdata.workExperience.jobTitle,
                location: tempdata.workExperience.location,
                country: tempdata.workExperience.country,
                currently_working_on_this_role: tempdata.workExperience.currently_working_inthis_role,
                start_date: startDate,
                end_date: endDate,
                description: tempdata.workExperience.description,
                employment_type: tempdata.workExperience.employmentType
            }
        });

        const accessibilityNeedsData = await prisma.pwd_Accessibility_Needs.create({
            data: {
                pwd_id: pwd_id,
                visual_support: tempdata.accessibilityNeeds.visual_support_needs,
                hearing_support: tempdata.accessibilityNeeds.hearing_support_needs,
                mobility_support: tempdata.accessibilityNeeds.mobility_support_needs,
                cognitive_support: tempdata.accessibilityNeeds.cognitive_support_needs,
                additional_information: tempdata.accessibilityNeeds.additional_information
            }
        });

        const jobPreferencesData = await prisma.pwd_Job_Preferences_Requirements.create({
            data: {
                pwd_id: pwd_id,
                work_arrangement: tempdata.jobPreferences.workArrangement,
                employment_types: tempdata.jobPreferences.employmentTypes,
                experience_level: tempdata.jobPreferences.experienceLevel,
                salary_range: `${tempdata.jobPreferences.salaryRange.currency} ${tempdata.jobPreferences.salaryRange.min} - ${tempdata.jobPreferences.salaryRange.max}`
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