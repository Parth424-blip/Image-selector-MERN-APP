const express = require("express");
const router = express.Router();
const axios = require("axios");
const Search = require("../models/Search");

// Middleware to ensure authentication
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not authenticated" });
}

// Get top 5 search terms across all users
router.get("/top-searches", ensureAuth, async (req, res) => {
  try {
    const topTerms = await Search.aggregate([
      { $group: { _id: "$term", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { term: "$_id", count: 1, _id: 0 } },
    ]);
    res.json({ topSearches: topTerms.map((t) => t.term) });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Perform a search and save the term to user history
router.post("/search", ensureAuth, async (req, res) => {
  const { term } = req.body;
  if (!term) return res.status(400).json({ error: "Search term missing" });

  try {
    // Save search term to DB
    await Search.create({ userId: req.user._id, term });

    // Fetch images from Unsplash API
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query: term, per_page: 20 },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    // Map response to simplified image objects
    const images = response.data.results.map((img) => ({
      id: img.id,
      url: img.urls.small,
    }));

    res.json({ images });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Retrieve the last 20 searches by the authenticated user
router.get("/history", ensureAuth, async (req, res) => {
  try {
    const history = await Search.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(20)
      .select("term timestamp -_id");
    res.json({ history });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
