"use client";

import React, { useState } from "react";
import { seedPricingData } from "../utils/seedPricing";

export default function SeedDataPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const handleSeed = async () => {
    setStatus("loading");
    setLogs((prev) => [...prev, "Starting seeding process..."]);
    
    try {
      // Override console.log to capture output
      const originalLog = console.log;
      console.log = (...args) => {
        setLogs((prev) => [...prev, args.join(" ")]);
        originalLog(...args);
      };

      const result = await seedPricingData();
      
      // Restore console.log
      console.log = originalLog;

      if (result.success) {
        setStatus("success");
        setLogs((prev) => [...prev, "✅ " + result.message]);
      } else {
        setStatus("error");
        setLogs((prev) => [...prev, "❌ Error: " + JSON.stringify(result.error)]);
      }
    } catch (err) {
      setStatus("error");
      setLogs((prev) => [...prev, "❌ Exception: " + String(err)]);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Seed Pricing Data</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to upload the configuration from <code>pricing_config.json</code> to your Firestore database.
        </p>
        
        <button
          onClick={handleSeed}
          disabled={status === "loading"}
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
            status === "loading" 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {status === "loading" ? "Seeding..." : "Start Seeding Data"}
        </button>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Execution Logs
          </h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm h-64 overflow-y-auto w-full">
            {logs.length === 0 ? (
              <span className="text-gray-500 italic">Waiting to start...</span>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0 last:pb-0">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
