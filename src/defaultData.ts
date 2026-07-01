/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientRule, PlatformRule, RawRow } from "./types";

export const DEFAULT_CLIENT_RULES: ClientRule[] = [
  { id: "cr-1", keyword: "Nike", standardClient: "NIKE", targetROAS: 2.8 },
  { id: "cr-2", keyword: "Adidas", standardClient: "ADIDAS", targetROAS: 2.2 },
  { id: "cr-3", keyword: "Apple", standardClient: "APPLE", targetROAS: 3.5 },
  { id: "cr-4", keyword: "Samsung", standardClient: "SAMSUNG", targetROAS: 3.0 },
  { id: "cr-5", keyword: "Google", standardClient: "GOOGLE", targetROAS: 1.5 }
];

export const DEFAULT_PLATFORM_RULES: PlatformRule[] = [
  { id: "pr-1", rawPlatform: "googleads", standardPlatform: "Google Ads" },
  { id: "pr-2", rawPlatform: "adwords", standardPlatform: "Google Ads" },
  { id: "pr-3", rawPlatform: "facebook", standardPlatform: "Facebook Ads" },
  { id: "pr-4", rawPlatform: "instagram", standardPlatform: "Facebook Ads" },
  { id: "pr-5", rawPlatform: "tiktok", standardPlatform: "TikTok Ads" },
  { id: "pr-6", rawPlatform: "bing", standardPlatform: "Bing Ads" }
];

export const DEFAULT_RAW_ROWS: RawRow[] = [
  {
    id: "raw-1",
    date: "2026-06-20",
    accountId: "ACC-101",
    source: "googleads",
    campaignName: "Nike_Search_Brand_CN",
    spend: 5200.00,
    impressions: 80000,
    clicks: 3200,
    conversions: 450,
    revenue: 18200.00
  },
  {
    id: "raw-2",
    date: "2026-06-20",
    accountId: "ACC-101",
    source: "facebook",
    campaignName: "Nike_FB_Generic_Slippers",
    spend: 3200.00,
    impressions: 120000,
    clicks: 1800,
    conversions: 110,
    revenue: 6400.00
  },
  {
    id: "raw-3",
    date: "2026-06-21",
    accountId: "ACC-102",
    source: "googleads",
    campaignName: "Adidas_Search_Brand_Global",
    spend: 4200.00,
    impressions: 60000,
    clicks: 2400,
    conversions: 310,
    revenue: 10500.00
  },
  {
    id: "raw-4",
    date: "2026-06-21",
    accountId: "ACC-102",
    source: "tiktok",
    campaignName: "Adidas_TT_Generic_RunningShoes",
    spend: 2800.00,
    impressions: 150000,
    clicks: 4100,
    conversions: 180,
    revenue: 5200.00
  },
  {
    id: "raw-5",
    date: "2026-06-22",
    accountId: "ACC-103",
    source: "googleads",
    campaignName: "Apple_iPhone17_Brand_Launch",
    spend: 15000.00,
    impressions: 250000,
    clicks: 12500,
    conversions: 1800,
    revenue: 65000.00
  },
  {
    id: "raw-6",
    date: "2026-06-22",
    accountId: "ACC-103",
    source: "instagram",
    campaignName: "Apple_FB_Generic_AirdropFeatures",
    spend: 6200.00,
    impressions: 180000,
    clicks: 3500,
    conversions: 220,
    revenue: 14000.00
  },
  {
    id: "raw-7",
    date: "2026-06-23",
    accountId: "ACC-104",
    source: "googleads",
    campaignName: "Samsung_S26_Brand_PromoCN",
    spend: 8000.00,
    impressions: 110000,
    clicks: 5500,
    conversions: 620,
    revenue: 24000.00
  },
  {
    id: "raw-8",
    date: "2026-06-23",
    accountId: "ACC-104",
    source: "tiktok",
    campaignName: "Samsung_TT_Generic_FlipPhone_AD",
    spend: 4500.00,
    impressions: 190000,
    clicks: 4800,
    conversions: 210,
    revenue: 9800.00
  },
  {
    id: "raw-9",
    date: "2026-06-24",
    accountId: "ACC-105",
    source: "googleads",
    campaignName: "Google_Cloud_Brand_Campaign_EMEA",
    spend: 12000.00,
    impressions: 95000,
    clicks: 3800,
    conversions: 410,
    revenue: 19000.00
  },
  {
    id: "raw-10",
    date: "2026-06-24",
    accountId: "ACC-101",
    source: "bing",
    campaignName: "Nike_Bing_Brand_Search",
    spend: 1500.00,
    impressions: 22000,
    clicks: 900,
    conversions: 120,
    revenue: 4800.00
  },
  {
    id: "raw-11",
    date: "2026-06-25",
    accountId: "ACC-999",
    source: "googleads",
    campaignName: "UnmappedClient_Generic_Campaign",
    spend: 2000.00,
    impressions: 30000,
    clicks: 1100,
    conversions: 80,
    revenue: 2500.00
  }
];

export const DEFAULT_LEGACY_SPENDS: Record<string, number> = {
  "NIKE": 9900.00,
  "ADIDAS": 7000.00,
  "APPLE": 21200.00,
  "SAMSUNG": 12500.00,
  "GOOGLE": 12000.00,
  "Unmapped": 2000.00
};
