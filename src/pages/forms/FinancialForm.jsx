import React from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
  FileInput,
  SelectField,
} from "../../components/FormWrapper";
import { Wallet, Landmark, ShieldCheck,Plus ,Trash2  } from "lucide-react";
import useHashFocus from '../../hooks/useHashFocus';
import { useNavigate } from "react-router-dom";
export default function FinancialForm() {
  useHashFocus();
  const isSubmitted = useStore((s) => s.isSubmitted);
  const financial = useStore((state) => state.financial);
  const updateSection = useStore((state) => state.updateSection);
  const navigate = useNavigate();
const {bankNames,grantCategories,scholarshipCategories} =useStore();
const {
  deleteProfileRecord,
} = useStore();
  const saveAndRefresh =
  useStore((s) => s.saveAndRefresh);
  const fetchCanEdit = useStore((s) => s.fetchCanEdit);

  // Helper for Nested Updates (educationLoan and bankAccount)
  const handleNestedChange = (parent, child, value) => {
    updateSection("financial", {
      [parent]: {
        ...financial[parent],
        [child]: value,
      },
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    updateSection("financial", { [id]: value });
  };

// const handleSave = async () => {

//   const formData =
//     new FormData();

//   // Scholarship

//   formData.append(
//     "financial_details[schType]",
//     financial.schType || ""
//   );

//   formData.append(
//     "financial_details[schId]",
//     financial.schId || ""
//   );

//   formData.append(
//     "financial_details[schOther]",
//     financial.schOther || ""
//   );

//   // Fee Waiver File

//   if (
//     financial.feeWaiveUrl?.document
//       instanceof File
//   ) {

//     formData.append(
//       "feeWaiveDocument",
//       financial.feeWaiveUrl.document
//     );

//   }

//   // Education Loan

//   formData.append(
//     "financial_details[educationLoan][bankName]",
//     financial.educationLoan?.bankName || ""
//   );


//   formData.append(
//     "financial_details[educationLoan][amount]",
//     financial.educationLoan?.amount || ""
//   );

//   // Bank Account

//   formData.append(
//     "financial_details[bankAccount][accountHolderName]",
//     financial.bankAccount?.accountHolderName || ""
//   );

//   formData.append(
//     "financial_details[bankAccount][accountNumber]",
//     financial.bankAccount?.accountNumber || ""
//   );

//   formData.append(
//     "financial_details[bankAccount][bankName]",
//     financial.bankAccount?.bankName || ""
//   );

//   formData.append(
//     "financial_details[bankAccount][branchName]",
//     financial.bankAccount?.branchName || ""
//   );

//   formData.append(
//     "financial_details[bankAccount][ifscCode]",
//     financial.bankAccount?.ifscCode || ""
//   );

//   // Grants
//   formData.append(
//     "financial_details[grantType]",
//     financial.grantType || ""
//   );
//   formData.append(
//     "financial_details[grantOther]",
//     financial.grantOther || ""
//   );
//   formData.append(
//     "financial_details[grantId]",
//     financial.grantId || ""
//   );
//   if (financial.grantWaiveUrl?.document instanceof File) {
//     formData.append(
//       "grantWaiveDocument",
//       financial.grantWaiveUrl.document
//     );
//   }

//   // PAN
//   formData.append(
//     "financial_details[pan]",
//     financial.pan || ""
//   );

//   // Debug
//   for (const [key, value] of formData.entries()) {
//     console.log(key, value);
//   }

//   console.log(
//     "PAN VALUE =",
//     financial.pan
//   );

//   await saveAndRefresh(
//     formData,
//     true
//   );
//   await fetchCanEdit();

// };
const handleSave = async () => {
  navigate("/forms/professional");
};  

const addScholarship = () => {

  updateSection("financial", {

    scholarships: [

      ...(financial.scholarships || []),

      {
        schType: "none",
        schOther: "",
        schId: "",
        feeWaiveUrl: {
          document: "",
        },
        fileError: "",
      },

    ],

  });

};


const addGrant = () => {

  updateSection("financial", {

    grants: [

      ...(financial.grants || []),

      {
        grantType: "none",
        grantOther: "",
        grantId: "",
        grantWaiveUrl: {
          document: "",
        },
        fileError: "",
      },

    ],

  });

};

const handleDeleteGrant = async (index) => {

  const grant = financial.grants[index];

  if (!grant) return;

  // Not saved yet
  if (!grant._id) {

    updateSection("financial", {
      grants: financial.grants.filter((_, i) => i !== index),
    });

    return;

  }

  const result = await deleteProfileRecord(
    "grants",
    grant._id
  );

  if (result.success) {

    updateSection("financial", {
      grants: financial.grants.filter((_, i) => i !== index),
    });

  } else {

    alert(result.message);

  }

};
const handleGrantFile = (
  index,
  e
) => {

  const arr = [...(financial.grants || [])];

  arr[index] = {

    ...arr[index],

    grantWaiveUrl: {
      document: e.target.file,
    },

    fileError: e.target.error,

  };

  updateSection("financial", {

    grants: arr,

  });

};

const handleGrantChange = (
  index,
  field,
  value
) => {

  const arr = [...(financial.grants || [])];

  arr[index] = {

    ...arr[index],

    [field]: value,

  };

  updateSection("financial", {

    grants: arr,

  });

};




const handleScholarshipFile = (
  index,
  e
) => {

  const arr = [
    ...(financial.scholarships || [])
  ];

  arr[index] = {

    ...arr[index],

    feeWaiveUrl: {
      document: e.target.file,
    },

    fileError: e.target.error,

  };

  updateSection("financial", {

    scholarships: arr,

  });

};


const handleScholarshipChange = (
  index,
  field,
  value
) => {

  const arr = [
    ...(financial.scholarships || [])
  ];

  arr[index] = {

    ...arr[index],

    [field]: value,

  };

  updateSection("financial", {

    scholarships: arr,

  });

};




const handleDeleteScholarship = async (index) => {

  const scholarship =
    financial.scholarships[index];

  if (!scholarship) return;

  // Not saved in DB yet
  if (!scholarship._id) {

    updateSection("financial", {
      scholarships:
        financial.scholarships.filter(
          (_, i) => i !== index
        ),
    });

    return;

  }

  const result =
    await deleteProfileRecord(
      "scholarships",
      scholarship._id
    );

  if (result.success) {

    updateSection("financial", {
      scholarships:
        financial.scholarships.filter(
          (_, i) => i !== index
        ),
    });

  } else {

    alert(result.message);

  }

};


return (
    <FormWrapper
      title="Financial Details"
      description="Provide your scholarship, loan, and bank details for processing."
      onSave={handleSave}
    >
    <FormSection title="Scholarships & Support" icon={Wallet}>

  <div className="md:col-span-2 space-y-6">

    {(financial.scholarships || []).map((sch, index) => (

      <div
        key={index}
        className="relative grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2"
      >

        {/* Delete Button */}

        <button
  type="button"
  onClick={() =>
    handleDeleteScholarship(index)
  }
  className="absolute right-4 top-4 text-red-500"
>
  <Trash2 size={18} />
</button>

        {/* Scholarship Category */}

        <SelectField
          label="Scholarship Category"
          value={sch.schType || "none"}
          options={scholarshipCategories}
          disabled={isSubmitted}
          onChange={(e) =>
            handleScholarshipChange(
              index,
              "schType",
              e.target.value
            )
          }
        />

        {/* Other */}

        {sch.schType === "others" && (

          <InputField
            label="Specify Scholarship"
            value={sch.schOther || ""}
            disabled={isSubmitted}
            onChange={(e) =>
              handleScholarshipChange(
                index,
                "schOther",
                e.target.value
              )
            }
          />

        )}

        {/* Scholarship ID */}

        {sch.schType !== "none" && (

          <>

            <InputField
              label="Scholarship ID"
              value={sch.schId || ""}
              disabled={isSubmitted}
              onChange={(e) =>
                handleScholarshipChange(
                  index,
                  "schId",
                  e.target.value
                )
              }
            />

            <FileInput
              label="Fee Waiver Document"
              file={
                sch.feeWaiveUrl?.document?.name ||
                sch.feeWaiveUrl?.document
              }
              fileUrl={
                sch.feeWaiveUrl?.document?.url
              }
              error={sch.fileError}
              disabled={isSubmitted}
              onChange={(e) =>
                handleScholarshipFile(
                  index,
                  e
                )
              }
            />

          </>

        )}

      </div>

    ))}

    <button
      type="button"
      disabled={isSubmitted}
      onClick={addScholarship}
      className="flex items-center gap-2 font-medium text-primary"
    >
      <Plus size={16} />
      Add Scholarship
    </button>

  </div>

</FormSection>
      <FormSection title="Grants" icon={ShieldCheck}>

  <div className="md:col-span-2 space-y-6">

    {(financial.grants || []).map((grant, index) => (

      <div
        key={index}
        className="relative grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2"
      >

        <button
  type="button"
  onClick={() => handleDeleteGrant(index)}
  className="absolute right-4 top-4 text-red-500"
>
  <Trash2 size={18} />
</button>
        <SelectField
          label="Grant Category"
          value={grant.grantType || "none"}
          options={grantCategories}
          disabled={isSubmitted}
          onChange={(e) =>
            handleGrantChange(
              index,
              "grantType",
              e.target.value
            )
          }
        />

        {grant.grantType === "others" && (

          <InputField
            label="Specify Grant Category"
            value={grant.grantOther || ""}
            placeholder="Enter grant type"
            disabled={isSubmitted}
            onChange={(e) =>
              handleGrantChange(
                index,
                "grantOther",
                e.target.value
              )
            }
          />

        )}

        {grant.grantType !== "none" && (

          <>

            <InputField
              label="Grant Unique ID"
              value={grant.grantId || ""}
              placeholder="Enter your grant ID"
              disabled={isSubmitted}
              onChange={(e) =>
                handleGrantChange(
                  index,
                  "grantId",
                  e.target.value
                )
              }
            />

            <FileInput
              label="Grant Document"
              file={
                grant.grantWaiveUrl?.document?.name ||
                grant.grantWaiveUrl?.document
              }
              fileUrl={
                grant.grantWaiveUrl?.document?.url
              }
              error={grant.fileError}
              disabled={isSubmitted}
              onChange={(e) =>
                handleGrantFile(index, e)
              }
            />

          </>

        )}

      </div>

    ))}

    <button
      type="button"
      disabled={isSubmitted}
      onClick={addGrant}
      className="flex items-center gap-2 font-medium text-primary"
    >
      <Plus size={16} />
      Add Grant
    </button>

  </div>

</FormSection>
      {/* ===================== 2. EDUCATION LOAN ===================== */}
      <FormSection title="Education Loan Details" icon={Wallet}>
        <SelectField
          label="Bank Name"
          value={financial.educationLoan?.bankName || ""}
          onChange={(e) => handleNestedChange("educationLoan", "bankName", e.target.value)}
          disabled={isSubmitted}
          options={bankNames}
        />

      

        <InputField
          label="Loan Amount"
          type="number"
          value={financial.educationLoan?.amount || ""}
          onChange={(e) => handleNestedChange("educationLoan", "amount", e.target.value)}
          disabled={isSubmitted}
        />
      </FormSection>

      {/* ===================== 3. BANK ACCOUNT ===================== */}
      <FormSection title="Student Bank Account Details" icon={Landmark}>
        <InputField
          label="Account Holder Name"
          value={financial.bankAccount?.accountHolderName || ""}
          onChange={(e) => handleNestedChange("bankAccount", "accountHolderName", e.target.value)}
          disabled={isSubmitted}
        />

      <InputField
  label="PAN Card Number"
  id="pan"
  value={financial.pan || ""}
  disabled={isSubmitted}
  onChange={(e) => {

    const value =
      e.target.value
        .toUpperCase();

    if (
      value.length <= 10 &&
      /^[A-Z0-9]*$/.test(value)
    ) {

      updateSection(
        "financial",
        {
          pan: value
        }
      );

    }

  }}
  placeholder="ABCDE1234F"
/>

        <InputField
          label="Account Number"
          value={financial.bankAccount?.accountNumber || ""}
          onChange={(e) => handleNestedChange("bankAccount", "accountNumber", e.target.value)}
          disabled={isSubmitted}
        />

        <InputField
          label="IFSC Code"
          value={financial.bankAccount?.ifscCode || ""}
          disabled={isSubmitted}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            if (/^[A-Z]{0,4}0?[A-Z0-9]{0,6}$/.test(value)) {
              handleNestedChange("bankAccount", "ifscCode", value);
            }
          }}
          placeholder="SBIN0001234"
        />
      </FormSection>

      {/* ===================== INFO BOX ===================== */}
      <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-xl flex gap-4 items-start mt-6">
        <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
        <div>
          <h3 className="font-bold text-primary">Data Protection Notice</h3>
          <p className="text-sm text-slate-600 mt-1">
            Your financial details are encrypted and used only for university processing.
          </p>
        </div>
      </div>
    </FormWrapper>
  );
}