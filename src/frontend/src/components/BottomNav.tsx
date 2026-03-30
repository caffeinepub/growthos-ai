import {
  BookOpen,
  Briefcase,
  LayoutDashboard,
  UserCircle,
  Users,
} from "lucide-react";

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "content", label: "Content", icon: BookOpen },
  { id: "leads", label: "Leads", icon: Users },
  { id: "applications", label: "Apply", icon: Briefcase },
  { id: "profile", label: "Profile", icon: UserCircle },
];

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
      style={{
        background:
          "linear-gradient(to top, oklch(0.115 0.008 250) 80%, transparent)",
      }}
    >
      <div
        className="flex items-center gap-0 mb-4 mx-3 px-1.5 py-2 rounded-2xl max-w-sm w-full"
        style={{
          background: "oklch(0.175 0.011 250 / 0.95)",
          backdropFilter: "blur(16px)",
          boxShadow:
            "0 0 0 1px oklch(0.27 0.013 250), 0 -4px 20px oklch(0.115 0.008 250 / 0.8)",
        }}
        data-ocid="nav.panel"
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              type="button"
              key={id}
              onClick={() => onTabChange(id)}
              data-ocid={`nav.${id}.link`}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-0.5 rounded-xl transition-all ${
                isActive ? "bg-brand-blue/15" : "hover:bg-muted/30"
              }`}
            >
              <Icon
                className={`transition-colors ${
                  isActive ? "text-brand-blue" : "text-muted-foreground"
                }`}
                style={{ width: "1rem", height: "1rem" }}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[8.5px] font-semibold transition-colors leading-none ${
                  isActive ? "text-brand-blue" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
