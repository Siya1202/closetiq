"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiLogWear } from "@/lib/api-client";

interface WearLogButtonProps {
  itemId: string;
  onLogged?: () => void;
}

export default function WearLogButton({ itemId, onLogged }: WearLogButtonProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [occasion, setOccasion] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [logged, setLogged] = useState(false);

  async function handleLog() {
    setLoading(true);
    try {
      await apiLogWear(itemId, occasion || undefined);
      // Invalidate both the item and the items list
      await queryClient.invalidateQueries({ queryKey: ["items"] });
      await queryClient.invalidateQueries({ queryKey: ["item", itemId] });
      await queryClient.invalidateQueries({ queryKey: ["wearlogs", itemId] });
      setLogged(true);
      setShowInput(false);
      setOccasion("");
      onLogged?.();
    } catch {
      // Silently ignore
    } finally {
      setLoading(false);
    }
  }

  if (logged) {
    return (
      <div className="inline-flex items-center gap-2 border-2 border-terracotta bg-terracotta px-4 py-2">
        <span className="font-sans text-xs font-medium uppercase tracking-widest text-cream">
          Logged ✓
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {showInput && (
        <input
          id="occasion-input"
          type="text"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          placeholder="Occasion (optional)"
          className="input-black text-xs"
          onKeyDown={(e) => e.key === "Enter" && handleLog()}
        />
      )}
      <div className="flex gap-2">
        <button
          id="log-wear-btn"
          onClick={showInput ? handleLog : () => setShowInput(true)}
          disabled={loading}
          className="inline-flex items-center border-2 border-terracotta bg-terracotta px-4 py-2 font-sans text-xs font-medium uppercase tracking-widest text-cream hover:bg-cream hover:text-terracotta transition-all disabled:opacity-50"
        >
          {loading ? "Logging…" : "Log wear"}
        </button>
        {showInput && (
          <button
            onClick={() => setShowInput(false)}
            className="font-sans text-xs text-muted hover:text-black transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
