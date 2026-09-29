import DashboardLayout from "@/components/DashboardLayout";
import FinancialProfileForm from "@/components/FinancialProfileForm";
import { trpc } from "@/lib/trpc";
import { ShieldCheck, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const save = trpc.profile.save.useMutation({
    onSuccess: () => { toast.success("Your credit profile is ready"); setLocation("/dashboard"); },
    onError: error => toast.error(error.message || "Could not save your profile"),
  });

  return <DashboardLayout><div className="mx-auto max-w-4xl"><div className="mb-8 flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-700 text-white shadow-lg shadow-sky-700/15"><Sparkles className="h-5 w-5" /></div><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">Welcome to your workspace</p><h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Let’s understand your starting point.</h1><p className="mt-3 max-w-2xl leading-relaxed text-slate-500">Share a few numbers and we’ll calculate the ratios that matter most. Your data powers a private dashboard — it is never shown to anyone else.</p></div></div><div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-8"><div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-5 text-sm text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-600" /><span>Use approximate values if you do not have the exact number handy.</span></div><FinancialProfileForm submitLabel="Create my credit snapshot" isPending={save.isPending} onSubmit={values => save.mutate(values)} /></div></div></DashboardLayout>;
}
