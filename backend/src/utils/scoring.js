export function scoreProposals(proposals) {
  return proposals.map(p => {
    const price = p.parseFields?.price ?? null;
    const delivery = p.parseFields?.deliveryDays ?? null;
    const warranty = p.parseFields?.warranty ?? null;

    // --- SIMPLE SCORING RULES ---
    // Lower price  → higher score
    // Faster delivery → higher score
    // Warranty → bonus points

    let score = 0;

    // PRICE SCORING (max 50 points)
    if (price) {
      score += (500000 - price) / 10000; // lower price gets higher score
    }

    // DELIVERY SCORING (max 30 points)
    if (delivery) {
      score += (40 - delivery); // less delivery days → higher score
    }

    // WARRANTY SCORING (max 20 points)
    if (warranty) {
      if (String(warranty).includes("year")) score += 15;
      else score += 8;
    }

    return {
      vendor: p.vendorId?.name || "Unknown Vendor",
      vendorEmail: p.vendorId?.email || null,
      price,
      deliveryDays: delivery,
      warranty,
      paymentTerms: p.parseFields?.paymentTerms ?? null,
      score: Math.max(0, Math.round(score)) // never negative
    };
  });
}
