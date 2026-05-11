import React, { useState, useRef } from "react";
import { Download, Settings2, Search, School, Landmark, PenTool } from "lucide-react";
import { useStore } from "../store";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { SelectField } from "../components/FormWrapper";

export default function CECardPage() {
  const isSubmitted = useStore((state) => state.isSubmitted);
  const pdfRef = useRef();
  const [selectedSem, setSelectedSem] = useState("Semester IV");
  const navigate = useNavigate();
  const marksData = useStore((state) => state.marksData);

  const semesterOptions = [
    { label: "All Semesters", value: "all" },
    { label: "Semester IV", value: "Semester IV" },
    { label: "Semester III", value: "Semester III" },
    { label: "Semester II", value: "Semester II" },
    { label: "Semester I", value: "Semester I" },
  ];

  const displayCEs = selectedSem === "all" 
    ? Object.values(marksData).flat() 
    : marksData[selectedSem] || [];

  const handleDownloadPDF = async () => {
    const element = pdfRef.current;
    const options = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        const captured = clonedDoc.querySelector('[data-pdf-content="true"]');
        if (captured) {
          const allElements = captured.querySelectorAll("*");
          allElements.forEach((el) => {
            const style = window.getComputedStyle(el);
            if (style.color.includes("oklch")) el.style.color = "#1e293b";
            if (style.borderColor.includes("oklch")) el.style.borderColor = "#e2e8f0";
            if (style.backgroundColor.includes("oklch")) el.style.backgroundColor = "#ffffff";
          });
        }
      },
    };

    try {
      const canvas = await html2canvas(element, options);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`CECard_${selectedSem.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("PDF Generation Error:", err);
    }
  };

  return (
    <main className="max-w-[1024px] mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">CE Card / Mark List</h1>
          <p className="text-sm text-slate-500 mt-1">
            Official performance record: {selectedSem === "all" ? "Consolidated" : selectedSem}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-stretch md:items-end">
          <div className="w-full sm:w-56">
            <SelectField
              label="Select Semester"
              options={semesterOptions}
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/mark-request")}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg font-bold text-xs md:text-sm hover:bg-slate-200 transition-all border border-slate-200"
            >
              <Settings2 className="w-4 h-4" /> Correction
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center gap-2 bg-[#003e7a] text-white px-4 md:px-6 py-2.5 rounded-lg font-bold text-xs md:text-sm hover:opacity-90 transition-all"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD TABLE - MOBILE OPTIMIZED */}
    {/* DASHBOARD TABLE - ULTRA COMPACT VIEW */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-16">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {/* Using fixed widths to force the table to stay within bounds */}
              <th className="w-[35%] px-2 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Subject</th>
              <th className="w-[18%] px-1 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Internal</th>
              <th className="w-[18%] px-1 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-tighter">External</th>
              <th className="w-[18%] px-1 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total</th>
              <th className="w-[11%] px-1 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Res</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayCEs.map((g, i) => {
              const iMax = g.internalMax || 20;
              const eMax = g.externalMax || 80;
              const tMax = iMax + eMax;
              const tScored = Number(g.CE) + Number(g.TE);
              const isPass = g.result?.toLowerCase() === 'pass';

              return (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  {/* Subject Cell */}
                  <td className="px-2 py-2 overflow-hidden">
                    <p className="text-[10px] md:text-sm font-bold text-[#003e7a] truncate">{g.code}</p>
                    <p className="text-[9px] md:text-xs text-slate-400 truncate leading-tight">{g.title}</p>
                  </td>

                  {/* Marks Cells - No spaces around "/" to save width */}
                  <td className="px-1 py-2 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center text-[10px] md:text-sm">
                      <span className="font-bold">{g.CE}</span>
                      <span className="hidden md:inline text-slate-300 mx-0.5">/</span>
                      <span className="text-[8px] md:text-[10px] text-slate-400">{iMax}</span>
                    </div>
                  </td>

                  <td className="px-1 py-2 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center text-[10px] md:text-sm">
                      <span className="font-bold">{g.TE}</span>
                      <span className="hidden md:inline text-slate-300 mx-0.5">/</span>
                      <span className="text-[8px] md:text-[10px] text-slate-400">{eMax}</span>
                    </div>
                  </td>

                  <td className="px-1 py-2 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center text-[10px] md:text-sm">
                      <span className="font-black text-[#003e7a]">{tScored}</span>
                      <span className="hidden md:inline text-slate-300 mx-0.5">/</span>
                      <span className="text-[8px] md:text-[10px] text-slate-400">{tMax}</span>
                    </div>
                  </td>

                  {/* Result Cell - Compact Dot/Char */}
                  <td className="px-1 py-2 text-center">
                    <div className={`mx-auto w-5 h-5 flex items-center justify-center rounded text-[9px] font-black ${
                      isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {g.result?.charAt(0).toUpperCase()}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* OFFICIAL EXPORT PREVIEW */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Search className="w-5 h-5 text-[#003e7a]" /> Preview Official Export
        </h2>
        <div className="bg-slate-100 p-4 md:p-8 rounded-xl flex justify-center overflow-auto">
          <div
            ref={pdfRef}
            data-pdf-content="true"
            className="bg-white w-[794px] min-h-[1123px] p-10 md:p-16 relative flex flex-col shadow-lg shrink-0"
            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <School size={400} color="#000000" />
            </div>

            {/* University Header */}
            <div className="text-center border-b-2 border-slate-900 pb-8 mb-10">
              <Landmark size={60} color="#003e7a" className="mx-auto mb-4" />
              <h3 className="text-2xl font-black uppercase" style={{ color: '#003e7a' }}>Kannur University</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Established by the Act 22 of 1996</p>
              <div className="mt-6 bg-slate-900 text-white py-1 px-6 inline-block rounded text-[10px] font-bold uppercase tracking-widest">
                Official CE Card - {String(selectedSem).toUpperCase()}
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-y-4 mb-10 text-[12px]">
              <p><span className="font-bold text-slate-400 mr-2 uppercase">Student:</span> Arjun K. Varma</p>
              <p className="text-right"><span className="font-bold text-slate-400 mr-2 uppercase">Reg No:</span> KU21SIT042</p>
              <p><span className="font-bold text-slate-400 mr-2 uppercase">Date:</span> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</p>
              <p className="text-right"><span className="font-bold text-slate-400 mr-2 uppercase">Status:</span> PUBLISHED</p>
            </div>

            {/* Formal Table for PDF */}
            <table className="w-full border-2 border-slate-900 text-[10px] mb-10">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-900 font-bold text-center uppercase">
                  <td className="border-r border-slate-900 p-2 text-left" rowSpan="2">Course Title</td>
                  <td className="border-r border-slate-900 p-2" colSpan="2">Internal (CE)</td>
                  <td className="border-r border-slate-900 p-2" colSpan="2">External (TE)</td>
                  <td className="border-r border-slate-900 p-2" colSpan="2">Total Marks</td>
                  <td className="p-2" rowSpan="2">Result</td>
                </tr>
                <tr className="bg-slate-50 border-b-2 border-slate-900 font-bold text-[8px] text-center">
                  <td className="border-r border-slate-900 p-1">Scored</td>
                  <td className="border-r border-slate-900 p-1">Max</td>
                  <td className="border-r border-slate-900 p-1">Scored</td>
                  <td className="border-r border-slate-900 p-1">Max</td>
                  <td className="border-r border-slate-900 p-1">Scored</td>
                  <td className="border-r border-slate-900 p-1">Max</td>
                </tr>
              </thead>
              <tbody>
                {displayCEs.map((g, i) => {
                  const iMax = g.internalMax || 20;
                  const eMax = g.externalMax || 80;
                  const tMax = iMax + eMax;
                  const tScored = Number(g.CE) + Number(g.TE);

                  return (
                    <tr key={i} className="border-b border-slate-300 text-center uppercase">
                      <td className="border-r border-slate-900 p-2 text-left">
                        <span className="font-bold">{g.code}</span> - {g.title}
                      </td>
                      <td className="border-r border-slate-900 p-2 font-bold">{g.CE}</td>
                      <td className="border-r border-slate-900 p-2 text-slate-500">{iMax}</td>
                      <td className="border-r border-slate-900 p-2 font-bold">{g.TE}</td>
                      <td className="border-r border-slate-900 p-2 text-slate-500">{eMax}</td>
                      <td className="border-r border-slate-900 p-2 font-black">{tScored}</td>
                      <td className="border-r border-slate-900 p-2 text-slate-500">{tMax}</td>
                      <td className="p-2 font-bold">{g.result}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Signature Area */}
            <div className="mt-auto flex justify-between items-end border-t border-slate-100 pt-10">
              <div className="text-[10px] space-y-1 font-medium text-slate-500">
                <p className="font-bold text-slate-900">SGPA: 8.65</p>
                <p className="font-bold text-slate-900">CGPA: 8.42</p>
                <p className="mt-4 italic">Digitally generated document. No signature required.</p>
              </div>
              <div className="text-center w-48">
                <PenTool size={32} color="#cbd5e1" className="mx-auto mb-2" />
                <div className="border-t border-slate-900 pt-2 text-[10px] font-bold uppercase">
                  Controller of Examinations
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}