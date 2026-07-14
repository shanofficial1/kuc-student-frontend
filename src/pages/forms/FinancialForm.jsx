import React from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
  FileInput,
  SelectField,
} from "../../components/FormWrapper";
import { Wallet, Landmark, ShieldCheck } from "lucide-react";
import useHashFocus from '../../hooks/useHashFocus';
import { useNavigate } from "react-router-dom";
export default function FinancialForm() {
  useHashFocus();
  const isSubmitted = useStore((s) => s.isSubmitted);
  const financial = useStore((state) => state.financial);
  const updateSection = useStore((state) => state.updateSection);
  const navigate = useNavigate();
const {bankNames,grantCategories,scholarshipCategories} =useStore();

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
return (
    <FormWrapper
      title="Financial Details"
      description="Provide your scholarship, loan, and bank details for processing."
      onSave={handleSave}
    >
      {/* ===================== 1. SCHOLARSHIP ===================== */}
      <FormSection title="Scholarship & Support" icon={Wallet}>
        <SelectField
          label="Scholarship Category"
          id="schType" // Matches backend "schType"
          required
          value={financial.schType || "none"}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "none") {
              updateSection("financial", {
                schType: val,
                schOther: "",
                schId: "",
                feeWaiveUrl: { document: "" },
                feeDocError: "",
              });
            } else if (val === "others") {
              updateSection("financial", {
                schType: val,
                schOther: "",
                schId: "",
                feeWaiveUrl: { document: "" },
                feeDocError: "",
              });
            } else {
              handleChange(e);
            }
          }}
          disabled={isSubmitted}
          options={scholarshipCategories}
        />

        {financial.schType === "others" && (
          <InputField
            label="Specify Scholarship Category"
            id="schOther"
            placeholder="Enter scholarship type"
            required
            value={financial.schOther || ""}
            onChange={handleChange}
            disabled={isSubmitted}
          />
        )}

        {financial.schType && financial.schType !== "none" && (
          <>
            <InputField
              label={`${financial.schType === "others" ? "Scholarship" : financial.schType.toUpperCase()} Unique ID`}
              id="schId" // Matches backend "schId"
              placeholder="Enter your registration ID"
              required
              value={financial.schId || ""}
              onChange={handleChange}
              disabled={isSubmitted}
            />
            <FileInput
              label="Fee Waiver Document"
              file={
                financial.feeWaiveUrl?.document?.name ||
                financial.feeWaiveUrl?.document
              }
              fileUrl={
                financial.feeWaiveUrl?.document?.url
              }
              error={financial.feeDocError}
              disabled={isSubmitted}
              onChange={(e) => {
                updateSection("financial", {
                  feeWaiveUrl: {
                    document: e.target.file,
                  },
                  feeDocError: e.target.error,
                });
              }}
            />
          </>
        )}
      </FormSection>

      <FormSection title="Grants" icon={ShieldCheck}>
        <SelectField
          label="Grant Category"
          id="grantType"
          required
          value={financial.grantType || "none"}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "none") {
              updateSection("financial", {
                grantType: val,
                grantOther: "",
                grantId: "",
                grantWaiveUrl: { document: "" },
                grantDocError: "",
              });
            } else if (val === "others") {
              updateSection("financial", {
                grantType: val,
                grantOther: "",
                grantId: "",
                grantWaiveUrl: { document: "" },
                grantDocError: "",
              });
            } else {
              handleChange(e);
            }
          }}
          disabled={isSubmitted}
          options={grantCategories}
        />

        {financial.grantType === "others" && (
          <InputField
            label="Specify Grant Category"
            id="grantOther"
            placeholder="Enter grant type"
            required
            value={financial.grantOther || ""}
            onChange={handleChange}
            disabled={isSubmitted}
          />
        )}

        {financial.grantType && financial.grantType !== "none" && (
          <>
            <InputField
              label={`${financial.grantType === "others" ? "Grant" : financial.grantType.toUpperCase()} Unique ID`}
              id="grantId"
              placeholder="Enter your numeric ID"
              required
              value={financial.grantId || ""}
              onChange={handleChange}
              disabled={isSubmitted}
            />
            <FileInput
              label="Grant Waiver Document"
              file={
                financial.grantWaiveUrl?.document?.name ||
                financial.grantWaiveUrl?.document
              }
              fileUrl={
                financial.grantWaiveUrl?.document?.url
              }
              error={financial.grantDocError}
              disabled={isSubmitted}
              onChange={(e) => {
                updateSection("financial", {
                  grantWaiveUrl: {
                    document: e.target.file,
                  },
                  grantDocError: e.target.error,
                });
              }}
            />
          </>
        )}
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