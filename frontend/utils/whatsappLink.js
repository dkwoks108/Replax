/**
 * Generate WhatsApp link for a product purchase.
 * Expects NEXT_PUBLIC_WHATSAPP_NUMBER to be set in environment (with or without +).
 */
export function generateWhatsAppLink(product, phoneNumber) {
  const raw = phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  // normalize number to digits only (remove + and spaces)
  const digits = raw.replace(/[^0-9]/g, '');
  const msg = `Hello! I'm interested in purchasing "${product?.name || 'your product'}"` +
    (product?.price ? ` for ₹${product.price}` : '') +
    `. Could you share availability and order details?`;
  const encoded = encodeURIComponent(msg);
  return `https://wa.me/${digits}?text=${encoded}`;
}
