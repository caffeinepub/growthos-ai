import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Loader2, Youtube } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ConnectedAccounts } from "../types/growth";

interface Props {
  open: boolean;
  onClose: () => void;
  content: string;
  title: string;
  connectedAccounts: ConnectedAccounts;
}

type Platform = "instagram" | "youtube";

export default function PostToSocialModal({
  open,
  onClose,
  content,
  title,
  connectedAccounts,
}: Props) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null,
  );
  const [caption, setCaption] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const hasAnyAccount =
    !!connectedAccounts.instagram || !!connectedAccounts.youtube;

  useEffect(() => {
    if (open) {
      // Pre-fill caption with hook (first line) or truncated content
      const firstLine = content.split("\n")[0];
      setCaption(firstLine.length > 10 ? firstLine : content.slice(0, 200));
      setSelectedPlatform(null);
      setIsPosting(false);
    }
  }, [open, content]);

  const handlePost = () => {
    if (!selectedPlatform) return;
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      const platformLabel =
        selectedPlatform === "instagram" ? "Instagram" : "YouTube";
      toast.success(`Posted to ${platformLabel} ✅`);
      onClose();
    }, 1500);
  };

  const platformInfo = {
    instagram: {
      icon: Instagram,
      label: "Instagram",
      color: "oklch(0.68 0.18 300)",
      borderActive: "border-[oklch(0.68_0.18_300)]",
    },
    youtube: {
      icon: Youtube,
      label: "YouTube",
      color: "oklch(0.638 0.22 25)",
      borderActive: "border-destructive",
    },
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="bg-card border-border mx-4 rounded-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="post.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-base">
            📤 Post to Social Media
          </DialogTitle>
        </DialogHeader>

        {!hasAnyAccount ? (
          // No accounts connected
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6 text-center space-y-4"
            data-ocid="post.empty_state"
          >
            <div className="text-4xl">🔗</div>
            <div>
              <p className="text-sm font-semibold mb-1">
                No accounts connected yet
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect your Instagram or YouTube in Profile to post directly
                from the app.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 text-sm border-border"
              data-ocid="post.close_button"
            >
              Go to Profile to Connect
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Platform Selector */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Select Platform
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["instagram", "youtube"] as Platform[]).map((platform) => {
                  const info = platformInfo[platform];
                  const account = connectedAccounts[platform];
                  const isConnected = !!account;
                  const isSelected = selectedPlatform === platform;
                  const Icon = info.icon;

                  return (
                    <button
                      key={platform}
                      type="button"
                      disabled={!isConnected}
                      onClick={() =>
                        isConnected &&
                        setSelectedPlatform(isSelected ? null : platform)
                      }
                      data-ocid={`post.${platform}.toggle`}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        !isConnected
                          ? "border-border opacity-50 cursor-not-allowed bg-surface"
                          : isSelected
                            ? "border-current bg-surface"
                            : "border-border bg-surface hover:border-border/70"
                      }`}
                      style={
                        isSelected
                          ? { borderColor: info.color, color: info.color }
                          : {}
                      }
                    >
                      <Icon className="w-6 h-6" />
                      <div className="text-center">
                        <p className="text-xs font-semibold">{info.label}</p>
                        {isConnected ? (
                          <p className="text-[10px] text-muted-foreground">
                            @{account?.username}
                          </p>
                        ) : (
                          <p className="text-[9px] text-muted-foreground leading-tight">
                            Not connected
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: info.color }}
                        >
                          Selected ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caption */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Caption
              </p>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                placeholder="Write your caption..."
                className="bg-surface border-border text-sm resize-none"
                data-ocid="post.textarea"
              />
            </div>

            {/* Content Preview */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Content Preview
              </p>
              <div
                className="bg-surface rounded-xl p-3 border border-border"
                data-ocid="post.panel"
              >
                <p className="text-xs font-semibold text-foreground mb-1 line-clamp-1">
                  {title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {content}
                </p>
              </div>
            </div>

            {/* Post Button */}
            <Button
              type="button"
              onClick={handlePost}
              disabled={!selectedPlatform || isPosting}
              className="w-full h-11 rounded-full font-bold"
              style={{
                background: selectedPlatform
                  ? platformInfo[selectedPlatform].color
                  : undefined,
                color: "oklch(0.985 0 0)",
              }}
              data-ocid="post.submit_button"
            >
              {isPosting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Posting...
                </>
              ) : (
                "Post Now 🚀"
              )}
            </Button>

            {isPosting && (
              <div
                className="text-center text-xs text-muted-foreground"
                data-ocid="post.loading_state"
              >
                Sending to{" "}
                {selectedPlatform === "instagram" ? "Instagram" : "YouTube"}...
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
