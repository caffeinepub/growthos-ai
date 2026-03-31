import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ContentGoal, Platform } from "./backend";
import AnalyticsTab from "./components/AnalyticsTab";
import ApplicationsTab from "./components/ApplicationsTab";
import AutomationTab from "./components/AutomationTab";
import BottomNav from "./components/BottomNav";
import BrandCampaignsTab from "./components/BrandCampaignsTab";
import BrandsTab from "./components/BrandsTab";
import ContentTab from "./components/ContentTab";
import Dashboard from "./components/Dashboard";
import LeadsTab from "./components/LeadsTab";
import MyProjectsTab from "./components/MyProjectsTab";
import Onboarding from "./components/Onboarding";
import OutreachTab from "./components/OutreachTab";
import PricingTab from "./components/PricingTab";
import ProfileTab from "./components/ProfileTab";
import SettingsTab from "./components/SettingsTab";
import TrendsTab from "./components/TrendsTab";
import { useActor } from "./hooks/useActor";
import { useGetProfile } from "./hooks/useQueries";
import type {
  Application,
  ApplicationStatus,
  ConnectedAccounts,
  OutreachEntry,
  OutreachStatus,
  Project,
  ScheduledPost,
} from "./types/growth";
import type { UserPlan } from "./utils/planGating";

const defaultProfile = {
  niche: "Creator",
  targetAudience: "General audience",
  platform: Platform.instagram,
  contentGoal: ContentGoal.growth,
};

const initialApplications: Application[] = [
  {
    id: "sample-1",
    brandName: "boAt",
    campaignName: "Airdopes 141 Reel Campaign",
    status: "Applied",
    notes:
      "Generated pitch via Brand Collabs. Campaign: 30-second Reel featuring daily routine.",
    dateApplied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sample-2",
    brandName: "Mamaearth",
    campaignName: "Vitamin C Skincare Series",
    status: "Replied",
    notes:
      "Brand replied! They asked for Instagram stats and audience demographics.",
    dateApplied: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function App() {
  const { isFetching: actorFetching } = useActor();
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const isLoading = actorFetching || profileLoading;
  const [activeTab, setActiveTab] = useState("dashboard");
  const [contentSubTab, setContentSubTab] = useState("plan");
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccounts>(
    {},
  );
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [outreachEntries, setOutreachEntries] = useState<OutreachEntry[]>([]);

  // Plan state — persisted to localStorage
  const [userPlan, setUserPlan] = useState<UserPlan>(
    () => (localStorage.getItem("growthosUserPlan") as UserPlan) || "free",
  );

  // Projects state — persisted to localStorage
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("growthosProjects") || "[]");
    } catch {
      return [];
    }
  });

  // Persist plan to localStorage
  useEffect(() => {
    localStorage.setItem("growthosUserPlan", userPlan);
  }, [userPlan]);

  // Persist projects to localStorage
  useEffect(() => {
    localStorage.setItem("growthosProjects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (onboardingComplete) {
      setActiveTab("dashboard");
    }
  }, [onboardingComplete]);

  const handleNavigate = (tab: string, subTab?: string) => {
    setActiveTab(tab);
    if (subTab) setContentSubTab(subTab);
  };

  const handleAddApplication = (app: Application) => {
    setApplications((prev) => [...prev, app]);
  };

  const handleUpdateStatus = (id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
  };

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateConnectedAccounts = (
    update: Partial<ConnectedAccounts>,
  ) => {
    setConnectedAccounts((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(update) as Array<keyof ConnectedAccounts>) {
        if (update[key] === undefined) {
          delete next[key];
        } else {
          next[key] = update[key];
        }
      }
      return next;
    });
  };

  const handleAddScheduledPost = (post: ScheduledPost) => {
    setScheduledPosts((prev) => [...prev, post]);
  };

  const handleDeleteScheduledPost = (id: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleMarkScheduledPosted = (id: string) => {
    setScheduledPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Posted" as const } : p)),
    );
  };

  const handleEditScheduledPost = (post: ScheduledPost) => {
    setScheduledPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
  };

  const handleAddOutreachEntry = (entry: OutreachEntry) => {
    setOutreachEntries((prev) => [...prev, entry]);
  };

  const handleUpdateOutreachEntryStatus = (
    id: string,
    status: OutreachStatus,
  ) => {
    setOutreachEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e)),
    );
  };

  const handleDeleteOutreachEntry = (id: string) => {
    setOutreachEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpgradePlan = (plan: UserPlan) => {
    setUserPlan(plan);
  };

  const pendingApplicationsCount = applications.filter(
    (a) => a.status === "Applied" || a.status === "Replied",
  ).length;

  const showOnboarding = !isLoading && !profile && !onboardingComplete;

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-5"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.12 0.01 260), oklch(0.115 0.008 250) 60%)",
        }}
        data-ocid="app.loading_state"
      >
        <img
          src="/assets/generated/growthos-logo-transparent.dim_120x120.png"
          alt="GrowthOS"
          className="w-14 h-14 mb-4 animate-pulse"
        />
        <p className="gradient-text font-bold text-lg mb-6">GrowthOS AI</p>
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="h-24 rounded-xl" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <>
        <Onboarding onComplete={() => setOnboardingComplete(true)} />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "oklch(0.175 0.011 250)",
              border: "1px solid oklch(0.27 0.013 250)",
              color: "oklch(0.963 0.005 250)",
            },
          }}
        />
      </>
    );
  }

  const resolvedProfile = profile ?? defaultProfile;

  // Overlay tabs have no bottom nav
  const isOverlayTab = activeTab === "pricing" || activeTab === "settings";

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.12 0.01 260) 0%, oklch(0.115 0.008 250) 50%)",
      }}
    >
      <div
        className={`max-w-[430px] mx-auto px-4 pt-6 ${
          isOverlayTab ? "pb-8" : "pb-28"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && (
              <Dashboard
                profile={resolvedProfile}
                onNavigate={handleNavigate}
                pendingApplicationsCount={pendingApplicationsCount}
                userPlan={userPlan}
              />
            )}
            {activeTab === "content" && (
              <ContentTab
                profile={resolvedProfile}
                initialSubTab={contentSubTab}
                connectedAccounts={connectedAccounts}
                scheduledPosts={scheduledPosts}
                onAddScheduledPost={handleAddScheduledPost}
                onDeleteScheduledPost={handleDeleteScheduledPost}
                onMarkScheduledPosted={handleMarkScheduledPosted}
                onEditScheduledPost={handleEditScheduledPost}
                userPlan={userPlan}
                onAddProject={handleAddProject}
              />
            )}
            {activeTab === "leads" && <LeadsTab />}
            {activeTab === "automation" && <AutomationTab />}
            {activeTab === "analytics" && <AnalyticsTab />}
            {activeTab === "brands" && (
              <BrandsTab
                onAddApplication={handleAddApplication}
                onNavigate={handleNavigate}
              />
            )}
            {activeTab === "applications" && (
              <ApplicationsTab
                onNavigate={handleNavigate}
                applications={applications}
                onAddApplication={handleAddApplication}
                onUpdateStatus={handleUpdateStatus}
                onDeleteApplication={handleDeleteApplication}
              />
            )}
            {activeTab === "outreach" && (
              <OutreachTab
                outreachEntries={outreachEntries}
                onAddEntry={handleAddOutreachEntry}
                onUpdateEntryStatus={handleUpdateOutreachEntryStatus}
                onDeleteEntry={handleDeleteOutreachEntry}
                onNavigate={handleNavigate}
              />
            )}
            {activeTab === "profile" && (
              <ProfileTab
                profile={resolvedProfile}
                onNavigate={handleNavigate}
                connectedAccounts={connectedAccounts}
                onUpdateConnectedAccounts={handleUpdateConnectedAccounts}
                userPlan={userPlan}
              />
            )}
            {activeTab === "settings" && (
              <SettingsTab
                profile={resolvedProfile}
                onNavigate={handleNavigate}
              />
            )}
            {activeTab === "pricing" && (
              <PricingTab
                onNavigate={handleNavigate}
                currentPlan={userPlan}
                onUpgradePlan={handleUpgradePlan}
              />
            )}
            {activeTab === "myprojects" && (
              <MyProjectsTab
                projects={projects}
                onDeleteProject={handleDeleteProject}
                onNavigate={handleNavigate}
                userPlan={userPlan}
              />
            )}
            {activeTab === "brandcampaigns" && (
              <BrandCampaignsTab
                onNavigate={handleNavigate}
                onAddApplication={handleAddApplication}
                userPlan={userPlan}
              />
            )}
            {activeTab === "trends" && (
              <TrendsTab
                profile={resolvedProfile}
                onNavigate={handleNavigate}
                userPlan={userPlan}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {!isOverlayTab && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.175 0.011 250)",
            border: "1px solid oklch(0.27 0.013 250)",
            color: "oklch(0.963 0.005 250)",
          },
        }}
      />
    </div>
  );
}
