# 📚 StationaryStories

StationaryStories is a modern, data-driven dashboard designed specifically for campus stationery shop owners. It helps you manage your inventory, track daily sales, and uncover actionable business opportunities using AI.

## ✨ Features

- **Dashboard Overview**: Get a bird's-eye view of your total revenue, active customers, and inventory value.
- **Sales Analytics**: Visualize revenue trends and sales distributions across different categories (Xerox/Prints, Stationary, Books) using interactive charts.
- **AI Business Insights**: Powered by the **Google Gemini API**, the dashboard analyzes your current stock and sales data to generate smart, data-driven recommendations on what to restock, bundle, or promote next.
- **Inventory & Order Management**: APIs to track stock levels and fulfill customer orders.

## 🛠️ Tech Stack

This project is bootstrapped with the [T3 Stack](https://create.t3.gg/) and utilizes the following technologies:
- **[Next.js](https://nextjs.org)** (App Router)
- **[TypeScript](https://www.typescriptlang.org/)** for end-to-end type safety
- **[Tailwind CSS](https://tailwindcss.com)** for styling
- **[MongoDB & Mongoose](https://mongoosejs.com/)** for the database
- **[Google Gemini API](https://ai.google.dev/)** for generating AI insights
- **[Recharts](https://recharts.org/)** for data visualization
- **[Vercel](https://vercel.com)** for seamless deployment

## 🚀 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Prathmesh125/StationaryStories.git
   cd StationaryStories
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables:**
   Copy `.env.example` to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   ```
   Add your keys:
   ```env
   MONGODB_URI="your_mongodb_connection_string"
   GEMINI_API_KEY="your_google_gemini_api_key"
   ```

4. **Run the development server:**
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## ☁️ Deployment

This project is designed to be easily deployed on **Vercel**.

1. Import your GitHub repository to Vercel.
2. In the deployment settings, add your `MONGODB_URI` and `GEMINI_API_KEY` to the **Environment Variables**. *(Make sure you don't include quotes around the values!)*
3. Click **Deploy**. Vercel will automatically build the Next.js app and deploy your live dashboard.
