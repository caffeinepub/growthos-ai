import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  DollarSign,
  Instagram,
  Loader2,
  TrendingUp,
  Users,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ContentGoal, Platform, type UserProfile } from "../backend";
import { useSaveProfileAndGenerate } from "../hooks/useQueries";

const steps = [
  {
    label: "Niche",
    title: "What's your niche?",
    subtitle: "Tell us what you create content about",
  },
  {
    label: "Audience",
    title: "Who's your audience?",
    subtitle: "Describe your ideal follower",
  },
  {
    label: "Platform",
    title: "Choose your platform",
    subtitle: "Where do you post content?",
  },
  {
    label: "Goal",
    title: "What's your goal?",
    subtitle: "What do you want to achieve?",
  },
];

const nicheExamples = [
  "Fitness",
  "Finance",
  "Cooking",
  "Digital Marketing",
  "Fashion",
  "Travel",
];

interface Props {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [niche, setNiche] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [platform, setPlatform] = useState<Platform>(Platform.instagram);
  const [contentGoal, setContentGoal] = useState<ContentGoal>(
    ContentGoal.growth,
  );

  const saveAndGenerate = useSaveProfileAndGenerate();

  const canContinue = () => {
    if (step === 0) return niche.trim().length > 0;
    if (step === 1) return targetAudience.trim().length > 0;
    return true;
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      const profile: UserProfile = {
        niche,
        targetAudience,
        platform,
        contentGoal,
      };
      saveAndGenerate.mutate(profile, { onSuccess: () => onComplete() });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.12 0.01 260), oklch(0.115 0.008 250) 60%)",
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col items-center"
      >
        <img
          src="/assets/generated/growthos-logo-transparent.dim_120x120.png"
          alt="GrowthOS"
          className="w-14 h-14 mb-3"
        />
        <span className="text-xl font-bold gradient-text">GrowthOS AI</span>
      </motion.div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8" data-ocid="onboarding.panel">
        {steps.map((s, i) => (
          <div
            key={s.label}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step
                ? "w-8 bg-brand-blue"
                : i < step
                  ? "w-4 bg-brand-green"
                  : "w-4 bg-border"
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="bg-card rounded-2xl p-6 card-glow"
          >
            <h2 className="text-xl font-bold text-foreground mb-1">
              {steps[step].title}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {steps[step].subtitle}
            </p>

            {step === 0 && (
              <div className="space-y-4">
                <Input
                  data-ocid="onboarding.input"
                  placeholder="e.g. Fitness, Finance, Cooking..."
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="bg-surface border-border text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <div className="flex flex-wrap gap-2">
                  {nicheExamples.map((ex) => (
                    <button
                      type="button"
                      key={ex}
                      onClick={() => setNiche(ex)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        niche === ex
                          ? "bg-brand-blue text-white border-brand-blue"
                          : "border-border text-muted-foreground hover:border-brand-blue hover:text-foreground"
                      }`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <Input
                  data-ocid="onboarding.input"
                  placeholder="e.g. Young professionals aged 22-35"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="bg-surface border-border text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: Platform.instagram,
                    label: "Instagram",
                    icon: Instagram,
                    color: "from-pink-500 to-purple-600",
                  },
                  {
                    value: Platform.youtube,
                    label: "YouTube",
                    icon: Youtube,
                    color: "from-red-500 to-red-600",
                  },
                ].map(({ value, label, icon: Icon, color }) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setPlatform(value)}
                    data-ocid="onboarding.toggle"
                    className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                      platform === value
                        ? "border-brand-blue bg-brand-blue/10"
                        : "border-border bg-surface hover:border-border/70"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold">{label}</span>
                    {platform === value && (
                      <div className="w-2 h-2 rounded-full bg-brand-blue" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                {[
                  {
                    value: ContentGoal.growth,
                    label: "Audience Growth",
                    desc: "Build followers & reach",
                    icon: TrendingUp,
                    color: "text-brand-blue",
                  },
                  {
                    value: ContentGoal.leads,
                    label: "Lead Generation",
                    desc: "Get DMs & inquiries",
                    icon: Users,
                    color: "text-brand-teal",
                  },
                  {
                    value: ContentGoal.sales,
                    label: "Drive Sales",
                    desc: "Convert followers to buyers",
                    icon: DollarSign,
                    color: "text-brand-green",
                  },
                ].map(({ value, label, desc, icon: Icon, color }) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setContentGoal(value)}
                    data-ocid="onboarding.radio"
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      contentGoal === value
                        ? "border-brand-blue bg-brand-blue/10"
                        : "border-border bg-surface hover:border-border/70"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center ${color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    {contentGoal === value && (
                      <div className="w-2 h-2 rounded-full bg-brand-blue" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA Button */}
        <div className="mt-5">
          <Button
            type="button"
            data-ocid="onboarding.primary_button"
            onClick={handleContinue}
            disabled={!canContinue() || saveAndGenerate.isPending}
            className="w-full h-12 rounded-full text-sm font-bold green-glow"
            style={{
              background: "oklch(var(--brand-green))",
              color: "oklch(0.12 0.008 250)",
            }}
          >
            {saveAndGenerate.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating
                your strategy...
              </>
            ) : step === 3 ? (
              <>
                Generate My Strategy <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
