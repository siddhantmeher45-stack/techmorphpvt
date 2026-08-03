import { Resend } from 'resend';

let resend;

const SERVICE_LABELS = {
  web: 'Web & Mobile Apps',
  uiux: 'UI/UX Design',
  fullstack: 'Full Stack Solutions',
};

// In-Memory Rate Limiting: Max 5 submissions per 10 minutes per IP
const ipRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const timestamps = ipRateMap.get(ip) || [];
  const validTimestamps = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  validTimestamps.push(now);
  ipRateMap.set(ip, validTimestamps);
  return true;
}

function logEvent(type, data) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      event: type,
      ...data,
    })
  );
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function buildClientAutoResponderHtml(safeName, safeServices, safeDetails) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0B0B0B; color: #F4F1E8; margin: 0; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #141414; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px; }
        .brand { font-size: 22px; font-weight: 700; color: #00F2FE; margin-bottom: 24px; display: inline-block; }
        h1 { font-size: 20px; color: #ffffff; margin-bottom: 12px; }
        p { font-size: 15px; color: #aaaaaa; line-height: 1.6; margin-bottom: 20px; }
        .box { background: #1c1c1c; border-left: 3px solid #00F2FE; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
        .box strong { color: #ffffff; }
        .footer { font-size: 13px; color: #777777; border-top: 1px solid #222222; padding-top: 20px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="brand">✦ TechMorph Pvt. Ltd.</div>
        <h1>Thank you for reaching out, ${safeName}!</h1>
        <p>We have successfully received your project inquiry. Our engineering team is currently reviewing your details and will get back to you within 24 hours.</p>
        
        <div class="box">
          <p style="margin:0 0 8px 0;"><strong>Selected Services:</strong> ${safeServices}</p>
          <p style="margin:0;"><strong>Project Notes:</strong> ${safeDetails.replace(/\n/g, '<br />')}</p>
        </div>

        <p>In the meantime, feel free to reply directly to this email if you have any additional documentation or context to share.</p>
        
        <div class="footer">
          Best regards,<br/>
          <strong>TechMorph Pvt. Ltd. Team</strong><br/>
          <a href="mailto:techmorphpvt@gmail.com" style="color:#00F2FE; text-decoration:none;">techmorphpvt@gmail.com</a>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  // Rate limiting check
  if (!checkRateLimit(clientIp)) {
    logEvent('RATE_LIMIT_EXCEEDED', { ip: clientIp });
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // Honeypot anti-spam trap check
  const { name, email, services, details, honeypot, b_website } = req.body || {};
  if (honeypot || b_website) {
    logEvent('HONEYPOT_TRIGGERED', { ip: clientIp, name });
    return res.status(200).json({ success: true, message: 'Inquiry processed' });
  }

  if (!process.env.RESEND_API_KEY) {
    logEvent('CONFIG_ERROR', { error: 'RESEND_API_KEY missing' });
    return res.status(500).json({ error: 'Email service is not configured' });
  }

  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const selectedServices = Array.isArray(services) ? services : [];
  const serviceLabels = selectedServices
    .map((service) => SERVICE_LABELS[service] || service)
    .join(', ') || 'Not specified';

  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeDetails = escapeHtml(details?.trim() || 'No additional details provided.');
  const safeServices = escapeHtml(serviceLabels);

  const toEmail = process.env.CONTACT_TO_EMAIL || 'techmorphpvt@gmail.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'TechMorph Contact <onboarding@resend.dev>';

  try {
    // 1. Send Internal Admin Notification
    const adminResult = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email.trim(),
      subject: `New Project Inquiry from ${name.trim()}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name / Organization:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Services:</strong> ${safeServices}</p>
        <p><strong>Project details:</strong></p>
        <p>${safeDetails.replace(/\n/g, '<br />')}</p>
      `,
      text: [
        'New contact form submission',
        '',
        `Name / Organization: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Services: ${serviceLabels}`,
        '',
        'Project details:',
        details?.trim() || 'No additional details provided.',
      ].join('\n'),
    });

    if (adminResult.error) {
      logEvent('ADMIN_EMAIL_ERROR', { error: adminResult.error, ip: clientIp });
      return res.status(500).json({ error: 'Failed to send internal email notification' });
    }

    logEvent('ADMIN_EMAIL_SENT', { id: adminResult.data.id, recipient: toEmail });

    // 2. Send Client Auto-Responder Receipt (best-effort, non-blocking failure)
    try {
      const clientResult = await resend.emails.send({
        from: fromEmail,
        to: [email.trim()],
        subject: `We've received your project inquiry — TechMorph Pvt. Ltd.`,
        html: buildClientAutoResponderHtml(safeName, safeServices, safeDetails),
      });
      if (clientResult.error) {
        logEvent('CLIENT_AUTO_RESPONDER_NOTICE', {
          note: 'Auto-responder suppressed or unverified domain in testing mode',
          error: clientResult.error,
        });
      } else {
        logEvent('CLIENT_AUTO_RESPONDER_SENT', { id: clientResult.data?.id, recipient: email.trim() });
      }
    } catch (clientErr) {
      logEvent('CLIENT_AUTO_RESPONDER_EXCEPTION', { error: clientErr.message });
    }

    return res.status(200).json({ success: true, id: adminResult.data.id });
  } catch (err) {
    logEvent('HANDLER_EXCEPTION', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: 'Failed to process inquiry' });
  }
}
