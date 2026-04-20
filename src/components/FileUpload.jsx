import { useState } from "react";
import * as XLSX from "xlsx";

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

      // 🔥 CALL YOUR NEW BACKEND
      const results = await Promise.all(
        extractedItems.map(async (item) => {
          const res = await fetch(
            `http://localhost:5000/api/search?query=${item.item}`
          );
          return await res.json();
        })
      );

      const finalItems = extractedItems.map((item, i) => {
        const apiData = results[i] || {};

        return {
          item: item.item,
          image: apiData.image,
          amazon: normalize(apiData.amazon),
          blinkit: normalize(apiData.blinkit),
          zepto: normalize(apiData.zepto),
          swiggy: normalize(apiData.swiggy),
          bbasket: normalize(apiData.bbasket),
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
    <div className={`card p-4 mb-4 shadow-sm ${dark ? "bg-secondary text-light" : ""}`}>
      <h5>📂 Upload Excel File</h5>

      <input type="file" className="form-control" onChange={handleFile} />

      {loading && (
        <p className="mt-3 text-warning">
          Fetching prices... ⏳
        </p>
      )}
    </div>
  );
};

export default FileUpload;