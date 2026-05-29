import React from 'react';
import { useStore } from '../../store';
import FormWrapper, { FormSection, InputField, SelectField, FileInput } from '../../components/FormWrapper';
import { HeartPulse, Accessibility, ShieldCheck, Syringe } from 'lucide-react';

export default function HealthForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const health = useStore((state) => state.health);
  const updateSection = useStore((state) => state.updateSection);



  const saveAndRefresh =
  useStore((s) => s.saveAndRefresh);

const handleSave = async () => {


 
  console.log(
  "HEALTH STATE",
  health
);

console.log(
  "VACCINATION DOC",
  health.vaccinationDoc
);

console.log(
  "VACCINATION FILE",
  health.vaccinationFile
);



  const formData = new FormData();

  
if (health.disabilityFile instanceof File) {

  formData.append(
    "disabilityCertificate",
    health.disabilityFile
  );

}

if (health.vaccinationFile instanceof File) {

  formData.append(
    "vaccinationDoc",
    health.vaccinationFile
  );

}

  formData.append(
    "health_details[bloodGroup]",
    health.bloodGroup || ""
  );

  formData.append(
    "health_details[physicalDimensions][height]",
    health.physicalDimensions?.height || ""
  );

  formData.append(
    "health_details[physicalDimensions][weight]",
    health.physicalDimensions?.weight || ""
  );

  formData.append(
    "health_details[disabilityStatus]",
    health.disabilityStatus
  );

  formData.append(
    "health_details[disabilityDetails][disabilityType]",
    health.disabilityType || ""
  );

  formData.append(
    "health_details[disabilityDetails][percentage]",
    health.disabilityPercentage || ""
  );

 

  formData.append(
    "health_details[chronicConditions]",
    health.chronicConditions || ""
  );

  formData.append(
    "health_details[regularMedications]",
    health.regularMedications || ""
  );

  formData.append(
    "health_details[insurance][provider]",
    health.insurance?.provider || ""
  );

  formData.append(
    "health_details[insurance][policyNumber]",
    health.insurance?.policyNumber || ""
  );

  formData.append(
    "health_details[vaccinationStatus]",
    health.vaccinationStatus || ""
  );





console.log(
  "DISABILITY FILE",
  health.disabilityFile
);

console.log(
  "VACCINATION FILE",
  health.vaccinationFile
);

for (const [key, value] of formData.entries()) {
  console.log(key, value);
}


  await saveAndRefresh(
    formData,
    true
  );

};

  /**
   * Helper for updating nested objects (physicalDimensions & insurance)
   */
  const handleNestedChange = (parent, child, value) => {
    updateSection('health', {
      [parent]: {
        ...health[parent],
        [child]: value
      }
    });
  };

  /**
   * General handler for top-level keys
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    updateSection('health', { [id]: value });
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeKB = file.size / 1024;
    const minSize = 50;
    const maxSize = 150;

    const nameKey = type === 'disability' ? 'certificateName' : 'vaccinationDocName';
    const errorKey = type === 'disability' ? 'uploadError' : 'vaccinationUploadError';
    const urlKey = type === 'disability' ? 'certificateUrl' : 'vaccinationDocUrl';

    // Strict Size Validation
    if (fileSizeKB < minSize || fileSizeKB > maxSize) {
      updateSection("health", {
        [nameKey]: "",
        [errorKey]: `Invalid size (${Math.round(fileSizeKB)}KB). Required: 50-150KB`
      });
      return;
    }

    updateSection("health", {
      [nameKey]: file.name,
      [errorKey]: "",
      [urlKey]: URL.createObjectURL(file),
      // If backend needs the raw file
      [type === 'disability' ? 'disabilityFile' : 'vaccinationFile']: file 
    });
  };

  return (
    <FormWrapper
      title="Health Details"
      description="Update and manage your health records for university requirements."
  onSave={handleSave}
    >
      {/* BASIC HEALTH INFORMATION */}
      <FormSection title="Basic Health Information" icon={HeartPulse}>
        <SelectField
          disabled={isSubmitted}
          label="Blood Group"
          id="bloodGroup"
          value={health.bloodGroup || ""}
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
        <InputField 
          label="Height (cm)" 
          value={health.physicalDimensions?.height || ""} 
          onChange={(e) => handleNestedChange('physicalDimensions', 'height', e.target.value)} 
          placeholder="e.g. 175cm"
          disabled={isSubmitted} 
        />
        <InputField 
          label="Weight (kg)" 
          value={health.physicalDimensions?.weight || ""} 
          onChange={(e) => handleNestedChange('physicalDimensions', 'weight', e.target.value)} 
          placeholder="e.g. 70kg"
          disabled={isSubmitted} 
        />
      </FormSection>

      {/* DISABILITY DETAILS */}
      <FormSection title="Disability Details" icon={Accessibility}>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <SelectField
            label="Do you have a physical disability?"
            id="disabilityStatus"
            required={true}
            value={health.disabilityStatus ? "yes" : "no"}
            disabled={isSubmitted}
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' },
            ]}
            onChange={(e) => {
              const isValDisabled = e.target.value === "yes";
              updateSection("health", { 
                disabilityStatus: isValDisabled,
                // Clear sub-fields if "No" is selected
                ...(!isValDisabled && { 
                  disabilityType: "", 
                  disabilityPercentage: "",
                  certificateName: "", 
                  uploadError: "" 
                })
              });
            }}
          />

          {health.disabilityStatus && (
            <InputField 
              label="Disability Type" 
              id="disabilityType" 
              value={
  health.disabilityDetails?.disabilityType || ""
}
              onChange={handleChange} 
              placeholder="e.g. Locomotor" 
              disabled={isSubmitted}
            />
          )}

          {health.disabilityStatus && (
            <>
              <InputField 
                label="Percentage (%)" 
                id="disabilityPercentage" 
                type="number" 
value={
  health.disabilityDetails?.percentage || ""
}                onChange={handleChange} 
                placeholder="Min 40%" 
                disabled={isSubmitted}
              />
              
    <FileInput
  label="Disability Certificate"
  required
  file={
  health.disabilityCertificate?.name || ""
}
  fileUrl={
    health.disabilityCertificate?.url
  }
  error={health.uploadError}
  disabled={isSubmitted}
 onChange={(e) => {

  const { file, error } = e.target;

  updateSection("health", {

    disabilityFile: file,

    disabilityCertificate: {
      name: file?.name,
      url: ""
    },

    uploadError: error,

  });

}}
/>
            </>
          )}
        </div>
      </FormSection>

      {/* MEDICAL HISTORY */}
      <FormSection title="Medical History" icon={ShieldCheck}>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-600">Chronic Conditions</label>
          <textarea
            id="chronicConditions"
            rows={2}
            disabled={isSubmitted}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            value={health.chronicConditions || ""}
            onChange={handleChange}
            placeholder="e.g. Asthma, Diabetes"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-600">Regular Medications</label>
          <textarea
            id="regularMedications"
            rows={2}
            disabled={isSubmitted}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            value={health.regularMedications || ""}
            onChange={handleChange}
            placeholder="List any daily medications..."
          />
        </div>
      </FormSection>

      {/* INSURANCE & VACCINATION */}
      <FormSection title="Insurance & Vaccination" icon={Syringe}>
        <InputField 
          label="Insurance Provider" 
          value={health.insurance?.provider || ""} 
          onChange={(e) => handleNestedChange('insurance', 'provider', e.target.value)} 
          disabled={isSubmitted} 
        />
        <InputField 
          label="Policy Number" 
          value={health.insurance?.policyNumber || ""} 
          onChange={(e) => handleNestedChange('insurance', 'policyNumber', e.target.value)} 
          disabled={isSubmitted} 
        />
        <SelectField
          disabled={isSubmitted}
          label="Vaccination Status"
          id="vaccinationStatus"
          value={health.vaccinationStatus || ""}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select' },
            { value: 'Completed', label: 'Fully Vaccinated' },
            { value: 'Partially', label: 'Partially Vaccinated' },
            { value: 'None', label: 'Not Vaccinated' },
          ]}
        />

        {(health.vaccinationStatus === 'Completed' || health.vaccinationStatus === 'Partially') && (
      <FileInput
  label="Vaccination Certificate"
  file={
  health.vaccinationDoc?.name || ""
}
  fileUrl={
    health.vaccinationDoc?.url
  }
  error={health.vaccinationUploadError}
  disabled={isSubmitted}
 onChange={(e) => {

  const { file, error } = e.target;

  updateSection("health", {

    vaccinationFile: file,

    vaccinationDoc: {
      name: file?.name,
      url: ""
    },

    vaccinationUploadError: error,

  });

}}
/>
        )}
      </FormSection>
    </FormWrapper>
  );
}