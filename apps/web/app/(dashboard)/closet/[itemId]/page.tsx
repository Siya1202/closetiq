"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiGetItem, apiListWearLogs, resolveImageUrl } from "@/lib/api-client";
import WearLogButton from "@/components/WearLogButton";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

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
      <div className="px-8 py-6 border-b-[3px] border-black flex items-center justify-between">
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

      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
        {/* Left — photo */}
        <div className="w-full h-80 md:h-auto md:w-1/2 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black relative bg-linen shrink-0">
          {imageUrl && (
            <div className="absolute inset-4 md:inset-8">
              <div className="w-full h-full border-2 border-black bg-white p-2 md:p-3 shadow-md flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image src={imageUrl} alt={item.category} fill className="object-contain md:object-cover" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right — details */}
        <div className="w-full md:w-1/2 md:overflow-y-auto p-6 md:p-8 flex flex-col">

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

          {/* Actions (Log wear & Delete) */}
          <div className="mt-auto pt-8 flex items-end justify-between">
            <WearLogButton itemId={itemId} />
            <button
              onClick={async () => {
                if (confirm("Are you sure you want to delete this item?")) {
                  try {
                    await import("@/lib/api-client").then(m => m.apiDeleteItem(itemId));
                    await queryClient.invalidateQueries({ queryKey: ["items"] });
                    router.push("/closet");
                  } catch (err) {
                    alert("Failed to delete item");
                  }
                }
              }}
              className="font-sans text-xs uppercase tracking-widest text-black hover:text-white transition-colors border border-black px-4 py-2 hover:bg-black"
            >
              Delete Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
