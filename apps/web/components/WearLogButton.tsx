"use client";

import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiLogWear } from "@/lib/api-client";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

interface WearLogButtonProps {
  itemId: string;
  onLogged?: () => void;
}

export default function WearLogButton({ itemId, onLogged }: WearLogButtonProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [occasion, setOccasion] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showInput, setShowInput] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLog() {
    setLoading(true);
    try {
      const wornAt = date.toISOString();
      await apiLogWear(itemId, occasion || undefined, wornAt);
      await queryClient.invalidateQueries({ queryKey: ["items"] });
      await queryClient.invalidateQueries({ queryKey: ["item", itemId] });
      await queryClient.invalidateQueries({ queryKey: ["wearlogs", itemId] });
      
      setShowInput(false);
      setShowCalendar(false);
      setOccasion("");
      setDate(new Date());
      onLogged?.();
    } catch {
      // Silently ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <button
          id="log-wear-btn"
          onClick={showInput ? handleLog : () => setShowInput(true)}
          disabled={loading}
          className="inline-flex items-center border-2 border-black bg-black px-4 py-2 font-sans text-xs font-medium uppercase tracking-widest text-cream hover:bg-cream hover:text-black transition-all disabled:opacity-50"
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
      {showInput && (
        <div className="flex gap-2 relative">
          <button
            type="button"
            onClick={() => setShowCalendar(true)}
            className="input-black text-xs w-36 text-left whitespace-nowrap"
          >
            {format(date, "d MMMM yyyy")}
          </button>
          
          {showCalendar && (
            <div ref={calendarRef} className="absolute bottom-full left-0 mb-2 z-50 bg-cream border-[3px] border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <DayPicker
                mode="single"
                selected={date}
                onSelect={(d) => {
                  if (d) setDate(d);
                  setShowCalendar(false);
                }}
                disabled={{ after: new Date() }}
                className="font-sans text-xs"
              />
            </div>
          )}

          <input
            id="occasion-input"
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="Occasion (optional)"
            className="input-black text-xs flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleLog()}
          />
        </div>
      )}
    </div>
  );
}
