import React from "react";

export const AboutQuoteSection: React.FC = () => {
  return (
    <div className="mt-8">
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium mb-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1 spoonity-primary-text"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          About Your Quote
        </h4>
        <p className="text-sm text-gray-600">
          This is an estimated quote based on the information provided. A
          Spoonity representative will contact you to provide a final quote and
          answer any questions. Pricing is subject to change based on specific
          requirements and contract terms.
        </p>
      </div>
    </div>
  );
};

