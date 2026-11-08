# 📋 Kitcheniano Customer Storefront Tasks & Progress (`TASKS.md`)

## Completed Milestones
- [x] Initialized Next.js 14 App Router project with TypeScript and Tailwind CSS
- [x] Created brand icon with dynamic `@vercel/og` ImageResponse (`src/app/icon.tsx`)
- [x] Implemented API client (`src/lib/api-client.ts`) with tenant header injection and auth tokens
- [x] Built Zustand stores for authentication (`auth.store.ts`), hybrid shopping cart (`cart.store.ts`), and live SSE notifications (`notification.store.ts`)
- [x] Integrated Web Audio API synthesized culinary bell chime (`587.33 Hz` to `880 Hz`)
- [x] Built responsive storefront shell: brand navigation header (`Navbar.tsx`), sliding basket sheet (`CartDrawer.tsx`), notification alert toasts (`NotificationToast.tsx`), and marketing footer
- [x] Implemented Marketing Pages: Home landing page (`/`), About Us (`/about`), and Contact & Location (`/contact`)
- [x] Built Public Menu Catalog (`/menu`) with category filtering, instant keyword search, price sorting, and dish detail modal
- [x] Built Shopping Cart basket page (`/cart`) and Fast Checkout form (`/checkout`) with mandatory customer authentication gate
- [x] Implemented authentication requirement gate on checkout: customer must register or sign in before completing orders, ensuring orders bind to verified `clientId`
- [x] Built post-auth redirect flow (`?redirect=/checkout`) across login and registration flows
- [x] Built Customer Order History page (`/orders`) and Live Order Status Tracker (`/orders/[id]`) with real-time SSE listener
- [x] Wrote unit and integration tests across smoke, stores, checkout auth, and orders (20/20 tests passing)
- [x] Configured Next.js standalone output and multi-stage Alpine Dockerfile for port 3001
- [x] Rebuilt Docker containers with port mapping 3002:3001 and verified full HTTP/UI availability

## Decisions Log
- **2026-11-08:** Adopted a hybrid cart architecture: items persist in browser localStorage for unauthenticated visitors and automatically sync to the MySQL `client_carts` table upon client sign in or registration.
- **2026-11-08:** Enforced mandatory customer registration or sign-in before order completion: orders are strictly tied to verified customer accounts (`clientId`) and guest order submission without authentication is completely blocked.
- **2026-11-08:** Implemented post-authentication redirect handling (`?redirect=/checkout`) with safe relative path sanitization to allow seamless checkout resumption upon login or account creation.
- **2026-11-08:** Synthesized culinary chime natively using standard Web Audio API oscillators, eliminating heavy external mp3 asset dependencies.
- **2026-11-08:** Mapped container port 3001 to host port 3002 to avoid collision with pre-existing host containers while keeping clean internal container defaults.
