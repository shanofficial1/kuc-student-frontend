import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  CheckCircle2,
  CreditCard,
  Edit3,
  Eye,
  FileIcon,
  FileText,
  FileTextIcon,
  GraduationCap,
  HeartPulse,
  Home,
  ImageIcon,
  MapPin,
  Phone,
  School,
  ShieldCheck,
  User,
  UserCheck,
  Users2,
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
  if (!source) {
    return { name: "", href: "" };
  }

  if (isFileObject(source)) {
    return {
      name: source.name || fallbackName,
      href: URL.createObjectURL(source),
    };
  }

  if (typeof source === "string") {
    return {
      name: fileNameFromPath(source) || fallbackName,
      href: absoluteFileUrl(source),
    };
  }

  if (typeof source === "object") {
    if (source.document) {
      const nested = getDocumentMeta(source.document, fallbackName);
      return {
        name: nested.name || source.name || source.fileName || fallbackName,
        href: nested.href || absoluteFileUrl(source.url || source.fileUrl),
      };
    }

    if (source.file) {
      const nested = getDocumentMeta(source.file, fallbackName);
      return {
        name: nested.name || source.name || source.fileName || fallbackName,
        href: nested.href || absoluteFileUrl(source.url || source.fileUrl),
      };
    }

    return {
      name:
        source.name ||
        source.fileName ||
        fileNameFromPath(source.url || source.fileUrl) ||
        fallbackName,
      href: absoluteFileUrl(source.url || source.fileUrl),
    };
  }

  return { name: fallbackName, href: "" };
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

function InfoField({ label, value, wide }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-2 min-h-12 rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-800">
        {formatValue(value)}
      </div>
    </div>
  );
}

function ReviewSection({ title, description, icon: Icon, editPath, isSubmitted, children }) {
  return (
    <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            {description && (
              <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
            )}
          </div>
        </div>

        {!isSubmitted && editPath && (
          <Link
            to={editPath}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-primary shadow-sm ring-1 ring-slate-200 transition hover:bg-primary hover:text-white"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Section
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}

function DocumentCard({ title, source, fallbackName }) {
  const meta = getDocumentMeta(source, fallbackName || title);
  const ext = (meta.name || "").split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "webp"].includes(ext);
  const Icon = isImage ? ImageIcon : ext === "pdf" ? FileTextIcon : FileIcon;
  const fileName = meta.name || "Not uploaded";

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-black text-slate-900">{title}</h3>
          <p className="mt-1 truncate text-sm font-semibold text-slate-500">
            {fileName}
          </p>
        </div>
      </div>

      {meta.href ? (
        <button
          type="button"
          onClick={() => window.open(meta.href, "_blank", "noopener,noreferrer")}
          className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-container"
        >
          <Eye className="h-4 w-4" />
          View Document
        </button>
      ) : (
        <button
          type="button"
          disabled
          className="mt-4 inline-flex min-h-10 w-full cursor-not-allowed items-center justify-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-400"
        >
          No Preview Available
        </button>
      )}
    </div>
  );
}

function RecordCard({ title, children }) {
  return (
    <article className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
      <h3 className="mb-4 text-sm font-black text-slate-900">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </article>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-lg bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-500 ring-1 ring-slate-200">
      {text}
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

      {hasAnySectionChanges("personal") && (
        <ReviewSection
          title="Personal Information"
          description="Identity, demographics, and personal documents."
          icon={User}
          editPath="/forms/personal"
          isSubmitted={isSubmitted}
        >
          <div className="space-y-4">
            {sectionDiffs.personal.fullName && (
              <InfoField label="Full Name" value={personal.fullName} />
            )}
            {sectionDiffs.personal.dob && (
              <InfoField label="Date of Birth" value={personal.dob} />
            )}
            {sectionDiffs.personal.gender && (
              <InfoField label="Gender" value={personal.gender} />
            )}
            {sectionDiffs.personal.nationality && (
              <InfoField label="Nationality" value={personal.nationality} />
            )}
            {sectionDiffs.personal.domicileState && (
              <InfoField label="Domicile State" value={personal.domicileState} />
            )}
            {sectionDiffs.personal.religion && (
              <InfoField label="Religion" value={personal.religion} />
            )}
            {(sectionDiffs.personal.socialCategory || sectionDiffs.personal.category) && (
              <InfoField
                label="Social Category"
                value={personal.socialCategory || personal.category}
              />
            )}
            {sectionDiffs.personal.caste && (
              <InfoField label="Caste" value={personal.caste} />
            )}
            {(sectionDiffs.personal.aadhaarNo || sectionDiffs.personal.aadhaarNumber) && (
              <InfoField
                label="Aadhaar Number"
                value={personal.aadhaarNo || personal.aadhaarNumber}
              />
            )}
            {(sectionDiffs.personal.passportNumber || sectionDiffs.personal.passportNo) && (
              <InfoField
                label="Passport Number"
                value={personal.passportNumber || personal.passportNo}
              />
            )}
            {sectionDiffs.personal.passportCountry && (
              <InfoField label="Passport Country" value={personal.passportCountry} />
            )}
            {sectionDiffs.personal.passportExpiry && (
              <InfoField label="Passport Expiry" value={personal.passportExpiry} />
            )}
          </div>

          <div className="mt-4 space-y-4">
            {sectionDiffs.personal.birthCertificateDoc && (
              <DocumentCard
                title="Date of Birth Proof"
                source={personal.birthCertificateDoc}
                fallbackName="Date of Birth Proof"
              />
            )}
            {sectionDiffs.personal.passportDoc && (
              <DocumentCard
                title="Passport Document"
                source={personal.passportDoc}
                fallbackName="Passport Document"
              />
            )}
            {sectionDiffs.personal.visaDoc && (
              <DocumentCard
                title="Visa / Permit Document"
                source={personal.visaDoc}
                fallbackName="Visa Permit Document"
              />
            )}
          </div>
        </ReviewSection>
      )}


      {hasAnyChanges("academic") && (
        <ReviewSection
          title="Academic Information"
          description="Enrollment, programme, and fellowship details."
          icon={School}
          editPath="/forms/academic"
          isSubmitted={isSubmitted}
        >
          <div className="space-y-4">
            {sectionDiffs.academic.admissionApplicationNumber && (
              <InfoField
                label="Admission Application Number"
                value={academic.admissionApplicationNumber}
              />
            )}
            {sectionDiffs.academic.universityEnrollmentNumber && (
              <InfoField
                label="University Enrollment Number"
                value={academic.universityEnrollmentNumber}
              />
            )}
            {sectionDiffs.academic.rollNumber && (
              <InfoField label="Roll Number" value={academic.rollNumber} />
            )}
            {(sectionDiffs.academic.facultySchool || sectionDiffs.academic.faculty) && (
              <InfoField
                label="Faculty / School"
                value={academic.facultySchool || academic.faculty}
              />
            )}
            {sectionDiffs.academic.department && (
              <InfoField label="Department" value={academic.department} />
            )}
            {sectionDiffs.academic.programLevel && (
              <InfoField label="Program Level" value={academic.programLevel} />
            )}
            {sectionDiffs.academic.degreeName && (
              <InfoField label="Degree Name" value={academic.degreeName} />
            )}
            {(sectionDiffs.academic.specializationResearchArea || sectionDiffs.academic.specialization) && (
              <InfoField
                label="Specialization / Research Area"
                value={academic.specializationResearchArea || academic.specialization}
              />
            )}
            {sectionDiffs.academic.researchSupervisor && (
              <InfoField
                label="Research Supervisor"
                value={academic.researchSupervisor}
              />
            )}
            {sectionDiffs.academic.admissionBatch && (
              <InfoField label="Admission Batch" value={academic.admissionBatch} />
            )}
            {(sectionDiffs.academic.currentYear || sectionDiffs.academic.year) && (
              <InfoField
                label="Current Year"
                value={academic.currentYear || academic.year}
              />
            )}
            {(sectionDiffs.academic.currentSemester || sectionDiffs.academic.semester) && (
              <InfoField
                label="Current Semester"
                value={academic.currentSemester || academic.semester}
              />
            )}
            {sectionDiffs.academic.modeOfStudy && (
              <InfoField label="Mode of Study" value={academic.modeOfStudy} />
            )}
            {sectionDiffs.academic.admissionCategory && (
              <InfoField
                label="Admission Category"
                value={academic.admissionCategory}
              />
            )}
            {sectionDiffs.academic.fellowshipLetterNumber && (
              <InfoField
                label="Fellowship Letter Number"
                value={academic.fellowshipLetterNumber}
              />
            )}
          </div>

          <div className="mt-4 space-y-4">
            {sectionDiffs.academic.fellowshipLetter && (
              <DocumentCard
                title="Fellowship Letter"
                source={academic.fellowshipLetter}
                fallbackName="Fellowship Letter"
              />
            )}
          </div>
        </ReviewSection>
      )}


      {hasAnySectionChanges("contact") && (
        <ReviewSection
          title="Contact & Address Information"
          description="Phone, email, address, and emergency contact details."
          icon={Phone}
          editPath="/forms/contact"
          isSubmitted={isSubmitted}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {sectionDiffs.contact.personalMobile && (
              <InfoField
                label="Personal Mobile"
                value={joinPhone(contact.personalMobile, contact.mobile)}
              />
            )}
            {sectionDiffs.contact.whatsappNumber && (
              <InfoField
                label="WhatsApp Number"
                value={joinPhone(contact.whatsappNumber, contact.whatsapp)}
              />
            )}
            {sectionDiffs.contact.personalEmail && (
              <InfoField
                label="Personal Email"
                value={contact.personalEmail || contact.email}
              />
            )}
            {sectionDiffs.contact.institutionalEmail && (
              <InfoField
                label="Institutional Email"
                value={contact.institutionalEmail}
              />
            )}
            {(sectionDiffs.contact.distanceToCampus ||
              sectionDiffs.contact.distanceFromCampus) && (
              <InfoField
                label="Distance from Campus"
                value={
                  contact.distanceToCampus ||
                  contact.distanceFromCampus
                }
              />
            )}
            {sectionDiffs.contact.isSameAddress !== undefined && (
              <InfoField
                label="Same Address"
                value={contact.isSameAddress}
              />
            )}
            {sectionDiffs.contact.permanentAddress && (
              <InfoField
                label="Permanent Address"
                value={joinAddress(contact.permanentAddress)}
                wide
              />
            )}
            {sectionDiffs.contact.correspondenceAddress && (
              <InfoField
                label="Communication Address"
                value={joinAddress(
                  contact.correspondenceAddress ||
                    contact.communicationAddress
                )}
                wide
              />
            )}
            {sectionDiffs.contact.communicationAddress && (
              <InfoField
                label="Communication Address"
                value={joinAddress(
                  contact.correspondenceAddress ||
                    contact.communicationAddress
                )}
                wide
              />
            )}
          </div>

          {(sectionDiffs.contact.emergencyName ||
            sectionDiffs.contact.emergencyRelation ||
            sectionDiffs.contact.emergencyPhone ||
            sectionDiffs.contact.emergencyContact) && (
            <div className="mt-4 rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="mb-4 flex items-center gap-2 text-slate-700">
                <MapPin className="h-4 w-4" />
                <h3 className="font-black">Emergency Contact</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {(sectionDiffs.contact.emergencyName ||
                  sectionDiffs.contact.emergencyContact?.name) && (
                  <InfoField
                    label="Name"
                    value={
                      contact.emergencyContact?.name ||
                      contact.emergencyName
                    }
                  />
                )}

                {(sectionDiffs.contact.emergencyRelation ||
                  sectionDiffs.contact.emergencyContact?.relation) && (
                  <InfoField
                    label="Relation"
                    value={
                      contact.emergencyContact?.relation ||
                      contact.emergencyRelation
                    }
                  />
                )}

                {(sectionDiffs.contact.emergencyPhone ||
                  sectionDiffs.contact.emergencyContact?.number) && (
                  <InfoField
                    label="Phone"
                    value={joinPhone(
                      contact.emergencyContact?.number,
                      contact.emergencyPhone
                    )}
                  />
                )}
              </div>
            </div>
          )}
        </ReviewSection>
      )}


      {(() => {
        const familyDiff = sectionDiffs.family || {};
        if (!hasAnyChanges("family")) return null;

        return (
          <ReviewSection
            title="Family & Guardian Details"
            description="Parent, guardian, and family finance information."
            icon={Users2}
            editPath="/forms/family"
            isSubmitted={isSubmitted}
          >
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {familyDiff?.father?.name && (
                  <RecordCard title="Father Details">
                    <InfoField label="Name" value={family.father?.name} />
                  </RecordCard>
                )}
                {familyDiff?.father?.qualification && (
                  <RecordCard title="Father Details">
                    <InfoField
                      label="Qualification"
                      value={family.father?.qualification}
                    />
                  </RecordCard>
                )}
                {familyDiff?.father?.occupation && (
                  <RecordCard title="Father Details">
                    <InfoField
                      label="Occupation"
                      value={family.father?.occupation}
                    />
                  </RecordCard>
                )}

                {familyDiff?.mother?.name && (
                  <RecordCard title="Mother Details">
                    <InfoField label="Name" value={family.mother?.name} />
                  </RecordCard>
                )}
                {familyDiff?.mother?.qualification && (
                  <RecordCard title="Mother Details">
                    <InfoField
                      label="Qualification"
                      value={family.mother?.qualification}
                    />
                  </RecordCard>
                )}
                {familyDiff?.mother?.occupation && (
                  <RecordCard title="Mother Details">
                    <InfoField
                      label="Occupation"
                      value={family.mother?.occupation}
                    />
                  </RecordCard>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {familyDiff?.annualFamilyIncome && (
                  <InfoField
                    label="Annual Family Income"
                    value={family.annualFamilyIncome}
                  />
                )}

                {familyDiff?.parentContact && (
                  <InfoField
                    label="Parent Phone"
                    value={joinPhone(family.parentContact)}
                  />
                )}

                {familyDiff?.parentEmail && (
                  <InfoField label="Parent Email" value={family.parentEmail} />
                )}

                {familyDiff?.guardian?.name && (
                  <InfoField
                    label="Guardian Name"
                    value={family.guardian?.name}
                  />
                )}

                {familyDiff?.guardian?.relation && (
                  <InfoField
                    label="Guardian Relation"
                    value={family.guardian?.relation}
                  />
                )}

                {familyDiff?.guardian?.contact && (
                  <InfoField
                    label="Guardian Phone"
                    value={joinPhone(family.guardian?.contact)}
                  />
                )}

                {familyDiff?.guardian?.address && (
                  <InfoField
                    label="Guardian Address"
                    value={joinAddress(family.guardian?.address)}
                    wide
                  />
                )}

                {familyDiff?.guardianResidentialAddress && (
                  <InfoField
                    label="Guardian Residential Address"
                    value={family.guardianResidentialAddress}
                    wide
                  />
                )}

                {familyDiff?.guardianOfficeAddress && (
                  <InfoField
                    label="Guardian Office Address"
                    value={family.guardianOfficeAddress}
                    wide
                  />
                )}
              </div>
            </div>
          </ReviewSection>
        );
      })()}


      {hasAnyChanges("education") && (
        <ReviewSection
          title="Education History"
          description="Academic qualifications, competitive exams, and migration documents."
          icon={GraduationCap}
          editPath="/forms/education"
          isSubmitted={isSubmitted}
        >
          <div className="space-y-4">
            {Array.isArray(sectionDiffs.education?.academicRecords) &&
              sectionDiffs.education.academicRecords.map((recordDiff, index) => {
                if (!recordDiff) return null;
                return (
                  <RecordCard
                    key={`education-diff-${index}`}
                    title={`Qualification ${index + 1}`}
                  >
                    {recordDiff.qualType !== undefined && (
                      <InfoField
                        label="Qualification Level"
                        value={education.academicRecords?.[index]?.qualType}
                      />
                    )}
                    {recordDiff.qualificationLevel !== undefined && (
                      <InfoField
                        label="Qualification Level"
                        value={education.academicRecords?.[index]?.qualificationLevel}
                      />
                    )}
                    {recordDiff.institution !== undefined && (
                      <InfoField
                        label="Institution / University"
                        value={education.academicRecords?.[index]?.institution}
                      />
                    )}
                    {recordDiff.institutionUniversityName !== undefined && (
                      <InfoField
                        label="Institution / University"
                        value={
                          education.academicRecords?.[index]
                            ?.institutionUniversityName
                        }
                      />
                    )}
                    {recordDiff.passYear !== undefined && (
                      <InfoField
                        label="Year of Passing"
                        value={education.academicRecords?.[index]?.passYear}
                      />
                    )}
                    {recordDiff.yearOfPassing !== undefined && (
                      <InfoField
                        label="Year of Passing"
                        value={education.academicRecords?.[index]?.yearOfPassing}
                      />
                    )}
                    {recordDiff.percentage !== undefined && (
                      <InfoField
                        label="Percentage / CGPA"
                        value={education.academicRecords?.[index]?.percentage}
                      />
                    )}
                    {recordDiff.percentageCGPA !== undefined && (
                      <InfoField
                        label="Percentage / CGPA"
                        value={education.academicRecords?.[index]?.percentageCGPA}
                      />
                    )}
                    {recordDiff.board !== undefined && (
                      <InfoField
                        label="Board / University"
                        value={education.academicRecords?.[index]?.board}
                      />
                    )}
                    {recordDiff.boardUniversity !== undefined && (
                      <InfoField
                        label="Board / University"
                        value={education.academicRecords?.[index]?.boardUniversity}
                      />
                    )}
                    {recordDiff.specialization !== undefined && (
                      <InfoField
                        label="Specialization / Subject"
                        value={education.academicRecords?.[index]?.specialization}
                      />
                    )}
                    {recordDiff.specializationSubject !== undefined && (
                      <InfoField
                        label="Specialization / Subject"
                        value={
                          education.academicRecords?.[index]
                            ?.specializationSubject
                        }
                      />
                    )}
                    {recordDiff.documentUrl !== undefined ||
                      recordDiff.docFile !== undefined ? (
                      <div className="sm:col-span-2">
                        <DocumentCard
                          title="Qualification Document"
                          source={
                            education.academicRecords?.[index]?.documentUrl ||
                            education.academicRecords?.[index]?.docFile
                          }
                          fallbackName="Qualification Document"
                        />
                      </div>
                    ) : null}
                  </RecordCard>
                );
              })}

            {Array.isArray(sectionDiffs.education?.educationRecords) &&
              sectionDiffs.education.educationRecords.map((recordDiff, index) => {
                if (!recordDiff) return null;
                return (
                  <RecordCard
                    key={`education-edu-diff-${index}`}
                    title={`Qualification ${index + 1}`}
                  >
                    {recordDiff.qualType !== undefined && (
                      <InfoField
                        label="Qualification Level"
                        value={education.educationRecords?.[index]?.qualType}
                      />
                    )}
                    {recordDiff.qualificationLevel !== undefined && (
                      <InfoField
                        label="Qualification Level"
                        value={
                          education.educationRecords?.[index]?.qualificationLevel
                        }
                      />
                    )}
                    {recordDiff.institution !== undefined && (
                      <InfoField
                        label="Institution / University"
                        value={education.educationRecords?.[index]?.institution}
                      />
                    )}
                    {recordDiff.institutionUniversityName !== undefined && (
                      <InfoField
                        label="Institution / University"
                        value={
                          education.educationRecords?.[index]
                            ?.institutionUniversityName
                        }
                      />
                    )}
                    {recordDiff.passYear !== undefined && (
                      <InfoField
                        label="Year of Passing"
                        value={education.educationRecords?.[index]?.passYear}
                      />
                    )}
                    {recordDiff.yearOfPassing !== undefined && (
                      <InfoField
                        label="Year of Passing"
                        value={
                          education.educationRecords?.[index]?.yearOfPassing
                        }
                      />
                    )}
                    {recordDiff.percentage !== undefined && (
                      <InfoField
                        label="Percentage / CGPA"
                        value={education.educationRecords?.[index]?.percentage}
                      />
                    )}
                    {recordDiff.percentageCGPA !== undefined && (
                      <InfoField
                        label="Percentage / CGPA"
                        value={
                          education.educationRecords?.[index]?.percentageCGPA
                        }
                      />
                    )}
                    {recordDiff.board !== undefined && (
                      <InfoField
                        label="Board / University"
                        value={education.educationRecords?.[index]?.board}
                      />
                    )}
                    {recordDiff.boardUniversity !== undefined && (
                      <InfoField
                        label="Board / University"
                        value={
                          education.educationRecords?.[index]?.boardUniversity
                        }
                      />
                    )}
                    {recordDiff.specialization !== undefined && (
                      <InfoField
                        label="Specialization / Subject"
                        value={education.educationRecords?.[index]?.specialization}
                      />
                    )}
                    {recordDiff.specializationSubject !== undefined && (
                      <InfoField
                        label="Specialization / Subject"
                        value={
                          education.educationRecords?.[index]
                            ?.specializationSubject
                        }
                      />
                    )}
                    {recordDiff.documentUrl !== undefined ||
                      recordDiff.docFile !== undefined ? (
                      <div className="sm:col-span-2">
                        <DocumentCard
                          title="Qualification Document"
                          source={
                            education.educationRecords?.[index]?.documentUrl ||
                            education.educationRecords?.[index]?.docFile
                          }
                          fallbackName="Qualification Document"
                        />
                      </div>
                    ) : null}
                  </RecordCard>
                );
              })}

            {Array.isArray(sectionDiffs.education?.competitiveExams) &&
              sectionDiffs.education.competitiveExams.map((examDiff, index) => {
                if (!examDiff) return null;
                return (
                  <RecordCard
                    key={`exam-diff-${index}`}
                    title={`Competitive Exam ${index + 1}`}
                  >
                    {examDiff.examName !== undefined && (
                      <InfoField
                        label="Exam Name"
                        value={education.competitiveExams?.[index]?.examName}
                      />
                    )}
                    {examDiff.name !== undefined && (
                      <InfoField
                        label="Exam Name"
                        value={education.competitiveExams?.[index]?.name}
                      />
                    )}
                    {examDiff.score !== undefined && (
                      <InfoField
                        label="Score"
                        value={education.competitiveExams?.[index]?.score}
                      />
                    )}
                    {examDiff.year !== undefined && (
                      <InfoField
                        label="Year"
                        value={education.competitiveExams?.[index]?.year}
                      />
                    )}
                    {examDiff.documentUrl !== undefined ||
                      examDiff.docFile !== undefined ? (
                      <div className="sm:col-span-2">
                        <DocumentCard
                          title="Exam Score Document"
                          source={
                            education.competitiveExams?.[index]?.documentUrl ||
                            education.competitiveExams?.[index]?.docFile
                          }
                          fallbackName="Exam Score Document"
                        />
                      </div>
                    ) : null}
                  </RecordCard>
                );
              })}
          </div>

          {(sectionDiffs.education?.migrationUrl ||
            sectionDiffs.education?.migrationFile) && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DocumentCard
                title="Migration / Transfer Certificate"
                source={education.migrationUrl || education.migrationFile}
                fallbackName="Migration Certificate"
              />
            </div>
          )}
        </ReviewSection>
      )}


      {hasAnyChanges("financial") && (
        <ReviewSection
          title="Financial Information"
          description="Scholarship, grant, bank, PAN, and loan details."
          icon={CreditCard}
          editPath="/forms/financial"
          isSubmitted={isSubmitted}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {sectionDiffs.financial?.schType && (
              <InfoField
                label="Scholarship Category"
                value={financial.schType}
              />
            )}
            {sectionDiffs.financial?.scholarshipCategory && (
              <InfoField
                label="Scholarship Category"
                value={financial.scholarshipCategory}
              />
            )}

            {sectionDiffs.financial?.schId && (
              <InfoField
                label="Scholarship Unique ID"
                value={financial.schId}
              />
            )}
            {sectionDiffs.financial?.scholarshipUniqueID && (
              <InfoField
                label="Scholarship Unique ID"
                value={financial.scholarshipUniqueID}
              />
            )}

            {sectionDiffs.financial?.grantType && (
              <InfoField label="Grant Category" value={financial.grantType} />
            )}
            {sectionDiffs.financial?.grantCategory && (
              <InfoField
                label="Grant Category"
                value={financial.grantCategory}
              />
            )}

            {sectionDiffs.financial?.grantId && (
              <InfoField label="Grant Unique ID" value={financial.grantId} />
            )}
            {sectionDiffs.financial?.grantUniqueID && (
              <InfoField
                label="Grant Unique ID"
                value={financial.grantUniqueID}
              />
            )}

            {sectionDiffs.financial?.educationLoan?.bankName && (
              <InfoField
                label="Bank Name"
                value={financial.educationLoan?.bankName}
              />
            )}
            {sectionDiffs.financial?.loanBankName && (
              <InfoField
                label="Bank Name"
                value={financial.loanBankName}
              />
            )}

            {sectionDiffs.financial?.educationLoan?.loanAmount && (
              <InfoField
                label="Loan Amount"
                value={financial.educationLoan?.loanAmount}
              />
            )}
            {sectionDiffs.financial?.loanAmount && (
              <InfoField
                label="Loan Amount"
                value={financial.loanAmount}
              />
            )}

            {sectionDiffs.financial?.accountHolderName && (
              <InfoField
                label="Account Holder Name"
                value={financial.accountHolderName}
              />
            )}
            {sectionDiffs.financial?.bankAccountHolder && (
              <InfoField
                label="Account Holder Name"
                value={financial.bankAccountHolder}
              />
            )}

            {sectionDiffs.financial?.accountNumber && (
              <InfoField
                label="Account Number"
                value={financial.accountNumber}
              />
            )}

            {sectionDiffs.financial?.branchName && (
              <InfoField
                label="Branch Name"
                value={financial.branchName}
              />
            )}
            {sectionDiffs.financial?.loanBranch && (
              <InfoField
                label="Branch Name"
                value={financial.loanBranch}
              />
            )}

            {sectionDiffs.financial?.ifscCode && (
              <InfoField label="IFSC Code" value={financial.ifscCode} />
            )}

            {sectionDiffs.financial?.panCardNumber && (
              <InfoField
                label="PAN Card Number"
                value={financial.panCardNumber}
              />
            )}
            {sectionDiffs.financial?.panNumber && (
              <InfoField
                label="PAN Card Number"
                value={financial.panNumber}
              />
            )}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectionDiffs.financial?.feeWaiveUrl && (
              <DocumentCard
                title="Fee Waiver Document"
                source={financial.feeWaiveUrl}
                fallbackName="Fee Waiver Document"
              />
            )}
            {sectionDiffs.financial?.grantWaiveUrl && (
              <DocumentCard
                title="Grant Waiver Document"
                source={financial.grantWaiveUrl}
                fallbackName="Grant Waiver Document"
              />
            )}
          </div>
        </ReviewSection>
      )}

      {hasAnyChanges("health") && (
        <ReviewSection
          title="Health Information"
          description="Medical, insurance, disability, and vaccination information."
          icon={HeartPulse}
          editPath="/forms/health"
          isSubmitted={isSubmitted}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {sectionDiffs.health?.bloodGroup && (
              <InfoField label="Blood Group" value={health.bloodGroup} />
            )}

            {sectionDiffs.health?.physicalDimensions?.height && (
              <InfoField
                label="Height"
                value={health.physicalDimensions?.height}
              />
            )}

            {sectionDiffs.health?.physicalDimensions?.weight && (
              <InfoField
                label="Weight"
                value={health.physicalDimensions?.weight}
              />
            )}

            {sectionDiffs.health?.disabilityStatus && (
              <InfoField
                label="Physical Disability"
                value={health.disabilityStatus}
              />
            )}

            {sectionDiffs.health?.disabilityDetails?.disabilityType && (
              <InfoField
                label="Disability Type"
                value={health.disabilityDetails?.disabilityType}
              />
            )}

            {sectionDiffs.health?.disabilityDetails?.percentage && (
              <InfoField
                label="Disability Percentage"
                value={health.disabilityDetails?.percentage}
              />
            )}

            {sectionDiffs.health?.insurance?.provider && (
              <InfoField
                label="Insurance Provider"
                value={health.insurance?.provider}
              />
            )}

            {sectionDiffs.health?.insurance?.policyNumber && (
              <InfoField
                label="Insurance Policy Number"
                value={health.insurance?.policyNumber}
              />
            )}

            {sectionDiffs.health?.vaccinationStatus && (
              <InfoField
                label="Vaccination Status"
                value={health.vaccinationStatus}
              />
            )}

            {sectionDiffs.health?.chronicConditions && (
              <InfoField
                label="Chronic Conditions"
                value={health.chronicConditions}
                wide
              />
            )}

            {sectionDiffs.health?.regularMedications && (
              <InfoField
                label="Regular Medications"
                value={health.regularMedications}
                wide
              />
            )}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectionDiffs.health?.disabilityCertificate && (
              <DocumentCard
                title="Disability Certificate"
                source={health.disabilityCertificate}
                fallbackName="Disability Certificate"
              />
            )}

            {sectionDiffs.health?.vaccinationDoc && (
              <DocumentCard
                title="Vaccination Certificate"
                source={health.vaccinationDoc}
                fallbackName="Vaccination Certificate"
              />
            )}
          </div>
        </ReviewSection>
      )}

      {hasAnyChanges("residential") && (
        <ReviewSection
          title="Residential & Transport"
          description="Accommodation, mess preference, and transport details."
          icon={Home}
          editPath="/forms/residential"
          isSubmitted={isSubmitted}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {sectionDiffs.residential?.resType && (
              <InfoField label="Residential Type" value={residential.resType} />
            )}
            {sectionDiffs.residential?.type && (
              <InfoField label="Residential Type" value={residential.type} />
            )}

            {sectionDiffs.residential?.hostel?.roomNo && (
              <InfoField
                label="Hostel Room Number"
                value={residential.hostel?.roomNo}
              />
            )}
            {sectionDiffs.residential?.roomNo && (
              <InfoField label="Hostel Room Number" value={residential.roomNo} />
            )}

            {sectionDiffs.residential?.hostel?.block && (
              <InfoField label="Hostel Block" value={residential.hostel?.block} />
            )}
            {sectionDiffs.residential?.hostelBlock && (
              <InfoField label="Hostel Block" value={residential.hostelBlock} />
            )}

            {sectionDiffs.residential?.hostel?.bedType && (
              <InfoField label="Bed Type" value={residential.hostel?.bedType} />
            )}
            {sectionDiffs.residential?.bedType && (
              <InfoField label="Bed Type" value={residential.bedType} />
            )}

            {sectionDiffs.residential?.mess && (
              <InfoField label="Mess Preference" value={residential.mess} />
            )}
            {sectionDiffs.residential?.messPreference && (
              <InfoField
                label="Mess Preference"
                value={residential.messPreference}
              />
            )}

            {sectionDiffs.residential?.transport?.opted && (
              <InfoField
                label="University Bus Opted"
                value={residential.transport?.opted}
              />
            )}
            {sectionDiffs.residential?.transportOpted && (
              <InfoField
                label="University Bus Opted"
                value={residential.transportOpted}
              />
            )}

            {sectionDiffs.residential?.transport?.routeNumber && (
              <InfoField
                label="Bus Route Number"
                value={residential.transport?.routeNumber}
              />
            )}
            {sectionDiffs.residential?.busRouteId && (
              <InfoField
                label="Bus Route Number"
                value={residential.busRouteId}
              />
            )}

            {sectionDiffs.residential?.transport?.boardingPoint && (
              <InfoField
                label="Boarding Point"
                value={residential.transport?.boardingPoint}
              />
            )}
            {sectionDiffs.residential?.pickupPoint && (
              <InfoField label="Boarding Point" value={residential.pickupPoint} />
            )}

            {sectionDiffs.residential?.vehicleReg && (
              <InfoField
                label="Vehicle Registration Number"
                value={residential.vehicleReg}
              />
            )}
          </div>
        </ReviewSection>
      )}

      {hasAnyChanges("documents") && (
        <ReviewSection
          title="Documents"
          description="Uploaded photographs, signatures, identity proof, and legal certificates."
          icon={FileText}
          editPath="/forms/documents"
          isSubmitted={isSubmitted}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectionDiffs.documents?.profilePhoto && (
              <DocumentCard
                title="Passport Photo"
                source={documents.profilePhoto}
                fallbackName="Passport Photo"
              />
            )}
            {sectionDiffs.documents?.profilePhotoFile && (
              <DocumentCard
                title="Passport Photo"
                source={documents.profilePhotoFile}
                fallbackName="Passport Photo"
              />
            )}

            {sectionDiffs.documents?.signature && (
              <DocumentCard
                title="Signature"
                source={documents.signature}
                fallbackName="Signature"
              />
            )}
            {sectionDiffs.documents?.signatureFile && (
              <DocumentCard
                title="Signature"
                source={documents.signatureFile}
                fallbackName="Signature"
              />
            )}

            {sectionDiffs.documents?.identityProof && (
              <DocumentCard
                title="Aadhaar / Identity Proof"
                source={documents.identityProof}
                fallbackName="Identity Proof"
              />
            )}
            {sectionDiffs.documents?.identityProofFile && (
              <DocumentCard
                title="Aadhaar / Identity Proof"
                source={documents.identityProofFile}
                fallbackName="Identity Proof"
              />
            )}

            {sectionDiffs.documents?.legalCertificates?.casteCertificate && (
              <DocumentCard
                title="Community / Caste Certificate"
                source={documents.legalCertificates?.casteCertificate}
                fallbackName="Community Certificate"
              />
            )}
            {sectionDiffs.documents?.casteCertificateFile && (
              <DocumentCard
                title="Community / Caste Certificate"
                source={documents.casteCertificateFile}
                fallbackName="Community Certificate"
              />
            )}

            {sectionDiffs.documents?.legalCertificates?.incomeCertificate && (
              <DocumentCard
                title="Income Certificate"
                source={documents.legalCertificates?.incomeCertificate}
                fallbackName="Income Certificate"
              />
            )}
            {sectionDiffs.documents?.incomeCertificateFile && (
              <DocumentCard
                title="Income Certificate"
                source={documents.incomeCertificateFile}
                fallbackName="Income Certificate"
              />
            )}

            {sectionDiffs.documents?.legalCertificates?.nativityCertificate && (
              <DocumentCard
                title="Domicile / Nativity Certificate"
                source={documents.legalCertificates?.nativityCertificate}
                fallbackName="Domicile Certificate"
              />
            )}
            {sectionDiffs.documents?.nativityCertificateFile && (
              <DocumentCard
                title="Domicile / Nativity Certificate"
                source={documents.nativityCertificateFile}
                fallbackName="Domicile Certificate"
              />
            )}

            {sectionDiffs.documents?.legalCertificates?.nonCreamyLayerCertificate && (
              <DocumentCard
                title="Non-Creamy Layer Certificate"
                source={documents.legalCertificates?.nonCreamyLayerCertificate}
                fallbackName="Non-Creamy Layer Certificate"
              />
            )}
            {sectionDiffs.documents?.nonCreamyLayerCertificateFile && (
              <DocumentCard
                title="Non-Creamy Layer Certificate"
                source={documents.nonCreamyLayerCertificateFile}
                fallbackName="Non-Creamy Layer Certificate"
              />
            )}
          </div>
        </ReviewSection>
      )}

      {hasAnyChanges("professional") && (
        <ReviewSection
          title="Professional & Research"
          description="Research work, publications, patents, memberships, and experience."
          icon={Briefcase}
          editPath="/forms/professional"
          isSubmitted={isSubmitted}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {sectionDiffs.professional?.skills && (
              <InfoField
                label="Technical Skills"
                value={professional.skills}
                wide
              />
            )}
            {sectionDiffs.professional?.technicalSkills && (
              <InfoField
                label="Technical Skills"
                value={professional.technicalSkills}
                wide
              />
            )}
          </div>
        </ReviewSection>
      )}

      {hasAnyChanges("mentor") && (
        <ReviewSection
          title="Mentor Details"
          description="Tutor and Head of Department contact information."
          icon={UserCheck}
          editPath="/forms/mentor"
          isSubmitted={isSubmitted}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {sectionDiffs.mentor?.tutorName && (
              <InfoField label="Tutor Name" value={mentor.tutorName} />
            )}
            {sectionDiffs.mentor?.tutorEmail && (
              <InfoField label="Tutor Email" value={mentor.tutorEmail} />
            )}
            {sectionDiffs.mentor?.hodName && (
              <InfoField label="HOD Name" value={mentor.hodName} />
            )}
            {sectionDiffs.mentor?.hodEmail && (
              <InfoField label="HOD Email" value={mentor.hodEmail} />
            )}
          </div>
        </ReviewSection>
      )}


      <section className="rounded-lg bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-blue-200">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black">Confirmation</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              By submitting, you confirm that all information provided is accurate and all documents are original.
            </p>
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            disabled={isSubmitted}
            className="mt-0.5 h-5 w-5 rounded accent-primary"
          />
          <span className="text-sm font-semibold leading-6">
            I agree that the details provided are true to my knowledge.
          </span>
        </label>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!agreed || isSubmitted}
          className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg px-5 py-3 text-base font-black transition active:scale-[0.98] ${
            agreed && !isSubmitted
              ? "bg-primary text-white hover:bg-primary-container"
              : "cursor-not-allowed bg-white/5 text-slate-500 ring-1 ring-white/10"
          }`}
        >
          {isSubmitted ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Application Locked
            </>
          ) : (
            "Submit Final Application"
          )}
        </button>
      </section>
    </div>
  );
}
