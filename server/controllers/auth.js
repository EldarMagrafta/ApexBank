const nodemailer = require('nodemailer');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function registerUser(req, res) {
    try {
        const {name, password, email} = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({message: "name, email, and password are required"});
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).send({message: "Email is already registered."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({name, email, password: hashedPassword});
        await user.save();

        // Send verification email
        sendAuthEmail({name, password, email, _id: user._id});
        res.status(200).send({message: 'Check your email inbox'});

    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user.');
    }
}

async function loginUser(req, res) {
    const {password, email} = req.body;
    if (!password || !email) {
        res.status(400).send({message: "please provide email and password"});
        return;
    }
    const user = await User.findOne({email: email})
    if (!user) {
        res.status(404).send({message: "please register first"});
        return;
    }
    if (user.status === 'blocked') {
        res.status(403).send({message: "your account is blocked"});
        return;
    }
    if (user.status === 'pending') {
        res.status(401).send({message: "please verify your account via mail verification"});
        return;
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        res.status(401).send({message: "Incorrect password."});
        return;
    }

    const token = generateToken(user);
    res.status(200).send({message: "Login successful.", token: token});
}


async function verifyEmail(req, res) {
    try {
        const {userId} = req.query;
        await User.findOneAndUpdate({
            _id: userId,
            status: 'pending'
        }, {status: 'confirmed'});
        res.redirect('https://www.sport5.co.il/');
    } catch (error) {
        res.status(500).send('Error registering user.');
    }
}

/******************* HELPER FUNCTIONS *******************/

async function sendAuthEmail(user) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_SENDER_ADDRESS, // Sender's email address
            pass: process.env.EMAIL_SENDER_PASSWORD, // Sender's email password
        },
    });

    const mailContent = {
        from: `Apex Bank <${process.env.EMAIL_SENDER_ADDRESS}>`, // Set a nice "from" address
        to: user.email, // Recipient's email
        subject: 'Confirm your email address', // Subject line
        html: `
            <h1>Hello ${user.name},</h1>
            <p>Thank you for registering at Apex Bank.</p>
            <p>Please confirm your email address by clicking the link below:</p>
            <a href="http://localhost:8000/api/auth/verify?userId=${user._id}">Confirm Email</a>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>Apex Bank Team</p>
        `,
    };

    await transporter.sendMail(mailContent);
}

function generateToken(user) {
    const payload = {
        userId: user._id,
        email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET,
        { expiresIn: '1h' });

    return token;
}

module.exports = {registerUser, loginUser, verifyEmail};