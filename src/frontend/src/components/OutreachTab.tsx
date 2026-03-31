import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Loader2,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type {
  NicheProfile,
  OutreachEntry,
  OutreachStatus,
  SuggestedBrand,
} from "../types/growth";

interface Props {
  outreachEntries: OutreachEntry[];
  onAddEntry: (entry: OutreachEntry) => void;
  onUpdateEntryStatus: (id: string, status: OutreachStatus) => void;
  onDeleteEntry: (id: string) => void;
  onNavigate: (tab: string) => void;
}

type View = "home" | "brands" | "dm" | "chat";

// ─── Niche data ────────────────────────────────────────────────────────────
const NICHES: NicheProfile[] = [
  {
    username: "",
    niche: "Fitness & Wellness",
    contentType: "Workout Reels & Tips",
    audienceType: "18-30 year olds, gym-goers",
  },
  {
    username: "",
    niche: "Personal Finance",
    contentType: "Money Tips & Explainers",
    audienceType: "Young professionals, students",
  },
  {
    username: "",
    niche: "Lifestyle & Fashion",
    contentType: "Outfit & Lifestyle Vlogs",
    audienceType: "18-28 year old women",
  },
  {
    username: "",
    niche: "Tech & Gadgets",
    contentType: "Reviews & Unboxings",
    audienceType: "20-35 year old tech enthusiasts",
  },
  {
    username: "",
    niche: "Food & Cooking",
    contentType: "Recipes & Food Vlogs",
    audienceType: "Home cooks & food lovers",
  },
];

const BRAND_MAP: Record<number, SuggestedBrand[]> = {
  0: [
    {
      id: "f1",
      name: "MuscleBlaze",
      handle: "muscleblaze",
      emoji: "💪",
      category: "Nutrition",
      whyItMatches:
        "Your fitness content matches their protein supplement audience perfectly.",
    },
    {
      id: "f2",
      name: "Decathlon",
      handle: "decathlonin",
      emoji: "🏃",
      category: "Sports",
      whyItMatches: "Budget-friendly gear brand loved by fitness creators.",
    },
    {
      id: "f3",
      name: "HealthifyMe",
      handle: "healthifyme",
      emoji: "🥗",
      category: "Health Tech",
      whyItMatches:
        "Their calorie-tracking app targets gym-goers like your audience.",
    },
    {
      id: "f4",
      name: "Puma India",
      handle: "pumaindia",
      emoji: "👟",
      category: "Sportswear",
      whyItMatches: "Athletic wear for your workout content.",
    },
    {
      id: "f5",
      name: "boAt",
      handle: "boat.nirvana",
      emoji: "🎧",
      category: "Electronics",
      whyItMatches: "Workout earphones — perfect fit for gym content creators.",
    },
  ],
  1: [
    {
      id: "p1",
      name: "Zerodha",
      handle: "zerodha",
      emoji: "📈",
      category: "Fintech",
      whyItMatches: "India's top broker for finance creator collaborations.",
    },
    {
      id: "p2",
      name: "Groww",
      handle: "growwapp",
      emoji: "💹",
      category: "Investing",
      whyItMatches:
        "Their user base matches your student/professional audience.",
    },
    {
      id: "p3",
      name: "CRED",
      handle: "cred_club",
      emoji: "💳",
      category: "Finance",
      whyItMatches: "Premium brand known for creator campaigns.",
    },
    {
      id: "p4",
      name: "Upstox",
      handle: "upstox",
      emoji: "📊",
      category: "Trading",
      whyItMatches: "Targets young investors — perfect for your content.",
    },
    {
      id: "p5",
      name: "INDmoney",
      handle: "indmoneyapp",
      emoji: "💰",
      category: "Wealth",
      whyItMatches: "All-in-one finance app matching your audience.",
    },
  ],
  2: [
    {
      id: "l1",
      name: "Myntra",
      handle: "myntra",
      emoji: "👗",
      category: "Fashion",
      whyItMatches: "India's top fashion marketplace for lifestyle creators.",
    },
    {
      id: "l2",
      name: "NYKAA",
      handle: "nykaa",
      emoji: "💄",
      category: "Beauty",
      whyItMatches:
        "Beauty & personal care — natural fit for lifestyle content.",
    },
    {
      id: "l3",
      name: "FabIndia",
      handle: "fabindiaindia",
      emoji: "🌿",
      category: "Ethnic Wear",
      whyItMatches: "Authentic Indian aesthetic matches lifestyle niches.",
    },
    {
      id: "l4",
      name: "Mamaearth",
      handle: "mamaearth",
      emoji: "🧴",
      category: "Skincare",
      whyItMatches: "Clean beauty brand actively collaborating with creators.",
    },
    {
      id: "l5",
      name: "Sugar Cosmetics",
      handle: "sugarcosmeticsofficial",
      emoji: "✨",
      category: "Makeup",
      whyItMatches: "Bold makeup brand targeting your exact audience.",
    },
  ],
  3: [
    {
      id: "t1",
      name: "boAt",
      handle: "boat.nirvana",
      emoji: "🎧",
      category: "Audio",
      whyItMatches: "India's top audio brand for tech creators.",
    },
    {
      id: "t2",
      name: "realme India",
      handle: "realmeindia",
      emoji: "📱",
      category: "Smartphones",
      whyItMatches: "Budget tech brand with active creator program.",
    },
    {
      id: "t3",
      name: "Logitech India",
      handle: "logitechindia",
      emoji: "🖥️",
      category: "Peripherals",
      whyItMatches: "Perfect for tech review channels.",
    },
    {
      id: "t4",
      name: "Noise",
      handle: "go.noise",
      emoji: "⌚",
      category: "Wearables",
      whyItMatches:
        "Indian smartwatch brand growing fast with creator collabs.",
    },
    {
      id: "t5",
      name: "Amazfit India",
      handle: "amazfitindia",
      emoji: "🏃",
      category: "Smart Fitness",
      whyItMatches: "Fitness trackers for tech-savvy audiences.",
    },
  ],
  4: [
    {
      id: "d1",
      name: "Swiggy",
      handle: "swiggyindia",
      emoji: "🍔",
      category: "Food Delivery",
      whyItMatches: "Huge creator campaign budget for food content creators.",
    },
    {
      id: "d2",
      name: "Zomato",
      handle: "zomato",
      emoji: "🍕",
      category: "Food Delivery",
      whyItMatches:
        "India's biggest food platform actively runs creator campaigns.",
    },
    {
      id: "d3",
      name: "Britannia",
      handle: "britanniaindia",
      emoji: "🍪",
      category: "FMCG",
      whyItMatches: "Iconic snack brand for recipe and food content.",
    },
    {
      id: "d4",
      name: "ITC Foods",
      handle: "itcfoodbiz",
      emoji: "🌾",
      category: "Food",
      whyItMatches: "Trusted food brand for cooking content creators.",
    },
    {
      id: "d5",
      name: "Licious",
      handle: "liciousmeats",
      emoji: "🥩",
      category: "Fresh Food",
      whyItMatches: "Premium fresh food delivery — perfect for recipe content.",
    },
  ],
};

function hashUsername(username: string): number {
  if (!username) return 0;
  let sum = 0;
  for (let i = 0; i < username.length; i++) {
    sum += username.charCodeAt(i);
  }
  return sum % 5;
}

function analyzeProfile(username: string): NicheProfile {
  const idx = hashUsername(username);
  return { ...NICHES[idx], username };
}

function getBrandsForNiche(nicheProfile: NicheProfile): SuggestedBrand[] {
  const idx = NICHES.findIndex((n) => n.niche === nicheProfile.niche);
  return BRAND_MAP[idx >= 0 ? idx : 0] ?? [];
}

function generateDMs(brand: SuggestedBrand, nicheProfile: NicheProfile) {
  const firstMessage = `Hey ${brand.name} team! 👋\n\nI'm a ${nicheProfile.contentType} creator based in India with a highly engaged ${nicheProfile.audienceType} audience. Your brand's focus on ${brand.category} resonates strongly with what my followers care about.\n\nI'd love to explore a collaboration — I create content that drives real engagement, not just views. Could we connect to discuss a potential partnership?\n\n[Your name + IG handle]`;

  const followUp = `Hi ${brand.name} team, just following up on my last message! 🙏\n\nI know your inbox is busy, but I genuinely believe my ${nicheProfile.niche} audience would love ${brand.name}'s products.\n\nHappy to share my media kit and recent stats if it helps. Even a short collab could create great value for both sides!\n\nLooking forward to hearing from you 🙌`;

  return { firstMessage, followUp };
}

const CHAT_RESPONSES = [
  {
    smartResponse:
      "Thank you for reaching out! I'm very interested in moving forward with this collaboration. Could you share the exact deliverables, timeline, and payment terms? I want to make sure we're aligned before signing anything.",
    negotiationSuggestion:
      "💡 Tip: Ask for both product + fee. Many brands start with product-only offers — it's completely okay to ask for a monetary fee on top of the free product.",
  },
  {
    smartResponse:
      "Hi! Thanks for the update 🙏 I'm still very interested in working with your brand. Could you let me know the expected timeline for next steps? I want to keep my content calendar open for this collaboration.",
    negotiationSuggestion:
      "💡 Tip: Request an exclusivity clause. If they're asking for exclusive content, you should be compensated extra — typically 20-30% higher than a non-exclusive deal.",
  },
  {
    smartResponse:
      "Hi, thank you for the offer! I genuinely love your brand and want to make this work, but the budget you've mentioned is lower than my standard rate for this type of content. I invest significant time and resources into quality production — could we revisit the numbers?",
    negotiationSuggestion:
      "💡 Tip: Counter with usage rights value. If they plan to use your content in their ads, that's worth extra — typically 50-100% of the creation fee. Mention this if applicable.",
  },
];

// ─── Limit helpers ──────────────────────────────────────────────────────────
const LIMIT_BRANDS = 5;
const LIMIT_DMS = 10;

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getLimits() {
  const stored = localStorage.getItem("gos_outreach_date");
  const today = getTodayStr();
  if (stored !== today) {
    localStorage.setItem("gos_outreach_date", today);
    localStorage.setItem("gos_brand_count", "0");
    localStorage.setItem("gos_dm_count", "0");
  }
  return {
    brandCount: Number(localStorage.getItem("gos_brand_count") ?? 0),
    dmCount: Number(localStorage.getItem("gos_dm_count") ?? 0),
  };
}

function incrementBrandCount() {
  const c = Number(localStorage.getItem("gos_brand_count") ?? 0);
  localStorage.setItem("gos_brand_count", String(c + 1));
}

function incrementDmCount() {
  const c = Number(localStorage.getItem("gos_dm_count") ?? 0);
  localStorage.setItem("gos_dm_count", String(c + 1));
}

// ─── Status chip colour ─────────────────────────────────────────────────────
function statusChipClass(status: OutreachStatus) {
  if (status === "Not contacted")
    return "bg-muted/40 text-muted-foreground border-border";
  if (status === "Contacted")
    return "bg-amber-500/15 text-amber-400 border-amber-500/25";
  return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
}

const STATUS_CYCLE: OutreachStatus[] = [
  "Not contacted",
  "Contacted",
  "Replied",
];

export default function OutreachTab({
  outreachEntries,
  onAddEntry,
  onUpdateEntryStatus,
  onDeleteEntry,
}: Props) {
  const [view, setView] = useState<View>("home");
  const [username, setUsername] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [nicheProfile, setNicheProfile] = useState<NicheProfile | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<SuggestedBrand | null>(
    null,
  );
  const [limits, setLimits] = useState(() => getLimits());
  const [chatBrandName, setChatBrandName] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [chatGenerating, setChatGenerating] = useState(false);
  const [chatResult, setChatResult] = useState<{
    smartResponse: string;
    negotiationSuggestion: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const refreshLimits = () => setLimits(getLimits());

  const trackedIds = new Set(outreachEntries.map((e) => e.brandId));

  // ── Analyze ──────────────────────────────────────────────────────────────
  const handleAnalyze = () => {
    if (!username.trim()) {
      toast.error("Please enter your Instagram username");
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      setNicheProfile(analyzeProfile(username.trim().replace(/^@/, "")));
      setAnalyzing(false);
    }, 1500);
  };

  // ── Copy helper ───────────────────────────────────────────────────────────
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard ✅");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ── Track brand ───────────────────────────────────────────────────────────
  const handleTrackBrand = (brand: SuggestedBrand) => {
    if (trackedIds.has(brand.id)) {
      toast("Already tracking this brand");
      return;
    }
    refreshLimits();
    if (limits.brandCount >= LIMIT_BRANDS) {
      toast.error("Daily limit reached (5/5). Upgrade to track more.");
      return;
    }
    const entry: OutreachEntry = {
      id: `oe-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      brandId: brand.id,
      brandName: brand.name,
      brandHandle: brand.handle,
      brandEmoji: brand.emoji,
      status: "Not contacted",
      dateAdded: new Date().toISOString(),
      dmGenerated: false,
    };
    onAddEntry(entry);
    incrementBrandCount();
    refreshLimits();
    toast.success(`${brand.name} added to tracker ✅`);
  };

  // ── Generate DM ───────────────────────────────────────────────────────────
  const handleGenerateDM = (brand: SuggestedBrand) => {
    refreshLimits();
    if (limits.dmCount >= LIMIT_DMS) {
      toast.error("DM limit reached (10/10). Upgrade to generate more.");
      return;
    }
    setSelectedBrand(brand);
    incrementDmCount();
    refreshLimits();
    setView("dm");
  };

  // ── Cycle status ──────────────────────────────────────────────────────────
  const handleCycleStatus = (entry: OutreachEntry) => {
    const idx = STATUS_CYCLE.indexOf(entry.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    onUpdateEntryStatus(entry.id, next);
    toast.success(`Status → ${next}`);
  };

  // ── Chat generate ─────────────────────────────────────────────────────────
  const handleChatGenerate = () => {
    if (!chatReply.trim()) return;
    setChatGenerating(true);
    setTimeout(() => {
      const idx = chatReply.length % 3;
      setChatResult(CHAT_RESPONSES[idx]);
      setChatGenerating(false);
    }, 1200);
  };

  const suggestedBrands = nicheProfile ? getBrandsForNiche(nicheProfile) : [];
  const dmMessages =
    selectedBrand && nicheProfile
      ? generateDMs(selectedBrand, nicheProfile)
      : null;

  // ── HOME VIEW ─────────────────────────────────────────────────────────────
  if (view === "home") {
    return (
      <div className="pb-4 animate-fade-in" data-ocid="outreach.panel">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-foreground">
              📨 Brand Outreach
            </h1>
            <Badge
              className="text-[10px] font-semibold px-2.5 py-1"
              style={{
                background: "oklch(0.585 0.195 260 / 0.15)",
                color: "oklch(0.72 0.185 215)",
                border: "1px solid oklch(0.585 0.195 260 / 0.25)",
              }}
            >
              AI-powered
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            AI-powered outreach, you stay in control
          </p>
        </div>

        {/* Niche Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 border border-border mb-4"
          style={{ background: "oklch(0.175 0.011 250)" }}
          data-ocid="outreach.analysis.card"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔍</span>
            <p className="text-sm font-semibold">Analyze My Profile</p>
          </div>
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                @
              </span>
              <Input
                ref={usernameInputRef}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder="your_instagram"
                className="pl-7 h-9 text-sm bg-card border-border rounded-xl"
                data-ocid="outreach.username.input"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={analyzing || !username.trim()}
              className="h-9 px-4 rounded-xl text-sm font-semibold"
              style={{
                background: analyzing ? undefined : "oklch(0.585 0.195 260)",
                color: "white",
              }}
              data-ocid="outreach.analyze.button"
            >
              {analyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Analyze"
              )}
            </Button>
          </div>

          {analyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 py-2"
              data-ocid="outreach.analyze.loading_state"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue" />
              <p className="text-xs text-muted-foreground">
                Analyzing your profile...
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {nicheProfile && !analyzing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className="rounded-xl p-3 border border-emerald-500/20 mb-3"
                  style={{ background: "oklch(0.56 0.154 142 / 0.08)" }}
                  data-ocid="outreach.analysis.success_state"
                >
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                    Profile Analysis
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Niche
                      </span>
                      <span className="text-[11px] font-semibold text-foreground">
                        {nicheProfile.niche}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Content
                      </span>
                      <span className="text-[11px] font-semibold text-foreground">
                        {nicheProfile.contentType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Audience
                      </span>
                      <span className="text-[11px] font-semibold text-foreground text-right max-w-[55%]">
                        {nicheProfile.audienceType}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setView("brands")}
                  className="w-full h-9 rounded-xl text-sm font-semibold gap-2"
                  style={{
                    background: "oklch(0.585 0.195 260)",
                    color: "white",
                  }}
                  data-ocid="outreach.find_brands.button"
                >
                  Find Brands <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Daily Outreach Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-4 border border-border mb-4"
          style={{ background: "oklch(0.175 0.011 250)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Today's Outreach</p>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "oklch(0.27 0.013 250)",
                color: "oklch(0.72 0.185 215)",
              }}
            >
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>

          {outreachEntries.length === 0 ? (
            <div
              className="text-center py-6"
              data-ocid="outreach.tracker.empty_state"
            >
              <p className="text-2xl mb-2">📭</p>
              <p className="text-xs text-muted-foreground">
                No brands tracked yet. Analyze your profile to get suggestions
                🚀
              </p>
            </div>
          ) : (
            <div className="space-y-2" data-ocid="outreach.tracker.list">
              {outreachEntries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2.5 py-2 px-3 rounded-xl border border-border"
                  style={{ background: "oklch(0.135 0.009 250)" }}
                  data-ocid={`outreach.tracker.item.${i + 1}`}
                >
                  <span className="text-lg leading-none flex-shrink-0">
                    {entry.brandEmoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">
                      {entry.brandName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(entry.dateAdded).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCycleStatus(entry)}
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full border transition-all flex-shrink-0 ${statusChipClass(entry.status)}`}
                    data-ocid={`outreach.status.toggle.${i + 1}`}
                    title="Tap to update status"
                  >
                    {entry.status}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteEntry(entry.id)}
                    className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
                    data-ocid={`outreach.tracker.delete_button.${i + 1}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Chat Assistant button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <button
            type="button"
            onClick={() => setView("chat")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-brand-blue/40 hover:bg-brand-blue/5 transition-all"
            style={{ background: "oklch(0.175 0.011 250)" }}
            data-ocid="outreach.chat_assistant.button"
          >
            <span className="text-xl">💬</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">Reply to Brand</p>
              <p className="text-[11px] text-muted-foreground">
                AI generates smart responses for you
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Usage limit bar */}
        <div className="mt-4 flex items-center gap-2 px-1">
          <p className="text-[10px] text-muted-foreground">
            Brands: {limits.brandCount}/{LIMIT_BRANDS}{" "}
            today&nbsp;&nbsp;•&nbsp;&nbsp;DMs: {limits.dmCount}/{LIMIT_DMS}{" "}
            today
          </p>
        </div>
      </div>
    );
  }

  // ── BRANDS VIEW ───────────────────────────────────────────────────────────
  if (view === "brands") {
    return (
      <div className="pb-4 animate-fade-in" data-ocid="outreach.brands.panel">
        <button
          type="button"
          onClick={() => setView("home")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
          data-ocid="outreach.brands.back.button"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Analysis
        </button>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Suggested Brands</h1>
          {nicheProfile && (
            <Badge
              className="text-[10px] px-2.5 py-1 font-semibold"
              style={{
                background: "oklch(0.585 0.195 260 / 0.15)",
                color: "oklch(0.72 0.185 215)",
                border: "1px solid oklch(0.585 0.195 260 / 0.25)",
              }}
            >
              {nicheProfile.niche}
            </Badge>
          )}
        </div>

        {limits.brandCount >= LIMIT_BRANDS && (
          <div
            className="rounded-xl p-3 mb-4 flex items-center gap-2.5"
            style={{
              background: "oklch(0.585 0.195 260 / 0.1)",
              border: "1px solid oklch(0.585 0.195 260 / 0.3)",
            }}
            data-ocid="outreach.brands.limit.error_state"
          >
            <span>⚠️</span>
            <p className="text-xs text-brand-cyan">
              Daily limit reached (5/5). Upgrade to track more brands.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {suggestedBrands.map((brand, i) => {
            const isTracked = trackedIds.has(brand.id);
            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl p-4 border border-border"
                style={{ background: "oklch(0.175 0.011 250)" }}
                data-ocid={`outreach.brand.item.${i + 1}`}
              >
                <div className="flex items-start gap-3 mb-2.5">
                  <span className="text-2xl leading-none flex-shrink-0">
                    {brand.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold">{brand.name}</p>
                      <Badge
                        className="text-[9px] px-1.5 py-0.5"
                        style={{
                          background: "oklch(0.27 0.013 250)",
                          color: "oklch(0.72 0.185 215)",
                          border: "none",
                        }}
                      >
                        {brand.category}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      {brand.whyItMatches}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleGenerateDM(brand)}
                    className="h-8 text-xs rounded-xl flex-1 gap-1.5 font-semibold"
                    style={{
                      background: "oklch(0.585 0.195 260)",
                      color: "white",
                    }}
                    data-ocid={`outreach.brand.dm_button.${i + 1}`}
                  >
                    <Send className="w-3 h-3" />
                    Generate DM 💬
                  </Button>
                  {isTracked ? (
                    <span className="h-8 flex items-center text-[11px] text-emerald-400 px-2 font-semibold">
                      ✅ Tracked
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTrackBrand(brand)}
                      disabled={limits.brandCount >= LIMIT_BRANDS}
                      className="h-8 text-xs rounded-xl gap-1 border-border hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-400"
                      data-ocid={`outreach.brand.track_button.${i + 1}`}
                    >
                      Track ➕
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── DM VIEW ───────────────────────────────────────────────────────────────
  if (view === "dm" && selectedBrand && dmMessages) {
    const { firstMessage, followUp } = dmMessages;
    const atLimit = limits.dmCount >= LIMIT_DMS;

    return (
      <div className="pb-4 animate-fade-in" data-ocid="outreach.dm.panel">
        <button
          type="button"
          onClick={() => setView("brands")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
          data-ocid="outreach.dm.back.button"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Suggestions
        </button>

        {/* Brand header */}
        <div
          className="flex items-center gap-3 mb-5 rounded-xl p-3.5 border border-border"
          style={{ background: "oklch(0.175 0.011 250)" }}
        >
          <span className="text-3xl leading-none">{selectedBrand.emoji}</span>
          <div>
            <p className="font-bold text-base">{selectedBrand.name}</p>
            <Badge
              className="text-[9px] px-1.5 py-0.5 mt-0.5"
              style={{
                background: "oklch(0.27 0.013 250)",
                color: "oklch(0.72 0.185 215)",
                border: "none",
              }}
            >
              {selectedBrand.category}
            </Badge>
          </div>
        </div>

        {atLimit && (
          <div
            className="rounded-xl p-3 mb-4 flex items-center gap-2.5"
            style={{
              background: "oklch(0.585 0.195 260 / 0.1)",
              border: "1px solid oklch(0.585 0.195 260 / 0.3)",
            }}
            data-ocid="outreach.dm.limit.error_state"
          >
            <span>⚠️</span>
            <p className="text-xs text-brand-cyan">
              DM limit reached (10/10). Upgrade to generate more messages.
            </p>
          </div>
        )}

        {/* First message */}
        <div
          className="rounded-xl p-4 border border-border mb-3"
          style={{ background: "oklch(0.175 0.011 250)" }}
          data-ocid="outreach.dm.first.card"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                1st DM
              </span>
              <span className="text-[9px] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded-full">
                Opening message
              </span>
            </div>
          </div>
          <div
            className="rounded-lg p-3 text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap mb-3"
            style={{ background: "oklch(0.135 0.009 250)" }}
          >
            {firstMessage}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(firstMessage, "dm1")}
              className="h-8 text-xs rounded-xl gap-1.5 flex-1 border-border hover:bg-brand-blue/10 hover:text-brand-blue"
              data-ocid="outreach.dm.first.copy.button"
            >
              {copiedKey === "dm1" ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copiedKey === "dm1" ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 text-xs rounded-xl gap-1.5 border-border hover:bg-brand-cyan/10 hover:text-brand-cyan"
              data-ocid="outreach.dm.first.instagram.button"
            >
              <a
                href={`https://www.instagram.com/${selectedBrand.handle}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3 h-3" />
                Open Instagram
              </a>
            </Button>
          </div>
        </div>

        {/* Follow-up message */}
        <div
          className="rounded-xl p-4 border border-border mb-4"
          style={{ background: "oklch(0.175 0.011 250)" }}
          data-ocid="outreach.dm.followup.card"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Follow-up
            </span>
            <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
              3 days later
            </span>
          </div>
          <div
            className="rounded-lg p-3 text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap mb-3"
            style={{ background: "oklch(0.135 0.009 250)" }}
          >
            {followUp}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(followUp, "dm2")}
            className="h-8 text-xs rounded-xl gap-1.5 w-full border-border hover:bg-brand-blue/10 hover:text-brand-blue"
            data-ocid="outreach.dm.followup.copy.button"
          >
            {copiedKey === "dm2" ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copiedKey === "dm2" ? "Copied!" : "Copy Follow-up"}
          </Button>
        </div>

        {/* Track button */}
        {!trackedIds.has(selectedBrand.id) ? (
          <Button
            onClick={() => handleTrackBrand(selectedBrand)}
            className="w-full h-11 rounded-xl text-sm font-semibold gap-2"
            style={{ background: "oklch(0.56 0.154 142)", color: "white" }}
            data-ocid="outreach.dm.track.button"
          >
            ✅ Track This Brand
          </Button>
        ) : (
          <div
            className="w-full h-11 rounded-xl flex items-center justify-center gap-2 border border-emerald-500/30"
            style={{ background: "oklch(0.56 0.154 142 / 0.08)" }}
          >
            <span className="text-sm font-semibold text-emerald-400">
              ✅ Already in Tracker
            </span>
          </div>
        )}

        {/* Safety note */}
        <p className="text-[10px] text-muted-foreground text-center mt-4 px-4">
          ⚠️ Copy the message and send it manually on Instagram. We never
          auto-send DMs.
        </p>
      </div>
    );
  }

  // ── CHAT VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="pb-4 animate-fade-in" data-ocid="outreach.chat.panel">
      <button
        type="button"
        onClick={() => {
          setView("home");
          setChatResult(null);
          setChatReply("");
          setChatBrandName("");
        }}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
        data-ocid="outreach.chat.back.button"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      <div className="mb-5">
        <h1 className="text-xl font-bold mb-1">🧠 AI Reply Assistant</h1>
        <p className="text-xs text-muted-foreground">
          Paste a brand's reply to get a smart response
        </p>
      </div>

      <div
        className="rounded-xl p-4 border border-border mb-4"
        style={{ background: "oklch(0.175 0.011 250)" }}
      >
        <div className="mb-3">
          <label
            htmlFor="chat-brand-input"
            className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
          >
            Brand Name (optional)
          </label>
          <Input
            id="chat-brand-input"
            value={chatBrandName}
            onChange={(e) => setChatBrandName(e.target.value)}
            placeholder="e.g. Mamaearth"
            className="h-9 text-sm bg-card border-border rounded-xl"
            data-ocid="outreach.chat.brand.input"
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="chat-reply-textarea"
            className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
          >
            Brand's Reply
          </label>
          <Textarea
            id="chat-reply-textarea"
            value={chatReply}
            onChange={(e) => setChatReply(e.target.value)}
            placeholder="Paste the brand's reply here..."
            className="min-h-[120px] text-sm bg-card border-border rounded-xl resize-none"
            data-ocid="outreach.chat.reply.textarea"
          />
        </div>
        <Button
          onClick={handleChatGenerate}
          disabled={!chatReply.trim() || chatGenerating}
          className="w-full h-10 rounded-xl text-sm font-semibold gap-2"
          style={{
            background:
              !chatReply.trim() || chatGenerating
                ? undefined
                : "oklch(0.585 0.195 260)",
            color: "white",
          }}
          data-ocid="outreach.chat.generate.button"
        >
          {chatGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating...
            </>
          ) : (
            "Generate Response"
          )}
        </Button>
      </div>

      {chatGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-4 py-2"
          data-ocid="outreach.chat.loading_state"
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue" />
          <p className="text-xs text-muted-foreground">
            AI is crafting your response...
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {chatResult && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            data-ocid="outreach.chat.result.card"
          >
            {/* Smart Response */}
            <div
              className="rounded-xl p-4 border border-border mb-3"
              style={{ background: "oklch(0.175 0.011 250)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan mb-2">
                Smart Response
              </p>
              <p className="text-xs text-foreground/90 leading-relaxed mb-3">
                {chatResult.smartResponse}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCopy(chatResult.smartResponse, "chat-resp")
                }
                className="h-8 text-xs rounded-xl gap-1.5 w-full border-border hover:bg-brand-blue/10 hover:text-brand-blue"
                data-ocid="outreach.chat.response.copy.button"
              >
                {copiedKey === "chat-resp" ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copiedKey === "chat-resp" ? "Copied!" : "Copy Response"}
              </Button>
            </div>

            {/* Negotiation Tip */}
            <div
              className="rounded-xl p-4 border mb-4"
              style={{
                background: "oklch(0.585 0.195 260 / 0.08)",
                borderColor: "oklch(0.585 0.195 260 / 0.3)",
              }}
              data-ocid="outreach.chat.negotiation.card"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-blue mb-2">
                Negotiation Tip
              </p>
              <p className="text-xs text-foreground/80 leading-relaxed mb-3">
                {chatResult.negotiationSuggestion}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCopy(chatResult.negotiationSuggestion, "chat-neg")
                }
                className="h-8 text-xs rounded-xl gap-1.5 w-full border-border hover:bg-brand-blue/10 hover:text-brand-blue"
                data-ocid="outreach.chat.negotiation.copy.button"
              >
                {copiedKey === "chat-neg" ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copiedKey === "chat-neg" ? "Copied!" : "Copy Tip"}
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setChatResult(null);
                setChatReply("");
                setChatBrandName("");
              }}
              className="w-full h-10 rounded-xl text-sm border-border"
              data-ocid="outreach.chat.start_over.button"
            >
              Start Over
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[10px] text-muted-foreground text-center mt-4 px-4">
        ⚠️ You are in full control. Copy responses and send them manually.
      </p>
    </div>
  );
}
