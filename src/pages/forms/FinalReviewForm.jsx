import { useState } from "react";
import { useStore } from "../../store";
import {
  User, School, FileText, Edit3, Home,
  Briefcase, CreditCard, Heart, Users2, ShieldCheck,
  FileIcon, FileTextIcon, ImageIcon, Phone, GraduationCap, CheckCircle2, Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { getChangedFields } from "../../lib/utils";

// --- SMART UTILITIES ---
const formatLabel = (key) => {
  if (!key) return "";
  let cleanKey = key.startsWith('_') ? key.slice(1) : key;
  
  // Custom shorthand and layout cleanups
  if (cleanKey.toLowerCase() === "documenturl") return "Document";
  if (cleanKey.toLowerCase() === "feewaiveurl") return "Fee Waive Document";
  if (cleanKey.toLowerCase() === "file") return "Document";
  
  // Clean off trailing descriptors dynamically for better typography
  if (cleanKey.endsWith("Url")) cleanKey = cleanKey.slice(0, -3);
  if (cleanKey.endsWith("Doc")) cleanKey = cleanKey.slice(0, -3);

  const result = cleanKey.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const isFileLink = (val) => {
  if (typeof val !== "string") return false;
  return val.startsWith("uploads/") || val.toLowerCase().endsWith(".pdf") || val.toLowerCase().endsWith(".jpg") || val.toLowerCase().endsWith(".png");
};

const isHiddenKey = (key) => {
  const k = key.toLowerCase();
  return (
    k.startsWith('_') || 
    k === 'id' || 
    k.includes("error") || 
    k.includes("token") || 
    k.includes("islogged") || 
    k.includes("loading") || 
    k.includes("demolocked") ||
    k === "membershipurl" ||
    k === "patenturl"
  );
};

const formatEmptyValue = () => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
    Not provided
  </div>
);

const renderValueBox = (content) => (
  <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 min-h-[50px]">
    {content}
  </div>
);

const getSectionSummary = (data) => {
  const visibleEntries = Object.entries(data).filter(([key]) => !isHiddenKey(key));
  const total = visibleEntries.length;
  const filled = visibleEntries.filter(([, value]) => value !== null && value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0)).length;
  return `${filled} of ${total} completed`;
};

// --- COMPONENTS ---
const FileCard = ({ name, url }) => {

  if (!url) return null;

  const ext =
    name?.split(".").pop()?.toLowerCase();

  const getIcon = () => {

    if (
      ["jpg", "jpeg", "png", "webp"]
        .includes(ext)
    ) {
      return (
        <ImageIcon className="w-5 h-5 text-orange-400" />
      );
    }

    if (ext === "pdf") {
      return (
        <FileTextIcon className="w-5 h-5 text-green-400" />
      );
    }

    return (
      <FileIcon className="w-5 h-5 text-slate-400" />
    );

  };

  const targetUrl =
  url.startsWith("http")
    ? url
    : `http://localhost:3002/${url}`;
  return (

    <div className="flex items-center justify-between gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50/50">

      <div className="flex items-center gap-3 overflow-hidden">

        <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-sm shrink-0">
          {getIcon()}
        </div>

        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-slate-700 truncate">
            {name}
          </p>

          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            FILE DOCUMENT
          </p>
        </div>

      </div>

      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold shadow-sm hover:bg-slate-50"
      >
        <Eye className="w-3.5 h-3.5" />
        View
      </a>

    </div>

  );

};

// --- MAIN REVIEW COMPONENT ---
const SECTION_CONFIG = {
  academic: { title: "Academic Profile", icon: School, path: "/forms/academic" },
  personal: { title: "Personal Details", icon: User, path: "/forms/personal" },
  contact: { title: "Contact Information", icon: Phone, path: "/forms/contact" },
  family: { title: "Family & Guardians", icon: Users2, path: "/forms/family" },
  education: { title: "Education History", icon: GraduationCap, path: "/forms/education" },
  financial: { title: "Financial & Bank", icon: CreditCard, path: "/forms/financial" },
  health: { title: "Medical & Health", icon: Heart, path: "/forms/health" },
  professional: { title: "Professional & Research", icon: Briefcase, path: "/forms/professional" },
  residential_details: { title: "Residential & Transport", icon: Home, path: "/forms/residential" },
  documents: { title: "Legal Documents", icon: FileText, path: "/forms/documents" },
};

export default function FinalReviewForm() {
  const store = useStore();
  const isSubmitted = store.isSubmitted;
  const [agreed, setAgreed] = useState(false);

  const renderDataPoint = (key, value) => {
    if (value === null || value === undefined || value === "") return <span className="text-slate-400 italic text-sm">Not provided</span>;

    // 1. Intercept Nested Object Files First
   if (typeof value === "object" && !Array.isArray(value)) {

  if (value.document?.url) {

    return (
      <FileCard
        name={value.document.name}
        url={value.document.url}
      />
    );

  }

  if (value.url) {

    return (
      <FileCard
        name={value.name}
        url={value.url}
      />
    );

  }



      const activeEntries = Object.entries(value).filter(([subKey]) => !isHiddenKey(subKey));
      if (activeEntries.length === 0) return <span className="text-slate-400 italic text-sm">Not provided</span>;

      // --- ROW-BASED CARDS FOR NESTED OBJECT GROUPS (Father, Mother, Address blocks, etc.) ---
      return (
        <div className="p-4 rounded-3xl bg-slate-50/70 w-full mt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeEntries.map(([subKey, subVal]) => {
              const isSubItemWide = isFileLink(subVal) || (subVal && typeof subVal === 'object') || subKey.toLowerCase().includes('title');
              return (
                <div key={subKey} className={`${isSubItemWide ? "md:col-span-2" : ""}`}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">{formatLabel(subKey)}</p>
                  {renderValueBox(renderDataPoint(subKey, subVal))}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

 if (
  isFileLink(value) ||
  key.toLowerCase().includes("doc") ||
  key.toLowerCase().includes("url")
) {

  return (
    <FileCard
      name={String(value).split("/").pop()}
      url={String(value)}
    />
  );

}
    // 3. Handle Arrays
    if (Array.isArray(value)) {
      const filteredArray = value.filter(item => item && Object.keys(item).length > 0);
      if (filteredArray.length === 0) return <span className="text-slate-500 italic">None</span>;
      
      if (typeof filteredArray[0] === 'string') {
        return <span className="text-sm text-slate-700 font-semibold">{filteredArray.join(", ")}</span>;
      }

     if (key === "transcripts") {

  const fileTarget =
    filteredArray[0]?.file ||
    filteredArray[0]?.url ||
    filteredArray[0]?.document;

  const displayName =
    filteredArray[0]?.name ||
    "Academic Transcript Document";

  if (fileTarget) {

    return (
      <FileCard
        name={displayName}
        url={fileTarget}
      />
    );

  }

}
      // --- ROW-BASED CARDS FOR ARRAY OBJECTS ---
      return (
        <div className="space-y-3 w-full mt-2">
          {filteredArray.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50/30 flex flex-wrap gap-x-6 gap-y-4 w-full">
               {Object.entries(item)
                 .filter(([k]) => !isHiddenKey(k)) 
                 .map(([k, v]) => {
                   const isItemWide = isFileLink(v) || (v && typeof v === 'object') || k.toLowerCase().includes('title');
                   return (
                     <div key={k} className={`min-w-[140px] flex-1 ${isItemWide ? "w-full min-w-full" : ""}`}>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{formatLabel(k)}</p>
                        <div className="text-sm text-slate-700 font-medium w-full">{renderDataPoint(k, v)}</div>
                     </div>
                   );
                 })}
            </div>
          ))}
        </div>
      );
    }

    // 4. Base JavaScript Primitives
    return <span className="text-sm text-slate-700 font-semibold">{typeof value === 'boolean' ? (value ? "Yes" : "No") : String(value)}</span>;
  };

  const saveAndRefresh = useStore(
  (s) => s.saveAndRefresh
);


 const handleSubmit = async () => {
  if (!agreed) return;

  const state = useStore.getState();
  const snapshot = state.profileSnapshot || {};

  const sections = [
    "academic",
    "personal",
    "contact",
    "family",
    "education",
    "financial",
    "health",
    "professional",
    "residential",
    "documents",
    "mentor"
  ];

  let hasChanges = false;
  const changedSections = {};

  for (const section of sections) {
    const original = snapshot[section] || {};
    const current = state[section] || {};

    const changes = getChangedFields(
      original,
      current
    );

    if (Object.keys(changes).length > 0) {
      hasChanges = true;
      changedSections[section] = changes;
    }
  }

  console.log("Snapshot:", snapshot);
  console.log("Changed Sections:", changedSections);

  if (!hasChanges) {
    alert("No changes detected.");
    return;
  }

  const formData = new FormData();

Object.entries(changedSections).forEach(
  ([section, data]) => {
    formData.append(
      `${section}_details`,
      JSON.stringify(data)
    );
  }
);

for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

const payload = {

  requestType:
    "full_unlock",

  formData: {

    academic:
      state.academic,

    personal:
      state.personal,

    contact:
      state.contact,

    family:
      state.family,

    education:
      state.education,

    financial:
      state.financial,

    health:
      state.health,

    professional:
      state.professional,

    residential:
      state.residential,

    documents:
      state.documents

  }

};



await store.submitUnlockRequest({

  requestType:
    "full_unlock",

  formData:
    changedSections

});

window.location.reload(); 

alert(
  "Application submitted for verification"
);


window.scrollTo({
  top: 0,
  behavior: "smooth",
});



  // ===================================
  // BUILD FORMDATA HERE LATER
  // ===================================

  /*
  const formData = new FormData();

  Object.entries(changedSections).forEach(
    ([section, data]) => {
      formData.append(
        section,
        JSON.stringify(data)
      );
    }
  );

  await saveAndRefresh(formData, true);
  */

  store.setSubmitted(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  alert(
    `Changes detected in ${Object.keys(changedSections).length} section(s).`
  );
};


const snapshot = store.profileSnapshot || {};

const changedDataBySection = {};

Object.keys(SECTION_CONFIG).forEach((section) => {
  const original = snapshot[section] || {};
  const current = store[section] || {};

  const changes = getChangedFields(
    original,
    current
  );

  if (Object.keys(changes).length > 0) {
    changedDataBySection[section] = changes;
  }
});

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12 pb-32 bg-slate-50/30">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Review Application</h1>
        <p className="text-slate-500 mt-2 max-w-md mx-auto italic">Everything looks good? Submit your final application below.</p>
      </header>

      <div className="grid grid-cols-1 gap-10">
        {Object.entries(SECTION_CONFIG).map(([sectionKey, config]) => {
const data = changedDataBySection[sectionKey];
          if (!data || Object.keys(data).length === 0) return null;

          return (
            <div key={sectionKey} className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-300">
              {/* Section Header */}
              <div className="bg-slate-50/80 px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <config.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">{config.title}</h2>
                    <p className="text-sm text-slate-500 mt-1">{getSectionSummary(data)}</p>
                  </div>
                </div>
                {!isSubmitted && (
                  <Link to={config.path} className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all">
                    <Edit3 className="w-3.5 h-3.5" /> Edit Section
                  </Link>
                )}
              </div>

              {/* Data Grid */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  {Object.entries(data)
                    .filter(([key]) => !isHiddenKey(key))
                    .map(([key, value]) => {
                      const hasNestedFile = value && typeof value === 'object' && (value.document || value.url);
                      const isWide = Array.isArray(value) || typeof value === 'object' || isFileLink(value) || hasNestedFile;
                      return (
                        <div key={key} className={`${isWide ? "md:col-span-2" : ""} rounded-3xl bg-white p-4 w-full`}> 
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatLabel(key)}</label>
                          {renderValueBox(renderDataPoint(key, value))}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })}

        {/* --- Submission Module --- */}
        <div className="mt-6 bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8 text-blue-400">
              <ShieldCheck className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Confirmation</h3>
            </div>

            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              By submitting, you confirm that all information provided is accurate and all documents are original. 
              You will not be able to change this information later.
            </p>

            <div className="flex flex-col gap-6">
              <label className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  disabled={isSubmitted}
                  className="w-6 h-6 rounded-lg accent-primary border-none cursor-pointer"
                />
                <span className="text-sm sm:text-base font-semibold">
                  I agree that the details provided are true to my knowledge.
                </span>
              </label>

              <button
                onClick={handleSubmit}
                disabled={!agreed || isSubmitted}
                className={`flex items-center justify-center gap-3 w-full py-5 rounded-2xl text-lg font-black transition-all transform active:scale-95 ${
                  agreed && !isSubmitted 
                  ? "bg-primary hover:bg-blue-600 shadow-xl shadow-primary/20" 
                  : "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                }`}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" /> Application Locked
                  </>
                ) : (
                  "Submit Final Application"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}