import React from "react";

interface CalculatorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const CalculatorTabs: React.FC<CalculatorTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b">
      <div className="flex">
        <button
          className={`px-4 py-3 tab-button ${
            activeTab === "inputs"
              ? "active spoonity-primary-text font-medium"
              : "text-gray-600 hover:spoonity-primary-text"
          }`}
          onClick={() => onTabChange("inputs")}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Basic Info
          </div>
        </button>
        <button
          className={`px-4 py-3 tab-button ${
            activeTab === "addons"
              ? "active spoonity-primary-text font-medium"
              : "text-gray-600 hover:spoonity-primary-text"
          }`}
          onClick={() => onTabChange("addons")}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add-ons
          </div>
        </button>
        <button
          className={`px-4 py-3 tab-button ${
            activeTab === "summary"
              ? "active spoonity-primary-text font-medium"
              : "text-gray-600 hover:spoonity-primary-text"
          }`}
          onClick={() => onTabChange("summary")}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Summary
          </div>
        </button>
      </div>
    </div>
  );
};

