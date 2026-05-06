import React from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
  SelectField,
} from "../../components/FormWrapper";
import { Home, Bus, Utensils, Bike, FileBadge } from "lucide-react";

export default function ResidentialForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const residential = useStore((state) => state.residential);
  const updateSection = useStore((state) => state.updateSection);

  const handleSave = () => {
    console.log("Saved Residential Data:", residential);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    updateSection("residential", { [id]: value });
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
          id="type"
          value={residential.type}
          onChange={handleChange}
          options={[
            { value: "Day Scholar", label: "Day Scholar" },
            { value: "Hosteller", label: "Hosteller" },
          ]}
        />

        {/* ✅ HOSTELLER FIELDS */}
        {residential.type === "Hosteller" && (
          <InputField
            label="Room Number"
            id="roomNo"
            value={residential.roomNo || ""}
            onChange={handleChange}
            disabled={isSubmitted}
          />
        )}

        {/* Row 2 */}
        {residential.type === "Hosteller" && (
          <>
            <InputField
              label="Hostel Block"
              id="hostelBlock"
              value={residential.hostelBlock || ""}
              onChange={handleChange}
              disabled={isSubmitted}
            />

            <SelectField
              disabled={isSubmitted}
              label="Bed Type"
              id="bedType"
              value={residential.bedType || ""}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Bed Type" },
                { value: "single", label: "Single" },
                { value: "double", label: "Double Sharing" },
                { value: "triple", label: "Triple Sharing" },
              ]}
            />

            {/* Row 3 (half width) */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Upload Cost Declaration Form
              </label>

              <label
                className={`w-full h-12 flex items-center gap-3 px-3 border rounded-lg cursor-pointer transition
                ${residential.costDoc?.docName
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200 bg-white"}`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-md
                  ${residential.costDoc?.docName
                    ? "bg-green-100"
                    : "bg-slate-100"}`}
                >
                  <FileBadge
                    size={18}
                    className={
                      residential.costDoc?.docName
                        ? "text-green-600"
                        : "text-slate-500"
                    }
                  />
                </div>

                <span
                  className={`text-sm truncate
                  ${residential.costDoc?.fileError
                    ? "text-red-600"
                    : residential.costDoc?.docName
                    ? "text-green-700 font-medium"
                    : "text-slate-500"}`}
                >
                  {residential.costDoc?.fileError ||
                    residential.costDoc?.docName ||
                    "Upload Document"}
                </span>

                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    updateSection("residential", {
                      costDoc: {
                        docName: file.name,
                        fileError: "",
                      },
                    });
                  }}
                />
              </label>
            </div>
          </>
        )}
      </FormSection>

      {/* ================= DINING ================= */}
      <FormSection title="Dining Services" icon={Utensils}>
        <SelectField
          disabled={isSubmitted}
          label="Mess Preference"
          id="messPreference"
          value={residential.messPreference}
          onChange={handleChange}
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
          id="transportOpted"
          value={residential.transportOpted}
          onChange={handleChange}
          options={[
            { value: "No", label: "No" },
            { value: "Yes", label: "Yes" },
          ]}
        />

        {/* ✅ SHOW ONLY IF YES */}
        {residential.transportOpted === "Yes" && (
          <InputField
            label="Bus Route ID"
            id="busRouteId"
            value={residential.busRouteId || ""}
            onChange={handleChange}
            disabled={isSubmitted}
          />
        )}

        {/* Row 2 */}
        {residential.transportOpted === "Yes" && (
          <>
            <InputField
              label="Pickup Point"
              id="pickupPoint"
              value={residential.pickupPoint || ""}
              onChange={handleChange}
              disabled={isSubmitted}
            />

            <InputField
              label="Bus Pass Number"
              id="busPassNumber"
              value={residential.busPassNumber || ""}
              onChange={handleChange}
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
          value={residential.vehicleReg}
          onChange={handleChange}
          disabled={isSubmitted}
        />
      </FormSection>
    </FormWrapper>
  );
}