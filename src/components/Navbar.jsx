import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { useState, useEffect, useRef } from "react";

import {
  UserCircle,
  LogOut,
  FileEdit,
  Key,
  Search,
  History,
  X,
  Bell,
  Info
} from "lucide-react";

const SEARCH_ITEMS = [
  // Academic Form
  {
    label: "Admission Application Number",
    to: "/forms/academic/#admissionApplicationNumber",
  },
  {
    label: "University Enrollment Number",
    to: "/forms/academic/#universityEnrollmentNumber",
  },
  { label: "Roll Number", to: "/forms/academic/#rollNumber" },
  { label: "Faculty / School", to: "/forms/academic/#facultySchool" },
  { label: "Department", to: "/forms/academic/#department" },
  { label: "Program Level", to: "/forms/academic/#programLevel" },
  { label: "Degree Name", to: "/forms/academic/#degreeName" },
  {
    label: "Specialization / Research Area",
    to: "/forms/academic/#specializationResearchArea",
  },
  {
    label: "Thesis / Dissertation Topic",
    to: "/forms/academic/#thesisDissertationTopic",
  },
  { label: "Research Supervisor", to: "/forms/academic/#researchSupervisor" },
  { label: "Admission Batch", to: "/forms/academic/#admissionBatch" },
  { label: "Academic Cycle", to: "/forms/academic/#academicCycle" },
  { label: "Current Year", to: "/forms/academic/#currentYear" },
  { label: "Current Semester", to: "/forms/academic/#currentSemester" },
  { label: "Mode of Study", to: "/forms/academic/#modeOfStudy" },
  { label: "Admission Category", to: "/forms/academic/#admissionCategory" },
  {
    label: "Fellowship Letter Number",
    to: "/forms/academic/#fellowshipLetterNumber",
  },

  // Contact Form
  { label: "Personal Email", to: "/forms/contact/#personalEmail" },
  { label: "Institutional Email", to: "/forms/contact/#institutionalEmail" },
  { label: "Guardian Name", to: "/forms/contact/#guardianName" },
  { label: "Guardian Relation", to: "/forms/contact/#guardianRelation" },
  { label: "Permanent Address", to: "/forms/contact/#permanentAddress" },
  {
    label: "Correspondence Address",
    to: "/forms/contact/#correspondenceAddress",
  },
  { label: "Distance from Campus", to: "/forms/contact/#distanceFromCampus" },

  // Personal Form
  { label: "Full Name", to: "/forms/personal/#fullName" },
  { label: "Date of Birth", to: "/forms/personal/#dateOfBirth" },
  { label: "Gender", to: "/forms/personal/#gender" },
  { label: "Nationality", to: "/forms/personal/#nationality" },
  { label: "Domicile State", to: "/forms/personal/#domicileState" },
  { label: "Religion", to: "/forms/personal/#religion" },
  { label: "Social Category", to: "/forms/personal/#socialCategory" },
  { label: "Caste", to: "/forms/personal/#caste" },
  { label: "Aadhaar Number", to: "/forms/personal/#aadhaarNumber" },
  { label: "Passport Number", to: "/forms/personal/#passportNumber" },
  { label: "Passport Country", to: "/forms/personal/#passportCountry" },
  { label: "Passport Expiry Date", to: "/forms/personal/#passportExpiryDate" },
  { label: "Visa Type", to: "/forms/personal/#visaType" },
  { label: "Visa Number", to: "/forms/personal/#visaNumber" },

  // Education Form
  { label: "Qualification Level", to: "/forms/education/#qualificationLevel" },
  {
    label: "Institution / University Name",
    to: "/forms/education/#institutionUniversityName",
  },
  { label: "Year of Passing", to: "/forms/education/#yearOfPassing" },
  { label: "Percentage / CGPA", to: "/forms/education/#percentageCGPA" },
  { label: "Board / University", to: "/forms/education/#boardUniversity" },
  {
    label: "Degree / Qualification Name",
    to: "/forms/education/#degreeQualificationName",
  },
  {
    label: "Specialization / Subject",
    to: "/forms/education/#specializationSubject",
  },
  { label: "Year of Completion", to: "/forms/education/#yearOfCompletion" },
  { label: "Title of the Thesis", to: "/forms/education/#titleOfTheThesis" },
  { label: "Exam Name", to: "/forms/education/#examName" },
  { label: "Score", to: "/forms/education/#score" },

  // Family Form
  { label: "Father Name", to: "/forms/family/#fatherName" },
  { label: "Father Qualification", to: "/forms/family/#fatherQualification" },
  { label: "Father Occupation", to: "/forms/family/#fatherOccupation" },
  { label: "Mother Name", to: "/forms/family/#motherName" },
  { label: "Mother Qualification", to: "/forms/family/#motherQualification" },
  { label: "Mother Occupation", to: "/forms/family/#motherOccupation" },
  { label: "Annual Family Income", to: "/forms/family/#annualFamilyIncome" },
  { label: "Parent Email", to: "/forms/family/#parentEmail" },
  {
    label: "Guardian Residential Address",
    to: "/forms/family/#guardianResidentialAddress",
  },
  {
    label: "Guardian Office Address",
    to: "/forms/family/#guardianOfficeAddress",
  },

  // Financial Form
  {
    label: "Scholarship Category",
    to: "/forms/financial/#scholarshipCategory",
  },
  {
    label: "Scholarship Unique ID",
    to: "/forms/financial/#scholarshipUniqueID",
  },
  { label: "Grant Category", to: "/forms/financial/#grantCategory" },
  { label: "Grant Unique ID", to: "/forms/financial/#grantUniqueID" },
  { label: "Bank Name", to: "/forms/financial/#bankName" },
  { label: "Loan Amount", to: "/forms/financial/#loanAmount" },
  { label: "Account Holder Name", to: "/forms/financial/#accountHolderName" },
  { label: "Account Number", to: "/forms/financial/#accountNumber" },
  { label: "Branch Name", to: "/forms/financial/#branchName" },
  { label: "IFSC Code", to: "/forms/financial/#ifscCode" },
  { label: "PAN Card Number", to: "/forms/financial/#panCardNumber" },

  // Health Form
  { label: "Blood Group", to: "/forms/health/#bloodGroup" },
  { label: "Height", to: "/forms/health/#height" },
  { label: "Weight", to: "/forms/health/#weight" },
  { label: "Physical Disability", to: "/forms/health/#physicalDisability" },
  { label: "Disability Type", to: "/forms/health/#disabilityType" },
  { label: "Disability Percentage", to: "/forms/health/#disabilityPercentage" },
  { label: "Chronic Conditions", to: "/forms/health/#chronicConditions" },
  { label: "Regular Medications", to: "/forms/health/#regularMedications" },
  { label: "Insurance Provider", to: "/forms/health/#insuranceProvider" },
  {
    label: "Insurance Policy Number",
    to: "/forms/health/#insurancePolicyNumber",
  },
  { label: "Vaccination Status", to: "/forms/health/#vaccinationStatus" },

  // Professional Form
  { label: "Publication Title", to: "/forms/professional/#publicationTitle" },
  { label: "Journal Name", to: "/forms/professional/#journalName" },
  { label: "ISSN Number", to: "/forms/professional/#issnNumber" },
  {
    label: "Year of Publication",
    to: "/forms/professional/#yearOfPublication",
  },
  { label: "Conference Name", to: "/forms/professional/#conferenceName" },
  { label: "Presentation Type", to: "/forms/professional/#presentationType" },
  { label: "Conference Type", to: "/forms/professional/#conferenceType" },
  { label: "Company", to: "/forms/professional/#company" },
  { label: "Designation", to: "/forms/professional/#designation" },
  { label: "Patent Title", to: "/forms/professional/#patentTitle" },
  { label: "Patent Number", to: "/forms/professional/#patentNumber" },
  { label: "Organization Name", to: "/forms/professional/#organizationName" },
  { label: "Technical Skills", to: "/forms/professional/#technicalSkills" },

  // Residential Form
  { label: "Residential Type", to: "/forms/residential/#residentialType" },
  { label: "Room Number", to: "/forms/residential/#roomNumber" },
  { label: "Hostel Block", to: "/forms/residential/#hostelBlock" },
  { label: "Bed Type", to: "/forms/residential/#bedType" },
  { label: "Mess Preference", to: "/forms/residential/#messPreference" },
  { label: "Bus Route Number", to: "/forms/residential/#busRouteNumber" },
  { label: "Boarding Point", to: "/forms/residential/#boardingPoint" },
  {
    label: "Vehicle Registration Number",
    to: "/forms/residential/#vehicleRegistrationNumber",
  },

  // Documents Form
  { label: "Profile Photo", to: "/forms/documents/#profilePhoto" },
  { label: "Digital Signature", to: "/forms/documents/#digitalSignature" },
  { label: "Identity Proof", to: "/forms/documents/#identityProof" },
  { label: "Caste Certificate", to: "/forms/documents/#casteCertificate" },
  { label: "Income Certificate", to: "/forms/documents/#incomeCertificate" },
  {
    label: "Domicile Certificate",
    to: "/forms/documents/#domicileCertificate",
  },
  {
    label: "Non-Creamy Layer Certificate",
    to: "/forms/documents/#nonCreamyLayerCertificate",
  },

  // Mentor Form
  { label: "Tutor Name", to: "/forms/mentor/#tutorName" },
  { label: "Tutor Email", to: "/forms/mentor/#tutorEmail" },
  { label: "HOD Name", to: "/forms/mentor/#hodName" },
  { label: "HOD Email", to: "/forms/mentor/#hodEmail" },

  // Other Pages
  { label: "Grade Card", to: "/grade-card" },
  { label: "Change Password", to: "/change-password" },
  { label: "Request Unlock", to: "/request" },
  { label: "Mark Request", to: "/mark-request" },
];

import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const logout = useStore((state) => state.logout);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const ref = useRef(null);
  const searchRef = useRef(null);
  const resultsContainerRef = useRef(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef(null);
  const notificationRef = useRef(null);

  const [notificationOpen, setNotificationOpen] = useState(false);

const {

    notifications,

    notificationLoading,

    fetchNotifications,

    deleteMyNotifications,

} = useStore();

const notificationCount = notifications.length;
const token = useStore(state => state.token);

useEffect(() => {

    if (token) {

        fetchNotifications();

    }

}, [token]);

  // ✅ Close dropdown and search panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (
        mobileSearchOpen &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setMobileSearchOpen(false);
        setSearchQuery("");
        setSearchOpen(false);
        setHighlightedIndex(-1);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationOpen(false);
      }
    };
    

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileSearchOpen]);

  const user = useStore((state) => state.user);
  const filteredItems = SEARCH_ITEMS.filter(
    (item) =>
      searchQuery.trim().length > 0 &&
      item.label.toLowerCase().includes(searchQuery.toLowerCase()),
  ).slice(0, 8);

  const handleSelectSearchItem = (item) => {
    navigate(item.to);
    setSearchQuery("");
    setSearchOpen(false);
    setHighlightedIndex(-1);
  };

  const handleSearchKeyDown = (e) => {
    if (!searchOpen || filteredItems.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectSearchItem(filteredItems[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setSearchOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && resultsContainerRef.current) {
      const highlightedElement =
        resultsContainerRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  // Reset highlighted index when search query changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border-subtle bg-white/90 shadow-sm shadow-slate-900/5 backdrop-blur-xl white:border-slate-800 white:bg-slate-950/90   z-[1000] overflow-visible" >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-3 sm:px-4 md:px-6">
          {/* LOGO */}
          <Link to="/" className="flex min-w-0 items-center">
            <img
              src={logo}
              alt="Kannur University SIS"
              className="h-8 w-auto max-w-[180px] object-contain sm:max-w-none md:h-10"
            />
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* SEARCH */}
            <div className="hidden md:block relative" ref={searchRef}>
              <div className="relative" ref={searchRef}>
                <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 w-72 md:w-96">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => setSearchOpen(true)}
                    placeholder="Search fields or pages..."
                    className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 ml-2"
                  />
                </div>

                {searchOpen && searchQuery.trim().length > 0 && (
                  <div
                    ref={resultsContainerRef}
                    className="absolute right-0 top-full mt-2 w-72 md:w-96 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
                  >
                    {filteredItems.length ? (
                      filteredItems.map((item, index) => (
                        <button
                          key={item.label}
                          onClick={() => handleSelectSearchItem(item)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                            highlightedIndex === index
                              ? "bg-blue-100"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500">
                        No matching fields found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

                {/* NOTIFICATIONS */}

<div className="relative overflow-visible" ref={notificationRef}>

  <button
    onClick={() => setNotificationOpen(!notificationOpen)}
    className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-primary"
  >
    <Bell className="h-6 w-6" />

   {notificationCount  > 0 && (
      <span
        className="
          absolute
          -top-1
          -right-1
          flex
          h-5
          min-w-[20px]
          items-center
          justify-center
          rounded-full
          bg-red-500
          px-1
          text-[10px]
          font-bold
          text-white
        "
      >
    {notificationCount > 99 ? "99+" : notificationCount}
    </span>
    )}
  </button>
    {notificationOpen && (
<div
className="
fixed
top-12
right-3
mt-3
w-[340px]
max-w-[calc(100vw-20px)]
overflow-hidden
rounded-3xl
bg-white
shadow-2xl
ring-1
ring-slate-200
z-[99999]
origin-top-right
animate-in
fade-in
zoom-in-95
duration-200
"
>
<div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">

    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">

        <Bell className="h-5 w-5 text-blue-600" />

    </div>

    <div>

        <h3 className="font-semibold text-slate-800">
            Notifications
        </h3>

     <p className="text-xs text-slate-500">
  {notificationCount} {notificationCount === 1 ? "notification" : "notifications"}
</p>
    </div>

</div>
<div className="max-h-96 overflow-y-auto">

{notifications.length ? (

notifications.map((item) => (

<div
  key={item._id}
  className="mx-3
my-2
rounded-xl
bg-slate-50
px-4
py-3
transition
hover:bg-slate-100"
>

  <div className="flex gap-3">

  <div
  className="
  mt-1
  flex
  h-9
  w-9
  items-center
  justify-center
  rounded-full
  bg-blue-100
  text-lg
  "
>
  <Info className="h-5 w-5 text-blue-600" />
</div>

    <div className="flex-1">

      <div className="flex justify-between">

        <div>

          <h4 className="text-sm font-semibold">

            {item.title}

          </h4>

          <p className="mt-1 text-xs text-slate-600">

            {item.message}

          </p>

          <p className="mt-2 text-[11px] text-slate-400">

{new Date(item.createdAt).toLocaleDateString(
    "en-IN",
    {
        day: "numeric",
        month: "short",
        year: "numeric",
    }
)}
          </p>

        </div>

    
      </div>

    </div>

  

  </div>

</div>



))



) : (

<div className="flex flex-col items-center px-6 py-10">

    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">

        <Bell className="h-8 w-8 text-slate-400" />

    </div>

    <h4 className="font-medium text-slate-700">

        No notifications yet

    </h4>

    <p className="mt-2 text-center text-sm text-slate-500">

        You'll receive notifications when
        your profile is approved,
        rejected or updated.

    </p>

</div>

)}

</div>
{notifications.length > 0 && (

<div className="border-t border-slate-200 p-3">
    <button
        onClick={async () => {

            const ok = window.confirm(
                "Clear all notifications?"
            );

            if (!ok) return;

            await deleteMyNotifications();

            setNotificationOpen(false);

        }}
        className="
        w-full
        rounded-xl
        border
        border-red-200
        bg-red-50
        py-2.5
        text-sm
        font-medium
        text-red-600
        hover:bg-red-100
        "
    >
        Clear All Notifications
    </button>

</div>

)}


</div>

)}
  </div>


            <div className="md:hidden">
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-primary white:text-slate-200 white:hover:bg-slate-900"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* USER DROPDOWN */}
            <div className="relative" ref={ref}>
              {/* AVATAR BUTTON */}
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="p-2 text-primary hover:bg-slate-100 rounded-full transition-all white:hover:bg-slate-900"
                aria-label="Open user menu"
              >
                <UserCircle className="w-6 h-6" />
              </button>

              {/* DROPDOWN */}
              {open && (
                <div className="absolute right-0 top-full pt-2 z-50">
                  <div className="bg-white border border-border-subtle rounded-xl shadow-xl py-2 w-52 md:w-56">
                    {/* HEADER */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase">
                        Signed in as
                      </p>

                      <p className="text-xs text-slate-500 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                    {/* MENU ITEMS */}

                    <Link
                      to="/request"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <FileEdit className="w-4 h-4 text-yellow-600" />
                      Request
                    </Link>

                    <Link
                      to="/request-history"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <History className="w-4 h-4 text-yellow-600" />
                      Request History
                    </Link>

                    {/* <Link
                    to="/grade-card"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <FileEdit className="w-4 h-4 text-yellow-600" />
                    My Gradecard
                  </Link> */}

                    <Link
                      to="/change-password"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <Key className="w-4 h-4 text-gray-600" />
                      Change Password
                    </Link>

                    {/* DIVIDER */}
                    <div className="my-2 border-t border-slate-100" />

                    {/* LOGOUT */}
                    <button
                      onClick={() => {
                        setOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {mobileSearchOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/10"
            onClick={() => {
              setMobileSearchOpen(false);
              setSearchQuery("");
              setSearchOpen(false);
            }}
          />
          <div
            ref={mobileSearchRef}
            className="fixed left-0 right-0 top-0 z-[9999] bg-white/95 shadow-2xl backdrop-blur-xl white:bg-slate-950/95"
          >
            <div className="p-4">
              <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />

                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  placeholder="Search fields or pages..."
                  className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 ml-2"
                />

                <button
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setSearchQuery("");
                    setSearchOpen(false);
                  }}
                  className="ml-2 rounded-lg p-1 text-[0px] text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />✕
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {searchQuery.trim() ? (
                filteredItems.length ? (
                  filteredItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        handleSelectSearchItem(item);
                        setMobileSearchOpen(false);
                      }}
                      className="w-full text-left px-4 py-4 border-b border-slate-100 hover:bg-slate-50"
                    >
                      {item.label}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-sm text-slate-500">
                    No matching fields found.
                  </div>
                )
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
