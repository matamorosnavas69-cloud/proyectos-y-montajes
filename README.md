# 🏗️ Proyectos y Montajes - B2B/B2C Enterprise Platform

## 📌 Visión General
Esta plataforma es una aplicación web progresiva y modular diseñada para servir como un **Motor de Generación de Leads** para la venta e instalación de grama sintética, parques infantiles y arquitectura de paisajismo. 

Construida sobre la vanguardia de Next.js (App Router), la aplicación combina SEO técnico de nivel enterprise, un CMS propietario (construido sobre Supabase y Prisma) para administrar proyectos, y un CRM unificado para procesar las solicitudes de cotización.

---

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript estricto
- **Estilos:** TailwindCSS v3
- **Base de Datos / CMS:** PostgreSQL (vía Supabase) gestionado por **Prisma ORM**
- **Autenticación (Admin):** Clerk
- **Almacenamiento de Imágenes:** Supabase Storage Buckets
- **Despliegue Recomendado:** Vercel

---

## 📂 Arquitectura de Módulos (app/)

### 1. Páginas de Aterrizaje (Service Silos)
- `/servicios/canchas-deportivas`: Enfocado en B2B deportivo, Pádel, y Fútbol.
- `/servicios/parques-infantiles`: Enfocado en normas de seguridad y copropiedades.
- `/servicios/paisajismo`: Enfocado en grama decorativa residencial.

### 2. Ecosistema de Portafolio Dinámico (`/portafolio`)
Un ecosistema que consume datos desde la base de datos PostgreSQL usando Prisma Client:
- **Ruta Base (`/portafolio`):** Trae todos los proyectos publicados (`prisma.project.findMany`).
- **Ruta Dinámica (`/portafolio/[slug]`):** Recibe el slug del proyecto para hidratar la vista detallada (`prisma.project.findUnique`).

### 3. Autenticación y Panel de Administración (`/admin` - Próximamente)
Todo el ecosistema administrativo se construirá internamente sin depender de CMS de terceros. Estará protegido por **Clerk Middleware**.

---

## 🧩 Arquitectura de Componentes (`/app/components/`)

- **`QuoteSimulator.tsx` (El Cotizador Interactivo):**
  Es el núcleo de conversión de la página. Un componente React con estado (`useState`) que guía al usuario por 5 pasos para generar un estimado.
  
- **`JsonLd.tsx`:**
  Inyecta la data estructurada (Schema.org) `LocalBusiness` en el DOM para SEO.

---

## 🌐 Endpoints y Flujos de Datos (Data Flow)

### Ingesta de Leads (Frontend -> CRM)
El `<QuoteSimulator />` envía un Webhook JSON a la plataforma administrativa centralizada (Ramírez Legal CRM).
**Endpoint de Destino:** `POST {NEXT_PUBLIC_CRM_API_URL}/api/leads`

### Modelado de Datos (Prisma)
El modelo principal se encuentra en `prisma/schema.prisma`:
```prisma
model Project {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  category    String
  client      String?
  mainImage   String?
  gallery     String[]
  sqMeters    Int?
  duration    String?
  description String?  @db.Text
  ...
}
```

---

## ⚙️ Variables de Entorno (Environment)

Para que el proyecto funcione en local o en Vercel, debe existir el archivo `.env.local` con las siguientes llaves:

```env
# Conexión directa a PostgreSQL (Supabase)
DATABASE_URL="postgres://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Autenticación Clerk (Para el panel de Admin)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# URL del CRM de destino
NEXT_PUBLIC_CRM_API_URL=https://tu-crm-url-en-vercel.com
```

---

## 🚀 Despliegue (Deployment)

El proyecto está optimizado para Vercel. Asegúrate de inyectar las llaves de Clerk y la cadena de conexión de Prisma `DATABASE_URL` en las variables de entorno de Vercel antes del despliegue.
