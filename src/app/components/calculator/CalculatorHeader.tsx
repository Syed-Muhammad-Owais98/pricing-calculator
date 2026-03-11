import React from "react";

interface CalculatorHeaderProps {
  firstName: string;
  lastName: string;
  onSignOut: () => void;
}

export const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({
  firstName,
  lastName,
  onSignOut,
}) => {
  return (
    <div className="spoonity-primary p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Spoonity</h1>
          <p className="text-white opacity-90">Pricing Calculator</p>
        </div>
        <div className="text-sm text-right sm:block">
          <div className="text-white opacity-90">Welcome,</div>
          <div className="font-medium text-white">
            {firstName} {lastName} •{" "}
            <button
              onClick={onSignOut}
              className="text-white opacity-90 hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

