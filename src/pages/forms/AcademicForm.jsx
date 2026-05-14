import React from 'react';
import { useStore } from '../../store';
import FormWrapper, { FormSection, InputField, SelectField,FileInput } from '../../components/FormWrapper';
import { Fingerprint, GraduationCap, Calendar, BookOpen, Crown, CheckCircle, FileText,Search } from 'lucide-react';
import GlobalLoader from '@/src/components/GlobalLoader';

export const PROGRAM_DATA = {
  engineering: {
    label: 'Engineering',
    departments: {
      "Department Of Information Technology": ["B.Sc. Computer Science", "B.Com. Computer Application", "B.Sc. Electronics", "M.Sc. Computer Science"],
      "Department of Wood Science & Technology": ["B.Sc. Wood Science & Technology", "B.Sc. Forestry"],
      "Department of Library and Information Science.": ["B.Lib.I.Sc.", "M.Lib.I.Sc."],
      "Department of Journalism and Media Studies": ["B.A. Journalism", "M.A. Journalism"]
    }
  },
  science: {
    label: 'Science',
    departments: {
      "Department Of Mathematical Sciences": ["B.Sc. Mathematics", "M.Sc. Mathematics"],
      "Department of Statistical Sciences": ["B.Sc. Statistics", "M.Sc. Statistics"],
      "Department Of Biotechnology & Microbiology": ["B.Sc. Biotechnology", "B.Sc. Microbiology", "B.Sc. Bioinformatics"],
      "Department of Chemistry": ["B.Sc. Chemistry", "B.Sc. Polymer Chemistry", "B.Sc. Biochemistry", "M.Sc Chemistry"],
      "Department of Physics": ["B.Sc. Physics", "M.Sc Physics"],
      "Department Of Molecular Biology": ["M.Sc. Molecular Biology"],
      "Department of Geography": ["B.Sc. Geology", "M.Sc Geology"],
      "Department of Botany": ["B.Sc. Botany", "B.Sc. Plant Science"],
      "Department of Zoology": ["B.Sc. Zoology", "M.Sc Zoology"],
      "Department of Environmental Studies": ["M.Sc. Environmental Science"],
      "Department of Behavioural Sciences": ["B.Sc Psychology", "M.Sc Psychology"]
    }
  },
  arts: {
    label: 'Arts',
    departments: {
      "Department Of Studies In English": ["B.A. English", "B.A. Functional English"],
      "Department Of Economics": ["B.A. Economics", "B.A. Development Economics", "M.A Economics"],
      "Department Of Anthropology": ["B.A. Political Science", "B.A. Philosophy", "M.A in Governance and Politics"],
      "Department of History": ["B.A. History", "M.A Social Science with Specialization in History"],
      "Department of Malayalam": ["B.A. Malayalam"],
      "Department of Kannada": ["B.A. Kannada"],
      "Department of Hindi": ["B.A. Hindi"],
      "Department Of Law": ["L.L.B.", "L.L.M."],
      "Department of Music": ["B.A. Music"],
      "Department of Commerce and Business Studies": ["B.Com. Finance", "B.Com. Co-operation", "M.Com (Finance)", "M.Com Marketing"],
      "Department of Management Studies": ["B.B.A.", "M.B.A."],
      "Department of Physical Education": ["B.P.Ed.", "M.P.Ed."],
      "School Of Physical Education And Sports Sciences": ["B.P.E.S", "M.P.E.S"],
      "Department of Pedagogical Sciences": ["B.Ed.", "M.Ed."],
      "Department of Rural and Tribal Sociology": ["B.A. Sociology", "M.A. Sociology"]
    }
  }
};


export default function AcademicForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const academic = useStore((state) => state.academic);
  const updateSection = useStore((state) => state.updateSection);
const isLoading = useStore((state) => state.isLoading);
  
  // Pull the setter from the store
  const setIsLoading = useStore((state) => state.setIsLoading);

  const handleSave = () => {
    // This will now work without the ReferenceError
    setIsLoading(true);

    console.log('Saved Academic Data:', academic);

    // Simulate a 2-second server delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    updateSection('academic', { [id]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKB = file.size / 1024;

    // ❌ Too large
    if (sizeKB > 150) {
      updateSection("academic", {
        fileError: "File too large. Max 150 KB allowed.",
        fellowshipFile: null,
        fellowshipFileName: "",
      });
      e.target.value = "";
      return;
    }

    // ✅ Valid file
    updateSection("academic", {
      fellowshipFile: file,
      fellowshipFileName: file.name,
      fileError: "", // clear error
    });
  };

  // Define logic for file display
  const fileName = academic.fellowshipFile?.name || academic.fellowshipFileName;
  const isUploaded = !!fileName;



// Get Department Options
const departmentOptions = academic.faculty && PROGRAM_DATA[academic.faculty]
  ? Object.keys(PROGRAM_DATA[academic.faculty].departments).map(dept => ({
      value: dept.trim(), // Cleans up any hidden spaces
      label: dept.trim()
    }))
  : [];

// Get Degree Options
const currentDeptKey = academic.department;
const degreeOptions = (academic.faculty && currentDeptKey && PROGRAM_DATA[academic.faculty].departments[currentDeptKey])
  ? PROGRAM_DATA[academic.faculty].departments[currentDeptKey].map(degree => ({
      value: degree,
      label: degree
    }))
  : [];

  
  return (
    <>
    {isLoading && <GlobalLoader  />}
    <FormWrapper
      title="Academic Information"
      description="Please fill in your current academic details accurately as per university records."
      onSave={handleSave}
    >
      <FormSection title="Academic Identity" icon={Fingerprint}>
        <InputField
          label="Admission Application Number"
          id="admissionApplicationNumber"
          required
          value={academic.admissionApplicationNumber}
          onChange={handleChange}
          placeholder="e.g. ADM2024001"
        />
        <InputField
          label="University Enrollment Number"
          id="universityEnrollmentNumber"
          value={academic.universityEnrollmentNumber}
          onChange={handleChange}
          placeholder="e.g. KU-2021-CS-882"
        />
        <InputField
          label="Roll Number"
          id="rollNumber"
          value={academic.rollNumber}
          onChange={handleChange}
          placeholder="21CS042"
        />
      </FormSection>

     <FormSection title="Program Hierarchy" icon={GraduationCap}>
  <SelectField
    label="Faculty / School"
    id="faculty"
    value={academic.faculty}
    onChange={handleChange}
    options={[
      { value: '', label: 'Select Faculty' },
      ...Object.entries(PROGRAM_DATA).map(([key, info]) => ({
        value: key,
        label: info.label
      }))
    ]}
  />

  <SelectField
    label="Department"
    id="department"
    value={academic.department}
    onChange={handleChange}
    options={[
      { value: '', label: 'Select Department' },
      ...departmentOptions
    ]}
    disabled={!academic.faculty} // Disable if no faculty selected
  />

  <SelectField
    label="Program Level"
    id="programLevel"
    value={academic.programLevel}
    onChange={handleChange}
    options={[
      { value: '', label: 'Select Level' },
      { value: 'ug', label: 'UG' },
      { value: 'pg', label: 'PG' },
      { value: 'phd', label: 'PhD' },
    ]}
  />

  <SelectField
    label="Degree Name"
    id="degreeName"
    value={academic.degreeName}
    onChange={handleChange}
    options={[
      { value: '', label: 'Select Degree' },
      ...degreeOptions
    ]}
    disabled={!academic.department} // Disable if no department selected
  />
</FormSection>
 <FormSection title="Research & Specialization" icon={Search}>
        <div className="md:col-span-2">
          <InputField
            label="Specialization / Research Area"
            id="specialization"
            value={academic.specialization || ''}
            onChange={handleChange}
            placeholder="e.g. Machine Learning, Structural Engineering, Modern History"
            disabled={isSubmitted}
          />
        </div>

        {/* Research specific fields only for PhD students */}
        {academic.programLevel === 'phd' && (
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="md:col-span-2">
              <InputField
                label="Thesis / Dissertation Topic"
                id="researchTopic"
                value={academic.researchTopic || ''}
                onChange={handleChange}
                placeholder="Enter the full title of your research work"
                disabled={isSubmitted}
              />
            </div>
            <div className="md:col-span-2">
              <InputField
                label="Name of Research Supervisor / Guide"
                id="supervisorName"
                value={academic.supervisorName || ''}
                onChange={handleChange}
                placeholder="Dr. Full Name"
                disabled={isSubmitted}
              />
            </div>
          </div>
        )}
      </FormSection>
      <FormSection title="Academic Timeline" icon={Calendar}>
        <InputField
          label="Admission Batch"
          id="batch"
          value={academic.batch}
          onChange={handleChange}
          placeholder="2021-2025"
        />
        <SelectField
          disabled={isSubmitted}
          label="Academic Cycle"
          id="academicCycle"
          value={academic.academicCycle}
          onChange={handleChange}
          options={[
            { value: 'semester', label: 'Semester' },
            { value: 'annual', label: 'Annual' },
          ]}
        />
        <SelectField
          disabled={isSubmitted}
          label="Current Year"
          id="year"
          value={academic.year}
          onChange={handleChange}
          options={[
            { value: '1', label: 'Year 1' },
            { value: '2', label: 'Year 2' },
            { value: '3', label: 'Year 3' },
            { value: '4', label: 'Year 4' },
          ]}
        />
        {academic.academicCycle === 'semester' && (
          <SelectField
            disabled={isSubmitted}
            label="Current Semester"
            id="semester"
            value={academic.semester}
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
        )}
      </FormSection>

      <FormSection title="Study Details" icon={BookOpen}>
        <SelectField
          disabled={isSubmitted}
          label="Mode of Study"
          id="modeOfStudy"
          value={academic.modeOfStudy}
          onChange={handleChange}
          options={[
            { value: 'full-time', label: 'Full-Time' },
            { value: 'part-time', label: 'Part-Time' },
            { value: 'distance', label: 'Distance' },
          ]}
        />
        <SelectField
          disabled={isSubmitted}
          label="Admission Category"
          id="admissionCategory"
          value={academic.admissionCategory}
          onChange={handleChange}
          options={[
            { value: 'merit', label: 'Merit' },
            { value: 'entrance', label: 'Entrance-Based' },
            { value: 'management', label: 'Management' },
            { value: 'sports', label: 'Sports Quota' },
          ]}
        />
      </FormSection>

      <FormSection title="Fellowship Information" icon={Crown}>
        <InputField
          label="Fellowship Letter Number"
          id="fellowshipLetterNumber"
          value={academic.fellowshipLetterNumber}
          onChange={handleChange}
          placeholder="F-882/2024/KU"
        />

   <FileInput
  label="Fellowship Document"
  required
  file={academic.fellowshipFileName}
  error={academic.fileError}
  disabled={isSubmitted}
  onChange={(e) => {
    const { name, error } = e.target;
    
    updateSection("academic", {
      fellowshipFileName: name,
      fileError: error,
    });
  }}
/>
      </FormSection>
     

    </FormWrapper>
    </>
  );
}