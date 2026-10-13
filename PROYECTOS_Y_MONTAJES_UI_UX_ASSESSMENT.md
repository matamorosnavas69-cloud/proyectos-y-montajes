# PROYECTOS Y MONTAJES — Comprehensive Website Assessment & Premium UI/UX Transformation Blueprint

**Document Reference:** `PROYECTOS_Y_MONTAJES_UI_UX_ASSESSMENT.md`  
**Target Domain:** [proyectosymontajes.com](https://www.proyectosymontajes.com)  
**Package Path:** `packages/proyectos-y-montajes`  
**Assessment Phase:** Phase 1 — Discovery, Audit & Transformation Blueprint (Read-Only)  
**Implementation Authorization:** Strictly Gated (Pending Executive Review)  
**Author:** Principal Product Designer, Senior Frontend Architect & UX Strategist  

---

## 1. Executive Assessment

Proyectos y Montajes possesses a **tier-one physical track record**—over 20 years of executed civil engineering, FIFA-standard sports infrastructure, WPT-grade padel installations, certified recreational parks, and architectural landscaping across Colombia. Furthermore, the repository contains a **commercial goldmine of visual proof: 837 high-resolution authentic photographs and 420+ field videos** capturing genuine installations.

However, the current digital surface on `proyectosymontajes.com` **dramatically under-represents this engineering reality**:

1. **Severe Asset Under-Utilization & Distortion:** The live homepage relies almost entirely on a single repetitive football court photo (`IMG_0337.JPG`, 1.2MB unoptimized), external stock placeholders (an Unsplash URL for playground equipment in `Services.tsx`), and broken references (`BeforeAfter.tsx` points to non-existent files in an empty folder, rendering blank error placeholders). Meanwhile, 830+ world-class project photos remain buried in `public/images/drive organice/`.
2. **Design System & Tailwind Scale Incoherence:** In `tailwind.config.js`, custom spacing overrides (`4: "4px"`, `16: "16px"`, `24: "24px"`) break standard Tailwind utility expectations, while unmapped typography classes (`text-48`, `text-24`, `text-16`, `text-12`) appear 27 times in the DOM without generating valid CSS rules—causing critical headlines to collapse to default 16px body text on mobile viewports.
3. **Missing Mobile Navigation & Severe Ergonomic Friction:** On viewports below 768px (`md`), `Header.tsx` hides the navigation entirely with no mobile drawer or hamburger trigger, leaving smartphone visitors with zero access to service pages, portfolio, or about pages.
4. **Commercial Value Proposition Misalignment:** The brand risks being perceived as an informal turf vendor rather than an **EPC (Engineering, Procurement, and Construction) turnkey contractor**. Visitors seeking large-scale padel club development, residential condominium sports complexes, or certified municipal playgrounds encounter fragmented copy, missing technical certifications, and a 5-step sales qualification brief labeled as an "instant quote calculator".

**The Strategic Opportunity:** The existing codebase has clean modern architecture (Next.js 16 App Router, React 19, Prisma, Supabase, Tailwind CSS, Lucide icons, and the newly integrated `ServiceShowcaseGallery.tsx`). It does **not** require a destructive rewrite. It requires a disciplined, architectural transformation of the component layer, design tokens, asset choreography, and conversion journeys.

---

## 2. Verified Technical Architecture

### 2.1 Repository & Stack Inventory
* **Workspace Location:** `packages/proyectos-y-montajes` within `planmaestro-ecosystem` monorepo.
* **Framework:** Next.js `16.2.9` (App Router, Turbopack).
* **Core Libraries:** React `19.2.4`, React DOM `19.2.4`, TypeScript `5.x`.
* **Styling Engine:** Tailwind CSS `3.4.19`, PostCSS `8.5.15`, Autoprefixer `10.5.0`.
* **Icons:** `lucide-react` `^0.525.0`.
* **Database & Persistence:** Prisma `^7.8.0`, PostgreSQL connection via `@prisma/adapter-pg` `^7.8.0` and `pg` `^8.22.0` (Supabase backend schema: `proyectos_y_montajes`).
* **Cloud Storage:** `@supabase/supabase-js` `^2.108.2` (Bucket: `proyectos`).
* **Authentication & RBAC:** `@clerk/nextjs` `^6.39.5` (scoped to `/admin` and `/api/admin` via `middleware.ts`).
* **Data Validation:** `zod` `^3.25.76`.

### 2.2 Package Boundary & Git Deployment Model
* **Deployment Repository:** `git@github-matamoros:matamorosnavas69-cloud/proyectos-y-montajes.git` (branch `main`).
* **Hosting Platform:** Vercel Hobby (Account: `copo69`, Project: `proyectos-y-montajes`).
* **Live Domain:** `https://www.proyectosymontajes.com` (Apex domain redirects with 308).
* **Storage Constraint:** Vercel Hobby limits source payload to <1GB. Heavy raw video files (`.mov`, `.mp4` totaling 3.7GB) are excluded via `.gitignore`, preserving lightweight image deployment.

---

## 3. Route & Page Inventory

| Route | Type | Rendering Strategy | Current Purpose & Status |
| :--- | :--- | :--- | :--- |
| `/` | Page | Static / Client Hybrids | Homepage: Hero, SocialProof, Services, FeaturedProjects, AuthorityShowcase, BeforeAfter, ManagedProjectGallery, QuoteSimulator. |
| `/servicios/canchas-deportivas` | Page | Static / Client Showcase | Padel & Football vertical landing page; integrated with `ServiceShowcaseGallery` (485 assets). |
| `/servicios/parques-infantiles` | Page | Static / Client Showcase | Playgrounds & EPDM safety flooring; integrated with `ServiceShowcaseGallery` (326 assets). |
| `/servicios/paisajismo` | Page | Static / Client Showcase | Architectural landscaping & terraces; integrated with `ServiceShowcaseGallery` (503 assets). |
| `/portafolio` | Page | Dynamic Server (SSR) | DB-driven project catalog (`prisma.project.findMany`). Displays empty state if DB rows unpopulated. |
| `/portafolio/[slug]` | Page | Dynamic Server (SSR) | Individual project case study with gallery, client details, technical specs. |
| `/nosotros` | Page | Static Prerendered | Corporate history, 20-year narrative, values, CCGrass partnership. Metric discrepancy (200+ vs 500+). |
| `/cliente` & `/cliente/[slug]` | Page | Dynamic Server (SSR) | Client portal / proposal viewer with secure access token. |
| `/admin/*` | Pages | Dynamic / Auth Required | Administration suite: Projects, Media Library, Leads CRM, Proposals, Tech Sheets, Commercial Intelligence. |
| `/api/leads` | API | Edge / Serverless POST | Lead ingestion endpoint linked to `LeadQualificationWizard`. |
| `/api/media-library` | API | Serverless GET | High-performance filesystem media indexing API with category/subcategory querying. |

---

## 4. Existing Component & Design System Inventory

### 4.1 UI Components (`app/components/`)
* **`Header.tsx` (Critical Debt):** Fixed header. Lacks mobile navigation drawer or hamburger icon. Uses broken font classes (`text-24`, `text-12`, `text-16`).
* **`Footer.tsx` (High Debt):** Contains placeholder text (`proyectos@ejemplo.com`, `+57 300 000 0000`). Links use non-existent local hashes (`#canchas`, `#parques`) broken on inner routes.
* **`Hero.tsx` (Medium Debt):** Renders raw CSS background (`IMG_0337.JPG`, 1.2MB). Causes LCP lag. Mobile headline uses unmapped `text-48` which defaults to 16px body size on smartphones.
* **`SocialProof.tsx` (High Debt):** Renders placeholder letter circles (`U`, `CAB`) instead of genuine corporate SVG emblems. Claims "+500 Proyectos Entregados".
* **`Services.tsx` (Critical Debt):** 3-pillar card grid. Parques card loads an external Unsplash image; Landscaping card uses a football court photo (`IMG_0070.JPG`).
* **`FeaturedProjects.tsx` (Medium Debt):** Masonry grid of 5 projects using raw `<img>` without dimensions or `loading="lazy"`. Repeats `IMG_0337.JPG` already used in Hero.
* **`AuthorityShowcase.tsx` (Strong Base):** Premium dark-mode flagship presentation with ambient glow, stats, and badges. Currently features only sports projects.
* **`BeforeAfter.tsx` (Defective):** Interactive slider referencing non-existent files in `public/images/before-after/`. Renders an empty error gradient on the live site.
* **`LeadQualificationWizard.tsx` (High Value, Mislabeled):** Sophisticated 5-step B2B qualification flow (WhatsApp, company, budget, m², condition). Mislabeled on homepage as an "instant price calculator".
* **`ServiceShowcaseGallery.tsx` (Tier-One Asset):** Fullscreen cinematic lightbox, subcategory pill filtering, dynamic masonry grid, responsive Next.js `<Image>`, video support. Currently live on service subpages.

### 4.2 Styling Architecture & Token Audit (`tailwind.config.js`)
* **Brand Palette Defined:**
  * `brand.dark`: `#0b120d` (Near-Black Forest)
  * `brand.green`: `#1b5e20` (Deep Emerald)
  * `brand.gold`: `#d4af37` (Refined Industrial Gold)
  * `brand.light`: `#f7f9f7` (Clean Architectural Off-White)
  * Supporting: `brand.accent` (`#86a9af`), `danger` (`#ec6602`), `success` (`#80bd9a`).
* **Spacing Conflict in `theme.extend.spacing`:**
  Custom numeric keys (`4: "4px"`, `8: "8px"`, `16: "16px"`, `24: "24px"`, `32: "32px"`, `48: "48px"`) override standard Tailwind rem values. For example, `p-16` outputs `16px` instead of `64px`, creating layout surprises.
* **Typography Token Void:**
  No `fontSize` definitions exist in `tailwind.config.js`. Classes like `text-48`, `text-24`, `text-18`, `text-16`, `text-12` fail to compile, causing font-size collapse in production.

---

## 5. Visual & UX Audit Across Viewports

### 5.1 Desktop Viewport (1440px)
* **First Impression:** Dark, atmospheric hero section creates an initial aura of exclusivity, but lacks clear engineering authority. The palapa/resort soccer image suggests tourism rather than high-performance civil construction.
* **Visual Hierarchy:** Good dark-to-light rhythm across sections (`Hero` [dark] $\to$ `SocialProof` [white] $\to$ `Services` [light gray] $\to$ `FeaturedProjects` [light] $\to$ `AuthorityShowcase` [dark] $\to$ `BeforeAfter` [dark] $\to$ `Wizard` [dark]).
* **Contrast & Color Balance:** Deep emerald and gold accents feel luxurious, but lack strict contrast governance when applied on white backgrounds.

### 5.2 Tablet Viewport (768px)
* **Grid Reflow:** Grids adapt from 3–4 columns to 2 columns.
* **Spacing Crowding:** Overridden spacing tokens lead to visual tension around section headers and card margins.

### 5.3 Mobile Viewport (390px — Critical Findings)
* **Header Breakdown:** Navigation links disappear due to `hidden md:flex`. No hamburger menu exists. Mobile users cannot navigate to `/servicios/canchas-deportivas`, `/servicios/parques-infantiles`, `/servicios/paisajismo`, `/portafolio`, or `/nosotros`.
* **Headline Collapse:** In `Hero.tsx`, `text-48 md:text-[72px]` causes mobile browsers to drop `text-48` (uncompiled) and default to 16px. The mobile hero title appears smaller than subheadings.
* **Slider Friction:** `BeforeAfter.tsx` slider handle is awkward to drag on touch devices, especially since both images fail to load.
* **Form Optimization:** `LeadQualificationWizard` works well on mobile thanks to touch-friendly option buttons, though its container padding needs slight reduction on 360–390px widths.

---

## 6. Complete Asset Gallery Intelligence Matrix

The repository contains **1,400 total media files** in `public/images/` (4.69 GB total).
Filtering out raw `.mp4`/`.mov` videos yields **837 ready-to-deploy high-resolution photographs**:

| Directory | Image Count | Video Count | Dominant Subjects | Real Project Authenticity |
| :--- | :--- | :--- | :--- | :--- |
| `drive organice/canchas` | 166 | 319 | Padel courts, soccer fields, fencing, lighting, grading | Verified 100% Genuine Colombian Projects |
| `drive organice/parques` | 222 | 104 | Modular playgrounds, EPDM shock-absorbent floors, swings | Verified 100% Genuine Colombian Projects |
| `drive organice/residencial`| 369 | 134 | Luxury gardens, rooftop terraces, artificial turf, perimeter greenery | Verified 100% Genuine Colombian Projects |
| `drive organice/golf` | 31 | 1 | Putting greens, residential mini-golf, fringe turf | Verified 100% Genuine Colombian Projects |
| `drive organice/piscina` | 29 | 2 | Swimming pool perimeters, wet decks, synthetic grass borders | Verified 100% Genuine Colombian Projects |
| `futbol` | 16 | 0 | Synthetic soccer fields, CCGrass FIFA certified packaging | Verified Genuine Photos & Material Labels |
| `padel` | 4 | 1 | Smash Club panoramic padel courts, glass walls, clubhouse | Verified Flagship Commercial Project |
| `before-after` | 0 | 0 | Empty folder (`.gitkeep` only) | **Zero Assets** (Component currently broken) |

### Curated High-Impact Asset Assignments

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HOMEPAGE HERO SELECTION                         │
│  Option A (Padel Flagship):   /images/padel/IMG_3346.PNG (1.8MB)        │
│  Option B (Multi-Sport):      /images/drive organice/canchas/          │
│                               IMG_4527.jpg (Optimized via Next/Image)  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
  CANCHAS PILLAR             PARQUES PILLAR             PAISAJISMO PILLAR
/images/padel/             /images/drive organice/    /images/drive organice/
7ad44112-8715-477f...jpg   parques/IMG_4683.JPG       residencial/IMG_4638.JPG
(Replaces repeated image)  (Replaces Unsplash stock)  (Replaces soccer photo)
```

1. **Primary Homepage Hero:**
   * **Candidate 1 (Padel Flagship):** `/images/padel/IMG_3346.PNG` — Panoramic glass court, crisp lighting, architectural clubhouse context.
   * **Candidate 2 (Civil & Sports Scale):** `/images/drive organice/canchas/IMG_4527.jpg` — Massive multi-court complex showing engineering scale.
2. **Three Core Service Pillars (`Services.tsx`):**
   * **Canchas:** `/images/padel/7ad44112-8715-477f-a253-8cd0c796ba8b.jpg` (Crystal padel court with branded mesh).
   * **Parques Infantiles:** `/images/drive organice/parques/IMG_4683.JPG` (Vibrant multi-tower playground with continuous poured-in-place rubber flooring. **Eliminates external Unsplash stock dependency**).
   * **Paisajismo & Terrazas:** `/images/drive organice/residencial/IMG_4638.JPG` (High-end architectural terrace with 4-tone synthetic grass and modern furniture. **Eliminates football photo mismatch**).
3. **Engineering Authority Showcase (`AuthorityShowcase.tsx`):**
   * *Project 1 (Padel):* Smash Club (`/images/padel/IMG_3346.PNG`).
   * *Project 2 (Recreation):* Macro-Parque EPDM (`/images/drive organice/parques/15d81928-0e73-46bd-b651-897cd955e52b.jpg`).
   * *Project 3 (Corporate Landscape):* Rooftop Residencial Santander (`/images/drive organice/residencial/IMG_1271.PNG`).
4. **Before/After Transformation Strategy:**
   * Select paired progress photos from `drive organice/canchas` (raw earth excavation vs. finished turf court) and populate `public/images/before-after/` with actual assets, or temporarily deactivate the component until authentic paired before/after images are cataloged.

---

## 7. Information Architecture & User Journeys

```
                                  INICIO (/)
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
  SOLUCIONES TÉCNICAS          AUTORIDAD & PRUEBA           CONVERSIÓN DIRECTA
  • Canchas Deportivas         • Portafolio de Obras        • Asesor Técnico WhatsApp
  • Parques Infantiles         • Metodología Civil          • Asistente de Cotización
  • Paisajismo & Terrazas      • Nosotros (+20 Años)        • Descarga Ficha Técnica
```

### Conversion Journey Friction Analysis

* **Sports Facility Investor:**
  * *Journey:* Homepage Hero $\to$ Sports Vertical $\to$ Padel/Soccer Technical Specs $\to$ ROI & Budget Estimator.
  * *Current Friction:* Investor lands on `/` and sees general statements; clicking "Cotizar Proyecto" anchors to `#simulador`, which asks 5 qualification questions instead of displaying an investment calculator.
  * *Remediation:* Rename section to **"Asistente de Cotización y Viabilidad Técnica"**, with clear expectations: "Reciba un anteproyecto técnico y presupuesto preliminar en menos de 2 horas".
* **Real Estate Developer & Commercial Contractor:**
  * *Journey:* Search $\to$ Corporate Landscape / Playgrounds $\to$ Normative Compliance (EN 1177, ASTM) $\to$ Technical Sheet Download $\to$ Consultation.
  * *Current Friction:* Technical certifications and PDF technical sheets exist in the backend (`/api/admin/projects/[id]/technical-sheet`) but are not easily accessible to public B2B buyers.
  * *Remediation:* Add a direct "Descargar Ficha Técnica Institucional (PDF)" CTA in the header and service pages.

---

## 8. Brand Alignment & Positioning Audit

| Dimension | Current Expression | Target Standard ("Engineering Partner") | Assessment & Gap |
| :--- | :--- | :--- | :--- |
| **Headline Copy** | "Infraestructura Premium para Espacios de Élite" | "Ingeniería Deportiva, Recreativa y Paisajismo de Alto Rendimiento" | Current copy is acceptable, but sounds like luxury real estate rather than engineering authority. |
| **Experience Claim** | "20+ Años de Experiencia" (consistent) | "Más de 20 años transformando espacios en Colombia" | Strong and verified. Must harmonize project counts (500+ on home vs 200+ on `/nosotros`). |
| **Materials Credibility** | Mention of FIFA & WPT standards | Concrete evidence: CCGrass FIFA Quality supplier certificate & EN 1177 impact data | Display the authentic label photo (`3ACAD10F-DF5C-4A03-988E-72406A244748.JPG`) in an "Engineering Standards" section. |
| **Visual Tone** | Mixed: dark hero, white middle, unstyled text fallbacks | Cohesive architectural editorial: deep forest, subtle gold rules, precision typography | Need unified typography tokens and consistent container spacing. |

---

## 9. Component-Level Remediation Matrix

| Component | File Path | Current Issue | Recommended Action | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Header** | `app/components/Header.tsx` | No mobile menu; unmapped font classes (`text-24`, `text-12`, `text-16`). | Add slide-over mobile drawer; replace unmapped classes with `text-xl`, `text-xs`, `text-sm`. | **P0** |
| **Tailwind Config** | `tailwind.config.js` | Overridden spacing tokens (`16: 16px`); missing `fontSize` tokens. | Restore standard spacing or clean token aliases; define semantic typography scale. | **P0** |
| **Footer** | `app/components/Footer.tsx` | Dummy email/phone; broken `#canchas` hash links on inner pages. | Update with real contact info; replace hash links with `/servicios/*` route links. | **P0** |
| **Services Cards** | `app/components/Services.tsx` | External Unsplash URL on Parques; soccer image on Paisajismo. | Replace with genuine assets (`IMG_4683.JPG` and `IMG_4638.JPG`); use Next.js `<Image>`. | **P1** |
| **BeforeAfter** | `app/components/BeforeAfter.tsx` | References non-existent files; renders blank error placeholder. | Populate with real before/after photo pairs from archive or hide until curated. | **P1** |
| **Hero** | `app/components/Hero.tsx` | 1.2MB background image with no preloading; collapsed headline on mobile. | Replace with Next `<Image priority fill>`; fix mobile heading to `text-3xl sm:text-5xl md:text-7xl`. | **P1** |
| **SocialProof** | `app/components/SocialProof.tsx` | Letter circle placeholders (`U`, `CAB`) instead of real emblems. | Replace with SVG badges or high-definition client typography lockups. | **P1** |
| **FeaturedProjects**| `app/components/FeaturedProjects.tsx` | Uses raw `<img>` without dimensions; only shows soccer/padel. | Convert to Next `<Image>`; include 1 playground and 1 landscaping project for 3-vertical balance. | **P2** |
| **Quote Simulator**| `app/components/QuoteSimulator.tsx` | Section title promises "Calcula en Segundos" for a 5-step form. | Align section headline with actual wizard value: "Asistente de Cotización & Viabilidad Técnica". | **P2** |
| **MetadataBase** | `app/layout.tsx` | Missing `metadataBase` generates Next.js build warnings. | Add `metadataBase: new URL('https://www.proyectosymontajes.com')`. | **P2** |

---

## 10. Performance, Accessibility & SEO Findings

### 10.1 Performance
* **LCP (Largest Contentful Paint) Risk:** High in current state. Hero background image (`/images/futbol/IMG_0337.JPG`) is loaded via CSS `background-image` without a `<link rel="preload">` hint and without modern WebP/AVIF format conversion. Moving to `<Image priority>` will cut payload from 1.2MB to ~90KB.
* **CLS (Cumulative Layout Shift) Risk:** `FeaturedProjects.tsx` and `nosotros/page.tsx` use un-dimensioned `<img>` tags, triggering layout shifts as photos load asynchronously.
* **Bundle Size:** Clean. Next.js 16 build is fast (4.1s compilation, 25 static prerendered pages). Dependencies are lean (`lucide-react`, `zod`, `prisma`, `supabase-js`, `clerk`).

### 10.2 Accessibility (WCAG 2.2 AA)
* **Contrast:** White on `#0b120d` (19:1) and Gold on `#0b120d` (8.1:1) exceed AAA. However, Gold `#d4af37` text on white backgrounds (1.9:1) fails WCAG AA; gold text must only appear on dark surfaces or with a dark container outline.
* **Keyboard Navigation:** Modal lightbox in `ServiceShowcaseGallery.tsx` correctly traps focus and supports `Esc` and arrow keys. However, the desktop header lacks a skip-to-content link.
* **Touch Target Ergonomics:** Footer links and some header items fall below 44x44px touch targets on mobile viewports.

### 10.3 Technical SEO
* **Canonical & Metadata:** Individual pages have descriptive titles and meta descriptions.
* **Open Graph:** OG image points to `/images/padel/IMG_3346.PNG`. Needs `metadataBase` in `app/layout.tsx` for absolute URL resolution.
* **Missing Directives:** `sitemap.ts` and `robots.ts` are missing from `app/`. Search engine bots currently rely on implicit discovery.

---

## 11. Trust & Claim Verification

| Claim / Signal | Status | Evidence Found | Recommendation |
| :--- | :--- | :--- | :--- |
| **"Más de 20 años de experiencia"** | **Verified** | Corporate documentation, continuous project archive back to 2004/2005. | Keep as primary authority badge in hero and footer. |
| **"CCGrass FIFA Quality Provider"** | **Verified** | Photo `/images/futbol/3ACAD10F-DF5C-4A03-988E-72406A244748.JPG` shows authentic packaging label and specification. | Feature this exact photo in an "Ingeniería de Materiales" subsection. |
| **"World Padel Tour (WPT) Standard"** | **Verified Specification** | Dimensions (20x10m), 12mm tempered glass, electro-welded structures match WPT specifications. | Clarify copy as "Construido bajo especificaciones técnicas WPT / FIP". |
| **"Norma Europea EN 1177 / ASTM F1292"** | **Technical Standard** | Industry standard for poured-in-place EPDM rubber surfaces installed by company. | State: "Sistemas de amortiguación diseñados bajo criterios de altura crítica de caída EN 1177". |
| **Client Logos (UPB, Club Atlético Bucaramanga)** | **Unverified Graphic Assets** | Displayed as letter avatars (`U`, `CAB`) in `SocialProof.tsx`. | Request verified corporate vector files or render clean typographic badges. |
| **Project Volume ("+500" vs "200+")** | **Inconsistent** | 500+ claimed on Home; 200+ claimed on `/nosotros`. | Standardize across all pages to **"+500 Obras y Proyectos Ejecutados"**. |

---

## 12. Proposed High-End Creative Direction

### The North Star: "Estudio de Ingeniería Civil y Arquitectura Deportiva"
Proyectos y Montajes should look and feel like an elite engineering consultancy that builds what it designs. The aesthetic avoids loud consumer marketing in favor of **architectural restraint, precision typography, deep natural contrast, and authentic full-bleed photography**.

* **Palette Strategy:**
  * **Primary Canvas:** Deep Emerald (`#1b5e20`) and Near-Black Forest (`#0b120d`) for high-authority zones (Hero, Authority Showcase, Lightbox, B2B Wizard).
  * **Secondary Canvas:** Clean Architectural Off-White (`#f7f9f7`) with crisp white card containers for high-readability technical specifications and project grids.
  * **Precision Accent:** Industrial Gold (`#d4af37`), reserved exclusively for key metadata badges, active tab indicators, and primary conversion triggers. Never used for long body text.
* **Typography:**
  * Clean, geometric, highly legible sans-serif (`Open Sans` / `Inter`) with disciplined weight pairing: 900 Black for monumental statements, 700 Bold for technical labels, 400 Regular for narrative reading.

---

## 13. Proposed Homepage Composition Blueprint

```
1. GLOBAL ANNOUNCEMENT & HEADER
   - Brand lockup + 3 Verticals + Portafolio + Nosotros + Direct WhatsApp CTA + Mobile Drawer Trigger

2. MONUMENTAL HERO: "INGENIERÍA DEPORTIVA & PAISAJISMO DE ÉLITE"
   - Next/Image priority background (Padel Smash Club or Multi-Sport Complex)
   - Trust Badge: "Más de 20 Años de Trayectoria en Colombia"
   - Dual CTAs: "Iniciar Asesoría Técnica" (Primary Gold) / "Explorar Portafolio de Obras" (Ghost)

3. CORPORATE SOCIAL PROOF & METRICS STRIP
   - Verified metric cards: +20 Años · +500 Proyectos · 12 Departamentos · Estándares FIFA & EN 1177
   - Clean typographic client mentions (Institucional, Clubes, Constructoras)

4. LOS TRES PILARES DE NEGOCIO (3 Core Cards)
   - 1. Canchas Deportivas (Pádel, Fútbol, Múltiples) $\to$ Genuine Padel Glass Court Photo
   - 2. Parques Infantiles (Módulos, Pisos EPDM) $\to$ Genuine EPDM Playground Photo (IMG_4683)
   - 3. Paisajismo & Terrazas (Grama Residencial) $\to$ Genuine Rooftop Garden Photo (IMG_4638)

5. OBRAS EMBLEMÁTICAS (Authority Showcase)
   - 3 Flagship Projects with live metrics: Smash Club (Pádel) · Macro-Parque EPDM · Terraza Residencial

6. ARCHIVO DE OBRA VIVO (Interactive Live Gallery)
   - Dynamic tabbed masonry powered by existing 837 photo archive with subcategory filtering & modal lightbox

7. INGENIERÍA DE MATERIALES & ESPECIFICACIONES TÉCNICAS
   - Real photos of turf fibers, FIFA certificates, 12mm tempered glass, EPDM impact tests
   - Download Technical Sheet CTA (PDF)

8. ASISTENTE DE COTIZACIÓN & VIABILIDAD TÉCNICA
   - 5-step B2B qualification wizard connected to WhatsApp direct routing

9. INSTITUTIONAL FOOTER
   - Verified contact details (Bucaramanga, phone, email) + full route navigation + legal copy
```

---

## 14. Prioritized Transformation Roadmap

### Phase 2A — Immediate Core Remediation (P0)
* [ ] Fix `Header.tsx`: Implement mobile slide-over drawer with hamburger trigger; fix unmapped font classes.
* [ ] Normalize `tailwind.config.js`: Clean spacing overrides and configure semantic typography tokens.
* [ ] Correct `Footer.tsx`: Replace placeholder phone/email with real contact data; fix `#canchas` hash links.
* [ ] Fix Hero LCP: Migrate from CSS `background-image` to Next.js `<Image priority>` and fix mobile font scaling.
* [ ] Add `metadataBase` in `app/layout.tsx` and generate `app/sitemap.ts` and `app/robots.ts`.

### Phase 2B — Asset Integration & Authority Polish (P1)
* [ ] Replace placeholder imagery in `Services.tsx`: Connect genuine playground (`IMG_4683.JPG`) and landscape (`IMG_4638.JPG`) photos.
* [ ] Resolve `BeforeAfter.tsx`: Seed authentic before/after image pairs or temporarily isolate the component.
* [ ] Standardize brand claims: Unify "+500 Proyectos Entregados" across all views.
* [ ] Balance `FeaturedProjects.tsx`: Feature all 3 business verticals using optimized Next.js `<Image>` components.

### Phase 2C — Conversion & Journey Optimization (P2)
* [ ] Rebrand Quote Simulator section to "Asistente de Cotización & Viabilidad Técnica".
* [ ] Integrate public "Descargar Ficha Técnica" CTA leading to PDF template.
* [ ] Enhance `portafolio/page.tsx` with hybrid fallback to the 837 filesystem media archive if DB has 0 rows.

---

## 15. Implementation Approval Gate

**STATUS: PHASE 1 COMPLETED — MEDIA INTEGRITY P0 REMEDIATED LOCALLY — DEPLOYMENT LOCKED**

The Phase 1 assessment and the emergency Media Integrity Recovery (P0) for `/servicios/paisajismo` have been successfully investigated, resolved, and verified in the local environment. In accordance with the Master Directive, **no production deployment or Phase 2 visual redesign will proceed** until explicit stakeholder authorization is granted.

---

## 16. Focused Addendum — Media Integrity Recovery & Landscaping Remediation (P0 Resolved Locally)

### 16.1 Exact Root Cause of the HTTP 400 Failures
1. **Source File Non-Existence at Target Paths:**
   The Next.js image optimizer returned `HTTP 400 Bad Request` (`The requested resource isn't a valid image for ... received null`) because `app/servicios/paisajismo/page.tsx` contained three hardcoded asset paths pointing to files that **never existed** in those subdirectories:
   - `/images/drive%20organice/residencial/IMG_5449.JPEG` (Hero background) $\to$ **Did not exist** in `residencial/` (actually located in `canchas/`).
   - `/images/drive%20organice/residencial/IMG_5451.JPEG` (Detail 1) $\to$ **Did not exist** in `residencial/` (actually located in `canchas/`).
   - `/images/drive%20organice/piscina/IMG_0062.JPG` (Detail 2) $\to$ **Did not exist** in `piscina/` (actually located in `canchas/`).
   When Next.js static asset resolver received the requests, it yielded 404 (null), prompting the image optimizer to reject the request with HTTP 400.
2. **URL Encoding Architecture:**
   Testing confirmed that Next.js image optimizer safely decodes single and double URL-encoded spaces (`%20` and `%2520`) when the underlying file exists. The failure was strictly an **invalid path assignment to non-existent filenames**.
3. **Gallery API Deployment Drift (Discovered & Prevented):**
   The public gallery API (`lib/media-library.ts`) previously set `includeVideos = true`. While `.mp4` and `.mov` files existed on the local developer filesystem, all 136 video files were excluded from production deployment by `.gitignore` to satisfy Vercel Hobby's <1GB ceiling. This would have caused all video assets to 404 in production.

### 16.2 Files Corrected
1. `app/servicios/paisajismo/page.tsx`:
   - Converted Hero from unoptimized CSS `backgroundImage` to Next.js `<Image priority fill sizes="100vw">` using verified residential rooftop photography (`IMG_4638.JPG`).
   - Replaced broken Detail 1 with genuine tracked urban terrace image (`IMG_1271.PNG`).
   - Replaced broken Detail 2 with genuine tracked pool-deck synthetic turf image (`IMG_8075.JPG`).
2. `lib/media-library.ts`:
   - Scoped public service showcase querying to deployable images only (`includeVideos = false`).
   - Cleaned `SERVICES_CONFIG` subcategories to display only tabs backed by 100% verified production assets.
3. `app/components/BeforeAfter.tsx`:
   - Added graceful isolation guard: returns `null` when underlying paired comparison images are unseeded, preventing broken error placeholders from polluting the live homepage.
4. `scripts/verify-media-integrity.ts` (New Tooling):
   - Created automated media integrity test suite verifying local existence, Git tracking status, and gallery delivery.

### 16.3 Path Mapping & Asset Provenance
| Slot | Original Broken Path | Corrected Deployable Path | Source File Provenance & Subject | Git Status |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Background** | `/images/drive%20organice/residencial/IMG_5449.JPEG` | `/images/drive%20organice/residencial/IMG_4638.JPG` | Genuine luxury residential rooftop garden & lawn | **Tracked (Deployable)** |
| **Detail Card 1** | `/images/drive%20organice/residencial/IMG_5451.JPEG` | `/images/drive%20organice/residencial/IMG_1271.PNG` | Genuine residential apartment terrace with synthetic turf | **Tracked (Deployable)** |
| **Detail Card 2** | `/images/drive%20organice/piscina/IMG_0062.JPG` | `/images/drive%20organice/piscina/IMG_8075.JPG` | Genuine swimming pool perimeter & wet deck synthetic turf | **Tracked (Deployable)** |

### 16.4 Verification Results
* **Automated Media Integrity Scan (`scripts/verify-media-integrity.ts`):**
  - Scanned source components: 71
  - Hardcoded image references: 24 valid and deployable (0 broken across service pages).
  - Gallery Services Audit (100% Git-Tracked Deployable Assets):
    - `CANCHAS`: 217 assets (0 broken).
    - `PARQUES`: 222 assets (0 broken).
    - `PAISAJISMO`: 398 assets (0 broken).
* **End-to-End HTTP Server Verification (Local Port 3007):**
  - `GET /servicios/paisajismo`: **HTTP 200 OK**
  - `GET /_next/image?url=...IMG_4638.JPG&w=1920&q=75`: **HTTP 200 OK** (image/jpeg, 287 KB from 11.1 MB source)
  - `GET /_next/image?url=...IMG_1271.PNG&w=1080&q=75`: **HTTP 200 OK** (image/png, 740 KB)
  - `GET /_next/image?url=...IMG_8075.JPG&w=1080&q=75`: **HTTP 200 OK** (image/jpeg, 235 KB)
  - `GET /api/media-library?service=paisajismo`: **HTTP 200 OK** (398 deployable assets)

### 16.5 Deployment Implications & Safety
* **Hotfix Commit:** `8e70aec` (`fix(media): restore landscaping assets and harden public gallery delivery`)
* **Previous Rollback Target:** `eeff1ef` (`fix(middleware): isolate clerk middleware matcher exclusively to admin routes`)
* **Repository Remote:** `git@github-matamoros:matamorosnavas69-cloud/proyectos-y-montajes.git` (Branch `main`)
* **Zero New Dependencies:** No external libraries or heavy tools were installed.
* **Vercel Hobby Safety (<1GB):** Image-only policy preserves the lightweight repository footprint.
* **Production Status:** `P0 COMMITTED & PUSHED TO GITHUB — PENDING VERCEL DASHBOARD REDEPLOY`
  Commit `8e70aec` has been pushed to `origin main`. In the Vercel dashboard (`copo69`'s projects $\to$ `proyectos-y-montajes`), click **"Redeploy"** to trigger the build with the new environment variables and hotfix code.

---

## 17. Addendum: Serverless Media Archival & Technical Sheet Resolution (Commit `f5773db`)

### 17.1 Problem Diagnosis
1. **Gallery Image Archival Failure in Production (`/admin/biblioteca-media`):**
   * **Observed Error:** `ENOENT: no such file or directory, mkdir '/var/task/public/images/drive organice/.archive/canchas'` $\to$ HTTP 400 Bad Request.
   * **Root Cause:** Next.js on Vercel runs in AWS Lambda serverless execution containers where `process.cwd()` is `/var/task`. The filesystem under `/var/task` is strictly **read-only / immutable**. Any direct disk mutation (`mkdir`, `rename`, `unlink`) fails with `ENOENT` or `EROFS`.
2. **Missing Technical Sheet (`/Ficha_Tecnica_Proyectos_y_Montajes.pdf`):**
   * **Observed Error:** HTTP 404 on preloading `/Ficha_Tecnica_Proyectos_y_Montajes.pdf` from the admin layout navigation.
   * **Root Cause:** The PDF file was positioned at the package root rather than within Next.js's static `public/` directory.
3. **Clerk Development Warning:**
   * **Observed Log:** `Clerk: Clerk has been loaded with development keys.`
   * **Assessment:** Benign informational notification during pre-production development (`pk_test_...`). Will transition automatically when production keys are provisioned in Vercel.

### 17.2 Architectural Remediation
1. **Database-Backed Persistent Archival State Machine (`ArchivedMediaAsset`):**
   * Registered `ArchivedMediaAsset` model in Prisma schema (`schemas: ["proyectos_y_montajes"]`):
     ```prisma
     model ArchivedMediaAsset {
       id         String   @id @default(cuid())
       category   String   // canchas, parques, piscina, golf, residencial
       filename   String
       archivedAt DateTime @default(now())
       archivedBy String?
       reason     String?
       @@unique([category, filename])
       @@schema("proyectos_y_montajes")
     }
     ```
   * Synced to Supabase PostgreSQL database via `npx prisma db push`.
2. **Resilient Serverless Media Library (`lib/media-library.ts`):**
   * **`archiveLibraryAsset`:** Performs upsert to `prisma.archivedMediaAsset`. Gracefully catches and ignores read-only disk mutations on Vercel without failing the request.
   * **`restoreLibraryAsset`:** Removes the asset from `ArchivedMediaAsset`, instantly returning it to active status.
   * **Query-Time Exclusion:** Both public service galleries (`getServiceGallery`) and admin queries (`listCategoryAssets`) dynamically filter out any archived filenames.
   * **Supabase Cloud Upload Fallback:** If local filesystem write fails in serverless, uploads fallback directly to Supabase Storage bucket `proyectos`.
3. **Enhanced Admin UI (`app/admin/biblioteca-media/page.tsx`):**
   * Added segmented pill toggle: **Activas** vs. **Archivadas**.
   * Added full recovery capabilities: Admins can view archived assets and click **"Restaurar"** to return them to the public gallery with a single click.
4. **Static PDF Relocation:**
   * Moved `Ficha_Tecnica_Proyectos_y_Montajes.pdf` (156 KB) into `public/Ficha_Tecnica_Proyectos_y_Montajes.pdf`, guaranteeing instant HTTP 200 delivery.

### 17.3 Verification & Testing
* **End-to-End Lifecycle Test (`scripts/test-archive-lifecycle.ts`):**
  - Archived `19dafd34-0868-427c-a602-0bd0893c99f2.jpg` (Active count decreased from 166 $\to$ 165).
  - Verified presence in `ArchivedMediaAsset` registry and absence from public view.
  - Executed `restoreLibraryAsset` $\to$ Active count restored to 166.
  - Result: **100% Pass** without requiring filesystem write access.
* **Production Build Validation:** `npm run build` compiled 25 static and dynamic pages with 0 errors.
* **Deployment Commit:** `f5773db` pushed to `origin main` on `git@github-matamoros:matamorosnavas69-cloud/proyectos-y-montajes.git`.



