import { type ContentGoal, ContentType, type Platform } from "../backend";

interface ContentPlanInput {
  niche: string;
  targetAudience: string;
  platform: Platform;
  contentGoal: ContentGoal;
}

const contentTypeRotation: ContentType[] = [
  ContentType.educational,
  ContentType.story,
  ContentType.educational,
  ContentType.sales,
  ContentType.educational,
  ContentType.story,
  ContentType.educational,
  ContentType.educational,
  ContentType.story,
  ContentType.sales,
];

const getTopicsByNiche = (niche: string): string[] => {
  const lower = niche.toLowerCase();
  if (
    lower.includes("fitness") ||
    lower.includes("health") ||
    lower.includes("gym")
  ) {
    return [
      "5 mistakes beginners make at the gym",
      "My transformation story - 0 to fit in 90 days",
      "Why you're not losing weight despite exercising",
      "Morning routine that changed my life",
      "Best budget-friendly protein sources in India",
      "HIIT workout you can do at home",
      "How I lost 10kg without starving",
      "The truth about fat burners",
      "Sleep and fitness - the missing link",
      "Full body workout for busy people",
      "Nutrition myths busted",
      "Building habits that actually stick",
      "Why consistency beats intensity",
      "Yoga vs gym - which is better?",
      "Meal prep for the entire week",
      "How to stay motivated on bad days",
      "The science of muscle building",
      "Cardio myths you need to stop believing",
      "Top 5 exercises for abs",
      "How to recover faster after workout",
      "Mental health and fitness connection",
      "Best time to workout - morning or evening?",
      "Indian diet plan for weight loss",
      "Gym equipment you actually need",
      "Building a home gym on budget",
      "Why rest days are important",
      "How to track your fitness progress",
      "Beginner's guide to strength training",
      "Overcoming gym anxiety",
      "Setting realistic fitness goals",
    ];
  }
  if (
    lower.includes("finance") ||
    lower.includes("money") ||
    lower.includes("invest")
  ) {
    return [
      "5 money mistakes you're making in your 20s",
      "How I went from debt to saving 40%",
      "SIP se kaise banaaye 1 crore",
      "Emergency fund - kitna hona chahiye?",
      "Mutual funds vs FD - kaun better hai?",
      "Credit card traps aur kaise bachein",
      "Tax saving tips nobody told you",
      "Real estate vs stocks - 2024 mein kya better?",
      "Side income ideas that actually work",
      "Budgeting for salaried employees",
      "Why most people stay broke their whole life",
      "How compound interest can make you rich",
      "Index funds explained simply",
      "Insurance myths that cost Indians lakhs",
      "How to negotiate a salary hike",
      "Building multiple income streams",
      "Gold investment - right or wrong?",
      "Understanding your salary slip",
      "How to start investing with 500/month",
      "The psychology of money",
      "NPS vs PPF - which one?",
      "Common IPO mistakes to avoid",
      "How inflation is eating your savings",
      "Financial planning for newlyweds",
      "Passive income ideas for Indians",
      "Understanding stock market basics",
      "How to get out of debt fast",
      "Budget travel hacks that save big",
      "Why you need a financial advisor",
      "Creating a 5-year financial plan",
    ];
  }
  if (
    lower.includes("cook") ||
    lower.includes("food") ||
    lower.includes("recipe")
  ) {
    return [
      "5-minute breakfast that keeps you full",
      "How I learned cooking from zero",
      "Restaurant-style dal makhani at home",
      "Meal prep Sunday routine",
      "Healthy snacks under 100 calories",
      "Cooking mistakes that ruin your food",
      "Budget meals under 50 rupees",
      "One-pan dinner recipes",
      "Leftovers transformed into new dishes",
      "Traditional recipes with healthy twist",
      "Kitchen hacks that save time",
      "Spice guide for beginners",
      "How to make perfect rice every time",
      "Indian street food made healthier",
      "Batch cooking for the week",
      "No-fail chocolate cake recipe",
      "Fermented foods for gut health",
      "Air fryer recipes Indians will love",
      "Protein-rich vegetarian meals",
      "Quick tiffin ideas for kids",
      "How to reduce food waste",
      "5 ways to use leftover roti",
      "Making dough for beginners",
      "Indian fusion recipes going viral",
      "Seasonal eating guide",
      "Cooking for one person efficiently",
      "How to store vegetables longer",
      "Summer drinks and desserts",
      "Festival special recipes",
      "Quick fix when you mess up a dish",
    ];
  }
  // Generic topics
  return Array.from({ length: 30 }, (_, i) => {
    const types = [
      "How to",
      "Why",
      "Top 5",
      "The truth about",
      "My journey with",
      "Secrets of",
    ];
    const prefix = types[i % types.length];
    return `${prefix} ${niche} - Day ${i + 1}`;
  });
};

export const generateContentPlan = (input: ContentPlanInput) => {
  const topics = getTopicsByNiche(input.niche);
  const descriptions = [
    `Share your expertise on this topic with your ${input.targetAudience} audience`,
    "Engage and inspire your community with authentic storytelling",
    "Educate your followers with actionable tips they can use today",
    "Connect emotionally with your audience through real experiences",
    "Drive conversions with value-packed content for your offer",
  ];

  return topics.slice(0, 30).map((title, i) => ({
    day: i + 1,
    title,
    contentType: contentTypeRotation[i % contentTypeRotation.length],
    description: descriptions[i % descriptions.length],
  }));
};

const hinglishHookTemplates = [
  (niche: string) => `Yaar, mujhe ${niche} se itna pyaar kyun hai? 😍`,
  (niche: string) =>
    `Stop scrolling! ${niche} ke baare mein ye sach kisi ne nahi bataya 🤯`,
  (niche: string) => `Maine 6 months mein ${niche} mein itna seekha... 🔥`,
  (niche: string) =>
    `${niche} shuru karna chahte ho? Ye 3 cheezein zaroor jaano 💡`,
  (niche: string) =>
    `Log poochte hain mujhse - ${niche} mein success ka secret kya hai? 🚀`,
  (niche: string) =>
    `Ye ${niche} wali mistake maine bhi ki thi... aur tum bhi kar rahe ho 😅`,
  (niche: string) =>
    `90% log ${niche} mein fail isliye hote hain... aur iska solution bhi dunga 💪`,
  (niche: string) =>
    `${niche} ke baare mein itni badi galti mat karna jo maine ki 🙏`,
  (niche: string) =>
    `Free mein ${niche} seekhna hai? Watch this till the end ⬇️`,
  (niche: string) =>
    `Ek reel, ek change. ${niche} ko aaj se differently dekho 🎯`,
];

export const generateHinglishHooks = (niche: string): string[] => {
  return hinglishHookTemplates.map((template) => template(niche));
};

export const generateScript = (topic: string, niche: string) => {
  return {
    hook: `Aaj main aapko ${topic} ke baare mein ek aisi baat bataunga jo shayad aapne pehle kabhi nahi suni! 🔥 Agly 60 seconds mein dhyan se dekho...`,
    mainContent: `Toh chalte hain seedha point pe.

Point 1: ${topic} mein sabse pehle jo important hai - apna foundation strong karo. Bina solid base ke koi bhi ${niche} mein long-term survive nahi kar sakta.

Point 2: Consistency beats intensity. Roz thoda thoda karo, par karo. 1% improvement daily = 37x better in a year!

Point 3: Community aur accountability. Akele nahi ho tum. Join karo aise logon se jo same journey pe hain.

Ye teeno cheezein implement karo aur dekho kya hota hai apni ${niche} journey mein.`,
    cta: `Agar ye helpful laga, toh like karo aur us ek dost ko tag karo jise ye zaroor sunna chahiye! Comment mein batao - "Ready" likhna agar tum bhi start karne wale ho! 🚀`,
  };
};
