const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const { PrismaClient } = require('../src/generated/prisma')
const { withAccelerate } = require('../node_modules/@prisma/extension-accelerate');
const prisma = new PrismaClient().$extends(withAccelerate());

const { generateVerificationCode, verifyCode } = require('../Middlewares/verificationCode');

const memoryUploadForEMP = require('../Middlewares/multerEMP');
const memoryUploadForPWD = require('../Middlewares/multerPwd');
const path = require('path');
const fs = require('fs');

require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const tempPwdUser = new Map();
const tempEmpUser = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jersonsullano201@gmail.com',
    pass: 'mywe blbe kjba pudr'
  }
});

/* // Retrieve all users
router.get('/users', async (req, res) => {
  const users = await prisma.users.findMany();
  res.json(users);
}); */

// Register a new user phase 1
router.post('/users/register/pwd', async (req, res) => {
  const {
    email,
    password,
    phone,
    userType,
    firstName,
    lastName,
    middleName,
    address,
    birthdate,
    disabilityType,
    gender,
    isVerified,
  } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const existingEmail = await prisma.users.findUnique({
    where: { email }
  });
  
  if (existingEmail) {
    return res.status(400).json({ error: 'This email is already registered.' });
  }

  const existingPhoneNumber = await prisma.users.findUnique({
    where: { phone_number: phone }
  });

  if (existingPhoneNumber) {
    return res.status(400).json({ error: 'This phone number is already registered.' });
  }

  const userData = { 
    email,
    password,
    phone,
    userType: 'PWD',
    firstName,
    lastName,
    middleName,
    address,
    birthdate,
    disabilityType,
    gender,
    isVerified,
   }

  tempPwdUser.set(email, userData);
  console.log(`Temporary PWD user data stored for ${email}:`, userData);
  res.json({ message: 'First phase registration successful! Please proceed to upload your documents.', data: userData, success: true });
});

// Register a new user phase 2 for PWD
router.post('/users/register/pwd/documents', memoryUploadForPWD, async (req, res) => {
  const email = req.body.email;
  const userData = tempPwdUser.get(email);

  if (!userData) {
    return res.status(404).json({ message: 'User not found or session expired.' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }

  const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > 5 * 1024 * 1024) {
    return res.status(400).json({ message: 'Total file size must not exceed 5MB.' });
  }

  const code = generateVerificationCode(email);
  userData.verificationCode = code;
  userData.lastResendTime = Date.now();

  userData.tempFiles = req.files;
  tempPwdUser.set(email, userData);

  // Send verification code padong email
  try {
    await transporter.sendMail({
      from: 'PWDe App',
      to: email,
      subject: 'Your PWDe Verification Code',
      html: `<p>Hello ${userData.firstName} ${userData.lastName},</p><p>Your verification code is <b>${code}</b>.</p>`
    });
    console.log(`Verification code sent to ${email}: ${code}`);
    return res.status(200).json({ message: 'Verification code sent to your email.', data: userData, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send verification email.' });
  }
});

// Register a new user phase 1 for Employer
router.post('/users/register/employer', async (req, res) => {
  const {
    companyName,
    companyEmail,
    companyPhone,
    companyAddress,
    password
  } = req.body;

  const existingEmail = await prisma.users.findUnique({
    where: { email: companyEmail }
  });
  
  if (existingEmail) {
    return res.status(400).json({ error: 'This email is already registered.' });
  }

  const existingPhoneNumber = await prisma.users.findUnique({
    where: { phone_number: companyPhone }
  });

  if (existingPhoneNumber) {
    return res.status(400).json({ error: 'This phone number is already registered.' });
  }

  const userData = {
    companyName,
    companyEmail,
    companyPhone,
    companyAddress,
    password,
    userType: 'Employer'
  }

  tempEmpUser.set(companyEmail, userData);
  console.log(`Temporary employer user data stored for ${companyEmail}:`, userData);
  res.json({ message: 'First phase registration successful!', data: userData, success: true });
});

// Register a new user phase 2 for Employer
router.post('/users/register/employer/documents', memoryUploadForEMP, async (req, res) => {
  const email = req.body.companyEmail;
  const userData = tempEmpUser.get(email);
  const {
    companyWebsite,
    linkedinProfile,
    otherSocialMedia,
    contactName,
    jobTitle,
    phoneNumber
  } = req.body;
  const {
    businessRegistration,
    governmentId,
    taxDocuments
  } = req.files;

  if (!userData) {
    return res.status(404).json({ message: 'User not found or session expired.' });
  }

  const code = generateVerificationCode(email);

  // Store the actual file objects for later saving
  userData.businessRegistration = businessRegistration;
  userData.governmentId = governmentId;
  userData.taxDocuments = taxDocuments;

  // Store the rest of the employer data as before
  userData.company_website = companyWebsite.trim();
  userData.LinkedIn_profile = linkedinProfile.trim();
  userData.other_social_media = otherSocialMedia ? otherSocialMedia.trim() : '';
  userData.contact_person_fullname = contactName.trim();
  userData.contact_person_job_title = jobTitle.trim();
  userData.contact_person_phone = phoneNumber.trim();

  // Store the verification code and last resend time if needed
  userData.verificationCode = code;

  tempEmpUser.set(email, userData);

  console.log(`Employer documents and info stored in memory for ${email}:`, {
    businessRegistration: userData.businessRegistration ? userData.businessRegistration.map(file => file.originalname) : [],
    governmentId: userData.governmentId ? userData.governmentId.map(file => file.originalname) : [],
    taxDocuments: userData.taxDocuments ? userData.taxDocuments.map(file => file.originalname) : [],
    company_website: userData.company_website,
    LinkedIn_profile: userData.LinkedIn_profile,
    other_social_media: userData.other_social_media,
    contact_person_fullname: userData.contact_person_fullname,
    contact_person_job_title: userData.contact_person_job_title,
    contact_person_phone: userData.contact_person_phone
  });
  // Send verification code padong email
  try {
    await transporter.sendMail({
      from: 'PWDe App',
      to: email,
      subject: 'Your PWDe Verification Code',
      html: `
        <p>Hello ${userData.companyName},</p><p>Your verification code is <b>${code}</b>.</p>
        <p>This code is valid for 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    });
    res.json({ message: 'Verification code sent to your email.', data: userData, success: true });
    console.log(`Verification code sent to ${email}: ${code}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send verification email.' });
  }
});

// Verify and register the user
router.post('/users/register/verify', async (req, res) => {
  const { email, code } = req.body;

  const result = verifyCode(email, code);
  if (!result.valid) {
    return res.status(400).json({ error: result.message, message: 'Incorrect verification code.' });
  }

  const dateToday = new Date();
  const formattedDate = dateToday.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const userData = tempPwdUser.get(email) || tempEmpUser.get(email);
  if(!userData) {
    return res.status(404).json({ message: 'User not found or session expired.' });
  }

  const user = await prisma.users.create({
      data: { 
        email: email, 
        password_hash: userData.password, 
        phone_number: userData.phone || userData.companyPhone, 
        user_type: userData.userType,
        created_at: formattedDate,
        is_verified: true,
      }
  });

  if (userData.userType === 'PWD') {
    console.log('Registering PWD profile for user:', user);
    const newFolder = path.join('./Documents/PWDs', String(user.user_id));
    if (!fs.existsSync(newFolder)) {
      fs.mkdirSync(newFolder, { recursive: true });
    }
    let documentFiles = [];
    if (userData.tempFiles && userData.tempFiles.length > 0) {
      userData.tempFiles.forEach(file => {
        const filePath = path.join(newFolder, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
        documentFiles.push(file.originalname);
      });
    }

    const pwd = await prisma.pwd_Profile.create({
      data: {
        user_id: user.user_id,
        first_name: userData.firstName,
        last_name: userData.lastName,
        middle_name: userData.middleName,
        address: userData.address,
        date_of_birth: userData.birthdate,
        gender: userData.gender,
        disability_Type: userData.disabilityType,
        pwd_document: {
          set: documentFiles || []
        },
        created_at: formattedDate,
        professional_role: '',
        professional_summary: '',
      }
    })

    tempPwdUser.delete(email);
    res.status(201).json({ message: 'Account verified and registered successfully.', user, pwd, success: true});
  } else if (userData.userType === 'Employer') {
    console.log('Registering Employer profile for user:', user);
    const newFolder = path.join('./Documents/Employer', String(user.user_id));
    if (!fs.existsSync(newFolder)) {
      fs.mkdirSync(newFolder, { recursive: true });
    }

    let businessRegistrationFile = '';
    if (userData.businessRegistration && userData.businessRegistration.length > 0) {
      const file = userData.businessRegistration[0];
      const filePath = path.join(newFolder, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      businessRegistrationFile = file.originalname;
    }

    let governemntIdFile = '';
    if (userData.governmentId && userData.governmentId.length > 0) {
      const file = userData.governmentId[0];
      const filePath = path.join(newFolder, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      governemntIdFile = file.originalname;
    }

    let taxDocumentsFile = '';
    if (userData.taxDocuments && userData.taxDocuments.length > 0) {
      const file = userData.taxDocuments[0];
      const filePath = path.join(newFolder, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      taxDocumentsFile = file.originalname;
    }

    const emp = await prisma.employer_Profile.create({
      data: {
        user_id: user.user_id,
        address: userData.companyAddress,
        businessRegistration: businessRegistrationFile || '',
        governmentId: governemntIdFile || '',
        taxDocuments: taxDocumentsFile || '',
        company_name: userData.companyName,
        company_email: userData.companyEmail,
        company_phone: userData.companyPhone,
        company_address: userData.companyAddress,
        company_website: userData.company_website,
        LinkedIn_profile: userData.LinkedIn_profile,
        Other_Social_Media: userData.other_social_media,
        contact_person_fullname: userData.contact_person_fullname,
        contact_person_job_title: userData.contact_person_job_title,
        contact_person_phone_number: userData.contact_person_phone,
        created_at: formattedDate,
      }
    })
    tempEmpUser.delete(email);
    res.status(201).json({ message: 'Account verified and registered successfully.', user, emp, success: true});
  }
});

// Resend verification code (wapa mahoman)
router.post('/users/register/verify/resend', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const identifier = email || companyEmail;
  const userData = tempPwdUser.get(identifier) || tempEmpUser.get(identifier);
  if (!userData) {
    return res.status(404).json({ message: 'User not found or session expired.' });
  }

  const now = Date.now();
  const cooldown = 30 * 1000; // 30 seconds cooldown for resending code

  // Check cooldown
  if (userData.lastResendTime && now - userData.lastResendTime < cooldown) {
    const waitTime = Math.ceil((cooldown - (now - userData.lastResendTime)) / 1000);
    return res.status(429).json({
      message: `Please wait ${waitTime} seconds before requesting another code.`,
    });
  }

  try {
    const newCode = generateVerificationCode(email);

    userData.verificationCode = newCode;
    userData.lastResendTime = now;
    tempPwdUser.set(email, userData);

    await transporter.sendMail({
      from: 'PWDe App',
      to: email,
      subject: 'Your PWDe Verification Code',
      html: `
        <p>Hello ${userData.firstName} ${userData.lastName}, You requested to resend a verification code.</p>
        <p>Your new verification code is <b>${newCode}</b>.</p>
        <p>This code is valid for 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    });
    res.json({ message: 'New verification code sent successfully.', newCode, success: true });
    console.log(`Verification code resent to ${email}: ${newCode}`);
  } catch (error) {
    console.error("Error resending verification code:", error);
    res.status(500).json({ message: 'Failed to resend verification email.' });
  }
});

/* // Get all PWD profiles with their documents (testing purposes)
router.get('/pwd/documents', async (req, res) => {
  try {
    // Get all PWD profiles with their documents
    const profiles = await prisma.pwd_Profile.findMany({
      select: {
        pwd_id: true,
        first_name: true,
        last_name: true,
        pwd_document: true
      }
    });

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PWD documents.' });
  }
}); */

// Login with jsonebtoken
router.post('/users/login', async (req, res) => {
  console.log('Login request body:', req.body);
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = await prisma.users.findUnique({
    where: { email }
  });

  if (!user || user.password_hash !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  let profile = null;
  if (user.user_type === 'PWD') {
    profile = await prisma.pwd_Profile.findUnique({
      where: { user_id: user.user_id }
    });
  } else if (user.user_type === 'Employer') {
    profile = await prisma.employer_Profile.findUnique({
      where: { user_id: user.user_id }
    });
  }

  const role = user.user_type;

  const payload = {
    userId: user.user_id,
    pwd_id: profile && user.user_type === 'PWD' ? profile.pwd_id : null,
    emp_id: profile && user.user_type === 'Employer' ? profile.emp_id : null,
    userType: user.user_type,
  }

  const expiresIn = rememberMe ? '7d' : '1h'; // 7 days if rememberMe is true, or otherwise 3 hours

  // GENERATE TOKEN EXPIRATION 3 HOURS
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

  console.log(`Login successful for user: ${payload.userId} with role: ${payload.userType}, ${payload.userType === 'PWD' ? 'PWD ID: ' + payload.pwd_id : 'Employer ID: ' + payload.emp_id}`);
  res.json({ message: 'Login successful.', success: true, token, user, profile, role });
});
module.exports = router;