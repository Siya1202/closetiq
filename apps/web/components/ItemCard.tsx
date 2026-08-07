"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { type Item, resolveImageUrl } from "@/lib/api-client";

interface ItemCardProps {
  item: Item;
  className?: string;
}

function isWornToday(lastWornAt?: string): boolean {
  if (!lastWornAt) return false;
  const worn = new Date(lastWornAt);
  const now = new Date();
  return (
    worn.getDate() === now.getDate() &&
    worn.getMonth() === now.getMonth() &&
    worn.getFullYear() === now.getFullYear()
  );
}

export default function ItemCard({ item, className = "" }: ItemCardProps) {
  const wornToday = isWornToday(item.lastWornAt);
  const imageUrl = resolveImageUrl(item.photoUrl);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative overflow-hidden border-black bg-linen ${className}`}
    >
      <Link href={`/closet/${item.id}`} className="block h-full">
        {/* Photo */}
        {imageUrl ? (
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={item.category}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        ) : (
          /* Placeholder: alternating linen/sand */
          <div className="absolute inset-0 bg-linen" />
        )}

        {/* Worn today badge */}
        {wornToday && (
          <div className="absolute top-3 right-3 bg-terracotta px-2 py-1">
            <span className="font-sans text-[10px] font-medium uppercase tracking-widest text-cream">
              Worn today
            </span>
          </div>
        )}

        {/* Item label */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-black drop-shadow-sm">
            {item.brand ? `${item.brand} — ` : ""}
            {item.category}
          </p>
          {item.color && (
            <p className="font-sans text-[10px] uppercase tracking-wider text-muted">
              {item.color}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
