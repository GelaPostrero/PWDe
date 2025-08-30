const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('../src/generated/prisma');
const { withAccelerate } = require('@prisma/extension-accelerate');
const userRouter = require('../Accounts/Users');
const onboardRouter = require('../Accounts/OnboardPWD');

const prisma = new PrismaClient().$extends(withAccelerate());
const app = express();

app.use(cors({ origin: 'http://localhost:5173'}));
app.use(express.json());

app.use('/accounts', userRouter);
app.use('/onboard', onboardRouter);

app.listen(4000, () => console.log(`Server running on http://localhost:4000`));