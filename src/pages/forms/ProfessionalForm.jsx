import React, { useState } from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
  FileInput,
  SelectField,
} from "../../components/FormWrapper";
import {
  BookOpen,
  Users,
  Briefcase,
  Plus,
  Trash2,
  Lightbulb,
  X,
} from "lucide-react";
import useHashFocus from '../../hooks/useHashFocus';
import { useNavigate } from "react-router-dom";
export default function ProfessionalForm() {
  const {deleteProfileRecord}=useStore();
    const navigate = useNavigate();
  const {membershipTypes,patentStatuses,conferenceTypes,presentationTypes,indexingServices,publicationStatuses,publicationIndexedIn,publicationTypes,countries} =useStore();
  useHashFocus();
  const isSubmitted = useStore((s) => s.isSubmitted);
  const professional = useStore((s) => s.professional) || {};
  const updateSection = useStore((s) => s.updateSection);
  console.log("Professional State:", professional); // Debugging log
  const [skillInput, setSkillInput] = useState("");

  const currentSkills = typeof professional.skills === 'string' 
    ? professional.skills.split(",").filter(s => s.trim() !== "") 
    : [];

const handleArrayUpdate = (key, index, field, value) => {
  const arr = [...(professional[key] || [])];

  let val = value;

  // ==========================================
  // CONFERENCE DATE
  // ==========================================
  if (key === "conferences" && field === "date") {
    // Numbers only, maximum 8 digits
    const digits = value
      .replace(/\D/g, "")
      .slice(0, 8);

    const dd = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    const yyyy = digits.slice(4, 8);

    // ------------------------------------------
    // DD-MM-YYYY FORMAT
    // ------------------------------------------
    if (digits.length <= 2) {
      val = dd;
    } else if (digits.length <= 4) {
      val = `${dd}-${mm}`;
    } else {
      val = `${dd}-${mm}-${yyyy}`;
    }

    let dateError = "";

    // ------------------------------------------
    // CHECK DAY WHILE TYPING
    // ------------------------------------------
    if (dd.length === 2) {
      const day = Number(dd);

      if (day < 1 || day > 31) {
        dateError = "Invalid day";
      }
    }

    // ------------------------------------------
    // CHECK MONTH WHILE TYPING
    // ------------------------------------------
    if (!dateError && mm.length === 2) {
      const month = Number(mm);

      if (month < 1 || month > 12) {
        dateError = "Invalid month";
      }
    }

    // ------------------------------------------
    // CHECK COMPLETE DATE
    // ------------------------------------------
    if (!dateError && digits.length === 8) {
      const day = Number(dd);
      const month = Number(mm);
      const year = Number(yyyy);

      const enteredDate = new Date(
        year,
        month - 1,
        day
      );

      enteredDate.setHours(0, 0, 0, 0);

      // Check actual calendar date
      const isValidCalendarDate =
        enteredDate.getFullYear() === year &&
        enteredDate.getMonth() === month - 1 &&
        enteredDate.getDate() === day;

      if (!isValidCalendarDate) {
        dateError = "Invalid date";
      } else {
        // --------------------------------------
        // CONFERENCE DATE = PAST ONLY
        // --------------------------------------
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (enteredDate > today) {
          dateError = "Future date not allowed";
        }
      }
    }

    // ------------------------------------------
    // SAVE DATE + ERROR
    // ------------------------------------------
    arr[index] = {
      ...arr[index],
      date: val,
      dateError,
    };
  }

  // ==========================================
  // ALL OTHER ARRAY FIELDS
  // ==========================================
  else {
    arr[index] = {
      ...arr[index],
      [field]: value,
    };
  }

  updateSection("professional", {
    [key]: arr,
  });
};
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      // 🔥 Logic: Convert to Uppercase before adding to the list
      const upperSkill = skillInput.trim().toUpperCase();
      
      if (!currentSkills.includes(upperSkill)) {
        const newSkills = [...currentSkills, upperSkill].join(",");
        updateSection("professional", { skills: newSkills });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    const newSkills = currentSkills.filter((s) => s !== skill).join(",");
    updateSection("professional", { skills: newSkills });
  };

  const saveAndRefresh =
  useStore(
    (s) => s.saveAndRefresh
  );

  const validateYear = (value, rule = "all") => {
  // Empty
  if (!value) {
    return "";
  }

  const yearString = String(value);

  // Must be exactly 4 digits
  if (!/^\d{4}$/.test(yearString)) {
    return "Enter a valid 4-digit year";
  }

  const year = Number(yearString);
  const currentYear = new Date().getFullYear();

  // Basic valid year
  if (year < 1) {
    return "Enter a valid year";
  }

  // Past = current year or earlier
  if (rule === "past" && year > currentYear) {
    return `Year cannot be after ${currentYear}`;
  }

  // Future = current year or later
  if (rule === "future" && year < currentYear) {
    return `Year cannot be before ${currentYear}`;
  }

  return "";
};

// const handleSave = async () => {

//   const formData =
//     new FormData();

//   // Membership name/url entries
//   professional.membershipUrl?.forEach((mem, index) => {

//     formData.append(
//       `professional_details[membershipUrl][${index}][organizationName]`,
//       mem.organizationName || mem.name || ""
//     );

//     formData.append(
//       `professional_details[membershipUrl][${index}][membershipType]`,
//       mem.membershipType || ""
//     );

//     formData.append(
//       `professional_details[membershipUrl][${index}][membershipId]`,
//       mem.membershipId || ""
//     );

//     formData.append(
//       `professional_details[membershipUrl][${index}][joiningYear]`,
//       mem.joiningYear || ""
//     );

//     formData.append(
//       `professional_details[membershipUrl][${index}][document][name]`,
//       mem.document?.name || (mem.name || "")
//     );

//     formData.append(
//       `professional_details[membershipUrl][${index}][document][url]`,
//       mem.document?.url || (mem.url || "")
//     );

//   });


//   professional.publications?.forEach(
//     (pub, index) => {

//       formData.append(
//         `professional_details[publications][${index}][journal]`,
//         pub.journal || ""
//       );

//       formData.append(
//         `professional_details[publications][${index}][issn]`,
//         pub.issn || ""
//       );

//       formData.append(
//         `professional_details[publications][${index}][date]`,
//         pub.date || ""
//       );

//           formData.append(
//             `professional_details[publications][${index}][country]`,
//             pub.country || ""
//           );

      

//       formData.append(
//         `professional_details[publications][${index}][paperTitle]`,
//         pub.paperTitle || ""
//       );

//       formData.append(
//         `professional_details[publications][${index}][indexedIn]`,
//         pub.indexedIn || ""
//       );

//       formData.append(
//         `professional_details[publications][${index}][volume]`,
//         pub.volume || ""
//       );

//       formData.append(
//         `professional_details[publications][${index}][issue]`,
//         pub.issue || ""
//       );

//       formData.append(
//         `professional_details[publications][${index}][pages]`,
//         pub.pages || ""
//       );

//       formData.append(
//         `professional_details[publications][${index}][impactFactor]`,
//         pub.impactFactor || ""
//       );

//       formData.append(
//         `professional_details[publications][${index}][coAuthors]`,
//         pub.coAuthors || ""
//       );

//       formData.append(
//         `professional_details[publications][${index}][doi]`,
//         pub.doi || ""
//       );

//       if (
//         pub.docFile
//           instanceof File
//       ) {

//         formData.append(
//           "publicationDocs",
//           pub.docFile
//         );

//       }

//     }
//   );

//   // Conferences


//   professional.membershipUrl?.forEach(
//   (mem) => {

//     if (
//       mem.docFile instanceof File
//     ) {

//       formData.append(
//         "membershipDocs",
//         mem.docFile
//       );

//     }

//   }
// );

//   professional.conferences?.forEach(
//     (conf, index) => {

//       formData.append(
//         `professional_details[conferences][${index}][title]`,
//         conf.title || ""
//       );

//       formData.append(
//         `professional_details[conferences][${index}][name]`,
//         conf.name || ""
//       );

//       // New conference fields
//       formData.append(
//         `professional_details[conferences][${index}][presentationType]`,
//         conf.presentationType || ""
//       );

//       formData.append(
//         `professional_details[conferences][${index}][paperTitle]`,
//         conf.paperTitle || conf.title || ""
//       );

//       formData.append(
//         `professional_details[conferences][${index}][conferenceName]`,
//         conf.conferenceName || conf.name || ""
//       );

//       formData.append(
//         `professional_details[conferences][${index}][conferenceType]`,
//         conf.conferenceType || ""
//       );

//       formData.append(
//         `professional_details[conferences][${index}][organizer]`,
//         conf.organizer || ""
//       );

//       formData.append(
//         `professional_details[conferences][${index}][venue]`,
//         conf.venue || ""
//       );

//       formData.append(
//         `professional_details[conferences][${index}][date]`,
//         conf.date || ""
//       );

//       formData.append(
//         `professional_details[conferences][${index}][isbnIssn]`,
//         conf.isbnIssn || ""
//       );

//       formData.append(
//         `professional_details[conferences][${index}][doiLink]`,
//         conf.doiLink || ""
//       );

//       formData.append(
//         `professional_details[conferences][${index}][certificateUrl]`,
//         conf.certificateUrl || (conf.url && conf.url.url) || ""
//       );

//       if (
//         conf.docFile
//           instanceof File
//       ) {

//         formData.append(
//           "conferenceDocs",
//           conf.docFile
//         );

//       }

//     }
//   );

//   // Experience

//   professional.experience?.forEach(
//     (exp, index) => {

//       formData.append(
//         `professional_details[experience][${index}][company]`,
//         exp.company || ""
//       );

//       formData.append(
//         `professional_details[experience][${index}][designation]`,
//         exp.designation || ""
//       );

//       formData.append(
//         `professional_details[experience][${index}][years]`,
//         exp.years || ""
//       );

//       if (
//         exp.docFile
//           instanceof File
//       ) {

//         formData.append(
//           "experienceDocs",
//           exp.docFile
//         );

//       }

//     }
//   );

//   // Patents

//   professional.patents?.forEach(
//     (pat, index) => {

//       formData.append(
//         `professional_details[patents][${index}][title]`,
//         pat.title || ""
//       );

//       formData.append(
//         `professional_details[patents][${index}][status]`,
//         pat.status || ""
//       );

//           formData.append(
//             `professional_details[patents][${index}][publicationType]`,
//             pat.publicationType || ""
//           );

//           formData.append(
//             `professional_details[patents][${index}][paperTitle]`,
//             pat.paperTitle || ""
//           );

//           formData.append(
//             `professional_details[patents][${index}][indexedIn]`,
//             pat.indexedIn || ""
//           );

//           formData.append(
//             `professional_details[patents][${index}][volume]`,
//             pat.volume || ""
//           );

//           formData.append(
//             `professional_details[patents][${index}][issue]`,
//             pat.issue || ""
//           );

//           formData.append(
//             `professional_details[patents][${index}][pages]`,
//             pat.pages || ""
//           );

//           formData.append(
//             `professional_details[patents][${index}][impactFactor]`,
//             pat.impactFactor || ""
//           );

//           formData.append(
//             `professional_details[patents][${index}][coAuthors]`,
//             pat.coAuthors || ""
//           );

//           formData.append(
//             `professional_details[patents][${index}][doi]`,
//             pat.doi || ""
//           );

//           formData.append(
//             `professional_details[patents][${index}][country]`,
//             pat.country || ""
//           );

//       if (
//         pat.docFile
//           instanceof File
//       ) {

//         formData.append(
//           "patentDocs",
//           pat.docFile
//         );

//       }

//     }
//   );

//   // Skills

//   formData.append(
//     "professional_details[skills]",
//     professional.skills || ""
//   );

//   await saveAndRefresh(
//     formData,
//     true
//   );

// };
const handleSave = async () => {
  navigate("/forms/residential");
};

const handleDeletePublication = async (index) => {

  const publication = professional.publications[index];

  if (!publication) return;

  if (!publication._id) {
    updateSection("professional", {
      publications: professional.publications.filter((_, i) => i !== index),
    });
    return;
  }

  const result = await deleteProfileRecord(
    "publications",
    publication._id
  );

  if (result.success) {
    updateSection("professional", {
      publications: professional.publications.filter((_, i) => i !== index),
    });
  } else {
    alert(result.message);
  }
};
const handleDeleteConference = async (index) => {

  const conference = professional.conferences[index];

  if (!conference) return;

  if (!conference._id) {
    updateSection("professional", {
      conferences: professional.conferences.filter((_, i) => i !== index),
    });
    return;
  }

  const result = await deleteProfileRecord(
    "conferences",
    conference._id
  );

  if (result.success) {
    updateSection("professional", {
      conferences: professional.conferences.filter((_, i) => i !== index),
    });
  } else {
    alert(result.message);
  }
};
const handleDeleteExperience = async (index) => {

  const experience = professional.experience[index];

  if (!experience) return;

  if (!experience._id) {
    updateSection("professional", {
      experience: professional.experience.filter((_, i) => i !== index),
    });
    return;
  }

  const result = await deleteProfileRecord(
    "experience",
    experience._id
  );

  if (result.success) {
    updateSection("professional", {
      experience: professional.experience.filter((_, i) => i !== index),
    });
  } else {
    alert(result.message);
  }
};

const handleDeletePatent = async (index) => {

  const patent = professional.patents[index];

  if (!patent) return;

  if (!patent._id) {
    updateSection("professional", {
      patents: professional.patents.filter((_, i) => i !== index),
    });
    return;
  }

  const result = await deleteProfileRecord(
    "patents",
    patent._id
  );

  if (result.success) {
    updateSection("professional", {
      patents: professional.patents.filter((_, i) => i !== index),
    });
  } else {
    alert(result.message);
  }
};

const handleDeleteMembership = async (index) => {

  const membership = professional.membershipUrl[index];

  if (!membership) return;

  if (!membership._id) {
    updateSection("professional", {
      membershipUrl: professional.membershipUrl.filter((_, i) => i !== index),
    });
    return;
  }

  const result = await deleteProfileRecord(
    "membershipUrl",
    membership._id
  );

  if (result.success) {
    updateSection("professional", {
      membershipUrl: professional.membershipUrl.filter((_, i) => i !== index),
    });
  } else {
    alert(result.message);
  }
};

  return (
    <FormWrapper
      title="Professional & Research"
      description="Manage publications, conferences, experience, and skills."
onSave={handleSave}
    >
      {/* ================= JOURNAL PUBLICATIONS ================= */}
      <FormSection title="Journal Publications" icon={BookOpen}>
        <div className="md:col-span-2 space-y-6">
          {(professional.publications || []).map((pub, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl grid md:grid-cols-2 gap-4 relative bg-slate-50">
              <button
                type="button"
onClick={() => handleDeletePublication(index)}
                className="absolute right-0 top-0 text-red-500 p-4"
              >
                <Trash2 size={16} />
              </button>
              

              <InputField label="Title of Paper" value={pub.paperTitle || ""} onChange={(e) => handleArrayUpdate("publications", index, "paperTitle", e.target.value)} />

              <InputField label="Journal Name" value={pub.journal || ""} onChange={(e) => handleArrayUpdate("publications", index, "journal", e.target.value)} />

              <InputField label="ISSN Number" value={pub.issn || ""} onChange={(e) => handleArrayUpdate("publications", index, "issn", e.target.value)} />

<InputField
  label="Year of Publication"
  value={pub.date ? pub.date.split("-")[0] : ""}
  placeholder="YYYY"
  maxLength={4}
  error={validateYear(
    pub.date ? pub.date.split("-")[0] : "",
    "past"
  )}
  onChange={(e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    handleArrayUpdate(
      "publications",
      index,
      "date",
      value
    );
  }}
/>
              <SelectField
                label="Indexed In"
                value={pub.indexedIn || ""}
                disabled={isSubmitted}
                onChange={(e) => handleArrayUpdate("publications", index, "indexedIn", e.target.value)}
                options={indexingServices}
              />

              <InputField label="Volume" value={pub.volume || ""} onChange={(e) => handleArrayUpdate("publications", index, "volume", e.target.value)} />

              <InputField label="Issue" value={pub.issue || ""} onChange={(e) => handleArrayUpdate("publications", index, "issue", e.target.value)} />

              <InputField label="Pages" value={pub.pages || ""} onChange={(e) => handleArrayUpdate("publications", index, "pages", e.target.value)} />

              <InputField label="Impact Factor" value={pub.impactFactor || ""} onChange={(e) => handleArrayUpdate("publications", index, "impactFactor", e.target.value)} />

              <InputField label="Co-authors" value={pub.coAuthors || ""} onChange={(e) => handleArrayUpdate("publications", index, "coAuthors", e.target.value)} />

              <InputField label="DOI / Link" value={pub.doi || ""} onChange={(e) => handleArrayUpdate("publications", index, "doi", e.target.value)} />

<SelectField
  label="Country"
  id={`publicationCountry-${index}`}
  value={pub.country || ""}
  onChange={(e) =>
    handleArrayUpdate(
      "publications",
      index,
      "country",
      e.target.value
    )
  }
  options={countries}
/>            <FileInput
              label="Upload Publication"
              file={pub.url?.name || pub.url}
              fileUrl={pub.url?.url}
              error={pub.fileError}
              disabled={isSubmitted}
              onChange={(e) => {
                const { file, error } = e.target;

                const arr = [...(professional.publications || [])];

                arr[index] = {
                  ...arr[index],
                  docFile: file,
                  url: {
                    name: file?.name,
                    url: ""
                  },
                  fileError: error,
                };

                updateSection("professional", { publications: arr });
              }}
            />
            </div>
          ))}
          <button disabled={isSubmitted} type="button" onClick={() => updateSection("professional", { publications: [...(professional.publications || []), {}] })} className="flex items-center gap-2 text-primary font-medium">
            <Plus size={16} /> Add Journal
          </button>
        </div>
      </FormSection>

      {/* ================= CONFERENCE PRESENTATION ================= */}
      <FormSection title="Conference Presentation" icon={Users}>
        <div className="md:col-span-2 space-y-6">
          {(professional.conferences || []).map((conf, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl grid md:grid-cols-2 gap-4 relative bg-slate-50">
              <button type="button" onClick={() => handleDeleteConference(index)} className="absolute right-0 top-0 text-red-500 p-4">
                <Trash2 size={16} />
              </button>
              <SelectField
                label="Presentation Type"
                disabled={isSubmitted}
                value={conf.presentationType || "Conference Presentation"}
                onChange={(e) => handleArrayUpdate("conferences", index, "presentationType", e.target.value)}
                options={presentationTypes}
              />

              <InputField label="Paper Title" value={conf.paperTitle || conf.title || ""} onChange={(e) => handleArrayUpdate("conferences", index, "paperTitle", e.target.value)} />

              <InputField label="Conference Name" value={conf.conferenceName || conf.name || ""} onChange={(e) => handleArrayUpdate("conferences", index, "conferenceName", e.target.value)} />

              <SelectField
                label="Conference Type"
                disabled={isSubmitted}
                value={conf.conferenceType || ""}
                onChange={(e) => handleArrayUpdate("conferences", index, "conferenceType", e.target.value)}
                options={conferenceTypes}
              />

              <InputField label="Organizer" value={conf.organizer || ""} onChange={(e) => handleArrayUpdate("conferences", index, "organizer", e.target.value)} />

              <InputField label="Venue" value={conf.venue || ""} onChange={(e) => handleArrayUpdate("conferences", index, "venue", e.target.value)} />

<InputField
  label="Date"
  type="text"
  placeholder="DD-MM-YYYY"
  value={conf.date || ""}
  error={conf.dateError || ""}
  onChange={(e) =>
    handleArrayUpdate(
      "conferences",
      index,
      "date",
      e.target.value
    )
  }
  onBlur={() => {
    const value = conf.date || "";

    if (!value) {
      return;
    }

    if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      const arr = [...(professional.conferences || [])];

      arr[index] = {
        ...arr[index],
        dateError: "Enter a complete date (DD-MM-YYYY)",
      };

      updateSection("professional", {
        conferences: arr,
      });
    }
  }}
/>
              <InputField label="ISBN / ISSN" value={conf.isbnIssn || ""} onChange={(e) => handleArrayUpdate("conferences", index, "isbnIssn", e.target.value)} />

              <InputField label="DOI / Link" value={conf.doiLink || ""} onChange={(e) => handleArrayUpdate("conferences", index, "doiLink", e.target.value)} />

              <FileInput
                label="Certificate / Proof / Link"
                file={conf.url?.name || conf.certificateUrl || conf.url}
                fileUrl={conf.url?.url || conf.certificateUrl}
                error={conf.fileError}
                disabled={isSubmitted}
                onChange={(e) => {
                  const { file, error } = e.target;

                  const arr = [...(professional.conferences || [])];

                  arr[index] = {
                    ...arr[index],
                    docFile: file,
                    certificateUrl: file ? "" : (arr[index]?.certificateUrl || (arr[index]?.url && arr[index].url.url) || ""),
                    url: {
                      name: file?.name,
                      url: ""
                    },
                    fileError: error,
                  };

                  updateSection("professional", { conferences: arr });
                }}
              />
            </div>
          ))}
          <button disabled={isSubmitted} type="button" onClick={() => updateSection("professional", { conferences: [...(professional.conferences || []), {}] })} className="flex gap-2 text-primary font-medium">
            <Plus size={16} /> Add Conference
          </button>
        </div>
      </FormSection>

      {/* ================= WORK EXPERIENCE ================= */}
      <FormSection title="Work Experience" icon={Briefcase}>
        <div className="md:col-span-2 space-y-6">
          {(professional.experience || []).map((exp, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl grid md:grid-cols-2 gap-4 relative bg-slate-50">
              <button type="button" onClick={() => handleDeleteExperience(index)} className="absolute right-0 top-0 text-red-500 p-4">
                <Trash2 size={16} />
              </button>
              <InputField label="Company" value={exp.company || ""} onChange={(e) => handleArrayUpdate("experience", index, "company", e.target.value)} />
              <InputField label="Designation" value={exp.designation || ""} onChange={(e) => handleArrayUpdate("experience", index, "designation", e.target.value)} />
<InputField
  label="Year of Experience"
  value={exp.years || ""}
  maxLength={2}
  onChange={(e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 2);

    handleArrayUpdate(
      "experience",
      index,
      "years",
      value
    );
  }}
/>              <FileInput
                label="Experience Certificate"
                file={exp.url?.name || exp.url}
                fileUrl={exp.url?.url}
                error={exp.fileError}
                disabled={isSubmitted}
                onChange={(e) => {
                  const { file, error } = e.target;

                  const arr = [...(professional.experience || [])];

                  arr[index] = {
                    ...arr[index],
                    docFile: file,
                    url: {
                      name: file?.name,
                      url: ""
                    },
                    fileError: error,
                  };

                  updateSection("professional", { experience: arr });
                }}
              />
            </div>
          ))}
          <button disabled={isSubmitted} type="button" onClick={() => updateSection("professional", { experience: [...(professional.experience || []), {}] })} className="flex gap-2 text-primary font-medium">
            <Plus size={16} /> Add Experience
          </button>
        </div>
      </FormSection>

      {/* ================= PATENTS ================= */}
      <FormSection title="Patents" icon={Briefcase}>
        <div className="md:col-span-2 space-y-6">
          {(professional.patents || []).map((pat, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl grid md:grid-cols-2 gap-4 relative bg-slate-50">
              <button type="button" onClick={() => handleDeletePatent(index)} className="absolute right-0 top-0 text-red-500 p-4">
                <Trash2 size={16} />
              </button>
              <InputField label="Patent Title" value={pat.title || ""} onChange={(e) => handleArrayUpdate("patents", index, "title", e.target.value)} />
              <SelectField 
                label="Status" 
                disabled={isSubmitted}
                value={pat.status || ""} 
                onChange={(e) => handleArrayUpdate("patents", index, "status", e.target.value)}
                options={patentStatuses}
              />
              <SelectField
                label="Publication Type"
                disabled={isSubmitted}
                value={pat.publicationType || "Patent"}
                onChange={(e) => handleArrayUpdate("patents", index, "publicationType", e.target.value)}
                options={publicationTypes}
              />

              <InputField label="Patent Number / Title" value={pat.paperTitle || pat.title || ""} onChange={(e) => handleArrayUpdate("patents", index, "paperTitle", e.target.value)} />

              <SelectField
                label="Indexed In"
                disabled={isSubmitted}
                value={pat.indexedIn || ""}
                onChange={(e) => handleArrayUpdate("patents", index, "indexedIn", e.target.value)}
                options={publicationIndexedIn}
              />

              <InputField label="Volume" value={pat.volume || ""} onChange={(e) => handleArrayUpdate("patents", index, "volume", e.target.value)} />

              <InputField label="Issue" value={pat.issue || ""} onChange={(e) => handleArrayUpdate("patents", index, "issue", e.target.value)} />

              <InputField label="Pages" value={pat.pages || ""} onChange={(e) => handleArrayUpdate("patents", index, "pages", e.target.value)} />

              <InputField label="Impact Factor" value={pat.impactFactor || ""} onChange={(e) => handleArrayUpdate("patents", index, "impactFactor", e.target.value)} />

              <InputField label="Co-authors" value={pat.coAuthors || ""} onChange={(e) => handleArrayUpdate("patents", index, "coAuthors", e.target.value)} />

              <InputField label="DOI / Link" value={pat.doi || ""} onChange={(e) => handleArrayUpdate("patents", index, "doi", e.target.value)} />

<SelectField
  label="Country"
  id={`patentCountry-${index}`}
  value={pat.country || ""}
  onChange={(e) =>
    handleArrayUpdate(
      "patents",
      index,
      "country",
      e.target.value
    )
  }
  options={countries}
/>              <FileInput
                label="Upload Patent Document"
                className="md:col-span-2"
                file={pat.document?.name || pat.document}
                fileUrl={pat.document?.url}
                error={pat.fileError}
                disabled={isSubmitted}
                onChange={(e) => {
                  const { file, error } = e.target;

                  const arr = [...(professional.patents || [])];

                  arr[index] = {
                    ...arr[index],
                    docFile: file,
                    document: {
                      name: file?.name,
                      url: ""
                    },
                    fileError: error,
                  };

                  updateSection("professional", { patents: arr });
                }}
              />
            </div>
          ))}
          <button  type="button" disabled={isSubmitted} onClick={() => updateSection("professional", { patents: [...(professional.patents || []), {}] })} className="flex gap-2 text-primary font-medium">
            <Plus size={16} /> Add Patent
          </button>
        </div>
      </FormSection>

      {/* ================= MEMBERSHIP ================= */}
      <FormSection title="Memberships" icon={Users}>
        <div className="md:col-span-2 space-y-4">

          {(professional.membershipUrl || []).map((mem, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50 relative"
            >
              {!isSubmitted && (
                <button
                  type="button"
                 onClick={() => handleDeleteMembership(index)}
                  className="absolute right-4 top-4 text-red-500 rounded-full p-2 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <InputField
                  label="Organization Name"
                  value={mem.organizationName || mem.name || ""}
                  onChange={(e) => {
                    const arr = [...(professional.membershipUrl || [])];
                    arr[index] = { ...arr[index], organizationName: e.target.value };
                    updateSection("professional", { membershipUrl: arr });
                  }}
                  disabled={isSubmitted}
                  className="lg:col-span-2"
                />

               <InputField
  label="Year of Joining"
  value={mem.joiningYear || ""}
  placeholder="YYYY"
  maxLength={4}
  error={validateYear(
    mem.joiningYear,
    "past"
  )}
  onChange={(e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    const arr = [...(professional.membershipUrl || [])];

    arr[index] = {
      ...arr[index],
      joiningYear: value,
    };

    updateSection("professional", {
      membershipUrl: arr,
    });
  }}
  disabled={isSubmitted}
/>
                <SelectField
                  label="Membership Type"
                  value={mem.membershipType || ""}
                  onChange={(e) => {
                    const arr = [...(professional.membershipUrl || [])];
                    arr[index] = { ...arr[index], membershipType: e.target.value };
                    updateSection("professional", { membershipUrl: arr });
                  }}
                  options={membershipTypes}
                  disabled={isSubmitted}
                />

                <InputField
                  label="Membership ID"
                  value={mem.membershipId || ""}
                  onChange={(e) => {
                    const arr = [...(professional.membershipUrl || [])];
                    arr[index] = { ...arr[index], membershipId: e.target.value };
                    updateSection("professional", { membershipUrl: arr });
                  }}
                  disabled={isSubmitted}
                />

                <div className="lg:col-span-3">
                  <FileInput
                    label="Certificate / Proof"
                    file={mem.document?.name || mem.name || mem.document}
                    fileUrl={mem.document?.url || mem.url}
                    error={mem.fileError}
                    disabled={isSubmitted}
                    className="w-full"
                    onChange={(e) => {
                      const { file, error } = e.target;
                      const arr = [...(professional.membershipUrl || [])];
                      arr[index] = {
                        ...arr[index],
                        docFile: file,
                        document: file
                          ? { name: file?.name, url: "" }
                          : arr[index]?.document || { name: arr[index]?.name || "", url: arr[index]?.url || "" },
                        fileError: error,
                      };
                      updateSection("professional", { membershipUrl: arr });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          { !isSubmitted && (
            <button
              type="button"
              disabled={isSubmitted}
              onClick={() => {
                const current = professional.membershipUrl || [];
                updateSection("professional", {
                  membershipUrl: [
                    ...current,
                    {
                      organizationName: "",
                      membershipType: "",
                      membershipId: "",
                      joiningYear: "",
                      document: { name: "", url: "" },
                      docFile: null,
                      fileError: "",
                    },
                  ],
                });
              }}
              className="flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <Plus size={16} />
              Add Another Membership
            </button>
          ) }

        </div>
      </FormSection>

      {/* ================= SKILLS ================= */}
      <FormSection title="Skills & Software" icon={Lightbulb}>
        <div className="md:col-span-2 space-y-3">
          <label className="block text-sm font-medium text-slate-600">Technical & Software Skills</label>
          <input
            type="text"
            disabled={isSubmitted}
            placeholder="Type skill and press Enter..."
            value={skillInput}
            // 🔥 Visual: Force text to look uppercase in input
            onChange={(e) => setSkillInput(e.target.value.toUpperCase())}
            onKeyDown={handleSkillKeyDown}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {currentSkills.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => removeSkill(s)}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-100 bg-blue-50 text-blue-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
              >
                {s} <X size={14} className="text-slate-400 group-hover:text-red-500" />
              </button>
            ))}
          </div>
        </div>
      </FormSection>
    </FormWrapper>
  );
}