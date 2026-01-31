const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure email transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_EMAIL_PASSWORD) {
    console.warn('⚠️ Email credentials not configured. Email notifications will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD // Use App Password for Gmail
    }
  });
};

// Send new customer notification
router.post('/new-customer', async (req, res) => {
  try {
    const { customerName, customerPhone, conversationId } = req.body;

    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: 'Missing customer information' });
    }

    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('⚠️ Email not configured, skipping notification');
      return res.json({ success: true, message: 'Notification skipped (email not configured)' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://elicheradicelb.com';
    const cleanFrontendUrl = frontendUrl.replace(/\/$/, '');

    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #D4A574 0%, #B8885E 100%);
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #FAF6F0;
            margin: 10px 0 0 0;
            font-size: 14px;
          }
          .content {
            padding: 30px;
          }
          .alert {
            background: #FFF9E6;
            border-left: 4px solid #D4A574;
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 4px;
          }
          .alert-title {
            font-size: 18px;
            font-weight: bold;
            color: #8B6644;
            margin: 0 0 5px 0;
          }
          .info-grid {
            background: #F9FAFB;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #E5E7EB;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #6B7280;
            width: 140px;
            font-size: 14px;
          }
          .info-value {
            color: #111827;
            font-size: 14px;
            flex: 1;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #D4A574 0%, #B8885E 100%);
            color: white !important;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 6px;
            font-weight: 600;
            margin: 10px 0;
            text-align: center;
          }
          .footer {
            background: #F9FAFB;
            padding: 20px;
            text-align: center;
            color: #6B7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 New Customer Inquiry</h1>
            <p>Eliche Radice LB - Premium Yacht Maintenance</p>
          </div>
          
          <div class="content">
            <div class="alert">
              <p class="alert-title">New Customer Alert!</p>
              <p style="margin: 5px 0 0 0; color: #6B7280;">A new customer has started a conversation and needs assistance.</p>
            </div>

            <div class="info-grid">
              <div class="info-row">
                <div class="info-label">👤 Customer Name:</div>
                <div class="info-value"><strong>${customerName}</strong></div>
              </div>
              
              <div class="info-row">
                <div class="info-label">📞 Phone Number:</div>
                <div class="info-value"><strong>${customerPhone}</strong></div>
              </div>
              
              <div class="info-row">
                <div class="info-label">💬 Conversation ID:</div>
                <div class="info-value"><code style="background: #E5E7EB; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${conversationId}</code></div>
              </div>
              
              <div class="info-row">
                <div class="info-label">🕐 Time:</div>
                <div class="info-value">${new Date().toLocaleString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${cleanFrontendUrl}/operator" class="button">
                Open Operator Dashboard →
              </a>
            </div>

            <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 6px; padding: 15px; margin-top: 20px;">
              <p style="margin: 0; color: #92400E; font-size: 13px;">
                ⚡ <strong>Quick Response Required:</strong> Customer is waiting for assistance. Please respond promptly to provide excellent service.
              </p>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0 0 10px 0;"><strong>Eliche Radice LB</strong></p>
            <p style="margin: 0;">Premium Yacht Maintenance by Michel Kattoura</p>
            <p style="margin: 10px 0 0 0; font-size: 11px;">This is an automated notification from your customer chat system.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Eliche Radice LB Chat" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🚨 New Customer: ${customerName} - ${customerPhone}`,
      html: htmlEmail,
      text: `New Customer Inquiry\n\nName: ${customerName}\nPhone: ${customerPhone}\nConversation ID: ${conversationId}\nTime: ${new Date().toLocaleString()}`
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Admin email sent for customer: ${customerName}`);
    
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;

