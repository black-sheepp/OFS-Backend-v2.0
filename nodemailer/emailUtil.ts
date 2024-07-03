import nodemailer from 'nodemailer'; // Import nodemailer for sending emails
import dotenv from 'dotenv'; // Import dotenv for environment variable management
import { generateHtmlContent } from './htmlGenerator';
import { EmailData } from '../utils/interface';
dotenv.config(); // Load environment variables from .env file

// Function to send an email
export const sendEmail = async ({ to, subject, greeting, intro, details, footer, type }: EmailData) => {
	const transporter = nodemailer.createTransport({
		// Create a transporter using the service and authentication details from environment variables
		service: process.env.NODEMAILER_SERVICE,
		auth: {
			user: process.env.NODEMAILER_EMAIL_SENDER,
			pass: process.env.NODEMAILER_PASSWORD,
		},
	});

	// Generate the HTML content for the email
	const htmlContent = generateHtmlContent({ greeting, intro, details, footer, type });

	const mailOptions = {
		from: process.env.NODEMAILER_EMAIL_SENDER, // Sender email address
		to, // Recipient email address
		subject, // Subject of the email
		html: htmlContent, // HTML content of the email
	};

	// Send the email using the transporter
	await transporter.sendMail(mailOptions);
};
