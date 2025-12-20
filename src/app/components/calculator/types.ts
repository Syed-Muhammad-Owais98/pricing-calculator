export type WhatsAppRates = {
  [key: string]: {
    marketTicket: number;
    utility: number;
    marketing: number;
    otp: number;
  };
};

export interface PlanDetail {
  base: number;
  name: string;
  description: string;
  fullDescription: string;
}

export type PlanDetails = Record<string, PlanDetail>;

export interface FeeBreakdown {
  total: number;
  subtotal: number;
  connection: number;
  baseLicense: number;
  transaction: number;
  marketing: number;
  giftCard: number;
  sms: number;
  whatsapp: {
    base: number;
    perStore: number;
    messages: number;
    total: number;
  };
  server: number;
  sla: number;
  cms: number;
  app: number;
  support: number;
  discount: number;
  itemDiscounts: number;
  subtotalDiscountAmount: number;
  net: {
    baseLicense: number;
    connection: number;
    transaction: number;
    marketing: number;
    giftCard: number;
    sms: number;
    whatsapp: number;
    server: number;
    sla: number;
    cms: number;
    app: number;
    support: number;
  };
  corporate: number;
  franchisee: number;
  franchiseePerStore: number;
  setup: {
    total: number;
    onboarding: number;
    appSetup: number;
    dataIngestion: number;
  };
}

export interface AddOnsTabProps {
  // SMS props
  smsEnabled: boolean;
  setSmsEnabled: (enabled: boolean) => void;
  smsCountry: string;
  setSmsCountry: (country: string) => void;
  smsMessages: string;
  setSmsMessages: (messages: string) => void;

  // WhatsApp props
  whatsappEnabled: boolean;
  setWhatsappEnabled: (enabled: boolean) => void;
  whatsappCountry: string;
  setWhatsappCountry: (country: string) => void;
  whatsappMarketTicket: number;
  setWhatsappMarketTicket: (value: number) => void;
  whatsappUtility: number;
  setWhatsappUtility: (value: number) => void;
  whatsappMarketing: number;
  setWhatsappMarketing: (value: number) => void;
  whatsappOtp: number;
  setWhatsappOtp: (value: number) => void;

  // App props
  appType: string;
  setAppType: (type: string) => void;
  cms: boolean;
  setCms: (cms: boolean) => void;

  // Other add-ons
  giftCard: boolean;
  setGiftCard: (giftCard: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (pushNotifications: boolean) => void;
  independentServer: boolean;
  setIndependentServer: (independentServer: boolean) => void;
  premiumSLA: boolean;
  setPremiumSLA: (premiumSLA: boolean) => void;
  premiumSupport: boolean;
  setPremiumSupport: (premiumSupport: boolean) => void;
  dataIngestion: boolean;
  setDataIngestion: (dataIngestion: boolean) => void;

  // Other props
  plan: string;
  stores: number;
  transactions: number;
  country: string;
  feeBreakdown: FeeBreakdown;
  handleTabChange: (tab: string) => void;
}