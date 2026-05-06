/**
 * Hook for sending WhatsApp messages
 * Handles message encoding and window opening
 */
export function useWhatsAppMessage() {
  const WHATSAPP_NUMBER = "+919345791995";

  const sendMessage = (message: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\s/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return {
    sendWorkshopMessage: () => sendMessage(
      "Hi 👋 I'm interested in joining the 1-Day Blockchain Workshop for Rs.1999/-! Please share more details. 🚀"
    ),
    sendConsultationMessage: () => sendMessage(
      "Hi 👋 I'd like to book a 1-to-1 Crypto Consultation. What are the available slots? 💼"
    ),
  };
}
