import nodemailer from 'nodemailer'
import prisma from '~/server/utils/prisma'

async function getTransporter() {
  // Essayer d'abord la config depuis la DB
  const config = await prisma.emailConfig.findFirst()

  const host = config?.host || process.env.MAIL_HOST || 'smtp.gmail.com'
  const port = config?.port || Number(process.env.MAIL_PORT) || 587
  const user = config?.user || process.env.MAIL_USER || ''
  const pass = config?.pass || process.env.MAIL_PASS || ''

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

async function getFrom() {
  const config = await prisma.emailConfig.findFirst()
  return config?.from || process.env.MAIL_FROM || `CMA DOKUI1 <${process.env.MAIL_USER}>`
}

export interface MailOptions {
  to: string | string[]
  subject: string
  html: string
}

export async function sendMail(options: MailOptions) {
  const transporter = await getTransporter()
  const from = await getFrom()

  return await transporter.sendMail({
    from,
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    html: options.html,
  })
}

export function emailTemplate(title: string, content: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #15803d, #1d4ed8); color: white; padding: 30px 20px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; }
      .header p { margin: 5px 0 0; opacity: 0.85; font-size: 14px; }
      .body { padding: 30px 25px; color: #333; line-height: 1.6; }
      .footer { background: #f9f9f9; padding: 15px 25px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>⛪ CMA DOKUI1</h1>
        <p>Eglise Communauté des Membres Actifs</p>
      </div>
      <div class="body">
        <h2 style="color:#15803d; margin-top:0;">${title}</h2>
        ${content}
      </div>
      <div class="footer">
        <p>© CMA DOKUI1 — Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    </div>
  </body>
  </html>
  `
}
