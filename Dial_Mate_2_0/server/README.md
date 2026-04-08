# Dial Mate 2.0 — Backend (Node/Express)

This folder adds a production-ready backend you can deploy independently (Render/Fly.io/Railway/Docker). It provides:

- Shopify OAuth install + token storage
- Shopify webhooks (orders/create, orders/updated)
- REST API for the dashboard
- Call orchestration entrypoints (Twilio-based stub)
- Compliance/event logs + call transcripts/recording URLs

> Note: The frontend in this repo is static. In production you typically host the frontend on a CDN (Netlify/Vercel static) and host this backend as a Node service.

## 1) Configure

```bash
cd server
cp .env.example .env
```

Fill Shopify + Twilio values.

## 2) Run locally

```bash
npm install
npm run dev
```

Server starts on `http://localhost:8787`.

## 3) Shopify app setup

In your Shopify Partners dashboard:

- App URL: `https://YOUR_BACKEND_DOMAIN`
- Allowed redirection URL(s):
  - `https://YOUR_BACKEND_DOMAIN/auth/shopify/callback`

Scopes are set via `SHOPIFY_SCOPES`.

## 4) Webhooks

This backend registers webhooks per shop after OAuth:

- `orders/create`
- `orders/updated`

Endpoints are:

- `POST /webhooks/orders/create`
- `POST /webhooks/orders/updated`

The Shopify signature is verified.

## 5) Dashboard API (used by your frontend)

- `GET /api/health`
- `GET /api/shops/:shop/orders`
- `GET /api/shops/:shop/calls`
- `POST /api/shops/:shop/orders/:orderId/call`  (Call Now / Retry)
- `POST /api/shops/:shop/orders/:orderId/tag`   (Confirmed/No Answer/Cancelled/Reschedule)

## 6) Deploy

### Option A: Render / Railway
- Create a new Node service from `server/`
- Set env vars from `.env.example`
- Start command: `npm start`

### Option B: Docker

```bash
docker build -t dial-mate-server ./server
docker run -p 8787:8787 --env-file ./server/.env dial-mate-server
```

## 7) Voice Agent

This repo includes a clean interface for a real voice pipeline:

- Twilio outbound call (PSTN)
- Your ASR (speech-to-text) + LLM (Urdu/Roman Urdu) + TTS
- Call state machine + interruption handling

The included implementation is a stub to keep this repo keyless by default. Replace the `agent/*` modules with your chosen providers.
