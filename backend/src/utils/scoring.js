export function scoreProposals(proposals) {
  return proposals.map(p => {
    // 🔹 Support both `parseFields` and `parsedFields`
    const fields = p.parseFields || p.parsedFields || {};

    const price = fields.price ?? p.price ?? null;
    const delivery = fields.deliveryDays ?? null;
    const warranty = fields.warranty ?? null;
    const paymentTerms = fields.paymentTerms ?? null;

    let score = 0;

    // PRICE (lower is better)
    if (price) {
      score += (500000 - price) / 10000; // example scaling
    }

    // DELIVERY (faster is better)
    if (delivery) {
      score += (40 - delivery); // less days → higher score
    }

    // WARRANTY (bonus)
    if (warranty) {
      const w = String(warranty).toLowerCase();
      if (w.includes("year")) score += 15;
      else score += 8;
    }

    return {
      vendor: p.vendorId?.name || "Unknown Vendor",
      vendorEmail: p.vendorId?.email || null,
      price,
      deliveryDays: delivery,
      warranty,
      paymentTerms,
      score: Math.max(0, Math.round(score))
    };
  });
}
