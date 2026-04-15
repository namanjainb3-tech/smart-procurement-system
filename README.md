<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
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
git clone https://github.com/namanjainb3-tech/smart-procurement.git
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

>>>>>>> ff11fc58ba0fb387c3c8e7adc1c0b0c228f685e5
