import { Link } from "react-router-dom";
import { useStore } from "../store";
import {
  School,
  User,
  FileText,
  CreditCard,
  HeartPulse,
    Phone,
Users,
  GraduationCap, Briefcase,
  Home,  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";


import { useEffect, useState } from "react";

export default function DashboardPage() {

  // 🔥 STORE DATA
  const academic = useStore((s) => s.academic);
const personal = useStore((s) => s.personal);
const contact = useStore((s) => s.contact);
const health = useStore((s) => s.health);
const family = useStore((s) => s.family);
const education = useStore((s) => s.education);
const financial = useStore((s) => s.financial);
const professional = useStore((s) => s.professional);
const residential = useStore((s) => s.residential);
const documents = useStore((s) => s.documents);
const mentor = useStore((s) => s.mentor);
const isSubmitted = useStore((s) => s.isSubmitted);

  const fetchStudent = useStore((s) => s.fetchStudent);
const editStatus = "none"; 

  // 🔥 LOADING STATE
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA
  useEffect(() => {
    const load = async () => {
      try {
        await fetchStudent();
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    load();
  }, []);

  // // 🔥 LOADING UI (NO STYLE CHANGE)
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-100">
  //       <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  //     </div>
  //   );
  // }

  // 🔥 STATUS LOGIC
  const getStatus = (section) => {
    if (!section) return "Not Started";

    const values = Object.values(section);
    const filled = values.some((v) => v);
    const complete = values.every((v) => v);

    if (!filled) return "Not Started";
    if (!complete) return "Pending";

    return "Verified";
  };

  // 🔥 MODULES (DYNAMIC)
 const modules = [
  {
    id: "academic",
    title: "Academic",
    desc: "Academic details",
    icon: School,
    data: academic,
    path: "/forms/academic",
  },
  {
    id: "personal",
    title: "Personal",
    desc: "Personal details",
    icon: User,
    data: personal,
    path: "/forms/personal",
  },
  {
    id: "contact",
    title: "Contact",
    desc: "Contact details",
    icon: Phone,
    data: contact,
    path: "/forms/contact",
  },
  {
    id: "health",
    title: "Health",
    desc: "Medical info",
    icon: HeartPulse,
    data: health,
    path: "/forms/health",
  },
  {
    id: "family",
    title: "Family",
    desc: "Family details",
    icon: Users,
    data: family,
    path: "/forms/family",
  },
  {
    id: "education",
    title: "Education",
    desc: "Education history",
    icon: GraduationCap,
    data: education,
    path: "/forms/education",
  },
  {
    id: "financial",
    title: "Financial",
    desc: "Bank and scholarship",
    icon: CreditCard,
    data: financial,
    path: "/forms/financial",
  },
  {
    id: "professional",
    title: "Professional",
    desc: "Work & experience",
    icon: Briefcase,
    data: professional,
    path: "/forms/professional",
  },
  {
    id: "residential",
    title: "Residential",
    desc: "Address details",
    icon: Home,
    data: residential,
    path: "/forms/residential",
  },
  {
    id: "documents",
    title: "Documents",
    desc: "Uploaded files",
    icon: FileText,
    data: documents,
    path: "/forms/documents",
  },
  {
    id: "mentor",
    title: "Mentor",
    desc: "Mentor details",
    icon: UserCheck,
    data: mentor,
    path: "/forms/mentor",
  },
];

  // 🔥 PROGRESS CALCULATION
  const total = modules.length;
  const completed = modules.filter(
    (m) => getStatus(m.data) === "Verified"
  ).length;

  const progress = Math.round((completed / total) * 100);

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-10 space-y-10">

      {/* Student Summary Section */}
     <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {/* LEFT SIDE (STATUS + MESSAGE) */}
  <div className="md:col-span-2 space-y-6">

    {/* STATUS BOX */}
    <div className="bg-white border border-border-subtle p-6 rounded-xl shadow-sm">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Application Status
      </span>

      <p className="text-xl font-semibold mt-2 text-primary">
        {!isSubmitted && "In Progress"}
        {isSubmitted && editStatus === "none" && "Submitted & Locked"}
        {isSubmitted && editStatus === "pending" && "Edit Request Pending"}
        {isSubmitted && editStatus === "approved" && "Editing Enabled"}
      </p>
    </div>

    {/* IMPORTANT MESSAGE */}
    <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl shadow-sm">
      <p className="text-sm text-yellow-900 leading-relaxed space-y-2">

    {!isSubmitted && (
      <>
        <strong>Before Submission:</strong><br />
        Please complete all required sections of your student profile carefully.
        You can edit your information at any time before final submission.
        Once all modules are completed, proceed to the final submission.

        <br /><br />

        <strong>Important:</strong> After submitting your application, all fields will be locked
        and cannot be modified directly.
      </>
    )}

    {isSubmitted && editStatus === "none" && (
      <>
        <strong>Application Submitted:</strong><br />
        Your profile has been successfully submitted and is currently under verification.

        <br /><br />

        <strong>Editing Restriction:</strong><br />
        All input fields are now locked to maintain data integrity during the verification process.

        <br /><br />

        <strong>Need Changes?</strong><br />
        If you find any incorrect or missing information, you must submit a 
        <strong> "Request for Edit"</strong>. Editing will only be allowed after approval from the Head of Department (HOD).
      </>
    )}

    {isSubmitted && editStatus === "pending" && (
      <>
        <strong>Edit Request Submitted:</strong><br />
        Your request to modify the submitted data has been received.

        <br /><br />

        <strong>Status:</strong><br />
        The request is currently under review by the Head of Department (HOD).

        <br /><br />

        <strong>Next Step:</strong><br />
        You will be able to edit your profile only after the request is approved.
        Until then, all fields will remain locked.
      </>
    )}

    {isSubmitted && editStatus === "approved" && (
      <>
        <strong>Edit Access Granted:</strong><br />
        Your request for editing has been approved by the Head of Department.

        <br /><br />

        <strong>Action Required:</strong><br />
        You can now update your profile information. Please ensure all corrections are accurate.

        <br /><br />

        <strong>Important:</strong><br />
        After making changes, you may need to resubmit your application for verification.
      </>
    )}

  </p>
    </div>

  </div>

  {/* RIGHT SIDE (PROFILE COMPLETION) */}
  <div className="bg-white border border-border-subtle p-8 rounded-xl shadow-sm flex flex-col justify-between">

    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-6">
        Profile Completion
      </h2>

      <div className="relative pt-1">
        <div className="flex mb-4 items-center justify-between">
          <span className="text-[10px] font-bold inline-block py-1 px-3 rounded-full text-blue-800 bg-blue-100 uppercase tracking-wider">
            {progress}% Complete
          </span>
        </div>

        <div className="overflow-hidden h-2.5 mb-4 flex rounded-full bg-slate-100">
          <div
            className="bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>

    <div className="space-y-4">

      {/* DYNAMIC MESSAGE */}
      <p className="text-xs text-slate-500 leading-relaxed text-center italic">

        {!isSubmitted && "Complete all modules before final submission."}

        {isSubmitted && editStatus === "none" &&
          "Your profile is locked after submission."}

        {isSubmitted && editStatus === "pending" &&
          "Waiting for approval to edit your profile."}

        {isSubmitted && editStatus === "approved" &&
          "Editing is enabled. You can update your profile."}

      </p>

      {/* BUTTON LOGIC */}

      {!isSubmitted && (
        <Link
          to="/forms/personal"
          className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2"
        >
          Complete Profile
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      {isSubmitted && editStatus === "none" && (
       <Link 
  to="/request" 
  className="block w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition text-center"
>
  Request Edit
</Link>
      )}

      {editStatus === "pending" && (
        <button className="w-full py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed">
          Request Pending
        </button>
      )}

      {editStatus === "approved" && (
        <Link
          to="/forms/personal"
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          Edit Profile
        </Link>
      )}

    </div>
  </div>

</section>
      {/* Information Modules */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Information Modules</h2>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Review your data accuracy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            const status = getStatus(module.data);

            return (
              <Link
                key={module.id}
                to={module.path}
                className="bg-white border border-border-subtle p-6 rounded-xl flex items-start gap-5 hover:shadow-xl hover:scale-102 active:scale-95 transition-all group"
              >
                <div className="p-3 rounded-lg bg-slate-50 text-primary group-hover:bg-blue-50 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors">
                      {module.title}
                    </h3>

                    {status === "Verified" && (
                      <CheckCircle2 className="w-4 h-4 text-status-success fill-status-success/10" />
                    )}
                    {status === "Pending" && (
                      <Clock className="w-4 h-4 text-status-warning" />
                    )}
                    {status === "Not Started" && (
                      <AlertCircle className="w-4 h-4 text-status-error" />
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mb-4">{module.desc}</p>

                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Final Submission */}
      <section className="bg-primary px-10 py-10 rounded-2xl shadow-xl shadow-blue-900/10 text-white flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Final Application Lock</h2>
          <p className="text-blue-100 max-w-xl text-sm leading-relaxed">
            Complete all modules and finalize your submission.
          </p>
        </div>

        <Link
          to="/forms/review"
          className="px-10 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
        >
          Final Review & Submit
        </Link>
      </section>
    </div>
  );
}