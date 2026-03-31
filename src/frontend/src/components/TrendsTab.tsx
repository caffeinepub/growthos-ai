import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Loader2, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../backend";
import { type UserPlan, canAccess } from "../utils/planGating";

interface Props {
  profile: UserProfile;
  onNavigate: (tab: string) => void;
  userPlan: UserPlan;
}

const HOOK_TEMPLATES = [
  (n: string) => `3 things about ${n} nobody talks about 🤫`,
  (n: string) => `I tried ${n} for 30 days — here's what happened`,
  (n: string) => `Why most people fail at ${n} (and how to fix it)`,
  (n: string) => `The ${n} hack that changed everything for me 🔥`,
  (n: string) => `POV: You finally figured out ${n} 🚀`,
  (n: string) => `This ${n} mistake cost me months of progress ❌`,
  (n: string) => `Unpopular opinion: ${n} doesn't need to be complicated`,
  (n: string) => `The honest truth about ${n} that creators don't share`,
  (n: string) => `${n} beginners make this ONE mistake every time`,
  (n: string) => `I wish someone had told me this about ${n} earlier 💡`,
];

const IDEA_TEMPLATES = [
  (n: string) => `Behind-the-scenes: My ${n} workflow`,
  (n: string) => `A day in my life as a ${n} creator`,
  (n: string) => `Common ${n} mistakes (and quick fixes)`,
  (n: string) => `How I went from 0 to 10K followers talking about ${n}`,
  (n: string) => `${n} tools I can't live without in 2026`,
  (n: string) => `What I would do differently if I started ${n} today`,
  (n: string) => `${n} in 60 seconds — quick tutorial`,
  (n: string) => `The ${n} content calendar that actually works`,
];

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++)
    h = (h * 31 + str.charCodeAt(i)) & 0x7fffffff;
  return h;
}

function generateTrends(
  niche: string,
  seed: number,
): { hooks: string[]; ideas: string[] } {
  const hash = simpleHash(niche) + seed;
  const hooks = HOOK_TEMPLATES.map((_, i) =>
    HOOK_TEMPLATES[(i + hash) % HOOK_TEMPLATES.length](niche),
  );
  const ideas = IDEA_TEMPLATES.map((_, i) =>
    IDEA_TEMPLATES[(i + hash) % IDEA_TEMPLATES.length](niche),
  );
  return { hooks, ideas };
}

export default function TrendsTab({ profile, onNavigate, userPlan }: Props) {
  const canUse = canAccess(userPlan, "trends");
  const [seed, setSeed] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const niche = profile.niche || "Creator";
  const { hooks, ideas } = generateTrends(niche, seed);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSeed((prev) => prev + 1);
      setIsRefreshing(false);
      toast.success("Trends refreshed ✅");
    }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied ✅");
  };

  return (
    <div className="animate-fade-in pb-4" data-ocid="trends.section">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          data-ocid="trends.back.button"
          className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-surface transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold gradient-text">📈 Trends</h1>
          <p className="text-xs text-muted-foreground">
            AI-generated for your niche
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing || !canUse}
          className="h-8 px-3 text-xs gap-1.5 border-border hover:bg-surface flex-shrink-0"
          data-ocid="trends.refresh.button"
        >
          {isRefreshing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Refresh
        </Button>
      </div>

      {!canUse ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-card rounded-2xl border border-border"
          data-ocid="trends.upgrade.card"
        >
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-sm font-bold mb-2">Upgrade to Basic</p>
          <p className="text-xs text-muted-foreground mb-5 px-4 leading-relaxed">
            Trends is available on Basic and Pro plans. Get niche-specific viral
            hooks and content ideas.
          </p>
          <Button
            type="button"
            onClick={() => onNavigate("pricing")}
            className="h-11 px-6 rounded-full font-bold"
            style={{
              background: "oklch(var(--brand-blue))",
              color: "oklch(0.985 0 0)",
            }}
            data-ocid="trends.upgrade.primary_button"
          >
            Upgrade to unlock 🔒
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={seed}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Niche badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Trends for:</span>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  background: "oklch(0.585 0.195 260 / 0.15)",
                  color: "oklch(0.72 0.185 215)",
                }}
              >
                {niche}
              </span>
            </div>

            {/* Trending Hooks */}
            <div>
              <p className="text-sm font-bold mb-3">🔥 Trending Hooks</p>
              {isRefreshing ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Generating trends...</span>
                </div>
              ) : (
                <div className="space-y-2" data-ocid="trends.hooks.list">
                  {hooks.map((hook, i) => (
                    <motion.div
                      key={hook}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      data-ocid={`trends.hooks.item.${i + 1}`}
                      className="bg-card rounded-xl p-3.5 border border-border card-glow flex items-start gap-3"
                    >
                      <span className="text-base flex-shrink-0 mt-0.5">🔥</span>
                      <p className="text-xs text-foreground flex-1 leading-relaxed">
                        {hook}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopy(hook)}
                        data-ocid={`trends.hooks.secondary_button.${i + 1}`}
                        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Content Ideas */}
            {!isRefreshing && (
              <div>
                <p className="text-sm font-bold mb-3">💡 Content Ideas</p>
                <div className="space-y-2" data-ocid="trends.ideas.list">
                  {ideas.map((idea, i) => (
                    <motion.div
                      key={idea}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.04 }}
                      data-ocid={`trends.ideas.item.${i + 1}`}
                      className="bg-card rounded-xl p-3.5 border border-border flex items-start gap-3"
                    >
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                        style={{
                          background: "oklch(0.72 0.185 215 / 0.15)",
                          color: "oklch(0.72 0.185 215)",
                        }}
                      >
                        #{i + 1}
                      </span>
                      <p className="text-xs text-foreground flex-1 leading-relaxed">
                        {idea}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopy(idea)}
                        data-ocid={`trends.ideas.secondary_button.${i + 1}`}
                        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
