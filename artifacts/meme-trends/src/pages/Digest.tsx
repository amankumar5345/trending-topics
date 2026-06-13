import { useRedditMemes } from "@/hooks/use-reddit";
import { MemeCard } from "@/components/MemeCard";
import { MatrixBackground } from "@/components/MatrixBackground";
import { Lightbox } from "@/components/Lightbox";
import { Terminal, ArrowLeft, Share2, CheckCheck, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";

const DIGEST_CATEGORIES = [
  { label: "🔥 Trending", subs: ["memes", "dankmemes"], keywords: [] },
  { label: "🎬 Bollywood", subs: ["bollywood", "BollyBlindsNGossip"], keywords: ["bollywood"] },
  { label: "🏏 Cricket", subs: ["cricket", "IndianCricket"], keywords: ["cricket", "ipl"] },
  { label: "😈 Dank Indian", subs: ["IndianDankMemes"], keywords: [] },
  { label: "😂 Funny", subs: ["funny"], keywords: [] },
  { label: "📰 News & Satire", subs: ["india", "unitedstatesofindia"], keywords: [] },
];

function CategorySection({ label, subs, keywords }: { label: string; subs: string[]; keywords: string[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const { data: posts, isLoading } = useRedditMemes(subs, "top", "day", { keywords });
  const top5 = posts?.slice(0, 5) ?? [];

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base font-bold font-mono" style={{ color: "var(--lb-text)" }}>
          {label}
        </h2>
        <div className="flex-1 h-px" style={{ background: "var(--lb-border)" }} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-xl animate-pulse"
              style={{ background: "var(--lb-hover)" }} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {top5.map((post, i) => (
              <MemeCard
                key={post.id}
                post={post}
                index={i}
                onOpen={() => setLightboxIdx(i)}
              />
            ))}
          </div>
          <Lightbox
            posts={top5}
            index={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx((v) => (v !== null ? Math.max(0, v - 1) : null))}
            onNext={() => setLightboxIdx((v) => (v !== null ? Math.min(top5.length - 1, v + 1) : null))}
          />
        </>
      )}
    </section>
  );
}

export function Digest() {
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="min-h-screen font-mono" style={{ background: "var(--lb-bg)", color: "var(--lb-text)" }}>
      <div className="scanline" />
      <MatrixBackground />

      {/* Header */}
      <div className="sticky top-0 z-40 h-12 flex items-center justify-between px-4 lg:px-8 text-sm"
        style={{ background: "var(--lb-header-bg)", borderBottom: "1px solid var(--lb-border)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 font-bold transition-all"
            style={{ color: "var(--lb-muted)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2 font-bold" style={{ color: "var(--lb-accent)" }}>
            <Terminal className="w-4 h-4" />
            MEMERADAR
          </div>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all"
          style={{
            borderColor: copied ? "#22c55e" : "var(--lb-accent)",
            color: copied ? "#22c55e" : "var(--lb-accent)",
          }}
        >
          {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Share Digest"}
        </button>
      </div>

      <main className="pt-8 pb-24 px-4 lg:px-8 max-w-6xl mx-auto relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-7 h-7" style={{ color: "#ffd700" }} />
            <h1 className="text-2xl lg:text-3xl font-bold tracking-wide" style={{ color: "var(--lb-text)" }}>
              Today's Best Memes
            </h1>
            <Trophy className="w-7 h-7" style={{ color: "#ffd700" }} />
          </div>
          <p className="text-sm" style={{ color: "var(--lb-muted)" }}>{today}</p>
          <p className="text-xs mt-1" style={{ color: "var(--lb-muted)" }}>
            Top 5 picks from every category — click any meme to view fullscreen
          </p>
        </motion.div>

        {DIGEST_CATEGORIES.map((cat) => (
          <CategorySection key={cat.label} {...cat} />
        ))}
      </main>
    </div>
  );
}
