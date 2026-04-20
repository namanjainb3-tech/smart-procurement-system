import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.QC_API_KEY;

const BASE_URL = "https://api.quickcommerceapi.com/v1/search";

async function testQC(query) {
  console.log(`\n🔎 Testing for: ${query}\n`);

  const platforms = ["BlinkIt", "Zepto", "Swiggy", "BigBasket"];

  for (const platform of platforms) {
    try {
      const res = await axios.get(BASE_URL, {
        params: {
          q: query,
          lat: 12.9716,
          lon: 77.5946,
          platform,
        },
        headers: {
          "X-API-Key": API_KEY,
        },
      });

      const products = res.data?.data?.products;

      console.log(`\n📦 ${platform}`);
      console.log("----------------------");

      if (!products || products.length === 0) {
        console.log("❌ No products found");
        continue;
      }

      const product = products[0];

      console.log("✅ Name:", product?.name);
      console.log("💰 Price:", product?.offer_price);
      console.log("🖼️ Image:", product?.images?.[0]);

    } catch (err) {
      console.log(`❌ ${platform} error`);
      console.log(err.message);
    }
  }
}

// 🔥 CHANGE QUERY HERE
testQC("milk");