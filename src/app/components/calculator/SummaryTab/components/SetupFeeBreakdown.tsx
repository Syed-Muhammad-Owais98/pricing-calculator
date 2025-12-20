import React from "react";
import { SetupFeeBreakdownProps } from "../types";
import { formatCurrency } from "../../utils";

export const SetupFeeBreakdown: React.FC<SetupFeeBreakdownProps> = ({
  feeBreakdown,
  appType,
  dataIngestion,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium mb-2 text-sm">Setup Fee Breakdown</h4>
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
            <span className="text-gray-600">Premium App Setup:</span>
            <span className="font-medium">{formatCurrency(15000)}</span>
          </div>
        )}
        {appType === "standard" && (
          <div className="flex justify-between">
            <span className="text-gray-600">Standard App Setup:</span>
            <span className="font-medium">{formatCurrency(5000)}</span>
          </div>
        )}
        {appType === "pwa" && (
          <div className="flex justify-between">
            <span className="text-gray-600">PWA Setup:</span>
            <span className="font-medium">{formatCurrency(1000)}</span>
          </div>
        )}
        {dataIngestion && (
          <div className="flex justify-between">
            <span className="text-gray-600">Data Ingestion Setup:</span>
            <span className="font-medium">
              {formatCurrency(feeBreakdown.setup.dataIngestion)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

