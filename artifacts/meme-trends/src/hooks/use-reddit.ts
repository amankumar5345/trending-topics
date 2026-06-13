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
      return [];
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
    return time === "all" ? 50 : time === "month" ? 45 : time === "week" ? 40 : 30;
  }
  if (sort === "rising") return 50;
  return 25;
}

function applySortLogic(posts: RedditPost[], sort: SortType): RedditPost[] {
  switch (sort) {
    case "hot":
      return [...posts].sort((a, b) => b.score - a.score);

    case "new":
      return [...posts]
        .sort((a, b) => a.score - b.score)
        .map((p, i) => ({ p, rank: i + (Math.random() * 3 - 1.5) }))
        .sort((a, b) => a.rank - b.rank)
        .map(({ p }) => p);

    case "rising": {
      const mid = posts.filter((p) => p.score >= 100 && p.score <= 12000);
      const mega = posts.filter((p) => p.score > 12000);
      const fresh = posts.filter((p) => p.score < 100);
      return [
        ...mid.sort((a, b) => b.score - a.score),
        ...mega.sort((a, b) => b.score - a.score),
        ...fresh.sort((a, b) => b.score - a.score),
      ];
    }

    case "top":
      return [...posts].sort((a, b) => b.score - a.score);

    default:
      return posts;
  }
}

function applyKeywordFilter(posts: RedditPost[], keywords: string[]): RedditPost[] {
  if (!keywords.length) return posts;
  const kws = keywords.map((k) => k.toLowerCase());
  const matched = posts.filter((p) => {
    const text = `${p.title} ${p.subreddit}`.toLowerCase();
    return kws.some((k) => text.includes(k));
  });
  // If keyword filtering is too aggressive (< 3 results), return all posts
  // — at least the user sees content from the right community
  return matched.length >= 3 ? matched : posts;
}

export function useRedditMemes(
  primarySubreddits: string[],
  sort: SortType,
  time: TimeType,
  options?: {
    fallbackSubreddits?: string[];
    keywords?: string[];
  }
) {
  const fetchCount = countForSort(sort, time);
  const fallback = options?.fallbackSubreddits ?? [];
  const keywords = options?.keywords ?? [];

  return useQuery({
    queryKey: ["memes", primarySubreddits, sort, time, fallback, keywords],
    queryFn: async () => {
      // Fetch primary subreddits
      const primaryResults = await Promise.all(
        primarySubreddits.map((sub) => fetchSubreddit(sub, fetchCount))
      );
      const primaryPosts = primaryResults.flat();

      // If we have very few posts from primary subs, also fetch fallback subs
      let allPosts = primaryPosts;
      if (primaryPosts.length < 5 && fallback.length > 0) {
        const fallbackResults = await Promise.all(
          fallback.map((sub) => fetchSubreddit(sub, fetchCount))
        );
        const fallbackPosts = fallbackResults.flat();
        allPosts = [...primaryPosts, ...fallbackPosts];
      }

      // De-duplicate by id
      const uniqueIds = new Set<string>();
      const deduped: RedditPost[] = [];
      for (const p of allPosts) {
        if (!uniqueIds.has(p.id)) {
          uniqueIds.add(p.id);
          deduped.push(p);
        }
      }

      // Apply keyword filter when we have fallback posts mixed in
      const filtered = keywords.length > 0 ? applyKeywordFilter(deduped, keywords) : deduped;

      return applySortLogic(filtered, sort);
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 30 * 1000,
    retry: 1,
  });
}
