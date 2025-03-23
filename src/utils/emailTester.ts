/**
 * Email Testing Utility
 * 
 * This file contains utilities for testing email deliverability.
 * It can be used during development to verify email configurations.
 */

import { Alert } from "react-native";
import { generateVerificationEmailHTML, htmlToPlainText } from "./emailUtils";

/**
 * Sends a test email to verify configurations are working correctly
 * Returns a promise that resolves with success/failure information
 */
export const sendTestEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Generate a test code - now 6 digits like the main verification code
    const testCode = 295878; // Using 6-digit code like in the example
    
    // Generate HTML and plain text content
    const htmlContent = generateVerificationEmailHTML(testCode);
    const textContent = htmlToPlainText(htmlContent);
    
    // Send the test email using the exact configuration that worked
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "YourAppName <onboarding@ahlianak.com>",
        to: [email],
        subject: "Email Verification Code",
        html: htmlContent,
        text: textContent,
        headers: {
          "Content-Transfer-Encoding": "quoted-printable",
          "MIME-Version": "1.0",
          "Content-Type": "text/html; charset=utf-8"
        }
      }),
    });

    const data = await res.json();
    
    if (res.status === 200) {
      return { 
        success: true, 
        message: `Test email sent successfully! ID: ${data.id}` 
      };
    } else {
      return { 
        success: false, 
        message: `Error: ${data.message || "Unknown error occurred"}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `Exception: ${(error as Error).message}` 
    };
  }
};

/**
 * A simple function to analyze which inbox the email landed in
 * This requires user input since we cannot programmatically detect this
 */
export const recordEmailInboxPlacement = async (
  email: string, 
  placement: 'primary' | 'promotions' | 'spam' | 'other'
): Promise<void> => {
  try {
    // In a real implementation, you would send this data to your analytics service
    console.log(`Email to ${email} landed in ${placement} inbox`);
    
    // Example placeholder for analytics call:
    // await Analytics.trackEvent('email_placement', { email, placement });
    
    Alert.alert(
      "Thank you!",
      "Your feedback helps us improve email deliverability."
    );
  } catch (error) {
    console.error("Error recording inbox placement:", error);
  }
}; 