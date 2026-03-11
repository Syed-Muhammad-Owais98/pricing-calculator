import React from "react";
import { DiscountSectionProps } from "../types";
import { formatCurrency } from "../../utils";

export const DiscountSection: React.FC<DiscountSectionProps> = ({
  discountUnlocked,
  setDiscountUnlocked,
  showDiscountInput,
  setShowDiscountInput,
  discountPassword,
  setDiscountPassword,
  showItemDiscounts,
  setShowItemDiscounts,
  subtotalDiscount,
  setSubtotalDiscount,
  discountReason,
  setDiscountReason,
  itemDiscounts,
  setItemDiscounts,
  discountsApplied,
  setDiscountsApplied,
  setAppliedItemDiscounts,
  setAppliedSubtotalDiscount,
  setAppliedDiscountReason,
  feeBreakdown,
}) => {
  const handleUnlock = () => {
    if (discountPassword === "Sp00n1ty") {
      setDiscountUnlocked(true);
      setShowDiscountInput(false);
    } else {
      setDiscountPassword("");
      alert("Incorrect password. Please try again.");
    }
  };

  const handleClearDiscounts = () => {
    setItemDiscounts({});
    setSubtotalDiscount({ type: "fixed", value: 0 });
    setDiscountReason("");
    setAppliedItemDiscounts({});
    setAppliedSubtotalDiscount({ type: "fixed", value: 0 });
    setAppliedDiscountReason("");
    setDiscountsApplied(false);
  };

  const handleApplyDiscounts = () => {
    setAppliedItemDiscounts(itemDiscounts);
    setAppliedSubtotalDiscount(subtotalDiscount);
    setAppliedDiscountReason(discountReason);
    setDiscountsApplied(true);
  };

  // Item discount row component
  const ItemDiscountRow = ({
    label,
    feeKey,
    amount,
  }: {
    label: string;
    feeKey: string;
    amount: number;
  }) => {
    if (amount <= 0) return null;

    return (
      <div className="bg-white border rounded-md p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-gray-600">{formatCurrency(amount)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <select
            className="border rounded-md p-1.5 input-field text-xs"
            value={itemDiscounts[feeKey]?.type || "fixed"}
            onChange={(e) =>
              setItemDiscounts({
                ...itemDiscounts,
                [feeKey]: {
                  type: e.target.value as "percentage" | "fixed",
                  value: itemDiscounts[feeKey]?.value || 0,
                },
              })
            }
          >
            <option value="percentage">%</option>
            <option value="fixed">$</option>
          </select>
          <input
            type="number"
            min={0}
            step={0.01}
            className="col-span-2 border rounded-md p-1.5 input-field text-xs"
            placeholder="0.00"
            value={itemDiscounts[feeKey]?.value ?? 0}
            onChange={(e) =>
              setItemDiscounts({
                ...itemDiscounts,
                [feeKey]: {
                  type: itemDiscounts[feeKey]?.type || "fixed",
                  value: Number(e.target.value),
                },
              })
            }
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
      {!discountUnlocked ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-900">Apply Discount</h4>
            <button
              type="button"
              onClick={() => setShowDiscountInput(!showDiscountInput)}
              className="text-blue-600 text-sm hover:underline"
            >
              {showDiscountInput ? "Hide" : "Enter Password"}
            </button>
          </div>
          {showDiscountInput && (
            <div className="mt-3">
              <div className="flex gap-2">
                <input
                  type="password"
                  className="flex-1 border rounded-md p-2 input-field text-sm"
                  placeholder="Enter discount password"
                  value={discountPassword}
                  onChange={(e) => setDiscountPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnlock();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleUnlock}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Unlock
                </button>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Sales representatives only
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-900">Discount Options</h4>
            <span className="text-xs text-green-600 font-medium">
              ✓ Unlocked
            </span>
          </div>
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setShowItemDiscounts(false)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                !showItemDiscounts
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
              }`}
            >
              Subtotal Discount
            </button>
            <button
              type="button"
              onClick={() => setShowItemDiscounts(true)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                showItemDiscounts
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
              }`}
            >
              Per-Item Discounts
            </button>
          </div>

          {!showItemDiscounts ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Amount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    className="border rounded-md p-2 input-field text-sm"
                    value={subtotalDiscount.type}
                    onChange={(e) =>
                      setSubtotalDiscount({
                        ...subtotalDiscount,
                        type: e.target.value as "percentage" | "fixed",
                      })
                    }
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className="col-span-2 border rounded-md p-2 input-field text-sm"
                    placeholder={
                      subtotalDiscount.type === "percentage"
                        ? "0.00%"
                        : "$0.00"
                    }
                    value={subtotalDiscount.value}
                    onChange={(e) =>
                      setSubtotalDiscount({
                        ...subtotalDiscount,
                        value: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Reason (optional)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 input-field text-sm"
                  placeholder="e.g., Multi-year contract, Volume discount"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                />
              </div>

              {(feeBreakdown.discount || 0) > 0 && (
                <div className="bg-green-50 rounded p-2 text-sm">
                  <div className="flex justify-between font-medium text-green-800">
                    <span>Total Discount Applied:</span>
                    <span>-{formatCurrency(feeBreakdown.discount)}</span>
                  </div>
                  {(feeBreakdown.itemDiscounts || 0) > 0 && (
                    <div className="text-xs text-green-700 mt-1">
                      Item Discounts: -
                      {formatCurrency(feeBreakdown.itemDiscounts)}
                    </div>
                  )}
                  {(feeBreakdown.subtotalDiscountAmount || 0) > 0 && (
                    <div className="text-xs text-green-700">
                      Subtotal Discount: -
                      {formatCurrency(feeBreakdown.subtotalDiscountAmount)}
                    </div>
                  )}
                  {discountReason && (
                    <div className="text-xs text-green-700 mt-1">
                      Reason: {discountReason}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-2">
                Apply discounts to individual line items. Item discounts are
                applied first, then any subtotal discount.
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                <ItemDiscountRow
                  label="Base License Fee"
                  feeKey="baseLicense"
                  amount={feeBreakdown.baseLicense}
                />
                <ItemDiscountRow
                  label="Connection Fees"
                  feeKey="connection"
                  amount={feeBreakdown.connection}
                />
                <ItemDiscountRow
                  label="Transaction Processing"
                  feeKey="transaction"
                  amount={feeBreakdown.transaction}
                />
                <ItemDiscountRow
                  label="Marketing"
                  feeKey="marketing"
                  amount={feeBreakdown.marketing}
                />
                <ItemDiscountRow
                  label="Gift Card Module"
                  feeKey="giftCard"
                  amount={feeBreakdown.giftCard}
                />
                <ItemDiscountRow
                  label="SMS Messages"
                  feeKey="sms"
                  amount={feeBreakdown.sms}
                />
                <ItemDiscountRow
                  label="WhatsApp Platform"
                  feeKey="whatsapp"
                  amount={feeBreakdown.whatsapp.total}
                />
                <ItemDiscountRow
                  label="Independent Server"
                  feeKey="server"
                  amount={feeBreakdown.server}
                />
                <ItemDiscountRow
                  label="Premium SLA"
                  feeKey="sla"
                  amount={feeBreakdown.sla}
                />
                <ItemDiscountRow
                  label="CMS"
                  feeKey="cms"
                  amount={feeBreakdown.cms}
                />
                <ItemDiscountRow
                  label="Mobile App"
                  feeKey="app"
                  amount={feeBreakdown.app}
                />
                <ItemDiscountRow
                  label="Premium Support"
                  feeKey="support"
                  amount={feeBreakdown.support}
                />
              </div>

              {(feeBreakdown.itemDiscounts || 0) > 0 && (
                <div className="bg-green-50 rounded p-2 text-sm mt-3">
                  <div className="flex justify-between font-medium text-green-800">
                    <span>Total Item Discounts:</span>
                    <span>-{formatCurrency(feeBreakdown.itemDiscounts)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {discountUnlocked && (
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            onClick={handleApplyDiscounts}
          >
            Apply Discounts
          </button>
          <button
            type="button"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              discountsApplied
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={handleClearDiscounts}
          >
            Clear Discounts
          </button>
        </div>
      )}
    </div>
  );
};

