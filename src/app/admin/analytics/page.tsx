"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, Users, MousePointer, MapPin, Calendar, Settings, Download, 
  RefreshCw, ArrowLeft, Eye, Hourglass, ChevronsDown, 
  Activity, Monitor, Globe, Play, Trash2, 
  ShieldAlert, ShieldCheck, ChevronRight
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#00F0FF", "#3B82F6", "#8B5CF6", "#EC4899", "#10B981"];

interface MetricSummary {
  totalSessions: number;
  uniqueVisitors: number;
  returningSessions: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface TimeSeriesData {
  date: string;
  views: number;
  sessions: number;
}

interface DonutItem {
  name: string;
  value: number;
}

interface PageItem {
  url: string;
  count: number;
}

interface ClickItem {
  label: string;
  count: number;
}

interface SectionItem {
  name: string;
  views: number;
  avgDuration: number;
}

interface ScrollItem {
  depth: number;
  count: number;
}

interface LiveFeedItem {
  id: string;
  sessionId: string;
  type: string;
  url: string;
  timestamp: string;
  label: string;
}

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  const [range, setRange] = useState<string>("7d");
  const [activeTab, setActiveTab] = useState<"overview" | "heatmap" | "settings">("overview");
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const [summary, setSummary] = useState<MetricSummary>({
    totalSessions: 0,
    uniqueVisitors: 0,
    returningSessions: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
  });
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [devices, setDevices] = useState<DonutItem[]>([]);
  const [browsers, setBrowsers] = useState<DonutItem[]>([]);
  const [oss, setOss] = useState<DonutItem[]>([]);
  const [geography, setGeography] = useState<DonutItem[]>([]);
  const [topPages, setTopPages] = useState<PageItem[]>([]);
  const [topClicks, setTopClicks] = useState<ClickItem[]>([]);
  const [topSections, setTopSections] = useState<SectionItem[]>([]);
  const [scrolls, setScrolls] = useState<ScrollItem[]>([]);

  const [activeUsersNow, setActiveUsersNow] = useState<number>(0);
  const [activePagesNow, setActivePagesNow] = useState<PageItem[]>([]);
  const [liveFeed, setLiveFeed] = useState<LiveFeedItem[]>([]);

  const [heatmapUrl, setHeatmapUrl] = useState<string>("/");
  const [heatmapPoints, setHeatmapPoints] = useState<{ x: number; y: number }[]>([]);
  const [loadingHeatmap, setLoadingHeatmap] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [retentionDays, setRetentionDays] = useState<number>(90);
  const [pruneResult, setPruneResult] = useState<string>("");
  const [pruning, setPruning] = useState<boolean>(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/login");
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) {
            setAuthenticated(true);
          } else {
            router.push("/admin");
          }
        } else {
          router.push("/admin");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/admin");
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!authenticated) return;

    async function loadOverview() {
      setLoadingData(true);
      try {
        const res = await fetch(`/api/admin/analytics/overview?range=${range}`);
        if (res.ok) {
          const data = await res.json();
          setSummary(data.summary);
          setTimeSeries(data.timeSeries);
          setDevices(data.distributions.devices);
          setBrowsers(data.distributions.browsers);
          setOss(data.distributions.operatingSystems);
          setGeography(data.distributions.geography);
          setTopPages(data.topPages);
          setTopClicks(data.topClicks);
          setTopSections(data.topSections);
          setScrolls(data.scrolls);
        }
      } catch (err) {
        console.error("Failed to load overview data:", err);
      } finally {
        setLoadingData(false);
      }
    }

    loadOverview();
  }, [authenticated, range]);

  useEffect(() => {
    if (!authenticated) return;

    async function fetchRealtime() {
      try {
        const res = await fetch("/api/admin/analytics/realtime");
        if (res.ok) {
          const data = await res.json();
          setActiveUsersNow(data.activeCount);
          setActivePagesNow(data.activePages);
          setLiveFeed(data.liveFeed);
        }
      } catch (err) {
        console.warn("Failed to fetch realtime feed:", err);
      }
    }

    fetchRealtime();
    const interval = setInterval(fetchRealtime, 10000);
    return () => clearInterval(interval);
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated || activeTab !== "heatmap") return;

    async function fetchHeatmap() {
      setLoadingHeatmap(true);
      try {
        const res = await fetch(`/api/admin/analytics/heatmap?url=${encodeURIComponent(heatmapUrl)}&range=${range}`);
        if (res.ok) {
          const data = await res.json();
          setHeatmapPoints(data.points);
        }
      } catch (err) {
        console.error("Failed to load heatmap:", err);
      } finally {
        setLoadingHeatmap(false);
      }
    }

    fetchHeatmap();
  }, [authenticated, heatmapUrl, range, activeTab]);

  useEffect(() => {
    if (!authenticated) return;
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/analytics/settings");
        if (res.ok) {
          const data = await res.json();
          setRetentionDays(data.retentionDays);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
    loadSettings();
  }, [authenticated]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeTab !== "heatmap") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = 1500;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "screen";

      heatmapPoints.forEach((p) => {
        const px = (p.x / 100) * canvas.width;
        const py = (p.y / 100) * canvas.height;
        const radius = 24;

        const grad = ctx.createRadialGradient(px, py, 1, px, py, radius);
        grad.addColorStop(0, "rgba(0, 240, 255, 0.7)");
        grad.addColorStop(0.2, "rgba(0, 240, 255, 0.45)");
        grad.addColorStop(0.5, "rgba(239, 68, 68, 0.25)");
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [heatmapPoints, activeTab]);

  const formatDuration = (seconds: number): string => {
    if (seconds <= 0) return "0s";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const handleSaveRetention = async () => {
    try {
      const res = await fetch("/api/admin/analytics/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retentionDays }),
      });
      if (res.ok) {
        alert("Data retention policy updated successfully!");
      }
    } catch {
      alert("Failed to update retention policy.");
    }
  };

  const handlePrune = async () => {
    if (!confirm("Are you sure you want to prune old database records? This cannot be undone.")) return;
    setPruning(true);
    setPruneResult("");
    try {
      const res = await fetch("/api/admin/analytics/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "prune" }),
      });
      if (res.ok) {
        const data = await res.json();
        setPruneResult(data.message);
      }
    } catch {
      setPruneResult("Pruning request failed.");
    } finally {
      setPruning(false);
    }
  };

  const handleExport = (format: "csv" | "json") => {
    window.open(`/api/admin/analytics/export?range=${range}&format=${format}`, "_blank");
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#050507] text-[#f5f5f7] flex flex-col justify-center items-center gap-4">
        <RefreshCw className="animate-spin text-[#00F0FF] h-12 w-12" />
        <p className="font-mono text-sm tracking-widest text-[#8e8e93] uppercase">
          Verifying security credential authorization...
        </p>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-[#050507] text-[#f5f5f7] flex flex-col selection:bg-[#00F0FF]/20 selection:text-[#00F0FF] relative overflow-x-hidden font-sans">
      
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none bg-gradient-to-b from-[#00F0FF]/5 via-transparent to-transparent z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] pointer-events-none rounded-full bg-purple-600/5 blur-[120px] z-0" />

      <header className="relative z-10 border-b border-white/5 bg-[#08080c]/85 backdrop-blur-md sticky top-0 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/admin")}
            className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <ArrowLeft className="h-4 w-4 text-[#8e8e93] group-hover:text-[#00F0FF] transition-colors" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#00F0FF]" />
              <h1 className="text-xl font-bold font-display tracking-tight text-white">
                Enterprise Analytics & Heatmap Dashboard
              </h1>
            </div>
            <p className="text-xs text-[#8e8e93]">
              TechySaumya Portfolio Traffic Metrics & Interaction Logs
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "overview" 
                  ? "bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/25" 
                  : "text-[#8e8e93] hover:text-white border border-transparent"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("heatmap")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "heatmap" 
                  ? "bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/25" 
                  : "text-[#8e8e93] hover:text-white border border-transparent"
              }`}
            >
              Heatmaps
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "settings" 
                  ? "bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/25" 
                  : "text-[#8e8e93] hover:text-white border border-transparent"
              }`}
            >
              Settings
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#8e8e93]" />
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#00F0FF]/50 text-white cursor-pointer"
            >
              <option value="24h" className="bg-[#0b0b10]">Last 24 Hours</option>
              <option value="7d" className="bg-[#0b0b10]">Last 7 Days</option>
              <option value="30d" className="bg-[#0b0b10]">Last 30 Days</option>
              <option value="90d" className="bg-[#0b0b10]">Last 90 Days</option>
            </select>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        
        <section className="bg-gradient-to-r from-[#00F0FF]/10 to-purple-600/5 rounded-2xl border border-white/5 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-display text-white tracking-tight">
                  {activeUsersNow}
                </span>
                <span className="text-xs font-semibold text-[#8e8e93] tracking-wide uppercase">
                  Active Users Right Now
                </span>
              </div>
              <p className="text-xs text-[#8e8e93] mt-0.5">
                Dynamic stateless websocket-free heartbeat feed (10s poll cycle)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {activePagesNow.length === 0 ? (
              <span className="text-xs text-[#8e8e93] italic">Waiting for telemetry connection...</span>
            ) : (
              activePagesNow.map((p, idx) => (
                <div 
                  key={idx} 
                  className="bg-black/45 border border-white/10 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2"
                >
                  <span className="font-semibold text-[#00F0FF]">{p.url}</span>
                  <span className="bg-[#00F0FF]/20 text-[#00F0FF] px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {p.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {activeTab === "overview" && (
          <div className="flex flex-col gap-6">
            
            <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-5 flex flex-col gap-1.5 relative overflow-hidden group">
                <div className="flex justify-between items-center text-[#8e8e93]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Sessions</span>
                  <Activity className="h-4 w-4 text-[#00F0FF]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
                  {loadingData ? "..." : summary.totalSessions}
                </div>
                <span className="text-[10px] text-[#8e8e93]">Total session iterations</span>
              </div>

              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-5 flex flex-col gap-1.5 relative overflow-hidden group">
                <div className="flex justify-between items-center text-[#8e8e93]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Unique Visitors</span>
                  <Users className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
                  {loadingData ? "..." : summary.uniqueVisitors}
                </div>
                <span className="text-[10px] text-[#8e8e93]">Distinct browser devices</span>
              </div>

              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-5 flex flex-col gap-1.5 relative overflow-hidden group">
                <div className="flex justify-between items-center text-[#8e8e93]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Returning Sessions</span>
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
                  {loadingData ? "..." : summary.returningSessions}
                </div>
                <span className="text-[10px] text-[#8e8e93]">Returning visitor count</span>
              </div>

              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-5 flex flex-col gap-1.5 relative overflow-hidden group">
                <div className="flex justify-between items-center text-[#8e8e93]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Bounce Rate</span>
                  <Hourglass className="h-4 w-4 text-rose-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-[#f43f5e] mt-1">
                  {loadingData ? "..." : `${summary.bounceRate}%`}
                </div>
                <span className="text-[10px] text-[#8e8e93]">Single page exit ratio</span>
              </div>

              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-5 flex flex-col gap-1.5 relative overflow-hidden group">
                <div className="flex justify-between items-center text-[#8e8e93]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Avg Session Time</span>
                  <Eye className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
                  {loadingData ? "..." : formatDuration(summary.avgSessionDuration)}
                </div>
                <span className="text-[10px] text-[#8e8e93]">Engaged time average</span>
              </div>
            </section>

            <section className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Visitors & Pageviews Over Time</h3>
                  <p className="text-xs text-[#8e8e93] mt-0.5">Visual traffic flow mapping</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-[#00F0FF]">
                    <span className="h-2 w-2 rounded-full bg-[#00F0FF]"></span> Pageviews
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <span className="h-2 w-2 rounded-full bg-purple-400"></span> Sessions
                  </span>
                </div>
              </div>

              <div className="h-[300px] w-full">
                {loadingData ? (
                  <div className="h-full w-full flex justify-center items-center">
                    <RefreshCw className="h-8 w-8 text-[#00F0FF] animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="rgba(255,255,255,0.3)" 
                        fontSize={10}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.3)" 
                        fontSize={10} 
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#0d0d15", 
                          borderColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          color: "#fff"
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="views" 
                        stroke="#00F0FF" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorViews)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sessions" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorSessions)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-6 flex flex-col">
                <h4 className="text-sm font-bold text-white font-display flex items-center gap-2 mb-4">
                  <Monitor className="h-4 w-4 text-[#00F0FF]" /> Device Distribution
                </h4>
                <div className="h-[200px] relative flex justify-center items-center">
                  {loadingData ? (
                    <RefreshCw className="h-6 w-6 animate-spin text-[#00F0FF]" />
                  ) : devices.length === 0 ? (
                    <span className="text-xs text-[#8e8e93] italic">No device data</span>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={devices}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {devices.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#0d0d15", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          iconSize={8} 
                          formatter={(value) => <span className="text-[11px] text-[#8e8e93]">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-6 flex flex-col">
                <h4 className="text-sm font-bold text-white font-display flex items-center gap-2 mb-4">
                  <Globe className="h-4 w-4 text-purple-400" /> Browsers Used
                </h4>
                <div className="h-[200px] relative flex justify-center items-center">
                  {loadingData ? (
                    <RefreshCw className="h-6 w-6 animate-spin text-purple-400" />
                  ) : browsers.length === 0 ? (
                    <span className="text-xs text-[#8e8e93] italic">No browser data</span>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={browsers}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {browsers.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#0d0d15", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          iconSize={8} 
                          formatter={(value) => <span className="text-[11px] text-[#8e8e93]">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-6 flex flex-col">
                <h4 className="text-sm font-bold text-white font-display flex items-center gap-2 mb-4">
                  <Settings className="h-4 w-4 text-emerald-400" /> Operating Systems
                </h4>
                <div className="h-[200px] relative flex justify-center items-center">
                  {loadingData ? (
                    <RefreshCw className="h-6 w-6 animate-spin text-emerald-400" />
                  ) : oss.length === 0 ? (
                    <span className="text-xs text-[#8e8e93] italic">No OS data</span>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={oss}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {oss.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#0d0d15", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          iconSize={8} 
                          formatter={(value) => <span className="text-[11px] text-[#8e8e93]">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-6 flex flex-col">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2 mb-4">
                  <Eye className="h-4 w-4 text-[#00F0FF]" /> Top Pages Viewed
                </h3>
                <div className="flex-grow overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-[#8e8e93] text-left">
                        <th className="pb-3 font-semibold uppercase tracking-wider">Page Pathway</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-right">Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingData ? (
                        <tr><td colSpan={2} className="py-4 text-center text-[#8e8e93]">Loading...</td></tr>
                      ) : topPages.length === 0 ? (
                        <tr><td colSpan={2} className="py-4 text-center text-[#8e8e93] italic">No traffic logged</td></tr>
                      ) : (
                        topPages.map((page, idx) => (
                          <tr key={idx} className="hover:bg-white/2 transition-colors">
                            <td className="py-3 font-medium text-white flex items-center gap-1.5">
                              <ChevronRight className="h-3 w-3 text-[#00F0FF]" /> {page.url}
                            </td>
                            <td className="py-3 text-right font-mono font-bold text-[#00F0FF]">
                              {page.count}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-6 flex flex-col">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2 mb-4">
                  <MousePointer className="h-4 w-4 text-purple-400" /> Interactive Clicks
                </h3>
                <div className="flex-grow overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-[#8e8e93] text-left">
                        <th className="pb-3 font-semibold uppercase tracking-wider">Button / Action Label</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-right">Clicks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingData ? (
                        <tr><td colSpan={2} className="py-4 text-center text-[#8e8e93]">Loading...</td></tr>
                      ) : topClicks.length === 0 ? (
                        <tr><td colSpan={2} className="py-4 text-center text-[#8e8e93] italic">No interactive clicks logged</td></tr>
                      ) : (
                        topClicks.map((click, idx) => (
                          <tr key={idx} className="hover:bg-white/2 transition-colors">
                            <td className="py-3 font-medium text-white max-w-[280px] truncate">
                              {click.label}
                            </td>
                            <td className="py-3 text-right font-mono font-bold text-purple-400">
                              {click.count}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-6 flex flex-col">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2 mb-4">
                  <Hourglass className="h-4 w-4 text-emerald-400" /> Section Visibility Times
                </h3>
                <div className="flex-grow overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-[#8e8e93] text-left">
                        <th className="pb-3 font-semibold uppercase tracking-wider">Section Name</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-center">Views</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-right">Avg Visibility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingData ? (
                        <tr><td colSpan={3} className="py-4 text-center text-[#8e8e93]">Loading...</td></tr>
                      ) : topSections.length === 0 ? (
                        <tr><td colSpan={3} className="py-4 text-center text-[#8e8e93] italic">No section logs</td></tr>
                      ) : (
                        topSections.map((sec, idx) => (
                          <tr key={idx} className="hover:bg-white/2 transition-colors">
                            <td className="py-3 font-medium text-white">{sec.name}</td>
                            <td className="py-3 text-center font-bold text-[#8e8e93]">{sec.views}</td>
                            <td className="py-3 text-right font-mono font-bold text-emerald-400">
                              {sec.avgDuration}s
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-6 flex flex-col">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2 mb-4">
                  <ChevronsDown className="h-4 w-4 text-[#00F0FF]" /> Scroll Milestones Reached
                </h3>
                <div className="flex flex-col gap-4 mt-2 justify-center">
                  {loadingData ? (
                    <div className="py-6 text-center text-[#8e8e93] text-xs">Loading...</div>
                  ) : scrolls.length === 0 ? (
                    <div className="py-6 text-center text-[#8e8e93] text-xs italic">No scroll depth logs</div>
                  ) : (
                    scrolls.map((s, idx) => {
                      const maxCount = Math.max(...scrolls.map((sc) => sc.count)) || 1;
                      const percentBar = (s.count / maxCount) * 100;
                      return (
                        <div key={idx} className="flex flex-col gap-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span className="text-white">Reached {s.depth}% Depth</span>
                            <span className="font-mono text-[#00F0FF]">{s.count} hits</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#00F0FF] to-blue-500 rounded-full"
                              style={{ width: `${percentBar}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-6 flex flex-col">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-purple-400" /> Geography Rankings (City/Region/Country)
                </h3>
                <div className="flex-grow overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-[#8e8e93] text-left">
                        <th className="pb-3 font-semibold uppercase tracking-wider">Location</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-right">Sessions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingData ? (
                        <tr><td colSpan={2} className="py-4 text-center text-[#8e8e93]">Loading...</td></tr>
                      ) : geography.length === 0 ? (
                        <tr><td colSpan={2} className="py-4 text-center text-[#8e8e93] italic">No geographic data logged</td></tr>
                      ) : (
                        geography.map((geo, idx) => (
                          <tr key={idx} className="hover:bg-white/2 transition-colors">
                            <td className="py-3 font-medium text-white flex items-center gap-1.5">
                              <Globe className="h-3.5 w-3.5 text-purple-400" /> {geo.name}
                            </td>
                            <td className="py-3 text-right font-mono font-bold text-purple-400">
                              {geo.value}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400 animate-pulse" /> Live Telemetry Interaction Log
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Streaming
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {liveFeed.length === 0 ? (
                    <div className="py-6 text-center text-[#8e8e93] text-xs italic">Waiting for clicks/views...</div>
                  ) : (
                    liveFeed.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-black/30 border border-white/5 p-3 rounded-xl flex items-center justify-between text-xs hover:border-white/10 transition-colors"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              item.type === "click" 
                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/20" 
                                : "bg-cyan-500/20 text-[#00F0FF] border border-cyan-500/20"
                            }`}>
                              {item.type}
                            </span>
                            <span className="text-white font-bold max-w-[180px] truncate">{item.label}</span>
                          </div>
                          <span className="text-[#8e8e93] text-[10px]">Path: {item.url}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#8e8e93]">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

          </div>
        )}

        {activeTab === "heatmap" && (
          <div className="flex flex-col gap-6">
            
            <section className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col gap-1 w-full md:w-auto">
                <h3 className="text-base font-bold text-white font-display">Click Heatmap Canvas</h3>
                <p className="text-xs text-[#8e8e93]">Normalized device-agnostic touch coordinate visualization</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#8e8e93] font-semibold">Select Route:</span>
                  <select
                    value={heatmapUrl}
                    onChange={(e) => setHeatmapUrl(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#00F0FF]/50 text-white cursor-pointer"
                  >
                    <option value="/" className="bg-[#0b0b10]">/ (Home)</option>
                    <option value="/photography" className="bg-[#0b0b10]">/photography</option>
                    <option value="/journey" className="bg-[#0b0b10]">/journey</option>
                    <option value="/resume" className="bg-[#0b0b10]">/resume</option>
                    <option value="/blog" className="bg-[#0b0b10]">/blog</option>
                  </select>
                </div>

                <div className="bg-[#00F0FF]/10 border border-[#00F0FF]/20 px-3 py-2 rounded-xl text-xs font-semibold text-[#00F0FF]">
                  {loadingHeatmap ? "Loading..." : `${heatmapPoints.length} Click Coordinates Logged`}
                </div>
              </div>
            </section>

            <section className="bg-[#0b0b11]/80 border border-white/5 rounded-3xl p-6 flex flex-col gap-4 relative">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8e8e93] flex items-center gap-1.5">
                  <Play className="h-3 w-3 text-[#00F0FF] fill-[#00F0FF]/20" /> Heatmap sandbox container (Scroll to view page depth)
                </span>
                <span className="text-[#8e8e93]">
                  Interactive frame disabled to protect scroll coordinate alignment
                </span>
              </div>

              <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-black/60 aspect-[16/10] w-full max-h-[600px] overflow-y-auto">
                <iframe 
                  src={heatmapUrl} 
                  className="w-full h-[1500px] border-none pointer-events-none"
                  style={{ opacity: 0.65 }}
                />
                <canvas 
                  ref={canvasRef} 
                  className="absolute top-0 left-0 w-full h-[1500px] pointer-events-none"
                />
              </div>
            </section>

          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Settings className="h-4 w-4 text-[#00F0FF]" /> Data Retention Policy
                </h3>
                <p className="text-xs text-[#8e8e93] mt-1">
                  Specify database pruning timelines for old analytics documents to optimize storage.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs text-[#8e8e93] font-semibold">Retention Period:</label>
                <select
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#00F0FF]/50 text-white cursor-pointer"
                >
                  <option value={30} className="bg-[#0b0b10]">30 Days</option>
                  <option value={90} className="bg-[#0b0b10]">90 Days (Recommended)</option>
                  <option value={180} className="bg-[#0b0b10]">180 Days</option>
                  <option value={365} className="bg-[#0b0b10]">365 Days</option>
                  <option value={0} className="bg-[#0b0b10]">Keep Indefinitely (0 days)</option>
                </select>
              </div>

              <button
                onClick={handleSaveRetention}
                className="bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 text-[#00F0FF] border border-[#00F0FF]/30 font-semibold text-xs py-3 rounded-xl transition-all w-full mt-2"
              >
                Save Retention Policy
              </button>

              <hr className="border-white/5 w-full my-1" />

              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Trash2 className="h-4.5 w-4.5 text-rose-400" /> Manual Prune Action
                </h4>
                <p className="text-[11px] text-[#8e8e93] mt-1">
                  Instantly execute collection pruning matching the saved threshold above to purge historical records.
                </p>
              </div>

              <button
                onClick={handlePrune}
                disabled={pruning}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold text-xs py-3 rounded-xl transition-all w-full flex items-center justify-center gap-2"
              >
                {pruning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Pruning Database...
                  </>
                ) : (
                  <>Prune Database Now</>
                )}
              </button>

              {pruneResult && (
                <div className="bg-white/3 border border-white/5 p-3 rounded-xl text-[11px] text-[#8e8e93] leading-relaxed font-mono">
                  {pruneResult}
                </div>
              )}
            </div>

            <div className="bg-[#0b0b11]/80 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Download className="h-4 w-4 text-purple-400" /> Export Telemetry Logs
                </h3>
                <p className="text-xs text-[#8e8e93] mt-1">
                  Download session traffic logs inside the selected date range ({range}).
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <div className="p-4 bg-black/45 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-white">Excel/CSV Format</span>
                    <span className="text-[10px] text-[#8e8e93]">Export table data for spreadsheet suites</span>
                  </div>
                  <button
                    onClick={() => handleExport("csv")}
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/35 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" /> CSV
                  </button>
                </div>

                <div className="p-4 bg-black/45 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-white">JSON Format</span>
                    <span className="text-[10px] text-[#8e8e93]">Download raw nested structures for databases</span>
                  </div>
                  <button
                    onClick={() => handleExport("json")}
                    className="bg-[#1e1b4b] hover:bg-[#312e81] text-[#c084fc] border border-[#4338ca] px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" /> JSON
                  </button>
                </div>
              </div>

              <hr className="border-white/5 w-full my-1" />

              <div className="bg-[#00F0FF]/5 border border-[#00F0FF]/15 p-4 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-[#00F0FF] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[#00F0FF] uppercase tracking-wider">Privacy & Audit Note</span>
                  <span className="text-[11px] text-[#8e8e93] leading-relaxed">
                    Export datasets do not contain IP addresses or identifiable user profile tracking fields. Country, Region, and City listings are computed exclusively at ingestion boundaries.
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      <footer className="mt-12 border-t border-white/5 py-6 text-center text-xs text-[#8e8e93] relative z-10">
        <p>© {new Date().getFullYear()} TechySaumya. Enterprise Tracking Console.</p>
      </footer>
    </div>
  );
}
