import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  useAddLead,
  useDeleteLead,
  useLeads,
  useUpdateLeadStatus,
} from "../hooks/useQueries";
import { LeadStatus } from "../types/growth";

const statusConfig: Record<
  LeadStatus,
  { label: string; className: string; next: LeadStatus }
> = {
  [LeadStatus.hot]: {
    label: "🔥 Hot",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
    next: LeadStatus.warm,
  },
  [LeadStatus.warm]: {
    label: "☀️ Warm",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    next: LeadStatus.cold,
  },
  [LeadStatus.cold]: {
    label: "❄️ Cold",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    next: LeadStatus.hot,
  },
};

export default function LeadsTab() {
  const { data: leads, isLoading } = useLeads();
  const addLead = useAddLead();
  const updateLeadStatus = useUpdateLeadStatus();
  const deleteLead = useDeleteLead();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState<LeadStatus>(LeadStatus.warm);

  const handleAdd = () => {
    if (!name.trim() || !platform.trim()) return;
    addLead.mutate(
      { name: name.trim(), platform: platform.trim(), status },
      {
        onSuccess: () => {
          setName("");
          setPlatform("");
          setStatus(LeadStatus.warm);
          setShowForm(false);
        },
      },
    );
  };

  const handleStatusCycle = (id: number, current: LeadStatus) => {
    updateLeadStatus.mutate({ id, status: statusConfig[current].next });
  };

  const sortedLeads = [...(leads ?? [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <div className="pb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-blue" />
          <h1 className="text-2xl font-bold gradient-text">Leads</h1>
          {leads && leads.length > 0 && (
            <Badge className="bg-brand-blue/15 text-brand-blue border-brand-blue/30 text-xs">
              {leads.length}
            </Badge>
          )}
        </div>
        <button
          type="button"
          data-ocid="leads.open_modal_button"
          onClick={() => setShowForm(!showForm)}
          className="w-9 h-9 rounded-xl bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-brand-blue hover:bg-brand-blue/25 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div
              className="bg-card rounded-xl p-4 card-glow space-y-3"
              data-ocid="leads.dialog"
            >
              <h3 className="text-sm font-semibold text-foreground">
                Add New Lead
              </h3>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Name</Label>
                <Input
                  data-ocid="leads.input"
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-surface border-border text-sm h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Platform
                </Label>
                <Input
                  data-ocid="leads.input"
                  placeholder="e.g. Instagram, WhatsApp"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="bg-surface border-border text-sm h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as LeadStatus)}
                >
                  <SelectTrigger
                    data-ocid="leads.select"
                    className="bg-surface border-border text-sm h-9"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={LeadStatus.hot}>🔥 Hot</SelectItem>
                    <SelectItem value={LeadStatus.warm}>☀️ Warm</SelectItem>
                    <SelectItem value={LeadStatus.cold}>❄️ Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  data-ocid="leads.cancel_button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border-border bg-transparent h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  data-ocid="leads.submit_button"
                  size="sm"
                  onClick={handleAdd}
                  disabled={
                    !name.trim() || !platform.trim() || addLead.isPending
                  }
                  className="flex-1 gradient-bg text-white h-9 font-semibold"
                >
                  {addLead.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Add Lead"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leads List */}
      {isLoading ? (
        <div className="space-y-2" data-ocid="leads.loading_state">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-4 h-16 animate-pulse"
            />
          ))}
        </div>
      ) : sortedLeads.length === 0 ? (
        <div
          className="bg-card rounded-xl p-8 card-glow text-center"
          data-ocid="leads.empty_state"
        >
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm text-muted-foreground">No leads yet.</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            Tap + to add your first lead!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedLeads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              data-ocid={`leads.item.${i + 1}`}
              className="bg-card rounded-xl p-3.5 card-glow flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.585 0.195 260 / 0.3), oklch(0.72 0.185 215 / 0.2))",
                }}
              >
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{lead.name}</p>
                <span className="text-[10px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-md">
                  {lead.platform}
                </span>
              </div>
              <button
                type="button"
                data-ocid={`leads.toggle.${i + 1}`}
                onClick={() =>
                  handleStatusCycle(lead.id, lead.status as LeadStatus)
                }
                className="flex-shrink-0"
              >
                <Badge
                  className={`text-[10px] border cursor-pointer hover:opacity-80 transition-opacity ${
                    statusConfig[lead.status as LeadStatus]?.className ??
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {statusConfig[lead.status as LeadStatus]?.label ??
                    lead.status}
                </Badge>
              </button>
              <button
                type="button"
                data-ocid={`leads.delete_button.${i + 1}`}
                onClick={() => deleteLead.mutate(lead.id)}
                className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
