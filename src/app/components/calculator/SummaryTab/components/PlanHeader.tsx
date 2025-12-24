import React from "react";
import { PlanHeaderProps } from "../types";
import { formatCurrency } from "../../utils";

export const PlanHeader: React.FC<PlanHeaderProps> = ({
  planName,
  monthlyFees,
  planDescription,
}) => {
  return (
    <div>
      <div
        style={{ backgroundColor: "#9F62A6" }}
        className="rounded-t-lg p-6 text-white"
      >
        <h3 className="text-xl font-bold mb-1">{planName}</h3>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-sm opacity-90">Your estimated price</span>
          <div>
            <span className="text-3xl font-bold">
              {formatCurrency(monthlyFees)}
            </span>
            <span className="text-sm opacity-90">/month</span>
          </div>
        </div>
      </div>
      <div className="border border-t-0 rounded-b-lg bg-white p-6">
        <p className="text-sm text-gray-600 mb-6">{planDescription}</p>
      </div>
    </div>
  );
};

