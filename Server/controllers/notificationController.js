import nodemailer from 'nodemailer';
import pool from '../db/index.js';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const checkLowStockAndNotify = async (req, res) => {
  try {
    const lowStockItems = await pool.query(`
      SELECT name, quantity, critical_threshold, location
      FROM components 
      WHERE quantity <= critical_threshold
    `);

    if (lowStockItems.rows.length > 0) {
      let emailBody = 'Low Stock Alert:\n\n';
      lowStockItems.rows.forEach(item => {
        emailBody += `• ${item.name}: ${item.quantity} units (Threshold: ${item.critical_threshold})\n`;
        emailBody += `  Location: ${item.location || 'Not specified'}\n\n`;
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'admin@lims.com',
        subject: `🚨 LIMS Low Stock Alert - ${lowStockItems.rows.length} items`,
        text: emailBody
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: `Alert sent for ${lowStockItems.rows.length} low stock items` });
    } else {
      res.json({ message: 'No low stock items found' });
    }

  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
};

export const sendTestEmail = async (req, res) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'test@example.com',
      subject: 'LIMS Test Email',
      text: 'This is a test email from your LIMS system!'
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send test email' });
  }
};