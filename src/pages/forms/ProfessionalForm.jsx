import React, { useState ,useRef ,useEffect} from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
} from "../../components/FormWrapper";
import {
  BookOpen,
  Users,
  Briefcase,
  Plus,
  Trash2,
  Lightbulb,
  FileText,
  X,
} from "lucide-react";

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

/* ================= REUSABLE INPUT ================= */

const FileInput = ({
  label,
  file,
  error,
  onChange,
  disabled,
}) => {
  const formatFileName = (fileName) => {
    if (!fileName) return "Upload File";
    const name = typeof fileName === "string" ? fileName.split('/').pop() : fileName.name;
    
    if (name.length > 20) {
      return name.substring(0, 15) + "..." + name.slice(-5);
    }
    return name;
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-sm font-medium text-slate-600">
          {label}
        </label>
      )}

      <label
        className={`w-full h-12 flex items-center justify-between px-3 border rounded-lg cursor-pointer transition 
        ${file ? "border-green-500 bg-green-50" : "border-slate-200 bg-white"}`}
      >
        <div className="flex items-center gap-3 w-[85%]">
          <div
            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md 
            ${file ? "bg-green-100" : "bg-slate-100"}`}
          >
            <FileText
              size={18}
              className={file ? "text-green-600" : "text-slate-500"}
            />
          </div>

          <span
            className={`text-sm truncate block
            ${error
              ? "text-red-600"
              : file
              ? "text-green-700 font-medium"
              : "text-slate-500"}`}
          >
            {error || formatFileName(file)}
          </span>
        </div>

        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.png"
          onChange={onChange}
          disabled={disabled}
        />
        
        {file && !error && (
          <div className="text-green-600 flex-shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        )}
      </label>

      <p className="text-[10px] text-red-600 font-medium">
        PDF / JPG / PNG (Max 2MB)
      </p>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */


const SUGGESTIONS = {
  technical: ["Software Engineering", "Web Development", "Machine Learning", "Data Science", "Python Programming", "React.js", "Node.js", "Artificial Intelligence", "Cloud Computing", "Cyber Security"],
  software: ["Adobe Photoshop", "Visual Studio Code", "Microsoft Excel", "Figma", "Docker", "Jira", "Postman", "Tableau", "AutoCAD", "Final Cut Pro"]
};


export default function ProfessionalForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const professional = useStore((s) => s.professional) || {};
  const updateSection = useStore((s) => s.updateSection);
// States for suggestion dropdowns
  const [openType, setOpenType] = useState(null); // 'technical' or 'software'
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const inputRefs = {
    technical: useRef(null),
    software: useRef(null)
  };

  const addSkill = (category, value) => {
    const val = value.trim();
    const currentSkills = professional.skills?.[category] || [];
    
    if (val && !currentSkills.includes(val)) {
      updateSection("professional", {
        ...professional,
        skills: {
          ...professional.skills,
          [category]: [...currentSkills, val],
        },
      });
    }
    setSearch("");
    setOpenType(null);
    setActiveIndex(-1);
    // Keep focus on the input so you can keep typing immediately
    inputRefs[category].current?.focus();
  };

  const handleKeyDown = (e, category, filtered) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpenType(category);
      setActiveIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex]) {
        addSkill(category, filtered[activeIndex]);
      } else if (search) {
        addSkill(category, search);
      }
    } else if (e.key === "Escape") {
      setOpenType(null);
    }
  };



  const removeSkill = (category, index) => {
    updateSection("professional", {
      ...professional,
      skills: {
        ...professional.skills,
        [category]: professional.skills[category].filter((_, i) => i !== index),
      },
    });
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!openType) return;
      
      const filtered = SUGGESTIONS[openType].filter(s => 
        s.toLowerCase().includes(search.toLowerCase())
      );

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && filtered[activeIndex]) {
            addSkill(openType, filtered[activeIndex]);
          } else if (search) {
            addSkill(openType, search);
          }
          break;
        case "Escape":
          setOpenType(null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openType, search, activeIndex]);

  // Click Outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpenType(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSave = () => {
    console.log("Saved Professional Data Structure:", professional);
  };


  // Handler for files within arrays (publications, conferences, etc.)
  const handleArrayFile = (file, index, key) => {
    const sizeMB = file.size / (1024 * 1024);
    const arr = [...(professional[key] || [])];
    
    if (sizeMB > 2) {
      arr[index] = { ...arr[index], docName: "", fileError: "Max 2MB allowed" };
    } else {
      arr[index] = { ...arr[index], docName: file.name, fileError: "" };
    }
    
    updateSection("professional", { [key]: arr });
  };

  return (
    <FormWrapper
      title="Professional & Research"
      description="Manage publications, conferences, experience, and skills."
      onSave={handleSave}
    >
      {/* ================= JOURNAL ================= */}
      <FormSection title="Journal Publications" icon={BookOpen}>
        <div className="md:col-span-2 space-y-6">
          {(professional.publications || []).map((j, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl grid md:grid-cols-2 gap-4 relative">
              <button
                onClick={() =>
                  updateSection("professional", {
                    publications: professional.publications.filter((_, i) => i !== index),
                  })
                }
                className="absolute right-0 top-0 text-red-500 p-4"
              >
                <Trash2 size={16} />
              </button>

              <InputField
                label="Journal Name"
                value={j.name || ""}
                onChange={(e) => {
                  const arr = [...professional.publications];
                  arr[index].name = e.target.value;
                  updateSection("professional", { publications: arr });
                }}
              />

              <InputField
                label="ISSN"
                value={j.issn || ""}
                onChange={(e) => {
                  const arr = [...professional.publications];
                  arr[index].issn = e.target.value;
                  updateSection("professional", { publications: arr });
                }}
              />

              <InputField
                label="Year"
                value={j.year || ""}
                onChange={(e) => {
                  const arr = [...professional.publications];
                  arr[index].year = e.target.value;
                  updateSection("professional", { publications: arr });
                }}
              />

              <FileInput
                label="Upload Publication"
                file={j.docName}
                error={j.fileError}
                disabled={isSubmitted}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleArrayFile(file, index, "publications");
                }}
              />
            </div>
          ))}

          <button
            onClick={() =>
              updateSection("professional", {
                publications: [
                  ...(professional.publications || []),
                  { name: "", issn: "", year: "", docName: "" },
                ],
              })
            }
            className="flex items-center gap-2 text-primary font-medium"
          >
            <Plus size={16} /> Add Journal
          </button>
        </div>
      </FormSection>

    {/* ================= CONFERENCE ================= */}
      <FormSection title="Conference Presentation" icon={Users}>
        <div className="md:col-span-2 space-y-6">
          {(professional.conferences || []).map((c, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl grid md:grid-cols-2 gap-4 relative">
              <button
                onClick={() =>
                  updateSection("professional", {
                    conferences: professional.conferences.filter((_, i) => i !== index),
                  })
                }
                className="absolute right-0 top-0 text-red-500 p-4"
              >
                <Trash2 size={16} />
              </button>

              <InputField
                label="Conference Name"
                value={c.name || ""}
                onChange={(e) => {
                  const arr = [...professional.conferences];
                  arr[index].name = e.target.value;
                  updateSection("professional", { conferences: arr });
                }}
              />

              {/* ✅ ADDED PAPER TITLE INPUT BACK HERE */}
              <InputField
                label="Paper Title"
                value={c.title || ""}
                onChange={(e) => {
                  const arr = [...professional.conferences];
                  arr[index].title = e.target.value;
                  updateSection("professional", { conferences: arr });
                }}
              />

              <FileInput
                label="Upload Presentation Proof"
                file={c.docName}
                error={c.fileError}
                disabled={isSubmitted}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleArrayFile(file, index, "conferences");
                }}
              />
            </div>
          ))}

          <button
            onClick={() =>
              updateSection("professional", {
                conferences: [
                  ...(professional.conferences || []),
                  { name: "", title: "", docName: "" },
                ],
              })
            }
            className="flex gap-2 text-primary font-medium"
          >
            <Plus size={16} /> Add Conference
          </button>
        </div>
      </FormSection>

{/* ================= EXPERIENCE ================= */}
      <FormSection title="Work Experience" icon={Briefcase}>
        <div className="md:col-span-2 space-y-6">
          {(professional.experience || []).map((exp, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl grid md:grid-cols-2 gap-4 relative">
              <button
                onClick={() =>
                  updateSection("professional", {
                    experience: professional.experience.filter((_, i) => i !== index),
                  })
                }
                className="absolute right-0 top-0 text-red-500 p-4"
              >
                <Trash2 size={16} />
              </button>

              {/* Company Input */}
              <InputField
                label="Company"
                value={exp.company || ""}
                onChange={(e) => {
                  const arr = [...professional.experience];
                  arr[index].company = e.target.value;
                  updateSection("professional", { experience: arr });
                }}
              />

              {/* Designation Input */}
              <InputField
                label="Designation"
                value={exp.role || ""}
                onChange={(e) => {
                  const arr = [...professional.experience];
                  arr[index].role = e.target.value;
                  updateSection("professional", { experience: arr });
                }}
              />

              {/* Year Input */}
              <InputField
                label="Year of Experience"
                placeholder="e.g. 2 Years"
                value={exp.year || ""}
                onChange={(e) => {
                  const arr = [...professional.experience];
                  arr[index].year = e.target.value;
                  updateSection("professional", { experience: arr });
                }}
              />

              {/* Upload Document Input */}
              <FileInput
                label="Experience Certificate"
                file={exp.docName}
                error={exp.fileError}
                disabled={isSubmitted}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleArrayFile(file, index, "experience");
                }}
              />
            </div>
          ))}

          <button
            onClick={() =>
              updateSection("professional", {
                experience: [
                  ...(professional.experience || []),
                  { company: "", role: "", year: "", docName: "" },
                ],
              })
            }
            className="flex gap-2 text-primary font-medium"
          >
            <Plus size={16} /> Add Experience
          </button>
        </div>
      </FormSection>

      {/* ================= PATENT ================= */}
      <FormSection title="Patent Document" icon={BookOpen}>
        <div className="md:col-span-1">
          <FileInput
            label="Upload Patent Document"
            file={professional.patent?.docName}
            error={professional.patent?.fileError}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              updateSection("professional", {
                patent: { docName: file.name, fileError: "" },
              });
            }}
          />
        </div>
      </FormSection>

      {/* ================= MEMBERSHIP ================= */}
      <FormSection title="Membership Proof" icon={Users}>
        <div className="md:col-span-1">
          <FileInput
            label="Upload Membership Proof"
            file={professional.membership?.docName}
            error={professional.membership?.fileError}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              updateSection("professional", {
                membership: { docName: file.name, fileError: "" },
              });
            }}
          />
        </div>
      </FormSection>

 {/* ================= SKILLS ================= */}
<FormSection title="Skills & Software" icon={Lightbulb}>
        <div className="md:col-span-2 space-y-8" ref={dropdownRef}>
          {['technical', 'software'].map((category) => {
            const filtered = search.length > 0 
              ? SUGGESTIONS[category].filter(s => s.toLowerCase().startsWith(search.toLowerCase()))
              : [];

            return (
              <div key={category} className="space-y-3 relative">
                <label className="block text-sm font-medium capitalize text-slate-600">
                  {category} Skills
                </label>

                <div className="relative">
                  <input
                    ref={inputRefs[category]}
                    type="text"
                    disabled={isSubmitted}
                    placeholder={`Type to search ${category} skills...`}
                    value={openType === category ? search : ""}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setOpenType(category);
                        setActiveIndex(-1);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, category, filtered)}
                    onBlur={() => setTimeout(() => setOpenType(null), 200)}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none",
                      "bg-white border-slate-200 text-slate-700 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      openType === category && filtered.length > 0 && "ring-2 ring-primary/20 border-primary"
                    )}
                  />

                  {/* Dropdown Styled like SelectField */}
                  {openType === category && filtered.length > 0 && (
                    <div className="absolute z-50 mt-1 left-0 w-full animate-dropdown">
                      <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden ring-1 ring-black/5">
                        <div className="max-h-48 overflow-y-auto">
                          {filtered.map((suggestion, idx) => (
                            <div
                              key={idx}
                              onMouseEnter={() => setActiveIndex(idx)}
                              onClick={() => addSkill(category, suggestion)}
                              className={cn(
                                "px-4 py-3 text-sm cursor-pointer transition-colors",
                                activeIndex === idx ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-50"
                              )}
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(professional.skills?.[category] || []).map((s, i) => (
                    <span key={i} className={cn(
                      "px-3 py-1 rounded-full text-sm flex items-center gap-2 border animate-in zoom-in-95",
                      category === 'technical' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'
                    )}>
                      {s}
                      <X size={14} className="cursor-pointer hover:opacity-70" onClick={() => {
                        const updated = professional.skills[category].filter((_, index) => index !== i);
                        updateSection("professional", { ...professional, skills: { ...professional.skills, [category]: updated } });
                      }} />
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </FormSection>
    </FormWrapper>
  );
}