import React from "react";
import FormWrapper, { FormSection } from "../../components/FormWrapper";
import { FileText, Image as ImageIcon, PenTool } from "lucide-react";
import { useStore } from "../../store";

/* ================= REUSABLE INPUT ================= */

const FileInput = ({
  label,
  file,
  error,
  onChange,
  disabled,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-slate-600">
        {label}
      </label>

      <label
        className={`w-full h-12 flex items-center justify-between px-3 border rounded-lg cursor-pointer transition 
        ${file ? "border-green-500 bg-green-50" : "border-slate-200 bg-white"}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-md 
            ${file ? "bg-green-100" : "bg-slate-100"}`}
          >
            <FileText
              size={18}
              className={file ? "text-green-600" : "text-slate-500"}
            />
          </div>

          <span
            className={`text-sm truncate 
            ${error
              ? "text-red-600"
              : file
              ? "text-green-700 font-medium"
              : "text-slate-500"}`}
          >
            {error || file || "Upload File"}
          </span>
        </div>

        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.png"
          onChange={onChange}
          disabled={disabled}
        />
      </label>

      <p className="text-[10px] text-red-600 font-medium">
        PDF / JPG / PNG (Max 2MB)
      </p>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

export default function DocumentsForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const documents = useStore((s) => s.documents) || {};
  const updateSection = useStore((s) => s.updateSection);

  const handleFile = (key, file) => {
    const sizeMB = file.size / (1024 * 1024);

    if (sizeMB > 2) {
      updateSection("documents", {
        [key]: { file: "", error: "Max 2MB allowed" },
      });
      return;
    }

    updateSection("documents", {
      [key]: { file: file.name, error: "" },
    });
  };

  const handleSave = () => {
    console.log("Saved Documents Data:", documents);
  };

  return (
    <FormWrapper
      title="Documents Details"
      description="Upload all required documents in PDF, JPG, or PNG format."
      onSave={handleSave}
    >
      {/* ================= PROFILE PHOTO ================= */}
      <FormSection title="Profile Photo" icon={ImageIcon}>
        <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
          <FileInput
            label="Profile Photo"
            file={documents.profilePhoto?.file}
            error={documents.profilePhoto?.error}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile("profilePhoto", file);
            }}
          />
        </div>
      </FormSection>

      {/* ================= DIGITAL SIGNATURE ================= */}
      <FormSection title="Digital Signature" icon={PenTool}>
        <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
          <FileInput
            label="Upload Digital Signature"
            file={documents.signature?.file}
            error={documents.signature?.error}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile("signature", file);
            }}
          />
        </div>
      </FormSection>

      {/* ================= DOCUMENTS ================= */}
      <FormSection title="Academic & Identity Documents" icon={FileText}>
        <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
          <FileInput
            label="Scanned Academic Transcripts (PDF)"
            file={documents.transcripts?.file}
            error={documents.transcripts?.error}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile("transcripts", file);
            }}
          />

          <FileInput
            label="Identity Proof (Aadhaar / Passport / Voter ID)"
            file={documents.identity?.file}
            error={documents.identity?.error}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile("identity", file);
            }}
          />

          <FileInput
            label="Caste / Income / Domicile Certificates"
            file={documents.certificates?.file}
            error={documents.certificates?.error}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile("certificates", file);
            }}
          />
        </div>
      </FormSection>
    </FormWrapper>
  );
}