import { z } from "zod";

export const assessmentSchema = z.object({
  // Volumetry
  tokensPerDay: z.enum(["<1M", "1M-10M", ">10M"]),
  concurrentUsers: z.enum(["<10", "10-100", ">100"]),
  
  // Complexity
  logicComplexity: z.enum(["Linear/Simple", "Branching", "Multi-Agent/Cyclic"]),
  requiresCustomMCPs: z.boolean(),
  
  // Compliance & Security
  requiresENS: z.enum(["None", "Basic", "High/Zero-Trust"]),
  dataPrivacy: z.enum(["Standard", "PII/GDPR Strict", "Air-Gapped/On-Premise"]),
  
  // Channels
  primaryChannel: z.enum(["Web Widget", "WhatsApp/Telegram", "Internal API", "Multiple"]),
  
  // Operations & Maintenance
  inHouseExpertise: z.enum(["Low/None", "Moderate", "High (AI Engineers)"]),
  budget: z.enum(["<1k/mo", "1k-5k/mo", ">5k/mo (Enterprise)"]),
});

export type AssessmentData = z.infer<typeof assessmentSchema>;

export const defaultAssessment: AssessmentData = {
  tokensPerDay: "1M-10M",
  concurrentUsers: "10-100",
  logicComplexity: "Branching",
  requiresCustomMCPs: false,
  requiresENS: "Basic",
  dataPrivacy: "Standard",
  primaryChannel: "Web Widget",
  inHouseExpertise: "Moderate",
  budget: "1k-5k/mo",
};
