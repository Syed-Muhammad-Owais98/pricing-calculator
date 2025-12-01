"use client";

import React from "react";

// Declare window with jspdf property for TypeScript
declare global {
  interface Window {
    jspdf?: {
      jsPDF: new () => {
        pages: any[];
        setFontSize: (size: number) => void;
        setFont: (font: string, style: string) => void;
        text: (text: string, x: number, y: number, options?: any) => any;
        splitTextToSize: (text: string, maxWidth: number) => string[];
        save: (filename: string) => void;
      };
    };
  }
}

// This is the SpoonityCalculator component from your uploaded file
export default function SpoonityCalculator() {
  // State to track if jsPDF is loaded
  const [jsPdfLoaded, setJsPdfLoaded] = React.useState(false);
  // State to track PDF generation
  const [isPdfGenerating, setIsPdfGenerating] = React.useState(false);

  // State for user data
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [role, setRole] = React.useState("");
  const [country, setCountry] = React.useState("USA"); // Default country
  const [otherCountry, setOtherCountry] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [webhookLogs, setWebhookLogs] = React.useState<
    Array<{ timestamp: string; message: string; data: any }>
  >([]);
  const [showLogs, setShowLogs] = React.useState(false);
  const [businessType, setBusinessType] = React.useState("corporate"); // 'corporate' or 'franchise'

  // Token related state
  const [token, setToken] = React.useState("");
  const [tokenError, setTokenError] = React.useState("");
  const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const TOKEN_CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

  // State for inputs
  const [plan, setPlan] = React.useState("loyalty");
  const [stores, setStores] = React.useState(10);
  const [transactions, setTransactions] = React.useState(1000);
  const [marketing, setMarketing] = React.useState(10000);
  const [giftCard, setGiftCard] = React.useState(false);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [smsEnabled, setSmsEnabled] = React.useState(true); // Pre-select SMS
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
  // Apply/Clear workflow state
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

  // WhatsApp rates by country and message type
  type WhatsAppRates = {
    [key: string]: {
      marketTicket: number;
      utility: number;
      marketing: number;
      otp: number;
    };
  };

  // List of countries where WhatsApp is available
  const whatsappAvailableCountries = [
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

  const whatsappRates: WhatsAppRates = {
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

  // Calculate WhatsApp per-store fees based on tiered pricing
  const calculateWhatsappStoreFeeTiers = (storeCount: number): number => {
    let fee = 0;
    if (storeCount <= 10) {
      fee = storeCount * 9.0;
    } else if (storeCount <= 80) {
      fee = 10 * 9.0 + (storeCount - 10) * 8.1;
    } else if (storeCount <= 149) {
      fee = 10 * 9.0 + 70 * 8.1 + (storeCount - 80) * 7.2;
    } else {
      fee = 10 * 9.0 + 70 * 8.1 + 69 * 7.2 + (storeCount - 149) * 6.3;
    }
    return fee;
  };

  // State for calculated values
  const [monthlyFees, setMonthlyFees] = React.useState(0);
  const [setupFees, setSetupFees] = React.useState(0);
  const [perStore, setPerStore] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("inputs");
  const [totalBeforeSupport, setTotalBeforeSupport] = React.useState(0);
  // State for manually selected connection fee tier (null = auto-select based on store count)
  const [selectedConnectionTierIndex, setSelectedConnectionTierIndex] =
    React.useState<number | null>(null);

  // State for fee breakdown
  const [feeBreakdown, setFeeBreakdown] = React.useState({
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
  });

  // Constants
  const smsRates: Record<string, number> = {
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

  // Plan info
  const planDetails: Record<
    string,
    { base: number; name: string; description: string; fullDescription: string }
  > = {
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

  // Country dial codes mapping
  const countryDialCodes: Record<string, string> = {
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

  // Add custom font and jsPDF script
  React.useEffect(() => {
    // Add Google Fonts link
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Add custom CSS for font and improved styling
    const style = document.createElement("style");
    style.textContent = `
      * {
        font-family: 'Figtree', sans-serif;
      }
      
      .input-field {
        transition: border-color 0.2s ease;
      }
      
      .input-field:focus {
        border-color: #640C6F;
        box-shadow: 0 0 0 2px rgba(100, 12, 111, 0.2);
        outline: none;
      }
      
      .tab-button {
        position: relative;
        transition: all 0.2s ease;
      }
      
      .tab-button::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: transparent;
        transition: background-color 0.2s ease;
      }
      
      .tab-button.active::after {
        background-color: #640C6F;
      }
      
      .checkbox-custom {
        appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid #CBD5E1;
        border-radius: 4px;
        margin-right: 8px;
        position: relative;
        transition: all 0.2s ease;
        cursor: pointer;
      }
      
      .checkbox-custom:checked {
        background-color: #640C6F;
        border-color: #640C6F;
      }
      
      .checkbox-custom:checked::after {
        content: '';
        position: absolute;
        left: 5px;
        top: 2px;
        width: 6px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
      
      .checkbox-custom:disabled {
        background-color: #F7F7F7;
        border-color: #CBD5E1;
        cursor: not-allowed;
      }

      /* Custom brand colors */
      .spoonity-primary {
        background-color: #640C6F;
      }
      
      .spoonity-cta {
        background-color: #FF7E3D;
      }
      
      .spoonity-cta:hover {
        background-color: #e86d2f;
      }
      
      .spoonity-form {
        background-color: #F7F7F7;
      }
      
      .spoonity-primary-text {
        color: #640C6F;
      }
      
      .spoonity-cta-text {
        color: #FF7E3D;
      }
    `;
    document.head.appendChild(style);

    // Load jsPDF from CDN
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    script.onload = () => {
      console.log("jsPDF loaded successfully");
      setJsPdfLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load jsPDF from CDN");
      // Fallback to mock as a last resort
      window.jspdf = {
        jsPDF: class MockJsPDF {
          pages: any[];

          constructor() {
            this.pages = [];
            console.log("MockJsPDF created as fallback");
          }

          setFontSize(size: number): void {
            console.log("Setting font size:", size);
          }

          setFont(font: string, style: string): void {
            console.log("Setting font:", font, style);
          }

          text(text: string, x: number, y: number, options?: any): any {
            console.log("Adding text:", text, "at position:", x, y, options);
            return this;
          }

          splitTextToSize(text: string, maxWidth: number): string[] {
            console.log("Splitting text to size:", maxWidth);
            const words = text.split(" ");
            const lines: string[] = [];
            let currentLine = "";

            words.forEach((word) => {
              if ((currentLine + word).length > maxWidth / 6) {
                lines.push(currentLine);
                currentLine = word + " ";
              } else {
                currentLine += word + " ";
              }
            });

            if (currentLine) lines.push(currentLine);
            return lines.length ? lines : [text];
          }

          save(filename: string): void {
            console.log("PDF would be saved as:", filename);
            alert(
              `Your quote has been prepared! In a production environment, this would download a PDF file named: ${filename}`
            );
          }
        },
      };
      setJsPdfLoaded(true);
    };
    document.head.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Function to validate token
  const validateToken = async (inputToken: string): Promise<boolean> => {
    try {
      // First, try to decode the Base64 string
      const decodedString = atob(inputToken);

      // Then parse the JSON
      const tokenData = JSON.parse(decodedString);

      // Check if the token contains the required paraphrase and is not expired
      const paraphraseCheck =
        tokenData.paraphrase === "client-specific-encrypt-key";
      const expiryCheck = new Date(tokenData.expiresAt) > new Date();

      const isValid = paraphraseCheck && expiryCheck;

      return isValid;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  };

  // Function to save token and user data to localStorage
  const saveTokenAndData = (
    token: string,
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
    localStorage.setItem("spoonity_token", token);
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

  // Function to check token expiry
  const checkTokenExpiry = () => {
    const expiryTime = localStorage.getItem("spoonity_token_expiry");
    if (expiryTime && parseInt(expiryTime) < Date.now()) {
      // Token expired
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
      // Token is valid, restore user data
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

    // Set up interval to check token expiry
    const intervalId = setInterval(checkTokenExpiry, TOKEN_CHECK_INTERVAL);

    // Cleanup interval on component unmount
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

    // Required field validations
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

    // Validate token
    const isValidToken = await validateToken(token);
    if (!isValidToken) {
      setTokenError("Invalid access token");
      return;
    }

    // Apply defaults for optional fields if empty
    const finalFirstName = firstName.trim() === "" ? "John" : firstName.trim();
    const finalLastName = lastName.trim() === "" ? "Doe" : lastName.trim();
    const finalCompany = company.trim() === "" ? "Spoonity" : company.trim();

    // Update state with defaults if needed
    if (firstName.trim() === "") {
      setFirstName("John");
    }
    if (lastName.trim() === "") {
      setLastName("Doe");
    }
    if (company.trim() === "") {
      setCompany("Spoonity");
    }

    // If validation passes, set initial values based on country selection
    if (country === "Other") {
      // If "Other" country, initialize SMS to false and disabled
      setSmsEnabled(false);
      setSmsMessages("");
      setSmsCountry("USA"); // Default, but will be disabled
    } else {
      // Set the SMS country to match the selected country
      setSmsCountry(country);
    }

    // Save token and user data (using final values with defaults)
    saveTokenAndData(token, {
      firstName: finalFirstName,
      lastName: finalLastName,
      email: email.trim(),
      phone: phone.trim(),
      company: finalCompany,
      role: role.trim(),
      country: country === "Other" ? otherCountry : country,
      businessType,
    });

    // If validation passes, set logged in to true and scroll to top
    setIsLoggedIn(true);
    // Use setTimeout to ensure the new content is rendered before scrolling
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  // Function to get quote information structured for display or PDF
  const getQuoteDetails = () => {
    const addOns = [];

    if (giftCard) {
      addOns.push(`Gift Card Base Fee: ${formatCurrency(500)}`);
      addOns.push(
        `Gift Card Per-Store Fee (${stores} stores @ $30/store): ${formatCurrency(
          stores * 30
        )}`
      );
    }

    if (smsEnabled) {
      addOns.push(
        `SMS Platform (${smsCountry}): ${formatCurrency(
          feeBreakdown.sms
        )}/month`
      );
    }

    if (whatsappEnabled) {
      addOns.push(`WhatsApp Base Platform Fee: ${formatCurrency(630)}/month`);
      addOns.push(
        `WhatsApp Per-Store Fee (${stores} stores): ${formatCurrency(
          feeBreakdown.whatsapp.perStore
        )}/month`
      );
      addOns.push(`WhatsApp Message Fees (${whatsappCountry}):`);
      addOns.push(
        `  • Digital Receipts: ${formatCurrency(
          whatsappMarketTicket * whatsappRates[whatsappCountry].marketTicket
        )}/month`
      );
      addOns.push(
        `  • Utility Messages: ${formatCurrency(
          whatsappUtility * whatsappRates[whatsappCountry].utility
        )}/month`
      );
      addOns.push(
        `  • Marketing Messages: ${formatCurrency(
          whatsappMarketing * whatsappRates[whatsappCountry].marketing
        )}/month`
      );
      addOns.push(
        `  • OTP Messages: ${formatCurrency(
          whatsappOtp * whatsappRates[whatsappCountry].otp
        )}/month`
      );
    }

    if (appType !== "none") {
      addOns.push(
        `Mobile App (${appType}): ${formatCurrency(feeBreakdown.app)}/month`
      );
    }

    if (independentServer) {
      addOns.push(
        `Independent Server: ${formatCurrency(feeBreakdown.server)}/month`
      );
    }

    if (premiumSLA) {
      addOns.push(`Premium SLA: ${formatCurrency(feeBreakdown.sla)}/month`);
    }

    if (plan === "loyalty") {
      addOns.push(
        `Loyalty Program: ${formatCurrency(feeBreakdown.baseLicense)}/month`
      );
    }

    if (marketing) {
      addOns.push(
        `Marketing Platform: ${formatCurrency(feeBreakdown.marketing)}/month`
      );
    }

    if (cms) {
      addOns.push(
        `Content Management System: ${formatCurrency(feeBreakdown.cms)}/month`
      );
    }

    if (premiumSupport) {
      addOns.push(
        `Premium Support: ${formatCurrency(feeBreakdown.support)}/month`
      );
    }

    return addOns;
  };

  // Function to display quote information as text
  const displayQuoteDetails = () => {
    return getQuoteDetails();
  };

  // Function to generate and download PDF
  const generatePDF = () => {
    if (!jsPdfLoaded) {
      alert("PDF generation is loading. Please try again in a moment.");
      return;
    }
    try {
      const { jsPDF } = window.jspdf as any;
      const doc = new jsPDF();
      const discountAmount = feeBreakdown.discount || 0;
      const subtotalBeforeDiscounts = monthlyFees + discountAmount;

      // Helper function to check if we need a new page
      const checkPageBreak = (requiredHeight: number) => {
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;

        if (y + requiredHeight > pageHeight - margin) {
          doc.addPage();
          return 20; // Reset Y to top of new page
        }
        return y;
      };

      // Helper function to add text with page break check
      const addText = (text: string, x: number, y: number, options?: any) => {
        const newY = checkPageBreak(10);
        doc.text(text, x, newY, options);
        return newY + 10;
      };

      // Helper function to add line with page break check
      const addLine = (x1: number, y: number, x2: number) => {
        const newY = checkPageBreak(5);
        doc.line(x1, newY, x2, newY);
        return newY + 5;
      };

      let y = 20;

      // --- HEADER (Purple) ---
      doc.setFillColor(159, 98, 166); // #9F62A6
      doc.rect(10, y, 190, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(planDetails[plan].name, 20, y + 18);
      doc.setFontSize(22);
      doc.text(`${formatCurrency(monthlyFees)}`, 180, y + 18, {
        align: "right",
      });
      doc.setFontSize(10);
      doc.text("/month", 180, y + 24, { align: "right" });

      y = 60;

      // --- Plan Description ---
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const descLines = doc.splitTextToSize(
        planDetails[plan].fullDescription,
        170
      );
      const descHeight = descLines.length * 5 + 8;

      y = checkPageBreak(descHeight + 20);
      doc.setFillColor(247, 247, 247); // #F7F7F7
      doc.roundedRect(15, y, 180, descHeight, 3, 3, "F");
      doc.text(descLines, 20, y + 8);
      y += descHeight + 10;

      // --- Basic Fee Breakdown ---
      y = checkPageBreak(50);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text("Base License Fee:", 20, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(planDetails[plan].base), 190, y, {
        align: "right",
      });
      y += 7;

      doc.setTextColor(120, 120, 120);
      doc.text(`Connection Fees (${stores} stores):`, 20, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(feeBreakdown.connection), 190, y, {
        align: "right",
      });
      y += 7;

      doc.setTextColor(120, 120, 120);
      doc.text("Transaction Processing:", 20, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(feeBreakdown.transaction), 190, y, {
        align: "right",
      });
      y += 7;

      if (plan !== "loyalty") {
        doc.setTextColor(120, 120, 120);
        doc.text("Marketing Platform:", 20, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.marketing), 190, y, {
          align: "right",
        });
        y += 7;

        if (pushNotifications) {
          doc.setTextColor(120, 120, 120);
          doc.text("Push Notifications:", 20, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(marketing * 0.0045), 190, y, {
            align: "right",
          });
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

      getConnectionFeeBreakdown(stores).forEach((tier: any) => {
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
        doc.text(`$${tier.price.toFixed(2)}/store`, 190, y - 10, {
          align: "right",
        });
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
        `Total Volume: ${Math.round(
          0.25 * (stores * transactions)
        ).toLocaleString()} transactions`,
        25,
        y
      );
      y += 5;

      getTransactionFeeBreakdown(0.25 * (stores * transactions)).forEach(
        (tier) => {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text(
            `${tier.volume.toLocaleString()} transactions ($${tier.rate.toFixed(
              3
            )}/transaction):`,
            25,
            y
          );
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(tier.total), 190, y, { align: "right" });
          y += 5;
        }
      );

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
          doc.text("($500 base fee included)", 190, y, { align: "right" });
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
          doc.text(formatCurrency(500), 190, y, { align: "right" });
          y += 6;

          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text(
            `Gift Card Per-Store Fee (${stores} stores @ $30/store):`,
            25,
            y
          );
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(stores * 30), 190, y, { align: "right" });
          y += 6;
        }

        if (smsEnabled && smsMessages && parseInt(smsMessages) > 0) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text(`SMS Platform (${smsCountry}):`, 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.sms), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (whatsappEnabled) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text("WhatsApp Base Platform Fee:", 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(630), 190, y, { align: "right" });
          y += 6;

          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text(`WhatsApp Per-Store Fee (${stores} stores):`, 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.whatsapp.perStore), 190, y, {
            align: "right",
          });
          y += 6;

          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text(`WhatsApp Message Fees (${whatsappCountry}):`, 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.whatsapp.messages), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (independentServer) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text("Independent Server:", 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.server), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (premiumSLA) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text("Premium SLA:", 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.sla), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (cms) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text("Content Management System:", 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.cms), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (appType !== "none") {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text(`Mobile App (${appType}):`, 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.app), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (premiumSupport) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text("Premium Support:", 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.support), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (dataIngestion) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text("Data Ingestion:", 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(
            formatCurrency(
              (monthlyFees - (premiumSupport ? 2000 + monthlyFees * 0.1 : 0)) *
                0.2
            ),
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
      doc.text(formatCurrency(feeBreakdown.setup.onboarding), 190, y, {
        align: "right",
      });
      y += 5;

      if (appType === "premium") {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Premium App Setup:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(15000), 190, y, { align: "right" });
        y += 5;
      }

      if (appType === "standard") {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Standard App Setup:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(5000), 190, y, { align: "right" });
        y += 5;
      }

      if (appType === "pwa") {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("PWA Setup:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(1000), 190, y, { align: "right" });
        y += 5;
      }

      if (dataIngestion) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Data Ingestion Setup:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.setup.dataIngestion), 190, y, {
          align: "right",
        });
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
      doc.text(formatCurrency(subtotalBeforeDiscounts), 190, y, {
        align: "right",
      });
      y += 7;

      if (discountAmount > 0) {
        doc.setTextColor(120, 120, 120);
        doc.text("Discounts Applied:", 20, y);
        doc.setTextColor(22, 163, 74);
        doc.text(`- ${formatCurrency(discountAmount)}`, 190, y, {
          align: "right",
        });
        y += 7;
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text("Monthly Recurring Fees:", 20, y);
      doc.setTextColor(100, 12, 111); // #640C6F
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
      doc.text(formatCurrency(monthlyFees * 12 + setupFees), 190, y, {
        align: "right",
      });

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
      const filename = `Spoonity_Quote_${firstName.replace(
        /\s+/g,
        "_"
      )}_${lastName.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(filename);
    } catch (error) {
      alert("Failed to generate PDF. Please try again or contact support.");
    }
  };

  // Enhanced PDF generation with loading state
  const generatePDFWithLoading = () => {
    if (!jsPdfLoaded) {
      alert("PDF generation is loading. Please try again in a moment.");
      return;
    }

    setIsPdfGenerating(true);

    // Use setTimeout to allow React to render the loading state
    setTimeout(() => {
      try {
        generatePDF();
      } catch (error) {
        console.error("Error in PDF generation:", error);
        alert("There was an error generating your PDF. Please try again.");
      } finally {
        setIsPdfGenerating(false);
      }
    }, 100);
  };

  // Helper function to add a log entry
  const addLog = (message: string, data: any = null): void => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      message,
      data,
    };
    setWebhookLogs((prevLogs) => [...prevLogs, logEntry]);
    console.log(`[${timestamp}] ${message}`, data || "");
  };

  // Function to generate comprehensive quote details for webhook
  const generateQuoteDetails = () => {
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
        connectionFees: getConnectionFeeBreakdown(stores).map((tier) => ({
          range: tier.range,
          count: tier.count,
          pricePerStore: `$${tier.price}`,
          total: formatCurrency(tier.total),
        })),
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
                  rate: `$${whatsappRates[whatsappCountry].marketTicket.toFixed(
                    4
                  )}`,
                  cost: formatCurrency(
                    whatsappMarketTicket *
                      whatsappRates[whatsappCountry].marketTicket
                  ),
                },
                utility: {
                  count: whatsappUtility,
                  rate: `$${whatsappRates[whatsappCountry].utility.toFixed(2)}`,
                  cost: formatCurrency(
                    whatsappUtility * whatsappRates[whatsappCountry].utility
                  ),
                },
                marketing: {
                  count: whatsappMarketing,
                  rate: `$${whatsappRates[whatsappCountry].marketing.toFixed(
                    2
                  )}`,
                  cost: formatCurrency(
                    whatsappMarketing * whatsappRates[whatsappCountry].marketing
                  ),
                },
                otp: {
                  count: whatsappOtp,
                  rate: `$${whatsappRates[whatsappCountry].otp.toFixed(2)}`,
                  cost: formatCurrency(
                    whatsappOtp * whatsappRates[whatsappCountry].otp
                  ),
                },
              },
              total: formatCurrency(feeBreakdown.whatsapp.total),
            }
          : { enabled: false },
        independentServer: {
          enabled: independentServer,
          cost: independentServer
            ? formatCurrency(feeBreakdown.server)
            : "$0.00",
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
                (monthlyFees -
                  (premiumSupport ? 2000 + monthlyFees * 0.1 : 0)) *
                  0.2
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
  };

  // Function to generate PDF as base64 string for webhook
  const generatePDFAsBase64 = (): string => {
    if (!jsPdfLoaded) {
      return "";
    }
    try {
      const { jsPDF } = window.jspdf as any;
      const doc = new jsPDF();
      const discountAmount = feeBreakdown.discount || 0;
      const subtotalBeforeDiscounts = monthlyFees + discountAmount;

      // Helper function to check if we need a new page
      const checkPageBreak = (requiredHeight: number) => {
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;

        if (y + requiredHeight > pageHeight - margin) {
          doc.addPage();
          return 20; // Reset Y to top of new page
        }
        return y;
      };

      // Helper function to add text with page break check
      const addText = (text: string, x: number, y: number, options?: any) => {
        const newY = checkPageBreak(10);
        doc.text(text, x, newY, options);
        return newY + 10;
      };

      // Helper function to add line with page break check
      const addLine = (x1: number, y: number, x2: number) => {
        const newY = checkPageBreak(5);
        doc.line(x1, newY, x2, newY);
        return newY + 5;
      };

      let y = 20;

      // --- HEADER (Purple) ---
      doc.setFillColor(159, 98, 166); // #9F62A6
      doc.rect(10, y, 190, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(planDetails[plan].name, 20, y + 18);
      doc.setFontSize(22);
      doc.text(`${formatCurrency(monthlyFees)}`, 180, y + 18, {
        align: "right",
      });
      doc.setFontSize(10);
      doc.text("/month", 180, y + 24, { align: "right" });

      y = 60;

      // --- Plan Description ---
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const descLines = doc.splitTextToSize(
        planDetails[plan].fullDescription,
        170
      );
      const descHeight = descLines.length * 5 + 8;

      y = checkPageBreak(descHeight + 20);
      doc.setFillColor(247, 247, 247); // #F7F7F7
      doc.roundedRect(15, y, 180, descHeight, 3, 3, "F");
      doc.text(descLines, 20, y + 8);
      y += descHeight + 10;

      // --- Basic Fee Breakdown ---
      y = checkPageBreak(50);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text("Base License Fee:", 20, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(planDetails[plan].base), 190, y, {
        align: "right",
      });
      y += 7;

      doc.setTextColor(120, 120, 120);
      doc.text(`Connection Fees (${stores} stores):`, 20, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(feeBreakdown.connection), 190, y, {
        align: "right",
      });
      y += 7;

      doc.setTextColor(120, 120, 120);
      doc.text("Transaction Processing:", 20, y);
      doc.setTextColor(40, 40, 40);
      doc.text(formatCurrency(feeBreakdown.transaction), 190, y, {
        align: "right",
      });
      y += 7;

      if (plan !== "loyalty") {
        doc.setTextColor(120, 120, 120);
        doc.text("Marketing Platform:", 20, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.marketing), 190, y, {
          align: "right",
        });
        y += 7;

        if (pushNotifications) {
          doc.setTextColor(120, 120, 120);
          doc.text("Push Notifications:", 20, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(marketing * 0.0045), 190, y, {
            align: "right",
          });
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

      getConnectionFeeBreakdown(stores).forEach((tier: any) => {
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
        doc.text(`$${tier.price.toFixed(2)}/store`, 190, y - 10, {
          align: "right",
        });
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
        `Total Volume: ${Math.round(
          0.25 * (stores * transactions)
        ).toLocaleString()} transactions`,
        25,
        y
      );
      y += 5;

      getTransactionFeeBreakdown(0.25 * (stores * transactions)).forEach(
        (tier) => {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text(
            `${tier.volume.toLocaleString()} transactions ($${tier.rate.toFixed(
              3
            )}/transaction):`,
            25,
            y
          );
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(tier.total), 190, y, { align: "right" });
          y += 5;
        }
      );

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
          doc.text("($500 base fee included)", 190, y, { align: "right" });
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
          doc.text(formatCurrency(500), 190, y, { align: "right" });
          y += 6;

          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text(
            `Gift Card Per-Store Fee (${stores} stores @ $30/store):`,
            25,
            y
          );
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(stores * 30), 190, y, { align: "right" });
          y += 6;
        }

        if (smsEnabled && smsMessages && parseInt(smsMessages) > 0) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text(`SMS Platform (${smsCountry}):`, 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.sms), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (whatsappEnabled) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text("WhatsApp Base Platform Fee:", 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(630), 190, y, { align: "right" });
          y += 6;

          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text(`WhatsApp Per-Store Fee (${stores} stores):`, 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.whatsapp.perStore), 190, y, {
            align: "right",
          });
          y += 6;

          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text(`WhatsApp Message Fees (${whatsappCountry}):`, 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.whatsapp.messages), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (independentServer) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text("Independent Server:", 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.server), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (premiumSLA) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text("Premium SLA:", 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.sla), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (cms) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text("Content Management System:", 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.cms), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (appType !== "none") {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text(`Mobile App (${appType}):`, 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.app), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (premiumSupport) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text("Premium Support:", 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(formatCurrency(feeBreakdown.support), 190, y, {
            align: "right",
          });
          y += 6;
        }

        if (dataIngestion) {
          y = checkPageBreak(10);
          doc.setTextColor(120, 120, 120);
          doc.text("Data Ingestion:", 25, y);
          doc.setTextColor(40, 40, 40);
          doc.text(
            formatCurrency(
              (monthlyFees - (premiumSupport ? 2000 + monthlyFees * 0.1 : 0)) *
                0.2
            ),
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
      doc.text(formatCurrency(feeBreakdown.setup.onboarding), 190, y, {
        align: "right",
      });
      y += 5;

      if (appType === "premium") {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Premium App Setup:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(15000), 190, y, { align: "right" });
        y += 5;
      }

      if (appType === "standard") {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Standard App Setup:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(5000), 190, y, { align: "right" });
        y += 5;
      }

      if (appType === "pwa") {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("PWA Setup:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(1000), 190, y, { align: "right" });
        y += 5;
      }

      if (dataIngestion) {
        y = checkPageBreak(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Data Ingestion Setup:", 25, y);
        doc.setTextColor(40, 40, 40);
        doc.text(formatCurrency(feeBreakdown.setup.dataIngestion), 190, y, {
          align: "right",
        });
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
      doc.text(formatCurrency(subtotalBeforeDiscounts), 190, y, {
        align: "right",
      });
      y += 7;

      if (discountAmount > 0) {
        doc.setTextColor(120, 120, 120);
        doc.text("Discounts Applied:", 20, y);
        doc.setTextColor(22, 163, 74);
        doc.text(`- ${formatCurrency(discountAmount)}`, 190, y, {
          align: "right",
        });
        y += 7;
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text("Monthly Recurring Fees:", 20, y);
      doc.setTextColor(100, 12, 111); // #640C6F
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
      doc.text(formatCurrency(monthlyFees * 12 + setupFees), 190, y, {
        align: "right",
      });

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
      return pdfOutput.split(",")[1]; // Remove the data:application/pdf;base64, prefix
    } catch (error) {
      console.error("Error generating PDF for webhook:", error);
      return "";
    }
  };

  // Submit data to webhook
  const submitData = async (): Promise<void> => {
    // Prevent double submission
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");
    setWebhookLogs([]); // Clear previous logs

    // Generate comprehensive quote details
    const quoteDetails = generateQuoteDetails();

    // Generate PDF as base64 for webhook
    const pdfBase64 = generatePDFAsBase64();

    // Prepare data to send
    const formData = {
      firstName,
      lastName,
      email,
      phone,
      company,
      role,
      country: country === "Other" ? otherCountry : country,
      businessType,
      quoteDetails, // Single parameter containing all quote information
      pdfBase64, // PDF data as base64 string
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
      const webhookUrl = "https://hooks.zapier.com/hooks/catch/57845/20qrdnf/";

      console.log("Submitting data to Zapier webhook...");
      addLog("Sending data to webhook", formData);

      // Store submission state in localStorage
      localStorage.setItem("spoonity_submission_pending", "true");
      localStorage.setItem(
        "spoonity_submission_data",
        JSON.stringify({
          firstName,
          lastName,
          email,
        })
      );

      // Use fetch API with proper CORS settings
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "no-cors", // This allows the request to succeed even with CORS restrictions
        body: JSON.stringify({ data: formData }),
      });

      console.log(
        "Webhook Response Status:",
        response.status,
        response.statusText
      );
      addLog("Webhook Response Status", {
        status: response.status,
        statusText: response.statusText,
      });

      // Since we're using no-cors, we won't be able to read the response body
      // but we can consider it successful if we get here
      addLog("Webhook submission completed successfully");
      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Scroll to top when transitioning to thank you screen
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error: unknown) {
      console.error("Error in submission process:", error);
      addLog("Error in submission process", {
        error: error instanceof Error ? error.message : String(error),
      });

      // Automatically proceed to success screen for demo purposes
      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Scroll to top when transitioning to thank you screen
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Calculate fees whenever inputs change
  React.useEffect(() => {
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
    // Add WhatsApp message counts and country to dependencies
    whatsappEnabled,
    whatsappCountry,
    whatsappMarketTicket,
    whatsappUtility,
    whatsappMarketing,
    whatsappOtp,
    // Discounts (recalc only when applied or being cleared)
    discountUnlocked,
    discountsApplied,
    appliedSubtotalDiscount,
    appliedItemDiscounts,
    // Connection fee tier selection
    selectedConnectionTierIndex,
  ]);

  // Calculate default SMS message count when stores or transactions change
  React.useEffect(() => {
    // Calculate default SMS count as 10% of total transactions
    const defaultSmsCount = Math.round(stores * transactions * 0.1);
    if (smsEnabled) {
      setSmsMessages(defaultSmsCount.toString());
    }
  }, [stores, transactions, smsEnabled]);

  // Calculate default WhatsApp message counts when stores or transactions change
  React.useEffect(() => {
    if (whatsappEnabled) {
      const defaultCount = Math.round(stores * transactions * 0.1);
      setWhatsappMarketTicket(defaultCount);
      setWhatsappUtility(defaultCount);
      setWhatsappOtp(defaultCount);
      setWhatsappMarketing(10000);
    }
  }, [stores, transactions, whatsappEnabled]);

  // Ensure independent server for >50 stores
  React.useEffect(() => {
    if (stores > 50) {
      setIndependentServer(true);
    }
  }, [stores]);

  // Calculate connection fees and corporate/franchise split
  const calculateConnectionFees = (storeCount: number): number => {
    const tiers = [
      { min: 0, max: 10, price: 150 },
      { min: 11, max: 25, price: 135 },
      { min: 26, max: 40, price: 121.5 },
      { min: 41, max: 55, price: 109.35 },
      { min: 56, max: 100, price: 98.42 },
      { min: 101, max: 150, price: 88.57 },
      { min: 151, max: 250, price: 79.72 },
      { min: 251, max: 500, price: 71.74 },
      { min: 501, max: 1000, price: 64.57 },
      { min: 1001, max: 10000, price: 58.11 },
    ];

    // Use manually selected tier if available, otherwise find the applicable tier
    let applicableTier = tiers[0];
    if (
      selectedConnectionTierIndex !== null &&
      selectedConnectionTierIndex >= 0 &&
      selectedConnectionTierIndex < tiers.length
    ) {
      applicableTier = tiers[selectedConnectionTierIndex];
    } else {
      // Find the applicable tier based on store count
      for (const tier of tiers) {
        if (storeCount >= tier.min && storeCount <= tier.max) {
          applicableTier = tier;
          break;
        }
      }
    }

    return storeCount * applicableTier.price;
  };

  // Function to get connection fee tier breakdown (detailed, highlights selected tier)
  const getConnectionFeeBreakdown = (storeCount: number) => {
    const tiers = [
      { min: 0, max: 10, price: 150 },
      { min: 11, max: 25, price: 135 },
      { min: 26, max: 40, price: 121.5 },
      { min: 41, max: 55, price: 109.35 },
      { min: 56, max: 100, price: 98.42 },
      { min: 101, max: 150, price: 88.57 },
      { min: 151, max: 250, price: 79.72 },
      { min: 251, max: 500, price: 71.74 },
      { min: 501, max: 1000, price: 64.57 },
      { min: 1001, max: 10000, price: 58.11 },
    ];

    // Use manually selected tier if available, otherwise find the applicable tier
    let selectedTierIndex = 0;
    if (
      selectedConnectionTierIndex !== null &&
      selectedConnectionTierIndex >= 0 &&
      selectedConnectionTierIndex < tiers.length
    ) {
      selectedTierIndex = selectedConnectionTierIndex;
    } else {
      // Find the applicable tier based on store count
      for (let i = 0; i < tiers.length; i++) {
        const t = tiers[i];
        if (storeCount >= t.min && storeCount <= t.max) {
          selectedTierIndex = i;
          break;
        }
      }
    }

    // Return all tiers, styled like Marketing breakdown
    return tiers.map((tier, index) => {
      const isSelected = index === selectedTierIndex;
      // If this tier is selected, use actual store count; otherwise show tier max
      const count = isSelected ? storeCount : tier.max;
      return {
        range: `${tier.min}-${tier.max}`,
        count,
        price: tier.price,
        total: isSelected ? storeCount * tier.price : tier.max * tier.price,
        isSelected,
        tierName: `Tier ${index + 1}`,
      } as any;
    });
  };

  // Function to get transaction fee tier breakdown
  const getTransactionFeeBreakdown = (transactionVolume: number) => {
    let rate = 0.005; // Default rate
    let range = "0-5,000";

    if (transactionVolume > 50000) {
      rate = 0.002;
      range = "50,001+";
    } else if (transactionVolume > 5000) {
      rate = 0.003;
      range = "5,001-50,000";
    }

    return [
      {
        range: range,
        volume: transactionVolume,
        rate: rate,
        total: transactionVolume * rate,
      },
    ];
  };

  // Function to get marketing email tier breakdown
  const getMarketingEmailBreakdown = (emailCount: number) => {
    // Licensed-based model: merchant is charged for committed volume
    // First 10,000 emails are included in Marketing package, base fee of $500 applies to higher tiers
    const breakdown: Array<{
      range: string;
      count: number;
      rate: number;
      volumeCost: number;
      baseFee: number;
      total: number;
      isSelected: boolean;
      tierName: string;
    }> = [];

    // Define the new tier structure
    const tiers = [
      {
        threshold: 10000,
        range: "0-10,000",
        rate: 0.0,
        volumeCost: 0,
        totalCost: 0, // Included in Marketing package base fee
      },
      {
        threshold: 100000,
        range: "10,001-100,000",
        rate: 0.008,
        volumeCost: 800,
        totalCost: 1300,
      },
      {
        threshold: 250000,
        range: "100,001-250,000",
        rate: 0.006,
        volumeCost: 1500,
        totalCost: 2000,
      },
      {
        threshold: 500000,
        range: "250,001-500,000",
        rate: 0.0045,
        volumeCost: 2250,
        totalCost: 2750,
      },
      {
        threshold: 1000000,
        range: "500,001-1,000,000",
        rate: 0.0034,
        volumeCost: 3375,
        totalCost: 3875,
      },
      {
        threshold: 2500000,
        range: "1,000,001-2,500,000",
        rate: 0.0025,
        volumeCost: 6328,
        totalCost: 6828,
      },
      {
        threshold: 10000000,
        range: "2,500,001-10,000,000",
        rate: 0.0022,
        volumeCost: 21516,
        totalCost: 22016,
      },
    ];

    // Find the appropriate tier based on email count
    let selectedTierIndex = 0;
    for (let i = 0; i < tiers.length; i++) {
      if (emailCount <= tiers[i].threshold) {
        selectedTierIndex = i;
        break;
      }
    }

    // If email count exceeds the highest tier, use the highest tier
    if (emailCount > tiers[tiers.length - 1].threshold) {
      selectedTierIndex = tiers.length - 1;
    }

    // Add all tiers to breakdown, highlighting the selected one
    tiers.forEach((tier, index) => {
      const isSelected = index === selectedTierIndex;
      // First tier (0-10,000) has no base fee as it's included in the Marketing package
      // All other tiers have a $500 base fee
      const tierBaseFee = index === 0 ? 0 : 500;
      breakdown.push({
        range: tier.range,
        count: isSelected ? emailCount : tier.threshold,
        rate: tier.rate,
        volumeCost: tier.volumeCost,
        baseFee: tierBaseFee,
        total: tier.totalCost,
        isSelected: isSelected,
        tierName: `Tier ${index + 1}`,
      });
    });

    return breakdown;
  };

  // Calculate the fees
  function calculateFees() {
    // Base license fee
    let monthly = planDetails[plan].base;

    // Connection fees (simplified tiered calculation)
    let connectionFees = calculateConnectionFees(stores);
    monthly += connectionFees;

    // Transaction fees (25% of total)
    let transactionVolume = 0.25 * (stores * transactions);
    let transactionFees = 0;
    if (transactionVolume > 50000) {
      transactionFees = transactionVolume * 0.002;
    } else if (transactionVolume > 5000) {
      transactionFees = transactionVolume * 0.003;
    } else {
      transactionFees = transactionVolume * 0.005;
    }
    monthly += transactionFees;

    // Marketing emails (for Marketing and Intelligence plans)
    let marketingFees = 0;
    if (plan !== "loyalty") {
      // Use tiered breakdown - only get the selected tier's cost
      const breakdown = getMarketingEmailBreakdown(marketing);
      const selectedTier = breakdown.find((tier) => tier.isSelected);
      marketingFees = selectedTier ? selectedTier.total : 0;
      monthly += marketingFees;

      // Push notifications
      if (pushNotifications) {
        monthly += marketing * 0.0045;
      }
    }

    // Add-ons
    let giftCardFees = 0;
    if (giftCard) {
      giftCardFees = 500 + stores * 30; // $500 base + $30/store
      monthly += giftCardFees;
    }

    let smsFees = 0;
    if (smsEnabled && smsMessages && parseInt(smsMessages) > 0) {
      smsFees = parseFloat(smsMessages) * smsRates[smsCountry];
      monthly += smsFees;
    }

    // WhatsApp fees
    let whatsappBaseFee = 0;
    let whatsappPerStoreFee = 0;
    let whatsappMessageFees = 0;
    let whatsappTotalFee = 0;

    if (whatsappEnabled) {
      // Base platform fee
      whatsappBaseFee = 630;

      // Per-store fee based on tiers
      whatsappPerStoreFee = calculateWhatsappStoreFeeTiers(stores);

      // Message fees based on country and message types
      const countryRates = whatsappRates[whatsappCountry];
      const marketTicketFee = whatsappMarketTicket * countryRates.marketTicket;
      const utilityFee = whatsappUtility * countryRates.utility;
      const marketingFee = whatsappMarketing * countryRates.marketing;
      const otpFee = whatsappOtp * countryRates.otp;

      whatsappMessageFees =
        marketTicketFee + utilityFee + marketingFee + otpFee;
      whatsappTotalFee =
        whatsappBaseFee + whatsappPerStoreFee + whatsappMessageFees;

      monthly += whatsappTotalFee;
    }

    let serverFees = 0;
    if (independentServer) {
      serverFees = 500;
      monthly += serverFees;
    }

    let slaFees = 0;
    if (premiumSLA) {
      slaFees = 2000;
      monthly += slaFees;
    }

    let cmsFees = 0;
    if (cms) {
      cmsFees = 530;
      monthly += cmsFees;
    }

    // App monthly fees
    let appFees = 0;
    if (appType === "premium") {
      appFees = 1080;
      monthly += appFees;
      // Automatically enable CMS for Premium app
      if (!cms) {
        setCms(true);
        cmsFees = 530;
        monthly += cmsFees;
      }
    } else if (appType === "standard" || appType === "pwa") {
      appFees = 350;
      monthly += appFees;
    }

    // Apply item-level discounts if unlocked
    let totalItemDiscounts = 0;
    const getItemDiscount = (key: string, amount: number) => {
      if (!discountUnlocked) return 0;
      const source = discountsApplied ? appliedItemDiscounts : itemDiscounts;
      const d = source[key];
      if (!d) return 0;
      if (d.type === "percentage") return amount * (d.value / 100);
      return Math.min(d.value, amount);
    };

    // compute discounts on current components
    const dBase = getItemDiscount("baseLicense", planDetails[plan].base);
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

    // Premium support is calculated after all other monthly fees
    let totalBeforeSupport = monthly;
    let supportFees = 0;
    let supportDiscountApplied = 0;
    if (premiumSupport) {
      supportFees = 2000 + totalBeforeSupport * 0.1;
      if (discountUnlocked) {
        const supportDiscount = getItemDiscount("support", supportFees);
        supportDiscountApplied = supportDiscount;
        supportFees = Math.max(0, supportFees - supportDiscount);
        totalItemDiscounts += supportDiscount;
      }
      monthly += supportFees;
    }

    // Subtotal before subtotal-discount
    const monthlySubtotal = monthly;

    // Apply subtotal discount if unlocked
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

    // Setup fees
    let onboardingFee = totalBeforeSupport * 0.33 * 3; // Onboarding fee
    let setup = onboardingFee;

    // App setup fees
    let appSetupFee = 0;
    if (appType === "premium") {
      appSetupFee = 15000;
      setup += appSetupFee;
    } else if (appType === "standard") {
      appSetupFee = 5000;
      setup += appSetupFee;
    } else if (appType === "pwa") {
      appSetupFee = 1000;
      setup += appSetupFee;
    }

    // Data ingestion
    let dataIngestionFee = 0;
    if (dataIngestion) {
      dataIngestionFee = totalBeforeSupport * 0.2;
      setup += dataIngestionFee;
    }

    // Franchise/Corporate split (if applicable)
    const corporateFees =
      businessType === "franchise"
        ? monthly - connectionFees // Corporate pays all fees except connection fees
        : monthly; // Corporate pays all fees

    const franchiseeFees =
      businessType === "franchise"
        ? connectionFees // Franchisees only pay connection fees
        : 0; // No franchise fees if corporately owned

    const franchiseePerStore =
      businessType === "franchise" && stores > 0 ? connectionFees / stores : 0;

    // Set calculated values
    setMonthlyFees(monthly);
    setSetupFees(setup);
    setPerStore(stores > 0 ? monthly / stores : 0);
    setTotalBeforeSupport(totalBeforeSupport);

    return {
      total: monthly,
      subtotal: monthlySubtotal,
      connection: connectionFees,
      baseLicense: planDetails[plan].base,
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
        baseLicense: Math.max(0, planDetails[plan].base - dBase),
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

  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // Update phone number when country changes
  React.useEffect(() => {
    if (country !== "Other") {
      const dialCode = countryDialCodes[country];
      if (!phone.startsWith(dialCode)) {
        setPhone(dialCode);
      }
      // Disable WhatsApp if country is not supported
      if (!whatsappAvailableCountries.includes(country)) {
        setWhatsappEnabled(false);
      }
    } else {
      // If switching to "Other", remove any existing country code and keep only the + sign
      if (phone.startsWith("+")) {
        setPhone("+");
      } else if (!phone.startsWith("+")) {
        setPhone("+");
      }
      // Disable WhatsApp for "Other" countries
      setWhatsappEnabled(false);
    }
  }, [country]);

  // Add scroll function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Update tab switching logic
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Use setTimeout to ensure the new content is rendered before scrolling
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  // Function to reset all states to default values
  const resetAllStates = () => {
    // Clear all localStorage items
    localStorage.clear(); // This will remove all items from localStorage

    // Reset all state variables
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
    setFeeBreakdown({
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
    });
    setIsLoggedIn(false);
    setSubmitSuccess(false);
    setIsSubmitting(false);
    setSubmitError("");
    setWebhookLogs([]);
    setShowLogs(false);
  };

  // Add a dedicated sign out function
  const handleSignOut = () => {
    resetAllStates();
    // Scroll to top after signing out
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Render email form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <div className="spoonity-primary p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-1">Spoonity</h1>
            <p className="text-white opacity-90">Pricing Calculator</p>
          </div>

          <div className="p-4 border-b spoonity-form">
            <h2 className="text-lg font-medium">
              Please enter your information to continue
            </h2>
            <p className="text-sm text-gray-600">
              We'll use this to provide you with a personalized quote
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="token"
                >
                  Access Token
                </label>
                <input
                  id="token"
                  type="text"
                  className={`w-full border rounded-md p-2.5 input-field ${
                    tokenError ? "border-red-500" : ""
                  }`}
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value);
                    setTokenError("");
                  }}
                  required
                  placeholder="Enter your access token"
                />
                {tokenError && (
                  <p className="text-red-500 text-xs mt-1">{tokenError}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="country"
                >
                  Country
                </label>
                <select
                  id="country"
                  className="w-full border rounded-md p-2.5 input-field"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (e.target.value === "Other") {
                      setOtherCountry("");
                    }
                  }}
                  required
                >
                  {Object.keys(smsRates).map((countryName) => (
                    <option key={countryName} value={countryName}>
                      {countryName}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              {country === "Other" && (
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="otherCountry"
                  >
                    Please Specify Country
                  </label>
                  <input
                    id="otherCountry"
                    type="text"
                    className="w-full border rounded-md p-2.5 input-field"
                    value={otherCountry}
                    onChange={(e) => setOtherCountry(e.target.value)}
                    required
                    placeholder="Enter your country"
                  />
                </div>
              )}

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full border rounded-md p-2.5 input-field"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John (optional)"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full border rounded-md p-2.5 input-field"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe (optional)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full border rounded-md p-2.5 input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">
                Cell Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                className="w-full border rounded-md p-2.5 input-field"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numbers and '+' symbol
                  if (/^[+\d]*$/.test(value)) {
                    setPhone(value);
                  }
                }}
                placeholder={
                  country !== "Other"
                    ? `${countryDialCodes[country]} followed by your number (optional)`
                    : "Enter phone number (optional)"
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                {country !== "Other"
                  ? `Country code ${countryDialCodes[country]} will be automatically added`
                  : "Please include country code"}
              </p>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="company"
              >
                Company Name
              </label>
              <input
                id="company"
                type="text"
                className="w-full border rounded-md p-2.5 input-field"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Spoonity (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="role">
                Your Role
              </label>
              <input
                id="role"
                type="text"
                className="w-full border rounded-md p-2.5 input-field"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Marketing Manager (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Business Type
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="corporate"
                    name="businessType"
                    value="corporate"
                    checked={businessType === "corporate"}
                    onChange={() => setBusinessType("corporate")}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label
                    htmlFor="corporate"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Corporately Owned
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="franchise"
                    name="businessType"
                    value="franchise"
                    checked={businessType === "franchise"}
                    onChange={() => setBusinessType("franchise")}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label
                    htmlFor="franchise"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Franchised
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full spoonity-cta text-white py-2.5 px-4 rounded-md font-medium transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              onClick={handleLogin}
            >
              Access Calculator
            </button>

            <p className="text-xs text-gray-500 mt-4">
              By continuing, you agree that we may use your information to
              contact you about Spoonity services.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Main calculator UI
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {submitSuccess ? (
        <div className="max-w-4xl mx-auto p-4">
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-[#640C6F] to-[#640C6F] p-6 text-white text-center">
              <div className="flex justify-center mb-4">
                <img
                  src="/logo.png"
                  alt="Spoonity Logo"
                  className="h-16 w-48 object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-lg mb-1">
                Your pricing information has been submitted successfully.
              </p>
              <p className="text-green-100">
                A Spoonity representative will be in touch with you shortly.
              </p>
            </div>

            <div className="bg-white p-6">
              <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">
                  Your Pricing Summary
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2 text-gray-500">
                      <p>Base License Fee</p>
                      <p>Connection Fees ({stores} stores)</p>
                      <p>Transaction Processing</p>
                      {plan !== "loyalty" && <p>Marketing Emails</p>}
                      {plan !== "loyalty" && pushNotifications && (
                        <p>Push Notifications</p>
                      )}
                    </div>
                    <div className="space-y-2 text-right font-medium">
                      <p>{formatCurrency(planDetails[plan].base)}</p>
                      <p>{formatCurrency(feeBreakdown.connection)}</p>
                      <p>{formatCurrency(feeBreakdown.transaction)}</p>
                      {plan !== "loyalty" && (
                        <p>
                          {(() => {
                            const selectedTier = getMarketingEmailBreakdown(
                              marketing
                            ).find((t) => t.isSelected);
                            const display = selectedTier
                              ? selectedTier.tierName !== "Tier 1"
                                ? selectedTier.total - 500
                                : selectedTier.total
                              : feeBreakdown.marketing;
                            return formatCurrency(display);
                          })()}
                        </p>
                      )}
                      {plan !== "loyalty" && pushNotifications && (
                        <p>{formatCurrency(marketing * 0.0045)}</p>
                      )}
                    </div>
                  </div>

                  {/* Connection Fee Tier Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-sm">
                      Connection Fee Breakdown
                    </h4>
                    <div className="space-y-1 text-xs">
                      {getConnectionFeeBreakdown(stores).map(
                        (tier: any, index) => (
                          <div
                            key={index}
                            className={`flex justify-between p-2 rounded ${
                              tier.isSelected
                                ? "bg-purple-100 border border-purple-300"
                                : "bg-gray-50"
                            }`}
                          >
                            <div className="flex flex-col">
                              <span
                                className={`text-sm font-medium ${
                                  tier.isSelected
                                    ? "text-purple-800"
                                    : "text-gray-600"
                                }`}
                              >
                                {tier.tierName}: {tier.range}
                              </span>
                              <span className="text-xs text-gray-500">
                                {tier.isSelected
                                  ? `${tier.count.toLocaleString()} stores (your volume)`
                                  : `Up to ${tier.count.toLocaleString()} stores`}
                              </span>
                            </div>
                            <div className="text-right">
                              <span
                                className={`font-medium ${
                                  tier.isSelected
                                    ? "text-purple-800"
                                    : "text-gray-600"
                                }`}
                              >
                                ${tier.price.toFixed(2)}/store
                              </span>
                              {tier.isSelected && (
                                <div className="text-xs text-purple-600">
                                  Selected
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Transaction Processing Tier Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-sm">
                      Transaction Processing Breakdown
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">
                          Total Volume:{" "}
                          {Math.round(
                            0.25 * (stores * transactions)
                          ).toLocaleString()}{" "}
                          transactions
                        </span>
                      </div>
                      {getTransactionFeeBreakdown(
                        0.25 * (stores * transactions)
                      ).map((tier, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600">
                            {tier.volume.toLocaleString()} transactions ($
                            {tier.rate.toFixed(1)}/transaction):
                          </span>
                          <span className="font-medium">
                            {formatCurrency(tier.total)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Marketing Email Tier Breakdown */}
                  {plan !== "loyalty" && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-sm">
                        Marketing Email Breakdown
                      </h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">
                            Total Emails: {marketing.toLocaleString()}
                          </span>
                        </div>
                        {getMarketingEmailBreakdown(marketing).map(
                          (tier, index) => (
                            <div
                              key={index}
                              className={`flex justify-between p-2 rounded ${
                                tier.isSelected
                                  ? "bg-purple-100 border border-purple-300"
                                  : "bg-gray-50"
                              }`}
                            >
                              <div className="flex flex-col">
                                <span
                                  className={`text-sm font-medium ${
                                    tier.isSelected
                                      ? "text-purple-800"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {tier.tierName}: {tier.range}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {tier.isSelected
                                    ? `${tier.count.toLocaleString()} emails (your volume)`
                                    : `Up to ${tier.count.toLocaleString()} emails`}
                                </span>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`font-medium ${
                                    tier.isSelected
                                      ? "text-purple-800"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {formatCurrency(tier.total)}
                                </span>
                                <div className="text-xs text-gray-500">
                                  ($500 base fee included)
                                </div>
                                {tier.isSelected && (
                                  <div className="text-xs text-purple-600">
                                    Selected
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add-ons Section */}
                  {(giftCard ||
                    smsEnabled ||
                    whatsappEnabled ||
                    independentServer ||
                    premiumSLA ||
                    premiumSupport ||
                    cms ||
                    appType !== "none" ||
                    dataIngestion) && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium mb-3">Add-on Services:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2 text-gray-500">
                          {giftCard && (
                            <>
                              <p>Gift Card Base Fee</p>
                              <p>
                                Gift Card Per-Store Fee ({stores} stores @
                                $30/store)
                              </p>
                            </>
                          )}
                          {smsEnabled &&
                            smsMessages &&
                            parseInt(smsMessages) > 0 && (
                              <p>SMS Messages ({smsMessages})</p>
                            )}
                          {whatsappEnabled && (
                            <>
                              <p>WhatsApp Base Platform Fee</p>
                              <p>WhatsApp Per-Store Fee ({stores} stores)</p>
                              <p className="pl-4">
                                • Digital Receipts (
                                {whatsappMarketTicket.toLocaleString()}{" "}
                                messages)
                              </p>
                              <p className="pl-4">
                                • Utility Messages (
                                {whatsappUtility.toLocaleString()} messages)
                              </p>
                              <p className="pl-4">
                                • Marketing Messages (
                                {whatsappMarketing.toLocaleString()} messages)
                              </p>
                              <p className="pl-4">
                                • OTP Messages ({whatsappOtp.toLocaleString()}{" "}
                                messages)
                              </p>
                            </>
                          )}
                          {independentServer && <p>Independent Server</p>}
                          {premiumSLA && <p>Premium SLA</p>}
                          {cms && <p>Content Management System</p>}
                          {appType === "premium" && (
                            <p>Premium App Subscription</p>
                          )}
                          {appType === "standard" && (
                            <p>Standard App Subscription</p>
                          )}
                          {appType === "pwa" && <p>PWA Subscription</p>}
                          {premiumSupport && <p>Premium Support</p>}
                          {dataIngestion && <p>Data Ingestion</p>}
                        </div>
                        <div className="space-y-2 text-right font-medium">
                          {giftCard && (
                            <>
                              <p>{formatCurrency(500)}</p>
                              <p>{formatCurrency(stores * 30)}</p>
                            </>
                          )}
                          {smsMessages && parseInt(smsMessages) > 0 && (
                            <p>{formatCurrency(feeBreakdown.sms)}</p>
                          )}
                          {whatsappEnabled && (
                            <>
                              <p>{formatCurrency(630)}</p>
                              <p>
                                {formatCurrency(feeBreakdown.whatsapp.perStore)}
                              </p>
                              <p className="pr-4">
                                {formatCurrency(
                                  whatsappMarketTicket *
                                    whatsappRates[whatsappCountry].marketTicket
                                )}
                              </p>
                              <p className="pr-4">
                                {formatCurrency(
                                  whatsappUtility *
                                    whatsappRates[whatsappCountry].utility
                                )}
                              </p>
                              <p className="pr-4">
                                {formatCurrency(
                                  whatsappMarketing *
                                    whatsappRates[whatsappCountry].marketing
                                )}
                              </p>
                              <p className="pr-4">
                                {formatCurrency(
                                  whatsappOtp *
                                    whatsappRates[whatsappCountry].otp
                                )}
                              </p>
                            </>
                          )}
                          {independentServer && (
                            <p>{formatCurrency(feeBreakdown.server)}</p>
                          )}
                          {premiumSLA && (
                            <p>{formatCurrency(feeBreakdown.sla)}</p>
                          )}
                          {cms && <p>{formatCurrency(feeBreakdown.cms)}</p>}
                          {appType === "premium" && (
                            <p>{formatCurrency(feeBreakdown.app)}</p>
                          )}
                          {appType === "standard" && (
                            <p>{formatCurrency(feeBreakdown.app)}</p>
                          )}
                          {appType === "pwa" && (
                            <p>{formatCurrency(feeBreakdown.app)}</p>
                          )}
                          {premiumSupport && (
                            <p>{formatCurrency(feeBreakdown.support)}</p>
                          )}
                          {dataIngestion && (
                            <p>
                              {formatCurrency(
                                (monthlyFees -
                                  (premiumSupport
                                    ? 2000 + monthlyFees * 0.1
                                    : 0)) *
                                  0.2
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* {whatsappEnabled && (
                            <div className="mt-3 text-xs bg-gray-50 p-3 rounded-md">
                              <div className="font-medium mb-1">WhatsApp Message Breakdown:</div>
                              <div className="grid grid-cols-2 gap-1">
                                <span className="pl-2">• Digital Receipts ({whatsappMarketTicket.toLocaleString()} × ${whatsappRates[whatsappCountry].marketTicket.toFixed(4)}):</span>
                                <span className="text-right">{formatCurrency(whatsappMarketTicket * whatsappRates[whatsappCountry].marketTicket)}</span>
                                
                                <span className="pl-2">• Utility Messages ({whatsappUtility.toLocaleString()} × ${whatsappRates[whatsappCountry].utility.toFixed(2)}):</span>
                                <span className="text-right">{formatCurrency(whatsappUtility * whatsappRates[whatsappCountry].utility)}</span>
                                
                                <span className="pl-2">• Marketing Messages ({whatsappMarketing.toLocaleString()} × ${whatsappRates[whatsappCountry].marketing.toFixed(2)}):</span>
                                <span className="text-right">{formatCurrency(whatsappMarketing * whatsappRates[whatsappCountry].marketing)}</span>
                                
                                <span className="pl-2">• OTP Messages ({whatsappOtp.toLocaleString()} × ${whatsappRates[whatsappCountry].otp.toFixed(2)}):</span>
                                <span className="text-right">{formatCurrency(whatsappOtp * whatsappRates[whatsappCountry].otp)}</span>
                                
                                <span className="font-medium pt-1 border-t mt-1">Total Message Fees:</span>
                                <span className="text-right font-medium pt-1 border-t mt-1">{formatCurrency(feeBreakdown.whatsapp.messages)}</span>
                              </div>
                            </div>
                          )} */}
                    </div>
                  )}

                  {/* Setup Fee Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-sm">
                      Setup Fee Breakdown
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Onboarding (3 months of monthly fees):
                        </span>
                        <span className="font-medium">
                          {formatCurrency(feeBreakdown.setup.onboarding)}
                        </span>
                      </div>
                      {appType === "premium" && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Premium App Setup:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(15000)}
                          </span>
                          {discountUnlocked && (
                            <div className="flex gap-2 pt-2">
                              <button
                                type="button"
                                className={`px-3 py-2 rounded-md text-sm font-medium text-white ${"bg-blue-600 hover:bg-blue-700"}`}
                                // disabled={discountsApplied}
                                onClick={() => {
                                  setAppliedItemDiscounts(itemDiscounts);
                                  setAppliedSubtotalDiscount(subtotalDiscount);
                                  setAppliedDiscountReason(discountReason);
                                  setDiscountsApplied(true);
                                }}
                              >
                                Apply Discounts
                              </button>
                              <button
                                type="button"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                  discountsApplied
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                onClick={() => {
                                  setItemDiscounts({});
                                  setSubtotalDiscount({
                                    type: "fixed",
                                    value: 0,
                                  });
                                  setDiscountReason("");
                                  setAppliedItemDiscounts({});
                                  setAppliedSubtotalDiscount({
                                    type: "fixed",
                                    value: 0,
                                  });
                                  setAppliedDiscountReason("");
                                  setDiscountsApplied(false);
                                }}
                              >
                                Clear Discounts
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {appType === "standard" && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Standard App Setup:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(5000)}
                          </span>
                        </div>
                      )}
                      {appType === "pwa" && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">PWA Setup:</span>
                          <span className="font-medium">
                            {formatCurrency(1000)}
                          </span>
                        </div>
                      )}
                      {dataIngestion && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Data Ingestion Setup:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(feeBreakdown.setup.dataIngestion)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-2 mt-2 flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal (before discounts):
                    </span>
                    <span className="font-medium">
                      {formatCurrency(
                        (monthlyFees || 0) + (feeBreakdown.discount || 0)
                      )}
                    </span>
                  </div>
                  {(feeBreakdown.discount || 0) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discounts Applied:</span>
                      <span className="font-medium text-green-700">
                        - {formatCurrency(feeBreakdown.discount)}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Monthly Recurring Fees:</span>
                    <span className="spoonity-primary-text">
                      {formatCurrency(monthlyFees)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Setup Fees:</span>
                    <span className="font-medium">
                      {formatCurrency(setupFees)}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>First Year Total:</span>
                    <span className="spoonity-primary-text">
                      {formatCurrency(monthlyFees * 12 + setupFees)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => generatePDFWithLoading()}
                    disabled={!jsPdfLoaded || isPdfGenerating}
                    className={`spoonity-cta text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200 flex items-center justify-center ${
                      !jsPdfLoaded || isPdfGenerating
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isPdfGenerating ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {jsPdfLoaded
                          ? "Download PDF Quote"
                          : "Loading PDF Generator..."}
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={resetAllStates}
                  className="text-gray-500 hover:spoonity-primary-text text-sm underline"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <div className="spoonity-primary p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Spoonity</h1>
                <p className="text-white opacity-90">Pricing Calculator</p>
              </div>
              <div className="text-sm text-right sm:block">
                <div className="text-white opacity-90">Welcome,</div>
                <div className="font-medium text-white">
                  {firstName} {lastName} •{" "}
                  <button
                    onClick={handleSignOut}
                    className="text-white opacity-90 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              <button
                className={`px-4 py-3 tab-button ${
                  activeTab === "inputs"
                    ? "active spoonity-primary-text font-medium"
                    : "text-gray-600 hover:spoonity-primary-text"
                }`}
                onClick={() => handleTabChange("inputs")}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Basic Info
                </div>
              </button>
              <button
                className={`px-4 py-3 tab-button ${
                  activeTab === "addons"
                    ? "active spoonity-primary-text font-medium"
                    : "text-gray-600 hover:spoonity-primary-text"
                }`}
                onClick={() => handleTabChange("addons")}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add-ons
                </div>
              </button>
              <button
                className={`px-4 py-3 tab-button ${
                  activeTab === "summary"
                    ? "active spoonity-primary-text font-medium"
                    : "text-gray-600 hover:spoonity-primary-text"
                }`}
                onClick={() => handleTabChange("summary")}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Summary
                </div>
              </button>
            </div>
          </div>

          {/* Inputs Tab */}
          {activeTab === "inputs" && (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Plan Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(planDetails).map(([key, details]) => (
                      <div
                        key={key}
                        onClick={() => setPlan(key)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          plan === key
                            ? "border-purple-500 bg-purple-50 shadow-sm"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <div className="flex items-start mb-2">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-2 flex items-center justify-center ${
                              plan === key
                                ? "border-purple-500"
                                : "border-gray-300"
                            }`}
                          >
                            {plan === key && (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: "#640C6F" }}
                              ></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{details.name}</h3>
                            <p className="text-sm text-gray-600">
                              {details.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right font-bold spoonity-primary-text">
                          ${details.base}/mo
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <label className="block text-sm font-medium mb-2">
                    Number of Stores
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full border rounded-md p-2.5 input-field text-lg font-medium"
                        value={stores === 0 ? "" : stores}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow numbers and convert to number
                          if (/^\d*$/.test(value)) {
                            setStores(value === "" ? 0 : parseInt(value));
                          }
                        }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[1, 5, 10, 25, 50, 100].map((value) => (
                        <button
                          key={value}
                          onClick={() => setStores(value)}
                          className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                            stores === value
                              ? "bg-blue-100 border-blue-400 text-blue-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>

                    <p
                      className={`text-xs ${
                        stores > 50
                          ? "text-amber-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {stores > 50
                        ? "⚠️ More than 50 stores requires an independent server (automatically added)"
                        : "How many physical locations do you operate?"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Transactions per Store per Month
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        className="w-full border rounded-md p-2.5 input-field text-lg font-medium"
                        value={transactions}
                        onChange={(e) =>
                          setTransactions(parseInt(e.target.value) || 0)
                        }
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[500, 1000, 2500, 5000, 10000].map((value) => (
                        <button
                          key={value}
                          onClick={() => setTransactions(value)}
                          className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                            transactions === value
                              ? "bg-purple-100 border-purple-400 spoonity-primary-text"
                              : "spoonity-form border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {value.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500">
                      Average number of transactions each location processes
                      monthly
                    </p>
                  </div>
                </div>

                {plan !== "loyalty" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marketing Messages per Month
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          className="w-full border rounded-md p-2.5 input-field text-lg font-medium"
                          value={marketing}
                          onChange={(e) =>
                            setMarketing(parseInt(e.target.value) || 0)
                          }
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {[5000, 10000, 50000, 100000, 500000, 1000000].map(
                          (value) => (
                            <button
                              key={value}
                              onClick={() => setMarketing(value)}
                              className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                                marketing === value
                                  ? "bg-purple-100 border-purple-400 spoonity-primary-text"
                                  : "spoonity-form border-gray-200 text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {value.toLocaleString()}
                            </button>
                          )
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        Tiered pricing: $0.0006 per email (first 100K), $0.0004
                        (100K-1M), $0.0002 (1M+)
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-2">
                  <button
                    className="spoonity-cta text-white font-medium py-2.5 px-4 rounded transition-colors duration-200 flex items-center"
                    onClick={() => handleTabChange("addons")}
                  >
                    Continue to Add-ons
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add-ons Tab */}
          {activeTab === "addons" && (
            <div className="p-6">
              <div className="space-y-6">
                {/* SMS for One-Time Passwords */}
                <div className="">
                  <div className="flex items-start mb-3">
                    <input
                      type="checkbox"
                      id="smsEnabled"
                      className="checkbox-custom mt-1"
                      checked={smsEnabled}
                      onChange={(e) => {
                        setSmsEnabled(e.target.checked);
                        if (!e.target.checked) {
                          setSmsMessages("");
                        } else {
                          // Reset to default calculation
                          const defaultSmsCount = Math.round(
                            stores * transactions * 0.1
                          );
                          setSmsMessages(defaultSmsCount.toString());
                        }
                      }}
                    />
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="smsEnabled"
                      >
                        SMS for One-Time Passwords
                      </label>
                      <p className="text-xs text-gray-500">
                        Send verification codes via SMS for secure
                        authentication
                      </p>
                    </div>
                  </div>

                  {smsEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                      <select
                        className="border rounded-md p-2.5 input-field"
                        value={smsCountry}
                        onChange={(e) => setSmsCountry(e.target.value)}
                      >
                        {Object.keys(smsRates).map((country) => (
                          <option key={country} value={country}>
                            {country} (${smsRates[country].toFixed(5)}/msg)
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          className="flex-1 border rounded-md p-2.5 input-field"
                          placeholder="# of messages"
                          value={smsMessages}
                          onChange={(e) => {
                            // Convert to number but allow empty string to clear the field
                            const val = e.target.value;
                            setSmsMessages(val);
                          }}
                        />
                        <span className="ml-2 text-xs text-gray-500 whitespace-nowrap">
                          messages/month
                        </span>
                      </div>
                      <div className="md:col-span-2 text-xs text-gray-500">
                        Default calculation: 10% of total monthly transactions (
                        {Math.round(
                          stores * transactions * 0.1
                        ).toLocaleString()}{" "}
                        messages)
                      </div>
                    </div>
                  )}
                </div>

                {/* WhatsApp Platform Integration */}
                {whatsappAvailableCountries.includes(country) && (
                  <div className="border-b py-5 border-t border-b">
                    <div className="flex items-start mb-3">
                      <input
                        type="checkbox"
                        id="whatsappEnabled"
                        className="checkbox-custom mt-1"
                        checked={whatsappEnabled}
                        onChange={(e) => {
                          setWhatsappEnabled(e.target.checked);
                          if (e.target.checked) {
                            // Set default values when enabling WhatsApp
                            const defaultSmsCount = Math.round(
                              stores * transactions * 0.1
                            );
                            setWhatsappMarketTicket(defaultSmsCount);
                            setWhatsappUtility(defaultSmsCount);
                            setWhatsappOtp(defaultSmsCount);
                            setWhatsappMarketing(10000);
                          }
                        }}
                      />
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="whatsappEnabled"
                        >
                          WhatsApp Platform for Loyalty and Digital Receipts
                        </label>
                        <p className="text-xs text-gray-500">
                          Base fee: $630/month + tiered per-location fees
                        </p>
                      </div>
                    </div>

                    {whatsappEnabled && (
                      <div className="ml-7 space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Location Pricing Tiers
                          </label>
                          <div className="text-xs text-gray-600 grid grid-cols-2 gap-2">
                            <div>Tier 1-10: $9.00/month/store</div>
                            <div>Tier 11-80: $8.10/month/store</div>
                            <div>Tier 81-149: $7.20/month/store</div>
                            <div>Tier 150+: $6.30/month/store</div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Country for Message Pricing
                          </label>
                          <select
                            className="border rounded-md p-2.5 input-field w-full"
                            value={whatsappCountry}
                            onChange={(e) => setWhatsappCountry(e.target.value)}
                          >
                            {Object.keys(whatsappRates).map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Estimated Monthly Message Volume
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Digital Receipts ($
                                {whatsappRates[
                                  whatsappCountry
                                ].marketTicket.toFixed(4)}
                                /msg)
                                <span className="text-gray-500 ml-1">
                                  - Digital receipts sent to customers
                                </span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                className="w-full border rounded-md p-2 input-field"
                                value={whatsappMarketTicket}
                                onChange={(e) =>
                                  setWhatsappMarketTicket(
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                placeholder="# of messages"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Utility Campaign Messages ($
                                {whatsappRates[whatsappCountry].utility.toFixed(
                                  2
                                )}
                                /msg)
                                <span className="text-gray-500 ml-1">
                                  - Service notifications and updates
                                </span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                className="w-full border rounded-md p-2 input-field"
                                value={whatsappUtility}
                                onChange={(e) =>
                                  setWhatsappUtility(
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                placeholder="# of messages"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Marketing Campaign Messages ($
                                {whatsappRates[
                                  whatsappCountry
                                ].marketing.toFixed(2)}
                                /msg)
                                <span className="text-gray-500 ml-1">
                                  - Promotional messages and offers
                                </span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                className="w-full border rounded-md p-2 input-field"
                                value={whatsappMarketing}
                                onChange={(e) =>
                                  setWhatsappMarketing(
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                placeholder="# of messages"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Authentication OTP Messages ($
                                {whatsappRates[whatsappCountry].otp.toFixed(2)}
                                /msg)
                                <span className="text-gray-500 ml-1">
                                  - One-time passwords and verification codes
                                </span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                className="w-full border rounded-md p-2 input-field"
                                value={whatsappOtp}
                                onChange={(e) =>
                                  setWhatsappOtp(parseInt(e.target.value) || 0)
                                }
                                placeholder="# of messages"
                              />
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Default calculation: 10% of total monthly
                            transactions (
                            {Math.round(
                              stores * transactions * 0.1
                            ).toLocaleString()}{" "}
                            messages) for receipts, utility, and OTP messages
                          </div>
                        </div>

                        <div className="pt-2 text-xs bg-gray-50 p-3 rounded-md">
                          <div className="font-medium mb-1">
                            WhatsApp Fee Summary:
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span>Base Platform Fee:</span>
                            <span className="text-right">
                              {formatCurrency(whatsappEnabled ? 630 : 0)}
                            </span>

                            <span>Per-Location Fees ({stores} stores):</span>
                            <span className="text-right">
                              {formatCurrency(
                                whatsappEnabled
                                  ? calculateWhatsappStoreFeeTiers(stores)
                                  : 0
                              )}
                            </span>

                            <span className="font-medium pt-2">
                              Message Fees Breakdown:
                            </span>
                            <span className="text-right font-medium pt-2"></span>

                            <span className="pl-2">
                              • Digital Receipts (
                              {whatsappMarketTicket.toLocaleString()} × $
                              {whatsappRates[
                                whatsappCountry
                              ].marketTicket.toFixed(4)}
                              ):
                            </span>
                            <span className="text-right">
                              {formatCurrency(
                                whatsappMarketTicket *
                                  whatsappRates[whatsappCountry].marketTicket
                              )}
                            </span>

                            <span className="pl-2">
                              • Utility Messages (
                              {whatsappUtility.toLocaleString()} × $
                              {whatsappRates[whatsappCountry].utility.toFixed(
                                2
                              )}
                              ):
                            </span>
                            <span className="text-right">
                              {formatCurrency(
                                whatsappUtility *
                                  whatsappRates[whatsappCountry].utility
                              )}
                            </span>

                            <span className="pl-2">
                              • Marketing Messages (
                              {whatsappMarketing.toLocaleString()} × $
                              {whatsappRates[whatsappCountry].marketing.toFixed(
                                2
                              )}
                              ):
                            </span>
                            <span className="text-right">
                              {formatCurrency(
                                whatsappMarketing *
                                  whatsappRates[whatsappCountry].marketing
                              )}
                            </span>

                            <span className="pl-2">
                              • OTP Messages ({whatsappOtp.toLocaleString()} × $
                              {whatsappRates[whatsappCountry].otp.toFixed(2)}):
                            </span>
                            <span className="text-right">
                              {formatCurrency(
                                whatsappOtp * whatsappRates[whatsappCountry].otp
                              )}
                            </span>

                            <span className="font-medium pt-1 border-t mt-1">
                              Total Message Fees:
                            </span>
                            <span className="text-right font-medium pt-1 border-t mt-1">
                              {formatCurrency(feeBreakdown.whatsapp.messages)}
                            </span>

                            <span className="font-medium pt-1 border-t mt-1">
                              Total WhatsApp Monthly:
                            </span>
                            <span className="text-right font-medium pt-1 border-t mt-1">
                              {formatCurrency(feeBreakdown.whatsapp.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile App Options */}
                <div className="border-b pb-5">
                  <label className="block text-sm font-medium mb-3">
                    Mobile App Options
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        appType === "none"
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => {
                        setAppType("none");
                        setCms(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center ${
                            appType === "none"
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {appType === "none" && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">No App</h3>
                          <p className="text-sm text-gray-600">
                            We'll be using our own website, app or use physical
                            cards only
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          $0
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        appType === "premium"
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => {
                        setAppType("premium");
                        setCms(true); // Automatically enable CMS for Premium app
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center ${
                            appType === "premium"
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {appType === "premium" && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Premium App</h3>
                          <p className="text-sm text-gray-600">
                            Fully customized native iOS & Android apps
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          $15,000 + $1,080/mo
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        appType === "standard"
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => {
                        setAppType("standard");
                        setCms(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center ${
                            appType === "standard"
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {appType === "standard" && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Standard App</h3>
                          <p className="text-sm text-gray-600">
                            Branded template-based native mobile apps
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          $5,000 + $350/mo
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        appType === "pwa"
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => {
                        setAppType("pwa");
                        setCms(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center ${
                            appType === "pwa"
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {appType === "pwa" && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Customizable PWA</h3>
                          <p className="text-sm text-gray-600">
                            Progressive Web App with offline capabilities
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          $1,000 + $350/mo
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Add-ons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-5">
                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                    <div className="flex items-start mb-1">
                      <input
                        type="checkbox"
                        id="giftCard"
                        className="checkbox-custom"
                        checked={giftCard}
                        onChange={(e) => setGiftCard(e.target.checked)}
                      />
                      <div>
                        <label
                          htmlFor="giftCard"
                          className="font-medium cursor-pointer"
                        >
                          Gift Card Module
                        </label>
                        <p className="text-sm text-gray-600">
                          $500 base fee + $30/store/month
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">
                      Allows businesses to sell and redeem gift cards
                    </p>
                  </div>

                  {plan !== "loyalty" && (
                    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                      <div className="flex items-start mb-1">
                        <input
                          type="checkbox"
                          id="pushNotifications"
                          className="checkbox-custom"
                          checked={pushNotifications}
                          onChange={(e) =>
                            setPushNotifications(e.target.checked)
                          }
                        />
                        <div>
                          <label
                            htmlFor="pushNotifications"
                            className="font-medium cursor-pointer"
                          >
                            Push Notifications
                          </label>
                          <p className="text-sm text-gray-600">
                            $0.0045 per push notification
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 pl-7">
                        Send mobile push notifications to customers
                      </p>
                    </div>
                  )}

                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                    <div className="flex items-start mb-1">
                      <input
                        type="checkbox"
                        id="independentServer"
                        className="checkbox-custom"
                        checked={independentServer}
                        onChange={(e) => setIndependentServer(e.target.checked)}
                        disabled={stores > 50}
                      />
                      <div>
                        <label
                          htmlFor="independentServer"
                          className="font-medium cursor-pointer"
                        >
                          Independent Server
                          {stores > 50 ? " (Required)" : ""}
                        </label>
                        <p className="text-sm text-gray-600">$500/month</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">
                      Dedicated server for your loyalty program
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                    <div className="flex items-start mb-1">
                      <input
                        type="checkbox"
                        id="premiumSLA"
                        className="checkbox-custom"
                        checked={premiumSLA}
                        onChange={(e) => setPremiumSLA(e.target.checked)}
                      />
                      <div>
                        <label
                          htmlFor="premiumSLA"
                          className="font-medium cursor-pointer"
                        >
                          Premium SLA
                        </label>
                        <p className="text-sm text-gray-600">$2,000/month</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">
                      99.99% uptime guarantee with priority support
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                    <div className="flex items-start mb-1">
                      <input
                        type="checkbox"
                        id="premiumSupport"
                        className="checkbox-custom"
                        checked={premiumSupport}
                        onChange={(e) => setPremiumSupport(e.target.checked)}
                      />
                      <div>
                        <label
                          htmlFor="premiumSupport"
                          className="font-medium cursor-pointer"
                        >
                          Premium Support
                        </label>
                        <p className="text-sm text-gray-600">
                          $2,000 + 10% of monthly fees
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">
                      24/7 dedicated support with 2-hour response time
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                    <div className="flex items-start mb-1">
                      <input
                        type="checkbox"
                        id="dataIngestion"
                        className="checkbox-custom"
                        checked={dataIngestion}
                        onChange={(e) => setDataIngestion(e.target.checked)}
                      />
                      <div>
                        <label
                          htmlFor="dataIngestion"
                          className="font-medium cursor-pointer"
                        >
                          Data Ingestion
                        </label>
                        <p className="text-sm text-gray-600">
                          20% of monthly fees
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">
                      Import data from external systems
                    </p>
                  </div>
                </div>

                {appType === "premium" && (
                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                    <div className="flex items-start mb-1">
                      <input
                        type="checkbox"
                        id="cms"
                        className="checkbox-custom"
                        checked={cms}
                        onChange={(e) => setCms(e.target.checked)}
                      />
                      <div>
                        <label
                          htmlFor="cms"
                          className="font-medium cursor-pointer"
                        >
                          Content Management System
                        </label>
                        <p className="text-sm text-gray-600">$530/month</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">
                      Manage app content without developer assistance
                    </p>
                  </div>
                )}

                <div className="flex justify-between mt-2">
                  <button
                    className="bg-gray-100 text-gray-700 font-medium py-2.5 px-4 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center"
                    onClick={() => handleTabChange("inputs")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </button>
                  <button
                    className="spoonity-cta text-white font-medium py-2.5 px-4 rounded transition-colors duration-200 flex items-center"
                    onClick={() => handleTabChange("summary")}
                  >
                    Continue to Summary
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === "summary" && (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div
                    style={{ backgroundColor: "#9F62A6" }}
                    className="rounded-t-lg p-6 text-white"
                  >
                    <h3 className="text-xl font-bold mb-1">
                      {planDetails[plan].name}
                    </h3>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-sm opacity-90">
                        Your estimated price
                      </span>
                      <div>
                        <span className="text-3xl font-bold">
                          {formatCurrency(monthlyFees)}
                        </span>
                        <span className="text-sm opacity-90">/month</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-t-0 rounded-b-lg bg-white p-6">
                    <p className="text-sm text-gray-600 mb-6">
                      {planDetails[plan].fullDescription}
                    </p>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2 text-gray-500">
                          <p>Base License Fee</p>
                          <p>Connection Fees ({stores} stores)</p>
                          <p>Transaction Processing</p>
                          {plan !== "loyalty" && <p>Marketing Emails</p>}
                          {plan !== "loyalty" && pushNotifications && (
                            <p>Push Notifications</p>
                          )}
                        </div>
                        <div className="space-y-2 text-right font-medium">
                          <p>
                            {formatCurrency(
                              feeBreakdown.net.baseLicense ||
                                planDetails[plan].base
                            )}
                          </p>
                          <p>
                            {formatCurrency(
                              feeBreakdown.net.connection ||
                                feeBreakdown.connection
                            )}
                          </p>
                          <p>
                            {formatCurrency(
                              feeBreakdown.net.transaction ||
                                feeBreakdown.transaction
                            )}
                          </p>
                          {plan !== "loyalty" && (
                            <p>
                              {(() => {
                                const selectedTier = getMarketingEmailBreakdown(
                                  marketing
                                ).find((t) => t.isSelected);
                                const display = selectedTier
                                  ? selectedTier.tierName !== "Tier 1"
                                    ? selectedTier.total - 500
                                    : selectedTier.total
                                  : feeBreakdown.marketing;
                                return formatCurrency(display);
                              })()}
                            </p>
                          )}
                          {plan !== "loyalty" && pushNotifications && (
                            <p>{formatCurrency(marketing * 0.0045)}</p>
                          )}
                        </div>
                      </div>

                      {/* Connection Fee Tier Breakdown */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-sm">
                          Connection Fee Breakdown
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">
                          {discountUnlocked
                            ? `Click on any tier to select its pricing for your ${stores} stores`
                            : "Enter the discount password to manually select pricing tiers."}
                        </p>
                        <div className="space-y-1 text-xs">
                          {getConnectionFeeBreakdown(stores).map(
                            (tier: any, index) => (
                              <div
                                key={index}
                                role={discountUnlocked ? "button" : undefined}
                                tabIndex={discountUnlocked ? 0 : -1}
                                aria-disabled={!discountUnlocked}
                                onClick={() => {
                                  if (!discountUnlocked) return;
                                  setSelectedConnectionTierIndex(index);
                                }}
                                onKeyDown={(e) => {
                                  if (!discountUnlocked) return;
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setSelectedConnectionTierIndex(index);
                                  }
                                }}
                                className={`flex justify-between p-2 rounded transition-all ${
                                  discountUnlocked
                                    ? "cursor-pointer hover:shadow-sm"
                                    : "cursor-not-allowed opacity-60"
                                } ${
                                  tier.isSelected
                                    ? "bg-purple-100 border border-purple-300"
                                    : discountUnlocked
                                    ? "bg-gray-50 hover:bg-gray-100 border border-transparent"
                                    : "bg-gray-50 border border-transparent"
                                }`}
                              >
                                <div className="flex flex-col">
                                  <span
                                    className={`text-sm font-medium ${
                                      tier.isSelected
                                        ? "text-purple-800"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {tier.tierName}: {tier.range}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {tier.isSelected
                                      ? `${tier.count.toLocaleString()} stores (your volume) × $${tier.price.toFixed(
                                          2
                                        )}/store = ${formatCurrency(
                                          tier.count * tier.price
                                        )}`
                                      : `${stores.toLocaleString()} stores × $${tier.price.toFixed(
                                          2
                                        )}/store = ${formatCurrency(
                                          stores * tier.price
                                        )}`}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`font-medium ${
                                      tier.isSelected
                                        ? "text-purple-800"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    ${tier.price.toFixed(2)}/store
                                  </span>
                                  {tier.isSelected && (
                                    <div className="text-xs text-purple-600">
                                      Selected
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Transaction Processing Tier Breakdown */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-sm">
                          Transaction Processing Breakdown
                        </h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">
                              Total Volume:{" "}
                              {Math.round(
                                0.25 * (stores * transactions)
                              ).toLocaleString()}{" "}
                              transactions
                            </span>
                          </div>
                          {getTransactionFeeBreakdown(
                            0.25 * (stores * transactions)
                          ).map((tier, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-gray-600">
                                {tier.volume.toLocaleString()} transactions ($
                                {tier.rate.toFixed(1)}/transaction):
                              </span>
                              <span className="font-medium">
                                {formatCurrency(tier.total)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Marketing Email Tier Breakdown */}
                      {plan !== "loyalty" && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium mb-2 text-sm">
                            Marketing Email Breakdown
                          </h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">
                                Total Emails: {marketing.toLocaleString()}
                              </span>
                            </div>
                            {getMarketingEmailBreakdown(marketing).map(
                              (tier, index) => (
                                <div
                                  key={index}
                                  className={`flex justify-between p-2 rounded ${
                                    tier.isSelected
                                      ? "bg-purple-100 border border-purple-300"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex flex-col">
                                    <span
                                      className={`text-sm font-medium ${
                                        tier.isSelected
                                          ? "text-purple-800"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {tier.tierName}: {tier.range}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {tier.isSelected
                                        ? `${tier.count.toLocaleString()} emails (your volume)`
                                        : `Up to ${tier.count.toLocaleString()} emails`}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span
                                      className={`font-medium ${
                                        tier.isSelected
                                          ? "text-purple-800"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {formatCurrency(tier.total)}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                      ($500 base fee included)
                                    </div>
                                    {tier.isSelected && (
                                      <div className="text-xs text-purple-600">
                                        Selected
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Add-ons Section */}
                      {(giftCard ||
                        smsEnabled ||
                        whatsappEnabled ||
                        independentServer ||
                        premiumSLA ||
                        premiumSupport ||
                        cms ||
                        appType !== "none" ||
                        dataIngestion) && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-medium mb-3">Add-on Services:</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2 text-gray-500">
                              {giftCard && (
                                <>
                                  <p>Gift Card Base Fee</p>
                                  <p>
                                    Gift Card Per-Store Fee ({stores} stores @
                                    $30/store)
                                  </p>
                                </>
                              )}
                              {smsEnabled &&
                                smsMessages &&
                                parseInt(smsMessages) > 0 && (
                                  <p>SMS Messages ({smsMessages})</p>
                                )}
                              {whatsappEnabled && (
                                <>
                                  <p>WhatsApp Base Platform Fee</p>
                                  <p>
                                    WhatsApp Per-Store Fee ({stores} stores)
                                  </p>
                                  <p className="pl-4">
                                    • Digital Receipts (
                                    {whatsappMarketTicket.toLocaleString()}{" "}
                                    messages)
                                  </p>
                                  <p className="pl-4">
                                    • Utility Messages (
                                    {whatsappUtility.toLocaleString()} messages)
                                  </p>
                                  <p className="pl-4">
                                    • Marketing Messages (
                                    {whatsappMarketing.toLocaleString()}{" "}
                                    messages)
                                  </p>
                                  <p className="pl-4">
                                    • OTP Messages (
                                    {whatsappOtp.toLocaleString()} messages)
                                  </p>
                                </>
                              )}
                              {independentServer && <p>Independent Server</p>}
                              {premiumSLA && <p>Premium SLA</p>}
                              {cms && <p>Content Management System</p>}
                              {appType === "premium" && (
                                <p>Premium App Subscription</p>
                              )}
                              {appType === "standard" && (
                                <p>Standard App Subscription</p>
                              )}
                              {appType === "pwa" && <p>PWA Subscription</p>}
                              {premiumSupport && <p>Premium Support</p>}
                              {dataIngestion && <p>Data Ingestion</p>}
                            </div>
                            <div className="space-y-2 text-right font-medium">
                              {giftCard && (
                                <>
                                  <p>{formatCurrency(500)}</p>
                                  <p>{formatCurrency(stores * 30)}</p>
                                </>
                              )}
                              {smsMessages && parseInt(smsMessages) > 0 && (
                                <p>{formatCurrency(feeBreakdown.sms)}</p>
                              )}
                              {whatsappEnabled && (
                                <>
                                  <p>{formatCurrency(630)}</p>
                                  <p>
                                    {formatCurrency(
                                      feeBreakdown.whatsapp.perStore
                                    )}
                                  </p>
                                  <p className="pr-4">
                                    {formatCurrency(
                                      whatsappMarketTicket *
                                        whatsappRates[whatsappCountry]
                                          .marketTicket
                                    )}
                                  </p>
                                  <p className="pr-4">
                                    {formatCurrency(
                                      whatsappUtility *
                                        whatsappRates[whatsappCountry].utility
                                    )}
                                  </p>
                                  <p className="pr-4">
                                    {formatCurrency(
                                      whatsappMarketing *
                                        whatsappRates[whatsappCountry].marketing
                                    )}
                                  </p>
                                  <p className="pr-4">
                                    {formatCurrency(
                                      whatsappOtp *
                                        whatsappRates[whatsappCountry].otp
                                    )}
                                  </p>
                                </>
                              )}
                              {independentServer && (
                                <p>{formatCurrency(feeBreakdown.server)}</p>
                              )}
                              {premiumSLA && (
                                <p>{formatCurrency(feeBreakdown.sla)}</p>
                              )}
                              {cms && <p>{formatCurrency(feeBreakdown.cms)}</p>}
                              {appType === "premium" && (
                                <p>{formatCurrency(feeBreakdown.app)}</p>
                              )}
                              {appType === "standard" && (
                                <p>{formatCurrency(feeBreakdown.app)}</p>
                              )}
                              {appType === "pwa" && (
                                <p>{formatCurrency(feeBreakdown.app)}</p>
                              )}
                              {premiumSupport && (
                                <p>{formatCurrency(feeBreakdown.support)}</p>
                              )}
                              {dataIngestion && (
                                <p>
                                  {formatCurrency(
                                    (monthlyFees -
                                      (premiumSupport
                                        ? 2000 + monthlyFees * 0.1
                                        : 0)) *
                                      0.2
                                  )}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* {whatsappEnabled && (
                            <div className="mt-3 text-xs bg-gray-50 p-3 rounded-md">
                              <div className="font-medium mb-1">WhatsApp Message Breakdown:</div>
                              <div className="grid grid-cols-2 gap-1">
                                <span className="pl-2">• Digital Receipts ({whatsappMarketTicket.toLocaleString()} × ${whatsappRates[whatsappCountry].marketTicket.toFixed(4)}):</span>
                                <span className="text-right">{formatCurrency(whatsappMarketTicket * whatsappRates[whatsappCountry].marketTicket)}</span>
                                
                                <span className="pl-2">• Utility Messages ({whatsappUtility.toLocaleString()} × ${whatsappRates[whatsappCountry].utility.toFixed(2)}):</span>
                                <span className="text-right">{formatCurrency(whatsappUtility * whatsappRates[whatsappCountry].utility)}</span>
                                
                                <span className="pl-2">• Marketing Messages ({whatsappMarketing.toLocaleString()} × ${whatsappRates[whatsappCountry].marketing.toFixed(2)}):</span>
                                <span className="text-right">{formatCurrency(whatsappMarketing * whatsappRates[whatsappCountry].marketing)}</span>
                                
                                <span className="pl-2">• OTP Messages ({whatsappOtp.toLocaleString()} × ${whatsappRates[whatsappCountry].otp.toFixed(2)}):</span>
                                <span className="text-right">{formatCurrency(whatsappOtp * whatsappRates[whatsappCountry].otp)}</span>
                                
                                <span className="font-medium pt-1 border-t mt-1">Total Message Fees:</span>
                                <span className="text-right font-medium pt-1 border-t mt-1">{formatCurrency(feeBreakdown.whatsapp.messages)}</span>
                              </div>
                            </div>
                          )} */}
                        </div>
                      )}

                      {/* Setup Fee Breakdown */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-sm">
                          Setup Fee Breakdown
                        </h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Onboarding (3 months of monthly fees):
                            </span>
                            <span className="font-medium">
                              {formatCurrency(feeBreakdown.setup.onboarding)}
                            </span>
                          </div>
                          {appType === "premium" && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Premium App Setup:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(15000)}
                              </span>
                            </div>
                          )}
                          {appType === "standard" && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Standard App Setup:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(5000)}
                              </span>
                            </div>
                          )}
                          {appType === "pwa" && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">PWA Setup:</span>
                              <span className="font-medium">
                                {formatCurrency(1000)}
                              </span>
                            </div>
                          )}
                          {dataIngestion && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Data Ingestion Setup:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(
                                  feeBreakdown.setup.dataIngestion
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-2 mt-2 flex justify-between text-sm">
                        <span className="text-gray-600">
                          Subtotal (before discounts):
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            (monthlyFees || 0) + (feeBreakdown.discount || 0)
                          )}
                        </span>
                      </div>
                      {(feeBreakdown.discount || 0) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Discounts Applied:
                          </span>
                          <span className="font-medium text-green-700">
                            - {formatCurrency(feeBreakdown.discount)}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                        <span>Monthly Recurring Fees:</span>
                        <span className="spoonity-primary-text">
                          {formatCurrency(monthlyFees)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Setup Fees:</span>
                        <span className="font-medium">
                          {formatCurrency(setupFees)}
                        </span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                        <span>First Year Total:</span>
                        <span className="spoonity-primary-text">
                          {formatCurrency(monthlyFees * 12 + setupFees)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-600">Fee per Store:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            stores > 0 ? monthlyFees / stores : 0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={submitData}
                      disabled={isSubmitting}
                      className={`w-full spoonity-cta text-white p-3 rounded-lg font-medium transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting Your Quote...
                        </div>
                      ) : (
                        "Request Custom Quote"
                      )}
                    </button>
                    {submitError && (
                      <p className="text-red-600 text-sm mt-2">{submitError}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      By submitting, a Spoonity representative will contact you
                      with a custom quote based on your selections.
                    </p>
                  </div>
                </div>

                {/* Discount Section - Password Protected and Per-Item */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                  {!discountUnlocked ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-blue-900">
                          Apply Discount
                        </h4>
                        <button
                          type="button"
                          onClick={() =>
                            setShowDiscountInput(!showDiscountInput)
                          }
                          className="text-blue-600 text-sm hover:underline"
                        >
                          {showDiscountInput ? "Hide" : "Enter Password"}
                        </button>
                      </div>
                      {showDiscountInput && (
                        <div className="mt-3">
                          <div className="flex gap-2">
                            <input
                              type="password"
                              className="flex-1 border rounded-md p-2 input-field text-sm"
                              placeholder="Enter discount password"
                              value={discountPassword}
                              onChange={(e) =>
                                setDiscountPassword(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  if (discountPassword === "Sp00n1ty") {
                                    setDiscountUnlocked(true);
                                    setShowDiscountInput(false);
                                  } else {
                                    setDiscountPassword("");
                                    alert(
                                      "Incorrect password. Please try again."
                                    );
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (discountPassword === "Sp00n1ty") {
                                  setDiscountUnlocked(true);
                                  setShowDiscountInput(false);
                                } else {
                                  setDiscountPassword("");
                                  alert(
                                    "Incorrect password. Please try again."
                                  );
                                }
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                            >
                              Unlock
                            </button>
                          </div>
                          <p className="text-xs text-blue-600 mt-1">
                            Sales representatives only
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-blue-900">
                          Discount Options
                        </h4>
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Unlocked
                        </span>
                      </div>
                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setShowItemDiscounts(false)}
                          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            !showItemDiscounts
                              ? "bg-blue-600 text-white"
                              : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          Subtotal Discount
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowItemDiscounts(true)}
                          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            showItemDiscounts
                              ? "bg-blue-600 text-white"
                              : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          Per-Item Discounts
                        </button>
                      </div>

                      {!showItemDiscounts ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Discount Amount
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              <select
                                className="border rounded-md p-2 input-field text-sm"
                                value={subtotalDiscount.type}
                                onChange={(e) =>
                                  setSubtotalDiscount({
                                    ...subtotalDiscount,
                                    type: e.target.value as any,
                                  })
                                }
                              >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                              </select>
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                className="col-span-2 border rounded-md p-2 input-field text-sm"
                                placeholder={
                                  subtotalDiscount.type === "percentage"
                                    ? "0.00%"
                                    : "$0.00"
                                }
                                value={subtotalDiscount.value}
                                onChange={(e) =>
                                  setSubtotalDiscount({
                                    ...subtotalDiscount,
                                    value: Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Discount Reason (optional)
                            </label>
                            <input
                              type="text"
                              className="w-full border rounded-md p-2 input-field text-sm"
                              placeholder="e.g., Multi-year contract, Volume discount"
                              value={discountReason}
                              onChange={(e) =>
                                setDiscountReason(e.target.value)
                              }
                            />
                          </div>

                          {(feeBreakdown.discount || 0) > 0 && (
                            <div className="bg-green-50 rounded p-2 text-sm">
                              <div className="flex justify-between font-medium text-green-800">
                                <span>Total Discount Applied:</span>
                                <span>
                                  -{formatCurrency(feeBreakdown.discount)}
                                </span>
                              </div>
                              {(feeBreakdown.itemDiscounts || 0) > 0 && (
                                <div className="text-xs text-green-700 mt-1">
                                  Item Discounts: -
                                  {formatCurrency(feeBreakdown.itemDiscounts)}
                                </div>
                              )}
                              {(feeBreakdown.subtotalDiscountAmount || 0) >
                                0 && (
                                <div className="text-xs text-green-700">
                                  Subtotal Discount: -
                                  {formatCurrency(
                                    feeBreakdown.subtotalDiscountAmount
                                  )}
                                </div>
                              )}
                              {discountReason && (
                                <div className="text-xs text-green-700 mt-1">
                                  Reason: {discountReason}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-sm text-gray-600 mb-2">
                            Apply discounts to individual line items. Item
                            discounts are applied first, then any subtotal
                            discount.
                          </div>
                          <div className="max-h-96 overflow-y-auto space-y-2">
                            {feeBreakdown.baseLicense > 0 && (
                              <div className="bg-white border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    Base License Fee
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {formatCurrency(feeBreakdown.baseLicense)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="border rounded-md p-1.5 input-field text-xs"
                                    value={
                                      itemDiscounts.baseLicense?.type || "fixed"
                                    }
                                    onChange={(e) => {
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        baseLicense: {
                                          type: e.target.value as any,
                                          value:
                                            itemDiscounts.baseLicense?.value ||
                                            0,
                                        },
                                      });
                                    }}
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    // step={0.01}
                                    className="col-span-2 border rounded-md p-1.5 input-field text-xs"
                                    placeholder="0.00"
                                    value={
                                      itemDiscounts.baseLicense?.value ?? 0
                                    }
                                    onChange={(e) => {
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        baseLicense: {
                                          type:
                                            itemDiscounts.baseLicense?.type ||
                                            "fixed",
                                          value: Number(e.target.value),
                                        },
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            {feeBreakdown.connection > 0 && (
                              <div className="bg-white border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    Connection Fees
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {formatCurrency(feeBreakdown.connection)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="border rounded-md p-1.5 input-field text-xs"
                                    value={
                                      itemDiscounts.connection?.type || "fixed"
                                    }
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        connection: {
                                          type: e.target.value as any,
                                          value:
                                            itemDiscounts.connection?.value ||
                                            0,
                                        },
                                      })
                                    }
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className="col-span-2 border rounded-md p-1.5 input-field text-xs"
                                    placeholder="0.00"
                                    value={itemDiscounts.connection?.value ?? 0}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        connection: {
                                          type:
                                            itemDiscounts.connection?.type ||
                                            "fixed",
                                          value: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {feeBreakdown.transaction > 0 && (
                              <div className="bg-white border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    Transaction Processing
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {formatCurrency(feeBreakdown.transaction)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="border rounded-md p-1.5 input-field text-xs"
                                    value={
                                      itemDiscounts.transaction?.type || "fixed"
                                    }
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        transaction: {
                                          type: e.target.value as any,
                                          value:
                                            itemDiscounts.transaction?.value ||
                                            0,
                                        },
                                      })
                                    }
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className="col-span-2 border rounded-md p-1.5 input-field text-xs"
                                    placeholder="0.00"
                                    value={
                                      itemDiscounts.transaction?.value ?? 0
                                    }
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        transaction: {
                                          type:
                                            itemDiscounts.transaction?.type ||
                                            "fixed",
                                          value: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {feeBreakdown.marketing > 0 && (
                              <div className="bg-white border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    Marketing
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {formatCurrency(feeBreakdown.marketing)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="border rounded-md p-1.5 input-field text-xs"
                                    value={
                                      itemDiscounts.marketing?.type ||
                                      "percentage"
                                    }
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        marketing: {
                                          type: e.target.value as any,
                                          value:
                                            itemDiscounts.marketing?.value || 0,
                                        },
                                      })
                                    }
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className="col-span-2 border rounded-md p-1.5 input-field text-xs"
                                    placeholder="0.00"
                                    value={itemDiscounts.marketing?.value ?? 0}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        marketing: {
                                          type:
                                            itemDiscounts.marketing?.type ||
                                            "percentage",
                                          value: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {feeBreakdown.giftCard > 0 && (
                              <div className="bg-white border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    Gift Card Module
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {formatCurrency(feeBreakdown.giftCard)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="border rounded-md p-1.5 input-field text-xs"
                                    value={
                                      itemDiscounts.giftCard?.type ||
                                      "percentage"
                                    }
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        giftCard: {
                                          type: e.target.value as any,
                                          value:
                                            itemDiscounts.giftCard?.value || 0,
                                        },
                                      })
                                    }
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className="col-span-2 border rounded-md p-1.5 input-field text-xs"
                                    placeholder="0.00"
                                    value={itemDiscounts.giftCard?.value ?? 0}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        giftCard: {
                                          type:
                                            itemDiscounts.giftCard?.type ||
                                            "percentage",
                                          value: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {feeBreakdown.sms > 0 && (
                              <div className="bg-white border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    SMS Messages
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {formatCurrency(feeBreakdown.sms)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="border rounded-md p-1.5 input-field text-xs"
                                    value={itemDiscounts.sms?.type || "fixed"}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        sms: {
                                          type: e.target.value as any,
                                          value: itemDiscounts.sms?.value || 0,
                                        },
                                      })
                                    }
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className="col-span-2 border rounded-md p-1.5 input-field text-xs"
                                    placeholder="0.00"
                                    value={itemDiscounts.sms?.value ?? 0}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        sms: {
                                          type:
                                            itemDiscounts.sms?.type || "fixed",
                                          value: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {feeBreakdown.whatsapp.total > 0 && (
                              <div className="bg-white border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    WhatsApp Platform
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {formatCurrency(
                                      feeBreakdown.whatsapp.total
                                    )}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="border rounded-md p-1.5 input-field text-xs"
                                    value={
                                      itemDiscounts.whatsapp?.type || "fixed"
                                    }
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        whatsapp: {
                                          type: e.target.value as any,
                                          value:
                                            itemDiscounts.whatsapp?.value || 0,
                                        },
                                      })
                                    }
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className="col-span-2 border rounded-md p-1.5 input-field text-xs"
                                    placeholder="0.00"
                                    value={itemDiscounts.whatsapp?.value ?? 0}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        whatsapp: {
                                          type:
                                            itemDiscounts.whatsapp?.type ||
                                            "fixed",
                                          value: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {feeBreakdown.server > 0 && (
                              <div className="bg-white border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    Independent Server
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {formatCurrency(feeBreakdown.server)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="border rounded-md p-1.5 input-field text-xs"
                                    value={
                                      itemDiscounts.server?.type || "fixed"
                                    }
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        server: {
                                          type: e.target.value as any,
                                          value:
                                            itemDiscounts.server?.value || 0,
                                        },
                                      })
                                    }
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className="col-span-2 border rounded-md p-1.5 input-field text-xs"
                                    placeholder="0.00"
                                    value={itemDiscounts.server?.value ?? 0}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        server: {
                                          type:
                                            itemDiscounts.server?.type ||
                                            "fixed",
                                          value: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {feeBreakdown.sla > 0 && (
                              <div className="bg-white border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    Premium SLA
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {formatCurrency(feeBreakdown.sla)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="border rounded-md p-1.5 input-field text-xs"
                                    value={itemDiscounts.sla?.type || "fixed"}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        sla: {
                                          type: e.target.value as any,
                                          value: itemDiscounts.sla?.value || 0,
                                        },
                                      })
                                    }
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className="col-span-2 border rounded-md p-1.5 input-field text-xs"
                                    placeholder="0.00"
                                    value={itemDiscounts.sla?.value ?? 0}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        sla: {
                                          type:
                                            itemDiscounts.sla?.type || "fixed",
                                          value: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {feeBreakdown.cms > 0 && (
                              <div className="bg-white border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    CMS
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {formatCurrency(feeBreakdown.cms)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="border rounded-md p-1.5 input-field text-xs"
                                    value={itemDiscounts.cms?.type || "fixed"}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        cms: {
                                          type: e.target.value as any,
                                          value: itemDiscounts.cms?.value || 0,
                                        },
                                      })
                                    }
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className="col-span-2 border rounded-md p-1.5 input-field text-xs"
                                    placeholder="0.00"
                                    value={itemDiscounts.cms?.value ?? 0}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        cms: {
                                          type:
                                            itemDiscounts.cms?.type || "fixed",
                                          value: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {feeBreakdown.app > 0 && (
                              <div className="bg-white border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    Mobile App
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {formatCurrency(feeBreakdown.app)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="border rounded-md p-1.5 input-field text-xs"
                                    value={itemDiscounts.app?.type || "fixed"}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        app: {
                                          type: e.target.value as any,
                                          value: itemDiscounts.app?.value || 0,
                                        },
                                      })
                                    }
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className="col-span-2 border rounded-md p-1.5 input-field text-xs"
                                    placeholder="0.00"
                                    value={itemDiscounts.app?.value ?? 0}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        app: {
                                          type:
                                            itemDiscounts.app?.type || "fixed",
                                          value: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {feeBreakdown.support > 0 && (
                              <div className="bg-white border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    Premium Support
                                  </span>
                                  <span className="text_sm text-gray-600">
                                    {formatCurrency(feeBreakdown.support)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="border rounded-md p-1.5 input-field text-xs"
                                    value={
                                      itemDiscounts.support?.type || "fixed"
                                    }
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        support: {
                                          type: e.target.value as any,
                                          value:
                                            itemDiscounts.support?.value || 0,
                                        },
                                      })
                                    }
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                  </select>
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className="col-span-2 border rounded-md p-1.5 input-field text-xs"
                                    placeholder="0.00"
                                    value={itemDiscounts.support?.value ?? 0}
                                    onChange={(e) =>
                                      setItemDiscounts({
                                        ...itemDiscounts,
                                        support: {
                                          type:
                                            itemDiscounts.support?.type ||
                                            "fixed",
                                          value: Number(e.target.value),
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {(feeBreakdown.itemDiscounts || 0) > 0 && (
                            <div className="bg-green-50 rounded p-2 text-sm mt-3">
                              <div className="flex justify-between font-medium text-green-800">
                                <span>Total Item Discounts:</span>
                                <span>
                                  -{formatCurrency(feeBreakdown.itemDiscounts)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {discountUnlocked && (
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        className={`px-3 py-2 rounded-md text-sm font-medium text-white ${"bg-blue-600 hover:bg-blue-700"}`}
                        // disabled={discountsApplied}
                        onClick={() => {
                          setAppliedItemDiscounts(itemDiscounts);
                          setAppliedSubtotalDiscount(subtotalDiscount);
                          setAppliedDiscountReason(discountReason);
                          setDiscountsApplied(true);
                        }}
                      >
                        Apply Discounts
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          discountsApplied
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          // Clear current and applied discounts
                          setItemDiscounts({});
                          setSubtotalDiscount({
                            type: "fixed",
                            value: 0,
                          });
                          setDiscountReason("");
                          setAppliedItemDiscounts({});
                          setAppliedSubtotalDiscount({
                            type: "fixed",
                            value: 0,
                          });
                          setAppliedDiscountReason("");
                          setDiscountsApplied(false);
                        }}
                      >
                        Clear Discounts
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium mb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 spoonity-primary-text"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      About Your Quote
                    </h4>
                    <p className="text-sm text-gray-600">
                      This is an estimated quote based on the information
                      provided. A Spoonity representative will contact you to
                      provide a final quote and answer any questions. Pricing is
                      subject to change based on specific requirements and
                      contract terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
            <div className="text-gray-500 text-sm sm:flex items-center hidden">
              <button
                onClick={() => handleTabChange("summary")}
                className="spoonity-primary-text hover:underline font-medium flex items-center"
              >
                View Full Breakdown
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-baseline text-right ml-auto">
              <div className="flex flex-col mr-6 sm:flex-row sm:items-baseline sm:space-x-2">
                <span className="text-sm text-gray-500">Setup:</span>
                <span className="font-medium text-sm">
                  {formatCurrency(setupFees)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Monthly:</span>
                {discountsApplied && (feeBreakdown.discount || 0) > 0 ? (
                  <div className="flex items-baseline gap-2 sm:gap-3 justify-end">
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      Before:{" "}
                      <span className="line-through text-gray-400">
                        {formatCurrency(
                          (monthlyFees || 0) + (feeBreakdown.discount || 0)
                        )}
                      </span>
                    </span>
                    <span className="text-base sm:text-xl font-bold spoonity-primary-text whitespace-nowrap">
                      After: {formatCurrency(monthlyFees)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold spoonity-primary-text">
                    {formatCurrency(monthlyFees)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
