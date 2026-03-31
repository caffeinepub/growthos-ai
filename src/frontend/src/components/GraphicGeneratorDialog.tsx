import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Loader2, RefreshCw } from "lucide-react";
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

const styleConfig: Record<
  GraphicStyle,
  {
    label: string;
    emoji: string;
    aspect: string;
    desc: string;
    gradient: string;
  }
> = {
  Post: {
    label: "Post",
    emoji: "📸",
    aspect: "aspect-square",
    desc: "1:1 Square",
    gradient:
      "linear-gradient(135deg, oklch(0.585 0.195 260), oklch(0.72 0.185 215 / 0.9))",
  },
  Story: {
    label: "Story",
    emoji: "📱",
    aspect: "aspect-[9/16]",
    desc: "9:16 Vertical",
    gradient:
      "linear-gradient(180deg, oklch(0.585 0.195 260), oklch(0.895 0.245 133 / 0.8), oklch(0.72 0.185 215 / 0.6))",
  },
  Thumbnail: {
    label: "Thumbnail",
    emoji: "🖼️",
    aspect: "aspect-video",
    desc: "16:9 Wide",
    gradient:
      "linear-gradient(90deg, oklch(0.585 0.195 260 / 0.9), oklch(0.72 0.185 215), oklch(0.68 0.18 300 / 0.7))",
  },
};

export default function GraphicGeneratorDialog({
  open,
  onClose,
  title,
  hook,
}: Props) {
  const [selectedStyle, setSelectedStyle] = useState<GraphicStyle>("Post");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setHasGenerated(false);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      toast.success("Graphic Created ✅");
    }, 1800);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setHasGenerated(false);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      toast.success("Graphic Regenerated ✅");
    }, 1800);
  };

  const handleDownload = () => {
    toast.success("Download started ✅");
  };

  const handleClose = () => {
    setHasGenerated(false);
    setSelectedStyle("Post");
    onClose();
  };

  const config = styleConfig[selectedStyle];

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
                      setHasGenerated(false);
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

          {/* Generate Button */}
          {!hasGenerated && (
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating
                  graphic...
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
              className="text-center py-4"
              data-ocid="graphic.loading_state"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                Creating your graphic...
              </div>
            </motion.div>
          )}

          {/* Preview */}
          {hasGenerated && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              data-ocid="graphic.success_state"
            >
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Preview
              </p>
              <div
                className={`relative w-full ${config.aspect} rounded-xl overflow-hidden ${
                  selectedStyle === "Story" ? "max-h-[280px]" : ""
                }`}
                style={{ background: config.gradient }}
              >
                {/* Overlay pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
                  <div
                    className="text-white/20 font-black uppercase tracking-widest text-[9px] mb-2"
                    style={{ letterSpacing: "0.3em" }}
                  >
                    GROWTHOS AI
                  </div>
                  <p className="text-white font-black text-lg leading-tight drop-shadow-lg line-clamp-3">
                    {title || "Your Content Title"}
                  </p>
                  {selectedStyle !== "Thumbnail" && (
                    <p className="text-white/80 text-xs mt-3 leading-snug line-clamp-2">
                      {hook || "Your hook text goes here"}
                    </p>
                  )}
                  <div
                    className="mt-4 px-3 py-1.5 rounded-full text-[10px] font-bold text-white"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    ✨ AI Generated
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownload}
                  className="flex-1 h-10 text-sm gap-1.5 border-border hover:bg-surface"
                  data-ocid="graphic.secondary_button"
                >
                  <Download className="w-4 h-4" /> Download ⬇️
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRegenerate}
                  className="flex-1 h-10 text-sm gap-1.5 border-border hover:bg-surface"
                  data-ocid="graphic.edit_button"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate 🔄
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
