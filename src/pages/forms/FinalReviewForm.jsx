import { useState } from "react";
import { useStore } from "../../store";
import {
  User, School, FileText, Info, Edit3, Gavel, Home,
  Briefcase, CreditCard, Users, Heart, Users2, ShieldCheck,
  FileIcon, FileTextIcon, ImageIcon, Layers,Phone,  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";

// --- REUSABLE FILE CARD COMPONENT ---
const FileCard = ({ file, fileName, fileSize = "420 KB" }) => {
  const actualName = fileName || file?.name || "Document";

  const ext = actualName.split(".").pop()?.toLowerCase();

  const getFileIcon = () => {
    // IMAGE
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return (
        <ImageIcon className="w-5 h-5 text-slate-400" />
      );
    }

    // PDF
    if (ext === "pdf") {
      return (
        <FileTextIcon className="w-5 h-5 text-red-400" />
      );
    }

    // DOC
    if (["doc", "docx"].includes(ext)) {
      return (
        <FileTextIcon className="w-5 h-5 text-blue-400" />
      );
    }

    // DEFAULT
    return (
      <FileIcon className="w-5 h-5 text-slate-400" />
    );
  };

  return (
    <div className="flex items-center gap-3 p-3 border border-slate-100 rounded bg-slate-50">
      
      {getFileIcon()}

      <div className="overflow-hidden">
        <p className="text-[12px] font-semibold text-slate-700 truncate">
          {actualName}
        </p>

        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
          {file?.size
            ? `${(file.size / 1024).toFixed(0)} KB`
            : fileSize}
        </p>
      </div>
    </div>
  );
};

// --- CONFIGURATION ---
const SECTION_MAP = {
  academic: { title: "Academic Summary", icon: School, path: "/forms/academic" },
  personal: { title: "Personal Summary", icon: User, path: "/forms/personal" },
  contact : { title: "Contact Summary", icon: Phone, path: "/forms/contact" },
  health : { title: "Health Summary", icon: Heart, path: "/forms/health" },
  family: { title: "Family Summary", icon: Users2, path: "/forms/family" },
  education: { title: "Education Summary", icon: GraduationCap, path: "/forms/education" },
  financial : { title: "Financial Summary", icon: CreditCard, path: "/forms/financial" },
  professional: { title: "Professional Summary", icon: Briefcase, path: "/forms/professional" },
  residential: { title: "Residential Summary", icon: Home, path: "/forms/residential" },
  documents: { title: "Uploaded Documents", icon: FileText, path: "/forms/documents" },
  mentor: { title: "Mentor Summary", icon: ShieldCheck, path: "/forms/mentor" },
};

export default function FinalReviewForm() {
  const store = useStore();
  const isSubmitted = store.isSubmitted;
  const [agreed, setAgreed] = useState(false);

  console.log(store);


  const formatLabel = (key) => {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const handleSubmit = () => {
    if (!agreed) return;
    store.setSubmitted(true);
    alert("Application submitted and locked successfully.");
  };

  // Traverses nested skill categories (Technical, Software, etc.)
  const renderSkills = (skillsObj) => {
    if (typeof skillsObj !== 'object' || skillsObj === null) return String(skillsObj);
    return Object.entries(skillsObj).map(([category, list]) => (
      <div key={category} className="mb-2 last:mb-0">
        <span className="text-[10px] font-bold text-primary uppercase">{formatLabel(category)}: </span>
        <span className="text-sm text-slate-600">{Array.isArray(list) ? list.join(", ") : String(list)}</span>
      </div>
    ));
  };

  const renderValue = (val, key = "") => {
    if (val === null || val === undefined || val === "") return <span className="text-slate-400 italic">Not provided</span>;

  const isFileInstance = val instanceof File;

const isFileObject =
  typeof val === "object" &&
  val !== null &&
  (val.name || val.file);

const isFileKey =
  key.toLowerCase().includes("file") ||
  key.toLowerCase().includes("document") ||
  key.toLowerCase().includes("certificate") ||
  key.toLowerCase().includes("image") ||
  key.toLowerCase().includes("pdf");


    if (isFileInstance || isFileObject || isFileKey) {
      // If it's a string that doesn't look like a filename, just show text
      if (typeof val === 'string' && !val.includes('.')) return <span className="text-slate-700">{val}</span>;
      
      return (
        <FileCard 
          file={typeof val === 'object' ? val : null} 
          fileName={typeof val === 'string' ? val : val.name} 
        />
      );
    }

    // 2. Special Case: Siblings (Row-based, specific fields)
    if (key === "siblings" && Array.isArray(val)) {
      return (
        <div className="space-y-2 w-full col-span-full">
          {val.map((sib, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:justify-between p-3 border border-slate-100 rounded bg-slate-50/50">
              <span className="text-sm font-bold text-slate-700">{sib.name}</span>
              <span className="text-sm text-slate-500">{sib.qualification}</span>
            </div>
          ))}
        </div>
      );
    }

    // 3. Handle Complex Arrays (Exams, Experience, Journal, etc.)
    if (Array.isArray(val)) {
      if (val.length === 0) return <span className="text-slate-400">No records found</span>;
      if (typeof val[0] !== 'object') return <span className="text-slate-700">{val.join(", ")}</span>;

      return (
        <div className="space-y-3 w-full col-span-full">
          {val.map((item, i) => (
            <div key={i} className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm flex flex-wrap gap-x-8 gap-y-3 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-100"></div>
              {Object.entries(item)
                .filter(([k]) => !k.toLowerCase().includes("error") && !k.toLowerCase().includes("file"))
                .map(([k, v]) => (
                  <div key={k} className="min-w-[140px]">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{formatLabel(k)}</p>
                    <p className="text-sm text-slate-700 font-medium">{typeof v === 'object' ? "Detail" : String(v)}</p>
                  </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    // 4. Handle Skills Specifically
    if (key === "skills") return renderSkills(val);

    // Default String/Boolean rendering
    return <span className="text-slate-700">{typeof val === 'boolean' ? (val ? "Yes" : "No") : String(val)}</span>;
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-12 pb-24">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Final Review</h1>
        <p className="text-slate-500 mt-1">Check all details carefully. Once submitted, the application is locked.</p>
      </header>

      <div className="space-y-8">
        {Object.entries(SECTION_MAP).map(([sectionKey, config]) => {
          const sectionData = store[sectionKey];
          if (!sectionData) return null;

          return (
            <section key={sectionKey} className="bg-white border border-border-subtle rounded-xl p-5 sm:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <config.icon className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-slate-800">{config.title}</h2>
                </div>
                {!isSubmitted && (
                  <Link to={config.path} className="flex items-center gap-1 text-primary text-xs font-bold hover:bg-primary/5 px-2 py-1 rounded transition-colors">
                    <Edit3 className="w-3 h-3" /> Edit
                  </Link>
                )}
              </div>

              {/* Layout: 2 Columns on Desktop, 1 Column on Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {Object.entries(sectionData)
                  .filter(([key]) => !key.toLowerCase().includes("error") )
                  .map(([key, value]) => {
const isFullWidth =
  Array.isArray(value);                    return (
                      <div key={key} className={`${isFullWidth ? "md:col-span-2" : ""} flex flex-col gap-1`}>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatLabel(key)}</p>
                        <div className="mt-1">{renderValue(value, key)}</div>
                      </div>
                    );
                  })}

                {/* Specific Mentor Fields if they aren't caught by the map */}
                {sectionKey === "mentor" && !sectionData.tutorName && (
                   <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-50 pt-4 mt-2">
                      {[ 
                        { l: "Tutor Name", v: sectionData.tutorName },
                        { l: "Tutor Email ID", v: sectionData.tutorEmail },
                        { l: "HOD Name", v: sectionData.hodName },
                        { l: "HOD Email ID", v: sectionData.hodEmail }
                      ].map((m, idx) => (
                        <div key={idx}>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">{m.l}</p>
                           <p className="text-sm text-slate-700">{m.v || "N/A"}</p>
                        </div>
                      ))}
                   </div>
                )}
              </div>
            </section>
          );
        })}

        {/* Declaration Section */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Gavel className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold">Applicant Declaration</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            I hereby declare that all information and uploaded documents provided in this application are true, 
            complete, and authentic to the best of my knowledge.
          </p>

          <div className="flex items-center gap-3 mb-8">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={isSubmitted}
              className="w-5 h-5 rounded accent-primary cursor-pointer"
            />
            <label htmlFor="agree" className="text-sm font-medium cursor-pointer select-none">
              I certify that the above information is correct
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!agreed || isSubmitted}
            className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold transition-all ${
              agreed && !isSubmitted 
                ? "bg-primary hover:scale-[1.02] shadow-lg shadow-primary/20" 
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isSubmitted ? "Submission Locked" : "Final Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}