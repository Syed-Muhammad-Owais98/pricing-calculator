import React from "react";
import { TransactionBreakdownProps } from "../types";
import { formatCurrency, getTransactionFeeBreakdown } from "../../utils";

export const TransactionBreakdown: React.FC<TransactionBreakdownProps> = ({
  stores,
  transactions,
}) => {
  const totalVolume = Math.round(0.25 * (stores * transactions));

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium mb-2 text-sm">
        Transaction Processing Breakdown
      </h4>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">
            Total Volume: {totalVolume.toLocaleString()} transactions
          </span>
        </div>
        {getTransactionFeeBreakdown(totalVolume).map((tier, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-600">
              {tier.volume.toLocaleString()} transactions ($
              {tier.rate.toFixed(1)}/transaction):
            </span>
            <span className="font-medium">{formatCurrency(tier.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

