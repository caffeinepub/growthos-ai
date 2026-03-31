import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import {
  type PlanFeature,
  type UserPlan,
  canAccess,
} from "../utils/planGating";

export function usePlanGate(plan: UserPlan, feature: PlanFeature): boolean {
  return canAccess(plan, feature);
}

interface Props {
  plan: UserPlan;
  feature: PlanFeature;
  children?: ReactNode;
}

export default function UpgradeBadge({ plan, feature, children }: Props) {
  if (canAccess(plan, feature)) {
    return children ? <>{children}</> : null;
  }

  if (children) {
    return (
      <div className="relative">
        <div className="opacity-40 pointer-events-none select-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-xl">
          <span
            className="text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-full border"
            style={{
              background: "oklch(0.68 0.22 80 / 0.18)",
              borderColor: "oklch(0.68 0.22 80 / 0.45)",
              color: "oklch(0.82 0.18 80)",
            }}
          >
            <Lock className="w-3 h-3" /> Upgrade to unlock 🔒
          </span>
        </div>
      </div>
    );
  }

  return (
    <span
      className="text-xs font-bold flex items-center gap-1 px-2 py-0.5 rounded-full border"
      style={{
        background: "oklch(0.68 0.22 80 / 0.12)",
        borderColor: "oklch(0.68 0.22 80 / 0.35)",
        color: "oklch(0.82 0.18 80)",
      }}
    >
      <Lock className="w-3 h-3" /> Upgrade 🔒
    </span>
  );
}
