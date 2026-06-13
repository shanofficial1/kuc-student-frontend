import React from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
  SelectField,
} from "../../components/FormWrapper";
import { getChangedFields, SECTION_API_KEYS } from "../../lib/utils";
import { Home, Bus, Utensils, Bike } from "lucide-react";
import useHashFocus from '../../hooks/useHashFocus';
import { useNavigate } from "react-router-dom";
export default function ResidentialForm() {
  useHashFocus();
  const isSubmitted = useStore((s) => s.isSubmitted);
  // Use `residential` key from store (backend: residential_details)
  const residential = useStore((state) => state.residential) || {};
  const updateSection = useStore((state) => state.updateSection);
  const saveAndRefresh = useStore((s) => s.saveAndRefresh);
  const navigate = useNavigate();

  // Show hostel fields when user is hosteller (case-insensitive)
  const isHosteller =
    String(residential.resType || "").toLowerCase() === "hosteller" ||
    Boolean(residential.hostel && (residential.hostel.roomNo || residential.hostel.bedType));

  
// const handleSave = async () => {
//   const originalResidential = useStore.getState().profileSnapshot?.residential || {};
//   const changedResidential = getChangedFields(originalResidential, residential);

//   if (!Object.keys(changedResidential).length) {
//     alert("No changes detected in residential details.");
//     return;
//   }

//   const formData = new FormData();
//   const sectionKey = SECTION_API_KEYS.residential;

//   if ("resType" in changedResidential) {
//     formData.append("residential_details[resType]", residential.resType || "");
//   }
//   if ("mess" in changedResidential) {
//     formData.append("residential_details[mess]", residential.mess || "");
//   }
//   if ("vehicleReg" in changedResidential) {
//     formData.append("residential_details[vehicleReg]", residential.vehicleReg || "");
//   }
//   if (changedResidential.hostel) {
//     if (residential.hostel.roomNo) {
//       formData.append("residential_details[hostel][roomNo]", residential.hostel.roomNo);
//     }
//     if (residential.hostel.block) {
//       formData.append("residential_details[hostel][block]", residential.hostel.block);
//     }
//     if (residential.hostel.bedType) {
//       formData.append("residential_details[hostel][bedType]", residential.hostel.bedType);
//     }
//   }
//   if (changedResidential.transport) {
//     if (typeof residential.transport?.opted === "boolean") {
//       formData.append("residential_details[transport][opted]", residential.transport.opted);
//     }
//     if (residential.transport?.routeNumber) {
//       formData.append("residential_details[transport][routeNumber]", residential.transport.routeNumber);
//     }
//     if (residential.transport?.boardingPoint) {
//       formData.append("residential_details[transport][boardingPoint]", residential.transport.boardingPoint);
//     }
//   }

//   formData.append("updatedSections[]", sectionKey);

//   await saveAndRefresh(
//     formData,
//     true
//   );

// };
  
const handleSave = async () => {
  navigate("/forms/documents");
};
/**
   * Helper to handle nested state updates
   * @param {string} parent - 'hostel' or 'transport'
   * @param {string} id - the field key
   * @param {any} value - the new value
   */
  const handleNestedChange = (parent, id, value) => {
    updateSection("residential", {
      ...residential,
      [parent]: {
        ...(residential[parent] || {}),
        [id]: value,
      },
    });
  };

  const handleTopLevelChange = (id, value) => {
    updateSection("residential", {
      ...residential,
      [id]: value,
    });
  };

  return (
    <FormWrapper
      title="Residential & Transport"
      description="Manage your accommodation and transportation preferences."
      onSave={handleSave}
    >
      {/* ================= RESIDENTIAL ================= */}
      <FormSection title="Residential Information" icon={Home}>
        <SelectField
          disabled={isSubmitted}
          label="Residential Type"
          id="resType"
          value={residential.resType || ""}
          onChange={(e) => handleTopLevelChange("resType", e.target.value)}
          options={[
            { value: "Day Scholar", label: "Day Scholar" },
            { value: "Hosteller", label: "Hosteller" },
          ]}
        />

        {/* HOSTELLER FIELDS */}
        {isHosteller && (
          <>
            <InputField
              label="Room Number"
              id="roomNo"
              value={residential.hostel?.roomNo || ""}
              onChange={(e) => handleNestedChange("hostel", "roomNo", e.target.value)}
              disabled={isSubmitted}
            />
            <InputField
              label="Hostel Block"
              id="block"
              value={residential.hostel?.block || ""}
              onChange={(e) => handleNestedChange("hostel", "block", e.target.value)}
              disabled={isSubmitted}
            />
            <SelectField
              disabled={isSubmitted}
              label="Bed Type"
              id="bedType"
              value={residential.hostel?.bedType || ""}
              onChange={(e) => handleNestedChange("hostel", "bedType", e.target.value)}
              options={[
                { value: "", label: "Select Bed Type" },
                { value: "Single", label: "Single" },
                { value: "Double Sharing", label: "Double Sharing" },
                { value: "Triple Sharing", label: "Triple Sharing" },
              ]}
            />
          </>
        )}
      </FormSection>

      {/* ================= DINING ================= */}
      <FormSection title="Dining Services" icon={Utensils}>
        <SelectField
          disabled={isSubmitted}
          label="Mess Preference"
          id="mess"
          value={residential.mess || ""}
          onChange={(e) => handleTopLevelChange("mess", e.target.value)}
          options={[
            { value: "Veg", label: "Veg" },
            { value: "Non-Veg", label: "Non-Veg" },
          ]}
        />
      </FormSection>

      {/* ================= TRANSPORT ================= */}
      <FormSection title="Transport Details" icon={Bus}>
        <SelectField
          disabled={isSubmitted}
          label="Opt for University Bus"
          id="opted"
          value={residential.transport?.opted ? "Yes" : "No"}
          onChange={(e) => handleNestedChange("transport", "opted", e.target.value === "Yes")}
          options={[
            { value: "No", label: "No" },
            { value: "Yes", label: "Yes" },
          ]}
        />

        {residential.transport?.opted && (
          <>
            <InputField
              label="Bus Route Number"
              id="routeNumber"
              value={residential.transport?.routeNumber || ""}
              onChange={(e) => handleNestedChange("transport", "routeNumber", e.target.value)}
              disabled={isSubmitted}
            />
            <InputField
              label="Boarding Point"
              id="boardingPoint"
              value={residential.transport?.boardingPoint || ""}
              onChange={(e) => handleNestedChange("transport", "boardingPoint", e.target.value)}
              disabled={isSubmitted}
            />
          </>
        )}
      </FormSection>

      {/* ================= VEHICLE ================= */}
      <FormSection title="Personal Vehicle" icon={Bike}>
        <InputField
          label="Vehicle Registration Number"
          id="vehicleReg"
          placeholder="e.g. KL-13-A-1234"
          value={residential.vehicleReg || ""}
          onChange={(e) => handleTopLevelChange("vehicleReg", e.target.value)}
          disabled={isSubmitted}
        />
      </FormSection>
    </FormWrapper>
  );
}