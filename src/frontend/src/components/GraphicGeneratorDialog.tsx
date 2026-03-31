import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  hook: string;
}

type GraphicStyle = "Post" | "Story" | "Thumbnail";

interface GraphicOutput {
  imagePrompt: string;
  caption: string;
  designStyle: string;
}

// ─── Generation helpers ──────────────────────────────────────────

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

function detectCategory(
  text: string,
): "business" | "motivational" | "fitness" | "default" {
  const lower = text.toLowerCase();
  if (
    lower.includes("business") ||
    lower.includes("money") ||
    lower.includes("income") ||
    lower.includes("profit") ||
    lower.includes("growth")
  )
    return "business";
  if (
    lower.includes("motivat") ||
    lower.includes("student") ||
    lower.includes("mindset") ||
    lower.includes("inspir") ||
    lower.includes("success")
  )
    return "motivational";
  if (
    lower.includes("fitness") ||
    lower.includes("weight") ||
    lower.includes("gym") ||
    lower.includes("health")
  )
    return "fitness";
  return "default";
}

const dimensionsByStyle: Record<GraphicStyle, string> = {
  Post: "1:1 square (1080x1080px), Instagram Post",
  Story: "9:16 vertical (1080x1920px), Instagram/YouTube Story",
  Thumbnail: "16:9 widescreen (1280x720px), YouTube Thumbnail",
};

const promptVariants: Record<string, ((dim: string, t: string) => string)[]> = {
  business: [
    (d, t) =>
      `Professional ${d}, dark navy background with electric blue accent lines, bold white headline "${t}", clean geometric shapes on the right, minimal business aesthetic, sharp sans-serif typography, drop shadow on text, high contrast, Instagram/YouTube optimized, suitable for entrepreneurs and coaches.`,
    (d, t) =>
      `Sleek ${d}, deep charcoal background with gold metallic accents, large centered headline "${t}" in modern sans-serif, subtle grid-line overlay, luxury business aesthetic, cinematic spotlight lighting, high-end corporate feel, Instagram/YouTube optimized.`,
    (d, t) =>
      `Bold ${d}, dark midnight blue with cyan gradient borders, impactful white text "${t}" with glowing outline, abstract digital circuit pattern background, tech-startup aesthetic, dynamic diagonal composition, Instagram/YouTube optimized.`,
  ],
  motivational: [
    (d, t) =>
      `Inspiring ${d}, deep gradient from dark purple to midnight blue, large bold quote typography "${t}" centered, golden accent lines, soft bokeh light effects, emotional poster aesthetic, Instagram/YouTube optimized.`,
    (d, t) =>
      `Powerful ${d}, dramatic dark background with sunrise orange-to-gold gradient at the bottom, massive impactful headline "${t}" in heavy condensed font, uplifting energy, subtle lens flare, motivational poster style, Instagram/YouTube optimized.`,
    (d, t) =>
      `Emotional ${d}, dark navy with scattered star-like light particles, centered bold white text "${t}", warm amber glow from below, cinematic vignette, inspiring and aspirational mood, Instagram/YouTube optimized.`,
  ],
  fitness: [
    (d, t) =>
      `Energetic ${d}, vibrant gradient orange-to-red background, bold impactful white headline "${t}", dynamic diagonal composition, abstract motion lines, gym/workout aesthetic, high-energy color contrast, Instagram/YouTube optimized.`,
    (d, t) =>
      `Dynamic ${d}, dark charcoal background with electric green accents, powerful bold typography "${t}" with motion blur effect, muscular silhouette outline, grid pattern overlay, performance sports aesthetic, Instagram/YouTube optimized.`,
    (d, t) =>
      `Intense ${d}, deep red-to-black gradient, sharp white bold headline "${t}", dramatic spotlight lighting, abstract muscle fiber texture, premium fitness brand aesthetic, high-impact visual energy, Instagram/YouTube optimized.`,
  ],
  default: [
    (d, t) =>
      `Eye-catching ${d}, modern blue-to-purple gradient background, clean bold white typography "${t}", geometric accent shapes, trending creator aesthetic, vibrant and engaging, Instagram/YouTube optimized.`,
    (d, t) =>
      `Striking ${d}, dark background with colorful neon accent lines in teal and purple, large centered headline "${t}", modern digital art style, creator economy aesthetic, vibrant contrast, Instagram/YouTube optimized.`,
    (d, t) =>
      `Professional ${d}, gradient from deep navy to rich purple, bold white headline "${t}", minimalist design with single accent color strip, clean and modern social media aesthetic, Instagram/YouTube optimized.`,
  ],
};

const captionVariants: Record<string, string[]> = {
  business: [
    "✨ {title} — Save this for later! 💼\n\nWhich tip surprised you most? Drop a comment 👇\n\n#Business #GrowthMindset #Entrepreneur #IndianCreator",
    "💰 {title} — This is the real blueprint!\n\nDM me 'INFO' to learn more 📩\n\n#BusinessTips #OnlineBusiness #Entrepreneur #IndianBusiness",
    "🚀 {title} — Every founder needs to know this!\n\nSave + share with your team 🤝\n\n#StartupIndia #BusinessGrowth #Entrepreneurship #IndianCreator",
  ],
  motivational: [
    "🔥 {title} — This hit different today!\n\nTag someone who needs this 💪\n\n#Motivation #Mindset #Success #IndianYouTuber",
    "✨ {title} — Read this twice!\n\nDouble tap if this resonated with you ❤️\n\n#Inspiration #MotivationMonday #GrowthMindset #IndianCreator",
    "💡 {title} — Your daily reminder!\n\nSave this for your low-motivation days 📌\n\n#Mindset #PersonalGrowth #Motivation #IndianCreator",
  ],
  fitness: [
    "💪 {title} — Are you doing this?\n\nSave & share with your gym buddy 🏋️\n\n#Fitness #GymLife #HealthyLiving #FitIndia",
    "🏃 {title} — Game changer workout tip!\n\nTry this today and thank me later 🔥\n\n#FitnessMotivation #WorkoutTips #HealthyHabits #IndianFitness",
    "⚡ {title} — Your body will love this!\n\nSave for tomorrow's workout 💪\n\n#FitLife #GymTips #BodyTransformation #FitIndia",
  ],
  default: [
    "📌 {title} — Must read for every creator!\n\nDrop a ❤️ if this helped you!\n\n#Content #Creator #GrowthTips #IndianCreator",
    "🌟 {title} — Sharing this with everyone!\n\nSave this post for later 🔖\n\n#ContentCreator #CreatorEconomy #GrowthHacking #IndianCreator",
    "💫 {title} — This changes everything!\n\nTag a friend who needs to see this 👇\n\n#CreatorTips #SocialMedia #ContentStrategy #IndianCreator",
  ],
};

const designStyles = [
  "Bold | Dark Navy + Electric Blue",
  "Minimal | Clean White + Black",
  "Modern | Purple-to-Blue Gradient",
];

function generateGraphicOutput(
  title: string,
  hook: string,
  style: GraphicStyle,
): GraphicOutput {
  const combined = `${title} ${hook}`;
  const hash = simpleHash(combined);
  const category = detectCategory(combined);
  const dim = dimensionsByStyle[style];

  const prompts = promptVariants[category];
  const captions = captionVariants[category];

  const imagePrompt = prompts[hash % 3](dim, title);
  const caption = captions[(hash + 1) % 3].replace(/{title}/g, title);
  const designStyle = designStyles[(hash + 2) % 3];

  return { imagePrompt, caption, designStyle };
}

// ─── Style selector config ───────────────────────────────────────

const styleConfig: Record<
  GraphicStyle,
  { label: string; emoji: string; desc: string }
> = {
  Post: { label: "Post", emoji: "📸", desc: "1:1 Square" },
  Story: { label: "Story", emoji: "📱", desc: "9:16 Vertical" },
  Thumbnail: { label: "Thumbnail", emoji: "🖼️", desc: "16:9 Wide" },
};

// ─── Component ───────────────────────────────────────────────────

export default function GraphicGeneratorDialog({
  open,
  onClose,
  title,
  hook,
}: Props) {
  const [selectedStyle, setSelectedStyle] = useState<GraphicStyle>("Post");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<GraphicOutput | null>(null);

  const runGenerate = (style: GraphicStyle) => {
    setIsGenerating(true);
    setOutput(null);
    setTimeout(() => {
      const result = generateGraphicOutput(title, hook, style);
      setOutput(result);
      setIsGenerating(false);
      toast.success("Graphic Prompt Ready ✅");
    }, 1600);
  };

  const handleGenerate = () => runGenerate(selectedStyle);

  const handleRegenerate = () => {
    runGenerate(selectedStyle);
  };

  const handleClose = () => {
    setOutput(null);
    setSelectedStyle("Post");
    setIsGenerating(false);
    onClose();
  };

  const copyPrompt = () => {
    if (!output) return;
    navigator.clipboard.writeText(output.imagePrompt);
    toast.success("Prompt copied 📋");
  };

  const copyCaption = () => {
    if (!output) return;
    navigator.clipboard.writeText(output.caption);
    toast.success("Caption copied 📋");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="bg-card border-border mx-4 rounded-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="graphic.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            🎨 AI Graphic Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Style Selector */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Select Style
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(styleConfig) as GraphicStyle[]).map((style) => {
                const cfg = styleConfig[style];
                const isActive = selectedStyle === style;
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => {
                      setSelectedStyle(style);
                      setOutput(null);
                    }}
                    data-ocid={`graphic.${style.toLowerCase()}.toggle`}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      isActive
                        ? "border-brand-blue bg-brand-blue/10"
                        : "border-border bg-surface hover:border-brand-blue/40"
                    }`}
                  >
                    <span className="text-xl">{cfg.emoji}</span>
                    <span
                      className={`text-xs font-semibold ${
                        isActive ? "text-brand-blue" : "text-foreground"
                      }`}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {cfg.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button — shown when no output */}
          {!output && (
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full h-11 rounded-full font-bold"
              style={{
                background: "oklch(var(--brand-blue))",
                color: "oklch(0.985 0 0)",
              }}
              data-ocid="graphic.primary_button"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparing
                  graphic prompt...
                </>
              ) : (
                "Create Graphic 🎨"
              )}
            </Button>
          )}

          {/* Loading State */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-3"
              data-ocid="graphic.loading_state"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                Preparing graphic prompt...
              </div>
            </motion.div>
          )}

          {/* Structured Output */}
          {output && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
              data-ocid="graphic.success_state"
            >
              {/* Title */}
              <div className="bg-surface rounded-xl p-3.5 border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  📌 Title
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {title || "Your Content Title"}
                </p>
              </div>

              {/* Image Prompt — most important */}
              <div
                className="rounded-xl p-3.5 border-2"
                style={{
                  background: "oklch(0.585 0.195 260 / 0.08)",
                  borderColor: "oklch(0.585 0.195 260 / 0.35)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "oklch(0.72 0.185 215)" }}
                  >
                    🖼 Image Prompt
                  </p>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: "oklch(0.585 0.195 260)" }}
                  >
                    For DALL·E / Gemini
                  </span>
                </div>
                <p className="text-xs text-foreground leading-relaxed font-medium">
                  {output.imagePrompt}
                </p>
              </div>

              {/* Caption */}
              <div className="bg-surface rounded-xl p-3.5 border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  📝 Caption
                </p>
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                  {output.caption}
                </p>
              </div>

              {/* Design Style */}
              <div className="bg-surface rounded-xl p-3 border border-border flex items-center gap-3">
                <span className="text-lg">🎨</span>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Design Style
                  </p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">
                    {output.designStyle}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyPrompt}
                  className="h-10 text-xs gap-1.5 border-border hover:bg-surface"
                  data-ocid="graphic.primary_button"
                >
                  Copy Prompt 📋
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyCaption}
                  className="h-10 text-xs gap-1.5 border-border hover:bg-surface"
                  data-ocid="graphic.secondary_button"
                >
                  Copy Caption 📋
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleRegenerate}
                className="w-full h-10 text-xs gap-1.5 border-border hover:bg-surface"
                data-ocid="graphic.edit_button"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate 🔄
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
