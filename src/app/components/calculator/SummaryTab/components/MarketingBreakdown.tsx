import React from "react";
import { MarketingBreakdownProps } from "../types";
import { formatCurrency, getMarketingEmailBreakdown } from "../../utils";

export const MarketingBreakdown: React.FC<MarketingBreakdownProps> = ({
  marketing,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium mb-2 text-sm">Marketing Email Breakdown</h4>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">
            Total Emails: {marketing.toLocaleString()}
          </span>
        </div>
        {getMarketingEmailBreakdown(marketing).map((tier, index) => (
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
                  tier.isSelected ? "text-purple-800" : "text-gray-600"
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
                  tier.isSelected ? "text-purple-800" : "text-gray-600"
                }`}
              >
                {formatCurrency(tier.total)}
              </span>
              <div className="text-xs text-gray-500">
                ($500 base fee included)
              </div>
              {tier.isSelected && (
                <div className="text-xs text-purple-600">Selected</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

