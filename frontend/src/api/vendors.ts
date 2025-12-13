/**
 * Vendor-specific API functions.
 * UI components should never call fetch directly.
 */

import { apiGet, apiPost } from "./client";
import type { Vendor, CreateVendorPayload } from "../types/vendor";

/**
 * Fetch vendors from backend with optional search and sort.
 * @param search - Filter vendors by name (optional)
 * @param sortBy - Column to sort by (optional)
 * @param sortOrder - Sort direction 'asc' or 'desc' (optional)
 */
export async function fetchVendors(
  search?: string,
  sortBy?: string,
  sortOrder?: "asc" | "desc"
): Promise<Vendor[]> {
  const params = new URLSearchParams();

  if (search && search.trim()) {
    params.set("search", search.trim());
  }
  if (sortBy) {
    params.set("sort_by", sortBy);
  }
  if (sortOrder) {
    params.set("sort_order", sortOrder);
  }

  const queryString = params.toString();
  const path = queryString ? `/vendors?${queryString}` : "/vendors";

  return apiGet<Vendor[]>(path);
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
