"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { apiCreateItem, apiAutoTagItem } from "@/lib/api-client";
import UploadDropzone from "@/components/UploadDropzone";

const CATEGORIES = ["Top", "Bottom", "Dress", "Outerwear", "Footwear", "Accessory", "Bag", "Other"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter", "All season"];
const FORMALITIES = ["Casual", "Smart casual", "Business casual", "Formal", "Activewear"];

export default function AddItemPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [photoUrl, setPhotoUrl] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [pattern, setPattern] = useState("");
  const [season, setSeason] = useState("");
  const [formality, setFormality] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isAutoTagging, setIsAutoTagging] = useState(false);

  async function handlePhotoUploaded(url: string) {
    setPhotoUrl(url);
    setIsAutoTagging(true);
    try {
      const tags = await apiAutoTagItem(url);
      if (tags.category) setCategory(tags.category);
      if (tags.color) setColor(tags.color);
      if (tags.pattern) setPattern(tags.pattern);
      if (tags.season) setSeason(tags.season);
      if (tags.formality) setFormality(tags.formality);
    } catch (err) {
      console.error("Auto-tagging failed:", err);
    } finally {
      setIsAutoTagging(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photoUrl) { setError("Please upload a photo first"); return; }
    if (!category) { setError("Category is required"); return; }
    setError("");
    setSaving(true);
    try {
      await apiCreateItem({
        photoUrl,
        category,
        color: color || undefined,
        pattern: pattern || undefined,
        season: season || undefined,
        formality: formality || undefined,
        brand: brand || undefined,
        price: price ? parseFloat(price) : undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ["items"] });
      router.push("/closet");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add item");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-8 py-6 border-b-[3px] border-black flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-serif text-4xl">Add item</h1>
        </div>
        <button
          onClick={() => router.back()}
          className="font-sans text-sm uppercase tracking-widest text-muted hover:text-black transition-colors"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
        {/* Left — photo upload */}
        <div className="w-full h-80 md:h-auto md:w-1/2 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black shrink-0 relative">
          <UploadDropzone onUploaded={handlePhotoUploaded} />
        </div>

        {/* Right — metadata form */}
        <div className="relative w-full md:w-1/2 md:overflow-y-auto">
          {isAutoTagging && (
            <div className="absolute inset-0 bg-cream/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="w-10 h-10 border-[3px] border-black border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest animate-pulse">Analyzing photo…</p>
            </div>
          )}
          
          <div className="p-8 space-y-6">
            {/* Category */}
          <div>
            <label className="block font-sans text-sm uppercase tracking-widest mb-2">
              Category <span className="text-terracotta">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-black appearance-none"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block font-sans text-sm uppercase tracking-widest mb-2">Color</label>
            <input
              id="color"
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="input-black"
              placeholder="e.g. Navy blue"
            />
          </div>

          {/* Pattern */}
          <div>
            <label className="block font-sans text-sm uppercase tracking-widest mb-2">Pattern</label>
            <input
              id="pattern"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="input-black"
              placeholder="e.g. Striped, Solid, Floral"
            />
          </div>

          {/* Season */}
          <div>
            <label className="block font-sans text-sm uppercase tracking-widest mb-2">Season</label>
            <select
              id="season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="input-black appearance-none"
            >
              <option value="">Select season</option>
              {SEASONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Formality */}
          <div>
            <label className="block font-sans text-sm uppercase tracking-widest mb-2">Formality</label>
            <select
              id="formality"
              value={formality}
              onChange={(e) => setFormality(e.target.value)}
              className="input-black appearance-none"
            >
              <option value="">Select formality</option>
              {FORMALITIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block font-sans text-sm uppercase tracking-widest mb-2">Brand</label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="input-black"
              placeholder="e.g. Arket, Zara, Vintage"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-sans text-sm uppercase tracking-widest mb-2">
              Purchase price
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-black"
              placeholder="0.00"
            />
          </div>

          {error && (
            <p className="font-sans text-xs text-terracotta border border-terracotta px-3 py-2">
              {error}
            </p>
          )}

            <button
              id="save-item-btn"
              type="submit"
              disabled={saving}
              className="btn-black w-full disabled:opacity-50"
            >
              {saving ? "Saving…" : "Add to closet →"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
