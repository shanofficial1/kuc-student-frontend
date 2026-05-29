import React from "react";
import FormWrapper, { FormSection, FileInput } from "../../components/FormWrapper";
import { FileText, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { useStore } from "../../store";

export default function DocumentsForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const documents = useStore((s) => s.documents) || {};
  const updateSection = useStore((s) => s.updateSection);

  // Helper to extract filename from backend URL
  const getFileName = (path) => (path ? path.split("/").pop() : "");

  /**
   * Universal file handler supporting nested structures
   * @param {string} parent - 'identityProof', 'legalCertificates', or top-level key
   * @param {string} child - Specific field name
   * @param {File} file - The file object from input
   */
  const handleFileChange = (parent, child, file) => {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 2) {
      updateSection("documents", { [`${child}Error`]: "Max 2MB allowed" });
      return;
    }

    if (parent === "legalCertificates") {
      updateSection("documents", {
        legalCertificates: {
          ...documents.legalCertificates,
          [child]: file.name, // Local display name
        },
        [`${child}File`]: file, // Store binary for upload
        [`${child}Error`]: "",
      });
    } else if (parent === "identityProof") {
      updateSection("documents", {
        identityProof: { ...documents.identityProof, document: file.name },
        identityProofFile: file,
        identityProofError: "",
      });
    } else {
      // Top level like profilePhoto or signature
      updateSection("documents", {
        [child]: file.name,
        [`${child}File`]: file,
        [`${child}Error`]: "",
      });
    }
  };

  const handleSave = () => {
    console.log("Saving Documents State:", documents);
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
            file={getFileName(documents.profilePhoto)}
            error={documents.profilePhotoError}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(null, "profilePhoto", file);
            }}
          />
          <FileInput
            label="Digital Signature"
            file={getFileName(documents.signature)}
            error={documents.signatureError}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(null, "signature", file);
            }}
          />
        </div>
      </FormSection>

      {/* ================= IDENTITY & ACADEMIC ================= */}
      <FormSection title="Academic & Identity" icon={FileText}>
        <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
          <FileInput
            label="Identity Proof (Passport / Voter ID)"
            file={getFileName(documents.identityProof?.document)}
            error={documents.identityProofError}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange("identityProof", "document", file);
            }}
          />
          <FileInput
            label="Academic Transcripts"
            // Shows name from transcripts array first object
            file={documents.transcripts?.[0]?.name || getFileName(documents.transcripts?.[0]?.file)}
            error={documents.transcriptsError}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                  // Simplified for single transcript upload matching JSON array structure
                  updateSection("documents", {
                      transcripts: [{ name: file.name, file: "" }],
                      transcriptsFile: file,
                      transcriptsError: ""
                  });
              }
            }}
          />
        </div>
      </FormSection>

      {/* ================= LEGAL CERTIFICATES ================= */}
      <FormSection title="Legal Certificates" icon={ShieldCheck}>
        <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
          <FileInput
            label="Caste Certificate"
            file={getFileName(documents.legalCertificates?.casteCertificate)}
            error={documents.casteCertificateError}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange("legalCertificates", "casteCertificate", file);
            }}
          />

          <FileInput
            label="Income Certificate"
            file={getFileName(documents.legalCertificates?.incomeCertificate)}
            error={documents.incomeCertificateError}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange("legalCertificates", "incomeCertificate", file);
            }}
          />

          <FileInput
            label="Domicile (Nativity) Certificate"
            file={getFileName(documents.legalCertificates?.nativityCertificate)}
            error={documents.nativityCertificateError}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange("legalCertificates", "nativityCertificate", file);
            }}
          />

          <FileInput
            label="Non-Creamy Layer Certificate"
            file={getFileName(documents.legalCertificates?.nonCreamyLayerCertificate)}
            error={documents.nonCreamyLayerCertificateError}
            disabled={isSubmitted}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange("legalCertificates", "nonCreamyLayerCertificate", file);
            }}
          />
        </div>
      </FormSection>
    </FormWrapper>
  );
}