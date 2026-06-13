// import React, { useState } from "react";
// import FormWrapper, { FormSection, InputField } from "../components/FormWrapper";
// import { Lock, ShieldCheck, AlertCircle } from "lucide-react";

// export default function ChangePassword() {
//   const [passwords, setPasswords] = useState({
//     current: "",
//     new: "",
//     confirm: "",
//   });
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setPasswords((prev) => ({ ...prev, [id]: value }));
//     if (error) setError(""); // Clear error when typing
//   };

//   const handleUpdate = () => {
//     if (passwords.new !== passwords.confirm) {
//       setError("New passwords do not match.");
//       return;
//     }
//     if (passwords.new.length < 8) {
//       setError("Password must be at least 8 characters long.");
//       return;
//     }
//     console.log("Password updated successfully");
//     // Logic to update password in backend
//   };

//   return (
//     <FormWrapper
//       title="Security Settings"
//       description="Update your password regularly to keep your account secure."
//       onSave={handleUpdate}
//     >
//       <FormSection title="Change Password" icon={Lock}>
//         <div className="md:col-span-2 space-y-4">
          
//           <InputField
//             label="Current Password"
//             id="current"
//             type="password"
//             required
//             value={passwords.current}
//             onChange={handleChange}
//             placeholder="••••••••"
//           />

//           <hr className="border-slate-100 my-2" />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <InputField
//               label="New Password"
//               id="new"
//               type="password"
//               required
//               value={passwords.new}
//               onChange={handleChange}
//               placeholder="Min. 8 characters"
//             />
//             <InputField
//               label="Confirm New Password"
//               id="confirm"
//               type="password"
//               required
//               value={passwords.confirm}
//               onChange={handleChange}
//               placeholder="Repeat new password"
//             />
//           </div>

//           {error && (
//             <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm animate-in fade-in">
//               <AlertCircle size={16} />
//               {error}
//             </div>
//           )}

//           <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
//             <ShieldCheck className="text-primary shrink-0" size={20} />
//             <div className="text-xs text-slate-600 leading-relaxed">
//               <p className="font-bold text-primary mb-1">Password Requirements:</p>
//               <ul className="list-disc ml-4 space-y-1">
//                 <li>Minimum 8 characters long</li>
//                 <li>Should contain at least one uppercase letter</li>
//                 <li>Include at least one number or special character</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </FormSection>
//     </FormWrapper>
//   );
// }







import React, { useState } from "react";
import { useStore } from "../store";
import { Lock, ShieldCheck, AlertCircle, Save } from "lucide-react";

export default function ChangePassword() {
  const token = useStore((s) => s.token);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPasswords((prev) => ({ ...prev, [id]: value }));
    if (error) setError("");
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    const isNewValid = passwordPattern.test(passwords.new);
    const isConfirmValid = passwordPattern.test(passwords.confirm);

    if (!isNewValid) {
      setError("New password must be at least 8 characters long and include both letters and numbers.");
      setSuccess(false);
      return;
    }

    if (!isConfirmValid) {
      setError("Confirm password must also be at least 8 characters long and include both letters and numbers.");
      setSuccess(false);
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setError("New password and confirm password do not match.");
      setSuccess(false);
      return;
    }

    const jsonPayload = {
      currentPassword: passwords.current,
      newPassword: passwords.new,
      token: token || "",
    };

    setPayload(jsonPayload);
    setLoading(true);
    setError("");

    try {
      const SERVER = import.meta.env.VITE_SERVER;
      const res = await fetch(`${SERVER}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonPayload),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Security Settings</h2>
            <p className="text-xs text-slate-500">Update your account password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Current Password</label>
            <input
              id="current"
              type="password"
              required
              value={passwords.current}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">New Password</label>
              <input
                id="new"
                type="password"
                required
                value={passwords.new}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Confirm New Password</label>
              <input
                id="confirm"
                type="password"
                required
                value={passwords.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-sm">
              <ShieldCheck size={16} />
              Password updated successfully!
            </div>
          )}

          <div className="bg-blue-50/50 p-4 rounded-xl flex gap-3 items-start border border-blue-100">
            <ShieldCheck className="text-primary shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-primary">Security Tip:</p>
              <p>Use at least 8 characters, including letters and numbers. Avoid using passwords from other sites.</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Updating password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}