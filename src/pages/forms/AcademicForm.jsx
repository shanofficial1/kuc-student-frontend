import React from 'react';
import { useStore } from '../../store';

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

  const isSubmitted = useStore((s) => s.isSubmitted);
const store = useStore();

  

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


const saveAndRefresh = useStore(
  (s) => s.saveAndRefresh
);

const handleSave = async () => {

  const academic =
    useStore.getState().academic;
console.log("ACADEMIC", academic);

  const formData =
    new FormData();


    for (const pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
  if (academic.programLevel) {
  formData.append(
    "academic_details[programLevel]",
    academic.programLevel
  );
}

if (academic.admissionCategory) {
  formData.append(
    "academic_details[admissionCategory]",
    academic.admissionCategory
  );
}

if (academic.modeOfStudy) {
  formData.append(
    "academic_details[modeOfStudy]",
    academic.modeOfStudy
  );
}

  // NORMAL DATA
formData.append(
  "academic_details[admissionApplicationNumber]",
  academic.admissionApplicationNumber || ""
);

formData.append(
  "academic_details[universityEnrollmentNumber]",
  academic.universityEnrollmentNumber || ""
);

formData.append(
  "academic_details[rollNumber]",
  academic.rollNumber || ""
);

formData.append(
  "academic_details[faculty]",
  academic.faculty || ""
);

formData.append(
  "academic_details[department]",
  academic.department || ""
);

formData.append(
  "academic_details[degreeName]",
  academic.degreeName || ""
);


formData.append(
  "academic_details[specialization]",
  academic.specialization || ""
);

formData.append(
  "academic_details[academicCycle]",
  academic.academicCycle || ""
);

formData.append(
  "academic_details[admissionBatch]",
  academic.admissionBatch || ""
);


formData.append(
  "academic_details[currentSemester]",
  academic.currentSemester || ""
);

formData.append(
  "academic_details[currentYear]",
  academic.currentYear || ""
);

formData.append(
  "academic_details[fellowshipLetterNumber]",
  academic.fellowshipLetterNumber || ""
);




  console.log(
  "fellowshipLetter =",
  academic.fellowshipLetter
);

console.log(
  "instanceof File =",
  academic.fellowshipLetter instanceof File
);

  // FILE
  if (
    academic.fellowshipLetter
      instanceof File
  ) {

    console.log(
      "FILE SENDING =",
      academic.fellowshipLetter
    );

    formData.append(
      "fellowshipLetter",
      academic.fellowshipLetter
    );

  }

  await saveAndRefresh(
    formData,
    true
  );

  await fetchCanEdit();

};

  const handleChange = (e) => {

    const { id, value } = e.target;

    updateSection("academic", {
      [id]: value,
    });
  };


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
  options={FACULTY_OPTIONS}
/><SelectField
  label="Department"
  id="department"
  value={academic.department || ""}
  onChange={handleChange}
  options={DEPARTMENT_OPTIONS}
/>

          <SelectField
            label="Program Level"
            id="programLevel"
            value={academic.programLevel || ""}
            onChange={handleChange}
            options={[
              {
                value: "",
                label: "Select Level"
              },

              {
                value: "UG",
                label: "UG"
              },

              {
                value: "PG",
                label: "PG"
              },

              {
                value: "PhD",
                label: "PhD"
              },
            ]}
          />

         <SelectField
  label="Degree Name"
  id="degreeName"
  value={academic.degreeName || ""}
  onChange={handleChange}
  options={DEGREE_OPTIONS}
/>

        </FormSection>

        {/* Research */}

        <FormSection
          title="Research & Specialization"
          icon={Search}
        >

          <div className="md:col-span-2">

            <InputField
              label="Specialization / Research Area"
              id="specialization"
              value={academic.specialization || ""}
              onChange={handleChange}
              placeholder="Machine Learning"
              disabled={isSubmitted}
            />

          </div>

          {academic.programLevel === "PhD" && (

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">

              <div className="md:col-span-2">

                <InputField
                  label="Thesis / Dissertation Topic"
                  id="thesisTopic"
                  value={academic.thesisTopic || ""}
                  onChange={handleChange}
                  placeholder="Research Topic"
                  disabled={isSubmitted}
                />

              </div>

              <div className="md:col-span-2">

                <InputField
                  label="Research Supervisor"
                  id="researchSupervisor"
                  value={
                    academic.researchSupervisor || ""
                  }
                  onChange={handleChange}
                  placeholder="Dr. Name"
                  disabled={isSubmitted}
                />

              </div>

            </div>
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
            onChange={handleChange}
            placeholder="2021-2025"
          />

          <InputField
            label="Academic Cycle"
            id="academicCycle"
            value={academic.academicCycle || ""}
            onChange={handleChange}
            placeholder="2024-2025"
          />

          <SelectField
            disabled={isSubmitted}
            label="Current Year"
            id="currentYear"
            value={academic.currentYear || ""}
            onChange={handleChange}
            options={[
              { value: '1', label: 'Year 1' },
              { value: '2', label: 'Year 2' },
              { value: '3', label: 'Year 3' },
              { value: '4', label: 'Year 4' },
            ]}
          />

          <SelectField
            disabled={isSubmitted}
            label="Current Semester"
            id="currentSemester"
            value={String(
              academic.currentSemester || ""
            )}
            onChange={handleChange}
            options={[
              { value: '1', label: 'Sem 1' },
              { value: '2', label: 'Sem 2' },
              { value: '3', label: 'Sem 3' },
              { value: '4', label: 'Sem 4' },
              { value: '5', label: 'Sem 5' },
              { value: '6', label: 'Sem 6' },
              { value: '7', label: 'Sem 7' },
              { value: '8', label: 'Sem 8' },
            ]}
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
            options={[
              {
                value: "Full-Time",
                label: "Full-Time"
              },

              {
                value: "Part-Time",
                label: "Part-Time"
              },

              {
                value: "Distance",
                label: "Distance"
              },
            ]}
          />

          <SelectField
            disabled={isSubmitted}
            label="Admission Category"
            id="admissionCategory"
            value={academic.admissionCategory || ""}
            onChange={handleChange}
            options={[
              {
                value: "Merit",
                label: "Merit"
              },

              {
                value: "Entrance",
                label: "Entrance"
              },

              {
                value: "Management",
                label: "Management"
              },

              {
                value: "Sports",
                label: "Sports"
              },
            ]}
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
    academic.fellowshipLetter?.name ||
    academic.fellowshipLetter
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