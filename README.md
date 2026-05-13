# Profile Cloudflare App

Responsive developer profile web app built with Astro, React, Tailwind CSS, Cloudflare Pages, and Cloudflare Workers.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy frontend to Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist --project-name profile-cloudflare-app
```

## Worker setup

```bash
cd worker
npm install
npx wrangler kv namespace create PROFILE_CACHE
npx wrangler deploy
```

Update the generated KV namespace id in `worker/wrangler.toml`.

## Update API endpoint

Set this in `.env` or Cloudflare Pages environment variables:

```bash
PUBLIC_PROFILE_API_URL=https://your-worker.your-subdomain.workers.dev/profile
```
