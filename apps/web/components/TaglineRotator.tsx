"use client";

import { useState, useEffect } from "react";

const taglines = [
  "Your wardrobe,\nintelligently organised.",
  "Your style,\nvisually matched.",
  "Your look,\ncost-per-wear tracked.",
  "Your closet,\ncompletely optimised.",
];

export default function TaglineRotator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = taglines[currentIndex];
    const typingSpeed = isDeleting ? 25 : 50; // Deleting is faster

    let timer: any;

    if (!isDeleting && displayedText === fullText) {
      // Pause at the end of typing
      timer = setTimeout(() => setIsDeleting(true), 3500);
    } else if (isDeleting && displayedText === "") {
      // Go to next tagline
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % taglines.length);
    } else {
      // Add or remove a character
      timer = setTimeout(() => {
        setDisplayedText((prev) =>
          isDeleting
            ? fullText.substring(0, prev.length - 1)
            : fullText.substring(0, prev.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentIndex]);

  return (
    <div className="h-36 flex items-center mb-6 overflow-hidden">
      <p className="font-playfair text-4xl italic text-cream leading-tight whitespace-pre-line">
        {displayedText}
        <span className="inline-block w-[3px] h-8 bg-cream ml-1 align-middle animate-pulse" />
      </p>
    </div>
  );
}
