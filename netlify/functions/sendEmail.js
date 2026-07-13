const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
// ===============================
// PAN VALIDATION
// ===============================

function validatePAN(pan) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
}

// ===============================
// NETLIFY FUNCTION
// ===============================

exports.handler = async (event) => {

  // ===============================
  // METHOD CHECK
  // ===============================

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        success: false,
        error: "Method Not Allowed"
      })
    };
  }

  try {

    // ===============================
    // READ JSON DATA
    // ===============================

    const data = JSON.parse(event.body || "{}");

    // ===============================
// APPLICATION NUMBER
// ===============================

const applicationNo =
  "ATL-" +
  new Date().getFullYear() +
  String(Date.now()).slice(-8);

    console.log("📥 DATA RECEIVED:", data);

    // ===============================
    // REQUIRED FIELD VALIDATION
    // ===============================

    if (!data.name || !data.phone || !data.loanAmount) {

      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Missing required fields"
        })
      };

    }

    // ===============================
    // PAN VALIDATION
    // ===============================

    const pan = (data.pan || "").toUpperCase();

    if (!validatePAN(pan)) {

      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Invalid PAN Number"
        })
      };

    }

    // ===============================
    // ATTACHMENT VALIDATION
    // ===============================

    if (data.attachment) {

      const allowedTypes = [

        "application/pdf",

        "image/jpeg",

        "image/jpg",

        "image/png",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "application/vnd.ms-excel",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

      ];

      if (
        !data.attachment.fileName ||
        !data.attachment.fileType ||
        !data.attachment.content
      ) {

        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: "Invalid attachment."
          })
        };

      }

      // const fileBuffer = Buffer.from(
      //   data.attachment.content,
      //   "base64"
      // );
      let fileBuffer;

try {

    fileBuffer = Buffer.from(
        data.attachment.content,
        "base64"
    );

} catch {

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

        statusCode:400,

        body:JSON.stringify({

            success:false,

            error:"Invalid attachment."

        })

    };

}

      const fileSize = fileBuffer.length;

      if (fileSize > (4 * 1024 * 1024)) {

        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: "Maximum file size allowed is 4 MB."
          })
        };

      }

      if (!allowedTypes.includes(data.attachment.fileType)) {

        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: "Unsupported file type."
          })
        };

      }

    }

    // ===============================
    // ENVIRONMENT VARIABLES
    // ===============================

    if (!process.env.EMAIL || !process.env.PASSWORD) {

      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: "Email configuration missing."
        })
      };

    }

    // ===============================
    // NODEMAILER TRANSPORTER
    // ===============================

// ===============================
// DEBUG ENV VARIABLES
// ===============================

console.log("========== SMTP DEBUG ==========");
console.log("EMAIL:", process.env.EMAIL);
console.log("PASSWORD EXISTS:", !!process.env.PASSWORD);
console.log(
  "PASSWORD LENGTH:",
  process.env.PASSWORD ? process.env.PASSWORD.length : 0
);
console.log("================================");
    
    const transporter = nodemailer.createTransport({

      // service: "gmail",

      // auth: {

      //   user: process.env.EMAIL,

      //   pass: process.env.PASSWORD

      // }

      

      host:"smtp.gmail.com",

port:465,

secure:true,

auth:{
    user:process.env.EMAIL,
    pass:process.env.PASSWORD
}

    });

    await transporter.verify();

    // ===== EMAIL HTML STARTS HERE =====

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

${data.obligations.map(o=>`
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

<h3>📝 Additional Details</h3>

<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">

<tr>
<th align="left">Notes</th>
<td>${data.message || "N/A"}</td>
</tr>

<tr>
<th align="left">Terms Accepted</th>
<td>${data.termsAccepted ? "Yes" : "No"}</td>
</tr>

</table>

<br>

${data.attachment ? `
<hr>

<h3>📎 Uploaded Document</h3>

<p>

<b>Filename:</b> ${data.attachment.fileName}

</p>

` : ""}

<p style="font-size:12px;color:#777;">
Auto-generated loan application email
</p>

</div>
`;
// ======================================================
// PREPARE EMAIL
// ======================================================

const mailOptions = {

  // from: `"Atyant Loan Solutions" <${process.env.EMAIL}>`,
  from:{
    name:"Atyant Loan Solutions",
    address:process.env.EMAIL
},

  to: process.env.EMAIL,

  // subject: `📩 New Loan Application - ${data.name}`,

  subject: `Loan Application | ${data.name} | ${data.loanType}`,

  html: htmlContent

};

// ======================================================
// ADD ATTACHMENT (OPTIONAL)
// ======================================================

if (data.attachment) {

  mailOptions.attachments = [

    {

      filename: data.attachment.fileName,

      content: Buffer.from(
        data.attachment.content,
        "base64"
      ),

      contentType: data.attachment.fileType

    }

  ];

}

// ======================================================
// SEND EMAIL
// ======================================================

await transporter.sendMail(mailOptions);

// ======================================================
// SEND RECEIPT TO APPLICANT
// ======================================================

if (data.email) {

  const customerMail = {

    from: {
      name: "Atyant Loan Solutions",
      address: process.env.EMAIL
    },

    to: data.email,

    subject: `Application Received | ${data.loanType}`,

    html: `
    <div style="font-family:Arial,sans-serif;color:#333;line-height:1.6">

      <h2 style="color:#0284c7;">
        Thank You for Applying
      </h2>

      <p>Dear <b>${data.name}</b>,</p>

      <p>
        We have successfully received your loan application.
      </p>

      <p>
        Our team will review your application and contact you shortly.
      </p>

      <hr>

      <h3>Your Submitted Details</h3>

      ${htmlContent}

      <hr>

      <p>
        Thank you for choosing
        <b>Atyant Loan Solutions</b>.
      </p>

      <p>
        This is an automated acknowledgement email.
      </p>

    </div>
    `

  };

  // Attach uploaded document (optional)
  if (mailOptions.attachments) {
    customerMail.attachments = mailOptions.attachments;
  }

  await transporter.sendMail(customerMail);

}

console.log("✅ Email sent successfully.");

if (data.attachment) {
    console.log("📎 Attachment:", data.attachment.fileName);
}

// ======================================================
// EMAIL SENT SUCCESSFULLY
// ======================================================

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
  await fetch(
    `https://api.callmebot.com/whatsapp.php?phone=91XXXXXXXXXX&text=${encodeURIComponent(
      whatsappMessage
    )}&apikey=YOUR_API_KEY`
  );
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
