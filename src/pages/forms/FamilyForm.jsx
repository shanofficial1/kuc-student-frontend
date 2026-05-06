import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import FormWrapper, { FormSection, InputField } from '../../components/FormWrapper';
import { Users, Coins, UserPlus, Trash2, ChevronDown } from 'lucide-react';

export default function FamilyForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const family = useStore((state) => state.family);
  const updateSection = useStore((state) => state.updateSection);

  const [openParentPhoneCode, setOpenParentPhoneCode] = useState(false);
  const phoneRef = useRef(null);

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

  const handleChange = (e) => {
    const { id, value } = e.target;
    let val = value;

    // 🔥 Phone Formatting: 5-5 grouping (00000 00000)
    if (id === "parentPhone") {
      let digits = val.replace(/\D/g, "").slice(0, 10);
      val = digits.replace(/(\d{5})(?=\d)/g, "$1 ");
    }

    updateSection('family', { [id]: val });
  };

  const handleSelectCode = (val) => {
    updateSection('family', { parentPhoneCountryCode: val });
    setOpenParentPhoneCode(false);
  };

  const handleSave = () => {
    console.log('Saved Family Data:', family);
  };

  return (
    <FormWrapper
      title="Family Details"
      description="Provide accurate information about your legal guardians and family structure."
      onSave={handleSave}
    >
      {/* Father Details */}
      <FormSection title="Father Details" icon={Users}>
        <InputField label="Name" id="fatherName" value={family?.fatherName || ''} onChange={handleChange} disabled={isSubmitted} />
        <InputField label="Qualification" id="fatherQualification" value={family?.fatherQualification || ''} onChange={handleChange} disabled={isSubmitted} />
        <InputField label="Occupation" id="fatherOccupation" value={family?.fatherOccupation || ''} onChange={handleChange} disabled={isSubmitted} />
      </FormSection>

      {/* Mother Details */}
      <FormSection title="Mother Details" icon={Users}>
        <InputField label="Name" id="motherName" value={family?.motherName || ''} onChange={handleChange} disabled={isSubmitted} />
        <InputField label="Qualification" id="motherQualification" value={family?.motherQualification || ''} onChange={handleChange} disabled={isSubmitted} />
        <InputField label="Occupation" id="motherOccupation" value={family?.motherOccupation || ''} onChange={handleChange} disabled={isSubmitted} />
      </FormSection>

      {/* Financial & Contact */}
      <FormSection title="Financial & Contact" icon={Coins}>
        <div className="md:col-span-2">
          <InputField label="Annual Family Income (INR)" id="annualIncome" type="number" value={family?.annualIncome || ''} onChange={handleChange} disabled={isSubmitted} />
        </div>

        {/* Parent Phone with Dropdown & 5-5 Format */}
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
                <span>+{family?.parentPhoneCountryCode || "91"}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${openParentPhoneCode ? 'rotate-180' : ''}`} />
              </button>
              {openParentPhoneCode && (
                <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-200">
                  {COUNTRY_CODES.map((code) => (
                    <button
                      key={code.value}
                      type="button"
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 ${family?.parentPhoneCountryCode === code.value ? 'text-blue-600 font-bold' : ''}`}
                      onClick={() => handleSelectCode(code.value)}
                    >
                      +{code.value} ({code.label})
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              id="parentPhone"
              type="tel"
              value={family?.parentPhone || ''}
              onChange={handleChange}
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
            <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4 animate-in slide-in-from-top-2">
              <input
                className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
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
                className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                placeholder="Education Status"
                value={sibling.education || ''}
                disabled={isSubmitted}
                onChange={(e) => {
                  const newSiblings = [...family.siblings];
                  newSiblings[index].education = e.target.value;
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
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            disabled={isSubmitted}
            onClick={() => updateSection('family', { siblings: [...(family?.siblings || []), { name: '', education: '' }] })}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-primary font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            Add Sibling
          </button>
        </div>
      </FormSection>
    </FormWrapper>
  );
}