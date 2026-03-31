# GrowthOS AI

## Current State

GrowthOS AI is a mobile-first AI assistant for Indian creators and coaches. It has a 5-tab bottom nav: Dashboard, Content, Leads, Apply (Applications), Profile. Additional tabs accessible via navigation from Dashboard or other tabs: Brands (brand deal opportunities with pitch generator + chat simulation), Analytics, Automation, Settings, Pricing.

The existing BrandsTab shows 5 pre-loaded brand deal cards (boAt, MuscleBlaze, Myntra, Unacademy, Mamaearth) with an AI pitch generator, copy pitch, chat simulation, and "Track This Application" integration. It does NOT have a proactive outreach workflow.

Types in `types/growth.ts`: Application, ApplicationStatus, ConnectedAccounts, ScheduledPost, Lead, etc.

## Requested Changes (Diff)

### Add
- `OutreachTab.tsx` — new full-screen component with 5 sub-sections accessible via vertical tabs/steps:
  1. **Niche Analysis**: Input Instagram username → simulate AI analysis → output Niche, Content Type, Audience Type in a result card
  2. **Brand Suggestions**: After analysis, show 5–6 brand cards (name, emoji, category, why it matches the creator's niche) with `Generate DM` and `Track` buttons per card
  3. **DM Generator**: Per brand — show First Message + Follow-up Message, Copy buttons, Open Instagram button (links to instagram.com/{brandHandle}), back button
  4. **Daily Outreach Tracker**: Persistent list of tracked brands with status chips (Not contacted / Contacted / Replied). Tap status chip to cycle through states. Show today's date and usage count.
  5. **Chat Assistant**: Textarea to paste brand reply + brand name input → "Get AI Response" button → shows Smart Response card + Negotiation Suggestion card. Both have Copy button.
- **Limit System** (free plan): Track daily usage in localStorage — max 5 brand suggestions/day, max 10 DMs generated/day. Show pill badge `3/5 brands today`. When limit hit, show upgrade nudge instead of action.
- New types in `types/growth.ts`: `NicheProfile`, `SuggestedBrand`, `OutreachEntry`, `OutreachStatus`, `ChatAssistantResult`
- Navigation to `outreach` tab from Dashboard quick actions and from BrandsTab header

### Modify
- `App.tsx`: Add `outreach` case to tab routing; pass new outreach state (tracked brands, usage limits) with handlers
- `Dashboard.tsx`: Add `Brand Outreach` button in Quick Actions grid linking to `outreach` tab
- `BrandsTab.tsx`: Add `Outreach` button in header row linking to `outreach` tab via `onNavigate` prop (pass `onNavigate` prop to BrandsTab)
- `types/growth.ts`: Add new outreach-related types

### Remove
- Nothing removed

## Implementation Plan

1. **types/growth.ts** — Add `NicheProfile`, `SuggestedBrand`, `OutreachEntry` (id, brandId, brandName, brandHandle, status, dateAdded), `OutreachStatus` ("Not contacted" | "Contacted" | "Replied"), `ChatAssistantResult`

2. **OutreachTab.tsx** — Create new component with internal view state: `view: "home" | "brands" | "dm" | "chat"`. Sections:
   - Home: Niche Analysis form + Daily Outreach Tracker list + Chat Assistant button
   - Brands: Grid of suggested brand cards (based on niche analysis result)
   - DM view: Shows generated first + follow-up messages for selected brand
   - Chat: Paste reply form + AI response output
   - Limit badges shown on home and brands views
   - All AI outputs are simulated (deterministic based on niche/brand combination)
   - localStorage keys: `gos_outreach_date`, `gos_outreach_brand_count`, `gos_outreach_dm_count`

3. **App.tsx** — Add `outreachEntries` state (OutreachEntry[]), handlers (add/update status/delete), pass to OutreachTab; add `outreach` tab case in render

4. **Dashboard.tsx** — Add `Send DM 📤` or `Brand Outreach` button in quick actions

5. **BrandsTab.tsx** — Add `onNavigate` prop; add an `→ Outreach` link button in the header area
