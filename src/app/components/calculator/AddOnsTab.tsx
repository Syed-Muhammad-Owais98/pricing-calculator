import React from "react";
import { AddOnsTabProps } from "./types";
import { smsRates, whatsappRates, whatsappAvailableCountries } from "./data";
import { formatCurrency, calculateWhatsappStoreFeeTiers } from "./utils";

export const AddOnsTab: React.FC<AddOnsTabProps> = ({
  // SMS props
  smsEnabled,
  setSmsEnabled,
  smsCountry,
  setSmsCountry,
  smsMessages,
  setSmsMessages,

  // WhatsApp props
  whatsappEnabled,
  setWhatsappEnabled,
  whatsappCountry,
  setWhatsappCountry,
  whatsappMarketTicket,
  setWhatsappMarketTicket,
  whatsappUtility,
  setWhatsappUtility,
  whatsappMarketing,
  setWhatsappMarketing,
  whatsappOtp,
  setWhatsappOtp,

  // App props
  appType,
  setAppType,
  cms,
  setCms,

  // Other add-ons
  giftCard,
  setGiftCard,
  pushNotifications,
  setPushNotifications,
  independentServer,
  setIndependentServer,
  premiumSLA,
  setPremiumSLA,
  premiumSupport,
  setPremiumSupport,
  dataIngestion,
  setDataIngestion,

  // Other props
  plan,
  stores,
  transactions,
  country,
  feeBreakdown,
  handleTabChange,
}) => {
  return (
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
                Send verification codes via SMS for secure authentication
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
                {Object.keys(smsRates).map((countryOption) => (
                  <option key={countryOption} value={countryOption}>
                    {countryOption} (${smsRates[countryOption].toFixed(5)}/msg)
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
                {Math.round(stores * transactions * 0.1).toLocaleString()}{" "}
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
                    {Object.keys(whatsappRates).map((countryOption) => (
                      <option key={countryOption} value={countryOption}>
                        {countryOption}
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
                        {whatsappRates[whatsappCountry].marketTicket.toFixed(4)}
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
                          setWhatsappMarketTicket(parseInt(e.target.value) || 0)
                        }
                        placeholder="# of messages"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Utility Campaign Messages ($
                        {whatsappRates[whatsappCountry].utility.toFixed(2)}
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
                          setWhatsappUtility(parseInt(e.target.value) || 0)
                        }
                        placeholder="# of messages"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Marketing Campaign Messages ($
                        {whatsappRates[whatsappCountry].marketing.toFixed(2)}
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
                          setWhatsappMarketing(parseInt(e.target.value) || 0)
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
                    Default calculation: 10% of total monthly transactions (
                    {Math.round(stores * transactions * 0.1).toLocaleString()}{" "}
                    messages) for receipts, utility, and OTP messages
                  </div>
                </div>

                <div className="pt-2 text-xs bg-gray-50 p-3 rounded-md">
                  <div className="font-medium mb-1">WhatsApp Fee Summary:</div>
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
                      {whatsappRates[whatsappCountry].marketTicket.toFixed(4)}
                      ):
                    </span>
                    <span className="text-right">
                      {formatCurrency(
                        whatsappMarketTicket *
                          whatsappRates[whatsappCountry].marketTicket
                      )}
                    </span>

                    <span className="pl-2">
                      • Utility Messages ({whatsappUtility.toLocaleString()} × $
                      {whatsappRates[whatsappCountry].utility.toFixed(2)}
                      ):
                    </span>
                    <span className="text-right">
                      {formatCurrency(
                        whatsappUtility * whatsappRates[whatsappCountry].utility
                      )}
                    </span>

                    <span className="pl-2">
                      • Marketing Messages ({whatsappMarketing.toLocaleString()}{" "}
                      × ${whatsappRates[whatsappCountry].marketing.toFixed(2)}
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
                    appType === "none" ? "border-blue-500" : "border-gray-300"
                  }`}
                >
                  {appType === "none" && (
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">No App</h3>
                  <p className="text-sm text-gray-600">
                    We'll be using our own website, app or use physical cards
                    only
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-900">$0</div>
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
                    appType === "pwa" ? "border-blue-500" : "border-gray-300"
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
                  onChange={(e) => setPushNotifications(e.target.checked)}
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
                <p className="text-sm text-gray-600">20% of monthly fees</p>
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
                <label htmlFor="cms" className="font-medium cursor-pointer">
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
  );
};
