/**
 * WhatsApp Message Utility
 * Simple helper to send pre-formatted WhatsApp messages
 */

export interface PaymentDetails {
    orderId: string;
    amount: number;
    customerName: string;
    courseName?: string;
}

/**
 * Generate WhatsApp message URL for payment success
 */
export function getPaymentSuccessMessage(
    whatsappNumber: string,
    details: PaymentDetails,
): string {
    const amount = (details.amount / 100).toFixed(2);
    const courseName = details.courseName || "Your Course";

    const message = `🎉 *Payment Successful!*

Hi ${details.customerName} 👋

I just completed my payment! ✅

📋 *Order Details:*
• Order ID: ${details.orderId}
• Amount: ₹${amount}
• Course: ${courseName}

🚀 Looking forward to learning!

#TechAra #BlockchainEducation`;

    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = whatsappNumber.replace(/\D/g, "");

    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Open WhatsApp with payment success message
 */
export function openPaymentSuccessWhatsApp(
    whatsappNumber: string,
    details: PaymentDetails,
): void {
    const url = getPaymentSuccessMessage(whatsappNumber, details);
    window.open(url, "_blank");
}

/**
 * Generate generic inquiry message
 */
export function getInquiryMessage(
    customerName: string,
    courseName: string,
): string {
    const message = `Hi Sindhu 👋  

I'm interested in your "${courseName}" course! 💻✨

Could you provide more details about:
• Course curriculum
• Duration & schedule
• Fee & payment options
• Internship opportunities

Looking forward to hearing from you! 🚀`;

    return encodeURIComponent(message);
}

/**
 * Open WhatsApp with inquiry message
 */
export function openInquiryWhatsApp(
    whatsappNumber: string,
    customerName: string,
    courseName: string,
): void {
    const message = getInquiryMessage(customerName, courseName);
    const cleanNumber = whatsappNumber.replace(/\D/g, "");
    const url = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(url, "_blank");
}
