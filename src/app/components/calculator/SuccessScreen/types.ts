import { FeeBreakdown } from "../types";

export interface SuccessScreenProps {
  // User info
  firstName: string;
  lastName: string;
  
  // Plan and business info
  plan: string;
  stores: number;
  transactions: number;
  marketing: number;
  
  // Fees
  monthlyFees: number;
  setupFees: number;
  feeBreakdown: FeeBreakdown;
  
  // Add-ons
  giftCard: boolean;
  smsEnabled: boolean;
  smsMessages: string;
  smsCountry: string;
  whatsappEnabled: boolean;
  whatsappCountry: string;
  whatsappMarketTicket: number;
  whatsappUtility: number;
  whatsappMarketing: number;
  whatsappOtp: number;
  independentServer: boolean;
  premiumSLA: boolean;
  premiumSupport: boolean;
  cms: boolean;
  appType: string;
  dataIngestion: boolean;
  pushNotifications: boolean;
  
  // Discounts
  discountUnlocked: boolean;
  discountsApplied: boolean;
  itemDiscounts: Record<string, { type: "percentage" | "fixed"; value: number }>;
  subtotalDiscount: { type: "percentage" | "fixed"; value: number };
  discountReason: string;
  setItemDiscounts: (discounts: Record<string, { type: "percentage" | "fixed"; value: number }>) => void;
  setSubtotalDiscount: (discount: { type: "percentage" | "fixed"; value: number }) => void;
  setDiscountReason: (reason: string) => void;
  setAppliedItemDiscounts: (discounts: Record<string, { type: "percentage" | "fixed"; value: number }>) => void;
  setAppliedSubtotalDiscount: (discount: { type: "percentage" | "fixed"; value: number }) => void;
  setAppliedDiscountReason: (reason: string) => void;
  setDiscountsApplied: (applied: boolean) => void;
  
  // Connection tier
  selectedConnectionTierIndex: number | null;
  
  // PDF and reset
  jsPdfLoaded: boolean;
  isPdfGenerating: boolean;
  onGeneratePDF: () => void;
  onReset: () => void;
}

