import React from "react";
import { cn } from "../lib/utils";
import { Save,FileText } from "lucide-react";
import { useStore } from "../store";
import { compressImage } from "../lib/fileCompression";
import { compressPdfApi } from "../api/file.api";
import { useState } from "react";
import AppAlertDialog  from "../components/ui/AlertDialog"

/* ================= MAIN WRAPPER ================= */

export default function FormWrapper({
  title,
  description,
  children,
  onSave,
  isLoading,
}) {
  const isSubmitted = useStore((s) => s.isSubmitted);

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight mt-4">
          {title}
        </h1>
        <p className="text-slate-500 max-w-2xl">{description}</p>
      </header>

      <div className="space-y-10">{children}</div>

      <div className="flex justify-end pt-10 border-t border-slate-200 mt-12">
        <button
          onClick={onSave}
          disabled={isLoading || isSubmitted}
          className={cn(
            "bg-primary text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-blue-900/10 transition-all",

            !isSubmitted &&
              "hover:bg-primary-container hover:shadow-xl hover:-translate-y-0.5 active:scale-95",

            (isLoading || isSubmitted) &&
              "opacity-60 cursor-not-allowed bg-slate-400 shadow-none"
          )}
        >
          <Save className="w-5 h-5" />
          <span>{isSubmitted ? "Submitted" : `Save ${title}`}</span>
        </button>
      </div>
    </div>
  );
}

/* ================= SECTION ================= */

export function FormSection({ title, icon: Icon, children, className }) {
  return (
    <section
      className={cn(
        "bg-white border border-border-subtle rounded-2xl p-8 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
        <div className="p-2 rounded-lg bg-blue-50 text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {children}
      </div>
    </section>
  );
}

/* ================= INPUT FIELD ================= */

export function InputField({
  label,
  id,
  required,
  disabled,
  alwaysEnabled = false,
  error,
  dateYearRule = "all",
  ...props
}) {
  const isSubmitted = useStore((s) => s.isSubmitted);

  const isDisabled = alwaysEnabled
    ? false
    : (disabled || isSubmitted);

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-600"
      >
        {label}{" "}
        {required && (
          <span className="text-status-error ml-0.5">*</span>
        )}
      </label>

      <input
        id={id}
        disabled={isDisabled}
        data-date-year-rule={dateYearRule}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full px-4 py-3 bg-slate-50 border rounded-lg outline-none transition-all placeholder:text-slate-400",

          !error && "border-slate-200",

          error &&
            "border-status-error focus:ring-2 focus:ring-status-error focus:border-status-error",

          !error &&
            !(isSubmitted && !alwaysEnabled) &&
            "focus:ring-2 focus:ring-primary focus:border-primary",

          isDisabled &&
            "bg-gray-100 cursor-not-allowed opacity-70",

          props.className
        )}
        {...props}
      />

      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-status-error flex items-center gap-1"
        >
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}
/* ================= SELECT FIELD ================= */

export function SelectField({
  label,
  id,
  required,
  options,
  disabled,
  value,
  onChange,
  multiple = false, 
    sort = true,
  others = false,
}) {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const isDisabled = disabled ;

  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  const selectedValues = Array.isArray(value)
    ? value
    : value
    ? [value]
    : [];

let normalizedOptions = (options || []).map((opt) =>
  typeof opt === "string"
    ? { value: opt, label: opt }
    : opt
);

if (sort) {
  normalizedOptions.sort((a, b) =>
    a.label.localeCompare(b.label, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );
}

if (
  others &&
  !normalizedOptions.some((o) => o.value === "Other")
) {
  normalizedOptions.push({
    value: "Other",
    label: "Other",
  });
}

const filteredOptions = normalizedOptions.filter((opt) =>
  opt.label.toLowerCase().includes(search.toLowerCase())
);

const showSearch = normalizedOptions.length > 10;

const selectedLabels = normalizedOptions
    .filter((o) => selectedValues.includes(o.value))
    .map((o) => o.label);

  React.useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="space-y-2" ref={ref}>
      <label className="block text-sm font-medium text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Trigger */}
      <div
        tabIndex={0}
        onClick={() => !isDisabled && setOpen(!open)}
        className={cn(
          "w-full px-4 py-3 rounded-xl border text-sm flex items-center justify-between transition-all",
          !isDisabled &&
            "bg-white border-slate-200 text-slate-700 shadow-sm hover:border-slate-300 cursor-pointer focus:ring-2 focus:ring-primary",
          isDisabled &&
            "bg-gray-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-70"
        )}
      >
        <span
          className={
            selectedLabels.length ? "text-slate-700" : "text-slate-400"
          }
        >
          {selectedLabels.length
            ? selectedLabels.join(", ")
            : `Select ${label}`}
        </span>

        <svg
          className={cn(
            "w-4 h-4 transition-transform text-slate-400",
            open && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* Dropdown */}
      {open && !isDisabled && (
        <div className="relative w-full">
          <div className="absolute z-50 mt-2 left-0 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {/* Search */}
            {showSearch && (
              <div className="p-2 border-b border-slate-100">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {/* Options */}
            <div className="max-h-60 overflow-y-auto no-scrollbar">
              {filteredOptions.length > 0 ? (
               normalizedOptions
  .filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )
  .map((opt) => {
                  const isActive = selectedValues.includes(opt.value);

                  return (
                    <div
                      key={opt.value}
                      onClick={() => {
                        if (multiple) {
                          let newValues = [...selectedValues];

                          if (newValues.includes(opt.value)) {
                            newValues = newValues.filter(
                              (v) => v !== opt.value
                            );
                          } else {
                            newValues.push(opt.value);
                          }

                          onChange?.({
                            target: { id: id, value: newValues },
                          });
                        } else {
                          onChange?.({
                            target: { id: id, value: opt.value },
                          });

                          setOpen(false);
                        }

                        setSearch("");
                      }}
                      className={cn(
                        "px-4 py-3 text-sm cursor-pointer transition-all",
                        "hover:bg-blue-50",
                        isActive && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      {opt.label}
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-slate-400">
                  No results found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ================= FILE INPUT FIELD ================= */
export function FileInput({ label, file, fileUrl, error, onChange, disabled, required }) {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const isDisabled = disabled || isSubmitted;
const [compressing,setCompressing] =useState(false);
  const token = useStore((s) => s.token);

const [compressionData,setCompressionData] = useState(null);

const [alertOpen, setAlertOpen] = useState(false);

const [alertData, setAlertData] = useState({
  title: "",
  message: "",
  type: "info",
});


const [showCompressionModal,
  setShowCompressionModal] =
  useState(false);

const handlePreview = (e) => {

  e.preventDefault();

  console.log("FILE URL =", fileUrl);
// No file
if (!fileUrl) {

  setAlertData({
    type: "warning",
    title: "Preview Unavailable",
    message: "No document is available for preview.",
  });

  setAlertOpen(true);

  return;
}

  let url = "";

  // Existing saved file
  if (
    typeof fileUrl === "object" &&
    fileUrl?.url
  ) {

    url = fileUrl.url;

  }

  // Direct string path
  else if (
    typeof fileUrl === "string"
  ) {

    url = fileUrl;

  }

  // New File object cannot be opened from server
  else if (
    fileUrl instanceof File
  ) {

    const localUrl =
      URL.createObjectURL(fileUrl);

    window.open(
      localUrl,
      "_blank"
    );

    return;

  }
else {

  setAlertData({
    title: "Preview Unavailable",
    message: "No document is available for preview.",
  });

  setAlertOpen(true);

  return;

}

  // Convert Windows path
  const cleanUrl =
    url.replace(/\\/g, "/");

  const fullUrl =
    `${import.meta.env.VITE_SERVER}/${cleanUrl}`;

  console.log(
    "PREVIEW URL =",
    fullUrl
  );

  window.open(
    fullUrl,
    "_blank"
  );

};


  // Helper to format the display name of the file
const formatFileName = (name) => {
  if (!name) return "Upload File";

  const cleanName = String(name).split("/").pop();

  if (cleanName.length > 22) {
    return (
      cleanName.substring(0, 15) +
      "..." +
      cleanName.slice(-6)
    );
  }

  return cleanName;
};

  // ✅ New internal validation handler
const onFileChange =
async (e) => {

const selectedFile =
  e.target.files?.[0];

if (!selectedFile) return;

console.log(
  "SELECTED SIZE",
  selectedFile.size / 1024 / 1024
);

setCompressing(true);

try {

  const result =
    await compressPdfApi(
      selectedFile,
      token
    );

  setCompressionData(result);

  setShowCompressionModal(true);

} catch (err) {

  console.log(err);

} finally {

  setCompressing(false);

}

};


  console.log("FILE PROP =", file);
  console.log(
  "MODAL",
  showCompressionModal,
  compressionData
);
  return (
    <>
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-600">
        {label} 
      </label>

      <label
        className={cn(
          "w-full h-12 flex items-center justify-between px-3 border rounded-xl cursor-pointer transition-all",
          !isDisabled && "bg-white border-slate-200 shadow-sm hover:border-slate-300",
          isDisabled && "bg-gray-100 border-slate-200 cursor-not-allowed opacity-70",
          file && !error && !isDisabled && "border-green-500 bg-green-50/30",
          error && "border-red-500 bg-red-50"
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className={cn(
              "p-2 rounded-lg transition-colors",
              file && !error ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"
            )}
          >
            <FileText size={18} />
          </div>

          <span
  className={cn(
    "text-sm truncate",
    error
      ? "text-red-600 font-medium"
      : file
      ? "text-green-700 font-medium"
      : "text-slate-400"
  )}
>
  {compressing
    ? "Compressing PDF..."
    : error || formatFileName(file)}
</span>
        </div>

        <input
          type="file"
          className="hidden"
          disabled={isDisabled}
          onChange={onFileChange} // ✅ Call internal handler
          accept=".pdf,.jpg,.jpeg,.png"
        />

       <div className="flex items-center gap-3 shrink-0">

{(file || fileUrl) && !error && (    <button
      type="button"
      onClick={handlePreview}
      className="text-[11px] font-semibold text-primary hover:underline"
    >
      View
    </button>
  )}

{(file || fileUrl) && !error && (    <div className="text-green-600">
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        viewBox="0 0 24 24"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  )}

</div>
      </label>
{
compressing && (
  <div
   className="
   text-blue-600
   text-sm
   font-medium"
  >
   Compressing PDF...
  </div>
)
}
      <p className={cn(
        "text-[10px] font-bold  tracking-wider",
       "text-red-500" 
      )}>
{compressing
  ? "Compressing PDF. Please wait..."
  : error
  ? error
  : "Upload file size: MAX 150 KB only."}      </p>
    </div>
    {
showCompressionModal &&
compressionData && (

<div
className="
fixed inset-0
bg-black/50
flex
items-center
justify-center
z-50"
>

<div
className="
bg-white
rounded-xl
p-6
w-[500px]
space-y-4"
>

<h3
className="
text-lg
font-bold"
>
Compression Result
</h3>

<p>

Original:

<b>
 {compressionData.originalSize}
 KB
</b>

</p>

<p>

Compressed:

<b>
 {compressionData.compressedSize}
 KB
</b>

</p>

<div
className="
flex gap-3"
>

<button

type="button"

onClick={() => {

const previewUrl =
`${import.meta.env.VITE_SERVER}/${compressionData.file.path}`;

window.open(
 previewUrl,
 "_blank"
);

}}

className="
px-4 py-2
border rounded"
>

Preview

</button>

<button

type="button"

onClick={() => {

onChange({

target: {

file:
compressionData.file,

error: ""

}

});

setShowCompressionModal(
false
);

}}

className="
px-4 py-2
bg-green-600
text-white
rounded"
>

Use PDF

</button>

<button

type="button"

onClick={() => {

setShowCompressionModal(
false
);

}}

className="
px-4 py-2
bg-red-600
text-white
rounded"
>

Cancel

</button>

</div>

</div>

</div>

)
}

<AppAlertDialog
  open={alertOpen}
  setOpen={setAlertOpen}
  type={alertData.type}
  title={alertData.title}
  message={alertData.message}
/>
    </>
  );
}

