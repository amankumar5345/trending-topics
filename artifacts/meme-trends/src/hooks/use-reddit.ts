import { useQuery } from "@tanstack/react-query";

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  score: number;
  num_comments: number;
  subreddit: string;
  permalink: string;
  highResImage: string;
  author: string;
  created_utc: number;
}

export type SortType = "hot" | "top" | "rising" | "new";
export type TimeType = "day" | "week" | "month" | "all";

interface MemeApiItem {
  postLink: string;
  subreddit: string;
  title: string;
  url: string;
  nsfw: boolean;
  spoiler: boolean;
  author: string;
  ups: number;
  preview: string[];
}

async function fetchSubreddit(subreddit: string, count: number): Promise<RedditPost[]> {
  try {
    const res = await fetch(`/api/reddit/${subreddit}?count=${count}`);
    if (!res.ok) {
      if (res.status === 429) throw new Error("Rate limited — please wait a moment.");
      throw new Error(`Failed to fetch from ${subreddit}: ${res.statusText}`);
    }

    const json = await res.json();
    const memes: MemeApiItem[] = json?.memes || [];

    return memes
      .filter((m) => !m.nsfw && !m.spoiler && m.url?.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i))
      .map((m, i) => ({
        id: `${m.subreddit}-${i}-${m.postLink.split("/").pop()}`,
        title: m.title,
        url: m.url,
        score: m.ups,
        num_comments: 0,
        subreddit: m.subreddit,
        permalink: m.postLink,
        highResImage: m.preview?.length > 0 ? m.preview[m.preview.length - 1] : m.url,
        author: m.author,
        created_utc: Date.now() / 1000,
      }));
  } catch (error) {
    console.error(`Error fetching ${subreddit}:`, error);
    return [];
  }
}

function countForSort(sort: SortType, time: TimeType): number {
  if (sort === "top") {
    // More posts for broader time windows
    return time === "all" ? 50 : time === "month" ? 45 : time === "week" ? 40 : 30;
  }
  if (sort === "rising") return 50;
  return 25;
}

function applySortLogic(posts: RedditPost[], sort: SortType): RedditPost[] {
  switch (sort) {
    case "hot":
      // High-score posts first — "hot" right now
      return [...posts].sort((a, b) => b.score - a.score);

    case "new":
      // Lower-score posts first — they're fresh and haven't gone viral yet
      // Shuffle in slight randomness to feel like a live new feed
      return [...posts]
        .sort((a, b) => a.score - b.score)
        .map((p, i) => ({ p, rank: i + (Math.random() * 3 - 1.5) }))
        .sort((a, b) => a.rank - b.rank)
        .map(({ p }) => p);

    case "rising": {
      // Rising = gaining traction — posts in the mid-score range
      const midRange = posts.filter((p) => p.score >= 100 && p.score <= 12000);
      const megaViral = posts.filter((p) => p.score > 12000);
      const fresh = posts.filter((p) => p.score < 100);
      // Show mid-range first (rising), then mega-viral, then very fresh
      return [
        ...midRange.sort((a, b) => b.score - a.score),
        ...megaViral.sort((a, b) => b.score - a.score),
        ...fresh.sort((a, b) => b.score - a.score),
      ];
    }

    case "top":
      // Strict best-of sort — highest score wins
      return [...posts].sort((a, b) => b.score - a.score);

    default:
      return posts;
  }
}

export function useRedditMemes(subreddits: string[], sort: SortType, time: TimeType) {
  const fetchCount = countForSort(sort, time);

  return useQuery({
    queryKey: ["memes", subreddits, sort, time],
    queryFn: async () => {
      const promises = subreddits.map((sub) => fetchSubreddit(sub, fetchCount));
      const results = await Promise.all(promises);
      const allPosts = results.flat();

      // De-duplicate by id
      const uniqueIds = new Set<string>();
      const deduped: RedditPost[] = [];
      for (const p of allPosts) {
        if (!uniqueIds.has(p.id)) {
          uniqueIds.add(p.id);
          deduped.push(p);
        }
      }

      return applySortLogic(deduped, sort);
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 30 * 1000,
    retry: 1,
  });
}
