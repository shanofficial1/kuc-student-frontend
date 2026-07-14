import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "../store";
import {
  ArrowLeft,
  Plus,
  Trash2,
  LockOpen,
  ClipboardList,
  LayoutGrid,
  Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { InputField, SelectField } from "../components/FormWrapper";

const StatusCard = ({ title, value, icon: Icon, className = "" }) => (
  <div className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 ${className}`}>
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        {Icon ? <Icon className="h-5 w-5" /> : null}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </p>
        <p className="mt-1 truncate text-xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

export default function RequestUnlockPage() {

  const store = useStore();
  const navigate = useNavigate();

  const [eligibility, setEligibility] = useState(null);
  const [pendingSuccessMessage, setPendingSuccessMessage] = useState("");


  // requestType values must match backend schema
  // - field_correction
  // - full_unlock
  const [requestType, setRequestType] = useState("field_correction");

  const [fieldCorrectionReason, setFieldCorrectionReason] = useState("");
  const [fullUnlockReason, setFullUnlockReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [fieldError, setFieldError] = useState("");


  const [corrections, setCorrections] = useState([
    {
      id: Date.now(),
      section: "",
      field: "",
      currentValue: "",
      requestedValue: "",
    },
  ]);

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null);

  const profileSnapshot = store.profileSnapshot;



  const maxSlots = eligibility?.maxSlots ?? 5;

const usedSlots =
  eligibility?.pendingCorrections ?? 0;

const availableSlots =
  eligibility?.availableSlots ??
  Math.max(0, maxSlots - usedSlots);

const canRequestFieldCorrection =
  eligibility?.canRequestFieldCorrection ?? true;

const canRequestFullUnlock =
  eligibility?.canRequestFullUnlock ?? true;

const fullUnlockActive =
  eligibility?.fullUnlockActive ?? false;

  const lockedFields = eligibility?.lockedFields ?? {};
  const isFieldLocked = (section, field) => {
    const key = normalizeLockedKey(section, field);
    if (!key) return false;
    return !!lockedFields?.[key];
  };


    const isFieldCorrectionLocked =
  usedSlots >= maxSlots;
  
  

  const selectedFieldsCount = corrections.filter(
    (c) => c.section && c.field
  ).length;

  const selectedCount = usedSlots + selectedFieldsCount;
  const remainingSlotsForNew = Math.max(0, availableSlots);

const isAddFieldDisabled =
  requestType !== "field_correction" ||
  selectedCount >= maxSlots;

const isSubmitDisabled =
  requestType === "field_correction"
    ? (
        isSending ||
        !canRequestFieldCorrection ||
        selectedFieldsCount === 0 ||
        selectedCount > maxSlots
      )
    : (
        isSending ||
        !canRequestFullUnlock ||
        fullUnlockActive
      );

const isFullUnlockSubmitDisabled =
  isSending ||
  !canRequestFullUnlock;


  const normalizeLockedKey = (section, field) => {
    const s = String(section || "").trim();
    const f = String(field || "").trim();
    if (!s || !f) return null;
    return `${s}.${f}`;
  };


  const formatLabel = (text) => {
    const result = String(text || "").replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const correctionCount = useMemo(
    () => corrections.filter((c) => c.section && c.field).length,
    [corrections]
  );


  const sectionOptions = useMemo(() => {
    if (!profileSnapshot || typeof profileSnapshot !== "object") return [];

    // Sections are objects (non-array) in profileSnapshot
    return Object.keys(profileSnapshot)
      .filter((key) => {
        const v = profileSnapshot[key];
        return v && typeof v === "object" && !Array.isArray(v);
      })
      .map((key) => ({
        label: formatLabel(key),
        value: key,
      }));
  }, [profileSnapshot]);

  const buildFieldOptions = (section) => {
    const sectionObj =
      profileSnapshot?.[section] && typeof profileSnapshot?.[section] === "object"
        ? profileSnapshot[section]
        : null;

    if (!sectionObj) return [];

    return Object.keys(sectionObj)
      .filter((k) => {
        const v = sectionObj[k];
        // Keep primitive values; ignore objects/arrays (uploaded lists etc.)
        return typeof v !== "object" || v === null || v instanceof Date;
      })
      .map((field) => ({
        label: formatLabel(field),
        value: field,
      }));
  };

  const loadEligibility = async () => {
    try {
      const result = await store.getRequestEligibility();
      setEligibility(result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
const addCorrection = () => {

  if (selectedCount >= maxSlots) {
    return;
  }

  setCorrections((prev) => [
    ...prev,
    {
      id: Date.now(),
      section: "",
      field: "",
      currentValue: "",
      requestedValue: "",
    },
  ]);

};
const handleSubmit = async () => {
  try {
    await submitFieldCorrectionRequest(
      corrections,
      remarks
    );

    alert("Field correction request submitted.");

  } catch (err) {
    alert(err.message);
  }
};
  const removeCorrection = (id) => {
    setCorrections((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCorrection = (id, key, value) => {
    setCorrections((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        if (key === "section") {
          return {
            ...c,
            section: value,
            field: "",
            currentValue: "",
            requestedValue: "",
          };
        }

        if (key === "field") {
          const curr = profileSnapshot?.[c.section]?.[value] ?? "";
          return {
            ...c,
            field: value,
            currentValue: curr ?? "",
            requestedValue: "",
          };
        }

        if (key === "requestedValue") {
          return { ...c, requestedValue: value };
        }

        return { ...c, [key]: value };
      })
    );
  };

  const refreshAllAfterRequest = async () => {
    await loadEligibility();
    try {
      await store.getMyUnlockRequests?.();
    } catch {
      // ignore
    }
    try {
      await store.getMyProfileRequests?.();
    } catch {
      // ignore
    }
  };

const handleRequestSubmit = async (e) => {
  console.log("handleRequestSubmit called");
  e.preventDefault();

  setReasonError("");
  setFieldError("");

  // =====================================
  // FIELD CORRECTION
  // =====================================

  if (requestType === "field_correction") {

    const validCorrections = corrections.filter(
      (c) =>
        c.section &&
        c.field &&
        String(c.requestedValue || "").trim()
    );

    if (validCorrections.length < 1) {
      setFieldError(
        "At least one correction field is required."
      );
      return;
    }

    if (!fieldCorrectionReason.trim()) {
      setReasonError("Reason is required.");
      return;
    }

  

    try {

      setIsSending(true);

  await store.submitFieldCorrectionRequest(
  validCorrections.map((c) => ({
    section: c.section,
    field: c.field,
    currentValue: c.currentValue ?? "",
    requestedValue: c.requestedValue,
  })),
  fieldCorrectionReason.trim()
);

      setStatus("success");

      setCorrections([
        {
          id: Date.now(),
          section: "",
          field: "",
          currentValue: "",
          requestedValue: "",
        },
      ]);

      setFieldCorrectionReason("");

      setFullUnlockReason("");

      await refreshAllAfterRequest();

    } catch (err) {

      console.log(err);

      alert(
        err?.message ||
        "Request failed"
      );

    } finally {

      setIsSending(false);

    }

    return;

  }

  // =====================================
  // FULL UNLOCK
  // =====================================

  if (!fullUnlockReason.trim()) {

    setReasonError(
      "Reason is required."
    );

    return;

  }


  

  try {

    setIsSending(true);

    await store.submitUnlockRequest(
      
    );

    setStatus("success");

    setCorrections([
      {
        id: Date.now(),
        section: "",
        field: "",
        currentValue: "",
        requestedValue: "",
      },
    ]);

    setFieldCorrectionReason("");

    setFullUnlockReason("");

    await refreshAllAfterRequest();

  } catch (err) {

    console.log(err);

    alert(
      err?.message ||
      "Request failed"
    );

  } finally {

    setIsSending(false);

  }

};
const showPendingFullUnlock =
    fullUnlockActive;

  return (


    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10">
      <Link
        to="/"
        className="flex items-center gap-2 text-slate-500 hover:text-[#003e7a] mb-6 transition-colors text-sm font-bold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-12 shadow-sm overflow-visible">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Request Unlock
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Choose what you want to unlock: request specific field corrections or unlock the entire form.
          </p>

          {/* Dashboard summary cards (eligibility) */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Pending Corrections
                  </p>
                  <p className="mt-1 truncate text-xl font-black text-slate-900">
                    {usedSlots}/{maxSlots}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Available Slots
                  </p>
                  <p className="mt-1 truncate text-xl font-black text-slate-900">
                    {availableSlots}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Full Unlock Status
                  </p>
                  <p className="mt-1 truncate text-xl font-black text-slate-900">
{fullUnlockActive
    ? "Unlock In Progress"
    : "No Active Unlock"}                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>


        {status === "success" ? (
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl animate-in fade-in zoom-in">
            <h2 className="text-emerald-800 font-black text-xl mb-2">
              Request Sent!
            </h2>
            <p className="text-emerald-700/80 text-sm mb-6">
              Your ticket has been logged. Admin usually reviews these within 24 hours.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="space-y-12">
            {/* SWITCHER */}
            <div className="grid grid-cols-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setRequestType("field_correction")}
                className={`
                  py-4 rounded-xl font-bold transition-all duration-200
                  ${
                    requestType === "field_correction"
                      ? "bg-white text-[#003e7a] shadow-md"
                      : "text-slate-500 hover:text-slate-700"
                  }
                `}
              >
                Specific Fields
              </button>

              <button
                type="button"
                onClick={() => setRequestType("full_unlock")}
                className={`
                  py-4 rounded-xl font-bold transition-all duration-200
                  ${
                    requestType === "full_unlock"
                      ? "bg-white text-[#003e7a] shadow-md"
                      : "text-slate-500 hover:text-slate-700"
                  }
                `}
              >

                Unlock Entire Form
              </button>
            </div>

            {requestType === "field_correction" ? (
              <div className="space-y-6">
                {fieldError && (
                  <div className="text-sm font-bold text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">
                    {fieldError}
                    {isFieldCorrectionLocked && (
  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-4 font-semibold">
    Maximum limit of 5 pending field corrections has been reached.
    Please wait until one of your requests is approved or rejected.
  </div>
)}
                  </div>
                )}

                {corrections.map((corr) => {
                  const availableFields = corr.section
                    ? buildFieldOptions(corr.section)
                    : [];

                  return (
                    <div
                      key={corr.id}
                      className="group p-6 md:p-8 bg-slate-50/50 border border-slate-200 rounded-[1.5rem] relative transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
                    >
                      {corrections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCorrection(corr.id)}
                          className="absolute -top-3 -right-3 bg-white border border-slate-200 text-slate-300 hover:text-red-500 hover:border-red-100 shadow-sm transition-all p-2 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="relative z-[100]">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                            Section
                          </label>
                          <SelectField
                            disabled={isFieldCorrectionLocked}
                            options={sectionOptions}
                            value={corr.section}
                            onChange={(e) =>
                              updateCorrection(corr.id, "section", e.target.value)
                            }
                            placeholder="Choose Category"
                          />
                        </div>

                        <div className="relative z-[90]">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                            Field
                          </label>
                          <SelectField
disabled={
  isFieldCorrectionLocked ||
  !corr.section
}                            options={availableFields
                              .filter((opt) => {
                                const isLocked = isFieldLocked(corr.section, opt.value);
                                const isCurrentlySelected = corr.field === opt.value;
                                return !isLocked || isCurrentlySelected;
                              })}
                            value={corr.field}
                            onChange={(e) =>
                              updateCorrection(corr.id, "field", e.target.value)
                            }
                            placeholder="Choose Entry"
                          />

                        </div>

                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                            Current Value
                          </label>
                          <div className="w-full bg-slate-100/80 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-500 font-bold italic truncate">
                            {corr.currentValue || "No existing data"}
                          </div>
                        </div>

                        <div>
                       
                       <InputField
  label="New Value"
  id={`requested-value-${corr.id}`}
  required
  disabled={isFieldCorrectionLocked}
  alwaysEnabled={!isFieldCorrectionLocked}
  value={corr.requestedValue}
  onChange={(e) =>
    updateCorrection(
      corr.id,
      "requestedValue",
      e.target.value
    )
  }
  placeholder="Type correct value here..."
/>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {corrections.length < 5 && (
                  <button
                    type="button"
                    onClick={addCorrection }
disabled={isAddFieldDisabled}
                    className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-slate-400 text-sm font-black uppercase tracking-widest hover:border-[#003e7a] hover:text-[#003e7a] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" /> Add Another Field
                  </button>
                )}


                <InputField
                  label="Reason for Change"
                    disabled={isFieldCorrectionLocked}
                  id="reason-change"
                  required
                  alwaysEnabled={!isFieldCorrectionLocked}
                  placeholder="Explain why this correction is needed"
                  value={fieldCorrectionReason}
                  onChange={(e) => setFieldCorrectionReason(e.target.value)}
                />


                {reasonError && (
                  <div className="text-sm font-bold text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">
                    {reasonError}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="py-16 bg-[#003e7a]/[0.02] border-2 border-dashed border-[#003e7a]/10 rounded-[2rem] flex flex-col items-center text-center px-6">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-900/5 mb-6">
                    <LockOpen className="w-10 h-10 text-[#003e7a]" />
                  </div>
                  <h3 className="font-black text-slate-900 text-xl">
                    Unlock Entire Form
                  </h3>
                  <p className="text-sm text-slate-500 mt-3 max-w-[420px] font-medium leading-relaxed">
                    Request a full unlock to make changes across multiple sections.
                  </p>
                </div>

                <InputField
                  label="Reason for Unlocking Entire Form"
                  id="reason-full"
                  required
                  alwaysEnabled 
                  placeholder="Need to update multiple sections, replace documents, etc."
                  value={fullUnlockReason}
                  onChange={(e) => setFullUnlockReason(e.target.value)}
                />


                {reasonError && (
                  <div className="text-sm font-bold text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">
                    {reasonError}
                  </div>
                )}
              </div>
            )}

            {/* Summary + submit */}
            <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-slate-400">
                {requestType === "field_correction" ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
                    <p className="font-semibold text-blue-700">
                      Selected Corrections: {usedSlots + selectedFieldsCount} of {maxSlots}
                    </p>
                    <p className="text-blue-600 mt-1">
                      {availableSlots === 0
                        ? "Maximum correction limit reached."
                        : "Select up to remaining available slots."}
                    </p>
                  </div>
                ) : (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm">
                    <p className="font-semibold text-indigo-700">
                      Unlock Entire Form Request
                    </p>
                    <p className="text-indigo-600 mt-1">
                      Unlock the entire profile for editing.
                    </p>
                  </div>
                )}

              </div>

              <div className="w-full md:w-auto">
                {showPendingFullUnlock && requestType === "full_unlock" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700 mb-4">
                    <p className="font-black mb-2">Existing Request</p>
                    <div className="space-y-1">
                      <p>
                        <span className="font-bold">Request No:</span>{" "}
                        {eligibility?.pendingUnlock?.requestNumber || eligibility?.pendingUnlock?.requestNo || "-"}
                      </p>
                      <p>
                        <span className="font-bold">Status:</span>{" "}
                        {eligibility?.pendingUnlock?.status || "Pending"}
                      </p>
                      <p>
                        <span className="font-bold">Submitted Date:</span>{" "}
                        {eligibility?.pendingUnlock?.submittedDate || eligibility?.pendingUnlock?.createdAt || "-"}
                      </p>
                      <p>
                        <span className="font-bold">Type:</span>{" "}
                        Full Unlock
                      </p>
                    </div>
                    <p className="mt-3 text-yellow-700/90">
                      Your request is awaiting administrator review.
                    </p>
                  </div>
                )}


                <button
                  type="submit"
          disabled={
  requestType === "field_correction"
    ? (
        isFieldCorrectionLocked ||
        isSubmitDisabled
      )
    : isFullUnlockSubmitDisabled
}
                  className="w-full md:w-auto bg-[#003e7a] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSending ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

