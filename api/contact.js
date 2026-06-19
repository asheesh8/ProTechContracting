export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, phone, email, service, description, bestTime } = req.body

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  const toEmail = process.env.CONTACT_EMAIL || 'protechcontracting1@gmail.com'
  const resendKey = process.env.RESEND_API_KEY

  const subject = `New Estimate Request — ${service || 'General Inquiry'}`
  const body = `
New estimate request from your website:

Name: ${name}
Phone: ${phone || 'Not provided'}
Email: ${email}
Service: ${service || 'Not specified'}
Best time to call: ${bestTime || 'Not specified'}

Project Description:
${description || 'No description provided.'}

---
Sent via ProTech Contracting website
  `.trim()

  if (!resendKey) {
    console.log('CONTACT FORM (no Resend key, logging only):', { name, email, subject })
    return res.status(200).json({ ok: true })
  }

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ProTech Website <onboarding@resend.dev>',
        to: [toEmail],
        reply_to: email,
        subject,
        text: body,
      }),
    })

    if (!emailRes.ok) {
      const err = await emailRes.text()
      console.error('Resend error:', err)
      return res.status(500).json({ error: 'Email send failed' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Contact handler error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
