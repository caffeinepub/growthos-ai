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
  onNavigate?: (tab: string) => void;
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
    "Great profile match! Let's schedule a 15-min intro call. Are you free this week?",
  ],
  "4": [
    "Hi there! Thanks for your interest. What subjects does your audience follow mostly?",
    "That's great! We're looking for creators who can explain concepts clearly. Can you share a sample video?",
    "We love your teaching style! Our campaign starts next month. Let's discuss payment terms.",
  ],
  "5": [
    "Hey! We love your content style 🌸 What's your current skincare routine?",
    "Perfect! Our Vitamin C range just launched. Would you be open to a 4-week collaboration?",
    "We'll ship you the products first. Please share your address and we'll get started!",
  ],
};

const userMessages: Record<string, string[]> = {
  "1": [
    "Hi boAt team! I'm a tech/lifestyle creator with 15k engaged followers. Would love to collaborate on the Airdopes campaign!",
    "My handle is @techwithravi and I get around 8-12% engagement. Here's my latest Reel: [link]",
    "That sounds great! I'll fill the form right away.",
  ],
  "2": [
    "Hey MuscleBlaze! I create gym and home workout content. Your protein supplements are already on my wishlist!",
    "I do gym-focused workouts — 3 times a week, HIIT + strength training. 2 posts/week works for me!",
    "Looking forward to the email. I'm excited about this collaboration!",
  ],
  "3": [
    "Hello Myntra! I create lifestyle and fashion content with focus on Indian fashion trends.",
    "I'm based in Mumbai! Happy to share all stats and analytics.",
    "Sure! I'm free Tuesday or Thursday afternoon. Let me know!",
  ],
  "4": [
    "Hi Unacademy! I create educational content focused on competitive exams and career guidance.",
    "My audience is 70% UPSC aspirants and 30% SSC/banking students. Here's a sample: [link]",
    "Excited to discuss the campaign! Looking forward to the details.",
  ],
  "5": [
    "Hi Mamaearth! I'm a beauty and skincare creator. I love your clean beauty philosophy!",
    "A 4-week collaboration sounds perfect! My audience loves natural skincare products.",
    "Address sent to your DM. Thank you so much, excited for this!",
  ],
};

function generatePitch(deal: BrandDeal): string {
  return `Hi ${deal.name} team! 👋

I'm a creator in the ${deal.category} space with a highly engaged Indian audience. I came across your ${deal.campaign.split(" ").slice(0, 5).join(" ")}... campaign and I believe my content style is a perfect match.

Here's why I think we'd work well together:
• My audience demographic aligns with your target customers
• I create authentic, high-quality content that drives real engagement
• I've successfully completed brand collaborations before
• My content style complements ${deal.name}'s brand values

I'd love to discuss how we can create value together. Could we hop on a quick call or continue via DM?

Looking forward to hearing from you! 🙌

[Your Name]
[Your IG Handle]`;
}

export default function BrandsTab({ onAddApplication, onNavigate }: Props) {
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

  const dealMessages = selectedDeal ? (messages[selectedDeal.id] ?? []) : [];

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedDeal) return;
    const userMsgIndex = dealMessages.filter((m) => m.role === "user").length;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: inputText.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => ({
      ...prev,
      [selectedDeal.id]: [...(prev[selectedDeal.id] ?? []), userMsg],
    }));
    setInputText("");
    setIsTyping(true);
    setTimeout(
      () => {
        const replies = brandReplies[selectedDeal.id] ?? [];
        const replyText =
          replies[userMsgIndex % replies.length] ??
          "Thanks for your message! We'll get back to you soon.";
        const brandMsg: ChatMessage = {
          id: `b-${Date.now()}`,
          role: "brand",
          text: replyText,
          timestamp: Date.now(),
        };
        setMessages((prev) => ({
          ...prev,
          [selectedDeal.id]: [...(prev[selectedDeal.id] ?? []), brandMsg],
        }));
        setIsTyping(false);
      },
      1200 + Math.random() * 800,
    );
  };

  const copyPitch = (deal: BrandDeal) => {
    navigator.clipboard.writeText(generatePitch(deal));
    setCopiedId(deal.id);
    toast.success("Pitch copied ✅");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const trackApplication = (deal: BrandDeal) => {
    if (!onAddApplication) return;
    const app: Application = {
      id: `brand-${deal.id}-${Date.now()}`,
      brandName: deal.name,
      campaignName: `${deal.campaign.slice(0, 60)}...`,
      status: "Applied",
      notes: `Generated pitch via Brand Collabs. Campaign: ${deal.campaign}`,
      dateApplied: new Date().toISOString(),
    };
    onAddApplication(app);
    setTrackedDeals((prev) => new Set([...prev, deal.id]));
    toast.success(`${deal.name} tracked in My Applications ✅`);
  };

  // Chat view
  if (selectedDeal) {
    const deal = selectedDeal;
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
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                      style={{ background: "oklch(0.27 0.013 250)" }}
                    >
                      {deal.emoji}
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-tr-sm text-white"
                        : "rounded-tl-sm text-foreground/90"
                    }`}
                    style={{
                      background:
                        msg.role === "user"
                          ? "oklch(0.585 0.195 260)"
                          : "oklch(0.27 0.013 250)",
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2"
                data-ocid="brands.chat.loading_state"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                  style={{ background: "oklch(0.27 0.013 250)" }}
                >
                  {deal.emoji}
                </div>
                <div
                  className="rounded-2xl rounded-tl-sm px-3 py-2"
                  style={{ background: "oklch(0.27 0.013 250)" }}
                >
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.15,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {dealMessages.length === 0 && !isTyping && (
              <div
                className="text-center py-8"
                data-ocid="brands.chat.empty_state"
              >
                <p className="text-3xl mb-3">{deal.emoji}</p>
                <p className="text-sm font-semibold mb-1">{deal.name}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Start the conversation! Use the pitch below or write your own.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const pitchText =
                      userMessages[deal.id]?.[0] ??
                      `Hi ${deal.name}! I'd love to collaborate.`;
                    setInputText(pitchText);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className="text-xs text-brand-blue underline-offset-2 hover:underline"
                  data-ocid="brands.chat.primary_button"
                >
                  Use suggested opener →
                </button>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="pt-3 border-t border-border">
          <div className="flex gap-2 items-center">
            <Input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 h-10 text-sm rounded-xl border-border bg-card"
              data-ocid="brands.chat.input"
            />
            <Button
              type="button"
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="h-10 w-10 rounded-xl p-0 flex-shrink-0"
              style={{ background: "oklch(0.585 0.195 260)" }}
              data-ocid="brands.chat.submit_button"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="pb-4 animate-fade-in" data-ocid="brands.list.panel">
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-foreground">
            🤝 Brand Collabs
          </h1>
          <div className="flex items-center gap-2">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate("outreach")}
                className="text-xs text-brand-cyan underline-offset-2 hover:underline"
                data-ocid="brands.outreach.link"
              >
                📨 Outreach →
              </button>
            )}
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
                    <p className="text-sm font-bold">{deal.name}</p>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: "oklch(0.27 0.013 250)",
                        color: "oklch(0.72 0.185 215)",
                      }}
                    >
                      {deal.category}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-sm font-bold flex-shrink-0 ${deal.budgetColor}`}
                >
                  {deal.budget}
                </span>
              </div>

              {/* Campaign text */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {deal.campaign}
              </p>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDeal(deal)}
                  className="h-7 text-xs gap-1.5 border-border hover:bg-brand-blue/10 hover:text-brand-blue hover:border-brand-blue/40"
                  data-ocid={`brands.edit_button.${index + 1}`}
                >
                  <Sparkles className="w-3 h-3" />
                  Chat & Apply
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setExpandedPitch(expandedPitch === deal.id ? null : deal.id)
                  }
                  className="h-7 text-xs gap-1.5 border-border hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/40"
                  data-ocid={`brands.secondary_button.${index + 1}`}
                >
                  <Copy className="w-3 h-3" />
                  Generate Pitch
                </Button>
              </div>

              {/* Pitch expansion */}
              <AnimatePresence>
                {expandedPitch === deal.id && (
                  <motion.div
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
