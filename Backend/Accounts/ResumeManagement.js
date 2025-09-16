const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const authenticateToken = require('../Middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for resume file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user?.userId;
    const uploadPath = path.join('./Documents/Resumes', String(userId));
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow only PDF and DOC files
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOC files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload a new resume
router.post('/upload', authenticateToken, upload.single('resumeFile'), async (req, res) => {
  try {
    console.log('Resume upload request received');
    console.log('User data:', req.user);
    console.log('File data:', req.file);
    console.log('Body data:', req.body);
    
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const userId = req.user?.userId;
    
    console.log('Extracted values:', { pwd_id, userType, userId });
    console.log('pwd_id type:', typeof pwd_id);
    const {
      title,
      summary,
      skills,
      workExperience,
      education,
      certifications,
      achievements
    } = req.body;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume file is required' });
    }

    // Parse JSON fields
    let parsedSkills = [];
    let parsedWorkExperience = [];
    let parsedEducation = [];
    let parsedCertifications = [];
    let parsedAchievements = [];

    try {
      parsedSkills = skills ? JSON.parse(skills) : [];
      parsedWorkExperience = workExperience ? JSON.parse(workExperience) : [];
      parsedEducation = education ? JSON.parse(education) : [];
      parsedCertifications = certifications ? JSON.parse(certifications) : [];
      parsedAchievements = achievements ? JSON.parse(achievements) : [];
    } catch (parseError) {
      return res.status(400).json({ success: false, message: 'Invalid JSON format in resume data' });
    }

    // Create resume record
    const resume = await prisma.Resumes.create({
      data: {
        pwd_id: pwd_id,
        title: title || 'My Resume',
        summary: summary || '',
        skills: JSON.stringify(parsedSkills),
        work_experience: JSON.stringify(parsedWorkExperience),
        education: JSON.stringify(parsedEducation),
        certifications: JSON.stringify(parsedCertifications),
        achievements: JSON.stringify(parsedAchievements),
        file_path: req.file.filename,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    console.log('Resume created successfully:', resume);
    console.log('File saved to:', req.file.path);
    console.log('File URL will be:', `http://localhost:4000/uploads/Resumes/${userId}/${req.file.filename}`);
    
    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        ...resume,
        file_url: `http://localhost:4000/uploads/Resumes/${userId}/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload resume',
      error: error.message 
    });
  }
});

// Get user's resumes
router.get('/my-resumes', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const userId = req.user?.userId;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const resumes = await prisma.Resumes.findMany({
      where: { pwd_id: pwd_id },
      orderBy: { created_at: 'desc' }
    });

    const resumesWithUrls = resumes.map(resume => ({
      ...resume,
      file_url: `http://localhost:4000/uploads/Resumes/${userId}/${resume.file_path}`
    }));

    res.json({
      success: true,
      data: resumesWithUrls
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resumes' });
  }
});

// Get single resume details
router.get('/:resumeId', authenticateToken, async (req, res) => {
  try {
    const { resumeId } = req.params;
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const userId = req.user?.userId;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const resume = await prisma.Resumes.findFirst({
      where: {
        resume_id: parseInt(resumeId),
        pwd_id: pwd_id
      }
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const resumeWithUrl = {
      ...resume,
      file_url: `http://localhost:4000/uploads/Resumes/${userId}/${resume.file_path}`
    };

    res.json({
      success: true,
      data: resumeWithUrl
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resume' });
  }
});

// Update resume details
router.put('/:resumeId', authenticateToken, async (req, res) => {
  try {
    const { resumeId } = req.params;
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const {
      title,
      summary,
      skills,
      workExperience,
      education,
      certifications,
      achievements
    } = req.body;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Check if resume exists and belongs to user
    const existingResume = await prisma.Resumes.findFirst({
      where: {
        resume_id: parseInt(resumeId),
        pwd_id: pwd_id
      }
    });

    if (!existingResume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Parse JSON fields
    let parsedSkills = existingResume.skill;
    let parsedWorkExperience = existingResume.work_experience;
    let parsedEducation = existingResume.education;
    let parsedCertifications = existingResume.certifications;
    let parsedAchievements = existingResume.achievements;

    try {
      if (skills) parsedSkills = JSON.parse(skills);
      if (workExperience) parsedWorkExperience = JSON.parse(workExperience);
      if (education) parsedEducation = JSON.parse(education);
      if (certifications) parsedCertifications = JSON.parse(certifications);
      if (achievements) parsedAchievements = JSON.parse(achievements);
    } catch (parseError) {
      return res.status(400).json({ success: false, message: 'Invalid JSON format in resume data' });
    }

    // Update resume
    const updatedResume = await prisma.Resumes.update({
      where: { resume_id: parseInt(resumeId) },
      data: {
        title: title || existingResume.title,
        summary: summary || existingResume.summary,
        skill: parsedSkills,
        work_experience: parsedWorkExperience,
        education: parsedEducation,
        certifications: parsedCertifications,
        achievements: parsedAchievements,
        updated_at: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Resume updated successfully',
      data: updatedResume
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ success: false, message: 'Failed to update resume' });
  }
});

// Update resume file
router.put('/:resumeId/file', authenticateToken, upload.single('resumeFile'), async (req, res) => {
  try {
    const { resumeId } = req.params;
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const userId = req.user?.userId;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume file is required' });
    }

    // Check if resume exists and belongs to user
    const existingResume = await prisma.Resumes.findFirst({
      where: {
        resume_id: parseInt(resumeId),
        pwd_id: pwd_id
      }
    });

    if (!existingResume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Delete old file
    const oldFilePath = path.join('./Documents/Resumes', String(userId), existingResume.file_path);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }

    // Update resume with new file
    const updatedResume = await prisma.Resumes.update({
      where: { resume_id: parseInt(resumeId) },
      data: {
        file_path: req.file.filename,
        updated_at: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Resume file updated successfully',
      data: {
        ...updatedResume,
        file_url: `http://localhost:4000/uploads/Resumes/${userId}/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Error updating resume file:', error);
    res.status(500).json({ success: false, message: 'Failed to update resume file' });
  }
});

// Delete resume
router.delete('/:resumeId', authenticateToken, async (req, res) => {
  try {
    const { resumeId } = req.params;
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const userId = req.user?.userId;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Check if resume exists and belongs to user
    const existingResume = await prisma.Resumes.findFirst({
      where: {
        resume_id: parseInt(resumeId),
        pwd_id: pwd_id
      }
    });

    if (!existingResume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Check if resume is being used in any applications
    const applicationsUsingResume = await prisma.applications.findFirst({
      where: { resume_id: parseInt(resumeId) }
    });

    if (applicationsUsingResume) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete resume that is being used in applications' 
      });
    }

    // Delete file from filesystem
    const filePath = path.join('./Documents/Resumes', String(userId), existingResume.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete resume record
    await prisma.Resumes.delete({
      where: { resume_id: parseInt(resumeId) }
    });

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resume' });
  }
});

// Set default resume
router.put('/:resumeId/set-default', authenticateToken, async (req, res) => {
  try {
    const { resumeId } = req.params;
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    // Check if resume exists and belongs to user
    const existingResume = await prisma.Resumes.findFirst({
      where: {
        resume_id: parseInt(resumeId),
        pwd_id: pwd_id
      }
    });

    if (!existingResume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Update PWD profile to set this as default resume
    await prisma.pwd_Profile.update({
      where: { pwd_id: pwd_id },
      data: {
        default_resume_id: parseInt(resumeId)
      }
    });

    res.json({
      success: true,
      message: 'Default resume set successfully'
    });
  } catch (error) {
    console.error('Error setting default resume:', error);
    res.status(500).json({ success: false, message: 'Failed to set default resume' });
  }
});

// Get resume statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;

    if (userType !== 'PWD' || !pwd_id) {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const [totalResumes, applicationsCount] = await Promise.all([
      prisma.Resumes.count({
        where: { pwd_id: pwd_id }
      }),
      prisma.applications.count({
        where: { pwd_id: pwd_id }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalResumes,
        applicationsCount
      }
    });
  } catch (error) {
    console.error('Error fetching resume stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resume statistics' });
  }
});

module.exports = router;
