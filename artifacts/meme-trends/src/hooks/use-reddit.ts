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

async function fetchSubreddit(subreddit: string): Promise<RedditPost[]> {
  try {
    const res = await fetch(`/api/reddit/${subreddit}?count=25`);

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

export function useRedditMemes(subreddits: string[], _sort: SortType, _time: TimeType) {
  return useQuery({
    queryKey: ["memes", subreddits],
    queryFn: async () => {
      const promises = subreddits.map((sub) => fetchSubreddit(sub));
      const results = await Promise.all(promises);
      const allPosts = results.flat();

      allPosts.sort((a, b) => b.score - a.score);

      const uniqueIds = new Set<string>();
      const finalPosts: RedditPost[] = [];
      for (const p of allPosts) {
        if (!uniqueIds.has(p.id)) {
          uniqueIds.add(p.id);
          finalPosts.push(p);
        }
      }

      return finalPosts;
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
    retry: 1,
  });
}
