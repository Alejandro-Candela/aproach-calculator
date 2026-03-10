import React, { useRef } from 'react';
import { useStore } from '@nanostores/react';
import { assessmentStore, currentStepStore, setStep, calculateApproachScores, type ApproachOptions } from '../logic/index';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ResultsDashboard() {
  const currentStep = useStore(currentStepStore);
  const data = useStore(assessmentStore);
  const dashboardRef = useRef<HTMLDivElement>(null);

  if (currentStep !== 'results') return null;

  const results = calculateApproachScores(data);

  // Sort results by highest score
  const sortedResults = Object.values(results).sort((a, b) => b.score - a.score);

  const getColorClass = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    if (score >= 50) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    return 'text-red-400 bg-red-400/10 border-red-400/30';
  };

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2, backgroundColor: '#0f172a' }); // Slate 900
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Architect_AI_Assessment_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
    }
  };

  const dashboardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      ref={dashboardRef}
      initial="hidden" animate="visible" variants={dashboardVariants}
      className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl max-w-5xl mx-auto"
    >
      <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Architectural Assessment</h2>
          <p className="text-slate-400 mt-2">Optimal stack recommendation based on 2026 Enterprise Standards.</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={handleExportPDF}
            className="flex items-center space-x-2 text-sm font-medium text-white transition-colors bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 px-4 py-2 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <span>Export ADR</span>
          </button>
          <button 
            onClick={() => setStep('volumetry')}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
          >
            Retake Assessment
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedResults.map((result, index) => (
          <motion.div 
            key={result.approach} 
            variants={itemVariants}
            className={`relative overflow-hidden border rounded-2xl p-6 transition-all ${getColorClass(result.score)} ${index === 0 ? 'ring-2 ring-current ring-offset-2 ring-offset-slate-950 scale-[1.02] shadow-xl' : 'opacity-80'}`}
          >
            {index === 0 && (
                <div className="absolute top-0 right-0 bg-current px-4 py-1 rounded-bl-xl font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Recommended Spec
                </div>
            )}
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-2xl font-bold">{result.label}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-4xl font-black">{result.score}%</span>
                <span className="text-sm uppercase tracking-wider opacity-80 font-bold">Match</span>
              </div>
            </div>
            
            <p className="text-slate-300 relative z-10 text-lg leading-relaxed">
              {result.description}
            </p>
            
            {/* Background progress bar */}
            <div 
              className="absolute bottom-0 left-0 h-1.5 bg-current opacity-20" 
              style={{ width: `${result.score}%` }} 
            />
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-slate-950/50 rounded-2xl border border-white/5">
         <h4 className="text-white font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-cyan-400"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Selected Parameters Summary
        </h4>
         <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500 block">Audience Scale:</span> <span className="text-slate-200 font-medium">{data.audienceSize}</span></div>
            <div><span className="text-slate-500 block">Core AI Task:</span> <span className="text-slate-200 font-medium">{data.coreTask}</span></div>
            <div><span className="text-slate-500 block">Data Volume:</span> <span className="text-slate-200 font-medium">{data.dataVolume}</span></div>
            <div><span className="text-slate-500 block">Data Type:</span> <span className="text-slate-200 font-medium">{data.dataType}</span></div>
            <div><span className="text-slate-500 block">Data Freshness:</span> <span className="text-slate-200 font-medium">{data.updateFrequency}</span></div>
            <div><span className="text-slate-500 block">Data Integrations:</span> <span className="text-slate-200 font-medium">{data.integrations}</span></div>
            <div><span className="text-slate-500 block">Privacy constraints:</span> <span className="text-slate-200 font-medium">{data.dataSensitivity}</span></div>
            <div><span className="text-slate-500 block">Primary UI:</span> <span className="text-slate-200 font-medium">{data.userInterface}</span></div>
            <div><span className="text-slate-500 block">Budget/Priority:</span> <span className="text-slate-200 font-medium">{data.budgetPriority}</span></div>
         </div>
      </div>
    </motion.div>
  );
}

