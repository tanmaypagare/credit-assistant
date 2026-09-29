import DashboardLayout from "@/components/DashboardLayout";
import FinancialProfileForm from "@/components/FinancialProfileForm";
import { trpc } from "@/lib/trpc";
import { formatCurrency, formatPercent, statusTone } from "@/lib/credit";
import { ArrowLeft, Info } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Profile() {
  const [, setLocation] = useLocation();
  const profile = trpc.profile.get.useQuery();
  const utils = trpc.useUtils();
  const save = trpc.profile.save.useMutation({
    onSuccess: () => { utils.profile.get.invalidate(); utils.profile.history.invalidate(); toast.success("Profile updated and score history saved"); setLocation("/dashboard"); },
    onError: error => toast.error(error.message || "Could not update your profile"),
  });
  const current = profile.data;

  return <DashboardLayout><div className="mx-auto max-w-5xl"><button onClick={() => setLocation("/dashboard")} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-sky-700"><ArrowLeft className="h-4 w-4" /> Back to overview</button><div className="mb-8"><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">Financial profile</p><h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Keep your numbers current.</h1><p className="mt-3 max-w-2xl leading-relaxed text-slate-500">Every save creates a new score history point, so you can see the impact of paying down debt or building better habits.</p></div><div className="grid gap-6 lg:grid-cols-[1fr_280px]"><div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-8"><FinancialProfileForm initial={current ? { creditScore: current.creditScore, monthlyIncome: current.monthlyIncome, monthlyExpenses: current.monthlyExpenses, outstandingDebt: current.outstandingDebt, creditLimit: current.creditLimit, activeLoans: current.activeLoans, missedPayments: current.missedPayments } : undefined} submitLabel="Save and recalculate" isPending={save.isPending || profile.isLoading} onSubmit={values => save.mutate(values)} /></div><div className="h-fit rounded-[2rem] bg-slate-950 p-6 text-white"><div className="mb-6 flex items-center gap-2 text-sky-200"><Info className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-[0.14em]">Live calculations</span></div>{current ? <div className="space-y-5"><div><p className="text-xs text-slate-400">Health status</p><span className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusTone(current.healthStatus)}`}>{current.healthStatus}</span></div><div><p className="text-xs text-slate-400">Debt-to-income</p><p className="mt-1 font-display text-2xl font-semibold">{formatPercent(current.dtiRatio)}</p><p className="mt-1 text-xs text-slate-400">Debt divided by monthly income</p></div><div><p className="text-xs text-slate-400">Credit utilisation</p><p className="mt-1 font-display text-2xl font-semibold">{formatPercent(current.utilizationRatio)}</p><p className="mt-1 text-xs text-slate-400">{formatCurrency(current.outstandingDebt)} of {formatCurrency(current.creditLimit)}</p></div></div> : <p className="text-sm leading-relaxed text-slate-400">Your calculated metrics will appear here after your first profile save.</p>}</div></div></div></DashboardLayout>;
}
