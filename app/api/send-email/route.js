import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const body = await request.text();
        const params = new URLSearchParams(body);
        const name = params.get('name');
        const designation = params.get('designation');
        const subject = params.get('subject');
        const message = params.get('message');

        if (!name || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
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
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
