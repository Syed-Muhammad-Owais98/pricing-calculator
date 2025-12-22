import React from "react";
import { SuccessScreenProps } from "./types";
import { formatCurrency } from "../utils";
import {
  getConnectionFeeBreakdown,
  getTransactionFeeBreakdown,
  getMarketingEmailBreakdown,
} from "../utils";
import { planDetails, whatsappRates } from "../data";

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
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
  discountUnlocked,
  discountsApplied,
  itemDiscounts,
  subtotalDiscount,
  discountReason,
  setItemDiscounts,
  setSubtotalDiscount,
  setDiscountReason,
  setAppliedItemDiscounts,
  setAppliedSubtotalDiscount,
  setAppliedDiscountReason,
  setDiscountsApplied,
  selectedConnectionTierIndex,
  jsPdfLoaded,
  isPdfGenerating,
  onGeneratePDF,
  onReset,
}) => {
  return (
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
                  {getConnectionFeeBreakdown(
                    stores,
                    selectedConnectionTierIndex
                  ).map((tier: any, index: number) => (
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
                  ))}
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
                onClick={onGeneratePDF}
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
              onClick={onReset}
              className="text-gray-500 hover:spoonity-primary-text text-sm underline"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

