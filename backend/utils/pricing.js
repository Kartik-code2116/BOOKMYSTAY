/** Nightly price after optional limited-time host offer. */
export function getNightlyPriceBreakdown(property) {
  const base = Number(property.price_per_night) || 0;
  let discountPercent = 0;
  const raw = property.offer_discount_percent;
  if (raw != null && Number(raw) > 0) {
    const exp = property.offer_expires_at;
    if (!exp || new Date(exp) > new Date()) {
      discountPercent = Math.min(90, Math.max(0, Number(raw)));
    }
  }
  const effective = Math.round(base * (1 - discountPercent / 100) * 100) / 100;
  return {
    baseNightly: base,
    discountPercent,
    effectiveNightly: effective,
    offerActive: discountPercent > 0
  };
}

export function computeStayTotal(effectiveNightly, nights) {
  return Math.round(effectiveNightly * nights * 100) / 100;
}
