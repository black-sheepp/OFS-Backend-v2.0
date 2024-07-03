// Shared styles for all emails
export const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
  body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #edf2f4;
  }
  .container {
    width: 100%;
    max-width: 700px;
    margin: 20px auto;
    background-color: #ffffff;
    border-radius: 0px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  .header {
    background-color: #0d3b66; /* Always red */
    color: #ffffff;
    padding: 18px;
    text-align: center;
  }
  .header h1 {
    margin: 0;
    font-size: 24px; /* Increased font size for better readability */
  }
  .content {
    padding: 20px;
  }
  .footer {
    padding: 14px;
    text-align: left;
    color: #000000;
  }
  .footer p {
    margin: 0;
    font-size: 14px; /* Increased font size for better readability */
  }
`;

// Function to generate HTML for details
export const generateDetailsHtml = (details: { label: string; value: string }[]) => {
	return details.map((detail) => `<p><strong>${detail.label}:</strong> ${detail.value}</p>`).join("");
};
