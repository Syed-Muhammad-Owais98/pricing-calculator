import { FeeBreakdown, PlanDetails, WhatsAppRates, AddonPricing } from "../types";

// Discount types
export interface DiscountValue {
  type: "percentage" | "fixed";
  value: number;
}

export type ItemDiscounts = Record<string, DiscountValue>;

// Connection fee tier type from breakdown
export interface ConnectionFeeTier {
  range: string;
  count: number;
  price: number;
  total: number;
  isSelected: boolean;
  tierName: string;
}

// Transaction fee tier type
export interface TransactionFeeTier {
  range: string;
  volume: number;
  rate: number;
  total: number;
}

// Marketing email tier type
export interface MarketingEmailTier {
  range: string;
  count: number;
  rate: number;
  volumeCost: number;
  baseFee: number;
  total: number;
  isSelected: boolean;
  tierName: string;
}

// Summary Tab Props
export interface SummaryTabProps {
  // Plan and basic info
  plan: string;
  stores: number;
  transactions: number;
  marketing: number;
  monthlyFees: number;
  setupFees: number;
  feeBreakdown: FeeBreakdown;
  
  // Pricing configuration (dynamic from Firestore)
  planDetails: PlanDetails;
  whatsappRates: WhatsAppRates;
  addons: AddonPricing;

  // Add-on states
  giftCard: boolean;
  smsEnabled: boolean;
  smsMessages: string;
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

  // Discount states
  discountUnlocked: boolean;
  setDiscountUnlocked: (unlocked: boolean) => void;
  showDiscountInput: boolean;
  setShowDiscountInput: (show: boolean) => void;
  discountPassword: string;
  setDiscountPassword: (password: string) => void;
  showItemDiscounts: boolean;
  setShowItemDiscounts: (show: boolean) => void;
  subtotalDiscount: DiscountValue;
  setSubtotalDiscount: (discount: DiscountValue) => void;
  discountReason: string;
  setDiscountReason: (reason: string) => void;
  itemDiscounts: ItemDiscounts;
  setItemDiscounts: (discounts: ItemDiscounts) => void;
  discountsApplied: boolean;
  setDiscountsApplied: (applied: boolean) => void;
  setAppliedItemDiscounts: (discounts: ItemDiscounts) => void;
  setAppliedSubtotalDiscount: (discount: DiscountValue) => void;
  setAppliedDiscountReason: (reason: string) => void;

  // Connection tier selection
  selectedConnectionTierIndex: number | null;
  setSelectedConnectionTierIndex: (index: number | null) => void;

  // Submit handling
  isSubmitting: boolean;
  submitError: string;
  submitData: () => void;
}

// Sub-component props
export interface PlanHeaderProps {
  planName: string;
  monthlyFees: number;
  planDescription: string;
}

export interface BasicFeesSectionProps {
  plan: string;
  stores: number;
  feeBreakdown: FeeBreakdown;
  marketing: number;
  pushNotifications: boolean;
  // Pricing configuration
  planDetails: PlanDetails;
  pushNotificationRate: number;
}

export interface ConnectionFeeBreakdownProps {
  stores: number;
  selectedConnectionTierIndex: number | null;
  setSelectedConnectionTierIndex: (index: number | null) => void;
  discountUnlocked: boolean;
}

export interface TransactionBreakdownProps {
  stores: number;
  transactions: number;
}

export interface MarketingBreakdownProps {
  marketing: number;
}

export interface AddOnsSectionProps {
  giftCard: boolean;
  smsEnabled: boolean;
  smsMessages: string;
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
  stores: number;
  monthlyFees: number;
  feeBreakdown: FeeBreakdown;
  // Pricing configuration
  whatsappRates: WhatsAppRates;
  addons: AddonPricing;
}

export interface SetupFeeBreakdownProps {
  feeBreakdown: FeeBreakdown;
  appType: string;
  dataIngestion: boolean;
}

export interface TotalsSectionProps {
  monthlyFees: number;
  setupFees: number;
  stores: number;
  feeBreakdown: FeeBreakdown;
}

export interface DiscountSectionProps {
  discountUnlocked: boolean;
  setDiscountUnlocked: (unlocked: boolean) => void;
  showDiscountInput: boolean;
  setShowDiscountInput: (show: boolean) => void;
  discountPassword: string;
  setDiscountPassword: (password: string) => void;
  showItemDiscounts: boolean;
  setShowItemDiscounts: (show: boolean) => void;
  subtotalDiscount: DiscountValue;
  setSubtotalDiscount: (discount: DiscountValue) => void;
  discountReason: string;
  setDiscountReason: (reason: string) => void;
  itemDiscounts: ItemDiscounts;
  setItemDiscounts: (discounts: ItemDiscounts) => void;
  discountsApplied: boolean;
  setDiscountsApplied: (applied: boolean) => void;
  setAppliedItemDiscounts: (discounts: ItemDiscounts) => void;
  setAppliedSubtotalDiscount: (discount: DiscountValue) => void;
  setAppliedDiscountReason: (reason: string) => void;
  feeBreakdown: FeeBreakdown;
}

export interface SubmitSectionProps {
  isSubmitting: boolean;
  submitError: string;
  submitData: () => void;
}

