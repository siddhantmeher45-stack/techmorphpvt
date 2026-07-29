import { Resend } from 'resend';

let resend;

const SERVICE_LABELS = {
  web: 'Web & Mobile Apps',
  uiux: 'UI/UX Design',
  fullstack: 'Full Stack Solutions',
};

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

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service is not configured' });
  }

  const { name, email, services, details } = req.body || {};

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

  const { data, error } = await resend.emails.send({
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

  if (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }

  return res.status(200).json({ success: true, id: data.id });
}
