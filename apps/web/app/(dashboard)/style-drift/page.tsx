"use client";

import { useQuery } from "@tanstack/react-query";
import { apiStyleDrift } from "@/lib/api-client";

export default function StyleDriftPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["style-drift"],
    queryFn: apiStyleDrift,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-8 py-6 border-b-[3px] border-black">
        <h1 className="font-serif text-5xl">Style drift</h1>
        <p className="font-sans text-xs uppercase tracking-widest text-muted mt-2">
          How your style has evolved over time
        </p>
      </div>

      <div className="flex-1 px-8 py-8">
        {isLoading && (
          <p className="font-sans text-xs text-muted animate-pulse">Loading…</p>
        )}

        {error && (
          <p className="font-sans text-xs text-terracotta border border-terracotta px-3 py-2">
            Failed to load style drift data.
          </p>
        )}

        {data && data.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <p className="font-serif text-2xl text-muted italic">
              Not enough data yet — keep logging wears!
            </p>
          </div>
        )}

        {data && data.length > 0 && (
          <div className="space-y-0 border-t-2 border-black">
            {data.map((entry) => {
              const topCategories = Object.entries(entry.categories)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5);

              const topFormality = Object.entries(entry.formalities)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3);

              return (
                <div key={entry.period} className="border-b-[3px] border-black py-6">
                  <p className="font-sans text-xs uppercase tracking-widest text-muted mb-4">
                    {entry.period}
                  </p>

                  <div className="grid grid-cols-2 gap-8">
                    {/* Categories */}
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-muted mb-3">
                        Categories
                      </p>
                      <div className="space-y-2">
                        {topCategories.map(([cat, count]) => (
                          <div key={cat} className="flex items-center gap-3">
                            <div
                              className="h-[2px] bg-black shrink-0"
                              style={{
                                width: `${Math.min(count * 20, 120)}px`,
                              }}
                            />
                            <span className="font-sans text-xs uppercase tracking-wider">
                              {cat} ({count})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Formality */}
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-muted mb-3">
                        Formality
                      </p>
                      <div className="space-y-2">
                        {topFormality.map(([f, count]) => (
                          <div key={f} className="flex items-center gap-3">
                            <div
                              className="h-[2px] bg-muted shrink-0"
                              style={{
                                width: `${Math.min(count * 20, 120)}px`,
                              }}
                            />
                            <span className="font-sans text-xs uppercase tracking-wider text-muted">
                              {f} ({count})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
