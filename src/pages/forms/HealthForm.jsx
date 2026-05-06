import React from 'react';
import { useStore } from '../../store';
import FormWrapper, { FormSection, InputField, SelectField } from '../../components/FormWrapper';
import { HeartPulse, Accessibility, ShieldCheck, Syringe, FileText, X, CheckCircle } from 'lucide-react';

export default function HealthForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const health = useStore((state) => state.health);
  const updateSection = useStore((state) => state.updateSection);

  const handleSave = () => {
    console.log('Saved Health Data:', health);
  };

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    const val = type === 'checkbox' ? e.target.checked : value;
    updateSection('health', { ...health, [id]: val });
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeKB = file.size / 1024;
    const minSize = 50;
    const maxSize = 150;

    // Determine which keys to update based on the upload type
    const nameKey = type === 'disability' ? 'certificateName' : 'vaccinationDocName';
    const errorKey = type === 'disability' ? 'uploadError' : 'vaccinationUploadError';
    const urlKey = type === 'disability' ? 'certificateUrl' : 'vaccinationDocUrl';

    // 🔥 Strict Validation: 50KB to 150KB
    if (fileSizeKB < minSize || fileSizeKB > maxSize) {
      updateSection("health", {
        [nameKey]: "",
        [errorKey]: `Invalid size (${Math.round(fileSizeKB)}KB). Required: 50-150KB`
      });
      return;
    }

    // Success: Clear errors and update store
    updateSection("health", {
      [nameKey]: file.name,
      [errorKey]: "",
      [urlKey]: URL.createObjectURL(file)
    });
  };

  return (
    <FormWrapper
      title="Health Details"
      description="Update and manage your health records for university requirements."
      onSave={handleSave}
    >
      {/* ================= BASIC HEALTH ================= */}
      <FormSection title="Basic Health Information" icon={HeartPulse}>
        <SelectField
          disabled={isSubmitted}
          label="Blood Group"
          id="bloodGroup"
          value={health.bloodGroup}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select' },
            { value: 'A+', label: 'A+' },
            { value: 'A-', label: 'A-' },
            { value: 'B+', label: 'B+' },
            { value: 'B-', label: 'B-' },
            { value: 'O+', label: 'O+' },
            { value: 'O-', label: 'O-' },
            { value: 'AB+', label: 'AB+' },
            { value: 'AB-', label: 'AB-' },
          ]}
        />
        <InputField label="Height (cm)" id="height" type="number" value={health.height} onChange={handleChange} disabled={isSubmitted} />
        <InputField label="Weight (kg)" id="weight" type="number" value={health.weight} onChange={handleChange} disabled={isSubmitted} />
      </FormSection>

      {/* ================= DISABILITY ================= */}
      <FormSection title="Disability Details" icon={Accessibility}>
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <input
              type="checkbox"
              id="isDisabled"
              className="w-5 h-5 text-primary rounded border-slate-300 focus:ring-primary transition-all cursor-pointer"
              checked={health.isDisabled}
              disabled={isSubmitted}
              onChange={(e) => updateSection("health", { isDisabled: e.target.checked })}
            />
            <label htmlFor="isDisabled" className="text-sm font-semibold text-slate-700 cursor-pointer">
              I have a physical disability
            </label>
          </div>

          {health.isDisabled && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Disability Type" id="disabilityType" value={health.disabilityType} onChange={handleChange} placeholder="e.g. Locomotor" disabled={isSubmitted} />
                <InputField label="Percentage (%)" id="disabilityPercentage" type="number" value={health.disabilityPercentage} onChange={handleChange} placeholder="Min 40%" disabled={isSubmitted} />

                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-slate-600">
                    Disability Certificate <span className="text-status-error">*</span>
                  </label>

                  <label
                    className={`w-full h-12 flex items-center justify-between px-3 border rounded-lg cursor-pointer transition
                      ${health.certificateName
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                      } ${isSubmitted ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-md 
                        ${health.certificateName ? "bg-green-100" : "bg-slate-100"}`}
                      >
                        <FileText
                          size={18}
                          className={health.certificateName ? "text-green-600" : "text-slate-500"}
                        />
                      </div>

                      <span className={`text-sm max-w-[180px] truncate block ${
                        health.uploadError ? "text-red-600" : health.certificateName ? "text-green-700 font-medium" : "text-slate-500"
                      }`}>
                        {health.uploadError || health.certificateName || "Upload Certificate (PDF/Image)"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {health.certificateName && !health.uploadError && (
                        <ShieldCheck size={18} className="text-green-600" />
                      )}
                    </div>

                    <input
                      type="file"
                      id="disabilityCertificate"
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={isSubmitted}
                      onChange={(e) => handleFileUpload(e, 'disability')}
                      className="hidden"
                    />
                  </label>

                  <p className={`text-xs font-medium ${health.uploadError ? "text-red-600" : "text-slate-500"}`}>
                    Required size: 50–150 KB only.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </FormSection>

      {/* ================= MEDICAL HISTORY ================= */}
      <FormSection title="Medical History" icon={ShieldCheck}>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-600">Chronic Conditions</label>
          <textarea
            id="chronicConditions"
            rows={2}
            disabled={isSubmitted}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            value={health.chronicConditions}
            onChange={handleChange}
            placeholder="e.g. Asthma, Diabetes"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-600">Regular Medications</label>
          <textarea
            id="medications"
            rows={2}
            disabled={isSubmitted}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            value={health.medications}
            onChange={handleChange}
          />
        </div>
      </FormSection>

      {/* ================= INSURANCE & VACCINATION ================= */}
      <FormSection title="Insurance & Vaccination" icon={Syringe}>
        <InputField label="Insurance Provider" id="insuranceProvider" value={health.insuranceProvider} onChange={handleChange} disabled={isSubmitted} />
        <InputField label="Policy Number" id="policyNo" value={health.policyNo} onChange={handleChange} disabled={isSubmitted} />
        <SelectField
          disabled={isSubmitted}
          label="Vaccination Status"
          id="vaccinationStatus"
          value={health.vaccinationStatus}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select' },
            { value: 'fully', label: 'Fully Vaccinated' },
            { value: 'partially', label: 'Partially Vaccinated' },
            { value: 'none', label: 'Not Vaccinated' },
          ]}
        />

        {/* Show upload only if vaccinated */}
        {(health.vaccinationStatus === 'fully' || health.vaccinationStatus === 'partially') && (
          <div className="flex flex-col gap-2 animate-in fade-in zoom-in duration-200">
            <label className="block text-sm font-medium text-slate-600">
              Vaccination Certificate <span className="text-status-error">*</span>
            </label>

            <label
              className={`w-full h-12 flex items-center justify-between px-3 border rounded-lg cursor-pointer transition
                ${health.vaccinationDocName
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
                } ${isSubmitted ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded-md 
                  ${health.vaccinationDocName ? "bg-green-100" : "bg-slate-100"}`}
                >
                  <FileText
                    size={18}
                    className={health.vaccinationDocName ? "text-green-600" : "text-slate-500"}
                  />
                </div>

                <span className={`text-sm max-w-[180px] truncate block ${
                  health.vaccinationUploadError ? "text-red-600" : health.vaccinationDocName ? "text-green-700 font-medium" : "text-slate-500"
                }`}>
                  {health.vaccinationUploadError || health.vaccinationDocName || "Upload Certificate (PDF/Image)"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {health.vaccinationDocName && !health.vaccinationUploadError && (
                  <CheckCircle size={18} className="text-green-600" />
                )}
                {health.vaccinationDocName && !isSubmitted && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      updateSection("health", { vaccinationDocName: "", vaccinationUploadError: "" });
                    }}
                    className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <input
                type="file"
                id="vaccinationCertificate"
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={isSubmitted}
                onChange={(e) => handleFileUpload(e, 'vaccination')}
                className="hidden"
              />
            </label>

            <p className={`text-xs font-medium ${health.vaccinationUploadError ? "text-red-600" : "text-slate-500"}`}>
              Required size: 50–150 KB only.
            </p>
          </div>
        )}
      </FormSection>
    </FormWrapper>
  );
}