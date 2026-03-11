import { useEffect, useCallback } from "react";
import { TOKEN_EXPIRY, TOKEN_CHECK_INTERVAL } from "../constants";

interface TokenManagementProps {
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setCompany: (value: string) => void;
  setRole: (value: string) => void;
  setCountry: (value: string) => void;
  setOtherCountry: (value: string) => void;
  setBusinessType: (value: string) => void;
  setIsLoggedIn: (value: boolean) => void;
  resetAllStates: () => void;
}

export function useTokenManagement({
  setFirstName,
  setLastName,
  setEmail,
  setPhone,
  setCompany,
  setRole,
  setCountry,
  setOtherCountry,
  setBusinessType,
  setIsLoggedIn,
  resetAllStates,
}: TokenManagementProps) {
  // Function to validate token
  const validateToken = useCallback(async (inputToken: string): Promise<boolean> => {
    try {
      const decodedString = atob(inputToken);
      const tokenData = JSON.parse(decodedString);
      console.log("aaaaa", tokenData.paraphrase)
      const paraphraseCheck = tokenData.paraphrase === process.env.NEXT_PUBLIC_PARAPHASE_KEY;
      const expiryCheck = new Date(tokenData.expiresAt) > new Date();
      return paraphraseCheck && expiryCheck;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  }, []);

  // Function to save token and user data to localStorage
  const saveTokenAndData = useCallback(
    (
      token: string,
      userData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        company: string;
        role: string;
        country: string;
        businessType: string;
      }
    ) => {
      const expiryTime = Date.now() + TOKEN_EXPIRY;
      localStorage.setItem("spoonity_token", token);
      localStorage.setItem("spoonity_token_expiry", expiryTime.toString());
      localStorage.setItem("spoonity_user_data", JSON.stringify(userData));
    },
    []
  );

  // Function to check token expiry
  const checkTokenExpiry = useCallback(() => {
    const expiryTime = localStorage.getItem("spoonity_token_expiry");
    if (expiryTime && parseInt(expiryTime) < Date.now()) {
      localStorage.removeItem("spoonity_token");
      localStorage.removeItem("spoonity_token_expiry");
      localStorage.removeItem("spoonity_user_data");
      setIsLoggedIn(false);
      resetAllStates();
    }
  }, [setIsLoggedIn, resetAllStates]);

  // Check for existing token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("spoonity_token");
    const expiryTime = localStorage.getItem("spoonity_token_expiry");
    const userData = localStorage.getItem("spoonity_user_data");

    if (
      storedToken &&
      expiryTime &&
      parseInt(expiryTime) > Date.now() &&
      userData
    ) {
      const parsedUserData = JSON.parse(userData);
      setFirstName(parsedUserData.firstName);
      setLastName(parsedUserData.lastName);
      setEmail(parsedUserData.email);
      setPhone(parsedUserData.phone);
      setCompany(parsedUserData.company);
      setRole(parsedUserData.role);
      setCountry(
        parsedUserData.country === "Other" ? "Other" : parsedUserData.country
      );
      setOtherCountry(
        parsedUserData.country === "Other" ? parsedUserData.country : ""
      );
      setBusinessType(parsedUserData.businessType);
      setIsLoggedIn(true);
    }

    const intervalId = setInterval(checkTokenExpiry, TOKEN_CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, [
    checkTokenExpiry,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setCompany,
    setRole,
    setCountry,
    setOtherCountry,
    setBusinessType,
    setIsLoggedIn,
  ]);

  return {
    validateToken,
    saveTokenAndData,
    checkTokenExpiry,
  };
}

