🛒 Smart Procurement

A modern React-based smart shopping assistant that helps users compare prices across multiple platforms and find the most cost-effective purchasing strategy.

LIVE DEMO: https://smart-procurement-bay.vercel.app/

🚀 Features
🔍 Quick Search for items with real-time suggestions

📊 Price Comparison across:
Amazon
Flipkart
BigBasket

📂 Excel Upload Support (auto-extract items)

➕ Add to Cart System

🔢 Dynamic Quantity Management

💡 Smart Insights Panel

Total cost per platform
Optimized minimum cost
Savings calculation
Best platform recommendation

📈 Interactive Price Chart (Chart.js)

🌙 Dark Mode Support

💾 Local Storage Persistence

🧠 How It Works
Items are added via:
Search box

Excel upload

Each item is:
Normalized using custom logic (normalizeName)

Mapped to predefined price data

App calculates:
Platform-wise totals
Best price per item
Optimized total (minimum across platforms)

🛠 Tech Stack
⚛️ React (Vite)
📊 Chart.js
📁 XLSX (Excel parsing)
🎨 Bootstrap
💾 LocalStorage

📁 Project Structure
src/
│
├── components/
│   ├── FileUpload.jsx
│   ├── ItemTable.jsx
│   ├── Summary.jsx
│   ├── PriceChart.jsx
│   ├── SearchBox.jsx
│
├── mockData.jsx
├── utils.js
├── App.jsx

📦 Installation
git clone https://github.com/your-username/smart-procurement.git
cd smart-procurement
npm install
npm run dev

🌐 Deployment

Deployed on Vercel

📊 Example Workflow
Search "milk" or upload Excel
Add items to cart
Adjust quantities
View:
Best platform
Total cost comparison
Savings 💸
💡 Key Logic
🔹 Normalization

Maps real-world item names to known categories:

"Amul Milk 1L" → "milk"
"Surf Excel" → "soap"
🔹 Optimization

For each item:

Choose MIN(price_amazon, price_flipkart, price_bbasket)
📸 Screenshots (optional - add later)
Dashboard
Price comparison table
Insights panel
Chart
🔥 Future Improvements
🧠 AI-based price prediction
🌍 Live API integration (Amazon/Flipkart)
📱 Mobile optimization
🛍 Multi-cart export
🤝 Contributing

Feel free to fork this repo and improve it 🚀

🧑‍💻 Author

Naman Jain

⭐ If you like this project

Give it a ⭐ on GitHub!

