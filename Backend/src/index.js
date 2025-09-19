const express = require('express');
const cors = require('cors');
const path = require('path');
const userRouter = require('../Accounts/Users');
const onboardRouterPWD = require('../Accounts/OnboardPWD');
const onboardRouterEMP = require('../Accounts/OnboardEMP');
const fetchProfile = require('../Accounts/RetrieveUsersInfo');
const createNewJob = require('../Accounts/CreateNewJob');
const jobs = require('../Accounts/RetrieveJob');
const accountSettings = require('../Accounts/AccountSettings');

// New API routes
const jobSearch = require('../Accounts/JobSearch');
const applications = require('../Accounts/Applications');
const savedJobs = require('../Accounts/SavedJobs');
const messaging = require('../Accounts/Messaging');
const resumeManagement = require('../Accounts/ResumeManagement');
const notifications = require('../Accounts/Notifications');
const analytics = require('../Accounts/Analytics');
const reviews = require('../Accounts/Reviews');
const transactions = require('../Accounts/Transactions');
const aiMatching = require('../Accounts/AIMatching');
const adminVerification = require('../Accounts/AdminVerification');

const app = express();

app.use(cors({ origin: 'http://localhost:5173'}));
app.use(express.json());

// Debug middleware for uploads
app.use('/uploads', (req, res, next) => {
  console.log('Static file request:', req.url);
  console.log('Full path:', path.join(__dirname, '../Documents', req.url));
  next();
});

app.use('/uploads', express.static(path.join(__dirname, '../Documents')));

// Existing routes
app.use('/accounts', userRouter);
app.use('/onboard', onboardRouterPWD, onboardRouterEMP);
app.use('/retrieve', fetchProfile);
app.use('/create', createNewJob);
app.use('/job', jobs);
app.use('/account-settings', accountSettings);

// New API routes
app.use('/api/jobs', jobSearch);
app.use('/api/applications', applications);
app.use('/api/saved-jobs', savedJobs);
app.use('/api/messages', messaging);
app.use('/api/resumes', resumeManagement);
app.use('/api/notifications', notifications);
app.use('/api/analytics', analytics);
app.use('/api/reviews', reviews);
app.use('/api/transactions', transactions);
app.use('/api/ai-matching', aiMatching);
app.use('/api/admin', adminVerification);

app.listen(4000, () => console.log(`Server running on http://localhost:4000`));