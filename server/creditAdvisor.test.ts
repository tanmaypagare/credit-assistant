import { afterEach, describe, expect, it, vi } from "vitest";
import { generateAdvisorAdvice } from "./creditAdvisor";

afterEach(() => vi.unstubAllEnvs());

describe("credit advisor", () => {
  it("returns five actionable steps and risk flags without an API key", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    const advice = await generateAdvisorAdvice({
      creditScore: 645,
      monthlyIncome: 80000,
      monthlyExpenses: 45000,
      outstandingDebt: 180000,
      creditLimit: 400000,
      activeLoans: 2,
      missedPayments: 1,
      dtiRatio: "0.42",
      utilizationRatio: "0.45",
      healthStatus: "Fair",
    });

    expect(advice.summary).toContain("645");
    expect(advice.steps).toHaveLength(5);
    expect(advice.steps.every(step => step.length > 20)).toBe(true);
    expect(advice.riskFlags.length).toBeGreaterThan(0);
  });
});
