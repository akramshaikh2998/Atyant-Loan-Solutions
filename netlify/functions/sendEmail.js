const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    // Determine form type
    let subject, htmlContent;

    if (data.loanAmount) {
      // Loan Form
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
        <p>Regards,<br>Loan Application System</p>
      `;
    } else {
      // Contact Form
      subject = `New Contact Form Submission from ${data.name}`;
      htmlContent = `
        <h3>New Contact Form Submission</h3>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Mobile Number:</b> ${data.phone}</p>
        <p><b>Message:</b> ${data.message}</p>
      `;
    }

    // Configure transporter (use environment variables for credentials)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,       // Gmail address
        pass: process.env.PASSWORD     // App Password
      }
    });

    // Send email
    await transporter.sendMail({
      from: data.email,
      to: "akramshaikh.atyantloan@gmail.com", // Your receiving email
      subject: subject,
      html: htmlContent
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully!" })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send email", error: error.message })
    };
  }
};
