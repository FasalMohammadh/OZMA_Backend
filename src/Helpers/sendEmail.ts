import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import getDirName from './getDirname.js';
import 'dotenv/config';

async function sendEmail(email: string, receiverFullName: string) {
  let emailTemplate = await fs.readFile(
    path.join(
      getDirName(),
      './../Public/Templates/Email/registrationSuccessful.html'
    ),
    { encoding: 'utf-8' }
  );

  emailTemplate = emailTemplate.replace('{{name}}', receiverFullName);
  emailTemplate = emailTemplate.replace(
    '{{logo}}',
    path.join(getDirName(), './../Public/Images/Logo.svg')
  );

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'ozmadigital@gmail.com', pass: process.env.GMAIL_APP_PASS },
  });

  const mailOptions = {
    from: 'ozmadigital@gmail.com',
    to: email,
    subject: 'OZMA Digital Registration Successful',
    html: emailTemplate,
  };

  await transporter.sendMail(mailOptions);
}

export default sendEmail;
