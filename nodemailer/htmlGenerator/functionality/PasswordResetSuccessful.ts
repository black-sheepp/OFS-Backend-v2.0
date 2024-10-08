import { generateDetailsHtml, sharedStyles } from "../shared";

export const generatePasswordResetSuccessfulHtml = (greeting: string, intro: string, details: { label: string; value: string }[], footer: string): string => {
  const detailsHtml = generateDetailsHtml(details);
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        ${sharedStyles}
        .content h2 {
            font-size: 18px; /* Increased font size for better readability */
            margin-bottom: 10px;
            color: #00f59b;
        }
        .content p {
          font-size: 14px; /* Increased font size for better readability */
          line-height: 1.6;
          color: #000000;
        }
        .details p {
          font-size: 14px; /* Increased font size for better readability */
          margin: 8px 0;
          color: #000000;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>OFS</h1>
        </div>
        <div class="content">
          <h2>${greeting}</h2>
          <p>${intro}</p>
          <div class="details">
            ${detailsHtml}
          </div>
        </div>
        <div class="footer">
          <p>${footer}</p>
       <br/>
          <P>Sincerely,</p>
          <P>Online Fashion Store</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
