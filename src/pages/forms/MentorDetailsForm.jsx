import React from "react";
import { useStore } from "../../store";
import FormWrapper, { FormSection, InputField } from "../../components/FormWrapper";
import { UserCheck, ShieldCheck } from "lucide-react";

export default function MentorDetailsForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const mentor = useStore((state) => state.mentor);
  console.log("Mentor State:", mentor); // Debugging log
  const handleSave = () => {
    console.log("Saved Mentor Data:", mentor);
  };

  return (
    <FormWrapper
      title="Mentor & HOD Details"
      description="These details are automatically assigned by the institution and cannot be modified."
      onSave={handleSave}
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ================= TUTOR ================= */}
        <FormSection title="Tutor Details" icon={UserCheck} className="md:col-span-1">
          <div className="col-span-2 space-y-6">

            <InputField
              label="Tutor Name"
              id="tutorName"
              value={mentor.tutorName || "Dr. Rahul Das"}
              disabled={true}
              placeholder="Assigned by system"
            />

            <InputField
              label="Tutor Email"
              id="tutorEmail"
              value={mentor.tutorEmail || "rahuldas@kanunivc.ac"}
              disabled={true}
              placeholder="Assigned by system"
            />

          </div>
        </FormSection>

        {/* ================= HOD ================= */}
        <FormSection title="HOD Details" icon={ShieldCheck} className="md:col-span-1">
          <div className="col-span-2 space-y-6">

            <InputField
              label="HOD Name"
              id="hodName"
              value={mentor.hodName || "Mr. Abdula"}
              readOnly
              disabled={true}
              placeholder="Assigned by system"
            />

            <InputField
              label="HOD Email"
              id="hodEmail"
              value={mentor.hodEmail || "adbula@kanuunic.com"}
              disabled={true}
              placeholder="Assigned by system"
              
            />

          </div>
        </FormSection>

      </div>

    </FormWrapper>
  );
}