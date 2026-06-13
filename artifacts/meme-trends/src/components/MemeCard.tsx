import { RedditPost } from "@/hooks/use-reddit";
import { formatDistanceToNow } from "date-fns";
import { Flame, MessageSquare, ExternalLink, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface MemeCardProps {
  post: RedditPost;
  index: number;
}

export function MemeCard({ post, index }: MemeCardProps) {
  const timeAgo = formatDistanceToNow(post.created_utc * 1000, { addSuffix: true });

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="neon-cyan-box rounded-xl overflow-hidden bg-black/60 backdrop-blur-sm group flex flex-col cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:neon-pink-box"
      onClick={() => window.open(post.permalink, "_blank")}
    >
      <div className="relative w-full aspect-[4/5] bg-black/80 flex items-center justify-center overflow-hidden border-b border-[#00ffff]/30 group-hover:border-[#ff00aa]/50 transition-colors">
        <img
          src={post.highResImage}
          alt={post.title}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x500/000000/00ffff?text=NO+IMAGE';
          }}
        />
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-[#00ffff] text-xs font-bold text-[#00ffff] uppercase">
          r/{post.subreddit}
        </div>
      </div>
      
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="text-white text-sm font-bold line-clamp-2 leading-tight group-hover:text-[#ff00aa] transition-colors">
          {post.title}
        </h3>
        
        <div className="mt-auto flex items-center justify-between text-xs text-[#00ffff]/70">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#ff00aa]" />
              <span className="font-mono">{formatNumber(post.score)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="font-mono">{formatNumber(post.num_comments)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px]">{timeAgo}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
