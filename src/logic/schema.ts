import { z } from 'zod';

export const AssessmentDataModels = {
  // 1. Scale / Audience
  audienceSize: z.enum([
    'Internal team only (Under 50 people)',
    'Hundreds of customers daily',
    'Thousands of users globally'
  ]),
  
  // 2. Core Task / Complexity
  coreTask: z.enum([
    'Mostly answering questions from our documents (Q&A/RAG)',
    'Following a strict, step-by-step process',
    'Making autonomous decisions and using multiple tools'
  ]),

  // 3. Data Volume (RAG)
  dataVolume: z.enum([
    'Small (A few PDFs or documents)',
    'Medium (Hundreds to Thousands of documents)',
    'Massive (Millions of records or huge databases)'
  ]),

  // 4. Data Type
  dataType: z.enum([
    'Mainly text (PDFs, Word documents)',
    'Structured data (Excel, SQL, CSV)',
    'Complex mixed data (Text, Images, Audio)'
  ]),

  // 5. Update Frequency
  updateFrequency: z.enum([
    'Rarely changes (Static data)',
    'Daily or Weekly updates',
    'Real-time or constant streaming'
  ]),
  
  // 6. Integrations
  integrations: z.enum([
    'None, it works independently',
    'Standard tools (Salesforce, Google Drive, Hubspot)',
    'Our own custom/proprietary internal databases and APIs'
  ]),

  // 7. Privacy & Compliance
  dataSensitivity: z.enum([
    'Public or general information',
    'Internal company data (Confidential)',
    'Highly sensitive (Medical, Financial, Strictly Regulated)'
  ]),

  // 8. Channels
  userInterface: z.enum([
    'A chat widget on our website',
    'WhatsApp or Telegram',
    'Internal portal or custom app integration'
  ]),

  // 9. Maintenance & Budget Priority
  budgetPriority: z.enum([
    'Keep it cheap and easy to maintain, even if less flexible',
    'Balanced: Pay a subscription for a reliable, managed platform',
    'Enterprise: We have engineers and want total control and scale'
  ])
} as const;

export const assessmentSchema = z.object({
  audienceSize: AssessmentDataModels.audienceSize,
  coreTask: AssessmentDataModels.coreTask,
  dataVolume: AssessmentDataModels.dataVolume,
  dataType: AssessmentDataModels.dataType,
  updateFrequency: AssessmentDataModels.updateFrequency,
  integrations: AssessmentDataModels.integrations,
  dataSensitivity: AssessmentDataModels.dataSensitivity,
  userInterface: AssessmentDataModels.userInterface,
  budgetPriority: AssessmentDataModels.budgetPriority,
});

export type AssessmentData = z.infer<typeof assessmentSchema>;

export const defaultAssessmentData: AssessmentData = {
  audienceSize: 'Internal team only (Under 50 people)',
  coreTask: 'Mostly answering questions from our documents (Q&A/RAG)',
  dataVolume: 'Small (A few PDFs or documents)',
  dataType: 'Mainly text (PDFs, Word documents)',
  updateFrequency: 'Rarely changes (Static data)',
  integrations: 'Standard tools (Salesforce, Google Drive, Hubspot)',
  dataSensitivity: 'Internal company data (Confidential)',
  userInterface: 'A chat widget on our website',
  budgetPriority: 'Balanced: Pay a subscription for a reliable, managed platform',
};
