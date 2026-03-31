# GrowthOS AI — V10 Complete SaaS Upgrade

## Current State

GrowthOS AI is a mobile-first React + Motoko web app for Indian creators/coaches with:
- 5-tab bottom nav: Dashboard, Content, Leads, Apply (Applications), Profile
- Onboarding with niche/goal/platform setup
- ContentTab: 30-day plan, hook generator, script generator, video generator, scheduled posts
- ProfileTab: Connected Accounts (Instagram/YouTube simulated), Settings, Pricing link, Analytics, Automation, Brand Outreach (OutreachTab)
- ApplicationsTab: Brand application tracker
- BrandsTab: Mock brand collaboration deals
- PricingTab: Exists but no feature gating logic
- AI generation: Simulated with template-based outputs
- Backend: Stores profiles, hooks, scripts, content plan, leads, comment rules, engagement entries
- State: connectedAccounts, scheduledPosts, outreachEntries, applications managed in App.tsx

## Requested Changes (Diff)

### Add
- **Pricing plan state** with Free/Basic/Pro tiers stored in app state (localStorage persisted)
- **Feature gate system**: `usePlan()` hook returning current plan + `canAccess(feature)` helper
- **Upgrade prompt component**: "Upgrade to unlock 🔒" badge on locked features
- **Simulate payment success** on the Upgrade Plan page (mock checkout flow)
- **My Projects section** (new tab/section inside Profile): 
  - Saves generated graphics and videos as project cards
  - Categories: Graphics, Videos with filter
  - Each card: Title, Date created, Type
  - Actions: View, Download (mock), Delete
  - Empty state: "No projects yet. Start creating content 🚀"
- **Brand Campaigns section** (accessible from Dashboard or Profile):
  - Mock data: brand name, campaign details, budget
  - Card-based layout
- **Trends section** (accessible from Dashboard or Profile):
  - Trending hooks and content ideas
  - AI-simulated trends based on user niche
- **Back button** on all sub-screens/overlays (Pricing, Settings, Analytics, Automation, Outreach, Brand Campaigns, My Projects, Trends)
- **Goal-based AI adaptation** in onboarding — already asks goal but AI content should visibly adapt (Growth/Leads/Sales labeled outputs)
- **Download buttons** on graphic and video outputs (mock download as text file)

### Modify
- **ProfileTab**: Add "My Projects" and "Brand Campaigns" and "Trends" menu items alongside existing ones
- **PricingTab**: Add simulated payment success flow with plan selection; upgrade state propagates to App.tsx
- **GraphicGeneratorDialog**: Add "Copy Prompt" and "Download Graphic" (mock) buttons; save generated graphic to My Projects
- **VideoGeneratorTab**: Add "Download Video" (mock) button; save generated video to My Projects
- **ContentTab**: Ensure "Post Now" and "Schedule Post" buttons work with feature gating (scheduling = Basic+)
- **Dashboard**: Add quick access cards for Brand Campaigns and Trends
- **BottomNav**: No structural changes needed
- **Onboarding**: Add visible goal selection step that confirms which plan adapts the output
- **All AI generation**: Show goal-adapted labels (e.g. "Growth Hook", "Sales Script") based on user's contentGoal
- **Navigation**: All overlay screens (Settings, Pricing, Analytics, Automation, Outreach, My Projects, Brand Campaigns, Trends) must have a visible back button to return to Profile or previous screen
- **Feedback toasts**: Ensure "Generated ✅", "Saved ✅", "Downloaded ✅", "Scheduled ✅" appear consistently after every action
- **Loading states**: Show "Generating..." spinner/skeleton on all AI generation calls

### Remove
- Nothing removed — this is additive only

## Implementation Plan

1. **Plan state + feature gating**
   - Add `userPlan` state ("free" | "basic" | "pro") in App.tsx, persisted in localStorage
   - Create `src/utils/planGating.ts` with `PLAN_FEATURES` map and `canAccess(plan, feature)` helper
   - Features to gate: video_generator (Basic+), scheduling (Basic+), graphic_download (Basic+), projects (Basic+), brand_campaigns (Pro), trends (Pro), outreach_dm (Pro)
   - Create `<UpgradeBadge feature={...} />` component that renders lock prompt

2. **PricingTab upgrade**
   - Add "Select Plan" buttons per tier
   - On click: show simulated payment modal ("Processing..." → "Success! Plan activated")
   - On success: call `onUpgradePlan(plan)` prop to update App.tsx state

3. **My Projects section**
   - Add `projects` state in App.tsx: `Project[]` type with id, title, type ("graphic"|"video"), data, createdAt
   - Create `MyProjectsTab.tsx` component
   - Wire into ProfileTab as a navigable section
   - GraphicGeneratorDialog calls `onSaveProject` after generation
   - VideoGeneratorTab calls `onSaveProject` after generation

4. **Brand Campaigns section**
   - Create `BrandCampaignsTab.tsx` with mock data (5+ campaigns)
   - Add to ProfileTab menu and Dashboard quick actions

5. **Trends section**
   - Create `TrendsTab.tsx` with simulated trending hooks/ideas based on user niche
   - Add to ProfileTab menu and Dashboard quick actions
   - Pro plan gate: show upgrade prompt for free users

6. **Back navigation**
   - All overlay screens rendered inside Profile or App navigation need a `<BackButton onClick={onBack} />` at the top
   - Ensure ProfileTab tracks sub-navigation state and can render sub-tabs with back button

7. **Goal-adapted AI outputs**
   - Pass `contentGoal` to all generator components
   - Prefix generated content labels with goal name (e.g. "Growth Hook", "Sales Script")
   - Template content varies by goal (growth = reach/views focused, leads = CTA heavy, sales = conversion focused)

8. **Download mock actions**
   - Implement `downloadAsText(content, filename)` utility that creates a blob and triggers browser download
   - Add to graphic prompt outputs and video script outputs

9. **UX consistency pass**
   - Audit all buttons for click handlers
   - Ensure loading states on all generation flows
   - Ensure toast feedback after every action
