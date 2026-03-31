import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Check, Crown, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { PLAN_ORDER, PLAN_PRICES, type UserPlan } from "../utils/planGating";

interface Props {
  onNavigate: (tab: string) => void;
  currentPlan?: UserPlan;
  onUpgradePlan?: (plan: UserPlan) => void;
}

type PaymentState = "idle" | "processing" | "success";

const plans: Array<{
  id: UserPlan;
  name: string;
  emoji: string;
  tagline: string;
  popular: boolean;
  features: string[];
  locked: string[];
}> = [
  {
    id: "free",
    name: "Free",
    emoji: "🏠",
    tagline: "Get started for free",
    popular: false,
    features: [
      "10 Hinglish hooks per day",
      "30-day content plan",
      "Basic analytics",
      "1 platform connection",
    ],
    locked: [
      "Script generator",
      "Video plan generator",
      "AI graphic prompts",
      "Post scheduling",
      "Content downloads",
      "My Projects",
      "Trends & ideas",
      "Brand Campaigns",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    emoji: "🚀",
    tagline: "For growing creators",
    popular: true,
    features: [
      "Everything in Free",
      "Unlimited script generator",
      "Video plan generator",
      "AI graphic prompts (DALL·E ready)",
      "Post scheduling",
      "Content downloads",
      "My Projects storage",
      "Trends & content ideas",
      "Priority email support",
    ],
    locked: ["Brand Campaigns", "Automation DMs", "Outreach DMs"],
  },
  {
    id: "pro",
    name: "Pro",
    emoji: "⭐",
    tagline: "For serious creators & coaches",
    popular: false,
    features: [
      "Everything in Basic",
      "Brand Campaigns access",
      "AI automation rules",
      "Brand outreach DMs",
      "Priority support",
      "Unlimited everything",
    ],
    locked: [],
  },
];

const planColors: Record<UserPlan, string> = {
  free: "oklch(0.72 0.012 250)",
  basic: "oklch(0.585 0.195 260)",
  pro: "oklch(0.78 0.18 80)",
};

export default function PricingTab({
  onNavigate,
  currentPlan = "free",
  onUpgradePlan,
}: Props) {
  const [paymentTarget, setPaymentTarget] = useState<UserPlan | null>(null);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");

  const handleUpgradeClick = (plan: UserPlan) => {
    setPaymentTarget(plan);
    setPaymentState("processing");
    setTimeout(() => {
      setPaymentState("success");
      setTimeout(() => {
        if (onUpgradePlan) onUpgradePlan(plan);
        toast.success("Plan upgraded successfully ✅");
        setPaymentTarget(null);
        setPaymentState("idle");
      }, 1200);
    }, 1500);
  };

  const getButtonLabel = (plan: UserPlan) => {
    if (plan === currentPlan) return "Current Plan ✅";
    if (PLAN_ORDER[plan] > PLAN_ORDER[currentPlan])
      return `Upgrade to ${plan === "pro" ? "Pro ⭐" : "Basic"}`;
    return "Downgrade";
  };

  const isCurrentOrLower = (plan: UserPlan) =>
    PLAN_ORDER[plan] <= PLAN_ORDER[currentPlan];

  return (
    <div className="animate-fade-in pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          data-ocid="pricing.back.button"
          className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-surface transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold gradient-text">Choose Your Plan</h1>
          <p className="text-xs text-muted-foreground">
            Unlock more features as you grow
          </p>
        </div>
      </div>

      {/* Current Plan Banner */}
      <div
        className="rounded-xl p-3.5 mb-5 flex items-center gap-3"
        style={{
          background: `${planColors[currentPlan]}18`,
          border: `1px solid ${planColors[currentPlan]}40`,
        }}
      >
        <Crown className="w-4 h-4" style={{ color: planColors[currentPlan] }} />
        <div>
          <p
            className="text-xs font-bold"
            style={{ color: planColors[currentPlan] }}
          >
            You are on the{" "}
            {currentPlan === "free"
              ? "Free"
              : currentPlan === "basic"
                ? "Basic"
                : "Pro"}{" "}
            plan
          </p>
          <p className="text-[10px] text-muted-foreground">
            {currentPlan === "free"
              ? "Upgrade to unlock more features"
              : currentPlan === "basic"
                ? "Upgrade to Pro for Brand Campaigns & Automation"
                : "You have access to all features 🎉"}
          </p>
        </div>
        <Badge
          className="ml-auto text-[10px] font-bold border-0 flex-shrink-0"
          style={{
            background: planColors[currentPlan],
            color:
              currentPlan === "pro" ? "oklch(0.12 0 0)" : "oklch(0.985 0 0)",
          }}
        >
          {PLAN_PRICES[currentPlan] === 0
            ? "Free"
            : `₹${PLAN_PRICES[currentPlan]}/mo`}
        </Badge>
      </div>

      {/* Plans */}
      <div className="space-y-4" data-ocid="pricing.list">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            data-ocid={`pricing.${plan.id}.card`}
            className="relative bg-card rounded-2xl p-5 card-glow"
            style={
              plan.popular
                ? {
                    boxShadow: `0 0 0 2px ${planColors[plan.id]}, 0 0 24px -4px ${planColors[plan.id]}40`,
                  }
                : undefined
            }
          >
            {plan.popular && (
              <Badge
                className="absolute -top-3 right-4 border-0 text-[10px] font-bold px-2.5 py-1"
                style={{
                  background: planColors[plan.id],
                  color: "oklch(0.985 0 0)",
                }}
                data-ocid="pricing.popular.badge"
              >
                <Crown className="w-2.5 h-2.5 mr-1" />
                Most Popular
              </Badge>
            )}

            {/* Plan header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{plan.emoji}</span>
                  <h2 className="text-base font-bold">{plan.name}</h2>
                  {plan.id === currentPlan && (
                    <Badge
                      className="text-[9px] border-0 font-bold"
                      style={{
                        background: `${planColors[plan.id]}25`,
                        color: planColors[plan.id],
                      }}
                    >
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{plan.tagline}</p>
              </div>
              <div className="text-right flex-shrink-0">
                {PLAN_PRICES[plan.id] === 0 ? (
                  <p
                    className="text-2xl font-bold"
                    style={{ color: planColors[plan.id] }}
                  >
                    ₹0
                  </p>
                ) : (
                  <p className="text-2xl font-bold gradient-text">
                    ₹{PLAN_PRICES[plan.id]}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground">/month</p>
              </div>
            </div>

            {/* Features included */}
            <div className="space-y-1.5 mb-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${planColors[plan.id]}20` }}
                  >
                    <Check
                      className="w-2.5 h-2.5"
                      style={{ color: planColors[plan.id] }}
                    />
                  </div>
                  <span className="text-xs text-foreground">{feature}</span>
                </div>
              ))}
              {plan.locked.length > 0 &&
                plan.locked.slice(0, 2).map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 opacity-40"
                  >
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border border-border">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground line-through">
                      {feature}
                    </span>
                  </div>
                ))}
              {plan.locked.length > 2 && (
                <p className="text-[10px] text-muted-foreground pl-6">
                  +{plan.locked.length - 2} more locked features
                </p>
              )}
            </div>

            {/* CTA */}
            {plan.id === currentPlan ? (
              <div
                className="w-full h-11 rounded-full flex items-center justify-center gap-2 text-sm font-bold"
                style={{
                  background: `${planColors[plan.id]}20`,
                  color: planColors[plan.id],
                }}
              >
                <Check className="w-4 h-4" /> Current Plan
              </div>
            ) : (
              <Button
                type="button"
                data-ocid={`pricing.${plan.id}.primary_button`}
                onClick={() =>
                  !isCurrentOrLower(plan.id) && handleUpgradeClick(plan.id)
                }
                disabled={isCurrentOrLower(plan.id) && plan.id !== currentPlan}
                className="w-full h-11 rounded-full font-bold text-sm"
                style={
                  PLAN_ORDER[plan.id] > PLAN_ORDER[currentPlan]
                    ? {
                        background: planColors[plan.id],
                        color:
                          plan.id === "pro"
                            ? "oklch(0.12 0 0)"
                            : "oklch(0.985 0 0)",
                      }
                    : undefined
                }
                variant={
                  PLAN_ORDER[plan.id] <= PLAN_ORDER[currentPlan]
                    ? "outline"
                    : "default"
                }
              >
                {getButtonLabel(plan.id)}
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Fine print */}
      <p className="text-center text-[10px] text-muted-foreground mt-5 px-4 leading-relaxed">
        Prices in INR. Cancel anytime. Simulated payment for demo purposes.
      </p>

      {/* Footer */}
      <div className="text-center mt-6 pb-2">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue hover:text-brand-cyan transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>

      {/* Payment Simulation Dialog */}
      <Dialog
        open={!!paymentTarget && paymentState !== "idle"}
        onOpenChange={() =>
          paymentState === "success" && setPaymentTarget(null)
        }
      >
        <DialogContent
          className="bg-card border-border mx-4 rounded-2xl"
          data-ocid="pricing.payment.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-base text-center">
              {paymentState === "processing"
                ? "Processing Payment..."
                : "Payment Successful! 🎉"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            {paymentState === "processing" ? (
              <>
                <Loader2 className="w-10 h-10 animate-spin text-brand-blue mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  💳 Securing your payment...
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">🎉</div>
                <p className="text-sm font-bold text-foreground">
                  {paymentTarget === "basic" ? "Basic" : "Pro"} plan activated!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You now have access to all {paymentTarget} features.
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
