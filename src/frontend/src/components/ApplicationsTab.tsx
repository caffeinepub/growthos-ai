import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, ChevronDown, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Application, ApplicationStatus } from "../types/growth";

type Filter = "All" | ApplicationStatus;

const statusConfig: Record<ApplicationStatus, { className: string }> = {
  Applied: { className: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  Replied: { className: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  Accepted: {
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  },
  Rejected: { className: "bg-red-500/15 text-red-400 border-red-500/20" },
};

const statusOrder: ApplicationStatus[] = [
  "Applied",
  "Replied",
  "Accepted",
  "Rejected",
];

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface Props {
  onNavigate: (tab: string) => void;
  applications: Application[];
  onAddApplication: (app: Application) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDeleteApplication: (id: string) => void;
}

export default function ApplicationsTab({
  onNavigate,
  applications,
  onAddApplication,
  onUpdateStatus,
  onDeleteApplication,
}: Props) {
  const [filter, setFilter] = useState<Filter>("All");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formBrandName, setFormBrandName] = useState("");
  const [formCampaignName, setFormCampaignName] = useState("");
  const [formStatus, setFormStatus] = useState<ApplicationStatus>("Applied");
  const [formNotes, setFormNotes] = useState("");

  const totalCount = applications.length;
  const acceptedCount = applications.filter(
    (a) => a.status === "Accepted",
  ).length;
  const pendingCount = applications.filter(
    (a) => a.status === "Applied" || a.status === "Replied",
  ).length;

  const filteredApps =
    filter === "All"
      ? applications
      : applications.filter((a) => a.status === filter);

  const resetForm = () => {
    setFormBrandName("");
    setFormCampaignName("");
    setFormStatus("Applied");
    setFormNotes("");
  };

  const handleSave = () => {
    if (!formBrandName.trim() || !formCampaignName.trim()) return;
    const newApp: Application = {
      id: crypto.randomUUID(),
      brandName: formBrandName.trim(),
      campaignName: formCampaignName.trim(),
      status: formStatus,
      notes: formNotes.trim(),
      dateApplied: new Date().toISOString(),
    };
    onAddApplication(newApp);
    toast.success("Application Added ✅");
    setShowAddDialog(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    onDeleteApplication(id);
    toast.success("Application removed");
  };

  const handleUpdateStatus = (id: string, status: ApplicationStatus) => {
    onUpdateStatus(id, status);
    toast.success("Status Updated ✅");
  };

  const filters: Filter[] = [
    "All",
    "Applied",
    "Replied",
    "Accepted",
    "Rejected",
  ];

  return (
    <div className="animate-fade-in pb-4" data-ocid="applications.section">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold gradient-text">My Applications</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track your brand deal applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("brands")}
            className="h-8 text-xs border-border hover:bg-surface gap-1"
            data-ocid="applications.secondary_button"
          >
            🤝 Browse
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className="h-8 text-xs font-bold gap-1"
            style={{ background: "oklch(var(--brand-blue))", color: "white" }}
            data-ocid="applications.open_modal_button"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[
          { label: "Total", value: totalCount, color: "text-foreground" },
          {
            label: "Accepted",
            value: acceptedCount,
            color: "text-emerald-400",
          },
          { label: "Pending", value: pendingCount, color: "text-amber-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-xl p-3 card-glow text-center"
          >
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex gap-1.5 flex-wrap mb-4" data-ocid="applications.tab">
        {filters.map((f) => {
          const count =
            f === "All"
              ? totalCount
              : applications.filter((a) => a.status === f).length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              data-ocid={`applications.${f.toLowerCase()}.tab`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === f
                  ? "bg-brand-blue text-white shadow-sm"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {f}
              <span className="ml-1 opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Application Cards */}
      <AnimatePresence mode="popLayout">
        {filteredApps.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
            data-ocid="applications.empty_state"
          >
            <div className="text-5xl mb-4">
              <Briefcase
                className="w-12 h-12 text-muted-foreground/30 mx-auto"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-sm font-semibold mb-2">No applications yet</p>
            <p className="text-xs text-muted-foreground mb-6">
              {filter === "All"
                ? "Start applying to brands 🚀"
                : `No ${filter.toLowerCase()} applications`}
            </p>
            {filter === "All" && (
              <Button
                variant="outline"
                onClick={() => onNavigate("brands")}
                className="h-10 text-sm border-border hover:bg-surface"
                data-ocid="applications.primary_button"
              >
                🤝 Browse Brand Deals
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3" data-ocid="applications.list">
            {filteredApps.map((app, i) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04 }}
                data-ocid={`applications.item.${i + 1}`}
                className="bg-card rounded-xl p-4 card-glow"
              >
                {/* Brand + Status */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground leading-tight">
                      {app.brandName}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {app.campaignName}
                    </p>
                  </div>
                  <Badge
                    className={`text-[10px] border shrink-0 ${
                      statusConfig[app.status].className
                    }`}
                  >
                    {app.status}
                  </Badge>
                </div>

                {/* Notes preview */}
                {app.notes && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                    {app.notes}
                  </p>
                )}

                {/* Date */}
                <p className="text-[10px] text-muted-foreground mb-3">
                  Applied {formatDate(app.dateApplied)}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs gap-1 border-border hover:bg-surface"
                        data-ocid={`applications.edit_button.${i + 1}`}
                      >
                        Update Status
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="bg-card border-border"
                    >
                      {statusOrder.map((s) => (
                        <DropdownMenuItem
                          key={s}
                          onClick={() => handleUpdateStatus(app.id, s)}
                          className={`text-xs cursor-pointer ${
                            app.status === s ? "font-bold" : ""
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 inline-block ${
                              s === "Applied"
                                ? "bg-blue-400"
                                : s === "Replied"
                                  ? "bg-amber-400"
                                  : s === "Accepted"
                                    ? "bg-emerald-400"
                                    : "bg-red-400"
                            }`}
                          />
                          {s}
                          {app.status === s && (
                            <span className="ml-auto text-muted-foreground">
                              ✓
                            </span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(app.id)}
                    className="h-8 w-8 p-0 shrink-0 border-border hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive transition-colors"
                    data-ocid={`applications.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Add Application Dialog */}
      <Dialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent
          className="bg-card border-border mx-4 rounded-2xl"
          data-ocid="applications.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-base">Add Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Brand Name *
              </Label>
              <Input
                placeholder="e.g. boAt, Mamaearth"
                value={formBrandName}
                onChange={(e) => setFormBrandName(e.target.value)}
                className="bg-surface border-border text-sm"
                data-ocid="applications.input"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Campaign Name *
              </Label>
              <Input
                placeholder="e.g. Summer Reel Campaign"
                value={formCampaignName}
                onChange={(e) => setFormCampaignName(e.target.value)}
                className="bg-surface border-border text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Status
              </Label>
              <Select
                value={formStatus}
                onValueChange={(v) => setFormStatus(v as ApplicationStatus)}
              >
                <SelectTrigger
                  className="bg-surface border-border text-sm"
                  data-ocid="applications.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {statusOrder.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Notes (optional)
              </Label>
              <Textarea
                placeholder="Any notes about this application..."
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="bg-surface border-border text-sm resize-none"
                rows={3}
                data-ocid="applications.textarea"
              />
            </div>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!formBrandName.trim() || !formCampaignName.trim()}
              className="w-full h-11 rounded-xl font-bold"
              style={{ background: "oklch(var(--brand-blue))", color: "white" }}
              data-ocid="applications.submit_button"
            >
              Add Application ✅
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
