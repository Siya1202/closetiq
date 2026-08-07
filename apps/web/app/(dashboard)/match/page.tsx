"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiMatch } from "@/lib/api-client";
import ItemCard from "@/components/ItemCard";

export default function MatchPage() {
  const [query, setQuery] = useState("");

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: (q: string) => apiMatch(q, 12),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) mutate(query.trim());
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-8 py-6 border-b-[3px] border-black">
        <h1 className="font-serif text-5xl">Find a match</h1>
        <p className="font-sans text-xs uppercase tracking-widest text-muted mt-2">
          Describe what you&apos;re looking for
        </p>
      </div>

      {/* Search */}
      <div className="border-b-[3px] border-black px-8 py-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            id="match-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-black flex-1"
            placeholder="e.g. cosy navy blue knitwear for a cold day…"
          />
          <button
            id="match-search-btn"
            type="submit"
            disabled={isPending}
            className="btn-black shrink-0 disabled:opacity-50"
          >
            {isPending ? "Searching…" : "Search →"}
          </button>
        </form>

        {error && (
          <p className="font-sans text-xs text-terracotta border border-terracotta px-3 py-2 mt-4">
            {error instanceof Error ? error.message : "Search failed"}
          </p>
        )}
      </div>

      {/* Results */}
      <div className="flex-1">
        {data?.matches && data.matches.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <p className="font-serif text-2xl text-muted italic">No matches found</p>
          </div>
        )}

        {data?.matches && data.matches.length > 0 && (
          <div
            className="grid grid-cols-3 border-b border-black"
            style={{ gridAutoRows: "260px" }}
          >
            {data.matches.map((item, i) => (
              <ItemCard
                key={item.id}
                item={item}
                className={`border-r border-b border-black ${i % 5 === 0 ? "col-span-2" : ""}`}
              />
            ))}
          </div>
        )}

        {!data && !isPending && (
          <div className="flex items-center justify-center h-64">
            <p className="font-serif text-xl text-muted italic">
              Start by describing a style above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
