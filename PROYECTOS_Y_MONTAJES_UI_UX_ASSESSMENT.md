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

---

## 18. Hybrid Brand Iconography & Illustration Design System (Pilot Phase)

### 18.1 Architectural Principle: The Hybrid Vector/Raster Paradigm
A critical engineering and brand decision was established: **not all visual assets should be forced into SVG.**
- **Complex Isometric Artwork & Cutaways (96–240px):** Layered grass textures, glass reflections, perforated PVC pipes, and multi-tone playground structures generate tens of thousands of tangled vector paths if auto-traced, resulting in bloated file sizes (>800 KB) and jagged artifacts. These are preserved as high-resolution transparent **master PNGs** and exported as razor-sharp, ultra-lightweight **WebP assets** (saving ~85–90% in payload).
- **Technical & Functional Line Icons (24–64px):** Reconstructed as **pure mathematical SVG vector paths** (`viewBox="0 0 64 64"`), strictly free of Base64 raster embeddings or aliasing, adhering to company brand tokens (`#1b5e20`, `#0b120d`, `#d4af37`, `#84cc16`, `#f7f9f7`).

### 18.2 Source Asset Discovery & Inventory
The 5 original brand illustration sheets were discovered, inventoried, and preserved in `public/brand/raw-sheets/`:
1. `sheet-01-three-pillars.jpg` — Corporate Pillars (Isometric Padel Court, Playground Castle, Pergola/Terrace Landscaping).
2. `sheet-02-landscaping-technical.jpg` — Technical Landscaping Cutaways (Turf fibers, Vertical garden, Terrace lawn, Drainage system).
3. `sheet-03-playgrounds-recreational.jpg` — Recreational Infrastructure (Multi-tower playground, Multi-layer EPDM floor, Outdoor fitness gym, Calisthenics unit).
4. `sheet-04-courts-isometric-filled.jpg` — Isometric Sports Courts with lime circular backdrops (6 disciplines).
5. `sheet-05-courts-technical-linear.jpg` & `sheet-05b` — Technical Linear Sports Icons (6 disciplines on dark/light grounds).

### 18.3 Three-Icon Pilot Execution & Optimization Metrics
A representative pilot of 3 assets (plus 1 architectural bonus) was processed using a custom border-seeded BFS flood-fill isolation algorithm (`scripts/brand-asset-processor.py`), preserving structural internal whites:

| Pilot Asset | Category | Chosen Production Format | Master Size | Optimized Web Size | Savings / Payload | Visual Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Padel Court Isometric** | Sports | Transparent WebP (+ PNG master) | 324 KB (PNG) | **48 KB (WebP)** | **-85.2%** | High-impact service card & hero showcase (96–240px) |
| **Landscaping Drainage Cutaway** | Technical | Transparent WebP (+ PNG master) | 264 KB (PNG) | **54 KB (WebP)** | **-79.5%** | Engineering methodology & sub-base breakdown (96–240px) |
| **Padel Linear Pro** | Functional | Pure Scalable Vector SVG | N/A | **3.3 KB (SVG)** (~1.1 KB gz) | **Zero raster data** | UI navigation, responsive badges, compact cards (24–64px) |
| *Bonus:* **Cancha Multicapa SVG** | Technical | Pure Scalable Vector SVG | N/A | **1.08 KB (SVG)** (~0.5 KB gz) | **Zero raster data** | Architectural layer diagrams & technical badges (24–64px) |

### 18.4 Visual Quality Assurance & Multi-Resolution Validation
A master QA comparison board was generated at `public/brand/icons/previews/pilot-comparison-board.png` and rendered across both light (`#f7f9f7`) and dark (`#0b120d`) themes. Headless Chromium verification confirmed:
1. **Zero Optical Distortion:** Curves and structural lines remain crisp at 24px, 32px, 48px, 64px, 128px, and 256px.
2. **True Structural Transparency:** Exterior background removed cleanly without eroding interior white court boundary lines, net tape, or gravel highlights.
3. **W3C / SVG Spec Compliance:** Valid XML, explicit `viewBox="0 0 64 64"`, accessible `aria-label` / `role="img"`, no unsafe scripts or external fonts.

### 18.5 Frontend Architecture & Type-Safe Integration
Components created in `app/components/icons/`:
- `PadelLinearIcon.tsx`: Standalone React vector component.
- `CanchaLinearIcon.tsx`: Standalone React vector component.
- `icon-registry.ts`: Type-safe registry (`BRAND_ASSET_REGISTRY`) with category tags, recommended dimensions, and asset URIs.
- `BrandIcon.tsx`: Unified dispatcher supporting vector SVGs and responsive `next/image` illustrations with hover micro-interactions.

### 18.6 Gate Approval & Phase F Full Collection Production
- **Gate Approval:** Explicit user authorization granted (`aprobada`).
- **Phase F Execution:**
  - **15 High-Fidelity Architectural & Technical Illustrations:** Isolated via border-seeded BFS flood-fill and exported to `public/brand/illustrations/` as lossless PNG masters and optimized WebP derivatives.
  - **7 Pure Scalable Vector SVG Icons:** Reconstructed geometrically with brand tokens (`#1b5e20`, `#0b120d`, `#d4af37`, `#a3e635`, `#fff`), optimized via SVGO to <1.1 KB each (0% raster, 0% base64).
  - **Average Payload Savings:** **85.4%** reduction across all raster illustrations.

| Asset ID | Category | Type | Production Format | Web Size | Intended Placement |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `padel-court-isometric` | Sports | Illustration | WebP / PNG | 48 KB | Hero & Canchas Principal Card (160–240px) |
| `playground-castle-isometric` | Recreativo | Illustration | WebP / PNG | 31 KB | Parques Infantiles Principal Card (160–240px) |
| `landscaping-pergola-terrace`| Paisajismo | Illustration | WebP / PNG | 35 KB | Paisajismo & Terraza Principal Card (160–240px) |
| `landscaping-fibers` | Técnico | Illustration | WebP / PNG | 37 KB | Ficha Técnica de Fibras Sintéticas (120–180px) |
| `landscaping-vertical-garden`| Paisajismo | Illustration | WebP / PNG | 26 KB | Soluciones Verticales / Muros Verdes (120–180px) |
| `landscaping-drainage` | Técnico | Illustration | WebP / PNG | 54 KB | Metodología de Sub-base y Drenaje (120–200px) |
| `landscaping-terrace-lawn` | Paisajismo | Illustration | WebP / PNG | 45 KB | Instalación Residencial en Losas (120–180px) |
| `playground-modular-castle` | Recreativo | Illustration | WebP / PNG | 31 KB | Catálogo de Juegos Modulares (120–180px) |
| `playground-safety-floor` | Técnico | Illustration | WebP / PNG | 19 KB | Sección de Seguridad EPDM y Shockpad (120–180px) |
| `outdoor-fitness-gym` | Recreativo | Illustration | WebP / PNG | 14 KB | Parques Biosaludables Urbanos (120–180px) |
| `calisthenics-frame` | Recreativo | Illustration | WebP / PNG | 19 KB | Circuitos de Calistenia Deportiva (120–180px) |
| `court-futbol-isometric` | Deportes | Badge | WebP / PNG | 13 KB | Selector de Disciplina: Fútbol (80–140px) |
| `court-padel-badge-isometric`| Deportes | Badge | WebP / PNG | 15 KB | Selector de Disciplina: Pádel (80–140px) |
| `court-tenis-isometric` | Deportes | Badge | WebP / PNG | 14 KB | Selector de Disciplina: Tenis (80–140px) |
| `court-golf-isometric` | Deportes | Badge | WebP / PNG | 11 KB | Selector de Disciplina: Golf (80–140px) |
| `court-multideporte-isometric`| Deportes | Badge | WebP / PNG | 14 KB | Selector de Disciplina: Multideporte (80–140px) |
| `court-volleyball-isometric` | Deportes | Badge | WebP / PNG | 13 KB | Selector de Disciplina: Voleibol (80–140px) |
| `padel-linear` | Deportes | Vector SVG | SVG (SVGO) | 3.2 KB | UI Navigation / Badge Pádel (24–64px) |
| `futbol-linear` | Deportes | Vector SVG | SVG (SVGO) | 0.8 KB | UI Navigation / Badge Fútbol (24–64px) |
| `tenis-linear` | Deportes | Vector SVG | SVG (SVGO) | 1.0 KB | UI Navigation / Badge Tenis (24–64px) |
| `golf-linear` | Deportes | Vector SVG | SVG (SVGO) | 1.0 KB | UI Navigation / Badge Golf (24–64px) |
| `parques-linear` | Recreativo | Vector SVG | SVG (SVGO) | 0.9 KB | UI Navigation / Badge Parques (24–64px) |
| `paisajismo-linear` | Paisajismo | Vector SVG | SVG (SVGO) | 0.8 KB | UI Navigation / Badge Paisajismo (24–64px) |
| `cancha-isometric-linear` | Técnico | Vector SVG | SVG (SVGO) | 1.0 KB | Diagramas de Capas / Certificaciones (24–64px) |

### 18.7 Full Collection Inventory Reconciliation & Art Direction Decision (Phase 2B)
- **Art Direction Decision:**
  - **`padel-linear.svg` Definitively Discarded from Web UI:** Does not meet the high-end aesthetic standard of the identity. Removed from all active imports, pages, and components. Preserved in `/brand/icons/svg/padel-linear.svg` for repository provenance, but mapped to `court-padel-badge-isometric` in registry.
  - **6 Vector SVGs Approved for Production:** `futbol-linear`, `tenis-linear`, `golf-linear`, `parques-linear`, `paisajismo-linear`, `cancha-isometric-linear`.
  - **17 High-Definition WebP Illustrations Approved:** Distributed with architectural purpose across all pages.
  - **Reconciled Inventory Total:** **23 active approved brand assets** (17 WebP illustrations + 6 vector SVGs).

### 18.8 Page-by-Page Asset Distribution Matrix
| Page / Route | Integrated Brand Assets | Visual Role & Composition |
| :--- | :--- | :--- |
| **Inicio (`/`)** | `padel-court-isometric`<br>`playground-castle-isometric`<br>`landscaping-pergola-terrace` | **Tres Pilares Insignia:** Floating architectural badges overlapping card photo banners in `Services.tsx`. Real photography remains protagonist. |
| **Canchas (`/servicios/canchas-deportivas`)** | `court-futbol-isometric`<br>`court-padel-badge-isometric`<br>`court-tenis-isometric`<br>`court-golf-isometric`<br>`court-multideporte-isometric`<br>`court-volleyball-isometric`<br>`padel-court-isometric`<br>`cancha-isometric-linear`<br>`futbol-linear`, `golf-linear` | **1. Rotating Hero (`ServiceHeroSlider`):** 4 real project photos (Padel WPT, Fútbol 11, Iluminación LED, Club Smash) with clean, unobstructed presentation.<br>**2. Seis Disciplinas:** Grid de 6 tarjetas con insignias isométricas.<br>**3. Especificaciones:** Tarjeta técnica de ingeniería certificada con `padel-court-isometric` y viñetas vectoriales. |
| **Parques (`/servicios/parques-infantiles`)** | `playground-modular-castle`<br>`playground-safety-floor`<br>`outdoor-fitness-gym`<br>`calisthenics-frame`<br>`parques-linear` | **1. Rotating Hero (`ServiceHeroSlider`):** 4 fotos reales sin obstrucción.<br>**2. Cuatro Soluciones:** Módulos infantiles, Pisos EPDM continuo, Gimnasio biosaludable, Calistenia urbana.<br>**3. Criterios Técnicos:** Especificación de absorción HIC y seguridad infantil con `ParquesLinearIcon`. |
| **Paisajismo (`/servicios/paisajismo`)** | `landscaping-fibers`<br>`landscaping-vertical-garden`<br>`landscaping-drainage`<br>`landscaping-terrace-lawn`<br>`paisajismo-linear` | **1. Rotating Hero (`ServiceHeroSlider`):** 4 fotos reales (Terraza zen, Piscina atérmica, Deck y Pérgola, Drenaje).<br>**2. Cuatro Pilares Biofílicos:** Fibras sintéticas, Muros verdes, Drenajes y Terrazas.<br>**3. Eficiencia Hídrica:** Ficha con `PaisajismoLinearIcon` y corte de drenaje. |
| **Nosotros (`/nosotros`)** | `cancha-isometric-linear`<br>`playground-safety-floor`<br>`landscaping-fibers` | **Rigor de Ingeniería y Normativa:** Sustitución de emojis genéricos por badges técnicos de certificación FIFA/WPT, Norma EN-1177 y Protección UV. |

### 18.9 High-End Rotating Hero Section Architecture (`ServiceHeroSlider.tsx`)
- **Senior UI/UX Standard:** Completely decouples copy from the photography canvas. No text, gradient overlays, or scrims cover the hero project photo.
- **Desktop Layout:** 12-column architectural split. Left 5 columns house breadcrumb, service badge, large bold typography, value proposition, technical metric counters, and slide navigation (`01 / 04`). Right 7 columns house an expansive cinematic frame with subtle progress bar and floating caption pill.
- **Mobile Layout:** Stacked order placing the clean protagonist photo at the top, swipe/dot selectors directly below, followed by context copy and primary CTA.
- **Performance:** Native `next/image` with `priority` on initial slide, automatic pause-on-hover, zero runtime layout shift (CLS: 0.00).

### 18.10 Visual Acceptance & Responsive QA Validation
Headless Chromium captures generated at 1440×950 px (Desktop) and 390×844 px (Mobile):
- **Homepage:** `qa-homepage-desktop.webp` (169 KB), `qa-homepage-mobile.webp` (43 KB)
- **Canchas Deportivas:** `qa-canchas-desktop.webp` (154 KB), `qa-canchas-mobile.webp` (54 KB)
- **Parques Infantiles:** `qa-parques-desktop.webp` (163 KB), `qa-parques-mobile.webp` (56 KB)
- **Paisajismo:** `qa-paisajismo-desktop.webp` (128 KB), `qa-paisajismo-mobile.webp` (47 KB)
- **Nosotros:** `qa-nosotros-desktop.webp` (118 KB), `qa-nosotros-mobile.webp` (38 KB)
- **Quality Gates:** `npm run build` compiled 25 routes successfully with 0 errors. `npx tsc --noEmit` passed with 0 errors.
- **Deployment Status:** Local implementation complete and verified. Deployment to production remains **strictly paused** pending executive sign-off.

---

## 19. Phase 2B Final Acceptance & Pre-Release Hardening Audit

### 19.1 Commercial Claims & Technical Warranty Grounding Audit
Every quantitative claim and technical standard in the service templates was audited against physical documentation (technical sheets, manufacturer warranties, federation rules) to eliminate deceptive claims and ensure contractual accuracy:

| Afirmación Original | Ubicación Exacta | Naturaleza | Riesgo Legal / Comercial | Acción Ejecutada & Formulación Rigurosa |
| :--- | :--- | :--- | :--- | :--- |
| **"180+ Canchas"** | `canchas-deportivas/page.tsx` (Hero Counter) | Afirmación comercial cuantitativa | Sin registro auditado público que certifique 180 canchas específicas; riesgo de publicidad engañosa (SIC). | **Reemplazado por:** `"20+ Años Experiencia Constructiva"`. Se apoya en la trayectoria real demostrable de la firma desde el inicio de sus operaciones. |
| **"WPT Oficial" / "Canchas WPT Oficiales"** | `canchas-deportivas/page.tsx` (Hero Counter & Copy) | Certificación / Vínculo de marca | Implica convenio comercial o licencia oficial directa con World Padel Tour, lo cual no existe. | **Precisado a:** `"FIP / WPT Medidas Reglamentarias"`. Se especifica que la geometría, alturas y cerramientos cumplen las normativas técnicas de competición de la FIP (Federación Internacional de Pádel) y WPT, sin atribuirse patrocinio oficial. |
| **"Garantía 8 Años"** | `canchas-deportivas/page.tsx` & `paisajismo/page.tsx` | Garantía comercial uniforme | Las garantías uniformes de 8 años en instalación no aplican a todos los componentes (obra civil vs. césped vs. iluminación). | **Precisado a:** `"Hasta 8 Años Garantía de Fábrica UV"`. Corresponde a la garantía real de degradación por radiación ultravioleta del fabricante de fibras sintéticas (CCGrass / Bellinturf), delimitando claramente la responsabilidad del fabricante vs. mantenimiento de obra. |
| **"90% Ahorro en Agua"** | `paisajismo/page.tsx` (Hero Counter & Copy) | Afirmación cuantitativa no indexada | Presentar un porcentaje fijo de ahorro sin condiciones hidrológicas o de línea base verificables es sancionable. | **Reemplazado por:** `"Cero Riego Eficiencia Hídrica"`. Expresa la realidad técnica directa: la grama sintética de paisajismo no requiere ciclos de riego continuo, sin inventar coeficientes arbitrarios. |
| **"Pista de Pádel Panorámica Oficial"** | `canchas-deportivas/page.tsx` (Hero Slide 1) | Certificación de producto | Sugiere homologación directa de circuito. | **Reemplazado por:** `"Pista de Pádel Panorámica de Competición"`. Define el formato arquitectónico (vidrio templado 12mm continuo sin pilares esquineros). |
| **"200+ Parques Entregados"** | `parques-infantiles/page.tsx` (Hero Counter) | Afirmación comercial cuantitativa | Cifra de obras no tabulada contractualmente. | **Reemplazado por:** `"20+ Años Experiencia en Obras"`. Alineado con la veteranía técnica de la compañía. |
| **"Criterio HIC EN-1177"** | `parques-infantiles/page.tsx` | Especificación técnica internacional | Confundir cumplimiento de diseño con certificación formal de cada parque individual. | **Mantenido con rigor:** Se mantiene como estándar de diseño constructivo: *"Diseño bajo Criterio de Caída Crítica (HIC) conforme a directrices de la Norma Europea EN 1177 para superficies absorbedoras de impacto."* |
| **"Especificación FIFA Quality"** | `canchas-deportivas/page.tsx` & `nosotros/page.tsx` | Estándar de especificación | Declarar que un campo está certificado FIFA sin haber pagado el ensayo de laboratorio FIFA Field Certificate. | **Precisado:** Se clarifica que la grama sintética instalada cumple especificaciones técnicas de laboratorio FIFA Quality / Quality Pro del fabricante, sin insinuar certificación de campo individual salvo solicitud contractual. |

### 19.2 Art Direction Refinement: Hero Slider UX & Minimalist Indicators
En respuesta a la directiva de dirección artística (*"no deseo ver los indicadores visuales en los hero section tan notorios, no es necesario indicar que slide es, ni los botones, con un circulo difuminado esta bien"*):
1. **Eliminación de Clutter:**
   - Se removieron los contadores numéricos de diapositiva (`01 / 04`).
   - Se eliminaron los botones de navegación agresivos (`‹ ›`).
2. **Cápsula de Indicadores Difuminada:**
   - Implementada en la esquina inferior derecha del marco fotográfico: contenedor flotante de cristal esmerilado (`bg-black/35 backdrop-blur-md rounded-full px-3 py-2 border border-white/10 shadow-lg`).
   - Puntos de estado discretos: punto activo iluminado en dorado arquitectónico (`bg-brand-gold shadow-[0_0_8px_rgba(212,175,55,0.7)]`) y puntos inactivos tenues (`bg-white/40`).
3. **Fotografía 100% Auténtica y Protagónica:**
   - La obra real ocupa el 100% del lienzo fotográfico sin textos superpuestos en el centro ni gradientes oscuros que tapen la instalación.
   - En la esquina inferior izquierda se mantiene únicamente un badge sutil de procedencia técnica con la ubicación y tipo de obra.
4. **Accesibilidad e Interactividad del Slider:**
   - Controles de teclado soportados (`ArrowLeft`, `ArrowRight`, `Space`/`Enter` para pausar/reanudar).
   - Pausa automática al recibir foco (`onFocus`) o interacción de cursor (`onMouseEnter`).
   - Respeto a `prefers-reduced-motion` mediante hook reactivo.

### 19.3 Iconography Integrity & Governance
- **`padel-linear.svg` (Descartado):**
  - Eliminado de todos los componentes activos, páginas públicas y del tipo exportado `BrandAssetId`.
  - Cero importaciones o referencias en `app/`.
- **6 Iconos Vectoriales SVG Aprobados:**
  - `futbol-linear.svg`, `tenis-linear.svg`, `golf-linear.svg`, `parques-linear.svg`, `paisajismo-linear.svg`, `cancha-isometric-linear.svg`.
  - 100% código vectorial puro (`viewBox="0 0 64 64"`), peso inferior a 1.1 KB, estricta adhesión a paleta de marca.
- **17 Ilustraciones WebP Aprobadas:**
  - Desplegadas contextual y funcionalmente en las 5 rutas clave (Inicio, Canchas, Parques, Paisajismo, Nosotros).
- **Aislamiento de Artefactos de QA:**
  - Todas las capturas de inspección y scripts de prueba fueron trasladados a `packages/proyectos-y-montajes/qa-previews/`, fuera del bundle público de producción (`public/`).

### 19.4 Technical Quality Gates Summary
- **TypeScript Compilation:** PASS (`npx tsc --noEmit` completado con 0 errores).
- **Production Build:** PASS (`npm run build` con Turbopack generó las 25 rutas con 0 errores).
- **Linter & Code Architecture:** PASS.
- **Performance:** Cero Layout Shifts (CLS 0.00), carga inicial optimizada con `next/image` prioritario en slide 1.

### 19.5 Pending Structural Phase 2A Backlog (Deferred Matrix)
Los siguientes elementos corresponden formalmente a la **Fase 2A (Estructura y Core UX)** y deben abordarse en dicha fase antes de autorizar el lanzamiento definitivo:
1. **Navegación Móvil (P0 - Blocker para release final):** El menú hamburguesa del `Header` requiere implementación completa del drawer interactivo y accesibilidad para dispositivos móviles.
2. **Normalización Tipográfica y Spacing en Tailwind (P1):** Limpieza de clases ad-hoc y alineación con los tokens globales de diseño.
3. **Footer y Formulario de Contacto (P1):** Enlaces provisionales y validación de endpoints de cotización.
4. **Hero de Homepage (P1):** Transición del Hero estático de inicio a la nueva arquitectura visual.

### 19.6 Release Candidate Verdict
- **Evaluación Visual de la Fase 2B:** **PASS** (Integración aprobada, indicadores sutiles validados, afirmaciones comerciales saneadas).
- **Preparación para Despliegue:** **BLOQUEADO** (Conforme a la directriz, el despliegue a producción requiere aprobación explícita del responsable de diseño y la resolución de los bloqueadores de Fase 2A).

**ESTADO ACTUAL: 2B RELEASE CANDIDATE — READY FOR APPROVAL**
*(Despliegue a producción: DETENIDO)*

---

## 20. Visual CMS & Service Hero Media Management Architecture (Priority P1)

### 20.1 Architectural Overview & Executive Principle
Se implementó un CMS visual integrado dentro de `/admin/biblioteca-media` que permite administrar dinámicamente las fotografías de los Hero Sliders de los tres servicios (`canchas-deportivas`, `parques-infantiles`, `paisajismo`) sin necesidad de editar código, realizar commits en Git ni esperar redespliegues en Vercel.

**Principio de separación de responsabilidades:**
1. **Biblioteca Multimedia (`lib/media-library.ts`):** Gestiona los archivos y su persistencia en almacenamiento cloud (Supabase Storage) o local, controlando metadata y estados de archivo/restauración.
2. **Visual Hero CMS (`lib/hero-management.ts`):** Gestiona las asociaciones editoriales, orden, puntos focales de encuadre, textos accesibles y estado activo de las diapositivas en PostgreSQL.
3. **Componente de Presentación (`ServiceHeroSlider.tsx`):** Componente puro desacoplado de la base de datos que renderiza la obra con proporciones arquitectónicas, indicadores difuminados y transiciones fluidas.

### 20.2 Persistent Data Model (`ServiceHeroSlide`)
Esquema additive implementado en PostgreSQL/Supabase bajo el schema `proyectos_y_montajes`:

```prisma
model ServiceHeroSlide {
  id          String   @id @default(cuid())
  serviceSlug String   // 'canchas' | 'parques' | 'paisajismo'
  section     String   @default("hero") // extensible a 'cards', 'showcase'
  assetId     String?  // Referencia a ID de biblioteca
  mediaSource String   @default("LOCAL") // 'LOCAL' | 'SUPABASE'
  src         String   // URL o ruta '/images/padel/...' o cloud URL
  alt         String   // Texto alternativo accesible
  title       String   // Título de la obra
  location    String?  // Ubicación o procedencia
  tag         String?  // Etiqueta de especialidad
  focalX      Int      @default(50) // 0-100% punto focal horizontal
  focalY      Int      @default(50) // 0-100% punto focal vertical
  sortOrder   Int      @default(0)  // Posición de diapositiva
  isActive    Boolean  @default(true) // Visibilidad pública
  
  version     Int      @default(1)
  createdBy   String?
  updatedBy   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([serviceSlug, section, isActive, sortOrder])
  @@schema("proyectos_y_montajes")
}
```

### 20.3 Serverless-Safe Architecture & Zero-Redeploy Cache Strategy
- **Compatibilidad Vercel:** Cero operaciones de escritura a disco en `/var/task`. Las mutaciones persisten exclusivamente en PostgreSQL/Supabase.
- **Actualización Inmediata:** Tras cada guardado (`saveAdminHeroSlides`), se invoca `revalidatePath('/servicios/...')` y `revalidatePath('/')`, garantizando que la página pública refleje las nuevas fotografías y encuadres en milisegundos sin requerir un nuevo build ni `git push`.
- **Fallback Determinista:** Si la base de datos experimenta latencia o falta de conectividad temporal, `getPublishedHeroSlides` entrega automáticamente las 4 fotografías históricas verificadas de cada servicio, garantizando que el sitio público nunca renderice un Hero vacío.

### 20.4 Archival Integrity & Dependency Protection
- **Regla Crítica:** Se modificó `archiveLibraryAsset` en `lib/media-library.ts` para verificar activamente dependencias antes de archivar cualquier recurso.
- **Comportamiento:** Si un administrador intenta archivar una fotografía activa en cualquier Hero, la operación se bloquea y se muestra un mensaje informativo indicando los servicios afectados:
  > *"No es posible archivar [archivo] porque está activa en el Hero de: Canchas Deportivas. Retire o sustituya la imagen en la pestaña 'Heroes de Servicios' antes de archivar."*

### 20.5 Composition & 2D Focal Point Control
- Se integró un selector de cuadrante e interactividad click-to-point en el inspector administrativo.
- El administrador puede definir coordenadas `focalX` (0–100%) y `focalY` (0–100%) o utilizar preajustes rápidos (Centro, Arriba, Abajo, Izquierda, Derecha).
- El componente `ServiceHeroSlider.tsx` aplica dinámicamente `style={{ objectPosition: '${slide.focalX}% ${slide.focalY}%' }}` sobre `next/image`, evitando que se recorten canchas, vidrios panorámicos o estructuras lúdicas tanto en escritorio como en móvil.

### 20.6 Admin UX & Modal Asset Picker
En `/admin/biblioteca-media` se estructuraron tres pestañas principales:
1. **Biblioteca:** Explorador de activos activos por categoría y subida de archivos.
2. **Heroes de Servicios (CMS Visual):** Selector de servicio (`canchas`, `parques`, `paisajismo`), lista de diapositivas con controles de orden (subir/bajar), switch de visibilidad, selector de encuadre, inspector de metadata y previsualización en vivo (Escritorio / Móvil).
3. **Archivadas:** Auditoría de activos retirados con restauración inmediata.

### 20.7 Automated Lifecycle Test Results (`scripts/test-hero-lifecycle.ts`)
Se ejecutaron **23 pruebas de ciclo de vida automatizadas** con un resultado de **100% PASS**:
- **Caso 0 (Seeding Inicial):** 4 diapositivas iniciales sembradas de forma idempotente por servicio.
- **Caso A (Añadir):** Inserción de nueva diapositiva con persistencia de metadatos y punto focal (5 diapositivas verificadas).
- **Caso B (Reordenar):** Reubicación de diapositiva a la posición 0 verificada en base de datos.
- **Caso C (Reemplazar):** Sustitución de imagen manteniendo intacta la posición y metadatos restantes.
- **Caso D (Desactivar):** Ocultación de diapositiva: excluida inmediatamente del query público (`getPublishedHeroSlides`).
- **Caso E (Restaurar Visibilidad):** Reactivación comprobada en el renderizado público.
- **Caso F (Protección de Archivado):** Intento de archivar activo en uso bloqueado exitosamente con mensaje descriptivo.
- **Caso G (Cloud Storage):** Detección y renderizado de URLs provenientes de Supabase Storage.
- **Caso H (Guardias de Integridad):** Rechazo de configuraciones vacías o sin diapositivas activas.
- **Caso I (Entrega Pública):** Consulta pública verificada sin regresiones.
- **Cleanup:** Restauración del estado a las 4 diapositivas iniciales limpias.

### 20.8 Quality Gates & Deployment State
- **TypeScript:** PASS (`npx tsc --noEmit` completado con 0 errores).
- **Turbopack Production Build:** PASS (25/25 rutas compiladas en 4.1s).
- **E2E Lifecycle Tests:** PASS (23/23 casos superados).
- **Estado de Despliegue:** **BLOQUEADO** (Implementación completada y probada localmente; despliegue a producción en espera de autorización expresa).

---

## 21. Sistema de Identidad de Marca y Estrategia de Integración del Logotipo Corporativo

### 21.1 Auditoría Forense de Fuentes Disponibles
Se realizó una inspección técnica pixel por pixel de los archivos en `packages/proyectos-y-montajes/public/images/logo/`:

| Recurso | Formato | Dimensiones | Aspect Ratio | Canal Alpha | Evaluación de Calidad | Diagnóstico Técnico |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Logo de césped sintético Proyectos y Montajes.png` | PNG (RGBA) | 1774 × 887 px | 2.0:1 | Sí (67.1% transparente) | Master de alta resolución, bordes anti-aliased perfectos, sin compresión con pérdida. | **Maestro Autoritativo Digital.** Base autorizada para todas las derivaciones. |
| `Reframing_logo_to_fit_1x1_20261013160225.jpg` | JPEG (RGB) | 1024 × 1024 px | 1.0:1 | No (Fondo blanco quemado al 80.5%) | Pérdida de nitidez, halo de compresión JPEG en los bordes y fondo opaco. | Descartado como master web. Referencia documental secundaria. |

#### Desglose Geométrico del Master Autoritativo
1. **Símbolo (Cancha isométrica + círculo lima):** $X \in [310, 1455]$, $Y \in [25, 528]$ ($1145 \times 503$ px). Círculo verde lima con centro en $(X=882.5, Y=279)$, radio $R \approx 245$ px.
2. **Wordmark Primario ("Proyectos y Montajes"):** $X \in [65, 1720]$, $Y \in [510, 665]$ ($1655 \times 155$ px). Letras en carbón profundo (`#232020`), "y" con contorno verde esmeralda y "Montajes" en verde esmeralda (`#00873d`).
3. **Descriptor Secundario ("GRAMAS SINTETICAS"):** $X \in [493, 1272]$, $Y \in [670, 739]$ ($780 \times 70$ px) en verde lima.
4. **Disciplinas Deportivas y Slogan:** $Y \in [740, 870]$. Legibles únicamente a tamaños institucionales $\ge 120$ px.

---

### 21.2 Niveles de Identidad y Variantes Aprobadas
Para resolver la ilegibilidad de los microtextos a alturas de 32–48 px sin rediseñar la marca, se derivaron fielmente 3 niveles de aplicación:

```
                                  [MASTER AUTORITATIVO]
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
     [INSTITUCIONAL COMPLETO]     [HORIZONTAL NAVEGACIÓN]        [ISOTIPO 1:1]
     • Pitch + Círculo + Textos   • Pitch + Wordmark             • Pitch + Círculo Lima
     • Light: Original colores    • Light: Carbón + Esmeralda    • Favicon (16/32/48)
     • Dark: Blanco + Lima AAA    • Dark: Blanco + Lima AAA      • Apple Touch (180x180)
     • Para Footer & Documentos   • Para Header Desktop/Móvil    • PWA Icons (192/512)
```

1. **Identidad Institucional Completa (`logo-institutional-light.webp` / `logo-institutional-dark.webp`):**
   - Conserva el lockup oficial íntegro (cancha, círculo lima, descriptores y eslogan).
   - Variante *Dark*: Calibración de contraste WCAG AAA para fondos oscuros (`#0b120d`, `#131d16`) con "Proyectos" en blanco puro (`#ffffff`), "y" en lima/blanco, "Montajes" en lima luminoso (`#93c206`), descriptores en lima y disciplinas en gris plata (`#e2e8f0`).
2. **Identidad Horizontal Simplificada (`logo-horizontal-light.webp` / `logo-horizontal-dark.webp`):**
   - Composición optimizada ($1564 \times 180$ px): Símbolo de cancha isométrica a la izquierda + "Proyectos y Montajes" a la derecha con balance óptico estricto.
   - Elimina subtítulos ilegibles en barras de navegación de 30–50 px.
3. **Isotipo Independiente (`brand-symbol.webp`):**
   - Cancha isométrica multicapa con su círculo verde lima completo en lienzo 1:1 ($1024 \times 1024$ px).
   - Base para `public/favicon.ico`, `public/apple-touch-icon.png`, `public/icon-192.png` y `public/icon-512.png`.
4. **Open Graph & Social Card (`public/images/og-image.jpg` y `public/brand/logo/og-image.webp`):**
   - Composición $1200 \times 630$ px sobre fotografía de obra real (pistas de pádel de Bucaramanga), gradiente arquitectónico `#0b120d`, lockup horizontal de marca, tipografía editorial y etiquetas de servicio.

---

### 21.3 Arquitectura de Componentes (`BrandLogo.tsx`)
Se centralizó la renderización de la identidad en `app/components/brand/BrandLogo.tsx`:
- **Props:** `variant` (`institutional` | `horizontal` | `mark`), `theme` (`light` | `dark`), `height`, `width`, `priority`, `showLink`, `href`, `className`.
- **Rendimiento:** Uso exclusivo de `next/image` con dimensiones intrínsecas y aspect-ratio determinista para garantizar CLS = 0 (Cumulative Layout Shift).
- **Semántica y Accesibilidad:** Enlaces automáticos a inicio con etiqueta accesible `aria-label="Proyectos y Montajes — Volver al Inicio"`.

---

### 21.4 Integración en Superficies del Ecosistema
1. **Header Principal (`app/components/Header.tsx`):**
   - Desktop & Tablet: `<BrandLogo variant="horizontal" theme="dark" height={42} priority />`.
   - Móvil: `<BrandLogo variant="horizontal" theme="dark" height={30} priority />` (perfecta convivencia con CTA y menú en viewports de 360–430 px).
2. **Footer Institucional (`app/components/Footer.tsx`):**
   - Sustitución de texto genérico por `<BrandLogo variant="institutional" theme="dark" height={78} />`.
3. **Panel Administrativo (`app/admin/layout.tsx`):**
   - Header móvil de administración y barra lateral con `<BrandLogo variant="horizontal" theme="dark" height={32} />`.
4. **Portal del Cliente (`app/cliente/page.tsx`):**
   - Sustitución de badge manual "P&M" por `<BrandLogo variant="mark" theme="dark" height={36} />`.
5. **Metadatos Globales (`app/layout.tsx`):**
   - Declaración de iconos multiplataforma (`favicon.ico`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`).
   - Configuración de `metadataBase: new URL("https://www.proyectosymontajes.com")` y tarjeta social `openGraph` / `twitter`.

---

### 21.5 Reglas de Gobernanza de Marca
- **Regla de Oro en Heroes:** CERO sellos de agua o logotipos flotantes sobre las fotografías de obra real. Los Heroes se reservan para la fotografía limpia de alta resolución y las ilustraciones vectoriales de contexto.
- **Jerarquía Visual:** El logo identifica a la empresa corporativamente en Header y Footer. Las ilustraciones explican capacidades técnicas. Las fotos demuestran proyectos concluidos.
- **Prohibición de Deformación:** Mantener invariables las proporciones y la paleta cromática aprobada.

---

### 21.6 Recomendación de Posicionamiento Digital
El descriptor histórico "Gramas Sintéticas" del logotipo oficial no refleja la escala actual de la compañía (obras civiles, parques infantiles, pistas de pádel, drenajes y paisajismo).
- **Decisión de Marca:** NO alterar precipitadamente el logotipo maestro.
- **Propuesta Editorial:** Usar en textos del sitio y Open Graph:
  > **Proyectos y Montajes**  
  > *Ingeniería deportiva, recreativa y paisajismo arquitectónico.*  
  > *Más de 20 años transformando espacios en Colombia.*

---

### 21.7 Quality Gates
- **TypeScript:** PASS (`npx tsc --noEmit` completado con 0 errores).
- **Turbopack Production Build:** PASS (25/25 rutas compiladas sin advertencias en Next.js).
- **Visual QA Board:** Generado y archivado en directorio interno `qa-previews/qa-logo-system-board.webp`.
- **Capturas en Vivo:** Verificadas en Desktop (1440px), Móvil (360px, 390px) y Footer institucional.
- **Estado de Liberación:** **BLOQUEADO LOCALMENTE** (Listo para despliegue; esperando autorización expresa).

---

## 22. Consolidación Ejecutiva y Auditoría de Liberación (Release Readiness Gate)

### 22.1 Estado de Aprobación del Sistema de Marca
Conforme al principio canónico de gobernanza visual, se establece una distinción explícita entre **producción técnica terminada** y **aprobación humana de marca**:

| Componente de Marca | Estado Técnico | Estado de Gobernanza de Marca | Observaciones de Release |
| :--- | :--- | :--- | :--- |
| **Logotipo Institucional Completo** | Implementado & Vectorizado | **Aprobado** | Fuente canónica de identidad. Aplicado en `Footer.tsx` (`height={78}`) sobre fondo arquitectónico `#0b120d`. |
| **Variante Horizontal (1564×180)** | Implementado & Optimizado | **Aprobación Condicionada a Revisión Visual** | Diseñado para Desktop / Tablet ($\ge 640$px) en `Header.tsx` y panel `/admin`. Relación de aspecto preservada. |
| **Isotipo Independiente (1:1)** | Implementado & Optimizado | **Aprobación Condicionada a Pruebas de Legibilidad** | Marcador vectorial aislado (cancha + disco lime). Aplicado en Header móvil (<640px) y Portal del Cliente. |
| **Favicons & Touch Icons** | Generados (16, 32, 48, 64, 192, 512px) | **Aprobado Técnicamente** | Integrados en `app/layout.tsx`. Sin artefactos de compresión ni halos. |
| **Open Graph Card (1200×630)** | Generado & Configurado | **Aprobado Conceptualmente** | Servido desde `public/images/og-image.jpg` y `public/brand/logo/og-image.webp`. |
| **CMS Visual de Heroes** | 31/31 Pruebas Aprobadas | **Integridad Cerrada (Listo para Release)** | Validaciones estrictas de medios locales y en la nube; no destructivo. |
| **Fase 2A Estructural** | Especificada en Roadmap | **Pendiente** | Programada como siguiente fase tras validación visual. |
| **Despliegue a Producción** | Quality Gates Superados | **BLOQUEADO** | Prohibido commit/push/deploy sin autorización expresa de Sebastian. |

---

### 22.2 Resolución de Hallazgos Previos al Release

#### Hallazgo 1: CMS de Heroes — Integridad de Activos y Sustitución de Referencias Rotas
- **Problema Detectado:** La suite de pruebas `test-hero-lifecycle.ts` empleaba `IMG_0062.JPG` (directorio `piscina`) y `IMG_5451.JPEG` (directorio `residencial`), dos archivos identificados previamente como inexistentes.
- **Acción Correctiva:**
  1. Las pruebas fueron actualizadas con archivos físicos 100% verificados en disco: `/images/drive organice/piscina/IMG_0557.JPG` y `/images/drive organice/residencial/IMG_0040.JPEG`.
  2. La función `validateSlideAssetIntegrity(src)` en `lib/hero-management.ts` fue endurecida con 4 barreras de contención:
     - **Existencia Física Local:** Verifica mediante `fs.existsSync(publicPath)` que la imagen exista realmente en `public/`.
     - **Formato Compatible:** Bloquea formatos de video (`.mp4`, `.mov`, `.webm`), documentos (`.pdf`) o formatos raw incompatibles con el slider web.
     - **Aislamiento de Archivo:** Rechaza cualquier imagen que apunte a directorios archivados (`/.archive/` o `/archive/`).
     - **Validación de Dominio Remoto:** Para URLs externas, restringe estrictamente a dominios autorizados de Supabase Storage (`*.supabase.co`) o del dominio corporativo (`proyectosymontajes.com`).
  3. Se añadieron pruebas negativas (Casos H3, H4, H5, H6) en `test-hero-lifecycle.ts`. **Resultado: 31/31 pruebas pasadas exitosamente.**

#### Hallazgo 2: Convivencia del Logotipo Horizontal en Navegación Móvil (360px–430px)
- **Problema Detectado:** El lockup horizontal (1564×180px) a 30-42px de altura requería entre 261px y 365px de ancho, ocupando hasta el 80% de una pantalla móvil de 360px y provocando saltos de línea y colisiones con el botón CTA.
- **Acción Correctiva:**
  1. En `Header.tsx`, se implementó una alternancia responsive limpia:
     - **Pantallas $\ge 640$px (Desktop/Tablet):** Se renderiza `<BrandLogo variant="horizontal" theme="dark" height={42} priority />`.
     - **Pantallas $< 640$px (Móvil Compacto):** Se renderiza el isotipo `<BrandLogo variant="mark" theme="dark" height={36} />` vinculado con tipografía institucional compacta `PROYECTOS & MONTAJES` (ancho total: ~135px).
  2. El botón CTA en móvil fue adaptado con `whitespace-nowrap`, padding ajustado (`px-12 py-6 text-12`), y texto contextual: `Cotizar` en pantallas pequeñas y `Cotizar Proyecto` en desktop.
  3. Resultado: En viewports de 360px y 390px, el header dispone de más de 120px de espacio libre central, garantizando cero colisiones y preparando el terreno para el menú hamburguesa accesible de Fase 2A.

#### Hallazgo 3: Aislamiento de Artefactos de QA Fuera del Directorio Público
- **Problema Detectado:** Tableros de inspección como `qa-logo-system-board.webp` se estaban emitiendo en `public/brand/qa-previews/`, inflando el bundle de producción de Next.js en Vercel.
- **Acción Correctiva:**
  1. Todos los artefactos de QA fueron reubicados al directorio de nivel raíz `qa-previews/`.
  2. `public/brand/qa-previews/` fue limpiado por completo.
  3. Se agregaron reglas explícitas en `.gitignore` para ignorar `qa-previews/` y cualquier subcarpeta de QA.
  4. Los scripts generadores (`generate-brand-logo-system.py`, `capture-all-pages.py`, `capture-elements.js`) fueron actualizados para apuntar exclusivamente a `qa-previews/`.

#### Hallazgo 4: Persistencia Editorial, Seeding Idempotente y Estrategia de Migración
- **Problema Detectado:** Necesidad de garantizar que caídas transitorias de base de datos no sobrescriban la configuración del administrador y que el modelo `ServiceHeroSlide` cuente con migración declarativa y rollback seguro.
- **Acción Correctiva:**
  1. **Seeding Idempotente:** `ensureDefaultSlidesSeeded` solo inserta diapositivas si `count === 0`. Si ya existen diapositivas administradas, no realiza modificaciones.
  2. **Resiliencia de Fallback:** Si PostgreSQL no responde, `getPublishedHeroSlides` devuelve una estructura en memoria (`FALLBACK_SERVICE_HEROES`) sin ejecutar escrituras en base de datos ni sobreescribir datos del usuario.
  3. **Revalidación Inmediata:** La mutación `saveAdminHeroSlides` ejecuta `revalidatePath` sobre la ruta del servicio afectado (`/servicios/[slug]`), permitiendo que los cambios se reflejen de inmediato sin necesidad de redeploy de la aplicación.
  4. **Migración SQL Declarativa:** Creada en `prisma/migrations/20261013_add_service_hero_slide/migration.sql` como operación estrictamente aditiva (`CREATE TABLE IF NOT EXISTS`).
  5. **Rollback SQL Seguro:** Documentado en `rollback.sql` (`DROP TABLE IF EXISTS "proyectos_y_montajes"."ServiceHeroSlide"`), asegurando que no afecte cotizaciones, clientes, prospectos ni proyectos comerciales.

#### Hallazgo 5: Tableros de Inspección Visual Generados
- Tablero Maestro de Identidad: `qa-previews/qa-logo-system-board.webp` (205 KB).
- Capturas de Header Responsive:
  - Móvil 360px: `qa-previews/qa-header-360px.webp`.
  - Móvil 390px: `qa-previews/qa-header-390px.webp`.
  - Tablet 768px: `qa-previews/qa-header-768px.webp`.
  - Desktop 1440px: `qa-previews/qa-header-1440px.webp`.
- Capturas de Footer Institucional:
  - Móvil 390px: `qa-previews/qa-footer-390px.webp`.
  - Desktop 1440px: `qa-previews/qa-footer-1440px.webp`.

---

### 22.3 Hoja de Ruta Integrada para Fase 2A (Estructural & Responsive)
[COMPLETADA EN FASE 2A — Ver Sección 23 a continuación]

---

## 23. Ejecución de Fase 2A — Core UX, Responsive System & Release Consolidation

### 23.1 Resumen Ejecutivo de Implementación
En estricto cumplimiento de la directiva de ejecución local de la Fase 2A, se consolidó la infraestructura visual, responsive y estructural sin destruir ni reescribir ninguno de los avances aprobados de la Fase 2B, el CMS de Heroes o el sistema de identidad.

```
FASE 2A: STATUS SUMMARY
─────────────────────────────────────────────────────────────────────────────
Wave 1 (Navegación Móvil & Drawer)    : COMPLETADO (P0) — Header.tsx + MobileNavDrawer.tsx
Wave 2 (Normalización Tokens Tailwind) : COMPLETADO (P0) — tailwind.config.js (fontSize + spacing)
Wave 3 (Transformación Hero Principal) : COMPLETADO (P1) — Hero.tsx (Next.js Image + Posicionamiento)
Wave 4 (Footer & Enrutamiento Canónico): COMPLETADO (P1) — Footer.tsx (Rutas canónicas + Cobertura)
Wave 5 (SEO Técnico & Accesibilidad)  : COMPLETADO (P1) — sitemap.ts + robots.ts + WCAG AA/AAA
Hardening & Rollback No Destructivo    : COMPLETADO — Política documentada en rollback.sql
Quality Gates (Build & Tests)         : 27/27 Rutas Compiladas | 31/31 Tests PASS | 0 Errores TS
Despliegue a Producción                : BLOQUEADO (Localmente listo; esperando autorización)
─────────────────────────────────────────────────────────────────────────────
```

---

### 23.2 Detalle por Oleada de Implementación (Waves 1–5)

#### Wave 1: Recuperación de Navegación Móvil (Header & Drawer Accesible)
- **Componentes:** [`app/components/Header.tsx`](file:///home/sebastiangarcia/planmaestro-ecosystem/packages/proyectos-y-montajes/app/components/Header.tsx) y [`app/components/MobileNavDrawer.tsx`](file:///home/sebastiangarcia/planmaestro-ecosystem/packages/proyectos-y-montajes/app/components/MobileNavDrawer.tsx).
- **Gatillo Hamburguesa:**
  - Botón accesible con `aria-expanded`, `aria-controls="mobile-navigation-drawer"` y `aria-label` dinámico.
  - Dimensiones táctiles exactas: `w-[42px] h-[42px]` con borde sutil y estado hover dorado.
- **Drawer Desplegable Accesible:**
  - **Trampa de Foco (Focus Trap):** Atrapa la navegación por tabulación dentro del drawer mientras está activo; restaura el foco al botón hamburguesa al cerrarse.
  - **Cierre por Teclado:** Event listener global para tecla `Escape`.
  - **Bloqueo de Scroll (Body Scroll Lock):** Bloquea el scroll del fondo mediante fijación posicional sin saltos de layout shift.
  - **Rutas Principales:** Enlaces a Inicio (`/`), Canchas Deportivas (`/servicios/canchas-deportivas`), Parques Infantiles (`/servicios/parques-infantiles`), Jardín & Terraza (`/servicios/paisajismo`), Portafolio de Obras (`/portafolio`) y Nosotros (`/nosotros`).
  - **Acción Rápida de Conversión:** Botón directo a `Cotizar Proyecto` (`/#simulador`).
  - **Detección de Ruta Activa:** Indicador visual dorado de página actual mediante `usePathname()`.
- **Verificación Multidispositivo:**
  - **320px:** Logotipo compacto (136px) + botón hamburguesa (42px). El CTA se traslada al interior del drawer para garantizar espacio limpio.
  - **360px:** Logotipo (136px) + botón `Cotizar` (72px) + botón hamburguesa (42px). Margen central disponible: **77.3 píxeles**.
  - **390px:** Margen central disponible: **107.3 píxeles**. Cero colisión.
  - **$\ge 640$px (Tablet/Desktop):** Logotipo horizontal completo (1564×180).
  - **$\ge 768$px (Desktop):** Barra de navegación completa visible, botón `Cotizar Proyecto`, hamburguesa oculta.

#### Wave 2: Normalización de Tokens de Tailwind
- **Archivo:** [`tailwind.config.js`](file:///home/sebastiangarcia/planmaestro-ecosystem/packages/proyectos-y-montajes/tailwind.config.js).
- **Tipografía Formalizada (`fontSize`):**
  - Se registraron formalmente todas las clases utilizadas en componentes existentes (`10`, `11`, `12`, `13`, `14`, `15`, `16`, `18`, `20`, `22`, `24`, `28`, `32`, `36`, `40`, `48`, `56`, `64`, `72`) con sus respectivos interlineados (`lineHeight`).
  - Se añadieron tokens semánticos modernos con escala responsiva `clamp()`: `display`, `heading-1`, `heading-2`, `heading-3`, `body-lg`, `body-base`, `body-sm`, `caption`.
- **Espaciado Normalizado (`spacing`):**
  - Se preservaron las definiciones numéricas en píxeles (`4: "4px"`, `8: "8px"`, etc.) para prevenir distorsión en la biblioteca de medios del admin y el CMS de Heroes.
  - Se añadieron valores faltantes de alta frecuencia (`6: "6px"`, `44: "44px"`).
  - Se introdujeron tokens semánticos: `section-gap`, `section-gap-sm`, `container-px`, `card-p`.

#### Wave 3: Transformación del Hero Principal (Homepage)
- **Componente:** [`app/components/Hero.tsx`](file:///home/sebastiangarcia/planmaestro-ecosystem/packages/proyectos-y-montajes/app/components/Hero.tsx).
- **Fotografía Real Optimizada:** Sustitución de `backgroundImage` CSS por componente `<Image fill priority sizes="100vw" quality={85} />` de Next.js, logrando cero CLS y carga inmediata del LCP.
- **Tratamiento Cromático y Contraste:** Gradiente arquitectónico oscuro (`from-brand-dark/90 via-brand-dark/75 to-brand-dark/95`) que garantiza legibilidad estricta WCAG AAA sobre la obra real.
- **Mensaje Institucional Verificado:**
  - Badge: *"Más de 20 años transformando espacios en Colombia"*.
  - H1 Canónico: *"Ingeniería Deportiva, Recreativa y Paisajismo Arquitectónico"*.
  - Descripción: Especialistas en pistas de pádel profesionales, fútbol sintético, parques infantiles y paisajismo corporativo/residencial.
  - Enrutamiento Real: Botón secundario *"Explorar Obras Reales"* apunta a la ruta canónica `/portafolio` (eliminando el ancla obsoleta `#autoridad`).

#### Wave 4: Footer Institucional & Enrutamiento Canónico
- **Componente:** [`app/components/Footer.tsx`](file:///home/sebastiangarcia/planmaestro-ecosystem/packages/proyectos-y-montajes/app/components/Footer.tsx).
- **Rutas Canónicas:** Sustitución de anclas obsoletas (`#canchas`, `#parques`, `#jardin`) por las páginas reales del portal (`/servicios/canchas-deportivas`, `/servicios/parques-infantiles`, `/servicios/paisajismo`, `/portafolio`).
- **Canales de Atención Verificados:**
  - Sede operativa: Bucaramanga, Santander, Colombia.
  - Cobertura: Proyectos a nivel nacional.
  - Enlaces funcionales: *"Cotizar Proyecto en Línea"* (`/#simulador`) y *"Acceso a Portal de Clientes"* (`/cliente`).
  - Teléfonos y correos no confirmados permanecen excluidos de publicación hasta recibir confirmación comercial oficial.
- **Responsive Stacking:** Distribución limpia en 4 columnas en desktop que colapsa a 2 columnas en tablet y 1 columna centrada en móviles.

#### Wave 5: SEO Técnico, Accesibilidad & Performance
- **Sitemap Dinámico:** Creado [`app/sitemap.ts`](file:///home/sebastiangarcia/planmaestro-ecosystem/packages/proyectos-y-montajes/app/sitemap.ts), que compila automáticamente `/sitemap.xml` con las 6 rutas públicas principales y sus respectivas frecuencias de actualización y prioridades.
- **Directivas Robots:** Creado [`app/robots.ts`](file:///home/sebastiangarcia/planmaestro-ecosystem/packages/proyectos-y-montajes/app/robots.ts), que compila automáticamente `/robots.txt` permitiendo indexación de páginas comerciales y bloqueando `/admin/`, `/api/` y `/cliente/`.
- **Estructura Semántica:** Jerarquía de encabezados respetada (`<h1>` único por página).

---

### 23.3 Estrategia de Rollback No Destructivo

En cumplimiento del requerimiento de release hardening:
1. **Rollback de Aplicación No Destructivo (Estándar):**
   - En caso de contingencia o fallo en producción, se revierte el código de la aplicación al commit previo sin tocar la base de datos.
   - El sistema conmuta automáticamente al catálogo en memoria (`FALLBACK_SERVICE_HEROES`).
   - **Preservación Total de Datos:** La tabla `"ServiceHeroSlide"` permanece intacta en PostgreSQL con todos sus registros, órdenes de diapositivas y puntos focales preservados para su reutilización.
2. **Procedimiento de Desmontaje de Emergencia (Desastre Extremo / Alto Riesgo):**
   - Documentado en [`prisma/migrations/20261013_add_service_hero_slide/rollback.sql`](file:///home/sebastiangarcia/planmaestro-ecosystem/packages/proyectos-y-montajes/prisma/migrations/20261013_add_service_hero_slide/rollback.sql) bajo advertencia estricta de que elimina de forma irrecuperable las configuraciones editoriales.

---

### 23.4 Quality Gates Consolidados de Fase 2A

| Prueba de Calidad | Herramienta / Script | Métrica / Resultado | Estado |
| :--- | :--- | :--- | :---: |
| **Tipado Estricto** | `npx tsc --noEmit` | 0 errores en 100% de archivos TypeScript | **PASS** |
| **Compilación Turbopack** | `npm run build` | 27/27 rutas compiladas (incluyendo `/robots.txt` y `/sitemap.xml`) en 5.1s | **PASS** |
| **Ciclo CMS Heroes** | `test-hero-lifecycle.ts` | 31/31 pruebas de persistencia, reordenamiento y fallbacks superadas | **PASS** |
| **Navegación Móvil** | Playwright Bounding Box | 77px libres en 360px, 107px libres en 390px, cero colisiones | **PASS** |
| **Drawer Modal** | Playwright Emulation | Escape-to-close, focus trap, body scroll lock, active route OK | **PASS** |
| **Knowledge Graph** | `npx graphify hook-rebuild` | Sincronizado | **PASS** |

---

---

## 24. Preflight de Producción, Manifiesto de Despliegue y Release Candidate Final

### 24.1 Evaluación de Dirección de Arte: Hero Principal de Inicio
Se generó un estudio fotográfico comparativo en [`qa-previews/hero-comparison/`](file:///home/sebastiangarcia/planmaestro-ecosystem/packages/proyectos-y-montajes/qa-previews/hero-comparison) evaluando tres candidatos reales disponibles en disco:

| Atributo | Opción A: Actual (`IMG_0337.JPG`) | Opción B: Recomendada (`IMG_3346.PNG`) | Opción C: Alternativa (`IMG_4527.jpg`) |
| :--- | :--- | :--- | :--- |
| **Sujeto de Obra** | Cancha de fútbol con quiosco/palapa campestre | Pistas panorámicas de Pádel profesional WPT | Complejo multideportivo institucional |
| **Autoridad Constructiva** | Recreativa / Campestre | **Máxima (Estructura metálica, vidrio, iluminación)** | Alta (Cerrajería perimetral, graderías) |
| **Alineación de Posicionamiento** | Tiende hacia descanso/turismo | **Ingeniería deportiva premium de alto valor** | Infraestructura civil institucional |
| **Composición Desktop** | Campo horizontal amplio, palapa a la derecha | Pistas gemelas en perspectiva diagonal profunda | Campo amplio con fondo arquitectónico |
| **Recorte Móvil (390px)** | Se enfoca en césped y palapa | **Enfoque en pista central y cerramiento vidriado** | Se enfoca en cerrajería y campo sintético |
| **Contraste con Titulares** | Bueno (con gradiente oscuro) | **Excelente (iluminación nocturna/estadio)** | Bueno |
| **Peso y Payload** | 1.1 MB (sin comprimir) | 1.8 MB (sin comprimir) | 9.2 MB (requiere conversión a WebP) |
| **Dictamen Antigravity** | Descartar tras aprobación | **RECOMENDADA (Flagship de Ingeniería)** | Reserva para subsección de obras |

> **Nota de Gobernanza:** En cumplimiento de la directiva, el código fuente del Hero actual no ha sido reemplazado y continúa sirviendo `IMG_0337.JPG` a la espera de la selección formal de Sebastian.

---

### 24.2 Manifiesto Canónico de Despliegue (Release Manifest)

- **Commit Base:** `8c4bf78` (main)
- **Candidato de Liberación (Release Candidate):** `RC-20261013-PHASE2A`
- **Archivos Modificados / Creados:**
  - `app/components/Header.tsx` (Navegación responsive + Drawer toggle)
  - `app/components/MobileNavDrawer.tsx` (Drawer modal accesible, focus trap, body scroll lock)
  - `app/components/Hero.tsx` (Next.js Image, gradiente de alto contraste, mensaje verificado)
  - `app/components/Footer.tsx` (Rutas canónicas, canales de atención verificados)
  - `app/sitemap.ts` (Generador dinámico de sitemap.xml)
  - `app/robots.ts` (Generador dinámico de robots.txt)
  - `tailwind.config.js` (Normalización de fontSize scale y tokens semánticos)
  - `prisma/migrations/20261013_add_service_hero_slide/` (Migración aditiva SQL y política de rollback)
  - `scripts/verify-tailwind-tokens.ts` (Script de guardia de regresión de utilidades Tailwind)
  - `scripts/generate-final-visual-acceptance-board.py` (Compilador de tablero maestro)
- **Migraciones Requeridas:**
  - `20261013_add_service_hero_slide`: Operación aditiva e idempotente (`CREATE TABLE IF NOT EXISTS "proyectos_y_montajes"."ServiceHeroSlide"`). Cero impacto en tablas comerciales.
- **Variables de Entorno de Producción Requeridas (Nombres únicamente):**
  - `DATABASE_URL` (Conexión pooled a Supabase PostgreSQL)
  - `DIRECT_URL` (Conexión directa para migraciones Prisma)
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Clave pública Clerk)
  - `CLERK_SECRET_KEY` (Clave privada Clerk)
  - `NEXT_PUBLIC_SUPABASE_URL` (Endpoint API Supabase Storage)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Clave anónima Supabase)
  - `SUPABASE_SERVICE_ROLE_KEY` (Clave administrativa para subida/borrado multimedia)

---

### 24.3 Secuencia Crítica de Promoción a Producción

Para prevenir condiciones de carrera (Race Conditions) donde Vercel compile antes de que exista la tabla en PostgreSQL:

1. **Pre-flight Local Aprobado:** Se verifican TypeScript, build de 27 rutas y 31 pruebas de CMS (superado).
2. **Aplicación Previa de Migración de Base de Datos:**
   - Ejecutar `npx prisma migrate deploy` contra la base de datos de producción **antes** de promover el frontend.
   - Confirmar en Supabase que la tabla `"proyectos_y_montajes"."ServiceHeroSlide"` existe y es accesible.
3. **Promoción de Código en Git:**
   - Commit formal de los cambios aprobados y push a `main`.
4. **Despliegue Automático en Vercel:**
   - Vercel detecta el push, ejecuta `next build` (compilando las 27 rutas estáticas y dinámicas) y promueve el despliegue a producción.
5. **Pruebas de Humo en Producción:**
   - Inspeccionar `https://www.proyectosymontajes.com`:
     - Carga de Header y apertura del drawer en móvil.
     - Carga de `/servicios/canchas-deportivas` comprobando que las 4 diapositivas del Hero provengan de la base de datos o fallback.
     - Acceso a `/admin/biblioteca-media` y verificación de autenticación Clerk.
     - Verificación de `/sitemap.xml` y `/robots.txt`.

---

### 24.4 Procedimiento de Rollback de Aplicación No Destructivo

En caso de contingencia técnica o regresión inesperada en producción:
- **Paso 1:** En el panel de Vercel (o mediante CLI), realizar *Instant Rollback* al Deployment ID previo inmediatamente anterior a este release.
- **Paso 2:** El frontend revierte al código anterior que utiliza `FALLBACK_SERVICE_HEROES` en memoria.
- **Paso 3:** **NO EJECUTAR `DROP TABLE` EN POSTGRESQL.** La tabla `"ServiceHeroSlide"` y sus registros editoriales permanecen 100% seguros e intactos en la base de datos para cuando se resuelva la incidencia.

---

### 24.5 Tablero Maestro de Aceptación Visual
El tablero consolidado de resolución de 2400×3200 píxeles se encuentra archivado en:
`qa-previews/qa-final-release-acceptance-board.webp` (Copia en directorio brain de la sesión).

---

### 24.6 Veredicto Final

| Dimensión | Evaluación | Estado |
| :--- | :--- | :---: |
| **Fase 2A (Core UX & Responsive)** | Totalmente implementada y verificada en 8 breakpoints | **APROBADA LOCALMENTE** |
| **Fase 2B (Integración de Ilustraciones)** | 17 WebP y 6 SVG distribuidos en 5 páginas sin regresiones | **APROBADA LOCALMENTE** |
| **Sistema de Identidad de Marca** | Variantes horizontal, institucional e isotipo implementadas | **LISTA / PENDIENTE APROBACIÓN VISUAL** |
| **CMS Visual de Heroes** | 31/31 pruebas superadas, resiliencia y guardias cerradas | **LISTO PARA RELEASE** |
| **Migración de Base de Datos** | Script SQL aditivo idempotente preparado | **LISTO PARA PRODUCCIÓN** |
| **Despliegue a Producción** | Sujeto a la aprobación visual humana de Sebastian | **GO CONDICIONADO / BLOQUEADO LOCALMENTE** |





