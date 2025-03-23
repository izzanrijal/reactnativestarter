# Email DNS Configuration Guide

This guide outlines the steps to configure DNS settings for your domain to ensure your emails pass DKIM and SPF authentication checks, which helps your emails reach the primary inbox rather than spam folders.

## Prerequisites

1. Access to your domain's DNS settings
2. A Resend.com account (which we're using for email delivery)
3. Your domain verified in Resend

## Required DNS Records

### SPF Record

SPF (Sender Policy Framework) helps prevent spoofing by specifying which mail servers are allowed to send emails from your domain.

**Record Type:** TXT
**Host/Name:** @ (or leave blank, depending on your DNS provider)
**Value/Content:** `v=spf1 include:spf.resend.com -all`

The `-all` qualifier is strict and tells receiving servers to reject emails that don't match your SPF policy. If you're experiencing deliverability issues, you can temporarily use `~all` (soft fail) during testing.

### DKIM Record

DKIM (DomainKeys Identified Mail) adds a digital signature to emails, allowing receiving servers to verify the email wasn't altered in transit.

This record will be provided by Resend when you verify your domain. It typically looks like:

**Record Type:** TXT
**Host/Name:** resend._domainkey (or as specified by Resend)
**Value/Content:** `k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHLyl8Wk4J06nv56v5+OeEgp9LW7o0wP8FxROPYXlc4bOFjorYnlqMmvnXT3Kag1Y5SBBz3s9j5L+HK9wNKg2479LXQzUNCsLlK/v9qO9/GtIICWWY2As/l5wFMixOHN+v72NT5VgOYqKfULCQrEYudJDJUf6XMSV+cMPRbYwIDAQAB`

### DMARC Record (Enhanced)

DMARC (Domain-based Message Authentication, Reporting & Conformance) tells receiving servers what to do with emails that fail SPF or DKIM checks.

**Record Type:** TXT
**Host/Name:** _dmarc
**Value/Content for Strict Policy (Better Deliverability):** 
```
v=DMARC1; p=reject; pct=100; rua=mailto:dmarc@yourdomain.com; ruf=mailto:dmarc-forensic@yourdomain.com; fo=1; aspf=s; adkim=s
```

This enhanced DMARC record:
- Uses `p=reject` to tell receivers to reject failed emails outright
- Sets `pct=100` to apply the policy to 100% of emails
- Requests aggregate reports (`rua`) and forensic reports (`ruf`) for failed emails
- `fo=1` requests forensic reports for all failures
- `aspf=s` and `adkim=s` require strict alignment (the domains in the From header and the Return-Path must exactly match)

During initial setup, you might want to start with `p=none` to monitor without affecting delivery, then move to `p=quarantine` and finally `p=reject` after verifying everything works properly.

## Reverse DNS (PTR Record)

Ensure Resend has proper reverse DNS setup for their sending IPs. This is handled by Resend but is important to verify.

## Additional DNS Records

### Return-Path Domain

Set up proper Return-Path alignment if Resend supports customizing this. The Return-Path should match your sending domain.

## Verification and Testing

After adding these records, wait for DNS propagation (can take up to 48 hours, but often much less).

### Testing Your Configuration

1. Use a service like [Mail Tester](https://www.mail-tester.com/) to check your email configuration
2. Send a test email to the address provided by Mail Tester
3. Review the results to ensure your SPF, DKIM, and DMARC are configured correctly

### Advanced Testing Tools

- [MX Toolbox](https://mxtoolbox.com/SuperTool.aspx) - Enter your domain and choose "SPF" or "DKIM" from the dropdown
- [Google Admin Toolbox](https://toolbox.googleapps.com/apps/checkmx/) - Check MX, SPF, and DKIM records
- [DMARC Analyzer](https://www.dmarcanalyzer.com/) - Detailed DMARC testing
- [GlockApps](https://glockapps.com/) - Test inbox placement in different email clients

## Troubleshooting

If emails are still going to spam:

1. Ensure all DNS records have properly propagated
2. Check that the "From" address in your code matches your verified domain
3. Make sure HTML content is properly formatted (which we've updated in the code)
4. Consider the content of your emails - avoid spam-like phrases or excessive links
5. Gradually build sender reputation by sending valuable content that recipients engage with
6. Check your domain and IP reputation using tools like [Sender Score](https://senderscore.org/)
7. Make sure your email volume gradually increases rather than suddenly sending large batches
8. Check if your domain has been previously used for spam (domain reputation)

## Building Domain Reputation

When using a new domain for sending emails:

1. Start with small volumes (10-20 emails per day)
2. Send only to engaged, expecting users who are likely to open emails
3. Ask recipients to mark your emails as "not spam" and add your address to their contacts
4. Gradually increase volume over several weeks
5. Monitor open rates, click rates, and complaint rates closely

## Important Notes for Resend.com

1. Make sure your sending domain is verified in Resend dashboard
2. If you're using a subdomain for sending (e.g., mail.yourdomain.com), configure DNS records specifically for that subdomain
3. Follow Resend's specific instructions for DNS verification
4. Consider using a dedicated IP address if you're sending high volumes

## Additional Email Deliverability Tips

1. Keep your HTML emails simple and properly formatted
2. Include both HTML and plain text versions of your emails
3. Avoid excessive use of images and attachments
4. Build sender reputation gradually
5. Monitor email engagement metrics in Resend dashboard
6. Regularly clean your email list to maintain high engagement rates
7. Use consistent "From" name and address
8. Include physical mailing address in the footer of emails (required by some laws)
9. Make sure HTML is properly formed and tested across email clients 