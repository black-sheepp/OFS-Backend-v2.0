import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface EmailData {
	to: string;
	subject: string;
	greeting: string;
	intro: string;
	details: { label: string; value: string }[];
	footer: string;
}

export const sendEmail = async ({ to, subject, greeting, intro, details, footer }: EmailData) => {
	const transporter = nodemailer.createTransport({
		service: process.env.NODEMAILER_SERVICE,
		auth: {
			user: process.env.NODEMAILER_EMAIL,
			pass: process.env.NODEMAILER_PASSWORD,
		},
	});

	const detailsHtml = details.map((detail) => `<p><strong>${detail.label}:</strong> ${detail.value}</p>`).join("");

	const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        body {
          font-family: 'Roboto', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f3f4f6;
          color: #333;
        }
        .container {
          width: 100%;
          max-width: 800px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background-color: #6a67ce;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
        }
        .content {
          padding: 20px;
        }
        .content h1 {
          font-size: 18px;
          color: #4a4a4a;
        }
        .content h2 {
          font-size: 16px;
          color: #6a67ce;
          margin-bottom: 10px;
        }
        .content p {
          font-size: 14px;
          line-height: 1.6;
          color: #555555;
        }
        .details p {
          font-size: 14px;
          margin: 8px 0;
          color: #333333;
        }
        .footer {
          padding: 20px;
          background-color: #f3f4f6;
          text-align: center;
          color: #777777;
        }
        .footer p {
          margin: 0;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>OFS</h1>
        </div>
        <div class="content">
          <h1>${greeting}</h1>
          <h2>${subject}</h2>
          <p>${intro}</p>
          <div class="details">
            ${detailsHtml}
          </div>
        </div>
        <div class="footer">
          <p>${footer}</p>
          <p>&copy; ${new Date().getFullYear()} OFS</p>
        </div>
      </div>
    </body>
    </html>
  `;

	const mailOptions = {
		from: process.env.NODEMAILER_EMAIL,
		to,
		subject,
		html: htmlContent,
	};

	await transporter.sendMail(mailOptions);
};
