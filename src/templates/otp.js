export const otpHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ffffff; /* White background */
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff; /* White container background */
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border: 1px solid #e0e0e0; /* Light border for contrast */
        }
        h1 {
            color:rgb(0, 0, 0); /* Green color for the heading */
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            color: #555555; /* Dark gray for text */
            font-size: 16px;
            line-height: 1.6;
            text-align: center;
        }
        .otp {
            font-size: 28px;
            font-weight: bold;
            color:rgb(0, 0, 0); /* Green color for the OTP */
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            background-color: #f0fff4; /* Light green background for OTP */
            border-radius: 5px;
            display: inline-block;
            width: 100%;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #777777; /* Light gray for footer text */
            font-size: 14px;
        }
        .footer a {
            color:rgb(0, 0, 0); /* Green color for links */
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <div class="otp">{{otp}}</div>
        <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        <div class="footer">
            <p>If you did not request this OTP, please ignore this email.</p>
            <p>Need help? <a href="mailto:support@example.com">Contact support</a></p>
        </div>
    </div>
</body>
</html>
`



