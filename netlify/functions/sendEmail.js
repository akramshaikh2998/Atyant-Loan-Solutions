const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const data = JSON.parse(event.body);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: data.email,
    to: process.env.EMAIL,  // your receiving email
    subject: data.loanAmount ? `Loan Application from ${data.name}` : `Contact Form from ${data.name}`,
    html: data.loanAmount 
        ? `<p>Name: ${data.name}</p><p>Email: ${data.email}</p><p>Loan Amount: ${data.loanAmount}</p>`
        : `<p>Name: ${data.name}</p><p>Email: ${data.email}</p><p>Message: ${data.message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return { statusCode: 200, body: JSON.stringify({ message: "Email sent successfully!" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: "Failed to send email", error: err.message }) };
  }
};
