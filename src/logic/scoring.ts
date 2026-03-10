import { type AssessmentData } from './schema';

export type ApproachOptions = 'OS_Stack' | 'Managed_Cloud' | 'Low_Code';

export interface ScoreResult {
  approach: ApproachOptions;
  score: number;
  label: string;
  description: string;
}

export function calculateApproachScores(data: AssessmentData): Record<ApproachOptions, ScoreResult> {
  // Base scores
  let scores = {
    OS_Stack: 100,
    Managed_Cloud: 100,
    Low_Code: 100,
  };

  // 1. Audience
  if (data.audienceSize === 'Internal team only (Under 50 people)') {
    scores.Managed_Cloud += 20;
    scores.Low_Code += 20;
    scores.OS_Stack -= 10;
  } else if (data.audienceSize === 'Thousands of users globally') {
    scores.OS_Stack += 30;
    scores.Low_Code -= 40;
  }

  // 2. Core Task
  if (data.coreTask === 'Mostly answering questions from our documents (Q&A/RAG)') {
    scores.Low_Code += 30;
  } else if (data.coreTask === 'Following a strict, step-by-step process') {
    scores.Low_Code += 20;
    scores.Managed_Cloud += 20;
  } else if (data.coreTask === 'Making autonomous decisions and using multiple tools') {
    scores.OS_Stack *= 1.5;
    scores.Managed_Cloud *= 1.3;
    scores.Low_Code *= 0.6; 
  }

  // 3. Integrations
  if (data.integrations === 'Our own custom/proprietary internal databases and APIs') {
    scores.OS_Stack += 30;
    scores.Managed_Cloud += 20;
    scores.Low_Code -= 20; 
  } else if (data.integrations === 'Standard tools (Salesforce, Google Drive, Hubspot)') {
    scores.Low_Code += 30;
  }

  // 4. Data Sensitivity
  if (data.dataSensitivity === 'Highly sensitive (Medical, Financial, Strictly Regulated)') {
    scores.OS_Stack += 50; 
    scores.Managed_Cloud -= 20; 
    scores.Low_Code -= 80; 
  } else if (data.dataSensitivity === 'Internal company data (Confidential)') {
    scores.Managed_Cloud += 30;
  }

  // 5. User Interface (Channels)
  if (data.userInterface === 'WhatsApp or Telegram') {
    scores.Low_Code += 30; 
  } else if (data.userInterface === 'Internal portal or custom app integration') {
    scores.OS_Stack += 20;
    scores.Managed_Cloud += 20;
  }

  // 6. Maintenance & Budget
  if (data.budgetPriority === 'Keep it cheap and easy to maintain, even if less flexible') {
    scores.OS_Stack -= 50; 
    scores.Managed_Cloud += 10;
    scores.Low_Code += 50;
  } else if (data.budgetPriority === 'Balanced: Pay a subscription for a reliable, managed platform') {
    scores.Managed_Cloud += 40;
    scores.OS_Stack -= 20;
  } else if (data.budgetPriority === 'Enterprise: We have engineers and want total control and scale') {
    scores.OS_Stack += 40;
    scores.Managed_Cloud += 20;
  }

  // Normalize scores (0-100% relative match)
  const total = Object.values(scores).reduce((a, b) => a + Math.max(0, b), 0);
  
  const normalize = (val: number) => total > 0 ? Math.round((Math.max(0, val) / total) * 100) : 0;

  return {
    OS_Stack: {
      approach: 'OS_Stack',
      score: normalize(scores.OS_Stack),
      label: 'Sovereign OS Stack (vLLM + LangGraph)',
      description: 'Maximum control, data privacy, and cost-efficiency at high scale. Requires high engineering maturity.'
    },
    Managed_Cloud: {
      approach: 'Managed_Cloud',
      score: normalize(scores.Managed_Cloud),
      label: 'Managed Enterprise Cloud (Azure AI Foundry)',
      description: 'Balanced approach with strong enterprise SLAs, security, and lower maintenance overhead.'
    },
    Low_Code: {
      approach: 'Low_Code',
      score: normalize(scores.Low_Code),
      label: 'Low-Code Workflow Engine (n8n)',
      description: 'Fastest time-to-market for linear workflows and simple integrations. Highly accessible.'
    }
  };
}
