import { FeeBreakdown } from "./types";
import {
  formatCurrency,
  getConnectionFeeBreakdown,
  getTransactionFeeBreakdown,
  getMarketingEmailBreakdown,
} from "./utils";
import { planDetails, smsRates, whatsappRates } from "./data";

interface QuoteParams {
  plan: string;
  stores: number;
  transactions: number;
  marketing: number;
  monthlyFees: number;
  setupFees: number;
  perStore: number;
  feeBreakdown: FeeBreakdown;
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
  businessType: string;
  selectedConnectionTierIndex: number | null;
}

export function getQuoteDetails(params: QuoteParams): string[] {
  const {
    plan,
    stores,
    feeBreakdown,
    giftCard,
    smsEnabled,
    smsCountry,
    whatsappEnabled,
    whatsappCountry,
    whatsappMarketTicket,
    whatsappUtility,
    whatsappMarketing,
    whatsappOtp,
    independentServer,
    premiumSLA,
    premiumSupport,
    marketing,
    cms,
    appType,
  } = params;

  const addOns = [];

  if (giftCard) {
    addOns.push(`Gift Card Base Fee: ${formatCurrency(500)}`);
    addOns.push(
      `Gift Card Per-Store Fee (${stores} stores @ $30/store): ${formatCurrency(stores * 30)}`
    );
  }

  if (smsEnabled) {
    addOns.push(
      `SMS Platform (${smsCountry}): ${formatCurrency(feeBreakdown.sms)}/month`
    );
  }

  if (whatsappEnabled) {
    addOns.push(`WhatsApp Base Platform Fee: ${formatCurrency(630)}/month`);
    addOns.push(
      `WhatsApp Per-Store Fee (${stores} stores): ${formatCurrency(feeBreakdown.whatsapp.perStore)}/month`
    );
    addOns.push(`WhatsApp Message Fees (${whatsappCountry}):`);
    addOns.push(
      `  • Digital Receipts: ${formatCurrency(whatsappMarketTicket * whatsappRates[whatsappCountry].marketTicket)}/month`
    );
    addOns.push(
      `  • Utility Messages: ${formatCurrency(whatsappUtility * whatsappRates[whatsappCountry].utility)}/month`
    );
    addOns.push(
      `  • Marketing Messages: ${formatCurrency(whatsappMarketing * whatsappRates[whatsappCountry].marketing)}/month`
    );
    addOns.push(
      `  • OTP Messages: ${formatCurrency(whatsappOtp * whatsappRates[whatsappCountry].otp)}/month`
    );
  }

  if (appType !== "none") {
    addOns.push(`Mobile App (${appType}): ${formatCurrency(feeBreakdown.app)}/month`);
  }

  if (independentServer) {
    addOns.push(`Independent Server: ${formatCurrency(feeBreakdown.server)}/month`);
  }

  if (premiumSLA) {
    addOns.push(`Premium SLA: ${formatCurrency(feeBreakdown.sla)}/month`);
  }

  if (plan === "loyalty") {
    addOns.push(`Loyalty Program: ${formatCurrency(feeBreakdown.baseLicense)}/month`);
  }

  if (marketing) {
    addOns.push(`Marketing Platform: ${formatCurrency(feeBreakdown.marketing)}/month`);
  }

  if (cms) {
    addOns.push(`Content Management System: ${formatCurrency(feeBreakdown.cms)}/month`);
  }

  if (premiumSupport) {
    addOns.push(`Premium Support: ${formatCurrency(feeBreakdown.support)}/month`);
  }

  return addOns;
}

export function generateQuoteDetails(params: QuoteParams) {
  const {
    plan,
    stores,
    transactions,
    marketing,
    monthlyFees,
    setupFees,
    perStore,
    feeBreakdown,
    giftCard,
    smsEnabled,
    smsMessages,
    smsCountry,
    whatsappEnabled,
    whatsappCountry,
    whatsappMarketTicket,
    whatsappUtility,
    whatsappMarketing,
    whatsappOtp,
    independentServer,
    premiumSLA,
    premiumSupport,
    cms,
    appType,
    dataIngestion,
    pushNotifications,
    businessType,
    selectedConnectionTierIndex,
  } = params;

  const quoteDetails = {
    plan: {
      name: planDetails[plan].name,
      type: plan,
      baseFee: formatCurrency(planDetails[plan].base),
      description: planDetails[plan].description,
    },
    business: {
      stores: stores,
      transactionsPerStore: transactions,
      totalTransactions: stores * transactions,
      businessType: businessType,
    },
    marketing:
      plan !== "loyalty"
        ? {
            emails: marketing,
            pushNotifications: pushNotifications,
            pushNotificationCost: pushNotifications
              ? formatCurrency(marketing * 0.0045)
              : "$0.00",
          }
        : null,
    fees: {
      baseLicense: formatCurrency(planDetails[plan].base),
      connectionFees: formatCurrency(feeBreakdown.connection),
      transactionProcessing: formatCurrency(feeBreakdown.transaction),
      marketingFees:
        plan !== "loyalty" ? formatCurrency(feeBreakdown.marketing) : "$0.00",
      totalMonthly: formatCurrency(monthlyFees),
      setupFees: formatCurrency(setupFees),
      firstYearTotal: formatCurrency(monthlyFees * 12 + setupFees),
    },
    tierBreakdowns: {
      connectionFees: getConnectionFeeBreakdown(stores, selectedConnectionTierIndex).map(
        (tier: any) => ({
          range: tier.range,
          count: tier.count,
          pricePerStore: `$${tier.price}`,
          total: formatCurrency(tier.total),
        })
      ),
      transactionProcessing: getTransactionFeeBreakdown(
        0.25 * (stores * transactions)
      ).map((tier) => ({
        range: tier.range,
        volume: tier.volume.toLocaleString(),
        ratePerTransaction: `$${tier.rate.toFixed(3)}`,
        total: formatCurrency(tier.total),
      })),
      marketingEmails:
        plan !== "loyalty"
          ? getMarketingEmailBreakdown(marketing).map((tier) => ({
              tierName: tier.tierName,
              range: tier.range,
              count: tier.count.toLocaleString(),
              ratePerThousand: `$${(tier.rate * 1000).toFixed(1)}`,
              total: formatCurrency(tier.total),
              isSelected: tier.isSelected,
            }))
          : [],
    },
    addOns: {
      giftCard: giftCard
        ? {
            enabled: true,
            baseFee: formatCurrency(500),
            perStoreFee: formatCurrency(stores * 30),
            total: formatCurrency(500 + stores * 30),
          }
        : { enabled: false },
      sms:
        smsEnabled && smsMessages && parseInt(smsMessages) > 0
          ? {
              enabled: true,
              country: smsCountry,
              messages: parseInt(smsMessages),
              rate: `$${smsRates[smsCountry].toFixed(5)}`,
              total: formatCurrency(feeBreakdown.sms),
            }
          : { enabled: false },
      whatsapp: whatsappEnabled
        ? {
            enabled: true,
            country: whatsappCountry,
            baseFee: formatCurrency(630),
            perStoreFee: formatCurrency(feeBreakdown.whatsapp.perStore),
            messages: {
              digitalReceipts: {
                count: whatsappMarketTicket,
                rate: `$${whatsappRates[whatsappCountry].marketTicket.toFixed(4)}`,
                cost: formatCurrency(
                  whatsappMarketTicket * whatsappRates[whatsappCountry].marketTicket
                ),
              },
              utility: {
                count: whatsappUtility,
                rate: `$${whatsappRates[whatsappCountry].utility.toFixed(2)}`,
                cost: formatCurrency(whatsappUtility * whatsappRates[whatsappCountry].utility),
              },
              marketing: {
                count: whatsappMarketing,
                rate: `$${whatsappRates[whatsappCountry].marketing.toFixed(2)}`,
                cost: formatCurrency(
                  whatsappMarketing * whatsappRates[whatsappCountry].marketing
                ),
              },
              otp: {
                count: whatsappOtp,
                rate: `$${whatsappRates[whatsappCountry].otp.toFixed(2)}`,
                cost: formatCurrency(whatsappOtp * whatsappRates[whatsappCountry].otp),
              },
            },
            total: formatCurrency(feeBreakdown.whatsapp.total),
          }
        : { enabled: false },
      independentServer: {
        enabled: independentServer,
        cost: independentServer ? formatCurrency(feeBreakdown.server) : "$0.00",
      },
      premiumSLA: {
        enabled: premiumSLA,
        cost: premiumSLA ? formatCurrency(feeBreakdown.sla) : "$0.00",
      },
      premiumSupport: {
        enabled: premiumSupport,
        cost: premiumSupport ? formatCurrency(feeBreakdown.support) : "$0.00",
      },
      cms: {
        enabled: cms,
        cost: cms ? formatCurrency(feeBreakdown.cms) : "$0.00",
      },
      app:
        appType !== "none"
          ? {
              type: appType,
              cost: formatCurrency(feeBreakdown.app),
            }
          : { enabled: false },
      dataIngestion: {
        enabled: dataIngestion,
        cost: dataIngestion
          ? formatCurrency(
              (monthlyFees - (premiumSupport ? 2000 + monthlyFees * 0.1 : 0)) * 0.2
            )
          : "$0.00",
      },
    },
    setupFees: {
      onboarding: formatCurrency(feeBreakdown.setup.onboarding),
      appSetup:
        appType === "premium"
          ? formatCurrency(15000)
          : appType === "standard"
          ? formatCurrency(5000)
          : appType === "pwa"
          ? formatCurrency(1000)
          : "$0.00",
      dataIngestion: dataIngestion
        ? formatCurrency(feeBreakdown.setup.dataIngestion)
        : "$0.00",
      total: formatCurrency(setupFees),
    },
    summary: {
      monthlyRecurringFees: formatCurrency(monthlyFees),
      setupFees: formatCurrency(setupFees),
      firstYearTotal: formatCurrency(monthlyFees * 12 + setupFees),
      perStoreCost: formatCurrency(perStore),
    },
  };

  return quoteDetails;
}

