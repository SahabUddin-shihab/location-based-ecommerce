const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async send({ to, subject, html, text }) {
        try {
            await this.transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME || 'Shop'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
                to,
                subject,
                html,
                text,
            });
            logger.info(`Email sent to ${to}: ${subject}`);
        } catch (err) {
            logger.error(`Email failed to ${to}: ${err.message}`);
            throw err;
        }
    }

    async sendVerificationEmail(email, name, token) {
        const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
        return this.send({
            to: email,
            subject: 'Verify your email address',
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                    <h2>Welcome, ${name}!</h2>
                    <p>Please verify your email address by clicking the button below:</p>
                    <a href="${url}" style="background:#4F46E5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">Verify Email</a>
                    <p style="color:#888;font-size:12px;margin-top:20px">Link expires in 24 hours. If you didn't register, ignore this email.</p>
                </div>
            `,
        });
    }

    async sendPasswordResetEmail(email, name, token) {
        const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
        return this.send({
            to: email,
            subject: 'Reset your password',
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                    <h2>Password Reset Request</h2>
                    <p>Hi ${name}, click the button below to reset your password:</p>
                    <a href="${url}" style="background:#EF4444;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">Reset Password</a>
                    <p style="color:#888;font-size:12px;margin-top:20px">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
                </div>
            `,
        });
    }

    async sendOrderConfirmation(email, name, order) {
        const itemRows = order.items.map(i =>
            `<tr><td>${i.name}</td><td>${i.quantity}</td><td>৳${i.price.toFixed(2)}</td><td>৳${i.totalPrice.toFixed(2)}</td></tr>`
        ).join('');

        return this.send({
            to: email,
            subject: `Order Confirmed - ${order.orderNumber}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                    <h2>Order Confirmed! 🎉</h2>
                    <p>Hi ${name}, your order <strong>${order.orderNumber}</strong> has been placed successfully.</p>
                    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
                        <thead><tr style="background:#f3f4f6"><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
                        <tbody>${itemRows}</tbody>
                    </table>
                    <p><strong>Total: ৳${order.total.toFixed(2)}</strong></p>
                    <p>Payment Method: ${order.paymentMethod.toUpperCase()}</p>
                    <p style="color:#888;font-size:12px">Thank you for shopping with us!</p>
                </div>
            `,
        });
    }

    async sendOrderStatusUpdate(email, name, orderNumber, status, note = '') {
        const statusMessages = {
            confirmed: 'has been confirmed',
            processing: 'is being processed',
            shipped: 'has been shipped',
            delivered: 'has been delivered',
            cancelled: 'has been cancelled',
        };
        const msg = statusMessages[status] || `status updated to ${status}`;

        return this.send({
            to: email,
            subject: `Order Update - ${orderNumber}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                    <h2>Order Update</h2>
                    <p>Hi ${name}, your order <strong>${orderNumber}</strong> ${msg}.</p>
                    ${note ? `<p>Note: ${note}</p>` : ''}
                    <p style="color:#888;font-size:12px">Thank you for shopping with us!</p>
                </div>
            `,
        });
    }
}

module.exports = EmailService;
