import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

export default function AppAlertDialog({
  open,
  setOpen,
  title,
  message,
  type = "info",
}) {
  if (!open) return null;

  const config = {
    success: {
      Icon: CheckCircle2,
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
    },
    error: {
      Icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
    },
    warning: {
      Icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
    info: {
      Icon: Info,
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
    },
  };

  const { Icon, iconBg, iconColor } = config[type];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">

      <div className="w-[420px] max-w-[92vw] rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300">

        <div className="flex flex-col items-center px-8 pt-8">

          <div
            className={`h-20 w-20 rounded-full ${iconBg} flex items-center justify-center animate-bounce`}
          >
            <Icon className={`${iconColor} h-11 w-11`} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-800">
            {title}
          </h2>

          <p className="mt-3 text-center text-slate-500">
            {message}
          </p>

          <button
            onClick={() => setOpen(false)}
            className="mt-8 mb-8 w-full rounded-xl bg-primary py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-95 active:scale-95"
          >
            OK
          </button>

        </div>

      </div>

    </div>
  );
}