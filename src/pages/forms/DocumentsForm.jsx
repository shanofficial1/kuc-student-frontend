import React from "react";
import FormWrapper, { FormSection, FileInput } from "../../components/FormWrapper";
import { getChangedFields, SECTION_API_KEYS } from "../../lib/utils";
import { FileText, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { useStore } from "../../store";
import useHashFocus from '../../hooks/useHashFocus';
import { useNavigate } from "react-router-dom";
export default function DocumentsForm() {
    const navigate = useNavigate();

  useHashFocus();
  const isSubmitted = useStore((s) => s.isSubmitted);
  const documents = useStore((s) => s.documents) || {};
  const updateSection = useStore((s) => s.updateSection);
  const saveAndRefresh = useStore((s) => s.saveAndRefresh);

  // Helper to extract filename from backend URL or metadata object
  const getFileName = (path) => {
    if (!path) return "";
    if (typeof path === "string") return path.split("/").pop();
    if (typeof path === "object") {
      return path.fileName || path.name || (typeof path.url === "string" ? path.url.split("/").pop() : "");
    }
    return "";
  };

  /**
   * Universal file handler supporting nested structures
   * @param {string} parent - 'identityProof', 'legalCertificates', or top-level key
   * @param {string} child - Specific field name
   * @param {File} file - The file object from input
   */
  const handleFileChange = (parent, child, payload) => {
    // payload may be an event from FileInput ({ target: { file, error } })
    const file = payload?.target?.file ?? payload?.file;
    const error = payload?.target?.error ?? payload?.error ?? "";
    if (!file && error) {
      // Validation error
      updateSection("documents", { [`${child}Error`]: error });
      return;
    }

    if (!file) return;

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 2) {
      updateSection("documents", { [`${child}Error`]: "Max 2MB allowed" });
      return;
    }

    if (parent === "legalCertificates") {
      updateSection("documents", {
        legalCertificates: {
          ...documents.legalCertificates,
          [child]: file.name,
        },
        [`${child}File`]: file,
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
        [`${child}File`]: file,
        [`${child}Error`]: "",
        [child]: file.name,
      });
    }
  };

  // const handleSave = async () => {
  //   const originalDocuments = useStore.getState().profileSnapshot?.documents || {};
  //   const changedDocuments = getChangedFields(originalDocuments, documents);

  //   if (!Object.keys(changedDocuments).length) {
  //     alert('No changes detected in document uploads.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   const sectionKey = SECTION_API_KEYS.documents;

  //   if (changedDocuments.profilePhotoFile && documents.profilePhotoFile instanceof File) {
  //     formData.append('profilePhoto', documents.profilePhotoFile);
  //   }
  //   if (changedDocuments.signatureFile && documents.signatureFile instanceof File) {
  //     formData.append('signature', documents.signatureFile);
  //   }
  //   if (changedDocuments.identityProofFile && documents.identityProofFile instanceof File) {
  //     formData.append('identityProof', documents.identityProofFile);
  //   }
  //   if (changedDocuments.transcriptsFile && documents.transcriptsFile instanceof File) {
  //     formData.append('transcripts', documents.transcriptsFile);
  //   }

  //   ['casteCertificate', 'incomeCertificate', 'nativityCertificate', 'nonCreamyLayerCertificate'].forEach((key) => {
  //     const fileKey = `${key}File`;
  //     if (changedDocuments[fileKey] && documents[fileKey] instanceof File) {
  //       formData.append(key, documents[fileKey]);
  //     }
  //   });

  //   if (changedDocuments.profilePhoto && documents.profilePhoto) {
  //     formData.append('documents[profilePhoto][fileName]', documents.profilePhoto.fileName || documents.profilePhoto);
  //     if (documents.profilePhoto.fileUrl) formData.append('documents[profilePhoto][fileUrl]', documents.profilePhoto.fileUrl);
  //   }

  //   if (changedDocuments.signature && documents.signature) {
  //     formData.append('documents[signature][fileName]', documents.signature.fileName || documents.signature);
  //     if (documents.signature.fileUrl) formData.append('documents[signature][fileUrl]', documents.signature.fileUrl);
  //   }

  //   if (changedDocuments.identityProof && documents.identityProof) {
  //     formData.append('documents[identityProof][document]', documents.identityProof.document || documents.identityProof);
  //   }

  //   if (changedDocuments.transcripts && documents.transcripts) {
  //     (documents.transcripts || []).forEach((t, i) => {
  //       formData.append(`documents[transcripts][${i}][name]`, t.name || '');
  //       formData.append(`documents[transcripts][${i}][file]`, t.file || '');
  //     });
  //   }

  //   if (changedDocuments.legalCertificates && documents.legalCertificates) {
  //     Object.keys(documents.legalCertificates || {}).forEach((k) => {
  //       formData.append(`documents[legalCertificates][${k}]`, documents.legalCertificates[k] || '');
  //     });
  //   }

  //   formData.append('updatedSections[]', sectionKey);
  //   await saveAndRefresh(formData, true);
  // };
const handleSave = async () => {
  navigate("/forms/mentor");
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
            onChange={(e) => handleFileChange(null, "profilePhoto", e)}
          />
          <FileInput
            label="Digital Signature"
            file={getFileName(documents.signature)}
            error={documents.signatureError}
            disabled={isSubmitted}
            onChange={(e) => handleFileChange(null, "signature", e)}
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
            onChange={(e) => handleFileChange("identityProof", "document", e)}
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
            onChange={(e) => handleFileChange("legalCertificates", "casteCertificate", e)}
          />

          <FileInput
            label="Income Certificate"
            file={getFileName(documents.legalCertificates?.incomeCertificate)}
            error={documents.incomeCertificateError}
            disabled={isSubmitted}
            onChange={(e) => handleFileChange("legalCertificates", "incomeCertificate", e)}
          />

          <FileInput
            label="Domicile (Nativity) Certificate"
            file={getFileName(documents.legalCertificates?.nativityCertificate)}
            error={documents.nativityCertificateError}
            disabled={isSubmitted}
            onChange={(e) => handleFileChange("legalCertificates", "nativityCertificate", e)}
          />

          <FileInput
            label="Non-Creamy Layer Certificate"
            file={getFileName(documents.legalCertificates?.nonCreamyLayerCertificate)}
            error={documents.nonCreamyLayerCertificateError}
            disabled={isSubmitted}
            onChange={(e) => handleFileChange("legalCertificates", "nonCreamyLayerCertificate", e)}
          />
        </div>
      </FormSection>
    </FormWrapper>
  );
}