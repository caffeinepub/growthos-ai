import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, DollarSign } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { Application } from "../types/growth";
import { type UserPlan, canAccess } from "../utils/planGating";

interface Props {
  onNavigate: (tab: string) => void;
  onAddApplication: (app: Application) => void;
  userPlan: UserPlan;
}

const MOCK_CAMPAIGNS = [
  {
    id: "1",
    brandName: "boAt",
    logo: "🎧",
    category: "Electronics",
    campaign: "Airdopes 151 - Student Lifestyle",
    budget: "₹15,000–₹25,000",
    deadline: "2026-04-30",
    requirements: "Instagram Reel (30s), YouTube Short",
    status: "Open",
  },
  {
    id: "2",
    brandName: "Mamaearth",
    logo: "🌿",
    category: "Beauty",
    campaign: "Vitamin C Glow Series",
    budget: "₹8,000–₹15,000",
    deadline: "2026-04-15",
    requirements: "3x Instagram Stories + 1 Post",
    status: "Open",
  },
  {
    id: "3",
    brandName: "CRED",
    logo: "💳",
    category: "Fintech",
    campaign: "Credit Score Awareness",
    budget: "₹20,000–₹40,000",
    deadline: "2026-05-10",
    requirements: "YouTube video (5+ min)",
    status: "Open",
  },
  {
    id: "4",
    brandName: "Nykaa",
    logo: "💄",
    category: "Beauty",
    campaign: "Summer Beauty Haul",
    budget: "₹10,000–₹20,000",
    deadline: "2026-04-20",
    requirements: "Instagram Reel + Swipe Post",
    status: "Open",
  },
  {
    id: "5",
    brandName: "Swiggy",
    logo: "🍔",
    category: "Food Tech",
    campaign: "Late Night Cravings",
    budget: "₹5,000–₹10,000",
    deadline: "2026-04-12",
    requirements: "Instagram Story Series (5 slides)",
    status: "Closing Soon",
  },
  {
    id: "6",
    brandName: "Noise",
    logo: "⌚",
    category: "Electronics",
    campaign: "ColorFit Pro 5 Launch",
    budget: "₹12,000–₹22,000",
    deadline: "2026-05-01",
    requirements: "Unboxing Reel + Review Post",
    status: "Open",
  },
] as const;

function formatDeadline(dateStr: string): string {
  const parts = dateStr.split("-").map(Number);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[parts[1] - 1]} ${parts[2]}, ${parts[0]}`;
}

export default function BrandCampaignsTab({
  onNavigate,
  onAddApplication,
  userPlan,
}: Props) {
  const canUse = canAccess(userPlan, "brand_campaigns");

  const handleApply = (c: (typeof MOCK_CAMPAIGNS)[number]) => {
    const app: Application = {
      id: `campaign-${c.id}-${Date.now()}`,
      brandName: c.brandName,
      campaignName: c.campaign,
      status: "Applied",
      notes: `Requirements: ${c.requirements}. Budget: ${c.budget}.`,
      dateApplied: new Date().toISOString(),
    };
    onAddApplication(app);
    toast.success("Applied! Track in My Applications ✅");
  };

  return (
    <div className="animate-fade-in pb-4" data-ocid="brandcampaigns.section">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          data-ocid="brandcampaigns.back.button"
          className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-surface transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold gradient-text">
            Brand Campaigns 📊
          </h1>
          <p className="text-xs text-muted-foreground">
            Discover and apply to brand deals
          </p>
        </div>
      </div>

      {!canUse ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-card rounded-2xl border border-border"
          data-ocid="brandcampaigns.upgrade.card"
        >
          <div className="text-5xl mb-4">⭐</div>
          <p className="text-sm font-bold mb-2">Pro Feature</p>
          <p className="text-xs text-muted-foreground mb-5 px-4 leading-relaxed">
            Brand Campaigns is exclusive to the Pro plan. Access real brand
            deals, apply directly, and grow your income.
          </p>
          <Button
            type="button"
            onClick={() => onNavigate("pricing")}
            className="h-11 px-6 rounded-full font-bold"
            style={{
              background: "oklch(0.78 0.18 80)",
              color: "oklch(0.12 0 0)",
            }}
            data-ocid="brandcampaigns.upgrade.primary_button"
          >
            Upgrade to Pro ⭐
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4" data-ocid="brandcampaigns.list">
          <p className="text-xs text-muted-foreground">
            {MOCK_CAMPAIGNS.length} active campaigns available
          </p>
          <AnimatePresence>
            {MOCK_CAMPAIGNS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                data-ocid={`brandcampaigns.item.${i + 1}`}
                className="bg-card rounded-2xl p-4 card-glow border border-border"
              >
                {/* Brand header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: "oklch(0.195 0.012 250)" }}
                  >
                    {c.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-foreground">
                        {c.brandName}
                      </p>
                      <Badge
                        className="text-[10px] border px-2 py-0"
                        style={{
                          background: "oklch(0.585 0.195 260 / 0.12)",
                          borderColor: "oklch(0.585 0.195 260 / 0.3)",
                          color: "oklch(0.72 0.185 215)",
                        }}
                      >
                        {c.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {c.campaign}
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={
                      c.status === "Open"
                        ? {
                            background: "oklch(0.895 0.245 133 / 0.12)",
                            color: "oklch(0.895 0.245 133)",
                          }
                        : {
                            background: "oklch(0.78 0.18 80 / 0.15)",
                            color: "oklch(0.78 0.18 80)",
                          }
                    }
                  >
                    {c.status === "Open" ? "🟢" : "🟡"} {c.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <DollarSign className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                    <span className="font-semibold text-foreground">
                      {c.budget}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-brand-cyan flex-shrink-0" />
                    <span>
                      Deadline:{" "}
                      <span className="text-foreground font-medium">
                        {formatDeadline(c.deadline)}
                      </span>
                    </span>
                  </div>
                  <div className="bg-surface rounded-lg p-2.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Requirements
                    </p>
                    <p className="text-xs text-foreground">{c.requirements}</p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => handleApply(c)}
                  className="w-full h-10 rounded-full font-bold text-sm"
                  style={{
                    background: "oklch(var(--brand-blue))",
                    color: "oklch(0.985 0 0)",
                  }}
                  data-ocid={`brandcampaigns.primary_button.${i + 1}`}
                >
                  Apply Now →
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
