import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 CONFIG
const BASE_URL = "https://api.quickcommerceapi.com/v1/search";
const API_KEY = process.env.QC_API_KEY;

const PORT = process.env.PORT || 5000;

// 📍 Default location (can make dynamic later)
const LAT = 28.661252;
const LON = 77.284175;

// 🔥 Fetch data from ONE platform
async function fetchPlatform(query, platform) {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        q: query,
        lat: LAT,
        lon: LON,
        platform: platform,
      },
      headers: {
        "X-API-Key": API_KEY, // ✅ correct auth
      },
    });

    // 🔍 Debug (optional)
    console.log(`\n🔍 ${platform}:`, res.data?.data?.products?.length || 0, "products");

    const products = res.data?.data?.products || [];

    if (!products.length) return null;

    const best = products[0]; // top result

    return {
      price: Number(best.offer_price), // ✅ convert to number
      image: best.images?.[0] || null,
      platform: platform,
    };

  } catch (err) {
    console.log(`❌ ${platform}:`, err.response?.data || err.message);
    return null;
  }
}

// 🔥 MAIN SEARCH API
app.get("/api/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query required" });
  }

  try {
    const platforms = [
      "BlinkIt",   // ⚠️ exact case required
      "Zepto",
      "Swiggy",
      "BigBasket",
      "DMart",
      "JioMart"
    ];

    const results = await Promise.all(
      platforms.map((p) => fetchPlatform(query, p))
    );

    const valid = results.filter(Boolean);

    // 🔥 final structured response
    let data = {
      name: query,
      image: null,
      blinkit: null,
      zepto: null,
      swiggy: null,
      bbasket: null,
      dmart: null,
      jiomart: null,
    };

    valid.forEach((item) => {
      // first available image
      if (!data.image && item.image) {
        data.image = item.image;
      }

      if (item.platform === "BlinkIt") data.blinkit = item.price;
      if (item.platform === "Zepto") data.zepto = item.price;
      if (item.platform === "Swiggy") data.swiggy = item.price;
      if (item.platform === "BigBasket") data.bbasket = item.price;
      if (item.platform === "DMart") data.dmart = item.price;
      if (item.platform === "JioMart") data.jiomart = item.price;
    });

    res.json(data);

  } catch (err) {
    console.log("🔥 Server error:", err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// 🚀 START SERVER
app.listen(5000, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});