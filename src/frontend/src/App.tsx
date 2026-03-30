import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ContentGoal, Platform } from "./backend";
import AnalyticsTab from "./components/AnalyticsTab";
import ApplicationsTab from "./components/ApplicationsTab";
import AutomationTab from "./components/AutomationTab";
import BottomNav from "./components/BottomNav";
import BrandsTab from "./components/BrandsTab";
import ContentTab from "./components/ContentTab";
import Dashboard from "./components/Dashboard";
import LeadsTab from "./components/LeadsTab";
import Onboarding from "./components/Onboarding";
import PricingTab from "./components/PricingTab";
import ProfileTab from "./components/ProfileTab";
import SettingsTab from "./components/SettingsTab";
import { useGetProfile } from "./hooks/useQueries";
import type { Application, ApplicationStatus } from "./types/growth";

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
  const { data: profile, isLoading } = useGetProfile();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [contentSubTab, setContentSubTab] = useState("plan");
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);

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

  // Pricing and settings are overlay tabs — hide the bottom nav for them
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
              />
            )}
            {activeTab === "content" && (
              <ContentTab
                profile={resolvedProfile}
                initialSubTab={contentSubTab}
              />
            )}
            {activeTab === "leads" && <LeadsTab />}
            {activeTab === "automation" && <AutomationTab />}
            {activeTab === "analytics" && <AnalyticsTab />}
            {activeTab === "brands" && (
              <BrandsTab onAddApplication={handleAddApplication} />
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
            {activeTab === "profile" && (
              <ProfileTab
                profile={resolvedProfile}
                onNavigate={handleNavigate}
              />
            )}
            {activeTab === "settings" && (
              <SettingsTab
                profile={resolvedProfile}
                onNavigate={handleNavigate}
              />
            )}
            {activeTab === "pricing" && (
              <PricingTab onNavigate={handleNavigate} />
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
