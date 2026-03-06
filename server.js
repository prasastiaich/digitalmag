const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static directory (the magazine HTML/CSS)
app.use(express.static(path.join(__dirname)));

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // NOTE: This must be a Google App Password, not a regular password
    }
});

// Endpoint to handle form submissions
app.post('/api/send-email', async (req, res) => {
    try {
        const { name, designation, subject, message } = req.body;

        // Validation
        if (!name || !subject || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Email Content Options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: `The Variable 'H' - ${subject}`,
            text: `
You have received a new contribution form submission!

Name: ${name}
Designation: ${designation || 'Not provided'}
Subject: ${subject}

Message:
${message}
            `,
            html: `
                <h3>New Contribution Submission: The Variable 'H'</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Designation:</strong> ${designation || 'Not provided'}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <br/>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
            `
        };

        // Send Email
        await transporter.sendMail(mailOptions);
        
        // Respond to frontend
        res.status(200).json({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running. View your magazine at: http://localhost:${PORT}`);
    console.log(`Form submissions will be routed securely via Nodemailer.`);
});
