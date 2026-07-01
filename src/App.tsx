/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Layers, 
  Grid, 
  TrendingUp, 
  Sliders, 
  FileSpreadsheet, 
  Cpu, 
  CheckSquare, 
  Settings, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  BarChart3, 
  Search,
  Filter,
  RefreshCw,
  HelpCircle,
  FileText
} from "lucide-react";
import { ClientRule, PlatformRule, RawRow, StandardRow, EngineRow, ValidationRow } from "./types";
import { 
  DEFAULT_CLIENT_RULES, 
  DEFAULT_PLATFORM_RULES, 
  DEFAULT_RAW_ROWS, 
  DEFAULT_LEGACY_SPENDS 
} from "./defaultData";
import { 
  computeStandardizedRows, 
  computeEngineRows, 
  computeValidationRows 
} from "./formulas";

export default function App() {
  // ── STATE DECLARATIONS ──
  const [clientRules, setClientRules] = useState<ClientRule[]>([]);
  const [platformRules, setPlatformRules] = useState<PlatformRule[]>([]);
  const [rawRows, setRawRows] = useState<RawRow[]>([]);
  const [legacySpends, setLegacySpends] = useState<Record<string, number>>({});
  const [lastSaved, setLastSaved] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [saveIndicator, setSaveIndicator] = useState<string>("All changes saved");

  // Filter States
  const [dashboardClientFilter, setDashboardClientFilter] = useState<string>("All");
  const [selectedClientPerf, setSelectedClientPerf] = useState<string>("");
  const [rawSearchQuery, setRawSearchQuery] = useState<string>("");
  const [stdSearchQuery, setStdSearchQuery] = useState<string>("");

  // Input states for creating new items
  const [newClientRule, setNewClientRule] = useState({ keyword: "", standardClient: "", targetROAS: 2.0 });
  const [newPlatformRule, setNewPlatformRule] = useState({ rawPlatform: "", standardPlatform: "" });
  const [newRawRow, setNewRawRow] = useState({
    date: new Date().toISOString().split("T")[0],
    accountId: "ACC-100",
    source: "googleads",
    campaignName: "",
    spend: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
  });

  // Modal alert notification state
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── INITIAL LOAD FROM LOCAL STORAGE ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem("paid_media_hub_data");
      if (stored) {
        const parsed = JSON.parse(stored);
        setClientRules(parsed.clientRules || DEFAULT_CLIENT_RULES);
        setPlatformRules(parsed.platformRules || DEFAULT_PLATFORM_RULES);
        setRawRows(parsed.rawRows || DEFAULT_RAW_ROWS);
        setLegacySpends(parsed.legacySpends || DEFAULT_LEGACY_SPENDS);
        setLastSaved(parsed.lastSaved || new Date().toLocaleTimeString());
      } else {
        // Initialize with default template data
        setClientRules(DEFAULT_CLIENT_RULES);
        setPlatformRules(DEFAULT_PLATFORM_RULES);
        setRawRows(DEFAULT_RAW_ROWS);
        setLegacySpends(DEFAULT_LEGACY_SPENDS);
        const now = new Date().toLocaleTimeString();
        setLastSaved(now);
        
        localStorage.setItem(
          "paid_media_hub_data",
          JSON.stringify({
            clientRules: DEFAULT_CLIENT_RULES,
            platformRules: DEFAULT_PLATFORM_RULES,
            rawRows: DEFAULT_RAW_ROWS,
            legacySpends: DEFAULT_LEGACY_SPENDS,
            lastSaved: now,
          })
        );
      }
    } catch (e) {
      console.error("Failed to load state from localStorage, using defaults", e);
      setClientRules(DEFAULT_CLIENT_RULES);
      setPlatformRules(DEFAULT_PLATFORM_RULES);
      setRawRows(DEFAULT_RAW_ROWS);
      setLegacySpends(DEFAULT_LEGACY_SPENDS);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, []);

  // ── AUTO PERSISTENCE EFFECT ──
  useEffect(() => {
    if (clientRules.length === 0 && platformRules.length === 0 && rawRows.length === 0) {
      return; // Wait for initial mount load
    }

    setSaveIndicator("Saving changes...");
    const timer = setTimeout(() => {
      const nowStr = new Date().toLocaleTimeString();
      const stateObj = {
        clientRules,
        platformRules,
        rawRows,
        legacySpends,
        lastSaved: nowStr
      };
      localStorage.setItem("paid_media_hub_data", JSON.stringify(stateObj));
      setLastSaved(nowStr);
      setSaveIndicator("All changes saved");
    }, 400);

    return () => clearTimeout(timer);
  }, [clientRules, platformRules, rawRows, legacySpends]);

  // Show a temporary banner notification
  const triggerNotification = (message: string, type: "success" | "info" | "warning" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // ── COMPUTED DERIVED STATES ──
  // 1. Sheet 3: Standard Fact Table
  const standardizedRows = useMemo(() => {
    return computeStandardizedRows(rawRows, clientRules, platformRules);
  }, [rawRows, clientRules, platformRules]);

  // 2. Sheet 4: Metrics Aggregation Engine
  const engineRows = useMemo(() => {
    return computeEngineRows(standardizedRows);
  }, [standardizedRows]);

  // Get active clients list dynamically
  const activeClients = useMemo(() => {
    const clients = engineRows.map(r => r.standardClient);
    return clients;
  }, [engineRows]);

  // Auto-set the first client performance tab filter if not set
  useEffect(() => {
    if (activeClients.length > 0 && !selectedClientPerf) {
      setSelectedClientPerf(activeClients[0]);
    }
  }, [activeClients, selectedClientPerf]);

  // 3. Sheet 5: QA Validation Rows
  const validationRows = useMemo(() => {
    return computeValidationRows(engineRows, legacySpends);
  }, [engineRows, legacySpends]);

  // Map of client name -> target ROAS for KPI alerting
  const targetRoasMap = useMemo(() => {
    const map: Record<string, number> = {};
    clientRules.forEach(rule => {
      map[rule.standardClient] = rule.targetROAS;
    });
    return map;
  }, [clientRules]);

  // Maximum spend amongst clients (for inline data bar sizing)
  const maxSpend = useMemo(() => {
    const values = engineRows.map(r => r.spend);
    return values.length > 0 ? Math.max(...values, 1) : 1;
  }, [engineRows]);

  // Maximum revenue amongst clients (for inline data bar sizing)
  const maxRevenue = useMemo(() => {
    const values = engineRows.map(r => r.revenue);
    return values.length > 0 ? Math.max(...values, 1) : 1;
  }, [engineRows]);

  // Diagnostics and Mapping Health warnings (Admin Panel content)
  const diagnostics = useMemo(() => {
    const unmappedCampaigns = rawRows.filter(row => {
      const campaignLower = row.campaignName.toLowerCase();
      return !clientRules.some(rule => rule.keyword && campaignLower.includes(rule.keyword.toLowerCase()));
    }).map(row => row.campaignName);

    const unmappedSources = rawRows.filter(row => {
      const sourceLower = row.source.toLowerCase().trim();
      return !platformRules.some(rule => rule.rawPlatform && sourceLower === rule.rawPlatform.toLowerCase().trim());
    }).map(row => row.source);

    const uniqueUnmappedCampNames = Array.from(new Set(unmappedCampaigns));
    const uniqueUnmappedSources = Array.from(new Set(unmappedSources));

    const totalRawCount = rawRows.length;
    const mappedRawCount = totalRawCount - unmappedCampaigns.length;
    const mappingHealthScore = totalRawCount > 0 ? Math.round((mappedRawCount / totalRawCount) * 100) : 100;

    const mismatches = validationRows.filter(v => v.status.includes("Mismatch"));

    return {
      unmappedCampaigns: uniqueUnmappedCampNames,
      unmappedSources: uniqueUnmappedSources,
      mappingHealthScore,
      mismatchesCount: mismatches.length,
      totalSpendCalculated: engineRows.reduce((acc, r) => acc + r.spend, 0),
    };
  }, [rawRows, clientRules, platformRules, validationRows, engineRows]);


  // ── CORE INTERACTIVE HANDLERS ──

  // Rule Handlers
  const handleAddClientRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientRule.keyword || !newClientRule.standardClient) {
      triggerNotification("Please fill out both keyword and client name", "warning");
      return;
    }
    const standardName = newClientRule.standardClient.toUpperCase().trim();
    const isDuplicate = clientRules.some(r => r.keyword.toLowerCase() === newClientRule.keyword.toLowerCase());
    if (isDuplicate) {
      triggerNotification(`Keyword rule for "${newClientRule.keyword}" already exists.`, "warning");
      return;
    }

    const newRule: ClientRule = {
      id: `cr-${Date.now()}`,
      keyword: newClientRule.keyword.trim(),
      standardClient: standardName,
      targetROAS: Number(newClientRule.targetROAS) || 2.0,
    };

    setClientRules([...clientRules, newRule]);
    setNewClientRule({ keyword: "", standardClient: "", targetROAS: 2.0 });
    triggerNotification(`Mapping rule for ${standardName} added successfully.`);
  };

  const handleUpdateClientRule = (id: string, field: keyof ClientRule, value: any) => {
    setClientRules(clientRules.map(rule => {
      if (rule.id === id) {
        if (field === "standardClient") {
          return { ...rule, [field]: String(value).toUpperCase().trim() };
        }
        if (field === "targetROAS") {
          return { ...rule, [field]: Number(value) || 0 };
        }
        return { ...rule, [field]: value };
      }
      return rule;
    }));
  };

  const handleDeleteClientRule = (id: string) => {
    setClientRules(clientRules.filter(r => r.id !== id));
    triggerNotification("Client matching rule removed", "info");
  };

  const handleAddPlatformRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatformRule.rawPlatform || !newPlatformRule.standardPlatform) {
      triggerNotification("Please fill out all platform fields", "warning");
      return;
    }

    const rawSource = newPlatformRule.rawPlatform.toLowerCase().trim();
    const isDuplicate = platformRules.some(r => r.rawPlatform.toLowerCase() === rawSource);
    if (isDuplicate) {
      triggerNotification(`Platform mapping for "${newPlatformRule.rawPlatform}" already exists.`, "warning");
      return;
    }

    const newRule: PlatformRule = {
      id: `pr-${Date.now()}`,
      rawPlatform: rawSource,
      standardPlatform: newPlatformRule.standardPlatform.trim(),
    };

    setPlatformRules([...platformRules, newRule]);
    setNewPlatformRule({ rawPlatform: "", standardPlatform: "" });
    triggerNotification(`Platform map for ${newRule.standardPlatform} created.`);
  };

  const handleUpdatePlatformRule = (id: string, field: keyof PlatformRule, value: string) => {
    setPlatformRules(platformRules.map(rule => {
      if (rule.id === id) {
        return { ...rule, [field]: value };
      }
      return rule;
    }));
  };

  const handleDeletePlatformRule = (id: string) => {
    setPlatformRules(platformRules.filter(r => r.id !== id));
    triggerNotification("Platform mapping rule removed", "info");
  };

  // Raw Row Handlers
  const handleAddRawRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRawRow.campaignName || !newRawRow.source) {
      triggerNotification("Campaign Name and Source are required", "warning");
      return;
    }

    const newRow: RawRow = {
      ...newRawRow,
      id: `raw-${Date.now()}`,
      spend: Number(newRawRow.spend) || 0,
      impressions: Number(newRawRow.impressions) || 0,
      clicks: Number(newRawRow.clicks) || 0,
      conversions: Number(newRawRow.conversions) || 0,
      revenue: Number(newRawRow.revenue) || 0,
    };

    setRawRows([newRow, ...rawRows]);
    setNewRawRow({
      date: new Date().toISOString().split("T")[0],
      accountId: "ACC-100",
      source: "googleads",
      campaignName: "",
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
    });
    triggerNotification("New raw Supermetrics campaign row inserted.");
  };

  const handleUpdateRawRow = (id: string, field: keyof RawRow, value: any) => {
    setRawRows(rawRows.map(row => {
      if (row.id === id) {
        if (field === "spend" || field === "impressions" || field === "clicks" || field === "conversions" || field === "revenue") {
          return { ...row, [field]: Number(value) || 0 };
        }
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleDeleteRawRow = (id: string) => {
    setRawRows(rawRows.filter(r => r.id !== id));
    triggerNotification("Raw row deleted", "info");
  };

  // Legacy Spend Update
  const handleUpdateLegacySpend = (client: string, value: number) => {
    setLegacySpends({
      ...legacySpends,
      [client]: Number(value) || 0
    });
  };

  // Reset Data to template defaults
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to restore all tables to their default original Excel workbook states? This will overwrite your current browser cache.")) {
      setClientRules(DEFAULT_CLIENT_RULES);
      setPlatformRules(DEFAULT_PLATFORM_RULES);
      setRawRows(DEFAULT_RAW_ROWS);
      setLegacySpends(DEFAULT_LEGACY_SPENDS);
      const now = new Date().toLocaleTimeString();
      setLastSaved(now);
      triggerNotification("All database tables reset to high-fidelity defaults successfully.");
    }
  };

  // Backup & Import
  const handleExportBackup = () => {
    const backupObj = {
      clientRules,
      platformRules,
      rawRows,
      legacySpends,
      lastSaved,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PaidMediaHub_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerNotification("Backup JSON exported and downloaded.");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.clientRules && parsed.platformRules && parsed.rawRows) {
          setClientRules(parsed.clientRules);
          setPlatformRules(parsed.platformRules);
          setRawRows(parsed.rawRows);
          if (parsed.legacySpends) setLegacySpends(parsed.legacySpends);
          setLastSaved(new Date().toLocaleTimeString());
          triggerNotification("Backup imported and loaded successfully!");
        } else {
          triggerNotification("Invalid file format: Missing key semantic nodes.", "warning");
        }
      } catch (err) {
        triggerNotification("Could not parse file. Verify it is a valid JSON backup.", "warning");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  // ── RENDER HELPERS ──
  // Format numbers cleanly
  const fmtCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  };

  const fmtInt = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  const fmtPercent = (val: number) => {
    return (val * 100).toFixed(2) + "%";
  };


  // ── COMPONENT TABS IMPLEMENTATION ──

  // 1. Executive Dashboard Tab
  const renderDashboardTab = () => {
    // Apply client filter
    const dashboardData = useMemo(() => {
      if (dashboardClientFilter === "All") {
        return standardizedRows;
      }
      return standardizedRows.filter(r => r.standardClient === dashboardClientFilter);
    }, [standardizedRows, dashboardClientFilter]);

    // Aggregate metrics for cards
    const stats = useMemo(() => {
      const spend = dashboardData.reduce((acc, r) => acc + r.spend, 0);
      const impressions = dashboardData.reduce((acc, r) => acc + r.impressions, 0);
      const clicks = dashboardData.reduce((acc, r) => acc + r.clicks, 0);
      const conversions = dashboardData.reduce((acc, r) => acc + r.conversions, 0);
      const revenue = dashboardData.reduce((acc, r) => acc + r.revenue, 0);

      const ctr = impressions > 0 ? (clicks / impressions) : 0;
      const cpc = clicks > 0 ? (spend / clicks) : 0;
      const cpa = conversions > 0 ? (spend / conversions) : 0;
      const roas = spend > 0 ? (revenue / spend) : 0;

      return { spend, impressions, clicks, conversions, revenue, ctr, cpc, cpa, roas };
    }, [dashboardData]);

    // Chart logic: Spend and Revenue grouped by client
    const chartData = useMemo(() => {
      const grouped: Record<string, { spend: number; revenue: number }> = {};
      standardizedRows.forEach(row => {
        const cl = row.standardClient;
        if (!grouped[cl]) grouped[cl] = { spend: 0, revenue: 0 };
        grouped[cl].spend += row.spend;
        grouped[cl].revenue += row.revenue;
      });

      return Object.entries(grouped).map(([client, vals]) => ({
        client,
        spend: vals.spend,
        revenue: vals.revenue,
      })).sort((a, b) => b.spend - a.spend);
    }, [standardizedRows]);

    const maxChartValue = Math.max(...chartData.map(d => Math.max(d.spend, d.revenue)), 1);

    // Platform share breakdown
    const platformBreakdown = useMemo(() => {
      const grouped: Record<string, number> = {};
      let total = 0;
      dashboardData.forEach(row => {
        const plat = row.standardPlatform;
        grouped[plat] = (grouped[plat] || 0) + row.spend;
        total += row.spend;
      });

      return Object.entries(grouped).map(([platform, spend]) => ({
        platform,
        spend,
        share: total > 0 ? spend / total : 0,
      })).sort((a, b) => b.spend - a.spend);
    }, [dashboardData]);

    return (
      <div className="space-y-8 animate-fade-up">
        {/* Top filter and welcome header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h2 className="font-heading-eb text-2xl text-primary font-medium">Executive Performance Summary</h2>
            <p className="text-muted text-xs mt-1">Unified analytics cross-channel dashboard aggregated from Supermetrics semantic layers.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Client Filter:</span>
            <div className="relative">
              <select 
                value={dashboardClientFilter} 
                onChange={(e) => setDashboardClientFilter(e.target.value)}
                className="editable-input min-w-[180px] bg-white font-medium text-primary py-2 px-3 border border-border rounded-md shadow-sm appearance-none pr-8 cursor-pointer"
              >
                <option value="All">All Clients Combined</option>
                {activeClients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                <ChevronRight className="h-4 w-4 transform rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic KPI Cards - EB Garamond Fonts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-elevation-md card-hover-lift p-6 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Total Ad Spend</span>
              <div className="font-display text-[32px] text-primary font-bold mt-2 leading-none">
                {fmtCurrency(stats.spend)}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs border-t border-border pt-3">
              <span className="text-muted">Avg CPC</span>
              <span className="font-medium text-primary">{fmtCurrency(stats.cpc)}</span>
            </div>
          </div>

          <div className="card-elevation-md card-hover-lift p-6 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Generated Revenue</span>
              <div className="font-display text-[32px] text-primary font-bold mt-2 leading-none">
                {fmtCurrency(stats.revenue)}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs border-t border-border pt-3">
              <span className="text-muted">Total Conversions</span>
              <span className="font-medium text-primary">{fmtInt(stats.conversions)}</span>
            </div>
          </div>

          <div className="card-elevation-md card-hover-lift p-6 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Overall Return (ROAS)</span>
              <div className="font-display text-[32px] text-accent font-bold mt-2 leading-none">
                {stats.roas.toFixed(2)}x
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs border-t border-border pt-3">
              <span className="text-muted">Target threshold</span>
              <span className="font-medium text-primary">
                {dashboardClientFilter !== "All" && targetRoasMap[dashboardClientFilter] 
                  ? `${targetRoasMap[dashboardClientFilter].toFixed(2)}x` 
                  : "N/A"
                }
              </span>
            </div>
          </div>

          <div className="card-elevation-md card-hover-lift p-6 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Avg Acquisition Cost</span>
              <div className="font-display text-[32px] text-primary font-bold mt-2 leading-none">
                {fmtCurrency(stats.cpa)}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs border-t border-border pt-3">
              <span className="text-muted">Overall CTR</span>
              <span className="font-medium text-primary">{fmtPercent(stats.ctr)}</span>
            </div>
          </div>
        </div>

        {/* Insight and Recommendations Block */}
        <div className="insight-block flex items-start gap-4">
          <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-primary text-sm uppercase tracking-wide">Automated Diagnostic Insight</h4>
            <p className="text-xs text-primary/80 mt-1">
              {stats.roas >= 2.5 
                ? `Strong overall marketing return discovered at ${stats.roas.toFixed(2)}x ROAS, led by Brand campaign optimizations. Standard mapping efficiency is running at 100%.`
                : `Active ROAS is currently running below agency expectations. High customer acquisition costs (${fmtCurrency(stats.cpa)}) on TikTok Ads generic segments are capping net margin efficiencies.`
              }
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main client spend vs revenue chart (SVG based for zero extra dependencies) */}
          <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-3">
            <h3 className="font-heading-eb text-lg text-primary font-medium mb-1">Spend vs. Revenue by Standard Client</h3>
            <p className="text-[11px] text-muted uppercase tracking-wider mb-6">Visual performance comparison in USD</p>
            
            {chartData.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-muted text-xs">
                No active client data configured. Add raw rows to visualize.
              </div>
            ) : (
              <div className="space-y-5">
                {chartData.map((data, index) => {
                  const spendPct = (data.spend / maxChartValue) * 100;
                  const revenuePct = (data.revenue / maxChartValue) * 100;

                  return (
                    <div key={data.client} className="space-y-1 group">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-primary">{data.client}</span>
                        <span className="text-muted text-[11px]">
                          S: <span className="text-primary font-medium">{fmtCurrency(data.spend)}</span> | R: <span className="text-accent font-semibold">{fmtCurrency(data.revenue)}</span>
                        </span>
                      </div>
                      <div className="space-y-1">
                        {/* Spend Bar */}
                        <div className="h-2 w-full bg-primary/5 rounded-full overflow-hidden relative">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${spendPct}%` }}
                          />
                        </div>
                        {/* Revenue Bar */}
                        <div className="h-2 w-full bg-accent/10 rounded-full overflow-hidden relative">
                          <div 
                            className="h-full bg-accent rounded-full transition-all duration-500"
                            style={{ width: `${revenuePct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Platform Share Breakdown */}
          <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
            <h3 className="font-heading-eb text-lg text-primary font-medium mb-1">Platform Share Breakdown</h3>
            <p className="text-[11px] text-muted uppercase tracking-wider mb-6">Percentage allocation of overall budget</p>

            {platformBreakdown.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-muted text-xs">
                No active platform data found.
              </div>
            ) : (
              <div className="space-y-5">
                {platformBreakdown.map((plat) => (
                  <div key={plat.platform} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-primary">{plat.platform}</span>
                      <span className="text-muted font-medium">{fmtPercent(plat.share)} ({fmtCurrency(plat.spend)})</span>
                    </div>
                    <div className="h-2 w-full bg-accent/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${plat.share * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Direct aggregate table preview */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-heading-eb text-lg text-primary font-medium">Aggregate Standard Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary/5 border-b border-primary/10">
                  <th className="font-table-head p-4">Standard Client</th>
                  <th className="font-table-head p-4 text-right">Ad Spend</th>
                  <th className="font-table-head p-4 text-right">Impressions</th>
                  <th className="font-table-head p-4 text-right">Clicks</th>
                  <th className="font-table-head p-4 text-right">Conversions</th>
                  <th className="font-table-head p-4 text-right">CTR</th>
                  <th className="font-table-head p-4 text-right">CPC</th>
                  <th className="font-table-head p-4 text-right">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {engineRows.map((row, index) => {
                  const target = targetRoasMap[row.standardClient] || 2.0;
                  const isUnderperforming = row.roas < target;

                  return (
                    <tr 
                      key={row.standardClient} 
                      className={`hover:bg-primary/5 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-bg"}`}
                    >
                      <td className="p-4 font-semibold text-primary">{row.standardClient}</td>
                      <td className="p-4 text-right font-medium">{fmtCurrency(row.spend)}</td>
                      <td className="p-4 text-right text-muted">{fmtInt(row.impressions)}</td>
                      <td className="p-4 text-right text-muted">{fmtInt(row.clicks)}</td>
                      <td className="p-4 text-right text-muted">{fmtInt(row.conversions)}</td>
                      <td className="p-4 text-right text-primary">{fmtPercent(row.ctr)}</td>
                      <td className="p-4 text-right text-primary">{fmtCurrency(row.cpc)}</td>
                      <td className="p-4 text-right">
                        <span className={`badge-pill ${isUnderperforming ? "bg-negative/10 text-negative font-semibold" : "bg-primary/5 text-primary"}`}>
                          {row.roas.toFixed(2)}x
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 2. Client Performance Tab
  const renderClientPerformanceTab = () => {
    // Select client rows
    const clientRows = useMemo(() => {
      return standardizedRows.filter(r => r.standardClient === selectedClientPerf);
    }, [standardizedRows, selectedClientPerf]);

    // Platform level aggregate for selected client
    const platformStats = useMemo(() => {
      const grouped: Record<string, {
        spend: number;
        impressions: number;
        clicks: number;
        conversions: number;
        revenue: number;
      }> = {};

      clientRows.forEach((row) => {
        const p = row.standardPlatform;
        if (!grouped[p]) {
          grouped[p] = { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 };
        }
        grouped[p].spend += row.spend;
        grouped[p].impressions += row.impressions;
        grouped[p].clicks += row.clicks;
        grouped[p].conversions += row.conversions;
        grouped[p].revenue += row.revenue;
      });

      return Object.entries(grouped).map(([platform, vals]) => {
        const ctr = vals.impressions > 0 ? (vals.clicks / vals.impressions) : 0;
        const cpc = vals.clicks > 0 ? (vals.spend / vals.clicks) : 0;
        const cpa = vals.conversions > 0 ? (vals.spend / vals.conversions) : 0;
        const roas = vals.spend > 0 ? (vals.revenue / vals.spend) : 0;

        return { platform, ...vals, ctr, cpc, cpa, roas };
      }).sort((a, b) => b.spend - a.spend);
    }, [clientRows]);

    // Campaign Type aggregate for selected client (Brand vs Generic)
    const typeStats = useMemo(() => {
      const grouped: Record<string, {
        spend: number;
        impressions: number;
        clicks: number;
        conversions: number;
        revenue: number;
      }> = {};

      clientRows.forEach((row) => {
        const t = row.campaignType;
        if (!grouped[t]) {
          grouped[t] = { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 };
        }
        grouped[t].spend += row.spend;
        grouped[t].impressions += row.impressions;
        grouped[t].clicks += row.clicks;
        grouped[t].conversions += row.conversions;
        grouped[t].revenue += row.revenue;
      });

      return Object.entries(grouped).map(([type, vals]) => {
        const ctr = vals.impressions > 0 ? (vals.clicks / vals.impressions) : 0;
        const cpc = vals.clicks > 0 ? (vals.spend / vals.clicks) : 0;
        const cpa = vals.conversions > 0 ? (vals.spend / vals.conversions) : 0;
        const roas = vals.spend > 0 ? (vals.revenue / vals.spend) : 0;

        return { type, ...vals, ctr, cpc, cpa, roas };
      }).sort((a, b) => b.spend - a.spend);
    }, [clientRows]);

    // Hero stats for selected client
    const clientHero = useMemo(() => {
      const spend = clientRows.reduce((acc, r) => acc + r.spend, 0);
      const rev = clientRows.reduce((acc, r) => acc + r.revenue, 0);
      const roas = spend > 0 ? rev / spend : 0;
      const target = targetRoasMap[selectedClientPerf] || 2.0;
      return { spend, rev, roas, target };
    }, [clientRows, selectedClientPerf, targetRoasMap]);

    return (
      <div className="space-y-8 animate-fade-up">
        {/* Top Dropdown for selecting client */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h2 className="font-heading-eb text-2xl text-primary font-medium">Client Performance Deep Dive</h2>
            <p className="text-muted text-xs mt-1">Multi-dimensional operational breakdown for internal account management audit.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Target Client:</span>
            <div className="relative">
              <select 
                value={selectedClientPerf} 
                onChange={(e) => setSelectedClientPerf(e.target.value)}
                className="editable-input min-w-[180px] bg-white font-medium text-primary py-2 px-3 border border-border rounded-md shadow-sm appearance-none pr-8 cursor-pointer"
              >
                {activeClients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                <ChevronRight className="h-4 w-4 transform rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {selectedClientPerf === "Unmapped" && (
          <div className="bg-negative/5 border border-negative/20 text-negative p-4 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h5 className="font-semibold uppercase tracking-wide">Unmapped Data Category</h5>
              <p className="mt-1">
                These campaigns do not match any defined brand name rules in the Config Setup. Standard mapping scripts have automatically bucketed these under "Unmapped" to protect global metrics summing. Please configure a brand keyword rule to classify this spend.
              </p>
            </div>
          </div>
        )}

        {/* Client KPI metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-elevation-md p-6">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Client Ad Spend</span>
            <div className="font-display text-[32px] text-primary font-bold mt-2">
              {fmtCurrency(clientHero.spend)}
            </div>
          </div>
          <div className="card-elevation-md p-6">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Generated Revenue</span>
            <div className="font-display text-[32px] text-primary font-bold mt-2">
              {fmtCurrency(clientHero.rev)}
            </div>
          </div>
          <div className="card-elevation-md p-6">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">ROAS Status</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`font-display text-[32px] font-bold ${clientHero.roas < clientHero.target ? "text-negative" : "text-accent"}`}>
                {clientHero.roas.toFixed(2)}x
              </span>
              <span className="text-xs text-muted">
                / Target: {clientHero.target.toFixed(2)}x
              </span>
            </div>
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-heading-eb text-lg text-primary font-medium">Platform Channels Analysis</h3>
              <p className="text-xs text-muted mt-1">Cost efficiency split per connected advertisement source</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/5 border-b border-primary/10">
                    <th className="font-table-head p-3">Platform</th>
                    <th className="font-table-head p-3 text-right">Spend</th>
                    <th className="font-table-head p-3 text-right">CTR</th>
                    <th className="font-table-head p-3 text-right">CPC</th>
                    <th className="font-table-head p-3 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {platformStats.map((plat) => (
                    <tr key={plat.platform} className="hover:bg-primary/5">
                      <td className="p-3 font-semibold text-primary">{plat.platform}</td>
                      <td className="p-3 text-right font-medium">{fmtCurrency(plat.spend)}</td>
                      <td className="p-3 text-right text-muted">{fmtPercent(plat.ctr)}</td>
                      <td className="p-3 text-right text-muted">{fmtCurrency(plat.cpc)}</td>
                      <td className="p-3 text-right">
                        <span className={`badge-pill ${plat.roas < clientHero.target ? "bg-negative/5 text-negative" : "bg-primary/5 text-primary"}`}>
                          {plat.roas.toFixed(2)}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Campaign Type Brand vs Generic analysis */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-heading-eb text-lg text-primary font-medium">Intent Type Analysis (Brand vs. Generic)</h3>
              <p className="text-xs text-muted mt-1">Brand core vs Acquisition/Generic traffic performance</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/5 border-b border-primary/10">
                    <th className="font-table-head p-3">Category</th>
                    <th className="font-table-head p-3 text-right">Spend</th>
                    <th className="font-table-head p-3 text-right">Clicks</th>
                    <th className="font-table-head p-3 text-right">CPA</th>
                    <th className="font-table-head p-3 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {typeStats.map((type) => (
                    <tr key={type.type} className="hover:bg-primary/5">
                      <td className="p-3 font-semibold text-primary">
                        <span className={`badge-pill ${type.type === "Brand" ? "bg-accent/10 text-accent font-semibold" : "bg-primary/15 text-primary"}`}>
                          {type.type}
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium">{fmtCurrency(type.spend)}</td>
                      <td className="p-3 text-right text-muted">{fmtInt(type.clicks)}</td>
                      <td className="p-3 text-right text-muted">{fmtCurrency(type.cpa)}</td>
                      <td className="p-3 text-right font-semibold text-primary">{type.roas.toFixed(2)}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tactical Recommendation block */}
        <div className="insight-block">
          <h4 className="font-semibold text-primary text-sm uppercase tracking-wide">Agency Recommendation & Strategic Action</h4>
          <p className="text-xs text-primary/80 mt-2">
            {clientHero.roas < clientHero.target 
              ? `Warning: Current ROAS of ${clientHero.roas.toFixed(2)}x is failing to meet target threshold of ${clientHero.target.toFixed(2)}x. We recommend immediately shifting 20% of the active TikTok Ads generic budget into high-converting Google Ads Brand search campaigns to protect overall margins.`
              : `Success: Performance of ${clientHero.roas.toFixed(2)}x ROAS is highly healthy, outperforming the target threshold of ${clientHero.target.toFixed(2)}x. Recommend maintaining active bid multipliers and testing brand amplification categories in generic keywords.`
            }
          </p>
        </div>
      </div>
    );
  };

  // 3. Config Setup Tab
  const renderConfigTab = () => {
    return (
      <div className="space-y-8 animate-fade-up">
        {/* Explanatory intro */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-heading-eb text-2xl text-primary font-medium">Semantic Mapping Engine Control Center</h2>
          <p className="text-muted text-xs mt-1">
            Define custom brand keyword lookup expressions and target standard nomenclature. 
            Inputs here instantly drive the automated ETL standardization layer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Client Rules Table - Left Span 3 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-3">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-primary uppercase tracking-wide text-xs">Brand Keyword Rules</h3>
                <p className="text-[11px] text-muted">Maps search string in Campaign Name to standard Client label</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-primary/5 border-b border-primary/10">
                    <th className="font-table-head p-3">Campaign Keyword (Match)</th>
                    <th className="font-table-head p-3">Standard Brand Output</th>
                    <th className="font-table-head p-3 text-right">Target KPI ROAS</th>
                    <th className="font-table-head p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clientRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-primary/5">
                      <td className="p-3">
                        <input 
                          type="text" 
                          value={rule.keyword} 
                          onChange={(e) => handleUpdateClientRule(rule.id, "keyword", e.target.value)}
                          className="editable-input w-full font-medium"
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="text" 
                          value={rule.standardClient} 
                          onChange={(e) => handleUpdateClientRule(rule.id, "standardClient", e.target.value)}
                          className="editable-input w-full uppercase font-bold"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input 
                          type="number" 
                          step="0.1"
                          value={rule.targetROAS} 
                          onChange={(e) => handleUpdateClientRule(rule.id, "targetROAS", e.target.value)}
                          className="editable-input w-24 text-right"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleDeleteClientRule(rule.id)}
                          className="text-negative hover:bg-negative/10 p-1.5 rounded transition-colors"
                          title="Delete rule"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Append Row form inline */}
                  <tr className="bg-primary/5">
                    <td className="p-3">
                      <input 
                        type="text" 
                        placeholder="e.g. Puma"
                        value={newClientRule.keyword}
                        onChange={(e) => setNewClientRule({ ...newClientRule, keyword: e.target.value })}
                        className="editable-input w-full bg-white font-medium"
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="text" 
                        placeholder="e.g. PUMA"
                        value={newClientRule.standardClient}
                        onChange={(e) => setNewClientRule({ ...newClientRule, standardClient: e.target.value })}
                        className="editable-input w-full uppercase bg-white font-bold"
                      />
                    </td>
                    <td className="p-3 text-right">
                      <input 
                        type="number" 
                        step="0.1"
                        placeholder="2.0"
                        value={newClientRule.targetROAS}
                        onChange={(e) => setNewClientRule({ ...newClientRule, targetROAS: Number(e.target.value) || 2.0 })}
                        className="editable-input w-24 text-right bg-white"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={handleAddClientRule}
                        className="bg-primary text-white hover:bg-primary/90 p-1.5 rounded transition-colors flex items-center justify-center mx-auto"
                        title="Add rule"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Platform Mapping Rules - Right Span 2 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-2">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-primary uppercase tracking-wide text-xs">Platform Channel Standardizer</h3>
              <p className="text-[11px] text-muted">Maps various Supermetrics raw media sources to consolidated standard platform name</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-primary/5 border-b border-primary/10">
                    <th className="font-table-head p-3">Raw Source ID</th>
                    <th className="font-table-head p-3">Standard platform Name</th>
                    <th className="font-table-head p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {platformRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-primary/5">
                      <td className="p-3">
                        <input 
                          type="text" 
                          value={rule.rawPlatform} 
                          onChange={(e) => handleUpdatePlatformRule(rule.id, "rawPlatform", e.target.value)}
                          className="editable-input w-full font-medium"
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="text" 
                          value={rule.standardPlatform} 
                          onChange={(e) => handleUpdatePlatformRule(rule.id, "standardPlatform", e.target.value)}
                          className="editable-input w-full font-bold"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleDeletePlatformRule(rule.id)}
                          className="text-negative hover:bg-negative/10 p-1.5 rounded transition-colors"
                          title="Delete platform map"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Append platform rule inline */}
                  <tr className="bg-primary/5">
                    <td className="p-3">
                      <input 
                        type="text" 
                        placeholder="e.g. pin"
                        value={newPlatformRule.rawPlatform}
                        onChange={(e) => setNewPlatformRule({ ...newPlatformRule, rawPlatform: e.target.value })}
                        className="editable-input w-full bg-white font-medium"
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="text" 
                        placeholder="e.g. Pinterest Ads"
                        value={newPlatformRule.standardPlatform}
                        onChange={(e) => setNewPlatformRule({ ...newPlatformRule, standardPlatform: e.target.value })}
                        className="editable-input w-full bg-white font-bold"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={handleAddPlatformRule}
                        className="bg-primary text-white hover:bg-primary/90 p-1.5 rounded transition-colors flex items-center justify-center mx-auto"
                        title="Add mapping"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 4. Raw Data Tab
  const renderRawDataTab = () => {
    const filteredRawRows = useMemo(() => {
      if (!rawSearchQuery) return rawRows;
      const q = rawSearchQuery.toLowerCase();
      return rawRows.filter(r => 
        r.campaignName.toLowerCase().includes(q) || 
        r.source.toLowerCase().includes(q) || 
        r.accountId.toLowerCase().includes(q)
      );
    }, [rawRows, rawSearchQuery]);

    return (
      <div className="space-y-8 animate-fade-up">
        {/* Intro */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading-eb text-2xl text-primary font-medium">Raw Supermetrics Fact ingestion</h2>
              <p className="text-muted text-xs mt-1">
                Central marketing facts. Editing any numeric value below triggers instant downstream recalculations.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
              <input 
                type="text"
                placeholder="Search raw facts..."
                value={rawSearchQuery}
                onChange={(e) => setRawSearchQuery(e.target.value)}
                className="editable-input pl-9 min-w-[250px] py-2 bg-white border border-border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Big Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-primary/5 border-b border-primary/10 sticky top-0 z-10">
                  <th className="font-table-head p-3">Date</th>
                  <th className="font-table-head p-3">Account ID</th>
                  <th className="font-table-head p-3">Source ID</th>
                  <th className="font-table-head p-3">Campaign Name String</th>
                  <th className="font-table-head p-3 text-right">Raw Spend</th>
                  <th className="font-table-head p-3 text-right">Impressions</th>
                  <th className="font-table-head p-3 text-right">Clicks</th>
                  <th className="font-table-head p-3 text-right">Conversions</th>
                  <th className="font-table-head p-3 text-right">Revenue</th>
                  <th className="font-table-head p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* Addition Form Inline as First Row */}
                <tr className="bg-primary/5 border-b border-primary/15">
                  <td className="p-3">
                    <input 
                      type="date" 
                      value={newRawRow.date}
                      onChange={(e) => setNewRawRow({ ...newRawRow, date: e.target.value })}
                      className="editable-input w-[100px] bg-white"
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="text" 
                      placeholder="e.g. ACC-200"
                      value={newRawRow.accountId}
                      onChange={(e) => setNewRawRow({ ...newRawRow, accountId: e.target.value })}
                      className="editable-input w-[85px] bg-white font-medium"
                    />
                  </td>
                  <td className="p-3">
                    <select 
                      value={newRawRow.source}
                      onChange={(e) => setNewRawRow({ ...newRawRow, source: e.target.value })}
                      className="editable-input w-[95px] bg-white font-semibold"
                    >
                      <option value="googleads">googleads</option>
                      <option value="facebook">facebook</option>
                      <option value="tiktok">tiktok</option>
                      <option value="instagram">instagram</option>
                      <option value="bing">bing</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input 
                      type="text" 
                      placeholder="e.g. Nike_Search_Generic_Shoes"
                      value={newRawRow.campaignName}
                      onChange={(e) => setNewRawRow({ ...newRawRow, campaignName: e.target.value })}
                      className="editable-input w-[220px] bg-white font-medium text-primary"
                    />
                  </td>
                  <td className="p-3 text-right">
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={newRawRow.spend === 0 ? "" : newRawRow.spend}
                      onChange={(e) => setNewRawRow({ ...newRawRow, spend: Number(e.target.value) || 0 })}
                      className="editable-input w-[80px] text-right bg-white"
                    />
                  </td>
                  <td className="p-3 text-right">
                    <input 
                      type="number" 
                      placeholder="0"
                      value={newRawRow.impressions === 0 ? "" : newRawRow.impressions}
                      onChange={(e) => setNewRawRow({ ...newRawRow, impressions: Number(e.target.value) || 0 })}
                      className="editable-input w-[80px] text-right bg-white"
                    />
                  </td>
                  <td className="p-3 text-right">
                    <input 
                      type="number" 
                      placeholder="0"
                      value={newRawRow.clicks === 0 ? "" : newRawRow.clicks}
                      onChange={(e) => setNewRawRow({ ...newRawRow, clicks: Number(e.target.value) || 0 })}
                      className="editable-input w-[75px] text-right bg-white"
                    />
                  </td>
                  <td className="p-3 text-right">
                    <input 
                      type="number" 
                      placeholder="0"
                      value={newRawRow.conversions === 0 ? "" : newRawRow.conversions}
                      onChange={(e) => setNewRawRow({ ...newRawRow, conversions: Number(e.target.value) || 0 })}
                      className="editable-input w-[75px] text-right bg-white"
                    />
                  </td>
                  <td className="p-3 text-right">
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={newRawRow.revenue === 0 ? "" : newRawRow.revenue}
                      onChange={(e) => setNewRawRow({ ...newRawRow, revenue: Number(e.target.value) || 0 })}
                      className="editable-input w-[90px] text-right bg-white"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={handleAddRawRow}
                      className="bg-accent text-white hover:bg-accent/90 px-3 py-1.5 rounded transition-colors font-semibold flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" /> Insert
                    </button>
                  </td>
                </tr>

                {filteredRawRows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-muted">
                      No matching raw records found.
                    </td>
                  </tr>
                ) : (
                  filteredRawRows.map((row) => (
                    <tr key={row.id} className="hover:bg-primary/5 transition-colors">
                      <td className="p-3">
                        <input 
                          type="date" 
                          value={row.date} 
                          onChange={(e) => handleUpdateRawRow(row.id, "date", e.target.value)}
                          className="editable-input w-[100px] border-none shadow-none bg-transparent"
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="text" 
                          value={row.accountId} 
                          onChange={(e) => handleUpdateRawRow(row.id, "accountId", e.target.value)}
                          className="editable-input w-[85px] border-none shadow-none bg-transparent font-medium"
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="text" 
                          value={row.source} 
                          onChange={(e) => handleUpdateRawRow(row.id, "source", e.target.value)}
                          className="editable-input w-[95px] border-none shadow-none bg-transparent font-semibold"
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="text" 
                          value={row.campaignName} 
                          onChange={(e) => handleUpdateRawRow(row.id, "campaignName", e.target.value)}
                          className="editable-input w-[220px] border-none shadow-none bg-transparent font-medium"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input 
                          type="number" 
                          value={row.spend} 
                          onChange={(e) => handleUpdateRawRow(row.id, "spend", e.target.value)}
                          className="editable-input w-[80px] border-none shadow-none bg-transparent text-right font-medium"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input 
                          type="number" 
                          value={row.impressions} 
                          onChange={(e) => handleUpdateRawRow(row.id, "impressions", e.target.value)}
                          className="editable-input w-[80px] border-none shadow-none bg-transparent text-right"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input 
                          type="number" 
                          value={row.clicks} 
                          onChange={(e) => handleUpdateRawRow(row.id, "clicks", e.target.value)}
                          className="editable-input w-[75px] border-none shadow-none bg-transparent text-right"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input 
                          type="number" 
                          value={row.conversions} 
                          onChange={(e) => handleUpdateRawRow(row.id, "conversions", e.target.value)}
                          className="editable-input w-[75px] border-none shadow-none bg-transparent text-right"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input 
                          type="number" 
                          value={row.revenue} 
                          onChange={(e) => handleUpdateRawRow(row.id, "revenue", e.target.value)}
                          className="editable-input w-[90px] border-none shadow-none bg-transparent text-right font-medium"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleDeleteRawRow(row.id)}
                          className="text-negative hover:bg-negative/10 p-1.5 rounded transition-colors"
                          title="Delete raw campaign row"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 5. Standardized Fact Table Tab
  const renderStandardizedTab = () => {
    const filteredStdRows = useMemo(() => {
      if (!stdSearchQuery) return standardizedRows;
      const q = stdSearchQuery.toLowerCase();
      return standardizedRows.filter(r => 
        r.standardClient.toLowerCase().includes(q) || 
        r.standardPlatform.toLowerCase().includes(q) ||
        r.campaignType.toLowerCase().includes(q)
      );
    }, [standardizedRows, stdSearchQuery]);

    return (
      <div className="space-y-8 animate-fade-up">
        {/* Intro */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading-eb text-2xl text-primary font-medium">Standardized Semantic Fact table</h2>
              <p className="text-muted text-xs mt-1">
                Sheet 3 calculated output. Displays how raw campaign names map to Standard Brand and Platform dynamically in real-time.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
              <input 
                type="text"
                placeholder="Search standardized outputs..."
                value={stdSearchQuery}
                onChange={(e) => setStdSearchQuery(e.target.value)}
                className="editable-input pl-9 min-w-[250px] py-2 bg-white border border-border"
              />
            </div>
          </div>
        </div>

        {/* Read-only standardized fact view */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-primary/5 border-b border-primary/10 sticky top-0 z-10">
                  <th className="font-table-head p-4">Date</th>
                  <th className="font-table-head p-4">Standard Brand</th>
                  <th className="font-table-head p-4">Standardized Channel</th>
                  <th className="font-table-head p-4">Campaign Type</th>
                  <th className="font-table-head p-4 text-right">Clean Spend</th>
                  <th className="font-table-head p-4 text-right">Impressions</th>
                  <th className="font-table-head p-4 text-right">Clicks</th>
                  <th className="font-table-head p-4 text-right">Conversions</th>
                  <th className="font-table-head p-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStdRows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted">
                      No standardized rows found. Ensure config rules exist.
                    </td>
                  </tr>
                ) : (
                  filteredStdRows.map((row, index) => {
                    const isUnmapped = row.standardClient === "Unmapped";
                    const isOtherPlatform = row.standardPlatform === "Other";

                    return (
                      <tr 
                        key={row.id} 
                        className={`hover:bg-primary/5 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-bg"}`}
                      >
                        <td className="p-4 text-muted font-medium">{row.date}</td>
                        <td className="p-4">
                          <span className={`badge-pill ${isUnmapped ? "bg-negative/10 text-negative font-semibold" : "bg-primary/5 text-primary font-bold"}`}>
                            {row.standardClient}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`badge-pill ${isOtherPlatform ? "bg-primary/15 text-primary" : "bg-accent/10 text-accent font-semibold"}`}>
                            {row.standardPlatform}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`badge-pill ${row.campaignType === "Brand" ? "bg-accent text-white font-medium" : "bg-primary/5 text-primary"}`}>
                            {row.campaignType}
                          </span>
                        </td>
                        <td className="p-4 text-right font-semibold text-primary">{fmtCurrency(row.spend)}</td>
                        <td className="p-4 text-right text-muted">{fmtInt(row.impressions)}</td>
                        <td className="p-4 text-right text-muted">{fmtInt(row.clicks)}</td>
                        <td className="p-4 text-right text-muted">{fmtInt(row.conversions)}</td>
                        <td className="p-4 text-right font-medium text-primary">{fmtCurrency(row.revenue)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 6. Metrics Calculation Engine Tab
  const renderEngineTab = () => {
    return (
      <div className="space-y-8 animate-fade-up">
        {/* Intro */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-heading-eb text-2xl text-primary font-medium">Calculated Metrics Aggregation Engine</h2>
          <p className="text-muted text-xs mt-1">
            Sheet 4 calculated metrics. Aggregates and runs multi-client marketing KPIs instantly through clean vector calculations.
          </p>
        </div>

        {/* Calculation Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-primary/5 border-b border-primary/10">
                  <th className="font-table-head p-4">Standard Brand</th>
                  <th className="font-table-head p-4 text-right">Sum of Spend</th>
                  <th className="font-table-head p-4 text-right">Sum of Revenue</th>
                  <th className="font-table-head p-4 text-right">CTR</th>
                  <th className="font-table-head p-4 text-right">CPC</th>
                  <th className="font-table-head p-4 text-right">CPA</th>
                  <th className="font-table-head p-4 text-right">Calculated ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {engineRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted">
                      No computed results found. Make sure raw ingestion is populated.
                    </td>
                  </tr>
                ) : (
                  engineRows.map((row, index) => {
                    const spendBarPercent = (row.spend / maxSpend) * 100;
                    const revenueBarPercent = (row.revenue / maxRevenue) * 100;
                    const target = targetRoasMap[row.standardClient] || 2.0;
                    const isUnderperforming = row.roas < target;

                    return (
                      <tr 
                        key={row.standardClient} 
                        className={`hover:bg-primary/5 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-bg"}`}
                      >
                        {/* Client name */}
                        <td className="p-4 font-bold text-primary text-sm">{row.standardClient}</td>
                        
                        {/* Spend with inline data bar */}
                        <td className="p-4 text-right min-w-[180px]">
                          <div className="font-semibold text-primary">{fmtCurrency(row.spend)}</div>
                          <div className="mt-1 flex items-center justify-end gap-2">
                            <span className="text-[10px] text-muted">{spendBarPercent.toFixed(0)}%</span>
                            <div className="w-24 data-bar-track">
                              <div 
                                className="data-bar-fill" 
                                style={{ width: `${spendBarPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Revenue with inline data bar */}
                        <td className="p-4 text-right min-w-[180px]">
                          <div className="font-semibold text-primary">{fmtCurrency(row.revenue)}</div>
                          <div className="mt-1 flex items-center justify-end gap-2">
                            <span className="text-[10px] text-muted">{revenueBarPercent.toFixed(0)}%</span>
                            <div className="w-24 data-bar-track">
                              <div 
                                className="data-bar-fill" 
                                style={{ width: `${revenueBarPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* CTR */}
                        <td className="p-4 text-right text-primary font-medium">{fmtPercent(row.ctr)}</td>
                        
                        {/* CPC */}
                        <td className="p-4 text-right text-muted">{fmtCurrency(row.cpc)}</td>
                        
                        {/* CPA */}
                        <td className="p-4 text-right text-muted">{fmtCurrency(row.cpa)}</td>
                        
                        {/* ROAS Status Badge */}
                        <td className="p-4 text-right">
                          <span className={`badge-pill text-xs px-3 py-1 font-bold ${isUnderperforming ? "bg-negative/10 text-negative" : "bg-primary/5 text-primary"}`}>
                            {row.roas.toFixed(2)}x
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 7. QA Validation Module Tab
  const renderValidationTab = () => {
    return (
      <div className="space-y-8 animate-fade-up">
        {/* Intro */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-heading-eb text-2xl text-primary font-medium">Discrepancy QA Validation Module</h2>
          <p className="text-muted text-xs mt-1">
            Sheet 5 validation table. Compares calculated ad spends against manually uploaded legacy report sheets to audited margins.
          </p>
        </div>

        {/* Warning notification banner if mismatches exist */}
        {diagnostics.mismatchesCount > 0 && (
          <div className="bg-negative/5 border border-negative/20 text-negative p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h5 className="font-semibold uppercase tracking-wide text-xs">Variance Mismatch Warnings detected</h5>
              <p className="text-xs mt-1">
                Calculated database spends do not match legacy ledger numbers on {diagnostics.mismatchesCount} brands! Inspect yellow-colored override cells below to verify tracking omissions.
              </p>
            </div>
          </div>
        )}

        {/* Validation Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-primary/5 border-b border-primary/10">
                  <th className="font-table-head p-4">Standard Brand Name</th>
                  <th className="font-table-head p-4 text-right">Model Calculated Spend</th>
                  <th className="font-table-head p-4 text-right">Legacy Manual Ledger (Editable)</th>
                  <th className="font-table-head p-4 text-right">Discrepancy Variance</th>
                  <th className="font-table-head p-4 text-center">Status Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {validationRows.map((row, index) => {
                  const isConsistent = Math.abs(row.variance) < 0.05;

                  return (
                    <tr 
                      key={row.clientName} 
                      className={`hover:bg-primary/5 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-bg"} ${!isConsistent ? "bg-negative-bg" : ""}`}
                    >
                      <td className="p-4 font-bold text-primary">{row.clientName}</td>
                      <td className="p-4 text-right font-semibold text-primary">{fmtCurrency(row.newSpend)}</td>
                      
                      {/* Manual Override editable column */}
                      <td className="p-4 text-right">
                        <input 
                          type="number" 
                          step="0.01"
                          value={row.legacySpend} 
                          onChange={(e) => handleUpdateLegacySpend(row.clientName, Number(e.target.value))}
                          className="editable-input text-right font-medium w-36"
                        />
                      </td>

                      {/* Variance */}
                      <td className={`p-4 text-right font-semibold ${isConsistent ? "text-primary" : "text-negative"}`}>
                        {row.variance === 0 ? "$0.00" : (row.variance > 0 ? "+" : "") + fmtCurrency(row.variance)}
                      </td>

                      {/* Status pill */}
                      <td className="p-4 text-center">
                        <span className={`badge-pill text-xs px-3 py-1 font-bold ${isConsistent ? "bg-primary/5 text-primary" : "bg-negative/10 text-negative"}`}>
                          {isConsistent ? "✅ Consistent" : "❌ Mismatch"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 8. Admin & Diagnostics Hub Tab
  const renderAdminTab = () => {
    return (
      <div className="space-y-8 animate-fade-up">
        {/* Intro */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-heading-eb text-2xl text-primary font-medium">Administration Hub & Operations Diagnostics</h2>
          <p className="text-muted text-xs mt-1">
            System logs, database health diagnostics, backup managers and manual state reset tools.
          </p>
        </div>

        {/* Grid tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Operations & Diagnostic Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <h3 className="font-heading-eb text-lg text-primary font-medium">Standardization Health Report</h3>
            
            <div className="space-y-4">
              {/* Mapping health bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-primary">Semantic Mapping Health Score</span>
                  <span className={`font-bold ${diagnostics.mappingHealthScore > 90 ? "text-primary" : "text-negative"}`}>
                    {diagnostics.mappingHealthScore}%
                  </span>
                </div>
                <div className="h-3 w-full bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${diagnostics.mappingHealthScore}%` }}
                  />
                </div>
              </div>

              {/* Stat breakdown */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3 bg-bg rounded-lg">
                  <span className="text-muted block text-[10px] uppercase">Calculated spend</span>
                  <span className="font-display text-lg text-primary font-bold mt-1 block">
                    {fmtCurrency(diagnostics.totalSpendCalculated)}
                  </span>
                </div>
                <div className="p-3 bg-bg rounded-lg">
                  <span className="text-muted block text-[10px] uppercase">Variance issues</span>
                  <span className={`font-display text-lg font-bold mt-1 block ${diagnostics.mismatchesCount > 0 ? "text-negative" : "text-primary"}`}>
                    {diagnostics.mismatchesCount} brands
                  </span>
                </div>
              </div>

              {/* Unmapped Warning Logs */}
              <div className="space-y-2">
                <h4 className="font-semibold text-xs text-primary uppercase">Unclassified Campaign Names</h4>
                {diagnostics.unmappedCampaigns.length === 0 ? (
                  <div className="text-xs text-primary/70 bg-primary/5 p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    All campaign name strings mapped correctly! 100% data coverage.
                  </div>
                ) : (
                  <div className="bg-negative/5 p-3 rounded-lg border border-negative/15 text-xs text-negative max-h-[120px] overflow-y-auto space-y-1">
                    {diagnostics.unmappedCampaigns.map((name, i) => (
                      <div key={i} className="font-mono text-[11px] truncate">⚠️ {name}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-xs text-primary uppercase">Unmapped Platform Source IDs</h4>
                {diagnostics.unmappedSources.length === 0 ? (
                  <div className="text-xs text-primary/70 bg-primary/5 p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    All connected platform channels mapped correctly!
                  </div>
                ) : (
                  <div className="bg-primary/5 p-3 rounded-lg text-xs text-primary/80 max-h-[100px] overflow-y-auto space-y-1">
                    {diagnostics.unmappedSources.map((src, i) => (
                      <div key={i} className="font-mono text-[11px]">❓ "{src}" mapped to standard "Other" platform.</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Backup Management Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <h3 className="font-heading-eb text-lg text-primary font-medium">Backup Management & System Commands</h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-bg text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Local Storage Status:</span>
                  <span className="font-bold text-primary">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Last Local Save Time:</span>
                  <span className="font-semibold text-accent">{lastSaved || "Never"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Auto-Saving Engine:</span>
                  <span className="font-medium text-primary">Enabled (On change)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export Backup */}
                <button 
                  onClick={handleExportBackup}
                  className="interactive-element flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/95 font-semibold text-xs py-3 px-4 rounded-lg shadow-sm cursor-pointer"
                >
                  <Download className="h-4 w-4" /> Export Backup
                </button>

                {/* Import Backup */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="interactive-element flex items-center justify-center gap-2 bg-white text-primary border border-primary hover:bg-primary/5 font-semibold text-xs py-3 px-4 rounded-lg shadow-sm cursor-pointer"
                >
                  <Upload className="h-4 w-4" /> Import Backup
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImportBackup}
                  className="hidden" 
                  accept=".json"
                />
              </div>

              {/* Reset Data */}
              <div className="border-t border-border pt-4 mt-6">
                <h4 className="font-semibold text-xs text-primary uppercase">Dangerous Area</h4>
                <p className="text-muted text-[11px] mt-1">Restores all database schemas back to default Excel template values.</p>
                <button 
                  onClick={handleResetData}
                  className="interactive-element mt-3 w-full flex items-center justify-center gap-2 bg-negative text-white hover:bg-negative/95 font-semibold text-xs py-3 px-4 rounded-lg cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" /> Reset Data to Original Defaults
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F2] text-[#051C2C] flex flex-col font-body-custom overflow-x-hidden">
      
      {/* ── HIGH DENSITY STICKY TOP NAV BAR (56px) ── */}
      <nav className="sticky top-0 z-50 h-[56px] bg-white border-b border-gray-200 px-6 lg:px-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-8 overflow-hidden h-full">
          {/* Left Side Brand Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 bg-[#051C2C] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">Σ</span>
            </div>
            <span className="font-bold tracking-tight text-md text-[#051C2C] uppercase">
              MEDIA<span className="text-[#2251FF] font-black">.hub</span>
            </span>
          </div>

          {/* Right tab page switchers directly in the header */}
          <div className="flex items-center gap-4 lg:gap-6 h-full overflow-x-auto no-scrollbar scroll-smooth shrink-0">
            <button 
              onClick={() => setActiveTab("dashboard")} 
              className={`h-full px-1 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all flex items-center shrink-0 ${activeTab === "dashboard" ? "border-[#2251FF] text-[#2251FF]" : "border-transparent text-[#888888] hover:text-[#051C2C]"}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab("client-perf")} 
              className={`h-full px-1 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all flex items-center shrink-0 ${activeTab === "client-perf" ? "border-[#2251FF] text-[#2251FF]" : "border-transparent text-[#888888] hover:text-[#051C2C]"}`}
            >
              Client deep-dive
            </button>
            <button 
              onClick={() => setActiveTab("config")} 
              className={`h-full px-1 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all flex items-center shrink-0 ${activeTab === "config" ? "border-[#2251FF] text-[#2251FF]" : "border-transparent text-[#888888] hover:text-[#051C2C]"}`}
            >
              Config rules
            </button>
            <button 
              onClick={() => setActiveTab("raw-data")} 
              className={`h-full px-1 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all flex items-center shrink-0 ${activeTab === "raw-data" ? "border-[#2251FF] text-[#2251FF]" : "border-transparent text-[#888888] hover:text-[#051C2C]"}`}
            >
              Supermetrics facts
            </button>
            <button 
              onClick={() => setActiveTab("standardized")} 
              className={`h-full px-1 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all flex items-center shrink-0 ${activeTab === "standardized" ? "border-[#2251FF] text-[#2251FF]" : "border-transparent text-[#888888] hover:text-[#051C2C]"}`}
            >
              Clean Facts
            </button>
            <button 
              onClick={() => setActiveTab("engine")} 
              className={`h-full px-1 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all flex items-center shrink-0 ${activeTab === "engine" ? "border-[#2251FF] text-[#2251FF]" : "border-transparent text-[#888888] hover:text-[#051C2C]"}`}
            >
              Metrics Engine
            </button>
            <button 
              onClick={() => setActiveTab("validation")} 
              className={`h-full px-1 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all flex items-center shrink-0 ${activeTab === "validation" ? "border-[#2251FF] text-[#2251FF]" : "border-transparent text-[#888888] hover:text-[#051C2C]"}`}
            >
              QA Audit
            </button>
            <button 
              onClick={() => setActiveTab("admin")} 
              className={`h-full px-1 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all flex items-center shrink-0 ${activeTab === "admin" ? "border-[#2251FF] text-[#2251FF]" : "border-transparent text-[#888888] hover:text-[#051C2C]"}`}
            >
              Diagnostics
            </button>
          </div>
        </div>

        {/* Right Side Utility & Save Indicators */}
        <div className="flex items-center gap-4 text-xs shrink-0 h-full">
          {/* Last saved & Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 text-xs border-r border-gray-200 pr-4 h-full">
            <span className="h-2 w-2 rounded-full bg-[#2251FF] animate-pulse" />
            <span className="text-[#888888]">{saveIndicator}</span>
            <span className="text-[#888888] ml-2">| Last saved: <span className="text-[#051C2C] font-semibold">{lastSaved}</span></span>
          </div>

          {/* Quick Toolbar Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportBackup} 
              className="px-2.5 py-1.5 rounded bg-gray-100 hover:bg-gray-200 font-semibold text-[#051C2C] text-[11px] tracking-wide transition-colors flex items-center gap-1 cursor-pointer"
              title="Quick download JSON backup"
            >
              <Download className="h-3 w-3" /> EXPORT
            </button>
            <button 
              onClick={handleResetData} 
              className="px-2.5 py-1.5 rounded text-red-600 font-semibold text-[11px] tracking-wide hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset data tables"
            >
              <RotateCcw className="h-3 w-3" /> RESET
            </button>
          </div>
        </div>
      </nav>

      {/* ── BANNER BANNER NOTIFICATION (MODAL DISSOLVING FEEDBACK) ── */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-[#051C2C] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 border-l-4 border-[#2251FF] text-xs">
            <CheckCircle2 className="h-4 w-4 text-[#2251FF]" />
            <span className="font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      {/* ── HIGH DENSITY CONTENT LAYOUT ZONE ── */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 lg:px-10 pt-8 pb-10 flex flex-col gap-6">
        
        {/* Render Active Tab Page with key-based fadeUp animation */}
        <div key={activeTab} className="animate-fade-up flex-1 flex flex-col gap-6">
          {activeTab === "dashboard" && renderDashboardTab()}
          {activeTab === "client-perf" && renderClientPerformanceTab()}
          {activeTab === "config" && renderConfigTab()}
          {activeTab === "raw-data" && renderRawDataTab()}
          {activeTab === "standardized" && renderStandardizedTab()}
          {activeTab === "engine" && renderEngineTab()}
          {activeTab === "validation" && renderValidationTab()}
          {activeTab === "admin" && renderAdminTab()}
        </div>

      </main>

      {/* ── FOOTER ZONE ── */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-[#888888] text-[11px] uppercase tracking-wider shrink-0">
        <div className="max-w-[1400px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>Paid Media Marketing Hub &copy; {new Date().getFullYear()} - Full Analytical Excel Engine.</span>
          <div className="flex gap-4">
            <span>Formulas: Active Frontend JS</span>
            <span>|</span>
            <span>Storage: Local Cache Standard</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
