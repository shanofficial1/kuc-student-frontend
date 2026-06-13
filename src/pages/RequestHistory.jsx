import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Hash,
  Tag,
  X,
  XCircle,
} from "lucide-react";
import { useStore } from "../store";
import { cn } from "../lib/utils";

const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    icon: CheckCircle,
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 white:bg-emerald-500/10 white:text-emerald-300 white:ring-emerald-500/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className:
      "bg-rose-50 text-rose-700 ring-rose-200 white:bg-rose-500/10 white:text-rose-300 white:ring-rose-500/20",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className:
      "bg-amber-50 text-amber-700 ring-amber-200 white:bg-amber-500/10 white:text-amber-300 white:ring-amber-500/20",
  },
};

const CATEGORY_CONFIG = {
  "Profile Update": "bg-blue-50 text-blue-700 ring-blue-200 white:bg-blue-500/10 white:text-blue-300 white:ring-blue-500/20",
  "Field Correction":
    "bg-violet-50 text-violet-700 ring-violet-200 white:bg-violet-500/10 white:text-violet-300 white:ring-violet-500/20",
  "Full Unlock":
    "bg-orange-50 text-orange-700 ring-orange-200 white:bg-orange-500/10 white:text-orange-300 white:ring-orange-500/20",
};

const normalizeList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.requests)) return response.requests;
  return [];
};

const formatLabel = (value) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) return formatDate(value);
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not provided";
  return String(value);
};

const isPlainObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

const getStatusKey = (status) => String(status || "pending").toLowerCase();

const getRequestReason = (request) =>
  request?.remarks || request?.reason || request?.message || "-";

const getDetailTitle = (request) => {
  if (request?.category === "Profile Update") return "Submitted Changes";
  if (request?.category === "Field Correction") return "Requested Corrections";
  return "Unlock Request";
};

function StatusBadge({ status }) {
  const key = getStatusKey(status);
  const config = STATUS_CONFIG[key] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset",
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{config.label}</span>
    </span>
  );
}

function CategoryBadge({ category }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset",
        CATEGORY_CONFIG[category] ||
          "bg-slate-100 text-slate-700 ring-slate-200 white:bg-slate-800 white:text-slate-300 white:ring-slate-700"
      )}
    >
      <span className="truncate">{category || "Request"}</span>
    </span>
  );
}

function SummaryTile({ icon: Icon, label, value, className }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 white:bg-slate-950 white:ring-slate-800">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 white:bg-slate-900 white:text-slate-300",
            className
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 white:text-slate-400">
            {label}
          </p>
          <p className="mt-1 truncate text-lg font-bold text-slate-900 white:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value, accent }) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-4 white:bg-slate-900/70">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 white:text-slate-400">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 break-words text-sm font-semibold leading-6 text-slate-800 white:text-slate-100",
          accent
        )}
      >
        {formatValue(value)}
      </p>
    </div>
  );
}

function NestedValue({ label, value }) {
  if (Array.isArray(value)) {
    if (!value.length) {
      return <DetailField label={formatLabel(label)} value="Not provided" />;
    }

    const hasObjects = value.some((item) => isPlainObject(item));

    if (!hasObjects) {
      return <DetailField label={formatLabel(label)} value={value.join(", ")} />;
    }

    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 white:bg-slate-950 white:ring-slate-800">
        <h5 className="text-sm font-bold text-slate-900 white:text-white">
          {formatLabel(label)}
        </h5>
        <div className="mt-4 space-y-3">
          {value.map((item, index) => (
            <div
              key={`${label}-${index}`}
              className="rounded-xl bg-slate-50 p-4 white:bg-slate-900/70"
            >
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Item {index + 1}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {isPlainObject(item) ? (
                  Object.entries(item).map(([childKey, childValue]) => (
                    <NestedValue
                      key={`${label}-${index}-${childKey}`}
                      label={childKey}
                      value={childValue}
                    />
                  ))
                ) : (
                  <DetailField label="Value" value={item} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isPlainObject(value)) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 white:bg-slate-950 white:ring-slate-800">
        <h5 className="text-sm font-bold text-slate-900 white:text-white">
          {formatLabel(label)}
        </h5>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.entries(value).map(([childKey, childValue]) => (
            <NestedValue key={childKey} label={childKey} value={childValue} />
          ))}
        </div>
      </div>
    );
  }

  return <DetailField label={formatLabel(label)} value={value} />;
}

function RequestHistoryCard({ request, onView }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md white:bg-slate-950 white:ring-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 white:text-slate-400">
            Request No
          </p>
          <h3 className="mt-1 break-words text-base font-bold text-slate-900 white:text-white">
            {request.requestNo || "Not assigned"}
          </h3>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <CategoryBadge category={request.category} />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 white:bg-slate-900 white:text-slate-300">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(request.createdAt)}
        </span>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3 white:bg-slate-900/70">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 white:text-slate-400">
          Reason
        </p>
        <p className="mt-1 break-words text-sm leading-6 text-slate-700 white:text-slate-200">
          {getRequestReason(request)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onView(request)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm shadow-blue-900/10 transition hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 white:focus:ring-offset-slate-950"
      >
        <Eye className="h-4 w-4" />
        View details
      </button>
    </article>
  );
}

function RequestHistoryTable({ requests, onView }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 white:bg-slate-950 white:ring-slate-800 lg:block">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-[18%]" />
          <col className="w-[18%]" />
          <col className="w-[14%]" />
          <col className="w-[14%]" />
          <col className="w-[24%]" />
          <col className="w-[12%]" />
        </colgroup>
        <thead className="bg-slate-50/80 white:bg-slate-900/80">
          <tr>
            {["Request No", "Type", "Date", "Status", "Reason", "Action"].map(
              (heading) => (
                <th
                  key={heading}
                  className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 white:text-slate-400"
                >
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 white:divide-slate-800">
          {requests.map((request, index) => (
            <tr
              key={request._id || request.requestNo || index}
              className="transition hover:bg-blue-50/40 white:hover:bg-slate-900/70"
            >
              <td className="px-5 py-5 align-top">
                <p className="break-words text-sm font-bold text-slate-900 white:text-white">
                  {request.requestNo || "Not assigned"}
                </p>
              </td>
              <td className="px-5 py-5 align-top">
                <CategoryBadge category={request.category} />
              </td>
              <td className="px-5 py-5 align-top text-sm font-medium text-slate-600 white:text-slate-300">
                {formatDate(request.createdAt)}
              </td>
              <td className="px-5 py-5 align-top">
                <StatusBadge status={request.status} />
              </td>
              <td className="px-5 py-5 align-top">
                <p className="line-clamp-2 break-words text-sm leading-6 text-slate-600 white:text-slate-300">
                  {getRequestReason(request)}
                </p>
              </td>
              <td className="px-5 py-5 align-top">
                <button
                  type="button"
                  onClick={() => onView(request)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-primary transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 white:bg-blue-500/10 white:text-blue-300 white:hover:bg-blue-500/20 white:focus:ring-offset-slate-950"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RequestDetailModal({ request, isClosing, onClose }) {
  const statusKey = getStatusKey(request.status);
  const detailTitle = getDetailTitle(request);
  const correctionFields = request.correctionFields || [];
  const changeEntries = Object.entries(request.changes || {});
  const hasProfileChanges = changeEntries.length > 0;

  return (
    <div
      className="request-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      data-closing={isClosing}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-detail-title"
        className="request-modal-panel flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-slate-50 shadow-2xl white:bg-slate-950 sm:max-h-[88vh] sm:max-w-5xl sm:rounded-3xl"
        data-closing={isClosing}
      >
        <header className="flex items-start justify-between gap-4 bg-white/95 px-4 py-4 shadow-sm shadow-slate-900/5 backdrop-blur white:bg-slate-950/95 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-2">
              <CategoryBadge category={request.category} />
              <StatusBadge status={request.status} />
            </div>
            <h2
              id="request-detail-title"
              className="break-words text-xl font-black tracking-tight text-slate-950 white:text-white sm:text-2xl"
            >
              {detailTitle}
            </h2>
            <p className="mt-1 break-words text-sm text-slate-500 white:text-slate-400">
              {request.requestNo || "Request number not assigned"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary white:bg-slate-900 white:text-slate-300 white:hover:bg-slate-800 white:hover:text-white"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryTile
              icon={Hash}
              label="Request No"
              value={request.requestNo || "Not assigned"}
              className="bg-blue-50 text-primary white:bg-blue-500/10 white:text-blue-300"
            />
            <SummaryTile
              icon={Tag}
              label="Type"
              value={request.category || "Request"}
              className="bg-violet-50 text-violet-700 white:bg-violet-500/10 white:text-violet-300"
            />
            <SummaryTile
              icon={CalendarDays}
              label="Submitted"
              value={formatDateTime(request.createdAt)}
              className="bg-slate-100 text-slate-700 white:bg-slate-900 white:text-slate-300"
            />
            <SummaryTile
              icon={STATUS_CONFIG[statusKey]?.icon || Clock}
              label="Status"
              value={STATUS_CONFIG[statusKey]?.label || "Pending"}
              className="bg-emerald-50 text-emerald-700 white:bg-emerald-500/10 white:text-emerald-300"
            />
          </div>

          <section className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 white:bg-slate-950 white:ring-slate-800 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 white:text-slate-400">
              Reason or remarks
            </p>
            <p className="mt-2 break-words text-sm leading-6 text-slate-700 white:text-slate-200">
              {getRequestReason(request)}
            </p>
          </section>

          {statusKey === "rejected" && getRequestReason(request) !== "-" && (
            <section className="mt-5 flex gap-3 rounded-2xl bg-rose-50 p-4 text-rose-800 shadow-sm ring-1 ring-rose-100 white:bg-rose-500/10 white:text-rose-200 white:ring-rose-500/20">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">Rejection reason</p>
                <p className="mt-1 break-words text-sm leading-6">
                  {getRequestReason(request)}
                </p>
              </div>
            </section>
          )}

          <section className="mt-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primary white:bg-blue-500/10 white:text-blue-300">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950 white:text-white">
                  {detailTitle}
                </h3>
                <p className="text-sm text-slate-500 white:text-slate-400">
                  Review the submitted request information.
                </p>
              </div>
            </div>

            {request.requestType === "field_correction" ? (
              correctionFields.length ? (
                <div className="space-y-4">
                  {correctionFields.map((item, index) => (
                    <article
                      key={`${item.section}-${item.field}-${index}`}
                      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 white:bg-slate-950 white:ring-slate-800 sm:p-5"
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h4 className="break-words text-sm font-black uppercase tracking-wide text-slate-900 white:text-white">
                          {formatLabel(item.section || `Correction ${index + 1}`)}
                        </h4>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 white:bg-slate-900 white:text-slate-300">
                          Field {index + 1}
                        </span>
                      </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <DetailField label="Field" value={formatLabel(item.field)} />
                        <DetailField
                          label="Current value"
                          value={item.currentValue}
                          accent="text-rose-700 white:text-rose-300"
                        />
                        <DetailField
                          label="Requested value"
                          value={item.requestedValue}
                          accent="text-emerald-700 white:text-emerald-300"
                        />
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/70 white:bg-slate-950 white:text-slate-400 white:ring-slate-800">
                  No field corrections were included with this request.
                </div>
              )
            ) : hasProfileChanges ? (
              <div className="space-y-4">
                {changeEntries.map(([section, values]) => (
                  <article
                    key={section}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 white:bg-slate-950 white:ring-slate-800 sm:p-5"
                  >
                    <h4 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-900 white:text-white">
                      {formatLabel(section)}
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {isPlainObject(values) ? (
                        Object.entries(values).map(([key, value]) => (
                          <NestedValue key={key} label={key} value={value} />
                        ))
                      ) : (
                        <NestedValue label={section} value={values} />
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-6 text-sm leading-6 text-slate-600 shadow-sm ring-1 ring-slate-200/70 white:bg-slate-950 white:text-slate-300 white:ring-slate-800">
                This request asks for the profile to be unlocked. No individual
                field changes were attached.
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}

export default function RequestHistory() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const closingTimerRef = useRef(null);

  const getMyProfileRequests = useStore((s) => s.getMyProfileRequests);
  const getMyUnlockRequests = useStore((s) => s.getMyUnlockRequests);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);

      const [profileResponse, unlockResponse] = await Promise.all([
        getMyProfileRequests(),
        getMyUnlockRequests(),
      ]);

      const profileRequests = normalizeList(profileResponse);
      const unlockRequests = normalizeList(unlockResponse);

      const merged = [
        ...profileRequests.map((item) => ({
          ...item,
          category: "Profile Update",
        })),
        ...unlockRequests.map((item) => ({
          ...item,
          category:
            item.requestType === "field_correction"
              ? "Field Correction"
              : "Full Unlock",
        })),
      ];

      merged.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      setRequests(merged);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getMyProfileRequests, getMyUnlockRequests]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(
    () => () => {
      if (closingTimerRef.current) {
        window.clearTimeout(closingTimerRef.current);
      }
    },
    []
  );

  const closeModal = useCallback(() => {
    if (isModalClosing) return;

    setIsModalClosing(true);
    closingTimerRef.current = window.setTimeout(() => {
      setSelectedRequest(null);
      setIsModalClosing(false);
    }, 160);
  }, [isModalClosing]);

  useEffect(() => {
    if (!selectedRequest) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, selectedRequest]);

  const stats = useMemo(() => {
    const total = requests.length;
    const approved = requests.filter(
      (request) => getStatusKey(request.status) === "approved"
    ).length;
    const rejected = requests.filter(
      (request) => getStatusKey(request.status) === "rejected"
    ).length;
    const pending = total - approved - rejected;

    return { total, approved, rejected, pending };
  }, [requests]);

  const openRequest = (request) => {
    if (closingTimerRef.current) {
      window.clearTimeout(closingTimerRef.current);
    }
    setIsModalClosing(false);
    setSelectedRequest(request);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 px-0 py-2 sm:space-y-6 sm:px-2 md:py-4">
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/80 white:bg-slate-950 white:ring-slate-800">
        <div className="bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4 py-5 white:from-blue-500/10 white:via-slate-950 white:to-slate-950 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-blue-900/15">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/70 white:text-blue-300">
                  Request center
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 white:text-white sm:text-3xl">
                  My Requests
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 white:text-slate-300">
                  Track profile updates, field corrections, and unlock requests
                  submitted for verification.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[440px]">
              <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-slate-200/70 backdrop-blur white:bg-slate-900/70 white:ring-slate-800">
                <p className="text-[11px] font-bold uppercase text-slate-500 white:text-slate-400">
                  Total
                </p>
                <p className="mt-1 text-xl font-black text-slate-950 white:text-white">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-amber-100 backdrop-blur white:bg-slate-900/70 white:ring-amber-500/20">
                <p className="text-[11px] font-bold uppercase text-amber-700 white:text-amber-300">
                  Pending
                </p>
                <p className="mt-1 text-xl font-black text-amber-700 white:text-amber-300">
                  {stats.pending}
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-emerald-100 backdrop-blur white:bg-slate-900/70 white:ring-emerald-500/20">
                <p className="text-[11px] font-bold uppercase text-emerald-700 white:text-emerald-300">
                  Approved
                </p>
                <p className="mt-1 text-xl font-black text-emerald-700 white:text-emerald-300">
                  {stats.approved}
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-rose-100 backdrop-blur white:bg-slate-900/70 white:ring-rose-500/20">
                <p className="text-[11px] font-bold uppercase text-rose-700 white:text-rose-300">
                  Rejected
                </p>
                <p className="mt-1 text-xl font-black text-rose-700 white:text-rose-300">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-6">
          {loading ? (
            <div className="flex min-h-56 items-center justify-center rounded-2xl bg-slate-50 text-sm font-semibold text-slate-500 white:bg-slate-900/60 white:text-slate-400">
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl bg-slate-50 px-4 text-center white:bg-slate-900/60">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm white:bg-slate-950 white:text-slate-600">
                <FileText className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-black text-slate-900 white:text-white">
                No requests submitted yet
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 white:text-slate-400">
                Your submitted profile update and unlock requests will appear here.
              </p>
            </div>
          ) : (
            <>
              <RequestHistoryTable requests={requests} onView={openRequest} />
              <div className="grid gap-4 lg:hidden">
                {requests.map((request, index) => (
                  <RequestHistoryCard
                    key={request._id || request.requestNo || index}
                    request={request}
                    onView={openRequest}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          isClosing={isModalClosing}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
