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
        <h2>Booking Confirmation</h2>
        <p>Dear ${data.customerName},</p>
        <p>Thank you for booking with HomeSwift! Your service request has been received.</p>
        <p><strong>Request ID:</strong> #${data.requestId}</p>
        <p><strong>Total Amount:</strong> R${data.totalAmount.toFixed(2)}</p>
        <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
        <p>We'll confirm your booking within 2 hours.</p>
        <p>Best regards,<br>HomeSwift Team</p>
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
  }
}

