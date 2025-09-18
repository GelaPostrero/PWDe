const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');

const authenticateToken = require('../Middlewares/auth');
const profilePhoto = require('../Middlewares/multerProfilePhoto');

const tempOnboardEMP = new Map();

function mergeStepData(emp_id, stepName, stepData) {
  const key = String(emp_id);
  const existingData = tempOnboardEMP.get(key) || {};

  tempOnboardEMP.set(key, {
    ...existingData,
    [stepName]: stepData
  });
}

router.post('/emp/onboard/jobroles-requirements', authenticateToken, async (req, res) => {
    const emp_id = req.user.emp_id;
    const { 
        industry,
        roles, // expect array
        skills // expect array
    } = req.body;

    if(!emp_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        mergeStepData(emp_id, 'JobRolesRequirements', {
            industryPreference: industry,
            jobRoles: Array.isArray(roles) ? roles : [roles],
            requiredPreferredSkills: Array.isArray(skills) ? skills : [skills],
            set_jobRoles_requirements: true,
        });
        console.log('Temporary Onboard EMP Data:', tempOnboardEMP.get(String(emp_id)))
        res.status(200).json({
            message: 'EMP onboarding Job Roles & Requirements data received successfully.',
            data: tempOnboardEMP.get(String(emp_id)),
            success: true
        });
    } catch (error) {
        console.log('Error processing EMP onboarding Job Roles & Requirements:', error);
        return res.status(500).json({ error: 'Failed to process EMP onboarding Job Roles & Requirements.' });
    }
})

router.post('/emp/onboard/work-environment', authenticateToken, async (req, res) => {
    const emp_id = req.user?.emp_id;
    const {
        workArrangement, // expect arary
        accessibilityFeatures // expect array
    } = req.body;

    if(!emp_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        mergeStepData(emp_id, 'WorkEnvironment', {
            workArrangement: Array.isArray(workArrangement) ? workArrangement : [workArrangement],
            accessibilityFeature: Array.isArray(accessibilityFeatures) ? accessibilityFeatures : [accessibilityFeatures],
            set_work_environment: true
        });
        console.log('Temporary Onboard EMP Data:', tempOnboardEMP.get(String(emp_id)))
        res.status(200).json({
            message: 'EMP onboarding Work Environment data received successfully.',
            data: tempOnboardEMP.get(String(emp_id)),
            success: true
        });
    } catch (error) {
        console.log('Error processing EMP onboarding Work Environment:', error);
        return res.status(500).json({ error: 'Failed to process EMP onboarding Work Environment.' });
    }
})

router.post('/emp/onboard/complete-profile', authenticateToken, profilePhoto, async(req, res) => {
    const userId = req.user?.userId
    const emp_id = req.user?.emp_id

    const {
        companyDescription,
        portfolioUrl,
        githubUrl,
        otherPlatform // expect array
    } = req.body

    let parsedOtherPlatform;
    try {
        parsedOtherPlatform = JSON.parse(otherPlatform || '[]');
    } catch (error) {
        parsedOtherPlatform = [];
    }

    const profilePhoto = req.files?.profilePhoto?.[0] || null;

    if (!userId || !emp_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        const tempdata = tempOnboardEMP.get(String(emp_id));

        if (!tempdata) {
            console.log("No temoporary data found!")
            return res.status(404).json({ error: 'No temporary data found for this PWD.' });
        }

        console.log("Temp Data: ", tempOnboardEMP.get(String(emp_id)))

        const hasCompanyProfile =
            (profilePhoto && profilePhoto.filename) ||
            portfolioUrl?.trim() ||
            githubUrl?.trim() ||
            (Array.isArray(parsedOtherPlatform) && parsedOtherPlatform.length > 0);

        const updatedata = await prisma.employer_Profile.update({
            where: { employer_id: emp_id },
            data: {
                industryPreference: tempdata.JobRolesRequirements.industryPreference || '',
                jobRolesTypicallyHire: tempdata.JobRolesRequirements.jobRoles || [],
                requiredPreferredSkills: tempdata.JobRolesRequirements.requiredPreferredSkills || [],
                workArrangement: tempdata.WorkEnvironment.workArrangement || [],
                accessibilityFeatures: tempdata.WorkEnvironment.accessibilityFeature || [],
                profile_picture: profilePhoto ? profilePhoto.filename : null,
                company_description: companyDescription || '',
                company_website_portfolio: portfolioUrl || '',
                company_github_profile: githubUrl || '',
                company_other_portfolio: parsedOtherPlatform,
                set_jobRoles_requirements: tempdata.JobRolesRequirements.set_jobRoles_requirements || false,
                set_work_environment: tempdata.WorkEnvironment.set_work_environment || false,
                set_company_profile: Boolean(hasCompanyProfile)
            }
        });

        res.status(200).json({
            message: 'Complete profile assembled successfully',
            success: true,
            profile: updatedata
        });
    } catch(error) {
        console.error("Error completing employer profile:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;