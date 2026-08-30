import React, { useState } from "react";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  Send,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useStore } from "../store";

export default function ForgotPasswordPage() {

  const submitForgotPasswordRequest =
    useStore(
      s => s.submitForgotPasswordRequest
    );

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      await submitForgotPasswordRequest(email);

      setSuccess(true);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">

      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">

        <div className="h-2 bg-primary" />

        <div className="p-8">

          <div className="text-center mb-8">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-primary">

              <Mail size={30} />

            </div>

            <h2 className="text-2xl font-bold text-slate-800">

              Forgot Password

            </h2>

            <p className="mt-2 text-sm text-slate-500">

              Submit a password reset request using your registered email address.

            </p>

          </div>

          {!success ? (

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">

                  <Mail
                    size={16}
                    className="text-primary"
                  />

                  Registered Email

                </label>

                <input

                  type="email"

                  required

                  autoComplete="email"

                  value={email}

                  onChange={(e) =>
                    setEmail(e.target.value)
                  }

                  placeholder="student@university.edu"

                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"

                />

              </div>

              {error && (

                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">

                  {error}

                </div>

              )}

              <button

                disabled={loading}

                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"

              >

                <Send size={18} />

                {loading
                  ? "Submitting..."
                  : "Submit Request"}

              </button>

            </form>

          ) : (

            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">

              <ShieldCheck
                size={42}
                className="mx-auto mb-4 text-green-600"
              />

              <h3 className="text-lg font-bold text-green-700">

                Request Submitted

              </h3>

              <p className="mt-2 text-sm text-green-700">

                Your password reset request has been submitted successfully.

              </p>

              <p className="mt-3 text-xs text-slate-500">

                The administrator will verify your request and assign a temporary password.

              </p>

              <p className="mt-1 text-xs text-slate-500">

                You will be required to change your password after logging in.

              </p>

            </div>

          )}

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">

            <Link

              to="/login"

              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary"

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