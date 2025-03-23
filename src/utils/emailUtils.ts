/**
 * Email utilities to improve deliverability
 */

/**
 * Creates a plain text version of HTML content by removing tags
 * This helps with email deliverability as many email clients prefer both HTML and plain text
 */
export const htmlToPlainText = (html: string): string => {
  // Remove HTML tags
  let text = html.replace(/<\/?[^>]+(>|$)/g, " ");
  
  // Fix spacing issues
  text = text.replace(/\s+/g, " ");
  
  // Trim extra whitespace
  text = text.trim();
  
  return text;
};

/**
 * Generates the HTML template for verification emails
 * Using a beautiful, responsive design that improves deliverability
 */
export const generateVerificationEmailHTML = (code: number): string => {
  // Convert code to string with proper spacing for readability
  const codeStr = code.toString().padStart(6, '0');
  
  // Beautiful HTML template with proper structure for email clients
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 40px 30px; text-align: center; background-color: #4A90E2; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Email Verification</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333333; font-size: 16px; line-height: 24px; margin-bottom: 30px;">Thank you for registering! Please use the verification code below to verify your email address:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px dashed #dddddd;">
          <h2 style="font-size: 32px; letter-spacing: 5px; margin: 0; color: #333333; font-family: 'Courier New', monospace;">${codeStr}</h2>
        </div>
        <p style="color: #666666; font-size: 14px; line-height: 21px; margin-top: 30px;">This code will expire in 30 minutes. If you didn't request this verification, you can safely ignore this email.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 30px; text-align: center; background-color: #f5f5f5; color: #777777; font-size: 12px; border-radius: 0 0 8px 8px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} YourAppName. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">This is an automated email, please do not reply.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Generates the HTML template for password reset emails
 */
export const generatePasswordResetEmailHTML = (resetLink: string): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 40px 30px; text-align: center; background-color: #4A90E2; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Password Reset</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333333; font-size: 16px; line-height: 24px; margin-bottom: 30px;">We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4A90E2; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #666666; font-size: 14px; line-height: 21px; margin-top: 30px;">If you didn't request a password reset, you can safely ignore this email. This link will expire in 30 minutes.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 30px; text-align: center; background-color: #f5f5f5; color: #777777; font-size: 12px; border-radius: 0 0 8px 8px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} YourAppName. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">This is an automated email, please do not reply.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Checks if an email address appears to be valid
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}; 