import React from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
  FileInput,
  SelectField,
} from "../../components/FormWrapper";
import { Wallet, Landmark, ShieldCheck, FileText } from "lucide-react";

export default function FinancialForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const financial = useStore((state) => state.financial);
  const updateSection = useStore((state) => state.updateSection);

  const handleSave = () => {
    console.log("Saved Financial Data:", financial);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    updateSection("financial", { [id]: value });
  };

  const handleArrayFile = (file, index, key) => {
  // 150KB in bytes
  const limitBytes = 150 * 1024; 
  const arr = [...(professional[key] || [])];
  
  if (file.size > limitBytes) {
    arr[index] = { 
      ...arr[index], 
      docName: "", 
      fileError: "File too large (Max 150KB allowed)" 
    };
  } else {
    arr[index] = { 
      ...arr[index], 
      docName: file.name, 
      fileError: "" 
    };
  }
  
  updateSection("professional", { [key]: arr });
};


  return (
    <FormWrapper
      title="Financial Details"
      description="Provide your scholarship, loan, and bank details for processing."
      onSave={handleSave}
    >
      {/* ===================== 1. SCHOLARSHIP ===================== */}
      <FormSection title="Scholarship & Support" icon={Wallet}>
  {/* 1. Category Selection - Always Visible */}
  <SelectField
    label="Scholarship Category"
    id="scholarshipCategory"
    required
    value={financial.scholarshipCategory || "none"}
    onChange={(e) => {
      const val = e.target.value;
      if (val === "none") {
        // Clear sub-fields if "none" is selected
        updateSection("financial", {
          scholarshipCategory: val,
          scholarshipId: "",
          feeDocName: "",
        });
      } else {
        handleChange(e);
      }
    }}
    disabled={isSubmitted}
    options={[
      { value: "none", label: "None" },
      { value: "government", label: "Government" },
      { value: "institutional", label: "Institutional" },
      { value: "jrf", label: "JRF" },
      { value: "egrant", label: "e-Grant" },
    ]}
  />

  {/* 2. Conditional Fields - Visible only if NOT "none" */}
  {financial.scholarshipCategory && financial.scholarshipCategory !== "none" && (
    <>
      <InputField
        label={`${financial.scholarshipCategory.toUpperCase()} Unique ID`}
        id="scholarshipId"
        placeholder="Enter your registration ID"
        required
        value={financial.scholarshipId || ""}
        onChange={handleChange}
        disabled={isSubmitted}
      />

    <FileInput
  label="Fee Waiver Document"
  file={financial.feeDocName}
  error={financial.feeDocError}
  onChange={(e) => {
    // The component sends back the object we created in onFileChange
    const { name, error } = e.target;
    
    updateSection("financial", {
      feeDocName: name,
      feeDocError: error,
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
          id="loanBankName"
          value={financial.loanBankName || ""}
          onChange={handleChange}
          disabled={isSubmitted}
          options={[
            { value: "", label: "Select Bank..." },
            { value: "SBI", label: "State Bank of India" },
            { value: "HDFC", label: "HDFC Bank" },
            { value: "ICICI", label: "ICICI Bank" },
            { value: "Axis", label: "Axis Bank" },
            { value: "Canara", label: "Canara Bank" },
            { value: "Federal", label: "Federal Bank" },
          ]}
        />

        <InputField
          label="Branch Name"
          id="loanBranch"
          value={financial.loanBranch || ""}
          onChange={handleChange}
          disabled={isSubmitted}
        />

        <InputField
          label="Loan Amount"
          id="loanAmount"
          type="number"
          value={financial.loanAmount || ""}
          onChange={handleChange}
          disabled={isSubmitted}
        />
      </FormSection>

      {/* ===================== 3. BANK ACCOUNT ===================== */}
      <FormSection title="Student Bank Account Details" icon={Landmark}>
        <InputField
          label="Account Holder Name"
          id="bankAccountHolder"
          value={financial.bankAccountHolder || ""}
          onChange={handleChange}
          disabled={isSubmitted}
        />

        <InputField
          label="PAN Card Number"
          id="panNumber"
          value={financial.panNumber || ""}
          disabled={isSubmitted}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            // simple PAN format: ABCDE1234F
            const valid = /^[A-Z]{0,5}[0-9]{0,4}[A-Z]{0,1}$/.test(value);

            if (valid) {
              updateSection("financial", { panNumber: value });
            }
          }}
          placeholder="ABCDE1234F"
        />

        <InputField
          label="Account Number"
          id="accountNumber"
          type="password"
          value={financial.accountNumber || ""}
          onChange={handleChange}
          disabled={isSubmitted}
        />

        <InputField
          label="IFSC Code"
          id="ifscCode"
          value={financial.ifscCode || ""}
          disabled={isSubmitted}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            // IFSC: 4 letters + 0 + 6 digits
            const valid = /^[A-Z]{0,4}0?[A-Z0-9]{0,6}$/.test(value);

            if (valid) {
              updateSection("financial", { ifscCode: value });
            }
          }}
          placeholder="SBIN0001234"
        />
      </FormSection>

      {/* ===================== INFO BOX ===================== */}
      <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-xl flex gap-4 items-start">
        <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
        <div>
          <h3 className="font-bold text-primary">Data Protection Notice</h3>
          <p className="text-sm text-slate-600 mt-1">
            Your financial details are encrypted and used only for university
            disbursements and fee processing. All data handlers follow strict
            confidentiality protocols.
          </p>
        </div>
      </div>
    </FormWrapper>
  );
}