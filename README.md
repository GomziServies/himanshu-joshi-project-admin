# Salahkareshwar Mahadev Tirth: Admin Panel

Temple-themed admin panel with a sidebar, matching the website, built with React 18, Vite, TypeScript and Tailwind CSS.

- **Payments:** totals, paid / not paid / all filters, search, and full details of each payment (read only).
- **Products:** add, edit, hide or delete products with a photo upload. Changes show on the website straight away.

All data comes from the API. If the API cannot be reached the panel shows an error, never placeholder data.

## Getting Started
```bash
npm install
cp .env.example .env
npm run dev     # http://localhost:5174
npm run build
npm test
```

Log in with `ADMIN_DEFAULT_EMAIL` and `ADMIN_DEFAULT_PASSWORD` from the API's `.env`. The API must be running.
