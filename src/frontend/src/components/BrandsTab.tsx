import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Check, Copy, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Application } from "../types/growth";

interface BrandDeal {
  id: string;
  emoji: string;
  name: string;
  category: string;
  campaign: string;
  budget: string;
  budgetColor: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "brand";
  text: string;
  timestamp: number;
}

interface Props {
  onAddApplication?: (app: Application) => void;
}

const brandDeals: BrandDeal[] = [
  {
    id: "1",
    emoji: "📱",
    name: "boAt",
    category: "Electronics",
    campaign:
      "Promote our new Airdopes 141 with a 30-second Reel featuring your daily routine.",
    budget: "₹8,000",
    budgetColor: "text-brand-green",
  },
  {
    id: "2",
    emoji: "💪",
    name: "MuscleBlaze",
    category: "Fitness",
    campaign:
      "Create a post-workout content series featuring our Whey Protein. Min 2 posts.",
    budget: "₹12,000",
    budgetColor: "text-brand-green",
  },
  {
    id: "3",
    emoji: "👗",
    name: "Myntra",
    category: "Fashion",
    campaign:
      "Style collaboration — 1 outfit Reel + 3 stories showcasing our summer collection.",
    budget: "₹20,000",
    budgetColor: "text-amber-400",
  },
  {
    id: "4",
    emoji: "📚",
    name: "Unacademy",
    category: "EdTech",
    campaign:
      "Promote our UPSC course to your audience — 1 YouTube integration (60 sec).",
    budget: "₹15,000",
    budgetColor: "text-amber-400",
  },
  {
    id: "5",
    emoji: "🧴",
    name: "Mamaearth",
    category: "Beauty",
    campaign:
      "Skincare routine video featuring our Vitamin C face wash. 1 Reel + 2 stories.",
    budget: "₹18,000",
    budgetColor: "text-purple-400",
  },
];

const brandReplies: Record<string, string[]> = {
  "1": [
    "Hey! Thanks for reaching out 🎉 Your profile looks great. Can you share your Instagram handle and recent engagement stats?",
    "Awesome! We're looking for creators with 5k+ followers. What's your current audience size?",
    "Great! We'll send you a product sample first. Please fill in our collab form at boat-lifestyle.com/collab",
  ],
  "2": [
    "Hi! We love your energy 💪 What's your fitness niche — gym, calisthenics, or home workouts?",
    "Perfect fit! We work with creators on a 30-day campaign. Are you okay with 2 posts per week?",
    "Sounds good! Our team will reach out via email within 24 hours with the contract details.",
  ],
  "3": [
    "Hello! Your aesthetic looks amazing 😍 Can you share your last 3 Reel performance stats?",
    "We love your style! We're looking for creators in metros — are you based in Mumbai, Delhi, or Bangalore?",
    "Great profile match! Let's schedule a 15-min intro call this week. When are you available?",
  ],
  "4": [
    "Hi there! Your audience demographic is a great fit for our UPSC course 📚 What's your primary content format?",
    "Excellent! We need creators who can explain complex topics simply. Can you share a sample integration video?",
    "We're excited to work with you! Our campaigns run for 3 months with monthly payouts. Interested?",
  ],
  "5": [
    "Hey! We love authentic skincare creators 🌿 Is your skin type oily, dry, or combination?",
    "Perfect! We send a full product kit before filming. Can you handle delivery to your city within 5 days?",
    "Amazing! Our collab includes a ₹2,000 bonus for every 10k views. Let's get started!",
  ],
};

function generatePitch(deal: BrandDeal): string {
  const preview = deal.campaign.split(" ").slice(0, 4).join(" ");
  return `Hi ${deal.name} Team,\n\nI'm a content creator focused on authentic, engaging content for Indian audiences. I came across your ${preview}... campaign and I'd love to collaborate!\n\nMy audience trusts my recommendations because I only work with brands I genuinely love. I can deliver high-quality content that drives real engagement and conversions for ${deal.name}.\n\nI'm flexible on the format and open to a quick call to discuss. Looking forward to working together!\n\n— [Your Name]`;
}

export default function BrandsTab({ onAddApplication }: Props) {
  const [selectedDeal, setSelectedDeal] = useState<BrandDeal | null>(null);
  const [expandedPitch, setExpandedPitch] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [trackedDeals, setTrackedDeals] = useState<Set<string>>(new Set());
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom whenever messages update or typing indicator shows.
  // messages/isTyping are intentional triggers, not used directly in the body.
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll trigger on message/typing change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const openChat = (deal: BrandDeal) => {
    setSelectedDeal(deal);
    setInputText("");
    setIsTyping(false);
    setMessages((prev) => {
      if (prev[deal.id] && prev[deal.id].length > 0) return prev;
      const greeting =
        brandReplies[deal.id]?.[0] ?? "Hi! Thanks for reaching out 🙌";
      return {
        ...prev,
        [deal.id]: [
          {
            id: `brand-init-${deal.id}`,
            role: "brand",
            text: greeting,
            timestamp: Date.now(),
          },
        ],
      };
    });
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const sendMessage = () => {
    if (!selectedDeal || !inputText.trim()) return;
    const dealId = selectedDeal.id;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: inputText.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => ({
      ...prev,
      [dealId]: [...(prev[dealId] ?? []), userMsg],
    }));
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const replies = brandReplies[dealId] ?? [];
      const existingCount = (messages[dealId]?.length ?? 0) + 1;
      const idx =
        existingCount < replies.length
          ? existingCount
          : (existingCount % (replies.length - 1)) + 1;
      const replyText = replies[idx] ?? replies[replies.length - 1];
      const brandMsg: ChatMessage = {
        id: `brand-${Date.now()}`,
        role: "brand",
        text: replyText,
        timestamp: Date.now(),
      };
      setMessages((prev) => ({
        ...prev,
        [dealId]: [...(prev[dealId] ?? []), brandMsg],
      }));
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyPitch = (deal: BrandDeal) => {
    navigator.clipboard.writeText(generatePitch(deal)).then(() => {
      setCopiedId(deal.id);
      toast.success("Pitch copied ✅");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const trackApplication = (deal: BrandDeal) => {
    if (!onAddApplication) return;
    const app: Application = {
      id: crypto.randomUUID(),
      brandName: deal.name,
      campaignName:
        deal.campaign.length > 60
          ? `${deal.campaign.slice(0, 60)}...`
          : deal.campaign,
      status: "Applied",
      notes: generatePitch(deal),
      dateApplied: new Date().toISOString(),
    };
    onAddApplication(app);
    setTrackedDeals((prev) => new Set([...prev, deal.id]));
    toast.success("Tracked in My Applications ✅");
  };

  const togglePitch = (dealId: string) => {
    setExpandedPitch((prev) => (prev === dealId ? null : dealId));
  };

  // ── Chat View ────────────────────────────────────────────────────────────
  if (selectedDeal) {
    const deal = selectedDeal;
    const dealMessages = messages[deal.id] ?? [];

    return (
      <div
        className="flex flex-col h-[calc(100dvh-6rem)]"
        data-ocid="brands.panel"
      >
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-1 pb-4 border-b border-border">
          <button
            type="button"
            onClick={() => setSelectedDeal(null)}
            className="p-2 rounded-xl hover:bg-muted/40 transition-colors text-muted-foreground"
            data-ocid="brands.close_button"
            aria-label="Back to brand list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">{deal.emoji}</span>
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">
                {deal.name}
              </p>
              <p className="text-[10px] text-muted-foreground">Brand Partner</p>
            </div>
          </div>
          <div className="ml-auto">
            <span className={`text-sm font-bold ${deal.budgetColor}`}>
              {deal.budget}
            </span>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 py-4">
          <div className="flex flex-col gap-3 pr-1">
            <AnimatePresence initial={false}>
              {dealMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                  data-ocid={
                    msg.role === "user"
                      ? "brands.chat.row"
                      : "brands.chat.item.1"
                  }
                >
                  {msg.role === "brand" && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
                      style={{
                        background: "oklch(0.22 0.014 250)",
                        border: "1px solid oklch(0.27 0.013 250)",
                      }}
                    >
                      {deal.emoji}
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-tr-sm text-white"
                        : "rounded-tl-sm text-foreground"
                    }`}
                    style={{
                      background:
                        msg.role === "user"
                          ? "oklch(0.44 0.16 260)"
                          : "oklch(0.22 0.014 250)",
                      border:
                        msg.role === "brand"
                          ? "1px solid oklch(0.27 0.013 250)"
                          : "none",
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2 flex-row"
                  data-ocid="brands.chat.loading_state"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
                    style={{
                      background: "oklch(0.22 0.014 250)",
                      border: "1px solid oklch(0.27 0.013 250)",
                    }}
                  >
                    {deal.emoji}
                  </div>
                  <div
                    className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-tl-sm"
                    style={{
                      background: "oklch(0.22 0.014 250)",
                      border: "1px solid oklch(0.27 0.013 250)",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{
                          duration: 0.8,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatBottomRef} />
          </div>
        </ScrollArea>

        {/* Input Row */}
        <div
          className="pt-3 border-t border-border flex gap-2 items-center"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 12px)" }}
        >
          <Input
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${deal.name}...`}
            className="flex-1 h-11 bg-card border-border text-sm rounded-xl"
            data-ocid="brands.input"
            disabled={isTyping}
          />
          <Button
            type="button"
            size="icon"
            onClick={sendMessage}
            disabled={!inputText.trim() || isTyping}
            className="h-11 w-11 rounded-xl shrink-0"
            style={{
              background: inputText.trim()
                ? "oklch(0.585 0.195 260)"
                : "oklch(0.27 0.013 250)",
            }}
            data-ocid="brands.submit_button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────
  return (
    <div data-ocid="brands.section">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-foreground">
            🤝 Brand Collabs
          </h1>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "oklch(0.585 0.195 260 / 0.15)",
              color: "oklch(0.72 0.185 215)",
              border: "1px solid oklch(0.585 0.195 260 / 0.25)",
            }}
          >
            ✨ New deals weekly
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Matched opportunities for your niche
        </p>
      </div>

      {/* Deal Cards */}
      <div className="flex flex-col gap-3">
        {brandDeals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.06 }}
            data-ocid={`brands.item.${index + 1}`}
          >
            <div
              className="rounded-xl p-4 border border-border"
              style={{ background: "oklch(0.175 0.011 250)" }}
            >
              {/* Top row */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="text-2xl leading-none">{deal.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-foreground leading-tight">
                      {deal.name}
                    </p>
                    <span className="bg-muted/30 text-muted-foreground text-[10px] px-2 py-0.5 rounded-full shrink-0">
                      {deal.category}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-sm font-bold shrink-0 ${deal.budgetColor}`}
                >
                  {deal.budget}
                </span>
              </div>

              {/* Campaign description */}
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                {deal.campaign}
              </p>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePitch(deal.id)}
                  className="flex-1 h-8 text-xs gap-1.5 border-border hover:bg-brand-green/10 hover:text-brand-green hover:border-brand-green/40 transition-colors"
                  data-ocid={`brands.open_modal_button.${index + 1}`}
                >
                  <Sparkles className="w-3 h-3" />
                  {expandedPitch === deal.id ? "Hide Pitch" : "✉️ Apply"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openChat(deal)}
                  className="flex-1 h-8 text-xs gap-1.5 border-border hover:bg-brand-blue/10 hover:text-brand-blue hover:border-brand-blue/40 transition-colors"
                  data-ocid={`brands.secondary_button.${index + 1}`}
                >
                  💬 Chat
                </Button>
              </div>

              {/* Pitch expanded panel */}
              <AnimatePresence>
                {expandedPitch === deal.id && (
                  <motion.div
                    key="pitch"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                    data-ocid={`brands.modal.${index + 1}`}
                  >
                    <div
                      className="mt-3 rounded-xl p-3.5 border border-border"
                      style={{ background: "oklch(0.135 0.009 250)" }}
                    >
                      <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                        AI-Generated Pitch
                      </p>
                      <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {generatePitch(deal)}
                      </p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyPitch(deal)}
                          className="h-7 text-xs gap-1.5 border-border hover:bg-brand-blue/10 hover:text-brand-blue hover:border-brand-blue/40"
                          data-ocid={`brands.save_button.${index + 1}`}
                        >
                          {copiedId === deal.id ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          {copiedId === deal.id ? "Copied!" : "Copy Pitch"}
                        </Button>

                        {onAddApplication && !trackedDeals.has(deal.id) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => trackApplication(deal)}
                            className="h-7 text-xs gap-1.5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50"
                            data-ocid={`brands.primary_button.${index + 1}`}
                          >
                            ✅ Track This Application
                          </Button>
                        ) : trackedDeals.has(deal.id) ? (
                          <span className="text-xs text-emerald-400 flex items-center gap-1 py-1">
                            ✅ Tracked in My Applications
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer nudge */}
      <div className="mt-6 mb-2 text-center">
        <p className="text-[11px] text-muted-foreground">
          🔔 More brand deals dropping every week. Stay tuned!
        </p>
      </div>
    </div>
  );
}
