import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assessmentSchema, type AssessmentData, defaultAssessmentData, AssessmentDataModels } from '../logic/index';
import { assessmentStore, currentStepStore, updateAssessment, setStep } from '../logic/index';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 'audienceSize', label: 'Scale & Audience', title: 'How many users will interact with this AI daily?', options: AssessmentDataModels.audienceSize.options },
  { id: 'coreTask', label: 'Core AI Task', title: 'What is the primary action you need the AI to do?', options: AssessmentDataModels.coreTask.options },
  { id: 'dataVolume', label: 'Data Volume', title: 'How much data or documents will the AI need to process?', options: AssessmentDataModels.dataVolume.options },
  { id: 'dataType', label: 'Data Type', title: 'What type of data will the AI mostly interact with?', options: AssessmentDataModels.dataType.options },
  { id: 'updateFrequency', label: 'Data Freshness', title: 'How quickly does the AI need to reflect new or changed data?', options: AssessmentDataModels.updateFrequency.options },
  { id: 'integrations', label: 'Data & Integrations', title: 'Does the AI need to connect to other internal systems?', options: AssessmentDataModels.integrations.options },
  { id: 'dataSensitivity', label: 'Privacy & Security', title: 'How sensitive is the information the AI will handle?', options: AssessmentDataModels.dataSensitivity.options },
  { id: 'userInterface', label: 'Primary Interface', title: 'Where will your users interact with this AI?', options: AssessmentDataModels.userInterface.options },
  { id: 'budgetPriority', label: 'Budget & Maintenance', title: 'What is your main priority regarding costs and maintenance?', options: AssessmentDataModels.budgetPriority.options },
];

export default function AssessmentForm() {
  const currentStep = assessmentStore.get(); // Or whatever triggers the unmount if needed
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const { control, handleSubmit, formState: { errors }, trigger, getValues } = useForm<AssessmentData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: defaultAssessmentData,
    mode: 'onChange'
  });

  const onSubmit = (data: AssessmentData) => {
    updateAssessment(data);
    setStep('results');
  };

  const nextStep = async () => {
    const fieldId = steps[currentQuestionIdx].id as keyof AssessmentData;
    const isStepValid = await trigger(fieldId);
    if (isStepValid && currentQuestionIdx < steps.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const currentStepData = steps[currentQuestionIdx];
  const progressPercentage = ((currentQuestionIdx + 1) / steps.length) * 100;

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-[#E5E2DC] rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] max-w-3xl mx-auto w-full">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold text-[#8A8580] uppercase tracking-widest">
            Step {currentQuestionIdx + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-[#5C5855]">
            {currentStepData.label}
          </span>
        </div>
        <div className="w-full bg-[#F2EFE9] rounded-full h-1 overflow-hidden">
          <motion.div 
            className="bg-[#D97757] h-1 rounded-full" 
            initial={{ width: `${(currentQuestionIdx / steps.length) * 100}%` }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 min-h-[300px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestionIdx}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-grow space-y-6"
          >
            <div>
              <h2 className="text-3xl font-serif text-[#33312E] mb-8 leading-tight">{currentStepData.title}</h2>
              <Controller
                name={currentStepData.id as keyof AssessmentData}
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    {currentStepData.options.map((option: string) => (
                      <label 
                        key={option} 
                        className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${field.value === option ? 'border-[#33312E] bg-[#FAF9F6] shadow-sm' : 'border-[#E5E2DC] bg-white hover:border-[#D5CFCD] hover:bg-[#FAF9F6]'} active:scale-[0.99]`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          value={option}
                          checked={field.value === option}
                          onChange={() => field.onChange(option)}
                        />
                        <div className={`w-5 h-5 rounded-full border flex flex-shrink-0 items-center justify-center mr-4 transition-colors ${field.value === option ? 'border-[#33312E]' : 'border-[#D5CFCD]'}`}>
                          {field.value === option && <div className="w-2.5 h-2.5 bg-[#33312E] rounded-full" />}
                        </div>
                        <span className={`text-lg transition-colors ${field.value === option ? 'text-[#33312E] font-medium' : 'text-[#5C5855]'}`}>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
              {errors[currentStepData.id as keyof AssessmentData] && (
                <p className="mt-3 text-sm text-[#D97757] flex items-center">
                  <span className="mr-1">⚠</span> {errors[currentStepData.id as keyof AssessmentData]?.message}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center pt-8 border-t border-[#E5E2DC] mt-auto">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentQuestionIdx === 0}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${currentQuestionIdx === 0 ? 'opacity-0 pointer-events-none' : 'text-[#8A8580] hover:text-[#33312E] hover:bg-[#F2EFE9]'}`}
          >
            ← Back
          </button>
          
          {currentQuestionIdx < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-2.5 rounded-lg font-medium text-white bg-[#33312E] hover:bg-[#1A1918] transition-colors shadow-sm active:scale-[0.98]"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-2.5 rounded-lg font-medium text-white bg-[#D97757] hover:bg-[#C26344] transition-colors shadow-sm flex items-center space-x-2 active:scale-[0.98]"
            >
              <span>Analyze Approach</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
