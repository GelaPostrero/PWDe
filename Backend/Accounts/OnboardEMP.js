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
        selectedIndustry,
        selectedRoles, // expect array
        cleanSkills // expect array
    } = req.body;

    if(!emp_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        mergeStepData(emp_id, 'JobRolesRequirements', {
            industryPreference: selectedIndustry,
            jobRoles: Array.isArray(selectedRoles) ? selectedRoles : [selectedRoles],
            requiredPreferredSkills: Array.isArray(cleanSkills) ? cleanSkills : [cleanSkills]
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
        selectedAccessibilityFeatures // expect array
    } = req.body;

    if(!emp_id) {
        return res.status(400).json({ error: 'User not found!' });
    }

    try {
        mergeStepData(emp_id, 'WorkEnvironment', {
            workArrangement: Array.isArray(workArrangement) ? workArrangement : [workArrangement],
            accessibilityFeature: Array.isArray(selectedAccessibilityFeatures) ? selectedAccessibilityFeatures : [selectedAccessibilityFeatures]
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
    const userType = req.user?.userType
    const emp_id = req.user?.emp_id

    const {
        companyDescription,
        companyPortfolioWebsite,
        githubProfile,
        otherPortfolioWebsite // expect array
    } = req.body

    let parsedOtherPlatform;
    try {
        parsedOtherPlatform = JSON.parse(otherPortfolioWebsite || '[]');
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
                company_website_portfolio: companyPortfolioWebsite || '',
                company_github_profile: githubProfile || '',
                company_other_portfolio: parsedOtherPlatform
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