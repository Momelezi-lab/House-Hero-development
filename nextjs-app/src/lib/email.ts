import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: process.env.MAIL_USE_TLS === 'true',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html?: string
  text?: string
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_DEFAULT_SENDER || 'noreply@homeswift.com',
      to,
      subject,
      html,
      text,
    })
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: String(error) }
  }
}

export function generateEmailTemplates() {
  return {
    customerConfirmation: (data: {
      customerName: string
      requestId: number
      totalAmount: number
      preferredDate: string
      preferredTime: string
    }) => ({
      subject: `Booking Confirmation - Request #${data.requestId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="background-color: #2563EB; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0;">🏠 HomeSwift</h1>
          </div>
          <div style="background-color: #F9FAFB; padding: 30px; border: 1px solid #E5E7EB; border-top: none;">
            <h2 style="color: #111827; margin-top: 0;">Booking Confirmation</h2>
            <p style="color: #374151; font-size: 16px;">Dear ${data.customerName},</p>
            <p style="color: #374151; font-size: 16px;">Thank you for booking with HomeSwift! Your service request has been received and is being processed.</p>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #2563EB;">
              <p style="margin: 10px 0; color: #111827;"><strong>Request ID:</strong> <span style="color: #2563EB; font-weight: bold;">#${data.requestId}</span></p>
              <p style="margin: 10px 0; color: #111827;"><strong>Total Amount:</strong> <span style="color: #10B981; font-weight: bold; font-size: 18px;">R${data.totalAmount.toFixed(2)}</span></p>
              <p style="margin: 10px 0; color: #111827;"><strong>Preferred Date:</strong> ${data.preferredDate}</p>
              <p style="margin: 10px 0; color: #111827;"><strong>Preferred Time:</strong> ${data.preferredTime}</p>
            </div>
            <p style="color: #374151; font-size: 16px;">We'll review your request and confirm your booking within 2 hours. You'll receive another email once a service provider has been assigned.</p>
            <p style="color: #374151; font-size: 16px;">If you have any questions, please don't hesitate to contact us.</p>
            <p style="color: #374151; font-size: 16px; margin-top: 30px;">Best regards,<br><strong style="color: #2563EB;">HomeSwift Team</strong></p>
          </div>
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; border: 1px solid #E5E7EB; border-top: none;">
            <p style="color: #6B7280; font-size: 12px; margin: 0;">This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      `,
    }),
    adminAlert: (data: {
      requestId: number
      customerName: string
      totalAmount: number
    }) => ({
      subject: `New Service Request #${data.requestId}`,
      html: `
        <h2>New Service Request</h2>
        <p>A new service request has been submitted:</p>
        <p><strong>Request ID:</strong> #${data.requestId}</p>
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Total Amount:</strong> R${data.totalAmount.toFixed(2)}</p>
        <p>Please review and assign a provider.</p>
      `,
    }),
    providerAssignment: (data: {
      providerName: string
      requestId: number
      customerName: string
      customerAddress: string
      preferredDate: string
      preferredTime: string
    }) => ({
      subject: `New Service Assignment - Request #${data.requestId}`,
      html: `
        <h2>New Service Assignment</h2>
        <p>Dear ${data.providerName},</p>
        <p>You have been assigned a new service request:</p>
        <p><strong>Request ID:</strong> #${data.requestId}</p>
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Address:</strong> ${data.customerAddress}</p>
        <p><strong>Date:</strong> ${data.preferredDate}</p>
        <p><strong>Time:</strong> ${data.preferredTime}</p>
        <p>Please contact the customer to confirm.</p>
      `,
    }),
    customerProviderDetails: (data: {
      customerName: string
      providerName: string
      providerPhone: string
      providerEmail: string
      requestId: number
    }) => ({
      subject: `Service Provider Assigned - Request #${data.requestId}`,
      html: `
        <h2>Service Provider Assigned</h2>
        <p>Dear ${data.customerName},</p>
        <p>Your service provider has been assigned:</p>
        <p><strong>Provider:</strong> ${data.providerName}</p>
        <p><strong>Phone:</strong> ${data.providerPhone}</p>
        <p><strong>Email:</strong> ${data.providerEmail}</p>
        <p>They will contact you shortly to confirm details.</p>
      `,
    }),
    reminder24h: (data: {
      customerName: string
      requestId: number
      preferredDate: string
      preferredTime: string
    }) => ({
      subject: `Reminder: Service Scheduled Tomorrow - Request #${data.requestId}`,
      html: `
        <h2>Service Reminder</h2>
        <p>Dear ${data.customerName},</p>
        <p>This is a reminder that your service is scheduled for:</p>
        <p><strong>Date:</strong> ${data.preferredDate}</p>
        <p><strong>Time:</strong> ${data.preferredTime}</p>
        <p>Please ensure someone is available at the service location.</p>
      `,
    }),
    serviceCompletion: (data: {
      customerName: string
      requestId: number
    }) => ({
      subject: `Service Completed - Request #${data.requestId}`,
      html: `
        <h2>Service Completed</h2>
        <p>Dear ${data.customerName},</p>
        <p>Your service request #${data.requestId} has been marked as completed.</p>
        <p>Thank you for choosing HomeSwift!</p>
      `,
    }),
    statusUpdate: (data: {
      customerName: string
      requestId: number
      oldStatus: string
      newStatus: string
      providerName?: string
      providerPhone?: string
      providerEmail?: string
      preferredDate?: string
      preferredTime?: string
    }) => {
      const statusMessages: Record<string, string> = {
        pending: 'Your booking is pending confirmation. We will review it and get back to you shortly.',
        confirmed: 'Your booking has been confirmed! A service provider will be assigned soon.',
        in_progress: 'Your service is now in progress. Our team is working on your request.',
        completed: 'Your service has been completed successfully!',
        cancelled: 'Your booking has been cancelled. If you have any questions, please contact us.',
      }

      const statusMessage = statusMessages[data.newStatus] || `Your booking status has been updated to: ${data.newStatus}`

      let providerInfo = ''
      if (data.providerName) {
        providerInfo = `
          <div style="background-color: #EFF6FF; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563EB;">Your Service Provider</h3>
            <p><strong>Name:</strong> ${data.providerName}</p>
            ${data.providerPhone ? `<p><strong>Phone:</strong> ${data.providerPhone}</p>` : ''}
            ${data.providerEmail ? `<p><strong>Email:</strong> ${data.providerEmail}</p>` : ''}
          </div>
        `
      }

      return {
        subject: `Booking Status Update - Request #${data.requestId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563EB;">Booking Status Update</h2>
            <p>Dear ${data.customerName},</p>
            <p>${statusMessage}</p>
            <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Request ID:</strong> #${data.requestId}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #2563EB; font-weight: bold;">${data.newStatus.toUpperCase()}</span></p>
              ${data.preferredDate ? `<p style="margin: 5px 0;"><strong>Scheduled Date:</strong> ${data.preferredDate}</p>` : ''}
              ${data.preferredTime ? `<p style="margin: 5px 0;"><strong>Scheduled Time:</strong> ${data.preferredTime}</p>` : ''}
            </div>
            ${providerInfo}
            <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
            <p>Best regards,<br><strong>HomeSwift Team</strong></p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
            <p style="color: #6B7280; font-size: 12px;">This is an automated email. Please do not reply to this message.</p>
          </div>
        `,
      }
    },
  }
}

