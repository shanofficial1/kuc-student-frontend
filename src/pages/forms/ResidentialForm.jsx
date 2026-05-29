import React from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
  SelectField,
} from "../../components/FormWrapper";
import { Home, Bus, Utensils, Bike } from "lucide-react";

export default function ResidentialForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  // Using the key "residential_details" to match your structure
  const residential = useStore((state) => state.residential_details) || {};
  const updateSection = useStore((state) => state.updateSection);
console.log("Residential State:", residential); // Debugging log
  const handleSave = () => {
    console.log("Saved Residential Data:", residential);
  };

  /**
   * Helper to handle nested state updates
   * @param {string} parent - 'hostel' or 'transport'
   * @param {string} id - the field key
   * @param {any} value - the new value
   */
  const handleNestedChange = (parent, id, value) => {
    updateSection("residential_details", {
      ...residential,
      [parent]: {
        ...(residential[parent] || {}),
        [id]: value,
      },
    });
  };

  const handleTopLevelChange = (id, value) => {
    updateSection("residential_details", {
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
        {residential.resType === "Hosteller" && (
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