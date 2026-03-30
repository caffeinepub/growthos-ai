# GrowthOS AI — Version 5: Interactivity Overhaul + My Applications Tracker

## Current State

- 6-item bottom nav: Home, Content, Leads, Auto, Stats, Brands
- All tabs exist as separate React components with backend-connected state
- BrandsTab has deal discovery, pitch generator, and chat simulation
- ContentTab has 30-day plan, hooks, scripts, trends sub-tabs
- Several buttons exist but may lack feedback/toast confirmations
- No Applications tracker feature
- Profile/Settings accessible only via upgrade banner on Dashboard

## Requested Changes (Diff)

### Add
- **ApplicationsTab**: New full-featured tab with:
  - Summary stats row (Total, Accepted, Pending count)
  - Filter bar by status: All / Applied / Replied / Accepted / Rejected
  - Application cards: Brand Name, Campaign Title, Status badge, Date applied, Update Status dropdown, Delete button
  - "+ Add Application" floating/sticky button → opens modal form (Brand name, Campaign name, Status dropdown, Notes)
  - Empty state: "No applications yet. Start applying to brands 🚀"
  - Toast feedback: "Application Added ✅", "Status Updated ✅", "Deleted"
  - "Browse Brand Deals" button that navigates to Brands tab
  - All state managed with local useState (no backend)
- **Profile tab**: New simple tab showing Creator Profile info (niche, platform, audience) with quick-access cards to Analytics and Automation

### Modify
- **BottomNav**: Change from 6 tabs to 5 — Dashboard, Content, Leads, Applications, Profile
  - Remove: Auto, Stats from nav (accessible from Profile tab)
  - Add: Applications (new), Profile
  - Keep Brands as navigable tab but accessed from inside Applications tab
- **App.tsx**: Add `applications` and `profile` to tab routing; wire BrandsTab navigable from Applications
- **ContentTab**: Ensure all buttons have toast feedback — Copy shows "Copied ✅", Regenerate shows loading state then "Content Generated ✅", Save works, Use this content marks selected, Mark as Posted updates status. Content cards expand on click showing full script + CTA + action buttons. 30-day plan days clickable, show Hook + Script + action buttons in modal/sheet.
- **Dashboard**: Ensure all quick-action buttons navigate properly with clear next-step CTAs
- **BrandsTab**: Add "Save to My Applications" button on each deal/after applying pitch, which adds it to Applications state

### Remove
- Auto and Stats removed from the bottom navigation bar (but components remain, accessible from Profile)

## Implementation Plan

1. Create `src/frontend/src/components/ApplicationsTab.tsx` — full CRUD with local state
2. Create `src/frontend/src/components/ProfileTab.tsx` — creator profile + quick links to Analytics/Automation
3. Update `src/frontend/src/components/BottomNav.tsx` — 5-item nav (Dashboard, Content, Leads, Applications, Profile)
4. Update `src/frontend/src/App.tsx` — add `applications` and `profile` tab routing, thread `onNavigate` prop to BrandsTab
5. Update `src/frontend/src/components/ContentTab.tsx` — ensure all interactive buttons work with toast feedback, content cards expandable on click, 30-day plan days open detail sheet
6. Update `src/frontend/src/components/BrandsTab.tsx` — add "Track Application" button that stores applied deal to a shared/lifted state
7. Add a shared `ApplicationsContext` or pass applications state via props/lift to App.tsx so BrandsTab can add to it and ApplicationsTab can show them
