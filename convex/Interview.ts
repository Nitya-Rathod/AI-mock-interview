import { useMutation } from "convex/react";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const SaveInterviewQuestions = mutation({
  args: {
    questions: v.any(),
    userId: v.id("UserTabel"),
    resumeUrl: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("InterviewSessionTable", {
      interviewQuestions: args.questions,
      userId: args.userId,
      resumeUrl: args.resumeUrl ?? null,
      status: "draft",
      jobTitle: args.jobTitle ?? "",
      jobDescription: args.jobDescription ?? "",
    });
    return result;
  },
});

export const GetInterviewQuestions = query({
  args: {
    interviewRecordId: v.id("InterviewSessionTable"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("InterviewSessionTable")
      .filter((q) => q.eq(q.field("_id"), args.interviewRecordId))
      .collect();
    return result;
  },
});

export const UpdateFedback = mutation({
  args: {
    recordId: v.id("InterviewSessionTable"),
    feedback: v.any(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.recordId, {
      feedback: args.feedback,
      status: "complete",
    });
    return result;
  },
});

export const GetInterviewList = query({
  args: {
    userId: v.id("UserTabel"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("InterviewSessionTable")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
    return result;
  },
});
