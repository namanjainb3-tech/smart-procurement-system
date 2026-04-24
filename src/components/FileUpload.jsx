import { useState } from "react";
import * as XLSX from "xlsx";

const FileUpload = ({ setItems, dark }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [currentItem, setCurrentItem] = useState("");

  const normalize = (val) => {
    if (val === null || val === undefined) return null;

    const num = Number(val);
    return isNaN(num) ? null : num;
  };

  const estimateMissingPrices = (data) => {
    const prices = [
      data.amazon,
      data.flipkart,
      data.blinkit,
      data.zepto,
      data.swiggy,
      data.bbasket,
    ].filter((p) => p !== null);

    const base =
      prices.length > 0
        ? Math.round(
            prices.reduce(
              (a, b) => a + b,
              0
            ) / prices.length
          )
        : 100;

    return {
      amazon:
        data.amazon ??
        Math.round(base * 1.08),

      flipkart:
        data.flipkart ??
        Math.round(base * 1.05),

      blinkit:
        data.blinkit ??
        Math.round(base * 0.98),

      zepto:
        data.zepto ??
        Math.round(base * 1.0),

      swiggy:
        data.swiggy ??
        Math.round(base * 1.02),

      bbasket:
        data.bbasket ??
        Math.round(base * 0.96),
    };
  };

  const getItemName = (row) => {
    const keys = Object.keys(row);

    for (let key of keys) {
      const lower =
        key.toLowerCase();

      if (
        lower.includes("item") ||
        lower.includes("product") ||
        lower.includes("name") ||
        lower.includes(
          "description"
        )
      ) {
        return row[key];
      }
    }

    return Object.values(row)[1];
  };

  const getQty = (row) => {
    const keys = Object.keys(row);

    for (let key of keys) {
      if (
        key
          .toLowerCase()
          .includes("qty")
      ) {
        return (
          Number(row[key]) || 1
        );
      }
    }

    return 1;
  };

  const handleFile = (e) => {
    const file =
      e.target.files[0];

    if (!file) return;

    setSuccess("");
    setCurrentItem("");

    const reader =
      new FileReader();

    reader.onload = function (
      event
    ) {
      const data =
        new Uint8Array(
          event.target.result
        );

      const workbook =
        XLSX.read(data, {
          type: "array",
        });

      const sheet =
        workbook.Sheets[
          workbook
            .SheetNames[0]
        ];

      const json =
        XLSX.utils.sheet_to_json(
          sheet
        );

      processItems(json);
    };

    reader.readAsArrayBuffer(
      file
    );
  };

  const processItems = async (
    json
  ) => {
    setLoading(true);

    try {
      let extractedItems =
        json
          .map((row) => {
            let name =
              getItemName(row);

            if (!name)
              return null;

            name = String(
              name
            ).trim();

            if (
              !name ||
              name
                .toLowerCase()
                .includes(
                  "total"
                ) ||
              !isNaN(name)
            ) {
              return null;
            }

            return {
              item: name,
              qty: getQty(
                row
              ),
            };
          })
          .filter(Boolean);

      // merge duplicates
      const merged = {};

      extractedItems.forEach(
        (item) => {
          const key =
            item.item.toLowerCase();

          if (merged[key]) {
            merged[
              key
            ].qty +=
              item.qty;
          } else {
            merged[key] = {
              ...item,
            };
          }
        }
      );

      extractedItems =
        Object.values(
          merged
        );

      const API_URL = "https://smart-procurement-system.onrender.com";

      const results = [];

      for (const item of extractedItems) {
        setCurrentItem(
          item.item
        );

        const res =
          await fetch(
            `${API_URL}/api/search?query=${item.item}`
          );

        const data =
          await res.json();

        results.push(data);

        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        await fetch(
          `${API_URL}/api/user-item`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              {
                google_id:
                  user.google_id,
                item_name:
                  item.item,
                image:
                  data.image,
                amazon:
                  data.amazon,
                flipkart:
                  data.flipkart,
                blinkit:
                  data.blinkit,
                zepto:
                  data.zepto,
                swiggy:
                  data.swiggy,
                bbasket:
                  data.bbasket,
                qty: item.qty,
              }
            ),
          }
        );
      }

      const finalItems =
        extractedItems.map(
          (item, i) => {
            const apiData =
              results[i] ||
              {};

            const raw = {
              amazon:
                normalize(
                  apiData.amazon
                ),
              flipkart:
                normalize(
                  apiData.flipkart
                ),
              blinkit:
                normalize(
                  apiData.blinkit
                ),
              zepto:
                normalize(
                  apiData.zepto
                ),
              swiggy:
                normalize(
                  apiData.swiggy
                ),
              bbasket:
                normalize(
                  apiData.bbasket
                ),
            };

            const prices =
              estimateMissingPrices(
                raw
              );

            return {
              item: item.item,
              image:
                apiData.image,

              ...prices,

              // TRUST STATUS
              amazon_status:
                apiData.amazon_status,
              flipkart_status:
                apiData.flipkart_status,
              blinkit_status:
                apiData.blinkit_status,
              zepto_status:
                apiData.zepto_status,
              swiggy_status:
                apiData.swiggy_status,
              bbasket_status:
                apiData.bbasket_status,

              qty: item.qty,
            };
          }
        );

        setItems((prev) => {
          const merged = [...prev];
        
          finalItems.forEach((newItem) => {
            const index = merged.findIndex(
              (item) =>
                item.item.toLowerCase() ===
                newItem.item.toLowerCase()
            );
        
            if (index !== -1) {
              merged[index] = {
                ...merged[index],
                ...newItem,
                qty:
                  (merged[index].qty || 0) +
                  (newItem.qty || 0),
              };
            } else {
              merged.push(newItem);
            }
          });
        
          return merged;
        });

      setSuccess(
        "✅ File uploaded successfully"
      );
    } catch (err) {
      console.error(
        "Upload error:",
        err
      );

      setSuccess(
        "❌ Upload failed"
      );
    }

    setCurrentItem("");
    setLoading(false);
  };

  return (
    <div
      className={`card p-4 mb-4 shadow-sm ${
        dark
          ? "bg-secondary text-light"
          : ""
      }`}
    >
      <h5>
        📂 Upload Excel File
      </h5>

      <input
        type="file"
        className="form-control mt-3"
        onChange={
          handleFile
        }
      />

      {loading && (
        <p className="mt-3 text-warning fw-bold">
          Fetching prices for{" "}
          <span className="text-info">
            {currentItem}
          </span>{" "}
          ... ⏳
        </p>
      )}

      {success && (
        <p
          className={`mt-3 fw-bold ${
            dark
              ? "text-light"
              : "text-success"
          }`}
        >
          {success}
        </p>
      )}
    </div>
  );
};

export default FileUpload;