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
- [x] Built Shopping Cart basket page (`/cart`) and Fast Checkout form (`/checkout`) with guest account auto-provisioning
- [x] Built Customer Order History page (`/orders`) and Live Order Status Tracker (`/orders/[id]`) with real-time SSE listener
- [x] Wrote unit and integration tests across smoke, stores, and orders (10/10 tests passing)
- [x] Configured Next.js standalone output and multi-stage Alpine Dockerfile for port 3001

## Decisions Log
- **2026-11-08:** Adopted a hybrid cart architecture: items persist in browser localStorage for unauthenticated visitors and automatically sync to the MySQL `client_carts` table upon client sign in or registration.
- **2026-11-08:** Designed zero-friction checkout for guest customers: auto-provisions a linked client profile on submit so customers can immediately track their order pipeline without mandatory pre-registration.
- **2026-11-08:** Synthesized culinary chime natively using standard Web Audio API oscillators, eliminating heavy external mp3 asset dependencies.
