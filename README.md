# ComplexManager

A web application for managing a residential complex (site) in Türkiye.

## Architecture

- **Frontend:** React + TypeScript + Vite
- **Hosting:** GitHub Pages
- **Backend/API:** Supabase Edge Functions
- **Database:** Supabase PostgreSQL

The frontend is a static Vite build. It contains no server secrets and does not run a Node/Express server. Database operations are performed through the Supabase API layer.

## Development

```bash
npm install
npm run dev
```

Build the static site with:

```bash
npm run build
```

The GitHub Pages deployment workflow builds `dist/` automatically on pushes to `main`.

## Project specification

The main technical specification is maintained in [`SPEC.md`](./SPEC.md).
