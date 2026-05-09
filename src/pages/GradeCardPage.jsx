import React, { useState, useRef } from "react";
import { Download,Settings2, Search, School, Landmark, PenTool, CheckCircle2 } from "lucide-react";
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
    
    // Explicit options for html2canvas to avoid modern CSS issues
    const options = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        const captured = clonedDoc.querySelector('[data-pdf-content="true"]');
        if (captured) {
          // FORCE REMOVAL of all CSS variables and OKLCH references in the clone
          const allElements = captured.querySelectorAll("*");
          allElements.forEach((el) => {
            const style = window.getComputedStyle(el);
            // If color or border contains oklch, override it with standard HEX
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
    <main className="max-w-[1024px] mx-auto px-6 py-10">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-primary">CE Card / Mark List</h1>
          <p className="text-sm text-slate-500 mt-1">
            Official performance record: {selectedSem === "all" ? "Consolidated" : selectedSem}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-56">
            <SelectField
              label="Select Semester"
              options={semesterOptions}
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate("/mark-request")}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-200 transition-all h-[42px] border border-slate-200"
          >
            <Settings2 className="w-4 h-4" /> Mark Correction
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-[#003e7a] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all h-[42px]"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </header>

      {/* DASHBOARD TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-16">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Code</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course Title</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">CE</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">TE</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayCEs.map((g, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-[#003e7a]">{g.code}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{g.title}</td>
                <td className="px-6 py-4 text-sm text-center font-bold">{g.CE}</td>
                <td className="px-6 py-4 text-sm text-center font-bold">{g.TE}</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-green-50 text-emerald-600">
                    {g.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* OFFICIAL EXPORT PREVIEW (The part that becomes PDF) */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Search className="w-5 h-5 text-[#003e7a]" /> Preview Official Export
        </h2>
        <div className="bg-slate-100 p-8 rounded-xl flex justify-center overflow-auto">
          <div
            ref={pdfRef}
            data-pdf-content="true"
            className="bg-white w-[794px] min-h-[1123px] p-16 relative flex flex-col shadow-lg"
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
              <p><span className="font-bold text-slate-400 mr-2 uppercase">Date:</span> 24 OCT 2023</p>
              <p className="text-right"><span className="font-bold text-slate-400 mr-2 uppercase">Status:</span> PUBLISHED</p>
            </div>

            {/* Formal Table */}
            <table className="w-full border-2 border-slate-900 text-[11px] mb-10">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-900 font-bold">
                  <td className="border-r border-slate-900 p-3">CODE</td>
                  <td className="border-r border-slate-900 p-3">COURSE TITLE</td>
                  <td className="p-3 text-center">CE</td>
                  <td className="p-3 text-center">TE</td>
                  <td className="p-3 text-center">Result</td>
                </tr>
              </thead>
              <tbody>
                {displayCEs.map((g, i) => (
                  <tr key={i} className="border-b border-slate-200">
                    <td className="border-r border-slate-900 p-3 font-bold">{g.code}</td>
                    <td className="border-r border-slate-900 p-3 uppercase">{g.title}</td>
                    <td className="p-3 text-center font-bold">{g.CE}</td>
                    <td className="p-3 text-center font-bold">{g.TE}</td>
                    <td className="p-3 text-center font-bold">{g.result}</td>
                  </tr>
                ))}
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