import { FeeBreakdown, PlanDetails, AddonPricing, SetupFeesConfig } from "./types";
import {
  formatCurrency,
  getConnectionFeeBreakdown,
  getTransactionFeeBreakdown,
  getMarketingEmailBreakdown,
} from "./utils";

// No defaults - all pricing data must be passed as parameters

// Declare window with jspdf property for TypeScript
declare global {
  interface Window {
    jspdf?: {
      jsPDF: new () => {
        internal: { pageSize: { height: number } };
        pages: any[];
        setFontSize: (size: number) => void;
        setFont: (font: string, style: string) => void;
        setTextColor: (r: number, g: number, b: number) => void;
        setFillColor: (r: number, g: number, b: number) => void;
        setDrawColor: (r: number, g: number, b: number) => void;
        rect: (x: number, y: number, w: number, h: number, style: string) => void;
        roundedRect: (x: number, y: number, w: number, h: number, rx: number, ry: number, style: string) => void;
        line: (x1: number, y1: number, x2: number, y2: number) => void;
        text: (text: string | string[], x: number, y: number, options?: any) => any;
        splitTextToSize: (text: string, maxWidth: number) => string[];
        save: (filename: string) => void;
        output: (type: string) => string;
        addPage: () => void;
      };
    };
  }
}

interface PDFGeneratorParams {
  plan: string;
  stores: number;
  transactions: number;
  marketing: number;
  monthlyFees: number;
  setupFees: number;
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
  firstName: string;
  lastName: string;
  selectedConnectionTierIndex: number | null;
  whatsappRates: Record<string, { marketTicket: number; utility: number; marketing: number; otp: number }>;
  // Required pricing configuration from Firestore
  planDetails: PlanDetails;
  addons: AddonPricing;
  setupFeesConfig: SetupFeesConfig;
  pushNotificationRate: number;
}

export function generatePDF(params: PDFGeneratorParams, jsPdfLoaded: boolean): void {
  if (!jsPdfLoaded) {
    alert("PDF generation is loading. Please try again in a moment.");
    return;
  }

  const {
    plan,
    stores,
    transactions,
    marketing,
    monthlyFees,
    setupFees,
    feeBreakdown,
    giftCard,
    smsEnabled,
    smsMessages,
    whatsappEnabled,
    whatsappCountry,
    independentServer,
    premiumSLA,
    premiumSupport,
    cms,
    appType,
    dataIngestion,
    pushNotifications,
    firstName,
    lastName,
    selectedConnectionTierIndex,
    planDetails,
    addons,
    setupFeesConfig,
    pushNotificationRate,
  } = params;

  try {
    const { jsPDF } = window.jspdf as any;
    const doc = new jsPDF();
    const discountAmount = feeBreakdown.discount || 0;
    const subtotalBeforeDiscounts = monthlyFees + discountAmount;

    let y = 20;

    // Helper function to check if we need a new page
    const checkPageBreak = (requiredHeight: number) => {
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;

      if (y + requiredHeight > pageHeight - margin) {
        doc.addPage();
        return 20;
      }
      return y;
    };

    // Helper function to add line with page break check
    const addLine = (x1: number, currentY: number, x2: number) => {
      const newY = checkPageBreak(5);
      doc.line(x1, newY, x2, newY);
      return newY + 5;
    };

    // --- HEADER (Purple) ---
    doc.setFillColor(159, 98, 166);
    doc.rect(10, y, 190, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(planDetails[plan].name, 20, y + 18);
    doc.setFontSize(22);
    doc.text(`${formatCurrency(monthlyFees)}`, 180, y + 18, { align: "right" });
    doc.setFontSize(10);
    doc.text("/month", 180, y + 24, { align: "right" });

    y = 60;

    // --- Plan Description ---
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const descLines = doc.splitTextToSize(planDetails[plan].fullDescription, 170);
    const descHeight = descLines.length * 5 + 8;

    y = checkPageBreak(descHeight + 20);
    doc.setFillColor(247, 247, 247);
    doc.roundedRect(15, y, 180, descHeight, 3, 3, "F");
    doc.text(descLines, 20, y + 8);
    y += descHeight + 10;

    // --- Basic Fee Breakdown ---
    y = checkPageBreak(50);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("Base License Fee:", 20, y);
    doc.setTextColor(40, 40, 40);
    doc.text(formatCurrency(planDetails[plan].base), 190, y, { align: "right" });
    y += 7;

    doc.setTextColor(120, 120, 120);
    doc.text(`Connection Fees (${stores} stores):`, 20, y);
    doc.setTextColor(40, 40, 40);
    doc.text(formatCurrency(feeBreakdown.connection), 190, y, { align: "right" });
    y += 7;

    doc.setTextColor(120, 120, 120);
    doc.text("Transaction Processing:", 20, y);
    doc.setTextColor(40, 40, 40);
    doc.text(formatCurrency(feeBreakdown.transaction), 190, y, { align: "right" });
    y += 7;

    if (plan !== "loyalty") {
      doc.setTextColor(120, 120, 120);
      doc.text("Marketing Platform:", 20, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(feeBreakdown.marketing), 190, y, { align: "right" });
      y += 7;

      if (pushNotifications) {
        doc.setTextColor(120, 120, 120);
        doc.text("Push Notifications:", 20, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(marketing * pushNotificationRate), 190, y, { align: "right" });
        y += 7;
      }
    }

    // --- Tier Breakdowns ---
    y = checkPageBreak(20);
    doc.setDrawColor(230, 230, 230);
    doc.line(20, y, 190, y);
    y += 6;

    // Connection Fee Tier Breakdown
    y = checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("Connection Fee Breakdown:", 20, y);
    doc.setFont("helvetica", "normal");
    y += 6;

    getConnectionFeeBreakdown(stores, selectedConnectionTierIndex).forEach((tier: any) => {
      y = checkPageBreak(15);
      doc.setTextColor(120, 120, 120);
      doc.text(`${tier.tierName}: ${tier.range}`, 25, y);
      y += 5;
      doc.text(
        tier.isSelected
          ? `${tier.count.toLocaleString()} stores (your volume)`
          : `Up to ${tier.count.toLocaleString()} stores`,
        30,
        y
      );
      y += 5;
      doc.setTextColor(40, 40, 40);
      doc.text(`$${tier.price.toFixed(2)}/store`, 190, y - 10, { align: "right" });
      if (tier.isSelected) {
        doc.setTextColor(128, 0, 128);
        doc.text("(Selected)", 190, y - 5, { align: "right" });
      }
      y += 10;
    });

    // Transaction Processing Tier Breakdown
    y = checkPageBreak(30);
    y = addLine(20, y, 190);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("Transaction Processing Breakdown:", 20, y);
    doc.setFont("helvetica", "normal");
    y += 6;

    y = checkPageBreak(10);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Total Volume: ${Math.round(0.25 * (stores * transactions)).toLocaleString()} transactions`,
      25,
      y
    );
    y += 5;

    getTransactionFeeBreakdown(0.25 * (stores * transactions)).forEach((tier) => {
      y = checkPageBreak(10);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `${tier.volume.toLocaleString()} transactions ($${tier.rate.toFixed(3)}/transaction):`,
        25,
        y
      );
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(tier.total), 190, y, { align: "right" });
      y += 5;
    });

    // Marketing Email Tier Breakdown
    if (plan !== "loyalty") {
      y = checkPageBreak(30);
      y = addLine(20, y, 190);
      y += 6;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text("Marketing Email Breakdown:", 20, y);
      doc.setFont("helvetica", "normal");
      y += 6;

      y = checkPageBreak(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`Total Emails: ${marketing.toLocaleString()}`, 25, y);
      y += 5;

      getMarketingEmailBreakdown(marketing).forEach((tier) => {
        y = checkPageBreak(15);
        doc.setTextColor(120, 120, 120);
        doc.text(`${tier.tierName}: ${tier.range}`, 25, y);
        y += 5;
        doc.text(
          tier.isSelected
            ? `${tier.count.toLocaleString()} emails (your volume)`
            : `Up to ${tier.count.toLocaleString()} emails`,
          30,
          y
        );
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(tier.total), 190, y - 5, { align: "right" });
        doc.setTextColor(120, 120, 120);
        doc.text(`($${addons.giftCard.baseFee} base fee included)`, 190, y, { align: "right" });
        if (tier.isSelected) {
          doc.setTextColor(128, 0, 128);
          doc.text("(Selected)", 190, y + 5, { align: "right" });
          y += 15;
        } else {
          y += 12;
        }
      });
    }

    // --- Add-ons Section ---
    if (
      giftCard ||
      smsEnabled ||
      whatsappEnabled ||
      independentServer ||
      premiumSLA ||
      premiumSupport ||
      cms ||
      appType !== "none" ||
      dataIngestion
    ) {
      y = checkPageBreak(30);
      y = addLine(20, y, 190);
      y += 6;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text("Add-on Services:", 20, y);
      doc.setFont("helvetica", "normal");
      y += 6;

      if (giftCard) {
        y = checkPageBreak(15);
        doc.setTextColor(120, 120, 120);
        doc.text("Gift Card Base Fee:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(addons.giftCard.baseFee), 190, y, { align: "right" });
        y += 6;

        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`Gift Card Per-Store Fee (${stores} stores @ $${addons.giftCard.perStoreFee}/store):`, 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(stores * addons.giftCard.perStoreFee), 190, y, { align: "right" });
        y += 6;
      }

      if (smsEnabled && smsMessages && parseInt(smsMessages) > 0) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`SMS Platform (${params.smsCountry}):`, 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.sms), 190, y, { align: "right" });
        y += 6;
      }

      if (whatsappEnabled) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("WhatsApp Base Platform Fee:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.whatsapp.base), 190, y, { align: "right" });
        y += 6;

        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`WhatsApp Per-Store Fee (${stores} stores):`, 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.whatsapp.perStore), 190, y, { align: "right" });
        y += 6;

        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`WhatsApp Message Fees (${whatsappCountry}):`, 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.whatsapp.messages), 190, y, { align: "right" });
        y += 6;
      }

      if (independentServer) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Independent Server:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.server), 190, y, { align: "right" });
        y += 6;
      }

      if (premiumSLA) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Premium SLA:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.sla), 190, y, { align: "right" });
        y += 6;
      }

      if (cms) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Content Management System:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.cms), 190, y, { align: "right" });
        y += 6;
      }

      if (appType !== "none") {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`Mobile App (${appType}):`, 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.app), 190, y, { align: "right" });
        y += 6;
      }

      if (premiumSupport) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Premium Support:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.support), 190, y, { align: "right" });
        y += 6;
      }

      if (dataIngestion) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Data Ingestion:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(
          formatCurrency((monthlyFees - (premiumSupport ? 2000 + monthlyFees * 0.1 : 0)) * 0.2),
          190,
          y,
          { align: "right" }
        );
        y += 6;
      }
    }

    // --- Setup Fee Breakdown ---
    y = checkPageBreak(30);
    y = addLine(20, y, 190);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("Setup Fee Breakdown:", 20, y);
    doc.setFont("helvetica", "normal");
    y += 6;

    y = checkPageBreak(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Onboarding (3 months of monthly fees):", 25, y);
    doc.setTextColor(40, 40, 40);
    doc.text(formatCurrency(feeBreakdown.setup.onboarding), 190, y, { align: "right" });
    y += 5;

    if (appType === "premium") {
      y = checkPageBreak(10);
      doc.setTextColor(120, 120, 120);
      doc.text("Premium App Setup:", 25, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(setupFeesConfig.app.premium), 190, y, { align: "right" });
      y += 5;
    }

    if (appType === "standard") {
      y = checkPageBreak(10);
      doc.setTextColor(120, 120, 120);
      doc.text("Standard App Setup:", 25, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(setupFeesConfig.app.standard), 190, y, { align: "right" });
      y += 5;
    }

    if (appType === "pwa") {
      y = checkPageBreak(10);
      doc.setTextColor(120, 120, 120);
      doc.text("PWA Setup:", 25, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(setupFeesConfig.app.pwa), 190, y, { align: "right" });
      y += 5;
    }

    if (dataIngestion) {
      y = checkPageBreak(10);
      doc.setTextColor(120, 120, 120);
      doc.text("Data Ingestion Setup:", 25, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(feeBreakdown.setup.dataIngestion), 190, y, { align: "right" });
      y += 5;
    }

    // --- Totals ---
    y = checkPageBreak(30);
    y = addLine(20, y, 190);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("Subtotal (before discounts):", 20, y);
    doc.setTextColor(40, 40, 40);
    doc.text(formatCurrency(subtotalBeforeDiscounts), 190, y, { align: "right" });
    y += 7;

    if (discountAmount > 0) {
      doc.setTextColor(120, 120, 120);
      doc.text("Discounts Applied:", 20, y);
      doc.setTextColor(22, 163, 74);
      doc.text(`- ${formatCurrency(discountAmount)}`, 190, y, { align: "right" });
      y += 7;
    }

    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("Monthly Recurring Fees:", 20, y);
    doc.setTextColor(100, 12, 111);
    doc.text(formatCurrency(monthlyFees), 190, y, { align: "right" });
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("Setup Fees:", 20, y);
    doc.setTextColor(40, 40, 40);
    doc.text(formatCurrency(setupFees), 190, y, { align: "right" });
    y += 7;

    y = addLine(20, y, 190);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("First Year Total:", 20, y);
    doc.setTextColor(100, 12, 111);
    doc.text(formatCurrency(monthlyFees * 12 + setupFees), 190, y, { align: "right" });

    // --- Disclaimer (Gray Box) ---
    y = checkPageBreak(30);
    doc.setFillColor(247, 247, 247);
    doc.roundedRect(15, y, 180, 18, 2, 2, "F");
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "normal");
    const disclaimer =
      "This is an estimated quote based on the information provided. A Spoonity representative will contact you to provide a final quote and answer any questions. Pricing is subject to change based on specific requirements and contract terms.";
    const disclaimerLines = doc.splitTextToSize(disclaimer, 170);
    doc.text(disclaimerLines, 20, y + 7);

    // --- Save ---
    const filename = `Spoonity_Quote_${firstName.replace(/\s+/g, "_")}_${lastName.replace(
      /\s+/g,
      "_"
    )}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(filename);
  } catch (error) {
    alert("Failed to generate PDF. Please try again or contact support.");
  }
}

export function generatePDFAsBase64(params: PDFGeneratorParams, jsPdfLoaded: boolean): string {
  if (!jsPdfLoaded) {
    return "";
  }

  const {
    plan,
    stores,
    transactions,
    marketing,
    monthlyFees,
    setupFees,
    feeBreakdown,
    giftCard,
    smsEnabled,
    smsMessages,
    whatsappEnabled,
    whatsappCountry,
    independentServer,
    premiumSLA,
    premiumSupport,
    cms,
    appType,
    dataIngestion,
    pushNotifications,
    selectedConnectionTierIndex,
    planDetails,
    addons,
    setupFeesConfig,
    pushNotificationRate,
  } = params;

  try {
    const { jsPDF } = window.jspdf as any;
    const doc = new jsPDF();
    const discountAmount = feeBreakdown.discount || 0;
    const subtotalBeforeDiscounts = monthlyFees + discountAmount;

    let y = 20;

    // Helper function to check if we need a new page
    const checkPageBreak = (requiredHeight: number) => {
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;

      if (y + requiredHeight > pageHeight - margin) {
        doc.addPage();
        return 20;
      }
      return y;
    };

    // Helper function to add line with page break check
    const addLine = (x1: number, currentY: number, x2: number) => {
      const newY = checkPageBreak(5);
      doc.line(x1, newY, x2, newY);
      return newY + 5;
    };

    // --- HEADER (Purple) ---
    doc.setFillColor(159, 98, 166);
    doc.rect(10, y, 190, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(planDetails[plan].name, 20, y + 18);
    doc.setFontSize(22);
    doc.text(`${formatCurrency(monthlyFees)}`, 180, y + 18, { align: "right" });
    doc.setFontSize(10);
    doc.text("/month", 180, y + 24, { align: "right" });

    y = 60;

    // --- Plan Description ---
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const descLines = doc.splitTextToSize(planDetails[plan].fullDescription, 170);
    const descHeight = descLines.length * 5 + 8;

    y = checkPageBreak(descHeight + 20);
    doc.setFillColor(247, 247, 247);
    doc.roundedRect(15, y, 180, descHeight, 3, 3, "F");
    doc.text(descLines, 20, y + 8);
    y += descHeight + 10;

    // --- Basic Fee Breakdown ---
    y = checkPageBreak(50);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("Base License Fee:", 20, y);
    doc.setTextColor(40, 40, 40);
    doc.text(formatCurrency(planDetails[plan].base), 190, y, { align: "right" });
    y += 7;

    doc.setTextColor(120, 120, 120);
    doc.text(`Connection Fees (${stores} stores):`, 20, y);
    doc.setTextColor(40, 40, 40);
    doc.text(formatCurrency(feeBreakdown.connection), 190, y, { align: "right" });
    y += 7;

    doc.setTextColor(120, 120, 120);
    doc.text("Transaction Processing:", 20, y);
    doc.setTextColor(40, 40, 40);
    doc.text(formatCurrency(feeBreakdown.transaction), 190, y, { align: "right" });
    y += 7;

    if (plan !== "loyalty") {
      doc.setTextColor(120, 120, 120);
      doc.text("Marketing Platform:", 20, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(feeBreakdown.marketing), 190, y, { align: "right" });
      y += 7;

      if (pushNotifications) {
        doc.setTextColor(120, 120, 120);
        doc.text("Push Notifications:", 20, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(marketing * pushNotificationRate), 190, y, { align: "right" });
        y += 7;
      }
    }

    // --- Tier Breakdowns ---
    y = checkPageBreak(20);
    doc.setDrawColor(230, 230, 230);
    doc.line(20, y, 190, y);
    y += 6;

    // Connection Fee Tier Breakdown
    y = checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("Connection Fee Breakdown:", 20, y);
    doc.setFont("helvetica", "normal");
    y += 6;

    getConnectionFeeBreakdown(stores, selectedConnectionTierIndex).forEach((tier: any) => {
      y = checkPageBreak(15);
      doc.setTextColor(120, 120, 120);
      doc.text(`${tier.tierName}: ${tier.range}`, 25, y);
      y += 5;
      doc.text(
        tier.isSelected
          ? `${tier.count.toLocaleString()} stores (your volume)`
          : `Up to ${tier.count.toLocaleString()} stores`,
        30,
        y
      );
      y += 5;
      doc.setTextColor(40, 40, 40);
      doc.text(`$${tier.price.toFixed(2)}/store`, 190, y - 10, { align: "right" });
      if (tier.isSelected) {
        doc.setTextColor(128, 0, 128);
        doc.text("(Selected)", 190, y - 5, { align: "right" });
      }
      y += 10;
    });

    // Transaction Processing Tier Breakdown
    y = checkPageBreak(30);
    y = addLine(20, y, 190);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("Transaction Processing Breakdown:", 20, y);
    doc.setFont("helvetica", "normal");
    y += 6;

    y = checkPageBreak(10);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Total Volume: ${Math.round(0.25 * (stores * transactions)).toLocaleString()} transactions`,
      25,
      y
    );
    y += 5;

    getTransactionFeeBreakdown(0.25 * (stores * transactions)).forEach((tier) => {
      y = checkPageBreak(10);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `${tier.volume.toLocaleString()} transactions ($${tier.rate.toFixed(3)}/transaction):`,
        25,
        y
      );
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(tier.total), 190, y, { align: "right" });
      y += 5;
    });

    // Marketing Email Tier Breakdown
    if (plan !== "loyalty") {
      y = checkPageBreak(30);
      y = addLine(20, y, 190);
      y += 6;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text("Marketing Email Breakdown:", 20, y);
      doc.setFont("helvetica", "normal");
      y += 6;

      y = checkPageBreak(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`Total Emails: ${marketing.toLocaleString()}`, 25, y);
      y += 5;

      getMarketingEmailBreakdown(marketing).forEach((tier) => {
        y = checkPageBreak(15);
        doc.setTextColor(120, 120, 120);
        doc.text(`${tier.tierName}: ${tier.range}`, 25, y);
        y += 5;
        doc.text(
          tier.isSelected
            ? `${tier.count.toLocaleString()} emails (your volume)`
            : `Up to ${tier.count.toLocaleString()} emails`,
          30,
          y
        );
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(tier.total), 190, y - 5, { align: "right" });
        doc.setTextColor(120, 120, 120);
        doc.text(`($${addons.giftCard.baseFee} base fee included)`, 190, y, { align: "right" });
        if (tier.isSelected) {
          doc.setTextColor(128, 0, 128);
          doc.text("(Selected)", 190, y + 5, { align: "right" });
          y += 15;
        } else {
          y += 12;
        }
      });
    }

    // --- Add-ons Section ---
    if (
      giftCard ||
      smsEnabled ||
      whatsappEnabled ||
      independentServer ||
      premiumSLA ||
      premiumSupport ||
      cms ||
      appType !== "none" ||
      dataIngestion
    ) {
      y = checkPageBreak(30);
      y = addLine(20, y, 190);
      y += 6;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text("Add-on Services:", 20, y);
      doc.setFont("helvetica", "normal");
      y += 6;

      if (giftCard) {
        y = checkPageBreak(15);
        doc.setTextColor(120, 120, 120);
        doc.text("Gift Card Base Fee:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(addons.giftCard.baseFee), 190, y, { align: "right" });
        y += 6;

        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`Gift Card Per-Store Fee (${stores} stores @ $${addons.giftCard.perStoreFee}/store):`, 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(stores * addons.giftCard.perStoreFee), 190, y, { align: "right" });
        y += 6;
      }

      if (smsEnabled && smsMessages && parseInt(smsMessages) > 0) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`SMS Platform (${params.smsCountry}):`, 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.sms), 190, y, { align: "right" });
        y += 6;
      }

      if (whatsappEnabled) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("WhatsApp Base Platform Fee:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.whatsapp.base), 190, y, { align: "right" });
        y += 6;

        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`WhatsApp Per-Store Fee (${stores} stores):`, 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.whatsapp.perStore), 190, y, { align: "right" });
        y += 6;

        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`WhatsApp Message Fees (${whatsappCountry}):`, 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.whatsapp.messages), 190, y, { align: "right" });
        y += 6;
      }

      if (independentServer) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Independent Server:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.server), 190, y, { align: "right" });
        y += 6;
      }

      if (premiumSLA) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Premium SLA:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.sla), 190, y, { align: "right" });
        y += 6;
      }

      if (cms) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Content Management System:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.cms), 190, y, { align: "right" });
        y += 6;
      }

      if (appType !== "none") {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`Mobile App (${appType}):`, 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.app), 190, y, { align: "right" });
        y += 6;
      }

      if (premiumSupport) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Premium Support:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.support), 190, y, { align: "right" });
        y += 6;
      }

      if (dataIngestion) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Data Ingestion:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(
          formatCurrency((monthlyFees - (premiumSupport ? 2000 + monthlyFees * 0.1 : 0)) * 0.2),
          190,
          y,
          { align: "right" }
        );
        y += 6;
      }
    }

    // --- Setup Fee Breakdown ---
    y = checkPageBreak(30);
    y = addLine(20, y, 190);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("Setup Fee Breakdown:", 20, y);
    doc.setFont("helvetica", "normal");
    y += 6;

    y = checkPageBreak(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Onboarding (3 months of monthly fees):", 25, y);
    doc.setTextColor(40, 40, 40);
    doc.text(formatCurrency(feeBreakdown.setup.onboarding), 190, y, { align: "right" });
    y += 5;

    if (appType === "premium") {
      y = checkPageBreak(10);
      doc.setTextColor(120, 120, 120);
      doc.text("Premium App Setup:", 25, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(setupFeesConfig.app.premium), 190, y, { align: "right" });
      y += 5;
    }

    if (appType === "standard") {
      y = checkPageBreak(10);
      doc.setTextColor(120, 120, 120);
      doc.text("Standard App Setup:", 25, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(setupFeesConfig.app.standard), 190, y, { align: "right" });
      y += 5;
    }

    if (appType === "pwa") {
      y = checkPageBreak(10);
      doc.setTextColor(120, 120, 120);
      doc.text("PWA Setup:", 25, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(setupFeesConfig.app.pwa), 190, y, { align: "right" });
      y += 5;
    }

    if (dataIngestion) {
      y = checkPageBreak(10);
      doc.setTextColor(120, 120, 120);
      doc.text("Data Ingestion Setup:", 25, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(feeBreakdown.setup.dataIngestion), 190, y, { align: "right" });
      y += 5;
    }

    // --- Totals ---
    y = checkPageBreak(30);
    y = addLine(20, y, 190);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("Subtotal (before discounts):", 20, y);
    doc.setTextColor(40, 40, 40);
    doc.text(formatCurrency(subtotalBeforeDiscounts), 190, y, { align: "right" });
    y += 7;

    if (discountAmount > 0) {
      doc.setTextColor(120, 120, 120);
      doc.text("Discounts Applied:", 20, y);
      doc.setTextColor(22, 163, 74);
      doc.text(`- ${formatCurrency(discountAmount)}`, 190, y, { align: "right" });
      y += 7;
    }

    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("Monthly Recurring Fees:", 20, y);
    doc.setTextColor(100, 12, 111);
    doc.text(formatCurrency(monthlyFees), 190, y, { align: "right" });
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("Setup Fees:", 20, y);
    doc.setTextColor(40, 40, 40);
    doc.text(formatCurrency(setupFees), 190, y, { align: "right" });
    y += 7;

    y = addLine(20, y, 190);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("First Year Total:", 20, y);
    doc.setTextColor(100, 12, 111);
    doc.text(formatCurrency(monthlyFees * 12 + setupFees), 190, y, { align: "right" });

    // --- Disclaimer (Gray Box) ---
    y = checkPageBreak(30);
    doc.setFillColor(247, 247, 247);
    doc.roundedRect(15, y, 180, 18, 2, 2, "F");
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "normal");
    const disclaimer =
      "This is an estimated quote based on the information provided. A Spoonity representative will contact you to provide a final quote and answer any questions. Pricing is subject to change based on specific requirements and contract terms.";
    const disclaimerLines = doc.splitTextToSize(disclaimer, 170);
    doc.text(disclaimerLines, 20, y + 7);

    // Generate base64 string instead of saving
    const pdfOutput = doc.output("datauristring");
    return pdfOutput.split(",")[1];
  } catch (error) {
    console.error("Error generating PDF for webhook:", error);
    return "";
  }
}

