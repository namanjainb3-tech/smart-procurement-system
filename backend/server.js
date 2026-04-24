// backend/server.js

import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ENV
const QC_API_KEY = process.env.QC_API_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;
const APIFY_TOKEN = process.env.APIFY_TOKEN;
const ACTOR_ID = process.env.APIFY_ACTOR_ID;

// ============================
// ROOT
// ============================
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ============================
// QUICK COMMERCE
// ============================
const BASE_URL =
  "https://api.quickcommerceapi.com/v1/search";

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

    const product =
      res.data?.data?.products?.[0];

    const hasPrice =
      product?.offer_price !== undefined &&
      product?.offer_price !== null;

    return {
      price: hasPrice
        ? Number(product.offer_price)
        : null,
      image: product?.images?.[0] || null,
      status: hasPrice ? "live" : "estimated",
    };
  } catch (err) {
    return {
      price: null,
      image: null,
      status: "estimated",
    };
  }
}

// ============================
// SERP
// ============================
async function fetchSerp(query, site) {
  try {
    const res = await axios.get(
      "https://serpapi.com/search.json",
      {
        params: {
          engine: "google",
          q: `${query} ${site} price`,
          api_key: SERP_API_KEY,
        },
      }
    );

    const shopping =
      res.data.shopping_results;

    if (shopping?.length) {
      return {
        price: Number(
          shopping[0].price.replace(/[^\d]/g, "")
        ),
        image: shopping[0].thumbnail || null,
        status: "live",
      };
    }

    return {
      price: null,
      image: null,
      status: "estimated",
    };
  } catch {
    return {
      price: null,
      image: null,
      status: "estimated",
    };
  }
}

// ============================
// AMAZON
// ============================
async function waitForRun(runId) {
  let status = "RUNNING";

  while (
    status === "RUNNING" ||
    status === "READY"
  ) {
    await new Promise((r) =>
      setTimeout(r, 2000)
    );

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
        startUrls: [
          {
            url: `https://www.amazon.in/s?k=${query}`,
          },
        ],
        maxItems: 3,
      }
    );

    const runId = runRes.data.data.id;

    const ok = await waitForRun(runId);

    if (!ok)
      return {
        price: null,
        image: null,
        status: "estimated",
      };

    const datasetRes = await axios.get(
      `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}`
    );

    const item = datasetRes.data?.[0];

    if (!item)
      return {
        price: null,
        image: null,
        status: "estimated",
      };

    const hasPrice = !!item.price;

    return {
      price: hasPrice
        ? Number(
            item.price
              .toString()
              .replace(/[^\d]/g, "")
          )
        : null,
      image: item.image || null,
      status: hasPrice ? "live" : "estimated",
    };
  } catch {
    return {
      price: null,
      image: null,
      status: "estimated",
    };
  }
}

// ============================
// NORMALIZE
// ============================
function normalizePrice(price, avg) {
  if (!price && avg)
    return Math.round(avg);

  if (!price) return null;

  if (
    avg &&
    (price > avg * 2 || price < avg * 0.5)
  ) {
    return Math.round(avg);
  }

  return price;
}

// ============================
// LOGIN
// ============================
app.post("/api/login", async (req, res) => {
  try {
    const {
      google_id,
      name,
      email,
      photo,
    } = req.body;

    await db.query(
      `
      INSERT INTO users
      (google_id,name,email,photo)

      VALUES (?,?,?,?)

      ON DUPLICATE KEY UPDATE
      name=VALUES(name),
      email=VALUES(email),
      photo=VALUES(photo)
      `,
      [google_id, name, email, photo]
    );

    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Login failed" });
  }
});

// ============================
// SEARCH
// ============================
app.get("/api/search", async (req, res) => {
  try {
    const query =
      req.query.query?.trim();

    if (!query) {
      return res
        .status(400)
        .json({ error: "Query required" });
    }

    // CACHE
    const [rows] = await db.query(
      `
      SELECT *,
      TIMESTAMPDIFF(HOUR,created_at,NOW()) age
      FROM grocery_items
      WHERE LOWER(item_name)=LOWER(?)
      LIMIT 1
      `,
      [query]
    );

    if (
      rows.length &&
      rows[0].age < 6
    ) {
      return res.json({
        name: rows[0].item_name,
        image: rows[0].image,

        amazon: rows[0].amazon,
        flipkart: rows[0].flipkart,
        blinkit: rows[0].blinkit,
        zepto: rows[0].zepto,
        swiggy: rows[0].swiggy,
        bbasket: rows[0].bbasket,

        amazon_status: "cache",
        flipkart_status: "cache",
        blinkit_status: "cache",
        zepto_status: "cache",
        swiggy_status: "cache",
        bbasket_status: "cache",

        qty: rows[0].qty,
        source: "cache",
      });
    }

    // LIVE
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

    const prices = [
      blinkit.price,
      zepto.price,
      swiggy.price,
    ].filter(Boolean);

    const avg = prices.length
      ? prices.reduce(
          (a, b) => a + b,
          0
        ) / prices.length
      : null;

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

      amazon: normalizePrice(
        amazon.price,
        avg
      ),
      flipkart: normalizePrice(
        flipkart.price,
        avg
      ),
      bbasket: normalizePrice(
        bbasket.price,
        avg
      ),
      blinkit: normalizePrice(
        blinkit.price,
        avg
      ),
      zepto: normalizePrice(
        zepto.price,
        avg
      ),
      swiggy: normalizePrice(
        swiggy.price,
        avg
      ),

      amazon_status:
        amazon.price !== null
          ? amazon.status
          : "estimated",

      flipkart_status:
        flipkart.price !== null
          ? flipkart.status
          : "estimated",

      bbasket_status:
        bbasket.price !== null
          ? bbasket.status
          : "estimated",

      blinkit_status:
        blinkit.price !== null
          ? blinkit.status
          : "estimated",

      zepto_status:
        zepto.price !== null
          ? zepto.status
          : "estimated",

      swiggy_status:
        swiggy.price !== null
          ? swiggy.status
          : "estimated",
    };

    await db.query(
      `
      INSERT INTO grocery_items
      (item_name,image,amazon,flipkart,blinkit,zepto,swiggy,bbasket,qty)

      VALUES (?,?,?,?,?,?,?,?,1)

      ON DUPLICATE KEY UPDATE
      image=VALUES(image),
      amazon=VALUES(amazon),
      flipkart=VALUES(flipkart),
      blinkit=VALUES(blinkit),
      zepto=VALUES(zepto),
      swiggy=VALUES(swiggy),
      bbasket=VALUES(bbasket),
      created_at=CURRENT_TIMESTAMP
      `,
      [
        response.name,
        response.image,
        response.amazon,
        response.flipkart,
        response.blinkit,
        response.zepto,
        response.swiggy,
        response.bbasket,
      ]
    );

    res.json({
      ...response,
      source: "live",
    });
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

app.post("/api/user-item", async (req, res) => {
  try {
    const {
      google_id,
      item_name,
      image,
      amazon,
      flipkart,
      blinkit,
      zepto,
      swiggy,
      bbasket,
      qty
    } = req.body;

    await db.query(
      `
      INSERT INTO user_items
      (
        google_id,
        item_name,
        image,
        amazon,
        flipkart,
        blinkit,
        zepto,
        swiggy,
        bbasket,
        qty
      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

      ON DUPLICATE KEY UPDATE
      image = VALUES(image),
      amazon = VALUES(amazon),
      flipkart = VALUES(flipkart),
      blinkit = VALUES(blinkit),
      zepto = VALUES(zepto),
      swiggy = VALUES(swiggy),
      bbasket = VALUES(bbasket),
      qty = VALUES(qty),
      updated_at = CURRENT_TIMESTAMP
      `,
      [
        google_id,
        item_name,
        image,
        amazon,
        flipkart,
        blinkit,
        zepto,
        swiggy,
        bbasket,
        qty
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.log("❌ USER ITEM ERROR:", err.message);

    res.status(500).json({
      error: "Failed to save item"
    });
  }
});

app.get("/api/user-items/:google_id", async (req, res) => {
  try {
    const { google_id } = req.params;

    const [rows] = await db.query(
      `
      SELECT * FROM user_items
      WHERE google_id = ?
      ORDER BY updated_at DESC
      `,
      [google_id]
    );

    const items = rows.map((row) => ({
      item: row.item_name,
      image: row.image,
      amazon: row.amazon,
      flipkart: row.flipkart,
      blinkit: row.blinkit,
      zepto: row.zepto,
      swiggy: row.swiggy,
      bbasket: row.bbasket,
      qty: row.qty,
    }));

    res.json(items);

  } catch (err) {
    console.log(err.message);
    res.status(500).json([]);
  }
});

// ============================
// START
// ============================
app.listen(PORT, () => {
  console.log(
    `🚀 Server running on ${PORT}`
  );
});