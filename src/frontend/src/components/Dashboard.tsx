import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart2,
  Briefcase,
  ChevronRight,
  Copy,
  FileText,
  Loader2,
  Send,
  Settings,
  TrendingUp,
  UserCircle,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { toast } from "sonner";
import { ContentStatus, ContentType, type UserProfile } from "../backend";
import {
  useContentPlan,
  useGenerateHooks,
  useHooks,
  useScripts,
  useStats,
} from "../hooks/useQueries";
import type { UserPlan } from "../utils/planGating";
import { computeViralityScore, getScoreColor } from "../utils/viralityScore";

interface Props {
  profile: UserProfile;
  onNavigate: (tab: string, subTab?: string) => void;
  pendingApplicationsCount?: number;
  userPlan?: UserPlan;
}

const typeColors: Record<ContentType, string> = {
  [ContentType.educational]: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  [ContentType.story]: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  [ContentType.sales]:
    "bg-brand-green/15 text-brand-green border-brand-green/20",
};

const typeLabels: Record<ContentType, string> = {
  [ContentType.educational]: "Educational",
  [ContentType.story]: "Story",
  [ContentType.sales]: "Sales",
};

const typeShortLabels: Record<ContentType, string> = {
  [ContentType.educational]: "Edu",
  [ContentType.story]: "Story",
  [ContentType.sales]: "Sales",
};

export default function Dashboard({
  profile,
  onNavigate,
  pendingApplicationsCount = 0,
  userPlan = "free",
}: Props) {
  const { data: plan, isLoading: planLoading } = useContentPlan();
  const { data: hooks, isLoading: hooksLoading } = useHooks();
  const { data: scripts, isLoading: scriptsLoading } = useScripts();
  const stats = useStats();
  const generateHooks = useGenerateHooks();

  const todayItem =
    plan?.find((item) => item.status === ContentStatus.planned) ?? plan?.[0];
  const recentHooks = hooks?.slice(0, 3) ?? [];
  const recentScripts = scripts?.slice(0, 2) ?? [];

  const topContent = useMemo(() => {
    if (!plan || plan.length === 0) return "Mixed";
    const counts: Record<string, number> = {};
    for (const item of plan) {
      const key = String(item.contentType);
      counts[key] = (counts[key] || 0) + 1;
    }
    const topEntry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!topEntry) return "Mixed";
    return typeShortLabels[topEntry[0] as ContentType] ?? "Mixed";
  }, [plan]);

  const { avgScore, avgScoreColor } = useMemo(() => {
    if (!scripts || scripts.length === 0)
      return { avgScore: "--", avgScoreColor: "text-muted-foreground" };
    const total = scripts.reduce(
      (sum, s) => sum + computeViralityScore(s.id),
      0,
    );
    const avg = Math.round(total / scripts.length);
    return { avgScore: avg, avgScoreColor: getScoreColor(avg) };
  }, [scripts]);

  const handleCopyHook = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied ✅");
  };

  return (
    <div className="pb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">GrowthOS AI</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your AI growth partner
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-brand-blue/15 text-brand-cyan border-brand-blue/30 text-xs font-medium capitalize">
            {profile.niche}
          </Badge>
          <button
            type="button"
            onClick={() => onNavigate("settings")}
            data-ocid="dashboard.settings.button"
            className="w-8 h-8 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-surface transition-colors flex-shrink-0"
          >
            <Settings className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Upgrade Banner — dynamic based on plan */}
      {userPlan !== "pro" && (
        <button
          type="button"
          onClick={() => onNavigate("pricing")}
          data-ocid="dashboard.pricing.button"
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-brand-blue/10 border border-brand-blue/20 mb-5 hover:bg-brand-blue/15 transition-colors"
        >
          <span className="text-xs text-brand-cyan font-medium">
            {userPlan === "free"
              ? "✨ Unlock Scripts, Video & Graphic Generator"
              : "⭐ Upgrade to Pro for Brand Campaigns & Automation"}
          </span>
          <div className="flex items-center gap-1 text-xs text-brand-blue font-semibold flex-shrink-0">
            View Plans <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {[
          {
            label: "Content Posted",
            value: stats.contentPosted,
            icon: Zap,
            color: "text-brand-green",
          },
          {
            label: "Hooks Made",
            value: stats.hooksGenerated,
            icon: Zap,
            color: "text-brand-blue",
          },
          {
            label: "Leads",
            value: stats.totalLeads,
            icon: Users,
            color: "text-amber-400",
          },
          {
            label: "Scripts",
            value: stats.scriptsCreated,
            icon: FileText,
            color: "text-purple-400",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card rounded-xl p-3 card-glow"
          >
            <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Today's Content */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold">Today's Content</h2>
          <button
            type="button"
            onClick={() => onNavigate("content", "plan")}
            className="text-xs text-brand-blue flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {planLoading ? (
          <Skeleton className="h-24 rounded-xl" />
        ) : todayItem ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-4 card-glow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground">
                    DAY {todayItem.day}
                  </span>
                  <Badge
                    className={`text-[10px] border ${typeColors[todayItem.contentType]}`}
                  >
                    {typeLabels[todayItem.contentType]}
                  </Badge>
                </div>
                <p className="text-sm font-semibold leading-tight">
                  {todayItem.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {todayItem.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("content", "plan")}
                className="text-xs text-brand-blue flex items-center gap-0.5 flex-shrink-0 mt-1"
              >
                View <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ) : (
          <div
            className="bg-card rounded-xl p-4 text-center"
            data-ocid="dashboard.plan.empty_state"
          >
            <p className="text-xs text-muted-foreground mb-2">
              No content plan yet. Generate your 30-day plan!
            </p>
            <button
              type="button"
              onClick={() => onNavigate("content", "plan")}
              className="text-xs text-brand-blue font-medium"
            >
              Generate plan →
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-5">
        <h2 className="text-sm font-semibold mb-2.5">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            type="button"
            data-ocid="dashboard.primary_button"
            onClick={() => {
              if (profile.niche) generateHooks.mutate(profile.niche);
            }}
            disabled={generateHooks.isPending}
            variant="outline"
            className="h-11 rounded-xl border-border bg-card hover:bg-surface text-sm font-medium gap-2"
          >
            {generateHooks.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-brand-green" />
            )}
            Gen Hooks
          </Button>
          <Button
            type="button"
            data-ocid="dashboard.secondary_button"
            onClick={() => onNavigate("content", "scripts")}
            variant="outline"
            className="h-11 rounded-xl border-border bg-card hover:bg-surface text-sm font-medium gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            Write Script
          </Button>
          <Button
            type="button"
            data-ocid="dashboard.leads_button"
            onClick={() => onNavigate("leads")}
            variant="outline"
            className="h-11 rounded-xl border-border bg-card hover:bg-surface text-sm font-medium gap-2"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            Add Lead
          </Button>
          <Button
            type="button"
            data-ocid="dashboard.analytics_button"
            onClick={() => onNavigate("analytics")}
            variant="outline"
            className="h-11 rounded-xl border-border bg-card hover:bg-surface text-sm font-medium gap-2"
          >
            <BarChart2 className="w-3.5 h-3.5 text-brand-cyan" />
            Log Stats
          </Button>

          {/* Trends */}
          <Button
            type="button"
            data-ocid="dashboard.trends_button"
            onClick={() => onNavigate("trends")}
            variant="outline"
            className="h-11 rounded-xl border-border bg-card hover:bg-surface text-sm font-medium gap-2"
          >
            <TrendingUp className="w-3.5 h-3.5 text-brand-cyan" />
            Trends
          </Button>

          {/* Brand Campaigns */}
          <Button
            type="button"
            data-ocid="dashboard.brandcampaigns_button"
            onClick={() => onNavigate("brandcampaigns")}
            variant="outline"
            className="h-11 rounded-xl border-border bg-card hover:bg-surface text-sm font-medium gap-2"
          >
            <span className="text-sm">📊</span>
            Campaigns
          </Button>

          {/* Applications shortcut */}
          <Button
            type="button"
            data-ocid="dashboard.applications_button"
            onClick={() => onNavigate("applications")}
            variant="outline"
            className="col-span-2 h-11 rounded-xl border-border bg-card hover:bg-surface text-sm font-medium gap-2 justify-start px-4"
          >
            <Briefcase className="w-3.5 h-3.5 text-brand-blue" />
            My Applications
            {pendingApplicationsCount > 0 && (
              <span
                className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: "oklch(0.585 0.195 260)" }}
              >
                {pendingApplicationsCount} pending
              </span>
            )}
          </Button>

          {/* Brand Outreach shortcut */}
          <Button
            type="button"
            data-ocid="dashboard.outreach_button"
            onClick={() => onNavigate("outreach")}
            variant="outline"
            className="col-span-2 h-11 rounded-xl border-border bg-card hover:bg-surface text-sm font-medium gap-2 justify-start px-4"
          >
            <Send className="w-3.5 h-3.5 text-pink-400" />
            Brand Outreach
            <span className="ml-auto text-[10px] text-muted-foreground">
              AI-powered
            </span>
          </Button>
        </div>
      </div>

      {/* Creator Profile */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold">Creator Profile</h2>
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="text-xs text-brand-blue flex items-center gap-0.5"
          >
            Edit <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-4 card-glow"
        >
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <UserCircle className="w-5 h-5 text-brand-blue mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground">Niche</p>
              <p className="text-xs font-semibold capitalize">
                {profile.niche}
              </p>
            </div>
            <div className="text-center">
              <BarChart2 className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground">Top Content</p>
              <p className="text-xs font-semibold">{topContent}</p>
            </div>
            <div className="text-center">
              <Zap
                className="w-5 h-5 mx-auto mb-1"
                style={{ color: avgScoreColor.replace("text-", "") }}
              />
              <p className="text-[10px] text-muted-foreground">Avg Score</p>
              <p className={`text-xs font-semibold ${avgScoreColor}`}>
                {avgScore}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Hooks */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold">Recent Hooks</h2>
          <button
            type="button"
            onClick={() => onNavigate("content", "hooks")}
            className="text-xs text-brand-blue flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {hooksLoading ? (
          <Skeleton className="h-20 rounded-xl" />
        ) : recentHooks.length === 0 ? (
          <div
            className="bg-card rounded-xl p-4 text-center"
            data-ocid="dashboard.hooks.empty_state"
          >
            <p className="text-xs text-muted-foreground">
              No hooks yet. Generate some! 🔥
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentHooks.map((hook, i) => (
              <motion.div
                key={hook.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`dashboard.hooks.item.${i + 1}`}
                className="bg-card rounded-xl p-3 card-glow flex items-start gap-3"
              >
                <span className="text-base flex-shrink-0 mt-0.5">🔥</span>
                <p className="text-xs text-foreground flex-1 leading-relaxed line-clamp-2">
                  {hook.text}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyHook(hook.text)}
                  className="text-muted-foreground hover:text-foreground flex-shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Scripts */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold">Recent Scripts</h2>
          <button
            type="button"
            onClick={() => onNavigate("content", "scripts")}
            className="text-xs text-brand-blue flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {scriptsLoading ? (
          <Skeleton className="h-16 rounded-xl" />
        ) : recentScripts.length === 0 ? (
          <div
            className="bg-card rounded-xl p-4 text-center"
            data-ocid="dashboard.scripts.empty_state"
          >
            <p className="text-xs text-muted-foreground">
              No scripts yet. Write your first! ✍️
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentScripts.map((script, i) => (
              <motion.div
                key={script.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`dashboard.scripts.item.${i + 1}`}
                className="bg-card rounded-xl p-3 card-glow"
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <p className="text-xs font-semibold line-clamp-1">
                    {script.title}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {script.hook}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
