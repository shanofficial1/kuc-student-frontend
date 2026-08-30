// import { Link, useLocation } from "react-router-dom";
// import {
//   User,
//   GraduationCap,
//   BookOpen,
//   Phone,
//   HeartPulse,
//   Users,
//   Landmark,
//   Briefcase,
//   Home,
//   FileText,
//   UserCheck,
//   CheckCircle,
// } from "lucide-react";

// export default function FormSidebar() {
//   const location = useLocation();

//   const steps = [
//     { name: "Academic", path: "/forms/academic", icon: BookOpen },
//     { name: "Personal", path: "/forms/personal", icon: User },
//     { name: "Contact", path: "/forms/contact", icon: Phone },
//     { name: "Health", path: "/forms/health", icon: HeartPulse },
//     { name: "Family", path: "/forms/family", icon: Users },
//     { name: "Education", path: "/forms/education", icon: GraduationCap },
//     { name: "Financial", path: "/forms/financial", icon: Landmark },
//     { name: "Professional", path: "/forms/professional", icon: Briefcase },
//     { name: "Residential", path: "/forms/residential", icon: Home },
//     { name: "Documents", path: "/forms/documents", icon: FileText },
//     { name: "Mentor", path: "/forms/mentor", icon: UserCheck },
//     { name: "Final Review", path: "/forms/review", icon: CheckCircle },
//   ];

//   return (
//     <>
//       {/* ================= DESKTOP SIDEBAR ================= */}
//       <aside className="hidden md:block w-64 bg-white border-r border-slate-200 h-[calc(100vh-64px)] sticky top-16 p-4">
//         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
//           Form Navigation
//         </p>

//         <div className="flex flex-col gap-2">
//           {steps.map((step) => {
//             const Icon = step.icon;

//             const isActive =
//               location.pathname === step.path ||
//               location.pathname.startsWith(step.path);

//             return (
//               <Link
//                 key={step.path}
//                 to={step.path}
//                 className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
//                 ${
//                   isActive
//                     ? "bg-blue-50 text-blue-600 font-semibold"
//                     : "text-slate-600 hover:bg-slate-50"
//                 }`}
//               >
//                 <Icon className="w-4 h-4" />
//                 {step.name}
//               </Link>
//             );
//           })}
//         </div>
//       </aside>

//       {/* ================= MOBILE NAV ================= */}
//       <div className="md:hidden sticky top-14 z-40 bg-white border-b border-slate-200 overflow-x-auto">
//         <div className="flex gap-2 px-3 py-2 w-max">
//           {steps.map((step) => {
//             const Icon = step.icon;

//             const isActive =
//               location.pathname === step.path ||
//               location.pathname.startsWith(step.path);

//             return (
//               <Link
//                 key={step.path}
//                 to={step.path}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all
//                 ${
//                   isActive
//                     ? "bg-primary text-white"
//                     : "bg-slate-100 text-slate-600"
//                 }`}
//               >
//                 <Icon className="w-3.5 h-3.5" />
//                 {step.name}
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  GraduationCap,
  BookOpen,
  Phone,
  HeartPulse,
  Users,
  Landmark,
  Briefcase,
  Home,
  FileText,
  UserCheck,
  CheckCircle,
  Menu, // Hamburger icon
  X,    // Close icon
} from "lucide-react";

export default function FormSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Disable scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const steps = [
    { name: "Academic", path: "/forms/academic", icon: BookOpen },
    { name: "Personal", path: "/forms/personal", icon: User },
    { name: "Contact", path: "/forms/contact", icon: Phone },
    { name: "Health", path: "/forms/health", icon: HeartPulse },
    { name: "Family", path: "/forms/family", icon: Users },
    { name: "Education", path: "/forms/education", icon: GraduationCap },
    { name: "Financial", path: "/forms/financial", icon: Landmark },
    { name: "Professional", path: "/forms/professional", icon: Briefcase },
    { name: "Residential", path: "/forms/residential", icon: Home },
    { name: "Documents", path: "/forms/documents", icon: FileText },
    { name: "Mentor", path: "/forms/mentor", icon: UserCheck },
    { name: "Final Review", path: "/forms/review", icon: CheckCircle },
  ];

  const NavLinks = ({ mobile = false }) => (
    <div className="flex flex-col gap-1">
      {steps.map((step) => {
        const Icon = step.icon;
        const isActive =
          location.pathname === step.path ||
          location.pathname.startsWith(step.path);

        return (
          <Link
            key={step.path}
            to={step.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all
            ${
              isActive
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon className={mobile ? "w-5 h-5" : "w-4 h-4"} />
            {step.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* ================= MOBILE MENU BUTTON ================= */}
    <div className="md:hidden fixed top-15 left-0 right-0 z-[999] bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
<button
  onClick={() => setIsOpen(prev => !prev)}
  className="w-10 h-10 flex items-center justify-center rounded-lg
             hover:bg-slate-100 transition-colors duration-500 ease-in-out"
>
  <div
    className={`transition-all duration-300 ease-in-out ${
      isOpen ? "rotate-180 scale-95" : "rotate-0 scale-100"
    }`}
  >
    {isOpen ? <X size={22} /> : <Menu size={22} />}
  </div>
</button>

  <span className="text-sm font-bold text-slate-700">
    {steps.find(s => location.pathname.startsWith(s.path))?.name || "Form Navigation"}
  </span>

  <div className="w-8" />
</div>
      {/* ================= MOBILE DRAWER OVERLAY ================= */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= MOBILE SIDEBAR (DRAWER) ================= */}
    <aside
  className={`fixed top-16 left-0 z-[70] w-72 h-[calc(100vh-64px)] bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden
  ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Form Steps
          </p>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
      <div className="p-4 h-full overflow-y-auto">
          <NavLinks mobile />
        </div>
      </aside>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:block w-64 bg-white border-r border-slate-200 h-[calc(100vh-64px)] sticky top-16 p-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 ">
          Form Navigation
        </p>
        <NavLinks />
      </aside>
    </>
  );
}