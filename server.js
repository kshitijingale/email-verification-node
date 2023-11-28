const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
    },
});

app.get('/', (req, res) => {
    res.status(200).send('OK')
})

app.post('/send-email', (req, res) => {
    const { to } = req.body;
    const otp = generateOTP();
    const text = `
    Dear User,

    Thank you for registering with 100x microblogging platform. To complete your email verification, please use the following One-Time Password (OTP):

    OTP: ${otp}

    Please enter this OTP on the verification page to confirm your email address.
    `

    const mailOptions = {
        from: 'your-email@gmail.com',
        to,
        subject: "Your One-Time Password (OTP) for Email Verification",
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Email sent: ' + info.response);

            res.status(200).json({
                success: true,
                otp
            })
        }
    });
});

function generateOTP() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert to string for consistency
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
