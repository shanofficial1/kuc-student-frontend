import React, { useState } from 'react';
import { useStore } from '../../store';
import FormWrapper, { FormSection, InputField, SelectField ,FileInput} from '../../components/FormWrapper';
import { School, Trophy, Trash2, Plus, FileText, CheckCircle, X, Trash } from 'lucide-react';

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

export default function EducationForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const education = useStore((state) => state.education);
  const updateSection = useStore((state) => state.updateSection);
  const migrationDocName = useStore((s) => s.education.migrationDocName);
  const migrationError = useStore((s) => s.education.migrationError);

  const handleSave = () => {
    console.log('Saved Education Data:', education);
  };

  // Helper to update specific record in array
  const updateRecord = (index, field, value) => {
    const newRecords = [...education.academicRecords];
    newRecords[index] = { ...newRecords[index], [field]: value };
    updateSection('education', { academicRecords: newRecords });
  };

  const updateExam = (index, field, value) => {
    const newExams = [...education.competitiveExams];
    newExams[index] = { ...newExams[index], [field]: value };
    updateSection('education', { competitiveExams: newExams });
  };

  const handleFileUpload = (e, index, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeKB = file.size / 1024;
    const isInvalid = fileSizeKB < 50 || fileSizeKB > 150;

    if (type === 'academic') {
      updateRecord(index, 'docName', isInvalid ? "" : file.name);
      updateRecord(index, 'fileError', isInvalid ? `Size: ${Math.round(fileSizeKB)}KB (Req: 50-150KB)` : "");
    } else {
      updateExam(index, 'docName', isInvalid ? "" : file.name);
      updateExam(index, 'fileError', isInvalid ? `Size: ${Math.round(fileSizeKB)}KB (Req: 50-150KB)` : "");
    }
  };

  const handleMigrationUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeKB = file.size / 1024;
    const isInvalid = fileSizeKB < 50 || fileSizeKB > 150;

    updateSection("education", {
      migrationDocName: isInvalid ? "" : file.name,
      migrationError: isInvalid
        ? `Size: ${Math.round(fileSizeKB)}KB (Req: 50-150KB)`
        : "",
      migrationCertificateUploaded: !isInvalid,
    });
  };

  return (
    <FormWrapper
      title="Education & Qualifications"
      description="Manage your academic history, competitive exam scores, and relevant certifications."
      onSave={handleSave}
    >
      <FormSection title="Academic Records" icon={School}>
        <div className="md:col-span-2 space-y-6">
          {(education?.academicRecords || []).map((record, index) => (
            <div key={index} className="p-6 border border-slate-200 rounded-xl relative bg-slate-50 space-y-4 animate-in slide-in-from-top-2">
              {!isSubmitted && (
                <button 
                  onClick={() => {
                    const newRecords = education.academicRecords.filter((_, i) => i !== index);
                    updateSection('education', { academicRecords: newRecords });
                  }}
                  className="absolute top-4 right-4 text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField 
                  label="Qualification Type"
                  value={record.qualification || ''}
                  onChange={(e) => updateRecord(index, 'qualification', e.target.value)}
                  options={[
                    { value: '', label: 'Select...' },
                    { value: 'SSLC', label: 'SSLC / 10th' },
                    { value: 'HSE', label: 'HSE / 12th' },
                    { value: 'UG', label: 'Undergraduate' },
                    { value: 'PG', label: 'Postgraduate' },
                  ]}
                  disabled={isSubmitted}
                />
                <InputField label="Stream" value={record.stream || ''} onChange={(e) => updateRecord(index, 'stream', e.target.value)} disabled={isSubmitted} />
                <InputField label="Register Number" value={record.regNo || ''} onChange={(e) => updateRecord(index, 'regNo', e.target.value)} disabled={isSubmitted} />
                <InputField label="Institution" value={record.institution || ''} onChange={(e) => updateRecord(index, 'institution', e.target.value)} disabled={isSubmitted} />
                <InputField label="Board / University" value={record.board || ''} onChange={(e) => updateRecord(index, 'board', e.target.value)} disabled={isSubmitted} />
                <InputField label="Percentage" type="number" value={record.percentage || ''} onChange={(e) => updateRecord(index, 'percentage', e.target.value)} disabled={isSubmitted} />

                <div className="grid grid-cols-2 gap-4">
                  <SelectField label="Month" value={record.passMonth || ''} options={MONTHS.map(m => ({ value: m, label: m }))} onChange={(e) => updateRecord(index, 'passMonth', e.target.value)} disabled={isSubmitted} />
                  <SelectField label="Year" value={record.passYear || ''} options={YEARS.map(y => ({ value: y, label: y }))} onChange={(e) => updateRecord(index, 'passYear', e.target.value)} disabled={isSubmitted} />
                </div>
<FileInput
  label="Upload Document"
  required={false}
  file={record.docName}
  error={record.fileError}
  disabled={isSubmitted}
  className="md:col-span-2" // This ensures it takes full width in your grid
  onChange={(e) => {
    const { name, error, file } = e.target;
    
    // Using the index from your map loop to update the specific record
    const updatedRecords = [...academic.records];
    updatedRecords[index] = {
      ...updatedRecords[index],
      docName: name,
      fileError: error,
      docFile: file // Actual file object
    };

    updateSection("academic", { records: updatedRecords });
  }}
/>
              </div>
            </div>
          ))}
          <button
          disabled={isSubmitted}
            onClick={() => updateSection('education', { academicRecords: [...(education?.academicRecords || []), {}] })}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-primary font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Academic Record
          </button>
        </div>
      </FormSection>

      <FormSection title="Competitive Exam Scores" icon={Trophy}>
        <div className="md:col-span-2 space-y-4">
          {(education?.competitiveExams || []).map((exam, index) => (
            <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 relative">
              {!isSubmitted && (
                <button onClick={() => updateSection('education', { competitiveExams: education.competitiveExams.filter((_, i) => i !== index) })} className="absolute top-2 right-2 text-red-500 p-1 hover:bg-red-50 rounded">
                  <Trash2 size={16} />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField label="Exam" value={exam.examName || ''} onChange={(e) => updateExam(index, 'examName', e.target.value)} options={[{value:'JEE', label:'JEE'}, {value:'NEET', label:'NEET'}, {value:'GATE', label:'GATE'}]} disabled={isSubmitted} />
                <InputField label="Score" value={exam.score || ''} onChange={(e) => updateExam(index, 'score', e.target.value)} disabled={isSubmitted} />
                <SelectField label="Year" value={exam.year || ''} options={YEARS.map(y => ({ value: y, label: y }))} onChange={(e) => updateExam(index, 'year', e.target.value)} disabled={isSubmitted} />
                
          <FileInput
  label="Upload Scorecard"
  className="md:col-span-3"
  file={exam.docName}
  error={exam.fileError}
  disabled={isSubmitted}
  required={false}
  onChange={(e) => {
    const { name, error, file } = e.target;
    
    // Update logic for the 'competitive' exams array
    const updatedExams = [...education.competitive];
    updatedExams[index] = {
      ...updatedExams[index],
      docName: name,
      fileError: error,
      docFile: file // Binary file object for submission
    };

    updateSection("education", { competitive: updatedExams });
  }}
/>
              </div>
            </div>
          ))}
          <button disabled={isSubmitted} onClick={() => updateSection('education', { competitiveExams: [...(education?.competitiveExams || []), {}] })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-primary font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
            <Plus size={20} /> Add Competitive Exam
          </button>
        </div>
      </FormSection>

      <FormSection title="Migration & Transfer Details" icon={FileText}>
  <FileInput
  label="Upload Migration Certificate"
  className="md:col-span-3"
  required={false}
  file={education.migrationDocName}
  error={education.migrationError}
  disabled={isSubmitted}
  onChange={(e) => {
    const { name, error, file } = e.target;
    
    updateSection("education", {
      migrationDocName: name,
      migrationError: error,
      migrationFile: file // Actual binary for submission
    });
  }}
/>
      </FormSection>
    </FormWrapper>
  );
}