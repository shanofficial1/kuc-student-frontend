// import React, { useState } from "react";
// import { Mail, ArrowLeft, Send } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [isSent, setIsSent] = useState(false);

//   const handleReset = (e) => {
//     e.preventDefault();
//     console.log("Password reset link sent to:", email);
//     setIsSent(true);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//         {/* Blue Header Strip */}
//         <div className="h-2 bg-primary w-full"></div>
        
//         <div className="p-8">
//           <header className="mb-8">
//             <h1 className="text-2xl font-bold text-slate-800">Forgot Password</h1>
//             <p className="text-slate-500 text-sm mt-2">
//               Enter your registered email address to receive a reset link.
//             </p>
//           </header>

//           {!isSent ? (
//             <form onSubmit={handleReset} className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
//                   <Mail size={16} className="text-primary" />
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="name@university.edu"
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
//               >
//                 Send Reset Link
//               </button>
//             </form>
//           ) : (
//             <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center animate-in zoom-in duration-300">
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Send className="text-green-600" size={24} />
//               </div>
//               <h3 className="text-green-800 font-bold text-lg">Check your email</h3>
//               <p className="text-green-700 text-sm mt-1">
//                 We have sent a link to <b>{email}</b>
//               </p>
//             </div>
//           )}

//           <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
//             <Link
//               to="/login"
//               className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
//             >
//               <ArrowLeft size={16} />
//               Back to Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useState } from "react";
import { Mail, ArrowLeft, ShieldCheck, Lock, ArrowRight, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordOTP() {
  // Step 1: 'request', Step 2: 'verify'
  const [step, setStep] = useState("request"); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRequestOTP = (e) => {
    e.preventDefault();
    // Logic: Send OTP to email
    console.log("OTP requested for:", email);
    setStep("verify");
    setError("");
  };

  const handleVerifyAndReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Logic: Verify OTP and update password
    console.log("Password reset successful with OTP:", otp);
    alert("Password reset successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Decorative Top Strip */}
        <div className="h-2 bg-primary w-full"></div>

        <div className="p-8">
          <header className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              {step === "request" ? <Mail size={32} /> : <ShieldCheck size={32} />}
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              {step === "request" ? "Forgot Password" : "Verify OTP"}
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              {step === "request" 
                ? "Enter your email to receive a 6-digit verification code." 
                : `We've sent a code to ${email}`}
            </p>
          </header>

          {step === "request" ? (
            /* STEP 1: REQUEST OTP */
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Send OTP
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            /* STEP 2: VERIFY OTP & RESET */
            <form onSubmit={handleVerifyAndReset} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <KeyRound size={16} className="text-primary" />
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary text-center tracking-[1em] font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Lock size={16} className="text-primary" />
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 font-medium text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Reset Password
              </button>

              <p className="text-center text-xs text-slate-500 mt-4">
                Didn't receive the code?{" "}
                <button type="button" className="text-primary font-bold hover:underline">
                  Resend OTP
                </button>
              </p>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}