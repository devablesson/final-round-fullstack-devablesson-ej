import { useState, useMemo, useRef, useEffect } from "react";
import type { Vendor } from "../types/vendor";

/**
 * VendorsTable - Exact Ramp UI replica
 * 
 * KEY FEATURES:
 * - Vendor column: ONLY vertical scroll (sticky left, no horizontal scroll)
 * - All other columns: Both horizontal and vertical scroll
 * - Sticky header row
 * - Synchronized vertical scrolling between fixed and scrollable sections
 * - Ramp-style colors, fonts, spacing
 */

interface VendorsTableProps {
  vendors: Vendor[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}

// Generate consistent brand-like colors for vendor logos
const LOGO_COLORS = [
  { bg: "#0077B5", text: "#fff" }, // LinkedIn blue
  { bg: "#00A699", text: "#fff" }, // Airbnb teal
  { bg: "#E31837", text: "#fff" }, // Delta red
  { bg: "#7B68EE", text: "#fff" }, // Purple
  { bg: "#1DB954", text: "#fff" }, // Spotify green
  { bg: "#FF5A00", text: "#fff" }, // Orange
  { bg: "#1a1a1a", text: "#fff" }, // Black
  { bg: "#4285F4", text: "#fff" }, // Google blue
  { bg: "#FF4081", text: "#fff" }, // Pink
  { bg: "#00C4CC", text: "#fff" }, // Cyan
];

function getLogoColor(name: string) {
  const index = name.charCodeAt(0) % LOGO_COLORS.length;
  return LOGO_COLORS[index];
}

// Generate random but consistent colors for owner avatars
const OWNER_COLORS = [
  "#E11D48", // Rose
  "#7C3AED", // Violet
  "#2563EB", // Blue
  "#059669", // Emerald
  "#D97706", // Amber
  "#DC2626", // Red
  "#4F46E5", // Indigo
  "#0891B2", // Cyan
  "#65A30D", // Lime
  "#EA580C", // Orange
];

function getOwnerColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return OWNER_COLORS[Math.abs(hash) % OWNER_COLORS.length];
}

// Sort arrow indicator
function SortArrow({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  return (
    <svg
      className={`ml-1 h-3 w-3 flex-shrink-0 ${active ? "text-[#1a1a1a]" : "text-[#d1d5db]"}`}
      viewBox="0 0 12 12"
      fill="currentColor"
    >
      {direction === "asc" ? (
        <path d="M6 3L10 8H2L6 3Z" />
      ) : (
        <path d="M6 9L2 4H10L6 9Z" />
      )}
    </svg>
  );
}

export default function VendorsTable({
  vendors,
  sortBy,
  sortOrder,
  onSort,
}: VendorsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Refs for synchronized scrolling
  const fixedScrollRef = useRef<HTMLDivElement>(null);
  const scrollableAreaRef = useRef<HTMLDivElement>(null);
  const isScrollingSyncRef = useRef(false);

  // Synchronize vertical scrolling between left fixed and right scrollable
  useEffect(() => {
    const fixedEl = fixedScrollRef.current;
    const scrollableEl = scrollableAreaRef.current;

    if (!fixedEl || !scrollableEl) return;

    const handleFixedScroll = () => {
      if (isScrollingSyncRef.current) return;
      isScrollingSyncRef.current = true;
      scrollableEl.scrollTop = fixedEl.scrollTop;
      requestAnimationFrame(() => { isScrollingSyncRef.current = false; });
    };

    const handleScrollableScroll = () => {
      if (isScrollingSyncRef.current) return;
      isScrollingSyncRef.current = true;
      fixedEl.scrollTop = scrollableEl.scrollTop;
      requestAnimationFrame(() => { isScrollingSyncRef.current = false; });
    };

    fixedEl.addEventListener("scroll", handleFixedScroll);
    scrollableEl.addEventListener("scroll", handleScrollableScroll);

    return () => {
      fixedEl.removeEventListener("scroll", handleFixedScroll);
      scrollableEl.removeEventListener("scroll", handleScrollableScroll);
    };
  }, []);

  const allSelected = vendors.length > 0 && selectedIds.size === vendors.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(vendors.map((v) => v.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // Format currency - Ramp style: $15,459.47
  const formatCurrency = (amount: number) => {
    return "$" + amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format date - Ramp style: "Sep 25, 2025"
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Memoize vendor colors
  const vendorColors = useMemo(() => {
    const colors: Record<string, { bg: string; text: string }> = {};
    vendors.forEach((v) => {
      colors[v.id] = getLogoColor(v.name);
    });
    return colors;
  }, [vendors]);

  return (
    <div className="flex h-full flex-col">
      {/* Table wrapper with proper scroll structure */}
      <div className="flex min-h-0 flex-1">
        {/* ═══════ FIXED LEFT SECTION (Checkbox + Vendor) ═══════ */}
        <div className="flex flex-shrink-0 flex-col border-r border-[#e5e5e5]">
          {/* Header */}
          <div className="flex h-10 flex-shrink-0 items-center border-b border-[#e5e5e5] bg-white">
            {/* Checkbox header */}
            <div className="flex h-full w-12 items-center justify-center border-r border-[#f0f0f0]">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => { if (el) el.indeterminate = someSelected; }}
                onChange={toggleSelectAll}
                className="h-4 w-4 cursor-pointer rounded border-[#d1d5db]"
              />
            </div>
            {/* Vendor header */}
            <div
              className="flex h-full w-[220px] cursor-pointer items-center gap-1 px-4 text-[11px] font-medium uppercase tracking-wide text-[#6b6b6b] hover:text-[#1a1a1a]"
              onClick={() => onSort("name")}
            >
              Vendor
              <SortArrow active={sortBy === "name"} direction={sortOrder} />
            </div>
          </div>
          
          {/* Fixed column body - scrolls vertically only */}
          <div
            ref={fixedScrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {vendors.map((vendor) => {
              const isSelected = selectedIds.has(vendor.id);
              const logoColor = vendorColors[vendor.id];

              return (
                <div
                  key={vendor.id}
                  className={`flex h-[60px] items-center border-b border-[#f0f0f0] ${
                    isSelected ? "bg-[#f0f7ff]" : "hover:bg-[#fafafa]"
                  }`}
                >
                  {/* Checkbox */}
                  <div className="flex h-full w-12 items-center justify-center border-r border-[#f0f0f0]">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(vendor.id)}
                      className="h-4 w-4 cursor-pointer rounded border-[#d1d5db]"
                    />
                  </div>
                  {/* Vendor name + category */}
                  <div className="flex w-[220px] items-center gap-3 px-4">
                    {/* Logo - Show image if logo_url exists, otherwise show letter avatar */}
                    {vendor.logo_url ? (
                      <img
                        src={vendor.logo_url}
                        alt={vendor.name}
                        className="h-8 w-8 flex-shrink-0 rounded-full object-cover bg-white border border-gray-200 p-1"
                        onError={(e) => {
                          // Hide image and show fallback
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-semibold"
                      style={{ 
                        backgroundColor: logoColor.bg, 
                        color: logoColor.text,
                        display: vendor.logo_url ? 'none' : 'flex'
                      }}
                    >
                      {vendor.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Name + category */}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-[#1a1a1a]">
                        {vendor.name}
                      </div>
                      {vendor.category && (
                        <div className="truncate text-[12px] text-[#6b6b6b]">
                          {vendor.category}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {vendors.length === 0 && (
              <div className="flex h-20 items-center justify-center text-[13px] text-[#6b6b6b]">
                No vendors found
              </div>
            )}
          </div>
        </div>

        {/* ═══════ SCROLLABLE RIGHT SECTION (All other columns) ═══════ */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Scrollable area - horizontal + vertical */}
          <div ref={scrollableAreaRef} className="flex-1 overflow-auto">
            <table className="w-max min-w-full border-collapse">
              {/* Header */}
              <thead className="sticky top-0 z-10">
                <tr className="h-10 border-b border-[#e5e5e5] bg-white">
                  <HeaderCell label="Owners" width="180px" />
                  <HeaderCell
                    label="365-day spend"
                    width="120px"
                    align="right"
                    sortable
                    column="spend_365d"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={onSort}
                  />
                  <HeaderCell
                    label="30-day spend"
                    width="120px"
                    align="right"
                    sortable
                    column="spend_30d"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={onSort}
                  />
                  <HeaderCell label="Description" width="120px" />
                  <HeaderCell label="Department" width="160px" />
                  <HeaderCell label="Contract" width="80px" align="center" />
                  <HeaderCell label="Vendor owner location" width="160px" />
                  <HeaderCell
                    label="Creation date"
                    width="120px"
                    sortable
                    column="created_at"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={onSort}
                  />
                  <HeaderCell label="Payment type" width="130px" />
                  {/* Actions column */}
                  <th className="w-10 bg-white px-2"></th>
                </tr>
              </thead>

              <tbody>
                {vendors.map((vendor) => {
                  const isSelected = selectedIds.has(vendor.id);

                  return (
                    <tr
                      key={vendor.id}
                      className={`h-[60px] border-b border-[#f0f0f0] ${
                        isSelected ? "bg-[#f0f7ff]" : "hover:bg-[#fafafa]"
                      }`}
                    >
                      {/* Owners */}
                      <td className="w-[180px] px-4 border-r border-[#f0f0f0]">
                        {vendor.owner_name ? (
                          <div className="flex items-center gap-2">
                            <div 
                              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-white"
                              style={{ backgroundColor: getOwnerColor(vendor.owner_name) }}
                            >
                              {vendor.owner_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                            <span className="truncate text-[13px] text-[#1a1a1a]">
                              {vendor.owner_name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[13px] text-[#9ca3af]">—</span>
                        )}
                      </td>

                      {/* 365-day spend */}
                      <td className="w-[120px] px-4 text-right border-r border-[#f0f0f0]">
                        <span className="text-[13px] tabular-nums text-[#1a1a1a]">
                          {formatCurrency(vendor.spend_365d)}
                        </span>
                      </td>

                      {/* 30-day spend */}
                      <td className="w-[120px] px-4 text-right border-r border-[#f0f0f0]">
                        {vendor.spend_30d > 0 ? (
                          <span className="text-[13px] tabular-nums text-[#1a1a1a]">
                            {formatCurrency(vendor.spend_30d)}
                          </span>
                        ) : (
                          <span className="text-[13px] text-[#9ca3af]">$0.00</span>
                        )}
                      </td>

                      {/* Description */}
                      <td className="w-[120px] px-4 border-r border-[#f0f0f0]">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] text-[#9ca3af]">—</span>
                          <button className="text-[#9ca3af] hover:text-[#6b6b6b]">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="w-[160px] px-4 border-r border-[#f0f0f0]">
                        {vendor.department ? (
                          <span className="truncate text-[13px] text-[#1a1a1a]">
                            {vendor.department}
                          </span>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] text-[#9ca3af]">—</span>
                            <button className="text-[#9ca3af] hover:text-[#6b6b6b]">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Contract */}
                      <td className="w-[80px] px-4 text-center border-r border-[#f0f0f0]">
                        <button className="text-[#9ca3af] hover:text-[#6b6b6b]">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </button>
                      </td>

                      {/* Vendor owner location */}
                      <td className="w-[160px] px-4 border-r border-[#f0f0f0]">
                        {vendor.vendor_owner_location ? (
                          <span className="text-[13px] text-[#1a1a1a]">
                            {vendor.vendor_owner_location}
                          </span>
                        ) : (
                          <span className="text-[13px] text-[#9ca3af]">—</span>
                        )}
                      </td>

                      {/* Creation date */}
                      <td className="w-[120px] whitespace-nowrap px-4 border-r border-[#f0f0f0]">
                        <span className="text-[13px] text-[#1a1a1a]">
                          {formatDate(vendor.created_at)}
                        </span>
                      </td>

                      {/* Payment type */}
                      <td className="w-[130px] px-4 border-r border-[#f0f0f0]">
                        <span className="truncate text-[13px] text-[#1a1a1a]">
                          {vendor.payment_type === "Card" ? "Card" : vendor.payment_type}
                        </span>
                      </td>

                      {/* Actions (3-dot menu) */}
                      <td className="w-10 px-2">
                        <button className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#6b6b6b]">
                          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                            <circle cx="8" cy="3" r="1.5" />
                            <circle cx="8" cy="8" r="1.5" />
                            <circle cx="8" cy="13" r="1.5" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══════ FOOTER - Changes based on selection state ═══════ */}
      {selectedIds.size > 0 ? (
        /* Selection footer - matches pasted image 3 */
        <div className="flex h-12 flex-shrink-0 items-center justify-between border-t border-[#e5e5e5] bg-[#f5f7f5] px-4">
          {/* Left side - X icon + count */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="flex h-6 w-6 items-center justify-center rounded bg-[#1a1a1a] text-white hover:bg-[#333]"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="text-[14px] font-medium text-[#1a1a1a]">
              {selectedIds.size} vendors selected
            </span>
          </div>

          {/* Right side - 3-dot menu + Request information */}
          <div className="flex items-center gap-3">
            <button className="rounded p-1.5 text-[#6b6b6b] hover:bg-[#e5e5e5]">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="3" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="13" r="1.5" />
              </svg>
            </button>
            <button className="flex items-center gap-2 rounded-md border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] font-medium text-[#1a1a1a] transition-all hover:bg-[#f5f5f5]">
              Request information
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* Default footer - Select dropdown + pagination */
        <div className="flex h-10 flex-shrink-0 items-center justify-between border-t border-[#e5e5e5] bg-white px-4">
          {/* Select dropdown */}
          <button className="flex items-center gap-1 text-[12px] text-[#6b6b6b] hover:text-[#1a1a1a]">
            Select
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
              <path d="M3 5L6 8L9 5H3Z" />
            </svg>
          </button>

          {/* Pagination */}
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#6b6b6b]">
              1–{vendors.length} of {vendors.length} matching vendors
            </span>
            <button className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#f3f4f6]">
              <svg className="h-4 w-4 text-[#6b6b6b]" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Header cell component
function HeaderCell({
  label,
  width,
  align = "left",
  sortable = false,
  column = "",
  sortBy = "",
  sortOrder = "desc",
  onSort,
}: {
  label: string;
  width: string;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  column?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (column: string) => void;
}) {
  const alignClass = align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";
  const isActive = sortBy === column;

  const handleClick = () => {
    if (sortable && onSort) {
      onSort(column);
    }
  };

  return (
    <th
      className={`bg-white px-4 text-${align} border-r border-[#f0f0f0] ${sortable ? "cursor-pointer" : ""}`}
      style={{ width, minWidth: width }}
      onClick={handleClick}
    >
      <div className={`flex items-center ${alignClass} text-[11px] font-medium uppercase tracking-wide text-[#6b6b6b] ${sortable ? "hover:text-[#1a1a1a]" : ""}`}>
        {label}
        {sortable && <SortArrow active={isActive} direction={sortOrder} />}
      </div>
    </th>
  );
}
