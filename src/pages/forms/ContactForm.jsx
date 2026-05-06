import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  SelectField,
  InputField,
} from "../../components/FormWrapper";
import { Phone, MapPin, Mail, ChevronDown, Siren } from "lucide-react";

export default function ContactForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const contact = useStore((state) => state.contact);
  const updateSection = useStore((state) => state.updateSection);

  // States for floating dropdown visibility
  const [openMobileCode, setOpenMobileCode] = useState(false);
  const [openWhatsappCode, setOpenWhatsappCode] = useState(false);
  const [openEmergencyCode, setOpenEmergencyCode] = useState(false);

  // Refs for click-away detection
  const mobileRef = useRef(null);
  const whatsappRef = useRef(null);
  const emergencyRef = useRef(null);

  const COUNTRY_CODES = [
    { value: "91", label: "India" },
    { value: "1", label: "USA/Canada" },
    { value: "44", label: "UK" },
    { value: "971", label: "UAE" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileRef.current && !mobileRef.current.contains(event.target)) {
        setOpenMobileCode(false);
      }
      if (whatsappRef.current && !whatsappRef.current.contains(event.target)) {
        setOpenWhatsappCode(false);
      }
      if (emergencyRef.current && !emergencyRef.current.contains(event.target)) {
        setOpenEmergencyCode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    let val = value;

    // PIN Code Masking (3-3 grouping)
    if (id.endsWith("Pin")) {
      let digits = val.replace(/\D/g, "").slice(0, 6);
      val = digits.replace(/(\d{3})(?=\d)/g, "$1 ");
    }

    let updates = { [id]: val };

    // Reset dependent fields if State or District changes
    if (id === "permanentState") {
      updates.permanentDistrict = "";
      updates.permanentCity = "";
    } else if (id === "permanentDistrict") {
      updates.permanentCity = "";
    }

    // Same as Permanent Sync (mirrors all address fields)
    if (contact.isSameAddress && id.startsWith("permanent")) {
      const correspondenceId = id.replace("permanent", "correspondence");
      updates[correspondenceId] = val;

      if (id === "permanentState") {
        updates.correspondenceDistrict = "";
        updates.correspondenceCity = "";
      }
      if (id === "permanentDistrict") updates.correspondenceCity = "";
    }

    updateSection("contact", updates);
  };

  const handleSelectCode = (val, field) => {
    const updates = { [`${field}CountryCode`]: val };

    if (field === "mobile" && contact.isSameAsMobile) {
      updates.whatsappCountryCode = val;
    }

    updateSection("contact", updates);
    setOpenMobileCode(false);
    setOpenWhatsappCode(false);
    setOpenEmergencyCode(false);
  };

  const handleWhatsappSync = (e) => {
    const isChecked = e.target.checked;
    updateSection("contact", {
      isSameAsMobile: isChecked,
      whatsapp: isChecked ? contact.mobile : contact.whatsapp,
      whatsappCountryCode: isChecked ? (contact.mobileCountryCode || "91") : contact.whatsappCountryCode,
    });
  };

  const handleSave = () => {
    console.log("Saved Contact Data:", contact);
  };

  const LOCATION_DATA = {
    "Kerala": {
      districts: {
        "Kannur": ["Pattuvam", "Taliparamba", "Payyanur", "Kannur City"],
        "Kozhikode": ["Vadakara", "Koyilandy", "Kozhikode City"],
        "Wayanad": ["Kalpetta", "Mananthavady", "Sulthan Bathery"],
        "Kasargod": ["Kanhangad", "Kasargod City"],
        "Ernakulam": ["Kochi", "Aluva", "Muvattupuzha"],
      },
    },
    "Tamil Nadu": {
      districts: {
        "Chennai": ["Adyar", "Ambattur", "Guindy"],
        "Coimbatore": ["Pollachi", "Tiruppur"],
      },
    },
    "Karnataka": {
      districts: {
        "Bangalore": ["Electronic City", "Whitefield"],
        "Mysore": ["Mysore City", "Hunsur"],
      },
    },
  };

  const STATE_LIST = Object.keys(LOCATION_DATA);

  return (
    <FormWrapper
      title="Contact Details"
      description="Please provide your current and permanent contact information for university communications."
      onSave={handleSave}
    >
      <FormSection title="Primary Contact" icon={Phone}>
        {/* Personal Mobile */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600">
            Personal Mobile <span className="text-status-error ml-0.5">*</span>
          </label>
          <div className={`flex items-stretch bg-slate-50 border border-slate-200 rounded-lg relative transition-all focus-within:ring-2 focus-within:ring-primary ${isSubmitted ? 'bg-gray-100 opacity-70' : ''}`}>
            <div className="relative border-r border-slate-200 bg-slate-100 rounded-l-lg" ref={mobileRef}>
              <button
                type="button"
                disabled={isSubmitted}
                onClick={() => setOpenMobileCode(!openMobileCode)}
                className="flex items-center justify-between w-20 h-full px-3 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors disabled:cursor-not-allowed"
              >
                <span>+{contact.mobileCountryCode || "91"}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${openMobileCode ? 'rotate-180' : ''}`} />
              </button>

              {openMobileCode && (
                <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-200">
                  <div className="max-h-60 overflow-y-auto">
                    {COUNTRY_CODES.map((code) => (
                      <button
                        key={code.value}
                        type="button"
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          contact.mobileCountryCode === code.value 
                          ? 'bg-blue-50 text-blue-600 font-semibold' 
                          : 'text-slate-700 hover:bg-slate-50'
                        }`}
                        onClick={() => handleSelectCode(code.value, 'mobile')}
                      >
                        +{code.value} ({code.label})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <input
              id="mobile"
              type="tel"
              required
              disabled={isSubmitted}
              value={contact.mobile}
              onChange={handleChange}
              placeholder="00000 00000"
              className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-600">WhatsApp Number</label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                disabled={isSubmitted}
                checked={contact.isSameAsMobile}
                onChange={handleWhatsappSync}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
              <span className="text-xs text-slate-500">Same as Personal Mobile</span>
            </label>
          </div>

          <div className={`flex items-stretch border border-slate-200 rounded-lg relative transition-all 
            ${(contact.isSameAsMobile || isSubmitted) ? 'bg-gray-100 opacity-70' : 'bg-slate-50 focus-within:ring-2 focus-within:ring-primary'}`}>
            <div className="relative border-r border-slate-200 bg-slate-100 rounded-l-lg" ref={whatsappRef}>
              <button
                type="button"
                disabled={contact.isSameAsMobile || isSubmitted}
                onClick={() => setOpenWhatsappCode(!openWhatsappCode)}
                className="flex items-center justify-between w-20 h-full px-3 text-slate-700 font-medium text-sm disabled:cursor-not-allowed"
              >
                <span>+{contact.whatsappCountryCode || "91"}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${openWhatsappCode ? 'rotate-180' : ''}`} />
              </button>

              {openWhatsappCode && (
                <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-200">
                  <div className="max-h-60 overflow-y-auto">
                    {COUNTRY_CODES.map((code) => (
                      <button
                        key={code.value}
                        type="button"
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          contact.whatsappCountryCode === code.value 
                          ? 'bg-blue-50 text-blue-600 font-semibold' 
                          : 'text-slate-700 hover:bg-slate-50'
                        }`}
                        onClick={() => handleSelectCode(code.value, 'whatsapp')}
                      >
                        +{code.value} ({code.label})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <input
              id="whatsapp"
              type="tel"
              disabled={contact.isSameAsMobile || isSubmitted}
              value={contact.whatsapp}
              onChange={handleChange}
              placeholder="00000 00000"
              className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <InputField
          label="Personal Email"
          id="email"
          type="email"
          required
          value={contact.email}
          onChange={handleChange}
          placeholder="name@example.com"
        />
        <InputField
          label="Institutional Email"
          id="institutionalEmail"
          type="email"
          value={contact.institutionalEmail}
          onChange={handleChange}
          placeholder="student.2024@kannuruniversity.ac.in"
        />
      </FormSection>

      <FormSection title="Emergency Contact" icon={Siren}>
        <InputField
          label="Guardian Name"
          id="emergencyName"
          value={contact.emergencyName}
          onChange={handleChange}
        />
        <SelectField
          disabled={isSubmitted}
          label="Relation"
          id="emergencyRelation"
          value={contact.emergencyRelation}
          onChange={handleChange}
          options={[
            { value: "", label: "Select" },
            { value: "father", label: "Father" },
            { value: "mother", label: "Mother" },
            { value: "other", label: "Other/Guardian" },
          ]}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600">
            Emergency Phone Number
          </label>
          <div className={`flex items-stretch bg-slate-50 border border-slate-200 rounded-lg relative transition-all focus-within:ring-2 focus-within:ring-primary ${isSubmitted ? 'bg-gray-100 opacity-70' : ''}`}>
            <div className="relative border-r border-slate-200 bg-slate-100 rounded-l-lg" ref={emergencyRef}>
              <button
                type="button"
                disabled={isSubmitted}
                onClick={() => setOpenEmergencyCode(!openEmergencyCode)}
                className="flex items-center justify-between w-20 h-full px-3 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors disabled:cursor-not-allowed"
              >
                <span>+{contact.emergencyCountryCode || "91"}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${openEmergencyCode ? 'rotate-180' : ''}`} />
              </button>

              {openEmergencyCode && (
                <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-200">
                  <div className="max-h-60 overflow-y-auto">
                    {COUNTRY_CODES.map((code) => (
                      <button
                        key={code.value}
                        type="button"
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          contact.emergencyCountryCode === code.value 
                          ? 'bg-blue-50 text-blue-600 font-semibold' 
                          : 'text-slate-700 hover:bg-slate-50'
                        }`}
                        onClick={() => handleSelectCode(code.value, 'emergency')}
                      >
                        +{code.value} ({code.label})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <input
              id="emergencyPhone"
              type="tel"
              disabled={isSubmitted}
              value={contact.emergencyPhone}
              onChange={handleChange}
              placeholder="00000 00000"
              className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Addresses" icon={MapPin}>
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <MapPin size={18} className="text-blue-600" /> Permanent Address
          </h3>
          <textarea
            id="permanentAddress"
            placeholder="House Name, Street, Locality"
            rows={2}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            value={contact.permanentAddress}
            onChange={handleChange}
            disabled={isSubmitted}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="State"
              id="permanentState"
              value={contact.permanentState}
              onChange={handleChange}
              options={STATE_LIST.map(s => ({ value: s, label: s }))}
              disabled={isSubmitted}
            />
            <SelectField
              label="District"
              id="permanentDistrict"
              value={contact.permanentDistrict}
              onChange={handleChange}
              options={(LOCATION_DATA[contact.permanentState]?.districts ? Object.keys(LOCATION_DATA[contact.permanentState].districts) : []).map(d => ({ value: d, label: d }))}
              disabled={isSubmitted || !contact.permanentState}
            />
            <SelectField
              label="City/Town"
              id="permanentCity"
              value={contact.permanentCity}
              onChange={handleChange}
              options={(LOCATION_DATA[contact.permanentState]?.districts[contact.permanentDistrict] || []).map(c => ({ value: c, label: c }))}
              disabled={isSubmitted || !contact.permanentDistrict}
            />
            <InputField
              label="PIN Code"
              id="permanentPin"
              value={contact.permanentPin}
              onChange={handleChange}
              placeholder="000 000"
              disabled={isSubmitted}
            />
          </div>
        </div>

        <div className="md:col-span-2 flex items-center justify-between py-4 border-t border-slate-100">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Mail size={18} className="text-blue-600" /> Correspondence Address
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              disabled={isSubmitted}
              checked={contact.isSameAddress}
              onChange={(e) => updateSection("contact", {
                ...contact,
                isSameAddress: e.target.checked,
                correspondenceAddress: e.target.checked ? contact.permanentAddress : contact.correspondenceAddress,
                correspondenceState: e.target.checked ? contact.permanentState : contact.correspondenceState,
                correspondenceDistrict: e.target.checked ? contact.permanentDistrict : contact.correspondenceDistrict,
                correspondenceCity: e.target.checked ? contact.permanentCity : contact.correspondenceCity,
                correspondencePin: e.target.checked ? contact.permanentPin : contact.correspondencePin,
              })}
              className="w-4 h-4 text-primary rounded border-slate-300"
            />
            <span className="text-sm text-slate-500">Same as Permanent</span>
          </label>
        </div>

        <div className={`md:col-span-2 space-y-4 transition-opacity ${contact.isSameAddress ? 'opacity-70 grayscale-[0.5]' : ''}`}>
          <textarea
            id="correspondenceAddress"
            placeholder="House Name, Street, Locality"
            rows={2}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
            value={contact.correspondenceAddress}
            onChange={handleChange}
            disabled={isSubmitted || contact.isSameAddress}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="State"
              id="correspondenceState"
              value={contact.correspondenceState}
              onChange={handleChange}
              options={STATE_LIST.map(s => ({ value: s, label: s }))}
              disabled={isSubmitted || contact.isSameAddress}
            />
            <SelectField
              label="District"
              id="correspondenceDistrict"
              value={contact.correspondenceDistrict}
              onChange={handleChange}
              options={(LOCATION_DATA[contact.correspondenceState]?.districts ? Object.keys(LOCATION_DATA[contact.correspondenceState].districts) : []).map(d => ({ value: d, label: d }))}
              disabled={isSubmitted || contact.isSameAddress}
            />
            <SelectField
              label="City/Town"
              id="correspondenceCity"
              value={contact.correspondenceCity}
              onChange={handleChange}
              options={(LOCATION_DATA[contact.correspondenceState]?.districts[contact.correspondenceDistrict] || []).map(c => ({ value: c, label: c }))}
              disabled={isSubmitted || contact.isSameAddress}
            />
            <InputField
              label="PIN Code"
              id="correspondencePin"
              value={contact.correspondencePin}
              onChange={handleChange}
              placeholder="000 000"
              disabled={isSubmitted || contact.isSameAddress}
            />
          </div>
        </div>
        <div className="md:col-span-2 pt-4">
          <InputField
            label="Distance from Campus (KM)"
            id="distanceFromCampus"
            type="number"
            value={contact.distanceFromCampus}
            onChange={handleChange}
            disabled={isSubmitted}
          />
        </div>
      </FormSection>
    </FormWrapper>
  );
}