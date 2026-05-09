import { useState } from "react";
import { useStore } from "../store";
import { Send, AlertCircle, ArrowLeft, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function RequestUnlockPage() {
  const store = useStore();
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSending(true);
    try {
      // Example API call to your backend
      // const response = await fetch("http://localhost:7002/api/request-unlock", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ 
      //     email: store.user?.email, 
      //     reason,
      //     studentName: store.personal.fullName 
      //   }),
      // });

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setStatus("success");
      setReason("");
    } catch (err) {
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-6 py-20">
      {/* BACK BUTTON */}
      <Link 
        to="/dashboard" 
        className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Request Form Unlock</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Your application is currently locked. If you need to correct any information, please provide a valid reason below for administrative review.
        </p>

        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl animate-in fade-in zoom-in duration-300">
            <p className="font-bold flex items-center gap-2 mb-1">
               Request Sent Successfully
            </p>
            <p className="text-sm">
              Admin will review your request. You will be notified via email once your form is unlocked.
            </p>
            <button 
              onClick={() => navigate("/dashboard")}
              className="mt-4 text-sm font-bold underline hover:no-underline"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                Reason for Correction
              </label>
              <textarea
                required
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                placeholder="Describe which section needs editing and why..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4" />
                Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={isSending || !reason.trim()}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                isSending || !reason.trim()
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-primary text-white hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
              }`}
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Unlock Request
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="mt-8 flex items-start gap-3 px-4">
        <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />
        <p className="text-xs text-slate-400 leading-relaxed">
          Requests are usually processed within 24-48 working hours. Multiple requests for the same correction may delay the process.
        </p>
      </div>
    </div>
  );
}