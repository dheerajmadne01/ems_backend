// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // Only verify SMTP connection in production to avoid blocking local development
// if (process.env.NODE_ENV === "production") {
//     transporter.verify((error, success) => {
//         if (error) {
//             console.log("SMTP Error:", error);
//         } else {
//             console.log("SMTP Server ready");
//         }
//     });
// } else {
//     console.log("Skipping SMTP verify (NODE_ENV!=production)");
// }

// export const sendMail = async (to: string, subject: string, html: string) => {
//     try {
//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to,
//             subject,
//             html,
//         });
//         return true;
//     } catch (error: any) {
//         console.log("Mail Error:", error.message);
//         return false;
//     }
// };

import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL as string,
        name: "Employee Management System",   // 👈 optional
      },
      subject,
      html,
    };

    await sgMail.send(msg);
    return true;
  } catch (error: any) {
    console.log("SENDGRID ERROR:", error?.response?.body || error.message);
    return false;
  }
};
