import { useState } from "react";
import { useRedditMemes, SortType, TimeType } from "@/hooks/use-reddit";
import { MatrixBackground } from "@/components/MatrixBackground";
import { MemeCard } from "@/components/MemeCard";
import { RefreshCw, Activity, Terminal, AlertTriangle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const REGIONS = {
  "All India": ["india", "IndiaDiscussion"],
  "Mumbai": ["mumbai"],
  "Delhi": ["delhi"],
  "Bangalore": ["bangalore"],
  "Chennai": ["Chennai"],
  "Kolkata": ["kolkata"],
  "Hyderabad": ["hyderabad"],
};

const TOPICS = {
  "Trending": ["memes", "dankmemes"],
  "Bollywood": ["bollywood", "BollyBlindsNGossip"],
  "Cricket": ["cricket", "IndianCricket"],
  "Dank Indian": ["IndianDankMemes"],
  "Funny": ["funny"],
  "News & Satire": ["india", "unitedstatesofindia"],
};

type FilterCategory = "region" | "topic";

export function Home() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("topic");
  const [activeRegion, setActiveRegion] = useState<string>("All India");
  const [activeTopic, setActiveTopic] = useState<string>("Trending");
  
  const [sort, setSort] = useState<SortType>("hot");
  const [time, setTime] = useState<TimeType>("day");

  const subreddits = activeCategory === "region" 
    ? REGIONS[activeRegion as keyof typeof REGIONS] 
    : TOPICS[activeTopic as keyof typeof TOPICS];

  const { data: posts, isLoading, isError, error, refetch, isRefetching } = useRedditMemes(subreddits, sort, time);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-[#00ffff] font-mono selection:bg-[#ff00aa] selection:text-white">
      <div className="scanline" />
      <MatrixBackground />

      {/* TOP STATS BAR */}
      <div className="fixed top-0 left-0 right-0 h-12 border-b border-[#00ffff]/30 bg-black/80 backdrop-blur-xl z-40 flex items-center justify-between px-4 lg:px-8 text-xs lg:text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold tracking-wider neon-pink-text text-base lg:text-lg">
            <Terminal className="w-5 h-5 text-[#ff00aa]" />
            MEMERADAR
          </div>
          <div className="hidden md:flex items-center gap-2 text-[#00ffff]/70">
            <span>TARGET:</span>
            <span className="px-2 py-0.5 rounded bg-[#00ffff]/10 border border-[#00ffff]/30 font-bold text-[#00ffff]">
              {subreddits.map(s => `r/${s}`).join(', ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden sm:flex items-center gap-2 text-[#00ffff]/70">
            <span>INTEL:</span>
            <span className="font-bold text-[#ff00aa]">
              {posts?.length || 0} FEEDS
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#ff00aa] animate-pulse" />
            <span className="font-bold text-[#ff00aa]">LIVE</span>
          </div>
        </div>
      </div>

      <main className="pt-16 pb-24 px-4 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* FILTER BAR */}
        <div className="neon-cyan-box rounded-xl bg-black/60 backdrop-blur-md p-4 mb-8 sticky top-16 z-30 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            
            <div className="flex items-center gap-2 bg-[#00ffff]/10 p-1 rounded-lg border border-[#00ffff]/20">
              <button 
                onClick={() => setActiveCategory("topic")}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeCategory === "topic" ? "bg-[#ff00aa] text-black shadow-[0_0_10px_#ff00aa]" : "text-[#00ffff] hover:bg-[#00ffff]/20"}`}
              >
                TOPICS
              </button>
              <button 
                onClick={() => setActiveCategory("region")}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeCategory === "region" ? "bg-[#ff00aa] text-black shadow-[0_0_10px_#ff00aa]" : "text-[#00ffff] hover:bg-[#00ffff]/20"}`}
              >
                REGIONS
              </button>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="w-32">
                <Select value={sort} onValueChange={(val) => setSort(val as SortType)}>
                  <SelectTrigger className="h-8 bg-black border-[#00ffff]/50 text-[#00ffff] text-xs font-mono">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#00ffff] text-[#00ffff] font-mono">
                    <SelectItem value="hot">HOT</SelectItem>
                    <SelectItem value="new">NEW</SelectItem>
                    <SelectItem value="rising">RISING</SelectItem>
                    <SelectItem value="top">TOP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {sort === "top" && (
                <div className="w-32">
                  <Select value={time} onValueChange={(val) => setTime(val as TimeType)}>
                    <SelectTrigger className="h-8 bg-black border-[#00ffff]/50 text-[#00ffff] text-xs font-mono">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#00ffff] text-[#00ffff] font-mono">
                      <SelectItem value="day">TODAY</SelectItem>
                      <SelectItem value="week">THIS WEEK</SelectItem>
                      <SelectItem value="month">THIS MONTH</SelectItem>
                      <SelectItem value="all">ALL TIME</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#00ffff]/50 text-[#00ffff] bg-black hover:bg-[#00ffff]/20 hover:text-[#ff00aa] hover:border-[#ff00aa]"
                onClick={() => refetch()}
                disabled={isRefetching}
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeCategory === "topic" && Object.keys(TOPICS).map(topic => (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  activeTopic === topic 
                    ? "neon-active-chip" 
                    : "border-[#00ffff]/30 text-[#00ffff]/70 hover:border-[#00ffff] hover:text-[#00ffff] bg-black/40"
                }`}
              >
                {topic}
              </button>
            ))}

            {activeCategory === "region" && Object.keys(REGIONS).map(region => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  activeRegion === region 
                    ? "neon-active-chip" 
                    : "border-[#00ffff]/30 text-[#00ffff]/70 hover:border-[#00ffff] hover:text-[#00ffff] bg-black/40"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        {isError && (
          <Alert variant="destructive" className="bg-black/80 border-[#ff0000] text-[#ff0000] neon-pink-box mb-8">
            <AlertCircle className="h-4 w-4" color="#ff0000" />
            <AlertTitle>CONNECTION FAILED</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Intercepted signal lost. Rate limit exceeded or CORS block."}
            </AlertDescription>
            <Button 
              className="mt-4 bg-[#ff0000]/20 hover:bg-[#ff0000]/40 text-[#ff0000] border border-[#ff0000]"
              onClick={() => refetch()}
            >
              RETRY CONNECTION
            </Button>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="neon-cyan-box rounded-xl aspect-[4/5] bg-black/40 animate-pulse flex items-center justify-center">
                <Terminal className="w-8 h-8 text-[#00ffff]/30" />
              </div>
            ))}
          </div>
        ) : !isError && posts && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-[#00ffff]/30 rounded-2xl bg-black/40 neon-cyan-box">
            <AlertTriangle className="w-16 h-16 text-[#ff00aa] mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-[#ff00aa] mb-2">NO INTEL FOUND</h2>
            <p className="text-[#00ffff]/70 max-w-md">
              Sensors show zero visual data for this sector. Change your filters or wait for new transmissions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts?.map((post, i) => (
              <MemeCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
