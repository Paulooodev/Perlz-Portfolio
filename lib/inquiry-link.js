// ============================================================================
// INQUIRY LINKS — shared helper for WhatsApp and email "buy" buttons
// ============================================================================

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348012345678";
const EMAIL = process.env.NEXT_PUBLIC_INQUIRY_EMAIL || "bookings@perlz.com";

export function buildWhatsAppLink(itemTitle, kind = "beat") {
  const message = `Hi Perlz, I'm interested in licensing the ${kind} "${itemTitle}". Can we discuss?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildEmailLink(itemTitle, kind = "beat") {
  const subject = `Inquiry — ${itemTitle}`;
  const body = `Hi Perlz,\n\nI'd like to license your ${kind} "${itemTitle}".\n\nMy project details:\n- Artist / Project name:\n- Intended use:\n- Timeline:\n\nThanks.`;
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}