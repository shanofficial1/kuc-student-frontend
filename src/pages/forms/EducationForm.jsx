import React from 'react';
import { useStore } from '../../store';
import FormWrapper, { FormSection, InputField, SelectField, FileInput } from '../../components/FormWrapper';
import { School, Trophy, Trash2, Plus, FileText } from 'lucide-react';

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

export default function EducationForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const education = useStore((state) => state.education);
  const updateSection = useStore((state) => state.updateSection);
  console.log('Education State:', education); // Debugging log
  const handleSave = () => {
    console.log('Saved Education Data:', education);
  };

  // Helper for Academic Records (mapped to backend key 'education')
  const updateAcademic = (index, field, value) => {
    const newRecords = [...(education.education || [])];
    newRecords[index] = { ...newRecords[index], [field]: value };
    updateSection('education', { education: newRecords });
  };

  // Helper for Competitive Exams
  const updateExam = (index, field, value) => {
    const newExams = [...(education.competitiveExams || [])];
    newExams[index] = { ...newExams[index], [field]: value };
    updateSection('education', { competitiveExams: newExams });
  };

  return (
    <FormWrapper
      title="Education & Qualifications"
      description="Manage your academic history and competitive exam scores."
      onSave={handleSave}
    >
      {/* ACADEMIC RECORDS */}
      <FormSection title="Academic Records" icon={School}>
        <div className="md:col-span-2 space-y-6">
          {(education?.education || []).map((record, index) => (
            <div key={index} className="p-6 border border-slate-200 rounded-xl relative bg-slate-50 space-y-4 animate-in slide-in-from-top-2">
              {!isSubmitted && (
                <button 
                  onClick={() => {
                    const newRecords = education.education.filter((_, i) => i !== index);
                    updateSection('education', { education: newRecords });
                  }}
                  className="absolute top-4 right-4 text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField 
                  label="Qualification Type"
                  value={record.qualType || ''} // Matches backend qualType
                  onChange={(e) => updateAcademic(index, 'qualType', e.target.value)}
                  options={[
                    { value: '', label: 'Select...' },
                    { value: '10th', label: '10th Standard' },
                    { value: 'Plus Two', label: 'Plus Two / 12th' },
                    { value: 'UG', label: 'Undergraduate' },
                    { value: 'PG', label: 'Postgraduate' },
                  ]}
                  disabled={isSubmitted}
                />
                <InputField label="Stream" value={record.stream || ''} onChange={(e) => updateAcademic(index, 'stream', e.target.value)} disabled={isSubmitted} />
                <InputField label="Register Number" value={record.regNo || ''} onChange={(e) => updateAcademic(index, 'regNo', e.target.value)} disabled={isSubmitted} />
                <InputField label="Institution" value={record.institution || ''} onChange={(e) => updateAcademic(index, 'institution', e.target.value)} disabled={isSubmitted} />
                <InputField label="Board / University" value={record.board || ''} onChange={(e) => updateAcademic(index, 'board', e.target.value)} disabled={isSubmitted} />
                <InputField label="Percentage" type="number" value={record.percentage || ''} onChange={(e) => updateAcademic(index, 'percentage', e.target.value)} disabled={isSubmitted} />

                <div className="grid grid-cols-2 gap-4">
                  <SelectField label="Month" value={record.passMonth || ''} options={MONTHS.map(m => ({ value: m, label: m }))} onChange={(e) => updateAcademic(index, 'passMonth', e.target.value)} disabled={isSubmitted} />
                  <SelectField label="Year" value={record.passYear || ''} options={YEARS.map(y => ({ value: y, label: y }))} onChange={(e) => updateAcademic(index, 'passYear', e.target.value)} disabled={isSubmitted} />
                </div>

                <FileInput
                  label="Upload Document"
                  className="md:col-span-2"
                  file={record.docName || record.documentUrl?.split('/').pop()} // Show backend filename
                  error={record.fileError}
                  disabled={isSubmitted}
                  onChange={(e) => {
                    const { name, error, file } = e.target;
                    updateAcademic(index, 'docName', name);
                    updateAcademic(index, 'fileError', error);
                    updateAcademic(index, 'docFile', file);
                  }}
                />
              </div>
            </div>
          ))}
          <button
            disabled={isSubmitted}
            onClick={() => updateSection('education', { education: [...(education?.education || []), {}] })}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-primary font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Academic Record
          </button>
        </div>
      </FormSection>

      {/* COMPETITIVE EXAMS */}
      <FormSection title="Competitive Exam Scores" icon={Trophy}>
        <div className="md:col-span-2 space-y-4">
          {(education?.competitiveExams || []).map((exam, index) => (
            <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 relative">
              {!isSubmitted && (
                <button 
                  onClick={() => updateSection('education', { competitiveExams: education.competitiveExams.filter((_, i) => i !== index) })} 
                  className="absolute top-2 right-2 text-red-500 p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Exam Name" value={exam.examName || ''} onChange={(e) => updateExam(index, 'examName', e.target.value)} disabled={isSubmitted} />
                <InputField label="Score" value={exam.score || ''} onChange={(e) => updateExam(index, 'score', e.target.value)} disabled={isSubmitted} />
                <SelectField label="Year" value={exam.year || ''} options={YEARS.map(y => ({ value: y, label: y }))} onChange={(e) => updateExam(index, 'year', e.target.value)} disabled={isSubmitted} />
                
                <FileInput
                  label="Upload Scorecard"
                  className="md:col-span-3"
                  file={exam.docName || exam.documentUrl?.split('/').pop()}
                  error={exam.fileError}
                  disabled={isSubmitted}
                  onChange={(e) => {
                    const { name, error, file } = e.target;
                    updateExam(index, 'docName', name);
                    updateExam(index, 'fileError', error);
                    updateExam(index, 'docFile', file);
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

      {/* MIGRATION CERTIFICATE */}
      <FormSection title="Migration & Transfer Details" icon={FileText}>
        <FileInput
          label="Upload Migration Certificate"
          className="md:col-span-3"
          file={education.migrationDocName || education.migrationUrl?.split('/').pop()}
          error={education.migrationError}
          disabled={isSubmitted}
          onChange={(e) => {
            const { name, error, file } = e.target;
            updateSection("education", {
              migrationDocName: name,
              migrationError: error,
              migrationFile: file
            });
          }}
        />
      </FormSection>
    </FormWrapper>
  );
}