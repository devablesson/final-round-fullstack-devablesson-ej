/**
 * Vendor-specific API functions.
 * UI components should never call fetch directly.
 */

import { apiGet, apiPost } from "./client";
import type { Vendor, CreateVendorPayload } from "../types/vendor";

/**
 * Fetch all vendors from backend.
 */
export async function fetchVendors(): Promise<Vendor[]> {
  return apiGet<Vendor[]>("/vendors");
}

/**
 * Create a new vendor using POST /vendors.
 */
export async function createVendor(
  payload: CreateVendorPayload
): Promise<{ id: string; message: string }> {
  return apiPost<{ id: string; message: string }>(
    "/vendors",
    payload
  );
}
