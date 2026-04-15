import { useState } from "react";
import * as XLSX from "xlsx";
import { priceData } from "../mockData";
import { normalizeName } from "../utils";

const FileUpload = ({ setItems, dark }) => {
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      processItems(json);
    };

    reader.readAsArrayBuffer(file);
  };

  const getItemName = (row) => {
    const keys = Object.keys(row);

    for (let key of keys) {
      const lower = key.toLowerCase();

      if (
        lower.includes("item") ||
        lower.includes("product") ||
        lower.includes("name") ||
        lower.includes("description")
      ) {
        return row[key];
      }
    }

    return Object.values(row)[1];
  };

  const cleanName = (name) => {
    name = name.toLowerCase();

    if (name.includes("soap")) return "bathing soap";
    if (name.includes("oil")) return "cooking oil";
    if (name.includes("tea")) return "tea powder";
    if (name.includes("flour") || name.includes("atta")) return "wheat flour";
    if (name.includes("dal")) return "lentils";
    if (name.includes("milk")) return "milk packet";

    return name;
  };

  const blendPrice = (base, api) => {
    if (!base) return api || null;
    if (!api) return base;
  
    const diff = Math.abs(api - base) / base;
  
    // ❌ if too different → ignore API
    if (diff > 0.5) return base;
  
    // ✅ blend values
    return Math.round((base + api) / 2);
  };

  const processItems = async (json) => {
    setLoading(true);

    try {
      const extractedItems = json
        .map((row) => {
          let name = getItemName(row);

          if (!name) return null;

          name = String(name).trim();

          if (
            !name ||
            name.toLowerCase().includes("total") ||
            !isNaN(name)
          ) {
            return null;
          }

          return { item: name };
        })
        .filter(Boolean);

      const itemNames = extractedItems.map((i) => cleanName(i.item));

      const res = await fetch("http://localhost:5000/api/bulk-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: itemNames }),
      });

      const data = await res.json();

      const finalItems = extractedItems.map((item, i) => {
        const apiData = data[i] || {};
      
        const normalized = normalizeName(item.item);
        const fallback = priceData[normalized] || priceData.other;
      
        return {
          item: item.item,
          amazon: blendPrice(fallback.amazon, apiData.amazon),
          flipkart: blendPrice(fallback.flipkart, apiData.flipkart),
          bbasket: blendPrice(fallback.bbasket, apiData.bbasket),
          qty: 1,
        };
      });

      setItems(finalItems);
    } catch (err) {
      console.error("Upload error:", err);
    }

    setLoading(false);
  };

  return (
    <div className={`card p-4 mb-4 ${dark ? "bg-secondary text-light" : ""}`}>
      <h5>📂 Upload Excel File</h5>

      <input type="file" className="form-control" onChange={handleFile} />

      {loading && (
        <p className="mt-3 text-warning">
          Fetching prices (optimized)... ⏳
        </p>
      )}
    </div>
  );
};

export default FileUpload;