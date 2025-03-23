import { Alert } from "react-native";

export const callEmailVerifyFunction = async (email: string, handleSubmit: ((arg0: number) => void) | undefined) => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "YourAppName <verification@ahlianak.com>",
          to: [email],
          subject: "Your Email Verification Code",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Verification</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  max-width: 600px;
                  margin: 0 auto;
                }
                .container {
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 5px;
                }
                .header {
                  text-align: center;
                  padding-bottom: 20px;
                  border-bottom: 1px solid #eeeeee;
                }
                .content {
                  padding: 20px 0;
                }
                .verification-code {
                  font-size: 32px;
                  font-weight: bold;
                  text-align: center;
                  color: #4285f4;
                  padding: 15px;
                  margin: 20px 0;
                  letter-spacing: 5px;
                }
                .footer {
                  font-size: 12px;
                  color: #999999;
                  text-align: center;
                  padding-top: 20px;
                  border-top: 1px solid #eeeeee;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Email Verification</h2>
                </div>
                <div class="content">
                  <p>Hello,</p>
                  <p>Thank you for signing up. Please enter the following verification code to complete your registration:</p>
                  <div class="verification-code">${randomCode}</div>
                  <p>This code will expire in 30 minutes. If you didn't request this code, please ignore this email.</p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} YourAppName. All rights reserved.</p>
                  <p>This is an automated message, please do not reply to this email.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });
  
      const data = await res.json();
      console.log("data", data);
      if (res.status === 200) {
        handleSubmit && handleSubmit(randomCode);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  };
  