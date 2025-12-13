import { useEffect, useState, useCallback } from "react";
import { fetchVendors } from "./api/vendors";
import VendorsTable from "./components/VendorsTable";
import NewVendorModal from "./components/NewVendorModal";
import type { Vendor } from "./types/vendor";

/**
 * Vendors page — Exact Ramp UI replica
 * Layout: Fixed header/tabs/search, scrollable table only
 */
export default function App() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Sort state
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState("Overview");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch vendors from API
  const loadVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVendors(debouncedSearch, sortBy, sortOrder);
      setVendors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  // Handle column sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      {/* ═══════ FIXED HEADER SECTION ═══════ */}
      <header className="flex-shrink-0 border-b border-[#e5e5e5]">
        {/* Title row + Button group */}
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-[#1a1a1a]">
            Vendors
          </h1>
          
          {/* New vendor button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-[4px] bg-[#E6FF00] px-4 py-2 text-[14px] font-semibold text-[#1a1a1a] border border-[#D4FF00] transition-colors hover:bg-[#c5ef00] hover:border-[#c5ef00] active:bg-[#b8e000]"
          >
            New vendor
          </button>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-10 px-6">
          {[
            { name: "Overview", count: null },
            { name: "Needs review", count: 0 },
            { name: "Renewals", count: null },
            { name: "Duplicates", count: 2 },
            { name: "Switch cards", count: null },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative flex items-center gap-2 pb-3 pt-2 text-[14px] font-normal transition-colors ${
                activeTab === tab.name
                  ? "text-[#1a1a1a]"
                  : "text-[#6b6b6b] hover:text-[#1a1a1a]"
              }`}
            >
              {tab.name}
              {tab.count !== null && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f0f0f0] px-1.5 text-[12px] font-medium text-[#6b6b6b]">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.name && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a]" />
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* Search bar + action icons row */}
      <div className="flex flex-shrink-0 items-center justify-between pr-4 py-3">
        {/* Search input - aligned with checkbox column */}
        <div className="flex items-center pl-3">
          <div className="flex h-9 w-[200px] items-center rounded-full border border-[#e0e0e0] bg-white px-3 transition-colors focus-within:border-[#c0c0c0]">
            <svg
              className="mr-2 h-4 w-4 flex-shrink-0 text-[#9ca3af]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or filter..."
              className="h-full flex-1 border-none bg-transparent text-[13px] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none"
            />
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Message icon */}
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e5e5e5] text-[#6b6b6b] hover:bg-[#f9fafb]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          {/* Columns icon */}
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e5e5e5] text-[#6b6b6b] hover:bg-[#f9fafb]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </button>
          {/* Download icon */}
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e5e5e5] text-[#6b6b6b] hover:bg-[#f9fafb]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* ═══════ SCROLLABLE TABLE SECTION ═══════ */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {loading && (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e5e5e5] border-t-[#1a1a1a]" />
          </div>
        )}

        {error && (
          <div className="m-6 rounded-md bg-red-50 p-4 text-[13px] text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <VendorsTable
            vendors={vendors}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        )}
      </div>

      {/* New Vendor Modal */}
      <NewVendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadVendors}
      />
    </div>
  );
}
