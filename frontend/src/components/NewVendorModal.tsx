/**
 * NewVendorModal Component
 * ========================
 * A slide-in panel modal for creating new vendors.
 * 
 * Features:
 * - Smooth slide-in animation from right
 * - Form validation (vendor name required)
 * - API integration with error handling
 * - Auto-close on successful creation
 * - Accessible backdrop click to close
 * 
 * Props:
 * - isOpen: Controls modal visibility
 * - onClose: Callback when modal should close
 * - onSuccess: Callback after successful vendor creation (triggers table refresh)
 * 
 * The form collects basic vendor information as specified in the
 * simplified New Vendor flow requirements:
 * - Vendor name (required)
 * - Category
 * - Department  
 * - Vendor owner location
 * - Payment method (ACH or Card)
 */

import { useEffect, useState } from "react";
import { createVendor } from "../api/vendors";
import type { CreateVendorPayload } from "../types/vendor";

interface NewVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewVendorModal({
  isOpen,
  onClose,
  onSuccess,
}: NewVendorModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [paymentType, setPaymentType] = useState<"Card" | "ACH">("ACH");

  const resetForm = () => {
    setName("");
    setCategory("");
    setDepartment("");
    setLocation("");
    setPaymentType("ACH");
    setError(null);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      resetForm();
      onClose();
    }, 350);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Vendor name is required");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: CreateVendorPayload = {
      name: name.trim(),
      payment_type: paymentType,
      category: category || undefined,
      department: department || undefined,
      vendor_owner_location: location || undefined,
    };

    try {
      await createVendor(payload);
      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create vendor";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-[720px] bg-white shadow-2xl transform transition-transform duration-500 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          {/* Header */}
          <div className="px-10 pt-8 pb-6 border-b border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="mb-6 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>

            <h1 className="text-[32px] font-semibold tracking-tight text-gray-900">
              New vendor
            </h1>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-10 pb-24 pt-10 space-y-14">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                {error}
              </div>
            )}

            {/* Vendor name */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Vendor name <span className="text-red-500">*</span>
              </label>
              <div className="rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter vendor name"
                  className="w-full text-base text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <p className="text-xs text-gray-500">
                This is the name that will appear across Ramp
              </p>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., SaaS / Software"
                  className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Department</label>
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g., Engineering"
                  className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Vendor owner location
              </label>
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Boston, San Francisco"
                  className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Payment method
              </label>
              <div className="relative rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 w-1/2">
                <select
                  value={paymentType}
                  onChange={(e) =>
                    setPaymentType(e.target.value as "Card" | "ACH")
                  }
                  className="w-full appearance-none bg-transparent pr-8 text-[15px] text-gray-900 focus:outline-none cursor-pointer py-1"
                >
                  <option value="ACH">ACH (Bank Transfer)</option>
                  <option value="Card"> Card</option>
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-200 px-10 py-6 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Discard changes
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-[#E6FF00] px-10 py-3 text-sm font-semibold text-black shadow-sm hover:bg-[#d4ef00] disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating…" : "Continue →"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
