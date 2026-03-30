import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Crown } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onNavigate: (tab: string) => void;
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    emoji: "🚀",
    price: "₹999",
    tagline: "Perfect to get started",
    popular: false,
    features: [
      "30-day content plan",
      "10 viral hooks/month",
      "3 scripts/month",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start Free Trial",
    ctaStyle: "outline" as const,
  },
  {
    id: "growth",
    name: "Growth",
    emoji: "📈",
    price: "₹2999",
    tagline: "For serious creators",
    popular: true,
    features: [
      "Everything in Starter",
      "Unlimited hooks & scripts",
      "Trend-based hook generator",
      "Virality scoring",
      "Priority support",
    ],
    cta: "Get Growth Plan",
    ctaStyle: "green" as const,
  },
  {
    id: "agency",
    name: "Agency",
    emoji: "🏢",
    price: "₹6999",
    tagline: "Scale your content business",
    popular: false,
    features: [
      "Everything in Growth",
      "5 creator profiles",
      "Team collaboration",
      "White-label reports",
      "Dedicated account manager",
      "API access",
    ],
    cta: "Contact Sales",
    ctaStyle: "blue" as const,
  },
];

export default function PricingTab({ onNavigate }: Props) {
  return (
    <div className="animate-fade-in pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          data-ocid="pricing.back.button"
          className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-surface transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold gradient-text">Choose Your Plan</h1>
          <p className="text-xs text-muted-foreground">
            Start growing faster today
          </p>
        </div>
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
                    boxShadow:
                      "0 0 0 2px oklch(var(--brand-green)), 0 0 24px -4px oklch(var(--brand-green) / 0.25)",
                  }
                : undefined
            }
          >
            {plan.popular && (
              <Badge
                className="absolute -top-3 right-4 border-0 text-[10px] font-bold px-2.5 py-1"
                style={{
                  background: "oklch(var(--brand-green))",
                  color: "oklch(0.12 0.008 250)",
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
                </div>
                <p className="text-xs text-muted-foreground">{plan.tagline}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold gradient-text">{plan.price}</p>
                <p className="text-[10px] text-muted-foreground">/month</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-4">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(var(--brand-green) / 0.15)" }}
                  >
                    <Check className="w-2.5 h-2.5 text-brand-green" />
                  </div>
                  <span className="text-xs text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button
              type="button"
              data-ocid={`pricing.${plan.id}.primary_button`}
              className={`w-full h-11 rounded-full font-bold text-sm ${
                plan.ctaStyle === "green"
                  ? "green-glow"
                  : plan.ctaStyle === "blue"
                    ? "blue-glow"
                    : ""
              }`}
              variant={plan.ctaStyle === "outline" ? "outline" : "default"}
              style={
                plan.ctaStyle === "green"
                  ? {
                      background: "oklch(var(--brand-green))",
                      color: "oklch(0.12 0.008 250)",
                    }
                  : plan.ctaStyle === "blue"
                    ? {
                        background: "oklch(var(--brand-blue))",
                        color: "oklch(0.963 0.005 250)",
                      }
                    : undefined
              }
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Fine print */}
      <p className="text-center text-[10px] text-muted-foreground mt-5 px-4 leading-relaxed">
        All plans include 7-day free trial. Cancel anytime.{"\n"}Prices in INR +
        GST.
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
    </div>
  );
}
