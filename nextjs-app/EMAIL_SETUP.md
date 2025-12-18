# Email Configuration Guide

This guide explains how to set up email functionality for HomeSwift to send booking confirmations and status updates.

## Email Service Options

### Option 1: Gmail (Easiest for Development)

1. **Enable App Passwords in Gmail:**
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification (enable if not already)
   - Go to App Passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

2. **Set Environment Variables:**
   ```env
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=true
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-char-app-password
   MAIL_DEFAULT_SENDER=your-email@gmail.com
   ADMIN_EMAIL=admin@homeswift.com
   ```

### Option 2: SendGrid (Recommended for Production)

1. **Sign up at [SendGrid](https://sendgrid.com)** (free tier: 100 emails/day)

2. **Create an API Key:**
   - Go to Settings → API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key

3. **Set Environment Variables:**
   ```env
   MAIL_SERVER=smtp.sendgrid.net
   MAIL_PORT=587
   MAIL_USE_TLS=true
   MAIL_USERNAME=apikey
   MAIL_PASSWORD=your-sendgrid-api-key
   MAIL_DEFAULT_SENDER=your-verified-sender@yourdomain.com
   ADMIN_EMAIL=admin@homeswift.com
   ```

### Option 3: AWS SES (For High Volume)

1. **Set up AWS SES:**
   - Verify your email/domain in AWS SES
   - Create SMTP credentials
   - Use the SMTP endpoint for your region

2. **Set Environment Variables:**
   ```env
   MAIL_SERVER=email-smtp.us-east-1.amazonaws.com
   MAIL_PORT=587
   MAIL_USE_TLS=true
   MAIL_USERNAME=your-ses-smtp-username
   MAIL_PASSWORD=your-ses-smtp-password
   MAIL_DEFAULT_SENDER=verified-email@yourdomain.com
   ADMIN_EMAIL=admin@homeswift.com
   ```

### Option 4: Mailgun (Good for Production)

1. **Sign up at [Mailgun](https://www.mailgun.com)** (free tier: 5,000 emails/month)

2. **Get SMTP credentials from your Mailgun dashboard**

3. **Set Environment Variables:**
   ```env
   MAIL_SERVER=smtp.mailgun.org
   MAIL_PORT=587
   MAIL_USE_TLS=true
   MAIL_USERNAME=your-mailgun-smtp-username
   MAIL_PASSWORD=your-mailgun-smtp-password
   MAIL_DEFAULT_SENDER=noreply@yourdomain.com
   ADMIN_EMAIL=admin@homeswift.com
   ```

## Setting Up Environment Variables

### Local Development (.env file)

Create a `.env.local` file in the `nextjs-app` directory:

```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
ADMIN_EMAIL=admin@homeswift.com
```

### Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all the email-related variables:
   - `MAIL_SERVER`
   - `MAIL_PORT`
   - `MAIL_USE_TLS`
   - `MAIL_USERNAME`
   - `MAIL_PASSWORD`
   - `MAIL_DEFAULT_SENDER`
   - `ADMIN_EMAIL`
4. Set them for **Production**, **Preview**, and **Development** environments
5. Redeploy your application

## Email Types Sent

### 1. Booking Confirmation (When booking is created)
- **To:** Customer
- **Subject:** "Booking Confirmation - Request #[ID]"
- **Content:** Confirmation with booking details and total amount

### 2. Admin Alert (When booking is created)
- **To:** Admin email
- **Subject:** "New Service Request #[ID]"
- **Content:** Notification of new booking requiring action

### 3. Status Updates (When status changes)
- **To:** Customer
- **Subject:** "Booking Status Update - Request #[ID]"
- **Content:** Status change notification with provider details (if assigned)

### 4. Provider Assignment (When provider is assigned)
- **To:** Provider
- **Subject:** "New Service Assignment - Request #[ID]"
- **Content:** Service details and customer information

### 5. Provider Details to Customer (When provider is assigned)
- **To:** Customer
- **Subject:** "Service Provider Assigned - Request #[ID]"
- **Content:** Provider contact information

### 6. Service Completion (When status = "completed")
- **To:** Customer
- **Subject:** "Service Completed - Request #[ID]"
- **Content:** Completion confirmation

## Testing Email Functionality

### Test Locally

1. Set up your `.env.local` file with email credentials
2. Create a test booking through the app
3. Check your email inbox (and spam folder)
4. Check the console logs for any email errors

### Test in Production

1. Ensure all environment variables are set in Vercel
2. Create a test booking
3. Monitor Vercel function logs for email sending status
4. Check email inbox

## Troubleshooting

### Emails Not Sending

1. **Check Environment Variables:**
   - Verify all email variables are set correctly
   - Ensure no typos in variable names
   - Check that passwords/API keys are correct

2. **Check SMTP Settings:**
   - Verify `MAIL_SERVER` and `MAIL_PORT` are correct
   - Ensure `MAIL_USE_TLS` is set correctly (usually `true` for port 587)

3. **Check Logs:**
   - Look for email errors in Vercel function logs
   - Check browser console for API errors
   - Review server logs for SMTP connection issues

4. **Common Issues:**
   - **Gmail:** Make sure you're using an App Password, not your regular password
   - **SendGrid:** Verify your sender email is verified in SendGrid
   - **AWS SES:** Ensure your email/domain is verified and out of sandbox mode
   - **Firewall:** Some SMTP servers may be blocked by firewalls

### Email Going to Spam

1. **Set up SPF/DKIM records** for your domain
2. **Use a verified sender email** address
3. **Include proper email headers** (already implemented)
4. **Avoid spam trigger words** in subject lines
5. **Use a professional sender name** (e.g., "HomeSwift" instead of "noreply")

## Security Best Practices

1. **Never commit email credentials to Git**
2. **Use environment variables** for all sensitive data
3. **Rotate passwords/API keys** regularly
4. **Use App Passwords** instead of main passwords (Gmail)
5. **Limit API key permissions** to only what's needed
6. **Monitor email sending** for unusual activity

## Email Template Customization

Email templates are located in `src/lib/email.ts`. You can customize:
- Email subject lines
- HTML email content
- Email styling
- Additional email types

## Support

If you continue to have issues:
1. Check the email service provider's documentation
2. Review Vercel function logs
3. Test with a simple email sending script
4. Contact your email service provider's support

