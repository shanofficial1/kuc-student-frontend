import React from 'react';
import { useStore } from '../../store';
import FormWrapper, { FormSection, InputField, SelectField, FileInput } from '../../components/FormWrapper';
import { getChangedFields, SECTION_API_KEYS } from '../../lib/utils';
import { HeartPulse, Accessibility, ShieldCheck, Syringe , Plus, Trash2} from 'lucide-react';
import useHashFocus from '../../hooks/useHashFocus';
import { useNavigate } from "react-router-dom";
export default function HealthForm() {
  useHashFocus();
  const isSubmitted = useStore((s) => s.isSubmitted);
  const health = useStore((state) => state.health);
  const updateSection = useStore((state) => state.updateSection);

const vaccinations = health.vaccinations || [];
  const navigate = useNavigate();
const {vaccinationStatuses,bloodGroups} = useStore();
const saveAndRefresh = useStore((s) => s.saveAndRefresh);
  const fetchCanEdit = useStore((s) => s.fetchCanEdit);

// const handleSave = async () => {
//   const originalHealth = useStore.getState().profileSnapshot?.health || {};
//   const changedHealth = getChangedFields(originalHealth, health);

//   if (!Object.keys(changedHealth).length) {
//     alert("No changes detected in health details.");
//     return;
//   }

//   const formData = new FormData();
//   const sectionKey = SECTION_API_KEYS.health;

//   if (health.disabilityFile instanceof File && changedHealth.disabilityFile) {
//     formData.append("disabilityCertificate", health.disabilityFile);
//   }
//   if (health.vaccinationFile instanceof File && changedHealth.vaccinationFile) {
//     formData.append("vaccinationDoc", health.vaccinationFile);
//   }
//   if ("bloodGroup" in changedHealth) {
//     formData.append("health_details[bloodGroup]", health.bloodGroup || "");
//   }
//   if (changedHealth.physicalDimensions) {
//     formData.append("health_details[physicalDimensions][height]", health.physicalDimensions?.height || "");
//     formData.append("health_details[physicalDimensions][weight]", health.physicalDimensions?.weight || "");
//   }
//   if ("disabilityStatus" in changedHealth) {
//     formData.append("health_details[disabilityStatus]", health.disabilityStatus || "");
//   }
//   if ("disabilityType" in changedHealth || "disabilityPercentage" in changedHealth) {
//     formData.append("health_details[disabilityDetails][disabilityType]", health.disabilityType || "");
//     formData.append("health_details[disabilityDetails][percentage]", health.disabilityPercentage || "");
//   }
//   if ("chronicConditions" in changedHealth) {
//     formData.append("health_details[chronicConditions]", health.chronicConditions || "");
//   }
//   if ("regularMedications" in changedHealth) {
//     formData.append("health_details[regularMedications]", health.regularMedications || "");
//   }
//   if (changedHealth.insurance) {
//     formData.append("health_details[insurance][provider]", health.insurance?.provider || "");
//     formData.append("health_details[insurance][policyNumber]", health.insurance?.policyNumber || "");
//   }
//   if ("vaccinationStatus" in changedHealth) {
//     formData.append("health_details[vaccinationStatus]", health.vaccinationStatus || "");
//   }

//   formData.append("updatedSections[]", sectionKey);

//   await saveAndRefresh(
//     formData,
//     true
//   );
//   await fetchCanEdit();

// };
const handleSave = async () => {
  navigate("/forms/family");
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
          options={bloodGroups}
        />
        <InputField 
          label="Height (cm)" 
          value={health.physicalDimensions?.height || ""} 
          onChange={(e) => handleNestedChange('physicalDimensions', 'height', e.target.value)} 
          placeholder="e.g. 175"
          disabled={isSubmitted} 
        />
        <InputField 
          label="Weight (kg)" 
          value={health.physicalDimensions?.weight || ""} 
          onChange={(e) => handleNestedChange('physicalDimensions', 'weight', e.target.value)} 
          placeholder="e.g. 70"
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
onChange={(e) =>
  updateSection("health", {
    disabilityDetails: {
      ...health.disabilityDetails,
      disabilityType: e.target.value,
    },
  })
}              placeholder="e.g. Locomotor" 
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
}               
onChange={(e) =>
  updateSection("health", {
    disabilityDetails: {
      ...health.disabilityDetails,
      percentage: e.target.value,
    },
  })
}                placeholder="Min 40%" 
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
    
      </FormSection>
      
  <FormSection title="Vaccination Details" icon={Syringe}>
  <div className="space-y-4">

    {vaccinations.map((vaccination, index) => (
      <div
        key={index}
        className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-4 relative"
      >

        {/* Remove */}
        {!isSubmitted && vaccinations.length > 1 && (
          <button
            type="button"
            onClick={() => {
              const updated = vaccinations.filter(
                (_, i) => i !== index
              );

              updateSection("health", {
                vaccinations: updated,
              });
            }}
            className="absolute top-3 right-3 text-red-500 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        )}

     <SelectField
  disabled={isSubmitted}
  label={`Vaccination ${index + 1} Status`}
  id={`vaccinationStatus-${index}`}
  value={vaccination.status || ""}
  onChange={(e) => {
    const updated = [...vaccinations];

    updated[index] = {
      ...updated[index],
      status: e.target.value,
    };

    updateSection("health", {
      vaccinations: updated,
    });
  }}
  options={vaccinationStatuses}
/>

<FileInput
  label="Vaccination Certificate"
  file={vaccination.vaccinationDoc?.name || ""}
  fileUrl={vaccination.vaccinationDoc?.url || ""}
  error={vaccination.uploadError || ""}
  disabled={isSubmitted}
  onChange={(e) => {
    const { file, error } = e.target;

    const updated = [...vaccinations];

    updated[index] = {
      ...updated[index],

      vaccinationFile: file || null,

      vaccinationDoc: file
        ? {
            name: file.name,
            url: "",
          }
        : {
            name: "",
            url: "",
          },

      uploadError: error || "",
    };

    updateSection("health", {
      vaccinations: updated,
    });
  }}
/>
      </div>
    ))}

    {/* Add Vaccination */}
    {!isSubmitted && (
      <button
        type="button"
        onClick={() => {
          updateSection("health", {
            vaccinations: [
              ...vaccinations,
              {
                status: "",
                vaccinationDoc: {
                  name: "",
                  url: "",
                },
                vaccinationFile: null,
                uploadError: "",
              },
            ],
          });
        }}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-primary font-semibold hover:bg-blue-50 transition-all"
      >
        <Plus size={18} />
        Add Vaccination
      </button>
    )}

  </div>
</FormSection>
    </FormWrapper>
  );
}