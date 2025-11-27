// utils/notify.js
/* Notification utilities: Twilio WhatsApp + console fallback */
const twilio = require('twilio');

const client = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) ?
  twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : null;

/**
 * Send a WhatsApp notification to a phone number (restaurant)
 * restaurantPhone: e.g. "+2771xxxxxxx" (without "whatsapp:")
 */
async function sendOrderNotification(restaurantPhone, order, restaurantName) {
  const itemsText = order.items.map(i => `${i.name} x${i.qty || 1}`).join(', ');
  const body = `New order for ${restaurantName}: Order #${order._id}\nItems: ${itemsText}\nTotal: R${order.total}\nAddress: ${order.address}\nPhone: ${order.customerPhone}`;

  if (client && process.env.TWILIO_WHATSAPP_FROM) {
    try {
      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${restaurantPhone.replace('+','')}`,
        body
      });
      console.log('WhatsApp notification sent to', restaurantPhone);
    } catch (err) {
      console.error('Twilio error:', err.message);
    }
  } else {
    // Fallback: just log the message so admin can see it
    console.log('Notification (fallback) ->', restaurantPhone, body);
  }
}

module.exports = { sendOrderNotification };
