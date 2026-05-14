import React, { useState } from "react";
import { useStore } from "../store";
import { Send, ArrowLeft, Plus, Trash2, LockOpen, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SelectField } from "../components/FormWrapper";

export default function RequestUnlockPage() {
  const store = useStore();
  const navigate = useNavigate();
  
  const [requestType, setRequestType] = useState("specific");
  const [corrections, setCorrections] = useState([{ id: Date.now(), section: "", field: "", newValue: "" }]);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null);

  // Helper: Converts "camelCase" to "Title Case" (e.g., permanentAddress -> Permanent Address)
  const formatLabel = (text) => {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  // COMPLETE FORM STRUCTURE MAPPING
  const formMap = {
    personal: { 
      label: "Personal Information", 
      fields: ["fullName", "gender", "dob", "bloodGroup", "nationality", "religion", "caste", "category"] 
    },
    contact: { 
      label: "Contact Details", 
      fields: ["mobile", "email", "alternateMobile", "permanentAddress", "communicationAddress", "city", "state", "pincode"] 
    },
    academic: { 
      label: "Academic Records", 
      fields: ["rollNumber", "registrationNumber", "admissionDate", "currentSemester", "department", "batch"] 
    },
    education: { 
      label: "Education History", 
      fields: ["tenthSchool", "tenthPercentage", "tenthBoard", "twelfthSchool", "twelfthPercentage", "twelfthBoard", "degreeCGPA"] 
    },
    family: { 
      label: "Family Details", 
      fields: ["fatherName", "fatherOccupation", "motherName", "motherOccupation", "annualIncome", "guardianName"] 
    },
    professional: { 
      label: "Professional Details", 
      fields: ["skills", "experience", "internshipDetails", "projects"] 
    },
    documents: {
      label: "Uploaded Documents",
      fields: ["idProof", "photo", "signature", "migrationCertificate"]
    }
  };

  const sectionOptions = Object.keys(formMap).map(key => ({
    label: formMap[key].label,
    value: key
  }));

  const addCorrection = () => {
    if (corrections.length < 5) {
      setCorrections([...corrections, { id: Date.now(), section: "", field: "", newValue: "" }]);
    }
  };

  const removeCorrection = (id) => {
    setCorrections(corrections.filter(c => c.id !== id));
  };

  const updateCorrection = (id, key, value) => {
    setCorrections(corrections.map(c => 
      c.id === id ? { 
        ...c, 
        [key]: value, 
        // Reset field/value if the section itself changes
        ...(key === 'section' ? { field: '', newValue: '' } : {}) 
      } : c
    ));
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    // Logic to send 'corrections' array to admin goes here
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus("success");
    setIsSending(false);
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10">
      <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-[#003e7a] mb-6 transition-colors text-sm font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-12 shadow-sm overflow-visible">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Request Correction</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Select the specific entries you need to modify. Once submitted, an administrator will review and unlock these fields for you.
          </p>
        </header>

        {status === "success" ? (
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl animate-in fade-in zoom-in">
            <h2 className="text-emerald-800 font-black text-xl mb-2">Request Sent!</h2>
            <p className="text-emerald-700/80 text-sm mb-6">Your ticket has been logged. Admin usually reviews these within 24 hours.</p>
            <button onClick={() => navigate("/")} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-sm">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="space-y-12">
            
            {/* SWITCHER */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl">
              <button 
                type="button"
                onClick={() => setRequestType("specific")}
                className={`flex-1 py-3.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all ${requestType === 'specific' ? 'bg-white shadow-md text-[#003e7a]' : 'text-slate-400'}`}
              >
                Specific Fields
              </button>
              <button 
                type="button"
                onClick={() => setRequestType("full")}
                className={`flex-1 py-3.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all ${requestType === 'full' ? 'bg-white shadow-md text-[#003e7a]' : 'text-slate-400'}`}
              >
                Unlock Entire Form
              </button>
            </div>

            {requestType === "specific" ? (
              <div className="space-y-6">
                {corrections.map((corr) => {
                  const availableFields = corr.section ? formMap[corr.section].fields : [];
                  // FETCHING DIRECTLY FROM ZUSTAND STORE
                  const currentValue = corr.field ? store[corr.section]?.[corr.field] : null;

                  return (
                    <div key={corr.id} className="group p-6 md:p-8 bg-slate-50/50 border border-slate-200 rounded-[1.5rem] relative transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                      {corrections.length > 1 && (
                        <button 
                          onClick={() => removeCorrection(corr.id)} 
                          className="absolute -top-3 -right-3 bg-white border border-slate-200 text-slate-300 hover:text-red-500 hover:border-red-100 shadow-sm transition-all p-2 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        {/* CATEGORY SELECT */}
                        <div className="relative z-[100]">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Section</label>
                          <SelectField 
                            options={sectionOptions} 
                            value={corr.section} 
                            onChange={(e) => updateCorrection(corr.id, "section", e.target.value)}
                            placeholder="Choose Category"
                          />
                        </div>

                        {/* FIELD SELECT */}
                        <div className="relative z-[90]">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Field</label>
                          <SelectField 
                            disabled={!corr.section}
                            options={availableFields.map(f => ({ label: formatLabel(f), value: f }))} 
                            value={corr.field} 
                            onChange={(e) => updateCorrection(corr.id, "field", e.target.value)}
                            placeholder="Choose Entry"
                          />
                        </div>

                        {/* CURRENT VALUE FROM STORE */}
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Current Record</label>
                          <div className="w-full bg-slate-100/80 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-500 font-bold italic truncate">
                            {currentValue || "No existing data"}
                          </div>
                        </div>

                        {/* NEW INPUT */}
                        <div>
                          <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3 block">Requested Change</label>
                          <input 
                            required
                            type="text"
                            value={corr.newValue}
                            onChange={(e) => updateCorrection(corr.id, "newValue", e.target.value)}
                            className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#003e7a] focus:border-[#003e7a] outline-none transition-all"
                            placeholder="Type correct value here..."
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {corrections.length < 5 && (
                  <button 
                    type="button" 
                    onClick={addCorrection}
                    className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-slate-400 text-sm font-black uppercase tracking-widest hover:border-[#003e7a] hover:text-[#003e7a] transition-all flex items-center justify-center gap-3"
                  >
                    <Plus className="w-5 h-5" /> Add Another Field
                  </button>
                )}
              </div>
            ) : (
              <div className="py-16 bg-[#003e7a]/[0.02] border-2 border-dashed border-[#003e7a]/10 rounded-[2rem] flex flex-col items-center text-center px-6">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-900/5 mb-6">
                   <LockOpen className="w-10 h-10 text-[#003e7a]" />
                </div>
                <h3 className="font-black text-slate-900 text-xl">Full Form Reset</h3>
                <p className="text-sm text-slate-500 mt-3 max-w-[420px] font-medium leading-relaxed">
                  Requesting a full unlock will move your application back to "Draft" status. You will need to verify and re-submit all sections.
                </p>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-slate-400">
                <Info className="w-5 h-5" />
                <span className="text-[11px] font-bold uppercase tracking-widest leading-none">Logged via Student ID: {store.user?.id || "KU-STUDENT"}</span>
              </div>
              
              <button
                type="submit"
                disabled={isSending}
                className="w-full md:w-auto bg-[#003e7a] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50"
              >
                {isSending ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Submit Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}