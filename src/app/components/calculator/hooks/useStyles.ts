import { useEffect } from "react";

export function useStyles() {
  useEffect(() => {
    // Add Google Fonts link
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Add custom CSS for font and improved styling
    const style = document.createElement("style");
    style.textContent = `
      * {
        font-family: 'Figtree', sans-serif;
      }
      
      .input-field {
        transition: border-color 0.2s ease;
      }
      
      .input-field:focus {
        border-color: #640C6F;
        box-shadow: 0 0 0 2px rgba(100, 12, 111, 0.2);
        outline: none;
      }
      
      .tab-button {
        position: relative;
        transition: all 0.2s ease;
      }
      
      .tab-button::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: transparent;
        transition: background-color 0.2s ease;
      }
      
      .tab-button.active::after {
        background-color: #640C6F;
      }
      
      .checkbox-custom {
        appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid #CBD5E1;
        border-radius: 4px;
        margin-right: 8px;
        position: relative;
        transition: all 0.2s ease;
        cursor: pointer;
      }
      
      .checkbox-custom:checked {
        background-color: #640C6F;
        border-color: #640C6F;
      }
      
      .checkbox-custom:checked::after {
        content: '';
        position: absolute;
        left: 5px;
        top: 2px;
        width: 6px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
      
      .checkbox-custom:disabled {
        background-color: #F7F7F7;
        border-color: #CBD5E1;
        cursor: not-allowed;
      }

      /* Custom brand colors */
      .spoonity-primary {
        background-color: #640C6F;
      }
      
      .spoonity-cta {
        background-color: #FF7E3D;
      }
      
      .spoonity-cta:hover {
        background-color: #e86d2f;
      }
      
      .spoonity-form {
        background-color: #F7F7F7;
      }
      
      .spoonity-primary-text {
        color: #640C6F;
      }
      
      .spoonity-cta-text {
        color: #FF7E3D;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);
}

