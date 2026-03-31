# GrowthOS AI

## Current State
GrowthOS AI is a mobile-first AI content assistant for Indian creators. Current features:
- Bottom nav: Dashboard, Content, Leads, Applications, Profile
- ContentTab: Plan, Hooks, Scripts, Trends sub-tabs
- ProfileTab: Creator card, Quick Access links (Analytics, Automation, Brand Collabs)
- BrandsTab: Brand deals, pitch generator, chat simulation
- ApplicationsTab: Track brand deal applications with full CRUD
- Scripts cards show virality score, expandable detail, copy button

## Requested Changes (Diff)

### Add
- **Connected Accounts section** in ProfileTab: Instagram + YouTube connect buttons (simulated). After connection, show account name + "Connected ✅" status. Store state locally in component.
- **Post to Social Media modal**: Accessible from script card expanded view. Select platform (Instagram/YouTube), show caption + content preview, "Post Now" → "Posted Successfully ✅" toast. Only enabled for connected platforms.
- **Create Graphic dialog**: Button inside each script card expanded view. Select style (Post / Story / Thumbnail), simulate generation with loading state, show color/gradient preview panel, Download + Regenerate buttons.
- **Faceless Video Generator** as a new "Video" sub-tab in ContentTab (5th sub-tab after Trends):
  - Option 1: From Script — select an existing script, generate scene breakdown + text overlays + visual suggestions
  - Option 2: From Prompt — input field "Describe your video idea", on generate: create hook + script + scene breakdown
  - Output: structured video plan with scenes, copy script button, download demo button
  - Loading states: "Creating video..."

### Modify
- **ContentTab** sub-tabs: Add "Video" tab (5th)
- **ScriptsSubTab**: In expanded script card, add two new action buttons: "Create Graphic 🎨" and "Create Video 🎬" and "Post to Social 📤"
- **ProfileTab**: Add "Connected Accounts" section between Creator Profile card and Quick Access

### Remove
- Nothing removed

## Implementation Plan
1. Add `ConnectedAccounts` sub-component to `ProfileTab.tsx` using local state for connection status. Show Instagram/YouTube connect buttons; simulate OAuth with a prompt for username; store in `useState`.
2. Create `GraphicGeneratorDialog.tsx`: Dialog with style selector (Post/Story/Thumbnail), simulated loading, gradient preview canvas, Download + Regenerate.
3. Create `PostToSocialModal.tsx`: Dialog for platform selection (only connected ones), caption textarea, content preview, "Post Now" triggers loading then success toast.
4. Create `VideoGeneratorTab.tsx`: Two-panel flow — Option 1 picks from existing scripts list, Option 2 has text input. Both produce a structured scene breakdown with ~4 scenes. Shows copy/download demo buttons.
5. Update `ContentTab.tsx`: Add "Video" sub-tab, import VideoGeneratorTab. In ScriptsSubTab expanded view, add graphic/video/post buttons.
6. Update `ProfileTab.tsx`: Import and render ConnectedAccounts section. Pass connected state up if needed for PostToSocial.
7. Connected accounts state needs to be accessible in ContentTab — lift state to `App.tsx` and pass down as props, or use a simple localStorage hook.
