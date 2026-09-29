import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BarChart3, BrainCircuit, CheckCircle2, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

const features = [
  { icon: BarChart3, title: "See the full picture", copy: "Bring your score, debt, payments and utilisation into one calm, readable view." },
  { icon: BrainCircuit, title: "Get a practical next step", copy: "Receive plain-language guidance shaped around Indian credit and CIBIL signals." },
  { icon: LineChart, title: "Notice the progress", copy: "Keep a timestamped history so small improvements become visible over time." },
];

export default function Home() {
  const { loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const profile = trpc.profile.get.useQuery(undefined, { enabled: isAuthenticated });

  useEffect(() => {
    if (isAuthenticated && !profile.isLoading) setLocation(profile.data ? "/dashboard" : "/onboarding");
  }, [isAuthenticated, profile.data, profile.isLoading, setLocation]);

  if (loading || isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f7fafc]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-700" /></div>;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7fafc] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_8%,rgba(125,211,252,0.24),transparent_28%),radial-gradient(circle_at_8%_50%,rgba(167,243,208,0.18),transparent_25%)]" />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-8">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-700 text-white shadow-lg shadow-sky-700/20"><ShieldCheck className="h-5 w-5" /></div><div><p className="font-display text-lg font-bold tracking-tight">Credit Assistant</p><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-700">Your credit compass</p></div></div>
        <Button variant="outline" onClick={() => startLogin()} className="rounded-full border-slate-300 bg-white/70 px-5 font-semibold text-slate-700 hover:bg-white">Sign in <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 md:px-8 md:pt-20">
        <section className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-sky-700 shadow-sm"><Sparkles className="h-3.5 w-3.5" /> Built for the Indian credit journey</div>
            <h1 className="font-display text-5xl font-semibold leading-[1.03] tracking-[-0.05em] text-slate-950 md:text-7xl">Make your credit health feel <span className="text-sky-700">clearer.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">Understand what shapes your CIBIL score, turn your numbers into a plan, and keep momentum without the financial jargon.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button onClick={() => startLogin()} size="lg" className="h-13 rounded-full bg-slate-950 px-7 text-base font-semibold text-white shadow-xl shadow-slate-950/15 hover:bg-slate-800">Start your credit check <ArrowRight className="ml-2 h-5 w-5" /></Button><div className="flex items-center gap-2 px-2 text-sm font-medium text-slate-500"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Private to your account</div></div>
            <div className="mt-12 flex items-center gap-8 border-t border-slate-200/80 pt-6 text-sm text-slate-500"><div><p className="font-display text-2xl font-bold text-slate-900">300–900</p><p className="mt-1">CIBIL score range</p></div><div className="h-10 w-px bg-slate-200" /><div><p className="font-display text-2xl font-bold text-slate-900">5 steps</p><p className="mt-1">Actionable advice</p></div></div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px] lg:justify-self-end">
            <div className="absolute -left-12 top-12 h-32 w-32 rounded-full bg-emerald-200/60 blur-3xl" /><div className="absolute -right-6 bottom-2 h-44 w-44 rounded-full bg-sky-200/70 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur md:p-7">
              <div className="mb-8 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">A calmer dashboard</p><p className="mt-1 font-display text-xl font-semibold">Your credit snapshot</p></div><div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">On track</div></div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-6"><div className="relative flex h-36 w-36 items-center justify-center rounded-full" style={{ background: "conic-gradient(#0ea5e9 0 76%, #e0f2fe 76% 100%)" }}><div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white"><span className="font-display text-4xl font-bold text-slate-950">742</span><span className="text-xs font-semibold text-emerald-600">Good</span></div></div><div className="space-y-4"><div><div className="mb-1 flex justify-between text-xs font-semibold"><span className="text-slate-500">Utilisation</span><span className="text-slate-800">24.8%</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 w-1/4 rounded-full bg-sky-500" /></div></div><div><div className="mb-1 flex justify-between text-xs font-semibold"><span className="text-slate-500">Debt-to-income</span><span className="text-slate-800">31.4%</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 w-[31%] rounded-full bg-emerald-500" /></div></div><div className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600"><span className="font-semibold text-slate-900">Next best move:</span> keep card balances below 30% before the next statement date.</div></div></div>
              <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-white"><div className="flex items-center gap-2 text-emerald-300"><BrainCircuit className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-[0.14em]">AI advisor</span></div><p className="mt-3 text-sm leading-relaxed text-slate-300">“You’re close to an excellent range. Protect on-time payments and keep utilisation steady.”</p></div>
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-5 md:grid-cols-3">
          {features.map(feature => <div key={feature.title} className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700"><feature.icon className="h-5 w-5" /></div><h2 className="font-display text-lg font-semibold">{feature.title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">{feature.copy}</p></div>)}
        </section>
      </main>
      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-2 border-t border-slate-200/80 px-5 py-7 text-xs text-slate-400 md:flex-row md:items-center md:justify-between md:px-8"><span>Credit Assistant · Built for better financial clarity</span><span>Guidance is educational, not financial advice.</span></footer>
    </div>
  );
}
