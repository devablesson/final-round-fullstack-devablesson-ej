import { useEffect, useState } from "react";
import { fetchVendors, createVendor } from "./api/vendors";
import type { Vendor } from "./types/vendor";

/**
 * Temporary integration screen.
 * This will be replaced by the Vendors table UI later.
 */
function App() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch vendors on first render
  useEffect(() => {
    fetchVendors()
      .then((data) => {
        setVendors(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-semibold">Vendors</h1>

        {/* Loading state */}
        {loading && (
          <p className="mt-4 text-sm text-gray-600">
            Loading vendors…
          </p>
        )}

        {/* Error state */}
        {!loading && error && (
          <p className="mt-4 text-sm text-red-600">
            Error: {error}
          </p>
        )}

        {/* Success state */}
        {!loading && !error && (
          <p className="mt-4 text-sm text-gray-600">
            Vendors loaded: {vendors.length}
          </p>
        )}

        {/* TEMP BUTTON — for integration testing only */}
        <button
          className="mt-6 px-4 py-2 rounded bg-black text-white text-sm hover:bg-gray-800"
          onClick={() => {
            createVendor({
              name: "Frontend Test Vendor",
              payment_type: "Card",
            })
              .then(() => {
                alert("Vendor created successfully");
                return fetchVendors();
              })
              .then(setVendors)
              .catch((err) => alert(err.message));
          }}
        >
          Create Test Vendor
        </button>
      </main>
    </div>
  );
}

export default App;
