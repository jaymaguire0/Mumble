# Numble Duo

A minimal Vite + React + TypeScript web app using Supabase for auth and data.

## Setup

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Run locally:
   ```bash
   npm run dev
   ```

### Environment variables
Set the following variables (e.g. in `.env` or in your shell) when building or running:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_DEFAULT_TZ` (e.g. `Europe/Dublin`)

## GitHub Pages Deployment

This repo includes a workflow that builds the app with Node 22 and deploys `dist/` to GitHub Pages. Add the environment variables above as repository secrets so the build step can access them.

## Database

Example SQL to seed puzzles:

```sql
insert into public.puzzles (id, date, difficulty)
values
  (1, '2024-01-01', 'Easy'),
  (2, '2024-01-01', 'Hard');
```

## Deployment (GitHub Pages)

This project deploys via GitHub Actions. Required **Actions secrets**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_DEFAULT_TZ` (e.g. `Europe/Dublin`)

The workflow sets `VITE_BASE_PATH` automatically to `/<repo-name>/`, so no manual edits are needed after renaming the repo.

Your site will be live at: `https://<username>.github.io/<repo>/`.

Troubleshooting:
- Deep-link 404s: the workflow copies `index.html` to `404.html` and routing uses `HashRouter`; both must be present.
- Missing Supabase envs: check Actions logs for the warning and add the secrets in **Settings → Secrets and variables → Actions**.
