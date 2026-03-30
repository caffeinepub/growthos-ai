import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Bot,
  ChevronRight,
  Handshake,
  Settings,
  UserCircle,
} from "lucide-react";
import { motion } from "motion/react";
import type { UserProfile } from "../backend";

interface Props {
  profile: UserProfile;
  onNavigate: (tab: string) => void;
}

const platformLabel: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
};

const goalLabel: Record<string, string> = {
  growth: "Audience Growth",
  leads: "Lead Generation",
  sales: "Sales & Revenue",
};

export default function ProfileTab({ profile, onNavigate }: Props) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

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
          <div>
            <p className="font-bold text-base text-foreground">
              {profile.niche || "Creator"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {platformLabel[profile.platform] ?? profile.platform}
            </p>
          </div>
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

      {/* Quick Access */}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Quick Access
      </p>

      <div className="space-y-2.5 mb-4">
        {/* Analytics Card */}
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

        {/* Automation Card */}
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
      </div>

      {/* Version + Footer */}
      <div className="mt-8 text-center">
        <p className="text-[11px] text-muted-foreground">
          GrowthOS AI v5 · India's Creator OS
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
    </div>
  );
}
