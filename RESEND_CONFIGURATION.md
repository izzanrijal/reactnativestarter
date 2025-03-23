# Resend.com Email Configuration Guide

This guide provides specific instructions for configuring your Resend.com account to ensure optimal email deliverability.

## 1. Verify Your Domain in Resend (Enhanced Process)

1. Log in to your Resend account at [dashboard.resend.com](https://dashboard.resend.com)
2. Navigate to "Domains" in the left sidebar
3. Click "Add Domain"
4. Enter your domain (e.g., `ahlianak.com`)
5. Follow the provided instructions to add the necessary DNS records:
   - TXT record for domain verification
   - DKIM record for email authentication
   - SPF record if not already set up
   - MX records if you want to receive emails on this domain
6. **Important**: Verify all DNS records using tools like MX Toolbox after adding them
7. Consider using a subdomain specifically for transactional emails (e.g., `mail.ahlianak.com` or `verify.ahlianak.com`)

### Subdomain Strategy for Improved Deliverability

Using a subdomain for email sending helps protect your main domain's reputation:

1. Create a subdomain like `mail.yourdomain.com` or `verify.yourdomain.com`
2. Set up all DNS records (SPF, DKIM, DMARC) specifically for this subdomain
3. Use this subdomain in the "From" address of your emails

## 2. Set Up a Sending Identity (Advanced Configuration)

1. Go to "Sending" → "Sending Identities" in Resend
2. Click "Create Sending Identity"
3. Use a recognizable "From" name that matches your brand
4. For the email address, use a domain-specific address:
   - `noreply@yourdomain.com` (less ideal)
   - `verification@yourdomain.com` (better)
   - `team@yourdomain.com` (best if you can monitor replies)
5. Avoid generic addresses like `info@` or `admin@` which are often targeted by spam filters
6. Add a reply-to address that's actively monitored to improve engagement metrics

## 3. API Key and Email Authentication

1. In Resend, go to "API Keys" in the sidebar
2. Create a new API key or use an existing one
3. Copy the API key value
4. Update your React Native app's `.env` file:
   ```
   EXPO_PUBLIC_RESEND_API_KEY=your_api_key_here
   ```
5. Make sure not to commit your API key to public repositories
6. Implement rate limiting in your application to prevent abuse
7. Implement email validation before sending to reduce bounces

## 4. Advanced Email Configuration for Gmail/Inbox Placement

The email header configuration in your updated code is critical for deliverability:

- **Message-ID**: Ensures each email has a unique identifier
- **X-Entity-Ref-ID**: Helps track emails across systems
- **List-Unsubscribe**: Critical for Gmail and other providers (improves placement)
- **Feedback-ID**: Helps with email tracking and analytics
- **X-Priority** and **Importance**: Flags the email as important (use sparingly)
- **Reply-To**: Encourages engagement by providing a way to respond

Additional header improvements to consider:
- Add a `Return-Path` that matches your sending domain
- Include `Date` header with the correct timestamp
- Add `MIME-Version: 1.0` header

## 5. Email Content Best Practices

1. **HTML Structure**:
   - Use proper DOCTYPE and HTML tags
   - Keep table-based layouts for maximum compatibility
   - Test with email preview tools like Litmus or Email on Acid
   - Maintain a text-to-HTML ratio above 60:40

2. **Subject Lines**:
   - Keep between 30-50 characters
   - Avoid ALL CAPS, excessive punctuation (!!!, ???)
   - Avoid spam trigger words ("free", "act now", "limited time")
   - Personalize when possible but don't use the recipient's name in every email

3. **Content Guidelines**:
   - Keep emails under 102KB total size
   - Avoid excessive images or large attachments
   - Minimize the number of links (under 5 is ideal)
   - Include a physical mailing address in the footer
   - Have a clear unsubscribe mechanism

## 6. Warming Up Your Sending Domain

New domains or sudden increases in sending volume can trigger spam filters:

1. Start with very low volumes (10-20 emails per day)
2. Send only to engaged users who expect your emails
3. Gradually increase volume:
   - Week 1: 10-20 emails/day
   - Week 2: 40-50 emails/day
   - Week 3: 100 emails/day
   - Week 4: 200 emails/day
   - And so on...
4. Monitor bounces, spam complaints, and unsubscribes closely
5. Keep complaint rates below 0.1% and bounce rates below 2%

## 7. Testing and Monitoring

1. Send test emails to seed accounts at major providers (Gmail, Outlook, Yahoo)
2. Check where emails land (Primary, Promotions, Spam)
3. Use services like GlockApps, Mail Tester, or Email Deliverability Test
4. Set up Postmaster Tools for major email providers:
   - [Google Postmaster Tools](https://postmaster.google.com/)
   - [Microsoft SNDS](https://sendersupport.olc.protection.outlook.com/snds/)
   - [Yahoo Postmaster](https://postmaster.yahoo.com/)

5. Monitor your metrics in Resend:
   - Delivery rates
   - Open rates (should be 15%+ for transactional emails)
   - Click rates
   - Bounce and complaint rates

## 8. Deliverability Troubleshooting Checklist

If emails continue going to spam despite configuration:

1. **Authentication Issues**:
   - Verify SPF, DKIM, and DMARC records are properly set up
   - Confirm alignment between header From and envelope From
   - Check if your domain appears on any blacklists using MX Toolbox

2. **Content Issues**:
   - Run your email content through a spam checker tool
   - Review subject lines for spam trigger words
   - Check HTML/CSS complexity and formatting
   - Analyze text-to-HTML ratio

3. **Sending Patterns**:
   - Are you sending too many emails too quickly?
   - Is your sending pattern consistent or erratic?
   - Are you sending from a new domain with no reputation?

4. **Reputation Issues**:
   - Check domain reputation using tools like Sender Score
   - Review reputation of Resend's sending IPs
   - Check if previous owners of your domain used it for spam

5. **Engagement Metrics**:
   - Low open rates can hurt deliverability
   - High spam complaint rates severely impact inbox placement
   - How quickly recipients engage with your emails

## 9. Advanced Webhook Integration

Resend provides webhooks that can help you monitor deliverability:

1. Set up webhooks for bounce, complaint, and delivered events
2. Update your user database to suppress future sends to bounced addresses
3. Implement re-engagement campaigns for users with low engagement
4. Remove chronically unengaged users from your email lists

## 10. Legal Compliance

Ensure your emails comply with regulations:

1. Include your physical address (required by CAN-SPAM Act)
2. Provide clear unsubscribe mechanisms
3. Honor unsubscribe requests promptly
4. Be transparent about why recipients are receiving your emails
5. Include privacy policy information

## Additional Resources

- [Resend.com Documentation](https://resend.com/docs)
- [Email Deliverability Guide](https://www.mailgun.com/email-deliverability/guide/)
- [DMARC.org](https://dmarc.org/)
- [SpamAssassin Rules](https://spamassassin.apache.org/old/tests.html) - Useful to understand what triggers spam filters 