export interface TrendFormat {
  id: string;
  name: string;
  emoji: string;
  description: string;
  generateHooks: (niche: string) => string[];
}

export const trendFormats: TrendFormat[] = [
  {
    id: "story-arc",
    name: "Story Arc",
    emoji: "📖",
    description: "Hook with a personal journey narrative",
    generateHooks: (niche) => [
      `Maine kabhi nahi socha tha ki ${niche} meri zindagi badal dega... par badal diya 🙌`,
      `2 saal pehle main ${niche} mein total beginner tha. Aaj? [Results] 🔥`,
      `Ye meri ${niche} journey ki sabse badi galti thi...`,
      `Jab maine ${niche} shuru kiya tab log hanste the. Ab wahi log puchhte hain... 😏`,
      `Zero se hero: Meri ${niche} wali story jo aapko inspire karegi ✨`,
    ],
  },
  {
    id: "list-format",
    name: "5-Point List",
    emoji: "📋",
    description: "Quick value-packed list hooks",
    generateHooks: (niche) => [
      `5 cheezein jo har ${niche} beginner ko pata honi chahiye (maine khud ye galtiyan ki) 💡`,
      `${niche} mein success ke 5 secrets jo koi nahi batata 🤫`,
      `5 ${niche} myths jo aapko rok rahe hain - aaj hi todna shuru karo 🚀`,
      `Ye 5 ${niche} tips ne meri life change kar di - save kar lo! 📌`,
      `Top 5 free tools for ${niche} creators in India (2025 updated) 🛠️`,
    ],
  },
  {
    id: "mistake-reveal",
    name: "Mistake Reveal",
    emoji: "😬",
    description: "Vulnerability + lesson format",
    generateHooks: (niche) => [
      `Ye ${niche} wali mistake maine bhi ki thi... aur lakhs waste ho gaye 😅`,
      `${niche} mein ye ek kaam mat karna jo maine kiya tha 🙏`,
      `Meri biggest ${niche} fail story - aur maine kya seekha 📚`,
      `Stop! Ye ${niche} mistake 90% log karte hain... kya tum bhi? ⚠️`,
      `Maine ${niche} mein ye 3 mistakes ki - tumhe nahi karni 🔴`,
    ],
  },
  {
    id: "challenge-hook",
    name: "Challenge Hook",
    emoji: "🏆",
    description: "Push the audience to take action",
    generateHooks: (niche) => [
      `7 din ka ${niche} challenge - join karoge? 💪`,
      `Kya tum 30 days mein ${niche} mein results dekh sakte ho? Challenge accepted? 🎯`,
      `Ye ${niche} test lo - kitne % log fail hote hain? 🤔`,
      `Mujhe lagta hai 99% ${niche} wale ye nahi jaante... prove me wrong 👇`,
      `${niche} challenge: Ek hafte mein result nahi mila toh main wrong hoon 😤`,
    ],
  },
  {
    id: "curiosity-gap",
    name: "Curiosity Gap",
    emoji: "🤫",
    description: "Open loop that demands completion",
    generateHooks: (niche) => [
      `${niche} ka wo secret jo bade creators share nahi karte... 🔐`,
      `Ye ${niche} trick sirf 1% log use karte hain - aaj main share karunga 👀`,
      `Koi nahi batayega ye... main batata hoon ${niche} ke baare mein 🤫`,
      `${niche} mein ek cheez hai jo sab kuch change kar deti hai - guess karo? 🎲`,
      `Jo ${niche} content viral hota hai, uska real reason kya hai? Answer shocking hai 😱`,
    ],
  },
  {
    id: "transformation",
    name: "Transformation",
    emoji: "✨",
    description: "Before/after contrast hooks",
    generateHooks: (niche) => [
      `${niche} se pehle: confused, broke, stuck. ${niche} ke baad: [results] 🔄`,
      `Sirf 90 days mein ${niche} ne meri life kaise badli - full story 🌟`,
      `Ye ${niche} journey dekho: Day 1 vs Day 365 📈`,
      `${niche} ne mujhe [X] se [Y] tak pahuncha diya - aur tum bhi kar sakte ho ✅`,
      `Before ${niche}: anxiety, no direction. After: clarity + growth 🚀`,
    ],
  },
];
