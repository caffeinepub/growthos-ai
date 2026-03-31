import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Crown,
  DollarSign,
  Instagram,
  Loader2,
  LogOut,
  Save,
  TrendingUp,
  Users,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ContentGoal, Platform, type UserProfile } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveProfile } from "../hooks/useQueries";

interface Props {
  profile: UserProfile;
  onNavigate?: (tab: string) => void;
}

export default function SettingsTab({ profile, onNavigate }: Props) {
  const [niche, setNiche] = useState(profile.niche);
  const [targetAudience, setTargetAudience] = useState(profile.targetAudience);
  const [platform, setPlatform] = useState<Platform>(profile.platform);
  const [contentGoal, setContentGoal] = useState<ContentGoal>(
    profile.contentGoal,
  );
  const saveProfile = useSaveProfile();
  const { clear, identity } = useInternetIdentity();

  useEffect(() => {
    setNiche(profile.niche);
    setTargetAudience(profile.targetAudience);
    setPlatform(profile.platform);
    setContentGoal(profile.contentGoal);
  }, [profile]);

  const handleSave = () => {
    saveProfile.mutate(
      { niche, targetAudience, platform, contentGoal },
      { onSuccess: () => toast.success("Profile updated!") },
    );
  };

  const isDirty =
    niche !== profile.niche ||
    targetAudience !== profile.targetAudience ||
    platform !== profile.platform ||
    contentGoal !== profile.contentGoal;

  return (
    <div className="animate-fade-in">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-5">
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            data-ocid="settings.back.button"
            className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-surface transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-5 card-glow mb-5"
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.585 0.195 260 / 0.3), oklch(0.72 0.185 215 / 0.2))",
            }}
          >
            🚀
          </div>
          <div>
            <p className="font-bold text-sm">{niche || "Creator"}</p>
            {identity && (
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                {identity.getPrincipal().toString().slice(0, 20)}...
              </p>
            )}
          </div>
          <Badge className="ml-auto bg-brand-blue/15 text-brand-cyan border-brand-blue/30 text-xs capitalize">
            {platform}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Niche
            </Label>
            <Input
              data-ocid="settings.input"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="bg-surface border-border text-foreground"
              placeholder="Your content niche"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Target Audience
            </Label>
            <Input
              data-ocid="settings.input"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="bg-surface border-border text-foreground"
              placeholder="Who you create for"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Platform
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  value: Platform.instagram,
                  label: "Instagram",
                  icon: Instagram,
                },
                { value: Platform.youtube, label: "YouTube", icon: Youtube },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setPlatform(value)}
                  data-ocid="settings.toggle"
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-sm ${
                    platform === value
                      ? "border-brand-blue bg-brand-blue/10 text-foreground"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Content Goal
            </Label>
            <div className="space-y-2">
              {[
                {
                  value: ContentGoal.growth,
                  label: "Audience Growth",
                  icon: TrendingUp,
                },
                {
                  value: ContentGoal.leads,
                  label: "Lead Generation",
                  icon: Users,
                },
                {
                  value: ContentGoal.sales,
                  label: "Drive Sales",
                  icon: DollarSign,
                },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setContentGoal(value)}
                  data-ocid="settings.radio"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-sm ${
                    contentGoal === value
                      ? "border-brand-blue bg-brand-blue/10 text-foreground"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save button */}
      <Button
        type="button"
        data-ocid="settings.save_button"
        onClick={handleSave}
        disabled={!isDirty || saveProfile.isPending}
        className="w-full h-12 rounded-full font-bold text-sm mb-3 green-glow"
        style={{
          background: isDirty ? "oklch(var(--brand-green))" : undefined,
          color: isDirty ? "oklch(0.12 0.008 250)" : undefined,
        }}
      >
        {saveProfile.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" /> Update Profile
          </>
        )}
      </Button>

      {/* Logout */}
      {identity && (
        <Button
          type="button"
          data-ocid="settings.delete_button"
          onClick={clear}
          variant="outline"
          className="w-full h-12 rounded-full font-bold text-sm border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      )}

      {/* View Plans */}
      {onNavigate && (
        <button
          type="button"
          onClick={() => onNavigate("pricing")}
          data-ocid="settings.pricing.button"
          className="w-full h-12 rounded-full border border-brand-blue/30 bg-brand-blue/10 flex items-center justify-center gap-2 mt-3 hover:bg-brand-blue/20 transition-colors"
        >
          <Crown className="w-4 h-4 text-brand-cyan" />
          <span className="gradient-text font-bold text-sm">
            View Plans &amp; Pricing
          </span>
        </button>
      )}

      {/* Footer */}
      <div className="text-center mt-8 pb-2">
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
