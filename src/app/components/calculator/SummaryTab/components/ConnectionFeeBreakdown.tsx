import React from "react";
import { ConnectionFeeBreakdownProps } from "../types";
import { formatCurrency, getConnectionFeeBreakdown } from "../../utils";

export const ConnectionFeeBreakdown: React.FC<ConnectionFeeBreakdownProps> = ({
  stores,
  selectedConnectionTierIndex,
  setSelectedConnectionTierIndex,
  discountUnlocked,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium mb-2 text-sm">Connection Fee Breakdown</h4>
      <p className="text-xs text-gray-500 mb-2">
        {discountUnlocked
          ? `Click on any tier to select its pricing for your ${stores} stores`
          : "Enter the discount password to manually select pricing tiers."}
      </p>
      <div className="space-y-1 text-xs">
        {getConnectionFeeBreakdown(stores, selectedConnectionTierIndex).map(
          (tier: any, index: number) => (
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
                    tier.isSelected ? "text-purple-800" : "text-gray-600"
                  }`}
                >
                  {tier.tierName}: {tier.range}
                </span>
                <span className="text-xs text-gray-500">
                  {tier.isSelected
                    ? `${tier.count.toLocaleString()} stores (your volume) × $${tier.price.toFixed(
                        2
                      )}/store = ${formatCurrency(tier.count * tier.price)}`
                    : `${stores.toLocaleString()} stores × $${tier.price.toFixed(
                        2
                      )}/store = ${formatCurrency(stores * tier.price)}`}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`font-medium ${
                    tier.isSelected ? "text-purple-800" : "text-gray-600"
                  }`}
                >
                  ${tier.price.toFixed(2)}/store
                </span>
                {tier.isSelected && (
                  <div className="text-xs text-purple-600">Selected</div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

