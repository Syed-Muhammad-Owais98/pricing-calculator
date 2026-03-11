import React from "react";
import { SubmitSectionProps } from "../types";

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isSubmitting,
  submitError,
  submitData,
}) => {
  return (
    <div className="text-center">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={submitData}
          disabled={isSubmitting}
          className={`w-full spoonity-cta text-white p-3 rounded-lg font-medium transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting Your Quote...
            </div>
          ) : (
            "Request Custom Quote"
          )}
        </button>
        {submitError && (
          <p className="text-red-600 text-sm mt-2">{submitError}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          By submitting, a Spoonity representative will contact you with a
          custom quote based on your selections.
        </p>
      </div>
    </div>
  );
};

