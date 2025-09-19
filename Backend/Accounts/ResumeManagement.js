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
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return cb(new Error('User ID not found'), null);
      }
      
      const uploadPath = path.join('./Documents/Resumes', String(userId));
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log('Created directory:', uploadPath);
      }
      
      cb(null, uploadPath);
    } catch (error) {
      console.error('Error in multer destination:', error);
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  console.log('File filter - File details:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });
  
  // Allow PDF, DOC, DOCX, and video files
  const allowedTypes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/webm',
    'video/quicktime'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    console.log('File type accepted:', file.mimetype);
    cb(null, true);
  } else {
    console.log('File type rejected:', file.mimetype);
    cb(new Error(`File type '${file.mimetype}' is not allowed. Only PDF, DOC, DOCX, and video files are allowed.`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for video files
  }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File size too large. Maximum size is 50MB.' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
  if (error) {
    console.error('Multer error:', error);
    return res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
  next();
};

// Separate multer configuration for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const pwd_id = req.user?.pwd_id;
      const userType = req.user?.userType;
      const userId = req.user?.userId;
      
      console.log('Video upload - User data:', { pwd_id, userType, userId });
      
      if (userType !== 'PWD' || !pwd_id) {
        return cb(new Error('Invalid user type'), null);
      }
      
      const uploadPath = path.join(__dirname, '../Documents/Resumes', pwd_id.toString());
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log('Created directory:', uploadPath);
      }
      
      cb(null, uploadPath);
    } catch (error) {
      console.error('Error in video multer destination:', error);
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const videoUpload = multer({
  storage: videoStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for video files
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Resume management endpoint is working' });
});

// Debug endpoint to check authentication
router.get('/debug-auth', authenticateToken, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Authentication debug info',
    user: req.user,
    userType: req.user?.userType,
    pwd_id: req.user?.pwd_id,
    userId: req.user?.userId
  });
});

// Upload video file
router.post('/upload-video', authenticateToken, videoUpload.single('videoFile'), handleMulterError, async (req, res) => {
  try {
    console.log('Video upload request received');
    console.log('User data:', req.user);
    console.log('File data:', req.file);
    
    const pwd_id = req.user?.pwd_id;
    const userType = req.user?.userType;
    const userId = req.user?.userId;
    
    if (userType !== 'PWD' || !pwd_id) {
      console.error('Invalid user type or missing pwd_id for video upload:', { userType, pwd_id });
      return res.status(400).json({ success: false, message: 'Invalid user type or missing user ID' });
    }

    if (!req.file) {
      console.error('No video file provided in request');
      return res.status(400).json({ success: false, message: 'Video file is required' });
    }

    console.log('Video file uploaded successfully:', req.file.filename);
    console.log('File saved to:', req.file.path);
    console.log('User ID:', userId);
    console.log('File path for database:', req.file.filename);
    
    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        filename: req.file.filename,
        file_path: req.file.filename, // Store just the filename, not full path
        file_url: `http://localhost:4000/uploads/Resumes/${userId}/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload video',
      error: error.message 
    });
  }
});

// Upload a new resume
router.post('/upload', authenticateToken, upload.single('resumeFile'), handleMulterError, async (req, res) => {
  // Set timeout for the request
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({ 
        success: false, 
        message: 'Request timeout' 
      });
    }
  }, 30000); // 30 second timeout

  try {
    console.log('=== RESUME UPLOAD DEBUG ===');
    console.log('Resume upload request received');
    console.log('User data:', req.user);
    console.log('File data:', req.file);
    console.log('Body data:', req.body);
    console.log('Headers:', req.headers);
    console.log('Authorization header:', req.headers.authorization);
    
    // Check for multer errors
    if (req.fileValidationError) {
      console.error('File validation error:', req.fileValidationError);
      clearTimeout(timeout);
      return res.status(400).json({ 
        success: false, 
        message: req.fileValidationError 
      });
    }
    
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
      clearTimeout(timeout);
      console.error('Invalid user type or missing pwd_id:', { userType, pwd_id });
      return res.status(400).json({ success: false, message: 'Invalid user type or missing user ID' });
    }

    if (!req.file) {
      clearTimeout(timeout);
      console.error('No file provided in request');
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
    console.log('Creating resume with data:', {
      pwd_id,
      title: title || 'My Resume',
      summary: summary || '',
      file_path: req.file.filename
    });
    
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
        file_path: req.file.filename
      }
    });

    console.log('Resume created successfully:', resume);
    console.log('File saved to:', req.file.path);
    console.log('File URL will be:', `http://localhost:4000/uploads/Resumes/${userId}/${req.file.filename}`);
    
    clearTimeout(timeout);
    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        ...resume,
        file_url: `http://localhost:4000/uploads/Resumes/${userId}/${req.file.filename}`
      }
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error('Error uploading resume:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload resume',
      error: error.message,
      details: error.stack
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
