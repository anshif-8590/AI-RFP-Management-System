import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM
} = process.env;

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

// SEND EMAIL FUNCTION
export async function sendRfpEmail({ to, subject, text }) {
  const info = await transporter.sendMail({
    from: EMAIL_FROM || SMTP_USER,
    to,
    subject,
    text
  });

  return info;
}

// EMAIL BODY BUILDER
export function buildRfpEmailBody({ rfp, vendor }) {
  const budgetText = rfp.budget ? `Budget (approx): ${rfp.budget}\n` : "";
  const deliveryText = rfp.deliveryDate
    ? `Expected delivery: ${rfp.deliveryDate.toISOString().split("T")[0]}\n`
    : "";

  const contactName = rfp.contactPerson?.name || "Procurement Team";
  const contactEmail = rfp.contactPerson?.email || SMTP_USER;

  return `
Hi ${vendor.name || "Vendor"},

You are invited to submit a proposal for:

${rfp.title}

${rfp.description || ""}

${budgetText}${deliveryText}

Please reply to this email with your detailed proposal, including:
- Pricing
- Delivery timeline
- Warranty and terms
- Any relevant conditions

Regards,
${contactName}
${contactEmail}
  `.trim();
}
