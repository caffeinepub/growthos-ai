import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ContentStatus, type UserProfile } from "../backend";
import type { LeadStatus } from "../types/growth";
import type { CommentRule, EngagementEntry, Lead } from "../types/growth";
import {
  generateScript as genScript,
  generateContentPlan,
  generateHinglishHooks,
} from "../utils/contentGenerator";
import { useActor } from "./useActor";

type UpdateStatusVars = { id: number; status: ContentStatus };

export function useGetProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const profile = await actor.getUserProfile();
        if (!profile || !profile.niche || profile.niche === "") return null;
        return profile;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.createOrUpdateUserProfile(profile);
      return profile;
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile"], profile);
      queryClient.invalidateQueries({ queryKey: ["contentPlan"] });
    },
    onError: () => toast.error("Failed to save profile"),
  });
}

export function useContentPlan() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contentPlan"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContentPlanItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateContentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<UpdateStatusVars, Error, UpdateStatusVars>({
    mutationFn: async ({ id, status }: UpdateStatusVars) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateContentPlanItemStatus(id, status);
      return { id, status };
    },
    onMutate: async ({ id, status }: UpdateStatusVars) => {
      await queryClient.cancelQueries({ queryKey: ["contentPlan"] });
      const prev = queryClient.getQueryData(["contentPlan"]);
      queryClient.setQueryData(["contentPlan"], (old: any[]) =>
        old?.map((item) => (item.id === id ? { ...item, status } : item)),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx: any) => {
      queryClient.setQueryData(["contentPlan"], ctx?.prev);
      toast.error("Failed to update status");
    },
  });
}

export function useHooks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["hooks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHooks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateHooks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (niche: string) => {
      if (!actor) throw new Error("Not connected");
      const hooks = generateHinglishHooks(niche);
      await Promise.all(hooks.map((text) => actor.generateHook(text)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hooks"] });
      toast.success("10 viral hooks generated! 🔥");
    },
    onError: () => toast.error("Failed to generate hooks"),
  });
}

export function useScripts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["scripts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllScripts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateScript() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ topic, niche }: { topic: string; niche: string }) => {
      if (!actor) throw new Error("Not connected");
      const script = genScript(topic, niche);
      const id = await actor.generateScript(
        topic,
        script.hook,
        script.mainContent,
        script.cta,
      );
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
      toast.success("Script generated! ✍️");
    },
    onError: () => toast.error("Failed to generate script"),
  });
}

export function useStats() {
  const { data: plan } = useContentPlan();
  const { data: hooks } = useHooks();
  const { data: scripts } = useScripts();
  const { data: leads } = useLeads();
  return {
    daysPlanned: plan?.length ?? 0,
    hooksGenerated: hooks?.length ?? 0,
    scriptsCreated: scripts?.length ?? 0,
    totalLeads: leads?.length ?? 0,
    contentPosted:
      plan?.filter((i) => i.status === ContentStatus.posted).length ?? 0,
  };
}

export function useSaveProfileAndGenerate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.createOrUpdateUserProfile(profile);
      const plan = generateContentPlan(profile);
      await Promise.all(
        plan.map((item) =>
          actor.createContentPlanItem(item.day, {
            id: 0,
            day: item.day,
            title: item.title,
            contentType: item.contentType,
            description: item.description,
            status: ContentStatus.planned,
          }),
        ),
      );
      return profile;
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile"], profile);
      queryClient.invalidateQueries({ queryKey: ["contentPlan"] });
      toast.success("Your GrowthOS strategy is ready! 🚀");
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });
}

// ─── Leads ───────────────────────────────────────────────────────────────────

export function useLeads() {
  const { actor, isFetching } = useActor();
  return useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllLeads() as Promise<Lead[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      platform,
      status,
    }: {
      name: string;
      platform: string;
      status: LeadStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).addLead(name, platform, status) as Promise<number>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead added! 🎯");
    },
    onError: () => toast.error("Failed to add lead"),
  });
}

export function useUpdateLeadStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: LeadStatus }) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).updateLeadStatus(id, status);
      return { id, status };
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["leads"] });
      const prev = queryClient.getQueryData(["leads"]);
      queryClient.setQueryData(["leads"], (old: any[]) =>
        old?.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx: any) => {
      queryClient.setQueryData(["leads"], ctx?.prev);
      toast.error("Failed to update lead status");
    },
  });
}

export function useDeleteLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).deleteLead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead removed");
    },
    onError: () => toast.error("Failed to delete lead"),
  });
}

// ─── Comment Rules ────────────────────────────────────────────────────────────

export function useCommentRules() {
  const { actor, isFetching } = useActor();
  return useQuery<CommentRule[]>({
    queryKey: ["commentRules"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllCommentRules() as Promise<CommentRule[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCommentRule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      keyword,
      autoReply,
    }: {
      keyword: string;
      autoReply: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).addCommentRule(
        keyword,
        autoReply,
      ) as Promise<number>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commentRules"] });
      toast.success("Rule saved! 🤖");
    },
    onError: () => toast.error("Failed to save rule"),
  });
}

export function useDeleteCommentRule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).deleteCommentRule(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commentRules"] });
      toast.success("Rule deleted");
    },
    onError: () => toast.error("Failed to delete rule"),
  });
}

// ─── Engagement Entries ───────────────────────────────────────────────────────

export function useEngagementEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<EngagementEntry[]>({
    queryKey: ["engagementEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllEngagementEntries() as Promise<
        EngagementEntry[]
      >;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEngagementEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      contentTitle,
      likes,
      comments,
      shares,
    }: {
      contentTitle: string;
      likes: number;
      comments: number;
      shares: number;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).addEngagementEntry(
        contentTitle,
        likes,
        comments,
        shares,
      ) as Promise<number>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["engagementEntries"] });
      toast.success("Engagement logged! 📊");
    },
    onError: () => toast.error("Failed to log engagement"),
  });
}
