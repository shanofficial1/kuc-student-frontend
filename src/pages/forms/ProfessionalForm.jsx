import React, { useState } from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
  FileInput,
  SelectField,
} from "../../components/FormWrapper";
import {
  BookOpen,
  Users,
  Briefcase,
  Plus,
  Trash2,
  Lightbulb,
  X,
} from "lucide-react";

export default function ProfessionalForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const professional = useStore((s) => s.professional) || {};
  const updateSection = useStore((s) => s.updateSection);
  console.log("Professional State:", professional); // Debugging log
  const [skillInput, setSkillInput] = useState("");

  const currentSkills = typeof professional.skills === 'string' 
    ? professional.skills.split(",").filter(s => s.trim() !== "") 
    : [];

  const handleArrayUpdate = (key, index, field, value) => {
    const arr = [...(professional[key] || [])];
    arr[index] = { ...arr[index], [field]: value };
    updateSection("professional", { [key]: arr });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      // 🔥 Logic: Convert to Uppercase before adding to the list
      const upperSkill = skillInput.trim().toUpperCase();
      
      if (!currentSkills.includes(upperSkill)) {
        const newSkills = [...currentSkills, upperSkill].join(",");
        updateSection("professional", { skills: newSkills });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    const newSkills = currentSkills.filter((s) => s !== skill).join(",");
    updateSection("professional", { skills: newSkills });
  };

  return (
    <FormWrapper
      title="Professional & Research"
      description="Manage publications, conferences, experience, and skills."
      onSave={() => console.log("Saving Professional:", professional)}
    >
      {/* ================= JOURNAL PUBLICATIONS ================= */}
      <FormSection title="Journal Publications" icon={BookOpen}>
        <div className="md:col-span-2 space-y-6">
          {(professional.publications || []).map((pub, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl grid md:grid-cols-2 gap-4 relative bg-slate-50">
              <button
                type="button"
                onClick={() => updateSection("professional", { publications: professional.publications.filter((_, i) => i !== index) })}
                className="absolute right-0 top-0 text-red-500 p-4"
              >
                <Trash2 size={16} />
              </button>
              <InputField label="Journal Name" value={pub.journal || ""} onChange={(e) => handleArrayUpdate("publications", index, "journal", e.target.value)} />
              <InputField label="ISSN" value={pub.issn || ""} onChange={(e) => handleArrayUpdate("publications", index, "issn", e.target.value)} />
              <InputField label="Year" value={pub.date ? pub.date.split("-")[0] : ""} onChange={(e) => handleArrayUpdate("publications", index, "date", e.target.value)} />
              <FileInput
                label="Upload Publication"
                file={pub.docName || pub.url?.split('/').pop()}
                error={pub.fileError}
                disabled={isSubmitted}
                onChange={(e) => {
                  const { name, error, file } = e.target;
                  const arr = [...professional.publications];
                  arr[index] = { ...arr[index], docName: name, fileError: error, docFile: file };
                  updateSection("professional", { publications: arr });
                }}
              />
            </div>
          ))}
          <button type="button" onClick={() => updateSection("professional", { publications: [...(professional.publications || []), {}] })} className="flex items-center gap-2 text-primary font-medium">
            <Plus size={16} /> Add Journal
          </button>
        </div>
      </FormSection>

      {/* ================= CONFERENCE PRESENTATION ================= */}
      <FormSection title="Conference Presentation" icon={Users}>
        <div className="md:col-span-2 space-y-6">
          {(professional.conferences || []).map((conf, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl grid md:grid-cols-2 gap-4 relative bg-slate-50">
              <button type="button" onClick={() => updateSection("professional", { conferences: professional.conferences.filter((_, i) => i !== index) })} className="absolute right-0 top-0 text-red-500 p-4">
                <Trash2 size={16} />
              </button>
              <InputField label="Conference Name" value={conf.name || ""} onChange={(e) => handleArrayUpdate("conferences", index, "name", e.target.value)} />
              <InputField label="Paper Title" value={conf.title || ""} onChange={(e) => handleArrayUpdate("conferences", index, "title", e.target.value)} />
              <FileInput
                label="Upload Presentation Proof"
                className="md:col-span-2"
                file={conf.docName || conf.url?.split('/').pop()}
                error={conf.fileError}
                disabled={isSubmitted}
                onChange={(e) => {
                  const { name, error, file } = e.target;
                  const arr = [...professional.conferences];
                  arr[index] = { ...arr[index], docName: name, fileError: error, docFile: file };
                  updateSection("professional", { conferences: arr });
                }}
              />
            </div>
          ))}
          <button type="button" onClick={() => updateSection("professional", { conferences: [...(professional.conferences || []), {}] })} className="flex gap-2 text-primary font-medium">
            <Plus size={16} /> Add Conference
          </button>
        </div>
      </FormSection>

      {/* ================= WORK EXPERIENCE ================= */}
      <FormSection title="Work Experience" icon={Briefcase}>
        <div className="md:col-span-2 space-y-6">
          {(professional.experience || []).map((exp, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl grid md:grid-cols-2 gap-4 relative bg-slate-50">
              <button type="button" onClick={() => updateSection("professional", { experience: professional.experience.filter((_, i) => i !== index) })} className="absolute right-0 top-0 text-red-500 p-4">
                <Trash2 size={16} />
              </button>
              <InputField label="Company" value={exp.company || ""} onChange={(e) => handleArrayUpdate("experience", index, "company", e.target.value)} />
              <InputField label="Designation" value={exp.designation || ""} onChange={(e) => handleArrayUpdate("experience", index, "designation", e.target.value)} />
              <InputField label="Year of Experience" value={exp.years || ""} onChange={(e) => handleArrayUpdate("experience", index, "years", e.target.value)} />
              <FileInput
                label="Experience Certificate"
                file={exp.docName || exp.url?.split('/').pop()}
                error={exp.fileError}
                disabled={isSubmitted}
                onChange={(e) => {
                  const { name, error, file } = e.target;
                  const arr = [...professional.experience];
                  arr[index] = { ...arr[index], docName: name, fileError: error, docFile: file };
                  updateSection("professional", { experience: arr });
                }}
              />
            </div>
          ))}
          <button type="button" onClick={() => updateSection("professional", { experience: [...(professional.experience || []), {}] })} className="flex gap-2 text-primary font-medium">
            <Plus size={16} /> Add Experience
          </button>
        </div>
      </FormSection>

      {/* ================= PATENTS ================= */}
      <FormSection title="Patents" icon={Briefcase}>
        <div className="md:col-span-2 space-y-6">
          {(professional.patents || []).map((pat, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl grid md:grid-cols-2 gap-4 relative bg-slate-50">
              <button type="button" onClick={() => updateSection("professional", { patents: professional.patents.filter((_, i) => i !== index) })} className="absolute right-0 top-0 text-red-500 p-4">
                <Trash2 size={16} />
              </button>
              <InputField label="Patent Title" value={pat.title || ""} onChange={(e) => handleArrayUpdate("patents", index, "title", e.target.value)} />
              <SelectField 
                label="Status" 
                value={pat.status || ""} 
                onChange={(e) => handleArrayUpdate("patents", index, "status", e.target.value)}
                options={[
                    { value: "Filed", label: "Filed" },
                    { value: "Published", label: "Published" },
                    { value: "Granted", label: "Granted" }
                ]}
              />
              <FileInput
                label="Upload Patent Document"
                className="md:col-span-2"
                file={pat.docName || pat.document?.split('/').pop()}
                error={pat.fileError}
                disabled={isSubmitted}
                onChange={(e) => {
                  const { name, error, file } = e.target;
                  const arr = [...professional.patents];
                  arr[index] = { ...arr[index], docName: name, fileError: error, docFile: file };
                  updateSection("professional", { patents: arr });
                }}
              />
            </div>
          ))}
          <button type="button" onClick={() => updateSection("professional", { patents: [...(professional.patents || []), {}] })} className="flex gap-2 text-primary font-medium">
            <Plus size={16} /> Add Patent
          </button>
        </div>
      </FormSection>

      {/* ================= MEMBERSHIP ================= */}
     {/* ================= MEMBERSHIP PROOF (Multiple Files) ================= */}
<FormSection title="Membership Proof" icon={Users}>
  <div className="md:col-span-2 space-y-4">
    {/* Map through existing memberships or new uploads */}
    {(professional.membershipProof || []).map((mem, index) => (
      <div key={index} className="flex items-start gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
        <div className="flex-1">
          <FileInput
            label={`Membership Document ${index + 1}`}
            // Check for temporary uploaded name OR existing backend URL filename
            file={mem.docName || mem.url?.split('/').pop()}
            error={mem.fileError}
            disabled={isSubmitted}
            onChange={(e) => {
              const { name, error, file } = e.target;
              const updated = [...professional.membershipProof];
              updated[index] = { 
                ...updated[index], 
                docName: name, 
                fileError: error, 
                docFile: file 
              };
              updateSection("professional", { membershipProof: updated });
            }}
          />
        </div>
        
        {!isSubmitted && (
          <button
            type="button"
            onClick={() => {
              const updated = professional.membershipProof.filter((_, i) => i !== index);
              updateSection("professional", { membershipProof: updated });
            }}
            className="mt-8 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    ))}

    {/* Add More Button */}
    {!isSubmitted && (
      <button
        type="button"
        onClick={() => {
          const current = professional.membershipProof || [];
          updateSection("professional", { 
            membershipProof: [...current, { docName: "", url: "" }] 
          });
        }}
        className="flex items-center gap-2 text-sm font-semibold text-primary hover:bg-blue-50 px-4 py-2 rounded-lg transition-all w-fit"
      >
        <Plus size={16} />
        Add Another Membership Proof
      </button>
    )}
  </div>
</FormSection>

      {/* ================= SKILLS ================= */}
      <FormSection title="Skills & Software" icon={Lightbulb}>
        <div className="md:col-span-2 space-y-3">
          <label className="block text-sm font-medium text-slate-600">Technical & Software Skills</label>
          <input
            type="text"
            disabled={isSubmitted}
            placeholder="Type skill and press Enter..."
            value={skillInput}
            // 🔥 Visual: Force text to look uppercase in input
            onChange={(e) => setSkillInput(e.target.value.toUpperCase())}
            onKeyDown={handleSkillKeyDown}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {currentSkills.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => removeSkill(s)}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-100 bg-blue-50 text-blue-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
              >
                {s} <X size={14} className="text-slate-400 group-hover:text-red-500" />
              </button>
            ))}
          </div>
        </div>
      </FormSection>
    </FormWrapper>
  );
}