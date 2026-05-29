import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../../store";
import FormWrapper, {
  FormSection,
  InputField,
  SelectField,
  FileInput,
} from "../../components/FormWrapper";
import {
  User,
  Flag,
  Languages,
  Globe,
  CreditCard,
  Keyboard,
  FileText,
  CheckCircle,
} from "lucide-react";
import GlobalLoader from "@/src/components/GlobalLoader";
const COLS = 11;

const baseKeys = [
  ["ക", "വ", "ര", "ല", "ങ", "അ", "ആ", "ഇ", "ഈ", "ഉ", "ഊ"],
  ["ച", "ഹ", "ജ", "ത", "ധ", "ഞ", "എ", "ഏ", "ഐ", "ഒ", "ഓ"],
  ["സ", "ദ", "ഡ", "ന", "യ", "റ", "ള", "ഴ", "ർ"],
  ["ത", "ന", "ബ", "മ", "ശ", "ഷ", "സ", "ഹ", "ൻ", "ർ"],
];

const shiftKeys = [
  ["ാ", "ി", "ീ", "ു", "ൂ", "ൃ", "െ", "േ", "ൈ", "ൊ", "ോ"],
  ["്", "ം", "ഃ", "ൺ", "ൻ", "ർ", "ൽ", "ൾ", "ൌ"],
  ["൦", "൧", "൨", "൩", "൪", "൫", "൬", "൭", "൮", "൯"],
  [],
];

/* ================= NORMALIZE ================= */
const normalize = (rows) =>
  rows.map((row) => {
    const filled = [...row];
    while (filled.length < COLS) filled.push("");
    return filled;
  });

const normalizedBase = normalize(baseKeys);
const normalizedShift = normalize(shiftKeys);

/* ================= KEYBOARD ================= */

export function MalayalamKeyboard({ value, onChange, onClose }) {
  const [isShift, setIsShift] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // Ref to track the keyboard container for outside clicks
  const keyboardRef = useRef(null);

  // 1. Initial Position: Center of the screen
  useEffect(() => {
    const centerX = window.innerWidth / 2 - 180;
    const centerY = window.innerHeight / 2 - 100;
    setPos({ x: centerX, y: centerY });
  }, []);

  // 2. Click Outside Logic: Detects if the user clicks anywhere else
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the keyboard is open and the clicked element is NOT inside the keyboardRef
      if (keyboardRef.current && !keyboardRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // For mobile

    return () => {
      // Cleanup the listener when keyboard is destroyed
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose]);

  const handleKey = (key) => {
    if (key === "BACK") {
      onChange(value.slice(0, -1));
    } else {
      onChange(value + key);
    }
  };

  const handleMove = (clientX, clientY) => {
    if (!dragging) return;
    setPos({
      x: Math.max(0, Math.min(window.innerWidth - 360, clientX - 150)),
      y: Math.max(0, Math.min(window.innerHeight - 200, clientY - 40)),
    });
  };

  const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);

  const handleTouchMove = (e) => {
    if (dragging) {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  };

  const keys = isShift ? normalizedShift : normalizedBase;

  return (
    <div
      ref={keyboardRef} // Attached the ref here
      className="fixed z-50 bg-black rounded-xl shadow-xl p-2 w-[360px] min-h-[200px] touch-none select-none"
      style={{ top: pos.y, left: pos.x }}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setDragging(false)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setDragging(false)}
    >
      {/* HEADER - Drag handle */}
      <div
        className="flex justify-between items-center mb-2 cursor-move"
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-white text-[10px] font-bold uppercase tracking-widest">
            Keyboard
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-red-400 transition-colors p-1"
        >
          ✕
        </button>
      </div>

      {/* KEY GRID */}
      <div className="space-y-1">
        {keys.map((row, i) => (
          <div key={i} className="grid grid-cols-11 gap-1">
            {row.map((k, index) => (
              <button
                key={index}
                onClick={() => k && handleKey(k)}
                className={`h-8 text-xs rounded transition-all active:scale-95
                  ${
                    k
                      ? "bg-neutral-800 text-white active:bg-green-600 md:hover:bg-green-600"
                      : "bg-transparent cursor-default"
                  }
                `}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="flex gap-1 mt-2">
        <button
          onClick={() => setIsShift(!isShift)}
          className={`px-3 h-8 text-[10px] font-bold rounded transition-colors ${
            isShift
              ? "bg-green-600 text-white"
              : "bg-neutral-700 text-slate-300"
          }`}
        >
          SHIFT
        </button>
        <button
          onClick={() => handleKey(" ")}
          className="flex-1 h-8 text-[10px] font-bold bg-neutral-700 text-white rounded active:bg-neutral-600"
        >
          SPACE
        </button>
        <button
          onClick={() => handleKey("BACK")}
          className="px-3 h-8 text-sm bg-red-900/50 text-red-400 rounded hover:bg-red-900 transition-colors"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
/* ================= MAIN FORM ================= */
export default function PersonalForm() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const personal = useStore((state) => state.personal);
  const updateSection = useStore((state) => state.updateSection);
  console.log("PERSONAL STORE DATA", personal);

  const [errors, setErrors] = useState({});
  const [showKeyboard, setShowKeyboard] = useState(false);

  const DATE_FIELDS = [
    "dob",
    "passportExpiry",
    "visaIssueDate",
    "visaExpiryDate",
  ];

  const store = useStore();

  const isLoading = useStore((state) => state.isLoading);

  const saveAndRefresh = useStore((s) => s.saveAndRefresh);

  const handleSave = async () => {
    const personal = useStore.getState().personal;
    const cleanData = (obj) => {
      return Object.fromEntries(
        Object.entries(obj).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );
    };
    const convertToISODate = (dateStr) => {

  if (!dateStr) return undefined;

  const parts = dateStr.split("-");

  if (parts.length !== 3) return undefined;

  const [dd, mm, yyyy] = parts;

 return new Date(
  `${yyyy}-${mm}-${dd}`
);  

};

const payload = {

  fullName: personal.fullName,

  fullNameNative:
    personal.fullNameNative,

dob:
  convertToISODate(
    personal.dob
  ),
    gender: personal.gender,

  nationality:
    personal.nationality,

  dualCitizenship:
    personal.dualCitizenship,

  domicileState:
    personal.domicileState,

  religion:
    personal.religion,

  caste:
    personal.caste,

  motherTongue:
    personal.motherTongue,

  languagesKnown:
    personal.languagesKnown,

  socialCategory:
    personal.socialCategory,

  // 🔥 CORRECT NAME
  aadhaarNumber:
  personal.aadhaarNo
    ?.replace(/\s/g, ""),

  // 🔥 CORRECT NAME
  passportNumber:
    personal.passportNumber,
passportCountry: personal.passportCountry,
passportExpiry:
  convertToISODate(
    personal.passportExpiry
  ),

  // 🔥 NESTED OBJECT
visaDetails: {

  ...(personal.visaType && {
    visaType: personal.visaType
  }),

  ...(personal.visaNo && {
    visaNumber: personal.visaNo
  }),

  ...(personal.visaCountry && {
    issuingCountry:
      personal.visaCountry
  }),

  ...(personal.visaIssueDate && {
issueDate:
  convertToISODate(
    personal.visaIssueDate
  ),  }),

  ...(personal.visaExpiryDate && {
expiryDate:
  convertToISODate(
    personal.visaExpiryDate
  ),  }),

  ...(personal.visaStatus && {
    status:
      personal.visaStatus
  }),

}


};


const cleanedPersonal =
  cleanData(payload);
      const formData = new FormData();
Object.entries(cleanedPersonal).forEach(
  ([key, value]) => {

    // 🔥 HANDLE OBJECT
    if (
      typeof value === "object" &&
      !Array.isArray(value)
    ) {

      Object.entries(value).forEach(
        ([subKey, subValue]) => {

          formData.append(
            `personal_details[${key}][${subKey}]`,
            subValue
          );

        }
      );

    }

    // 🔥 HANDLE ARRAY
    else if (Array.isArray(value)) {

      value.forEach((item) => {

        formData.append(
          `personal_details[${key}][]`,
          item
        );

      });

    }

    // 🔥 NORMAL VALUE
    else {

      console.log(
  "birthCertificateDoc",
  personal.birthCertificateDoc
);

console.log(
  personal.birthCertificateDoc instanceof File
);

      formData.append(
        `personal_details[${key}]`,
        value
      );

    }

  }
);

console.log(
  "DOB FILE =",
  personal.birthCertificateDoc
);

console.log(
  personal.birthCertificateDoc instanceof File
);

   if (
  personal.birthCertificateDoc instanceof File
) {
  formData.append(
    "birthCertificateDoc",
    personal.birthCertificateDoc
  );
}
    if (personal.passportDoc instanceof File) {
      formData.append("passportDoc", personal.passportDoc);
    }
    if (personal.visaDoc instanceof File) {
      formData.append("visaDoc", personal.visaDoc);
    }
    await saveAndRefresh(formData, true);
  };

  const handleDOBFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKB = file.size / 1024;
    if (sizeKB > 150) {
      updateSection("personal", {
        dobDocError: "File must be less than 150 KB",
        dobDoc: null,
        dobDocName: "",
      });
      e.target.value = "";
      return;
    }
    updateSection("personal", {
      dobDoc: file,
      dobDocName: file.name,
      dobDocError: "",
    });
  };

  const handlePassportFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKB = file.size / 1024;
    if (sizeKB > 150) {
      updateSection("personal", {
        passportDocError: "File must be less than 150 KB",
        passportDoc: null,
        passportDocName: "",
      });
      e.target.value = "";
      return;
    }
    updateSection("personal", {
      passportDoc: file,
      passportDocName: file.name,
      passportDocError: "",
    });
  };

  const handleVisaFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKB = file.size / 1024;
    if (sizeKB > 150) {
      updateSection("personal", {
        visaDocError: "File must be less than 150 KB",
        visaDoc: null,
        visaDocName: "",
      });
      e.target.value = "";
      return;
    }
    updateSection("personal", {
      visaDoc: file,
      visaDocName: file.name,
      visaDocError: "",
    });
  };

  const validateDOB = (dob) => {
    if (dob.length !== 10) return "Enter full date";
    const [dd, mm, yyyy] = dob.split("-").map(Number);
    const date = new Date(yyyy, mm - 1, dd);
    const isValid =
      date &&
      date.getDate() === dd &&
      date.getMonth() === mm - 1 &&
      date.getFullYear() === yyyy;
    if (!isValid) return "Invalid date";
    const today = new Date();
    if (date > today) return "Future date not allowed";
    return "";
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (DATE_FIELDS.includes(id)) {
      const error = validateDOB(value);
      setErrors((prev) => ({ ...prev, [id]: error }));
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    let val = value;

    // PHONE FORMAT
    if (id === "mobile" || id === "whatsapp") {
      let digits = val.replace(/\D/g, "").slice(0, 10);

      val = digits.replace(/(\d{5})(?=\d)/g, "$1 ");
    }

    // DATE FORMAT
    else if (DATE_FIELDS.includes(id)) {
      let digits = val.replace(/\D/g, "").slice(0, 8);

      let dd = digits.slice(0, 2);

      let mm = digits.slice(2, 4);

      let yyyy = digits.slice(4, 8);

      if (digits.length <= 2) {
        val = dd;
      } else if (digits.length <= 4) {
        val = `${dd}-${mm}`;
      } else {
        val = `${dd}-${mm}-${yyyy}`;
      }
    }

    updateSection("personal", {
      [id]: val,
    });
  };
  const handleAadhaarChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 12) value = value.slice(0, 12);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    updateSection("personal", { aadhaarNo: value });
  };

  const NATIONALITIES = [
    "Indian",
    "NRI",
    "Afghan",
    "Albanian",
    "Algerian",
    "American",
    "Andorran",
    "Angolan",
    "Argentinian",
    "Armenian",
    "Australian",
    "Austrian",
    "Bangladeshi",
    "Belgian",
    "Bhutanese",
    "Brazilian",
    "British",
    "Bulgarian",
    "Canadian",
    "Chinese",
    "Colombian",
    "Croatian",
    "Cuban",
    "Czech",
    "Danish",
    "Dutch",
    "Egyptian",
    "Ethiopian",
    "Finnish",
    "French",
    "German",
    "Greek",
    "Hungarian",
    "Icelandic",
    "Indonesian",
    "Iranian",
    "Iraqi",
    "Irish",
    "Israeli",
    "Italian",
    "Japanese",
    "Jordanian",
    "Kenyan",
    "Kuwaiti",
    "Lebanese",
    "Malaysian",
    "Maldivian",
    "Mexican",
    "Moroccan",
    "Nepalese",
    "New Zealander",
    "Nigerian",
    "Norwegian",
    "Omani",
    "Pakistani",
    "Palestinian",
    "Peruvian",
    "Philippine",
    "Polish",
    "Portuguese",
    "Qatari",
    "Romanian",
    "Russian",
    "Saudi",
    "Singaporean",
    "South African",
    "South Korean",
    "Spanish",
    "Sri Lankan",
    "Sudanese",
    "Swedish",
    "Swiss",
    "Syrian",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Uruguayan",
    "Venezuelan",
    "Vietnamese",
    "Yemeni",
    "Zimbabwean",
  ];
  const CASTES = [
    "Ezhava",
    "Nair",
    "Brahmin",
    "Pulaya",
    "Paraya",
    "Vannan",
    "Viswakarma",
    "Kammalan",
    "Mappila",
    "Latin Catholic",
    "Syrian Christian",
    "Dalit",
    "Adivasi",
    "Kurava",
    "Thiyya",
    "Marar",
    "Moothan",
    "Chaliya",
    "Namboothiri",
    "Warrier",
    "Menon",
    "Panicker",
    "Chekavar",
    "Vellalar",
    "Gounder",
    "Reddy",
    "Yadav",
    "Rajput",
    "Kayastha",
    "Bania",
    "Jat",
    "Maratha",
    "Lingayat",
    "Patel",
    "Kshatriya",
    "Vaishya",
    "Shudra",
    "SC",
    "ST",
    "OBC",
    "Other",
  ];
  const COUNTRIES = [
    "India",
    "USA",
    "UK",
    "Canada",
    "Australia",
    "UAE",
    "Saudi Arabia",
    "Germany",
    "France",
    "Singapore",
    "Malaysia",
    "Qatar",
    "Kuwait",
    "Oman",
    "South Africa",
    "Japan",
    "China",
    "Sri Lanka",
    "Nepal",
    "Bangladesh",
  ];
  const countryOptions = COUNTRIES.map((c) => ({ value: c, label: c }));
  const VISA_TYPES = [
    "Student",
    "Work Visa",
    "Tourist Visa",
    "Business Visa",
    "Dependent Visa",
  ];

  return (
    <>
      {isLoading && <GlobalLoader />}

      <FormWrapper
        title="Personal Information"
        description="Please provide your official personal information as per documents."
        onSave={handleSave}
      >
        {showKeyboard && (
  <MalayalamKeyboard
    value={personal.fullNameNative || ""}
    onChange={(value) => {

      updateSection("personal", {
        fullNameNative: value,
      });

    }}
    onClose={() => setShowKeyboard(false)}
  />
)}

        <FormSection title="Basic Identity" icon={User}>
          <InputField
            label="Full Name (as per SSLC)"
            id="fullName"
            required
            value={personal.fullName || ""}
            onChange={handleChange}
          />
        <div className="space-y-2">
  <label className="block text-sm font-medium text-slate-600">
    Full Name (Native)
  </label>

  <div className="relative">

    <input
      value={personal.fullNameNative || ""}
      onChange={handleChange}
      disabled={isSubmitted}
      id="fullNameNative"
      autoComplete="off"
      className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400
      ${
        !isSubmitted
          ? "focus:ring-2 focus:ring-primary focus:border-primary"
          : ""
      }
      ${
        isSubmitted
          ? "bg-gray-100 cursor-not-allowed opacity-70"
          : ""
      }`}
      placeholder="Enter name in Malayalam"
    />

    <button
      type="button"
      onClick={() => {

        document
          .getElementById(
            "fullNameNative"
          )
          ?.focus();

        setShowKeyboard(true);

      }}
      disabled={isSubmitted}
      className={`absolute right-3 top-1/2 -translate-y-1/2 transition ${
        isSubmitted
          ? "text-gray-400 cursor-not-allowed"
          : "text-slate-500 hover:text-green-600"
      }`}
    >
      <Keyboard size={18} />
    </button>

  </div>
</div>
          <InputField
            label="Date of Birth"
            id="dob"
            type="text"
            placeholder="DD-MM-YYYY"
            value={personal.dob || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.dob}
          />

         <FileInput
  label="Date of Birth Proof"
  file={
    personal.birthCertificateDoc?.name ||
    personal.birthCertificateDoc
  }
  fileUrl={
    personal.birthCertificateDoc?.url
  }
  error={personal.dobDocError}
  disabled={isSubmitted}
  onChange={(e) => {

    const { file, error } = e.target;

    updateSection("personal", {

      birthCertificateDoc: file,

      dobDocError: error,

    });

  }}
/>
          <SelectField
            disabled={isSubmitted}
            label="Gender"
            id="gender"
            value={personal.gender || ""}
            onChange={handleChange}
            options={[
              { value: "", label: "Select Gender" },
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other/Transgender" },
            ]}
          />
        </FormSection>

        <FormSection title="Social & Demographics" icon={Flag}>
          <SelectField
            disabled={isSubmitted}
            label="Nationality"
            id="nationality"
            value={personal.nationality || ""}
            onChange={handleChange}
            options={NATIONALITIES.map((nat) => ({ value: nat, label: nat }))}
          />
          <SelectField
            disabled={isSubmitted}
            label="Domicile State"
            id="domicileState"
            value={personal.domicileState || ""}
            onChange={handleChange}
            options={[
              { value: "Kerala", label: "Kerala" },
              { value: "Tamil Nadu", label: "Tamil Nadu" },
              { value: "Karnataka", label: "Karnataka" },
            ]}
          />
          <SelectField
            disabled={isSubmitted}
            label="Religion"
            id="religion"
            value={personal.religion || ""}
            onChange={handleChange}
            options={[
              { value: "Hindu", label: "Hindu" },
              { value: "Muslim", label: "Muslim" },
              { value: "Christian", label: "Christian" },
              { value: "Other", label: "Other" },
            ]}
          />
          <SelectField
            disabled={isSubmitted}
            label="Social Category"
            id="socialCategory" // Updated ID to match backend key
            value={personal.socialCategory || ""} // Changed from .category to .socialCategory
            onChange={handleChange}
            options={[
              { value: "General", label: "General" },
              { value: "OBC", label: "OBC" },
              { value: "SC", label: "SC" },
              { value: "ST", label: "ST" },
            ]}
          />{" "}
          <SelectField
            disabled={isSubmitted}
            label="Caste"
            id="caste"
            value={personal.caste}
            onChange={handleChange}
            options={CASTES.map((caste) => ({ value: caste, label: caste }))}
          />
          <SelectField
            disabled={isSubmitted}
            label="Dual Citizenship"
            id="dualCitizenship"
            // Convert the boolean from backend/state into a string for the UI
            value={String(personal.dualCitizenship || "")}
            onChange={(e) => {
              // If your handleChange doesn't handle booleans,
              // convert the string back to a boolean for the backend
              const val = e.target.value === "true";
              handleChange({
                target: {
                  id: "dualCitizenship",
                  value: val,
                },
              });
            }}
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]}
          />
        </FormSection>

        <FormSection title="Identity Proof" icon={CreditCard}>
          <InputField
            label="Aadhaar Number"
            id="aadhaarNo"
value={ personal.aadhaarNo ? personal.aadhaarNo .replace(/\D/g, "") .replace(/(\d{4})(?=\d)/g, "$1 ") : "" }            onChange={handleAadhaarChange}
            placeholder="0000 0000 0000"
            maxLength={14}
          />
          <InputField
            label="Passport Number"
            id="passportNumber"
            value={personal.passportNumber || ""}
            onChange={handleChange}
          />
          <SelectField
            label="Country of Issue"
            id="passportCountry"
            value={personal.passportCountry || ""}
            onChange={handleChange}
            options={countryOptions}
          />
          <InputField
            label="Passport Expiry Date"
            id="passportExpiry"
            type="text"
            placeholder="DD-MM-YYYY"
            value={personal.passportExpiry || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.passportExpiry}
          />

        <FileInput
  label="Passport Document"
  required={false}
  file={
    personal.passportDoc?.name ||
    personal.passportDoc
  }
  fileUrl={
    personal.passportDoc?.url
  }
  error={personal.passportDocError}
  disabled={isSubmitted}
  onChange={(e) => {

    const { file, error } = e.target;

    updateSection("personal", {

      passportDoc: file,

      passportDocError: error,

    });

  }}
/>
        </FormSection>

        {/* New Dedicated International Student Section */}
        <FormSection title="International Student Details" icon={Globe}>
          <div className="md:col-span-2 space-y-6">
            {/* Row 1: The Question and Visa Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Are you an International Student?"
                id="isInternational"
value={ personal.visaDetails || personal.visaType ? "yes" : "no" }
                disabled={isSubmitted}
                options={[
                  { value: "no", label: "No" },
                  { value: "yes", label: "Yes" },
                ]}
                onChange={(e) => {
                  const isInt = e.target.value === "yes";
                  updateSection("personal", {
                    isInternational: e.target.value,
                    ...(!isInt && {
                      visaType: "",
                      visaNo: "",
                      visaCountry: "",
                      visaIssueDate: "",
                      visaExpiryDate: "",
                      visaStatus: "",
                      visaDoc: null,
                      visaDocName: "",
                      visaDocError: "",
                    }),
                  });
                }}
              />

              {( personal.visaDetails || personal.visaType ) && (
                <SelectField
                  label="Visa Type"
                  id="visaType"
                  value={personal.visaType || ""}
                  onChange={handleChange}
                  disabled={isSubmitted}
                  options={VISA_TYPES.map((v) => ({ value: v, label: v }))}
                  className="animate-in fade-in slide-in-from-left-2 duration-300"
                />
              )}
            </div>

            {/* Conditional Rows for Yes */}
            {( personal.visaDetails || personal.visaType ) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                {/* Row 2: Visa Number & Issuing Country */}
                <InputField
                  label="Visa Number"
                  id="visaNo"
                  value={personal.visaNo || ""}
                  onChange={handleChange}
                  disabled={isSubmitted}
                />
                <SelectField
                  label="Issuing Country"
                  id="visaCountry"
                  value={personal.visaCountry || ""}
                  onChange={handleChange}
                  disabled={isSubmitted}
                  options={countryOptions}
                />

                {/* Row 3: Dates */}
                <InputField
                  label="Visa Issue Date"
                  id="visaIssueDate"
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={personal.visaIssueDate || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.visaIssueDate}
                  disabled={isSubmitted}
                />
                <InputField
                  label="Visa Expiry Date"
                  id="visaExpiryDate"
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={personal.visaExpiryDate || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.visaExpiryDate}
                  disabled={isSubmitted}
                />

                {/* Row 4: Status and Document */}
                <SelectField
                  label="Visa Status"
                  id="visaStatus"
                  value={personal.visaStatus || ""}
                  onChange={handleChange}
                  disabled={isSubmitted}
                  options={[
                    { value: "Active", label: "Active" }, { value: "Expired", label: "Expired" }, { value: "Pending", label: "Pending" }
                  ]}
                />
<FileInput
  label="Visa / Permit Document"
  file={
    personal.visaDoc?.name ||
    personal.visaDoc
  }
  fileUrl={
    personal.visaDoc?.url
  }
  error={personal.visaDocError}
  disabled={isSubmitted}
  onChange={(e) => {

    const { file, error } = e.target;

    updateSection("personal", {

      visaDoc: file,

      visaDocError: error,

    });

  }}
/>
              </div>
            )}
          </div>
        </FormSection>

        <FormSection title="Language Details" icon={Languages}>
          <SelectField
            disabled={isSubmitted}
            label="Mother Tongue"
            id="motherTongue"
            value={personal.motherTongue}
            onChange={handleChange}
            required
            options={[
              { value: "", label: "Select Mother Tongue" },
              { value: "Malayalam", label: "Malayalam" },
              { value: "English", label: "English" },
            ]}
          />
          <SelectField
            label="Languages Known"
            id="languagesKnown" // Updated to match backend key
            // Ensure the value is always an array, even if the backend returns null
            value={personal.languagesKnown || []}
            onChange={(e) => {
              // For multiple select, e.target.value is usually the updated array
              updateSection("personal", { languagesKnown: e.target.value });
            }}
            options={[
              { value: "Malayalam", label: "Malayalam" },
              { value: "English", label: "English" },
              { value: "Hindi", label: "Hindi" },
            ]}
            multiple
          />{" "}
        </FormSection>
      </FormWrapper>
    </>
  );
}
