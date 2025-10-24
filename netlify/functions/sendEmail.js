const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let subject, htmlContent;

    // 🧾 Loan Form Email
    if (data.loanAmount) {
      subject = `📩 New Personal Loan Application from ${data.name}`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color:#0066cc;">🏦 Atyant Loan Solutions - New Loan Application</h2>
          <p><b>Submitted on:</b> ${new Date().toLocaleString()}</p>
          <hr>
          <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width:100%;">
            <tr><th align="left">👤 Full Name</th><td>${data.name}</td></tr>
            <tr><th align="left">🎂 Date of Birth</th><td>${data.dob}</td></tr>
            <tr><th align="left">📧 Email</th><td>${data.email}</td></tr>
            <tr><th align="left">📞 Phone</th><td>${data.phone}</td></tr>
            <tr><th align="left">🏙️ City</th><td>${data.city}</td></tr>
            <tr><th align="left">📮 Pincode</th><td>${data.pincode}</td></tr>
            <tr><th align="left">🏢 Company</th><td>${data.company}</td></tr>
            <tr><th align="left">💵 Loan Amount</th><td>${data.loanAmount} INR</td></tr>
            <tr><th align="left">⏳ Loan Term</th><td>${data.loanTerm} Years</td></tr>
            <tr><th align="left">💼 Employment Status</th><td>${data.employmentStatus}</td></tr>
            <tr><th align="left">💰 Monthly Income</th><td>${data.monthlyIncome} INR</td></tr>
            <tr><th align="left">🗒️ Notes</th><td>${data.message || "N/A"}</td></tr>
            <tr><th align="left">📜 Terms Accepted</th><td>${data.termsAccepted ? "✅ Yes" : "❌ No"}</td></tr>
          </table>
          <br>
          <p>Best Regards,<br><b>Atyant Loan Solutions</b></p>
        </div>
      `;
    } else {
      // 📞 Contact form fallback
      subject = `📩 New Contact Inquiry from ${data.name}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color:#0066cc;">📞 Atyant Loan Solutions - Contact Form</h2>
          <p><b>Submitted on:</b> ${new Date().toLocaleString()}</p>
          <hr>
          <p><b>Name:</b> ${data.name}</p>
          <p><b>Email:</b> ${data.email}</p>
          <p><b>Phone:</b> ${data.phone}</p>
          <p><b>Message:</b><br>${data.message}</p>
          <br>
          <p>Best Regards,<br><b>Website Contact Form</b></p>
        </div>
      `;
    }

    // ✉️ Send the email (CC applicant)
    await transporter.sendMail({
      from: `"Atyant Loan Solutions" <${process.env.EMAIL}>`,
      to: process.env.EMAIL, // Admin
      cc: data.email, // CC the applicant
      subject,
      html: htmlContent,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Email sent successfully!",
      }),
    };
  } catch (error) {
    console.error("Email error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message || "Internal Server Error",
      }),
    };
  }
};
