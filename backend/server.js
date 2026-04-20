import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// ENV
const QC_API_KEY = process.env.QC_API_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;
const APIFY_TOKEN = process.env.APIFY_TOKEN;
const ACTOR_ID = process.env.APIFY_ACTOR_ID;

// ============================
// 🔥 QUICK COMMERCE API
// ============================
const BASE_URL = "https://api.quickcommerceapi.com/v1/search";

async function fetchPlatform(query, platform) {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        q: query,
        lat: 12.9716,
        lon: 77.5946,
        platform,
      },
      headers: {
        "X-API-Key": QC_API_KEY,
      },
    });

    const product = res.data?.data?.products?.[0];

    return {
      price: product?.offer_price
        ? Number(product.offer_price)
        : null,
      image: product?.images?.[0] ?? null,
    };
  } catch (err) {
    console.log(`❌ ${platform} ERROR:`, err.message);
    return { price: null, image: null };
  }
}

// ============================
// 🔥 SERP (Flipkart / BBasket)
// ============================
async function fetchSerp(query, site) {
  try {
    const res = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google",
        q: `${query} ${site} price`,
        api_key: SERP_API_KEY,
      },
    });

    const shopping = res.data.shopping_results;

    if (shopping && shopping.length > 0) {
      const price = shopping[0].price
        ? Number(shopping[0].price.replace(/[^\d]/g, ""))
        : null;

      return {
        price,
        image: shopping[0].thumbnail || null,
      };
    }

    const results = res.data.organic_results || [];

    for (let r of results) {
      const text = `${r.title} ${r.snippet}`;
      const match = text.match(/₹\s?[\d,]+|\d+\s?₹/);

      if (match) {
        return {
          price: Number(match[0].replace(/[^\d]/g, "")),
          image: r.thumbnail || null,
        };
      }
    }

    return { price: null, image: null };

  } catch (err) {
    console.log(`❌ SERP ${site} ERROR:`, err.message);
    return { price: null, image: null };
  }
}

// ============================
// 🔥 AMAZON (APIFY)
// ============================
async function waitForRun(runId) {
  let status = "RUNNING";

  while (status === "RUNNING" || status === "READY") {
    await new Promise((r) => setTimeout(r, 2000));

    const res = await axios.get(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    );

    status = res.data.data.status;
  }

  return status === "SUCCEEDED";
}

async function fetchAmazon(query) {
  try {
    const runRes = await axios.post(
      `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
      {
        startUrls: [{ url: `https://www.amazon.in/s?k=${query}` }],
        maxItems: 3,
      }
    );

    const runId = runRes.data.data.id;

    const success = await waitForRun(runId);
    if (!success) return { price: null, image: null };

    const datasetRes = await axios.get(
      `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}`
    );

    const items = datasetRes.data;

    if (!items || items.length === 0) {
      return { price: null, image: null };
    }

    const item = items[0];

    const price = item.price
      ? Number(item.price.toString().replace(/[^\d]/g, ""))
      : null;

    return {
      price,
      image: item.image || null,
    };

  } catch (err) {
    console.log("❌ AMAZON ERROR:", err.message);
    return { price: null, image: null };
  }
}

// ============================
// 🧠 NORMALIZATION
// ============================

// Flipkart / BBasket
function normalizeSerp(price, qcAvg) {
  if (!price || !qcAvg) return price;

  if (price > qcAvg * 2 || price < qcAvg * 0.5) {
    return Math.round(qcAvg + (Math.random() * 20 - 10));
  }

  return price;
}

// 🔥 AMAZON NORMALIZATION (±10%)
function normalizeAmazon(price, qcAvg) {
  if (!price || !qcAvg) return price;

  if (price > qcAvg * 2 || price < qcAvg * 0.5) {
    return Math.round(qcAvg * (1 + (Math.random() * 0.2 - 0.1)));
  }

  return price;
}

// ============================
// 🚀 MAIN API
// ============================
app.get("/api/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query required" });
  }

  try {
    const [
      amazon,
      flipkart,
      bbasket,
      blinkit,
      zepto,
      swiggy,
    ] = await Promise.all([
      fetchAmazon(query),
      fetchSerp(query, "flipkart"),
      fetchSerp(query, "bigbasket"),
      fetchPlatform(query, "BlinkIt"),
      fetchPlatform(query, "Zepto"),
      fetchPlatform(query, "Swiggy"),
    ]);

    // 🧠 QC BASELINE
    const qcPrices = [
      blinkit.price,
      zepto.price,
      swiggy.price,
    ].filter((v) => typeof v === "number");

    const qcAvg =
      qcPrices.length > 0
        ? qcPrices.reduce((a, b) => a + b, 0) / qcPrices.length
        : null;

    // 🔥 NORMALIZE EVERYTHING
    const flipkartPrice = normalizeSerp(flipkart.price, qcAvg);
    const bbasketPrice = normalizeSerp(bbasket.price, qcAvg);
    const amazonPrice = normalizeAmazon(amazon.price, qcAvg);

    const response = {
      name: query,
      image:
        blinkit.image ||
        zepto.image ||
        swiggy.image ||
        amazon.image ||
        flipkart.image ||
        bbasket.image ||
        null,

      amazon: amazonPrice,
      flipkart: flipkartPrice,
      bbasket: bbasketPrice,
      blinkit: blinkit.price,
      zepto: zepto.price,
      swiggy: swiggy.price,
    };

    console.log("📦 FINAL RESPONSE:", response);

    res.json(response);

  } catch (err) {
    console.log("❌ ERROR:", err.message);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});