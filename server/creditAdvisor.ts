import { GoogleGenerativeAI } from "@google/generative-ai";

export type AdvisorProfile = {
  creditScore: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  outstandingDebt: number;
  creditLimit: number;
  activeLoans: number;
  missedPayments: number;
  dtiRatio: number | string;
  utilizationRatio: number | string;
  healthStatus: string;
};

export type AdvisorAdvice = {
  summary: string;
  steps: string[];
  riskFlags: string[];
};

function fallbackAdvice(profile: AdvisorProfile): AdvisorAdvice {
  const dti = Number(profile.dtiRatio);
  const utilization = Number(profile.utilizationRatio);
  const riskFlags: string[] = [];
  if (utilization > 0.3) riskFlags.push("Credit utilisation is above the commonly preferred 30% range.");
  if (dti > 0.4) riskFlags.push("Debt-to-income is elevated; new borrowing may increase repayment pressure.");
  if (profile.missedPayments > 0) riskFlags.push("Recent missed payments can negatively affect CIBIL history.");
  if (riskFlags.length === 0) riskFlags.push("No immediate red flags from the metrics provided.");

  return {
    summary: `Your CIBIL score is ${profile.creditScore} (${profile.healthStatus}). The biggest levers are keeping revolving credit usage low, maintaining on-time payments, and reducing high-cost debt without taking on new obligations.`,
    steps: [
      profile.missedPayments > 0
        ? "Set up auto-pay or calendar reminders for every EMI and card due date, then clear any overdue amount as soon as possible."
        : "Keep every EMI and card payment on or before the due date; payment history is a major CIBIL signal.",
      utilization > 0.3
        ? "Bring total card utilisation below 30% over the next two billing cycles, prioritising the cards closest to their limits."
        : "Maintain card utilisation below 30% and avoid maxing out a single card even when total usage is low.",
      dti > 0.4
        ? "Direct a fixed share of monthly surplus toward the highest-interest outstanding balance before taking new credit."
        : "Protect your monthly surplus and make extra principal payments on the costliest loan when it does not create cash-flow stress.",
      "Review your CIBIL report periodically for duplicate accounts, incorrect overdue markers, or unfamiliar enquiries and raise disputes with the lender or bureau when needed.",
      "Avoid multiple hard enquiries in a short period; compare offers first and apply only when the credit product clearly supports your repayment plan.",
    ],
    riskFlags,
  };
}

function normalizeAdvice(value: unknown, fallback: AdvisorAdvice): AdvisorAdvice {
  if (!value || typeof value !== "object") return fallback;
  const record = value as Record<string, unknown>;
  const summary = typeof record.summary === "string" ? record.summary.trim() : "";
  const steps = Array.isArray(record.steps)
    ? record.steps.filter((step): step is string => typeof step === "string").map(step => step.trim()).filter(Boolean)
    : [];
  const riskFlags = Array.isArray(record.riskFlags)
    ? record.riskFlags.filter((flag): flag is string => typeof flag === "string").map(flag => flag.trim()).filter(Boolean)
    : [];
  return {
    summary: summary || fallback.summary,
    steps: (steps.length ? steps : fallback.steps).slice(0, 5).concat(fallback.steps).slice(0, 5),
    riskFlags: riskFlags.length ? riskFlags : fallback.riskFlags,
  };
}

export async function generateAdvisorAdvice(profile: AdvisorProfile): Promise<AdvisorAdvice> {
  const fallback = fallbackAdvice(profile);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallback;

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const prompt = `You are a careful Indian financial wellness assistant. Analyse the user's CIBIL-oriented metrics and respond ONLY with valid JSON using exactly this shape: {"summary":"plain language summary","steps":["exactly 5 actionable steps"],"riskFlags":["specific risks"]}. Do not promise score increases, do not recommend evading lenders, and do not give regulated investment, legal, or tax advice. Mention Indian context such as CIBIL reports, EMIs, payment history, utilisation, and hard enquiries where relevant.\n\nMetrics:\n${JSON.stringify(profile)}`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const gemini = genAI.getGenerativeModel({
      model,
      generationConfig: { temperature: 0.25, responseMimeType: "application/json" },
    });
    const result = await gemini.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    return normalizeAdvice(JSON.parse(cleaned), fallback);
  } catch (error) {
    console.warn("[Advisor] Gemini unavailable; using local guidance:", error);
    return fallback;
  }
}
