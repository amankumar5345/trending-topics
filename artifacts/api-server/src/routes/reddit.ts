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

    if (!response.ok) {
      res.status(response.status).json({ error: `API returned ${response.status}` });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to proxy meme request");
    res.status(502).json({ error: "Failed to fetch memes" });
  }
});

export default router;
