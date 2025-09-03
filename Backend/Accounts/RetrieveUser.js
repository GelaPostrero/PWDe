const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../src/generated/prisma')
const { withAccelerate } = require('../node_modules/@prisma/extension-accelerate');
const prisma = new PrismaClient().$extends(withAccelerate());

require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// GET USER'S INFORMATIONS FROM DB
router.get('/user/pwd', async (req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: { pwd_id: req.user.pwd_Id },
            select: {
                first_name: true,
                last_name: true,
            }   
        })
    } catch(error) {

    }
});

module.exports = router;