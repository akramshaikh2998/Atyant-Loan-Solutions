const nodemailer = require("nodemailer");

// ===== PAN VALIDATION =====
function validatePAN(pan) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
}

exports.handler = async (event) => {

  // ===== METHOD CHECK =====
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: "Method Not Allowed" }),
    };
  }

  try {

    const data = JSON.parse(event.body || "{}");

    console.log("📥 DATA RECEIVED:", data);

    // ===== REQUIRED VALIDATION =====
    if (!data.name || !data.phone || !data.loanAmount) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Missing required fields",
        }),
      };
    }

    // ===== PAN VALIDATION =====
    const pan = (data.pan || "").toUpperCase();

    if (!validatePAN(pan)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Invalid PAN Number",
        }),
      };
    }

    // ===== ENV CHECK =====
    if (!process.env.EMAIL || !process.env.PASSWORD) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: "Email config missing in Netlify ENV",
        }),
      };
    }

    // ===== EMAIL CONFIG =====
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.verify();

    // ===== EMAIL HTML (FULL DETAILS) =====
    const htmlContent = `
    <div style="font-family: Arial; color:#333;">

    <h2 style="color:#0284c7;">📩 New Loan Application</h2>

    <!-- PERSONAL DETAILS -->
    <h3>👤 Personal Details</h3>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">
    <tr><th align="left">Full Name</th><td>${data.name}</td></tr>
    <tr><th align="left">PAN</th><td>${pan}</td></tr>
    <tr><th align="left">DOB</th><td>${data.dob || "-"}</td></tr>
    <tr><th align="left">Email</th><td>${data.email || "-"}</td></tr>
    <tr><th align="left">Phone</th><td>${data.phone}</td></tr>
    <tr><th align="left">Address</th><td>${data.address || "-"}</td></tr>
    <tr><th align="left">City</th><td>${data.city || "-"}</td></tr>
    <tr><th align="left">Pincode</th><td>${data.pincode || "-"}</td></tr>
    </table>

    <br>

    <!-- LOAN DETAILS -->
    <h3>🏦 Loan Details</h3>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">
    <tr><th align="left">Company Name</th><td>${data.company || "-"}</td></tr>
    <tr><th align="left">Loan Amount</th><td>₹${data.loanAmount}</td></tr>
    <tr><th align="left">Loan Tenure</th><td>${data.loanTerm || "-"}</td></tr>
    <tr><th align="left">Employment Status</th><td>${data.employmentStatus || "-"}</td></tr>
    <tr><th align="left">Monthly Income</th><td>₹${data.monthlyIncome || "-"}</td></tr>
    <tr><th align="left">Loan Type</th><td>${data.loanType || "-"}</td></tr>
    </table>

    <br>

    <!-- OBLIGATIONS -->
    ${
      (data.obligations && data.obligations.length > 0) ? `
      <h3>📊 Obligations</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">
      <tr>
      <th>Bank Name</th>
      <th>Loan Type</th>
      <th>EMI</th>
      <th>Total Loan</th>
      <th>Paid EMI</th>
      <th>Pending EMI</th>
      <th>Outstanding</th>
      </tr>

      ${data.obligations.map(o => `
      <tr>
      <td>${o.bank || "-"}</td>
      <td>${o.loanType || "-"}</td>
      <td>₹${o.emi || "-"}</td>
      <td>₹${o.totalLoan || "-"}</td>
      <td>${o.paid || "-"}</td>
      <td>${o.pending || "-"}</td>
      <td>₹${o.outstanding || "-"}</td>
      </tr>
      `).join("")}

      </table>
      <br>
      ` : "<p>No Obligations</p>"
    }

    <!-- ADDITIONAL -->
    <h3>📝 Additional Details</h3>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">
    <tr><th align="left">Notes</th><td>${data.message || "N/A"}</td></tr>
    <tr><th align="left">Terms Accepted</th><td>${data.termsAccepted ? "Yes" : "No"}</td></tr>
    </table>

    <br>

    <p style="font-size:12px;color:#777;">
    Auto-generated loan application email
    </p>

    </div>
    `;

    // ===== SEND EMAIL =====
    await transporter.sendMail({
      from: `"Atyant Loan Solutions" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      subject: `📩 New Loan Application - ${data.name}`,
      html: htmlContent,
    });

    // ===== WHATSAPP SUMMARY =====
    const whatsappMessage = `
📩 New Loan Application

👤 ${data.name}
📞 ${data.phone}
💰 ₹${data.loanAmount}
🏦 ${data.loanType}
📍 ${data.city}

📊 Obligations: ${data.obligations?.length || 0}

📧 Full details sent on Email
`;

    try {
      await fetch(`https://api.callmebot.com/whatsapp.php?phone=91XXXXXXXXXX&text=${encodeURIComponent(whatsappMessage)}&apikey=YOUR_API_KEY`);
    } catch (err) {
      console.log("WhatsApp failed (ignored)");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
    };

  } catch (error) {

    console.error("❌ ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message || "Internal Server Error",
      }),
    };
  }
};
