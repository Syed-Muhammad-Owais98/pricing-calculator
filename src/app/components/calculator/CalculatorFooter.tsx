import React from "react";
import { formatCurrency } from "./utils";
import { FeeBreakdown } from "./types";

interface CalculatorFooterProps {
  monthlyFees: number;
  setupFees: number;
  feeBreakdown: FeeBreakdown;
  discountsApplied: boolean;
  onViewBreakdown: () => void;
}

export const CalculatorFooter: React.FC<CalculatorFooterProps> = ({
  monthlyFees,
  setupFees,
  feeBreakdown,
  discountsApplied,
  onViewBreakdown,
}) => {
  return (
    <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
      <div className="text-gray-500 text-sm sm:flex items-center hidden">
        <button
          onClick={onViewBreakdown}
          className="spoonity-primary-text hover:underline font-medium flex items-center"
        >
          View Full Breakdown
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
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
      <div className="flex items-baseline text-right ml-auto">
        <div className="flex flex-col mr-6 sm:flex-row sm:items-baseline sm:space-x-2">
          <span className="text-sm text-gray-500">Setup:</span>
          <span className="font-medium text-sm">
            {formatCurrency(setupFees)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Monthly:</span>
          {discountsApplied && (feeBreakdown.discount || 0) > 0 ? (
            <div className="flex items-baseline gap-2 sm:gap-3 justify-end">
              <span className="text-xs text-gray-600 whitespace-nowrap">
                Before:{" "}
                <span className="line-through text-gray-400">
                  {formatCurrency(
                    (monthlyFees || 0) + (feeBreakdown.discount || 0)
                  )}
                </span>
              </span>
              <span className="text-base sm:text-xl font-bold spoonity-primary-text whitespace-nowrap">
                After: {formatCurrency(monthlyFees)}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold spoonity-primary-text">
              {formatCurrency(monthlyFees)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

