/**
 * Vendor types used across the frontend.
 * These mirror the backend API responses and requests.
 */

export interface Vendor {
  id: string;
  name: string;
  category?: string | null;

  department?: string | null;
  vendor_owner_location?: string | null;

  spend_365d: number;
  spend_30d: number;

  payment_type: string;
  status: string;
  created_at: string;
}

export interface CreateVendorPayload {
  // Required
  name: string;
  payment_type: string;

  // Optional
  category?: string;
  department?: string;
  vendor_owner_location?: string;
}
