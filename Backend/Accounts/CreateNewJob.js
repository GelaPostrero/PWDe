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
        jobTitle,
        jobCategory,
        employmentType,
        workArrangement,
        country,
        province,
        city,
        salaryType,
        minimumSalary,
        maximumSalary,
        experienceLevel
    } = req.body;

    if(!emp_id) {
        return res.status(400).json({ error: 'Employer not found!' });
    }

    const requiredFields = {
        "Job Title": jobTitle,
        "Job Category": jobCategory,
        "Employment Type": employmentType,
        "Work Arrangement": workArrangement,
        "Country": country,
        "Province": province,
        "City": city,
        "Salary Type": salaryType,
        "Minimum Salary": minimumSalary,
        "Maximum Salary": maximumSalary,
        "Experience Level": experienceLevel
    };

    for (const [field, value] of Object.entries(requiredFields)) {
        if (value === undefined || value === "") return res.status(400).json({ success: false, error: `Field "${field}" is required and cannot be empty.` });
    }

    try {
        mergeStepData(emp_id, 'BasicInformations', {
            jobTitle,
            jobCategory,
            employmentType,
            workArrangement,
            country,
            province,
            city,
            salaryType,
            minimumSalary,
            maximumSalary,
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
});

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

    const requiredFields = {
        "Job Description": jobDescription,
        "Required Skills": requiredSkills,
        "Application Deadline": applicationDeadline,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
        if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) 
            return res.status(400).json({ success: false, error: `Field "${field}" is required and cannot be empty.` });
    }

    const deadlineDate = new Date(applicationDeadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deadlineDate < today) {
        return res.status(400).json({ 
            success: false, 
            error: "Application deadline cannot be in the past." 
        });
    }

    try {
        mergeStepData(emp_id, 'JobDetail_Requirements', {
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
});

router.post('/accessibility-inclusionfeatures', authenticateToken, async (req, res) => {
    const emp_id = req.user.emp_id;
    
    const {
        accessibilityFeatures // expects array
    } = req.body;

    if(!emp_id) {
        return res.status(400).json({ error: 'Employer not found!' });
    }

    const requiredFields = {
        "Accessibility Features": accessibilityFeatures,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
        if ((Array.isArray(value) && value.length === 0)) return res.status(400).json({ success: false, error: `Field "${field}" is required and cannot be empty.` });
    }

    try {
        mergeStepData(emp_id, 'AccessibilityInclusionFeatures', {
            accessibilityFeatures: Array.isArray(accessibilityFeatures) ? accessibilityFeatures: [accessibilityFeatures]
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
});

router.get('/review', authenticateToken, async (req, res) => {
    const emp_id = req.user.emp_id;
    const reviewData = tempNewJob.get(String(emp_id));

    if (!reviewData) {
        return res.status(404).json({ success: false, message: "No temporary job data found" });
    }

    const company_name = await prisma.employer_Profile.findUnique({
        where: { employer_id: emp_id },
        select: {
            company_name: true
        }
    });

    console.log("Review job summary: ", reviewData, "Company name: ", company_name.company_name);
    res.status(200).json({
        message: 'Employers data for new job list successfully stored temporarily.',
        data: reviewData,
        companyname: company_name,
        success: true
    })
});

router.post('/publish', authenticateToken, async (req, res) => {
    try {
        const emp_id = req.user?.emp_id;

        const publishdata = tempNewJob.get(String(emp_id));

        const employer = await prisma.employer_Profile.findUnique({
            where: { employer_id: emp_id },
            select: { company_name: true }
        });

        const newJob = await prisma.Job_Listings.create({
            data: {
                employer_id: emp_id,

                jobtitle: publishdata.BasicInformations.jobTitle,
                jobCategory: publishdata.BasicInformations.jobCategory,
                employment_type: publishdata.BasicInformations.employmentType,
                work_arrangement: publishdata.BasicInformations.workArrangement,
                location_city: publishdata.BasicInformations.city,
                location_province: publishdata.BasicInformations.province,
                location_country: publishdata.BasicInformations.country,
                salary_min: publishdata.BasicInformations.minimumSalary,
                salary_max: publishdata.BasicInformations.maximumSalary,
                salary_type: publishdata.BasicInformations.salaryType,
                experience_level: publishdata.BasicInformations.experienceLevel,

                description: publishdata.JobDetail_Requirements.jobDescription,
                skills_required: publishdata.JobDetail_Requirements.requiredSkills,
                application_deadline: publishdata.JobDetail_Requirements.applicationDeadline,

                workplace_accessibility_features: publishdata.AccessibilityInclusionFeatures.accessibilityFeatures
            }
        })

        const year = new Date().getFullYear();

        let employerPrefix = "EM"; // default
        if (employer?.company_name) {
        const name = employer.company_name.trim();
        const capitals = name.match(/[A-Z]/g) || [];

            if (capitals.length >= 2) {
                employerPrefix = (capitals[0] + capitals[1]).toUpperCase();
            } else if (capitals.length === 1) {
                const idx = name.indexOf(capitals[0]);
                employerPrefix = (capitals[0] + (name[idx + 1] || "")).toUpperCase();
            } else {
                employerPrefix = name.substring(0, 2).toUpperCase();
            }
        }

        const jobTitle = publishdata.BasicInformations.jobTitle || "General";
        const jobPrefix = jobTitle
            .split(" ")
            .map(word => word[0].toUpperCase())
            .join("")
            .slice(0, 2) || "XX";
        
        const sequence = String(newJob.job_id).padStart(3, "0");
        const jobCode = `${employerPrefix}-${year}-${jobPrefix}-${sequence}`;

        const updatedJob = await prisma.Job_Listings.update({
            where: { job_id: newJob.job_id },
            data: { job_code: jobCode }
        });

        res.status(201).json({
            success: true,
            message: "Job successfully created!",
            job: updatedJob
        })
    } catch (error) {
        console.log("Server error: ", error)
        return res.json({ error: "Server error", success: false })
    }
});

module.exports = router;