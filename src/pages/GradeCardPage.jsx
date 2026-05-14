import React, { useState } from "react";
import {
  Download,
  Settings2,
} from "lucide-react";

import { useStore } from "../store";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { SelectField } from "../components/FormWrapper";
import pdflogo from "../assets/pdflogo.png";

export default function CECardPage() {
  const navigate = useNavigate();

  const marksData = useStore(
    (state) => state.marksData
  );

  const [selectedSem, setSelectedSem] =
    useState("Semester IV");

  const semesterOptions = [
    {
      label: "All Semesters",
      value: "all",
    },
    {
      label: "Semester IV",
      value: "Semester IV",
    },
    {
      label: "Semester III",
      value: "Semester III",
    },
    {
      label: "Semester II",
      value: "Semester II",
    },
    {
      label: "Semester I",
      value: "Semester I",
    },
  ];

  const semesterGroups =
    selectedSem === "all"
      ? Object.entries(marksData)
      : [
          [
            selectedSem,
            marksData[selectedSem] || [],
          ],
        ];

  const displayCEs =
    selectedSem === "all"
      ? Object.values(marksData).flat()
      : marksData[selectedSem] || [];

  // PDF DOWNLOAD
 const handleDownloadPDF =
  async () => {
    try {
      const page =
        document.getElementById(
          "pdf-page-all"
        );

      if (!page) return;

      const canvas =
        await html2canvas(page, {
          scale: 2,
          useCORS: true,
          backgroundColor:
            "#ffffff",
        });

      const imgData =
        canvas.toDataURL(
          "image/png"
        );

      const pdf =
        new jsPDF(
          "p",
          "mm",
          "a4"
        );

      const pdfWidth =
        pdf.internal.pageSize.getWidth();

      const pdfHeight =
        (canvas.height *
          pdfWidth) /
        canvas.width;

      let heightLeft =
        pdfHeight;

      let position = 0;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        pdfWidth,
        pdfHeight
      );

      heightLeft -= 297;

      while (
        heightLeft > 0
      ) {
        position =
          heightLeft -
          pdfHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          pdfWidth,
          pdfHeight
        );

        heightLeft -= 297;
      }

      pdf.save(
        "Kannur_University_CE_Card.pdf"
      );
    } catch (err) {
      console.error(
        "PDF Error:",
        err
      );
    }
  };
  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#003e7a]">
            Grade Card / Mark List
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Official academic
            performance record
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch md:items-end">
          <div className="w-full sm:w-56">
            <SelectField
              label="Select Semester"
              options={semesterOptions}
              value={selectedSem}
              onChange={(e) =>
                setSelectedSem(
                  e.target.value
                )
              }
            />
          </div>

          <div className="flex gap-2">
            {/* CORRECTION */}
            <button
              onClick={() =>
                navigate("/mark-request")
              }
              className="
                flex items-center justify-center gap-2
                bg-slate-100
                border border-slate-200
                text-slate-700
                px-4 py-2
                rounded-xl
                font-semibold
                text-sm
                hover:bg-slate-200
                transition-all
                h-[42px]
              "
            >
              <Settings2 className="w-4 h-4" />
              Correction
            </button>

            {/* DOWNLOAD */}
            <button
              onClick={handleDownloadPDF}
              className="
                flex items-center justify-center gap-2
                bg-[#003e7a]
                text-white
                px-5
                py-2
                rounded-xl
                font-semibold
                text-sm
                shadow-md
                hover:bg-[#004b94]
                transition-all
                h-[42px]
              "
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* TABLES */}
<div className="space-y-6 md:space-y-10">
  {semesterGroups.map(
    (
      [
        semesterName,
        semesterData,
      ],
      index
    ) => (
      <div
        key={index}
        className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden"
      >
        {/* HEADER */}
        <div className="px-4 md:px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base md:text-xl font-black text-[#003e7a] uppercase tracking-wide">
            {semesterName}
          </h2>

         
        </div>

        {/* TABLE */}
        <div className="overflow-hidden">
         <table className="w-full border-collapse table-fixed">
  <thead>
    <tr className="bg-slate-50 border-b border-slate-200">
      <th className="w-[18%] px-2 md:px-4 py-4 text-left text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-500">
        Code
      </th>

      <th className="w-[26%] px-2 md:px-4 py-4 text-left text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-500">
        Title
      </th>

      <th className="w-[9%] px-1 py-4 text-center text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-500">
        I
      </th>

      <th className="w-[9%] px-1 py-4 text-center text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-500">
        O
      </th>

      <th className="w-[9%] px-1 py-4 text-center text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-500">
        E
      </th>

      <th className="w-[9%] px-1 py-4 text-center text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-500">
        O
      </th>

      <th className="w-[9%] px-1 py-4 text-center text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-500">
        T
      </th>

      <th className="w-[9%] px-1 py-4 text-center text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-500">
        R
      </th>
    </tr>
  </thead>

  <tbody className="divide-y divide-slate-100">
    {semesterData.map((g, i) => {
      const iMax =
        g.internalMax || 20;

      const eMax =
        g.externalMax || 80;

      const total =
        Number(g.CE) +
        Number(g.TE);

      const isPass =
        g.result?.toLowerCase() ===
        "pass";

      return (
        <tr
          key={i}
          className="hover:bg-slate-50 transition-colors"
        >
          {/* CODE */}
          <td className="px-2 md:px-4 py-6 text-[12px] md:text-sm font-bold text-[#003e7a] align-middle">
            {g.code}
          </td>

          {/* TITLE */}
          <td className="px-2 md:px-4 py-6 text-[11px] md:text-sm text-slate-700 leading-snug align-middle">
            <div className="break-words">
              {g.title}
            </div>
          </td>

          {/* INTERNAL */}
          <td className="px-1 py-6 text-center text-[12px] md:text-sm font-semibold align-middle">
            {g.CE}
          </td>

          {/* INTERNAL OUT OF */}
          <td className="px-1 py-6 text-center text-[12px] md:text-sm text-slate-400 font-semibold align-middle">
            {iMax}
          </td>

          {/* EXTERNAL */}
          <td className="px-1 py-6 text-center text-[12px] md:text-sm font-semibold align-middle">
            {g.TE}
          </td>

          {/* EXTERNAL OUT OF */}
          <td className="px-1 py-6 text-center text-[12px] md:text-sm text-slate-400 font-semibold align-middle">
            {eMax}
          </td>

          {/* TOTAL */}
          <td className="px-1 py-6 text-center text-[13px] md:text-sm font-black text-[#003e7a] align-middle">
            {total}
          </td>

          {/* RESULT */}
          <td className="px-1 py-6 text-center align-middle">
            <span
              className={`inline-flex items-center justify-center w-8 h-8  text-[11px] md:text-xs font-black `}
            >
              {isPass ? "P" : "F"}
            </span>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
        </div>

        {/* GPA */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 md:px-8 py-5 md:py-8">
          <div className="flex gap-8 md:gap-16">
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-wider text-slate-400 mb-1 md:mb-2">
                Semester GPA
              </p>

              <h3 className="text-3xl md:text-5xl font-black text-[#003e7a] leading-none">
                8.65
              </h3>
            </div>

            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-wider text-slate-400 mb-1 md:mb-2">
                Cumulative GPA
              </p>

              <h3 className="text-3xl md:text-5xl font-black text-[#003e7a] leading-none">
                8.42
              </h3>
            </div>
          </div>
        </div>
      </div>
    )
  )}
</div>

     {/* HIDDEN PDF */}
{/* HIDDEN PDF */}
<div
  className="fixed left-[-99999px] top-0"
  style={{
    background: "#ffffff",
  }}
>
  <div
    id="pdf-page-all"
    className="w-[1200px] bg-white px-12 py-10"
    style={{
      background: "#ffffff",
      color: "#000000",
      fontFamily:
        "Arial, sans-serif",
    }}
  >
    {/* TOP HEADER */}
    <div className="mb-10">
      {/* UNIVERSITY */}
<div className="relative mb-16">

  {/* LOGO */}
  <div className="flex justify-center mb-4">
 <img
  src={pdflogo}
  alt="Kannur University Logo"
  className="h-[95px] w-auto mx-auto"
  style={{
    objectFit: "contain",
  }}
/>
  </div>

  {/* UNIVERSITY NAME */}
  <div className="text-center">
    <h1 className="text-[22px] font-black uppercase tracking-wide">
      Kannur University
    </h1>


  </div>

  {/* DATE */}
  <div className="absolute right-0 top-0 text-[12px] text-right">
    <p className="font-semibold">
      Date
    </p>

    <p>
      {new Date().toLocaleDateString(
        "en-GB"
      )}
    </p>
  </div>
</div>

      {/* TITLE */}
      <div className="text-center mb-12">
        <h2 className="text-[28px] font-black uppercase tracking-wide">
          Mark
          Card
        </h2>

        <p className="text-[20px] font-bold mt-2">
          Master of Computer
          Application
        </p>
      </div>

      {/* STUDENT DETAILS */}
      <div className="flex justify-between text-[14px] mb-8">
        {/* LEFT */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="font-semibold w-[90px]">
              Name :
            </span>

            <span className="font-black uppercase">
              SHAN. A
            </span>
          </div>

          <div className="flex gap-3">
            <span className="font-semibold w-[90px]">
              College :
            </span>

            <span className="font-black">
              DEPARTMENT OF INFORMATION TECHNOLOGY, KANNUR UNIVERSITY
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-3 text-right">
          <div className="flex gap-3 justify-end">
            <span className="font-semibold">
              Reg. No. :
            </span>

            <span className="font-black uppercase">
              IT25GMCAD07
            </span>
          </div>

          <div className="flex gap-3 justify-end">
            <span className="font-semibold">
              Year of Study :
            </span>

            <span className="font-black">
              2025 - 2027
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* ALL SEMESTERS */}
    {semesterGroups.map(
      (
        [
          semesterName,
          semesterData,
        ],
        semesterIndex
      ) => (
        <div
          key={semesterIndex}
          className="mb-4"
        >
          {/* SEMESTER HEADING */}
          <div className="border border-black border-b-0 p-3 text-center text-[20px] font-black">
            {semesterName}
          </div>

          {/* TABLE */}
          <table
            className="w-full border-collapse text-[13px]"
            style={{
              border:
                "1px solid black",
            }}
          >
            <thead>
              <tr>
                <th className="border border-black p-2">
                  Course Code
                </th>

                <th className="border border-black p-2">
                  Course Title
                </th>

                <th className="border border-black p-2">
                  Cr.
                </th>

                <th className="border border-black p-2">
                  Max.
                </th>

                <th className="border border-black p-2">
                  CE
                </th>

                <th className="border border-black p-2">
                  ESE
                </th>

                <th className="border border-black p-2">
                  Total
                </th>

                <th className="border border-black p-2">
                  GP
                </th>

                <th className="border border-black p-2">
                  G
                </th>

                <th className="border border-black p-2">
                  CP
                </th>

                <th className="border border-black p-2">
                  Result
                </th>
              </tr>
            </thead>

            <tbody>
              {semesterData.map(
                (g, i) => {
                  const internalMax =
                    g.internalMax ||
                    20;

                  const externalMax =
                    g.externalMax ||
                    80;

                  const totalMax =
                    internalMax +
                    externalMax;

                  const total =
                    Number(g.CE) +
                    Number(g.TE);

                  const credits =
                    g.credits || 4;

                  const gp = (
                    total / 10
                  ).toFixed(1);

                  let grade = "C";

                  if (total >= 90)
                    grade = "O";
                  else if (
                    total >= 80
                  )
                    grade = "A+";
                  else if (
                    total >= 70
                  )
                    grade = "A";
                  else if (
                    total >= 60
                  )
                    grade = "B+";
                  else if (
                    total >= 50
                  )
                    grade = "B";

                  const cp = (
                    credits *
                    Number(gp)
                  ).toFixed(1);

                  return (
                    <tr key={i}>
                      <td className="border border-black p-2 font-bold">
                        {g.code}
                      </td>

                      <td className="border border-black p-2">
                        {g.title}
                      </td>

                      <td className="border border-black p-2 text-center">
                        {credits}
                      </td>

                      <td className="border border-black p-2 text-center">
                        {totalMax}
                      </td>

                      <td className="border border-black p-2 text-center">
                        {g.CE}
                      </td>

                      <td className="border border-black p-2 text-center">
                        {g.TE}
                      </td>

                      <td className="border border-black p-2 text-center font-black">
                        {total}
                      </td>

                      <td className="border border-black p-2 text-center">
                        {gp}
                      </td>

                      <td className="border border-black p-2 text-center font-bold">
                        {grade}
                      </td>

                      <td className="border border-black p-2 text-center">
                        {cp}
                      </td>

                      <td className="border border-black p-2 text-center font-bold">
                        {g.result ===
                        "Pass"
                          ? "P"
                          : "F"}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )
    )}
  </div>
</div>

    </main>
  );
}