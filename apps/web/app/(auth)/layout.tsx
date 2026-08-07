import TaglineRotator from "@/components/TaglineRotator";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex w-[45%] bg-black flex-col justify-between p-12 pr-20 border-r-2 border-black relative overflow-hidden">
        <span className="font-sans text-2xl text-cream tracking-tight">closetiq</span>
        <div>
          <TaglineRotator />
          <p className="font-sans text-xs uppercase tracking-widest text-muted">
            AI-powered closet management
          </p>
        </div>
        <div /> {/* Spacer to keep the middle block centered */}

        {/* Vertical Marquee Divider */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-cream border-l border-black overflow-hidden flex flex-col items-center py-4 select-none">
          <div className="animate-marquee-vertical flex gap-12 text-[10px] font-sans font-bold uppercase tracking-widest text-black whitespace-nowrap" style={{ writingMode: "vertical-rl" }}>
            <span>Track. Wear. Repeat.</span>
            <span>Track. Wear. Repeat.</span>
            <span>Track. Wear. Repeat.</span>
            <span>Track. Wear. Repeat.</span>
            <span>Track. Wear. Repeat.</span>
            <span>Track. Wear. Repeat.</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-cream p-8">
        {children}
      </div>
    </div>
  );
}
