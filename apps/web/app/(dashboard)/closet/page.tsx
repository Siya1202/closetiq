"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { apiListItems } from "@/lib/api-client";
import ItemCard from "@/components/ItemCard";

export default function ClosetPage() {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ["items"],
    queryFn: apiListItems,
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Page header */}
      <div className="px-8 py-6 border-b-[3px] border-black">
        <h1 className="font-serif text-5xl">Your closet</h1>
      </div>

      {/* Grid area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <p className="font-sans text-xs uppercase tracking-widest text-muted animate-pulse">
              Loading…
            </p>
          </div>
        )}

        {error && (
          <div className="p-8">
            <p className="font-sans text-xs text-terracotta border border-terracotta px-3 py-2">
              Failed to load wardrobe items.
            </p>
          </div>
        )}

        {items && items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="font-serif text-2xl text-muted italic">
              Your closet is empty
            </p>
            <Link href="/closet/add" className="btn-black">
              Add your first item →
            </Link>
          </div>
        )}

        {items && items.length > 0 && (
          /* Bento grid: 3 columns, rows auto-sized, dividing lines via gap + border */
          <div
            className="grid grid-cols-3 border-b-2 border-black"
            style={{ gridAutoRows: "280px" }}
          >
            {items.map((item, i) => {
              // Every 5th card spans 2 columns to create variety like the mockup
              const isWide = i % 5 === 0;
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  className={`border-r-2 border-b-2 border-black ${
                    isWide ? "col-span-2" : ""
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t-[3px] border-black px-8 py-4 flex items-center justify-between bg-cream">
        <div>
          <p className="font-sans text-xs text-muted">
            {items?.length ?? "—"} items
          </p>
        </div>
        <Link
          href="/closet/add"
          id="add-item-btn"
          className="font-sans text-xs uppercase tracking-widest text-black hover:text-muted transition-colors"
        >
          add item →
        </Link>
      </div>
    </div>
  );
}
