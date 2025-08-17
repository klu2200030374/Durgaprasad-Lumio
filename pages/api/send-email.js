// export default async function handler(req, res) {
//   console.log("📩 API called with:", req.method, req.body) // debug

//   if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

//   const { to, summary } = req.body || {}
//   if (!to || !summary) return res.status(400).json({ error: 'Missing "to" or "summary"' })

//   const recipients = to.split(',').map(s => s.trim()).filter(Boolean)
//   if (!process.env.RESEND_API_KEY) {
//     return res.status(400).json({ error: 'RESEND_API_KEY not configured' })
//   }

//   try {
//     const { Resend } = await import('resend')
//     const resend = new Resend(process.env.RESEND_API_KEY)
//     const result = await resend.emails.send({
//       from: process.env.FROM_EMAIL || 'Meeting Summarizer <no-reply@example.com>',
//       to: recipients,
//       subject: 'Meeting Summary',
//       text: summary,
//     })
//     console.log("✅ Resend response:", result)
//     return res.status(200).json({ ok: true, result })
//   } catch (e) {
//     console.error("❌ Resend error:", e)
//     return res.status(500).json({ error: `Failed to send email: ${e.message}` })
//   }
// }
import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, summary } = req.body || {}

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,       // e.g. yourid@kluniversity.in
        pass: process.env.SMTP_PASS // Google App Password
      }
    })

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Meeting Summary',
      text: summary,
    })

    return res.status(200).json({ ok: true, info })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}
