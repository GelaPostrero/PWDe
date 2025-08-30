const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../src/generated/prisma');
const { withAccelerate } = require('../node_modules/@prisma/extension-accelerate');
const prisma = new PrismaClient().$extends(withAccelerate());
const authenticateToken = require('../Middlewares/auth');

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.body.user_id

    if (!userId) {
      return cb(new Error('user_id is required in form-data'), false);
    }

    // Base folder
    const baseDir = path.join(__dirname, '../Documents');

    // User-specific folder
    const userDir = path.join(baseDir, userId.toString());

    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    const userId = req.body.user_id;

    let filename;
    if (file.fieldname === 'profile_picture') {
      filename = `ProfilePicture-ID${userId}${path.extname(file.originalname)}`;
    } else if (file.fieldname === 'resume_cv_file') {
      filename = `Resume-ID${userId}${path.extname(file.originalname)}`;
    } else {
      // fallback just in case
      filename = `${file.fieldname}-ID${userId}${path.extname(file.originalname)}`;
    }

    cb(null, filename);
  }
});

const fileFilter = require('../Middlewares/fileFilterProfilePic');

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

const completeProfile = multer({ storage, fileFilter }).fields([
    { name: 'profile_picture', maxCount: 1 },
    { name: 'resume_cv_file', maxCount: 1 }
]);

router.post('/pwd/onboard/assessment', authenticateToken, async (req, res) => {
    console.log("Raw body:", req.body);

    const pwd_id = req.user?.pwd_id;
    const {
        profession,
        skills
    } = req.body;

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        mergeStepData(pwd_id, 'assessment', {
            profession,
            skills: skills.split(',').map(skill => skill.trim())
        });
        console.log('Temporary Onboard PWD Data:', tempOnboardPWDs.get(String(pwd_id)))
        res.status(200).json({
            message: 'PWD onboarding assessment data received successfully.',
            data: tempOnboardPWDs.get(String(pwd_id))
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
        highest_level,
        institution_name,
        location,
        field_of_study,
        degree_certificate_type,
        graduation_details,
        graduation_year
    } = req.body;

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        const educationData = {
            pwd_id,
            highest_level,
            institution_name,
            location,
            field_of_study,
            degree_certificate_type,
            graduation_details,
            graduation_year
        };

        mergeStepData(pwd_id, 'education', {
            highest_level,
            institution_name,
            location,
            field_of_study,
            degree_certificate_type,
            graduation_details,
            graduation_year
        });
        console.log('Temporary Onboard PWD Data:', tempOnboardPWDs.get(String(pwd_id)));
        res.status(200).json({
            message: 'PWD education data received successfully.',
            data: tempOnboardPWDs.get(String(pwd_id))
        });
    } catch (error) {
        console.log('Error processing PWD education data:', error);
        return res.status(500).json({ error: 'Failed to process PWD education data.' });
    }
});
// Work Experience ni nga API for PWD
router.post('/pwd/onboard/work-experience', async (req, res) => {
    const {
        pwd_id,
        company_name,
        job_title,
        location,
        country,
        currently_working_inthis_role,
        start_date,
        end_date,
        description,
        employment_type
    } = req.body;

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        const workExperienceData = {
            pwd_id,
            company_name,
            job_title,
            location,
            country,
            currently_working_inthis_role,
            start_date,
            end_date,
            description,
            employment_type
        };

        mergeStepData(pwd_id, 'workExperience', {
            company_name,
            job_title,
            location,
            country,
            currently_working_inthis_role,
            start_date,
            end_date,
            description,
            employment_type
        });

        res.status(200).json({
            message: 'PWD work experience data received successfully.',
            data: tempOnboardPWDs.get(pwd_id)
        });
    } catch (error) {
        console.log('Error processing PWD work experience data:', error);
        return res.status(500).json({ error: 'Failed to process PWD work experience data.' });
    }
});
// Accessibility Needs ni nga API for PWD
router.post('/pwd/onboard/accessibility-needs', async (req, res) => {
    const { 
        pwd_id,
        visual_support_needs,
        hearing_support_needs,
        mobility_support_needs,
        cognitive_support_needs,
        additional_information
    } = req.body;

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        const accessibilityNeedsData = {
            pwd_id,
            visual_support_needs,
            hearing_support_needs,
            mobility_support_needs,
            cognitive_support_needs,
            additional_information
        };

        mergeStepData(pwd_id, 'accessibilityNeeds', {
            visual_support_needs,
            hearing_support_needs,
            mobility_support_needs,
            cognitive_support_needs,
            additional_information
        });

        res.status(200).json({
            message: 'PWD accessibility needs data received successfully.'
        });
    } catch (error) {
        console.log('Error processing PWD accessibility needs:', error);
        return res.status(500).json({ error: 'Failed to process PWD accessibility needs.' });
    }
});
// Job Preferences ni nga API for PWD
router.post('/pwd/onboard/job-preferences', async (req, res) => {
    const { 
        pwd_id,
        work_arrangement,
        employment_type,
        experience_level,
        salary_range
    } = req.body;

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        const jobPreferencesData = {
            pwd_id,
            work_arrangement,
            employment_type,
            experience_level,
            salary_range
        };

        mergeStepData(pwd_id, 'jobPreferences', {
            work_arrangement,
            employment_type,
            experience_level,
            salary_range
        });
        res.status(200).json({
            message: 'PWD job preferences data received successfully.'
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
router.post('/pwd/onboard/complete-profile', completeProfile, async (req, res) => {
    const {
        pwd_id,
        professional_role,
        professional_summary,
        portfolio_links,
        profile_visibility
    } = req.body;

    const profile_picture = req.files?.profile_picture?.[0] || null;
    const resume_cv_file = req.files?.resume_cv_file?.[0] || null;

    if (!pwd_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        const data = {
            professional_role,
            professional_summary,
            portfolio_links: portfolio_links ? portfolio_links.split(',').map(l => l.trim()) : [],
            profile_visibility,
            profile_picture: profile_picture ? profile_picture.filename : null,
            resume_cv: resume_cv_file ? resume_cv_file.filename : null,
        };

        const tempdata = tempOnboardPWDs.get(pwd_id);

        if (!tempdata) {
            return res.status(404).json({ error: 'No temporary data found for this PWD.' });
        }

        const completeProfile = await prisma.pwd_Profile.update({
            where: { pwd_id: parseInt(pwd_id, 10) },
            data: data
        });

        const assessmentData = await prisma.pwd_Profile.update({
            where: { pwd_id: parseInt(pwd_id, 10) },
            data: {
                pwd_id: parseInt(pwd_id, 10),
                profession: tempdata.assessment.profession,
                skills: tempdata.assessment.skills
            }
        });

        const educationData = await prisma.pwd_Education.create({
            data: {
                pwd_id: parseInt(pwd_id, 10),
                highest_level: tempdata.education.highest_level,
                institution: tempdata.education.institution_name,
                location: tempdata.education.location,
                field_of_study: tempdata.education.field_of_study,
                degree: tempdata.education.degree_certificate_type,
                graduation_details: tempdata.education.graduation_details,
                year_graduated: tempdata.education.graduation_year
            }
        });

        const workExperienceData = await prisma.pwd_Experience.create({
            data: {
                pwd_id: parseInt(pwd_id, 10),
                company: tempdata.workExperience.company_name,
                job_title: tempdata.workExperience.job_title,
                location: tempdata.workExperience.location,
                country: tempdata.workExperience.country,
                currently_working_on_this_role: tempdata.workExperience.currently_working_inthis_role,
                start_date: tempdata.workExperience.start_date,
                end_date: tempdata.workExperience.end_date,
                description: tempdata.workExperience.description,
                employment_type: tempdata.workExperience.employment_type
            }
        });

        const accessibilityNeedsData = await prisma.pwd_Accessibility_Needs.create({
            data: {
                pwd_id: parseInt(pwd_id, 10),
                visual_support: tempdata.accessibilityNeeds.visual_support_needs,
                hearing_support: tempdata.accessibilityNeeds.hearing_support_needs,
                mobility_support: tempdata.accessibilityNeeds.mobility_support_needs,
                cognitive_support: tempdata.accessibilityNeeds.cognitive_support_needs,
                additional_information: tempdata.accessibilityNeeds.additional_information
            }
        });

        const jobPreferencesData = await prisma.pwd_Job_Preferences_Requirements.create({
            data: {
                pwd_id: parseInt(pwd_id, 10),
                work_arrangement: tempdata.jobPreferences.work_arrangement,
                employment_types: tempdata.jobPreferences.employment_type,
                experience_level: tempdata.jobPreferences.experience_level,
                salary_range: tempdata.jobPreferences.salary_range
            }
        });

        res.status(200).json({
            message: 'Complete profile assembled successfully',
            data: {
                completeProfile,
                assessmentData,
                educationData,
                workExperienceData,
                accessibilityNeedsData,
                jobPreferencesData
            }
        });
    } catch (error) {
        console.log('Error completing PWD profile:', error);
        return res.status(500).json({ error: 'Failed to complete PWD profile.' });
    }
}); 

module.exports = router;