import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarClock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type ContentPlanItem,
  ContentStatus,
  ContentType,
  type Script,
  type UserProfile,
} from "../backend";
import {
  useContentPlan,
  useGenerateHooks,
  useGenerateScript,
  useHooks,
  useScripts,
  useUpdateContentStatus,
} from "../hooks/useQueries";
import type { ConnectedAccounts, ScheduledPost } from "../types/growth";
import { trendFormats } from "../utils/trendingHooks";
import {
  computeViralityScore,
  getScoreBg,
  getScoreColor,
} from "../utils/viralityScore";
import GraphicGeneratorDialog from "./GraphicGeneratorDialog";
import PostToSocialModal from "./PostToSocialModal";
import SchedulePostModal from "./SchedulePostModal";
import VideoGeneratorTab from "./VideoGeneratorTab";

interface Props {
  profile: UserProfile;
  initialSubTab?: string;
  connectedAccounts: ConnectedAccounts;
  scheduledPosts: ScheduledPost[];
  onAddScheduledPost: (post: ScheduledPost) => void;
  onDeleteScheduledPost: (id: string) => void;
  onMarkScheduledPosted: (id: string) => void;
  onEditScheduledPost: (post: ScheduledPost) => void;
}

const typeColors: Record<ContentType, string> = {
  [ContentType.educational]: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  [ContentType.story]: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  [ContentType.sales]:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};
const typeLabels: Record<ContentType, string> = {
  [ContentType.educational]: "Edu",
  [ContentType.story]: "Story",
  [ContentType.sales]: "Sales",
};

const SKELETONS = ["a", "b", "c", "d", "e", "f"];

function formatScheduledDateTime(date: string, time: string): string {
  const parts = date.split("-").map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  const timeParts = time.split(":").map(Number);
  const hours = timeParts[0];
  const minutes = timeParts[1];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${months[month - 1]} ${day}, ${year} · ${h}:${String(minutes).padStart(2, "0")} ${ampm}`;
}

// ─── Plan Sub-Tab ─────────────────────────────────────────────────

function PlanSubTab() {
  const { data: plan, isLoading } = useContentPlan();
  const updateStatus = useUpdateContentStatus();
  const [selectedItem, setSelectedItem] = useState<ContentPlanItem | null>(
    null,
  );

  const toggle = (id: number, current: ContentStatus) => {
    const next =
      current === ContentStatus.planned
        ? ContentStatus.posted
        : ContentStatus.planned;
    updateStatus.mutate(
      { id, status: next },
      {
        onSuccess: () => {
          toast.success(
            next === ContentStatus.posted
              ? "Marked as Posted ✅"
              : "Status Updated ✅",
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {SKELETONS.map((k) => (
          <Skeleton key={k} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!plan || plan.length === 0) {
    return (
      <div className="text-center py-12" data-ocid="content.plan.empty_state">
        <div className="text-4xl mb-3">📅</div>
        <p className="text-sm font-semibold mb-1">No content plan yet</p>
        <p className="text-xs text-muted-foreground">
          Complete onboarding to generate your 30-day plan
        </p>
      </div>
    );
  }

  const sorted = [...plan].sort((a, b) => a.day - b.day);

  return (
    <>
      <div className="space-y-2" data-ocid="content.plan.list">
        <p className="text-xs text-muted-foreground mb-3">
          {plan.filter((p) => p.status === ContentStatus.posted).length}/
          {plan.length} posts completed
        </p>
        {sorted.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.5) }}
            data-ocid={`content.plan.item.${i + 1}`}
            onClick={() => setSelectedItem(item)}
            className="bg-card rounded-xl p-3 card-glow flex items-center gap-3 cursor-pointer hover:bg-surface transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-muted-foreground">
                {item.day}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs font-semibold leading-tight line-clamp-1 ${
                  item.status === ContentStatus.posted
                    ? "text-muted-foreground line-through"
                    : ""
                }`}
              >
                {item.title}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge
                  className={`text-[9px] px-1.5 py-0 border ${typeColors[item.contentType]}`}
                >
                  {typeLabels[item.contentType]}
                </Badge>
                {item.status === ContentStatus.posted && (
                  <span className="text-[9px] text-brand-green font-semibold">
                    ✓ Posted
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(item.id, item.status);
              }}
              data-ocid={`content.plan.toggle.${i + 1}`}
              className={`flex-shrink-0 w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                item.status === ContentStatus.posted
                  ? "border-brand-green bg-brand-green/20"
                  : "border-border hover:border-brand-green/50"
              }`}
            >
              {item.status === ContentStatus.posted && (
                <div className="w-3 h-3 rounded-full bg-brand-green" />
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {selectedItem && (
        <Dialog
          open={true}
          onOpenChange={(open) => !open && setSelectedItem(null)}
        >
          <DialogContent
            className="bg-card border-border mx-4 rounded-2xl"
            data-ocid="content.plan.dialog"
          >
            <DialogHeader>
              <DialogTitle className="text-base flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground font-normal text-sm">
                  Day {selectedItem.day}
                </span>
                <span className="text-foreground">{selectedItem.title}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={`text-[9px] border px-2 py-0.5 ${
                    typeColors[selectedItem.contentType]
                  }`}
                >
                  {typeLabels[selectedItem.contentType]}
                </Badge>
                {selectedItem.status === ContentStatus.posted && (
                  <Badge className="text-[9px] border bg-brand-green/15 text-brand-green border-brand-green/20 px-2 py-0.5">
                    ✓ Posted
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedItem.description}
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${selectedItem.title}\n\n${selectedItem.description}`,
                  );
                  toast.success("Copied ✅");
                }}
                className="flex-1 h-9 text-xs gap-1.5 border-border"
                data-ocid="content.plan.secondary_button"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  toggle(selectedItem.id, selectedItem.status);
                  setSelectedItem(null);
                }}
                className="flex-1 h-9 text-xs font-bold"
                style={{
                  background: "oklch(var(--brand-green))",
                  color: "oklch(0.12 0.008 250)",
                }}
                data-ocid="content.plan.primary_button"
              >
                {selectedItem.status === ContentStatus.planned
                  ? "✅ Mark as Posted"
                  : "↩ Mark as Planned"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// ─── Hooks Sub-Tab ────────────────────────────────────────────────

function HooksSubTab({ profile }: { profile: UserProfile }) {
  const { data: hooks, isLoading } = useHooks();
  const generateHooks = useGenerateHooks();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied ✅");
  };

  return (
    <div>
      <Button
        type="button"
        data-ocid="content.hooks.primary_button"
        onClick={() => generateHooks.mutate(profile.niche)}
        disabled={generateHooks.isPending}
        className="w-full h-11 rounded-full mb-4 font-bold text-sm green-glow"
        style={{
          background: "oklch(var(--brand-green))",
          color: "oklch(0.12 0.008 250)",
        }}
      >
        {generateHooks.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" /> Generate 10 New Hooks
          </>
        )}
      </Button>

      {isLoading ? (
        <div className="space-y-2">
          {SKELETONS.slice(0, 4).map((k) => (
            <Skeleton key={k} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !hooks || hooks.length === 0 ? (
        <div
          className="text-center py-12"
          data-ocid="content.hooks.empty_state"
        >
          <div className="text-4xl mb-3">⚡</div>
          <p className="text-sm font-semibold mb-1">No hooks yet</p>
          <p className="text-xs text-muted-foreground">
            Generate Hinglish viral hooks for your niche
          </p>
        </div>
      ) : (
        <div className="space-y-2" data-ocid="content.hooks.list">
          {[...hooks].reverse().map((hook, i) => (
            <motion.div
              key={hook.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
              data-ocid={`content.hooks.item.${i + 1}`}
              className="bg-card rounded-xl p-4 card-glow flex items-start gap-3"
            >
              <span className="text-lg flex-shrink-0">🔥</span>
              <p className="text-sm flex-1 leading-relaxed">{hook.text}</p>
              <button
                type="button"
                onClick={() => handleCopy(hook.text)}
                data-ocid={`content.hooks.secondary_button.${i + 1}`}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Copy className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Scripts Sub-Tab ──────────────────────────────────────────────

interface ScriptsSubTabProps {
  profile: UserProfile;
  connectedAccounts: ConnectedAccounts;
  onSwitchToVideo: (scriptId?: number) => void;
  onSchedulePost: (post: ScheduledPost) => void;
}

function ScriptsSubTab({
  profile,
  connectedAccounts,
  onSwitchToVideo,
  onSchedulePost,
}: ScriptsSubTabProps) {
  const { data: scripts, isLoading } = useScripts();
  const generateScript = useGenerateScript();
  const [showDialog, setShowDialog] = useState(false);
  const [topic, setTopic] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [graphicScript, setGraphicScript] = useState<Script | null>(null);
  const [postScript, setPostScript] = useState<Script | null>(null);
  const [scheduleData, setScheduleData] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    generateScript.mutate(
      { topic: topic.trim(), niche: profile.niche },
      {
        onSuccess: () => {
          setShowDialog(false);
          setTopic("");
          toast.success("Content Generated ✅");
        },
      },
    );
  };

  return (
    <div>
      <Button
        type="button"
        data-ocid="content.scripts.primary_button"
        onClick={() => setShowDialog(true)}
        className="w-full h-11 rounded-full mb-4 font-bold text-sm green-glow"
        style={{
          background: "oklch(var(--brand-green))",
          color: "oklch(0.12 0.008 250)",
        }}
      >
        <Plus className="w-4 h-4 mr-2" /> Generate Script
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className="bg-card border-border mx-4 rounded-2xl"
          data-ocid="content.scripts.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-base">Generate a Script</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              data-ocid="content.scripts.input"
              placeholder="e.g. How to lose belly fat in 30 days"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-surface border-border"
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <Button
              type="button"
              data-ocid="content.scripts.submit_button"
              onClick={handleGenerate}
              disabled={!topic.trim() || generateScript.isPending}
              className="w-full rounded-full font-bold"
              style={{
                background: "oklch(var(--brand-green))",
                color: "oklch(0.12 0.008 250)",
              }}
            >
              {generateScript.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Generating...
                </>
              ) : (
                "Generate Script ✍️"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="space-y-2">
          {SKELETONS.slice(0, 3).map((k) => (
            <Skeleton key={k} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !scripts || scripts.length === 0 ? (
        <div
          className="text-center py-12"
          data-ocid="content.scripts.empty_state"
        >
          <div className="text-4xl mb-3">✍️</div>
          <p className="text-sm font-semibold mb-1">No scripts yet</p>
          <p className="text-xs text-muted-foreground">
            Generate your first reel/video script
          </p>
        </div>
      ) : (
        <div className="space-y-2" data-ocid="content.scripts.list">
          {[...scripts].reverse().map((script, i) => {
            const isExpanded = expandedId === script.id;
            const score = computeViralityScore(script.id);
            return (
              <motion.div
                key={script.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                data-ocid={`content.scripts.item.${i + 1}`}
                className="bg-card rounded-xl card-glow overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : script.id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <p className="text-sm font-semibold line-clamp-1">
                        {script.title}
                      </p>
                      <Badge
                        className={`text-[9px] px-1.5 py-0 border flex-shrink-0 ${getScoreBg(score)}`}
                      >
                        <span className={getScoreColor(score)}>⚡ {score}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {script.hook}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                        {/* Virality score */}
                        <div className="flex items-center justify-between py-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Virality Score
                          </p>
                          <div
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${getScoreBg(score)} ${getScoreColor(score)}`}
                          >
                            ⚡ {score}/100
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-brand-blue uppercase tracking-wider mb-1">
                            🎣 Hook
                          </p>
                          <p className="text-xs text-foreground leading-relaxed">
                            {script.hook}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">
                            📌 Main Content
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                            {script.mainContent}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-brand-green uppercase tracking-wider mb-1">
                            🎯 CTA
                          </p>
                          <p className="text-xs text-foreground leading-relaxed">
                            {script.cta}
                          </p>
                        </div>

                        {/* Copy full script */}
                        <button
                          type="button"
                          onClick={() => {
                            const full = `HOOK:\n${script.hook}\n\nMAIN CONTENT:\n${script.mainContent}\n\nCTA:\n${script.cta}`;
                            navigator.clipboard.writeText(full);
                            toast.success("Copied ✅");
                          }}
                          data-ocid={`content.scripts.secondary_button.${i + 1}`}
                          className="flex items-center gap-2 text-xs text-brand-blue hover:text-brand-cyan transition-colors"
                        >
                          <Copy className="w-3 h-3" /> Copy full script
                        </button>

                        {/* Action row */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setGraphicScript(script)}
                            data-ocid={`content.scripts.graphic.button.${i + 1}`}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20 hover:bg-purple-500/25 transition-colors font-medium"
                          >
                            🎨 Create Graphic
                          </button>
                          <button
                            type="button"
                            onClick={() => onSwitchToVideo(script.id)}
                            data-ocid={`content.scripts.video.button.${i + 1}`}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors font-medium"
                            style={{
                              background: "oklch(0.585 0.195 260 / 0.15)",
                              color: "oklch(0.585 0.195 260)",
                              borderColor: "oklch(0.585 0.195 260 / 0.3)",
                            }}
                          >
                            🎬 Create Video
                          </button>
                          <button
                            type="button"
                            onClick={() => setPostScript(script)}
                            data-ocid={`content.scripts.post.button.${i + 1}`}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors font-medium"
                            style={{
                              background: "oklch(0.895 0.245 133 / 0.12)",
                              color: "oklch(0.895 0.245 133)",
                              borderColor: "oklch(0.895 0.245 133 / 0.3)",
                            }}
                          >
                            📤 Post to Social
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setScheduleData({
                                title: script.title,
                                content: `${script.hook}\n\n${script.mainContent}\n\n${script.cta}`,
                              })
                            }
                            data-ocid={`content.scripts.schedule.button.${i + 1}`}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors font-medium"
                            style={{
                              background: "oklch(0.72 0.185 215 / 0.12)",
                              color: "oklch(0.72 0.185 215)",
                              borderColor: "oklch(0.72 0.185 215 / 0.3)",
                            }}
                          >
                            📅 Schedule Post
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Graphic Generator Dialog */}
      {graphicScript && (
        <GraphicGeneratorDialog
          open={!!graphicScript}
          onClose={() => setGraphicScript(null)}
          title={graphicScript.title}
          hook={graphicScript.hook}
        />
      )}

      {/* Post to Social Modal */}
      {postScript && (
        <PostToSocialModal
          open={!!postScript}
          onClose={() => setPostScript(null)}
          title={postScript.title}
          content={`${postScript.hook}\n\n${postScript.mainContent}\n\n${postScript.cta}`}
          connectedAccounts={connectedAccounts}
        />
      )}

      {/* Schedule Post Modal */}
      <SchedulePostModal
        open={!!scheduleData}
        onClose={() => setScheduleData(null)}
        title={scheduleData?.title ?? ""}
        content={scheduleData?.content ?? ""}
        onSchedule={(post) => {
          onSchedulePost(post);
          setScheduleData(null);
        }}
      />
    </div>
  );
}

// ─── Trend Hooks Sub-Tab ──────────────────────────────────────────

function TrendHooksSubTab({ profile }: { profile: UserProfile }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied ✅");
  };

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        Trending formats personalised for{" "}
        <span className="text-foreground font-semibold">{profile.niche}</span>{" "}
        creators
      </p>
      <div className="space-y-3" data-ocid="content.trends.list">
        {trendFormats.map((format, fi) => {
          const isExpanded = expandedId === format.id;
          const hooks = format.generateHooks(profile.niche);
          return (
            <motion.div
              key={format.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: fi * 0.05 }}
              data-ocid={`content.trends.item.${fi + 1}`}
              className="bg-card rounded-xl card-glow overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : format.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
                data-ocid={`content.trends.toggle.${fi + 1}`}
              >
                <span className="text-2xl flex-shrink-0">{format.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{format.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {format.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-muted-foreground">
                    5 hooks
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-2 border-t border-border pt-3">
                      {hooks.map((hook, hi) => (
                        <div
                          key={hook}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface"
                        >
                          <span className="text-[10px] text-muted-foreground flex-shrink-0 mt-1 w-4 text-center font-bold">
                            {hi + 1}
                          </span>
                          <p className="text-xs flex-1 leading-relaxed">
                            {hook}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleCopy(hook)}
                            data-ocid={`content.trends.secondary_button.${fi + 1}`}
                            className="flex-shrink-0 p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Scheduled Posts Sub-Tab ──────────────────────────────────────

interface ScheduledPostsSubTabProps {
  posts: ScheduledPost[];
  onDelete: (id: string) => void;
  onMarkPosted: (id: string) => void;
  onEdit: (post: ScheduledPost) => void;
}

function ScheduledPostsSubTab({
  posts,
  onDelete,
  onMarkPosted,
  onEdit,
}: ScheduledPostsSubTabProps) {
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);

  const scheduledCount = posts.filter((p) => p.status === "Scheduled").length;
  const postedCount = posts.filter((p) => p.status === "Posted").length;

  if (posts.length === 0) {
    return (
      <div className="text-center py-14" data-ocid="scheduled.empty_state">
        <CalendarClock className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm font-semibold mb-1">No scheduled posts yet</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Go to Scripts tab, expand a script card and tap{" "}
          <span className="text-brand-cyan font-medium">📅 Schedule Post</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex gap-2">
        <div
          className="flex-1 rounded-xl p-3 border text-center"
          style={{
            background: "oklch(0.585 0.195 260 / 0.08)",
            borderColor: "oklch(0.585 0.195 260 / 0.25)",
          }}
        >
          <p
            className="text-lg font-black"
            style={{ color: "oklch(0.72 0.185 215)" }}
          >
            {scheduledCount}
          </p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Scheduled
          </p>
        </div>
        <div
          className="flex-1 rounded-xl p-3 border text-center"
          style={{
            background: "oklch(0.895 0.245 133 / 0.08)",
            borderColor: "oklch(0.895 0.245 133 / 0.25)",
          }}
        >
          <p
            className="text-lg font-black"
            style={{ color: "oklch(0.895 0.245 133)" }}
          >
            {postedCount}
          </p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Posted
          </p>
        </div>
      </div>

      {/* Post list */}
      <div className="space-y-2" data-ocid="scheduled.list">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            data-ocid={`scheduled.item.${i + 1}`}
            className="bg-card rounded-xl p-3.5 border border-border card-glow"
          >
            <div className="flex items-start gap-2.5 mb-2.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground line-clamp-1">
                  {post.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatScheduledDateTime(
                    post.scheduledDate,
                    post.scheduledTime,
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Platform badge */}
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={
                    post.platform === "Instagram"
                      ? {
                          background: "oklch(0.68 0.18 300 / 0.15)",
                          color: "oklch(0.68 0.18 300)",
                        }
                      : {
                          background: "oklch(0.638 0.22 25 / 0.15)",
                          color: "oklch(0.638 0.22 25)",
                        }
                  }
                >
                  {post.platform === "Instagram" ? "📸" : "▶️"} {post.platform}
                </span>
                {/* Status badge */}
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={
                    post.status === "Scheduled"
                      ? {
                          background: "oklch(0.585 0.195 260 / 0.15)",
                          color: "oklch(0.72 0.185 215)",
                        }
                      : {
                          background: "oklch(0.895 0.245 133 / 0.15)",
                          color: "oklch(0.895 0.245 133)",
                        }
                  }
                >
                  {post.status === "Scheduled" ? "🕐 Scheduled" : "✓ Posted"}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              {post.status === "Scheduled" && (
                <button
                  type="button"
                  onClick={() => {
                    onMarkPosted(post.id);
                    toast.success("Marked as Posted ✅");
                  }}
                  data-ocid={`scheduled.confirm_button.${i + 1}`}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full border transition-colors font-semibold"
                  style={{
                    background: "oklch(0.895 0.245 133 / 0.1)",
                    color: "oklch(0.895 0.245 133)",
                    borderColor: "oklch(0.895 0.245 133 / 0.3)",
                  }}
                >
                  <CheckCircle className="w-3 h-3" /> Posted
                </button>
              )}
              <button
                type="button"
                onClick={() => setEditingPost(post)}
                data-ocid={`scheduled.edit_button.${i + 1}`}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full border border-border bg-surface hover:bg-muted transition-colors text-muted-foreground hover:text-foreground font-semibold"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(post.id);
                  toast.success("Deleted ✅");
                }}
                data-ocid={`scheduled.delete_button.${i + 1}`}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full border border-destructive/30 bg-destructive/10 hover:bg-destructive/20 transition-colors text-destructive font-semibold ml-auto"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit modal */}
      {editingPost && (
        <SchedulePostModal
          open={!!editingPost}
          onClose={() => setEditingPost(null)}
          title={editingPost.title}
          content={editingPost.content}
          existing={editingPost}
          onSchedule={(updated) => {
            onEdit(updated);
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Content Tab ──────────────────────────────────────────────────

export default function ContentTab({
  profile,
  initialSubTab = "plan",
  connectedAccounts,
  scheduledPosts,
  onAddScheduledPost,
  onDeleteScheduledPost,
  onMarkScheduledPosted,
  onEditScheduledPost,
}: Props) {
  const [subTab, setSubTab] = useState(initialSubTab);
  const [videoInitialScriptId, setVideoInitialScriptId] = useState<
    number | undefined
  >();
  const { data: scripts } = useScripts();

  const handleSwitchToVideo = (scriptId?: number) => {
    setVideoInitialScriptId(scriptId);
    setSubTab("video");
  };

  const tabs = [
    { id: "plan", label: "Plan", icon: "📅" },
    { id: "hooks", label: "Hooks", icon: "⚡" },
    { id: "scripts", label: "Scripts", icon: "✍️" },
    { id: "trends", label: "Trends", icon: "🔥" },
    { id: "video", label: "Video", icon: "🎬" },
    { id: "scheduled", label: "Sched", icon: "🗓️" },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-bold mb-4">Content</h1>

      {/* Sub-tabs */}
      <div
        className="flex gap-0.5 bg-surface rounded-xl p-1 mb-5 overflow-x-auto no-scrollbar"
        data-ocid="content.tab"
      >
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            data-ocid={`content.${tab.id}.tab`}
            className={`flex-shrink-0 flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[9px] font-semibold transition-all min-w-[46px] ${
              subTab === tab.id
                ? "bg-brand-blue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-sm leading-none mb-0.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {subTab === "plan" && <PlanSubTab />}
          {subTab === "hooks" && <HooksSubTab profile={profile} />}
          {subTab === "scripts" && (
            <ScriptsSubTab
              profile={profile}
              connectedAccounts={connectedAccounts}
              onSwitchToVideo={handleSwitchToVideo}
              onSchedulePost={onAddScheduledPost}
            />
          )}
          {subTab === "trends" && <TrendHooksSubTab profile={profile} />}
          {subTab === "video" && (
            <VideoGeneratorTab
              scripts={scripts}
              initialScriptId={videoInitialScriptId}
            />
          )}
          {subTab === "scheduled" && (
            <ScheduledPostsSubTab
              posts={scheduledPosts}
              onDelete={onDeleteScheduledPost}
              onMarkPosted={onMarkScheduledPosted}
              onEdit={onEditScheduledPost}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
