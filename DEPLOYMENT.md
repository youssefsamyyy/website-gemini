# Cloud 11 | Gemini Enterprise Solutions — Cloud Run Deployment Guide

## Architecture
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Recharts, Lucide Icons
- **Server**: Express (`server.ts`) serving Vite middleware in development (`NODE_ENV !== 'production'`) and compiled static assets (`dist/`) plus `/api/health` and `/api/consultation` in production.
- **Pricing & Quota Config**: Centralized in `src/config/pricingConfig.ts`. Update indicative USD rates there without altering calculator logic.

## Environment Variables
| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | Optional (default `3000`) | HTTP listening port (`0.0.0.0:$PORT`). |
| `NODE_ENV` | `production` in Cloud Run | Switches Express from Vite dev middleware to static `dist/` serving. |
| `CONSULTATION_RECIPIENT_EMAIL` | Optional | Recipient used for `mailto:` consultation drafts when no webhook is configured. |
| `CONSULTATION_WEBHOOK_URL` | Optional | HTTPS endpoint (e.g., CRM or Cloud Function) for automated lead dispatch. If unset, the portal transparently provides a pre-filled `mailto:` draft and brief download without pretending mail was dispatched. |

## Local Development & Verification
```bash
npm install
npm run lint
npm run build
npm run dev
```

## Deploy to Google Cloud Run
```bash
gcloud run deploy cloud11-gemini-enterprise-portal \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NODE_ENV=production,CONSULTATION_RECIPIENT_EMAIL=sales@cloud-11.com
```
