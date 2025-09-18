const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const authenticateToken = require('../Middlewares/auth');

router.get('/:jobId/posted', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.Job_Listings.findUnique({
      where: { job_id: parseInt(jobId, 10) },
      include: {
        employer: true,
        _count: {
           select: {
                applications: true,
           }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:jobId/delete', authenticateToken, async (req, res) => {
    try {
    const { jobId } = req.params;

    const job = await prisma.Job_Listings.delete({
      where: { job_id: parseInt(jobId, 10) },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
})

router.get('/all', authenticateToken, async (req, res) => {
    try {
    const emp_id = req.user?.emp_id;

    const job = await prisma.Job_Listings.findMany({
      where: { employer_id: emp_id },
      include: {
        employer: true,
        _count: {
           select: {
                applications: true,
           }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/count', authenticateToken, async (req, res) => {
  try {
    const emp_id = req.user?.emp_id;

    const countJobPosted = await prisma.Job_Listings.count({
      where: { employer_id: emp_id }
    });

    res.json({
      success: true,
      countJobPosted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/delete/:jobid', authenticateToken, async (req, res) => {
  try {
    const { jobid } = req.params;
    const emp_id = req.user?.emp_id;

    await prisma.Job_Listings.delete({
      where: { 
        job_id: parseInt(jobid, 10),
        employer_id: emp_id,
       }
    })

    res.json({ success: true, message: "Job successfully delted." });
  } catch(error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
})
module.exports = router;