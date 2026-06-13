import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  CreditCard,
  FileEdit,
  FileText,
  GraduationCap,
  HeartPulse,
  History,
  Home,
  Lock,
  Phone,
  School,
  ShieldCheck,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { useStore } from "../store";

function StatusPill({ status }) {
  const styles = {
    Verified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    "Not Started": "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${
        styles[status] || styles["Not Started"]
      }`}
    >
      {status}
    </span>
  );
}

function MetricCard({ icon: Icon, label, value, tone = "slate" }) {
  const tones = {
    blue: "bg-blue-50 text-primary",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-1 truncate text-2xl font-black text-slate-950">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionLink({ to, icon: Icon, children, primary }) {
  return (
    <Link
      to={to}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition active:scale-[0.98] ${
        primary
          ? "bg-primary text-white shadow-lg shadow-blue-900/10 hover:bg-primary-container"
          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-primary"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}

function NoticeCard({ isSubmitted, editStatus }) {
  const content = !isSubmitted
    ? {
        title: "Complete and review your profile",
        body: "Fill each profile module carefully. You can still edit details before final submission.",
        icon: ClipboardCheck,
        className: "bg-blue-50 text-primary ring-blue-100",
      }
    : editStatus === "approved"
    ? {
        title: "Editing is enabled",
        body: "Your edit access is active. Update the needed sections and review before submitting again.",
        icon: CheckCircle2,
        className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      }
    : editStatus === "pending"
    ? {
        title: "Edit request pending",
        body: "Your correction request is under review. Fields remain locked until approval.",
        icon: Clock,
        className: "bg-amber-50 text-amber-700 ring-amber-100",
      }
    : {
        title: "Application submitted and locked",
        body: "Need to correct a submitted detail? Use Request Edit to ask for access.",
        icon: Lock,
        className: "bg-amber-50 text-amber-700 ring-amber-100",
      };

  const Icon = content.icon;

  return (
    <section className={`rounded-lg p-4 ring-1 ${content.className}`}>
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/70">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-black text-slate-950">{content.title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{content.body}</p>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
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
  const logout = useStore((state) => state.logout);
  const setProfileData = useStore((s) => s.setProfileData);
  const token = useStore((state) => state.token);
  const navigate = useNavigate();
  const SERVER = import.meta.env.VITE_SERVER;

  const editStatus = "none";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      logout();
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await axios.get(`${SERVER}/api/student/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileData(res.data.data);
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!academic || Object.keys(academic).length === 0) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const getStatus = (section) => {
    if (!section) return "Not Started";

    const values = Object.values(section);
    const filled = values.some((value) => value);
    const complete = values.every((value) => value);

    if (!filled) return "Not Started";
    if (!complete) return "Pending";

    return "Verified";
  };

  const modules = useMemo(
    () => [
      { id: "academic", title: "Academic details", icon: School, data: academic, path: "/forms/academic" },
      { id: "personal", title: "Personal details", icon: User, data: personal, path: "/forms/personal" },
      { id: "contact", title: "Contact details", icon: Phone, data: contact, path: "/forms/contact" },
      { id: "health", title: "Health details", icon: HeartPulse, data: health, path: "/forms/health" },
      { id: "family", title: "Family details", icon: Users, data: family, path: "/forms/family" },
      { id: "education", title: "Education details", icon: GraduationCap, data: education, path: "/forms/education" },
      { id: "financial", title: "Financial details", icon: CreditCard, data: financial, path: "/forms/financial" },
      { id: "professional", title: "Professional details", icon: Briefcase, data: professional, path: "/forms/professional" },
      { id: "residential", title: "Residential details", icon: Home, data: residential, path: "/forms/residential" },
      { id: "documents", title: "Documents uploads", icon: FileText, data: documents, path: "/forms/documents" },
      { id: "mentor", title: "Mentor details", icon: UserCheck, data: mentor, path: "/forms/mentor" },
    ],
    [
      academic,
      personal,
      contact,
      health,
      family,
      education,
      financial,
      professional,
      residential,
      documents,
      mentor,
    ]
  );

  const total = modules.length;
  const completed = modules.filter((module) => getStatus(module.data) === "Verified").length;
  const pending = modules.filter((module) => getStatus(module.data) === "Pending").length;
  const progress = Math.round((completed / total) * 100);

  const applicationStatus = !isSubmitted
    ? "In Progress"
    : editStatus === "pending"
    ? "Edit Request Pending"
    : editStatus === "approved"
    ? "Editing Enabled"
    : "Submitted & Locked";

  const primaryAction = !isSubmitted
    ? { to: "/forms/personal", label: "Continue Profile", icon: ArrowRight }
    : editStatus === "approved"
    ? { to: "/forms/personal", label: "Edit Profile", icon: FileEdit }
    : { to: "/request", label: "Request Edit", icon: FileEdit };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-6xl items-center justify-center px-4">
        <div className="rounded-lg bg-white px-5 py-4 text-sm font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-1 py-2 sm:px-3 md:py-6">
      <div className="sticky top-16 z-30 -mx-3 bg-surface-background/95 px-4 py-3 shadow-sm backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
              Student dashboard
            </p>
            <h1 className="truncate text-xl font-black text-slate-950 sm:text-3xl">
              Welcome back
            </h1>
          </div>
          <Link
            to="/forms/review"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm shadow-blue-900/10 transition hover:bg-primary-container"
          >
            <ShieldCheck className="h-4 w-4" />
            Review
          </Link>
        </div>
      </div>

      <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              <Clock className="h-3.5 w-3.5" />
              {applicationStatus}
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Profile completion is at {progress}%
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Review your profile modules, complete missing information, and submit the final application when everything is ready.
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Profile Completion</span>
              <span className="text-sm font-black text-primary">{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
                <p className="text-lg font-black text-slate-950">{completed}</p>
                <p className="text-[11px] font-bold text-slate-500">Done</p>
              </div>
              <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
                <p className="text-lg font-black text-amber-700">{pending}</p>
                <p className="text-[11px] font-bold text-slate-500">Pending</p>
              </div>
              <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
                <p className="text-lg font-black text-slate-950">{total}</p>
                <p className="text-[11px] font-bold text-slate-500">Total</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={CheckCircle2} label="Completed" value={completed} tone="emerald" />
        <MetricCard icon={AlertCircle} label="Needs Attention" value={pending} tone="amber" />
        <MetricCard icon={FileText} label="Profile Modules" value={total} tone="blue" />
        <MetricCard icon={ShieldCheck} label="Status" value={applicationStatus} tone="slate" />
      </div>

      <NoticeCard isSubmitted={isSubmitted} editStatus={editStatus} />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ActionLink to={primaryAction.to} icon={primaryAction.icon} primary>
          {primaryAction.label}
        </ActionLink>
        <ActionLink to="/forms/review" icon={ShieldCheck}>
          Final Review
        </ActionLink>
        <ActionLink to="/request" icon={FileEdit}>
          Request Edit
        </ActionLink>
        <ActionLink to="/request-history" icon={History}>
          Request History
        </ActionLink>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-950">Information Details</h2>
            <p className="mt-1 text-sm text-slate-500">Open a module to review or update its details.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            const status = getStatus(module.data);

            return (
              <Link
                key={module.id}
                to={module.path}
                className="group rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-slate-900">{module.title}</h3>
                      <StatusPill status={status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {status === "Verified"
                        ? "All required details are filled."
                        : status === "Pending"
                        ? "Some information still needs attention."
                        : "Start this profile section."}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10 sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black">Final Application Review</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Check the full profile, documents, and declaration before submitting your application.
            </p>
          </div>
          <Link
            to="/forms/review"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-primary transition hover:bg-blue-50 active:scale-[0.98]"
          >
            Review & Submit
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
