"use client";

import React, { useState, useEffect } from "react";
import { fetchAllPricingData, fetchPricingConfig, PricingMetadata } from "../utils/fetchPricing";

interface DocumentInfo {
  name: string;
  exists: boolean;
  data: any;
  dataType: string;
  keys?: string[];
  itemCount?: number;
}

export default function ViewPricingDataPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PricingMetadata | null>(null);
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [rawData, setRawData] = useState<Record<string, any>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, metadata } = await fetchAllPricingData();
      setMetadata(metadata);
      setRawData(data);

      // Process documents for display
      const docInfos: DocumentInfo[] = Object.entries(data).map(([name, docData]) => {
        const info: DocumentInfo = {
          name,
          exists: true,
          data: docData,
          dataType: getDataType(docData),
        };

        // Determine structure based on document type
        if (typeof docData === "object" && docData !== null) {
          const keys = Object.keys(docData);
          info.keys = keys;
          
          if (Array.isArray(docData)) {
            info.itemCount = docData.length;
          } else if (docData.tiers && Array.isArray(docData.tiers)) {
            info.itemCount = docData.tiers.length;
          } else {
            info.itemCount = keys.length;
          }
        }

        return info;
      });

      // Sort documents alphabetically, but keep _metadata at the end
      docInfos.sort((a, b) => {
        if (a.name === "_metadata") return 1;
        if (b.name === "_metadata") return -1;
        return a.name.localeCompare(b.name);
      });

      setDocuments(docInfos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const getDataType = (data: any): string => {
    if (Array.isArray(data)) return "array";
    if (data === null) return "null";
    return typeof data;
  };

  const getDocumentDescription = (name: string): string => {
    const descriptions: Record<string, string> = {
      plans: "Plan configurations (loyalty, marketing, intelligence) with base fees and descriptions",
      connection_fees: "Per-store connection fee tiers based on total store count",
      transaction_fees: "Transaction processing fee tiers based on volume",
      marketing_email_fees: "Marketing email pricing tiers with volume discounts",
      sms_rates: "SMS rates per message by country",
      whatsapp_rates: "WhatsApp platform fees, store tiers, and country-specific message rates",
      addons: "Add-on services (gift card, server, SLA, CMS, support, data ingestion, app)",
      setup_fees: "One-time setup fees for onboarding, apps, and data ingestion",
      country_dial_codes: "Phone dial codes by country",
      _metadata: "Document metadata including version and last update time",
    };
    return descriptions[name] || "No description available";
  };

  const getUsageLocation = (name: string): string => {
    const usages: Record<string, string> = {
      plans: "components/calculator/data.ts → planDetails",
      connection_fees: "components/calculator/utils.ts → calculateConnectionFees, getConnectionFeeBreakdown",
      transaction_fees: "components/calculator/utils.ts → getTransactionFeeBreakdown",
      marketing_email_fees: "components/calculator/utils.ts → getMarketingEmailBreakdown",
      sms_rates: "components/calculator/data.ts → smsRates",
      whatsapp_rates: "components/calculator/data.ts → whatsappRates, whatsappAvailableCountries + utils.ts → calculateWhatsappStoreFeeTiers",
      addons: "spoonityCalculator.tsx → calculateFees() (hardcoded values for gift card, server, SLA, etc.)",
      setup_fees: "spoonityCalculator.tsx → calculateFees() (hardcoded values for app setup, onboarding)",
      country_dial_codes: "components/calculator/data.ts → countryDialCodes",
    };
    return usages[name] || "Not mapped yet";
  };

  const toggleExpand = (docName: string) => {
    setExpandedDoc(expandedDoc === docName ? null : docName);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing data from Firestore...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Data</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Firestore Pricing Data Viewer
              </h1>
              <p className="text-gray-600">
                Collection: <code className="bg-gray-100 px-2 py-1 rounded">pricing_configuration</code>
              </p>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Metadata Card */}
        {metadata && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-3">Configuration Metadata</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Version:</span>
                <span className="ml-2 font-medium text-gray-800">{metadata.version}</span>
              </div>
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {new Date(metadata.lastUpdated).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Documents:</span>
                <span className="ml-2 font-medium text-gray-800">{metadata.sections?.length || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{documents.length}</div>
            <div className="text-sm text-gray-500">Total Documents</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {documents.filter(d => d.exists).length}
            </div>
            <div className="text-sm text-gray-500">Documents Found</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {rawData.plans ? Object.keys(rawData.plans).length : 0}
            </div>
            <div className="text-sm text-gray-500">Plans</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {rawData.sms_rates ? Object.keys(rawData.sms_rates).length : 0}
            </div>
            <div className="text-sm text-gray-500">Countries</div>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Documents in Collection</h2>
          
          {documents.map((doc) => (
            <div
              key={doc.name}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Document Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                onClick={() => toggleExpand(doc.name)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${doc.exists ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {doc.name}
                      {doc.name === "_metadata" && (
                        <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">system</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{getDocumentDescription(doc.name)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div className="text-gray-500">
                      Type: <span className="font-medium text-gray-700">{doc.dataType}</span>
                    </div>
                    {doc.itemCount !== undefined && (
                      <div className="text-gray-500">
                        Items: <span className="font-medium text-gray-700">{doc.itemCount}</span>
                      </div>
                    )}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedDoc === doc.name ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedDoc === doc.name && (
                <div className="border-t">
                  {/* Usage Location */}
                  {doc.name !== "_metadata" && (
                    <div className="bg-yellow-50 px-4 py-2 border-b">
                      <span className="text-xs text-yellow-700 font-medium">📍 Current Usage: </span>
                      <code className="text-xs text-yellow-800">{getUsageLocation(doc.name)}</code>
                    </div>
                  )}
                  
                  {/* Keys/Structure Overview */}
                  {doc.keys && doc.keys.length > 0 && (
                    <div className="bg-blue-50 px-4 py-2 border-b">
                      <span className="text-xs text-blue-700 font-medium">Keys: </span>
                      <span className="text-xs text-blue-800">{doc.keys.join(", ")}</span>
                    </div>
                  )}
                  
                  {/* JSON Data */}
                  <div className="p-4 bg-gray-900 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                      {JSON.stringify(doc.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Migration Guide */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📋 Migration Guide</h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p>To replace hardcoded data with Firestore data, use the fetch functions from <code className="bg-gray-100 px-1 rounded">utils/fetchPricing.ts</code>:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li><code>fetchPlans()</code> → Replace <code>planDetails</code></li>
              <li><code>fetchConnectionFees()</code> → Replace connection fee tiers</li>
              <li><code>fetchTransactionFees()</code> → Replace transaction fee tiers</li>
              <li><code>fetchMarketingEmailFees()</code> → Replace marketing email tiers</li>
              <li><code>fetchSmsRates()</code> → Replace <code>smsRates</code></li>
              <li><code>fetchWhatsappRates()</code> → Replace <code>whatsappRates</code></li>
              <li><code>fetchAddons()</code> → Replace addon pricing constants</li>
              <li><code>fetchSetupFees()</code> → Replace setup fee constants</li>
              <li><code>fetchCountryDialCodes()</code> → Replace <code>countryDialCodes</code></li>
            </ul>
            <p className="mt-4">Or use <code className="bg-gray-100 px-1 rounded">fetchPricingConfig()</code> to get everything at once.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

