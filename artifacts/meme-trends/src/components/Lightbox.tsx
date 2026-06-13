import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Flame, ExternalLink } from "lucide-react";
import { RedditPost } from "@/hooks/use-reddit";

interface LightboxProps {
  posts: RedditPost[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({ posts, index, onClose, onPrev, onNext }: LightboxProps) {
  const isOpen = index !== null;
  const post = index !== null ? posts[index] : null;

  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < posts.length - 1;

  const formatNumber = (n: number) =>
    n >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toString();

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    },
    [isOpen, hasPrev, hasNext, onClose, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && post && (
        <motion.div
          key="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.95)" }}
          onClick={onClose}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 p-2 rounded-full border transition-all"
            style={{
              borderColor: "var(--lb-border)",
              background: "var(--lb-card)",
              color: "var(--lb-text)",
            }}
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            className="absolute left-3 z-10 p-3 rounded-full border transition-all disabled:opacity-20"
            style={{
              borderColor: "var(--lb-border)",
              background: "var(--lb-card)",
              color: "var(--lb-text)",
            }}
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            disabled={!hasPrev}
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next */}
          <button
            className="absolute right-3 z-10 p-3 rounded-full border transition-all disabled:opacity-20"
            style={{
              borderColor: "var(--lb-border)",
              background: "var(--lb-card)",
              color: "var(--lb-text)",
            }}
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            disabled={!hasNext}
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Content */}
          <motion.div
            key={post.id}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col max-w-4xl w-full mx-16 max-h-[90vh] rounded-xl overflow-hidden"
            style={{
              border: "1px solid var(--lb-border)",
              boxShadow: "var(--lb-glow)",
              background: "var(--lb-card)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image area */}
            <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden"
              style={{ background: "#000", maxHeight: "70vh" }}
            >
              <img
                src={post.highResImage}
                alt={post.title}
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: "70vh" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/800x600/000000/00ffff?text=NO+IMAGE";
                }}
              />
            </div>

            {/* Meta bar */}
            <div className="shrink-0 p-4 flex items-start justify-between gap-4"
              style={{ borderTop: "1px solid var(--lb-border)" }}
            >
              <div className="flex flex-col gap-1 min-w-0">
                <p className="font-bold text-sm leading-tight" style={{ color: "var(--lb-text)" }}>
                  {post.title}
                </p>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--lb-muted)" }}>
                  <span className="font-mono px-2 py-0.5 rounded"
                    style={{ border: "1px solid var(--lb-border)", color: "var(--lb-accent)" }}>
                    r/{post.subreddit}
                  </span>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" style={{ color: "var(--lb-accent)" }} />
                    <span className="font-mono">{formatNumber(post.score)}</span>
                  </div>
                  <span>u/{post.author}</span>
                </div>
              </div>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold border transition-all"
                style={{
                  borderColor: "var(--lb-accent)",
                  color: "var(--lb-accent)",
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Reddit
              </a>
            </div>

            {/* Counter */}
            <div className="text-center text-xs pb-2" style={{ color: "var(--lb-muted)" }}>
              {(index ?? 0) + 1} / {posts.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
