import React from "react";
import { PlanDetails } from "./types";

interface CalculatorInputTabProps {
  plan: string;
  setPlan: (plan: string) => void;
  stores: number;
  setStores: (stores: number) => void;
  transactions: number;
  setTransactions: (transactions: number) => void;
  marketing: number;
  setMarketing: (marketing: number) => void;
  handleTabChange: (tab: string) => void;
  // Pricing configuration (dynamic from Firestore)
  planDetails: PlanDetails;
  serverAutoApplyAboveStores: number;
}

export const CalculatorInputTab: React.FC<CalculatorInputTabProps> = ({
  plan,
  setPlan,
  stores,
  setStores,
  transactions,
  setTransactions,
  marketing,
  setMarketing,
  handleTabChange,
  // Pricing configuration
  planDetails,
  serverAutoApplyAboveStores,
}) => {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Plan Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(planDetails).map(([key, details]) => (
              <div
                key={key}
                onClick={() => setPlan(key)}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  plan === key
                    ? "border-purple-500 bg-purple-50 shadow-sm"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <div className="flex items-start mb-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-2 flex items-center justify-center ${
                      plan === key ? "border-purple-500" : "border-gray-300"
                    }`}
                  >
                    {plan === key && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: "#640C6F" }}
                      ></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{details.name}</h3>
                    <p className="text-sm text-gray-600">
                      {details.description}
                    </p>
                  </div>
                </div>
                <div className="text-right font-bold spoonity-primary-text">
                  ${details.base}/mo
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <label className="block text-sm font-medium mb-2">
            Number of Stores
          </label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full border rounded-md p-2.5 input-field text-lg font-medium"
                value={stores === 0 ? "" : stores}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numbers and convert to number
                  if (/^\d*$/.test(value)) {
                    setStores(value === "" ? 0 : parseInt(value));
                  }
                }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[1, 5, 10, 25, 50, 100].map((value) => (
                <button
                  key={value}
                  onClick={() => setStores(value)}
                  className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                    stores === value
                      ? "bg-blue-100 border-blue-400 text-blue-700"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>

            <p
              className={`text-xs ${
                stores > serverAutoApplyAboveStores ? "text-amber-600 font-medium" : "text-gray-500"
              }`}
            >
              {stores > serverAutoApplyAboveStores
                ? `⚠️ More than ${serverAutoApplyAboveStores} stores requires an independent server (automatically added)`
                : "How many physical locations do you operate?"}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Transactions per Store per Month
          </label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                className="w-full border rounded-md p-2.5 input-field text-lg font-medium"
                value={transactions}
                onChange={(e) => setTransactions(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[500, 1000, 2500, 5000, 10000].map((value) => (
                <button
                  key={value}
                  onClick={() => setTransactions(value)}
                  className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                    transactions === value
                      ? "bg-purple-100 border-purple-400 spoonity-primary-text"
                      : "spoonity-form border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {value.toLocaleString()}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500">
              Average number of transactions each location processes monthly
            </p>
          </div>
        </div>

        {plan !== "loyalty" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Marketing Messages per Month
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  className="w-full border rounded-md p-2.5 input-field text-lg font-medium"
                  value={marketing}
                  onChange={(e) => setMarketing(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[5000, 10000, 50000, 100000, 500000, 1000000].map((value) => (
                  <button
                    key={value}
                    onClick={() => setMarketing(value)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                      marketing === value
                        ? "bg-purple-100 border-purple-400 spoonity-primary-text"
                        : "spoonity-form border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {value.toLocaleString()}
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Tiered pricing: $0.0006 per email (first 100K), $0.0004
                (100K-1M), $0.0002 (1M+)
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-2">
          <button
            className="spoonity-cta text-white font-medium py-2.5 px-4 rounded transition-colors duration-200 flex items-center"
            onClick={() => handleTabChange("addons")}
          >
            Continue to Add-ons
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
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
      </div>
    </div>
  );
};
