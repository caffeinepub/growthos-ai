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
