import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import FormWrapper, { FormSection, InputField ,SelectField} from '../../components/FormWrapper';
import { getChangedFields, SECTION_API_KEYS } from '../../lib/utils';
import { Users, Coins, UserPlus, Trash2, ChevronDown } from 'lucide-react';
import useHashFocus from '../../hooks/useHashFocus';
import { useNavigate } from "react-router-dom";
export default function FamilyForm() {

  const {deleteProfileRecord} =useStore();
  useHashFocus();
  const isSubmitted = useStore((s) => s.isSubmitted);
  const family = useStore((state) => state.family);
  const updateSection = useStore((state) => state.updateSection);
  console.log('Family State:', family); // Debugging log
  const [openParentPhoneCode, setOpenParentPhoneCode] = useState(false);
  const phoneRef = useRef(null);
  const navigate = useNavigate();

const {qualificationLevels}=useStore();

const handleDeleteSibling = async (index) => {

  const sibling = family.siblings[index];

  if (!sibling) return;

  // Not saved in DB yet
  if (!sibling._id) {
    updateSection("family", {
      siblings: family.siblings.filter((_, i) => i !== index),
    });
    return;
  }

  const result = await deleteProfileRecord(
    "siblings",
    sibling._id
  );

  console.log("RESULT:", result);

  if (result.success) {

    updateSection("family", {
      siblings: family.siblings.filter((_, i) => i !== index),
    });

  } else {

    alert(result.message);

  }
};

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

const handlePhoneChange = (parent, e) => {
  const digits = e.target.value
    .replace(/\D/g, "")
    .slice(0, 10);

  const formatted = digits.replace(
    /(\d{5})(?=\d)/g,
    "$1 "
  );

  updateSection("family", {
    [parent]: {
      ...family?.[parent],
      phone: {
        ...(family?.[parent]?.phone || {}),
        countryCode:
          family?.[parent]?.phone?.countryCode || "+91",
        number: formatted,
      },
    },
  });
};

const handlePhoneCountryCodeChange = (parent, e) => {
  updateSection("family", {
    [parent]: {
      ...family?.[parent],
      phone: {
        ...(family?.[parent]?.phone || {}),
        countryCode: e.target.value,
      },
    },
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
    value={family?.father?.name || ""}
    onChange={(e) =>
      handleNestedChange("father", "name", e.target.value)
    }
    disabled={isSubmitted}
  />

  <SelectField
    label="Qualification"
    id="fatherQualification"
    value={family?.father?.qualification || ""}
    onChange={(e) =>
      handleNestedChange(
        "father",
        "qualification",
        e.target.value
      )
    }
    options={qualificationLevels}
    disabled={isSubmitted}
  />

  <InputField
    label="Occupation"
    value={family?.father?.occupation || ""}
    onChange={(e) =>
      handleNestedChange(
        "father",
        "occupation",
        e.target.value
      )
    }
    disabled={isSubmitted}
  />

  {/* Father Phone */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-600">
      Phone
    </label>

    <div
      className={`flex items-stretch bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-primary ${
        isSubmitted ? "bg-gray-100 opacity-70" : ""
      }`}
    >
      <div className="border-r border-slate-200 bg-slate-100 rounded-l-lg">
        <input
          type="text"
          value={family?.father?.phone?.countryCode || "+91"}
          onChange={(e) =>
            handlePhoneCountryCodeChange("father", e)
          }
          disabled={isSubmitted}
          className="w-16 h-full px-2 text-center text-slate-700 font-medium text-sm bg-transparent outline-none border-none"
        />
      </div>

      <input
        type="tel"
        value={family?.father?.phone?.number || ""}
        onChange={(e) =>
          handlePhoneChange("father", e)
        }
        placeholder="00000 00000"
        disabled={isSubmitted}
        className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
      />
    </div>
  </div>

  {/* Father Email */}
  <InputField
    label="Email"
    id="fatherEmail"
    type="email"
    value={family?.father?.email || ""}
    onChange={(e) =>
      handleNestedChange("father", "email", e.target.value)
    }
    disabled={isSubmitted}
  />
</FormSection>


{/* Mother Details */}
<FormSection title="Mother Details" icon={Users}>
  <InputField
    id="motherName"
    label="Name"
    required
    value={family?.mother?.name || ""}
    onChange={(e) =>
      handleNestedChange("mother", "name", e.target.value)
    }
    disabled={isSubmitted}
  />

  <SelectField
    label="Qualification"
    id="motherQualification"
    value={family?.mother?.qualification || ""}
    onChange={(e) =>
      handleNestedChange(
        "mother",
        "qualification",
        e.target.value
      )
    }
    options={qualificationLevels}
    disabled={isSubmitted}
  />

  <InputField
    label="Occupation"
    value={family?.mother?.occupation || ""}
    onChange={(e) =>
      handleNestedChange(
        "mother",
        "occupation",
        e.target.value
      )
    }
    disabled={isSubmitted}
  />

  {/* Mother Phone */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-600">
      Phone
    </label>

    <div
      className={`flex items-stretch bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-primary ${
        isSubmitted ? "bg-gray-100 opacity-70" : ""
      }`}
    >
      <div className="border-r border-slate-200 bg-slate-100 rounded-l-lg">
        <input
          type="text"
          value={family?.mother?.phone?.countryCode || "+91"}
          onChange={(e) =>
            handlePhoneCountryCodeChange("mother", e)
          }
          disabled={isSubmitted}
          className="w-16 h-full px-2 text-center text-slate-700 font-medium text-sm bg-transparent outline-none border-none"
        />
      </div>

      <input
        type="tel"
        value={family?.mother?.phone?.number || ""}
        onChange={(e) =>
          handlePhoneChange("mother", e)
        }
        placeholder="00000 00000"
        disabled={isSubmitted}
        className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
      />
    </div>
  </div>

  {/* Mother Email */}
  <InputField
    label="Email"
    id="motherEmail"
    type="email"
    value={family?.mother?.email || ""}
    onChange={(e) =>
      handleNestedChange("mother", "email", e.target.value)
    }
    disabled={isSubmitted}
  />
</FormSection>

      {/* Financial & Contact */}
  <FormSection title="Family Income" icon={Coins}>
  <InputField
    label="Annual Family Income (INR)"
    id="annualFamilyIncome"
    type="number"
    value={family?.annualFamilyIncome || ""}
    onChange={handleChange}
    disabled={isSubmitted}
  />


</FormSection>
      {/* Sibling Details */}
<FormSection title="Sibling Details" icon={UserPlus}>
  <div className="md:col-span-2 space-y-4">
    {(family?.siblings || []).map((sibling, index) => (
      <div
        key={index}
        className="relative p-4 border border-slate-200 rounded-xl"
      >
        {/* Delete button */}
        <button
          type="button"
          disabled={isSubmitted}
          onClick={() => handleDeleteSibling(index)}
          className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>

        {/* 2 Columns × 2 Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-14">

          {/* Row 1 - Sibling Name */}
          <InputField
            label="Sibling Name"
            id={`siblingName-${index}`}
            value={sibling.name || ""}
            disabled={isSubmitted}
            onChange={(e) => {
              const newSiblings = [...family.siblings];
              newSiblings[index].name = e.target.value;
              updateSection("family", {
                siblings: newSiblings,
              });
            }}
          />

          {/* Row 1 - Gender */}
          <SelectField
            label="Gender"
            id={`siblingGender-${index}`}
            value={sibling.gender || ""}
            disabled={isSubmitted}
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
            onChange={(e) => {
              const newSiblings = [...family.siblings];
              newSiblings[index].gender = e.target.value;
              updateSection("family", {
                siblings: newSiblings,
              });
            }}
          />

          {/* Row 2 - Education Status */}
          <SelectField
            label="Education Status"
            id={`siblingEducationStatus-${index}`}
            value={sibling.educationStatus || ""}
            disabled={isSubmitted}
            options={qualificationLevels}
            onChange={(e) => {
              const newSiblings = [...family.siblings];
              newSiblings[index].educationStatus = e.target.value;
              updateSection("family", {
                siblings: newSiblings,
              });
            }}
          />

          {/* Row 2 - Email */}
          <InputField
            label="Email"
            id={`siblingEmail-${index}`}
            type="email"
            value={sibling.email || ""}
            disabled={isSubmitted}
            onChange={(e) => {
              const newSiblings = [...family.siblings];
              newSiblings[index].email = e.target.value;
              updateSection("family", {
                siblings: newSiblings,
              });
            }}
          />

        </div>
      </div>
    ))}

    {/* Add Sibling */}
    <button
      type="button"
      disabled={isSubmitted}
      onClick={() =>
        updateSection("family", {
          siblings: [
            ...(family?.siblings || []),
            {
              name: "",
              gender: "",
              educationStatus: "",
              email: "",
            },
          ],
        })
      }
      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-primary font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
    >
      <UserPlus size={20} />
      Add Sibling
    </button>
  </div>
</FormSection>
      {/* Guardian Address Details */}
    <FormSection title="Guardian Details & Address" icon={Users}>

  {/* Guardian Phone */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-600">
      Guardian Phone
    </label>

    <div
      className={`flex items-stretch bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-primary ${
        isSubmitted ? "bg-gray-100 opacity-70" : ""
      }`}
    >
      <input
        type="text"
        value={family?.guardian?.contact?.countryCode || "+91"}
        onChange={(e) =>
          updateSection("family", {
            guardian: {
              ...family?.guardian,
              contact: {
                ...family?.guardian?.contact,
                countryCode: e.target.value,
              },
            },
          })
        }
        disabled={isSubmitted}
        className="w-16 px-2 py-3 text-center text-slate-700 font-medium text-sm bg-slate-100 outline-none border-r border-slate-200 rounded-l-lg"
      />

      <input
        type="tel"
        value={family?.guardian?.contact?.number || ""}
        onChange={(e) => {
          const digits = e.target.value
            .replace(/\D/g, "")
            .slice(0, 10);

          const formatted = digits.replace(
            /(\d{5})(?=\d)/g,
            "$1 "
          );

          updateSection("family", {
            guardian: {
              ...family?.guardian,
              contact: {
                ...family?.guardian?.contact,
                countryCode:
                  family?.guardian?.contact?.countryCode || "+91",
                number: formatted,
              },
            },
          });
        }}
        placeholder="00000 00000"
        disabled={isSubmitted}
        className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
      />
    </div>
  </div>

  {/* Guardian Email */}
  <InputField
    label="Guardian Email"
    id="guardianEmail"
    type="email"
    value={family?.guardian?.email || ""}
    onChange={(e) =>
      updateSection("family", {
        guardian: {
          ...family?.guardian,
          email: e.target.value,
        },
      })
    }
    disabled={isSubmitted}
  />

  {/* Residential Address */}
  <div className="md:col-span-2 space-y-2">
    <label className="block text-sm font-medium text-slate-600">
      Guardian's Residential Address
    </label>

    <textarea
      id="guardianResidentialAddress"
      placeholder="House Name/No., Street, Locality, Pincode"
      rows={3}
      value={family?.guardianResidentialAddress || ""}
      onChange={handleChange}
      disabled={isSubmitted}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
    />
  </div>

  {/* Office Address */}
  <div className="md:col-span-2 space-y-2">
    <label className="block text-sm font-medium text-slate-600">
      Guardian's Office Address
    </label>

    <textarea
      id="guardianOfficeAddress"
      placeholder="Company Name, Building, Floor, Office Area Address"
      rows={3}
      value={family?.guardianOfficeAddress || ""}
      onChange={handleChange}
      disabled={isSubmitted}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
    />
  </div>

</FormSection>
    </FormWrapper>
  );
}