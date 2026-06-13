import { useRedditMemes } from "@/hooks/use-reddit";
import { Trophy, Flame, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const LEADERBOARD_SUBS = ["memes", "dankmemes", "bollywood", "IndianDankMemes", "funny"];

interface LeaderboardProps {
  onOpen: (permalink: string) => void;
}

export function Leaderboard({ onOpen }: LeaderboardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: posts, isLoading } = useRedditMemes(
    LEADERBOARD_SUBS,
    "top",
    "day",
    { keywords: [] }
  );

  const top10 = posts?.slice(0, 10) ?? [];

  const formatNumber = (n: number) =>
    n >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toString();

  const rankColor = (i: number) => {
    if (i === 0) return "#ffd700";
    if (i === 1) return "#c0c0c0";
    if (i === 2) return "#cd7f32";
    return "var(--lb-muted)";
  };

  return (
    <>
      {/* Toggle tab */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-2 py-4 rounded-l-xl text-xs font-bold transition-all"
        style={{
          background: "var(--lb-card)",
          border: "1px solid var(--lb-border)",
          borderRight: "none",
          color: "var(--lb-accent)",
          writingMode: "vertical-rl",
          boxShadow: "var(--lb-glow)",
        }}
        title="Top 10 Today"
      >
        <Trophy className="w-4 h-4" style={{ transform: "rotate(90deg)" }} />
        TOP 10
      </button>

      {/* Sidebar panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="lb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            {/* Panel */}
            <motion.div
              key="lb-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 flex flex-col"
              style={{
                background: "var(--lb-card)",
                borderLeft: "1px solid var(--lb-border)",
                boxShadow: "-4px 0 20px rgba(0,0,0,0.5)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 shrink-0"
                style={{ borderBottom: "1px solid var(--lb-border)" }}
              >
                <div className="flex items-center gap-2 font-bold text-sm" style={{ color: "var(--lb-accent)" }}>
                  <Trophy className="w-4 h-4" />
                  <span>TOP 10 TODAY</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded"
                  style={{ color: "var(--lb-muted)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded animate-pulse"
                        style={{ background: "var(--lb-hover)" }}>
                        <div className="w-6 h-6 rounded" style={{ background: "var(--lb-border)" }} />
                        <div className="flex-1 h-3 rounded" style={{ background: "var(--lb-border)" }} />
                      </div>
                    ))
                  : top10.map((post, i) => (
                      <motion.button
                        key={post.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 p-2 rounded text-left w-full transition-all group"
                        style={{ background: "transparent" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--lb-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        onClick={() => window.open(post.permalink, "_blank")}
                      >
                        {/* Rank */}
                        <span
                          className="w-6 text-center font-bold text-sm shrink-0 font-mono"
                          style={{ color: rankColor(i) }}
                        >
                          {i + 1}
                        </span>

                        {/* Thumbnail */}
                        <div className="w-12 h-12 shrink-0 rounded overflow-hidden"
                          style={{ border: "1px solid var(--lb-border)" }}>
                          <img
                            src={post.url}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium line-clamp-2 leading-tight"
                            style={{ color: "var(--lb-text)" }}>
                            {post.title}
                          </p>
                          <div className="flex items-center gap-1 mt-1" style={{ color: "var(--lb-muted)" }}>
                            <Flame className="w-3 h-3" style={{ color: "var(--lb-accent)" }} />
                            <span className="text-xs font-mono">{formatNumber(post.score)}</span>
                            <span className="text-xs ml-1 opacity-60">r/{post.subreddit}</span>
                          </div>
                        </div>

                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: "var(--lb-accent)" }} />
                      </motion.button>
                    ))}
              </div>

              <div className="text-center text-xs py-2 shrink-0" style={{ color: "var(--lb-muted)", borderTop: "1px solid var(--lb-border)" }}>
                Updates every 5 min
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
