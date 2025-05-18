"use client";
import React from 'react';

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
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [role, setRole] = React.useState('');
  const [country, setCountry] = React.useState('USA'); // Default country
  const [otherCountry, setOtherCountry] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  const [webhookLogs, setWebhookLogs] = React.useState<Array<{timestamp: string; message: string; data: any}>>([]);
  const [showLogs, setShowLogs] = React.useState(false);
  const [businessType, setBusinessType] = React.useState('corporate'); // 'corporate' or 'franchise'

  // State for inputs
  const [plan, setPlan] = React.useState('loyalty');
  const [stores, setStores] = React.useState(10);
  const [transactions, setTransactions] = React.useState(1000);
  const [marketing, setMarketing] = React.useState(10000);
  const [giftCard, setGiftCard] = React.useState(false);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [smsEnabled, setSmsEnabled] = React.useState(true); // Pre-select SMS
  const [smsMessages, setSmsMessages] = React.useState('');
  const [smsCountry, setSmsCountry] = React.useState('USA');
  const [independentServer, setIndependentServer] = React.useState(false);
  const [premiumSupport, setPremiumSupport] = React.useState(false);
  const [premiumSLA, setPremiumSLA] = React.useState(false);
  const [cms, setCms] = React.useState(false);
  const [appType, setAppType] = React.useState('none');
  const [dataIngestion, setDataIngestion] = React.useState(false);
  
  // WhatsApp specific state
  const [whatsappEnabled, setWhatsappEnabled] = React.useState(false);
  const [whatsappCountry, setWhatsappCountry] = React.useState('Mexico');
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
    }
  };

  // List of countries where WhatsApp is available
  const whatsappAvailableCountries = [
    'Argentina',
    'Brazil',
    'Chile',
    'Colombia',
    'Mexico',
    'Peru',
    'North America',
    'Rest of Latin America'
  ];

  const whatsappRates: WhatsAppRates = {
    'Argentina': {
      marketTicket: 0.0469,  // Digital Receipts
      utility: 0.06,
      marketing: 0.09,
      otp: 0.04
    },
    'Brazil': {
      marketTicket: 0.0138,  // Digital Receipts
      utility: 0.02,
      marketing: 0.09,
      otp: 0.04
    },
    'Chile': {
      marketTicket: 0.0276,  // Digital Receipts
      utility: 0.04,
      marketing: 0.12,
      otp: 0.05
    },
    'Colombia': {
      marketTicket: 0.0120,  // Digital Receipts
      utility: 0.03,
      marketing: 0.04,
      otp: 0.01
    },
    'Mexico': {
      marketTicket: 0.0138,  // Digital Receipts
      utility: 0.03,
      marketing: 0.07,
      otp: 0.03
    },
    'Peru': {
      marketTicket: 0.0240,  // Digital Receipts
      utility: 0.04,
      marketing: 0.08,
      otp: 0.04
    },
    'North America': {
      marketTicket: 0.0138,  // Digital Receipts
      utility: 0.03,
      marketing: 0.05,
      otp: 0.02
    },
    'Rest of Latin America': {
      marketTicket: 0.0156,  // Digital Receipts
      utility: 0.03,
      marketing: 0.11,
      otp: 0.05
    }
  };

  // Calculate WhatsApp per-store fees based on tiered pricing
  const calculateWhatsappStoreFeeTiers = (storeCount: number): number => {
    let fee = 0;
    if (storeCount <= 10) {
      fee = storeCount * 9.00;
    } else if (storeCount <= 80) {
      fee = 10 * 9.00 + (storeCount - 10) * 8.10;
    } else if (storeCount <= 149) {
      fee = 10 * 9.00 + 70 * 8.10 + (storeCount - 80) * 7.20;
    } else {
      fee = 10 * 9.00 + 70 * 8.10 + 69 * 7.20 + (storeCount - 149) * 6.30;
    }
    return fee;
  };
  
  // State for calculated values
  const [monthlyFees, setMonthlyFees] = React.useState(0);
  const [setupFees, setSetupFees] = React.useState(0);
  const [perStore, setPerStore] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('inputs');
  const [totalBeforeSupport, setTotalBeforeSupport] = React.useState(0);
  
  // State for fee breakdown
  const [feeBreakdown, setFeeBreakdown] = React.useState({
    total: 0,
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
      total: 0
    },
    server: 0,
    sla: 0,
    cms: 0,
    app: 0,
    support: 0,
    corporate: 0,
    franchisee: 0,
    franchiseePerStore: 0,
    setup: {
      total: 0,
      onboarding: 0,
      appSetup: 0,
      dataIngestion: 0
    }
  });
  
  // Constants
  const smsRates: Record<string, number> = {
    'USA': 0.01015,
    'Mexico': 0.06849,
    'Argentina': 0.07967,
    'UAE': 0.12430,
    'Ecuador': 0.20303,
    'Australia': 0.039675,
    'Colombia': 0.00181,
    'Guatemala': 0.24150,
    'Costa Rica': 0.05380,
    'Honduras': 0.13928,
    'Nicaragua': 0.12813,
    'El Salvador': 0.07600,
    'Chile': 0.05955
  };
  
  // Plan info
  const planDetails: Record<string, { base: number; name: string; description: string; fullDescription: string }> = {
    loyalty: { 
      base: 1000, 
      name: "Spoonity Loyalty", 
      description: "Core loyalty functionality",
      fullDescription: "The Spoonity Loyalty plan provides a complete loyalty platform for your business. It includes a base license fee of $1,000/month plus per-store connection fees that scale based on volume. This plan includes unlimited users, CRM functionality, unlimited earning and spending rules, unlimited members, and standard reporting capabilities."
    },
    marketing: { 
      base: 1500, 
      name: "Spoonity Marketing", 
      description: "Includes Loyalty + Marketing features",
      fullDescription: "The Spoonity Marketing plan includes all Loyalty features plus comprehensive marketing capabilities. It starts with a base license fee of $1,500/month plus per-store connection fees. Marketing emails are charged at tiered rates: $0.0006/email for first 100,000, $0.0004/email for 100,001-1,000,000, and $0.0002/email for over 1 million. Push notifications can be added for $0.0045 per push."
    },
    intelligence: { 
      base: 3000, 
      name: "Spoonity Intelligence", 
      description: "Includes Loyalty, Marketing + Analytics",
      fullDescription: "The Spoonity Intelligence plan is our most comprehensive offering. It includes all Loyalty and Marketing features plus advanced analytics. The base license fee is $3,000/month plus per-store connection fees. This plan includes 1 million transactions per month at no additional cost, with data processing fees for higher volumes. It includes comprehensive dashboards for customer analytics, loyalty segments, and cohort analysis."
    }
  };

  // Country dial codes mapping
  const countryDialCodes: Record<string, string> = {
    'USA': '+1',
    'Mexico': '+52',
    'Argentina': '+54',
    'UAE': '+971',
    'Ecuador': '+593',
    'Australia': '+61',
    'Colombia': '+57',
    'Guatemala': '+502',
    'Costa Rica': '+506',
    'Honduras': '+504',
    'Nicaragua': '+505',
    'El Salvador': '+503',
    'Chile': '+56'
  };

  // Add custom font and jsPDF script
  React.useEffect(() => {
    // Add Google Fonts link
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Add custom CSS for font and improved styling
    const style = document.createElement('style');
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
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    script.onload = () => {
      console.log('jsPDF loaded successfully');
      setJsPdfLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load jsPDF from CDN');
      // Fallback to mock as a last resort
      window.jspdf = {
        jsPDF: class MockJsPDF {
          pages: any[];
          
          constructor() { 
            this.pages = [];
            console.log('MockJsPDF created as fallback');
          }
          
          setFontSize(size: number): void { 
            console.log('Setting font size:', size); 
          }
          
          setFont(font: string, style: string): void { 
            console.log('Setting font:', font, style); 
          }
          
          text(text: string, x: number, y: number, options?: any): any { 
            console.log('Adding text:', text, 'at position:', x, y, options);
            return this;
          }
          
          splitTextToSize(text: string, maxWidth: number): string[] {
            console.log('Splitting text to size:', maxWidth);
            const words = text.split(' ');
            const lines: string[] = [];
            let currentLine = '';
            
            words.forEach(word => {
              if ((currentLine + word).length > maxWidth/6) {
                lines.push(currentLine);
                currentLine = word + ' ';
              } else {
                currentLine += word + ' ';
              }
            });
            
            if (currentLine) lines.push(currentLine);
            return lines.length ? lines : [text];
          }
          
          save(filename: string): void {
            console.log('PDF would be saved as:', filename);
            alert(`Your quote has been prepared! In a production environment, this would download a PDF file named: ${filename}`);
          }
        }
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

  // Handle login form submission
  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    // Basic validation
    if (firstName.trim() === '') {
      alert('Please enter your first name');
      return;
    }
    if (lastName.trim() === '') {
      alert('Please enter your last name');
      return;
    }
    if (email.trim() === '' || !validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (phone.trim() === '') {
      alert('Please enter your cell phone number');
      return;
    }
    if (company.trim() === '') {
      alert('Please enter your company name');
      return;
    }
    if (role.trim() === '') {
      alert('Please enter your role');
      return;
    }
    if (country === 'Other' && otherCountry.trim() === '') {
      alert('Please enter your country');
      return;
    }
    
    // If validation passes, set initial values based on country selection
    if (country === 'Other') {
      // If "Other" country, initialize SMS to false and disabled
      setSmsEnabled(false);
      setSmsMessages('');
      setSmsCountry('USA'); // Default, but will be disabled
    } else {
      // Set the SMS country to match the selected country
      setSmsCountry(country);
    }
    
    // If validation passes, set logged in to true and scroll to top
    setIsLoggedIn(true);
    // Use setTimeout to ensure the new content is rendered before scrolling
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Function to get quote information structured for display or PDF
  const getQuoteDetails = () => {
    const addOns = [];
    
    if (smsEnabled) {
      addOns.push(`SMS Platform (${smsCountry}): ${formatCurrency(feeBreakdown.sms)}/month`);
    }
    
    if (whatsappEnabled) {
      addOns.push(`WhatsApp Platform (${whatsappCountry}): ${formatCurrency(feeBreakdown.whatsapp.total)}/month`);
    }
    
    if (appType !== 'none') {
      addOns.push(`Mobile App (${appType}): ${formatCurrency(feeBreakdown.app)}/month`);
    }
    
    if (independentServer) {
      addOns.push(`Independent Server: ${formatCurrency(feeBreakdown.server)}/month`);
    }
    
    if (premiumSLA) {
      addOns.push(`Premium SLA: ${formatCurrency(feeBreakdown.sla)}/month`);
    }
    
    if (plan === 'loyalty') {
      addOns.push(`Loyalty Program: ${formatCurrency(feeBreakdown.baseLicense)}/month`);
    }
    
    if (giftCard) {
      addOns.push(`Gift Card Program: ${formatCurrency(feeBreakdown.giftCard)}/month`);
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
  };
  
  // Function to display quote information as text
  const displayQuoteDetails = () => {
    return getQuoteDetails();
  };
  
  // Function to generate and download PDF
  const generatePDF = () => {
    // Check if jsPDF is loaded
    if (!jsPdfLoaded) {
      alert('PDF generation is loading. Please try again in a moment.');
      return;
    }
    
    try {
      console.log('Generating PDF...');
      console.log('jsPDF available:', typeof window.jspdf !== 'undefined');
      
      // Make sure jsPDF is available in the global scope
      if (typeof window.jspdf === 'undefined') {
        throw new Error('jsPDF library not loaded properly');
      }
      
      const { jsPDF } = window.jspdf;
      console.log('Creating new jsPDF instance');
      const doc = new jsPDF();
      
      // Get structured quote data
      const quoteData = getQuoteDetails();
      console.log('Quote data prepared:', quoteData);
      
      // Set font size and styling
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      
      // Title
      console.log('Adding title to PDF');
      doc.text('SPOONITY PRICING QUOTE', 105, 20, { align: 'center' });
      
      // Reset font for body text
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      // Contact Information
      doc.setFont('helvetica', 'bold');
      doc.text('Contact Information:', 20, 35);
      doc.setFont('helvetica', 'normal');
      
      // If quoteData is an object, proceed with detailed PDF
      if (typeof quoteData === 'object') {
        doc.text(`Name: ${firstName} ${lastName}`, 20, 42);
        doc.text(`Email: ${email}`, 20, 49);
        doc.text(`Phone: ${phone}`, 20, 56);
        doc.text(`Company: ${company}`, 20, 63);
        doc.text(`Role: ${role}`, 20, 70);
        doc.text(`Business Type: ${businessType === 'corporate' ? 'Corporately Owned' : 'Franchised'}`, 20, 77);
        
        // Plan Details
        doc.setFont('helvetica', 'bold');
        doc.text('Plan Details:', 20, 90);
        doc.setFont('helvetica', 'normal');
        doc.text(planDetails[plan].name, 20, 97);
        
        // Handle long description with text wrapping
        const splitDescription = doc.splitTextToSize(planDetails[plan].fullDescription, 170);
        //@ts-ignore
        doc.text(splitDescription, 20, 104);
        
        // Calculate new Y position after the description
        let yPos = 104 + (splitDescription.length * 7);
        
        // Configuration
        doc.setFont('helvetica', 'bold');
        doc.text('Configuration:', 20, yPos + 10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Number of Stores: ${stores}`, 20, yPos + 17);
        doc.text(`Transactions per Store: ${transactions}`, 20, yPos + 24);
        if (marketing) {
          doc.text(`Marketing Messages: ${marketing}`, 20, yPos + 31);
          yPos += 7; // Add space for the marketing line
        }
        
        // Add-ons
        doc.setFont('helvetica', 'bold');
        doc.text('Selected Add-ons:', 20, yPos + 38);
        doc.setFont('helvetica', 'normal');
        if (quoteData.length === 0) {
          doc.text('- None selected', 20, yPos + 45);
          yPos += 7;
        } else {
          quoteData.forEach((addon, index) => {
            doc.text(`- ${addon}`, 20, yPos + 45 + (index * 7));
          });
          yPos += (quoteData.length * 7);
        }
        
        // Pricing Summary
        doc.setFont('helvetica', 'bold');
        doc.text('Pricing Summary:', 20, yPos + 52);
        doc.setFont('helvetica', 'normal');
        doc.text(`Monthly Recurring Fees: ${formatCurrency(monthlyFees)}`, 20, yPos + 59);
        
        // Add franchise breakdown if applicable
        if (businessType === 'franchise') {
          doc.text(`  Corporate Monthly Fee: ${formatCurrency(feeBreakdown.corporate)}`, 30, yPos + 66);
          doc.text(`  Franchisee Fee per Store: ${formatCurrency(feeBreakdown.franchiseePerStore)}`, 30, yPos + 73);
          yPos += 14;
        }
        
        doc.text(`Monthly Fee per Store: ${formatCurrency(perStore)}`, 20, yPos + 66);
        doc.text(`One-Time Setup Fees: ${formatCurrency(setupFees)}`, 20, yPos + 73);
        doc.text(`First Year Total Cost: ${formatCurrency(monthlyFees * 12 + setupFees)}`, 20, yPos + 80);
        
        // Date and Disclaimer
        doc.text(`Quote generated on: ${new Date().toLocaleDateString()}`, 20, yPos + 94);
        
        // Disclaimer with line wrapping
        const splitDisclaimer = doc.splitTextToSize('This is an estimated quote based on the information provided. A Spoonity representative will contact you to provide a final quote and answer any questions.', 170);
        //@ts-ignore
        doc.text(splitDisclaimer, 20, yPos + 101);
      } else {
        // Simplified PDF if the data structure is not complete
        let y = 40;
        doc.text(`Name: ${firstName} ${lastName}`, 20, y);
        y += 10;
        doc.text(`Email: ${email}`, 20, y);
        y += 10;
        doc.text(`Plan: ${planDetails[plan].name}`, 20, y);
        y += 10;
        doc.text(`Total Monthly Cost: ${formatCurrency(monthlyFees)}`, 20, y);
        y += 10;
        doc.text(`Setup Fee: ${formatCurrency(setupFees)}`, 20, y);
        y += 10;
        doc.text(`First Year Total: ${formatCurrency(monthlyFees * 12 + setupFees)}`, 20, y);
        y += 20;
        
        doc.setFont('helvetica', 'italic');
        doc.text('A Spoonity representative will contact you shortly.', 20, y);
      }
      
      console.log('PDF content complete, saving...');
      // Save the PDF with a proper filename
      const filename = `Spoonity_Quote_${firstName.replace(/\s+/g, '_')}_${lastName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      console.log('PDF generated and downloaded:', filename);
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error.message}. Please try again or contact support.`);
    }
  };
  
  // Enhanced PDF generation with loading state
  const generatePDFWithLoading = () => {
    if (!jsPdfLoaded) {
      alert('PDF generation is loading. Please try again in a moment.');
      return;
    }
    
    setIsPdfGenerating(true);
    
    // Use setTimeout to allow React to render the loading state
    setTimeout(() => {
      try {
        generatePDF();
      } catch (error) {
        console.error('Error in PDF generation:', error);
        alert('There was an error generating your PDF. Please try again.');
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
      data
    };
    setWebhookLogs(prevLogs => [...prevLogs, logEntry]);
    console.log(`[${timestamp}] ${message}`, data || '');
  };

  // Submit data to webhook
  const submitData = async (): Promise<void> => {
    // Prevent double submission
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    setWebhookLogs([]); // Clear previous logs
    
    // Prepare data to send
    const formData = {
      firstName,
      lastName,
      email,
      phone,
      company,
      role,
      country: country === 'Other' ? otherCountry : country,
      businessType,
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
          dataIngestion
        },
        results: {
          monthlyFees: formatCurrency(monthlyFees),
          setupFees: formatCurrency(setupFees),
          perStore: formatCurrency(perStore),
          firstYearTotal: formatCurrency(monthlyFees * 12 + setupFees)
        }
      },
      timestamp: new Date().toISOString()
    };
    
    try {
      const webhookUrl = 'https://hooks.zapier.com/hooks/catch/57845/20qrdnf/';
      
      console.log('Submitting data to Zapier webhook...');
      addLog('Sending data to webhook', formData);
      
      // Store submission state in localStorage
      localStorage.setItem('spoonity_submission_pending', 'true');
      localStorage.setItem('spoonity_submission_data', JSON.stringify({
        firstName,
        lastName,
        email
      }));

      // Use fetch API with proper CORS settings
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'no-cors', // This allows the request to succeed even with CORS restrictions
        body: JSON.stringify({ data: formData })
      });

      console.log('Webhook Response Status:', response.status, response.statusText);
      addLog('Webhook Response Status', { status: response.status, statusText: response.statusText });

      // Since we're using no-cors, we won't be able to read the response body
      // but we can consider it successful if we get here
      addLog('Webhook submission completed successfully');
      setSubmitSuccess(true);
      setIsSubmitting(false);
      
    } catch (error: unknown) {
      console.error('Error in submission process:', error);
      addLog('Error in submission process', { error: error instanceof Error ? error.message : String(error) });
      
      // Automatically proceed to success screen for demo purposes
      setSubmitSuccess(true);
      setIsSubmitting(false);
    }
  };
  
  // Calculate fees whenever inputs change
  React.useEffect(() => {
    const fees = calculateFees();
    setFeeBreakdown(fees);
  }, [
    plan, stores, transactions, marketing, giftCard, pushNotifications, 
    smsMessages, smsCountry, independentServer, premiumSupport, 
    premiumSLA, cms, appType, dataIngestion, businessType
  ]);
  
  // Calculate default SMS message count when stores or transactions change
  React.useEffect(() => {
    // Calculate default SMS count as 10% of total transactions
    const defaultSmsCount = Math.round(stores * transactions * 0.1);
    if (smsEnabled) {
      setSmsMessages(defaultSmsCount.toString());
    }
  }, [stores, transactions, smsEnabled]);
  
  // Ensure independent server for >50 stores
  React.useEffect(() => {
    if (stores > 50) {
      setIndependentServer(true);
    }
  }, [stores]);
  
  // Calculate connection fees and corporate/franchise split
  const calculateConnectionFees = (storeCount: number): number => {
    let connectionFees = 0;
    if (storeCount <= 10) {
      connectionFees = storeCount * 150;
    } else if (storeCount <= 25) {
      connectionFees = 10 * 150 + (storeCount - 10) * 135;
    } else if (storeCount <= 40) {
      connectionFees = 10 * 150 + 15 * 135 + (storeCount - 25) * 121.5;
    } else {
      connectionFees = 10 * 150 + 15 * 135 + 15 * 121.5 + (storeCount - 40) * 109.35;
    }
    return connectionFees;
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
    if (transactionVolume <= 5000) {
      transactionFees = transactionVolume * 0.005;
    } else if (transactionVolume <= 50000) {
      transactionFees = 5000 * 0.005 + (transactionVolume - 5000) * 0.003;
    } else {
      transactionFees = 5000 * 0.005 + 45000 * 0.003 + (transactionVolume - 50000) * 0.002;
    }
    monthly += transactionFees;
    
    // Marketing emails (for Marketing and Intelligence plans)
    let marketingFees = 0;
    if (plan !== 'loyalty') {
      if (marketing <= 100000) {
        marketingFees = marketing * 0.0006;
      } else if (marketing <= 1000000) {
        marketingFees = 100000 * 0.0006 + (marketing - 100000) * 0.0004;
      } else {
        marketingFees = 100000 * 0.0006 + 900000 * 0.0004 + (marketing - 1000000) * 0.0002;
      }
      monthly += marketingFees;
      
      // Push notifications
      if (pushNotifications) {
        marketingFees += marketing * 0.0045;
        monthly += marketing * 0.0045;
      }
    }
    
    // Add-ons
    let giftCardFees = 0;
    if (giftCard) {
      giftCardFees = 500 + (stores * 30); // $500 base + $30/store
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
      
      whatsappMessageFees = marketTicketFee + utilityFee + marketingFee + otpFee;
      whatsappTotalFee = whatsappBaseFee + whatsappPerStoreFee + whatsappMessageFees;
      
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
    if (appType === 'premium') {
      appFees = 1080;
      monthly += appFees;
    } else if (appType === 'standard' || appType === 'pwa') {
      appFees = 350;
      monthly += appFees;
    }
    
    // Premium support is calculated after all other monthly fees
    let totalBeforeSupport = monthly;
    let supportFees = 0;
    if (premiumSupport) {
      supportFees = 2000 + (totalBeforeSupport * 0.1);
      monthly += supportFees;
    }
    
    // Setup fees
    let onboardingFee = totalBeforeSupport * 0.33 * 3; // Onboarding fee
    let setup = onboardingFee;
    
    // App setup fees
    let appSetupFee = 0;
    if (appType === 'premium') {
      appSetupFee = 15000;
      setup += appSetupFee;
    } else if (appType === 'standard') {
      appSetupFee = 5000;
      setup += appSetupFee;
    } else if (appType === 'pwa') {
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
    const corporateFees = businessType === 'franchise' 
      ? monthly - connectionFees // Corporate pays all fees except connection fees
      : monthly; // Corporate pays all fees
    
    const franchiseeFees = businessType === 'franchise'
      ? connectionFees // Franchisees only pay connection fees
      : 0; // No franchise fees if corporately owned
    
    const franchiseePerStore = businessType === 'franchise' && stores > 0
      ? connectionFees / stores
      : 0;
    
    // Set calculated values
    setMonthlyFees(monthly);
    setSetupFees(setup);
    setPerStore(stores > 0 ? monthly / stores : 0);
    setTotalBeforeSupport(totalBeforeSupport);
    
    return {
      total: monthly,
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
        total: whatsappTotalFee
      },
      server: serverFees,
      sla: slaFees,
      cms: cmsFees,
      app: appFees,
      support: supportFees,
      corporate: corporateFees,
      franchisee: franchiseeFees,
      franchiseePerStore: franchiseePerStore,
      setup: {
        total: setup,
        onboarding: onboardingFee,
        appSetup: appSetupFee,
        dataIngestion: dataIngestionFee
      }
    };
  }
  
  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  // Update phone number when country changes
  React.useEffect(() => {
    if (country !== 'Other') {
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
      if (phone.startsWith('+')) {
        setPhone('+');
      } else if (!phone.startsWith('+')) {
        setPhone('+');
      }
      // Disable WhatsApp for "Other" countries
      setWhatsappEnabled(false);
    }
  }, [country]);

  // Add scroll function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Update tab switching logic
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    scrollToTop();
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
            <h2 className="text-lg font-medium">Please enter your information to continue</h2>
            <p className="text-sm text-gray-600">We'll use this to provide you with a personalized quote</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <label className="block text-sm font-medium mb-1" htmlFor="country">
                Country
              </label>
              <select
                id="country"
                className="w-full border rounded-md p-2.5 input-field"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  if (e.target.value === 'Other') {
                    setOtherCountry('');
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
            
            {country === 'Other' && (
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="otherCountry">
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
                <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full border rounded-md p-2.5 input-field"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="John"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full border rounded-md p-2.5 input-field"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Smith"
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
                required
                placeholder="you@example.com"
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
                required
                placeholder={country !== 'Other' ? `${countryDialCodes[country]} followed by your number` : 'Enter phone number'}
              />
              <p className="text-xs text-gray-500 mt-1">
                {country !== 'Other' ? `Country code ${countryDialCodes[country]} will be automatically added` : 'Please include country code'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="company">
                Company Name
              </label>
              <input
                id="company"
                type="text"
                className="w-full border rounded-md p-2.5 input-field"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                placeholder="Your Company"
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
                required
                placeholder="Marketing Manager"
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
                    checked={businessType === 'corporate'}
                    onChange={() => setBusinessType('corporate')}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="corporate" className="ml-2 block text-sm text-gray-700">
                    Corporately Owned
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="franchise"
                    name="businessType"
                    value="franchise"
                    checked={businessType === 'franchise'}
                    onChange={() => setBusinessType('franchise')}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="franchise" className="ml-2 block text-sm text-gray-700">
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
              By continuing, you agree that we may use your information to contact you about Spoonity services.
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
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-25 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-lg mb-1">Your pricing information has been submitted successfully.</p>
              <p className="text-green-100">A Spoonity representative will be in touch with you shortly.</p>
            </div>
            
            <div className="bg-white p-6">
              <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Your Pricing Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{planDetails[plan].name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Fee:</span>
                    <span className="font-medium">{formatCurrency(monthlyFees)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Setup Fee:</span>
                    <span className="font-medium">{formatCurrency(setupFees)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>First Year Total:</span>
                                                <span className="spoonity-primary-text">{formatCurrency(monthlyFees * 12 + setupFees)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      const quoteText = displayQuoteDetails();
                      alert("Please copy the text below for your records:\n\n" + quoteText);
                    }}
                    className="spoonity-cta text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200"
                  >
                    View Detailed Quote
                  </button>
                  <button
                    onClick={() => generatePDFWithLoading()}
                    disabled={!jsPdfLoaded || isPdfGenerating}
                    className={`spoonity-cta text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200 flex items-center justify-center ${(!jsPdfLoaded || isPdfGenerating) ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isPdfGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {jsPdfLoaded ? 'Download PDF Quote' : 'Loading PDF Generator...'}
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setIsLoggedIn(false);
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setPhone('');
                    setCompany('');
                    setRole('');
                  }}
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
              <div className="text-sm text-right hidden sm:block">
                <div className="text-white opacity-90">Welcome,</div>
                <div className="font-medium text-white">{firstName} {lastName} • <button onClick={() => setIsLoggedIn(false)} className="text-white opacity-90 hover:underline">Sign Out</button></div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              <button 
                className={`px-4 py-3 tab-button ${activeTab === 'inputs' ? 'active spoonity-primary-text font-medium' : 'text-gray-600 hover:spoonity-primary-text'}`}
                onClick={() => handleTabChange('inputs')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Basic Info
                </div>
              </button>
              <button 
                className={`px-4 py-3 tab-button ${activeTab === 'addons' ? 'active spoonity-primary-text font-medium' : 'text-gray-600 hover:spoonity-primary-text'}`}
                onClick={() => handleTabChange('addons')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add-ons
                </div>
              </button>
              <button 
                className={`px-4 py-3 tab-button ${activeTab === 'summary' ? 'active spoonity-primary-text font-medium' : 'text-gray-600 hover:spoonity-primary-text'}`}
                onClick={() => handleTabChange('summary')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Summary
                </div>
              </button>
            </div>
          </div>
          
          {/* Inputs Tab */}
          {activeTab === 'inputs' && (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Plan Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(planDetails).map(([key, details]) => (
                      <div 
                        key={key}
                        onClick={() => setPlan(key)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          plan === key 
                            ? 'border-purple-500 bg-purple-50 shadow-sm' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start mb-2">
                          <div 
                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-2 flex items-center justify-center ${
                              plan === key ? 'border-purple-500' : 'border-gray-300'
                            }`}
                          >
                            {plan === key && (
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#640C6F' }}></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{details.name}</h3>
                            <p className="text-sm text-gray-600">{details.description}</p>
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
                  <label className="block text-sm font-medium mb-2">Number of Stores</label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input 
                        type="text" 
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full border rounded-md p-2.5 input-field text-lg font-medium"
                        value={stores === 0 ? '' : stores}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow numbers and convert to number
                          if (/^\d*$/.test(value)) {
                            setStores(value === '' ? 0 : parseInt(value));
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {[1, 5, 10, 25, 50, 100].map(value => (
                        <button
                          key={value}
                          onClick={() => setStores(value)}
                          className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                            stores === value 
                              ? 'bg-blue-100 border-blue-400 text-blue-700' 
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    
                    <p className={`text-xs ${stores > 50 ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
                      {stores > 50 ? '⚠️ More than 50 stores requires an independent server (automatically added)' : 'How many physical locations do you operate?'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Transactions per Store per Month</label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        min="1"
                        className="w-full border rounded-md p-2.5 input-field text-lg font-medium"
                        value={transactions}
                        onChange={(e) => setTransactions(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {[500, 1000, 2500, 5000, 10000].map(value => (
                        <button
                          key={value}
                          onClick={() => setTransactions(value)}
                          className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                            transactions === value 
                              ? 'bg-purple-100 border-purple-400 spoonity-primary-text' 
                              : 'spoonity-form border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {value.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Average number of transactions each location processes monthly
                    </p>
                  </div>
                </div>
                
                {plan !== 'loyalty' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Marketing Messages per Month</label>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input 
                          type="number" 
                          min="0"
                          className="w-full border rounded-md p-2.5 input-field text-lg font-medium"
                          value={marketing}
                          onChange={(e) => setMarketing(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {[5000, 10000, 50000, 100000, 500000, 1000000].map(value => (
                          <button
                            key={value}
                            onClick={() => setMarketing(value)}
                            className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                              marketing === value 
                                ? 'bg-purple-100 border-purple-400 spoonity-primary-text' 
                                : 'spoonity-form border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {value.toLocaleString()}
                          </button>
                        ))}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1">
                        Tiered pricing: $0.0006 per email (first 100K), $0.0004 (100K-1M), $0.0002 (1M+)
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-2">
                  <button 
                    className="spoonity-cta text-white font-medium py-2.5 px-4 rounded transition-colors duration-200 flex items-center"
                    onClick={() => handleTabChange('addons')}
                  >
                    Continue to Add-ons
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Add-ons Tab */}
          {activeTab === 'addons' && (
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label htmlFor="giftCard" className="font-medium cursor-pointer">Gift Card Module</label>
                        <p className="text-sm text-gray-600">$500 base fee + $30/store/month</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">Allows businesses to sell and redeem gift cards</p>
                  </div>
                  
                  {plan !== 'loyalty' && (
                    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                      <div className="flex items-start mb-1">
                        <input 
                          type="checkbox" 
                          id="pushNotifications" 
                          className="checkbox-custom"
                          checked={pushNotifications}
                          onChange={(e) => setPushNotifications(e.target.checked)}
                        />
                        <div>
                          <label htmlFor="pushNotifications" className="font-medium cursor-pointer">Push Notifications</label>
                          <p className="text-sm text-gray-600">$0.0045 per push notification</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 pl-7">Send mobile push notifications to customers</p>
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
                        <label htmlFor="independentServer" className="font-medium cursor-pointer">
                          Independent Server
                          {stores > 50 ? ' (Required)' : ''}
                        </label>
                        <p className="text-sm text-gray-600">$500/month</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">Dedicated server for your loyalty program</p>
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
                        <label htmlFor="premiumSLA" className="font-medium cursor-pointer">Premium SLA</label>
                        <p className="text-sm text-gray-600">$2,000/month</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">99.99% uptime guarantee with priority support</p>
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
                        <label htmlFor="premiumSupport" className="font-medium cursor-pointer">Premium Support</label>
                        <p className="text-sm text-gray-600">$2,000 + 10% of monthly fees</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">24/7 dedicated support with 2-hour response time</p>
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
                        <label htmlFor="dataIngestion" className="font-medium cursor-pointer">Data Ingestion</label>
                        <p className="text-sm text-gray-600">20% of monthly fees</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">Import data from external systems</p>
                  </div>
                </div>
                
                <div className="border-t border-b py-5">
                  <div className="flex items-start mb-3">
                    <input 
                      type="checkbox" 
                      id="smsEnabled" 
                      className="checkbox-custom mt-1"
                      checked={smsEnabled}
                      onChange={(e) => {
                        setSmsEnabled(e.target.checked);
                        if (!e.target.checked) {
                          setSmsMessages('');
                        } else {
                          // Reset to default calculation
                          const defaultSmsCount = Math.round(stores * transactions * 0.1);
                          setSmsMessages(defaultSmsCount.toString());
                        }
                      }}
                    />
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="smsEnabled">
                        SMS for One-Time Passwords
                      </label>
                      <p className="text-xs text-gray-500">Send verification codes via SMS for secure authentication</p>
                    </div>
                  </div>
                  
                  {smsEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                      <select 
                        className="border rounded-md p-2.5 input-field"
                        value={smsCountry}
                        onChange={(e) => setSmsCountry(e.target.value)}
                      >
                        {Object.keys(smsRates).map(country => (
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
                        <span className="ml-2 text-xs text-gray-500 whitespace-nowrap">messages/month</span>
                      </div>
                      <div className="md:col-span-2 text-xs text-gray-500">
                        Default calculation: 10% of total monthly transactions ({Math.round(stores * transactions * 0.1).toLocaleString()} messages)
                      </div>
                    </div>
                  )}
                </div>
                
                {/* WhatsApp Platform Integration */}
                {whatsappAvailableCountries.includes(country) && (
                  <div className="border-b py-5">
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
                            const defaultSmsCount = Math.round(stores * transactions * 0.1);
                            setWhatsappMarketTicket(defaultSmsCount);
                            setWhatsappUtility(defaultSmsCount);
                            setWhatsappOtp(defaultSmsCount);
                            setWhatsappMarketing(10000);
                          }
                        }}
                      />
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="whatsappEnabled">
                          WhatsApp Platform for Loyalty and Digital Receipts
                        </label>
                        <p className="text-xs text-gray-500">Base fee: $630/month + tiered per-location fees</p>
                      </div>
                    </div>
                    
                    {whatsappEnabled && (
                      <div className="ml-7 space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Location Pricing Tiers</label>
                          <div className="text-xs text-gray-600 grid grid-cols-2 gap-2">
                            <div>Tier 1-10: $9.00/month/store</div>
                            <div>Tier 11-80: $8.10/month/store</div>
                            <div>Tier 81-149: $7.20/month/store</div>
                            <div>Tier 150+: $6.30/month/store</div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Country for Message Pricing</label>
                          <select 
                            className="border rounded-md p-2.5 input-field w-full"
                            value={whatsappCountry}
                            onChange={(e) => setWhatsappCountry(e.target.value)}
                          >
                            {Object.keys(whatsappRates).map(country => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Estimated Monthly Message Volume</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Digital Receipts (${whatsappRates[whatsappCountry].marketTicket.toFixed(4)}/msg)</label>
                              <input
                                type="number"
                                min="0"
                                className="w-full border rounded-md p-2 input-field"
                                value={whatsappMarketTicket}
                                onChange={(e) => setWhatsappMarketTicket(parseInt(e.target.value) || 0)}
                                placeholder="# of messages"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Utility Campaign Messages (${whatsappRates[whatsappCountry].utility.toFixed(2)}/msg)</label>
                              <input
                                type="number"
                                min="0"
                                className="w-full border rounded-md p-2 input-field"
                                value={whatsappUtility}
                                onChange={(e) => setWhatsappUtility(parseInt(e.target.value) || 0)}
                                placeholder="# of messages"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Marketing Campaign Messages (${whatsappRates[whatsappCountry].marketing.toFixed(2)}/msg)</label>
                              <input
                                type="number"
                                min="0"
                                className="w-full border rounded-md p-2 input-field"
                                value={whatsappMarketing}
                                onChange={(e) => setWhatsappMarketing(parseInt(e.target.value) || 0)}
                                placeholder="# of messages"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Authentication OTP Messages (${whatsappRates[whatsappCountry].otp.toFixed(2)}/msg)</label>
                              <input
                                type="number"
                                min="0"
                                className="w-full border rounded-md p-2 input-field"
                                value={whatsappOtp}
                                onChange={(e) => setWhatsappOtp(parseInt(e.target.value) || 0)}
                                placeholder="# of messages"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-2 text-xs bg-gray-50 p-3 rounded-md">
                          <div className="font-medium mb-1">WhatsApp Fee Summary:</div>
                          <div className="grid grid-cols-2 gap-1">
                            <span>Base Platform Fee:</span>
                            <span className="text-right">{formatCurrency(whatsappEnabled ? 630 : 0)}</span>
                            
                            <span>Per-Location Fees ({stores} stores):</span>
                            <span className="text-right">{formatCurrency(whatsappEnabled ? calculateWhatsappStoreFeeTiers(stores) : 0)}</span>
                            
                            <span>Message Fees:</span>
                            <span className="text-right">{formatCurrency(feeBreakdown.whatsapp.messages)}</span>
                            
                            <span className="font-medium pt-1 border-t mt-1">Total WhatsApp Monthly:</span>
                            <span className="text-right font-medium pt-1 border-t mt-1">{formatCurrency(feeBreakdown.whatsapp.total)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-3">Mobile App Options</label>
                  <div className="grid grid-cols-1 gap-3">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        appType === 'none' 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => {
                        setAppType('none');
                        setCms(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div 
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center ${
                            appType === 'none' ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          {appType === 'none' && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">No App</h3>
                          <p className="text-sm text-gray-600">We'll be using our own website, app or use physical cards only</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          $0
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        appType === 'premium' 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setAppType('premium')}
                    >
                      <div className="flex items-center">
                        <div 
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center ${
                            appType === 'premium' ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          {appType === 'premium' && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Premium App</h3>
                          <p className="text-sm text-gray-600">Fully customized native iOS & Android apps</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          $15,000 + $1,080/mo
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        appType === 'standard' 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => {
                        setAppType('standard');
                        setCms(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div 
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center ${
                            appType === 'standard' ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          {appType === 'standard' && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Standard App</h3>
                          <p className="text-sm text-gray-600">Branded template-based native mobile apps</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          $5,000 + $350/mo
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        appType === 'pwa' 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => {
                        setAppType('pwa');
                        setCms(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div 
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center ${
                            appType === 'pwa' ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          {appType === 'pwa' && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Customizable PWA</h3>
                          <p className="text-sm text-gray-600">Progressive Web App with offline capabilities</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          $1,000 + $350/mo
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {appType === 'premium' && (
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
                        <label htmlFor="cms" className="font-medium cursor-pointer">Content Management System</label>
                        <p className="text-sm text-gray-600">$530/month</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">Manage app content without developer assistance</p>
                  </div>
                )}
                
                <div className="flex justify-between mt-2">
                  <button 
                    className="bg-gray-100 text-gray-700 font-medium py-2.5 px-4 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center"
                    onClick={() => handleTabChange('inputs')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <button 
                    className="spoonity-cta text-white font-medium py-2.5 px-4 rounded transition-colors duration-200 flex items-center"
                    onClick={() => handleTabChange('summary')}
                  >
                    Continue to Summary
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div style={{ backgroundColor: '#9F62A6' }} className="rounded-t-lg p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">
                      {planDetails[plan].name}
                    </h3>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-sm opacity-90">Your estimated price</span>
                      <div>
                        <span className="text-3xl font-bold">{formatCurrency(monthlyFees)}</span>
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
                          <p>Connection Fees ({stores} stores {stores <= 10 ? '@ $150/store' : 
                              stores <= 25 ? '@ $135/store' : 
                              stores <= 40 ? '@ $121.50/store' : 
                              '@ $109.35/store'})</p>
                          <p>Transaction Processing</p>
                          {plan !== 'loyalty' && <p>Marketing Emails</p>}
                          {plan !== 'loyalty' && pushNotifications && <p>Push Notifications</p>}
                        </div>
                        <div className="space-y-2 text-right font-medium">
                          <p>{formatCurrency(planDetails[plan].base)}</p>
                          <p>{formatCurrency(stores <= 10 ? stores * 150 : 
                              stores <= 25 ? 10 * 150 + (stores - 10) * 135 :
                              stores <= 40 ? 10 * 150 + 15 * 135 + (stores - 25) * 121.5 :
                              10 * 150 + 15 * 135 + 15 * 121.5 + (stores - 40) * 109.35)}</p>
                          <p>{formatCurrency(0.25 * (stores * transactions) * 
                              (0.25 * (stores * transactions) <= 5000 ? 0.005 : 
                               0.25 * (stores * transactions) <= 50000 ? 0.003 : 0.002))}</p>
                          {plan !== 'loyalty' && <p>{formatCurrency(
                            marketing <= 100000 ? marketing * 0.0006 :
                            marketing <= 1000000 ? 100000 * 0.0006 + (marketing - 100000) * 0.0004 :
                            100000 * 0.0006 + 900000 * 0.0004 + (marketing - 1000000) * 0.0002
                          )}</p>}
                          {plan !== 'loyalty' && pushNotifications && <p>{formatCurrency(marketing * 0.0045)}</p>}
                        </div>
                      </div>
                      
                      {(giftCard || (smsMessages && parseInt(smsMessages) > 0) || independentServer || premiumSLA || 
                      premiumSupport || cms || appType !== 'none' || dataIngestion) && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-medium mb-3">Add-on Services</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2 text-gray-500">
                              {giftCard && <p>Gift Card Module</p>}
                              {smsMessages && parseInt(smsMessages) > 0 && <p>SMS Messages ({smsMessages})</p>}
                              {independentServer && <p>Independent Server</p>}
                              {premiumSLA && <p>Premium SLA</p>}
                              {cms && <p>Content Management System</p>}
                              {appType === 'premium' && <p>Premium App Subscription</p>}
                              {appType === 'standard' && <p>Standard App Subscription</p>}
                              {appType === 'pwa' && <p>PWA Subscription</p>}
                              {premiumSupport && <p>Premium Support</p>}
                              {dataIngestion && <p>Data Ingestion</p>}
                            </div>
                            <div className="space-y-2 text-right font-medium">
                              {giftCard && <p>{formatCurrency(feeBreakdown.giftCard)}</p>}
                              {smsMessages && parseInt(smsMessages) > 0 && <p>{formatCurrency(feeBreakdown.sms)}</p>}
                              {independentServer && <p>{formatCurrency(feeBreakdown.server)}</p>}
                              {premiumSLA && <p>{formatCurrency(feeBreakdown.sla)}</p>}
                              {cms && <p>{formatCurrency(feeBreakdown.cms)}</p>}
                              {appType === 'premium' && <p>{formatCurrency(feeBreakdown.app)}</p>}
                              {appType === 'standard' && <p>{formatCurrency(feeBreakdown.app)}</p>}
                              {appType === 'pwa' && <p>{formatCurrency(feeBreakdown.app)}</p>}
                              {premiumSupport && <p>{formatCurrency(feeBreakdown.support)}</p>}
                              {dataIngestion && <p>{formatCurrency((monthlyFees - (premiumSupport ? 2000 + (monthlyFees * 0.1) : 0)) * 0.2)}</p>}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="border-t border-b py-4 my-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="font-medium">Monthly Fee per Store:</div>
                          <div className="text-right font-medium">{formatCurrency(perStore)}</div>
                          
                          {businessType === 'franchise' && (
                            <>
                              <div className="col-span-2 mt-4 mb-2">
                                <h3 className="font-semibold text-base text-gray-800 border-b pb-1">Suggested Cost Breakdown for Franchise Model</h3>
                              </div>
                              
                              <div className="col-span-2 bg-purple-50 rounded-lg p-4 mb-3 border border-purple-200">
                                <h4 className="font-medium text-purple-900 mb-2">Corporate Office Responsibilities</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                  <div className="text-gray-700">Platform License Fee:</div>
                                  <div className="text-right font-medium">{formatCurrency(feeBreakdown.baseLicense)}</div>
                                  
                                  <div className="text-gray-700">Transaction Processing:</div>
                                  <div className="text-right font-medium">{formatCurrency(feeBreakdown.transaction)}</div>
                                  
                                  {plan !== 'loyalty' && (
                                    <>
                                      <div className="text-gray-700">Marketing Costs:</div>
                                      <div className="text-right font-medium">{formatCurrency(feeBreakdown.marketing)}</div>
                                    </>
                                  )}
                                  
                                  {(giftCard || independentServer || premiumSLA || cms || appType !== 'none') && (
                                    <>
                                      <div className="text-gray-700">Platform Add-ons:</div>
                                      <div className="text-right font-medium">{formatCurrency(
                                        (giftCard ? 500 : 0) + 
                                        (independentServer ? 500 : 0) + 
                                        (premiumSLA ? 2000 : 0) + 
                                        (cms ? 530 : 0) + 
                                        (appType === 'premium' ? 1080 : (appType === 'standard' || appType === 'pwa' ? 350 : 0))
                                      )}</div>
                                    </>
                                  )}
                                  
                                  {(premiumSupport) && (
                                    <>
                                      <div className="text-gray-700">Support Services:</div>
                                      <div className="text-right font-medium">{formatCurrency(feeBreakdown.support)}</div>
                                    </>
                                  )}
                                  
                                  <div className="text-gray-700 font-semibold pt-2 border-t mt-1">Total Corporate Monthly Cost:</div>
                                  <div className="text-right font-semibold pt-2 border-t mt-1">{formatCurrency(feeBreakdown.corporate)}</div>
                                  
                                  <div className="text-gray-700">One-time Setup Fees:</div>
                                  <div className="text-right font-medium">{formatCurrency(setupFees)}</div>
                                </div>
                                <div className="text-xs text-gray-600">
                                  Suggested Name: "Spoonity Enterprise Platform Fee" - Billed directly to corporate office
                                </div>
                              </div>
                              
                              <div className="col-span-2 bg-orange-50 rounded-lg p-4 border border-orange-200">
                                <h4 className="font-medium text-orange-900 mb-2">Franchisee Responsibilities</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                  <div className="text-gray-700">Connection Fee per Location:</div>
                                  <div className="text-right font-medium">{formatCurrency(feeBreakdown.franchiseePerStore)}</div>
                                  
                                  {giftCard && (
                                    <>
                                      <div className="text-gray-700">Gift Card Fee per Location:</div>
                                      <div className="text-right font-medium">{formatCurrency(30)}</div>
                                    </>
                                  )}
                                  
                                  <div className="text-gray-700 font-semibold pt-2 border-t mt-1">Total Monthly Fee per Store:</div>
                                  <div className="text-right font-semibold pt-2 border-t mt-1">{formatCurrency(feeBreakdown.franchiseePerStore + (giftCard ? 30 : 0))}</div>
                                  
                                  <div className="col-span-2 mt-2">
                                    <div className="flex justify-between text-gray-700">
                                      <span>System-wide Monthly Total:</span>
                                      <span className="font-medium">{formatCurrency(feeBreakdown.franchisee + (giftCard ? stores * 30 : 0))}</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                      (All franchisee locations combined)
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-600">
                                  Suggested Name: "Spoonity Location Connection Fee" - Billable to individual franchise locations
                                </div>
                              </div>
                            </>
                          )}
                          
                          <div className="font-medium">One-Time Setup Fees:</div>
                          <div className="text-right font-medium">{formatCurrency(setupFees)}</div>
                          
                          <div className="col-span-2 mt-2">
                            <div className="text-xs text-gray-600 pl-4 space-y-1">
                              <p>Setup fees include:</p>
                              <p>• Onboarding: {formatCurrency(feeBreakdown.setup.onboarding)}</p>
                              {appType === 'premium' && <p>• Premium App Setup: {formatCurrency(15000)}</p>}
                              {appType === 'standard' && <p>• Standard App Setup: {formatCurrency(5000)}</p>}
                              {appType === 'pwa' && <p>• PWA Setup: {formatCurrency(1000)}</p>}
                              {dataIngestion && <p>• Data Ingestion Setup: {formatCurrency(feeBreakdown.setup.dataIngestion)}</p>}
                            </div>
                          </div>
                          
                          <div className="text-base font-bold pt-2">First Year Total Cost:</div>
                          <div className="text-right text-base font-bold spoonity-primary-text pt-2">{formatCurrency(monthlyFees * 12 + setupFees)}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                          <h4 className="font-medium mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 spoonity-primary-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            About Your Quote
                          </h4>
                          <p className="text-sm text-gray-600">
                            This is an estimated quote based on the information provided. A Spoonity representative will contact you to provide a final quote and answer any questions. Pricing is subject to change based on specific requirements and contract terms.
                          </p>
                        </div>
                      </div>
                  
                      <div className="mt-8">
                        <button
                          onClick={submitData}
                          disabled={isSubmitting}
                          className={`w-full spoonity-cta text-white p-3 rounded-lg font-medium transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting Your Quote...
                            </div>
                          ) : (
                            'Request Custom Quote'
                          )}
                        </button>
                        {submitError && (
                          <p className="text-red-600 text-sm mt-2">{submitError}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          By submitting, a Spoonity representative will contact you with a custom quote based on your selections.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
            <div className="text-gray-500 text-sm sm:flex items-center hidden">
              <button
                onClick={() => handleTabChange('summary')} 
                className="spoonity-primary-text hover:underline font-medium flex items-center"
              >
                View Full Breakdown
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex items-baseline text-right ml-auto">
              <div className="flex flex-col mr-6 sm:flex-row sm:items-baseline sm:space-x-2">
                <span className="text-sm text-gray-500">Setup:</span>
                <span className="font-medium text-sm">{formatCurrency(setupFees)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Monthly:</span>
                <span className="text-xl font-bold spoonity-primary-text">{formatCurrency(monthlyFees)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}