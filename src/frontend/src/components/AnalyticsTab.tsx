import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart2, Loader2, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ContentStatus } from "../backend";
import {
  useAddEngagementEntry,
  useContentPlan,
  useEngagementEntries,
  useLeads,
} from "../hooks/useQueries";

export default function AnalyticsTab() {
  const { data: plan } = useContentPlan();
  const { data: leads } = useLeads();
  const { data: entries, isLoading } = useEngagementEntries();
  const addEntry = useAddEngagementEntry();

  const [title, setTitle] = useState("");
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [shares, setShares] = useState("");

  const contentPosted =
    plan?.filter((i) => i.status === ContentStatus.posted).length ?? 0;
  const totalLeads = leads?.length ?? 0;
  const totalEngagement =
    entries?.reduce((sum, e) => sum + e.likes + e.comments + e.shares, 0) ?? 0;

  const handleSubmit = () => {
    if (!title.trim()) return;
    addEntry.mutate(
      {
        contentTitle: title.trim(),
        likes: Number(likes) || 0,
        comments: Number(comments) || 0,
        shares: Number(shares) || 0,
      },
      {
        onSuccess: () => {
          setTitle("");
          setLikes("");
          setComments("");
          setShares("");
        },
      },
    );
  };

  const sortedEntries = [...(entries ?? [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <div className="pb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="w-5 h-5 text-brand-blue" />
        <h1 className="text-2xl font-bold gradient-text">Analytics</h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[
          {
            label: "Posted",
            value: contentPosted,
            emoji: "📤",
            color: "text-brand-green",
          },
          {
            label: "Leads",
            value: totalLeads,
            emoji: "🎯",
            color: "text-brand-blue",
          },
          {
            label: "Engagement",
            value: totalEngagement,
            emoji: "📊",
            color: "text-brand-cyan",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card rounded-xl p-3 card-glow text-center"
          >
            <p className="text-base mb-1">{stat.emoji}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Log Engagement */}
      <section className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-brand-green" />
          <h2 className="text-sm font-semibold">Log Engagement</h2>
        </div>
        <div
          className="bg-card rounded-xl p-4 card-glow space-y-3"
          data-ocid="analytics.panel"
        >
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Content Title
            </Label>
            <Input
              data-ocid="analytics.input"
              placeholder="e.g. 5 AI tips that will blow your mind"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-surface border-border text-sm h-9"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">👍 Likes</Label>
              <Input
                data-ocid="analytics.input"
                type="number"
                placeholder="0"
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                className="bg-surface border-border text-sm h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                💬 Comments
              </Label>
              <Input
                type="number"
                placeholder="0"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="bg-surface border-border text-sm h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">🔄 Shares</Label>
              <Input
                type="number"
                placeholder="0"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                className="bg-surface border-border text-sm h-9"
              />
            </div>
          </div>
          <Button
            type="button"
            data-ocid="analytics.submit_button"
            onClick={handleSubmit}
            disabled={!title.trim() || addEntry.isPending}
            size="sm"
            className="w-full gradient-bg text-white font-semibold h-9"
          >
            {addEntry.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              "Log Engagement 📊"
            )}
          </Button>
        </div>
      </section>

      {/* Engagement Log */}
      <section>
        <h2 className="text-sm font-semibold mb-3">Engagement Log</h2>
        {isLoading ? (
          <div className="space-y-2" data-ocid="analytics.loading_state">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-3 h-16 animate-pulse"
              />
            ))}
          </div>
        ) : sortedEntries.length === 0 ? (
          <div
            className="bg-card rounded-xl p-6 text-center"
            data-ocid="analytics.empty_state"
          >
            <p className="text-xs text-muted-foreground">
              No entries yet. Log your first post above! 📈
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedEntries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-ocid={`analytics.item.${i + 1}`}
                className="bg-card rounded-xl p-3.5 card-glow"
              >
                <p className="text-xs font-semibold mb-2 line-clamp-1">
                  {entry.contentTitle}
                </p>
                <div className="flex gap-3">
                  <span className="text-[11px] text-muted-foreground">
                    👍 {entry.likes}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    💬 {entry.comments}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    🔄 {entry.shares}
                  </span>
                  <span className="text-[11px] text-brand-cyan ml-auto font-medium">
                    +{entry.likes + entry.comments + entry.shares} total
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
