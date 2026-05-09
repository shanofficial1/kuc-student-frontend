import React, { useState, useMemo } from "react";
import { AlertCircle, Save, ArrowLeftRight, CheckCircle2, History, BookOpen } from "lucide-react";
import { useStore } from "../store";
import { SelectField } from "../components/FormWrapper";

export default function MarkRequestPage() {
  // 1. PULL DATA AND ACTIONS FROM STORE
  const marksData = useStore((state) => state.marksData);
  const updateMark = useStore((state) => state.updateMark);

  const [selectedSem, setSelectedSem] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [newCE, setNewCE] = useState("");
  const [newTE, setNewTE] = useState("");
  const [reason, setReason] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 2. FILTER SUBJECTS BASED ON SELECTED SEMESTER
  const filteredSubjects = useMemo(() => {
    if (!selectedSem) return [];
    return marksData[selectedSem] || [];
  }, [selectedSem, marksData]);

  // Find the actual subject object to show current marks
  const selectedSubject = useMemo(() => {
    return filteredSubjects.find((s) => s.code === selectedCode);
  }, [selectedCode, filteredSubjects]);

  const handleSemesterChange = (e) => {
    setSelectedSem(e.target.value);
    setSelectedCode(""); // Reset subject when semester changes
    setIsSuccess(false);
  };

  const handleSubjectChange = (e) => {
    setSelectedCode(e.target.value);
    setNewCE(""); 
    setNewTE("");
    setIsSuccess(false);
  };

  const handleSubmitCorrection = (e) => {
    e.preventDefault();
    
    // 3. UPDATE THE STORE
    updateMark(selectedSem, selectedCode, newCE, newTE);
    
    setIsSuccess(true);
    setReason("");
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <main className="max-w-[800px] mx-auto px-6 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-amber-100 p-2 rounded-lg">
            <ArrowLeftRight className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Mark Correction Portal</h1>
        </div>
        <p className="text-slate-500 text-sm">Authorized Faculty Access Only: Rectify academic record errors.</p>
      </header>

      {/* Container is overflow-visible to prevent dropdown clipping */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-visible">
        <form onSubmit={handleSubmitCorrection} className="p-8">
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SEMESTER SELECT */}
              <div className="relative z-[60]">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  1. Select Semester
                </label>
                <SelectField
                  value={selectedSem}
                  options={[
                    { label: "Semester I", value: "Semester I" },
                    { label: "Semester II", value: "Semester II" },
                    { label: "Semester III", value: "Semester III" },
                    { label: "Semester IV", value: "Semester IV" },
                  ]}
                  onChange={handleSemesterChange}
                  placeholder="Choose Semester..."
                />
              </div>

              {/* SUBJECT SELECT (Filtered) */}
              <div className="relative z-[50]">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  2. Select Subject
                </label>
                <SelectField
                  value={selectedCode}
                  disabled={!selectedSem}
                  options={filteredSubjects.map(s => ({ 
                    label: `${s.code} - ${s.title}`, 
                    value: s.code 
                  }))}
                  onChange={handleSubjectChange}
                  placeholder={selectedSem ? "Choose Subject..." : "Select Semester first"}
                />
              </div>
            </div>

            {selectedSubject && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 animate-in fade-in slide-in-from-top-2">
                
                {/* CE Correction */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-sm text-[#003e7a] flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Continuous Evaluation (CE)
                  </h3>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Current Mark</label>
                    <input 
                      type="text" 
                      disabled 
                      value={selectedSubject.CE}
                      className="w-full bg-slate-200 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-500 cursor-not-allowed font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase">New Corrected Mark</label>
                    <input 
                      type="number" 
                      placeholder="Enter new CE"
                      value={newCE}
                      onChange={(e) => setNewCE(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:border-[#003e7a] outline-none"
                    />
                  </div>
                </div>

                {/* TE Correction */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-sm text-[#003e7a] flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Theory Exam (TE)
                  </h3>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Current Mark</label>
                    <input 
                      type="text" 
                      disabled 
                      value={selectedSubject.TE}
                      className="w-full bg-slate-200 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-500 cursor-not-allowed font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase">New Corrected Mark</label>
                    <input 
                      type="number" 
                      placeholder="Enter new TE"
                      value={newTE}
                      onChange={(e) => setNewTE(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:border-[#003e7a] outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Reason for Correction
                  </label>
                  <textarea 
                    rows="2"
        
                    placeholder="Provide a reason for auditing..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#003e7a] outline-none"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[11px] font-medium italic">Changes update the database immediately.</span>
            </div>
            
            <button
              type="submit"
              disabled={!selectedCode || (!newCE && !newTE)}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-sm transition-all ${
                isSuccess 
                ? "bg-green-600 text-white" 
                : "bg-[#003e7a] text-white hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isSuccess ? (
                <> <CheckCircle2 className="w-4 h-4" /> Marks Update requested</>
              ) : (
                <> <Save className="w-4 h-4" /> Apply Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}