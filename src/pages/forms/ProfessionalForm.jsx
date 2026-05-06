import React from "react";
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

export default function ProfessionalForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const professional = useStore((s) => s.professional);
  const updateSection = useStore((s) => s.updateSection);

  const handleSave = () => {
    console.log("Saved:", professional);
  };

  // ✅ file upload UI
  const FileUpload = ({ item, onChange }) => (
    <label
      className={`w-full h-12 flex items-center gap-3 px-3 border rounded-lg cursor-pointer transition
      ${item?.docName ? "border-green-500 bg-green-50" : "border-slate-200 bg-white"}`}
    >
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-md
        ${item?.docName ? "bg-green-100" : "bg-slate-100"}`}
      >
        <FileText
          size={18}
          className={item?.docName ? "text-green-600" : "text-slate-500"}
        />
      </div>

      <span
        className={`text-sm truncate
        ${item?.fileError
          ? "text-red-600"
          : item?.docName
          ? "text-green-700 font-medium"
          : "text-slate-500"}`}
      >
        {item?.fileError || item?.docName || "Upload Document"}
      </span>

      <input type="file" className="hidden" onChange={onChange} />
    </label>
  );

  // file handler
  const handleFile = (file, index, key) => {
    const arr = [...professional[key]];
    arr[index].docName = file.name;
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
            <div key={index} className="p-4  border border-slate-200 rounded-xl  animate-in slide-in-from-top-2 grid md:grid-cols-2 gap-4 relative">
              {/* delete */}
              <button
                onClick={() =>
                  updateSection("professional", {
                    publications: professional.publications.filter(
                      (_, i) => i !== index
                    ),
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

              <InputField
                type="date"
                label="Date"
                value={j.date || ""}
                onChange={(e) => {
                  const arr = [...professional.publications];
                  arr[index].date = e.target.value;
                  updateSection("professional", { publications: arr });
                }}
              />

                <FileUpload
                  item={j}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file, index, "publications");
                  }}
                />
            </div>
          ))}

          <button
            onClick={() =>
              updateSection("professional", {
                publications: [
                  ...(professional.publications || []),
                  { name: "", issn: "", year: "", date: "", docName: "" },
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
            <div key={index} className="p-4  border border-slate-200 rounded-xl  animate-in slide-in-from-top-2 grid md:grid-cols-2 gap-4 relative">
              <button
                onClick={() =>
                  updateSection("professional", {
                    conferences: professional.conferences.filter(
                      (_, i) => i !== index
                    ),
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

              <InputField
                label="Paper Title"
                value={c.title || ""}
                onChange={(e) => {
                  const arr = [...professional.conferences];
                  arr[index].title = e.target.value;
                  updateSection("professional", { conferences: arr });
                }}
              />

              
                <FileUpload
                  item={c}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file, index, "conferences");
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
            <div key={index} className="p-4  border border-slate-200 rounded-xl  animate-in slide-in-from-top-2 grid md:grid-cols-2 gap-4 relative">
              <button
                onClick={() =>
                  updateSection("professional", {
                    experience: professional.experience.filter(
                      (_, i) => i !== index
                    ),
                  })
                }
                className="absolute right-0 top-0 text-red-500 p-4"
              >
                <Trash2 size={16} />
              </button>

              <InputField
                label="Company"
                value={exp.company || ""}
                onChange={(e) => {
                  const arr = [...professional.experience];
                  arr[index].company = e.target.value;
                  updateSection("professional", { experience: arr });
                }}
              />

              <InputField
                label="Designation"
                value={exp.role || ""}
                onChange={(e) => {
                  const arr = [...professional.experience];
                  arr[index].role = e.target.value;
                  updateSection("professional", { experience: arr });
                }}
              />

              <InputField
                label="Year"
                value={exp.year || ""}
                onChange={(e) => {
                  const arr = [...professional.experience];
                  arr[index].year = e.target.value;
                  updateSection("professional", { experience: arr });
                }}
              />

               <div className="flex flex-col justify-end">
  <FileUpload
    item={exp}
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file, index, "experience");
    }}
  />
</div>
            </div>
          ))}

          <button
            onClick={() =>
              updateSection("professional", {
                experience: [
                  ...(professional.experience || []),
                  { company: "", role: "", year: "" },
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
        <div className="md:col-span-1 space-y-4">
          <label className="block text-sm font-medium text-slate-600">
            Upload Patent Document
          </label>

          <label
            className={`w-full h-12 flex items-center gap-3 px-3 border rounded-lg cursor-pointer transition
            ${professional.patent?.docName ? "border-green-500 bg-green-50" : "border-slate-200 bg-white"}`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-md
              ${professional.patent?.docName ? "bg-green-100" : "bg-slate-100"}`}
            >
              <FileText
                size={18}
                className={
                  professional.patent?.docName
                    ? "text-green-600"
                    : "text-slate-500"
                }
              />
            </div>

            <span
              className={`text-sm truncate
              ${professional.patent?.fileError
                ? "text-red-600"
                : professional.patent?.docName
                ? "text-green-700 font-medium"
                : "text-slate-500"}`}
            >
              {professional.patent?.fileError ||
                professional.patent?.docName ||
                "Upload Patent Document"}
            </span>

            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                updateSection("professional", {
                  patent: { docName: file.name, fileError: "" },
                });
              }}
            />
          </label>
        </div>
      </FormSection>

      {/* ================= MEMBERSHIP ================= */}
      <FormSection title="Membership Proof" icon={Users}>
        <div className="md:col-span-1 space-y-4">
          <label className="block text-sm font-medium text-slate-600">
            Upload Membership Proof
          </label>

          <label
            className={`w-full h-12 flex items-center gap-3 px-3 border rounded-lg cursor-pointer transition
            ${professional.membership?.docName ? "border-green-500 bg-green-50" : "border-slate-200 bg-white"}`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-md
              ${professional.membership?.docName ? "bg-green-100" : "bg-slate-100"}`}
            >
              <FileText
                size={18}
                className={
                  professional.membership?.docName
                    ? "text-green-600"
                    : "text-slate-500"
                }
              />
            </div>

            <span
              className={`text-sm truncate
              ${professional.membership?.fileError
                ? "text-red-600"
                : professional.membership?.docName
                ? "text-green-700 font-medium"
                : "text-slate-500"}`}
            >
              {professional.membership?.fileError ||
                professional.membership?.docName ||
                "Upload Membership Proof"}
            </span>

            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                updateSection("professional", {
                  membership: { docName: file.name, fileError: "" },
                });
              }}
            />
          </label>
        </div>
      </FormSection>

      {/* ================= SKILLS ================= */}
      <FormSection title="Skills & Software" icon={Lightbulb}>
        <div className="md:col-span-2 space-y-4">
          <input
            type="text"
            placeholder="Type skill and press Enter"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const val = e.target.value;
                if (val) {
                  updateSection("professional", {
                    skills: [...(professional.skills || []), val],
                  });
                  e.target.value = "";
                }
              }
            }}
          />

          <div className="flex flex-wrap gap-2">
            {(professional.skills || []).map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 rounded-full text-sm flex items-center gap-2"
              >
                {s}
                <X
                  size={12}
                  className="cursor-pointer"
                  onClick={() => {
                    updateSection("professional", {
                      skills: professional.skills.filter((_, x) => x !== i),
                    });
                  }}
                />
              </span>
            ))}
          </div>
        </div>
      </FormSection>
    </FormWrapper>
  );
}