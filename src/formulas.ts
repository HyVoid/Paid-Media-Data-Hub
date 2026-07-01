/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientRule, PlatformRule, RawRow, StandardRow, EngineRow, ValidationRow } from "./types";

export function computeStandardizedRows(
  rawRows: RawRow[],
  clientRules: ClientRule[],
  platformRules: PlatformRule[]
): StandardRow[] {
  return rawRows.map((raw) => {
    // 1. Client Matching
    let matchedClient = "Unmapped";
    const campaignLower = raw.campaignName.toLowerCase();
    
    // Sort rules to find matching keyword
    for (const rule of clientRules) {
      if (rule.keyword && campaignLower.includes(rule.keyword.toLowerCase())) {
        matchedClient = rule.standardClient;
        break; // Match the first matching keyword rule
      }
    }

    // 2. Platform Matching
    let matchedPlatform = "Other";
    const sourceLower = raw.source.toLowerCase().trim();
    for (const rule of platformRules) {
      if (rule.rawPlatform && sourceLower === rule.rawPlatform.toLowerCase().trim()) {
        matchedPlatform = rule.standardPlatform;
        break;
      }
    }

    // 3. Campaign Type classification
    const isBrand = campaignLower.includes("brand");
    const campaignType: "Brand" | "Generic" = isBrand ? "Brand" : "Generic";

    return {
      id: `std-${raw.id}`,
      date: raw.date,
      standardClient: matchedClient,
      standardPlatform: matchedPlatform,
      campaignType,
      spend: raw.spend,
      impressions: raw.impressions,
      clicks: raw.clicks,
      conversions: raw.conversions,
      revenue: raw.revenue,
    };
  });
}

export function computeEngineRows(standardRows: StandardRow[]): EngineRow[] {
  const clientsMap: Record<string, {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }> = {};

  // Initialize and aggregate
  standardRows.forEach((row) => {
    const client = row.standardClient;
    if (!clientsMap[client]) {
      clientsMap[client] = { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 };
    }
    clientsMap[client].spend += row.spend;
    clientsMap[client].impressions += row.impressions;
    clientsMap[client].clicks += row.clicks;
    clientsMap[client].conversions += row.conversions;
    clientsMap[client].revenue += row.revenue;
  });

  // Ensure "Unmapped" is present if it exists in the standard rows, or any clients are processed
  const clients = Object.keys(clientsMap).sort((a, b) => {
    if (a === "Unmapped") return 1; // Put unmapped at the end
    if (b === "Unmapped") return -1;
    return a.localeCompare(b);
  });

  return clients.map((client) => {
    const agg = clientsMap[client];
    const ctr = agg.impressions > 0 ? (agg.clicks / agg.impressions) : 0;
    const cpc = agg.clicks > 0 ? (agg.spend / agg.clicks) : 0;
    const cpa = agg.conversions > 0 ? (agg.spend / agg.conversions) : 0;
    const roas = agg.spend > 0 ? (agg.revenue / agg.spend) : 0;

    return {
      standardClient: client,
      spend: Number(agg.spend.toFixed(2)),
      impressions: agg.impressions,
      clicks: agg.clicks,
      conversions: agg.conversions,
      revenue: Number(agg.revenue.toFixed(2)),
      ctr,
      cpc,
      cpa,
      roas,
    };
  });
}

export function computeValidationRows(
  engineRows: EngineRow[],
  legacySpends: Record<string, number>
): ValidationRow[] {
  return engineRows.map((eng) => {
    const client = eng.standardClient;
    const legacySpend = legacySpends[client] !== undefined ? legacySpends[client] : 0;
    const variance = Number((eng.spend - legacySpend).toFixed(2));
    const isConsistent = Math.abs(variance) < 0.05;
    const status = isConsistent ? "✅ Consistent" : "❌ Mismatch";

    return {
      clientName: client,
      newSpend: eng.spend,
      legacySpend: Number(legacySpend.toFixed(2)),
      variance,
      status,
    };
  });
}
