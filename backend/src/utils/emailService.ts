import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Check if email is configured
const isEmailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

// Create transporter only if email is configured
let transporter: nodemailer.Transporter | null = null;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Email service error:', error.message);
    } else {
      console.log('✅ Email service is ready');
    }
  });
} else {
  console.log('⚠️  Email not configured. Add EMAIL_USER and EMAIL_PASS to .env');
  console.log('📧 See EMAIL_QUICKSTART.md for setup instructions');
}

export async function sendPasswordResetEmail(
  email: string,
  tempPassword: string
): Promise<void> {
  if (!transporter) {
    throw new Error('Email service is not configured. Please set EMAIL_USER and EMAIL_PASS in .env');
  }

  const mailOptions = {
    from: `"Ichgram Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset - Ichgram',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0095f6; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .password-box { background: #fff; border: 2px solid #0095f6; padding: 15px; margin: 20px 0; text-align: center; border-radius: 5px; }
            .password { font-size: 24px; font-weight: bold; color: #0095f6; font-family: monospace; letter-spacing: 2px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your Ichgram account.</p>
              
              <div class="password-box">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your temporary password:</p>
                <div class="password">${tempPassword}</div>
              </div>

              <div class="warning">
                <strong>⚠️ Important:</strong> Please change this temporary password immediately after logging in for security reasons.
              </div>

              <p><strong>Steps to access your account:</strong></p>
              <ol>
                <li>Go to Ichgram login page</li>
                <li>Enter your email address</li>
                <li>Use the temporary password above</li>
                <li>Go to Settings and change your password</li>
              </ol>

              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                If you didn't request this password reset, please ignore this email or contact support if you have concerns.
              </p>
            </div>
            <div class="footer">
              <p>This is an automated message from Ichgram. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Ichgram. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Reset - Ichgram
      
      Hello,
      
      We received a request to reset your password for your Ichgram account.
      
      Your temporary password: ${tempPassword}
      
      Steps to access your account:
      1. Go to Ichgram login page
      2. Enter your email address
      3. Use the temporary password above
      4. Go to Settings and change your password
      
      IMPORTANT: Please change this temporary password immediately after logging in for security reasons.
      
      If you didn't request this password reset, please ignore this email or contact support if you have concerns.
      
      This is an automated message from Ichgram. Please do not reply to this email.
    `,
  };

  await transporter.sendMail(mailOptions);
}
