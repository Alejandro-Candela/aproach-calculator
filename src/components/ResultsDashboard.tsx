import React, { useRef } from 'react';
import { useStore } from '@nanostores/react';
import { assessmentStore, currentStepStore, setStep, calculateApproachScores, generateBlueprint } from '../logic/index';
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
  const winningApproach = sortedResults[0];

  const getColorClass = (score: number) => {
    if (score >= 80) return 'text-[#2F4A37] bg-[#F4F5F4] border-[#DCE4DD]'; // Sage
    if (score >= 50) return 'text-[#5C5855] bg-[#FDFBF7] border-[#E8E2D9]'; // Warm neutral
    return 'text-[#8C4A3A] bg-[#FDF8F6] border-[#F2E0DB]'; // Terracotta tint
  };

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      // Use Anthropic background color for the PDF export instead of dark slate
      const canvas = await html2canvas(dashboardRef.current, { scale: 2, backgroundColor: '#FAF9F6' });
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

  const handleDownloadBlueprint = () => {
    const mdContent = generateBlueprint(data, winningApproach.approach);
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `architecture-blueprint-${winningApproach.approach.toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const dashboardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      ref={dashboardRef}
      initial="hidden" animate="visible" variants={dashboardVariants}
      className="bg-white/90 backdrop-blur-xl border border-[#E5E2DC] rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] max-w-5xl mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-[#E5E2DC] pb-8 gap-6">
        <div>
          <h2 className="text-4xl font-serif text-[#33312E] tracking-tight mb-2">Architectural Assessment</h2>
          <p className="text-[#8A8580] font-sans">Optimal stack recommendation based on Enterprise Standards.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleDownloadBlueprint}
            className="flex items-center space-x-2 text-sm font-medium text-[#FAF9F6] transition-all bg-[#33312E] hover:bg-[#1A1918] px-5 py-2.5 rounded-lg shadow-sm active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <span>Download Architect Blueprint</span>
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center space-x-2 text-sm font-medium text-[#33312E] transition-colors bg-white hover:bg-[#FAF9F6] border border-[#E5E2DC] px-4 py-2.5 rounded-lg shadow-sm active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>
            <span>Export ADR (PDF)</span>
          </button>
          <button 
            onClick={() => setStep('volumetry')}
            className="text-sm font-medium text-[#8A8580] hover:text-[#33312E] transition-colors px-4 py-2.5 rounded-lg hover:bg-[#F2EFE9]"
          >
            Retake Form
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedResults.map((result, index) => (
          <motion.div 
            key={result.approach} 
            variants={itemVariants}
            className={`relative overflow-hidden border rounded-2xl p-6 md:p-8 transition-all ${getColorClass(result.score)} ${index === 0 ? 'ring-1 ring-[#33312E] ring-offset-2 ring-offset-white shadow-md' : 'opacity-90 grayscale-[0.2]'}`}
          >
            {index === 0 && (
                <div className="absolute top-0 right-0 bg-[#33312E] px-4 py-1.5 rounded-bl-xl font-semibold text-[10px] text-[#FAF9F6] uppercase tracking-widest">
                    Recommended Spec
                </div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 relative z-10 gap-4">
              <h3 className="text-3xl font-serif">{result.label}</h3>
              <div className="flex items-center space-x-2 bg-white/50 px-4 py-1.5 rounded-full backdrop-blur-sm border border-black/5">
                <span className="text-3xl font-bold">{result.score}%</span>
                <span className="text-xs uppercase tracking-widest opacity-80 font-bold">Match</span>
              </div>
            </div>
            
            <p className="opacity-90 relative z-10 text-lg leading-relaxed max-w-4xl font-sans">
              {result.description}
            </p>
            
            {/* Background progress bar */}
            <div 
              className="absolute bottom-0 left-0 h-1 bg-current opacity-10" 
              style={{ width: `${result.score}%` }} 
            />
          </motion.div>
        ))}
      </div>
      
      <div className="mt-14 p-8 bg-[#FAF9F6] rounded-2xl border border-[#E5E2DC]">
         <h4 className="text-[#33312E] font-serif text-xl mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-[#D97757]"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Selected Parameters Summary
        </h4>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm font-sans">
            <div><span className="text-[#8A8580] block mb-1 text-xs uppercase tracking-wider">Audience Scale</span> <span className="text-[#33312E] font-medium">{data.audienceSize}</span></div>
            <div><span className="text-[#8A8580] block mb-1 text-xs uppercase tracking-wider">Core AI Task</span> <span className="text-[#33312E] font-medium">{data.coreTask}</span></div>
            <div><span className="text-[#8A8580] block mb-1 text-xs uppercase tracking-wider">Data Volume</span> <span className="text-[#33312E] font-medium">{data.dataVolume}</span></div>
            <div><span className="text-[#8A8580] block mb-1 text-xs uppercase tracking-wider">Data Type</span> <span className="text-[#33312E] font-medium">{data.dataType}</span></div>
            <div><span className="text-[#8A8580] block mb-1 text-xs uppercase tracking-wider">Data Freshness</span> <span className="text-[#33312E] font-medium">{data.updateFrequency}</span></div>
            <div><span className="text-[#8A8580] block mb-1 text-xs uppercase tracking-wider">Integrations</span> <span className="text-[#33312E] font-medium">{data.integrations}</span></div>
            <div><span className="text-[#8A8580] block mb-1 text-xs uppercase tracking-wider">Privacy Constraints</span> <span className="text-[#33312E] font-medium">{data.dataSensitivity}</span></div>
            <div><span className="text-[#8A8580] block mb-1 text-xs uppercase tracking-wider">Primary UI</span> <span className="text-[#33312E] font-medium">{data.userInterface}</span></div>
            <div><span className="text-[#8A8580] block mb-1 text-xs uppercase tracking-wider">Budget/Priority</span> <span className="text-[#33312E] font-medium">{data.budgetPriority}</span></div>
         </div>
      </div>
    </motion.div>
  );
}
