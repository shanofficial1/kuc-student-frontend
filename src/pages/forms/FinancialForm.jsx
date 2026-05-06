import React from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
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
          id="scholarshipCategory"
          value={financial.scholarshipCategory || ""}
          onChange={handleChange}
          disabled={isSubmitted}
          options={[
            { value: "", label: "Select..." },
            { value: "government", label: "Government" },
            { value: "institutional", label: "Institutional" },
            { value: "jrf", label: "JRF" },
            { value: "egrant", label: "e-Grant" },
            { value: "none", label: "None" },
          ]}
        />

        <InputField
          label="Scholarship Unique ID"
          id="scholarshipId"
          value={financial.scholarshipId || ""}
          onChange={handleChange}
          disabled={isSubmitted}
        />

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-slate-600">
            Upload Fee Waiver Document
          </label>

          <label
            className={`w-full h-12 flex items-center justify-between px-3 border rounded-lg cursor-pointer transition 
            ${financial.feeDocName ? "border-green-500 bg-green-50" : "border-slate-200 bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-md 
                ${financial.feeDocName ? "bg-green-100" : "bg-slate-100"}`}
              >
                <FileText
                  size={18}
                  className={financial.feeDocName ? "text-green-600" : "text-slate-500"}
                />
              </div>

              <span
                className={`text-sm truncate block 
                ${financial.feeDocError
                  ? "text-red-600"
                  : financial.feeDocName
                  ? "text-green-700 font-medium"
                  : "text-slate-500"}`}
              >
                {financial.feeDocError ||
                  financial.feeDocName ||
                  "Upload PDF / Image"}
              </span>
            </div>

            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                updateSection("financial", {
                  feeDocName: file.name,
                  feeDocError: "",
                });
              }}
            />
          </label>
        </div>
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