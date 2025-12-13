/**
 * Vendor types used across the frontend.
 * These mirror the backend API responses and requests.
 */

export interface Vendor {
  id: string;
  name: string;
  category?: string | null;
  logo_url?: string | null;

  owner_name?: string | null;
  owner_avatar_url?: string | null;
  department?: string | null;
  vendor_owner_location?: string | null;

  spend_365d: number;
  spend_30d: number;

  payment_type: string;
  status: string;
  description?: string | null;
  has_contract: boolean;
  is_1099_vendor: boolean;

  created_at: string;
  updated_at?: string | null;
}

export interface CreateVendorPayload {
  // Required
  name: string;
  payment_type: string;

  // Optional
  category?: string;
  department?: string;
  vendor_owner_location?: string;
  description?: string;
}
