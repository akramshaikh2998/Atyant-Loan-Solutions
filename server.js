const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create transporter using Gmail + App Password
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,       // your Gmail
        pass: process.env.PASSWORD     // App Password
    }
});

// Route for contact form
app.post("/send-email", async (req, res) => {
    const data = req.body;

    // Determine if this is loan form or contact form
    let subject, htmlContent;

    if (data.loanAmount) {
        // Loan form
        subject = `New Loan Application from ${data.name}`;
        htmlContent = `
            <h3>New Loan Application Submitted</h3>
            <table border="1" cellpadding="5" cellspacing="0">
                <tr><th>Full Name</th><td>${data.name}</td></tr>
                <tr><th>Date of Birth</th><td>${data.dob}</td></tr>
                <tr><th>Email</th><td>${data.email}</td></tr>
                <tr><th>Phone</th><td>${data.phone}</td></tr>
                <tr><th>Loan Amount</th><td>${data.loanAmount} INR</td></tr>
                <tr><th>Loan Term</th><td>${data.loanTerm} Years</td></tr>
                <tr><th>Employment Status</th><td>${data.employmentStatus}</td></tr>
                <tr><th>Monthly Income</th><td>${data.monthlyIncome} INR</td></tr>
            </table>
            <br>
            <p>Regards,<br>Loan Application System</p>
        `;
    } else {
        // Contact form
        subject = `New Contact Form Submission from ${data.name}`;
        htmlContent = `
            <p><b>Name:</b> ${data.name}</p>
    <p><b>Email:</b> ${data.email}</p>
    <p><b>Mobile Number:</b> ${data.phone}</p>
    <p><b>Message:</b> ${data.message}</p>
        `;
    }

    const mailOptions = {
        from: data.email,
        to: "akramshaikh.atyantloan@gmail.com", // your receiving email
        subject: subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send email", error });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
