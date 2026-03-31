import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Instagram, Loader2, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ScheduledPost, ScheduledPostPlatform } from "../types/growth";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onSchedule: (post: ScheduledPost) => void;
  existing?: ScheduledPost | null; // for edit mode
}

export default function SchedulePostModal({
  open,
  onClose,
  title,
  content,
  onSchedule,
  existing,
}: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [platform, setPlatform] = useState<ScheduledPostPlatform>("Instagram");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (existing) {
        setDate(existing.scheduledDate);
        setTime(existing.scheduledTime);
        setPlatform(existing.platform);
      } else {
        // Default to tomorrow 9am
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow.toISOString().split("T")[0]);
        setTime("09:00");
        setPlatform("Instagram");
      }
      setIsSaving(false);
    }
  }, [open, existing]);

  const handleSave = () => {
    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      onSchedule({
        id: existing?.id ?? `sched-${Date.now()}`,
        title,
        content,
        platform,
        scheduledDate: date,
        scheduledTime: time,
        status: "Scheduled",
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      });
      toast.success("Scheduled Successfully ✅");
      setIsSaving(false);
      onClose();
    }, 700);
  };

  const platformOptions: Array<{
    key: ScheduledPostPlatform;
    Icon: typeof Instagram;
    color: string;
  }> = [
    { key: "Instagram", Icon: Instagram, color: "oklch(0.68 0.18 300)" },
    { key: "YouTube", Icon: Youtube, color: "oklch(0.638 0.22 25)" },
  ];

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="bg-card border-border mx-4 rounded-2xl"
        data-ocid="schedule.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            📅 Schedule Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content preview */}
          <div className="bg-surface rounded-xl p-3 border border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Post
            </p>
            <p className="text-xs font-semibold text-foreground line-clamp-1">
              {title}
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Platform
            </p>
            <div className="grid grid-cols-2 gap-2">
              {platformOptions.map(({ key, Icon, color }) => {
                const isSelected = platform === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPlatform(key)}
                    data-ocid={`schedule.${key.toLowerCase()}.toggle`}
                    className="flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-left"
                    style={
                      isSelected
                        ? { borderColor: color, background: `${color}18` }
                        : { borderColor: "oklch(var(--border))" }
                    }
                  >
                    <Icon
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: isSelected ? color : undefined }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: isSelected ? color : undefined }}
                    >
                      {key}
                    </span>
                    {isSelected && (
                      <span
                        className="ml-auto text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full"
                        style={{ background: color }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={today}
                  className="bg-surface border-border pl-8 text-xs h-10"
                  data-ocid="schedule.date_input"
                />
              </div>
            </div>
            <div>
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-surface border-border pl-8 text-xs h-10"
                  data-ocid="schedule.time_input"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            type="button"
            onClick={handleSave}
            disabled={!date || !time || isSaving}
            className="w-full h-11 rounded-full font-bold"
            style={{
              background: "oklch(var(--brand-blue))",
              color: "oklch(0.985 0 0)",
            }}
            data-ocid="schedule.submit_button"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : existing ? (
              "Update Schedule 📅"
            ) : (
              "Schedule Post 📅"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
