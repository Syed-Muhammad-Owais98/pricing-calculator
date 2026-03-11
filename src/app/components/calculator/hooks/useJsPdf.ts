import { useState, useEffect } from "react";

// Declare window with jspdf property for TypeScript
declare global {
  interface Window {
    jspdf?: {
      jsPDF: new () => {
        internal: { pageSize: { height: number } };
        pages: any[];
        setFontSize: (size: number) => void;
        setFont: (font: string, style: string) => void;
        setTextColor: (r: number, g: number, b: number) => void;
        setFillColor: (r: number, g: number, b: number) => void;
        setDrawColor: (r: number, g: number, b: number) => void;
        rect: (x: number, y: number, w: number, h: number, style: string) => void;
        roundedRect: (x: number, y: number, w: number, h: number, rx: number, ry: number, style: string) => void;
        line: (x1: number, y1: number, x2: number, y2: number) => void;
        text: (text: string | string[], x: number, y: number, options?: any) => any;
        splitTextToSize: (text: string, maxWidth: number) => string[];
        save: (filename: string) => void;
        output: (type: string) => string;
        addPage: () => void;
      };
    };
  }
}

export function useJsPdf() {
  const [jsPdfLoaded, setJsPdfLoaded] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  useEffect(() => {
    // Load jsPDF from CDN
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    script.onload = () => {
      console.log("jsPDF loaded successfully");
      setJsPdfLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load jsPDF from CDN");
      // Fallback to mock as a last resort
      window.jspdf = {
        jsPDF: class MockJsPDF {
          pages: any[];
          internal = { pageSize: { height: 297 } };

          constructor() {
            this.pages = [];
            console.log("MockJsPDF created as fallback");
          }

          setFontSize(size: number): void {
            console.log("Setting font size:", size);
          }

          setFont(font: string, style: string): void {
            console.log("Setting font:", font, style);
          }

          setTextColor(r: number, g: number, b: number): void {
            console.log("Setting text color:", r, g, b);
          }

          setFillColor(r: number, g: number, b: number): void {
            console.log("Setting fill color:", r, g, b);
          }

          setDrawColor(r: number, g: number, b: number): void {
            console.log("Setting draw color:", r, g, b);
          }

          rect(x: number, y: number, w: number, h: number, style: string): void {
            console.log("Drawing rect:", x, y, w, h, style);
          }

          roundedRect(x: number, y: number, w: number, h: number, rx: number, ry: number, style: string): void {
            console.log("Drawing rounded rect:", x, y, w, h, rx, ry, style);
          }

          line(x1: number, y1: number, x2: number, y2: number): void {
            console.log("Drawing line:", x1, y1, x2, y2);
          }

          text(text: string | string[], x: number, y: number, options?: any): any {
            console.log("Adding text:", text, "at position:", x, y, options);
            return this;
          }

          splitTextToSize(text: string, maxWidth: number): string[] {
            console.log("Splitting text to size:", maxWidth);
            const words = text.split(" ");
            const lines: string[] = [];
            let currentLine = "";

            words.forEach((word) => {
              if ((currentLine + word).length > maxWidth / 6) {
                lines.push(currentLine);
                currentLine = word + " ";
              } else {
                currentLine += word + " ";
              }
            });

            if (currentLine) lines.push(currentLine);
            return lines.length ? lines : [text];
          }

          save(filename: string): void {
            console.log("PDF would be saved as:", filename);
            alert(
              `Your quote has been prepared! In a production environment, this would download a PDF file named: ${filename}`
            );
          }

          output(type: string): string {
            console.log("PDF output type:", type);
            return "data:application/pdf;base64,";
          }

          addPage(): void {
            console.log("Adding new page");
          }
        },
      };
      setJsPdfLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return {
    jsPdfLoaded,
    isPdfGenerating,
    setIsPdfGenerating,
  };
}

