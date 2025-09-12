const express = require('express');
const cors = require('cors');
const path = require('path');
const userRouter = require('../Accounts/Users');
const onboardRouterPWD = require('../Accounts/OnboardPWD');
const onboardRouterEMP = require('../Accounts/OnboardEMP');
const fetchProfile = require('../Accounts/RetrieveUsersInfo');
const createNewJob = require('../Accounts/CreateNewJob');
const updateProfile = require('../Accounts/UpdateBasicInformation');
const jobs = require('../Accounts/RetrieveJob');

const app = express();

app.use(cors({ origin: 'http://localhost:5173'}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../Documents')));

app.use('/accounts', userRouter);
app.use('/onboard', onboardRouterPWD, onboardRouterEMP);
app.use('/retrieve', fetchProfile);
app.use('/create', createNewJob);
app.use('/update-profile', updateProfile);
app.use('/job', jobs);

app.listen(4000, () => console.log(`Server running on http://localhost:4000`));