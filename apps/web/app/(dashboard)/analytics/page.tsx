"use client";

import { useQuery } from "@tanstack/react-query";
import { apiCostPerWear } from "@/lib/api-client";
import AnalyticsChart from "@/components/AnalyticsChart";

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cost-per-wear"],
    queryFn: apiCostPerWear,
  });

  // Prepare chart data — top 10 by wear count
  const chartData = data
    ?.slice(0, 10)
    .map((item) => ({
      name: item.category,
      wears: item.wearCount,
      cpw: item.costPerWear ? parseFloat(item.costPerWear.toFixed(2)) : 0,
    })) ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-4 md:px-8 py-6 border-b-[3px] border-black">
        <h1 className="font-serif text-3xl md:text-5xl">Analytics</h1>
        <p className="font-sans text-xs uppercase tracking-widest text-muted mt-2">
          Cost per wear &amp; wardrobe insights
        </p>
      </div>

      {/* Chart */}
      <div className="border-b-[3px] border-black px-4 md:px-8 py-8">
        <p className="font-sans text-xs uppercase tracking-widest text-muted mb-6">
          Wears by category — top 10
        </p>
        {isLoading ? (
          <p className="font-sans text-xs text-muted animate-pulse">Loading…</p>
        ) : (
          <AnalyticsChart data={chartData} />
        )}
      </div>

      {/* Cost per wear table */}
      <div className="flex-1 px-4 md:px-8 py-6">
        <p className="font-sans text-xs uppercase tracking-widest text-muted mb-4">
          Full breakdown
        </p>

        {error && (
          <p className="font-sans text-xs text-terracotta border border-terracotta px-3 py-2">
            Failed to load analytics.
          </p>
        )}

        {data && (
          <div className="border-t-2 border-black overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Table header */}
              <div className="grid grid-cols-4 border-b-[3px] border-black py-3">
                {["Item", "Category", "Times worn", "Cost / wear"].map((h) => (
                  <span key={h} className="font-sans text-xs uppercase tracking-widest text-muted">
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {data.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-4 border-b border-black py-3 hover:bg-linen transition-colors"
                >
                  <span className="font-sans text-xs truncate pr-4 capitalize">
                    {[item.brand, item.color, item.category].filter(Boolean).join(" ")}
                  </span>
                  <span className="font-sans text-xs uppercase tracking-widest text-muted">
                    {item.category}
                  </span>
                  <span className="font-sans text-xs">{item.wearCount}</span>
                  <span className="font-sans text-xs">
                    {item.costPerWear ? `£${item.costPerWear.toFixed(2)}` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
