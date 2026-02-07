
import React, { useState, useMemo } from 'react';
import { 
  runPreFixDiagnosis, 
  generateCommitmentCard, 
  runPostFixEvaluation,
  generateRolePerspectives
} from './services/geminiService';
import { FunnelStep, Region, Device, FunnelMetrics } from './types';
import FunnelChart from './components/FunnelChart';
import { 
  BrainCircuit, 
  Lock, 
  CheckCircle2, 
  FileJson, 
  Download, 
  Zap, 
  ArrowRight, 
  Loader2,
  AlertTriangle,
  TrendingUp,
  Target,
  Database,
  History,
  BarChart3,
  Eye,
  CheckCircle,
  ArrowUpRight,
  DollarSign,
  Briefcase,
  ChevronRight,
  Palette,
  Users,
  Presentation,
  ShieldCheck,
  Activity,
  Layers,
  Cpu,
  MessageSquare,
  ShieldAlert,
  Terminal
} from 'lucide-react';

type Tab = 'intelligence' | 'lab' | 'events' | 'audit';

const MOCK_PRE_FIX_DATA: FunnelMetrics[] = [
  { step: FunnelStep.SIGNUP, region: Region.LATAM, device: Device.MOBILE, currentConv: 74, baselineConv: 85, rageClicks: 2, hesitationTimeSeconds: 8, repeatedAttempts: 0 },
  { step: FunnelStep.KYC, region: Region.LATAM, device: Device.MOBILE, currentConv: 68, baselineConv: 75, rageClicks: 5, hesitationTimeSeconds: 30, repeatedAttempts: 1 },
  { step: FunnelStep.PAYMENT_SELECTION, region: Region.LATAM, device: Device.MOBILE, currentConv: 65, baselineConv: 78, rageClicks: 3, hesitationTimeSeconds: 22, repeatedAttempts: 2 },
  { step: FunnelStep.DEPOSIT, region: Region.LATAM, device: Device.MOBILE, currentConv: 61, baselineConv: 70, rageClicks: 1, hesitationTimeSeconds: 35, repeatedAttempts: 0 },
  { step: FunnelStep.TRADE, region: Region.LATAM, device: Device.MOBILE, currentConv: 58, baselineConv: 65, rageClicks: 0, hesitationTimeSeconds: 10, repeatedAttempts: 0 },
];

const MOCK_POST_FIX_DATA: FunnelMetrics[] = [
  { step: FunnelStep.SIGNUP, region: Region.LATAM, device: Device.MOBILE, currentConv: 91, baselineConv: 85, rageClicks: 0, hesitationTimeSeconds: 3, repeatedAttempts: 0 },
  { step: FunnelStep.KYC, region: Region.LATAM, device: Device.MOBILE, currentConv: 88, baselineConv: 75, rageClicks: 1, hesitationTimeSeconds: 12, repeatedAttempts: 0 },
  { step: FunnelStep.PAYMENT_SELECTION, region: Region.LATAM, device: Device.MOBILE, currentConv: 84, baselineConv: 78, rageClicks: 1, hesitationTimeSeconds: 9, repeatedAttempts: 0 },
  { step: FunnelStep.DEPOSIT, region: Region.LATAM, device: Device.MOBILE, currentConv: 82, baselineConv: 70, rageClicks: 0, hesitationTimeSeconds: 14, repeatedAttempts: 0 },
  { step: FunnelStep.TRADE, region: Region.LATAM, device: Device.MOBILE, currentConv: 79, baselineConv: 65, rageClicks: 0, hesitationTimeSeconds: 5, repeatedAttempts: 0 },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('intelligence');
  const [activeSegment, setActiveSegment] = useState<{ region: Region, device: Device }>({ region: Region.LATAM, device: Device.MOBILE });

  const [preFixJson, setPreFixJson] = useState('');
  const [preDiagnosis, setPreDiagnosis] = useState<string | null>(null);
  const [isPreLoading, setIsPreLoading] = useState(false);

  const [commitmentJson, setCommitmentJson] = useState<string | null>(null);
  const [isCommitLoading, setIsCommitLoading] = useState(false);

  const [postFixJson, setPostFixJson] = useState('');
  const [postEvaluation, setPostEvaluation] = useState<string | null>(null);
  const [isPostLoading, setIsPostLoading] = useState(false);

  const [rolePerspectives, setRolePerspectives] = useState<any | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getAssignedTeam = (content: string | null) => {
    if (!content) return 'Pending Analysis';
    const c = content.toLowerCase();
    if (c.includes('product') || c.includes('business') || c.includes('pricing')) return 'Product Growth Team';
    if (c.includes('design') || c.includes('ux') || c.includes('copy') || c.includes('interface')) return 'UX Design Unit';
    if (c.includes('tech') || c.includes('engineer') || c.includes('backend') || c.includes('api') || c.includes('bug')) return 'Platform Engineering';
    return 'Growth Task Force';
  };

  const downloadTxt = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunDiscovery = async () => {
    if (!preFixJson.trim()) return;
    setIsPreLoading(true);
    setError(null);
    try {
      const parsed = JSON.parse(preFixJson);
      const res = await runPreFixDiagnosis(parsed);
      setPreDiagnosis(res);
      setCommitmentJson(null);
      setPostEvaluation(null);
      setRolePerspectives(null);
    } catch (e: any) {
      setError("Invalid Pre-Fix JSON format: " + e.message);
    } finally {
      setIsPreLoading(false);
    }
  };

  const handleRunCommitment = async () => {
    if (!preDiagnosis) return;
    setIsCommitLoading(true);
    try {
      const res = await generateCommitmentCard(preDiagnosis);
      setCommitmentJson(res);
    } catch (e: any) {
      setError("Failed to lock commitment: " + e.message);
    } finally {
      setIsCommitLoading(false);
    }
  };

  const handleRunValidation = async () => {
    if (!commitmentJson || !postFixJson.trim()) return;
    setIsPostLoading(true);
    try {
      const commitment = JSON.parse(commitmentJson);
      const postData = JSON.parse(postFixJson);
      const res = await runPostFixEvaluation(commitment, postData);
      setPostEvaluation(res);
      setRolePerspectives(null);
    } catch (e: any) {
      setError("Validation Error: " + e.message);
    } finally {
      setIsPostLoading(false);
    }
  };

  const handleGenerateRolePerspectives = async () => {
    if (!postEvaluation) return;
    setIsRoleLoading(true);
    try {
      const res = await generateRolePerspectives(postEvaluation);
      setRolePerspectives(JSON.parse(res));
    } catch (e: any) {
      setError("Failed to generate perspectives: " + e.message);
    } finally {
      setIsRoleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 -right-4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <aside className="w-72 border-r border-slate-800/40 bg-[#070b1d]/80 backdrop-blur-3xl fixed h-full p-6 space-y-8 z-50 shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-700 p-2 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-white leading-none">UX AGENT</span>
            <span className="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">Intelligence Lab</span>
          </div>
        </div>

        <nav className="space-y-2">
          <SidebarBtn active={activeTab === 'intelligence'} onClick={() => setActiveTab('intelligence')} icon={<Activity />} label="Live Intelligence" />
          <SidebarBtn active={activeTab === 'lab'} onClick={() => setActiveTab('lab')} icon={<Layers />} label="Diagnosis Workflow" />
          <SidebarBtn active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Database />} label="Raw Events" />
          <SidebarBtn active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} icon={<History />} label="Audit Log" />
        </nav>

        <div className="mt-auto absolute bottom-8 left-6 right-6 p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] shadow-inner backdrop-blur-md">
          <div className="text-[10px] font-black uppercase text-indigo-400 mb-2 tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Security Protocol
          </div>
          <p className="text-[11px] text-slate-400 italic leading-relaxed font-medium">
            "Discovery vectors are cryptographically immutable once the hypothesis is committed."
          </p>
        </div>
      </aside>

      <main className="ml-72 p-12 max-w-7xl mx-auto space-y-12 relative z-10">
        <header className="h-20 border-b border-slate-800/40 flex items-center justify-between bg-[#020617]/40 backdrop-blur-2xl sticky top-0 z-40 mb-12 -mx-12 px-12 transition-all duration-500 hover:bg-[#020617]/60">
          <div className="flex items-center gap-4">
             <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
             <div className="text-xs font-black text-slate-400 uppercase tracking-widest">System Status: <span className="text-white">Optimal</span></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/50 rounded-2xl p-1.5 shadow-2xl">
              <button 
                onClick={() => setActiveSegment({ ...activeSegment, region: Region.LATAM })}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-300 ${activeSegment.region === Region.LATAM ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                LATAM
              </button>
              <button 
                onClick={() => setActiveSegment({ ...activeSegment, region: Region.EU })}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-300 ${activeSegment.region === Region.EU ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                EU
              </button>
            </div>
          </div>
        </header>

        {activeTab === 'intelligence' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <section className="bg-gradient-to-br from-slate-900/80 to-[#070b1d]/80 border border-slate-800/50 rounded-[3rem] p-12 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] backdrop-blur-3xl group">
              <div className="absolute top-0 right-0 p-16 opacity-5 text-indigo-500 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-6">
                <BrainCircuit className="w-64 h-64" />
              </div>
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] bg-indigo-500/10 w-fit px-6 py-2.5 rounded-full border border-indigo-500/20 shadow-inner">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Global Performance Index
                  </div>
                  <h2 className="text-5xl font-black text-white tracking-tighter leading-none">Intelligence Dashboard</h2>
                  <p className="text-slate-400 text-lg max-w-lg font-medium leading-relaxed">Continuous telemetry monitoring across all funnel vectors. Side-by-side comparison of baseline vs post-fix recovery states.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                  <ProofCard label="Anomalies" value="12" icon={<Eye />} />
                  <ProofCard label="Deployments" value="08" icon={<Zap />} />
                  <ProofCard label="Recovery" value="+22.4%" icon={<ArrowUpRight />} highlight />
                  <ProofCard label="Saved ROI" value="$1.9M" icon={<DollarSign />} highlight />
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-end justify-between">
                <div className="space-y-2">
                  <h1 className="text-2xl font-black text-white tracking-tighter font-mono uppercase">Telemetry_Comparative_View</h1>
                  <p className="text-slate-500 text-sm font-medium">Real-time validation of recovery measures against historical baselines.</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/40 p-2 rounded-2xl border border-slate-800/50">
                   <div className="flex items-center gap-2 px-4 text-[10px] font-black text-slate-500 uppercase">
                     <div className="w-2 h-2 rounded-full bg-red-500/60" /> Pre-Fix
                   </div>
                   <div className="flex items-center gap-2 px-4 text-[10px] font-black text-indigo-400 uppercase">
                     <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" /> Post-Fix
                   </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-6">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-md border border-slate-700/50">Baseline Vector</span>
                    <span className="text-xs font-bold text-white uppercase tracking-tight">PRE-FIX BASELINE</span>
                  </div>
                  <FunnelChart data={MOCK_PRE_FIX_DATA} onSelectStep={() => {}} />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-6">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-md border border-indigo-500/20">Recovery Vector</span>
                    <span className="text-xs font-bold text-white uppercase tracking-tight">POST-FIX RECOVERY</span>
                  </div>
                  <FunnelChart data={MOCK_POST_FIX_DATA} onSelectStep={() => {}} />
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="space-y-12 animate-in fade-in duration-700 pb-32">
            <header className="space-y-3">
              <h1 className="text-5xl font-black text-white tracking-tighter">Diagnosis Workflow</h1>
              <p className="text-slate-400 text-lg font-medium">Discover behavioral anomalies, lock hypotheses, and validate recovery logic.</p>
            </header>

            {/* STEP 1: BASELINE DISCOVERY */}
            <section className={`bg-[#0d1326]/60 backdrop-blur-xl border-2 rounded-[3.5rem] p-12 transition-all duration-700 shadow-2xl ${preDiagnosis ? 'border-emerald-500/30 shadow-emerald-500/5' : 'border-slate-800/50'}`}>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-all duration-500 ${preDiagnosis ? 'bg-emerald-500 text-white rotate-6' : 'bg-indigo-600 text-white'}`}>01</div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white tracking-tight">Baseline Discovery</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Initial Anomaly Detection</p>
                  </div>
                </div>
                {preDiagnosis && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">Discovery Locked</span>}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                    <FileJson className="w-4 h-4 text-indigo-400" /> Ingest Pre-Fix Telemetry (JSON)
                  </label>
                  <textarea 
                    value={preFixJson}
                    onChange={(e) => setPreFixJson(e.target.value)}
                    placeholder="Paste aggregated funnel event metrics for baseline analysis..."
                    className="w-full h-96 bg-black/60 border-2 border-slate-800/50 rounded-[2.5rem] p-10 text-sm font-mono text-slate-300 focus:border-indigo-500 outline-none transition-all shadow-inner placeholder:text-slate-800"
                  />
                  <button 
                    onClick={handleRunDiscovery}
                    disabled={isPreLoading || !preFixJson.trim()}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-30 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 transition-all duration-300 active:scale-95 group"
                  >
                    {isPreLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <Zap className="w-6 h-6 fill-current group-hover:scale-125 transition-transform" />}
                    Begin AI Diagnosis
                  </button>
                </div>

                <div className="bg-[#050810]/80 border-2 border-slate-800/40 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-400"><History className="w-32 h-32" /></div>
                  <div className="bg-slate-800/40 px-10 py-6 border-b border-slate-800/50 flex justify-between items-center backdrop-blur-md">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discovery Analysis Report</span>
                    {preDiagnosis && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => downloadTxt(preDiagnosis, 'pre-fix-diagnosis')}
                          className="bg-slate-900/60 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 px-5 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-3 border border-slate-700/50 transition-all shadow-lg"
                        >
                          <Download className="w-4 h-4" /> Download
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-10 flex-1 overflow-y-auto max-h-[460px] custom-scrollbar">
                    {preDiagnosis ? (
                      <>
                        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-500/20 to-blue-500/10 border-2 border-indigo-500/30 rounded-3xl flex items-center justify-between shadow-[0_0_30px_rgba(99,102,241,0.2)] animate-in zoom-in-95 duration-500 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-indigo-500/5 group-hover:scale-110 transition-transform duration-1000" />
                          <div className="relative flex items-center gap-5">
                            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-900/40">
                              <ShieldAlert className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em] mb-1">Issue Routing Protocol</div>
                              <div className="text-xl font-black text-white tracking-tight">Lead Unit: {getAssignedTeam(preDiagnosis)}</div>
                            </div>
                          </div>
                          <div className="relative">
                            <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-4 py-2 rounded-full border border-indigo-500/40 shadow-inner">Dispatch Active</span>
                          </div>
                        </div>
                        <div className="prose prose-invert prose-sm whitespace-pre-wrap font-medium leading-relaxed text-slate-300">
                          {preDiagnosis}
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-700 text-center space-y-6">
                        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 animate-pulse">
                          <Target className="w-16 h-16 opacity-20" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest max-w-[200px]">Awaiting telemetry for diagnosis</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* STEP 2: HYPOTHESIS COMMITMENT */}
            <section className={`bg-[#0d1326]/60 backdrop-blur-xl border-2 rounded-[3.5rem] p-12 transition-all duration-700 shadow-2xl ${!preDiagnosis ? 'opacity-30 grayscale pointer-events-none' : commitmentJson ? 'border-amber-500/30 shadow-amber-500/5' : 'border-slate-800/50'}`}>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-all duration-500 ${commitmentJson ? 'bg-amber-500 text-white rotate-6' : 'bg-slate-700 text-slate-300'}`}>02</div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white tracking-tight">Hypothesis Commitment</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Success Logic Immutable Lock</p>
                  </div>
                </div>
                {commitmentJson && (
                   <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20 flex items-center gap-3 shadow-inner">
                     <Lock className="w-3.5 h-3.5" /> Logical State Locked
                   </span>
                )}
              </div>

              <div className="space-y-8">
                {!commitmentJson ? (
                  <div className="bg-amber-500/5 border-2 border-amber-500/10 p-16 rounded-[3rem] text-center space-y-8 backdrop-blur-xl">
                    <p className="text-amber-200/60 text-lg max-w-2xl mx-auto italic font-medium leading-relaxed">
                      "State the hypothesis and define success criteria BEFORE seeing post-fix data to prevent cognitive bias and ensure integrity."
                    </p>
                    <button 
                      onClick={handleRunCommitment}
                      disabled={isCommitLoading}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-14 py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] shadow-[0_15px_40px_-10px_rgba(217,119,6,0.5)] flex items-center justify-center gap-4 mx-auto transition-all duration-300 active:scale-95"
                    >
                      {isCommitLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <Lock className="w-6 h-6" />}
                      Lock Measurement Logic
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in zoom-in-95 duration-700">
                    <div className="space-y-6">
                      <div className="bg-black/60 border-2 border-slate-800/50 rounded-[2.5rem] p-10 font-mono text-xs text-amber-400/90 h-[360px] overflow-auto shadow-inner custom-scrollbar">
                        <pre className="whitespace-pre-wrap">{commitmentJson}</pre>
                      </div>
                      <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => downloadTxt(commitmentJson || '', 'commitment-card')}
                          className="flex-1 bg-slate-800/50 hover:bg-slate-700/80 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl"
                        >
                          <Download className="w-4.5 h-4.5" /> Download Logic
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-8 bg-amber-500/5 p-12 rounded-[2.5rem] border-2 border-amber-500/10 backdrop-blur-2xl">
                       <div className="h-14 w-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400">
                         <ShieldCheck className="w-8 h-8" />
                       </div>
                       <div className="space-y-4">
                         <h3 className="text-amber-400 font-black uppercase text-xs tracking-[0.25em]">Lock Protocol: Active</h3>
                         <p className="text-slate-300 text-lg leading-relaxed font-medium">
                           The measurement criteria are now immutable. The AI will strictly evaluate outcomes against these predefined vectors.
                         </p>
                       </div>
                       <div className="flex flex-col gap-4">
                         <CommitCheck label="KPIs Hard-coded Pre-Outcome" />
                         <CommitCheck label="Behavioral Signal Thresholds Set" />
                         <CommitCheck label="Growth Trajectory Defined" />
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* STEP 3: POST-FIX VALIDATION */}
            <section className={`bg-[#0d1326]/60 backdrop-blur-xl border-2 rounded-[3.5rem] p-12 transition-all duration-700 shadow-2xl ${!commitmentJson ? 'opacity-30 grayscale pointer-events-none' : postEvaluation ? 'border-indigo-500/30 shadow-indigo-500/5' : 'border-slate-800/50'}`}>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-all duration-500 ${postEvaluation ? 'bg-indigo-600 text-white rotate-6' : 'bg-slate-700 text-slate-300'}`}>03</div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white tracking-tight">Outcome Validation</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Performance Signal Verification</p>
                  </div>
                </div>
                {postEvaluation && <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 shadow-inner">Evaluation Ready</span>}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" /> Ingest Recovery Telemetry (JSON)
                  </label>
                  <textarea 
                    value={postFixJson}
                    onChange={(e) => setPostFixJson(e.target.value)}
                    placeholder="Paste performance metrics captured after UX fix implementation..."
                    className="w-full h-96 bg-black/60 border-2 border-slate-800/50 rounded-[2.5rem] p-10 text-sm font-mono text-slate-300 focus:border-indigo-500 outline-none transition-all shadow-inner placeholder:text-slate-800"
                  />
                  <button 
                    onClick={handleRunValidation}
                    disabled={isPostLoading || !postFixJson.trim()}
                    className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-30 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 transition-all duration-300 active:scale-95 group"
                  >
                    {isPostLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                    Validate System Outcome
                  </button>
                </div>

                <div className="bg-[#050810]/80 border-2 border-slate-800/40 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-400"><CheckCircle2 className="w-32 h-32" /></div>
                  <div className="bg-slate-800/40 px-10 py-6 border-b border-slate-800/50 flex justify-between items-center backdrop-blur-md">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Validation Audit</span>
                    {postEvaluation && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => downloadTxt(postEvaluation, 'performance-audit')}
                          className="bg-slate-900/60 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 px-5 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-3 border border-slate-700/50 transition-all shadow-lg"
                        >
                          <Download className="w-4 h-4" /> Download
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-10 flex-1 overflow-y-auto max-h-[460px] custom-scrollbar">
                    {postEvaluation ? (
                      <div className="prose prose-invert prose-sm whitespace-pre-wrap font-medium leading-relaxed text-slate-300">
                        {postEvaluation}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-700 text-center space-y-6">
                        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 animate-pulse">
                          <TrendingUp className="w-16 h-16 opacity-20" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest max-w-[200px]">Awaiting recovery telemetry</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* STEP 4: STAKEHOLDER PERSPECTIVES */}
            <section className={`bg-[#0d1326]/60 backdrop-blur-xl border-2 rounded-[3.5rem] p-12 transition-all duration-700 shadow-2xl ${!postEvaluation ? 'opacity-30 grayscale pointer-events-none' : rolePerspectives ? 'border-purple-500/30 shadow-purple-500/5' : 'border-slate-800/50'}`}>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-all duration-500 ${rolePerspectives ? 'bg-purple-600 text-white rotate-6' : 'bg-slate-700 text-slate-300'}`}>04</div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white tracking-tight">Stakeholder Insights</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Cross-Functional Decision Frames</p>
                  </div>
                </div>
                {rolePerspectives && <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20 shadow-inner">Intelligence Distilled</span>}
              </div>

              {!rolePerspectives ? (
                <div className="bg-purple-500/5 border-2 border-purple-500/10 p-16 rounded-[3rem] text-center space-y-8 backdrop-blur-xl">
                  <p className="text-purple-200/60 text-lg max-w-2xl mx-auto italic font-medium leading-relaxed">
                    "Translate raw validation audit into role-specific narratives for Product, Design, and Executive leadership."
                  </p>
                  <button 
                    onClick={handleGenerateRolePerspectives}
                    disabled={isRoleLoading}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-14 py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] shadow-[0_15px_40px_-10px_rgba(147,51,234,0.5)] flex items-center justify-center gap-4 mx-auto transition-all duration-300 active:scale-95 group"
                  >
                    {isRoleLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <Presentation className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
                    Generate Executive Views
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-700">
                  <PerspectiveCard 
                    role="Product Lead" 
                    icon={<Target className="text-orange-400" />} 
                    content={rolePerspectives.product_lead} 
                    theme="orange"
                  />
                  <PerspectiveCard 
                    role="Designer" 
                    icon={<Palette className="text-pink-400" />} 
                    content={rolePerspectives.designer} 
                    theme="pink"
                  />
                  <PerspectiveCard 
                    role="Growth Analyst" 
                    icon={<BarChart3 className="text-indigo-400" />} 
                    content={rolePerspectives.analyst} 
                    theme="indigo"
                  />
                  <PerspectiveCard 
                    role="Senior Leader" 
                    icon={<Briefcase className="text-emerald-400" />} 
                    content={rolePerspectives.senior_leader} 
                    theme="emerald"
                  />
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'events' && <EventsView />}
        {activeTab === 'audit' && <AuditView />}
      </main>
    </div>
  );
};

// --- Helper Components ---

const CommitCheck = ({ label }: { label: string }) => (
  <div className="flex items-center gap-4 text-xs font-bold text-slate-500 group">
    <div className="h-5 w-5 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/10 transition-colors group-hover:bg-amber-500 group-hover:text-white">
      <CheckCircle2 className="w-3.5 h-3.5" />
    </div>
    {label}
  </div>
);

const PerspectiveCard = ({ role, icon, content, theme }: { role: string, icon: React.ReactNode, content: string, theme: string }) => {
  const themes: any = {
    orange: 'hover:border-orange-500/30 group-hover:text-orange-400',
    pink: 'hover:border-pink-500/30 group-hover:text-pink-400',
    indigo: 'hover:border-indigo-500/30 group-hover:text-indigo-400',
    emerald: 'hover:border-emerald-500/30 group-hover:text-emerald-400',
  };
  return (
    <div className={`bg-[#0d1326]/40 backdrop-blur-xl border-2 border-slate-800/50 p-10 rounded-[2.5rem] transition-all duration-500 group hover:-translate-y-2 hover:bg-[#0d1326]/60 shadow-2xl ${themes[theme].split(' ')[0]}`}>
      <div className="flex items-center gap-5 mb-6">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 group-hover:scale-110 transition-transform duration-500 shadow-xl border border-slate-800/50">
          {icon}
        </div>
        <h3 className="font-black text-white text-lg uppercase tracking-widest">{role}</h3>
      </div>
      <p className="text-slate-400 text-base leading-relaxed font-medium">
        {content}
      </p>
    </div>
  );
};

const SidebarBtn = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-6 py-4.5 rounded-2xl transition-all duration-300 font-bold text-sm group relative overflow-hidden ${
      active 
        ? 'bg-indigo-600 text-white shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)]' 
        : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-300'
    }`}
  >
    {active && <div className="absolute inset-y-0 left-0 w-1 bg-white" />}
    <span className={`${active ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'} transition-colors duration-300`}>
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5.5 h-5.5' })}
    </span>
    {label}
  </button>
);

const ProofCard = ({ label, value, icon, highlight = false }: { label: string, value: string, icon: React.ReactNode, highlight?: boolean }) => (
  <div className={`p-8 rounded-[2rem] border-2 min-w-[180px] flex-1 transition-all duration-500 hover:-translate-y-2 ${highlight ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-900/20' : 'bg-slate-800/30 border-slate-700/50 backdrop-blur-xl'}`}>
    <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${highlight ? 'text-indigo-100' : 'text-slate-500'}`}>
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
      {label}
    </div>
    <div className="text-4xl font-black tabular-nums tracking-tighter text-white">{value}</div>
  </div>
);

const EventsView = () => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
    <div className="flex justify-between items-end px-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white font-mono uppercase tracking-tighter">Raw_Telemetry_Stream</h1>
          <p className="text-slate-500 text-sm font-medium">Unfiltered behavioral frames being processed by the intelligence engine.</p>
        </div>
        <div className="text-[10px] font-black text-indigo-400 uppercase bg-indigo-500/10 px-6 py-2.5 rounded-full border border-indigo-500/20 shadow-inner">250 Active Telemetry Nodes</div>
    </div>
    <div className="bg-[#0d1326]/60 backdrop-blur-3xl border-2 border-slate-800/50 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-800/30 text-slate-500 uppercase font-black tracking-[0.3em] text-[10px]">
          <tr><th className="px-12 py-8 border-b border-slate-800/50">Timestamp</th><th className="px-12 py-8 border-b border-slate-800/50">Signal_ID</th><th className="px-12 py-8 border-b border-slate-800/50">Pattern_Vector</th><th className="px-12 py-8 border-b border-slate-800/50 text-right">Processing_State</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-800/30 font-medium">
          {[...Array(12)].map((_, i) => (
            <tr key={i} className="hover:bg-indigo-500/5 transition-colors duration-300 group">
              <td className="px-12 py-7 font-mono text-slate-500 text-xs">14:02:{20+i}.{i*12}Z</td>
              <td className="px-12 py-7 font-black text-slate-300 tracking-tight">SIG_VEC_PROX_{i*10}</td>
              <td className="px-12 py-7">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border transition-all duration-500 ${i % 3 === 0 ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}>
                  {i % 3 === 0 ? 'Rage Cluster Detected' : 'Baseline Sequential'}
                </span>
              </td>
              <td className="px-12 py-7 text-right">
                <div className="inline-flex items-center gap-2 text-slate-600 font-black uppercase text-[10px] tracking-widest group-hover:text-indigo-400 transition-colors">
                  <div className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
                  {i % 2 === 0 ? 'Analyzed' : 'Buffered'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AuditView = () => (
  <div className="space-y-12 animate-in fade-in duration-1000">
    <div className="px-4 space-y-2">
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter font-mono">System_Audit_Archive</h1>
      <p className="text-slate-500 text-sm font-medium">Verified historical records of intelligence cycles and impact validation.</p>
    </div>
    <div className="grid grid-cols-1 gap-8">
      {[
        { date: 'Feb 07, 2:09 PM', title: 'Payment Vector Recovery Verified', status: 'Success (+27.4%)', color: 'emerald', icon: <CheckCircle /> },
        { date: 'Feb 07, 1:45 PM', title: 'Baseline Behavioral Signal Discovery', status: 'Analysis Logged', color: 'indigo', icon: <Eye /> },
        { date: 'Feb 06, 4:30 PM', title: 'Intelligence Core Calibration', status: 'Maintenance Complete', color: 'slate', icon: <Database /> },
      ].map((item, i) => (
        <div key={i} className="bg-[#0d1326]/60 backdrop-blur-2xl border-2 border-slate-800/40 p-10 rounded-[3rem] flex items-center justify-between hover:bg-[#0d1326]/90 hover:border-indigo-500/30 transition-all duration-500 cursor-default group shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-10">
            <div className={`bg-slate-900/80 p-6 rounded-3xl text-slate-500 group-hover:text-indigo-400 transition-all duration-500 shadow-2xl border border-slate-800 group-hover:scale-110`}>
              {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-10 h-10' })}
            </div>
            <div className="space-y-2">
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover:text-indigo-500/60 transition-colors">{item.date}</div>
              <h3 className="text-2xl font-black text-white tracking-tight leading-none">{item.title}</h3>
            </div>
          </div>
          <div className={`px-8 py-3.5 rounded-2xl border font-black uppercase tracking-[0.2em] text-[11px] shadow-lg transition-all duration-500 ${
            item.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            item.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
            'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {item.status}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default App;
