import React, { useEffect, useState } from "react";
import {
FileText,
Eye,
Clock,
CheckCircle,
XCircle,
AlertCircle,
} from "lucide-react";
import { useStore } from "../store";

export default function RequestHistory() {
const token = useStore((s) => s.token);

const [requests, setRequests] = useState([]);
const [selectedRequest, setSelectedRequest] = useState(null);
const [loading, setLoading] = useState(true);
const getMyProfileRequests =
  useStore(
    s => s.getMyProfileRequests
  );

const getMyUnlockRequests =
  useStore(
    s => s.getMyUnlockRequests
  );

useEffect(() => {
fetchRequests();
}, []);

const fetchRequests = async () => {

  try {

    setLoading(true);

    const [
      profileRequests,
      unlockRequests
    ] = await Promise.all([

      getMyProfileRequests(),

      getMyUnlockRequests()

    ]);

    const merged = [

      ...(profileRequests || [])
      .map(item => ({

        ...item,

        category:
          "Profile Update"

      })),

      ...(unlockRequests || [])
      .map(item => ({

        ...item,

        category:
          item.requestType ===
          "field_correction"

          ? "Field Correction"

          : "Full Unlock"

      }))

    ];

    merged.sort(
      (a, b) =>
        new Date(
          b.createdAt
        ) -
        new Date(
          a.createdAt
        )
    );

    setRequests(merged);

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }

};

const getStatusBadge = (status) => {
switch (status) {
case "approved":
return ( <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"> <CheckCircle size={14} />
Approved </span>
);

  case "rejected":
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
        <XCircle size={14} />
        Rejected
      </span>
    );

  default:
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
        <Clock size={14} />
        Pending
      </span>
    );
}

};

const renderObject = (obj) => {

  return Object.entries(obj).map(
    ([key, value]) => {

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {

        return (
          <div
            key={key}
            className="mb-4"
          >
            <h5 className="font-semibold capitalize">
              {key.replaceAll("_", " ")}
            </h5>

            <div className="grid md:grid-cols-2 gap-3 mt-2">

              {Object.entries(value).map(
                ([k, v]) => (

                  <div
                    key={k}
                    className="bg-slate-50 p-3 rounded-lg"
                  >
                    <p className="text-xs text-slate-500 capitalize">
                      {k}
                    </p>

                    <p className="font-medium">
                      {String(v)}
                    </p>
                  </div>

                )
              )}

            </div>
          </div>
        );

      }

      return (
        <div
          key={key}
          className="bg-slate-50 p-3 rounded-lg"
        >
          <p className="text-xs text-slate-500 capitalize">
            {key.replaceAll("_", " ")}
          </p>

          <p className="font-medium">
            {String(value)}
          </p>
        </div>
      );

    }
  );

};

return ( <div className="max-w-7xl mx-auto p-6">

  <div className="bg-white rounded-2xl shadow-sm border border-slate-200">

    <div className="p-6 border-b border-slate-100 flex items-center gap-3">

      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
        <FileText size={20} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800">
          My Requests
        </h2>

        <p className="text-xs text-slate-500">
          View all profile update requests submitted for verification
        </p>
      </div>

    </div>

    <div className="p-6">

      {loading ? (

        <div className="text-center py-10 text-slate-500">
          Loading requests...
        </div>

      ) : requests.length === 0 ? (

        <div className="text-center py-12">

          <FileText
            size={40}
            className="mx-auto text-slate-300 mb-3"
          />

          <p className="text-slate-500">
            No requests submitted yet
          </p>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-200 text-left">

                <th className="py-3 text-sm font-semibold text-slate-600">
                  Request No
                </th>
                <th>Type</th>

                <th className="py-3 text-sm font-semibold text-slate-600">
                  Date
                </th>

                <th className="py-3 text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="py-3 text-sm font-semibold text-slate-600">
                  Reason
                </th>

                <th className="py-3 text-sm font-semibold text-slate-600">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {requests.map((request) => (

                <tr
                  key={request._id}
                  className="border-b border-slate-100"
                >

                  <td className="py-4 font-medium text-slate-800">
                    {request.requestNo}
                  </td>
                  <td className="py-4">

  <span
    className={`
      px-3 py-1 rounded-full text-xs font-semibold

      ${
        request.category ===
        "Profile Update"

          ? "bg-blue-100 text-blue-700"

          : request.category ===
            "Field Correction"

          ? "bg-purple-100 text-purple-700"

          : "bg-orange-100 text-orange-700"
      }
    `}
  >

    {request.category}

  </span>

</td>

                  <td className="py-4 text-slate-600">
                    {new Date(
                      request.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="py-4">
                    {getStatusBadge(
                      request.status
                    )}
                  </td>

                  <td className="py-4 text-sm text-slate-600">

                    {request.remarks
                      ? request.remarks
                      : "-"}

                  </td>

                  <td className="py-4">

                    <button
                      onClick={() =>
                        setSelectedRequest(
                          request
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition"
                    >
                      <Eye size={16} />
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  </div>

  {selectedRequest && (

    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">

        <div className="p-6 border-b flex justify-between items-center">

        <div>

  <h4 className="font-bold text-slate-800 mb-4">

    {selectedRequest.category ===
      "Profile Update"
        ? "Submitted Changes"
        : selectedRequest.category ===
          "Field Correction"
        ? "Requested Corrections"
        : "Unlock Request"}

  </h4>

  {/* CONTENT */}

</div>

          <button
            onClick={() =>
              setSelectedRequest(null)
            }
            className="text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>

        </div>

        <div className="p-6 space-y-6">

          <div className="grid md:grid-cols-3 gap-4">

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Status
              </p>

              <div className="mt-2">
                {getStatusBadge(
                  selectedRequest.status
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Submitted
              </p>

              <p className="font-medium">
                {new Date(
                  selectedRequest.createdAt
                ).toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Reason
              </p>

              <p className="font-medium">
                {selectedRequest.remarks || "-"}
              </p>
            </div>

          </div>

          {selectedRequest.status ===
            "rejected" &&
            selectedRequest.remarks && (

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">

                <AlertCircle
                  size={18}
                  className="text-red-600 mt-0.5"
                />

                <div>

                  <p className="font-semibold text-red-700">
                    Rejection Reason
                  </p>

                  <p className="text-red-600 text-sm">
                    {selectedRequest.remarks}
                  </p>

                </div>

              </div>

            )}

          <div>

           <h4 className="font-bold text-slate-800 mb-4">

  {selectedRequest.category ===
    "Profile Update"
      ? "Submitted Changes"
      : selectedRequest.category ===
        "Field Correction"
      ? "Requested Corrections"
      : "Unlock Request"}

</h4>

     {selectedRequest.requestType ===
  "field_correction" ? (

  <div className="space-y-4">

    {selectedRequest.correctionFields?.map(
      (item, index) => (

        <div
          key={index}
          className="border border-slate-200 rounded-xl p-4"
        >

          <div className="font-semibold text-slate-800 mb-3 capitalize">
            {item.section}
          </div>

          <div className="grid md:grid-cols-3 gap-4">

            <div>
              <p className="text-xs text-slate-500">
                Field
              </p>

              <p className="font-medium">
                {item.field}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Current Value
              </p>

              <p className="font-medium text-red-600">
                {item.currentValue}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Requested Value
              </p>

              <p className="font-medium text-green-600">
                {item.requestedValue}
              </p>
            </div>

          </div>

        </div>

      )
    )}

  </div>

) : (

  <div className="space-y-4">

    {selectedRequest.changes &&
      Object.entries(
        selectedRequest.changes
      ).map(
        ([section, values]) => (

          <div
            key={section}
            className="border border-slate-200 rounded-xl"
          >

            <div className="px-4 py-3 bg-slate-50 border-b font-semibold capitalize">
              {section.replaceAll(
                "_",
                " "
              )}
            </div>

            <div className="p-4">
              {renderObject(values)}
            </div>

          </div>

        )
      )}

  </div>

)}
          </div>

        </div>

      </div>

    </div>

  )}

</div>

);
}
