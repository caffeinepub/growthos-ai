import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Copy, Loader2, MessageSquare, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddCommentRule,
  useCommentRules,
  useDeleteCommentRule,
} from "../hooks/useQueries";

const DM_TEMPLATES = {
  lead: `Hey [Name]! Thanks for reaching out 😊 I'd love to help you with [topic]. Let's connect - drop me a DM with your details and I'll share everything you need to know! 🚀`,
  price: `Hey! Great question about pricing 💰 I have different options based on your goals. Let me understand your situation better first - what are you looking to achieve? Drop me a DM and let's chat! 🎯`,
};

function suggestReply(keyword: string): string {
  return `Hey! Thanks for your comment about ${keyword} 🙌 DM me for more info!`;
}

export default function AutomationTab() {
  const { data: rules, isLoading } = useCommentRules();
  const addRule = useAddCommentRule();
  const deleteRule = useDeleteCommentRule();

  const [keyword, setKeyword] = useState("");
  const [autoReply, setAutoReply] = useState("");
  const [dmType, setDmType] = useState<"lead" | "price" | null>(null);

  const handleKeywordChange = (val: string) => {
    setKeyword(val);
    if (val.trim()) {
      setAutoReply(suggestReply(val.trim()));
    } else {
      setAutoReply("");
    }
  };

  const handleSaveRule = () => {
    if (!keyword.trim() || !autoReply.trim()) return;
    addRule.mutate(
      { keyword: keyword.trim(), autoReply: autoReply.trim() },
      {
        onSuccess: () => {
          setKeyword("");
          setAutoReply("");
        },
      },
    );
  };

  const handleCopyDm = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("DM template copied! 📋");
  };

  return (
    <div className="pb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Bot className="w-5 h-5 text-brand-blue" />
        <h1 className="text-2xl font-bold gradient-text">Automation</h1>
      </div>

      {/* Comment Automation */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-brand-cyan" />
          <h2 className="text-sm font-semibold">Comment Automation</h2>
          <Badge className="bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30 text-[10px]">
            Simulation
          </Badge>
        </div>

        {/* Add Rule Form */}
        <div
          className="bg-card rounded-xl p-4 card-glow mb-3 space-y-3"
          data-ocid="automation.panel"
        >
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Trigger Keyword
            </Label>
            <Input
              data-ocid="automation.input"
              placeholder='e.g. "AI", "price", "info"'
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              className="bg-surface border-border text-sm h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Auto Reply</Label>
            <Textarea
              data-ocid="automation.textarea"
              placeholder="Auto-reply message..."
              value={autoReply}
              onChange={(e) => setAutoReply(e.target.value)}
              className="bg-surface border-border text-sm resize-none"
              rows={3}
            />
            {keyword.trim() && (
              <p className="text-[10px] text-brand-cyan">
                ✨ Auto-suggested based on your keyword
              </p>
            )}
          </div>
          <Button
            type="button"
            data-ocid="automation.submit_button"
            onClick={handleSaveRule}
            disabled={!keyword.trim() || !autoReply.trim() || addRule.isPending}
            size="sm"
            className="w-full gradient-bg text-white font-semibold h-9 gap-2"
          >
            {addRule.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            Save Rule
          </Button>
        </div>

        {/* Rules List */}
        {isLoading ? (
          <div className="space-y-2" data-ocid="automation.loading_state">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-3 h-14 animate-pulse"
              />
            ))}
          </div>
        ) : !rules || rules.length === 0 ? (
          <div
            className="bg-card rounded-xl p-5 text-center"
            data-ocid="automation.empty_state"
          >
            <p className="text-xs text-muted-foreground">
              No rules yet. Add a keyword above to automate replies.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {rules.map((rule, i) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-ocid={`automation.item.${i + 1}`}
                className="bg-card rounded-xl p-3 card-glow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-brand-blue/15 text-brand-blue border-brand-blue/30 text-[10px] font-mono">
                        #{rule.keyword}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {rule.autoReply}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid={`automation.delete_button.${i + 1}`}
                    onClick={() => deleteRule.mutate(rule.id)}
                    className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* DM Reply Generator */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-brand-green" />
          <h2 className="text-sm font-semibold">DM Reply Generator</h2>
        </div>

        <div
          className="bg-card rounded-xl p-4 card-glow"
          data-ocid="automation.card"
        >
          <p className="text-xs text-muted-foreground mb-3">
            Tap a button to get a ready-to-send DM template.
          </p>
          <div className="flex gap-2 mb-3">
            <Button
              type="button"
              data-ocid="automation.primary_button"
              size="sm"
              onClick={() => setDmType(dmType === "lead" ? null : "lead")}
              variant={dmType === "lead" ? "default" : "outline"}
              className={`flex-1 h-9 text-xs font-semibold ${
                dmType === "lead"
                  ? "gradient-bg text-white border-0"
                  : "border-border bg-surface"
              }`}
            >
              🙋 Lead Inquiry
            </Button>
            <Button
              type="button"
              data-ocid="automation.secondary_button"
              size="sm"
              onClick={() => setDmType(dmType === "price" ? null : "price")}
              variant={dmType === "price" ? "default" : "outline"}
              className={`flex-1 h-9 text-xs font-semibold ${
                dmType === "price"
                  ? "gradient-bg text-white border-0"
                  : "border-border bg-surface"
              }`}
            >
              💰 Price Question
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {dmType && (
              <motion.div
                key={dmType}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="rounded-lg p-3 relative"
                style={{
                  background: "oklch(0.195 0.012 250)",
                  border: "1px solid oklch(0.27 0.013 250)",
                }}
              >
                <p className="text-xs text-foreground leading-relaxed pr-8">
                  {DM_TEMPLATES[dmType]}
                </p>
                <button
                  type="button"
                  data-ocid="automation.secondary_button"
                  onClick={() => handleCopyDm(DM_TEMPLATES[dmType])}
                  className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-brand-cyan transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
