/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ClientRule {
  id: string;
  keyword: string;
  standardClient: string;
  targetROAS: number;
}

export interface PlatformRule {
  id: string;
  rawPlatform: string;
  standardPlatform: string;
}

export interface RawRow {
  id: string;
  date: string;
  accountId: string;
  source: string;
  campaignName: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface StandardRow {
  id: string;
  date: string;
  standardClient: string;
  standardPlatform: string;
  campaignType: "Brand" | "Generic";
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface EngineRow {
  standardClient: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

export interface ValidationRow {
  clientName: string;
  newSpend: number;
  legacySpend: number;
  variance: number;
  status: string;
}

export interface BackupData {
  clientRules: ClientRule[];
  platformRules: PlatformRule[];
  rawRows: RawRow[];
  legacySpends: Record<string, number>;
  lastSaved: string;
}
