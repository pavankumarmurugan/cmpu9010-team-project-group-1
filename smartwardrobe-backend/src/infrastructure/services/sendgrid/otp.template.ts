import { capitalize } from 'lodash';

export const emailHtml = (username: string, otp: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 10px 0;
      border-bottom: 1px solid #ddd;
    }
    .header h1 {
      color: #000; /* Changed to black */
      font-size: 24px;
      margin: 0;
    }
    .body {
      padding: 20px;
      text-align: center;
    }
    .body p {
      font-size: 16px;
      margin: 10px 0;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #4CAF50;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #888;
    }
    .footer a {
      color: #4CAF50;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>SmartWardrobe</h1> <!-- Text in black -->
    </div>
    <div class="body">
      <p>Hi ${capitalize(username)},</p>
      <p>Use the following OTP to reset your password:</p>
      <p class="otp">${otp}</p>
      <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>Need help? <a href="mailto:smartwardrobe.store@gmail.com">Contact Support</a></p>
    </div>
  </div>
</body>
</html>
`;
