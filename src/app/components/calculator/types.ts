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
