import React from 'react';
import { useStore } from '../../store';
import FormWrapper, { FormSection, InputField, SelectField } from '../../components/FormWrapper';
import { Fingerprint, GraduationCap, Calendar, BookOpen, Crown, CheckCircle, FileText } from 'lucide-react';
import GlobalLoader from '@/src/components/GlobalLoader';

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

  const departmentOptions = [
    { value: "Computer Science", label: "Computer Science" },
    { value: "Information Technology", label: "Information Technology" },
    { value: "Electronics and Communication", label: "Electronics and Communication" },
    { value: "Electrical and Electronics", label: "Electrical and Electronics" },
    { value: "Mechanical Engineering", label: "Mechanical Engineering" },
    { value: "Civil Engineering", label: "Civil Engineering" },
    { value: "Artificial Intelligence and Data Science", label: "Artificial Intelligence and Data Science" },
    { value: "Cyber Security", label: "Cyber Security" },
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Statistics", label: "Statistics" },
    { value: "Commerce", label: "Commerce" },
    { value: "Business Administration", label: "Business Administration" },
    { value: "Management Studies", label: "Management Studies" },
    { value: "Economics", label: "Economics" },
    { value: "History", label: "History" },
    { value: "Political Science", label: "Political Science" },
    { value: "Sociology", label: "Sociology" },
    { value: "English", label: "English" },
    { value: "Malayalam", label: "Malayalam" },
    { value: "Hindi", label: "Hindi" },
    { value: "Arabic", label: "Arabic" },
    { value: "Psychology", label: "Psychology" },
    { value: "Social Work", label: "Social Work" },
    { value: "Biotechnology", label: "Biotechnology" },
    { value: "Microbiology", label: "Microbiology" },
    { value: "Zoology", label: "Zoology" },
    { value: "Botany", label: "Botany" },
    { value: "Law", label: "Law" },
    { value: "Education", label: "Education" },
    { value: "Physical Education", label: "Physical Education" },
    { value: "Journalism and Mass Communication", label: "Journalism and Mass Communication" },
    { value: "Fine Arts", label: "Fine Arts" },
  ];

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
          id="admissionAppNo"
          required
          value={academic.admissionAppNo}
          onChange={handleChange}
          placeholder="e.g. ADM2024001"
        />
        <InputField
          label="University Enrollment Number"
          id="enrollmentNo"
          value={academic.enrollmentNo}
          onChange={handleChange}
          placeholder="e.g. KU-2021-CS-882"
        />
        <InputField
          label="Roll Number"
          id="rollNo"
          value={academic.rollNo}
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
            { value: 'engineering', label: 'Engineering' },
            { value: 'arts', label: 'Arts' },
            { value: 'science', label: 'Science' },
          ]}
        />
        <SelectField
          label="Department"
          id="department"
          value={academic.department}
          onChange={handleChange}
          options={departmentOptions}
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
            { value: 'btech', label: 'B.Tech' },
            { value: 'bsc', label: 'B.Sc' },
            { value: 'msc', label: 'M.Sc' },
          ]}
        />
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
          id="fellowshipNo"
          value={academic.fellowshipNo}
          onChange={handleChange}
          placeholder="F-882/2024/KU"
        />

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-slate-600">
            Fellowship Document
          </label>

          <label
            className={`w-full h-12 flex items-center justify-between px-3 border rounded-lg cursor-pointer transition
            ${isUploaded
                ? "border-green-500 bg-green-50"
                : "border-slate-200 bg-white hover:border-slate-300"
              }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-md 
                ${isUploaded ? "bg-green-100" : "bg-slate-100"}`}
              >
                <FileText
                  size={18}
                  className={isUploaded ? "text-green-600" : "text-slate-500"}
                />
              </div>

              <span
                className={`text-sm max-w-[180px] truncate block ${academic.fileError
                    ? "text-red-600"
                    : isUploaded
                      ? "text-green-700 font-medium"
                      : "text-slate-500"
                  }`}
              >
                {academic.fileError
                  ? academic.fileError
                  : isUploaded
                    ? fileName
                    : "Upload PDF / Image"}
              </span>
            </div>

            {isUploaded && (
              <CheckCircle size={18} className="text-green-600" />
            )}

            <input
              type="file"
              id="fellowshipFile"
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={isSubmitted}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <p className="text-xs text-red-600 font-medium">
            Upload file size: 50–150 KB only.
          </p>
        </div>
      </FormSection>
    </FormWrapper>
    </>
  );
}