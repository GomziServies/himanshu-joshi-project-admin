# Temple Administrative Console — Management & Ledger
**Directory:** `C:\himanshu-joshi-project-admin`

A production-grade, executive management dashboard built with **React 18**, **Vite 6**, **TypeScript**, and **Tailwind CSS** strictly adhering to an authoritative **Brown and White** color theme.

## Visual Design System & Theme
- **Dark Teakwood:** `#5C3A21` (Sidebar, primary action buttons, key brand headers)
- **Sandalwood:** `#8B5A2B` (Subheadings, secondary buttons, active tab borders)
- **Temple Gold/Brass:** `#C59B27` (Sacred accents, badges, highlight indicators)
- **Warm Ivory/Cream:** `#FDFBF7` (Global canvas background, soft contrast surface)
- **Crisp Pure White:** `#FFFFFF` (Cards, dialog surfaces, printable receipts)
- **Subtle Border:** `#E8DFD8` (Input borders, card dividers)

## Core Capabilities
- **Authentication & RBAC:** JWT Bearer token management in `localStorage`, 401 automatic redirection, and demo login fallback.
- **Dashboard Overview:** Real-time KPI metric cards for Revenue (₹ Dakshina), Consecrated Orders, Active Offerings, Website Banners, and Devotees.
- **Product & Seva Governance:** Full CRUD on offerings featuring Shivling Sthapana consecration, multi-tier pricing, category filtering (`Offering`, `Puja`, `Prasad`, `Seva`, `Ritual`), Vedic vidhi rituals, and Prasad box inclusions.
- **Dynamic Promotional Banners:** Full CRUD on homepage banners with display sequence sorting and instant optimistic active/hidden toggle switch.
- **User Directory:** Devotee registry with lifetime spending metrics, orders count, and administrative status controls.
- **Orders & Cryptographic Receipts Ledger:** Status lifecycle filtering (`pending`, `confirmed`, `ritual_scheduled`, `completed`, `cancelled`), Razorpay payment ID display with constant-time HMAC-SHA256 signature verification audit, and printable official Shree Somnath Sanctum Trust receipt modal with `@media print` layout.

## Default Administrator Credentials
- **Email:** `admin@temple.org`
- **Password:** `Admin@Temple108!` (or `Admin@Temple2026`)

## Verification Commands
```bash
npm install
npm run dev     # Starts development server on http://localhost:5174
npm run build   # Production bundle compilation (tsc && vite build)
npm test        # Runs Vitest automated test suite (5 test files, 18 passing tests)
```
