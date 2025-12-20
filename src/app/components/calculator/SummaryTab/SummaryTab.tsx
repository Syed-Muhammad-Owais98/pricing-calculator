import React from "react";
import { SummaryTabProps } from "./types";
import { planDetails } from "../data";
import {
  PlanHeader,
  BasicFeesSection,
  ConnectionFeeBreakdown,
  TransactionBreakdown,
  MarketingBreakdown,
  AddOnsSection,
  SetupFeeBreakdown,
  TotalsSection,
  SubmitSection,
  DiscountSection,
  AboutQuoteSection,
} from "./components";

export const SummaryTab: React.FC<SummaryTabProps> = ({
  // Plan and basic info
  plan,
  stores,
  transactions,
  marketing,
  monthlyFees,
  setupFees,
  feeBreakdown,

  // Add-on states
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

  // Discount states
  discountUnlocked,
  setDiscountUnlocked,
  showDiscountInput,
  setShowDiscountInput,
  discountPassword,
  setDiscountPassword,
  showItemDiscounts,
  setShowItemDiscounts,
  subtotalDiscount,
  setSubtotalDiscount,
  discountReason,
  setDiscountReason,
  itemDiscounts,
  setItemDiscounts,
  discountsApplied,
  setDiscountsApplied,
  setAppliedItemDiscounts,
  setAppliedSubtotalDiscount,
  setAppliedDiscountReason,

  // Connection tier selection
  selectedConnectionTierIndex,
  setSelectedConnectionTierIndex,

  // Submit handling
  isSubmitting,
  submitError,
  submitData,
}) => {
  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Plan Header with Price */}
        <div>
          <div
            style={{ backgroundColor: "#9F62A6" }}
            className="rounded-t-lg p-6 text-white"
          >
            <h3 className="text-xl font-bold mb-1">{planDetails[plan].name}</h3>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-sm opacity-90">Your estimated price</span>
              <div>
                <span className="text-3xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(monthlyFees)}
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
              {/* Basic Fees Section */}
              <BasicFeesSection
                plan={plan}
                stores={stores}
                feeBreakdown={feeBreakdown}
                marketing={marketing}
                pushNotifications={pushNotifications}
              />

              {/* Connection Fee Tier Breakdown */}
              <ConnectionFeeBreakdown
                stores={stores}
                selectedConnectionTierIndex={selectedConnectionTierIndex}
                setSelectedConnectionTierIndex={setSelectedConnectionTierIndex}
                discountUnlocked={discountUnlocked}
              />

              {/* Transaction Processing Tier Breakdown */}
              <TransactionBreakdown stores={stores} transactions={transactions} />

              {/* Marketing Email Tier Breakdown */}
              {plan !== "loyalty" && <MarketingBreakdown marketing={marketing} />}

              {/* Add-ons Section */}
              <AddOnsSection
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
                stores={stores}
                monthlyFees={monthlyFees}
                feeBreakdown={feeBreakdown}
              />

              {/* Setup Fee Breakdown */}
              <SetupFeeBreakdown
                feeBreakdown={feeBreakdown}
                appType={appType}
                dataIngestion={dataIngestion}
              />

              {/* Totals Section */}
              <TotalsSection
                monthlyFees={monthlyFees}
                setupFees={setupFees}
                stores={stores}
                feeBreakdown={feeBreakdown}
              />
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <SubmitSection
          isSubmitting={isSubmitting}
          submitError={submitError}
          submitData={submitData}
        />

        {/* Discount Section */}
        <DiscountSection
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
          feeBreakdown={feeBreakdown}
        />

        {/* About Quote Section */}
        <AboutQuoteSection />
      </div>
    </div>
  );
};

