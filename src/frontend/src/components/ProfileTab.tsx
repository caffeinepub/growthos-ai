import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  BarChart2,
  Bot,
  ChevronRight,
  Crown,
  FolderOpen,
  Handshake,
  Instagram,
  Loader2,
  Send,
  Settings,
  TrendingUp,
  UserCircle,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../backend";
import type { ConnectedAccounts } from "../types/growth";
import { PLAN_LABELS, type UserPlan } from "../utils/planGating";

interface Props {
  profile: UserProfile;
  onNavigate: (tab: string) => void;
  connectedAccounts: ConnectedAccounts;
  onUpdateConnectedAccounts: (update: Partial<ConnectedAccounts>) => void;
  userPlan: UserPlan;
}

type PlatformKey = "instagram" | "youtube";

const platformLabel: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
};

const goalLabel: Record<string, string> = {
  growth: "Audience Growth",
  leads: "Lead Generation",
  sales: "Sales & Revenue",
};

const planBadgeStyle: Record<UserPlan, { bg: string; color: string }> = {
  free: { bg: "oklch(0.68 0.22 80 / 0.15)", color: "oklch(0.82 0.18 80)" },
  basic: {
    bg: "oklch(0.585 0.195 260 / 0.15)",
    color: "oklch(0.72 0.185 215)",
  },
  pro: { bg: "oklch(0.78 0.18 80 / 0.20)", color: "oklch(0.78 0.18 80)" },
};

export default function ProfileTab({
  profile,
  onNavigate,
  connectedAccounts,
  onUpdateConnectedAccounts,
  userPlan,
}: Props) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  const [connectingPlatform, setConnectingPlatform] =
    useState<PlatformKey | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleOpenConnect = (platform: PlatformKey) => {
    setConnectingPlatform(platform);
    setUsernameInput("");
  };

  const handleConnect = () => {
    if (!usernameInput.trim() || !connectingPlatform) return;
    setIsConnecting(true);
    setTimeout(() => {
      onUpdateConnectedAccounts({
        [connectingPlatform]: {
          username: usernameInput.trim().replace(/^@/, ""),
          connectedAt: new Date().toISOString(),
        },
      });
      const label =
        connectingPlatform === "instagram" ? "Instagram" : "YouTube";
      toast.success(`${label} Connected ✅`);
      setIsConnecting(false);
      setConnectingPlatform(null);
      setUsernameInput("");
    }, 900);
  };

  const handleDisconnect = (platform: PlatformKey) => {
    const update: Partial<ConnectedAccounts> = {};
    update[platform] = undefined;
    onUpdateConnectedAccounts(update);
    const label = platform === "instagram" ? "Instagram" : "YouTube";
    toast.success(`${label} disconnected`);
  };

  const platformCards: Array<{
    key: PlatformKey;
    label: string;
    Icon: typeof Instagram;
    color: string;
    bg: string;
  }> = [
    {
      key: "instagram",
      label: "Instagram",
      Icon: Instagram,
      color: "oklch(0.68 0.18 300)",
      bg: "oklch(0.68 0.18 300 / 0.12)",
    },
    {
      key: "youtube",
      label: "YouTube",
      Icon: Youtube,
      color: "oklch(0.638 0.22 25)",
      bg: "oklch(0.638 0.22 25 / 0.12)",
    },
  ];

  const badgeStyle = planBadgeStyle[userPlan];

  return (
    <div className="animate-fade-in pb-4" data-ocid="profile.section">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold gradient-text">Profile</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your creator identity
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("settings")}
          className="h-8 text-xs border-border hover:bg-surface gap-1.5"
          data-ocid="profile.edit_button"
        >
          <Settings className="w-3.5 h-3.5" />
          Edit Profile
        </Button>
      </div>

      {/* Creator Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-5 card-glow mb-4"
        data-ocid="profile.card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.585 0.195 260 / 0.3), oklch(0.72 0.185 215 / 0.2))",
              border: "1px solid oklch(0.585 0.195 260 / 0.3)",
            }}
          >
            <UserCircle className="w-7 h-7 text-brand-cyan" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base text-foreground">
              {profile.niche || "Creator"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {platformLabel[profile.platform] ?? profile.platform}
            </p>
          </div>
          {/* Plan Badge */}
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 flex-shrink-0"
            style={{ background: badgeStyle.bg, color: badgeStyle.color }}
          >
            {userPlan === "pro" && <Crown className="w-3 h-3" />}
            {PLAN_LABELS[userPlan]} Plan
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-3"
            style={{ background: "oklch(0.135 0.009 250)" }}
          >
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Target Audience
            </p>
            <p className="text-xs font-semibold text-foreground leading-snug">
              {profile.targetAudience || "—"}
            </p>
          </div>
          <div
            className="rounded-xl p-3"
            style={{ background: "oklch(0.135 0.009 250)" }}
          >
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Content Goal
            </p>
            <p className="text-xs font-semibold text-brand-cyan leading-snug">
              {goalLabel[profile.contentGoal] ?? profile.contentGoal}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Connected Accounts */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mb-4"
        data-ocid="profile.connected.section"
      >
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Connected Accounts
        </p>
        <div className="grid grid-cols-2 gap-2">
          {platformCards.map(({ key, label, Icon, color, bg }, i) => {
            const account = connectedAccounts[key];
            const isConnected = !!account;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-card rounded-xl p-3.5 border border-border card-glow"
                data-ocid={`profile.${key}.card`}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <span className="text-xs font-semibold">{label}</span>
                </div>
                {isConnected ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-[11px] font-semibold text-foreground">
                        @{account?.username}
                      </p>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white inline-block mt-0.5"
                        style={{ background: "oklch(0.895 0.245 133)" }}
                      >
                        Connected ✅
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDisconnect(key)}
                      className="text-[10px] text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2"
                      data-ocid={`profile.${key}.delete_button`}
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleOpenConnect(key)}
                    className="w-full h-8 text-[11px] font-bold rounded-lg"
                    style={{ background: color, color: "oklch(0.985 0 0)" }}
                    data-ocid={`profile.${key}.primary_button`}
                  >
                    Connect {label}
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Access */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Quick Access
      </p>

      <div className="space-y-2.5 mb-4">
        {/* My Projects */}
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          onClick={() => onNavigate("myprojects")}
          className="w-full bg-card rounded-xl p-4 card-glow flex items-center gap-3 hover:bg-surface transition-colors text-left"
          data-ocid="profile.myprojects.link"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "oklch(0.895 0.245 133 / 0.15)",
              border: "1px solid oklch(0.895 0.245 133 / 0.25)",
            }}
          >
            <FolderOpen className="w-5 h-5 text-brand-green" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              My Projects 📁
            </p>
            <p className="text-xs text-muted-foreground">
              Saved graphics &amp; video plans
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </motion.button>

        {/* Trends */}
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 }}
          onClick={() => onNavigate("trends")}
          className="w-full bg-card rounded-xl p-4 card-glow flex items-center gap-3 hover:bg-surface transition-colors text-left"
          data-ocid="profile.trends.link"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "oklch(0.72 0.185 215 / 0.15)",
              border: "1px solid oklch(0.72 0.185 215 / 0.25)",
            }}
          >
            <TrendingUp className="w-5 h-5 text-brand-cyan" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Trends 📈</p>
            <p className="text-xs text-muted-foreground">
              Niche-specific viral hooks &amp; ideas
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </motion.button>

        {/* Analytics */}
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => onNavigate("analytics")}
          className="w-full bg-card rounded-xl p-4 card-glow flex items-center gap-3 hover:bg-surface transition-colors text-left"
          data-ocid="profile.analytics.link"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "oklch(0.72 0.185 215 / 0.15)",
              border: "1px solid oklch(0.72 0.185 215 / 0.25)",
            }}
          >
            <BarChart2 className="w-5 h-5 text-brand-cyan" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Analytics</p>
            <p className="text-xs text-muted-foreground">
              Log engagement &amp; track growth
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </motion.button>

        {/* Automation */}
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => onNavigate("automation")}
          className="w-full bg-card rounded-xl p-4 card-glow flex items-center gap-3 hover:bg-surface transition-colors text-left"
          data-ocid="profile.automation.link"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "oklch(0.895 0.245 133 / 0.15)",
              border: "1px solid oklch(0.895 0.245 133 / 0.25)",
            }}
          >
            <Bot className="w-5 h-5 text-brand-green" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Automation</p>
            <p className="text-xs text-muted-foreground">
              Comment rules &amp; DM templates
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </motion.button>

        {/* Brand Collabs */}
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => onNavigate("brands")}
          className="w-full bg-card rounded-xl p-4 card-glow flex items-center gap-3 hover:bg-surface transition-colors text-left"
          data-ocid="profile.brands.link"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "oklch(0.585 0.195 260 / 0.15)",
              border: "1px solid oklch(0.585 0.195 260 / 0.25)",
            }}
          >
            <Handshake className="w-5 h-5 text-brand-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Brand Collabs
            </p>
            <p className="text-xs text-muted-foreground">
              Browse deals &amp; send pitches
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </motion.button>

        {/* Brand Campaigns */}
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.22 }}
          onClick={() => onNavigate("brandcampaigns")}
          className="w-full bg-card rounded-xl p-4 card-glow flex items-center gap-3 hover:bg-surface transition-colors text-left"
          data-ocid="profile.brandcampaigns.link"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
            style={{
              background: "oklch(0.78 0.18 80 / 0.15)",
              border: "1px solid oklch(0.78 0.18 80 / 0.25)",
            }}
          >
            📊
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                Brand Campaigns
              </p>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: "oklch(0.78 0.18 80 / 0.2)",
                  color: "oklch(0.78 0.18 80)",
                }}
              >
                Pro
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Apply to real brand deals
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </motion.button>

        {/* Brand Outreach */}
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => onNavigate("outreach")}
          className="w-full bg-card rounded-xl p-4 card-glow flex items-center gap-3 hover:bg-surface transition-colors text-left"
          data-ocid="profile.outreach.link"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "oklch(0.68 0.18 300 / 0.15)",
              border: "1px solid oklch(0.68 0.18 300 / 0.25)",
            }}
          >
            <Send
              className="w-5 h-5"
              style={{ color: "oklch(0.68 0.18 300)" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Brand Outreach
            </p>
            <p className="text-xs text-muted-foreground">
              AI-powered DM campaigns
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </motion.button>

        {/* Upgrade Plan (if not Pro) */}
        {userPlan !== "pro" && (
          <motion.button
            type="button"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28 }}
            onClick={() => onNavigate("pricing")}
            className="w-full rounded-xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity text-left"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.585 0.195 260 / 0.2), oklch(0.72 0.185 215 / 0.15))",
              border: "1px solid oklch(0.585 0.195 260 / 0.35)",
            }}
            data-ocid="profile.upgrade.link"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.585 0.195 260 / 0.2)" }}
            >
              <Crown className="w-5 h-5 text-brand-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold gradient-text">
                {userPlan === "free" ? "Upgrade Plan ⚡" : "Upgrade to Pro ⭐"}
              </p>
              <p className="text-xs text-muted-foreground">
                {userPlan === "free"
                  ? "Unlock scripts, videos & more"
                  : "Unlock Brand Campaigns & Automation"}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-blue shrink-0" />
          </motion.button>
        )}
      </div>

      {/* Version + Footer */}
      <div className="mt-8 text-center">
        <p className="text-[11px] text-muted-foreground">
          GrowthOS AI v10 · India's Creator OS
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-1.5">
          © {year}.{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </div>

      {/* Connect Dialog */}
      <Dialog
        open={!!connectingPlatform}
        onOpenChange={(o) => !o && setConnectingPlatform(null)}
      >
        <DialogContent
          className="bg-card border-border mx-4 rounded-2xl"
          data-ocid="profile.connect.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              {connectingPlatform === "instagram" ? (
                <Instagram
                  className="w-5 h-5"
                  style={{ color: "oklch(0.68 0.18 300)" }}
                />
              ) : (
                <Youtube
                  className="w-5 h-5"
                  style={{ color: "oklch(0.638 0.22 25)" }}
                />
              )}
              Connect{" "}
              {connectingPlatform === "instagram" ? "Instagram" : "YouTube"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <Input
              placeholder={
                connectingPlatform === "instagram"
                  ? "@your_instagram_username"
                  : "Your YouTube channel name"
              }
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              className="bg-surface border-border h-11"
              data-ocid="profile.connect.input"
            />
            <Button
              type="button"
              onClick={handleConnect}
              disabled={!usernameInput.trim() || isConnecting}
              className="w-full h-11 rounded-full font-bold"
              style={{
                background:
                  connectingPlatform === "instagram"
                    ? "oklch(0.68 0.18 300)"
                    : "oklch(0.638 0.22 25)",
                color: "oklch(0.985 0 0)",
              }}
              data-ocid="profile.connect.submit_button"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Connecting...
                </>
              ) : (
                "Connect Account ✅"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
