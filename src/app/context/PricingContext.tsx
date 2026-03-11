"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  fetchPricingConfig,
  PricingConfig,
  PricingMetadata,
} from "../utils/fetchPricing";

/*
 * ============================================================================
 * DEFAULT VALUES - COMMENTED OUT
 * ============================================================================
 * All default/fallback values have been commented out.
 * The application now relies solely on Firestore data.
 * If Firestore fails to load, the app will show an error state.
 * ============================================================================
 */

// // Default values for plans (fallback when Firestore is not available)
// const defaultPlans: PricingConfig["plans"] = {
//   loyalty: {
//     base: 1000,
//     name: "Spoonity Loyalty",
//     description: "Core loyalty functionality",
//     fullDescription:
//       "The Spoonity Loyalty plan provides a complete loyalty platform for your business. It includes a base license fee of $1,000/month plus per-store connection fees that scale based on volume. This plan includes unlimited users, CRM functionality, unlimited earning and spending rules, unlimited members, and standard reporting capabilities.",
//   },
//   marketing: {
//     base: 1500,
//     name: "Spoonity Marketing",
//     description: "Includes Loyalty + Marketing features",
//     fullDescription:
//       "The Spoonity Marketing plan includes all Loyalty features plus comprehensive marketing capabilities. It starts with a base license fee of $1,500/month plus per-store connection fees. Marketing emails use a licensed-based model with committed volume pricing: $500 base fee plus tier-based costs based on committed volumes.",
//   },
//   intelligence: {
//     base: 3000,
//     name: "Spoonity Intelligence",
//     description: "Includes Loyalty, Marketing + Analytics",
//     fullDescription:
//       "The Spoonity Intelligence plan is our most comprehensive offering. It includes all Loyalty and Marketing features plus advanced analytics. The base license fee is $3,000/month plus per-store connection fees. This plan includes 1 million transactions per month at no additional cost, with data processing fees for higher volumes. It includes comprehensive dashboards for customer analytics, loyalty segments, and cohort analysis.",
//   },
// };

// // Default connection fee tiers
// const defaultConnectionFees: PricingConfig["connection_fees"] = {
//   description: "Per store fees based on total store count",
//   tiers: [
//     { min: 0, max: 10, price: 150 },
//     { min: 11, max: 25, price: 135 },
//     { min: 26, max: 40, price: 121.5 },
//     { min: 41, max: 55, price: 109.35 },
//     { min: 56, max: 100, price: 98.42 },
//     { min: 101, max: 150, price: 88.57 },
//     { min: 151, max: 250, price: 79.72 },
//     { min: 251, max: 500, price: 71.74 },
//     { min: 501, max: 1000, price: 64.57 },
//     { min: 1001, max: 10000, price: 58.11 },
//   ],
// };

// // Default transaction fee tiers
// const defaultTransactionFees: PricingConfig["transaction_fees"] = {
//   description: "Fees per transaction based on volume",
//   tiers: [
//     { min: 0, max: 5000, rate: 0.005 },
//     { min: 5001, max: 50000, rate: 0.003 },
//     { min: 50001, max: 999999999, rate: 0.002 },
//   ],
// };

// // Default marketing email fees
// const defaultMarketingEmailFees: PricingConfig["marketing_email_fees"] = {
//   description: "Fees for marketing emails",
//   base_fee: 500,
//   push_notification_rate: 0.0045,
//   tiers: [
//     { threshold: 10000, rate: 0, volumeCost: 0, totalCost: 0, hasBaseFee: false },
//     { threshold: 100000, rate: 0.008, volumeCost: 800, totalCost: 1300, hasBaseFee: true },
//     { threshold: 250000, rate: 0.006, volumeCost: 1500, totalCost: 2000, hasBaseFee: true },
//     { threshold: 500000, rate: 0.0045, volumeCost: 2250, totalCost: 2750, hasBaseFee: true },
//     { threshold: 1000000, rate: 0.0034, volumeCost: 3375, totalCost: 3875, hasBaseFee: true },
//     { threshold: 2500000, rate: 0.0025, volumeCost: 6328, totalCost: 6828, hasBaseFee: true },
//     { threshold: 10000000, rate: 0.0022, volumeCost: 21516, totalCost: 22016, hasBaseFee: true },
//   ],
// };

// // Default SMS rates
// const defaultSmsRates: PricingConfig["sms_rates"] = {
//   USA: 0.01015,
//   Canada: 0.01015,
//   Mexico: 0.06849,
//   Argentina: 0.07967,
//   UAE: 0.1243,
//   Ecuador: 0.20303,
//   Australia: 0.039675,
//   Colombia: 0.00181,
//   Guatemala: 0.2415,
//   "Costa Rica": 0.0538,
//   Honduras: 0.13928,
//   Nicaragua: 0.12813,
//   "El Salvador": 0.076,
//   Chile: 0.05955,
// };

// // Default WhatsApp rates
// const defaultWhatsappRates: PricingConfig["whatsapp_rates"] = {
//   base_fee: 630,
//   store_fee_tiers: [
//     { max: 10, base: 0, rate: 9 },
//     { max: 80, base: 90, rate: 8.1, prevCount: 10 },
//     { max: 149, base: 657, rate: 7.2, prevCount: 80 },
//     { max: 99999, base: 1153.8, rate: 6.3, prevCount: 149 },
//   ],
//   country_rates: {
//     Argentina: { marketTicket: 0.0469, utility: 0.06, marketing: 0.09, otp: 0.04 },
//     Brazil: { marketTicket: 0.0138, utility: 0.02, marketing: 0.09, otp: 0.04 },
//     Chile: { marketTicket: 0.0276, utility: 0.04, marketing: 0.12, otp: 0.05 },
//     Colombia: { marketTicket: 0.012, utility: 0.03, marketing: 0.04, otp: 0.01 },
//     Mexico: { marketTicket: 0.0138, utility: 0.03, marketing: 0.07, otp: 0.03 },
//     Peru: { marketTicket: 0.024, utility: 0.04, marketing: 0.08, otp: 0.04 },
//     "North America": { marketTicket: 0.0138, utility: 0.03, marketing: 0.05, otp: 0.02 },
//     "Rest of Latin America": { marketTicket: 0.0156, utility: 0.03, marketing: 0.11, otp: 0.05 },
//   },
//   country_mappings: {
//     Ecuador: "Rest of Latin America",
//     Honduras: "Rest of Latin America",
//     Guatemala: "Rest of Latin America",
//     "Costa Rica": "Rest of Latin America",
//     Nicaragua: "Rest of Latin America",
//     "El Salvador": "Rest of Latin America",
//   },
// };

// // Default addons
// const defaultAddons: PricingConfig["addons"] = {
//   gift_card: { base_fee: 500, per_store_fee: 30 },
//   server: { base_fee: 500, auto_apply_above_stores: 50 },
//   sla: { base_fee: 2000 },
//   cms: { base_fee: 530 },
//   support: { base_fee: 2000, percentage: 0.1 },
//   data_ingestion: { percentage: 0.2 },
//   app: { premium: 1080, standard: 350, pwa: 350 },
// };

// // Default setup fees
// const defaultSetupFees: PricingConfig["setup_fees"] = {
//   onboarding: { months: 3, rate: 0.33 },
//   app: { premium: 15000, standard: 5000, pwa: 1000 },
//   data_ingestion: { percentage: 0.2, base: "totalBeforeSupport" },
// };

// // Default country dial codes
// const defaultCountryDialCodes: PricingConfig["country_dial_codes"] = {
//   USA: "+1",
//   Canada: "+1",
//   Mexico: "+52",
//   Argentina: "+54",
//   UAE: "+971",
//   Ecuador: "+593",
//   Australia: "+61",
//   Colombia: "+57",
//   Guatemala: "+502",
//   "Costa Rica": "+506",
//   Honduras: "+504",
//   Nicaragua: "+505",
//   "El Salvador": "+503",
//   Chile: "+56",
// };

// // Full default configuration - COMMENTED OUT
// const defaultPricingConfig: PricingConfig = {
//   plans: defaultPlans,
//   connection_fees: defaultConnectionFees,
//   transaction_fees: defaultTransactionFees,
//   marketing_email_fees: defaultMarketingEmailFees,
//   sms_rates: defaultSmsRates,
//   whatsapp_rates: defaultWhatsappRates,
//   addons: defaultAddons,
//   setup_fees: defaultSetupFees,
//   country_dial_codes: defaultCountryDialCodes,
// };

// Context interface - pricingConfig can be null when not loaded
interface PricingContextValue {
  pricingConfig: PricingConfig | null;
  metadata: PricingMetadata | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Create context
const PricingContext = createContext<PricingContextValue | undefined>(
  undefined
);

// Provider props
interface PricingProviderProps {
  children: React.ReactNode;
}

// Provider component
export function PricingProvider({ children }: PricingProviderProps) {
  // Start with null - no defaults
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(
    null
  );
  const [metadata, setMetadata] = useState<PricingMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { config, metadata: fetchedMetadata } = await fetchPricingConfig();

      // Validate that all required fields are present from Firestore
      const requiredFields: (keyof PricingConfig)[] = [
        "plans",
        "connection_fees",
        "transaction_fees",
        "marketing_email_fees",
        "sms_rates",
        "whatsapp_rates",
        "addons",
        "setup_fees",
        "country_dial_codes",
      ];

      const missingFields = requiredFields.filter((field) => !config[field]);

      if (missingFields.length > 0) {
        throw new Error(
          `Missing required pricing data from Firestore: ${missingFields.join(
            ", "
          )}`
        );
      }

      // Type assertion since we validated all fields are present
      setPricingConfig(config as PricingConfig);
      setMetadata(fetchedMetadata);

      console.log("Pricing configuration loaded from Firestore:", config);
    } catch (err) {
      console.error("Error loading pricing configuration:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load pricing configuration"
      );
      // No fallback - pricingConfig remains null
      setPricingConfig(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value: PricingContextValue = {
    pricingConfig,
    metadata,
    isLoading,
    error,
    refetch: fetchData,
  };

  return (
    <PricingContext.Provider value={value}>{children}</PricingContext.Provider>
  );
}

// Custom hook to use pricing context
export function usePricing(): PricingContextValue {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
}

// Export types for use elsewhere
export type { PricingConfig, PricingMetadata };
