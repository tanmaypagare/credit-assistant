import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, IndianRupee, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export type ProfileValues = {
  creditScore: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  outstandingDebt: number;
  creditLimit: number;
  activeLoans: number;
  missedPayments: number;
};

const defaults: ProfileValues = {
  creditScore: 700,
  monthlyIncome: 75000,
  monthlyExpenses: 40000,
  outstandingDebt: 120000,
  creditLimit: 400000,
  activeLoans: 1,
  missedPayments: 0,
};

type Props = {
  initial?: Partial<ProfileValues>;
  submitLabel: string;
  isPending?: boolean;
  onSubmit: (values: ProfileValues) => void;
};

const fields: Array<{ key: keyof ProfileValues; label: string; hint: string; min: number; max: number }> = [
  { key: "creditScore", label: "Current CIBIL score", hint: "300–900", min: 300, max: 900 },
  { key: "monthlyIncome", label: "Monthly take-home income", hint: "INR per month", min: 1, max: 100000000 },
  { key: "monthlyExpenses", label: "Monthly expenses", hint: "INR per month", min: 0, max: 100000000 },
  { key: "outstandingDebt", label: "Total outstanding debt", hint: "Loans + card balances", min: 0, max: 1000000000 },
  { key: "creditLimit", label: "Total credit limit", hint: "Across active cards", min: 1, max: 1000000000 },
  { key: "activeLoans", label: "Active loans", hint: "Count", min: 0, max: 100 },
  { key: "missedPayments", label: "Missed payments", hint: "Past 12 months", min: 0, max: 100 },
];

export default function FinancialProfileForm({ initial, submitLabel, isPending, onSubmit }: Props) {
  const [form, setForm] = useState<ProfileValues>({ ...defaults, ...initial });

  useEffect(() => {
    if (initial) setForm(current => ({ ...current, ...initial }));
  }, [initial]);

  const updateField = (key: keyof ProfileValues, value: string) => {
    setForm(current => ({ ...current, [key]: Number(value) }));
  };

  return (
    <form
      className="space-y-7"
      onSubmit={event => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map(field => (
          <div key={field.key} className={field.key === "outstandingDebt" ? "sm:col-span-2" : ""}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <Label htmlFor={field.key} className="text-sm font-semibold text-slate-800">{field.label}</Label>
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">{field.hint}</span>
            </div>
            <div className="relative">
              {field.key !== "creditScore" && field.key !== "activeLoans" && field.key !== "missedPayments" && (
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              )}
              <Input
                id={field.key}
                type="number"
                min={field.min}
                max={field.max}
                value={form[field.key]}
                onChange={event => updateField(field.key, event.target.value)}
                className={field.key !== "creditScore" && field.key !== "activeLoans" && field.key !== "missedPayments" ? "pl-9" : ""}
                required
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 p-4 text-sm text-sky-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">We calculate the ratios for you</p>
          <p className="mt-1 text-sky-700">Your debt-to-income and utilisation ratios update automatically after saving.</p>
        </div>
        <Button type="submit" disabled={isPending} className="shrink-0 bg-sky-700 text-white hover:bg-sky-800">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
