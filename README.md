# 🍽️ Kitcheniano — Customer Storefront & Live Order Tracker (Frontend)

> Fast, responsive Next.js 14 customer-facing food ordering web application with real-time Server-Sent Events (SSE) order status tracking, interactive cart drawer, and guest/customer checkout. Synchronized seamlessly with the Kitcheniano Operations Dashboard.

[![Live Customer Storefront](https://img.shields.io/badge/Live_Storefront-Vercel-black?style=for-the-badge&logo=vercel)](https://kitcheniano-client-fe.vercel.app/)
[![Client API Microservice](https://img.shields.io/badge/Client_API-Render-46E3B7?style=for-the-badge&logo=render)](https://kitcheniano-client-be.onrender.com)
[![Next.js 14](https://img.shields.io/badge/Framework-Next.js_14_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-443E38?style=for-the-badge)](https://github.com/pmndrs/zustand)

---

## 🌐 Live Deployments & Preview

- **Live Customer Storefront:** [https://kitcheniano-client-fe.vercel.app/](https://kitcheniano-client-fe.vercel.app/)
- **Storefront Backend API:** [https://kitcheniano-client-be.onrender.com](https://kitcheniano-client-be.onrender.com)
- **Kitchen Operations Dashboard:** [https://kitcheniano-dashboard-fe.vercel.app/](https://kitcheniano-dashboard-fe.vercel.app/)
- **Source Repositories:**
  - Frontend Repository: [https://github.com/Bavly001/kitcheniano-client-FE](https://github.com/Bavly001/kitcheniano-client-FE)
  - Backend Repository: [https://github.com/Bavly001/kitcheniano-client-BE](https://github.com/Bavly001/kitcheniano-client-BE)

---

## 🏗 Microservices Architecture Role

In the Kitcheniano distributed restaurant ecosystem, the customer experience is decoupled from internal kitchen operations:
1. **Customer Storefront FE (This Repo):** High-speed customer web app for browsing restaurant dishes, customizing cart items, submitting orders, and tracking preparation in real time.
2. **Customer Microservice BE (Express 4):** Lightweight Node.js microservice handling customer authentication, cart persistence, and order submission directly to the shared TiDB Cloud MySQL database.
3. **Kitchen Operations Hub (NestJS 10 & Next.js 14):** Administrative core where kitchen chefs and staff receive orders in real time via SSE, deduct FEFO ingredient inventory, and update order statuses.

---

## 🌟 Key Features

- **Dynamic Restaurant Menu:** Categorized food menu with dish pricing, descriptions, and high-resolution cloud images hosted on Backblaze B2 S3.
- **Interactive Cart & Instant Checkout:** Client-side cart drawer with quantity adjustments, special instructions, address validation, and delivery/pickup selection.
- **Real-Time Live Order Tracker (`/orders/[id]`):** Interactive timeline with animated visual progress steps (`Pending` → `Accepted` → `In Kitchen` → `Out for Delivery` / `Ready for Pickup` → `Completed`) driven by Server-Sent Events (SSE) with automated polling fallbacks.
- **Customer Auth & Order History:** Secure registration and login using JWT tokens and bcrypt password hashing, allowing customers to track past orders.
- **Cross-Service Image Optimization:** Next.js Image optimization configured with remote patterns supporting Backblaze B2 S3 and Render CDN assets.
- **Zero-Latency State Management:** Zustand stores with `persist` middleware for shopping cart and authentication persistence across browser reloads.

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js 18+ or 20+
- Customer Storefront Backend running locally (`http://localhost:4001`) or deployed on Render

### 2. Environment Variables
Create a `.env.local` file in the root of `kitcheniano-client-FE`:
```env
NEXT_PUBLIC_API_URL=https://kitcheniano-client-be.onrender.com
NEXT_PUBLIC_DEFAULT_ORG_ID=org_8492a158b
NEXT_PUBLIC_DASHBOARD_URL=https://kitcheniano-dashboard-be.onrender.com
```

### 3. Install & Run
```bash
npm install
npm run dev
```
Open [http://localhost:3002](http://localhost:3002) in your browser.

### 4. Production Build & Vitest Suite
```bash
npm run build
npm test
```

---

## 🐳 Docker Deployment

Run with standalone Docker output:
```bash
docker build -t kitcheniano-client-fe .
docker run -p 3002:3002 -e NEXT_PUBLIC_API_URL=https://kitcheniano-client-be.onrender.com kitcheniano-client-fe
```
