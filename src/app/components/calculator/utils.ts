
export const calculateWhatsappStoreFeeTiers = (storeCount: number): number => {
  let fee = 0;
  if (storeCount <= 10) {
    fee = storeCount * 9.0;
  } else if (storeCount <= 80) {
    fee = 10 * 9.0 + (storeCount - 10) * 8.1;
  } else if (storeCount <= 149) {
    fee = 10 * 9.0 + 70 * 8.1 + (storeCount - 80) * 7.2;
  } else {
    fee = 10 * 9.0 + 70 * 8.1 + 69 * 7.2 + (storeCount - 149) * 6.3;
  }
  return fee;
};

export const calculateConnectionFees = (
  storeCount: number,
  selectedConnectionTierIndex: number | null
): number => {
  const tiers = [
    { min: 0, max: 10, price: 150 },
    { min: 11, max: 25, price: 135 },
    { min: 26, max: 40, price: 121.5 },
    { min: 41, max: 55, price: 109.35 },
    { min: 56, max: 100, price: 98.42 },
    { min: 101, max: 150, price: 88.57 },
    { min: 151, max: 250, price: 79.72 },
    { min: 251, max: 500, price: 71.74 },
    { min: 501, max: 1000, price: 64.57 },
    { min: 1001, max: 10000, price: 58.11 },
  ];

  // Use manually selected tier if available, otherwise find the applicable tier
  let applicableTier = tiers[0];
  if (
    selectedConnectionTierIndex !== null &&
    selectedConnectionTierIndex >= 0 &&
    selectedConnectionTierIndex < tiers.length
  ) {
    applicableTier = tiers[selectedConnectionTierIndex];
  } else {
    // Find the applicable tier based on store count
    for (const tier of tiers) {
      if (storeCount >= tier.min && storeCount <= tier.max) {
        applicableTier = tier;
        break;
      }
    }
  }

  return storeCount * applicableTier.price;
};

export const getConnectionFeeBreakdown = (
  storeCount: number,
  selectedConnectionTierIndex: number | null
) => {
  const tiers = [
    { min: 0, max: 10, price: 150 },
    { min: 11, max: 25, price: 135 },
    { min: 26, max: 40, price: 121.5 },
    { min: 41, max: 55, price: 109.35 },
    { min: 56, max: 100, price: 98.42 },
    { min: 101, max: 150, price: 88.57 },
    { min: 151, max: 250, price: 79.72 },
    { min: 251, max: 500, price: 71.74 },
    { min: 501, max: 1000, price: 64.57 },
    { min: 1001, max: 10000, price: 58.11 },
  ];

  // Use manually selected tier if available, otherwise find the applicable tier
  let selectedTierIndex = 0;
  if (
    selectedConnectionTierIndex !== null &&
    selectedConnectionTierIndex >= 0 &&
    selectedConnectionTierIndex < tiers.length
  ) {
    selectedTierIndex = selectedConnectionTierIndex;
  } else {
    // Find the applicable tier based on store count
    for (let i = 0; i < tiers.length; i++) {
      const t = tiers[i];
      if (storeCount >= t.min && storeCount <= t.max) {
        selectedTierIndex = i;
        break;
      }
    }
  }

  // Return all tiers, styled like Marketing breakdown
  return tiers.map((tier, index) => {
    const isSelected = index === selectedTierIndex;
    // If this tier is selected, use actual store count; otherwise show tier max
    const count = isSelected ? storeCount : tier.max;
    return {
      range: `${tier.min}-${tier.max}`,
      count,
      price: tier.price,
      total: isSelected ? storeCount * tier.price : tier.max * tier.price,
      isSelected,
      tierName: `Tier ${index + 1}`,
    } as any;
  });
};

export const getTransactionFeeBreakdown = (transactionVolume: number) => {
  let rate = 0.005; // Default rate
  let range = "0-5,000";

  if (transactionVolume > 50000) {
    rate = 0.002;
    range = "50,001+";
  } else if (transactionVolume > 5000) {
    rate = 0.003;
    range = "5,001-50,000";
  }

  return [
    {
      range: range,
      volume: transactionVolume,
      rate: rate,
      total: transactionVolume * rate,
    },
  ];
};

export const getMarketingEmailBreakdown = (emailCount: number) => {
  // Licensed-based model: merchant is charged for committed volume
  // First 10,000 emails are included in Marketing package, base fee of $500 applies to higher tiers
  const breakdown: Array<{
    range: string;
    count: number;
    rate: number;
    volumeCost: number;
    baseFee: number;
    total: number;
    isSelected: boolean;
    tierName: string;
  }> = [];

  // Define the new tier structure
  const tiers = [
    {
      threshold: 10000,
      range: "0-10,000",
      rate: 0.0,
      volumeCost: 0,
      totalCost: 0, // Included in Marketing package base fee
    },
    {
      threshold: 100000,
      range: "10,001-100,000",
      rate: 0.008,
      volumeCost: 800,
      totalCost: 1300,
    },
    {
      threshold: 250000,
      range: "100,001-250,000",
      rate: 0.006,
      volumeCost: 1500,
      totalCost: 2000,
    },
    {
      threshold: 500000,
      range: "250,001-500,000",
      rate: 0.0045,
      volumeCost: 2250,
      totalCost: 2750,
    },
    {
      threshold: 1000000,
      range: "500,001-1,000,000",
      rate: 0.0034,
      volumeCost: 3375,
      totalCost: 3875,
    },
    {
      threshold: 2500000,
      range: "1,000,001-2,500,000",
      rate: 0.0025,
      volumeCost: 6328,
      totalCost: 6828,
    },
    {
      threshold: 10000000,
      range: "2,500,001-10,000,000",
      rate: 0.0022,
      volumeCost: 21516,
      totalCost: 22016,
    },
  ];

  // Find the appropriate tier based on email count
  let selectedTierIndex = 0;
  for (let i = 0; i < tiers.length; i++) {
    if (emailCount <= tiers[i].threshold) {
      selectedTierIndex = i;
      break;
    }
  }

  // If email count exceeds the highest tier, use the highest tier
  if (emailCount > tiers[tiers.length - 1].threshold) {
    selectedTierIndex = tiers.length - 1;
  }

  // Add all tiers to breakdown, highlighting the selected one
  tiers.forEach((tier, index) => {
    const isSelected = index === selectedTierIndex;
    // First tier (0-10,000) has no base fee as it's included in the Marketing package
    // All other tiers have a $500 base fee
    const tierBaseFee = index === 0 ? 0 : 500;
    breakdown.push({
      range: tier.range,
      count: isSelected ? emailCount : tier.threshold,
      rate: tier.rate,
      volumeCost: tier.volumeCost,
      baseFee: tierBaseFee,
      total: tier.totalCost,
      isSelected: isSelected,
      tierName: `Tier ${index + 1}`,
    });
  });

  return breakdown;
};

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
