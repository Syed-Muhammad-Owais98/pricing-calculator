import React from "react";
import { AddOnsSectionProps } from "../types";
import { formatCurrency } from "../../utils";
import { whatsappRates } from "../../data";

export const AddOnsSection: React.FC<AddOnsSectionProps> = ({
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
  stores,
  monthlyFees,
  feeBreakdown,
}) => {
  const hasAddOns =
    giftCard ||
    smsEnabled ||
    whatsappEnabled ||
    independentServer ||
    premiumSLA ||
    premiumSupport ||
    cms ||
    appType !== "none" ||
    dataIngestion;

  if (!hasAddOns) return null;

  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="font-medium mb-3">Add-on Services:</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2 text-gray-500">
          {giftCard && (
            <>
              <p>Gift Card Base Fee</p>
              <p>Gift Card Per-Store Fee ({stores} stores @ $30/store)</p>
            </>
          )}
          {smsEnabled && smsMessages && parseInt(smsMessages) > 0 && (
            <p>SMS Messages ({smsMessages})</p>
          )}
          {whatsappEnabled && (
            <>
              <p>WhatsApp Base Platform Fee</p>
              <p>WhatsApp Per-Store Fee ({stores} stores)</p>
              <p className="pl-4">
                • Digital Receipts ({whatsappMarketTicket.toLocaleString()}{" "}
                messages)
              </p>
              <p className="pl-4">
                • Utility Messages ({whatsappUtility.toLocaleString()} messages)
              </p>
              <p className="pl-4">
                • Marketing Messages ({whatsappMarketing.toLocaleString()}{" "}
                messages)
              </p>
              <p className="pl-4">
                • OTP Messages ({whatsappOtp.toLocaleString()} messages)
              </p>
            </>
          )}
          {independentServer && <p>Independent Server</p>}
          {premiumSLA && <p>Premium SLA</p>}
          {cms && <p>Content Management System</p>}
          {appType === "premium" && <p>Premium App Subscription</p>}
          {appType === "standard" && <p>Standard App Subscription</p>}
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
              <p>{formatCurrency(feeBreakdown.whatsapp.perStore)}</p>
              <p className="pr-4">
                {formatCurrency(
                  whatsappMarketTicket * whatsappRates[whatsappCountry].marketTicket
                )}
              </p>
              <p className="pr-4">
                {formatCurrency(
                  whatsappUtility * whatsappRates[whatsappCountry].utility
                )}
              </p>
              <p className="pr-4">
                {formatCurrency(
                  whatsappMarketing * whatsappRates[whatsappCountry].marketing
                )}
              </p>
              <p className="pr-4">
                {formatCurrency(whatsappOtp * whatsappRates[whatsappCountry].otp)}
              </p>
            </>
          )}
          {independentServer && <p>{formatCurrency(feeBreakdown.server)}</p>}
          {premiumSLA && <p>{formatCurrency(feeBreakdown.sla)}</p>}
          {cms && <p>{formatCurrency(feeBreakdown.cms)}</p>}
          {appType === "premium" && <p>{formatCurrency(feeBreakdown.app)}</p>}
          {appType === "standard" && <p>{formatCurrency(feeBreakdown.app)}</p>}
          {appType === "pwa" && <p>{formatCurrency(feeBreakdown.app)}</p>}
          {premiumSupport && <p>{formatCurrency(feeBreakdown.support)}</p>}
          {dataIngestion && (
            <p>
              {formatCurrency(
                (monthlyFees - (premiumSupport ? 2000 + monthlyFees * 0.1 : 0)) *
                  0.2
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

