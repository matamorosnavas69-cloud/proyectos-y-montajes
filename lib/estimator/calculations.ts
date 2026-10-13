/**
 * P&M Smart Quotation Engine & Cost Estimator
 * Separates Internal Economics (materials, labor, logistics, overhead, margin)
 * from Official Client Proposal Presentation.
 */

export interface EstimatorCategoryParams {
  category: 'Pistas de Pádel' | 'Canchas Sintéticas' | 'Parques Infantiles' | 'Grama Sintética & Paisajismo' | 'Jardines & Terrazas';
  // Padel parameters
  padelCourtsCount?: number;
  padelCourtType?: 'PANORAMICA' | 'ESTANDAR' | 'CUBIERTA';
  padelGlass?: '10mm' | '12mm';
  padelTurf?: 'MONDO_TEXTURIZADO' | 'MONOFILAMENTO_12MM';
  padelLighting?: 'LED_8_FOCOS' | 'LED_4_FOCOS';
  padelSlab?: 'LOSA_H25' | 'EXISTENTE';

  // Soccer parameters
  soccerFormat?: 'FUTBOL_5' | 'FUTBOL_7' | 'FUTBOL_8' | 'FUTBOL_11' | 'PERSONALIZADO';
  soccerCustomSqMeters?: number;
  soccerTurfHeight?: '40mm' | '50mm' | '60mm';
  soccerSubbase?: 'GRANULAR_COMPACTADO' | 'ASFALTO' | 'CONCRETO';
  soccerNetting?: boolean;
  soccerLightingTowers?: number;

  // Playground parameters
  playgroundArea?: number;
  playgroundFlooring?: 'EPDM_CONTINUO' | 'LOSETA_CAUCHO' | 'GRAMA_SINTETICA';
  playgroundModule?: 'COMPLEJO_TORRES' | 'COLUMPIOS_RESORTES' | 'INTEGRAL';
  playgroundFence?: boolean;

  // Landscaping parameters
  landscapingArea?: number;
  landscapingTurf?: 'PAISAJISMO_PREMIUM_40MM' | 'RESIDENCIAL_35MM' | 'DECORATIVA_30MM';
  landscapingSoilPrep?: boolean;
  landscapingDrainage?: boolean;
  landscapingEdgingMeters?: number;

  // Garden & Terrace parameters
  terraceArea?: number;
  terraceDeck?: 'WPC_COMPUESTO' | 'MADERA_TEKA' | 'SIN_DECK';
  terraceIrrigation?: boolean;
  terraceLighting?: boolean;
  terracePlantersCount?: number;

  // Global modifiers
  marginPercentage?: number; // e.g. 28.0 (%)
}

export interface EstimationResult {
  category: string;
  scopeSummary: string;
  deliverables: string[];
  estimatedDays: number;
  warrantyMonths: number;

  // Confidential Internal Economics
  materialsCost: number;
  laborCost: number;
  transportCost: number;
  overheadCost: number;
  contingencyCost: number;
  directCost: number;
  totalInternalCost: number;
  targetMarginPercentage: number;
  marginAmount: number;

  // Official Client Price
  totalPrice: number;
  paymentTerms: string;
}

export function calculateQuotation(params: EstimatorCategoryParams): EstimationResult {
  const margin = typeof params.marginPercentage === 'number' ? params.marginPercentage : 28.0;
  const targetMarginDecimal = Math.min(Math.max(margin, 10), 60) / 100;

  let materials = 0;
  let labor = 0;
  let transport = 0;
  let estimatedDays = 30;
  let warrantyMonths = 24;
  let scope = '';
  const deliverables: string[] = [];

  switch (params.category) {
    case 'Pistas de Pádel': {
      const courts = params.padelCourtsCount || 1;
      const isPanoramic = params.padelCourtType === 'PANORAMICA';
      const is12mm = params.padelGlass === '12mm';
      const isMondo = params.padelTurf === 'MONDO_TEXTURIZADO';
      const needsSlab = params.padelSlab === 'LOSA_H25';

      // Base court structure & glass per court
      const baseStructurePerCourt = isPanoramic ? 58000000 : 46000000;
      const glassCostPerCourt = is12mm ? 22000000 : 16000000;
      const turfCostPerCourt = isMondo ? 18000000 : 13000000;
      const lightingPerCourt = params.padelLighting === 'LED_8_FOCOS' ? 8500000 : 5000000;
      const slabCostPerCourt = needsSlab ? 32000000 : 0;

      materials = (baseStructurePerCourt + glassCostPerCourt + turfCostPerCourt + lightingPerCourt + slabCostPerCourt) * courts;
      labor = (needsSlab ? 18000000 : 9000000) * courts;
      transport = 4500000 * courts;
      estimatedDays = (needsSlab ? 45 : 20) + (courts - 1) * 10;
      warrantyMonths = 36;

      scope = `Construcción integral de ${courts} pista(s) de pádel modelo ${isPanoramic ? 'Panorámica de Visión Total' : 'Estándar Oficial'} con cristalería templada de ${params.padelGlass || '12mm'}, césped sintético ${isMondo ? 'Texturizado Monofilamento FIP' : 'Monofilamento 12mm'} y sistema lumínico LED.`;
      deliverables.push(
        `${courts} Estructura(s) metálica(s) con tratamiento electrogalvanizado anticorrosión`,
        `Paneles de cristal templado homologados con cantos biselados`,
        `Césped sintético especializado para pádel con arena de sílice redondeada clasificada`,
        `Sistema de iluminación LED de alta eficiencia lumínica (>500 lux)`,
        `Red de pádel reglamentaria con tensor interno y faja central`,
        needsSlab ? 'Losa de hormigón pulido H25 con pendientes de drenaje reglamentarias' : 'Adecuación sobre superficie existente'
      );
      break;
    }

    case 'Canchas Sintéticas': {
      let area = 800; // Futbol 5 default
      if (params.soccerFormat === 'FUTBOL_7') area = 1800;
      else if (params.soccerFormat === 'FUTBOL_8') area = 2400;
      else if (params.soccerFormat === 'FUTBOL_11') area = 6000;
      else if (params.soccerFormat === 'PERSONALIZADO' && params.soccerCustomSqMeters) {
        area = params.soccerCustomSqMeters;
      }

      const turfRatePerSqM = params.soccerTurfHeight === '60mm' ? 48000 : params.soccerTurfHeight === '50mm' ? 42000 : 36000;
      const subbaseRatePerSqM = params.soccerSubbase === 'ASFALTO' ? 55000 : params.soccerSubbase === 'CONCRETO' ? 65000 : 38000;
      const nettingCost = params.soccerNetting ? area * 12000 : 0;
      const towersCost = (params.soccerLightingTowers || 4) * 4500000;

      materials = (turfRatePerSqM + subbaseRatePerSqM) * area + nettingCost + towersCost + 6000000; // 6M porterias
      labor = area * 18000;
      transport = Math.max(3000000, Math.round(area * 3500));
      estimatedDays = Math.max(25, Math.round(area / 60));
      warrantyMonths = 24;

      scope = `Adecuación y construcción de campo de fútbol sintético (${area.toLocaleString()} m²) con césped deportivo de ${params.soccerTurfHeight || '50mm'}, subbase certificada con geotextil y cerramiento perimetral de contención.`;
      deliverables.push(
        `Suministro e instalación de ${area.toLocaleString()} m² de grama sintética deportiva fibrilada/monofilamento`,
        `Relleno técnico de arena de sílice y caucho granulado criogénico SBR`,
        `Líneas de juego reglamentarias termofijadas en color blanco`,
        `Par de arquerías reglamentarias en tubo galvanizado con redes de alta tenacidad`,
        params.soccerNetting ? 'Cerramiento perimetral con malla de polietileno de alta densidad (protección perimetral)' : 'Sin cerramiento adicional',
        `Subbase granular compactada con pendientes de escorrentía perimetral`
      );
      break;
    }

    case 'Parques Infantiles': {
      const area = params.playgroundArea || 150;
      const flooringRate = params.playgroundFlooring === 'EPDM_CONTINUO' ? 140000 : params.playgroundFlooring === 'LOSETA_CAUCHO' ? 95000 : 55000;
      const moduleCost = params.playgroundModule === 'INTEGRAL' ? 45000000 : params.playgroundModule === 'COMPLEJO_TORRES' ? 32000000 : 18000000;
      const fenceCost = params.playgroundFence ? 8500000 : 0;

      materials = flooringRate * area + moduleCost + fenceCost;
      labor = area * 25000 + 4000000;
      transport = 2800000;
      estimatedDays = 20;
      warrantyMonths = 24;

      scope = `Diseño, suministro e instalación de área recreativa infantil de ${area} m² con superficie amortiguante de seguridad, módulos multijuegos y anclajes estructurales con certificación antivandálica.`;
      deliverables.push(
        `Suministro e instalación de ${area} m² de piso de seguridad amortiguante`,
        `Módulo principal multijuegos con toboganes, trepadores y pasarelas antideslizantes`,
        `Juegos complementarios (columpios con asientos ergonómicos de seguridad y resortes temáticos)`,
        `Anclajes químicos y zapatas de concreto para máxima solidez estructural`,
        params.playgroundFence ? 'Cerramiento perimetral decorativo de seguridad para control de acceso infantil' : 'Área abierta'
      );
      break;
    }

    case 'Grama Sintética & Paisajismo': {
      const area = params.landscapingArea || 100;
      const turfRate = params.landscapingTurf === 'PAISAJISMO_PREMIUM_40MM' ? 48000 : params.landscapingTurf === 'RESIDENCIAL_35MM' ? 38000 : 30000;
      const soilPrep = params.landscapingSoilPrep ? area * 18000 : 0;
      const drainage = params.landscapingDrainage ? area * 14000 : 0;
      const edging = (params.landscapingEdgingMeters || 20) * 35000;

      materials = (turfRate * area) + soilPrep + drainage + edging;
      labor = area * 16000;
      transport = 1800000;
      estimatedDays = 12;
      warrantyMonths = 36;

      scope = `Transformación paisajística de ${area} m² con césped sintético decorativo de alta memoria, nivelación topográfica, geomalla geotextil antihierbas y bordillos de confinamiento.`;
      deliverables.push(
        `${area} m² de césped sintético de paisajismo con tecnología UV y recuperación vertical`,
        `Geotextil antihierbas de alta densidad permeable al agua`,
        params.landscapingSoilPrep ? 'Remoción de capa vegetal existente y nivelación de terreno con recebo compactado' : 'Instalación sobre superficie nivelada',
        params.landscapingDrainage ? 'Drenaje subterráneo tipo espina de pescado con tubería perforada corrugada' : 'Drenaje superficial por pendiente natural',
        `Fijación perimetral y uniones con cinta vulcanizada de poliuretano bicomponente`
      );
      break;
    }

    case 'Jardines & Terrazas': {
      const area = params.terraceArea || 60;
      const deckRate = params.terraceDeck === 'WPC_COMPUESTO' ? 165000 : params.terraceDeck === 'MADERA_TEKA' ? 220000 : 0;
      const irrigationCost = params.terraceIrrigation ? 6500000 : 0;
      const lightingCost = params.terraceLighting ? 4800000 : 0;
      const plantersCost = (params.terracePlantersCount || 4) * 850000;

      materials = deckRate * area + irrigationCost + lightingCost + plantersCost + (area * 35000); // plantas e insumos
      labor = area * 35000 + 3000000;
      transport = 2000000;
      estimatedDays = 15;
      warrantyMonths = 12;

      scope = `Adecuación de terraza y jardín de ${area} m² con zona de estar en deck exterior, jardinería de especies perennes de bajo consumo hídrico e iluminación cálida decorativa.`;
      deliverables.push(
        params.terraceDeck !== 'SIN_DECK' ? `Instalación de deck exterior con estructura de soporte en perfiles nivelados` : 'Tratamiento de piso existente',
        `Diseño e implantación vegetal con tierra enriquecida y sustrato drenante`,
        params.terraceIrrigation ? 'Sistema de riego automático programable por goteo con electroválvulas' : 'Riego manual',
        params.terraceLighting ? 'Iluminación ambiental LED IP65 para exteriores en senderos y vegetación' : 'Sin iluminación adicional',
        `Garantía de supervivencia vegetal e instalación estructural`
      );
      break;
    }
  }

  // Cost Aggregates
  const directCost = materials + labor + transport;
  const overheadCost = Math.round(directCost * 0.08); // 8% Overhead
  const contingencyCost = Math.round(directCost * 0.05); // 5% Contingency
  const totalInternalCost = directCost + overheadCost + contingencyCost;

  // Client Price Computation
  const totalPrice = Math.round(totalInternalCost / (1 - targetMarginDecimal));
  const marginAmount = totalPrice - totalInternalCost;

  const paymentTerms = '50% de anticipo al firmar contrato para reserva y orden de materiales; 30% al completar el 50% de la ejecución física; 20% contra entrega final y firma del acta de recibo a satisfacción.';

  return {
    category: params.category,
    scopeSummary: scope,
    deliverables,
    estimatedDays,
    warrantyMonths,
    materialsCost: Math.round(materials),
    laborCost: Math.round(labor),
    transportCost: Math.round(transport),
    overheadCost,
    contingencyCost,
    directCost,
    totalInternalCost,
    targetMarginPercentage: margin,
    marginAmount,
    totalPrice,
    paymentTerms,
  };
}
