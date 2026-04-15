import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.SERP_API_KEY;
const cache = {};

// 🔥 extract price safely
function extractPrice(priceStr) {
  if (!priceStr) return null;
  const num = Number(priceStr.replace(/[^\d]/g, ""));
  return num > 5000 ? null : num;
}

// 🔥 clean garbage prices
function cleanPrices(arr) {
  const valid = arr.filter(p => p != null);
  if (valid.length < 2) return arr;

  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;

  return arr.map(p => {
    if (!p) return null;
    if (p < avg * 0.5 || p > avg * 2) return null;
    return p;
  });
}

// 🔥 main search logic
async function searchItem(query) {
  if (cache[query]) return cache[query];

  let amazon = null;
  let flipkart = null;
  let bbasket = null;

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_shopping",
        q: `${query} 1kg`, // 🔥 standardization
        api_key: API_KEY,
        hl: "en",
        gl: "in",
      },
    });

    const results = response.data.shopping_results || [];

    results.forEach((item) => {
      const source = item.source?.toLowerCase() || "";
      const price = extractPrice(item.price);

      if (!price) return;

      if (source.includes("amazon")) {
        amazon = amazon ? Math.min(amazon, price) : price;
      }

      if (source.includes("flipkart")) {
        flipkart = flipkart ? Math.min(flipkart, price) : price;
      }

      if (source.includes("bigbasket")) {
        if (price < 50 || price > 1000) return; // 🔥 filter weird
        bbasket = bbasket ? Math.min(bbasket, price) : price;
      }
    });

  } catch (err) {
    console.log("⚠️ API failed");
  }

  // 🔥 remove extreme values
  [amazon, flipkart, bbasket] = cleanPrices([
    amazon,
    flipkart,
    bbasket
  ]);

  const data = { name: query, amazon, flipkart, bbasket };

  cache[query] = data;
  return data;
}

// 🔥 single search
app.get("/api/bulk-search", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "Query required" });

  try {
    const data = await searchItem(query);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

// 🔥 bulk search
app.post("/api/bulk-search", async (req, res) => {
  const { items } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: "Items required" });
  }

  try {
    const results = await Promise.all(items.map(searchItem));
    res.json(results);
  } catch {
    res.status(500).json({ error: "Bulk fetch failed" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on 5000"));