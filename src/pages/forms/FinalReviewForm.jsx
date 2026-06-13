import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Banknote,
  Briefcase,
  Bus,
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
  Mail,
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

    await store.submitUnlockRequest({
      requestType: "full_unlock",
      formData: changedSections,
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

          <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
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
                Status
              </p>
              <p className="mt-1 text-lg font-black text-slate-950">
                {isSubmitted ? "Locked" : "Editable"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <ReviewSection
        title="Personal Information"
        description="Identity, demographics, and personal documents."
        icon={User}
        editPath="/forms/personal"
        isSubmitted={isSubmitted}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoField label="Full Name" value={personal.fullName} />
          <InfoField label="Date of Birth" value={personal.dob} />
          <InfoField label="Gender" value={personal.gender} />
          <InfoField label="Nationality" value={personal.nationality} />
          <InfoField label="Domicile State" value={personal.domicileState} />
          <InfoField label="Religion" value={personal.religion} />
          <InfoField label="Social Category" value={personal.socialCategory || personal.category} />
          <InfoField label="Caste" value={personal.caste} />
          <InfoField label="Aadhaar Number" value={personal.aadhaarNo || personal.aadhaarNumber} />
          <InfoField label="Passport Number" value={personal.passportNumber || personal.passportNo} />
          <InfoField label="Passport Country" value={personal.passportCountry} />
          <InfoField label="Passport Expiry" value={personal.passportExpiry} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocumentCard title="Date of Birth Proof" source={personal.birthCertificateDoc} fallbackName="Date of Birth Proof" />
          <DocumentCard title="Passport Document" source={personal.passportDoc} fallbackName="Passport Document" />
          <DocumentCard title="Visa / Permit Document" source={personal.visaDoc} fallbackName="Visa Permit Document" />
        </div>
      </ReviewSection>

      <ReviewSection
        title="Academic Information"
        description="Enrollment, programme, and fellowship details."
        icon={School}
        editPath="/forms/academic"
        isSubmitted={isSubmitted}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoField label="Admission Application Number" value={academic.admissionApplicationNumber} />
          <InfoField label="University Enrollment Number" value={academic.universityEnrollmentNumber} />
          <InfoField label="Roll Number" value={academic.rollNumber} />
          <InfoField label="Faculty / School" value={academic.facultySchool || academic.faculty} />
          <InfoField label="Department" value={academic.department} />
          <InfoField label="Program Level" value={academic.programLevel} />
          <InfoField label="Degree Name" value={academic.degreeName} />
          <InfoField label="Specialization / Research Area" value={academic.specializationResearchArea || academic.specialization} />
          <InfoField label="Research Supervisor" value={academic.researchSupervisor} />
          <InfoField label="Admission Batch" value={academic.admissionBatch} />
          <InfoField label="Current Year" value={academic.currentYear || academic.year} />
          <InfoField label="Current Semester" value={academic.currentSemester || academic.semester} />
          <InfoField label="Mode of Study" value={academic.modeOfStudy} />
          <InfoField label="Admission Category" value={academic.admissionCategory} />
          <InfoField label="Fellowship Letter Number" value={academic.fellowshipLetterNumber} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocumentCard title="Fellowship Letter" source={academic.fellowshipLetter} fallbackName="Fellowship Letter" />
        </div>
      </ReviewSection>

      <ReviewSection
        title="Contact & Address Information"
        description="Phone, email, address, and emergency contact details."
        icon={Phone}
        editPath="/forms/contact"
        isSubmitted={isSubmitted}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoField label="Personal Mobile" value={joinPhone(contact.personalMobile, contact.mobile)} />
          <InfoField label="WhatsApp Number" value={joinPhone(contact.whatsappNumber, contact.whatsapp)} />
          <InfoField label="Personal Email" value={contact.personalEmail || contact.email} />
          <InfoField label="Institutional Email" value={contact.institutionalEmail} />
          <InfoField label="Distance from Campus" value={contact.distanceToCampus || contact.distanceFromCampus} />
          <InfoField label="Same Address" value={contact.isSameAddress} />
          <InfoField label="Permanent Address" value={joinAddress(contact.permanentAddress)} wide />
          <InfoField label="Communication Address" value={joinAddress(contact.correspondenceAddress || contact.communicationAddress)} wide />
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="mb-4 flex items-center gap-2 text-slate-700">
            <MapPin className="h-4 w-4" />
            <h3 className="font-black">Emergency Contact</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoField label="Name" value={contact.emergencyContact?.name || contact.emergencyName} />
            <InfoField label="Relation" value={contact.emergencyContact?.relation || contact.emergencyRelation} />
            <InfoField label="Phone" value={joinPhone(contact.emergencyContact?.number, contact.emergencyPhone)} />
          </div>
        </div>
      </ReviewSection>

      <ReviewSection
        title="Family & Guardian Details"
        description="Parent, guardian, and family finance information."
        icon={Users2}
        editPath="/forms/family"
        isSubmitted={isSubmitted}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <RecordCard title="Father Details">
            <InfoField label="Name" value={family.father?.name} />
            <InfoField label="Qualification" value={family.father?.qualification} />
            <InfoField label="Occupation" value={family.father?.occupation} />
          </RecordCard>
          <RecordCard title="Mother Details">
            <InfoField label="Name" value={family.mother?.name} />
            <InfoField label="Qualification" value={family.mother?.qualification} />
            <InfoField label="Occupation" value={family.mother?.occupation} />
          </RecordCard>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InfoField label="Annual Family Income" value={family.annualFamilyIncome} />
          <InfoField label="Parent Phone" value={joinPhone(family.parentContact)} />
          <InfoField label="Parent Email" value={family.parentEmail} />
          <InfoField label="Guardian Name" value={family.guardian?.name} />
          <InfoField label="Guardian Relation" value={family.guardian?.relation} />
          <InfoField label="Guardian Phone" value={joinPhone(family.guardian?.contact)} />
          <InfoField label="Guardian Address" value={joinAddress(family.guardian?.address)} wide />
          <InfoField label="Guardian Residential Address" value={family.guardianResidentialAddress} wide />
          <InfoField label="Guardian Office Address" value={family.guardianOfficeAddress} wide />
        </div>
      </ReviewSection>

      <ReviewSection
        title="Education History"
        description="Academic qualifications, competitive exams, and migration documents."
        icon={GraduationCap}
        editPath="/forms/education"
        isSubmitted={isSubmitted}
      >
        <div className="space-y-4">
          {academicRecords.length ? (
            academicRecords.map((record, index) => (
              <RecordCard key={`education-${index}`} title={`Qualification ${index + 1}`}>
                <InfoField label="Qualification Level" value={record.qualType || record.qualificationLevel} />
                <InfoField label="Institution / University" value={record.institution || record.institutionUniversityName} />
                <InfoField label="Year of Passing" value={record.passYear || record.yearOfPassing} />
                <InfoField label="Percentage / CGPA" value={record.percentage || record.percentageCGPA} />
                <InfoField label="Board / University" value={record.board || record.boardUniversity} />
                <InfoField label="Specialization / Subject" value={record.specialization || record.specializationSubject} />
                <div className="sm:col-span-2">
                  <DocumentCard title="Qualification Document" source={record.documentUrl || record.docFile} fallbackName="Qualification Document" />
                </div>
              </RecordCard>
            ))
          ) : (
            <EmptyState text="No education records added." />
          )}

          {competitiveExams.length ? (
            competitiveExams.map((exam, index) => (
              <RecordCard key={`exam-${index}`} title={`Competitive Exam ${index + 1}`}>
                <InfoField label="Exam Name" value={exam.examName || exam.name} />
                <InfoField label="Score" value={exam.score} />
                <InfoField label="Year" value={exam.year} />
                <div className="sm:col-span-2">
                  <DocumentCard title="Exam Score Document" source={exam.documentUrl || exam.docFile} fallbackName="Exam Score Document" />
                </div>
              </RecordCard>
            ))
          ) : (
            <EmptyState text="No competitive exam records added." />
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocumentCard title="Migration / Transfer Certificate" source={education.migrationUrl || education.migrationFile} fallbackName="Migration Certificate" />
        </div>
      </ReviewSection>

      <ReviewSection
        title="Financial Information"
        description="Scholarship, grant, bank, PAN, and loan details."
        icon={CreditCard}
        editPath="/forms/financial"
        isSubmitted={isSubmitted}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoField label="Scholarship Category" value={financial.schType || financial.scholarshipCategory} />
          <InfoField label="Scholarship Unique ID" value={financial.schId || financial.scholarshipUniqueID} />
          <InfoField label="Grant Category" value={financial.grantType || financial.grantCategory} />
          <InfoField label="Grant Unique ID" value={financial.grantId || financial.grantUniqueID} />
          <InfoField label="Bank Name" value={financial.educationLoan?.bankName || financial.loanBankName} />
          <InfoField label="Loan Amount" value={financial.educationLoan?.loanAmount || financial.loanAmount} />
          <InfoField label="Account Holder Name" value={financial.accountHolderName || financial.bankAccountHolder} />
          <InfoField label="Account Number" value={financial.accountNumber} />
          <InfoField label="Branch Name" value={financial.branchName || financial.loanBranch} />
          <InfoField label="IFSC Code" value={financial.ifscCode} />
          <InfoField label="PAN Card Number" value={financial.panCardNumber || financial.panNumber} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocumentCard title="Fee Waiver Document" source={financial.feeWaiveUrl} fallbackName="Fee Waiver Document" />
          <DocumentCard title="Grant Waiver Document" source={financial.grantWaiveUrl} fallbackName="Grant Waiver Document" />
        </div>
      </ReviewSection>

      <ReviewSection
        title="Health Information"
        description="Medical, insurance, disability, and vaccination information."
        icon={HeartPulse}
        editPath="/forms/health"
        isSubmitted={isSubmitted}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoField label="Blood Group" value={health.bloodGroup} />
          <InfoField label="Height" value={health.physicalDimensions?.height || health.height} />
          <InfoField label="Weight" value={health.physicalDimensions?.weight || health.weight} />
          <InfoField label="Physical Disability" value={health.disabilityStatus || health.physicalDisability} />
          <InfoField label="Disability Type" value={health.disabilityDetails?.disabilityType || health.disabilityType} />
          <InfoField label="Disability Percentage" value={health.disabilityDetails?.percentage || health.disabilityPercentage} />
          <InfoField label="Insurance Provider" value={health.insurance?.provider || health.insuranceProvider} />
          <InfoField label="Insurance Policy Number" value={health.insurance?.policyNumber || health.insurancePolicyNumber} />
          <InfoField label="Vaccination Status" value={health.vaccinationStatus} />
          <InfoField label="Chronic Conditions" value={health.chronicConditions} wide />
          <InfoField label="Regular Medications" value={health.regularMedications} wide />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocumentCard title="Disability Certificate" source={health.disabilityCertificate || health.disabilityFile} fallbackName="Disability Certificate" />
          <DocumentCard title="Vaccination Certificate" source={health.vaccinationDoc || health.vaccinationFile} fallbackName="Vaccination Certificate" />
        </div>
      </ReviewSection>

      <ReviewSection
        title="Residential & Transport"
        description="Accommodation, mess preference, and transport details."
        icon={Home}
        editPath="/forms/residential"
        isSubmitted={isSubmitted}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoField label="Residential Type" value={residential.resType || residential.type} />
          <InfoField label="Hostel Room Number" value={residential.hostel?.roomNo || residential.roomNo} />
          <InfoField label="Hostel Block" value={residential.hostel?.block || residential.hostelBlock} />
          <InfoField label="Bed Type" value={residential.hostel?.bedType || residential.bedType} />
          <InfoField label="Mess Preference" value={residential.mess || residential.messPreference} />
          <InfoField label="University Bus Opted" value={residential.transport?.opted || residential.transportOpted} />
          <InfoField label="Bus Route Number" value={residential.transport?.routeNumber || residential.busRouteId} />
          <InfoField label="Boarding Point" value={residential.transport?.boardingPoint || residential.pickupPoint} />
          <InfoField label="Vehicle Registration Number" value={residential.vehicleReg} />
        </div>
      </ReviewSection>

      <ReviewSection
        title="Documents"
        description="Uploaded photographs, signatures, identity proof, and legal certificates."
        icon={FileText}
        editPath="/forms/documents"
        isSubmitted={isSubmitted}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocumentCard title="Passport Photo" source={documents.profilePhoto || documents.profilePhotoFile} fallbackName="Passport Photo" />
          <DocumentCard title="Signature" source={documents.signature || documents.signatureFile} fallbackName="Signature" />
          <DocumentCard title="Aadhaar / Identity Proof" source={documents.identityProof || documents.identityProofFile} fallbackName="Identity Proof" />
          <DocumentCard title="Community / Caste Certificate" source={documents.legalCertificates?.casteCertificate || documents.casteCertificateFile} fallbackName="Community Certificate" />
          <DocumentCard title="Income Certificate" source={documents.legalCertificates?.incomeCertificate || documents.incomeCertificateFile} fallbackName="Income Certificate" />
          <DocumentCard title="Domicile / Nativity Certificate" source={documents.legalCertificates?.nativityCertificate || documents.nativityCertificateFile} fallbackName="Domicile Certificate" />
          <DocumentCard title="Non-Creamy Layer Certificate" source={documents.legalCertificates?.nonCreamyLayerCertificate || documents.nonCreamyLayerCertificateFile} fallbackName="Non-Creamy Layer Certificate" />
        </div>
      </ReviewSection>

      <ReviewSection
        title="Professional & Research"
        description="Research work, publications, patents, memberships, and experience."
        icon={Briefcase}
        editPath="/forms/professional"
        isSubmitted={isSubmitted}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoField label="Technical Skills" value={professional.skills || professional.technicalSkills} wide />
        </div>

        <div className="mt-4 space-y-4">
          {publications.length ? (
            publications.map((pub, index) => (
              <RecordCard key={`publication-${index}`} title={`Publication ${index + 1}`}>
                <InfoField label="Title" value={pub.paperTitle || pub.publicationTitle} />
                <InfoField label="Journal" value={pub.journal || pub.journalName} />
                <InfoField label="ISSN" value={pub.issn || pub.issnNumber} />
                <InfoField label="Year" value={pub.date || pub.yearOfPublication} />
                <div className="sm:col-span-2">
                  <DocumentCard title="Publication Document" source={pub.url || pub.docFile} fallbackName="Publication Document" />
                </div>
              </RecordCard>
            ))
          ) : (
            <EmptyState text="No publication records added." />
          )}

          {conferences.length ? (
            conferences.map((conf, index) => (
              <RecordCard key={`conference-${index}`} title={`Conference ${index + 1}`}>
                <InfoField label="Paper Title" value={conf.paperTitle || conf.title} />
                <InfoField label="Conference Name" value={conf.conferenceName || conf.name} />
                <InfoField label="Conference Type" value={conf.conferenceType} />
                <InfoField label="Organizer" value={conf.organizer} />
                <InfoField label="Venue" value={conf.venue} />
                <InfoField label="Date" value={conf.date} />
                <div className="sm:col-span-2">
                  <DocumentCard title="Conference Certificate" source={conf.url || conf.certificateUrl || conf.docFile} fallbackName="Conference Certificate" />
                </div>
              </RecordCard>
            ))
          ) : (
            <EmptyState text="No conference records added." />
          )}

          {experience.length ? (
            experience.map((exp, index) => (
              <RecordCard key={`experience-${index}`} title={`Experience ${index + 1}`}>
                <InfoField label="Company" value={exp.company} />
                <InfoField label="Designation" value={exp.designation} />
                <InfoField label="Years" value={exp.years} />
                <div className="sm:col-span-2">
                  <DocumentCard title="Experience Certificate" source={exp.url || exp.docFile} fallbackName="Experience Certificate" />
                </div>
              </RecordCard>
            ))
          ) : (
            <EmptyState text="No experience records added." />
          )}

          {patents.length ? (
            patents.map((pat, index) => (
              <RecordCard key={`patent-${index}`} title={`Patent ${index + 1}`}>
                <InfoField label="Patent Title" value={pat.title || pat.paperTitle} />
                <InfoField label="Patent Status" value={pat.status} />
                <InfoField label="Publication Type" value={pat.publicationType} />
                <InfoField label="Patent Number" value={pat.patentNumber} />
                <div className="sm:col-span-2">
                  <DocumentCard title="Patent Document" source={pat.document || pat.docFile} fallbackName="Patent Document" />
                </div>
              </RecordCard>
            ))
          ) : (
            <EmptyState text="No patent records added." />
          )}

          {memberships.length ? (
            memberships.map((membership, index) => (
              <RecordCard key={`membership-${index}`} title={`Membership ${index + 1}`}>
                <InfoField label="Organization" value={membership.organizationName || membership.name} />
                <InfoField label="Membership Type" value={membership.membershipType} />
                <InfoField label="Membership ID" value={membership.membershipId} />
                <InfoField label="Joining Year" value={membership.joiningYear} />
                <div className="sm:col-span-2">
                  <DocumentCard title="Membership Certificate" source={membership.document || membership.url || membership.docFile} fallbackName="Membership Certificate" />
                </div>
              </RecordCard>
            ))
          ) : (
            <EmptyState text="No membership records added." />
          )}
        </div>
      </ReviewSection>

      <ReviewSection
        title="Mentor Details"
        description="Tutor and Head of Department contact information."
        icon={UserCheck}
        editPath="/forms/mentor"
        isSubmitted={isSubmitted}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoField label="Tutor Name" value={mentor.tutorName} />
          <InfoField label="Tutor Email" value={mentor.tutorEmail} />
          <InfoField label="HOD Name" value={mentor.hodName} />
          <InfoField label="HOD Email" value={mentor.hodEmail} />
        </div>
      </ReviewSection>

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
