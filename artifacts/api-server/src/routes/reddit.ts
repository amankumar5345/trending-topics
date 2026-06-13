import { Router } from "express";

const router = Router();

router.get("/reddit/:subreddit", async (req, res) => {
  const { subreddit } = req.params;
  const { count = "25" } = req.query as { count?: string };

  const safeSubreddit = subreddit.replace(/[^a-zA-Z0-9_]/g, "");
  const safeCount = Math.min(parseInt(count as string) || 25, 50);
  const url = `https://meme-api.com/gimme/${safeSubreddit}/${safeCount}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "MemeRadar/1.0",
      },
    });

    // Treat 400, 404, 500 as "no posts" — these subreddits exist but aren't
    // image-heavy enough for meme-api.com, fall through to empty gracefully
    if (!response.ok) {
      if (response.status === 400 || response.status === 404 || response.status === 500) {
        res.json({ count: 0, memes: [] });
        return;
      }
      res.status(response.status).json({ error: `API returned ${response.status}` });
      return;
    }

    const data = await response.json();

    // meme-api.com can return error JSON with a 200 status
    if (data?.code === 404 || data?.message?.toLowerCase?.().includes("not found")) {
      res.json({ count: 0, memes: [] });
      return;
    }

    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to proxy meme request");
    res.status(502).json({ error: "Failed to fetch memes" });
  }
});

export default router;
