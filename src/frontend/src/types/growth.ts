// New types not yet generated in backend.ts
export enum LeadStatus {
  hot = "hot",
  warm = "warm",
  cold = "cold",
}

export interface Lead {
  id: number;
  name: string;
  platform: string;
  status: LeadStatus;
  createdAt: bigint;
}

export interface CommentRule {
  id: number;
  keyword: string;
  autoReply: string;
}

export interface EngagementEntry {
  id: number;
  contentTitle: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: bigint;
}

export type ApplicationStatus = "Applied" | "Replied" | "Accepted" | "Rejected";

export interface Application {
  id: string;
  brandName: string;
  campaignName: string;
  status: ApplicationStatus;
  notes: string;
  dateApplied: string; // ISO date string
}

export type ConnectedAccounts = {
  instagram?: { username: string; connectedAt: string };
  youtube?: { username: string; connectedAt: string };
};

export type ScheduledPostStatus = "Scheduled" | "Posted";
export type ScheduledPostPlatform = "Instagram" | "YouTube";

export interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platform: ScheduledPostPlatform;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  status: ScheduledPostStatus;
  createdAt: string; // ISO string
}

// Brand Outreach types
export type OutreachStatus = "Not contacted" | "Contacted" | "Replied";

export interface NicheProfile {
  username: string;
  niche: string;
  contentType: string;
  audienceType: string;
}

export interface SuggestedBrand {
  id: string;
  name: string;
  handle: string;
  emoji: string;
  category: string;
  whyItMatches: string;
}

export interface OutreachEntry {
  id: string;
  brandId: string;
  brandName: string;
  brandHandle: string;
  brandEmoji: string;
  status: OutreachStatus;
  dateAdded: string; // ISO date string
  dmGenerated: boolean;
}

export interface ChatAssistantResult {
  smartResponse: string;
  negotiationSuggestion: string;
}
