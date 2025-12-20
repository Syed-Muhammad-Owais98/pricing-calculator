import React from "react";
import { smsRates, countryDialCodes } from "./data";

interface LoginFormProps {
  token: string;
  setToken: (value: string) => void;
  tokenError: string;
  setTokenError: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  otherCountry: string;
  setOtherCountry: (value: string) => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  company: string;
  setCompany: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  businessType: string;
  setBusinessType: (value: string) => void;
  onLogin: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  token,
  setToken,
  tokenError,
  setTokenError,
  country,
  setCountry,
  otherCountry,
  setOtherCountry,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  company,
  setCompany,
  role,
  setRole,
  businessType,
  setBusinessType,
  onLogin,
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="border rounded-lg shadow-sm overflow-hidden">
        <div className="spoonity-primary p-6 text-white text-center">
          <h1 className="text-2xl font-bold mb-1">Spoonity</h1>
          <p className="text-white opacity-90">Pricing Calculator</p>
        </div>

        <div className="p-4 border-b spoonity-form">
          <h2 className="text-lg font-medium">
            Please enter your information to continue
          </h2>
          <p className="text-sm text-gray-600">
            We'll use this to provide you with a personalized quote
          </p>
        </div>

        <form onSubmit={onLogin} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="token"
              >
                Access Token
              </label>
              <input
                id="token"
                type="text"
                className={`w-full border rounded-md p-2.5 input-field ${
                  tokenError ? "border-red-500" : ""
                }`}
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setTokenError("");
                }}
                required
                placeholder="Enter your access token"
              />
              {tokenError && (
                <p className="text-red-500 text-xs mt-1">{tokenError}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="country"
              >
                Country
              </label>
              <select
                id="country"
                className="w-full border rounded-md p-2.5 input-field"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  if (e.target.value === "Other") {
                    setOtherCountry("");
                  }
                }}
                required
              >
                {Object.keys(smsRates).map((countryName) => (
                  <option key={countryName} value={countryName}>
                    {countryName}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            {country === "Other" && (
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="otherCountry"
                >
                  Please Specify Country
                </label>
                <input
                  id="otherCountry"
                  type="text"
                  className="w-full border rounded-md p-2.5 input-field"
                  value={otherCountry}
                  onChange={(e) => setOtherCountry(e.target.value)}
                  required
                  placeholder="Enter your country"
                />
              </div>
            )}

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="w-full border rounded-md p-2.5 input-field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John (optional)"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="w-full border rounded-md p-2.5 input-field"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe (optional)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full border rounded-md p-2.5 input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Cell Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full border rounded-md p-2.5 input-field"
              value={phone}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numbers and '+' symbol
                if (/^[+\d]*$/.test(value)) {
                  setPhone(value);
                }
              }}
              placeholder={
                country !== "Other"
                  ? `${countryDialCodes[country]} followed by your number (optional)`
                  : "Enter phone number (optional)"
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              {country !== "Other"
                ? `Country code ${countryDialCodes[country]} will be automatically added`
                : "Please include country code"}
            </p>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="company"
            >
              Company Name
            </label>
            <input
              id="company"
              type="text"
              className="w-full border rounded-md p-2.5 input-field"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Spoonity (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="role">
              Your Role
            </label>
            <input
              id="role"
              type="text"
              className="w-full border rounded-md p-2.5 input-field"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Marketing Manager (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Business Type
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="corporate"
                  name="businessType"
                  value="corporate"
                  checked={businessType === "corporate"}
                  onChange={() => setBusinessType("corporate")}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <label
                  htmlFor="corporate"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Corporately Owned
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="franchise"
                  name="businessType"
                  value="franchise"
                  checked={businessType === "franchise"}
                  onChange={() => setBusinessType("franchise")}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <label
                  htmlFor="franchise"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Franchised
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full spoonity-cta text-white py-2.5 px-4 rounded-md font-medium transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            onClick={(e) => onLogin(e)}
          >
            Access Calculator
          </button>

          <p className="text-xs text-gray-500 mt-4">
            By continuing, you agree that we may use your information to
            contact you about Spoonity services.
          </p>
        </form>
      </div>
    </div>
  );
};
