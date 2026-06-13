import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import FormWrapper, { FormSection, InputField } from '../../components/FormWrapper';
import { getChangedFields, SECTION_API_KEYS } from '../../lib/utils';
import { Users, Coins, UserPlus, Trash2, ChevronDown } from 'lucide-react';
import useHashFocus from '../../hooks/useHashFocus';
import { useNavigate } from "react-router-dom";
export default function FamilyForm() {
  useHashFocus();
  const isSubmitted = useStore((s) => s.isSubmitted);
  const family = useStore((state) => state.family);
  const updateSection = useStore((state) => state.updateSection);
  console.log('Family State:', family); // Debugging log
  const [openParentPhoneCode, setOpenParentPhoneCode] = useState(false);
  const phoneRef = useRef(null);
  const navigate = useNavigate();



const saveAndRefresh =
  useStore((s) => s.saveAndRefresh);
  
  const COUNTRY_CODES = [
    { value: "91", label: "India" },
    { value: "1", label: "USA" },
    { value: "44", label: "UK" }
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (phoneRef.current && !phoneRef.current.contains(event.target)) {
        setOpenParentPhoneCode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Updates nested objects like father: { name: '', qualification: '' }
   */
  const handleNestedChange = (parent, child, value) => {
    updateSection('family', {
      [parent]: {
        ...family[parent],
        [child]: value
      }
    });
  };

  // Handler for top-level keys like annualFamilyIncome
  const handleChange = (e) => {
    const { id, value } = e.target;
    updateSection('family', { [id]: value });
  };

const handlePhoneChange = (e) => {

  let digits =
    e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

  const formatted =
    digits.replace(
      /(\d{5})(?=\d)/g,
      "$1 "
    );

  updateSection("family", {

    parentContact: {

      countryCode:
        family?.parentContact?.countryCode ||
        "+91",

      number:
        formatted

    }

  });

};

useEffect(() => {

  if (
    !family?.parentContact?.countryCode
  ) {

    updateSection("family", {

      parentContact: {

        ...family.parentContact,

        countryCode: "+91"

      }

    });

  }

}, []);


  const handleSelectCode = (val) => {
    updateSection('family', {
      parentContact: {
        ...family.parentContact,
        countryCode: `+${val}`
      }
    });
    setOpenParentPhoneCode(false);
  };

// const handleSave = async () => {
//   const missingFields = [];
//   if (!family?.father?.name?.trim()) missingFields.push('Father Name');
//   if (!family?.mother?.name?.trim()) missingFields.push('Mother Name');

//   if (missingFields.length > 0) {
//     alert(`Please fill in the required field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}`);
//     return;
//   }

//   const originalFamily = useStore.getState().profileSnapshot?.family || {};
//   const changedFamily = getChangedFields(originalFamily, family);

//   if (!Object.keys(changedFamily).length) {
//     alert('No changes detected in family details.');
//     return;
//   }

//   const payload = {
//     family_details: changedFamily,
//     updatedSections: [SECTION_API_KEYS.family],
//   };

//   await saveAndRefresh(payload);
// };
const handleSave = async () => {
  navigate("/forms/education");
};
  return (
    <FormWrapper
      title="Family Details"
      description="Provide accurate information about your legal guardians and family structure."
      onSave={handleSave}
    >
      {/* Father Details */}
      <FormSection title="Father Details" icon={Users}>
        <InputField 
          id="fatherName"
          label="Name" 
          required
          value={family?.father?.name || ''} 
          onChange={(e) => handleNestedChange('father', 'name', e.target.value)} 
          disabled={isSubmitted} 
        />
        {/* REVERTED: Qualification back to InputField */}
        <InputField 
          label="Qualification" 
          value={family?.father?.qualification || ''} 
          onChange={(e) => handleNestedChange('father', 'qualification', e.target.value)} 
          disabled={isSubmitted} 
          placeholder="e.g. MBA, PhD"
        />
        <InputField 
          label="Occupation" 
          value={family?.father?.occupation || ''} 
          onChange={(e) => handleNestedChange('father', 'occupation', e.target.value)} 
          disabled={isSubmitted} 
        />
      </FormSection>

      {/* Mother Details */}
      <FormSection title="Mother Details" icon={Users}>
        <InputField 
          id="motherName"
          label="Name" 
          required
          value={family?.mother?.name || ''} 
          onChange={(e) => handleNestedChange('mother', 'name', e.target.value)} 
          disabled={isSubmitted} 
        />
        {/* REVERTED: Qualification back to InputField */}
        <InputField 
          label="Qualification" 
          value={family?.mother?.qualification || ''} 
          onChange={(e) => handleNestedChange('mother', 'qualification', e.target.value)} 
          disabled={isSubmitted} 
          placeholder="e.g. BSc, Teacher Training"
        />
        <InputField 
          label="Occupation" 
          value={family?.mother?.occupation || ''} 
          onChange={(e) => handleNestedChange('mother', 'occupation', e.target.value)} 
          disabled={isSubmitted} 
        />
      </FormSection>

      {/* Financial & Contact */}
      <FormSection title="Financial & Contact" icon={Coins}>
        <div className="md:col-span-2">
          <InputField 
            label="Annual Family Income (INR)" 
            id="annualFamilyIncome" 
            type="number" 
            value={family?.annualFamilyIncome || ''} 
            onChange={handleChange} 
            disabled={isSubmitted} 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600 text-left">Parent Phone</label>
          <div className={`flex items-stretch bg-slate-50 border border-slate-200 rounded-lg relative focus-within:ring-2 focus-within:ring-primary ${isSubmitted ? 'opacity-70' : ''}`}>
            <div className="relative border-r border-slate-200 bg-slate-100 rounded-l-lg" ref={phoneRef}>
              <button
                type="button"
                disabled={isSubmitted}
                onClick={() => setOpenParentPhoneCode(!openParentPhoneCode)}
                className="flex items-center justify-between w-20 h-full px-3 text-slate-700 font-medium text-sm"
              >
                <span>{family?.parentContact?.countryCode || "+91"}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${openParentPhoneCode ? 'rotate-180' : ''}`} />
              </button>
              {openParentPhoneCode && (
                <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2">
                  {COUNTRY_CODES.map((code) => (
                    <button
                      key={code.value}
                      type="button"
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 ${family?.parentContact?.countryCode === `+${code.value}` ? 'text-blue-600 font-bold' : ''}`}
                      onClick={() => handleSelectCode(code.value)}
                    >
                      +{code.value} ({code.label})
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="tel"
              value={family?.parentContact?.number || ''}
              onChange={handlePhoneChange}
              placeholder="00000 00000"
              disabled={isSubmitted}
              className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <InputField label="Parent Email" id="parentEmail" type="email" value={family?.parentEmail || ''} onChange={handleChange} disabled={isSubmitted} />
      </FormSection>

      {/* Sibling Details */}
      <FormSection title="Sibling Details" icon={UserPlus}>
        <div className="md:col-span-2 space-y-4">
          {(family?.siblings || []).map((sibling, index) => (
            <div key={index} className="relative p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row gap-4">
              <input
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                placeholder="Sibling Name"
                disabled={isSubmitted}
                value={sibling.name || ''}
                onChange={(e) => {
                  const newSiblings = [...family.siblings];
                  newSiblings[index].name = e.target.value;
                  updateSection('family', { siblings: newSiblings });
                }}
              />
              <input
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                placeholder="Education Status"
                value={sibling.educationStatus || ''}
                disabled={isSubmitted}
                onChange={(e) => {
                  const newSiblings = [...family.siblings];
                  newSiblings[index].educationStatus = e.target.value;
                  updateSection('family', { siblings: newSiblings });
                }}
              />
              <button
                onClick={() => {
                  const newSiblings = family.siblings.filter((_, i) => i !== index);
                  updateSection('family', { siblings: newSiblings });
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                disabled={isSubmitted}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            disabled={isSubmitted}
            onClick={() => updateSection('family', { siblings: [...(family?.siblings || []), { name: '', educationStatus: '' }] })}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-primary font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            Add Sibling
          </button>
        </div>
      </FormSection>

      {/* Guardian Address Details */}
      <FormSection title="Guardian Address Details" icon={Users}>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-600">Guardian's Residential Address</label>
          <textarea
            id="guardianResidentialAddress"
            placeholder="House Name/No., Street, Locality, Pincode"
            rows={3}
            value={family?.guardianResidentialAddress || ''}
            onChange={handleChange}
            disabled={isSubmitted}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-600">Guardian's Office Address</label>
          <textarea
            id="guardianOfficeAddress"
            placeholder="Company Name, Building, Floor, Office Area Address"
            rows={3}
            value={family?.guardianOfficeAddress || ''}
            onChange={handleChange}
            disabled={isSubmitted}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
          />
        </div>
      </FormSection>
    </FormWrapper>
  );
}