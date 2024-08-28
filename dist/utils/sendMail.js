// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
// async function sendEmail(email: string, verificationCode: string) {
//   console.log("Sending verification email to:", email);
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Verify your SkillSnap Account",
//     text: `Your verification code is: ${verificationCode}`, // Corrected syntax
//   };
//   try {
//     const Transporter = await transporter.sendMail(mailOptions);
//     console.log("Verification email sent:", Transporter.response);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Email could not be sent");
//   }
// }
// export default sendEmail;
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    host: "smtp.zeptomail.in",
    port: 587, // TLS port
    secure: false,
    auth: {
        user: process.env.ZEPTOMAIL_USER,
        pass: process.env.ZEPTOMAIL_API_KEY,
    },
});
async function sendEmail(email, verificationCode) {
    console.log("Sending verification email to:", email);
    const mailOptions = {
        from: process.env.ZEPTOMAIL_SENDER,
        to: email,
        subject: "Verify your SkillSnap Account",
        text: `Your verification code is: ${verificationCode}`,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", info.response);
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email could not be sent");
    }
}
export default sendEmail;
