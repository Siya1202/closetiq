"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiGetItem, apiListWearLogs, resolveImageUrl } from "@/lib/api-client";
import WearLogButton from "@/components/WearLogButton";

interface PageProps {
  params: { itemId: string };
}

function MetaRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b border-black py-3">
      <span className="font-sans text-xs uppercase tracking-widest text-muted">{label}</span>
      <span className="font-sans text-xs uppercase tracking-widest">{value}</span>
    </div>
  );
}

export default function ItemDetailPage({ params }: PageProps) {
  const { itemId } = params;
  const router = useRouter();

  const { data: item, isLoading } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => apiGetItem(itemId),
  });

  const { data: wearLogs } = useQuery({
    queryKey: ["wearlogs", itemId],
    queryFn: () => apiListWearLogs(itemId),
    enabled: !!item,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-sans text-xs uppercase tracking-widest text-muted animate-pulse">Loading…</p>
      </div>
    );
  }

  if (!item) return null;

  const imageUrl = resolveImageUrl(item.photoUrl);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-8 py-6 border-b-2 border-black flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl">{item.brand ?? item.category}</h1>
          {item.brand && (
            <p className="font-sans text-xs uppercase tracking-widest text-muted mt-1">{item.category}</p>
          )}
        </div>
        <button
          onClick={() => router.back()}
          className="font-sans text-xs uppercase tracking-widest text-muted hover:text-black transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left — photo */}
        <div className="w-1/2 border-r-2 border-black relative bg-linen">
          {imageUrl && (
            <Image src={imageUrl} alt={item.category} fill className="object-cover" />
          )}
        </div>

        {/* Right — details */}
        <div className="w-1/2 overflow-y-auto p-8">
          {/* Log wear */}
          <div className="mb-8">
            <WearLogButton itemId={itemId} />
          </div>

          {/* Metadata */}
          <div className="mb-8">
            <p className="font-sans text-xs uppercase tracking-widest text-muted mb-2">Details</p>
            <div className="border-t border-black">
              <MetaRow label="Category" value={item.category} />
              <MetaRow label="Color" value={item.color} />
              <MetaRow label="Pattern" value={item.pattern} />
              <MetaRow label="Season" value={item.season} />
              <MetaRow label="Formality" value={item.formality} />
              <MetaRow label="Brand" value={item.brand} />
              <MetaRow label="Price" value={item.price ? `£${item.price}` : undefined} />
              <MetaRow label="Times worn" value={item.wearCount} />
              <MetaRow
                label="Cost per wear"
                value={item.costPerWear ? `£${item.costPerWear.toFixed(2)}` : undefined}
              />
            </div>
          </div>

          {/* Wear log history */}
          {wearLogs && wearLogs.length > 0 && (
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-muted mb-2">Wear history</p>
              <div className="border-t border-black">
                {wearLogs.map((log) => (
                  <div key={log.id} className="flex justify-between border-b border-black py-3">
                    <span className="font-sans text-xs">
                      {new Date(log.wornAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    {log.occasion && (
                      <span className="font-sans text-xs uppercase tracking-widest text-muted">
                        {log.occasion}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
