import { db } from "../firebase/config";
import { doc, setDoc, collection, writeBatch } from "firebase/firestore";
import pricingData from "../data/pricing_config.json";

/**
 * Seeds the pricing configuration data into Firebase Firestore.
 * This function writes the entire configuration to a single document 
 * in the 'settings' collection, or splits it if preferred.
 * 
 * For this implementation, we will store the entire config 
 * in a document called 'pricing_configuration' in 'settings' collection
 * for easy retrieval.
 */
export const seedPricingData = async () => {
  try {
    console.log("Starting pricing data seed...");
    
    // We will store data in a collection called 'pricing_configuration'
    // Each top-level key from the JSON will be a separate document.
    const collectionName = "pricing_configuration";
    const batch = writeBatch(db);
    
    // Define the keys to verify and store from the JSON
    const sections = [
      "plans",
      "connection_fees",
      "transaction_fees",
      "marketing_email_fees",
      "sms_rates",
      "whatsapp_rates",
      "addons",
      "setup_fees",
      "country_dial_codes"
    ];

    // Iterate over sections and create a document for each
    for (const section of sections) {
      if (section in pricingData) {
        // Create a reference for the document e.g. pricing_configuration/plans
        const docRef = doc(db, collectionName, section);
        // data to save
        const data = (pricingData as any)[section];
        
        // Detailed logging for confirmation
        if (section === "plans") {
           console.log(`Saving Plans: ${Object.keys(data).join(", ")}`);
        } else if (data.tiers && Array.isArray(data.tiers)) {
           console.log(`Saving ${section}: found ${data.tiers.length} tiers.`);
        } else if (section === "whatsapp_rates" && data.store_fee_tiers) {
           console.log(`Saving WhatsApp Rates: found ${data.store_fee_tiers.length} store tiers and rates for ${Object.keys(data.country_rates || {}).length} countries.`);
        }
        
        batch.set(docRef, data);
        console.log(`Prepared document: ${collectionName}/${section}`);
      }
    }

    // Add metadata document with version
    const metadataRef = doc(db, collectionName, "_metadata");
    batch.set(metadataRef, {
      version: pricingData.version,
      lastUpdated: new Date().toISOString(),
      sections: sections
    });

    console.log("Committing batch write to Firebase...");
    await batch.commit();
    
    console.log(`Successfully seeded documents to '${collectionName}' collection.`);
    return { success: true, message: `Successfully seeded ${sections.length} documents to ${collectionName}` };
  } catch (error) {
    console.error("Error seeding pricing data:", error);
    return { success: false, error };
  }
};
