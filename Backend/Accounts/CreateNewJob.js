const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const authenticateToken = require('../Middlewares/auth');

const tempNewJob = new Map();

function mergeStepData(emp_id, stepName, stepData) {
  const key = String(emp_id);
  const existingData = tempNewJob.get(key) || {};

  tempNewJob.set(key, {
    ...existingData,
    [stepName]: stepData
  });
}

router.post('/basic-information', authenticateToken, async (req, res) => {
    const emp_id = req.user.emp_id;
    const {
        jobtitle,
        jobcategoryname,
        employmentType,
        workArrangement,
        country,
        province,
        city,
        salaryType,
        minSalary,
        maxSalary,
        experienceLevel
    } = req.body;

    if(!emp_id) {
        return res.status(400).json({ error: 'Employer not found!' });
    }

    try {
        mergeStepData(emp_id, 'Basic-Information', {
            jobtitle,
            jobcategoryname,
            employmentType,
            workArrangement,
            country,
            province,
            city,
            salaryType,
            minSalary,
            maxSalary,
            experienceLevel
        });
        console.log('Temporary New Job Data:', tempNewJob.get(String(emp_id)))
        res.status(200).json({
            message: 'Employers data for new job list successfully stored temporarily.',
            data: tempNewJob.get(String(emp_id)),
            success: true
        });
    } catch (error) {
        console.log('Error processing Employers new job basic information:', error);
        return res.status(500).json({ error: 'Failed to process Employers new job basic information.' });
    }
})

router.post('/jobdetail-requirements', authenticateToken, async (req, res) => {
    const emp_id = req.user.emp_id;
    const {
        jobDescription,
        requiredSkills, // expects array
        applicationDeadline
    } = req.body;

    if(!emp_id) {
        return res.status(400).json({ error: 'Employer not found!' });
    }

    try {
        mergeStepData(emp_id, 'JobDetail-Requirements', {
            jobDescription,
            requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills],
            applicationDeadline
        });
        console.log('Temporary New Job Data:', tempNewJob.get(String(emp_id)))
        res.status(200).json({
            message: 'Employers data for new job list successfully stored temporarily.',
            data: tempNewJob.get(String(emp_id)),
            success: true
        });
    } catch (error) {
        console.log('Error processing Employers new job basic information:', error);
        return res.status(500).json({ error: 'Failed to process Employers new job basic information.' });
    }
})

router.post('/accessibility-inclusionfeatures', authenticateToken, async (req, res) => {
    const emp_id = req.user.emp_id;
    
    const {
        workplaceAccessibilityFeatures // expects array
    } = req.body;

    if(!emp_id) {
        return res.status(400).json({ error: 'Employer not found!' });
    }

    try {
        mergeStepData(emp_id, 'Accessibility-InclusionFeatures', {
            workplaceAccessibilityFeatures: Array.isArray(workplaceAccessibilityFeatures) ? workplaceAccessibilityFeatures: [workplaceAccessibilityFeatures]
        }); 
        console.log('Temporary New Job Data:', tempNewJob.get(String(emp_id)))
        res.status(200).json({
            message: 'Employers data for new job list successfully stored temporarily.',
            data: tempNewJob.get(String(emp_id)),
            success: true
        });
    } catch (error) {
        console.log('Error processing Employers new job basic information:', error);
        return res.status(500).json({ error: 'Failed to process Employers new job basic information.' });
    }
})

router.get('/review', authenticateToken, async (req, res) => {
    const emp_id = req.user.emp_id;
    const reviewData = tempNewJob.get(String(emp_id));

    if (!reviewData) {
        return res.status(404).json({ success: false, message: "No temporary job data found" });
    }
    console.log("Review job summary: ", reviewData);
    res.status(200).json({
        message: 'Employers data for new job list successfully stored temporarily.',
        data: reviewData,
        success: true
    })
})

module.exports = router;