export const applicationEmailTemplate = ({ applicantName, jobTitle, companyName, status }) => {
    const statusClass = status === "accepted" ? "accepted" : "rejected";

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Job Application Status</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                background: #f9f9f9;
            }
            h2 {
                color: #4CAF50;
            }
            .status {
                font-weight: bold;
                color: #d9534f;
            }
            .accepted {
                color: #28a745;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Job Application Update</h2>
            <p>Dear ${applicantName},</p>
            <p>Your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been 
                <span class="status ${statusClass}">${status}</span>.
            </p>
            <p>Thank you for your interest in joining us.</p>
            <p>Best regards,<br>${companyName}</p>
            <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>`;
};
