import { db } from "../firebase/config";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

/**
 * Interface for the pricing configuration data structure
 */
export interface PricingConfig {
  plans: {
    [key: string]: {
      base: number;
      name: string;
      description: string;
      fullDescription: string;
    };
  };
  connection_fees: {
    description: string;
    tiers: Array<{
      min: number;
      max: number;
      price: number;
    }>;
  };
  transaction_fees: {
    description: string;
    tiers: Array<{
      min: number;
      max: number;
      rate: number;
    }>;
  };
  marketing_email_fees: {
    description: string;
    base_fee: number;
    tiers: Array<{
      threshold: number;
      rate: number;
      volumeCost: number;
      totalCost: number;
      hasBaseFee: boolean;
    }>;
    push_notification_rate: number;
  };
  sms_rates: {
    [country: string]: number;
  };
  whatsapp_rates: {
    base_fee: number;
    store_fee_tiers: Array<{
      max: number;
      base: number;
      rate: number;
      prevCount?: number;
    }>;
    country_rates: {
      [country: string]: {
        marketTicket: number;
        utility: number;
        marketing: number;
        otp: number;
      };
    };
    country_mappings: {
      [country: string]: string;
    };
  };
  addons: {
    gift_card: {
      base_fee: number;
      per_store_fee: number;
    };
    server: {
      base_fee: number;
      auto_apply_above_stores: number;
    };
    sla: {
      base_fee: number;
    };
    cms: {
      base_fee: number;
    };
    support: {
      base_fee: number;
      percentage: number;
    };
    data_ingestion: {
      percentage: number;
    };
    app: {
      premium: number;
      standard: number;
      pwa: number;
    };
  };
  setup_fees: {
    onboarding: {
      months: number;
      rate: number;
    };
    app: {
      premium: number;
      standard: number;
      pwa: number;
    };
    data_ingestion: {
      percentage: number;
      base: string;
    };
  };
  country_dial_codes: {
    [country: string]: string;
  };
}

export interface PricingMetadata {
  version: string;
  lastUpdated: string;
  sections: string[];
}

// Collection name constant
const COLLECTION_NAME = "pricing_configuration";

/**
 * Fetches a single document from the pricing_configuration collection
 */
export async function fetchPricingDocument<T>(docName: string): Promise<T | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, docName);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as T;
    } else {
      console.warn(`Document ${docName} not found in ${COLLECTION_NAME}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching document ${docName}:`, error);
    throw error;
  }
}

/**
 * Fetches all documents from the pricing_configuration collection
 */
export async function fetchAllPricingData(): Promise<{
  data: Record<string, any>;
  metadata: PricingMetadata | null;
}> {
  try {
    const collectionRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(collectionRef);
    
    const data: Record<string, any> = {};
    let metadata: PricingMetadata | null = null;
    
    querySnapshot.forEach((doc) => {
      if (doc.id === "_metadata") {
        metadata = doc.data() as PricingMetadata;
      } else {
        data[doc.id] = doc.data();
      }
    });
    
    return { data, metadata };
  } catch (error) {
    console.error("Error fetching all pricing data:", error);
    throw error;
  }
}

/**
 * Fetches the complete pricing configuration and returns it in a structured format
 */
export async function fetchPricingConfig(): Promise<{
  config: Partial<PricingConfig>;
  metadata: PricingMetadata | null;
  documentStatus: Record<string, boolean>;
}> {
  const documentNames = [
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

  const config: Partial<PricingConfig> = {};
  const documentStatus: Record<string, boolean> = {};

  try {
    // Fetch all documents in parallel
    const results = await Promise.all(
      documentNames.map(async (name) => {
        const data = await fetchPricingDocument(name);
        return { name, data };
      })
    );

    // Process results
    results.forEach(({ name, data }) => {
      documentStatus[name] = data !== null;
      if (data) {
        (config as any)[name] = data;
      }
    });

    // Fetch metadata
    const metadata = await fetchPricingDocument<PricingMetadata>("_metadata");
    documentStatus["_metadata"] = metadata !== null;

    return { config, metadata, documentStatus };
  } catch (error) {
    console.error("Error fetching pricing config:", error);
    throw error;
  }
}

/**
 * Helper function to get plans data
 */
export async function fetchPlans() {
  return fetchPricingDocument<PricingConfig["plans"]>("plans");
}

/**
 * Helper function to get connection fees data
 */
export async function fetchConnectionFees() {
  return fetchPricingDocument<PricingConfig["connection_fees"]>("connection_fees");
}

/**
 * Helper function to get transaction fees data
 */
export async function fetchTransactionFees() {
  return fetchPricingDocument<PricingConfig["transaction_fees"]>("transaction_fees");
}

/**
 * Helper function to get marketing email fees data
 */
export async function fetchMarketingEmailFees() {
  return fetchPricingDocument<PricingConfig["marketing_email_fees"]>("marketing_email_fees");
}

/**
 * Helper function to get SMS rates data
 */
export async function fetchSmsRates() {
  return fetchPricingDocument<PricingConfig["sms_rates"]>("sms_rates");
}

/**
 * Helper function to get WhatsApp rates data
 */
export async function fetchWhatsappRates() {
  return fetchPricingDocument<PricingConfig["whatsapp_rates"]>("whatsapp_rates");
}

/**
 * Helper function to get addons data
 */
export async function fetchAddons() {
  return fetchPricingDocument<PricingConfig["addons"]>("addons");
}

/**
 * Helper function to get setup fees data
 */
export async function fetchSetupFees() {
  return fetchPricingDocument<PricingConfig["setup_fees"]>("setup_fees");
}

/**
 * Helper function to get country dial codes data
 */
export async function fetchCountryDialCodes() {
  return fetchPricingDocument<PricingConfig["country_dial_codes"]>("country_dial_codes");
}

