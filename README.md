# ListedPEI

ListedPEI is a React/Vite lead-generation site for Prince Edward Island businesses. It includes a Google Business Profile kit generator, a free AI Visibility/GEO readiness audit, a grant quiz and assistant, and PickUp AI lead-generation pages.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

The Vite development server renders the frontend. Files in `api/` are Vercel serverless functions and require a Vercel-compatible local runtime or deployment for end-to-end API testing.

## Environment variables

Add these locally and in the Vercel project settings:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-6-luna
BROWSERLESS_API_TOKEN=
BROWSERLESS_ENDPOINT=https://production-sfo.browserless.io/content
EMAILJS_SERVICE_ID=
EMAILJS_KIT_TEMPLATE_ID=
EMAILJS_LEAD_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
SUPPORT_EMAIL=peiwebstudio@gmail.com
```

`OPENAI_API_KEY` is server-only. Never rename it to `VITE_OPENAI_API_KEY`; Vite-prefixed variables are shipped to the browser.

All website email forms post to `POST /api/send-email`. The server selects the permitted EmailJS template, validates recipients and fields, rate-limits submissions, and forces lead notifications to `SUPPORT_EMAIL`. Existing `VITE_EMAILJS_*` variables remain supported as a migration fallback, but new deployments should use the server-only names shown above.

## GEO audit architecture

`POST /api/geo-audit` validates and crawls the submitted public website, scores objective technical signals, and sends a compact evidence package to OpenAI for structured semantic analysis. The model does not determine the full score, and the product does not claim to prove live rankings or citations.

Security controls include public-address validation, redirect checks, crawl limits, response-size limits, timeouts, basic rate limiting, and short-lived in-memory result caching.

The crawler first identifies itself as ListedPEI. If a homepage returns HTTP 403, it retries once with browser-compatible request headers. When `BROWSERLESS_API_TOKEN` is configured, a second 403 triggers a rendered-browser fallback through Browserless. The token remains server-only. Without that optional token, blocked websites receive a clear error instead of a raw HTTP status message.

## Verification

```bash
npm run lint
npm run build
```
