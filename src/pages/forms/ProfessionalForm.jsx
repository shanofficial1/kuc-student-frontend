import React, { useState ,useRef ,useEffect} from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
  FileInput,
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



/* ================= MAIN COMPONENT ================= */


const SUGGESTIONS = {
  technical: ["Software Engineering", "Web Development", "Machine Learning", "Data Science", "Python Programming", "React.js", "Node.js", "Artificial Intelligence", "Cloud Computing", "Cyber Security"],
  software: ["Adobe Photoshop", "Visual Studio Code", "Microsoft Excel", "Figma", "Docker", "Jira", "Postman", "Tableau", "AutoCAD", "Final Cut Pro"]
};


export default function ProfessionalForm() {
const isSubmitted = useStore((s) => s.isSubmitted);
  const professional = useStore((s) => s.professional) || {};
  const updateSection = useStore((s) => s.updateSection);

  const [openType, setOpenType] = useState(null);
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
        skills: { ...professional.skills, [category]: [...currentSkills, val] },
      });
    }
    setSearch("");
    setOpenType(null);
    setActiveIndex(-1);
    inputRefs[category].current?.focus();
  };

  const handleKeyDown = (e, category, filtered) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpenType(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

 const handleArrayFile = (file, index, key) => {
  // 150KB in bytes
  const limitBytes = 150 * 1024; 
  const arr = [...(professional[key] || [])];
  
  if (file.size > limitBytes) {
    arr[index] = { 
      ...arr[index], 
      docName: "", 
      fileError: "File too large (Max 150KB allowed)" 
    };
  } else {
    arr[index] = { 
      ...arr[index], 
      docName: file.name, 
      fileError: "" 
    };
  }
  
  updateSection("professional", { [key]: arr });
};

  const handleSave = () => {
    console.log("Saved Professional Data Structure:", professional);
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
  required={false}
  onChange={(e) => {
    const { name, error, file } = e.target;
    
    // We update the specific index in the publications array
    const updatedPubs = [...professional.publications];
    updatedPubs[index] = {
      ...updatedPubs[index],
      docName: name,
      fileError: error,
      docFile: file // The actual binary for submission
    };

    updateSection("professional", { publications: updatedPubs });
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
  required={false}
  onChange={(e) => {
    const { name, error, file } = e.target;
    
    // Create a copy of the conferences array
    const updatedConferences = [...professional.conferences];
    
    // Update the specific record at this index
    updatedConferences[index] = {
      ...updatedConferences[index],
      docName: name,
      fileError: error,
      docFile: file // Binary file object for the actual upload
    };

    // Update the global/section state
    updateSection("professional", { conferences: updatedConferences });
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
  required={false}
  onChange={(e) => {
    const { name, error, file } = e.target;
    
    // Create a copy of the experience array
    const updatedExperience = [...professional.experience];
    
    // Update the specific record at this index
    updatedExperience[index] = {
      ...updatedExperience[index],
      docName: name,
      fileError: error,
      docFile: file // The binary file for storage/upload
    };

    // Update the store
    updateSection("professional", { experience: updatedExperience });
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
  required={false}
  onChange={(e) => {
    const { name, error, file } = e.target;
    
    updateSection("professional", {
      patent: { 
        docName: name, 
        fileError: error,
        docFile: file // Actual binary for submission
      },
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
  required={false}
  onChange={(e) => {
    const { name, error, file } = e.target;
    
    updateSection("professional", {
      membership: { 
        docName: name, 
        fileError: error,
        docFile: file // Binary for submission
      },
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
                                activeIndex === idx ? "bg-blue-100 text-black" : "text-slate-600 hover:bg-slate-50"
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

                {/* Tags Section */}
<div className="flex flex-wrap gap-2 mt-3">
  {(professional.skills?.[category] || []).map((s, i) => (
    <button
      key={i}
      type="button"
      onClick={() => {
        const updated = professional.skills[category].filter((_, index) => index !== i);
        updateSection("professional", { 
          ...professional, 
          skills: { ...professional.skills, [category]: updated } 
        });
      }}
      className={cn(
        "group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all animate-in zoom-in-95",
        "hover:border-red-200 hover:bg-red-50 hover:text-red-700 hover:shadow-sm", // Remove style
        category === 'technical' 
          ? 'bg-blue-50 text-blue-700 border-blue-100' 
          : 'bg-purple-50 text-purple-700 border-purple-100'
      )}
      title="Click to remove"
    >
      {s}
      <X 
        size={14} 
        className="text-slate-400 group-hover:text-red-500 transition-colors" 
      />
    </button>
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