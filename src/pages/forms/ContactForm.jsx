import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  SelectField,
  InputField,
} from "../../components/FormWrapper";
import { Phone, MapPin, Mail, Siren } from "lucide-react";

export default function ContactForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const contact = useStore((state) => state.contact);
  const updateSection = useStore((state) => state.updateSection);

  /**
   * Helper for updating nested objects in Zustand
   * parent: 'personalMobile', 'permanentAddress', etc.
   * child: 'number', 'city', etc.
   */
  const handleNestedChange = (parent, child, value) => {
    let val = value;

    // PIN Code Masking (3-3 grouping)
    if (child === "pinCode") {
      let digits = val.replace(/\D/g, "").slice(0, 6);
      val = digits.replace(/(\d{3})(?=\d)/g, "$1 ");
    }

    const updates = {
      [parent]: {
        ...contact[parent],
        [child]: val,
      },
    };

    // Auto-clear dependent fields in nested address
    if (child === "state") {
      updates[parent].district = "";
      updates[parent].city = "";
    } else if (child === "district") {
      updates[parent].city = "";
    }

    // Mirror to correspondence if "Same as Permanent" is checked
    if (contact.isSameAddress && parent === "permanentAddress") {
      updates.correspondenceAddress = {
        ...contact.correspondenceAddress,
        [child]: val,
      };
      if (child === "state") {
        updates.correspondenceAddress.district = "";
        updates.correspondenceAddress.city = "";
      }
      if (child === "district") updates.correspondenceAddress.city = "";
    }

    updateSection("contact", updates);
  };

  // Top-level change handler (Email, Distance)
  const handleChange = (e) => {
    const { id, value } = e.target;
    updateSection("contact", { [id]: value });
  };

  const handleWhatsappSync = (e) => {
    const isChecked = e.target.checked;
    updateSection("contact", {
      isSameAsMobile: isChecked,
      whatsappNumber: isChecked 
        ? { ...contact.personalMobile } 
        : contact.whatsappNumber,
    });
  };

  const handleAddressToggle = (e) => {
    const isChecked = e.target.checked;
    const updates = { isSameAddress: isChecked };
    
    if (isChecked) {
      updates.correspondenceAddress = { ...contact.permanentAddress };
    }
    
    updateSection("contact", updates);
  };

  const LOCATION_DATA = {
    "Kerala": {
      districts: {
        "Kannur": ["Pattuvam", "Taliparamba", "Payyanur", "Kannur City"],
        "Thrissur": ["Thrissur City", "Irinjalakuda"],
      },
    },
    "Tamil Nadu": {
      districts: { "Chennai": ["Adyar", "Ambattur", "Guindy"] },
    },
  };

  const STATE_LIST = Object.keys(LOCATION_DATA);

  return (
    <FormWrapper
      title="Contact Details"
      description="Please provide your current and permanent contact information for university communications."
      onSave={() => console.log("Saved Contact:", contact)}
    >
      {/* PRIMARY CONTACT SECTION */}
      <FormSection title="Primary Contact" icon={Phone}>
        {/* Personal Mobile */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600">Personal Mobile *</label>
          <div className={`flex items-stretch bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-primary ${isSubmitted ? 'bg-gray-100 opacity-70' : ''}`}>
            <div className="relative border-r border-slate-200 bg-slate-100 rounded-l-lg">
              <input
                type="text"
                value={contact.personalMobile?.countryCode || "+91"}
                onChange={(e) => handleNestedChange("personalMobile", "countryCode", e.target.value)}
                disabled={isSubmitted}
                className="w-16 h-full px-2 text-center text-slate-700 font-medium text-sm bg-transparent outline-none border-none"
              />
            </div>
            <input
              id="personalMobileNumber"
              type="tel"
              required
              disabled={isSubmitted}
              value={contact.personalMobile?.number || ""}
              onChange={(e) => handleNestedChange("personalMobile", "number", e.target.value)}
              placeholder="00000 00000"
              className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-600">WhatsApp Number</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                disabled={isSubmitted}
                checked={contact.isSameAsMobile}
                onChange={handleWhatsappSync}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-500">Same as Personal Mobile</span>
            </label>
          </div>
          <div className={`flex items-stretch border border-slate-200 rounded-lg ${contact.isSameAsMobile || isSubmitted ? 'bg-gray-100 opacity-70' : 'bg-slate-50 focus-within:ring-2 focus-within:ring-primary'}`}>
            <div className="relative border-r border-slate-200 bg-slate-100 rounded-l-lg">
              <input
                type="text"
                value={contact.whatsappNumber?.countryCode || "+91"}
                onChange={(e) => handleNestedChange("whatsappNumber", "countryCode", e.target.value)}
                disabled={contact.isSameAsMobile || isSubmitted}
                className="w-16 h-full px-2 text-center text-slate-700 font-medium text-sm bg-transparent outline-none border-none"
              />
            </div>
            <input
              type="tel"
              disabled={contact.isSameAsMobile || isSubmitted}
              value={contact.whatsappNumber?.number || ""}
              onChange={(e) => handleNestedChange("whatsappNumber", "number", e.target.value)}
              placeholder="00000 00000"
              className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700"
            />
          </div>
        </div>

        <InputField label="Personal Email *" id="personalEmail" type="email" required value={contact.personalEmail || ""} onChange={handleChange} />
        <InputField label="Institutional Email" id="institutionalEmail" type="email" value={contact.institutionalEmail || ""} onChange={handleChange} />
      </FormSection>

      {/* EMERGENCY CONTACT SECTION */}
      <FormSection title="Emergency Contact" icon={Siren}>
        <InputField 
          label="Guardian Name" 
          value={contact.emergencyContact?.name || ""} 
          onChange={(e) => handleNestedChange("emergencyContact", "name", e.target.value)} 
        />
        <SelectField
          label="Relation"
          disabled={isSubmitted}
          value={contact.emergencyContact?.relation || ""}
          onChange={(e) => handleNestedChange("emergencyContact", "relation", e.target.value)}
          options={[
            { value: "Father", label: "Father" },
            { value: "Mother", label: "Mother" },
            { value: "Guardian", label: "Other/Guardian" },
          ]}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600">Emergency Phone Number</label>
          <div className={`flex items-stretch bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-primary ${isSubmitted ? 'bg-gray-100 opacity-70' : ''}`}>
            <div className="relative border-r border-slate-200 bg-slate-100 rounded-l-lg">
              <input
                type="text"
                value={contact.emergencyContact?.number?.countryCode || "+91"}
                onChange={(e) => handleNestedChange("emergencyContact", "number", { ...contact.emergencyContact.number, countryCode: e.target.value })}
                disabled={isSubmitted}
                className="w-16 h-full px-2 text-center text-slate-700 font-medium text-sm bg-transparent outline-none border-none"
              />
            </div>
            <input
              type="tel"
              disabled={isSubmitted}
              value={contact.emergencyContact?.number?.number || ""}
              onChange={(e) => handleNestedChange("emergencyContact", "number", { ...contact.emergencyContact.number, number: e.target.value })}
              className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700"
            />
          </div>
        </div>
      </FormSection>

      {/* ADDRESSES SECTION */}
      <FormSection title="Addresses" icon={MapPin}>
        {/* Permanent */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <MapPin size={18} className="text-blue-600" /> Permanent Address
          </h3>
          <textarea
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            rows={2}
            value={contact.permanentAddress?.addressLine || ""}
            onChange={(e) => handleNestedChange("permanentAddress", "addressLine", e.target.value)}
            disabled={isSubmitted}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField 
              label="State" 
              value={contact.permanentAddress?.state || ""} 
              onChange={(e) => handleNestedChange("permanentAddress", "state", e.target.value)}
              options={STATE_LIST.map(s => ({ value: s, label: s }))}
            />
            <SelectField 
              label="District" 
              value={contact.permanentAddress?.district || ""} 
              onChange={(e) => handleNestedChange("permanentAddress", "district", e.target.value)}
              options={(LOCATION_DATA[contact.permanentAddress?.state]?.districts ? Object.keys(LOCATION_DATA[contact.permanentAddress.state].districts) : []).map(d => ({ value: d, label: d }))}
            />
            <SelectField 
              label="City/Town" 
              value={contact.permanentAddress?.city || ""} 
              onChange={(e) => handleNestedChange("permanentAddress", "city", e.target.value)}
              options={(LOCATION_DATA[contact.permanentAddress?.state]?.districts[contact.permanentAddress?.district] || []).map(c => ({ value: c, label: c }))}
            />
            <InputField 
              label="PIN Code" 
              value={contact.permanentAddress?.pinCode || ""} 
              onChange={(e) => handleNestedChange("permanentAddress", "pinCode", e.target.value)} 
            />
          </div>
        </div>

        {/* Correspondence */}
        <div className="md:col-span-2 py-4 border-t border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Mail size={18} className="text-blue-600" /> Correspondence Address
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={contact.isSameAddress} onChange={handleAddressToggle} className="w-4 h-4 rounded border-slate-300" />
            <span className="text-sm text-slate-500">Same as Permanent</span>
          </label>
        </div>

        <div className={`md:col-span-2 space-y-4 ${contact.isSameAddress ? 'opacity-70 grayscale-[0.5]' : ''}`}>
          <textarea
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
            rows={2}
            readOnly={contact.isSameAddress}
            value={contact.correspondenceAddress?.addressLine || ""}
            onChange={(e) => handleNestedChange("correspondenceAddress", "addressLine", e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField disabled={contact.isSameAddress} label="State" value={contact.correspondenceAddress?.state || ""} onChange={(e) => handleNestedChange("correspondenceAddress", "state", e.target.value)} options={STATE_LIST.map(s => ({ value: s, label: s }))} />
            <SelectField 
              disabled={contact.isSameAddress} 
              label="District" 
              value={contact.correspondenceAddress?.district || ""} 
              onChange={(e) => handleNestedChange("correspondenceAddress", "district", e.target.value)}
              options={(LOCATION_DATA[contact.correspondenceAddress?.state]?.districts ? Object.keys(LOCATION_DATA[contact.correspondenceAddress.state].districts) : []).map(d => ({ value: d, label: d }))}
            />
            <SelectField 
              disabled={contact.isSameAddress} 
              label="City/Town" 
              value={contact.correspondenceAddress?.city || ""} 
              onChange={(e) => handleNestedChange("correspondenceAddress", "city", e.target.value)}
              options={(LOCATION_DATA[contact.correspondenceAddress?.state]?.districts[contact.correspondenceAddress?.district] || []).map(c => ({ value: c, label: c }))}
            />
            <InputField disabled={contact.isSameAddress} label="PIN Code" value={contact.correspondenceAddress?.pinCode || ""} onChange={(e) => handleNestedChange("correspondenceAddress", "pinCode", e.target.value)} />
          </div>
        </div>

        <div className="md:col-span-2 pt-4">
          <InputField label="Distance from Campus (KM)" id="distanceToCampus" type="number" value={contact.distanceToCampus || ""} onChange={handleChange} />
        </div>
      </FormSection>
    </FormWrapper>
  );
}