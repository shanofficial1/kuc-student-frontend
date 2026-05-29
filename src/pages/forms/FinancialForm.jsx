import React from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
  FileInput,
  SelectField,
} from "../../components/FormWrapper";
import { Wallet, Landmark, ShieldCheck } from "lucide-react";

export default function FinancialForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const financial = useStore((state) => state.financial);
  const updateSection = useStore((state) => state.updateSection);

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

  const handleSave = () => {
    console.log("Saved Financial Data:", financial);
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
                schId: "",
                feeWaiveUrl: { document: "" },
              });
            } else {
              handleChange(e);
            }
          }}
          disabled={isSubmitted}
          options={[
            { value: "none", label: "None" },
            { value: "Government", label: "Government" },
            { value: "Institutional", label: "Institutional" },
            { value: "JRF", label: "JRF" },
            { value: "e-Grant", label: "e-Grant" },
          ]}
        />

        {financial.schType && financial.schType !== "none" && (
          <>
            <InputField
              label={`${financial.schType.toUpperCase()} Unique ID`}
              id="schId" // Matches backend "schId"
              placeholder="Enter your registration ID"
              required
              value={financial.schId || ""}
              onChange={handleChange}
              disabled={isSubmitted}
            />

            <FileInput
              label="Fee Waiver Document"
              // Shows existing document name from the URL path
              file={financial.feeWaiveUrl?.document?.split('/').pop() || financial.feeDocName}
              error={financial.feeDocError}
              disabled={isSubmitted}
              onChange={(e) => {
                const { name, error, file } = e.target;
                updateSection("financial", {
                  feeDocName: name,
                  feeDocError: error,
                  // If binary is needed: feeDocFile: file
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
          options={[
            { value: "", label: "Select Bank..." },
            { value: "SBI", label: "State Bank of India" },
            { value: "HDFC", label: "HDFC Bank" },
            { value: "ICICI", label: "ICICI Bank" },
          ]}
        />

        <InputField
          label="Branch Name"
          value={financial.educationLoan?.branch || ""}
          onChange={(e) => handleNestedChange("educationLoan", "branch", e.target.value)}
          disabled={isSubmitted}
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
          id="pan" // Matches backend "pan"
          value={financial.pan || ""}
          disabled={isSubmitted}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            if (/^[A-Z]{0,5}[0-9]{0,4}[A-Z]{0,1}$/.test(value)) {
              updateSection("financial", { pan: value });
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