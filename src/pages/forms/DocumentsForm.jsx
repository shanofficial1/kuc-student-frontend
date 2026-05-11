import React from "react";
import FormWrapper, { FormSection } from "../../components/FormWrapper";
import { FileText, Image as ImageIcon, PenTool, ShieldCheck } from "lucide-react";
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
            {error || (typeof file === "string" ? file.split('/').pop() : file?.name) || "Upload File"}
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

  // Updated handler to support nested objects for legalCertificates
  const handleFile = (key, file, isLegal = false) => {
    const sizeMB = file.size / (1024 * 1024);
    const fileData = sizeMB > 2 
      ? { file: "", error: "Max 2MB allowed" } 
      : { file: file.name, error: "" };

    if (isLegal) {
      // Structure for legalCertificates object
      updateSection("documents", {
        ...documents,
        legalCertificates: {
          ...documents.legalCertificates,
          [key]: fileData
        }
      });
    } else {
      // Standard structure for top-level keys
      updateSection("documents", {
        [key]: fileData,
      });
    }
  };

  const handleSave = () => {
    console.log("Saved Documents Data Structure:", documents);
  };

  return (
    <FormWrapper
      title="Documents Details"
      description="Upload all required documents in PDF, JPG, or PNG format."
      onSave={handleSave}
    >
      {/* ================= PROFILE & SIGNATURE ================= */}
      <FormSection title="Personal Media" icon={ImageIcon}>
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
          <FileInput
            label="Digital Signature"
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

      {/* ================= IDENTITY & ACADEMIC ================= */}
      <FormSection title="Academic & Identity" icon={FileText}>
        <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
          <FileInput
            label="Identity Proof (Passport / Voter ID)"
            file={documents.identityProof?.file}
            error={documents.identityProof?.error}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile("identityProof", file);
            }}
          />
          <FileInput
            label="Academic Transcripts"
            file={documents.transcripts?.file}
            error={documents.transcripts?.error}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile("transcripts", file);
            }}
          />
        </div>
      </FormSection>

      {/* ================= LEGAL CERTIFICATES (SEPARATED) ================= */}
      <FormSection title="Legal Certificates" icon={ShieldCheck}>
        <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
          <FileInput
            label="Caste Certificate"
            file={documents.legalCertificates?.casteCertificate?.file}
            error={documents.legalCertificates?.casteCertificate?.error}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile("casteCertificate", file, true);
            }}
          />

          <FileInput
            label="Income Certificate"
            file={documents.legalCertificates?.incomeCertificate?.file}
            error={documents.legalCertificates?.incomeCertificate?.error}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile("incomeCertificate", file, true);
            }}
          />

          <FileInput
            label="Domicile (Nativity) Certificate"
            file={documents.legalCertificates?.nativityCertificate?.file}
            error={documents.legalCertificates?.nativityCertificate?.error}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile("nativityCertificate", file, true);
            }}
          />

          <FileInput
            label="Non-Creamy Layer Certificate"
            file={documents.legalCertificates?.nonCreamyLayerCertificate?.file}
            error={documents.legalCertificates?.nonCreamyLayerCertificate?.error}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile("nonCreamyLayerCertificate", file, true);
            }}
          />
        </div>
      </FormSection>
    </FormWrapper>
  );
} 