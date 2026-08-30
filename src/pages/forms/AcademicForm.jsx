import React from 'react';
import { useStore } from '../../store';
import { getChangedFields, SECTION_API_KEYS } from '../../lib/utils';
import useHashFocus from '../../hooks/useHashFocus';
import FormWrapper, {
  FormSection,
  InputField,
  SelectField,
  FileInput
} from '../../components/FormWrapper';

import {
  Fingerprint,
  GraduationCap,
  Calendar,
  BookOpen,
  Crown,
  Search
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import GlobalLoader from '@/src/components/GlobalLoader';

export const FACULTY_OPTIONS = [
  {
    value: "Engineering",
    label: "Engineering",
  },

  {
    value: "Science",
    label: "Science",
  },

  {
    value: "Arts",
    label: "Arts",
  },
];

export const DEPARTMENT_OPTIONS = [

  {
    value: "Department Of Information Technology",
    label: "Department Of Information Technology",
  },

  {
    value: "Department of Wood Science & Technology",
    label: "Department of Wood Science & Technology",
  },

  {
    value: "Department of Library and Information Science.",
    label: "Department of Library and Information Science.",
  },

  {
    value: "Department of Journalism and Media Studies",
    label: "Department of Journalism and Media Studies",
  },

  {
    value: "Department Of Mathematical Sciences",
    label: "Department Of Mathematical Sciences",
  },

  {
    value: "Department of Statistical Sciences",
    label: "Department of Statistical Sciences",
  },

  {
    value: "Department Of Biotechnology & Microbiology",
    label: "Department Of Biotechnology & Microbiology",
  },

  {
    value: "Department of Chemistry",
    label: "Department of Chemistry",
  },

  {
    value: "Department of Physics",
    label: "Department of Physics",
  },

  {
    value: "Department Of Studies In English",
    label: "Department Of Studies In English",
  },

  {
    value: "Department Of Economics",
    label: "Department Of Economics",
  },

  {
    value: "Department Of Anthropology",
    label: "Department Of Anthropology",
  },

  {
    value: "Department of History",
    label: "Department of History",
  },
];

export const DEGREE_OPTIONS = [

  {
    value: "B.Sc. Computer Science",
    label: "B.Sc. Computer Science",
  },

  {
    value: "B.Com. Computer Application",
    label: "B.Com. Computer Application",
  },

  {
    value: "B.Sc. Electronics",
    label: "B.Sc. Electronics",
  },

  {
    value: "M.Sc. Computer Science",
    label: "M.Sc. Computer Science",
  },

  {
    value: "B.Sc. Wood Science & Technology",
    label: "B.Sc. Wood Science & Technology",
  },

  {
    value: "B.Sc. Forestry",
    label: "B.Sc. Forestry",
  },

  {
    value: "B.Lib.I.Sc.",
    label: "B.Lib.I.Sc.",
  },

  {
    value: "M.Lib.I.Sc.",
    label: "M.Lib.I.Sc.",
  },

  {
    value: "B.A. Journalism",
    label: "B.A. Journalism",
  },

  {
    value: "M.A. Journalism",
    label: "M.A. Journalism",
  },

  {
    value: "B.Sc. Mathematics",
    label: "B.Sc. Mathematics",
  },

  {
    value: "M.Sc. Mathematics",
    label: "M.Sc. Mathematics",
  },

  {
    value: "B.Sc. Statistics",
    label: "B.Sc. Statistics",
  },

  {
    value: "M.Sc. Statistics",
    label: "M.Sc. Statistics",
  },

  {
    value: "B.Sc. Biotechnology",
    label: "B.Sc. Biotechnology",
  },

  {
    value: "B.Sc. Microbiology",
    label: "B.Sc. Microbiology",
  },

  {
    value: "B.Sc. Bioinformatics",
    label: "B.Sc. Bioinformatics",
  },

  {
    value: "B.Sc. Chemistry",
    label: "B.Sc. Chemistry",
  },

  {
    value: "M.Sc Chemistry",
    label: "M.Sc Chemistry",
  },

  {
    value: "B.Sc. Physics",
    label: "B.Sc. Physics",
  },

  {
    value: "M.Sc Physics",
    label: "M.Sc Physics",
  },

  {
    value: "B.A. English",
    label: "B.A. English",
  },

  {
    value: "B.A. Functional English",
    label: "B.A. Functional English",
  },

  {
    value: "B.A. Economics",
    label: "B.A. Economics",
  },

  {
    value: "B.A. Development Economics",
    label: "B.A. Development Economics",
  },

  {
    value: "M.A Economics",
    label: "M.A Economics",
  },

  {
    value: "B.A. Political Science",
    label: "B.A. Political Science",
  },

  {
    value: "B.A. Philosophy",
    label: "B.A. Philosophy",
  },

  {
    value: "M.A in Governance and Politics",
    label: "M.A in Governance and Politics",
  },

  {
    value: "B.A. History",
    label: "B.A. History",
  },

  {
    value: "M.A Social Science with Specialization in History",
    label: "M.A Social Science with Specialization in History",
  },
];

export default function AcademicForm() {
  useHashFocus();
  const isSubmitted = useStore((s) => s.isSubmitted);
const store = useStore();
  const navigate = useNavigate();
const {faculty,departments,degreeNames,programLevels,admissionCategories,studyModes,currentSemesters,currentYears,specializations
} = useStore();


  const currentYear = new Date().getFullYear();

  const academic = useStore((state) => state.academic);

  const updateSection = useStore(
    (state) => state.updateSection
  );

  const isLoading = useStore(
    (state) => state.isLoading
  );

  const setLoading = useStore(
    (state) => state.setLoading
  );


  const validateAcademicCycle = (value) => {
  if (!value) return "";

  // Split multiple academic cycles
  const cycles = value.split(",");

  const seen = new Set();

  for (let cycle of cycles) {
    cycle = cycle.trim();

    // Must be YYYY-YYYY
    if (!/^\d{4}-\d{4}$/.test(cycle)) {
      return "Use format YYYY-YYYY";
    }

    const [startYear, endYear] = cycle
      .split("-")
      .map(Number);

    // Same year
    if (startYear === endYear) {
      return "Start and end year cannot be the same";
    }

    // End year must be after start year
    if (endYear < startYear) {
      return "End year must be after start year";
    }

    // Prevent duplicate cycles
    const normalized = `${startYear}-${endYear}`;

    if (seen.has(normalized)) {
      return "Duplicate academic cycle is not allowed";
    }

    seen.add(normalized);
  }

  return "";
};

const saveAndRefresh = useStore(
  (s) => s.saveAndRefresh
);
const fetchCanEdit = useStore((s) => s.fetchCanEdit);

// const handleSave = async () => {
//   const academic = useStore.getState().academic;
//   const originalAcademic = useStore.getState().profileSnapshot?.academic || {};
//   const changedAcademic = getChangedFields(originalAcademic, academic);

//   if (!Object.keys(changedAcademic).length) {
//     alert("No changes detected in academic details.");
//     return;
//   }

//   const formData = new FormData();
//   const sectionKey = SECTION_API_KEYS.academic;

//   if ("programLevel" in changedAcademic) {
//     formData.append("academic_details[programLevel]", academic.programLevel || "");
//   }
//   if ("admissionCategory" in changedAcademic) {
//     formData.append("academic_details[admissionCategory]", academic.admissionCategory || "");
//   }
//   if ("modeOfStudy" in changedAcademic) {
//     formData.append("academic_details[modeOfStudy]", academic.modeOfStudy || "");
//   }
//   if ("admissionApplicationNumber" in changedAcademic) {
//     formData.append("academic_details[admissionApplicationNumber]", academic.admissionApplicationNumber || "");
//   }
//   if ("universityEnrollmentNumber" in changedAcademic) {
//     formData.append("academic_details[universityEnrollmentNumber]", academic.universityEnrollmentNumber || "");
//   }
//   if ("rollNumber" in changedAcademic) {
//     formData.append("academic_details[rollNumber]", academic.rollNumber || "");
//   }
//   if ("faculty" in changedAcademic) {
//     formData.append("academic_details[faculty]", academic.faculty || "");
//   }
//   if ("department" in changedAcademic) {
//     formData.append("academic_details[department]", academic.department || "");
//   }
//   if ("degreeName" in changedAcademic) {
//     formData.append("academic_details[degreeName]", academic.degreeName || "");
//   }
//   if ("specialization" in changedAcademic) {
//     formData.append("academic_details[specialization]", academic.specialization || "");
//   }
//   if ("academicCycle" in changedAcademic) {
//     formData.append("academic_details[academicCycle]", academic.academicCycle || "");
//   }
//   if ("admissionBatch" in changedAcademic) {
//     formData.append("academic_details[admissionBatch]", academic.admissionBatch || "");
//   }
//   if ("currentSemester" in changedAcademic) {
//     formData.append("academic_details[currentSemester]", academic.currentSemester || "");
//   }
//   if ("currentYear" in changedAcademic) {
//     formData.append("academic_details[currentYear]", academic.currentYear || "");
//   }
//   if ("fellowshipLetterNumber" in changedAcademic) {
//     formData.append("academic_details[fellowshipLetterNumber]", academic.fellowshipLetterNumber || "");
//   }
//   if (academic.fellowshipLetter instanceof File && changedAcademic.fellowshipLetter) {
//     formData.append("fellowshipLetter", academic.fellowshipLetter);
//   }

//   formData.append("updatedSections[]", sectionKey);

//   await saveAndRefresh(
//     formData,
//     true
//   );

//   await fetchCanEdit();
// };
const handleSave = async () => {
  navigate("/forms/personal");
};
const handleChange = (e) => {

  const { id, value } = e.target;

  // If user changes specialization from "Other" to a normal option,
  // clear the custom value.
  if (id === "specialization" && value !== "__OTHER__") {

    updateSection("academic", {
      specialization: value,
      specializationCustom: "",
    });

    return;
  }

  updateSection("academic", {
    [id]: value,
  });

};
console.log(
  "fellowshipLetter",
  academic.fellowshipLetter
);



const specializationOptions = [
  ...specializations,
  {
    value: "__OTHER__",
    label: "Other",
  },
];

  return (
    <>

      {isLoading && <GlobalLoader />}

      <FormWrapper
        title="Academic Information"
        description="Please fill in your current academic details accurately as per university records."
        onSave={handleSave}
      >

        {/* Academic Identity */}

        <FormSection
          title="Academic Identity"
          icon={Fingerprint}
        >

          <InputField
            label="Admission Application Number"
            id="admissionApplicationNumber"
            required
            value={
              academic.admissionApplicationNumber || ""
            }
            onChange={handleChange}
            placeholder="e.g. ADM2024001"
          />

          <InputField
            label="University Enrollment Number"
            id="universityEnrollmentNumber"
            value={
              academic.universityEnrollmentNumber || ""
            }
            onChange={handleChange}
            placeholder="e.g. KU-2021-CS-882"
          />

          <InputField
            label="Roll Number"
            id="rollNumber"
            value={academic.rollNumber || ""}
            onChange={handleChange}
            placeholder="21CS042"
          />

        </FormSection>

        {/* Program Hierarchy */}

        <FormSection
          title="Program Hierarchy"
          icon={GraduationCap}
        >

         <SelectField
  label="Faculty / School"
  id="faculty"
  value={academic.faculty || ""}
  onChange={handleChange}
  options={faculty}
  disabled={isSubmitted}
/><SelectField
  label="Department"
  id="department"
  value={academic.department || ""}
  onChange={handleChange}
  options={departments}
    disabled={isSubmitted}

/>

          <SelectField
            label="Program Level"
            id="programLevel"
            value={academic.programLevel || ""}
            onChange={handleChange}
              disabled={isSubmitted}

           options={programLevels}
          />

         <SelectField
  label="Degree Name"
  id="degreeName"
    disabled={isSubmitted}

  value={academic.degreeName || ""}
  onChange={handleChange}
  options={degreeNames}
/>

        </FormSection>

        {/* Research */}

       <FormSection
  title="Research & Specialization"
  icon={Search}
>
<SelectField
  label="Specialization / Research Area"
  id="specialization"
  value={academic.specialization || ""}
  onChange={handleChange}
  options={specializationOptions}
  disabled={isSubmitted}
/>
{academic.specialization === "__OTHER__" && (
  <InputField
    label="Enter New Specialization"
    id="specializationCustom"
    value={academic.specializationCustom || ""}
    onChange={handleChange}
    placeholder="Enter new specialization"
    disabled={isSubmitted}
  />
)}
  {academic.programLevel === "PhD" && (
    <>
      <InputField
        label="Thesis / Dissertation Topic"
        id="thesisTopic"
        value={academic.thesisTopic || ""}
        onChange={handleChange}
        placeholder="Research Topic"
        disabled={isSubmitted}
      />

      <InputField
        label="Research Supervisor"
        id="researchSupervisor"
        value={academic.researchSupervisor || ""}
        onChange={handleChange}
        placeholder="Dr. Name"
        disabled={isSubmitted}
      />
    </>
  )}
</FormSection>
        {/* Timeline */}

        <FormSection
          title="Academic Timeline"
          icon={Calendar}
        >

        <InputField
  label="Admission Batch"
  id="admissionBatch"
  value={academic.admissionBatch || ""}
  placeholder="YYYY"
  maxLength={4}
  error={
    academic.admissionBatch
      ? !/^\d{4}$/.test(String(academic.admissionBatch))
        ? "Enter a valid 4-digit year"
        : Number(academic.admissionBatch) > currentYear
          ? `Year cannot be after ${currentYear}`
          : ""
      : ""
  }
  onChange={(e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    handleChange({
      target: {
        id: "admissionBatch",
        value,
      },
    });
  }}
/>

 <InputField
  label="Academic Cycle"
  id="academicCycle"
  value={academic.academicCycle || ""}
  placeholder="YYYY-YYYY"
  error={validateAcademicCycle(academic.academicCycle || "")}
  onChange={(e) => {
    let input = e.target.value;

    // Keep only numbers, comma, hyphen and spaces
    input = input.replace(/[^\d,\-\s]/g, "");

    // Split multiple cycles
    const cycles = input.split(",");

    const formattedCycles = cycles.map((cycle) => {
      // Keep numbers only for each cycle
      const digits = cycle
        .replace(/\D/g, "")
        .slice(0, 8);

      if (digits.length <= 4) {
        return digits;
      }

      // Automatically insert -
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    });

    // Rebuild comma-separated value
    const value = formattedCycles
      .join(", ")
      .slice(0, 40);

    handleChange({
      target: {
        id: "academicCycle",
        value,
      },
    });
  }}
/>

          <SelectField
            disabled={isSubmitted}
            label="Current Year"
            id="currentYear"
            value={academic.currentYear || ""}
            onChange={handleChange}
            options={currentYears}
          />

          <SelectField
            disabled={isSubmitted}
            label="Current Semester"
            id="currentSemester"
            value={String(
              academic.currentSemester || ""
            )}
            onChange={handleChange}
            options={currentSemesters}
          />

        </FormSection>

        {/* Study Details */}

        <FormSection
          title="Study Details"
          icon={BookOpen}
        >

          <SelectField
            disabled={isSubmitted}
            label="Mode of Study"
            id="modeOfStudy"
            value={academic.modeOfStudy || ""}
            onChange={handleChange}
            options={studyModes}
          />

          <SelectField
            disabled={isSubmitted}
            label="Admission Category"
            id="admissionCategory"
            value={academic.admissionCategory || ""}
            onChange={handleChange}
            options={admissionCategories}
          />

        </FormSection>

        {/* Fellowship */}

        <FormSection
          title="Fellowship Information"
          icon={Crown}
        >

          <InputField
            label="Fellowship Letter Number"
            id="fellowshipLetterNumber"
            value={
              academic.fellowshipLetterNumber || ""
            }
            onChange={handleChange}
            placeholder="F-882/2024/KU"
          />
          
<FileInput
  label="Fellowship Document"
  required
  file={
  typeof academic.fellowshipLetter ===
  "object"
    ? academic.fellowshipLetter?.name || ""
    : academic.fellowshipLetter || ""
}
  fileUrl={
    academic.fellowshipLetter?.url
  }
  error={academic.fileError}
  disabled={isSubmitted}
  onChange={(e) => {

    updateSection("academic", {

      fellowshipLetter:
        e.target.file,

      fileError:
        e.target.error,

    });

  }}
/>

        </FormSection>

      </FormWrapper>

    </>
  );
}