import twilio from "twilio";

export const sendWhatsApp = async (to, message) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !whatsappNumber) {
      throw new Error("Twilio environment variables not set");
    }

    const client = twilio(accountSid, authToken);

    // Ensure phone number is in international format
    const formattedTo = to.startsWith('+') ? to : `+91${to}`; // Assuming India, adjust as needed

    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${formattedTo}`,
    });

    console.log("✅ WhatsApp message sent:", response.sid);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error);
    return { success: false, error: error.message };
  }
};
