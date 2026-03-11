import React from "react";
import { TotalsSectionProps } from "../types";
import { formatCurrency } from "../../utils";

export const TotalsSection: React.FC<TotalsSectionProps> = ({
  monthlyFees,
  setupFees,
  stores,
  feeBreakdown,
}) => {
  return (
    <>
      <div className="border-t pt-2 mt-2 flex justify-between text-sm">
        <span className="text-gray-600">Subtotal (before discounts):</span>
        <span className="font-medium">
          {formatCurrency((monthlyFees || 0) + (feeBreakdown.discount || 0))}
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
        <span className="font-medium">{formatCurrency(setupFees)}</span>
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
          {formatCurrency(stores > 0 ? monthlyFees / stores : 0)}
        </span>
      </div>
    </>
  );
};

