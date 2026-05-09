import { Link, useLocation } from "react-router-dom";
import { useStore } from "../store";
import { useState, useEffect, useRef } from "react";

import {
  UserCircle,
  LogOut,
  FileEdit,
  Key,
} from "lucide-react";

import logo from "../assets/logo.png";

export default function Navbar() {
  const location = useLocation(); // (optional: remove if unused)
  const logout = useStore((state) => state.logout);

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 👉 Replace later with real user from backend
  const user = {
    email: "student@test.com",
  };

  return (
    <header className="bg-white border-b border-border-subtle sticky top-0 z-50">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-4 md:px-6 h-16">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Kannur University SIS"
            className="h-8 md:h-10 w-auto object-contain"
          />
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 md:gap-4">

          {/* USER DROPDOWN */}
          <div className="relative" ref={ref}>

            {/* AVATAR BUTTON */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="p-2 text-primary hover:bg-slate-100 rounded-full transition-all"
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
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {user.email}
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
                    to="/grade-card"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <FileEdit className="w-4 h-4 text-yellow-600" />
                    My Gradecard
                  </Link>

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
  );
}