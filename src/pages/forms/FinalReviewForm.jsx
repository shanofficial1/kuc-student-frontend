import { useState } from "react";
import { useStore } from "../../store";
import {
  User, School, FileText, Info, Edit3, Gavel, Home,
  Briefcase, CreditCard, Users, Heart, Users2, ShieldCheck, Eye
} from "lucide-react";
import { Link } from "react-router-dom";

const SECTION_MAP = {
  academic: { title: "Academic Summary", icon: School, path: "/forms/academic" },
  personal: { title: "Personal Summary", icon: User, path: "/forms/personal" },
  contact: { title: "Contact Summary", icon: Users, path: "/forms/contact" },
  health: { title: "Health Summary", icon: Heart, path: "/forms/health" },
  family: { title: "Family Summary", icon: Users2, path: "/forms/family" },
  education: { title: "Education Summary", icon: School, path: "/forms/education" },
  financial: { title: "Financial Summary", icon: CreditCard, path: "/forms/financial" },
  professional: { title: "Professional Summary", icon: Briefcase, path: "/forms/professional" },
  residential: { title: "Residential Summary", icon: Home, path: "/forms/residential" },
  mentor: { title: "Mentor Summary", icon: ShieldCheck, path: "/forms/mentor" },
  documents: { title: "Documents Summary", icon: FileText, path: "/forms/documents" },
};

export default function FinalReviewForm() {
  const store = useStore();
  const isSubmitted = store.isSubmitted;
  const [agreed, setAgreed] = useState(false);

  function handleSubmit() {
    if (!agreed) return;
    store.setSubmitted(true);
    alert("Final submission successful! Your application is now locked.");
  }

  const formatLabel = (key) => {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const renderValue = (val, key = "") => {
    if (val === null || val === undefined || val === "") return "Not provided";
    if (typeof val === "boolean") return val ? "Yes" : "No";

    // Handle Strings (Emails, Names, etc)
    if (typeof val === "string") {
      return <span className="text-slate-700">{val}</span>;
    }

    // Handle File Objects / Uploaded Files
    if (val instanceof File || (typeof val === "object" && (val.file || val.name || key.toLowerCase().includes('file')))) {
      const fileName = val.name || val.file || "Document";
      return (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-slate-600 truncate max-w-[150px]">{fileName}</span>
          <button 
            type="button"
            className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors"
            onClick={() => {
              const fileUrl = val.file || (val instanceof File ? URL.createObjectURL(val) : null);
              if (fileUrl) window.open(fileUrl, '_blank');
              else alert("No preview available for this file.");
            }}
          >
            <Eye className="w-3 h-3" /> View
          </button>
        </div>
      );
    }

    // Handle Arrays
    if (Array.isArray(val)) {
      if (val.length === 0) return "None recorded";
      
      // If it's a simple array (like languages: ["English", "Hindi"]), join with commas
      if (typeof val[0] !== "object") {
        return <span className="text-slate-700">{val.join(", ")}</span>;
      }

      // If it's a complex array (like academicRecords: [{...}]), render blocks
      return (
        <div className="space-y-2 mt-2">
          {val.map((item, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded border border-slate-100 text-[12px]">
              {renderValue(item)}
            </div>
          ))}
        </div>
      );
    }

    // Handle Nested Objects (Recursive)
    if (typeof val === "object") {
      return (
        <div className="grid grid-cols-1 gap-1">
          {Object.entries(val)
            .filter(([k]) => !k.toLowerCase().includes("error")) // Hide keys containing "error"
            .map(([k, v]) => (
              <div key={k} className="flex gap-2 text-[13px]">
                <span className="font-bold text-slate-400 min-w-[90px] uppercase text-[9px]">{formatLabel(k)}:</span>
                <span className="text-slate-600">{typeof v === "object" ? "[Detail]" : String(v)}</span>
              </div>
            ))}
        </div>
      );
    }

    return String(val);
  };

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12 pb-24">
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-primary mb-2">Final Review</h1>
        <p className="text-slate-500 max-w-2xl">
          Please review all information carefully. Files can be viewed using the "View" button.
        </p>
      </header>

      {/* POLICY BOX */}
      <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-xl mb-10 flex gap-4 items-start shadow-sm">
        <Info className="w-6 h-6 text-primary shrink-0" />
        <div>
          <p className="font-bold text-primary">Final Submission Policy</p>
          <p className="text-sm text-slate-600 mt-1">
            Ensure all uploaded documents are correct. Once submitted, your application will be locked for review.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(SECTION_MAP).map(([sectionKey, config]) => {
          const sectionData = store[sectionKey];
          if (!sectionData) return null;

          const SectionIcon = config.icon;

          return (
            <section key={sectionKey} className="bg-white border border-border-subtle rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between mb-6">
                <h2 className="font-bold flex items-center gap-2 text-slate-800">
                  <SectionIcon className="w-5 h-5 text-primary" />
                  {config.title}
                </h2>
                {!isSubmitted && (
                  <Link to={config.path}>
                    <Edit3 className="w-4 h-4 text-primary hover:scale-110 transition-transform" />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {Object.entries(sectionData)
                  .filter(([key]) => !key.toLowerCase().includes("error")) // Hides all "Error" keys
                  .map(([key, value]) => (
                    <div key={key} className="break-words">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {formatLabel(key)}
                      </p>
                      <div className="font-medium text-sm">
                        {renderValue(value, key)}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          );
        })}

        {/* DECLARATION SECTION */}
        <div className="bg-slate-900 text-white rounded-3xl p-10">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Gavel className="w-5 h-5 text-blue-400" />
            Declaration
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            I hereby declare that the information and documents provided in this application are true and authentic to the best of my knowledge.
          </p>

          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              id="agreeCheck"
              className="w-5 h-5 rounded accent-primary cursor-pointer"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              disabled={isSubmitted}
            />
            <label htmlFor="agreeCheck" className="text-sm cursor-pointer select-none">
              I agree to the terms and conditions
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!agreed || isSubmitted}
            className={`px-10 py-4 rounded-xl font-bold transition-all ${
              agreed && !isSubmitted
                ? "bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20"
                : "bg-slate-600 text-slate-300 cursor-not-allowed"
            }`}
          >
            {isSubmitted ? "Submission Locked" : "Final Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}