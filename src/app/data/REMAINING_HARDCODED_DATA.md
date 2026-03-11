# Remaining Hardcoded Data Not in Firestore

This document lists all hardcoded data that remains in the codebase and is **NOT** being fetched from Firestore. These values are either:
1. Configuration constants that rarely change
2. Security-related values that shouldn't be stored in a database
3. Application constants

---

## 🔴 IMPORTANT: All Default Pricing Values Have Been Removed

As of the latest update, **all default/fallback pricing values have been commented out** in `PricingContext.tsx`. The application now **requires** Firestore data to function. If Firestore fails to load, the app will display an error state.

---

## 1. Token & Authentication Constants

**File:** `src/app/components/calculator/constants.ts`

```typescript
export const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export const TOKEN_CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
```

**File:** `src/app/spoonityCalculator.tsx` and `src/app/components/calculator/hooks/useTokenManagement.ts`

```typescript
// Token validation paraphrase - now uses environment variable
const paraphraseCheck = tokenData.paraphrase === process.env.NEXT_PUBLIC_PARAPHRASE_KEY;
```

**Status:** ✅ Now uses environment variable

---

## 2. API & External Service URLs

**File:** `src/app/spoonityCalculator.tsx`

```typescript
// Webhook URL - now uses environment variable
const webhookUrl = process.env.NEX_PUBLIC_WEBHOOK_URL as string;
```

**Status:** ✅ Now uses environment variable (Note: typo in env var name - should be `NEXT_PUBLIC_WEBHOOK_URL`)

---

## 3. PDF Generator Assets

**File:** `src/app/components/calculator/pdfGenerator.ts`

```typescript
// Logo URL for PDF generation
const logoUrl = "https://spoonity.com/wp-content/uploads/2023/06/Spoonity_logo_green.png";
```

**Recommendation:** Can be moved to Firestore under a "branding" or "assets" collection.

---

## 4. UI/Form Validation Constants

**File:** Various component files

```typescript
// Max stores input validation
const maxStores = 10000;

// Default values for form fields
const defaultStores = 1;
const defaultTransactions = 5000;
const defaultMarketing = 10000;
```

**Recommendation:** These UI constants can remain hardcoded as they are form validation rules.

---

## 5. CSS/Styling Constants

**File:** `src/app/components/calculator/hooks/useStyles.ts`

The custom CSS styles and animations are injected via a style tag. These are presentation-layer constants and should remain in code.

---

## 6. Default Tier Fallbacks (utils.ts)

**File:** `src/app/components/calculator/utils.ts`

```typescript
const DEFAULT_CONNECTION_TIERS: ConnectionFeeTier[] = [...]
const DEFAULT_TRANSACTION_TIERS: TransactionFeeTier[] = [...]
const DEFAULT_MARKETING_TIERS: MarketingEmailTier[] = [...]
const DEFAULT_WHATSAPP_STORE_TIERS: WhatsappStoreFeeTier[] = [...]
```

**Recommendation:** These are function-level fallbacks when dynamic tiers aren't passed. Keep as is.

---

## Summary

| Category | Status | Action Needed |
|----------|--------|---------------|
| Token Constants | Keep hardcoded | Security-sensitive |
| Token Paraphrase | ✅ Migrated | Uses `NEXT_PUBLIC_PARAPHRASE_KEY` env var |
| Webhook URL | ✅ Migrated | Uses `NEX_PUBLIC_WEBHOOK_URL` env var |
| Logo URL | Optional migrate | Can add to Firestore |
| Form Validation | Keep hardcoded | UI-layer logic |
| CSS/Styles | Keep hardcoded | Presentation layer |
| Default Tiers in utils.ts | Keep as fallbacks | Function defaults |

---

## Files Removed / Commented Out

### Deleted Files:
- `src/app/components/calculator/data.ts` - Contained:
  - `smsRates`
  - `planDetails`
  - `countryDialCodes`
  - `whatsappAvailableCountries`
  - `whatsappRates`

### Commented Out Values in `PricingContext.tsx`:
All default pricing configurations have been commented out:
- `defaultPlans`
- `defaultConnectionFees`
- `defaultTransactionFees`
- `defaultMarketingEmailFees`
- `defaultSmsRates`
- `defaultWhatsappRates`
- `defaultAddons`
- `defaultSetupFees`
- `defaultCountryDialCodes`
- `defaultPricingConfig`

The application now:
1. Fetches all pricing data from the `pricing_configuration` Firestore collection
2. Validates that all required fields are present
3. Shows an error state if Firestore data is missing or fails to load
4. Uses empty placeholder values during loading state

---

## Required Environment Variables

Make sure to set these in your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Application Configuration
NEXT_PUBLIC_PARAPHRASE_KEY=your_token_paraphrase_key
NEXT_PUBLIC_WEBHOOK_URL=your_webhook_url  # Note: Fix typo in code (NEX_PUBLIC_WEBHOOK_URL -> NEXT_PUBLIC_WEBHOOK_URL)
```
