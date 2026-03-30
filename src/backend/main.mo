import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Int32 "mo:core/Int32";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  public type Platform = {
    #youtube;
    #instagram;
  };

  public type ContentGoal = {
    #growth;
    #leads;
    #sales;
  };

  public type ContentType = {
    #educational;
    #story;
    #sales;
  };

  public type ContentStatus = {
    #planned;
    #posted;
  };

  public type LeadStatus = {
    #hot;
    #warm;
    #cold;
  };

  public type UserProfile = {
    niche : Text;
    targetAudience : Text;
    platform : Platform;
    contentGoal : ContentGoal;
  };

  public type ContentPlanItem = {
    id : Int32;
    day : Int32;
    title : Text;
    description : Text;
    contentType : ContentType;
    status : ContentStatus;
  };

  public type Hook = {
    id : Int32;
    text : Text;
    createdAt : Time.Time;
  };

  public type Script = {
    id : Int32;
    title : Text;
    hook : Text;
    mainContent : Text;
    cta : Text;
    createdAt : Time.Time;
  };

  public type Lead = {
    id : Int32;
    name : Text;
    platform : Text;
    status : LeadStatus;
    createdAt : Time.Time;
  };

  public type CommentRule = {
    id : Int32;
    keyword : Text;
    autoReply : Text;
  };

  public type EngagementEntry = {
    id : Int32;
    contentTitle : Text;
    likes : Int32;
    comments : Int32;
    shares : Int32;
    createdAt : Time.Time;
  };

  module ContentPlanItem {
    public func compare(a : ContentPlanItem, b : ContentPlanItem) : Order.Order {
      Int32.compare(a.id, b.id);
    };
  };

  module Hook {
    public func compare(a : Hook, b : Hook) : Order.Order {
      Int32.compare(a.id, b.id);
    };
  };

  module Script {
    public func compare(a : Script, b : Script) : Order.Order {
      Int32.compare(a.id, b.id);
    };
  };

  module Lead {
    public func compare(a : Lead, b : Lead) : Order.Order {
      Int32.compare(a.id, b.id);
    };
  };

  module CommentRule {
    public func compare(a : CommentRule, b : CommentRule) : Order.Order {
      Int32.compare(a.id, b.id);
    };
  };

  module EngagementEntry {
    public func compare(a : EngagementEntry, b : EngagementEntry) : Order.Order {
      Int32.compare(a.id, b.id);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let contentPlanItems = Map.empty<Int32, ContentPlanItem>();
  let hooks = Map.empty<Int32, Hook>();
  let scripts = Map.empty<Int32, Script>();
  let leads = Map.empty<Int32, Lead>();
  let commentRules = Map.empty<Int32, CommentRule>();
  let engagementEntries = Map.empty<Int32, EngagementEntry>();

  var contentPlanItemId : Int32 = 0;
  var hookId : Int32 = 0;
  var scriptId : Int32 = 0;
  var leadId : Int32 = 0;
  var commentRuleId : Int32 = 0;
  var engagementEntryId : Int32 = 0;

  func generateContentPlanItemId() : Int32 { contentPlanItemId += 1; contentPlanItemId };
  func generateHookId() : Int32 { hookId += 1; hookId };
  func generateScriptId() : Int32 { scriptId += 1; scriptId };
  func generateLeadId() : Int32 { leadId += 1; leadId };
  func generateCommentRuleId() : Int32 { commentRuleId += 1; commentRuleId };
  func generateEngagementEntryId() : Int32 { engagementEntryId += 1; engagementEntryId };

  // --- Existing functions ---

  public shared ({ caller }) func createOrUpdateUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile() : async UserProfile {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User does not exist") };
    };
  };

  public shared ({ caller }) func createContentPlanItem(day : Int32, contentPlanItem : ContentPlanItem) : async Int32 {
    let id = generateContentPlanItemId();
    contentPlanItems.add(id, { contentPlanItem with id; day });
    id;
  };

  public query ({ caller }) func getAllContentPlanItems() : async [ContentPlanItem] {
    contentPlanItems.values().toArray().sort();
  };

  public shared ({ caller }) func updateContentPlanItemStatus(id : Int32, status : ContentStatus) : async () {
    switch (contentPlanItems.get(id)) {
      case (null) { Runtime.trap("Content plan item does not exist") };
      case (?item) { contentPlanItems.add(id, { item with status }) };
    };
  };

  public shared ({ caller }) func generateHook(text : Text) : async Int32 {
    let id = generateHookId();
    hooks.add(id, { id; text; createdAt = Time.now() });
    id;
  };

  public query ({ caller }) func getAllHooks() : async [Hook] {
    hooks.values().toArray().sort();
  };

  public shared ({ caller }) func generateScript(title : Text, hookText : Text, mainContent : Text, cta : Text) : async Int32 {
    let id = generateScriptId();
    scripts.add(id, { id; title; hook = hookText; mainContent; cta; createdAt = Time.now() });
    id;
  };

  public query ({ caller }) func getAllScripts() : async [Script] {
    scripts.values().toArray().sort();
  };

  // --- Lead management ---

  public shared ({ caller }) func addLead(name : Text, platform : Text, status : LeadStatus) : async Int32 {
    let id = generateLeadId();
    leads.add(id, { id; name; platform; status; createdAt = Time.now() });
    id;
  };

  public shared ({ caller }) func updateLeadStatus(id : Int32, status : LeadStatus) : async () {
    switch (leads.get(id)) {
      case (null) { Runtime.trap("Lead does not exist") };
      case (?lead) { leads.add(id, { lead with status }) };
    };
  };

  public shared ({ caller }) func deleteLead(id : Int32) : async () {
    ignore leads.remove(id);
  };

  public query ({ caller }) func getAllLeads() : async [Lead] {
    leads.values().toArray().sort();
  };

  // --- Comment automation ---

  public shared ({ caller }) func addCommentRule(keyword : Text, autoReply : Text) : async Int32 {
    let id = generateCommentRuleId();
    commentRules.add(id, { id; keyword; autoReply });
    id;
  };

  public shared ({ caller }) func deleteCommentRule(id : Int32) : async () {
    ignore commentRules.remove(id);
  };

  public query ({ caller }) func getAllCommentRules() : async [CommentRule] {
    commentRules.values().toArray().sort();
  };

  // --- Engagement tracking ---

  public shared ({ caller }) func addEngagementEntry(contentTitle : Text, likes : Int32, comments : Int32, shares : Int32) : async Int32 {
    let id = generateEngagementEntryId();
    engagementEntries.add(id, { id; contentTitle; likes; comments; shares; createdAt = Time.now() });
    id;
  };

  public query ({ caller }) func getAllEngagementEntries() : async [EngagementEntry] {
    engagementEntries.values().toArray().sort();
  };
};
