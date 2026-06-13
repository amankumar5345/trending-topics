import { useState } from "react";
import { useRedditMemes, SortType, TimeType } from "@/hooks/use-reddit";
import { STATES, CITIES } from "@/data/regions";
import { MatrixBackground } from "@/components/MatrixBackground";
import { MemeCard } from "@/components/MemeCard";
import { RefreshCw, Activity, Terminal, AlertTriangle, AlertCircle, MapPin, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const TOPICS = {
  "Trending": { subreddits: ["memes", "dankmemes"], keywords: [] },
  "Bollywood": { subreddits: ["bollywood", "BollyBlindsNGossip"], keywords: ["bollywood", "hindi film", "star", "actress", "actor"] },
  "Cricket": { subreddits: ["cricket", "IndianCricket"], keywords: ["cricket", "ipl", "bcci", "virat", "rohit", "dhoni"] },
  "Dank Indian": { subreddits: ["IndianDankMemes"], keywords: [] },
  "Funny": { subreddits: ["funny"], keywords: [] },
  "News & Satire": { subreddits: ["india", "unitedstatesofindia"], keywords: [] },
};

type FilterCategory = "topic" | "region";
type RegionTab = "states" | "cities";

export function Home() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("topic");
  const [activeTopic, setActiveTopic] = useState<string>("Trending");

  const [regionTab, setRegionTab] = useState<RegionTab>("states");
  const [activeState, setActiveState] = useState<string>("Delhi");
  const [activeCity, setActiveCity] = useState<string>("Mumbai");

  const [sort, setSort] = useState<SortType>("hot");
  const [time, setTime] = useState<TimeType>("day");

  // Determine active location config
  const locationConfig =
    activeCategory === "region"
      ? regionTab === "states"
        ? STATES[activeState]
        : CITIES[activeCity]
      : null;

  const topicConfig = TOPICS[activeTopic as keyof typeof TOPICS];

  const primarySubreddits = locationConfig?.subreddits ?? topicConfig.subreddits;
  const hookOptions =
    locationConfig
      ? { fallbackSubreddits: locationConfig.fallbackSubreddits, keywords: locationConfig.keywords }
      : { keywords: topicConfig.keywords };

  const { data: posts, isLoading, isError, error, refetch, isRefetching } = useRedditMemes(
    primarySubreddits,
    sort,
    time,
    hookOptions
  );

  const displaySubs = primarySubreddits.map((s) => `r/${s}`).join(", ");
  const activeLabel =
    activeCategory === "topic"
      ? activeTopic
      : regionTab === "states"
      ? activeState
      : activeCity;

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
            <span className="px-2 py-0.5 rounded bg-[#00ffff]/10 border border-[#00ffff]/30 font-bold text-[#00ffff] max-w-xs truncate">
              {displaySubs}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden sm:flex items-center gap-2 text-[#00ffff]/70">
            <span>INTEL:</span>
            <span className="font-bold text-[#ff00aa]">{posts?.length || 0} FEEDS</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#ff00aa] animate-pulse" />
            <span className="font-bold text-[#ff00aa]">LIVE</span>
          </div>
        </div>
      </div>

      <main className="pt-16 pb-24 px-4 lg:px-8 max-w-7xl mx-auto relative z-10">

        {/* FILTER BAR */}
        <div className="neon-cyan-box rounded-xl bg-black/60 backdrop-blur-md p-4 mb-8 sticky top-16 z-30 flex flex-col gap-3">

          {/* Row 1: Category toggle + Sort controls */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div className="flex items-center gap-2 bg-[#00ffff]/10 p-1 rounded-lg border border-[#00ffff]/20">
              <button
                onClick={() => setActiveCategory("topic")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeCategory === "topic" ? "bg-[#ff00aa] text-black shadow-[0_0_10px_#ff00aa]" : "text-[#00ffff] hover:bg-[#00ffff]/20"}`}
              >
                <Globe className="w-3.5 h-3.5" />
                TOPICS
              </button>
              <button
                onClick={() => setActiveCategory("region")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeCategory === "region" ? "bg-[#ff00aa] text-black shadow-[0_0_10px_#ff00aa]" : "text-[#00ffff] hover:bg-[#00ffff]/20"}`}
              >
                <MapPin className="w-3.5 h-3.5" />
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
                <div className="w-36">
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

          {/* Row 2: Filter chips */}
          <AnimatePresence mode="wait">
            {activeCategory === "topic" ? (
              <motion.div
                key="topics"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex flex-wrap gap-2"
              >
                {Object.keys(TOPICS).map((topic) => (
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
              </motion.div>
            ) : (
              <motion.div
                key="regions"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-3"
              >
                {/* States / Cities sub-tab */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRegionTab("states")}
                    className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                      regionTab === "states"
                        ? "border-[#00ffff] text-[#00ffff] bg-[#00ffff]/10 shadow-[0_0_8px_#00ffff50]"
                        : "border-[#00ffff]/30 text-[#00ffff]/50 hover:border-[#00ffff]/70 hover:text-[#00ffff]/80 bg-transparent"
                    }`}
                  >
                    STATES &amp; UTs
                  </button>
                  <button
                    onClick={() => setRegionTab("cities")}
                    className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                      regionTab === "cities"
                        ? "border-[#00ffff] text-[#00ffff] bg-[#00ffff]/10 shadow-[0_0_8px_#00ffff50]"
                        : "border-[#00ffff]/30 text-[#00ffff]/50 hover:border-[#00ffff]/70 hover:text-[#00ffff]/80 bg-transparent"
                    }`}
                  >
                    CITIES
                  </button>
                  <span className="text-[#00ffff]/40 text-xs ml-1">
                    — {activeLabel}
                  </span>
                </div>

                {/* Scrollable chip list */}
                <div className="max-h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#00ffff]/30 scrollbar-track-transparent">
                  <div className="flex flex-wrap gap-2">
                    {regionTab === "states"
                      ? Object.keys(STATES).map((state) => (
                          <button
                            key={state}
                            onClick={() => setActiveState(state)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                              activeState === state
                                ? "neon-active-chip"
                                : "border-[#00ffff]/30 text-[#00ffff]/70 hover:border-[#00ffff] hover:text-[#00ffff] bg-black/40"
                            }`}
                          >
                            {state}
                          </button>
                        ))
                      : Object.keys(CITIES).map((city) => (
                          <button
                            key={city}
                            onClick={() => setActiveCity(city)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                              activeCity === city
                                ? "neon-active-chip"
                                : "border-[#00ffff]/30 text-[#00ffff]/70 hover:border-[#00ffff] hover:text-[#00ffff] bg-black/40"
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              Sensors show zero visual data for this sector. This community may be quiet right now — try a nearby region or change your sort.
            </p>
            <Button
              className="mt-6 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]/50"
              onClick={() => refetch()}
            >
              RESCAN
            </Button>
          </div>
        ) : (
          <motion.div
            key={`${activeLabel}-${sort}-${time}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {posts?.map((post, i) => (
              <MemeCard key={post.id} post={post} index={i} />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
