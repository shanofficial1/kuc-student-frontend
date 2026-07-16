import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit3,
  FileText,
  FileTextIcon,
  GraduationCap 
} from "lucide-react";
import { useStore } from "../../store";
import { getChangedFields } from "../../lib/utils";

const SERVER = import.meta.env.VITE_SERVER;

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return "Not provided";
  return String(value);
};

const fileNameFromPath = (value) => {
  if (!value) return "";
  return String(value).replace(/\\/g, "/").split("/").pop();
};

const isFileObject = (value) =>
  typeof File !== "undefined" && value instanceof File;

const cleanUrl = (url) => String(url || "").replace(/\\/g, "/");

const absoluteFileUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("blob:") || url.startsWith("http")) return url;
  if (!url.includes("/") && !url.startsWith("uploads")) return "";
  const base = String(SERVER || "").replace(/\/$/, "");
  const path = cleanUrl(url).replace(/^\//, "");
  return base ? `${base}/${path}` : `/${path}`;
};

const getDocumentMeta = (source, fallbackName) => {
  if (!source)
    return {
      name: "",
      href: "",
    };

  if (source instanceof File) {
    return {
      name: source.name,
      href: URL.createObjectURL(source),
    };
  }

  if (typeof source === "string") {
    return {
      name: fileNameFromPath(source),
      href: absoluteFileUrl(source),
    };
  }

  if (typeof source === "object") {
    const url =
      source.url ||
      source.fileUrl ||
      source.path ||
      source.document ||
      "";

    return {
      name:
        source.name ||
        source.fileName ||
        fileNameFromPath(url) ||
        fallbackName,

      href: absoluteFileUrl(url),
    };
  }

  return {
    name: fallbackName,
    href: "",
  };
};


const joinPhone = (phone, fallback) => {
  if (typeof phone === "string") return phone || fallback || "Not provided";
  const countryCode = phone?.countryCode || "";
  const number = phone?.number || "";
  return [countryCode, number].filter(Boolean).join(" ") || fallback || "Not provided";
};

const joinAddress = (address) => {
  if (!address) return "Not provided";
  if (typeof address === "string") return address || "Not provided";

  const parts = [
    address.addressLine,
    address.line1,
    address.city,
    address.district,
    address.state,
    address.pinCode,
    address.pincode,
  ].filter(Boolean);

  return parts.join(", ") || "Not provided";
};

function ReviewInput({
  label,
  value,
  required = false,
  wide = false,
}) {
  const isEmpty =
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty) return null;

  return (
    <div className={wide ? "space-y-2 sm:col-span-2" : "space-y-2"}>
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <div
        className="
          w-full
          min-h-[52px]
          rounded-lg
          border
          border-slate-200
          bg-slate-50
          px-4
          py-3
          text-slate-700
          flex
          items-center
        "
      >
        {formatValue(value)}
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  editPath,
  isSubmitted,
  children,
}) {
  return (
    <section className="rounded-xl bg-white p-6">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-semibold text-slate-800">
          {title}
        </h2>

        {!isSubmitted && editPath && (
          <Link
            to={editPath}
            className="
              rounded-lg
              border
              border-slate-200
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-primary
              hover:bg-primary
              hover:text-white
              transition
            "
          >
            Edit
          </Link>
        )}

      </div>

      <div className="my-6 h-px bg-slate-200" />

      <div className="space-y-8">

        {children}

      </div>

    </section>
  );
}

function SectionDivider() {
  return (
    <div className="h-px w-full bg-slate-200" />
  );
}


function ReviewFile({
  label,
  source,
}) {
  if (!source) return null;

  const meta = getDocumentMeta(source, label);
console.log(meta);

const handleView = () => {
  console.log(source);
  console.log(meta);

  if (!meta.href) {
    alert("File URL not found");
    return;
  }

  window.open(meta.href, "_blank", "noopener,noreferrer");
};

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-600">
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">

        <FileTextIcon
          className="text-slate-500"
          size={20}
        />

        <div className="flex-1 overflow-hidden">

          <p className="truncate text-sm font-medium text-slate-700">
            {meta.name}
          </p>

        </div>

        <button
          type="button"
          onClick={handleView}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition hover:bg-primary-container"
        >
          View File
        </button>

      </div>
    </div>
  );
} 




export default function FinalReviewForm() {
  const store = useStore();
  const isSubmitted = store.isSubmitted;
  const [agreed, setAgreed] = useState(false);

  const academic = store.academic || {};
  const personal = store.personal || {};
  const contact = store.contact || {};
  const family = store.family || {};
  const education = store.education || {};
  const financial = store.financial || {};
  const health = store.health || {};
  const professional = store.professional || {};
  const residential = store.residential || {};
  const documents = store.documents || {};
  const mentor = store.mentor || {};

  const academicRecords = education.education || education.academicRecords || [];
  const competitiveExams = education.competitiveExams || [];
  const publications = professional.publications || [];
  const conferences = professional.conferences || [];
  const experience = professional.experience || [];
  const patents = professional.patents || [];
  const memberships = professional.membershipUrl || [];
  console.log("DOCUMENT",documents);
  
  const snapshot = store.profileSnapshot || {};

  const sectionDiffs = {
    academic: getChangedFields(
      snapshot.academic_details || snapshot.academic || {},
      store.academic || {}
    ),
    personal: getChangedFields(
      snapshot.personal_details || snapshot.personal || {},
      store.personal || {}
    ),
    contact: getChangedFields(
      snapshot.contact_details || snapshot.contact || {},
      store.contact || {}
    ),
    family: getChangedFields(
      snapshot.family_details || snapshot.family || {},
      store.family || {}
    ),
    education: getChangedFields(
      snapshot.education_details || snapshot.education || {},
      store.education || {}
    ),
    financial: getChangedFields(
      snapshot.financial_details || snapshot.financial || {},
      store.financial || {}
    ),
    health: getChangedFields(
      snapshot.health_details || snapshot.health || {},
      store.health || {}
    ),
    professional: getChangedFields(
      snapshot.professional_details || snapshot.professional || {},
      store.professional || {}
    ),
    residential: getChangedFields(
      snapshot.residential_details || snapshot.residential || {},
      store.residential || {}
    ),
    documents: getChangedFields(snapshot.documents || {}, store.documents || {}),
    mentor: getChangedFields(
      snapshot.mentor_details || snapshot.mentor || {},
      store.mentor || {}
    ),
  };

  // ---- Changed-fields-only helpers ----
  const onlyChanged = (diffObj, key) => diffObj?.[key] !== undefined;

  // Updated fields count: count scalar keys in diffs across sections.
  const updatedFieldsCount = Object.entries(sectionDiffs).reduce((sum, [, diff]) => {
    if (!diff || typeof diff !== "object") return sum;
    return sum + Object.keys(diff).filter((k) => !k.endsWith("Error")).length;
  }, 0);

  const removedRecords = store.deletedRecords || {};

  const hasAnyChanges = (sectionKey) => {
    const diff = sectionDiffs[sectionKey] || {};
    return diff && typeof diff === "object" && Object.keys(diff).length > 0;
  };

  const hasAnySectionChanges = (sectionKey) => {
    const diff = sectionDiffs[sectionKey] || {};
    return Object.keys(diff).length > 0;
  };

  const sections = [
    "academic",
    "personal",
    "contact",
    "family",
    "education",
    "financial",
    "health",
    "professional",
    "residential",
    "documents",
    "mentor",
  ];


  const changedSectionCount = sections.reduce((count, section) => {
    const original = store.profileSnapshot?.[section] || {};
    const current = store[section] || {};
    const changes = getChangedFields(original, current);
    return Object.keys(changes).length > 0 ? count + 1 : count;
  }, 0);

  const handleSubmit = async () => {
    if (!agreed) return;

    const state = useStore.getState();
    const snapshot = state.profileSnapshot || {};
    let hasChanges = false;
    const changedSections = {};

    for (const section of sections) {
      const original = snapshot[section] || {};
      const current = state[section] || {};
      const changes = getChangedFields(original, current);

      if (Object.keys(changes).length > 0) {
        hasChanges = true;
        changedSections[section] = changes;
      }
    }

    console.log("Snapshot:", snapshot);
    console.log("Changed Sections:", changedSections);

    if (!hasChanges) {
      alert("No changes detected.");
      return;
    }

await store.submitProfileUpdateRequest({
  updateType: "full_profile",
  changes: changedSections,
});

    window.location.reload();

    alert("Application submitted for verification");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    store.setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    alert(`Changes detected in ${Object.keys(changedSections).length} section(s).`);
  };


  const academicDiff = sectionDiffs.academic || {};

const showAdmission =
  academicDiff.admissionApplicationNumber ||
  academicDiff.universityEnrollmentNumber ||
  academicDiff.rollNumber;

const showFaculty =
  academicDiff.facultySchool ||
  academicDiff.faculty ||
  academicDiff.department ||
  academicDiff.programLevel ||
  academicDiff.degreeName;

const showSpecialization =
  academicDiff.specialization ||
  academicDiff.specializationResearchArea;

const showProgress =
  academicDiff.admissionBatch ||
  academicDiff.academicCycle ||
  academicDiff.currentYear ||
  academicDiff.year ||
  academicDiff.currentSemester ||
  academicDiff.semester;

const showAdmissionInfo =
  academicDiff.modeOfStudy ||
  academicDiff.admissionCategory;

const showFellowship =
  academicDiff.fellowshipLetterNumber ||
  academicDiff.fellowshipLetter;


  
const hasValue = (...values) =>
  values.some((v) => {
    if (v === null || v === undefined) return false;

    if (typeof v === "string")
      return v.trim() !== "";

    if (Array.isArray(v))
      return v.length > 0;

    return true;
  });



  const personalDiff = sectionDiffs.personal || {};

const showBasic =
  personalDiff.fullName ||
  personalDiff.dob ||
  personalDiff.gender ||
  personalDiff.nationality;

const showSocial =
  personalDiff.domicileState ||
  personalDiff.religion ||
  personalDiff.socialCategory ||
  personalDiff.category ||
  personalDiff.caste ||
  personalDiff.motherTongue ||
  personalDiff.languagesKnown;

const showIdentity =
  personalDiff.aadhaarNo ||
  personalDiff.aadhaarNumber ||
  personalDiff.passportNumber ||
  personalDiff.passportNo ||
  personalDiff.passportCountry ||
  personalDiff.passportExpiry ||
  personalDiff.visaType ||
  personalDiff.visaStatus;

const showDocuments =
  personalDiff.birthCertificateDoc ||
  personalDiff.passportDoc ||
  personalDiff.visaDoc;


  
  const contactDiff = sectionDiffs.contact || {};

const showContactInfo =
  contactDiff.personalMobile ||
  contactDiff.mobile ||
  contactDiff.whatsappNumber ||
  contactDiff.whatsapp ||
  contactDiff.personalEmail ||
  contactDiff.email ||
  contactDiff.institutionalEmail ||
  contactDiff.distanceToCampus ||
  contactDiff.distanceFromCampus ||
  contactDiff.isSameAddress;

const showPermanentAddress =
  contactDiff.permanentAddress;

const showCommunicationAddress =
  contactDiff.correspondenceAddress ||
  contactDiff.communicationAddress;

const showEmergency =
  contactDiff.emergencyContact ||
  contactDiff.emergencyName ||
  contactDiff.emergencyRelation ||
  contactDiff.emergencyPhone;



  const familyDiff = sectionDiffs.family || {};

const showFather =
  familyDiff.father?.name ||
  familyDiff.father?.qualification ||
  familyDiff.father?.occupation ||
  familyDiff.father?.annualIncome;

const showMother =
  familyDiff.mother?.name ||
  familyDiff.mother?.qualification ||
  familyDiff.mother?.occupation ||
  familyDiff.mother?.annualIncome;

const showParentInfo =
  familyDiff.annualFamilyIncome ||
  familyDiff.parentContact ||
  familyDiff.parentEmail;

const showGuardian =
  familyDiff.guardian?.name ||
  familyDiff.guardian?.relation ||
  familyDiff.guardian?.contact ||
  familyDiff.guardian?.address ||
  familyDiff.guardianResidentialAddress ||
  familyDiff.guardianOfficeAddress;


const educationDiff = sectionDiffs.education || {};

const showQualifications =
  Array.isArray(educationDiff.educationRecords) &&
  educationDiff.educationRecords.length > 0;

const showAcademicRecords =
  Array.isArray(educationDiff.academicRecords) &&
  educationDiff.academicRecords.length > 0;

const showCompetitiveExams =
  Array.isArray(educationDiff.competitiveExams) &&
  educationDiff.competitiveExams.length > 0;

const showMigration =
  educationDiff.migrationUrl ||
  educationDiff.migrationFile;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-1 py-2 pb-28 sm:px-3 md:py-6">
      <header className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
                Final review
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Review Application
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Confirm your profile information and uploaded documents before final submission.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:min-w-[320px]">
            <div className="rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100">
              <p className="text-[11px] font-bold uppercase text-primary/70">
                Changed Sections
              </p>
              <p className="mt-1 text-2xl font-black text-primary">
                {changedSectionCount}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-[11px] font-bold uppercase text-slate-500">
                Updated Fields
              </p>
              <p className="mt-1 text-lg font-black text-slate-950">
                {updatedFieldsCount}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-[11px] font-bold uppercase text-slate-500">
                Removed Records
              </p>
              <p className="mt-1 text-lg font-black text-slate-950">
                {Object.keys(removedRecords || {}).length}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-[11px] font-bold uppercase text-slate-500">
                Status
              </p>
              <p className="mt-1 text-lg font-black text-slate-950">
                {isSubmitted ? "Locked" : "Editable"}
              </p>
            </div>
          </div>
        </div>
      </header>

  {hasAnySectionChanges("academic") && (
  <ReviewSection
    title="Academic Details"
    editPath="/forms/academic"
    isSubmitted={isSubmitted}
  >

    {/* Admission Details */}
    {showAdmission && (
      <>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Admission Details
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Admission Application Number"
            value={academic.admissionApplicationNumber}
          />

          <ReviewInput
            label="University Enrollment Number"
            value={academic.universityEnrollmentNumber}
          />

          <ReviewInput
            label="Roll Number"
            value={academic.rollNumber}
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Faculty */}
    {showFaculty && (
      <>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Faculty Information
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Faculty / School"
            value={academic.facultySchool || academic.faculty}
          />

          <ReviewInput
            label="Department"
            value={academic.department}
          />

          <ReviewInput
            label="Program Level"
            value={academic.programLevel}
          />

          <ReviewInput
            label="Degree Name"
            value={academic.degreeName}
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Specialization */}
    {showSpecialization && (
      <>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Specialization
        </h3>

        <div className="grid gap-6">

          <ReviewInput
            label="Specialization / Research Area"
            value={
              academic.specializationResearchArea ||
              academic.specialization
            }
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Academic Progress */}
    {showProgress && (
      <>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Academic Progress
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Admission Batch"
            value={academic.admissionBatch}
          />

          <ReviewInput
            label="Academic Cycle"
            value={academic.academicCycle}
          />

          <ReviewInput
            label="Current Year"
            value={academic.currentYear || academic.year}
          />

          <ReviewInput
            label="Current Semester"
            value={academic.currentSemester || academic.semester}
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Admission Information */}
    {showAdmissionInfo && (
      <>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Admission Information
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Mode of Study"
            value={academic.modeOfStudy}
          />

          <ReviewInput
            label="Admission Category"
            value={academic.admissionCategory}
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Fellowship */}
    {showFellowship && (
      <>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Fellowship
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Fellowship Letter Number"
            value={academic.fellowshipLetterNumber}
          />

          <ReviewFile
            label="Fellowship Document"
            source={academic.fellowshipLetter}
            changed={academicDiff.fellowshipLetter}
          />

        </div>
      </>
    )}

  </ReviewSection>
)}
   {hasAnySectionChanges("personal") && (
  <ReviewSection
    title="Personal Details"
    editPath="/forms/personal"
    isSubmitted={isSubmitted}
  >

    {/* Basic Information */}
    {showBasic && (
      <>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Basic Information
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Full Name"
            value={personal.fullName}
          />

          <ReviewInput
            label="Date of Birth"
            value={personal.dob}
          />

          <ReviewInput
            label="Gender"
            value={personal.gender}
          />

          <ReviewInput
            label="Nationality"
            value={personal.nationality}
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Social Information */}
    {showSocial && (
      <>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Social Information
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Domicile State"
            value={personal.domicileState}
          />

          <ReviewInput
            label="Religion"
            value={personal.religion}
          />

          <ReviewInput
            label="Social Category"
            value={personal.socialCategory || personal.category}
          />

          <ReviewInput
            label="Caste"
            value={personal.caste}
          />

          <ReviewInput
            label="Mother Tongue"
            value={personal.motherTongue}
          />

          <ReviewInput
            label="Languages Known"
            value={
              Array.isArray(personal.languagesKnown)
                ? personal.languagesKnown.join(", ")
                : personal.languagesKnown
            }
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Identity */}
    {showIdentity && (
      <>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Identity Details
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Aadhaar Number"
            value={personal.aadhaarNo || personal.aadhaarNumber}
          />

          <ReviewInput
            label="Passport Number"
            value={personal.passportNumber || personal.passportNo}
          />

          <ReviewInput
            label="Passport Country"
            value={personal.passportCountry}
          />

          <ReviewInput
            label="Passport Expiry"
            value={personal.passportExpiry}
          />

          <ReviewInput
            label="Visa Type"
            value={personal.visaType}
          />

          <ReviewInput
            label="Visa Status"
            value={personal.visaStatus}
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Documents */}
    {showDocuments && (
      <>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Documents
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewFile
            label="Date of Birth Proof"
            source={personal.birthCertificateDoc}
            changed={personalDiff.birthCertificateDoc}
          />

          <ReviewFile
            label="Passport Document"
            source={personal.passportDoc}
            changed={personalDiff.passportDoc}
          />

          <ReviewFile
            label="Visa / Permit Document"
            source={personal.visaDoc}
            changed={personalDiff.visaDoc}
          />

        </div>
      </>
    )}

  </ReviewSection>
)}


    {hasAnySectionChanges("contact") && (
  <ReviewSection
    title="Contact Details"
    editPath="/forms/contact"
    isSubmitted={isSubmitted}
  >

    {/* Contact Information */}
    {showContactInfo && (
      <>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Contact Information
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Personal Mobile Number"
            value={joinPhone(contact.personalMobile, contact.mobile)}
          />

          <ReviewInput
            label="WhatsApp Number"
            value={joinPhone(contact.whatsappNumber, contact.whatsapp)}
          />

          <ReviewInput
            label="Personal Email"
            value={contact.personalEmail || contact.email}
          />

          <ReviewInput
            label="Institutional Email"
            value={contact.institutionalEmail}
          />

          <ReviewInput
            label="Distance from Campus"
            value={contact.distanceToCampus || contact.distanceFromCampus}
          />

          <ReviewInput
            label="Same as Permanent Address"
            value={
              contact.isSameAddress === true
                ? "Yes"
                : contact.isSameAddress === false
                ? "No"
                : ""
            }
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Permanent Address */}
    {showPermanentAddress && (
      <>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Permanent Address
        </h3>

        <div className="grid gap-6">

          <ReviewInput
            wide
            label="Permanent Address"
            value={joinAddress(contact.permanentAddress)}
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Communication Address */}
    {showCommunicationAddress && (
      <>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Communication Address
        </h3>

        <div className="grid gap-6">

          <ReviewInput
            wide
            label="Communication Address"
            value={joinAddress(
              contact.correspondenceAddress ||
              contact.communicationAddress
            )}
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Emergency Contact */}
    {showEmergency && (
      <>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Emergency Contact
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Name"
            value={
              contact.emergencyContact?.name ||
              contact.emergencyName
            }
          />

          <ReviewInput
            label="Relation"
            value={
              contact.emergencyContact?.relation ||
              contact.emergencyRelation
            }
          />

          <ReviewInput
            label="Phone Number"
            value={joinPhone(
              contact.emergencyContact?.number,
              contact.emergencyPhone
            )}
          />

        </div>
      </>
    )}

  </ReviewSection>
)}

   {hasAnySectionChanges("family") && (
  <ReviewSection
    title="Family Details"
    editPath="/forms/family"
    isSubmitted={isSubmitted}
  >

    {/* Father Details */}
    {showFather && (
      <>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Father Details
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Father's Name"
            value={family.father?.name}
          />

          <ReviewInput
            label="Qualification"
            value={family.father?.qualification}
          />

          <ReviewInput
            label="Occupation"
            value={family.father?.occupation}
          />

          <ReviewInput
            label="Annual Income"
            value={family.father?.annualIncome}
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Mother Details */}
    {showMother && (
      <>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Mother Details
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Mother's Name"
            value={family.mother?.name}
          />

          <ReviewInput
            label="Qualification"
            value={family.mother?.qualification}
          />

          <ReviewInput
            label="Occupation"
            value={family.mother?.occupation}
          />

          <ReviewInput
            label="Annual Income"
            value={family.mother?.annualIncome}
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Parent Information */}
    {showParentInfo && (
      <>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Parent Information
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Annual Family Income"
            value={family.annualFamilyIncome}
          />

          <ReviewInput
            label="Parent Mobile Number"
            value={joinPhone(family.parentContact)}
          />

          <ReviewInput
            label="Parent Email"
            value={family.parentEmail}
          />

        </div>

        <SectionDivider />
      </>
    )}

    {/* Guardian Details */}
    {showGuardian && (
      <>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Guardian Details
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <ReviewInput
            label="Guardian Name"
            value={family.guardian?.name}
          />

          <ReviewInput
            label="Relationship"
            value={family.guardian?.relation}
          />

          <ReviewInput
            label="Guardian Contact Number"
            value={joinPhone(family.guardian?.contact)}
          />

          <ReviewInput
            wide
            label="Guardian Address"
            value={joinAddress(family.guardian?.address)}
          />

          <ReviewInput
            wide
            label="Guardian Residential Address"
            value={family.guardianResidentialAddress}
          />

          <ReviewInput
            wide
            label="Guardian Office Address"
            value={family.guardianOfficeAddress}
          />

        </div>
      </>
    )}

  </ReviewSection>
)}

      {hasAnySectionChanges("education") &&(
        <ReviewSection
  title="Education Details"
  editPath="/forms/education"
  isSubmitted={isSubmitted}
>

  {/* Qualifications */}

{(showQualifications || showAcademicRecords) && (
  <>
    <h3 className="mb-4 text-lg font-semibold text-slate-800">
      Educational Qualifications
    </h3>

   {(educationDiff.educationRecords || []).map((diff, index) => {

  if (!diff) return null;

  const item = education.educationRecords[index];

  return (
      <div
        key={item._id || index}
        className="rounded-xl border border-slate-200 p-5"
      >

        <h4 className="mb-6 font-semibold text-primary">
          Qualification {index + 1}
        </h4>

        <div className="grid gap-6 md:grid-cols-2">

          {/* your ReviewInputs stay exactly the same */}

        </div>

      </div>
  );  
})}

    <SectionDivider />
  </>
)}

  <SectionDivider />



  {/* Competitive Exams */}

{showCompetitiveExams && (
  <>
    <h3 className="mb-4 text-lg font-semibold text-slate-800">
      Competitive Examinations
    </h3>

    {(education.competitiveExams || []).map((exam, index) => (

      <div
        key={exam._id || index}
        className="rounded-xl border border-slate-200 p-5"
      >

        <h4 className="mb-6 font-semibold text-primary">
          Exam {index + 1}
        </h4>

        <div className="grid gap-6 md:grid-cols-2">

          {/* your ReviewInputs stay exactly the same */}

        </div>

      </div>

    ))}

    <SectionDivider />
  </>
)}
  <SectionDivider />



  {/* Migration */}

{showMigration && (
  <>
    <h3 className="mb-4 text-lg font-semibold text-slate-800">
      Migration Certificate
    </h3>

    <div className="grid gap-6 md:grid-cols-2">

      <ReviewFile
        label="Migration / Transfer Certificate"
        source={education.migrationUrl || education.migrationFile}
        changed={showMigration}
      />

    </div>
  </>
)}
</ReviewSection>
      )}

      {hasAnySectionChanges("financial") && (
<ReviewSection
  title="Financial Details"
  editPath="/forms/financial"
  isSubmitted={isSubmitted}
>

  {/* Scholarship Details */}

  <h3 className="text-lg font-semibold text-slate-800">
    Scholarship Details
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewInput
      label="Scholarship Category"
      value={financial.scholarshipCategory || financial.schType}
    />

    <ReviewInput
      label="Scholarship Unique ID"
      value={financial.scholarshipUniqueID || financial.schId}
    />

  </div>

  <SectionDivider />



  {/* Grant Details */}

  <h3 className="text-lg font-semibold text-slate-800">
    Grant Details
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewInput
      label="Grant Category"
      value={financial.grantCategory || financial.grantType}
    />

    <ReviewInput
      label="Grant Unique ID"
      value={financial.grantUniqueID || financial.grantId}
    />

  </div>

  <SectionDivider />



  {/* Education Loan */}

  <h3 className="text-lg font-semibold text-slate-800">
    Education Loan
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewInput
      label="Bank Name"
      value={
        financial.educationLoan?.bankName ||
        financial.loanBankName
      }
    />

    <ReviewInput
      label="Branch Name"
      value={
        financial.educationLoan?.branchName ||
        financial.loanBranch
      }
    />

    <ReviewInput
      label="Loan Amount"
      value={
        financial.educationLoan?.loanAmount ||
        financial.loanAmount
      }
    />

  </div>

  <SectionDivider />



  {/* Bank Account */}

  <h3 className="text-lg font-semibold text-slate-800">
    Bank Account Details
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewInput
      label="Account Holder Name"
      value={
        financial.accountHolderName ||
        financial.bankAccountHolder
      }
    />

    <ReviewInput
      label="Account Number"
      value={financial.accountNumber}
    />

    <ReviewInput
      label="IFSC Code"
      value={financial.ifscCode}
    />

    <ReviewInput
      label="PAN Number"
      value={
        financial.panCardNumber ||
        financial.panNumber
      }
    />

  </div>

  <SectionDivider />



  {/* Uploaded Documents */}

  <h3 className="text-lg font-semibold text-slate-800">
    Supporting Documents
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewFile
      label="Scholarship Document"
      source={
        financial.scholarshipDocument ||
        financial.scholarshipFile
      }
    />

    <ReviewFile
      label="Grant Document"
      source={
        financial.grantDocument ||
        financial.grantFile
      }
    />

    <ReviewFile
      label="Fee Waiver Document"
      source={financial.feeWaiveUrl}
    />

    <ReviewFile
      label="Grant Waiver Document"
      source={financial.grantWaiveUrl}
    />

  </div>

</ReviewSection>
      )}

      {hasAnySectionChanges("health") && (
        <ReviewSection
  title="Health Details"
  editPath="/forms/health"
  isSubmitted={isSubmitted}
>

  {/* Basic Health Information */}

  <h3 className="text-lg font-semibold text-slate-800">
    Basic Health Information
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewInput
      label="Blood Group"
      value={health.bloodGroup}
    />

    <ReviewInput
      label="Height"
      value={health.physicalDimensions?.height}
    />

    <ReviewInput
      label="Weight"
      value={health.physicalDimensions?.weight}
    />

    <ReviewInput
      label="Vaccination Status"
      value={health.vaccinationStatus}
    />

  </div>

  <SectionDivider />



  {/* Disability Details */}

  <h3 className="text-lg font-semibold text-slate-800">
    Disability Details
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewInput
      label="Physical Disability"
      value={health.disabilityStatus}
    />

    <ReviewInput
      label="Disability Type"
      value={health.disabilityDetails?.disabilityType}
    />

    <ReviewInput
      label="Disability Percentage"
      value={health.disabilityDetails?.percentage}
    />

  </div>

  <SectionDivider />



  {/* Insurance Details */}

  <h3 className="text-lg font-semibold text-slate-800">
    Health Insurance
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewInput
      label="Insurance Provider"
      value={health.insurance?.provider}
    />

    <ReviewInput
      label="Policy Number"
      value={health.insurance?.policyNumber}
    />

  </div>

  <SectionDivider />



  {/* Medical Information */}

  <h3 className="text-lg font-semibold text-slate-800">
    Medical Information
  </h3>

  <div className="grid gap-6">

    <ReviewInput
      wide
      label="Chronic Conditions"
      value={health.chronicConditions}
    />

    <ReviewInput
      wide
      label="Regular Medications"
      value={health.regularMedications}
    />

  </div>

  <SectionDivider />



  {/* Documents */}

  <h3 className="text-lg font-semibold text-slate-800">
    Supporting Documents
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewFile
      label="Disability Certificate"
      source={health.disabilityCertificate}
    />

    <ReviewFile
      label="Vaccination Certificate"
      source={health.vaccinationDoc}
    />

    <ReviewFile
      label="Medical Certificate"
      source={health.medicalCertificate}
    />

    <ReviewFile
      label="Insurance Document"
      source={health.insuranceDocument}
    />

  </div>

</ReviewSection>
      )}

       {hasAnySectionChanges("residential") && (
        <ReviewSection
  title="Residential Details"
  editPath="/forms/residential"
  isSubmitted={isSubmitted}
>

  {/* Residential Information */}

  <h3 className="text-lg font-semibold text-slate-800">
    Residential Information
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewInput
      label="Residential Type"
      value={residential.resType || residential.type}
    />

    <ReviewInput
      label="Hostel Block"
      value={
        residential.hostel?.block ||
        residential.hostelBlock
      }
    />

    <ReviewInput
      label="Room Number"
      value={
        residential.hostel?.roomNo ||
        residential.roomNo
      }
    />

    <ReviewInput
      label="Bed Type"
      value={
        residential.hostel?.bedType ||
        residential.bedType
      }
    />

    <ReviewInput
      label="Mess Preference"
      value={
        residential.mess ||
        residential.messPreference
      }
    />

  </div>

  <SectionDivider />



  {/* Transport Details */}

  <h3 className="text-lg font-semibold text-slate-800">
    Transport Details
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewInput
      label="University Bus Opted"
      value={
        residential.transport?.opted ??
        residential.transportOpted
      }
    />

    <ReviewInput
      label="Bus Route Number"
      value={
        residential.transport?.routeNumber ||
        residential.busRouteId
      }
    />

    <ReviewInput
      label="Boarding Point"
      value={
        residential.transport?.boardingPoint ||
        residential.pickupPoint
      }
    />

    <ReviewInput
      label="Vehicle Registration Number"
      value={residential.vehicleReg}
    />

  </div>

</ReviewSection>
      )}

       {hasAnySectionChanges("documents") && (
        <ReviewSection
  title="Documents"
  editPath="/forms/documents"
  isSubmitted={isSubmitted}
>

  {/* Personal Documents */}

  <h3 className="text-lg font-semibold text-slate-800">
    Personal Documents
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewFile
      label="Passport Size Photograph"
      source={documents.profilePhoto || documents.profilePhotoFile}
    />

    <ReviewFile
      label="Signature"
      source={documents.signature || documents.signatureFile}
    />

    <ReviewFile
      label="Identity Proof"
      source={documents.identityProof || documents.identityProofFile}
    />

  </div>

  <SectionDivider />



  {/* Community & Income */}

  <h3 className="text-lg font-semibold text-slate-800">
    Community & Income Certificates
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewFile
      label="Community / Caste Certificate"
      source={
        documents.legalCertificates?.casteCertificate ||
        documents.casteCertificateFile
      }
    />

    <ReviewFile
      label="Income Certificate"
      source={
        documents.legalCertificates?.incomeCertificate ||
        documents.incomeCertificateFile
      }
    />

    <ReviewFile
      label="Nativity Certificate"
      source={
        documents.legalCertificates?.nativityCertificate ||
        documents.nativityCertificateFile
      }
    />

    <ReviewFile
      label="Non-Creamy Layer Certificate"
      source={
        documents.legalCertificates?.nonCreamyLayerCertificate ||
        documents.nonCreamyLayerCertificateFile
      }
    />

  </div>

  <SectionDivider />



  {/* Other Documents */}

  <h3 className="text-lg font-semibold text-slate-800">
    Other Documents
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewFile
      label="Migration Certificate"
      source={documents.migrationCertificate}
    />

    <ReviewFile
      label="Transfer Certificate"
      source={documents.transferCertificate}
    />

    <ReviewFile
      label="Character Certificate"
      source={documents.characterCertificate}
    />

    <ReviewFile
      label="Medical Certificate"
      source={documents.medicalCertificate}
    />

  </div>

</ReviewSection>
      )}

       {hasAnySectionChanges("professional") && (
        <ReviewSection
  title="Professional Details"
  editPath="/forms/professional"
  isSubmitted={isSubmitted}
>

  {/* Technical Skills */}

  <h3 className="text-lg font-semibold text-slate-800">
    Technical Skills
  </h3>

  <div className="grid gap-6">

    <ReviewInput
      wide
      label="Technical Skills"
      value={professional.technicalSkills || professional.skills}
    />

  </div>

  <SectionDivider />



  {/* Work Experience */}

  <h3 className="text-lg font-semibold text-slate-800">
    Work Experience
  </h3>

  {(professional.experience || []).map((exp, index) => (

    <div
      key={exp._id || index}
      className="rounded-xl border border-slate-200 p-5"
    >

      <h4 className="mb-5 font-semibold text-primary">
        Experience {index + 1}
      </h4>

      <div className="grid gap-6 md:grid-cols-2">

        <ReviewInput
          label="Organization"
          value={exp.organization}
        />

        <ReviewInput
          label="Designation"
          value={exp.designation}
        />

        <ReviewInput
          label="From Date"
          value={exp.fromDate}
        />

        <ReviewInput
          label="To Date"
          value={exp.toDate}
        />

        <ReviewInput
          wide
          label="Responsibilities"
          value={exp.responsibilities}
        />

      </div>

    </div>

  ))}

  <SectionDivider />



  {/* Publications */}

  <h3 className="text-lg font-semibold text-slate-800">
    Publications
  </h3>

  {(professional.publications || []).map((pub, index) => (

    <div
      key={pub._id || index}
      className="rounded-xl border border-slate-200 p-5"
    >

      <h4 className="mb-5 font-semibold text-primary">
        Publication {index + 1}
      </h4>

      <div className="grid gap-6 md:grid-cols-2">

        <ReviewInput
          label="Title"
          value={pub.title}
        />

        <ReviewInput
          label="Journal"
          value={pub.journal}
        />

        <ReviewInput
          label="Indexed In"
          value={pub.indexedIn}
        />

        <ReviewInput
          label="Year"
          value={pub.year}
        />

        <ReviewFile
          label="Publication Document"
          source={pub.document}
        />

      </div>

    </div>

  ))}

  <SectionDivider />



  {/* Conferences */}

  <h3 className="text-lg font-semibold text-slate-800">
    Conferences
  </h3>

  {(professional.conferences || []).map((conf, index) => (

    <div
      key={conf._id || index}
      className="rounded-xl border border-slate-200 p-5"
    >

      <h4 className="mb-5 font-semibold text-primary">
        Conference {index + 1}
      </h4>

      <div className="grid gap-6 md:grid-cols-2">

        <ReviewInput
          label="Conference Name"
          value={conf.name}
        />

        <ReviewInput
          label="Presentation Type"
          value={conf.presentationType}
        />

        <ReviewInput
          label="Venue"
          value={conf.venue}
        />

        <ReviewInput
          label="Year"
          value={conf.year}
        />

        <ReviewFile
          label="Conference Certificate"
          source={conf.document}
        />

      </div>

    </div>

  ))}

  <SectionDivider />



  {/* Patents */}

  <h3 className="text-lg font-semibold text-slate-800">
    Patents
  </h3>

  {(professional.patents || []).map((patent, index) => (

    <div
      key={patent._id || index}
      className="rounded-xl border border-slate-200 p-5"
    >

      <h4 className="mb-5 font-semibold text-primary">
        Patent {index + 1}
      </h4>

      <div className="grid gap-6 md:grid-cols-2">

        <ReviewInput
          label="Patent Title"
          value={patent.title}
        />

        <ReviewInput
          label="Patent Number"
          value={patent.number}
        />

        <ReviewInput
          label="Status"
          value={patent.status}
        />

        <ReviewFile
          label="Patent Document"
          source={patent.document}
        />

      </div>

    </div>

  ))}

  <SectionDivider />



  {/* Membership */}

  <h3 className="text-lg font-semibold text-slate-800">
    Professional Membership
  </h3>

  {(professional.membershipUrl || []).map((member, index) => (

    <div
      key={member._id || index}
      className="rounded-xl border border-slate-200 p-5"
    >

      <h4 className="mb-5 font-semibold text-primary">
        Membership {index + 1}
      </h4>

      <div className="grid gap-6 md:grid-cols-2">

        <ReviewInput
          label="Organization"
          value={member.organization}
        />

        <ReviewInput
          label="Membership Type"
          value={member.membershipType}
        />

        <ReviewInput
          label="Membership ID"
          value={member.membershipId}
        />

        <ReviewFile
          label="Membership Document"
          source={member.document}
        />

      </div>

    </div>

  ))}

</ReviewSection>
      )}

       {hasAnySectionChanges("mentor") && (
        <ReviewSection
  title="Mentor Details"
  editPath="/forms/mentor"
  isSubmitted={isSubmitted}
>

  {/* Tutor Details */}

  <h3 className="text-lg font-semibold text-slate-800">
    Tutor Details
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewInput
      label="Tutor Name"
      value={mentor.tutorName}
    />

    <ReviewInput
      label="Tutor Email"
      value={mentor.tutorEmail}
    />

    <ReviewInput
      label="Tutor Mobile Number"
      value={mentor.tutorPhone}
    />

    <ReviewInput
      label="Department"
      value={mentor.tutorDepartment}
    />

  </div>

  <SectionDivider />



  {/* Head of Department */}

  <h3 className="text-lg font-semibold text-slate-800">
    Head of Department
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <ReviewInput
      label="HOD Name"
      value={mentor.hodName}
    />

    <ReviewInput
      label="HOD Email"
      value={mentor.hodEmail}
    />

    <ReviewInput
      label="HOD Mobile Number"
      value={mentor.hodPhone}
    />

    <ReviewInput
      label="Department"
      value={mentor.hodDepartment}
    />

  </div>

</ReviewSection>
      )}

   

 
   

   <ReviewSection
  title="Final Confirmation"
  isSubmitted={isSubmitted}
>

  <div className="space-y-6">

    <p className="text-sm text-slate-600 leading-7">
      Please verify all the information provided above before submitting
      your application. Once submitted, your profile will be sent for
      verification and further modifications may require administrative
      approval.
    </p>

    <label className="flex items-start gap-3">

      <input
        type="checkbox"
        checked={agreed}
        disabled={isSubmitted}
        onChange={(e) => setAgreed(e.target.checked)}
        className="mt-1 h-5 w-5 accent-primary"
      />

      <span className="text-sm text-slate-700 leading-6">
        I hereby declare that all the information provided is true and
        correct to the best of my knowledge. I understand that providing
        false information may result in rejection or cancellation of my
        application.
      </span>

    </label>

    <div className="flex justify-end">

      <button
        type="button"
        disabled={!agreed || isSubmitted}
        onClick={handleSubmit}
        className={`rounded-lg px-8 py-3 font-medium transition ${
          agreed && !isSubmitted
            ? "bg-primary text-white hover:bg-primary-container"
            : "cursor-not-allowed bg-slate-200 text-slate-500"
        }`}
      >
        {isSubmitted
          ? "Application Submitted"
          : "Submit Application"}
      </button>

    </div>

  </div>

</ReviewSection>
    </div>
  );
}
