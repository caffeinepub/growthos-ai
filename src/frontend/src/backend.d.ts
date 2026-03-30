import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Script {
    id: number;
    cta: string;
    title: string;
    hook: string;
    createdAt: Time;
    mainContent: string;
}
export interface Hook {
    id: number;
    createdAt: Time;
    text: string;
}
export interface ContentPlanItem {
    id: number;
    day: number;
    status: ContentStatus;
    title: string;
    contentType: ContentType;
    description: string;
}
export interface UserProfile {
    contentGoal: ContentGoal;
    platform: Platform;
    targetAudience: string;
    niche: string;
}
export interface Lead {
    id: number;
    name: string;
    platform: string;
    status: LeadStatus;
    createdAt: Time;
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
    createdAt: Time;
}
export enum ContentGoal {
    growth = "growth",
    leads = "leads",
    sales = "sales"
}
export enum ContentStatus {
    planned = "planned",
    posted = "posted"
}
export enum ContentType {
    educational = "educational",
    sales = "sales",
    story = "story"
}
export enum Platform {
    instagram = "instagram",
    youtube = "youtube"
}
export enum LeadStatus {
    hot = "hot",
    warm = "warm",
    cold = "cold"
}
export interface backendInterface {
    createContentPlanItem(day: number, contentPlanItem: ContentPlanItem): Promise<number>;
    createOrUpdateUserProfile(profile: UserProfile): Promise<void>;
    generateHook(text: string): Promise<number>;
    generateScript(title: string, hookText: string, mainContent: string, cta: string): Promise<number>;
    getAllContentPlanItems(): Promise<Array<ContentPlanItem>>;
    getAllHooks(): Promise<Array<Hook>>;
    getAllScripts(): Promise<Array<Script>>;
    getUserProfile(): Promise<UserProfile>;
    updateContentPlanItemStatus(id: number, status: ContentStatus): Promise<void>;
    addLead(name: string, platform: string, status: LeadStatus): Promise<number>;
    updateLeadStatus(id: number, status: LeadStatus): Promise<void>;
    deleteLead(id: number): Promise<void>;
    getAllLeads(): Promise<Array<Lead>>;
    addCommentRule(keyword: string, autoReply: string): Promise<number>;
    deleteCommentRule(id: number): Promise<void>;
    getAllCommentRules(): Promise<Array<CommentRule>>;
    addEngagementEntry(contentTitle: string, likes: number, comments: number, shares: number): Promise<number>;
    getAllEngagementEntries(): Promise<Array<EngagementEntry>>;
}
