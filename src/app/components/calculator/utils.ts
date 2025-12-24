// Connection fee tier type
export interface ConnectionFeeTier {
  min: number;
  max: number;
  price: number;
}

// Transaction fee tier type
export interface TransactionFeeTier {
  min: number;
  max: number;
  rate: number;
}

// Marketing email tier type
export interface MarketingEmailTier {
  threshold: number;
  rate: number;
  volumeCost: number;
  totalCost: number;
  hasBaseFee: boolean;
}

// Marketing email config type
export interface MarketingEmailConfig {
  baseFee: number;
  pushNotificationRate: number;
  tiers: MarketingEmailTier[];
}

// WhatsApp store fee tier type
export interface WhatsappStoreFeeTier {
  max: number;
  base: number;
  rate: number;
  prevCount?: number;
}

// Default connection fee tiers (fallback)
const DEFAULT_CONNECTION_TIERS: ConnectionFeeTier[] = [
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

// Default transaction fee tiers (fallback)
const DEFAULT_TRANSACTION_TIERS: TransactionFeeTier[] = [
  { min: 0, max: 5000, rate: 0.005 },
  { min: 5001, max: 50000, rate: 0.003 },
  { min: 50001, max: 999999999, rate: 0.002 },
];

// Default marketing email tiers (fallback)
const DEFAULT_MARKETING_TIERS: MarketingEmailTier[] = [
  { threshold: 10000, rate: 0, volumeCost: 0, totalCost: 0, hasBaseFee: false },
  { threshold: 100000, rate: 0.008, volumeCost: 800, totalCost: 1300, hasBaseFee: true },
  { threshold: 250000, rate: 0.006, volumeCost: 1500, totalCost: 2000, hasBaseFee: true },
  { threshold: 500000, rate: 0.0045, volumeCost: 2250, totalCost: 2750, hasBaseFee: true },
  { threshold: 1000000, rate: 0.0034, volumeCost: 3375, totalCost: 3875, hasBaseFee: true },
  { threshold: 2500000, rate: 0.0025, volumeCost: 6328, totalCost: 6828, hasBaseFee: true },
  { threshold: 10000000, rate: 0.0022, volumeCost: 21516, totalCost: 22016, hasBaseFee: true },
];

// Default WhatsApp store fee tiers (fallback)
const DEFAULT_WHATSAPP_STORE_TIERS: WhatsappStoreFeeTier[] = [
  { max: 10, base: 0, rate: 9 },
  { max: 80, base: 90, rate: 8.1, prevCount: 10 },
  { max: 149, base: 657, rate: 7.2, prevCount: 80 },
  { max: 99999, base: 1153.8, rate: 6.3, prevCount: 149 },
];

/**
 * Calculate WhatsApp store fees based on tier configuration
 */
export const calculateWhatsappStoreFeeTiers = (
  storeCount: number,
  tiers: WhatsappStoreFeeTier[] = DEFAULT_WHATSAPP_STORE_TIERS
): number => {
  // Sort tiers by max to ensure proper order
  const sortedTiers = [...tiers].sort((a, b) => a.max - b.max);
  
  // Find the applicable tier
  for (const tier of sortedTiers) {
    if (storeCount <= tier.max) {
      // Calculate based on base + (stores beyond previous tier * rate)
      const prevCount = tier.prevCount || 0;
      const storesInTier = storeCount - prevCount;
      return tier.base + (storesInTier * tier.rate);
    }
  }
  
  // If store count exceeds all tiers, use the last tier
  const lastTier = sortedTiers[sortedTiers.length - 1];
  const prevCount = lastTier.prevCount || 0;
  const storesInTier = storeCount - prevCount;
  return lastTier.base + (storesInTier * lastTier.rate);
};

/**
 * Calculate connection fees based on store count and tier configuration
 */
export const calculateConnectionFees = (
  storeCount: number,
  selectedConnectionTierIndex: number | null,
  tiers: ConnectionFeeTier[] = DEFAULT_CONNECTION_TIERS
): number => {
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

/**
 * Get connection fee breakdown for display
 */
export const getConnectionFeeBreakdown = (
  storeCount: number,
  selectedConnectionTierIndex: number | null,
  tiers: ConnectionFeeTier[] = DEFAULT_CONNECTION_TIERS
) => {
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
    } as {
      range: string;
      count: number;
      price: number;
      total: number;
      isSelected: boolean;
      tierName: string;
    };
  });
};

/**
 * Get transaction fee rate based on volume
 */
export const getTransactionFeeRate = (
  transactionVolume: number,
  tiers: TransactionFeeTier[] = DEFAULT_TRANSACTION_TIERS
): { rate: number; range: string } => {
  // Sort tiers by max to ensure proper order
  const sortedTiers = [...tiers].sort((a, b) => a.max - b.max);
  
  for (const tier of sortedTiers) {
    if (transactionVolume <= tier.max) {
      return {
        rate: tier.rate,
        range: `${tier.min.toLocaleString()}-${tier.max.toLocaleString()}`,
      };
    }
  }
  
  // Return the last tier if volume exceeds all tiers
  const lastTier = sortedTiers[sortedTiers.length - 1];
  return {
    rate: lastTier.rate,
    range: `${lastTier.min.toLocaleString()}+`,
  };
};

/**
 * Get transaction fee breakdown for display
 */
export const getTransactionFeeBreakdown = (
  transactionVolume: number,
  tiers: TransactionFeeTier[] = DEFAULT_TRANSACTION_TIERS
) => {
  const { rate, range } = getTransactionFeeRate(transactionVolume, tiers);

  return [
    {
      range: range,
      volume: transactionVolume,
      rate: rate,
      total: transactionVolume * rate,
    },
  ];
};

/**
 * Get marketing email breakdown for display
 */
export const getMarketingEmailBreakdown = (
  emailCount: number,
  tiers: MarketingEmailTier[] = DEFAULT_MARKETING_TIERS,
  baseFee: number = 500
) => {
  // Licensed-based model: merchant is charged for committed volume
  // First 10,000 emails are included in Marketing package, base fee applies to higher tiers
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

  // Sort tiers by threshold
  const sortedTiers = [...tiers].sort((a, b) => a.threshold - b.threshold);

  // Find the appropriate tier based on email count
  let selectedTierIndex = 0;
  for (let i = 0; i < sortedTiers.length; i++) {
    if (emailCount <= sortedTiers[i].threshold) {
      selectedTierIndex = i;
      break;
    }
  }

  // If email count exceeds the highest tier, use the highest tier
  if (emailCount > sortedTiers[sortedTiers.length - 1].threshold) {
    selectedTierIndex = sortedTiers.length - 1;
  }

  // Build range strings and add all tiers to breakdown
  let prevThreshold = 0;
  sortedTiers.forEach((tier, index) => {
    const isSelected = index === selectedTierIndex;
    // First tier has no base fee as it's included in the Marketing package
    const tierBaseFee = tier.hasBaseFee ? baseFee : 0;
    const rangeStart = prevThreshold === 0 ? 0 : prevThreshold + 1;
    const rangeString = `${rangeStart.toLocaleString()}-${tier.threshold.toLocaleString()}`;
    
    breakdown.push({
      range: rangeString,
      count: isSelected ? emailCount : tier.threshold,
      rate: tier.rate,
      volumeCost: tier.volumeCost,
      baseFee: tierBaseFee,
      total: tier.totalCost,
      isSelected: isSelected,
      tierName: `Tier ${index + 1}`,
    });
    
    prevThreshold = tier.threshold;
  });

  return breakdown;
};

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Export default tiers for backward compatibility
export {
  DEFAULT_CONNECTION_TIERS,
  DEFAULT_TRANSACTION_TIERS,
  DEFAULT_MARKETING_TIERS,
  DEFAULT_WHATSAPP_STORE_TIERS,
};
