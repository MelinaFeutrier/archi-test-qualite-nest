import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure the email transporter
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com', 
      port: 587, 
      secure: false, 
      auth: {
        user: 'your-email@example.com', 
        pass: 'your-email-password', 
      },
    });
  }

  async sendStockAlert(details: { productId: string; productName: string; currentStock: number }): Promise<void> {
    try {
      const mailOptions = {
        from: '"Stock Alert" <your-email@example.com>', 
        to: 'recipient@example.com',
        subject: `Stock Alert: ${details.productName} is out of stock!`,
        text: `The stock for product "${details.productName}" (ID: ${details.productId}) has reached ${details.currentStock}. Please restock soon.`,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Stock alert email sent for product ${details.productName}`);
    } catch (error) {
      console.error('Error sending stock alert email:', error);
      throw new Error('Failed to send stock alert email');
    }
  }
}
