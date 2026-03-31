import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Script } from "../backend";

type VideoMode = "script" | "prompt";

type Scene = {
  number: number;
  title: string;
  description: string;
  textOverlay: string;
  visual: string;
};

type VideoResult = {
  hook: string;
  scriptText: string;
  scenes: Scene[];
};

interface Props {
  scripts: Script[] | undefined;
  initialScriptId?: number;
}

// ─── Deterministic generation helpers ───────────────────────────

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

const sceneTemplates: Array<{
  title: string;
  descriptions: string[];
  textOverlays: string[];
  visuals: string[];
}> = [
  {
    title: "Opening Hook",
    descriptions: [
      "Fast-cut intro with bold text animation on dark background",
      "Creator face reveal with energetic music and caption overlay",
      "Shocking statistic or question shown on minimal slide",
    ],
    textOverlays: [
      "Wait for it... 👀",
      "This changed everything for me",
      "Nobody talks about this...",
    ],
    visuals: [
      "🎬 Dynamic white text on gradient background, rapid flash cuts",
      "📱 Close-up selfie with ring light, bold lower-third caption",
      "📊 Animated bold number with counter effect on dark slide",
    ],
  },
  {
    title: "Problem Setup",
    descriptions: [
      "Relatable scenario showing the common struggle most viewers face",
      "Quick montage of 3 problems with on-screen text labels",
      "Emotional storytelling moment that builds viewer empathy",
    ],
    textOverlays: [
      "If you're struggling with this...",
      "Here's what most people get wrong ❌",
      "The mistake 90% of people make",
    ],
    visuals: [
      "😤 Frustrated person or relatable situation B-roll clip",
      "⚡ Split-screen: wrong vs right approach side by side",
      "🧩 Simple infographic diagram fading in",
    ],
  },
  {
    title: "Value Delivery",
    descriptions: [
      "Key insight revealed with supporting visuals and step text",
      "Step-by-step breakdown with on-screen text appearing one by one",
      "Expert tip delivered with authority energy and b-roll",
    ],
    textOverlays: [
      "Here's the secret nobody shares ⬇️",
      "Step 1: Do THIS today 👇",
      "This is the game-changer 🚀",
    ],
    visuals: [
      "✅ Checklist items appearing one by one with checkmark animation",
      "📈 Growth chart or success metrics with animated reveal",
      "💡 Light-bulb moment — overlay text with glow effect",
    ],
  },
  {
    title: "Call to Action",
    descriptions: [
      "Strong CTA with social proof and urgency — direct address to camera",
      "Follow + like + save reminder with gesture pointing to button",
      "Next steps shown clearly with arrows and text prompts",
    ],
    textOverlays: [
      "Follow for more tips like this! 🔔",
      "Save this before it's too late ⭐",
      "Comment your biggest takeaway below 👇",
    ],
    visuals: [
      "👉 Animated arrow pointing toward follow/like button overlay",
      "🔔 Notification bell animation with subscribe prompt",
      "💬 Comment section preview — invite audience engagement",
    ],
  },
];

const sceneBorderColors = [
  "oklch(0.585 0.195 260)", // brand-blue
  "oklch(0.895 0.245 133)", // brand-green
  "oklch(0.72 0.185 215)", // brand-cyan
  "oklch(0.68 0.18 300)", // purple
];

const sceneBgColors = [
  "oklch(0.585 0.195 260 / 0.08)",
  "oklch(0.895 0.245 133 / 0.08)",
  "oklch(0.72 0.185 215 / 0.08)",
  "oklch(0.68 0.18 300 / 0.08)",
];

function generateScenes(content: string): Scene[] {
  const hash = simpleHash(content);
  return sceneTemplates.map((template, i) => {
    const idx = (hash + i * 7) % 3;
    return {
      number: i + 1,
      title: template.title,
      description: template.descriptions[idx],
      textOverlay: template.textOverlays[idx],
      visual: template.visuals[idx],
    };
  });
}

const hooksByCategory: Record<string, string[]> = {
  motivational: [
    "Stop waiting for the perfect moment — it doesn't exist 🔥",
    "The one mindset shift that will change your 2024 completely ✨",
    "I was stuck, confused, lost. Then I discovered this simple truth...",
  ],
  business: [
    "₹0 to ₹1 lakh/month — here's my exact roadmap 💸",
    "3 business mistakes that cost me everything (don't repeat them)",
    "The honest truth about making money online in India that nobody shares",
  ],
  fitness: [
    "I tried this for 30 days and my body completely transformed 💪",
    "The morning routine that doubled my energy levels instantly",
    "Why you're not losing weight — and what actually works for real",
  ],
  default: [
    "This one simple thing changed everything for me 👇",
    "Everyone says this is hard — they're completely wrong",
    "The real secret nobody in your niche ever talks about...",
  ],
};

const scriptTemplates = [
  (hook: string, prompt: string) =>
    `${hook}\n\nLet me break this down for you in the simplest way possible.\n\nMost people approach ${prompt.toLowerCase()} completely wrong. They focus on the wrong things, put in effort without direction, and give up before seeing results.\n\nHere's what I discovered after months of trying:\n\n1. Clarity beats effort every single time\n2. Small daily actions compound into massive results\n3. The right system removes willpower from the equation\n\nStart with one clear goal. Break it down into daily micro-actions. Track weekly. Adjust and keep going.\n\nRemember — progress beats perfection. Start today, not tomorrow.`,
  (hook: string, prompt: string) =>
    `${hook}\n\nI've seen hundreds of people struggle with ${prompt.toLowerCase()}. Here's the raw truth.\n\nWhen I first started my journey, I made every mistake in the book. But those mistakes taught me the formula that actually works.\n\nThe formula is simple: Focus + Consistent Action + Right Mindset = Results\n\nMost people have ambition. Some take action. But almost nobody combines all three consistently.\n\nToday I'm giving you the exact tools to stay consistent even when it gets hard.\n\nSave this video — you'll want to come back to it. 🔖`,
];

function detectCategory(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (
    lower.includes("motivat") ||
    lower.includes("student") ||
    lower.includes("mindset") ||
    lower.includes("inspir") ||
    lower.includes("success")
  )
    return "motivational";
  if (
    lower.includes("business") ||
    lower.includes("money") ||
    lower.includes("income") ||
    lower.includes("profit") ||
    lower.includes("revenue") ||
    lower.includes("earn")
  )
    return "business";
  if (
    lower.includes("fitness") ||
    lower.includes("weight") ||
    lower.includes("gym") ||
    lower.includes("health") ||
    lower.includes("diet") ||
    lower.includes("workout")
  )
    return "fitness";
  return "default";
}

function generateFromPrompt(prompt: string): VideoResult {
  const hash = simpleHash(prompt);
  const category = detectCategory(prompt);
  const hooks = hooksByCategory[category];
  const hook = hooks[hash % hooks.length];
  const scriptText = scriptTemplates[hash % scriptTemplates.length](
    hook,
    prompt,
  );
  const scenes = generateScenes(prompt);
  return { hook, scriptText, scenes };
}

function generateFromScript(script: Script): VideoResult {
  const hook = script.hook;
  const scriptText = `${script.hook}\n\n${script.mainContent}\n\n${script.cta}`;
  const scenes = generateScenes(script.hook + script.mainContent);
  return { hook, scriptText, scenes };
}

// ─── Sub-components ──────────────────────────────────────────────

function SceneCard({ scene, index }: { scene: Scene; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-xl p-3.5"
      style={{
        background: sceneBgColors[index],
        border: "1px solid oklch(var(--border))",
        borderLeftWidth: "4px",
        borderLeftColor: sceneBorderColors[index],
      }}
      data-ocid={`video.scene.item.${index + 1}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
          style={{ background: sceneBorderColors[index] }}
        >
          Scene {scene.number}
        </span>
        <span className="text-xs font-semibold text-foreground">
          {scene.title}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
        {scene.description}
      </p>
      <div className="space-y-1.5">
        <div className="flex gap-1.5 items-start">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5 w-16 shrink-0">
            Text
          </span>
          <p className="text-xs text-foreground font-medium leading-snug flex-1">
            &ldquo;{scene.textOverlay}&rdquo;
          </p>
        </div>
        <div className="flex gap-1.5 items-start">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5 w-16 shrink-0">
            Visual
          </span>
          <p className="text-xs text-muted-foreground leading-snug flex-1">
            {scene.visual}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function VideoResultView({
  result,
  onCopyScript,
}: {
  result: VideoResult;
  onCopyScript: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      data-ocid="video.success_state"
    >
      {/* Hook */}
      <div
        className="bg-card rounded-xl p-3.5 border border-border card-glow"
        data-ocid="video.panel"
      >
        <p className="text-[10px] font-semibold text-brand-blue uppercase tracking-wider mb-1.5">
          🎣 Hook
        </p>
        <p className="text-sm font-semibold text-foreground leading-relaxed">
          {result.hook}
        </p>
      </div>

      {/* Script */}
      <div className="bg-card rounded-xl p-3.5 border border-border">
        <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider mb-1.5">
          📝 Script
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
          {result.scriptText}
        </p>
      </div>

      {/* Scene Breakdown */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          🎬 Scene Breakdown
        </p>
        <div className="space-y-2">
          {result.scenes.map((scene, i) => (
            <SceneCard key={scene.number} scene={scene} index={i} />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2" data-ocid="video.card">
        <Button
          type="button"
          variant="outline"
          onClick={onCopyScript}
          className="flex-1 h-10 text-xs gap-1.5 border-border hover:bg-surface"
          data-ocid="video.secondary_button"
        >
          <Copy className="w-3.5 h-3.5" /> Copy Script 📋
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => toast.success("Demo downloaded ✅")}
          className="flex-1 h-10 text-xs gap-1.5 border-border hover:bg-surface"
          data-ocid="video.edit_button"
        >
          <Download className="w-3.5 h-3.5" /> Download Demo ⬇️
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────

export default function VideoGeneratorTab({ scripts, initialScriptId }: Props) {
  const [mode, setMode] = useState<VideoMode>("script");
  const [selectedScriptId, setSelectedScriptId] = useState<string>(
    initialScriptId ? String(initialScriptId) : "",
  );
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<VideoResult | null>(null);

  useEffect(() => {
    if (initialScriptId !== undefined) {
      setSelectedScriptId(String(initialScriptId));
      setMode("script");
      setResult(null);
    }
  }, [initialScriptId]);

  const selectedScript = scripts?.find(
    (s) => String(s.id) === selectedScriptId,
  );

  const handleGenerate = () => {
    if (mode === "script" && !selectedScript) return;
    if (mode === "prompt" && !prompt.trim()) return;

    setIsGenerating(true);
    setResult(null);
    setTimeout(() => {
      const generated =
        mode === "script" && selectedScript
          ? generateFromScript(selectedScript)
          : generateFromPrompt(prompt.trim());
      setResult(generated);
      setIsGenerating(false);
      toast.success("Video Generated ✅");
    }, 2000);
  };

  const handleCopyScript = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.scriptText);
    toast.success("Copied ✅");
  };

  const exampleChips = [
    "Motivational reel for students",
    "Business tips video",
    "Daily routine vlog",
    "Fitness transformation",
  ];

  const canGenerate =
    mode === "script" ? !!selectedScript : prompt.trim().length > 3;

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div
        className="flex gap-1 bg-surface rounded-xl p-1"
        data-ocid="video.tab"
      >
        {(["script", "prompt"] as VideoMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setResult(null);
            }}
            data-ocid={`video.${m}.tab`}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              mode === m
                ? "bg-brand-blue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "script" ? "📄 From Script" : "💬 From Prompt"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="space-y-4"
        >
          {mode === "script" ? (
            /* From Script Mode */
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Select a Script
                </p>
                {!scripts || scripts.length === 0 ? (
                  <div
                    className="text-center py-8 bg-card rounded-xl border border-border"
                    data-ocid="video.empty_state"
                  >
                    <div className="text-3xl mb-2">✍️</div>
                    <p className="text-xs text-muted-foreground">
                      No scripts yet — generate one in the Scripts tab first
                    </p>
                  </div>
                ) : (
                  <Select
                    value={selectedScriptId}
                    onValueChange={(v) => {
                      setSelectedScriptId(v);
                      setResult(null);
                    }}
                  >
                    <SelectTrigger
                      className="bg-surface border-border h-11"
                      data-ocid="video.select"
                    >
                      <SelectValue placeholder="Pick a script to generate video plan..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {[...scripts].reverse().map((s) => (
                        <SelectItem
                          key={s.id}
                          value={String(s.id)}
                          className="text-sm"
                        >
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {selectedScript && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface rounded-xl p-3 border border-border"
                >
                  <p className="text-[10px] font-bold text-brand-blue uppercase tracking-wider mb-1">
                    Hook Preview
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {selectedScript.hook}
                  </p>
                </motion.div>
              )}

              <Button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="w-full h-11 rounded-full font-bold"
                style={{
                  background: "oklch(var(--brand-blue))",
                  color: "oklch(0.985 0 0)",
                }}
                data-ocid="video.primary_button"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating
                    video...
                  </>
                ) : (
                  "Generate Video Plan 🎬"
                )}
              </Button>
            </div>
          ) : (
            /* From Prompt Mode */
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Describe Your Video Idea
                </p>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your video idea... e.g. Motivational reel for students"
                  rows={3}
                  className="bg-surface border-border text-sm resize-none"
                  data-ocid="video.textarea"
                />
              </div>

              {/* Example Chips */}
              <div className="flex flex-wrap gap-1.5">
                {exampleChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setPrompt(chip);
                      setResult(null);
                    }}
                    data-ocid="video.toggle"
                    className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-surface hover:bg-muted hover:border-brand-blue/40 transition-all text-muted-foreground hover:text-foreground"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <Button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="w-full h-11 rounded-full font-bold"
                style={{
                  background: "oklch(var(--brand-blue))",
                  color: "oklch(0.985 0 0)",
                }}
                data-ocid="video.submit_button"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating
                    video...
                  </>
                ) : (
                  "Generate Video 🎬"
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Loading State */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6"
          data-ocid="video.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">
            Creating your video plan...
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Generating scenes &amp; script ✨
          </p>
        </motion.div>
      )}

      {/* Result */}
      {result && !isGenerating && (
        <VideoResultView result={result} onCopyScript={handleCopyScript} />
      )}
    </div>
  );
}
