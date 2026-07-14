import React from 'react';
import { useNavigate } from "react-router-dom";
import { School, Trophy, Trash2, Plus, FileText } from 'lucide-react';
import { useStore } from '../../store';

import useHashFocus from '../../hooks/useHashFocus';
import FormWrapper, { FormSection, InputField, SelectField, FileInput } from '../../components/FormWrapper';

const YEARS = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

const QUALIFICATION_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: '10th', label: '10th Standard' },
  { value: 'Plus Two', label: 'Plus Two / 12th' },
  { value: 'UG', label: 'Undergraduate' },
  { value: 'PG', label: 'Postgraduate' },
  { value: 'Ph.D', label: 'Ph.D' },
  { value: 'M.Phil', label: 'M.Phil' },
];

const MODE_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'Full Time', label: 'Full Time' },
  { value: 'Part Time', label: 'Part Time' },
  { value: 'Distance', label: 'Distance' },
  { value: 'Online', label: 'Online' },
];

const COUNTRY_OPTIONS = [
  { value: '', label: 'Select Country' },
  { value: 'India', label: 'India' },
  { value: 'USA', label: 'USA' },
  { value: 'UK', label: 'UK' },
];

const STATE_OPTIONS = [
  { value: '', label: 'Select State' },
  { value: 'Kerala', label: 'Kerala' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Other', label: 'Other' },
];

export default function EducationForm() {
  useHashFocus();
  const navigate = useNavigate();
const { deleteProfileRecord } = useStore();

  // Store bindings
  const isSubmitted = useStore((s) => s.isSubmitted);
  const education = useStore((state) => state.education);
  const updateSection = useStore((state) => state.updateSection);
  const fetchCanEdit = useStore((s) => s.fetchCanEdit);
  const saveAndRefresh = useStore((s) => s.saveAndRefresh);
const {examNames,qualificationModes,qualificationLevels,countries,states} = useStore();
const records = education.academicRecords || [];
const competitiveExams = education.competitiveExams || [];


  // --- Core Form Actions ---
  const handleSave = async () => {
    navigate("/forms/financial");
  };

  // --- Academic Record Handlers ---
  const updateAcademicField = (index, field, value) => {
    const newRecords = [...records];
    newRecords[index] = { ...newRecords[index], [field]: value };
    updateSection('education', { academicRecords: newRecords });
  };

  const handleAcademicFileChange = (index, target) => {
    const { file, error } = target;
    const newRecords = [...records];
    newRecords[index] = {
      ...newRecords[index],
      docFile: file,
      fileError: error,
      documentUrl: file ? { name: file.name, url: '' } : newRecords[index]?.documentUrl,
    };
    updateSection('education', { academicRecords: newRecords });
  };

  const removeAcademicRecord = (index) => {
    updateSection('education', {
      academicRecords: records.filter((_, i) => i !== index),
    });
  };

  // --- Competitive Exam Handlers ---
  const updateExamField = (index, field, value) => {
    const newExams = [...competitiveExams];
    newExams[index] = { ...newExams[index], [field]: value };
    updateSection('education', { competitiveExams: newExams });
  };

  const handleExamFileChange = (index, target) => {
    const { file, error } = target;
    const newExams = [...competitiveExams];
    newExams[index] = {
      ...newExams[index],
      docFile: file,
      fileError: error,
      documentUrl: file ? { name: file.name, url: '' } : newExams[index]?.documentUrl,
    };
    updateSection('education', { competitiveExams: newExams });
  };

  // --- Filtering & Validation Options ---
  const getQualificationOptions = (currentQualType) => {
    const exclusiveTypes = ['10th', 'Plus Two'];
    const usedTypes = records
      .map((rec) => rec.qualType)
      .filter((type) => type && exclusiveTypes.includes(type) && type !== currentQualType);

    return QUALIFICATION_OPTIONS.filter((opt) => opt.value === '' || !usedTypes.includes(opt.value));
  };

const handleDeleteCompetitiveExam = async (exam) => {
console.log("CLIKE");

  if (!exam._id) {
    updateSection("education", {
      competitiveExams: competitiveExams.filter(
        (e) => e !== exam
      ),
    });
    return;
  }

  const result = await deleteProfileRecord(
    "competitiveExams",
    exam._id
  );
console.log("RESULT",result);

  if (result.success) {
console.log(result);
    updateSection("education", {
      competitiveExams: competitiveExams.filter(
        (e) => e._id !== exam._id
      ),
    });

  } else {

    alert(result.message);

  }
};

const handleDeleteEducation = async (index) => {

  const record = records[index];

  if (!record) return;

  // Record not saved in DB yet
  if (!record._id) {
    updateSection("education", {
      academicRecords: records.filter((_, i) => i !== index),
    });
    return;
  }

  const result = await deleteProfileRecord(
    "education",
    record._id
  );

  console.log("RESULT:", result);

  if (result.success) {

    updateSection("education", {
      academicRecords: records.filter((_, i) => i !== index),
    });

  } else {

    alert(result.message);

  }
};

  // --- Isolated Sub-Fields Layout Modifiers ---
  const renderBaseFields = (record, index) => (
    <>
      <InputField
        label="Institution / University Name"
        value={record.institution || ''}
        onChange={(e) => updateAcademicField(index, 'institution', e.target.value)}
        disabled={isSubmitted}
      />
      <InputField
        label="Year of Passing"
        value={record.passYear || ''}
        onChange={(e) => updateAcademicField(index, 'passYear', e.target.value)}
        disabled={isSubmitted}
      />
      <InputField
        label="Percentage / CGPA"
        value={record.percentage || ''}
        onChange={(e) => updateAcademicField(index, 'percentage', e.target.value)}
        disabled={isSubmitted}
      />
      <InputField
        label="Board / University"
        value={record.board || ''}
        onChange={(e) => updateAcademicField(index, 'board', e.target.value)}
        disabled={isSubmitted}
      />
      <SelectField
        label="Mode"
        value={record.mode || ''}
        options={qualificationModes}
        onChange={(e) => updateAcademicField(index, 'mode', e.target.value)}
        disabled={isSubmitted}
      />
      <SelectField
        label="Country"
        value={record.country || ''}
        options={countries}
        onChange={(e) => updateAcademicField(index, 'country', e.target.value)}
        disabled={isSubmitted}
      />
      <SelectField
        label="State"
        value={record.state || ''}
        options={Object.keys(states)}
        onChange={(e) => updateAcademicField(index, 'state', e.target.value)}
        disabled={isSubmitted}
      />
    </>
  );

  const renderPhdFields = (record, index) => (
    <>
      <InputField
        label="Institution / University Name"
        value={record.institution || ''}
        onChange={(e) => updateAcademicField(index, 'institution', e.target.value)}
        disabled={isSubmitted}
      />
      <InputField
        label="Subject"
        value={record.subject || ''}
        onChange={(e) => updateAcademicField(index, 'subject', e.target.value)}
        disabled={isSubmitted}
      />
      <SelectField
        label="Full Time / Part Time"
        value={record.mode || ''}
        options={qualificationModes}
        onChange={(e) => updateAcademicField(index, 'mode', e.target.value)}
        disabled={isSubmitted}
      />
      <InputField
        label="Year of Completion"
        value={record.passYear || ''}
        onChange={(e) => updateAcademicField(index, 'passYear', e.target.value)}
        disabled={isSubmitted}
      />
      <InputField
        label="Title of the Thesis"
        value={record.thesisTitle || ''}
        onChange={(e) => updateAcademicField(index, 'thesisTitle', e.target.value)}
        disabled={isSubmitted}
      />
      <SelectField
        label="Country"
        value={record.country || ''}
        options={countries}
        onChange={(e) => updateAcademicField(index, 'country', e.target.value)}
        disabled={isSubmitted}
      />
      <SelectField
        label="State"
        value={record.state || ''}
        options={Object.keys(states)}
        onChange={(e) => updateAcademicField(index, 'state', e.target.value)}
        disabled={isSubmitted}
      />
    </>
  );

  return (
    <FormWrapper
      title="Education & Qualifications"
      description="Manage your academic history and competitive exam scores."
      onSave={handleSave}
    >
      {/* ACADEMIC RECORDS */}
      <FormSection title="Academic Records" icon={School}>
        <div className="md:col-span-2 space-y-6">
          {records.map((record, index) => {
const isStaticType = [
  "Secondary (10th)",
  "Higher Secondary (Plus Two)"
].includes(record.qualType);
            return (
              <div 
                key={index} 
                className="relative p-6 border border-slate-200 rounded-xl bg-slate-50 space-y-4 animate-in slide-in-from-top-2"
              >
                {!isSubmitted && (
              <button
  type="button"
  onClick={() => handleDeleteEducation(index)}
  className="absolute right-4 top-4 text-red-500 rounded-full p-2 hover:bg-red-50 transition-colors"
>
  <Trash2 size={18} />
</button>
                )}

            

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="Qualification Level"
                    value={record.qualType || ''}
                    options={qualificationLevels}
                    onChange={(e) => updateAcademicField(index, 'qualType', e.target.value)}
                    disabled={isSubmitted}
                  />

                  {record.qualType === "Doctor of Philosophy (PhD)" ? (
                    renderPhdFields(record, index)
                  ) : (
                    <>
                      {(!record.qualType || ["Secondary (10th)", "Higher Secondary (Plus Two)", "Undergraduate", "Postgraduate", "Master of Philosophy (M.Phil)"].includes(record.qualType)) && 
                        renderBaseFields(record, index)
                      }
                      {[
  "Undergraduate",
  "Postgraduate",
  "Master of Philosophy (M.Phil)"
].includes(record.qualType) && (
                        <>
                          <InputField
                            label="Degree / Qualification Name"
                            value={record.degreeName || ''}
                            onChange={(e) => updateAcademicField(index, 'degreeName', e.target.value)}
                            disabled={isSubmitted}
                          />
                          <InputField
                            label="Specialization / Subject"
                            value={record.specialization || ''}
                            onChange={(e) => updateAcademicField(index, 'specialization', e.target.value)}
                            disabled={isSubmitted}
                          />
                        </>
                      )}
                    </>
                  )}

                  {/* FIXED: Removed md:col-span-2 to keep file input constrained to 1 column width */}
                  <div>
                    <FileInput
                      label={record.qualType === 'Ph.D' ? 'Upload PhD Certificate' : 'Upload Document'}
                      required
                      file={record.documentUrl?.name || record.documentUrl}
                      fileUrl={record.documentUrl?.url}
                      error={record.fileError}
                      disabled={isSubmitted}
                      onChange={(e) => handleAcademicFileChange(index, e.target)}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {!isSubmitted && (
            <button
              type="button"
onClick={() =>
  updateSection("education", {
    academicRecords: [...records, { qualType: "" }]
  })
}              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-primary font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Add Qualification
            </button>
          )}
        </div>
      </FormSection>

      {/* COMPETITIVE EXAMS */}
      <FormSection title="Competitive Exam Scores" icon={Trophy}>
        <div className="md:col-span-2 space-y-4">
          {competitiveExams.map((exam, index) => (
            <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 relative">
              {!isSubmitted && (


<button
  type="button"
  style={{
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 9999,
    background: "red",
    color: "white",
    padding: "8px 12px"
  }}
  onClick={() => {
    alert("Clicked");
    console.log("Clicked");
  }}
>
  DELETE
</button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
  label="Exam Name"
  value={exam.examName || ""}
  onChange={(e) =>
    updateExamField(index, "examName", e.target.value)
  }
  options={examNames}
  disabled={isSubmitted}
/>
                <InputField 
                  label="Score" 
                  value={exam.score || ''} 
                  onChange={(e) => updateExamField(index, 'score', e.target.value)} 
                  disabled={isSubmitted} 
                />
                <InputField
  label="Year"
  id={`examYear-${index}`}
  value={exam.year || ""}
  onChange={(e) =>
    updateExamField(index, "year", e.target.value)
  }
  placeholder={String(new Date().getFullYear())-1}
  disabled={isSubmitted}
/>
                
                {/* File Input naturally fits into 1 column of md:grid-cols-2 */}
                <FileInput
                  label="Upload Scorecard"
                  file={exam.documentUrl?.name || exam.docName}
                  fileUrl={exam.documentUrl?.url}
                  error={exam.fileError}
                  disabled={isSubmitted}
                  onChange={(e) => handleExamFileChange(index, e.target)}
                />
              </div>
            </div>
          ))}
          <button 
            type="button"
            disabled={isSubmitted} 
            onClick={() => updateSection('education', { competitiveExams: [...competitiveExams, {}] })} 
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-primary font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Competitive Exam
          </button>
        </div>
      </FormSection>

      {/* MIGRATION CERTIFICATE */}
      <FormSection title="Migration & Transfer Details" icon={FileText}>
        {/* FIXED: Wrapped inside an explicit column span configuration so it matches standard inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          <FileInput
            label="Upload Migration Certificate"
            file={education.migrationUrl?.name || education.migrationDocName}
            fileUrl={education.migrationUrl?.url}
            error={education.migrationError}
            disabled={isSubmitted}
            onChange={(e) => {
              updateSection("education", {
                migrationFile: e.target.file,
                migrationUrl: e.target.file ? { name: e.target.file.name, url: "" } : undefined,
                migrationError: e.target.error
              });
            }}
          />
        </div>
      </FormSection>
    </FormWrapper>
  );
}