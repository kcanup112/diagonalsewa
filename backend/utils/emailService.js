const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Check if SMTP credentials are configured
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS || 
          process.env.SMTP_USER === 'your_email@gmail.com') {
        logger.warn('Email service not configured. Using test mode (Ethereal).');
        
        // Create test account for development
        const testAccount = await nodemailer.createTestAccount();
        
        this.transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        logger.info('Email service initialized with Ethereal test account');
        logger.info(`Preview emails at: https://ethereal.email`);
      } else {
        // Production SMTP configuration
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Verify connection
        await this.transporter.verify();
        logger.info('Email service initialized successfully with Gmail SMTP');
      }

      this.isInitialized = true;
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Send booking confirmation email to customer
   */
  async sendBookingConfirmation(bookingData) {
    if (!this.isInitialized) {
      logger.warn('Email service not initialized. Skipping email.');
      return { success: false, error: 'Email service not initialized' };
    }

    try {
      const { name, email, phone, serviceType, appointmentDate, message } = bookingData;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #013b4b 0%, #0f4c5c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { margin: 12px 0; padding: 10px; background: white; border-radius: 4px; }
            .detail-label { font-weight: bold; color: #013b4b; display: inline-block; width: 140px; }
            .detail-value { color: #333; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #013b4b 0%, #0f4c5c 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏗️ Diagonal Group</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Booking Confirmation</p>
            </div>
            
            <div class="content">
              <div class="success-icon">✅</div>
              <h2 style="color: #013b4b; text-align: center;">Thank You for Choosing Us!</h2>
              
              <p>Dear ${name},</p>
              
              <p>We have successfully received your booking request for <strong>${serviceType}</strong>. Our team will review your request and contact you shortly to confirm the appointment details.</p>
              
              <div class="booking-details">
                <h3 style="color: #013b4b; margin-top: 0;">📋 Booking Details</h3>
                
                <div class="detail-row">
                  <span class="detail-label">Service Type:</span>
                  <span class="detail-value">${serviceType}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Preferred Date:</span>
                  <span class="detail-value">${new Date(appointmentDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Contact Phone:</span>
                  <span class="detail-value">${phone}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${email}</span>
                </div>
                
                ${message ? `
                <div class="detail-row">
                  <span class="detail-label">Message:</span>
                  <span class="detail-value">${message}</span>
                </div>
                ` : ''}
              </div>
              
              <h3 style="color: #013b4b;">📞 What Happens Next?</h3>
              <ul style="line-height: 1.8;">
                <li>Our team will review your request within 24 hours</li>
                <li>We'll contact you via phone or email to confirm the appointment</li>
                <li>You'll receive a detailed consultation about your project</li>
                <li>We'll provide a comprehensive quote and timeline</li>
              </ul>
              
              <p style="margin-top: 30px;">If you have any immediate questions, feel free to contact us:</p>
              <p style="margin: 5px 0;">
                📧 Email: <a href="mailto:diagonalsewa@gmail.com" style="color: #013b4b;">diagonalsewa@gmail.com</a><br>
                📱 Phone: 9801890011 / 015201768<br>
                🌐 Website: <a href="https://diagonalsewa.com" style="color: #013b4b;">diagonalsewa.com</a>
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0 0 10px 0;"><strong>Diagonal Group</strong></p>
              <p style="margin: 0;">Professional 3D Design, Construction & Repair Services</p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                This is an automated confirmation email. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"Diagonal Group" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Booking Confirmation - ${serviceType} | Diagonal Group`,
        html: htmlContent,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Log preview URL for Ethereal (test mode)
      if (nodemailer.getTestMessageUrl(info)) {
        logger.info(`Preview customer email: ${nodemailer.getTestMessageUrl(info)}`);
      }

      logger.info(`Booking confirmation email sent to ${email}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Failed to send booking confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send admin notification email
   */
  async sendAdminNotification(bookingData) {
    if (!this.isInitialized) {
      logger.warn('Email service not initialized. Skipping admin notification.');
      return { success: false, error: 'Email service not initialized' };
    }

    try {
      const { name, email, phone, serviceType, appointmentDate, message, images } = bookingData;
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .alert-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { margin: 12px 0; padding: 10px; background: white; border-radius: 4px; }
            .detail-label { font-weight: bold; color: #dc2626; display: inline-block; width: 140px; }
            .detail-value { color: #333; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
            .urgent { color: #dc2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Booking Alert</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Diagonal Group Admin Panel</p>
            </div>
            
            <div class="content">
              <div class="alert-box">
                <p style="margin: 0;"><strong>⚠️ Action Required:</strong> A new booking request has been received and requires your attention.</p>
              </div>
              
              <h2 style="color: #dc2626;">📋 Customer Booking Details</h2>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Customer Name:</span>
                  <span class="detail-value"><strong>${name}</strong></span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Service Type:</span>
                  <span class="detail-value urgent">${serviceType}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Preferred Date:</span>
                  <span class="detail-value">${new Date(appointmentDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Contact Phone:</span>
                  <span class="detail-value"><a href="tel:${phone}" style="color: #dc2626;">${phone}</a></span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value"><a href="mailto:${email}" style="color: #dc2626;">${email}</a></span>
                </div>
                
                ${message ? `
                <div class="detail-row">
                  <span class="detail-label">Message:</span>
                  <span class="detail-value">${message}</span>
                </div>
                ` : ''}
                
                ${images && images.length > 0 ? `
                <div class="detail-row">
                  <span class="detail-label">Attachments:</span>
                  <span class="detail-value">${images.length} file(s) uploaded</span>
                </div>
                ` : ''}
              </div>
              
              <h3 style="color: #dc2626;">✅ Next Steps:</h3>
              <ol style="line-height: 1.8;">
                <li>Review the booking details above</li>
                <li>Contact the customer within 24 hours</li>
                <li>Schedule a consultation or site visit</li>
                <li>Prepare a detailed quote and project timeline</li>
                <li>Update booking status in admin dashboard</li>
              </ol>
              
              <p style="margin-top: 30px; padding: 15px; background: #fef3c7; border-radius: 5px;">
                <strong>⏰ Response Time:</strong> Please aim to contact this customer within 24 hours to maintain high service standards.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0 0 10px 0;"><strong>Diagonal Group Admin System</strong></p>
              <p style="margin: 0; font-size: 12px; color: #999;">
                Received: ${new Date().toLocaleString('en-US', { 
                  dateStyle: 'full', 
                  timeStyle: 'short' 
                })}
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"Diagonal Group Booking System" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `🔔 New Booking: ${serviceType} - ${name}`,
        html: htmlContent,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Log preview URL for Ethereal (test mode)
      if (nodemailer.getTestMessageUrl(info)) {
        logger.info(`Preview admin email: ${nodemailer.getTestMessageUrl(info)}`);
      }

      logger.info(`Admin notification email sent to ${adminEmail}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Failed to send admin notification email:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
const emailService = new EmailService();
module.exports = emailService;
