# 🛒 Smart Procurement

A modern **React-based smart shopping assistant** that helps users compare prices across multiple platforms and find the most cost-effective purchasing strategy.

🔗 **Live Demo:**  
https://smart-procurement-bay.vercel.app/

---

## 🚀 Features

- 🔍 Quick Search with real-time suggestions  
- 📊 Price Comparison across:
  - Amazon  
  - Flipkart  
  - BigBasket  
- 📂 Excel Upload Support (auto-extract items)  
- ➕ Add to Cart System  
- 🔢 Dynamic Quantity Management  
- 💡 Smart Insights Panel:
  - Total cost per platform  
  - Optimized minimum cost  
  - Savings calculation  
  - Best platform recommendation  
- 📈 Interactive Price Chart (Chart.js)  
- 🌙 Dark Mode Support  
- 💾 Local Storage Persistence  

---

## 🧠 How It Works

### 1. Input Methods
Items can be added via:
- 🔍 Search box  
- 📂 Excel upload  

### 2. Processing
Each item is:
- Normalized using custom logic (`normalizeName`)  
- Mapped to predefined price data  

### 3. Calculation
The app computes:
- Platform-wise totals  
- Best price per item  
- Optimized total (minimum cost across platforms)  

---

## 🛠 Tech Stack

- ⚛️ React (Vite)  
- 📊 Chart.js  
- 📁 XLSX (Excel parsing)  
- 🎨 Bootstrap  
- 💾 LocalStorage  

---

## 📁 Project Structure
src/
│
├── components/
│ ├── FileUpload.jsx
│ ├── ItemTable.jsx
│ ├── Summary.jsx
│ ├── PriceChart.jsx
│ ├── SearchBox.jsx
│
├── mockData.jsx
├── utils.js
├── App.jsx


---

## 📦 Installation

```bash
git clone https://github.com/your-username/smart-procurement.git
cd smart-procurement
npm install
npm run dev

🌐 Deployment

Deployed using Vercel

📊 Example Workflow
Search an item (e.g., milk) or upload an Excel file
Add items to cart
Adjust quantities
View:
🏆 Best platform
💰 Total cost comparison
💸 Savings

🔥 Future Improvements
🧠 AI-based price prediction
🌍 Live API integration (Amazon/Flipkart)
📱 Mobile optimization
🛍 Multi-cart export

🧑‍💻 Author

Naman Jain

⭐ Support

If you like this project, give it a ⭐ on GitHub!

