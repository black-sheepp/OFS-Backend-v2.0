// Shared styles for all emails
export const sharedStyles = `
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
  .header h1 {
    margin: 0;
    font-size: 22px;
  }
  .content {
    padding: 20px;
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
`;

// Function to generate HTML for details
export const generateDetailsHtml = (details: { label: string; value: string }[]) => {
	return details.map((detail) => `<p><strong>${detail.label}:</strong> ${detail.value}</p>`).join("");
};
