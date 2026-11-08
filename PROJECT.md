# 🍽️ Kitcheniano Customer Storefront Frontend (`kitcheniano-client-FE`)

## 1. Overview
A Next.js 14 App Router customer storefront web application running on port 3001, providing online food ordering, public menu browsing, cloud-synchronized shopping carts, and real-time live order status tracking with custom audio alerts.

## 2. Architecture & Design Principles
- **Modern Next.js 14 App Router:** Full-page routing for `/`, `/menu`, `/about`, `/contact`, `/cart`, `/checkout`, `/orders`, and dynamic `/orders/[id]`.
- **Warm Culinary Aesthetics:** Designed with an artisan terracotta and stone theme matching the Kitcheniano culinary brand identity.
- **Hybrid Cart System:** Unauthenticated visitors browse and store dishes in localStorage; upon authentication, the cart seamlessly synchronizes to the database via `PUT /client/cart`.
- **Frictionless Checkout:** Allows guest checkout by automatically provisioning a customer account in the background so tracking is never lost.
- **Real-Time Live SSE Status Pipeline:** Listens to `GET /client/notifications/stream` and updates the 5-stage fulfillment stepper in real time (`pending` -> `accepted` -> `in_kitchen` -> `out_for_delivery` / `ready_for_pickup` -> `received`) with a Web Audio API culinary chime.

## 3. Tech Stack
- **Framework:** Next.js 14.x (App Router, Standalone build)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.x
- **State Management:** Zustand (auth, cart, notification stores)
- **Server State:** TanStack React Query 5.x
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library (10/10 tests passing)
- **Containerization:** Multi-stage Next.js Standalone Dockerfile (Node 20 Alpine)
