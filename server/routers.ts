import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import {
  addRecommendation,
  addScoreHistory,
  getFinancialProfile,
  getRecommendations,
  getScoreHistory,
  upsertFinancialProfile,
} from "./db";
import { generateAdvisorAdvice } from "./creditAdvisor";

const profileInput = z.object({
  creditScore: z.number().int().min(300).max(900),
  monthlyIncome: z.number().int().min(1).max(100000000),
  monthlyExpenses: z.number().int().min(0).max(100000000),
  outstandingDebt: z.number().int().min(0).max(1000000000),
  creditLimit: z.number().int().min(1).max(1000000000),
  activeLoans: z.number().int().min(0).max(100),
  missedPayments: z.number().int().min(0).max(100),
});

function healthStatus(score: number) {
  if (score < 580) return "Poor";
  if (score < 670) return "Fair";
  if (score < 750) return "Good";
  return "Excellent";
}

function ratio(numerator: number, denominator: number) {
  return Number((numerator / denominator).toFixed(4));
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  profile: router({
    get: protectedProcedure.query(({ ctx }) => getFinancialProfile(ctx.user.id)),
    save: protectedProcedure.input(profileInput).mutation(async ({ ctx, input }) => {
      const dtiRatio = ratio(input.outstandingDebt, input.monthlyIncome);
      const utilizationRatio = ratio(input.outstandingDebt, input.creditLimit);
      await upsertFinancialProfile({
        userId: ctx.user.id,
        ...input,
        dtiRatio: dtiRatio.toFixed(4),
        utilizationRatio: utilizationRatio.toFixed(4),
        healthStatus: healthStatus(input.creditScore),
      });
      await addScoreHistory(ctx.user.id, input.creditScore);
      const history = await getScoreHistory(ctx.user.id);
      const previous = history[1]?.creditScore;
      return {
        profile: await getFinancialProfile(ctx.user.id),
        delta: previous === undefined ? null : input.creditScore - previous,
      };
    }),
    history: protectedProcedure.query(async ({ ctx }) => {
      const history = await getScoreHistory(ctx.user.id);
      const latest = history[0]?.creditScore;
      const previous = history[1]?.creditScore;
      return {
        records: [...history].reverse(),
        delta: latest === undefined || previous === undefined ? null : latest - previous,
      };
    }),
  }),

  advisor: router({
    analyze: protectedProcedure.mutation(async ({ ctx }) => {
      const profile = await getFinancialProfile(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Complete your financial profile before asking for advice." });
      }
      const advice = await generateAdvisorAdvice({
        creditScore: profile.creditScore,
        monthlyIncome: profile.monthlyIncome,
        monthlyExpenses: profile.monthlyExpenses,
        outstandingDebt: profile.outstandingDebt,
        creditLimit: profile.creditLimit,
        activeLoans: profile.activeLoans,
        missedPayments: profile.missedPayments,
        dtiRatio: profile.dtiRatio,
        utilizationRatio: profile.utilizationRatio,
        healthStatus: profile.healthStatus,
      });
      await addRecommendation({
        userId: ctx.user.id,
        summary: advice.summary,
        steps: advice.steps,
        riskFlags: advice.riskFlags,
      });
      return advice;
    }),
    recommendations: protectedProcedure.query(({ ctx }) => getRecommendations(ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
