import { generateDetailsHtml, sharedStyles } from "../shared";


export const generatePasswordChangedHtml = (
	greeting: string,
	intro: string,
	details: { label: string; value: string }[],
	footer: string
): string => {
	const detailsHtml = generateDetailsHtml(details);
	return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        ${sharedStyles}
        .header {
          background-color: #ff5722;
          color: #ffffff;
          padding: 20px;
          text-align: center;
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
          <p>&copy; ${new Date().getFullYear()} | OFS</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
