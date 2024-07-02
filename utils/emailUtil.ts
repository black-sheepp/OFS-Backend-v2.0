// utils/emailUtil.ts
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text }: { to: string, subject: string, text: string }) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail", // You can use any email service
        auth: {
            user: "your-email@gmail.com",
            pass: "your-email-password"
        }
    });

    const mailOptions = {
        from: "your-email@gmail.com",
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
};
