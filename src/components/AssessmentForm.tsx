import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assessmentSchema, type AssessmentData, defaultAssessmentData, AssessmentDataModels } from '../logic/index';
import { assessmentStore, currentStepStore, updateAssessment, setStep } from '../logic/index';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 'audienceSize', label: 'Scale & Audience', title: 'How many users will interact with this AI daily?', options: AssessmentDataModels.audienceSize.options },
  { id: 'coreTask', label: 'Core AI Task', title: 'What is the primary action you need the AI to do?', options: AssessmentDataModels.coreTask.options },
  { id: 'integrations', label: 'Data & Integrations', title: 'Does the AI need to connect to your internal systems?', options: AssessmentDataModels.integrations.options },
  { id: 'dataSensitivity', label: 'Privacy & Security', title: 'How sensitive is the information the AI will handle?', options: AssessmentDataModels.dataSensitivity.options },
  { id: 'userInterface', label: 'Primary Interface', title: 'Where will your users interact with this AI?', options: AssessmentDataModels.userInterface.options },
  { id: 'budgetPriority', label: 'Budget & Maintenance', title: 'What is your main priority regarding costs and maintenance?', options: AssessmentDataModels.budgetPriority.options },
];

export default function AssessmentForm() {
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
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-emerald-400 capitalize tracking-wider">
            Step {currentQuestionIdx + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-slate-400">
            {currentStepData.label}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <motion.div 
            className="bg-emerald-500 h-1.5 rounded-full" 
            initial={{ width: `${(currentQuestionIdx / steps.length) * 100}%` }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 min-h-[300px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestionIdx}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-grow space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 leading-tight">{currentStepData.title}</h2>
              <Controller
                name={currentStepData.id as keyof AssessmentData}
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    {currentStepData.options.map((option: string) => (
                      <label 
                        key={option} 
                        className={`flex items-center p-4 rounded-xl border ${field.value === option ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'} cursor-pointer transition-all active:scale-[0.98]`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          value={option}
                          checked={field.value === option}
                          onChange={() => field.onChange(option)}
                        />
                        <div className={`w-5 h-5 rounded-full border flex flex-shrink-0 items-center justify-center mr-4 ${field.value === option ? 'border-emerald-500' : 'border-slate-500'}`}>
                          {field.value === option && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                        </div>
                        <span className={`text-lg ${field.value === option ? 'text-white font-medium' : 'text-slate-300'}`}>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
              {errors[currentStepData.id as keyof AssessmentData] && (
                <p className="mt-3 text-sm text-red-400 flex items-center">
                  <span className="mr-1">⚠</span> {errors[currentStepData.id as keyof AssessmentData]?.message}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-auto">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentQuestionIdx === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${currentQuestionIdx === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'}`}
          >
            ← Back
          </button>
          
          {currentQuestionIdx < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 rounded-xl font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all active:scale-95 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-3 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all active:scale-95 shadow-[0_0_20px_rgba(52,211,153,0.4)] flex items-center space-x-2"
            >
              <span>Analyze Approach</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
