import React from "react";
import { BasicFeesSectionProps } from "../types";
import { formatCurrency, getMarketingEmailBreakdown } from "../../utils";
import { planDetails } from "../../data";

export const BasicFeesSection: React.FC<BasicFeesSectionProps> = ({
  plan,
  stores,
  feeBreakdown,
  marketing,
  pushNotifications,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="space-y-2 text-gray-500">
        <p>Base License Fee</p>
        <p>Connection Fees ({stores} stores)</p>
        <p>Transaction Processing</p>
        {plan !== "loyalty" && <p>Marketing Emails</p>}
        {plan !== "loyalty" && pushNotifications && <p>Push Notifications</p>}
      </div>
      <div className="space-y-2 text-right font-medium">
        <p>
          {formatCurrency(
            feeBreakdown.net.baseLicense || planDetails[plan].base
          )}
        </p>
        <p>
          {formatCurrency(
            feeBreakdown.net.connection || feeBreakdown.connection
          )}
        </p>
        <p>
          {formatCurrency(
            feeBreakdown.net.transaction || feeBreakdown.transaction
          )}
        </p>
        {plan !== "loyalty" && (
          <p>
            {(() => {
              const selectedTier = getMarketingEmailBreakdown(marketing).find(
                (t) => t.isSelected
              );
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
  );
};

