
export interface GISLocation {
  id: string;
  name: string;
  category: 'tourism' | 'industry' | 'agriculture' | 'infrastructure' | 'heritage' | 'risk';
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  link?: string;
}

export enum BatangasZone {
  CENTRAL = 'Central Batangas',
  COASTAL = 'Coastal/Western',
  EASTERN = 'Eastern/Lakeside',
  INDUSTRIAL = 'Industrial Corridors'
}

// Fixed missing AIResponse export used by GeminiGISService
export interface AIResponse {
  text: string;
  groundingLinks: any[];
}

// Batangas risk monitoring data
export type RiskLevel = 'Low' | 'Moderate' | 'High';

export interface MunicipalityRisk {
  Municipality: string;
  lat: number;
  lng: number;
  Volcano_Risk: RiskLevel;
  Seismic_Landslide_Risk: RiskLevel;
  Rain_Landslide_Risk: RiskLevel;
  Liquefaction_Risk: RiskLevel;
  Storm_Surge_Risk: RiskLevel;
  Tsunami_Risk: RiskLevel;
}

/** Maps sidebar hazard layer id → risk data column name */
export const HAZARD_LAYER_TO_COLUMN: Record<string, keyof Omit<MunicipalityRisk, 'Municipality' | 'lat' | 'lng'>> = {
  'risk-volcano': 'Volcano_Risk',
  'risk-eq-landslide': 'Seismic_Landslide_Risk',
  'risk-rain-landslide': 'Rain_Landslide_Risk',
  'risk-liquefaction': 'Liquefaction_Risk',
  'risk-storm-surge': 'Storm_Surge_Risk',
  'risk-tsunami': 'Tsunami_Risk',
};

export const HAZARD_LAYER_IDS = Object.keys(HAZARD_LAYER_TO_COLUMN) as (keyof typeof HAZARD_LAYER_TO_COLUMN)[];
