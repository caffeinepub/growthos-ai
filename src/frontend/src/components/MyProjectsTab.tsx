import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Download, Eye, FolderOpen, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project, ProjectType } from "../types/growth";
import { downloadAsText } from "../utils/downloadUtils";
import { type UserPlan, canAccess } from "../utils/planGating";

interface Props {
  projects: Project[];
  onDeleteProject: (id: string) => void;
  onNavigate: (tab: string) => void;
  userPlan: UserPlan;
}

type FilterType = "all" | "graphic" | "video";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function MyProjectsTab({
  projects,
  onDeleteProject,
  onNavigate,
  userPlan,
}: Props) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canUse = canAccess(userPlan, "projects");

  const header = (
    <div className="flex items-center gap-3 mb-6">
      <button
        type="button"
        onClick={() => onNavigate("profile")}
        data-ocid="myprojects.back.button"
        className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-surface transition-colors flex-shrink-0"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <div>
        <h1 className="text-xl font-bold gradient-text">My Projects 📁</h1>
        <p className="text-xs text-muted-foreground">
          Store and manage generated content
        </p>
      </div>
    </div>
  );

  if (!canUse) {
    return (
      <div className="animate-fade-in pb-4">
        {header}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-card rounded-2xl border border-border"
          data-ocid="myprojects.upgrade.card"
        >
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-sm font-bold mb-2">Upgrade to Basic</p>
          <p className="text-xs text-muted-foreground mb-5 px-4 leading-relaxed">
            My Projects is available on Basic and Pro plans. Save and manage all
            your generated graphics and videos.
          </p>
          <Button
            type="button"
            onClick={() => onNavigate("pricing")}
            className="h-11 px-6 rounded-full font-bold"
            style={{
              background: "oklch(var(--brand-blue))",
              color: "oklch(0.985 0 0)",
            }}
            data-ocid="myprojects.upgrade.primary_button"
          >
            Upgrade to unlock 🔒
          </Button>
        </motion.div>
      </div>
    );
  }

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.type === (filter as ProjectType));
  const sortedProjects = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const filters: Array<{ id: FilterType; label: string; emoji: string }> = [
    { id: "all", label: "All", emoji: "📁" },
    { id: "graphic", label: "Graphics", emoji: "🎨" },
    { id: "video", label: "Videos", emoji: "🎬" },
  ];

  const handleDelete = (id: string) => {
    onDeleteProject(id);
    setDeletingId(null);
    toast.success("Deleted ✅");
  };

  const handleDownload = (project: Project) => {
    const prefix = project.type === "graphic" ? "graphic" : "video";
    const safe = project.title
      .slice(0, 20)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");
    downloadAsText(project.data, `${prefix}-${safe}.txt`);
    toast.success("Downloaded ✅");
  };

  return (
    <div className="animate-fade-in pb-4" data-ocid="myprojects.section">
      {header}

      {/* Filter Tabs */}
      <div className="flex gap-1.5 mb-5" data-ocid="myprojects.filter.tab">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            data-ocid={`myprojects.${f.id}.tab`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f.id
                ? "bg-brand-blue text-white"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{f.emoji}</span>
            {f.label}
            {f.id !== "all" && (
              <span className="ml-0.5 text-[10px] opacity-70">
                (
                {
                  projects.filter((p) => p.type === (f.id as ProjectType))
                    .length
                }
                )
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {sortedProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-card rounded-2xl border border-border"
          data-ocid="myprojects.empty_state"
        >
          <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-semibold mb-1">
            No projects yet. Start creating content 🚀
          </p>
          <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
            {filter !== "all"
              ? `No ${filter === "graphic" ? "graphics" : "videos"} saved yet.`
              : "Generate graphics or videos to save them here."}
          </p>
          <Button
            type="button"
            onClick={() => onNavigate("content")}
            className="h-10 px-5 rounded-full font-bold text-sm"
            style={{
              background: "oklch(var(--brand-blue))",
              color: "oklch(0.985 0 0)",
            }}
            data-ocid="myprojects.primary_button"
          >
            Go to Content →
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-3" data-ocid="myprojects.list">
          <AnimatePresence>
            {sortedProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04 }}
                data-ocid={`myprojects.item.${i + 1}`}
                className="bg-card rounded-xl p-3.5 border border-border card-glow flex flex-col gap-2"
              >
                {/* Icon + type badge */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      background:
                        project.type === "graphic"
                          ? "oklch(0.68 0.18 300 / 0.15)"
                          : "oklch(0.585 0.195 260 / 0.15)",
                    }}
                  >
                    {project.type === "graphic" ? "🎨" : "🎬"}
                  </div>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize"
                    style={{
                      background:
                        project.type === "graphic"
                          ? "oklch(0.68 0.18 300 / 0.15)"
                          : "oklch(0.585 0.195 260 / 0.15)",
                      color:
                        project.type === "graphic"
                          ? "oklch(0.68 0.18 300)"
                          : "oklch(0.72 0.185 215)",
                    }}
                  >
                    {project.type}
                  </span>
                </div>

                {/* Title + date */}
                <div>
                  <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                    {project.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {formatDate(project.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 mt-auto">
                  <button
                    type="button"
                    onClick={() => setViewingProject(project)}
                    data-ocid={`myprojects.edit_button.${i + 1}`}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-surface border border-border hover:bg-muted transition-colors text-[10px] font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="w-3 h-3" /> View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(project)}
                    data-ocid={`myprojects.secondary_button.${i + 1}`}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-surface border border-border hover:bg-muted transition-colors text-[10px] font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Download className="w-3 h-3" /> Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(project.id)}
                    data-ocid={`myprojects.delete_button.${i + 1}`}
                    className="flex items-center justify-center p-1.5 rounded-lg bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-colors text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* View Dialog */}
      <Dialog
        open={!!viewingProject}
        onOpenChange={(o) => !o && setViewingProject(null)}
      >
        <DialogContent
          className="bg-card border-border mx-4 rounded-2xl max-h-[80vh] overflow-y-auto"
          data-ocid="myprojects.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              {viewingProject?.type === "graphic" ? "🎨" : "🎬"}{" "}
              {viewingProject?.title}
            </DialogTitle>
          </DialogHeader>
          {viewingProject && (
            <div className="space-y-3 pt-1">
              <div className="bg-surface rounded-xl p-3 border border-border">
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {viewingProject.data}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(viewingProject.data);
                    toast.success("Copied ✅");
                  }}
                  className="flex-1 h-10 text-xs border-border hover:bg-surface"
                  data-ocid="myprojects.secondary_button"
                >
                  Copy 📋
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleDownload(viewingProject);
                    setViewingProject(null);
                  }}
                  className="flex-1 h-10 text-xs border-border hover:bg-surface gap-1.5"
                  data-ocid="myprojects.primary_button"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deletingId}
        onOpenChange={(o) => !o && setDeletingId(null)}
      >
        <DialogContent
          className="bg-card border-border mx-4 rounded-2xl"
          data-ocid="myprojects.modal"
        >
          <DialogHeader>
            <DialogTitle className="text-base">Delete Project?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The project will be permanently
            removed.
          </p>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingId(null)}
              className="flex-1 h-10 text-sm border-border"
              data-ocid="myprojects.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => deletingId && handleDelete(deletingId)}
              className="flex-1 h-10 text-sm font-bold border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
              variant="outline"
              data-ocid="myprojects.confirm_button"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
