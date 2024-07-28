import nodemailer from "nodemailer";

export type SendMailPayload = {
  subject: string;
  message: string;
  to: string;
};

export async function sendMail(payload: SendMailPayload) {
  const { subject, message: html, to } = payload;

  let transporter = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_SMTP_HOST,
    port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),
    auth: {
      user: process.env.NEXT_PUBLIC_SMTP_USER,
      pass: process.env.NEXT_PUBLIC_SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.NEXT_PUBLIC_SMTP_USER,
    to,
    subject,
    html,
  });
}
