const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: process.env.EMAIL_PORT || 2525,
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || '',
      },
    });

    const message = {
      from: `FoodExpress <${process.env.EMAIL_USER || 'noreply@foodexpress.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || `<p>${options.message}</p>`,
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.warn('Email sending skipped (development/no SMTP credentials configured):', error.message);
    return false;
  }
};

module.exports = sendEmail;
