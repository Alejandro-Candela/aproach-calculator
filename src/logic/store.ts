import { atom } from 'nanostores';
import { type AssessmentData, defaultAssessment } from './schema';

export type AssessmentStep = 'volumetry' | 'complexity' | 'compliance' | 'operations' | 'results';

export const assessmentStore = atom<AssessmentData>(defaultAssessment);
export const currentStepStore = atom<AssessmentStep>('volumetry');

export function updateAssessment(partialData: Partial<AssessmentData>) {
  assessmentStore.set({ ...assessmentStore.get(), ...partialData });
}

export function setStep(step: AssessmentStep) {
  currentStepStore.set(step);
}
