import { useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function Toast({
  open,
  setOpen,
  type = "info",
  title,
  message,
}) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      setOpen(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [open, setOpen]);

  if (!open) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      color: "text-green-600",
      border: "border-green-500",
      progress: "bg-green-500",
    },
    error: {
      icon: XCircle,
      color: "text-red-600",
      border: "border-red-500",
      progress: "bg-red-500",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-yellow-500",
      border: "border-yellow-500",
      progress: "bg-yellow-500",
    },
    info: {
      icon: Info,
      color: "text-primary",
      border: "border-primary",
      progress: "bg-primary",
    },
  };

  const current = config[type] || config.info;
  const Icon = current.icon;

  return (
    <>
      <style>
        {`
          @keyframes toastSlideIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes toastProgress {
            from {
              width:100%;
            }
            to{
              width:0%;
            }
          }
        `}
      </style>

      <div
        className="
          fixed top-5 right-5
          z-[9999]
          w-[360px]
          max-w-[90vw]
          bg-white
          rounded-2xl
          shadow-2xl
          overflow-hidden
          border-l-4
        "
        style={{
          animation: "toastSlideIn .35s ease",
          borderLeftColor: "currentColor",
        }}
      >
        <div className={`flex items-start gap-3 p-4 ${current.color}`}>

          <Icon size={26} />

          <div className="flex-1">

            <h3 className="font-semibold text-slate-800">
              {title}
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              {message}
            </p>

          </div>

          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-slate-700 text-lg leading-none"
          >
            ×
          </button>

        </div>

        <div
          className={`h-1 ${current.progress}`}
          style={{
            animation: "toastProgress 2s linear forwards",
          }}
        />
      </div>
    </>
  );
}