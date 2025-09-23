const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Parse JSON body
    const data = JSON.parse(event.body);

    // Create transporter using Gmail + App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,   // Gmail in Netlify Environment Variables
        pass: process.env.PASSWORD // Gmail App Password
      }
    });

    let subject, htmlContent;

    if (data.loanAmount) {
      // Loan Application Email
      subject = `New Loan Application from ${data.name}`;
      htmlContent = `
        <h3>New Loan Application Submitted</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr><th>Full Name</th><td>${data.name}</td></tr>
          <tr><th>Date of Birth</th><td>${data.dob}</td></tr>
          <tr><th>Email</th><td>${data.email}</td></tr>
          <tr><th>Phone</th><td>${data.phone}</td></tr>
          <tr><th>City</th><td>${data.city}</td></tr>
          <tr><th>Pincode</th><td>${data.pincode}</td></tr>
          <tr><th>Company Name</th><td>${data.company}</td></tr>
          <tr><th>Loan Amount</th><td>${data.loanAmount} INR</td></tr>
          <tr><th>Loan Term</th><td>${data.loanTerm} Years</td></tr>
          <tr><th>Employment Status</th><td>${data.employmentStatus}</td></tr>
          <tr><th>Monthly Income</th><td>${data.monthlyIncome} INR</td></tr>
        </table>
        <br>
        <p>Regards,<br>Loan Application System</p>
      `;
    } else {
      // Contact Form Email
      subject = `New Contact Message from ${data.name}`;
      htmlContent = `
        <h3>New Contact Form Submission</h3>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone || "N/A"}</p>
        <p><b>Message:</b> ${data.message}</p>
        <br>
        <p>Regards,<br>Website Contact Form</p>
      `;
    }

    const mailOptions = {
      from: data.email,
      to: "akramshaikh.atyantloan@gmail.com", // your receiving email
      subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully!" })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send email", error: error.toString() })
    };
  }
};
