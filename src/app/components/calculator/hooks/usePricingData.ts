import { useMemo } from "react";
import { usePricing, PricingConfig } from "../../../context/PricingContext";
import { PlanDetails, WhatsAppRates } from "../types";

/**
 * Interface for the transformed pricing data that matches the existing code structure
 */
export interface TransformedPricingData {
  // Plan details
  planDetails: PlanDetails;

  // SMS rates
  smsRates: Record<string, number>;

  // Country dial codes
  countryDialCodes: Record<string, string>;

  // WhatsApp available countries
  whatsappAvailableCountries: string[];

  // WhatsApp rates (transformed to match existing format)
  whatsappRates: WhatsAppRates;

  // Connection fee tiers
  connectionFeeTiers: Array<{ min: number; max: number; price: number }>;

  // Transaction fee tiers
  transactionFeeTiers: Array<{ min: number; max: number; rate: number }>;

  // Marketing email configuration
  marketingEmailConfig: {
    baseFee: number;
    pushNotificationRate: number;
    tiers: Array<{
      threshold: number;
      rate: number;
      volumeCost: number;
      totalCost: number;
      hasBaseFee: boolean;
    }>;
  };

  // WhatsApp store fee configuration
  whatsappStoreFeeConfig: {
    baseFee: number;
    tiers: Array<{
      max: number;
      base: number;
      rate: number;
      prevCount?: number;
    }>;
  };

  // Addon prices
  addons: {
    giftCard: { baseFee: number; perStoreFee: number };
    server: { baseFee: number; autoApplyAboveStores: number };
    sla: { baseFee: number };
    cms: { baseFee: number };
    support: { baseFee: number; percentage: number };
    dataIngestion: { percentage: number };
    app: { premium: number; standard: number; pwa: number };
  };

  // Setup fees
  setupFees: {
    onboarding: { months: number; rate: number };
    app: { premium: number; standard: number; pwa: number };
    dataIngestion: { percentage: number };
  };

  // Loading and error states
  isLoading: boolean;
  error: string | null;
}

/**
 * Transform WhatsApp rates from Firestore format to existing code format
 */
function transformWhatsappRates(config: PricingConfig): WhatsAppRates {
  const { country_rates, country_mappings } = config.whatsapp_rates;
  const result: WhatsAppRates = {};

  // Add direct country rates
  Object.entries(country_rates).forEach(([country, rates]) => {
    result[country] = {
      marketTicket: rates.marketTicket,
      utility: rates.utility,
      marketing: rates.marketing,
      otp: rates.otp,
    };
  });

  // Map countries to their reference rates
  Object.entries(country_mappings).forEach(([country, mappedTo]) => {
    if (country_rates[mappedTo]) {
      result[country] = {
        marketTicket: country_rates[mappedTo].marketTicket,
        utility: country_rates[mappedTo].utility,
        marketing: country_rates[mappedTo].marketing,
        otp: country_rates[mappedTo].otp,
      };
    }
  });

  return result;
}

/**
 * Get WhatsApp available countries from config
 */
function getWhatsappAvailableCountries(config: PricingConfig): string[] {
  const { country_rates, country_mappings } = config.whatsapp_rates;
  
  // Get all countries with direct rates
  const directCountries = Object.keys(country_rates);
  
  // Get all mapped countries
  const mappedCountries = Object.keys(country_mappings);
  
  // Combine and deduplicate
  return [...new Set([...directCountries, ...mappedCountries])];
}

/**
 * Empty pricing data for when Firestore data is not yet loaded
 */
const emptyPricingData: Omit<TransformedPricingData, 'isLoading' | 'error'> = {
  planDetails: {},
  smsRates: {},
  countryDialCodes: {},
  whatsappAvailableCountries: [],
  whatsappRates: {},
  connectionFeeTiers: [],
  transactionFeeTiers: [],
  marketingEmailConfig: {
    baseFee: 0,
    pushNotificationRate: 0,
    tiers: [],
  },
  whatsappStoreFeeConfig: {
    baseFee: 0,
    tiers: [],
  },
  addons: {
    giftCard: { baseFee: 0, perStoreFee: 0 },
    server: { baseFee: 0, autoApplyAboveStores: 0 },
    sla: { baseFee: 0 },
    cms: { baseFee: 0 },
    support: { baseFee: 0, percentage: 0 },
    dataIngestion: { percentage: 0 },
    app: { premium: 0, standard: 0, pwa: 0 },
  },
  setupFees: {
    onboarding: { months: 0, rate: 0 },
    app: { premium: 0, standard: 0, pwa: 0 },
    dataIngestion: { percentage: 0 },
  },
};

/**
 * Custom hook that transforms the pricing configuration into the format
 * used by existing calculator components
 */
export function usePricingData(): TransformedPricingData {
  const { pricingConfig, isLoading, error } = usePricing();

  return useMemo(() => {
    // If pricing config is not loaded yet, return empty data with loading state
    if (!pricingConfig) {
      return {
        ...emptyPricingData,
        isLoading,
        error,
      };
    }

    // Transform plan details
    const planDetails: PlanDetails = {};
    Object.entries(pricingConfig.plans).forEach(([key, plan]) => {
      planDetails[key] = {
        base: plan.base,
        name: plan.name,
        description: plan.description,
        fullDescription: plan.fullDescription,
      };
    });

    // Transform WhatsApp rates to match existing format
    const whatsappRates = transformWhatsappRates(pricingConfig);

    // Get WhatsApp available countries
    const whatsappAvailableCountries = getWhatsappAvailableCountries(pricingConfig);

    // Transform addons to camelCase
    const addons = {
      giftCard: {
        baseFee: pricingConfig.addons.gift_card.base_fee,
        perStoreFee: pricingConfig.addons.gift_card.per_store_fee,
      },
      server: {
        baseFee: pricingConfig.addons.server.base_fee,
        autoApplyAboveStores: pricingConfig.addons.server.auto_apply_above_stores,
      },
      sla: {
        baseFee: pricingConfig.addons.sla.base_fee,
      },
      cms: {
        baseFee: pricingConfig.addons.cms.base_fee,
      },
      support: {
        baseFee: pricingConfig.addons.support.base_fee,
        percentage: pricingConfig.addons.support.percentage,
      },
      dataIngestion: {
        percentage: pricingConfig.addons.data_ingestion.percentage,
      },
      app: {
        premium: pricingConfig.addons.app.premium,
        standard: pricingConfig.addons.app.standard,
        pwa: pricingConfig.addons.app.pwa,
      },
    };

    // Transform setup fees
    const setupFees = {
      onboarding: {
        months: pricingConfig.setup_fees.onboarding.months,
        rate: pricingConfig.setup_fees.onboarding.rate,
      },
      app: {
        premium: pricingConfig.setup_fees.app.premium,
        standard: pricingConfig.setup_fees.app.standard,
        pwa: pricingConfig.setup_fees.app.pwa,
      },
      dataIngestion: {
        percentage: pricingConfig.setup_fees.data_ingestion.percentage,
      },
    };

    // Marketing email config
    const marketingEmailConfig = {
      baseFee: pricingConfig.marketing_email_fees.base_fee,
      pushNotificationRate: pricingConfig.marketing_email_fees.push_notification_rate,
      tiers: pricingConfig.marketing_email_fees.tiers,
    };

    // WhatsApp store fee config
    const whatsappStoreFeeConfig = {
      baseFee: pricingConfig.whatsapp_rates.base_fee,
      tiers: pricingConfig.whatsapp_rates.store_fee_tiers,
    };

    return {
      planDetails,
      smsRates: pricingConfig.sms_rates,
      countryDialCodes: pricingConfig.country_dial_codes,
      whatsappAvailableCountries,
      whatsappRates,
      connectionFeeTiers: pricingConfig.connection_fees.tiers,
      transactionFeeTiers: pricingConfig.transaction_fees.tiers,
      marketingEmailConfig,
      whatsappStoreFeeConfig,
      addons,
      setupFees,
      isLoading,
      error,
    };
  }, [pricingConfig, isLoading, error]);
}

