import { PlanDetails, WhatsAppRates } from "./types";

export const smsRates: Record<string, number> = {
  USA: 0.01015,
  Canada: 0.01015,
  Mexico: 0.06849,
  Argentina: 0.07967,
  UAE: 0.1243,
  Ecuador: 0.20303,
  Australia: 0.039675,
  Colombia: 0.00181,
  Guatemala: 0.2415,
  "Costa Rica": 0.0538,
  Honduras: 0.13928,
  Nicaragua: 0.12813,
  "El Salvador": 0.076,
  Chile: 0.05955,
};

export const planDetails: PlanDetails = {
  loyalty: {
    base: 1000,
    name: "Spoonity Loyalty",
    description: "Core loyalty functionality",
    fullDescription:
      "The Spoonity Loyalty plan provides a complete loyalty platform for your business. It includes a base license fee of $1,000/month plus per-store connection fees that scale based on volume. This plan includes unlimited users, CRM functionality, unlimited earning and spending rules, unlimited members, and standard reporting capabilities.",
  },
  marketing: {
    base: 1500,
    name: "Spoonity Marketing",
    description: "Includes Loyalty + Marketing features",
    fullDescription:
      "The Spoonity Marketing plan includes all Loyalty features plus comprehensive marketing capabilities. It starts with a base license fee of $1,500/month plus per-store connection fees. Marketing emails use a licensed-based model with committed volume pricing: $500 base fee plus tier-based costs based on committed volumes.",
  },
  intelligence: {
    base: 3000,
    name: "Spoonity Intelligence",
    description: "Includes Loyalty, Marketing + Analytics",
    fullDescription:
      "The Spoonity Intelligence plan is our most comprehensive offering. It includes all Loyalty and Marketing features plus advanced analytics. The base license fee is $3,000/month plus per-store connection fees. This plan includes 1 million transactions per month at no additional cost, with data processing fees for higher volumes. It includes comprehensive dashboards for customer analytics, loyalty segments, and cohort analysis.",
  },
};

export const countryDialCodes: Record<string, string> = {
  USA: "+1",
  Canada: "+1", // Added Canada dial code
  Mexico: "+52",
  Argentina: "+54",
  UAE: "+971",
  Ecuador: "+593",
  Australia: "+61",
  Colombia: "+57",
  Guatemala: "+502",
  "Costa Rica": "+506",
  Honduras: "+504",
  Nicaragua: "+505",
  "El Salvador": "+503",
  Chile: "+56",
};

export const whatsappAvailableCountries = [
  "Argentina",
  "Brazil",
  "Chile",
  "Colombia",
  "Mexico",
  "Peru",
  "North America",
  "Rest of Latin America",
  // Added countries for Rest of Latam pricing
  "Ecuador",
  "Honduras",
  "Guatemala",
  "Costa Rica",
  "Nicaragua",
  "El Salvador",
];

export const whatsappRates: WhatsAppRates = {
  Argentina: {
    marketTicket: 0.0469, // Digital Receipts
    utility: 0.06,
    marketing: 0.09,
    otp: 0.04,
  },
  Brazil: {
    marketTicket: 0.0138, // Digital Receipts
    utility: 0.02,
    marketing: 0.09,
    otp: 0.04,
  },
  Chile: {
    marketTicket: 0.0276, // Digital Receipts
    utility: 0.04,
    marketing: 0.12,
    otp: 0.05,
  },
  Colombia: {
    marketTicket: 0.012, // Digital Receipts
    utility: 0.03,
    marketing: 0.04,
    otp: 0.01,
  },
  Mexico: {
    marketTicket: 0.0138, // Digital Receipts
    utility: 0.03,
    marketing: 0.07,
    otp: 0.03,
  },
  Peru: {
    marketTicket: 0.024, // Digital Receipts
    utility: 0.04,
    marketing: 0.08,
    otp: 0.04,
  },
  "North America": {
    marketTicket: 0.0138, // Digital Receipts
    utility: 0.03,
    marketing: 0.05,
    otp: 0.02,
  },
  "Rest of Latin America": {
    marketTicket: 0.0156, // Digital Receipts
    utility: 0.03,
    marketing: 0.11,
    otp: 0.05,
  },
};

// Map additional countries to "Rest of Latin America" rates
[
  "Ecuador",
  "Honduras",
  "Guatemala",
  "Costa Rica",
  "Nicaragua",
  "El Salvador",
  "Chile",
  "Colombia",
].forEach((country) => {
  whatsappRates[country] = whatsappRates["Rest of Latin America"];
});
