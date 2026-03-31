export type UserPlan = "free" | "basic" | "pro";

export const PLAN_FEATURES = {
  hook_generator: ["free", "basic", "pro"],
  content_plan: ["free", "basic", "pro"],
  script_generator: ["basic", "pro"],
  video_generator: ["basic", "pro"],
  graphic_generator: ["basic", "pro"],
  scheduling: ["basic", "pro"],
  download: ["basic", "pro"],
  projects: ["basic", "pro"],
  trends: ["basic", "pro"],
  brand_campaigns: ["pro"],
  outreach_dm: ["pro"],
  automation: ["pro"],
} as const;

export type PlanFeature = keyof typeof PLAN_FEATURES;

export function canAccess(plan: UserPlan, feature: PlanFeature): boolean {
  return (PLAN_FEATURES[feature] as readonly string[]).includes(plan);
}

export const PLAN_LABELS: Record<UserPlan, string> = {
  free: "Free",
  basic: "Basic",
  pro: "Pro",
};

export const PLAN_PRICES: Record<UserPlan, number> = {
  free: 0,
  basic: 499,
  pro: 999,
};

export const PLAN_ORDER: Record<UserPlan, number> = {
  free: 0,
  basic: 1,
  pro: 2,
};
