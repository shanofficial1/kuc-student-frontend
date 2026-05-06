import { useState } from "react";
import { useStore } from "../../store";
import {
  User,
  School,
  FileText,
  Info,
  Edit3,
  Gavel,
  Home,
  Briefcase,
  CreditCard,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function FinalReviewForm() {
  const store = useStore();
  const isSubmitted = store.isSubmitted;
  const [agreed, setAgreed] = useState(false);

  function handleSubmit() {
    if (!agreed) return;

    store.setSubmitted(true);
    alert("Final submission successful! Your application is now locked.");
    console.log("Submitted Data:", store);
  }

  /* ================= HELPER ================= */
  const renderField = (label, value) => (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className={`font-medium ${!value ? "text-red-500" : "text-slate-700"}`}>
        {value || "Not provided"}
      </p>
    </div>
  );

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12 pb-24">
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-primary mb-2">Final Review</h1>
        <p className="text-slate-500 max-w-2xl">
          Please review all information carefully before final submission.
        </p>
      </header>

      <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-xl mb-10 flex gap-4 items-start shadow-sm">
        <Info className="w-6 h-6 text-primary shrink-0" />
        <div>
          <p className="font-bold text-primary">Final Submission Policy</p>
          <p className="text-sm text-slate-600 mt-1">
            Once you click on "Final Submit Application", all input fields will become read-only and cannot be modified without administrative approval.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* ================= ACADEMIC ================= */}
        <section className="bg-white border border-border-subtle rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between mb-6">
            <h2 className="font-bold flex items-center gap-2">
              <School className="w-5 h-5 text-primary" />
              Academic Summary
            </h2>
            <Link to="/forms/academic">
              <Edit3 className="w-4 h-4 text-primary" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-y-6">
            {renderField("Program", store.academic.degreeName)}
            {renderField("Semester", store.academic.semester)}
            {renderField("Enrollment", store.academic.enrollmentNo)}
            {renderField("Batch", store.academic.batch)}
          </div>
        </section>

        {/* ================= PERSONAL ================= */}
        <section className="bg-white border border-border-subtle rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between mb-6">
            <h2 className="font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Summary
            </h2>
            <Link to="/forms/personal">
              <Edit3 className="w-4 h-4 text-primary" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-y-6">
            {renderField("Full Name", store.personal.fullName)}
            {renderField("DOB", store.personal.dob)}
            {renderField("Nationality", store.personal.nationality)}
            {renderField("Category", store.personal.category)}
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section className="bg-white border border-border-subtle rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between mb-6">
            <h2 className="font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Contact Summary
            </h2>
            <Link to="/forms/contact">
              <Edit3 className="w-4 h-4 text-primary" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-y-6">
            {renderField("Mobile", store.contact.mobile)}
            {renderField("Email", store.contact.email)}
            {renderField("Address", store.contact.address)}
          </div>
        </section>

        {/* ================= EDUCATION ================= */}
        <section className="bg-white border border-border-subtle rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between mb-6">
            <h2 className="font-bold flex items-center gap-2">
              <School className="w-5 h-5 text-primary" />
              Education Summary
            </h2>
            <Link to="/forms/education">
              <Edit3 className="w-4 h-4 text-primary" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-y-6">
            {renderField("Records Count", store.education.academicRecords?.length)}
            {renderField("Competitive Exams", store.education.competitiveExams?.length)}
            {renderField("Migration Uploaded", store.education.migrationDocName)}
          </div>
        </section>

        {/* ================= FINANCIAL ================= */}
        <section className="bg-white border border-border-subtle rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between mb-6">
            <h2 className="font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Financial Summary
            </h2>
            <Link to="/forms/financial">
              <Edit3 className="w-4 h-4 text-primary" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-y-6">
            {renderField("Scholarship", store.financial.scholarshipCategory)}
            {renderField("Loan Bank", store.financial.loanBankName)}
            {renderField("Loan Amount", store.financial.loanAmount)}
          </div>
        </section>

        {/* ================= PROFESSIONAL ================= */}
        <section className="bg-white border border-border-subtle rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between mb-6">
            <h2 className="font-bold flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Professional Summary
            </h2>
            <Link to="/forms/professional">
              <Edit3 className="w-4 h-4 text-primary" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-y-6">
            {renderField("Experience Count", store.professional.experience?.length)}
            {renderField("Skills Count", store.professional.skills?.length)}
            {renderField("Publications", store.professional.publications?.length)}
          </div>
        </section>

        {/* ================= RESIDENTIAL ================= */}
        <section className="bg-white border border-border-subtle rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between mb-6">
            <h2 className="font-bold flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              Residential Summary
            </h2>
            <Link to="/forms/residential">
              <Edit3 className="w-4 h-4 text-primary" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-y-6">
            {renderField("Type", store.residential.type)}
            {renderField("Hostel Block", store.residential.hostelBlock)}
            {renderField("Room No", store.residential.roomNo)}
            {renderField("Transport", store.residential.transportOpted)}
          </div>
        </section>

        {/* ================= DOCUMENTS ================= */}
        <section className="bg-white border border-border-subtle rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between mb-6">
            <h2 className="font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Documents Summary
            </h2>
            <Link to="/forms/documents">
              <Edit3 className="w-4 h-4 text-primary" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-y-6">
            {renderField("Profile Photo", store.documents.profilePhoto?.file)}
            {renderField("Signature", store.documents.signature?.file)}
            {renderField("Transcripts", store.documents.transcripts?.file)}
          </div>
        </section>

        {/* ================= DECLARATION ================= */}
        <div className="bg-slate-900 text-white rounded-3xl p-10">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Gavel className="w-5 h-5" />
            Declaration
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            I hereby declare that the information provided above is true and accurate to the best of my knowledge. 
            I understand that any false statements or misrepresentation of facts may lead to the rejection of my 
            application or disciplinary action by Kannur University.
          </p>

          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              disabled={isSubmitted}
            />
            <span>I agree to terms</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!agreed || isSubmitted}
            className={`px-10 py-4 rounded-xl font-bold ${
              agreed
                ? "bg-primary text-white"
                : "bg-slate-600 text-slate-300 cursor-not-allowed"
            }`}
          >
            Final Submit Application
          </button>
        </div>
      </div>
    </div>
  );
}