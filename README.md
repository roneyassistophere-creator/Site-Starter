# Payload 3 Site Starter

A **code-first marketing site + embedded Payload 3 CMS**. Page design and copy live in code for maximum performance. The CMS manages only:

- **Per-page SEO** (`PageMeta` collection)
- **Blog posts** (`Posts` collection)
- **Portfolio projects** (`Projects` collection)
- **Site settings & integrations** (globals)

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Payload 3 · PostgreSQL

---

## Local development

### Prerequisites
- Node.js 20+
- Docker (for local Postgres — no system Postgres needed)

### 1. Clone and install

```bash
git clone https://github.com/your-org/payload-starter.git my-site
cd my-site
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URI=postgres://postgres:payload@localhost:5432/payload
PAYLOAD_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 3. Start Postgres

```bash
docker compose up -d
```

This starts `postgres:16` on port 5432. Data persists in a named Docker volume across restarts.

### 4. Run the dev server

```bash
npm run dev
```

Payload auto-migrates the schema on first boot.

### 5. Create the first admin

Visit **http://localhost:3000/admin** → "Create first user". That's your only admin account.

### 6. Seed per-page SEO (optional)

In the admin, go to **SEO → Page Meta** and create records for `/`, `/about`, `/services`, `/portfolio`, `/blog`, `/contact`. Leave any field blank to use the code fallback.

---

## Re-skinning for a new brand

Edit **`config/site.ts`** only:

```ts
const siteConfig = {
  name: "My Brand",
  url: "https://mybrand.com",
  colors: { primary: "#1d4ed8", accent: "#f59e0b" },
  navLinks: [...],
  contact: { email: "hello@mybrand.com" },
  seo: { titleTemplate: "%s | My Brand", ... },
};
```

No component edits needed. CMS drives SEO values per page.

---

## Project structure

```
app/
├── layout.tsx                    # Root shell (serves Payload admin)
├── sitemap.ts                    # Dynamic: static pages + all posts + projects
├── robots.ts
├── (payload)/
│   ├── admin/[[...segments]]/    # Payload admin UI
│   └── api/[...slug]/            # Payload REST API
└── (site)/                       # Public website
    ├── layout.tsx                # Fonts, GA4, JSON-LD, brand CSS vars
    ├── page.tsx                  → /
    ├── about/page.tsx            → /about
    ├── services/page.tsx         → /services
    ├── contact/page.tsx          → /contact
    ├── blog/
    │   ├── page.tsx              → /blog  (paginated)
    │   ├── [slug]/page.tsx       → /blog/:slug
    │   └── rss.xml/route.ts      → /blog/rss.xml
    └── portfolio/
        ├── page.tsx              → /portfolio
        └── [slug]/page.tsx       → /portfolio/:slug

collections/
  Media.ts · PageMeta.ts · Posts.ts · Projects.ts

globals/
  Settings.ts · Integrations.ts

lib/
  payload.ts      # getPayloadClient()
  metadata.ts     # buildPageMetadata(), buildPostMetadata(), buildProjectMetadata()
  jsonld.ts       # Organization, WebSite, BreadcrumbList, Article, CreativeWork
  types.ts        # Hand-written interfaces (replaced by payload-types.ts after generate:types)

config/
  site.ts         # ← Single brand source of truth
```

---

## SEO system

| Layer | Where | What |
|---|---|---|
| Code fallbacks | `config/site.ts` | Default title, description, OG image, keywords |
| Per-page overrides | CMS → Page Meta | Title, description, canonical, OG image, noindex |
| Blog/portfolio | CMS → Posts/Projects SEO tab | Per-item title, description, OG image |
| Structured data | Auto on every page | Organization, WebSite, BreadcrumbList, Article, CreativeWork |
| Sitemap | `/sitemap.xml` | All static pages + every published post + project |
| RSS | `/blog/rss.xml` | 50 most recent published posts |

---

## Analytics & Search Console

Set in the CMS under **Site → Integrations**:

- **GA4 Measurement ID** (e.g. `G-XXXXXXXXXX`) — script injected only when set
- **Google Search Console verification** — meta tag injected only when set
- **Extra verification tags** — Bing, Yandex, etc.

Nothing is injected until you fill in these fields. All technical SEO works regardless.

---

## Deploying to Coolify

1. **Create a Postgres resource** in Coolify. Note the connection string.

2. **Add environment variables** in the Coolify service:
   ```
   DATABASE_URI=postgres://<user>:<pass>@<host>:5432/<db>
   PAYLOAD_SECRET=<32+ char random string>
   NEXT_PUBLIC_SERVER_URL=https://your-domain.com
   NODE_ENV=production
   ```

3. **Persistent volume** for media uploads:
   Mount `/app/media` as a persistent volume in Coolify → Service → Volumes. Uploads survive redeploys.

4. **Build command:** `npm run build`  
   **Start command:** `node .next/standalone/server.js`  
   (`output: 'standalone'` is set in `next.config.mjs`)

5. Coolify provisions SSL automatically via its domain/proxy settings.

6. On first deploy, visit `https://your-domain.com/admin` to create the first admin.

### Scaling beyond one instance

The ISR cache lives in memory on a single instance. If you add multiple instances behind a load balancer:
- Add `REDIS_URL=redis://<host>:6379` to env vars
- Configure a Redis cache handler in `next.config.mjs`

### Backups

- Schedule off-server Postgres dumps (Coolify scheduled tasks or external cron)
- Back up the `/app/media` volume separately

---

## Revalidation

Content changes in the CMS trigger on-demand revalidation via `afterChange` hooks:

| Action | Revalidated paths |
|---|---|
| Post published/updated | `/blog`, `/blog/[slug]` |
| Project updated | `/portfolio`, `/portfolio/[slug]` |
| PageMeta updated | That page's path (e.g. `/about`) |
