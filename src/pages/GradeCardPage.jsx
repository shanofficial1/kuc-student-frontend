import React from "react";
import { FileText, Download, CheckCircle2, ChevronDown } from "lucide-react";
import { useStore } from "../store";

export default function GradeCardPage() {
  const isSubmitted = useStore((state) => state.isSubmitted);

  const grades = [
    { code: "BIT401", title: "Database Management Systems", credits: 4, grade: "A+", result: "PASS" },
    { code: "BIT402", title: "Computer Networks", credits: 4, grade: "A", result: "PASS" },
    { code: "BIT403", title: "Operating Systems", credits: 3, grade: "B+", result: "PASS" },
    { code: "BIT404", title: "Software Engineering", credits: 3, grade: "O", result: "PASS" },
    { code: "BIT405L", title: "DBMS Laboratory", credits: 2, grade: "A+", result: "PASS" },
  ];

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      {/* ================= HEADER ================= */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Grade Card / Mark List
          </h1>
          <p className="text-slate-500 mt-1">
            Official academic performance record for Semester IV
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Semester Select */}
          <div className="relative">
            <select
              disabled={isSubmitted}
              className="appearance-none w-full sm:w-48 px-4 py-2.5 bg-white border border-border-subtle rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
              <option>Semester IV</option>
              <option>Semester III</option>
              <option>Semester II</option>
              <option>Semester I</option>
            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Download */}
          <button className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md hover:bg-primary-container active:scale-95 transition-all">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </header>

      {/* ================= STUDENT INFO ================= */}
      <section className="bg-white border border-border-subtle rounded-2xl p-8 mb-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-8">
        <Info label="Student Name" value="Arjun K. Varma" />
        <Info label="Register Number" value="KU21SIT042" />
        <Info label="Program" value="B.Tech IT" />
        <Info label="Academic Year" value="2023 - 2024" />
      </section>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-border-subtle">
              <TH>Code</TH>
              <TH>Course Title</TH>
              <TH center>Credits</TH>
              <TH center>Grade</TH>
              <TH center>Result</TH>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {grades.map((grade) => (
              <tr key={grade.code} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-primary">{grade.code}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{grade.title}</td>
                <td className="px-6 py-4 text-sm text-slate-600 text-center">{grade.credits}</td>
                <td className="px-6 py-4 text-sm font-black text-slate-800 text-center">{grade.grade}</td>

                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-status-success uppercase tracking-wider">
                    {grade.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= FOOTER ================= */}
        <div className="bg-slate-50 border-t border-border-subtle px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-12">
            <Stat label="Semester GPA" value="8.65" />
            <Stat label="Cumulative GPA" value="8.42" />
          </div>

          <div className="flex items-center gap-2 text-status-success font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Status: Result Published & Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL REUSABLE COMPONENTS ================= */

const Info = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className="font-bold text-slate-800">{value}</p>
  </div>
);

const TH = ({ children, center }) => (
  <th
    className={`px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${
      center ? "text-center" : ""
    }`}
  >
    {children}
  </th>
);

const Stat = ({ label, value }) => (
  <div className="text-center">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className="text-3xl font-black text-primary">{value}</p>
  </div>
);