import React from 'react';
import { useStore } from '../../store';
import FormWrapper, { FormSection, InputField, SelectField, FileInput } from '../../components/FormWrapper';
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
  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
    
    {/* Row 1: Question and Type */}
    <SelectField
      label="Do you have a physical disability?"
      id="isDisabled"
      required={true}
      value={health.isDisabled ? "yes" : "no"}
      disabled={isSubmitted}
      options={[
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
      ]}
      onChange={(e) => {
        const isValDisabled = e.target.value === "yes";
        updateSection("health", { 
          isDisabled: isValDisabled,
          ...(!isValDisabled && { 
            disabilityType: "", 
            disabilityPercentage: "",
            certificateName: "", 
            uploadError: "" 
          })
        });
      }}
    />

    {health.isDisabled && (
      <InputField 
        label="Disability Type" 
        id="disabilityType" 
        value={health.disabilityType || ''} 
        onChange={handleChange} 
        placeholder="e.g. Locomotor" 
        disabled={isSubmitted}
      />
    )}

    {/* Row 2: Percentage and Certificate */}
    {health.isDisabled && (
      <>
        <InputField 
          label="Percentage (%)" 
          id="disabilityPercentage" 
          type="number" 
          value={health.disabilityPercentage || ''} 
          onChange={handleChange} 
          placeholder="Min 40%" 
          disabled={isSubmitted}
        />

        <FileInput
          label="Disability Certificate"
          required={true}
          file={health.certificateName}
          error={health.uploadError}
          disabled={isSubmitted}
          onChange={(e) => {
            const { name, error, file } = e.target;
            updateSection("health", {
              certificateName: name,
              uploadError: error,
              certificateFile: file 
            });
          }}
        />
      </>
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
         <FileInput
  label="Vaccination Certificate"
  required={true}
  file={health.vaccinationDocName}
  error={health.vaccinationUploadError}
  disabled={isSubmitted}
  onChange={(e) => {
    const { name, error, file } = e.target;
    
    updateSection("health", {
      vaccinationDocName: name,
      vaccinationUploadError: error,
      // Store the file object if your backend requires the actual binary
      vaccinationFile: file 
    });
  }}
/>
        )}
      </FormSection>
    </FormWrapper>
  );
}