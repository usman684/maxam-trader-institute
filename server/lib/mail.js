import nodemailer from 'nodemailer'
import crypto from 'crypto'
export const origin = () => (process.env.CLIENT_ORIGIN || '').split(',')[0]
export const hash = t => crypto.createHash('sha256').update(t).digest('hex')
const shell = body => `<div style="font-family:Arial;max-width:520px;margin:auto"><h2 style="color:#B8860B">MAXAM TRADER INSTITUTE</h2>${body}<p style="color:#888;font-size:12px">Learn. Trade. Earn. Repeat.</p></div>`
// Never throws. If SMTP is not configured the email is skipped.
export async function mail(to, subject, body, bcc) {
  if (!process.env.SMTP_HOST || (!to && !bcc)) return false
  try {
    const t = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
    await t.sendMail({ from: process.env.MAIL_FROM, to: to || process.env.MAIL_FROM, ...(bcc && { bcc }), subject, html: shell(body) }); return true
  } catch (e) { console.error('mail failed', e.message); return false }
}
export async function sendVerification(u) {
  const t = crypto.randomBytes(32).toString('hex'); u.verifyHash = hash(t); await u.save()
  return mail(u.email, 'Verify your email', `<p>Hello ${u.name}, confirm your email address:</p><p><a href="${origin()}/verify-email?token=${t}">Verify email</a></p>`)
}
