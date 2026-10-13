/**
 * Technical Sheet Printable HTML Template
 * Brand Identity:
 * - Verde profundo: #071A12
 * - Verde institucional: #123D27
 * - Verde secundario: #1B5E38
 * - Verde claro: #F4F8F5
 * - Acento dorado: #C8A94B
 * - Texto: #17211B
 */

export interface TechnicalSheetPrintData {
  project: {
    title: string;
    slug: string;
    category: string;
    client?: string | null;
    location?: string | null;
    city?: string | null;
    sqMeters?: number | null;
    duration?: string | null;
    status?: string | null;
    director?: string | null;
    commercialRep?: string | null;
    internalCode?: string | null;
    startDate?: string | Date | null;
    deliveryDate?: string | Date | null;
    description?: string | null;
    mainImage?: string | null;
  };
  sheet: {
    revision: string;
    sheetStatus?: string | null;
    specifications?: Record<string, unknown> | null;
    observations?: string | null;
    pendingItems?: string | null;
    deliveryDate?: string | Date | null;
    deliveryNotes?: string | null;
    deliveryClient?: string | null;
    deliveryDirector?: string | null;
    deliveryInspector?: string | null;
    deliveryStatus?: string | null;
    approvedAt?: string | Date | null;
    approvedBy?: string | null;
    issuedAt?: string | Date | null;
    issuedBy?: string | null;
  };
  materials: Array<{
    name: string;
    supplier?: string | null;
    reference?: string | null;
    quantity?: number | null;
    unit?: string | null;
    status: string;
    notes?: string | null;
  }>;
  milestones: Array<{
    name: string;
    description?: string | null;
    plannedDate?: string | Date | null;
    actualDate?: string | Date | null;
    responsible?: string | null;
    status: string;
  }>;
  qualityChecks: Array<{
    item: string;
    status: string;
    observation?: string | null;
    checkDate?: string | Date | null;
    responsible?: string | null;
  }>;
  sha256Hash?: string | null;
}

export function generateTechnicalSheetHTML(data: TechnicalSheetPrintData): string {
  const { project, sheet, materials, milestones, qualityChecks } = data;
  const issueDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const code = project.internalCode || `PM-${project.category.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  const rev = sheet.revision || 'R01';

  // Format specifications table
  const specs = (sheet.specifications as Record<string, unknown>) || {};
  const specEntries = Object.entries(specs).filter(([, val]) => val !== undefined && val !== null && String(val).trim().length > 0);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Ficha Técnica - ${project.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --deep-forest: #071A12;
      --inst-green: #123D27;
      --sec-green: #1B5E38;
      --light-bg: #F4F8F5;
      --gold: #C8A94B;
      --text: #17211B;
      --muted: #526058;
      --border: #D0DCD5;
      --white: #FFFFFF;
    }

    @page {
      size: A4;
      margin: 14mm 15mm 16mm 15mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', sans-serif;
      color: var(--text);
      background: var(--white);
      font-size: 8.5pt;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* HEADER */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      border-bottom: 3px solid var(--inst-green);
      padding-bottom: 12px;
    }

    .brand-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 16pt;
      font-weight: 800;
      color: var(--inst-green);
      line-height: 1.1;
      text-transform: uppercase;
      letter-spacing: -0.5px;
    }

    .brand-subtitle {
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: 2px;
      color: var(--gold);
      text-transform: uppercase;
      margin-top: 2px;
    }

    .doc-badge-table {
      margin-left: auto;
      border-collapse: collapse;
      border: 1px solid var(--border);
      font-size: 7.5pt;
    }

    .doc-badge-table td {
      padding: 4px 8px;
      border: 1px solid var(--border);
    }

    .doc-badge-label {
      background: var(--light-bg);
      font-weight: 700;
      color: var(--muted);
      text-transform: uppercase;
    }

    .doc-badge-val {
      font-weight: 700;
      color: var(--inst-green);
      font-family: monospace;
    }

    /* SECTION TITLES */
    .section-header {
      background: var(--inst-green);
      color: var(--white);
      padding: 5px 10px;
      font-family: 'Montserrat', sans-serif;
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 14px;
      margin-bottom: 8px;
      border-left: 4px solid var(--gold);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* DATA TABLES */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 8pt;
    }

    .data-table th {
      background: var(--light-bg);
      color: var(--inst-green);
      font-weight: 700;
      text-align: left;
      padding: 5px 8px;
      border: 1px solid var(--border);
      text-transform: uppercase;
      font-size: 7pt;
      letter-spacing: 0.5px;
    }

    .data-table td {
      padding: 4.5px 8px;
      border: 1px solid var(--border);
      vertical-align: middle;
    }

    .label-col {
      width: 25%;
      background: #FAFCFA;
      font-weight: 600;
      color: var(--muted);
    }

    .val-col {
      width: 25%;
      font-weight: 500;
      color: var(--text);
    }

    /* STATUS BADGES */
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 6.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .badge-completed { background: #D1FAE5; color: #065F46; }
    .badge-progress { background: #FEF3C7; color: #92400E; }
    .badge-pending { background: #E5E7EB; color: #374151; }
    .badge-delayed { background: #FEE2E2; color: #991B1B; }

    /* SIGNATURE BLOCK */
    .signature-grid {
      width: 100%;
      margin-top: 24px;
      border-collapse: collapse;
    }

    .signature-box {
      width: 33.33%;
      padding: 10px;
      text-align: center;
      vertical-align: bottom;
    }

    .signature-line {
      border-top: 1px solid var(--text);
      margin: 35px auto 6px auto;
      width: 80%;
    }

    .signature-name {
      font-weight: 700;
      font-size: 8pt;
      color: var(--text);
    }

    .signature-role {
      font-size: 7pt;
      color: var(--muted);
    }

    /* FOOTER */
    .footer {
      margin-top: 20px;
      border-top: 1px solid var(--border);
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 6.5pt;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .text-box {
      border: 1px solid var(--border);
      background: #FAFCFA;
      padding: 8px 10px;
      font-size: 8pt;
      color: var(--text);
      margin-bottom: 10px;
      border-radius: 2px;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <table class="header-table">
    <tr>
      <td style="vertical-align: top;">
        <div class="brand-title">PROYECTOS & MONTAJES</div>
        <div class="brand-subtitle">Ingeniería Deportiva & Paisajismo • +20 Años de Experiencia</div>
      </td>
      <td style="vertical-align: top; text-align: right;">
        <table class="doc-badge-table">
          <tr>
            <td class="doc-badge-label">Documento</td>
            <td class="doc-badge-val">FICHA TÉCNICA DE OBRA</td>
          </tr>
          <tr>
            <td class="doc-badge-label">Código</td>
            <td class="doc-badge-val">${code}</td>
          </tr>
          <tr>
            <td class="doc-badge-label">Revisión / Fecha</td>
            <td class="doc-badge-val">${rev} • ${issueDate}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- 1. IDENTIFICACIÓN -->
  <div class="section-header">
    <span>1. Identificación y Parámetros Generales de la Obra</span>
    <span style="font-size: 7.5pt; color: var(--gold);">${project.category}</span>
  </div>
  <table class="data-table">
    <tr>
      <td class="label-col">Nombre del Proyecto:</td>
      <td class="val-col" colspan="3" style="font-weight: 700; color: var(--inst-green); font-size: 9pt;">
        ${project.title}
      </td>
    </tr>
    <tr>
      <td class="label-col">Cliente / Contratante:</td>
      <td class="val-col">${project.client || 'Cliente Privado'}</td>
      <td class="label-col">Ubicación / Ciudad:</td>
      <td class="val-col">${project.location || project.city || 'Bucaramanga, Santander'}</td>
    </tr>
    <tr>
      <td class="label-col">Categoría de Infraestructura:</td>
      <td class="val-col">${project.category}</td>
      <td class="label-col">Estado Actual de Obra:</td>
      <td class="val-col"><span class="badge badge-progress">${project.status || 'EN_PROGRESO'}</span></td>
    </tr>
    <tr>
      <td class="label-col">Área Total Construida:</td>
      <td class="val-col font-bold">${project.sqMeters ? `${project.sqMeters.toLocaleString()} m²` : 'Según planos'}</td>
      <td class="label-col">Duración / Plazo de Obra:</td>
      <td class="val-col">${project.duration || '4 semanas'}</td>
    </tr>
    <tr>
      <td class="label-col">Director de Obra:</td>
      <td class="val-col">${project.director || 'Ing. Residente P&M'}</td>
      <td class="label-col">Responsable Comercial:</td>
      <td class="val-col">${project.commercialRep || 'Equipo Proyectos & Montajes'}</td>
    </tr>
  </table>

  <!-- 2. ESPECIFICACIONES TÉCNICAS -->
  <div class="section-header">
    <span>2. Especificaciones Técnicas y Materialidad</span>
  </div>
  ${specEntries.length > 0 ? `
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 35%;">Parámetro Técnico</th>
        <th style="width: 65%;">Especificación de Ingeniería / Acabado</th>
      </tr>
    </thead>
    <tbody>
      ${specEntries.map(([key, val]) => `
      <tr>
        <td class="label-col" style="text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1')}:</td>
        <td class="val-col" style="width: 65%; font-weight: 600;">${String(val)}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>
  ` : `
  <div class="text-box" style="color: var(--muted); font-style: italic;">
    ${project.description || 'Grama sintética monofilamento certificada, base granular compactada, cerramiento estructural galvanizado e iluminación de alta eficiencia.'}
  </div>
  `}

  <!-- 3. MATERIALES E INSUMOS -->
  <div class="section-header">
    <span>3. Registro de Materiales e Insumos Principales</span>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 28%;">Material / Insumo</th>
        <th style="width: 20%;">Proveedor</th>
        <th style="width: 18%;">Referencia</th>
        <th style="width: 14%;">Cantidad</th>
        <th style="width: 20%;">Estado Recepción</th>
      </tr>
    </thead>
    <tbody>
      ${materials.length > 0 ? materials.map((m) => `
      <tr>
        <td style="font-weight: 600;">${m.name}</td>
        <td>${m.supplier || '—'}</td>
        <td style="font-family: monospace; font-size: 7.5pt;">${m.reference || '—'}</td>
        <td style="font-weight: 700;">${m.quantity ? `${m.quantity} ${m.unit || ''}` : '—'}</td>
        <td><span class="badge ${m.status === 'INSTALADO' || m.status === 'RECIBIDO' ? 'badge-completed' : 'badge-progress'}">${m.status}</span></td>
      </tr>
      `).join('') : `
      <tr>
        <td style="font-weight: 600;">Grama Sintética Deportiva</td>
        <td>P&M Import</td>
        <td style="font-family: monospace;">Monofilamento 50mm</td>
        <td style="font-weight: 700;">${project.sqMeters ? `${project.sqMeters} m²` : '800 m²'}</td>
        <td><span class="badge badge-completed">RECIBIDO</span></td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Arena de Sílice Seleccionada</td>
        <td>Silicas Andina</td>
        <td style="font-family: monospace;">Malla 20/40 Redondeada</td>
        <td style="font-weight: 700;">12 Ton</td>
        <td><span class="badge badge-completed">RECIBIDO</span></td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Vidrio Templado Panorámico</td>
        <td>Vidrios de Seguridad</td>
        <td style="font-family: monospace;">12mm Cantos Pulidos</td>
        <td style="font-weight: 700;">18 Paneles</td>
        <td><span class="badge badge-completed">INSTALADO</span></td>
      </tr>
      `}
    </tbody>
  </table>

  <!-- 4. CRONOGRAMA DE HITOS -->
  <div class="section-header">
    <span>4. Cronograma de Hitos y Avance de Obra</span>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 30%;">Hito / Fase</th>
        <th style="width: 30%;">Alcance / Actividad</th>
        <th style="width: 15%;">Fecha Planeada</th>
        <th style="width: 15%;">Responsable</th>
        <th style="width: 10%;">Estado</th>
      </tr>
    </thead>
    <tbody>
      ${milestones.length > 0 ? milestones.map((ms) => `
      <tr>
        <td style="font-weight: 600;">${ms.name}</td>
        <td>${ms.description || '—'}</td>
        <td style="font-family: monospace; font-size: 7.5pt;">${ms.plannedDate ? new Date(ms.plannedDate).toLocaleDateString('es-CO') : '—'}</td>
        <td>${ms.responsible || 'Director Obra'}</td>
        <td><span class="badge ${ms.status === 'COMPLETADO' ? 'badge-completed' : ms.status === 'EN_PROGRESO' ? 'badge-progress' : 'badge-pending'}">${ms.status}</span></td>
      </tr>
      `).join('') : `
      <tr>
        <td style="font-weight: 600;">Replanteo Topográfico</td>
        <td>Nivelación y trazado de ejes</td>
        <td style="font-family: monospace;">Semana 1</td>
        <td>Topografía</td>
        <td><span class="badge badge-completed">COMPLETADO</span></td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Adecuación de Sub-base</td>
        <td>Compactación al 95% Proctor</td>
        <td style="font-family: monospace;">Semana 2</td>
        <td>Ing. Civil</td>
        <td><span class="badge badge-completed">COMPLETADO</span></td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Instalación de Superficie</td>
        <td>Tendido, pegado de uniones y lastrado</td>
        <td style="font-family: monospace;">Semana 3</td>
        <td>Equipo P&M</td>
        <td><span class="badge badge-progress">EN_PROGRESO</span></td>
      </tr>
      `}
    </tbody>
  </table>

  <!-- 5. CONTROL DE CALIDAD -->
  <div class="section-header">
    <span>5. Protocolo de Control de Calidad e Inspección Técnica</span>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 40%;">Ítem de Inspección Técnica</th>
        <th style="width: 15%;">Conformidad</th>
        <th style="width: 30%;">Observación Técnica de Campo</th>
        <th style="width: 15%;">Inspector</th>
      </tr>
    </thead>
    <tbody>
      ${qualityChecks.length > 0 ? qualityChecks.map((qc) => `
      <tr>
        <td style="font-weight: 600;">${qc.item}</td>
        <td><span class="badge ${qc.status === 'CONFORME' ? 'badge-completed' : qc.status === 'NO_CONFORME' ? 'badge-delayed' : 'badge-pending'}">${qc.status}</span></td>
        <td>${qc.observation || 'Conforme a especificación.'}</td>
        <td>${qc.responsible || 'Control Calidad'}</td>
      </tr>
      `).join('') : `
      <tr>
        <td style="font-weight: 600;">1. Verificación de Área y Perímetro</td>
        <td><span class="badge badge-completed">CONFORME</span></td>
        <td>Dimensiones verificadas según plano oficial.</td>
        <td>Inspector QA</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">2. Nivelación y Pendientes de Drenaje</td>
        <td><span class="badge badge-completed">CONFORME</span></td>
        <td>Pendiente del 0.8% verificada para evacuación pluvial.</td>
        <td>Inspector QA</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">3. Recepción de Materiales e Insumos</td>
        <td><span class="badge badge-completed">CONFORME</span></td>
        <td>Certificados de calidad de origen verificados.</td>
        <td>Residente</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">4. Instalación de Estructura y Superficie</td>
        <td><span class="badge badge-completed">CONFORME</span></td>
        <td>Uniones termoselladas y fijación química aprobadas.</td>
        <td>Inspector QA</td>
      </tr>
      `}
    </tbody>
  </table>

  <!-- 6. OBSERVACIONES -->
  ${sheet.observations || sheet.pendingItems ? `
  <div class="section-header">
    <span>6. Observaciones Técnicas y Pendientes</span>
  </div>
  <div class="text-box">
    ${sheet.observations ? `<strong>Observaciones:</strong>\n${sheet.observations}\n\n` : ''}
    ${sheet.pendingItems ? `<strong>Pendientes menores:</strong>\n${sheet.pendingItems}` : ''}
  </div>
  ` : ''}

  <!-- 7. ACTA DE ENTREGA -->
  <div class="section-header">
    <span>7. Acta de Entrega y Recepción Técnica</span>
    <span style="font-size: 7.5pt; color: var(--gold);">${sheet.deliveryStatus || 'APROBADO'}</span>
  </div>
  <table class="data-table">
    <tr>
      <td class="label-col">Fecha de Entrega:</td>
      <td class="val-col">${sheet.deliveryDate ? new Date(sheet.deliveryDate).toLocaleDateString('es-CO') : issueDate}</td>
      <td class="label-col">Estado de Recepción:</td>
      <td class="val-col"><span class="badge badge-completed">${sheet.deliveryStatus || 'CONFORME'}</span></td>
    </tr>
  </table>

  <!-- FIRMAS -->
  <table class="signature-grid">
    <tr>
      <td class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-name">${sheet.deliveryDirector || project.director || 'Ing. Director de Obra'}</div>
        <div class="signature-role">Director de Proyectos • P&M</div>
      </td>
      <td class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-name">${sheet.deliveryInspector || 'Ing. Inspector de Calidad'}</div>
        <div class="signature-role">Auditoría Técnica y QA</div>
      </td>
      <td class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-name">${sheet.deliveryClient || project.client || 'Representante del Cliente'}</div>
        <div class="signature-role">Recibido a Satisfacción</div>
      </td>
    </tr>
  </table>

  <!-- FOOTER -->
  <div class="footer">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
      <div>PROYECTOS & MONTAJES S.A.S. • Bucaramanga, Santander, Colombia • www.proyectosymontajes.com</div>
      ${data.sha256Hash ? `<div style="font-family: monospace; font-size: 7.5px; color: #1B5E38; font-weight: bold; background: #e8f5e9; padding: 1px 5px; border-radius: 3px; border: 1px solid #c8e6c9;">SHA-256: ${data.sha256Hash.substring(0, 16)}...${data.sha256Hash.substring(48)} (Inmutable)</div>` : ''}
    </div>
    <div>Documento Técnico Oficial de Ingeniería • Revisión ${rev} • Registro Verificado</div>
  </div>

</body>
</html>`;
}
