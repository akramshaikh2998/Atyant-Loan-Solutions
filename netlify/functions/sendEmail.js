const nodemailer = require("nodemailer");
const formidable = require("formidable");
const fs = require("fs");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Parse multipart/form-data using formidable
  const form = formidable({ multiples: true });

  const parseForm = () =>
    new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

  try {
    const { fields, files } = await parseForm();

    // Create transporter using Gmail + App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // Email content
    const subject = `New Loan Application from ${fields.name}`;
    let htmlContent = `
      <h3>New Loan Application Submitted</h3>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr><th>Full Name</th><td>${fields.name}</td></tr>
        <tr><th>Date of Birth</th><td>${fields.dob}</td></tr>
        <tr><th>Email</th><td>${fields.email}</td></tr>
        <tr><th>Phone</th><td>${fields.phone}</td></tr>
        <tr><th>City</th><td>${fields.city}</td></tr>
        <tr><th>Pincode</th><td>${fields.pincode}</td></tr>
        <tr><th>Company Name</th><td>${fields.company}</td></tr>
        <tr><th>Loan Amount</th><td>${fields.loanAmount} INR</td></tr>
        <tr><th>Loan Term</th><td>${fields.loanTerm} Years</td></tr>
        <tr><th>Employment Status</th><td>${fields.employmentStatus}</td></tr>
        <tr><th>Monthly Income</th><td>${fields.monthlyIncome} INR</td></tr>
      </table>
      <br>
      <p>Regards,<br>Loan Application System</p>
    `;

    // Prepare attachments if any files uploaded
    const attachments = [];
    if (files.documents) {
      const uploadedFiles = Array.isArray(files.documents)
        ? files.documents
        : [files.documents];

      for (const file of uploadedFiles) {
        attachments.push({
          filename: file.originalFilename,
          path: file.filepath,
        });
      }
    }

    const mailOptions = {
      from: fields.email,
      to: "akramshaikh.atyantloan@gmail.com", // your receiving email
      subject,
      html: htmlContent,
      attachments,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully!" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send email", error: error.toString() }),
    };
  }
};
