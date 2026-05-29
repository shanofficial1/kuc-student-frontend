import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ================= INITIAL STATE ================= */

const initialState = {
  /* APP */
  isLoggedIn: false,
  isSubmitted: false,
  isLoading: false,
  isDemoLocked: false,

  user: null,
  token: null,

  /* ACADEMIC */
  academic: {
    admissionApplicationNumber: "",
    universityEnrollmentNumber: "",
    rollNumber: "",

    faculty: "",
    department: "",
    programLevel: "",
    degreeName: "",


    specialization: "",

    year: "",
    semester: "",
    admissionBatch: "",

    academicCycle: "",
    modeOfStudy: "",
    admissionCategory: "",

    fellowshipLetterNumber: "",
    fellowshipLetterUrl: "",

    fellowshipFileName: "",
    fellowshipFileUrl: "",
  },

  /* PERSONAL */
  personal: {
    fullName: "",
    dob: "",
    gender: "",

    nationality: "",
    domicileState: "",

    religion: "",
    category: "",
    caste: "",

    languages: [],

    aadhaarNo: "",
    passportNo: "",

    dobDocName: "",
    dobDocUrl: "",

    passportCountry: "",
    passportExpiry: "",

    passportFileName: "",
    passportFileUrl: "",

    visaType: "",
    visaNo: "",
    visaCountry: "",
    visaIssueDate: "",
    visaExpiryDate: "",
    visaStatus: "",

    visaFileName: "",
    visaFileUrl: "",
  },

  /* CONTACT */
  contact: {
    mobile: "",
    whatsapp: "",

    email: "",
    institutionalEmail: "",

    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",

    permanentAddress: "",
    correspondenceAddress: "",

    isSameAddress: false,

    distanceFromCampus: "",
  },

  /* HEALTH */
  health: {
    bloodGroup: "",

    height: "",
    weight: "",

    isDisabled: false,

    disabilityType: "",
    disabilityPercentage: "",

    chronicConditions: "",
    medications: "",

    insuranceProvider: "",
    policyNo: "",

    vaccinationStatus: "",
  },

  /* FAMILY */
  family: {
    fatherName: "",
    fatherQualification: "",
    fatherOccupation: "",

    motherName: "",
    motherQualification: "",
    motherOccupation: "",

    annualIncome: "",

    parentPhone: "",
    parentEmail: "",

    siblings: [],
  },

  /* EDUCATION */
  education: {
    academicRecords: [],
    competitiveExams: [],

    migrationCertificateUploaded: false,

    migrationDocName: "",
    migrationDocUrl: "",
    migrationError: "",
  },

  /* FINANCIAL */
  financial: {
    scholarshipCategory: "",

    feeWaiverDocUrl: "",

    loanBankName: "",
    loanBranch: "",
    loanAmount: "",

    bankAccountHolder: "",

    panNumber: "",

    accountNumber: "",
    ifscCode: "",
  },

  /* PROFESSIONAL */
  professional: {
    publications: [],
    conferences: [],
    experience: [],

    skills: "",

    patent: {
      docName: "",
      docUrl: "",
      error: "",
    },

    membership: {
      docName: "",
      docUrl: "",
      error: "",
    },
  },

  /* RESIDENTIAL */
  residential: {
    type: "",

    hostelBlock: "",
    roomNo: "",
    bedType: "",

    messPreference: "",

    transportOpted: false,

    busRouteId: "",
    pickupPoint: "",

    vehicleReg: "",
  },

  /* MENTOR */
  mentor: {
    tutorName: "",
    tutorEmail: "",

    hodName: "",
    hodEmail: "",
  },

  /* DOCUMENTS */
  documents: {
    profilePhoto: {
      fileName: "",
      fileUrl: "",
      error: "",
    },

    signature: {
      fileName: "",
      fileUrl: "",
      error: "",
    },

    transcripts: {
      fileName: "",
      fileUrl: "",
      error: "",
    },

    identity: {
      fileName: "",
      fileUrl: "",
      error: "",
    },

    certificates: {
      fileName: "",
      fileUrl: "",
      error: "",
    },
  },

  /* GRADES */
  grades: {
    currentSemester: "",
    semesters: {},
  },

  /* MARKS */
  marksData: {},
};

/* ================= HELPERS ================= */

const clean = (obj) =>
  Object.fromEntries(
    Object.entries(obj || {}).map(([k, v]) => [k, v ?? ""])
  );

/* ================= STORE ================= */


const formatDate = (date) => {

  if (!date) return "";

  const d = new Date(date);

  if (isNaN(d.getTime())) {

    return "";

  }

  const day =
    String(d.getDate())
      .padStart(2, "0");

  const month =
    String(d.getMonth() + 1)
      .padStart(2, "0");

  const year =
    d.getFullYear();

  return `${day}-${month}-${year}`;

};

export const useStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      /* LOGIN */
      login: (user, token) =>
        set({
          isLoggedIn: true,
          user,
          token,
        }),

      /* LOGOUT */
  logout: () => {
  set({
    ...initialState,

    isLoggedIn: false,
    user: null,
    token: null,
  });
},
      /* LOADING */
      setLoading: (status) =>
        set({
          isLoading: status,
        }),

      /* SUBMIT */
      setSubmitted: (status) =>
        set({
          isSubmitted: status,
        }),

saveAndRefresh: async (
  payload,
  isFormData = false
) => {

  try {

    const token =
      get().token;

    get().setLoading(true);

    const res = await fetch(
      `${import.meta.env.VITE_SERVER}/api/student/profile`,
      {

        method: "POST",

        headers: {

          Authorization:
            `Bearer ${token}`,

          ...(isFormData
            ? {}
            : {
                "Content-Type":
                  "application/json"
              })

        },

        body: isFormData
          ? payload
          : JSON.stringify(payload),

      }
    );

    const result =
      await res.json();

    console.log(
      "SAVE RESULT",
      result
    );

    if (!res.ok) {

      throw new Error(
        result.message ||
        "Save failed"
      );

    }

    await get().fetchStudent();

    console.log(
      "FETCHED LATEST PROFILE FROM DB"
    );

  } catch (err) {

    console.error(err);

  } finally {

    get().setLoading(false);

  }

},

      toggleSubmitted: () =>
        set((state) => ({
          isSubmitted: !state.isSubmitted,
        })),

      /* DEMO LOCK */
      setDemoLocked: (status) =>
        set({
          isDemoLocked: status,
        }),

      /* UPDATE SECTION */
      updateSection: (section, data) =>
        set((state) => ({
          [section]: {
            ...state[section],
            ...data,
          },
        })),

         setProfileData: (data) => {

    set({

      academic: data.academic_details || {},
      personal: data.personal_details || {},
      contact: data.contact_details || {},
      health: data.health_details || {},
      family: data.family_details || {},
      education: data.education_details || {},
      financial: data.financial_details || {},
      professional: data.professional_details || {},
      residential: data.residential_details || {},
      documents: data.documents || {},
      mentor: data.mentor_details || {},

    isSubmitted: !get().user?.canEdit,
    });

  },


      /* UPDATE MARK */
      updateMark: (semester, code, newCE, newTE) =>
        set((state) => ({
          marksData: {
            ...state.marksData,

            [semester]: state.marksData[semester].map((subject) =>
              subject.code === code
                ? {
                    ...subject,
                    CE: Number(newCE) || subject.CE,
                    TE: Number(newTE) || subject.TE,
                  }
                : subject
            ),
          },
        })),
        

      /* FETCH STUDENT */
fetchStudent: async () => {

  try {

    const token = get().token;

    if (!token) return;
    console.log("TOKEN", token);

    const res = await fetch(
      `${import.meta.env.VITE_SERVER}/api/student/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await res.json();

    console.log("STUDENT DATA", result);

    if (!result.success) {

      throw new Error(
        result.message || "Fetch failed"
      );

    }

    const data = result.data || {};

    // =========================
    // PERSONAL DATA
    // =========================

    const personalData =
      clean(data.personal_details);

    const visa =
      personalData?.visaDetails || {};

    // =========================
    // FORMAT AADHAAR
    // =========================

    const formattedAadhaar =
      personalData?.aadhaarNumber
        ? personalData.aadhaarNumber
            .replace(/\D/g, "")
            .replace(
              /(\d{4})(?=\d)/g,
              "$1 "
            )
        : "";

 

   
    set({

      academic: {
        ...clean(data.academic_details),
        fellowshipLetter: data.academic_details ?.fellowshipLetter || {},
      },
      personal: {

  ...personalData,

  // AADHAAR
  aadhaarNo:
    formattedAadhaar,

  // DOB
  dob:
    formatDate(
      personalData?.dob
    ),

  // PASSPORT
  passportExpiry:
    formatDate(
      personalData?.passportExpiry
    ),

  passportCountry:
    visa?.issuingCountry || "",

  passportDoc:
    personalData?.passportDoc || "",

  // VISA
  visaType:
    visa?.visaType || "",

  visaNo:
    visa?.visaNumber || "",

  visaCountry:
    visa?.issuingCountry || "",

  visaIssueDate:
    formatDate(
      visa?.issueDate
    ),

  visaExpiryDate:
    formatDate(
      visa?.expiryDate
    ),

  visaStatus:
    visa?.status || "",

  visaDoc:
    personalData?.visaDoc || "",

  // DOB FILE
  birthCertificateDoc:
    personalData?.birthCertificateDoc || "",

  // YES / NO
  isInternational:
    visa?.visaType
      ? "yes"
      : "no",

},

      contact:
        clean(data.contact_details),

      health: {
  ...clean(data.health_details),
 vaccinationDoc:
    data.health_details?.vaccinationDoc || {},

  disabilityCertificate:
    data.health_details?.disabilityCertificate || {},
  disabilityType:
    data.health_details?.disabilityDetails?.disabilityType || "",

  disabilityPercentage:
    data.health_details?.disabilityDetails?.percentage || "",

},

      family:
        clean(data.family_details),

      education:
        clean(data.education_details),

      financial:
        clean(data.financial_details),

      professional:
        clean(data.professional_details),

      residential:
        clean(data.residential_details),

      mentor:
        clean(data.mentor_details),

      documents:
  clean(data.documents),

    });

    console.log(
      "FETCHED LATEST PROFILE FROM DB"
    );

  } catch (err) {

  console.error(
    "Fetch error:",
    err
  );

  set({

    ...initialState,

    token: get().token,
    user: get().user,
    isLoggedIn: true,

  });

}

},

      /* RESET */
      resetStore: () =>
        set({
          ...initialState,
        }),
    }),
    {
  name: "student-app-storage",

  partialize: (state) => ({

    isLoggedIn: state.isLoggedIn,

    token: state.token,

    user: state.user,

  }),
}
  )
);