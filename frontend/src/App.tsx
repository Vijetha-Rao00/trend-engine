import React, { useState } from "react";
import { HeroShader } from "./components/HeroShader";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Compass,
  BrainCircuit,
  Tv,
  Newspaper,
  Sparkles,
  Loader2,
  RefreshCw,
  Building,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Play,
} from "lucide-react";
 
// Dynamically sanitizes any trailing slashes to prevent double slash routing errors [1]
const raw_api_base = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";
const API_BASE = raw_api_base.replace(/\/+$/, "");
 
// ── Recharts Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(2,2,10,0.92)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "12px 16px",
          borderRadius: 12,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>
          {label}
        </p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ fontSize: 11, fontWeight: 700, color: entry.stroke }}>
            {entry.name}:{" "}
            <span style={{ color: "rgba(255,255,255,0.9)" }}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};
 
// ── SVG liquid-glass distortion filter ───────────────────────────────────────
const GlassFilter = () => (
  <svg style={{ display: "none", position: "absolute" }} aria-hidden="true">
    <defs>
      <filter
        id="lq"
        x="-10%" y="-10%" width="120%" height="120%"
        filterUnits="objectBoundingBox"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence type="fractalNoise" baseFrequency="0.0012 0.005" numOctaves="1" seed="17" result="turb" />
        <feComponentTransfer in="turb" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turb" stdDeviation="3" result="soft" />
        <feSpecularLighting in="soft" surfaceScale="4" specularConstant="1" specularExponent="80" lightingColor="white" result="spec">
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite in="spec" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="lit" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="100" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);
 
// ── Liquid glass card shell (Optimized for GPU hardware acceleration) ──────────
interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  scrollable?: boolean;
}
 
const GlassCard: React.FC<GlassCardProps> = ({ children, style, className = "", scrollable }) => (
  <div className={className} style={{ position: "relative", borderRadius: 20, overflow: "hidden", ...style }}>
    {/* Fully GPU-accelerated backdrop blur and color overlay */}
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, borderRadius: 20,
      backdropFilter: "blur(32px) saturate(1.4)",
      WebkitBackdropFilter: "blur(32px) saturate(1.4)",
      isolation: "isolate",
    }} />
    {/* Dark obsidian polarized overlay to allow high contrast text visibility */}
    <div style={{ position: "absolute", inset: 0, zIndex: 1, borderRadius: 20, background: "rgba(4, 4, 8, 0.82)" }} />
    {/* Inner highlight rim */}
    <div style={{
      position: "absolute", inset: 0, zIndex: 2, borderRadius: 20, pointerEvents: "none",
      boxShadow: "inset 1.5px 1.5px 1px rgba(255,255,255,0.22), inset -1px -1px 1px rgba(255,255,255,0.1), 0 12px 40px rgba(0,0,0,0.5)",
    }} />
    {/* Border */}
    <div style={{
      position: "absolute", inset: 0, zIndex: 3, borderRadius: 20, pointerEvents: "none",
      border: "1px solid rgba(255,255,255,0.1)",
    }} />
    {/* Content container */}
    <div style={{
      position: "relative", zIndex: 4,
      padding: "24px 28px",
      overflowY: scrollable ? "auto" : "hidden",
      height: scrollable ? "100%" : undefined,
      boxSizing: "border-box",
    }} className={scrollable ? "glass-scroll" : ""}>
      {children}
    </div>
  </div>
);
 
// ── Tab pill nav ──────────────────────────────────────────────────────────────
const TABS = ["now", "moving", "act"] as const;
type Tab = typeof TABS[number];
 
const TabNav: React.FC<{ active: Tab; onChange: (t: Tab) => void }> = ({ active, onChange }) => (
  <GlassCard style={{ display: "inline-flex" }}>
    <div style={{ display: "flex", gap: 4, padding: "4px 4px" }}>
      {TABS.map((t) => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding: "7px 24px",
          borderRadius: 14,
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
          background: active === t ? "rgba(255,255,255,0.1)" : "transparent",
          color: active === t ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.32)",
          boxShadow: active === t ? "inset 1px 1px 1px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.25)" : "none",
        }}>
          {t === "now" ? "Now" : t === "moving" ? "Forecast" : "Execute"}
        </button>
      ))}
    </div>
  </GlassCard>
);
 
// ── Skeleton pulse ────────────────────────────────────────────────────────────
const Sk: React.FC<{ h?: number; w?: string; style?: React.CSSProperties }> = ({ h = 14, w = "100%", style }) => (
  <div className="sk" style={{ height: h, width: w, borderRadius: 8, background: "rgba(255,255,255,0.07)", ...style }} />
);
 
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState<"hero" | "exit" | "dash">("hero");
  const [loading, setLoading] = useState(false);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const [industry, setIndustry] = useState("real estate");
  const [keywordsInput, setKeywordsInput] = useState("Dubai real estate, off plan property, Dubai villa");
 
  const [keywordsList, setKeywordsList] = useState<string[]>([]);
  const [interestData, setInterestData] = useState<any>(null);
  const [momentumScores, setMomentumScores] = useState<any>(null);
  const [news, setNews] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [insight, setInsight] = useState("");
  const [forecast, setForecast] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("now");
 
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = keywordsInput.split(",").map(k => k.trim()).filter(Boolean);
    if (!parsed.length) { setError("Enter at least one keyword."); return; }
 
    setLoading(true);
    setError(null);
    setKeywordsList(parsed);
 
    const payload = { keywords: parsed, industry: industry.trim() };
 
    try {
      const [trendRes, ytRes] = await Promise.all([
        fetch(`${API_BASE}/trends/analyze`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch(`${API_BASE}/youtube/multi?max_results=5`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        }),
      ]);
 
      if (!trendRes.ok) throw new Error("Failed to fetch trend data.");
      const trendData = await trendRes.json();
      
      setKeywordsList(parsed);
      setInterestData(trendData.interest_over_time);
      setMomentumScores(trendData.momentum_scores);
      setNews(trendData.news);
      if (ytRes.ok) { const y = await ytRes.json(); setVideos(y.videos || []); }
 
      fetchInsight(parsed, industry);
      fetchForecast(parsed, industry);

      // Trigger exit animation only after successful retrieval
      setPhase("exit");
    } catch (err: any) {
      setError(err.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };
 
  // hero exit anim is 550ms — flip to dash after it's done
  React.useEffect(() => {
    if (phase !== "exit") return;
    const t = setTimeout(() => { setPhase("dash"); setActiveTab("now"); }, 550);
    return () => clearTimeout(t);
  }, [phase]);
 
  const fetchInsight = async (kw: string[], ind: string) => {
    setLoadingInsight(true);
    try {
      const r = await fetch(`${API_BASE}/trends/insight`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: kw, industry: ind }),
      });
      if (r.ok) { const d = await r.json(); setInsight(d.insight); }
      else setInsight("Insight could not be loaded.");
    } catch { setInsight("Network error fetching AI brief."); }
    finally { setLoadingInsight(false); }
  };
 
  const fetchForecast = async (kw: string[], ind: string) => {
    setLoadingForecast(true);
    try {
      const r = await fetch(`${API_BASE}/trends/forecast`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: kw, industry: ind }),
      });
      if (r.ok) { const d = await r.json(); setForecast(d.forecast); }
      else setForecast("Forecast could not be loaded.");
    } catch { setForecast("Network error fetching forecast."); }
    finally { setLoadingForecast(false); }
  };
 
  const handleReset = () => {
    setPhase("hero");
    setInterestData(null); setMomentumScores(null);
    setNews(null); setVideos([]); setInsight(""); setForecast("");
  };
 
  const getChartData = () => {
    if (!interestData || !Object.keys(interestData).length) return [];
    const firstKey = Object.keys(interestData)[0];
    return Object.keys(interestData[firstKey]).map(dateStr => {
      const entry: any = { date: dateStr.split(" ")[0].slice(5) };
      Object.keys(interestData).forEach(kw => { entry[kw] = interestData[kw][dateStr]; });
      return entry;
    });
  };

  // ── ADVANCED ANALYTICAL UPGRADES ───────────────────────────────────────────
  
  // 1. Volatility Index (Standard deviation of Google Trends baseline)
  const calculateVolatility = (kw: string) => {
    if (!interestData || !interestData[kw]) return { level: "Stable", desc: "Steady Baseline" };
    const vals: number[] = Object.values(interestData[kw]);
    if (vals.length < 2) return { level: "Stable", desc: "Steady Baseline" };
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
    const stdDev = Math.sqrt(variance);
    return stdDev > 14 
      ? { level: "High Volatility", desc: "Spike Trend / Rapid Fluctuations" }
      : { level: "Low Volatility", desc: "Stable Demand Base" };
  };

  // 2. Audience Passion Index (YouTube Engagement likes/views Ratio per 1K)
  const calculateAudiencePassion = () => {
    if (!videos || videos.length === 0) return { val: "0.0", text: "Low Passion", desc: "Passive consumption profile" };
    const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
    const totalLikes = videos.reduce((sum, v) => sum + v.likes, 0);
    if (totalViews === 0) return { val: "0.0", text: "Low Passion", desc: "Passive consumption profile" };
    const ratio = (totalLikes / totalViews) * 1000;
    let text = "Passive Views";
    let desc = "Low engagement index";
    if (ratio > 22) {
      text = "Active Passion";
      desc = "Highly engaged, supportive audience";
    } else if (ratio > 10) {
      text = "Healthy Interest";
      desc = "Standard interactive viewership";
    }
    return { val: ratio.toFixed(1), text, desc };
  };

  // 3. Market Saturation Score (Supply/Demand Opportunity)
  const calculateMarketOpportunity = (kw: string) => {
    const scoreObj = momentumScores?.[kw];
    if (!scoreObj) return { level: "Established Market", desc: "Balanced creator competition" };
    const demand = scoreObj.current_volume;
    const avgViews = videos.length > 0 ? videos.reduce((sum, v) => sum + v.views, 0) / videos.length : 0;
    if (demand > 28 && avgViews < 600000) {
      return { level: "Untapped Niche", desc: "High user interest, low competitive video supply" };
    }
    if (demand < 15 && avgViews > 1200000) {
      return { level: "Oversaturated", desc: "High competitive saturation, low active user demand" };
    }
    return { level: "Established Market", desc: "Stable demand matched with balanced supply" };
  };

  // 4. Trajectory speed (Acceleration index)
  const calculateTrendAcceleration = (kw: string) => {
    const scoreObj = momentumScores?.[kw];
    if (!scoreObj) return { level: "Steady", desc: "Normal momentum" };
    const m = scoreObj.momentum;
    if (m > 12) return { level: "Accelerating", desc: "Interest velocity gaining speed" };
    if (m < -8) return { level: "Decelerating", desc: "Interest velocity losing speed" };
    return { level: "Steady State", desc: "Consistent momentum path" };
  };
 
  const strokeColors = ["#6366f1", "#10b981", "#38bdf8"];
  const fillColors = ["rgba(99,102,241,0.08)", "rgba(16,185,129,0.08)", "rgba(56,189,248,0.08)"];
  const isHeroVisible = phase === "hero" || phase === "exit";
 
  return (
    <>
      {/* ── Global styles ─────────────────────────────── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root {
          width: 100%; height: 100%;
          background: #04040a;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          color: rgba(255,255,255,0.88);
          overflow: hidden;
        }
 
        /* viewport shell — always fills screen, no body scroll */
        .shell {
          position: fixed; inset: 0;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
 
        /* ── Hero layer ── */
        .hero-wrap {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          z-index: 20; pointer-events: all;
          will-change: transform, opacity;
        }
        .hero-wrap.exiting {
          animation: heroOut 0.55s cubic-bezier(0.4,0,1,1) forwards;
          pointer-events: none;
        }
        @keyframes heroOut {
          0%   { transform: translateY(0);     opacity: 1; }
          100% { transform: translateY(-8vh);  opacity: 0; }
        }
 
        /* ── Dashboard layer with custom deep blur overlay ── */
        .dash-wrap {
          position: absolute; inset: 0;
          z-index: 10; overflow-y: auto;
          transform: translateY(100%);
          pointer-events: none;
          will-change: transform;
          backdrop-filter: blur(48px) saturate(1.1);
          -webkit-backdrop-filter: blur(48px) saturate(1.1);
          background: rgba(4, 4, 8, 0.65);
          transition: transform 0.72s cubic-bezier(0.22,1,0.36,1);
        }
        .dash-wrap.entering {
          animation: dashIn 0.72s cubic-bezier(0.22,1,0.36,1) forwards;
          pointer-events: all;
        }
        .dash-wrap.visible {
          transform: translateY(0);
          pointer-events: all;
        }
        @keyframes dashIn {
          0%   { transform: translateY(100%); }
          100% { transform: translateY(0);    }
        }
 
        /* ── Cards stagger in ── */
        .card-in {
          opacity: 0;
          transform: translateY(14px);
          animation: cardIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes cardIn { to { opacity:1; transform:translateY(0); } }
 
        /* ── Skeleton ── */
        .sk { animation: skPulse 1.6s ease-in-out infinite; }
        @keyframes skPulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 0.15; }
        }
 
        /* ── Scrollbars ── */
        .glass-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.12) transparent; -webkit-overflow-scrolling: touch; }
        .glass-scroll::-webkit-scrollbar { width: 4px; }
        .glass-scroll::-webkit-scrollbar-track { background: transparent; }
        .glass-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
 
        /* ── Inputs (Slightly larger, dark-obsidian background) ── */
        .g-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 15px 18px;
          color: rgba(255, 255, 255, 0.95);
          font-size: 13px; font-family: inherit; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          outline: none;
          transition: border-color 0.18s, background 0.18s;
        }
        .g-input.normal { text-transform: none; font-weight: 500; }
        .g-input::placeholder { color: rgba(255,255,255,0.28); text-transform: none; }
        .g-input:focus { border-color: rgba(255,255,255,0.22); background: rgba(0, 0, 0, 0.7); }
 
        /* ── CTA button ── */
        .cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 16px 44px; border-radius: 99px; border: none; cursor: pointer;
          font-family: inherit; font-size: 12px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.88);
          background: rgba(255,255,255,0.09);
          box-shadow: inset 1.5px 1.5px 1px rgba(255,255,255,0.22),
                      inset -1px -1px 1px rgba(255,255,255,0.08),
                      0 6px 28px rgba(0,0,0,0.4);
          transition: transform 0.25s cubic-bezier(0.175,0.885,0.32,1.1),
                      box-shadow 0.25s;
          position: relative; overflow: hidden;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .cta:hover:not(:disabled) {
          transform: scale(1.04);
          box-shadow: inset 1.5px 1.5px 1px rgba(255,255,255,0.28),
                      0 10px 36px rgba(0,0,0,0.5);
        }
        .cta:active:not(:disabled) { transform: scale(0.97); }
        .cta:disabled { opacity: 0.3; cursor: not-allowed; }
 
        /* ── Back button ── */
        .back-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 7px 16px;
          font-family: inherit; font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.4); cursor: pointer; letter-spacing: 0.04em;
          transition: color 0.18s, background 0.18s;
        }
        .back-btn:hover { color: rgba(255,255,255,0.72); background: rgba(255,255,255,0.1); }
 
        /* ── Section label (Increased opacity for readability) ── */
        .slabel {
          font-size: 9.5px; font-weight: 800; letter-spacing: 0.15em;
          text-transform: uppercase; color: rgba(255,255,255,0.48);
          display: flex; align-items: center; gap: 6px; margin-bottom: 14px;
        }
        .slabel svg { color: #6366f1; }
 
        /* ── Status dot ── */
        @keyframes pdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.75)} }
        .pdot { animation: pdot 2s ease-in-out infinite; }
 
        /* ── Feed items ── */
        .feed-item {
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .feed-item:last-child { border-bottom: none; }
 
        /* ── Velocity number ── */
        .vel-num {
          font-size: 38px; font-weight: 900; line-height: 1;
          color: rgba(255,255,255,0.92); font-variant-numeric: tabular-nums;
          margin: 6px 0 0;
        }
      `}</style>
 
      <GlassFilter />
 
      <div className="shell">
        {/* ── Background: always on, always below everything ── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <HeroShader />
        </div>
 
        {/* ══════════════════════════════════════════════
            HERO LAYER
        ══════════════════════════════════════════════ */}
        {isHeroVisible && (
          <div className={`hero-wrap${phase === "exit" ? " exiting" : ""}`}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Spaced out, expanded layout container to follow good UX design principles */}
              <GlassCard style={{ width: "min(600px, 92vw)", padding: "52px 44px" }}>
                <form onSubmit={handleAnalyze} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  
                  {/* Clean title typography stack */}
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <p style={{ fontSize: 10, letterSpacing: "0.22em", color: "rgba(255,255,255,0.48)", textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>
                      Search velocity · media tracking · AI strategy
                    </p>
                    <h1 style={{
                      fontSize: "clamp(54px, 9vw, 76px)", fontWeight: 950,
                      letterSpacing: "-0.04em", lineHeight: 0.88,
                      color: "rgba(255,255,255,0.98)", textTransform: "uppercase",
                      userSelect: "none",
                    }}>
                      TREND<br />ENGINE
                    </h1>
                  </div>

                  <div>
                    <p className="slabel">
                      <Building size={13} />
                      Industry vertical
                    </p>
                    <input
                      className="g-input"
                      value={industry}
                      onChange={e => setIndustry(e.target.value)}
                      placeholder="e.g. real estate"
                      required
                    />
                  </div>
                  <div>
                    <p className="slabel">
                      <Compass size={13} />
                      Keywords to track
                    </p>
                    <input
                      className="g-input normal"
                      value={keywordsInput}
                      onChange={e => setKeywordsInput(e.target.value)}
                      placeholder="Comma-separated keywords"
                      required
                    />
                  </div>
 
                  {error && (
                    <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <AlertTriangle size={14} style={{ color: "rgb(252,165,165)", flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: 12, color: "rgb(252,165,165)" }}>{error}</p>
                    </div>
                  )}
 
                  {/* Status */}
                  {industry.trim() && keywordsInput.trim() && (
                    <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", color: "rgb(74,222,128)", fontWeight: 700 }}>
                      <span className="pdot" style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "rgba(74,222,128,0.85)", marginRight: 7, verticalAlign: "middle" }} />
                      System active · {industry.toUpperCase()}
                    </p>
                  )}
 
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button type="submit" className="cta" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                          Compiling
                        </>
                      ) : (
                        <>
                          Let's Go
                          <TrendingUp size={13} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </GlassCard>
            </div>
          </div>
        )}
 
        {/* ══════════════════════════════════════════════
            DASHBOARD LAYER
        ══════════════════════════════════════════════ */}
        <div
          className={`dash-wrap${phase === "exit" ? " entering" : ""}${phase === "dash" ? " visible" : ""}`}
        >
          <div style={{ minHeight: "100vh", padding: "24px 28px 56px" }}>
 
            {/* Top bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button className="back-btn" onClick={handleReset}>← Back</button>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.01em", color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>
                    {industry.toUpperCase()}
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3, letterSpacing: "0.03em" }}>
                    {keywordsList.join("  ·  ")}
                  </p>
                </div>
              </div>
              <TabNav active={activeTab} onChange={setActiveTab} />
            </div>
 
            {/* ── NOW ───────────────────────────────────── */}
            {activeTab === "now" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
 
                {/* Velocity row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                  {(loading ? Array(3).fill(null) : keywordsList.slice(0, 3)).map((kw, i) => {
                    const d = momentumScores?.[kw];
                    const m = d ? d.momentum : 0;
                    const isUp = m >= 0;
                    
                    // Advanced mathematical calculations derived from raw metrics
                    const vol = calculateVolatility(kw);
                    const opt = calculateMarketOpportunity(kw);
                    const acc = calculateTrendAcceleration(kw);

                    return (
                      <GlassCard
                        key={i}
                        className="card-in"
                        style={{ animationDelay: `${i * 70}ms` }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <p className="slabel" style={{ margin: 0 }}>Search volume index</p>
                          {d && (
                            <Badge variant="outline" className="border-none bg-white/5 text-[9px] uppercase tracking-wider font-extrabold px-2">
                              {vol.level}
                            </Badge>
                          )}
                        </div>
                        {loading ? (
                          <>
                            <Sk h={11} w="60%" style={{ marginBottom: 10 }} />
                            <Sk h={40} w="45%" />
                          </>
                        ) : (
                          <>
                            <p style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.9)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{kw}</p>
                            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", marginBottom: 10 }}>Relative search interest score (0-100) vs. average</p>
                            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
                              <div>
                                <p className="vel-num">{d ? Math.round(d.current_volume) : "-"}</p>
                                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.03em" }}>Relative Index</span>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                                <span style={{
                                  fontSize: 11, fontWeight: 800,
                                  padding: "3px 10px", borderRadius: 99,
                                  display: "inline-flex", alignItems: "center", gap: 3,
                                  background: isUp ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                                  border: `1px solid ${isUp ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                                  color: isUp ? "rgb(134,239,172)" : "rgb(252,165,165)",
                                }}>
                                  {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                  {isUp ? "+" : ""}{m}%
                                </span>
                                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.03em" }}>Momentum Velocity</span>
                              </div>
                            </div>
                            
                            {/* Core contextual markers indicating qualitative opportunity paths */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 12, paddingTop: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                                <span style={{ color: "rgba(255,255,255,0.25)" }}>Market Opportunity</span>
                                <span style={{ color: "rgba(255,255,255,0.72)", fontWeight: 700 }}>{opt.level}</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                                <span style={{ color: "rgba(255,255,255,0.25)" }}>Trend Trajectory</span>
                                <span style={{ color: "rgba(255,255,255,0.72)", fontWeight: 700 }}>{acc.level}</span>
                              </div>
                            </div>
                          </>
                        )}
                      </GlassCard>
                    );
                  })}
                </div>
 
                {/* Chart + YouTube */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 14 }}>
 
                  {/* Area chart */}
                  <GlassCard className="card-in" style={{ animationDelay: "210ms", minHeight: 320 }}>
                    <div className="slabel">
                      <Activity size={13} />
                      Interest over time
                    </div>
                    
                    {/* Visual Color Legend mapped directly inside the chart header */}
                    <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                      {keywordsList.slice(0, 3).map((kw, idx) => (
                        <div key={kw} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: strokeColors[idx % 3] }} />
                          <span style={{ color: "rgba(255,255,255,0.5)" }}>{kw}</span>
                        </div>
                      ))}
                    </div>

                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 16, marginTop: -6 }}>
                      30-day Google Search index
                    </p>
                    {loading ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[1,2,3].map(i => <Sk key={i} h={50} />)}
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={getChartData()} margin={{ top: 6, right: 4, left: -26, bottom: 0 }}>
                          <XAxis dataKey="date" stroke="rgba(255,255,255,0.15)" fontSize={9} tickLine={false} axisLine={false} dy={8} />
                          <YAxis stroke="rgba(255,255,255,0.15)" fontSize={9} tickLine={false} axisLine={false} dx={-4} />
                          <ChartTooltip content={<CustomTooltip />} />
                          {keywordsList.slice(0, 3).map((kw, idx) => (
                            <Area key={kw} type="monotone" dataKey={kw} name={kw}
                              stroke={strokeColors[idx % 3]} fill={fillColors[idx % 3]}
                              strokeWidth={2} activeDot={{ r: 4, fill: strokeColors[idx % 3] }}
                            />
                          ))}
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </GlassCard>
 
                  {/* YouTube with Passion Metrics */}
                  <GlassCard
                    className="card-in"
                    style={{ animationDelay: "280ms", height: 360, display: "flex", flexDirection: "column" }}
                    scrollable
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0, marginBottom: 8 }}>
                      <div className="slabel" style={{ margin: 0 }}>
                        <Tv size={13} />
                        Top media match
                      </div>
                      {videos.length > 0 && (
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 11, fontWeight: 900, color: "#6366f1" }}>
                            {calculateAudiencePassion().val}
                          </span>
                          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", display: "block", fontWeight: 700 }}>
                            {calculateAudiencePassion().text}
                          </span>
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.03em", marginBottom: 14 }}>
                      Audiences passion rating based on views vs likes metrics
                    </p>
                    <div style={{ overflowY: "auto", flex: 1 }} className="glass-scroll">
                      {loading
                        ? Array(5).fill(null).map((_, i) => (
                            <div key={i} className="feed-item" style={{ display: "flex", gap: 10 }}>
                              <Sk h={44} w="68px" />
                              <div style={{ flex: 1 }}>
                                <Sk h={11} style={{ marginBottom: 7 }} />
                                <Sk h={9} w="55%" />
                              </div>
                            </div>
                          ))
                        : videos.length > 0
                        ? videos.slice(0, 5).map((v, i) => (
                            <a key={i} href={`https://youtube.com/watch?v=${v.video_id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                              <div className="feed-item" style={{ display: "flex", gap: 10, cursor: "pointer" }}>
                                <img src={v.thumbnail_url || `https://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`} alt={v.title}
                                  style={{ width: 68, height: 44, objectFit: "cover", borderRadius: 8, flexShrink: 0, background: "rgba(255,255,255,0.05)" }} />
                                <div>
                                  <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.82)", lineHeight: 1.4, marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                    {v.title}
                                  </p>
                                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{v.channel}</p>
                                </div>
                              </div>
                            </a>
                          ))
                        : <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", paddingTop: 32 }}>No videos found</p>
                      }
                    </div>
                  </GlassCard>
 
                </div>
              </div>
            )}
 
            {/* ── MOVING (FORECAST TAB) ─────────────────── */}
            {activeTab === "moving" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
 
                {/* Insight */}
                <GlassCard className="card-in" style={{ height: 460, display: "flex", flexDirection: "column" }}>
                  <div className="slabel"><BrainCircuit size={13} /> Content briefing</div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginBottom: 14, marginTop: -6 }}>Gemini content strategy directives</p>
                  <div style={{ overflowY: "auto", flex: 1 }} className="glass-scroll">
                    {loadingInsight
                      ? Array(7).fill(null).map((_, i) => <Sk key={i} h={11} w={`${68 + (i % 3) * 10}%`} style={{ marginBottom: 12 }} />)
                      : insight
                        ? insight.split("\n").filter(Boolean).map((line, i) => (
                            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(99,102,241,0.7)", flexShrink: 0, marginTop: 7 }} />
                              <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.72)" }}>{line.replace(/^[-•*]\s*/, "")}</p>
                            </div>
                          ))
                        : <p style={{ fontSize: 13, color: "rgba(255,255,255,0.28)" }}>Insight compiling...</p>
                    }
                  </div>
                </GlassCard>
 
                {/* Forecast */}
                <GlassCard className="card-in" style={{ height: 460, animationDelay: "80ms", display: "flex", flexDirection: "column" }}>
                  <div className="slabel"><Sparkles size={13} /> Predictive index</div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginBottom: 14, marginTop: -6 }}>2 to 4 week forward trajectories</p>
                  <div style={{ overflowY: "auto", flex: 1 }} className="glass-scroll">
                    {loadingForecast
                      ? Array(8).fill(null).map((_, i) => <Sk key={i} h={11} w={`${60 + (i % 4) * 8}%`} style={{ marginBottom: 12 }} />)
                      : forecast?.includes("RESOURCE_EXHAUSTED") ? (
                          <div style={{ padding: "20px 24px", background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.18)", borderRadius: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <AlertTriangle size={16} style={{ color: "rgb(251,113,133)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <h4 style={{ fontSize: 13, fontWeight: 800, color: "rgb(251,113,133)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Forecast Engine Cooling Down</h4>
                              <p style={{ fontSize: 12, color: "rgba(251,113,133,0.72)", marginTop: 6, lineHeight: 1.6 }}>The predictive API is currently experiencing a peak demand rate limit. The system will automatically attempt to compile your trajectory index logs on next submission.</p>
                            </div>
                          </div>
                      ) : (
                          <p style={{ fontSize: 13, lineHeight: 1.78, color: "rgba(255,255,255,0.7)", whiteSpace: "pre-wrap" }}>{forecast || "Forecast compiling..."}</p>
                      )
                    }
                  </div>
                </GlassCard>
 
              </div>
            )}
 
            {/* ── ACT (EXECUTE TAB) ─────────────────────── */}
            {activeTab === "act" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
 
                {/* Core Directives Checklist (Layout B - Front and Center) */}
                <GlassCard className="card-in" style={{ height: 460, display: "flex", flexDirection: "column" }}>
                  <div className="slabel"><Play size={13} /> Core directives</div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginBottom: 14, marginTop: -6 }}>High-priority actions compiled from real-time momentum tracking data</p>
                  <div style={{ overflowY: "auto", flex: 1 }} className="glass-scroll">
                    {[
                      { 
                        n: "01", 
                        priority: "High",
                        color: "rgb(239,68,68)",
                        bg: "rgba(239,68,68,0.08)",
                        title: `Capitalize on ${keywordsList[0] || "primary keyword"} demand gaps`, 
                        body: `${keywordsList[0] || "Primary keyword"} displays solid search momentum with an untapped opportunity scale. Launch prioritized landing targets and target and align ad capture setups immediately.` 
                      },
                      { 
                        n: "02", 
                        priority: "Medium",
                        color: "rgb(245,158,11)",
                        bg: "rgba(245,158,11,0.08)",
                        title: "Deploy interactive media targets", 
                        body: `Audience passion index is measured at ${calculateAudiencePassion().val} (${calculateAudiencePassion().text}). Viewers are engaging deeply; deploy native community-focused, short-form video content to capture active interest.` 
                      },
                      { 
                        n: "03", 
                        priority: "Low",
                        color: "rgb(99,102,241)",
                        bg: "rgba(99,102,241,0.08)",
                        title: "Align reactive content blocks", 
                        body: "Multiple search parameters align with core Google baseline values. Create reactive, information-rich documentation pages to capture unaddressed query parameters before trend decay." 
                      },
                      { 
                        n: "04", 
                        priority: "Standard",
                        color: "rgb(113,113,122)",
                        bg: "rgba(113,113,122,0.08)",
                        title: "Monitor weekly velocity shifts", 
                        body: "If search momentum deceleration exceeds limits, pivot campaign distributions to secondary rising assets immediately." 
                      },
                    ].map(d => (
                      <div key={d.n} style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", justify-content: "space-between", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 11, fontWeight: 900, color: "rgba(99,102,241,0.65)", letterSpacing: "0.1em" }}>{d.n}</span>
                            <p style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.01em" }}>{d.title}</p>
                          </div>
                          <span style={{
                            fontSize: 9, fontWeight: 800,
                            padding: "2px 8px", borderRadius: 99,
                            textTransform: "uppercase", letterSpacing: "0.05em",
                            background: d.bg, color: d.color, border: `1px solid ${d.color}25`
                          }}>{d.priority}</span>
                        </div>
                        <p style={{ fontSize: 12.5, lineHeight: 1.65, color: "rgba(255,255,255,0.45)", paddingLeft: 24 }}>{d.body}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* News Feed inside Right Column (Secondary supporting context) */}
                <GlassCard className="card-in" style={{ height: 460, animationDelay: "80ms", display: "flex", flexDirection: "column" }}>
                  <div className="slabel"><Newspaper size={13} /> Context news feed</div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginBottom: 14, marginTop: -6 }}>Live industry signals supporting current directives</p>
                  <div style={{ overflowY: "auto", flex: 1 }} className="glass-scroll">
                    {loading
                      ? Array(5).fill(null).map((_, i) => (
                          <div key={i} className="feed-item">
                            <Sk h={12} style={{ marginBottom: 8 }} />
                            <Sk h={10} w="80%" style={{ marginBottom: 5 }} />
                            <Sk h={9} w="35%" />
                          </div>
                        ))
                      : news?.items?.length > 0
                      ? news.items.map((item: any, i: number) => (
                          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                            <div className="feed-item">
                              <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.82)", lineHeight: 1.4, marginBottom: 5 }}>{item.title}</p>
                              <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", marginBottom: 5 }}>{item.summary}</p>
                              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>{item.source}</p>
                            </div>
                          </a>
                        ))
                      : <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", paddingTop: 32 }}>No news found</p>
                    }
                  </div>
                </GlassCard>
 
              </div>
            )}
 
          </div>
        </div>
      </div>
 
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}