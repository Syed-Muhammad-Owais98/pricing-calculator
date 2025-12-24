"use client";

import React from "react";

// Components
import { LoginForm } from "./components/calculator/LoginForm";
import { CalculatorInputTab } from "./components/calculator/CalculatorInputTab";
import { AddOnsTab } from "./components/calculator/AddOnsTab";
import { SummaryTab } from "./components/calculator/SummaryTab";
import { SuccessScreen } from "./components/calculator/SuccessScreen";
import { CalculatorHeader } from "./components/calculator/CalculatorHeader";
import { CalculatorTabs } from "./components/calculator/CalculatorTabs";
import { CalculatorFooter } from "./components/calculator/CalculatorFooter";

// Types
import { FeeBreakdown } from "./components/calculator/types";

// Utilities
import {
  calculateConnectionFees,
  getMarketingEmailBreakdown,
  calculateWhatsappStoreFeeTiers,
  formatCurrency,
} from "./components/calculator/utils";
import {
  generatePDF,
  generatePDFAsBase64,
} from "./components/calculator/pdfGenerator";
import { generateQuoteDetails } from "./components/calculator/quoteUtils";

// Hooks
import { useStyles } from "./components/calculator/hooks/useStyles";
import { useJsPdf } from "./components/calculator/hooks/useJsPdf";
import { usePricingData } from "./components/calculator/hooks/usePricingData";

// Constants
import {
  TOKEN_EXPIRY,
  TOKEN_CHECK_INTERVAL,
} from "./components/calculator/constants";

// Initial fee breakdown state
const initialFeeBreakdown: FeeBreakdown = {
  total: 0,
  subtotal: 0,
  connection: 0,
  baseLicense: 0,
  transaction: 0,
  marketing: 0,
  giftCard: 0,
  sms: 0,
  whatsapp: {
    base: 0,
    perStore: 0,
    messages: 0,
    total: 0,
  },
  server: 0,
  sla: 0,
  cms: 0,
  app: 0,
  support: 0,
  discount: 0,
  itemDiscounts: 0,
  subtotalDiscountAmount: 0,
  net: {
    baseLicense: 0,
    connection: 0,
    transaction: 0,
    marketing: 0,
    giftCard: 0,
    sms: 0,
    whatsapp: 0,
    server: 0,
    sla: 0,
    cms: 0,
    app: 0,
    support: 0,
  },
  corporate: 0,
  franchisee: 0,
  franchiseePerStore: 0,
  setup: {
    total: 0,
    onboarding: 0,
    appSetup: 0,
    dataIngestion: 0,
  },
};

export default function SpoonityCalculator() {
  // Apply custom styles
  useStyles();

  // PDF generation state
  const { jsPdfLoaded, isPdfGenerating, setIsPdfGenerating } = useJsPdf();

  // Get pricing data from context (loaded from Firestore)
  const {
    planDetails,
    smsRates,
    countryDialCodes,
    whatsappAvailableCountries,
    whatsappRates,
    connectionFeeTiers,
    transactionFeeTiers,
    marketingEmailConfig,
    whatsappStoreFeeConfig,
    addons,
    setupFees: setupFeesConfig,
    isLoading: pricingLoading,
    error: pricingError,
  } = usePricingData();

  // State for user data
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [role, setRole] = React.useState("");
  const [country, setCountry] = React.useState("USA");
  const [otherCountry, setOtherCountry] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [webhookLogs, setWebhookLogs] = React.useState<
    Array<{ timestamp: string; message: string; data: any }>
  >([]);
  const [businessType, setBusinessType] = React.useState("corporate");

  // Token related state
  const [token, setToken] = React.useState("");
  const [tokenError, setTokenError] = React.useState("");

  // State for inputs
  const [plan, setPlan] = React.useState("loyalty");
  const [stores, setStores] = React.useState(10);
  const [transactions, setTransactions] = React.useState(1000);
  const [marketing, setMarketing] = React.useState(10000);
  const [giftCard, setGiftCard] = React.useState(false);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [smsEnabled, setSmsEnabled] = React.useState(true);
  const [smsMessages, setSmsMessages] = React.useState("");
  const [smsCountry, setSmsCountry] = React.useState("USA");
  const [independentServer, setIndependentServer] = React.useState(false);
  const [premiumSupport, setPremiumSupport] = React.useState(false);
  const [premiumSLA, setPremiumSLA] = React.useState(false);
  const [cms, setCms] = React.useState(false);
  const [appType, setAppType] = React.useState("none");
  const [dataIngestion, setDataIngestion] = React.useState(false);

  // Discount state
  const [discountPassword, setDiscountPassword] = React.useState("");
  const [discountUnlocked, setDiscountUnlocked] = React.useState(false);
  const [showDiscountInput, setShowDiscountInput] = React.useState(false);
  const [subtotalDiscount, setSubtotalDiscount] = React.useState<{
    type: "percentage" | "fixed";
    value: number;
  }>({ type: "fixed", value: 0 });
  const [discountReason, setDiscountReason] = React.useState("");
  const [itemDiscounts, setItemDiscounts] = React.useState<
    Record<string, { type: "percentage" | "fixed"; value: number }>
  >({});
  const [showItemDiscounts, setShowItemDiscounts] = React.useState(false);
  const [discountsApplied, setDiscountsApplied] = React.useState(false);
  const [appliedItemDiscounts, setAppliedItemDiscounts] = React.useState<
    Record<string, { type: "percentage" | "fixed"; value: number }>
  >({});
  const [appliedSubtotalDiscount, setAppliedSubtotalDiscount] = React.useState<{
    type: "percentage" | "fixed";
    value: number;
  }>({ type: "fixed", value: 0 });
  const [appliedDiscountReason, setAppliedDiscountReason] = React.useState("");

  // WhatsApp specific state
  const [whatsappEnabled, setWhatsappEnabled] = React.useState(false);
  const [whatsappCountry, setWhatsappCountry] = React.useState("Mexico");
  const [whatsappMarketTicket, setWhatsappMarketTicket] = React.useState(0);
  const [whatsappUtility, setWhatsappUtility] = React.useState(0);
  const [whatsappMarketing, setWhatsappMarketing] = React.useState(0);
  const [whatsappOtp, setWhatsappOtp] = React.useState(0);

  // State for calculated values
  const [monthlyFees, setMonthlyFees] = React.useState(0);
  const [setupFees, setSetupFees] = React.useState(0);
  const [perStore, setPerStore] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("inputs");
  const [totalBeforeSupport, setTotalBeforeSupport] = React.useState(0);
  const [selectedConnectionTierIndex, setSelectedConnectionTierIndex] =
    React.useState<number | null>(null);
  const [feeBreakdown, setFeeBreakdown] =
    React.useState<FeeBreakdown>(initialFeeBreakdown);

  // Token validation function
  const validateToken = async (inputToken: string): Promise<boolean> => {
    try {
      const decodedString = atob(inputToken);
      const tokenData = JSON.parse(decodedString);
      const paraphraseCheck =
        tokenData.paraphrase === process.env.NEXT_PUBLIC_PARAPHASE_KEY;
      const expiryCheck = new Date(tokenData.expiresAt) > new Date();
      return paraphraseCheck && expiryCheck;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  };

  // Save token and user data to localStorage
  const saveTokenAndData = (
    tokenValue: string,
    userData?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      company?: string;
      role?: string;
      country?: string;
      businessType?: string;
    }
  ) => {
    const expiryTime = Date.now() + TOKEN_EXPIRY;
    localStorage.setItem("spoonity_token", tokenValue);
    localStorage.setItem("spoonity_token_expiry", expiryTime.toString());
    localStorage.setItem(
      "spoonity_user_data",
      JSON.stringify({
        firstName: userData?.firstName ?? firstName,
        lastName: userData?.lastName ?? lastName,
        email: userData?.email ?? email,
        phone: userData?.phone ?? phone,
        company: userData?.company ?? company,
        role: userData?.role ?? role,
        country:
          userData?.country ?? (country === "Other" ? otherCountry : country),
        businessType: userData?.businessType ?? businessType,
      })
    );
  };

  // Reset all states function
  const resetAllStates = () => {
    localStorage.clear();
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setRole("");
    setCountry("USA");
    setOtherCountry("");
    setBusinessType("corporate");
    setToken("");
    setTokenError("");
    setPlan("loyalty");
    setStores(10);
    setTransactions(1000);
    setMarketing(10000);
    setGiftCard(false);
    setPushNotifications(false);
    setSmsEnabled(true);
    setSmsMessages("");
    setSmsCountry("USA");
    setIndependentServer(false);
    setPremiumSupport(false);
    setPremiumSLA(false);
    setCms(false);
    setAppType("none");
    setDataIngestion(false);
    setWhatsappEnabled(false);
    setWhatsappCountry("Mexico");
    setWhatsappMarketTicket(0);
    setWhatsappUtility(0);
    setWhatsappMarketing(0);
    setWhatsappOtp(0);
    setDiscountPassword("");
    setDiscountUnlocked(false);
    setShowDiscountInput(false);
    setSubtotalDiscount({ type: "percentage", value: 0 });
    setDiscountReason("");
    setItemDiscounts({});
    setShowItemDiscounts(false);
    setMonthlyFees(0);
    setSetupFees(0);
    setPerStore(0);
    setActiveTab("inputs");
    setTotalBeforeSupport(0);
    setFeeBreakdown(initialFeeBreakdown);
    setIsLoggedIn(false);
    setSubmitSuccess(false);
    setIsSubmitting(false);
    setSubmitError("");
    setWebhookLogs([]);
  };

  // Check token expiry
  const checkTokenExpiry = () => {
    const expiryTime = localStorage.getItem("spoonity_token_expiry");
    if (expiryTime && parseInt(expiryTime) < Date.now()) {
      localStorage.removeItem("spoonity_token");
      localStorage.removeItem("spoonity_token_expiry");
      localStorage.removeItem("spoonity_user_data");
      setIsLoggedIn(false);
      resetAllStates();
    }
  };

  // Check for existing token on component mount
  React.useEffect(() => {
    const storedToken = localStorage.getItem("spoonity_token");
    const expiryTime = localStorage.getItem("spoonity_token_expiry");
    const userData = localStorage.getItem("spoonity_user_data");

    if (
      storedToken &&
      expiryTime &&
      parseInt(expiryTime) > Date.now() &&
      userData
    ) {
      const parsedUserData = JSON.parse(userData);
      setFirstName(parsedUserData.firstName);
      setLastName(parsedUserData.lastName);
      setEmail(parsedUserData.email);
      setPhone(parsedUserData.phone);
      setCompany(parsedUserData.company);
      setRole(parsedUserData.role);
      setCountry(
        parsedUserData.country === "Other" ? "Other" : parsedUserData.country
      );
      setOtherCountry(
        parsedUserData.country === "Other" ? parsedUserData.country : ""
      );
      setBusinessType(parsedUserData.businessType);
      setIsLoggedIn(true);
    }

    const intervalId = setInterval(checkTokenExpiry, TOKEN_CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  // Pre-populate Access Token from URL if present
  React.useEffect(() => {
    if (typeof window !== "undefined" && !token) {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("access_token");
      if (urlToken) {
        setToken(urlToken);
      }
    }
  }, []);

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (token.trim() === "") {
      setTokenError("Please enter your access token");
      return;
    }

    if (country === "Other" && otherCountry.trim() === "") {
      alert("Please enter your country");
      return;
    }

    if (
      !businessType ||
      (businessType !== "corporate" && businessType !== "franchise")
    ) {
      alert("Please select a business type");
      return;
    }

    const isValidToken = await validateToken(token);
    if (!isValidToken) {
      setTokenError("Invalid access token");
      return;
    }

    const finalFirstName = firstName.trim() === "" ? "John" : firstName.trim();
    const finalLastName = lastName.trim() === "" ? "Doe" : lastName.trim();
    const finalCompany = company.trim() === "" ? "Spoonity" : company.trim();

    if (firstName.trim() === "") setFirstName("John");
    if (lastName.trim() === "") setLastName("Doe");
    if (company.trim() === "") setCompany("Spoonity");

    if (country === "Other") {
      setSmsEnabled(false);
      setSmsMessages("");
      setSmsCountry("USA");
    } else {
      setSmsCountry(country);
    }

    saveTokenAndData(token, {
      firstName: finalFirstName,
      lastName: finalLastName,
      email: email?.trim(),
      phone: phone?.trim(),
      company: finalCompany,
      role: role?.trim(),
      country: country === "Other" ? otherCountry : country,
      businessType,
    });

    setIsLoggedIn(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  // Helper function to add a log entry
  const addLog = (message: string, data: any = null): void => {
    const timestamp = new Date().toISOString();
    setWebhookLogs((prevLogs) => [...prevLogs, { timestamp, message, data }]);
    console.log(`[${timestamp}] ${message}`, data || "");
  };

  // Submit data to webhook
  const submitData = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");
    setWebhookLogs([]);

    const quoteDetails = generateQuoteDetails({
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
      // Pass dynamic pricing configuration
      planDetails,
      smsRates,
      whatsappRates,
      addons,
      setupFeesConfig,
      pushNotificationRate: marketingEmailConfig.pushNotificationRate,
    });

    const pdfBase64 = generatePDFAsBase64(
      {
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
        firstName,
        lastName,
        selectedConnectionTierIndex,
        whatsappRates,
        // Pass dynamic pricing configuration
        planDetails,
        addons,
        setupFeesConfig,
        pushNotificationRate: marketingEmailConfig.pushNotificationRate,
      },
      jsPdfLoaded
    );

    const formData = {
      firstName,
      lastName,
      email,
      phone,
      company,
      role,
      country: country === "Other" ? otherCountry : country,
      businessType,
      quoteDetails,
      pdfBase64,
      calculatorData: {
        plan,
        planName: planDetails[plan].name,
        stores,
        transactionsPerStore: transactions,
        marketingMessages: marketing,
        addOns: {
          giftCard,
          pushNotifications,
          smsEnabled,
          smsMessages,
          smsCountry,
          independentServer,
          premiumSupport,
          premiumSLA,
          cms,
          appType,
          dataIngestion,
        },
        results: {
          monthlyFees: formatCurrency(monthlyFees),
          setupFees: formatCurrency(setupFees),
          perStore: formatCurrency(perStore),
          firstYearTotal: formatCurrency(monthlyFees * 12 + setupFees),
        },
      },
      timestamp: new Date().toISOString(),
    };

    try {
      const webhookUrl = process.env.WEBHOOK_URL as string;
      addLog("Sending data to webhook", formData);

      localStorage.setItem("spoonity_submission_pending", "true");
      localStorage.setItem(
        "spoonity_submission_data",
        JSON.stringify({ firstName, lastName, email })
      );

      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({ data: formData }),
      });

      addLog("Webhook submission completed successfully");
      setSubmitSuccess(true);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: unknown) {
      addLog("Error in submission process", {
        error: error instanceof Error ? error.message : String(error),
      });
      setSubmitSuccess(true);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Calculate the fees using dynamic pricing configuration
  function calculateFees() {
    let monthly = planDetails[plan]?.base || 1000;
    let connectionFees = calculateConnectionFees(
      stores,
      selectedConnectionTierIndex,
      connectionFeeTiers
    );
    monthly += connectionFees;

    // Calculate transaction fees using dynamic tiers
    let transactionVolume = 0.25 * (stores * transactions);
    let transactionFees = 0;
    // Find applicable transaction fee rate from dynamic tiers
    const sortedTxnTiers = [...transactionFeeTiers].sort(
      (a, b) => a.max - b.max
    );
    for (const tier of sortedTxnTiers) {
      if (transactionVolume <= tier.max) {
        transactionFees = transactionVolume * tier.rate;
        break;
      }
    }
    // If volume exceeds all tiers, use the last tier
    if (transactionFees === 0 && sortedTxnTiers.length > 0) {
      transactionFees =
        transactionVolume * sortedTxnTiers[sortedTxnTiers.length - 1].rate;
    }
    monthly += transactionFees;

    let marketingFees = 0;
    if (plan !== "loyalty") {
      const breakdown = getMarketingEmailBreakdown(
        marketing,
        marketingEmailConfig.tiers,
        marketingEmailConfig.baseFee
      );
      const selectedTier = breakdown.find((tier) => tier.isSelected);
      marketingFees = selectedTier ? selectedTier.total : 0;
      monthly += marketingFees;

      if (pushNotifications) {
        monthly += marketing * marketingEmailConfig.pushNotificationRate;
      }
    }

    let giftCardFees = 0;
    if (giftCard) {
      giftCardFees =
        addons.giftCard.baseFee + stores * addons.giftCard.perStoreFee;
      monthly += giftCardFees;
    }

    let smsFees = 0;
    if (smsEnabled && smsMessages && parseInt(smsMessages) > 0) {
      const rate = smsRates[smsCountry] || 0.01;
      smsFees = parseFloat(smsMessages) * rate;
      monthly += smsFees;
    }

    let whatsappBaseFee = 0;
    let whatsappPerStoreFee = 0;
    let whatsappMessageFees = 0;
    let whatsappTotalFee = 0;

    if (whatsappEnabled) {
      whatsappBaseFee = whatsappStoreFeeConfig.baseFee;
      whatsappPerStoreFee = calculateWhatsappStoreFeeTiers(
        stores,
        whatsappStoreFeeConfig.tiers
      );
      const countryRates = whatsappRates[whatsappCountry];
      if (countryRates) {
        whatsappMessageFees =
          whatsappMarketTicket * countryRates.marketTicket +
          whatsappUtility * countryRates.utility +
          whatsappMarketing * countryRates.marketing +
          whatsappOtp * countryRates.otp;
      }
      whatsappTotalFee =
        whatsappBaseFee + whatsappPerStoreFee + whatsappMessageFees;
      monthly += whatsappTotalFee;
    }

    let serverFees = 0;
    if (independentServer) {
      serverFees = addons.server.baseFee;
      monthly += serverFees;
    }

    let slaFees = 0;
    if (premiumSLA) {
      slaFees = addons.sla.baseFee;
      monthly += slaFees;
    }

    let cmsFees = 0;
    if (cms) {
      cmsFees = addons.cms.baseFee;
      monthly += cmsFees;
    }

    let appFees = 0;
    if (appType === "premium") {
      appFees = addons.app.premium;
      monthly += appFees;
      if (!cms) {
        setCms(true);
        cmsFees = addons.cms.baseFee;
        monthly += cmsFees;
      }
    } else if (appType === "standard") {
      appFees = addons.app.standard;
      monthly += appFees;
    } else if (appType === "pwa") {
      appFees = addons.app.pwa;
      monthly += appFees;
    }

    let totalItemDiscounts = 0;
    const getItemDiscount = (key: string, amount: number) => {
      if (!discountUnlocked) return 0;
      const source = discountsApplied ? appliedItemDiscounts : itemDiscounts;
      const d = source[key];
      if (!d) return 0;
      if (d.type === "percentage") return amount * (d.value / 100);
      return Math.min(d.value, amount);
    };

    const dBase = getItemDiscount(
      "baseLicense",
      planDetails[plan]?.base || 1000
    );
    const dConn = getItemDiscount("connection", connectionFees);
    const dTxn = getItemDiscount("transaction", transactionFees);
    const dMkt = getItemDiscount("marketing", marketingFees);
    const dGift = getItemDiscount("giftCard", giftCardFees);
    const dSms = getItemDiscount("sms", smsFees);
    const dWa = getItemDiscount("whatsapp", whatsappTotalFee);
    const dSrv = getItemDiscount("server", serverFees);
    const dSla = getItemDiscount("sla", slaFees);
    const dCms = getItemDiscount("cms", cmsFees);
    const dApp = getItemDiscount("app", appFees);

    if (discountUnlocked) {
      totalItemDiscounts +=
        dBase +
        dConn +
        dTxn +
        dMkt +
        dGift +
        dSms +
        dWa +
        dSrv +
        dSla +
        dCms +
        dApp;
      monthly = Math.max(0, monthly - totalItemDiscounts);
    }

    let currentTotalBeforeSupport = monthly;
    let supportFees = 0;
    let supportDiscountApplied = 0;
    if (premiumSupport) {
      supportFees =
        addons.support.baseFee +
        currentTotalBeforeSupport * addons.support.percentage;
      if (discountUnlocked) {
        const supportDiscount = getItemDiscount("support", supportFees);
        supportDiscountApplied = supportDiscount;
        supportFees = Math.max(0, supportFees - supportDiscount);
        totalItemDiscounts += supportDiscount;
      }
      monthly += supportFees;
    }

    const monthlySubtotal = monthly;

    let subtotalDiscountAmount = 0;
    if (discountUnlocked) {
      const sd = discountsApplied ? appliedSubtotalDiscount : subtotalDiscount;
      if (sd.type === "percentage") {
        subtotalDiscountAmount = monthlySubtotal * ((sd.value || 0) / 100);
      } else {
        subtotalDiscountAmount = sd.value || 0;
      }
      monthly = Math.max(0, monthly - subtotalDiscountAmount);
    }

    let onboardingFee =
      currentTotalBeforeSupport *
      setupFeesConfig.onboarding.rate *
      setupFeesConfig.onboarding.months;
    let setup = onboardingFee;

    let appSetupFee = 0;
    if (appType === "premium") {
      appSetupFee = setupFeesConfig.app.premium;
      setup += appSetupFee;
    } else if (appType === "standard") {
      appSetupFee = setupFeesConfig.app.standard;
      setup += appSetupFee;
    } else if (appType === "pwa") {
      appSetupFee = setupFeesConfig.app.pwa;
      setup += appSetupFee;
    }

    let dataIngestionFee = 0;
    if (dataIngestion) {
      dataIngestionFee =
        currentTotalBeforeSupport * setupFeesConfig.dataIngestion.percentage;
      setup += dataIngestionFee;
    }

    const corporateFees =
      businessType === "franchise" ? monthly - connectionFees : monthly;
    const franchiseeFees = businessType === "franchise" ? connectionFees : 0;
    const franchiseePerStore =
      businessType === "franchise" && stores > 0 ? connectionFees / stores : 0;

    setMonthlyFees(monthly);
    setSetupFees(setup);
    setPerStore(stores > 0 ? monthly / stores : 0);
    setTotalBeforeSupport(currentTotalBeforeSupport);

    return {
      total: monthly,
      subtotal: monthlySubtotal,
      connection: connectionFees,
      baseLicense: planDetails[plan]?.base || 1000,
      transaction: transactionFees,
      marketing: marketingFees,
      giftCard: giftCardFees,
      sms: smsFees,
      whatsapp: {
        base: whatsappBaseFee,
        perStore: whatsappPerStoreFee,
        messages: whatsappMessageFees,
        total: whatsappTotalFee,
      },
      server: serverFees,
      sla: slaFees,
      cms: cmsFees,
      app: appFees,
      support: supportFees,
      discount: totalItemDiscounts + subtotalDiscountAmount,
      itemDiscounts: totalItemDiscounts,
      subtotalDiscountAmount: subtotalDiscountAmount,
      net: {
        baseLicense: Math.max(0, (planDetails[plan]?.base || 1000) - dBase),
        connection: Math.max(0, connectionFees - dConn),
        transaction: Math.max(0, transactionFees - dTxn),
        marketing: Math.max(0, marketingFees - dMkt),
        giftCard: Math.max(0, giftCardFees - dGift),
        sms: Math.max(0, smsFees - dSms),
        whatsapp: Math.max(0, whatsappTotalFee - dWa),
        server: Math.max(0, serverFees - dSrv),
        sla: Math.max(0, slaFees - dSla),
        cms: Math.max(0, cmsFees - dCms),
        app: Math.max(0, appFees - dApp),
        support: Math.max(0, supportFees - supportDiscountApplied),
      },
      corporate: corporateFees,
      franchisee: franchiseeFees,
      franchiseePerStore: franchiseePerStore,
      setup: {
        total: setup,
        onboarding: onboardingFee,
        appSetup: appSetupFee,
        dataIngestion: dataIngestionFee,
      },
    };
  }

  // Calculate fees whenever inputs change
  React.useEffect(() => {
    // Wait for pricing data to be loaded
    if (pricingLoading) return;

    const fees = calculateFees();
    setFeeBreakdown(fees);
  }, [
    plan,
    stores,
    transactions,
    marketing,
    giftCard,
    pushNotifications,
    smsMessages,
    smsCountry,
    independentServer,
    premiumSupport,
    premiumSLA,
    cms,
    appType,
    dataIngestion,
    businessType,
    whatsappEnabled,
    whatsappCountry,
    whatsappMarketTicket,
    whatsappUtility,
    whatsappMarketing,
    whatsappOtp,
    discountUnlocked,
    discountsApplied,
    appliedSubtotalDiscount,
    appliedItemDiscounts,
    selectedConnectionTierIndex,
    // Pricing data dependencies
    pricingLoading,
    planDetails,
    connectionFeeTiers,
    transactionFeeTiers,
    marketingEmailConfig,
    smsRates,
    whatsappStoreFeeConfig,
    whatsappRates,
    addons,
    setupFeesConfig,
  ]);

  // Calculate default SMS message count
  React.useEffect(() => {
    const defaultSmsCount = Math.round(stores * transactions * 0.1);
    if (smsEnabled) {
      setSmsMessages(defaultSmsCount.toString());
    }
  }, [stores, transactions, smsEnabled]);

  // Calculate default WhatsApp message counts
  React.useEffect(() => {
    if (whatsappEnabled) {
      const defaultCount = Math.round(stores * transactions * 0.1);
      setWhatsappMarketTicket(defaultCount);
      setWhatsappUtility(defaultCount);
      setWhatsappOtp(defaultCount);
      setWhatsappMarketing(10000);
    }
  }, [stores, transactions, whatsappEnabled]);

  // Ensure independent server for stores above threshold
  React.useEffect(() => {
    if (stores > addons.server.autoApplyAboveStores) {
      setIndependentServer(true);
    }
  }, [stores, addons.server.autoApplyAboveStores]);

  // Update phone number when country changes
  React.useEffect(() => {
    if (country !== "Other") {
      const dialCode = countryDialCodes[country];
      if (!phone.startsWith(dialCode)) {
        setPhone(dialCode);
      }
      if (!whatsappAvailableCountries.includes(country)) {
        setWhatsappEnabled(false);
      }
    } else {
      if (phone.startsWith("+")) {
        setPhone("+");
      } else if (!phone.startsWith("+")) {
        setPhone("+");
      }
      setWhatsappEnabled(false);
    }
  }, [country]);

  // Tab change handler
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  // Sign out handler
  const handleSignOut = () => {
    resetAllStates();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    if (!jsPdfLoaded) {
      alert("PDF generation is loading. Please try again in a moment.");
      return;
    }

    setIsPdfGenerating(true);

    setTimeout(() => {
      try {
        generatePDF(
          {
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
            firstName,
            lastName,
            selectedConnectionTierIndex,
            whatsappRates,
            // Pass dynamic pricing configuration
            planDetails,
            addons,
            setupFeesConfig,
            pushNotificationRate: marketingEmailConfig.pushNotificationRate,
          },
          jsPdfLoaded
        );
      } catch (error) {
        console.error("Error in PDF generation:", error);
        alert("There was an error generating your PDF. Please try again.");
      } finally {
        setIsPdfGenerating(false);
      }
    }, 100);
  };

  // Render login form if not logged in
  if (!isLoggedIn) {
    return (
      <LoginForm
        token={token}
        setToken={setToken}
        tokenError={tokenError}
        setTokenError={setTokenError}
        country={country}
        setCountry={setCountry}
        otherCountry={otherCountry}
        setOtherCountry={setOtherCountry}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        company={company}
        setCompany={setCompany}
        role={role}
        setRole={setRole}
        businessType={businessType}
        setBusinessType={setBusinessType}
        onLogin={handleLogin}
        // Pricing configuration from Firestore
        smsRates={smsRates}
        countryDialCodes={countryDialCodes}
      />
    );
  }

  // Main calculator UI
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {submitSuccess ? (
        <SuccessScreen
          firstName={firstName}
          lastName={lastName}
          plan={plan}
          stores={stores}
          transactions={transactions}
          marketing={marketing}
          monthlyFees={monthlyFees}
          setupFees={setupFees}
          feeBreakdown={feeBreakdown}
          giftCard={giftCard}
          smsEnabled={smsEnabled}
          smsMessages={smsMessages}
          smsCountry={smsCountry}
          whatsappEnabled={whatsappEnabled}
          whatsappCountry={whatsappCountry}
          whatsappMarketTicket={whatsappMarketTicket}
          whatsappUtility={whatsappUtility}
          whatsappMarketing={whatsappMarketing}
          whatsappOtp={whatsappOtp}
          independentServer={independentServer}
          premiumSLA={premiumSLA}
          premiumSupport={premiumSupport}
          cms={cms}
          appType={appType}
          dataIngestion={dataIngestion}
          pushNotifications={pushNotifications}
          discountUnlocked={discountUnlocked}
          discountsApplied={discountsApplied}
          itemDiscounts={itemDiscounts}
          subtotalDiscount={subtotalDiscount}
          discountReason={discountReason}
          setItemDiscounts={setItemDiscounts}
          setSubtotalDiscount={setSubtotalDiscount}
          setDiscountReason={setDiscountReason}
          setAppliedItemDiscounts={setAppliedItemDiscounts}
          setAppliedSubtotalDiscount={setAppliedSubtotalDiscount}
          setAppliedDiscountReason={setAppliedDiscountReason}
          setDiscountsApplied={setDiscountsApplied}
          selectedConnectionTierIndex={selectedConnectionTierIndex}
          jsPdfLoaded={jsPdfLoaded}
          isPdfGenerating={isPdfGenerating}
          onGeneratePDF={handleGeneratePDF}
          onReset={resetAllStates}
          // Pricing configuration from Firestore
          planDetails={planDetails}
          whatsappRates={whatsappRates}
        />
      ) : (
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <CalculatorHeader
            firstName={firstName}
            lastName={lastName}
            onSignOut={handleSignOut}
          />

          <CalculatorTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Inputs Tab */}
          {activeTab === "inputs" && (
            <CalculatorInputTab
              plan={plan}
              setPlan={setPlan}
              stores={stores}
              setStores={setStores}
              transactions={transactions}
              setTransactions={setTransactions}
              marketing={marketing}
              setMarketing={setMarketing}
              handleTabChange={handleTabChange}
              // Pricing configuration from Firestore
              planDetails={planDetails}
              serverAutoApplyAboveStores={addons.server.autoApplyAboveStores}
            />
          )}

          {/* Add-ons Tab */}
          {activeTab === "addons" && (
            <AddOnsTab
              smsEnabled={smsEnabled}
              setSmsEnabled={setSmsEnabled}
              smsCountry={smsCountry}
              setSmsCountry={setSmsCountry}
              smsMessages={smsMessages}
              setSmsMessages={setSmsMessages}
              whatsappEnabled={whatsappEnabled}
              setWhatsappEnabled={setWhatsappEnabled}
              whatsappCountry={whatsappCountry}
              setWhatsappCountry={setWhatsappCountry}
              whatsappMarketTicket={whatsappMarketTicket}
              setWhatsappMarketTicket={setWhatsappMarketTicket}
              whatsappUtility={whatsappUtility}
              setWhatsappUtility={setWhatsappUtility}
              whatsappMarketing={whatsappMarketing}
              setWhatsappMarketing={setWhatsappMarketing}
              whatsappOtp={whatsappOtp}
              setWhatsappOtp={setWhatsappOtp}
              appType={appType}
              setAppType={setAppType}
              cms={cms}
              setCms={setCms}
              giftCard={giftCard}
              setGiftCard={setGiftCard}
              pushNotifications={pushNotifications}
              setPushNotifications={setPushNotifications}
              independentServer={independentServer}
              setIndependentServer={setIndependentServer}
              premiumSLA={premiumSLA}
              setPremiumSLA={setPremiumSLA}
              premiumSupport={premiumSupport}
              setPremiumSupport={setPremiumSupport}
              dataIngestion={dataIngestion}
              setDataIngestion={setDataIngestion}
              plan={plan}
              stores={stores}
              transactions={transactions}
              country={country}
              feeBreakdown={feeBreakdown}
              handleTabChange={handleTabChange}
              // Pricing configuration from Firestore
              smsRates={smsRates}
              whatsappRates={whatsappRates}
              whatsappAvailableCountries={whatsappAvailableCountries}
              whatsappStoreFeeConfig={whatsappStoreFeeConfig}
              addons={addons}
              setupFees={setupFeesConfig}
            />
          )}

          {/* Summary Tab */}
          {activeTab === "summary" && (
            <SummaryTab
              plan={plan}
              stores={stores}
              transactions={transactions}
              marketing={marketing}
              monthlyFees={monthlyFees}
              setupFees={setupFees}
              feeBreakdown={feeBreakdown}
              // Pricing configuration from Firestore
              planDetails={planDetails}
              whatsappRates={whatsappRates}
              addons={addons}
              giftCard={giftCard}
              smsEnabled={smsEnabled}
              smsMessages={smsMessages}
              whatsappEnabled={whatsappEnabled}
              whatsappCountry={whatsappCountry}
              whatsappMarketTicket={whatsappMarketTicket}
              whatsappUtility={whatsappUtility}
              whatsappMarketing={whatsappMarketing}
              whatsappOtp={whatsappOtp}
              independentServer={independentServer}
              premiumSLA={premiumSLA}
              premiumSupport={premiumSupport}
              cms={cms}
              appType={appType}
              dataIngestion={dataIngestion}
              pushNotifications={pushNotifications}
              discountUnlocked={discountUnlocked}
              setDiscountUnlocked={setDiscountUnlocked}
              showDiscountInput={showDiscountInput}
              setShowDiscountInput={setShowDiscountInput}
              discountPassword={discountPassword}
              setDiscountPassword={setDiscountPassword}
              showItemDiscounts={showItemDiscounts}
              setShowItemDiscounts={setShowItemDiscounts}
              subtotalDiscount={subtotalDiscount}
              setSubtotalDiscount={setSubtotalDiscount}
              discountReason={discountReason}
              setDiscountReason={setDiscountReason}
              itemDiscounts={itemDiscounts}
              setItemDiscounts={setItemDiscounts}
              discountsApplied={discountsApplied}
              setDiscountsApplied={setDiscountsApplied}
              setAppliedItemDiscounts={setAppliedItemDiscounts}
              setAppliedSubtotalDiscount={setAppliedSubtotalDiscount}
              setAppliedDiscountReason={setAppliedDiscountReason}
              selectedConnectionTierIndex={selectedConnectionTierIndex}
              setSelectedConnectionTierIndex={setSelectedConnectionTierIndex}
              isSubmitting={isSubmitting}
              submitError={submitError}
              submitData={submitData}
            />
          )}

          <CalculatorFooter
            monthlyFees={monthlyFees}
            setupFees={setupFees}
            feeBreakdown={feeBreakdown}
            discountsApplied={discountsApplied}
            onViewBreakdown={() => handleTabChange("summary")}
          />
        </div>
      )}
    </div>
  );
}
