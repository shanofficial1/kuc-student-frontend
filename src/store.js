import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ================= INITIAL STATE ================= */

const initialState = {
  isLoggedIn: false,
  isSubmitted: false,
  isLoading: false,
  isDemoLocked: true,
  fileError: "",

  user: null,
  token: null,

  academic: {
    admissionApplicationNumber: "",
    universityEnrollmentNumber: "",
    rollNumber: "",
    faculty: "",
    department: "",
    programLevel: "",
    degreeName: "",
    year: "",
    semester: "",
    specialization: "",
    batch: "",
    academicCycle: "",
    modeOfStudy: "",
    admissionCategory: "",
    fellowshipLetterNumber: "",
    fellowshipLetterUrl: "",
  },

  personal: {
    fullName: "",
    dob: "",
    gender: "",
    nationality: "Indian",
    domicileState: "Kerala",
    religion: "",
    category: "",
    caste: "",
    languages: [],
    aadhaarNo: "",
    passportNo: "",

    dobDoc: null,
    dobDocName: "",
    dobDocError: "",

    passportCountry: "",
    passportExpiry: "",
    passportFile: null,

    visaType: "",
    visaNo: "",
    visaCountry: "",
    visaIssueDate: "",
    visaExpiryDate: "",
    visaStatus: "",
    visaFile: null,
  },

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
    isSameAddress: true,
    distanceFromCampus: "",
  },

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

  education: {
    academicRecords: [],
    competitiveExams: [],
    migrationCertificateUploaded: false,
    migrationDocName: "",
    migrationError: "",
  },

  financial: {
    scholarshipCategory: "none",
    feeWaiverDocUrl: "",
    loanBankName: "",
    loanBranch: "",
    loanAmount: "",
    bankAccountHolder: "",
    panNumber: "",
    accountNumber: "",
    ifscCode: "",
  },

  professional: {
    publications: [],
    conferences: [],
    experience: [],
    skills: "",
    patent: { docName: "", fileError: "" },
    membership: { docName: "", fileError: "" },
  },

  residential: {
    type: "Day Scholar",
    hostelBlock: "",
    roomNo: "",
    bedType: "",
    messPreference: "Veg",
    transportOpted: false,
    busRouteId: "",
    pickupPoint: "",
    vehicleReg: "",
  },

  mentor: {
    tutorName: "tuit.it@kannuruniversity.ac.in",
    tutorEmail: "Dr. ghhr M.",
    hodName: "Dr. Sivaprasad M.",
    hodEmail: "hod.it@kannuruniversity.ac.in",
  },

  documents: {
    profilePhoto: { file: "", error: "" },
    signature: { file: "", error: "" },
    transcripts: { file: "", error: "" },
    identity: { file: "", error: "" },
    certificates: { file: "", error: "" },
  },

  grades: {
    currentSemester: "Semester IV",
    semesters: {
      "Semester IV": {
        sgpa: 8.65,
        cgpa: 8.42,
        subjects: [
          { code: "BIT401", title: "DBMS", credits: 4, grade: "A+", result: "PASS" },
        ],
      },
    },
  },
  marksData: {
  "Semester I": [
    { code: "BIT101", title: "Engineering Mathematics I", credits: 4, CE: 19, TE: 72, result: "PASS" },
    { code: "BIT102", title: "Engineering Physics", credits: 3, CE: 18, TE: 65, result: "PASS" },
    { code: "BIT103", title: "Programming in C", credits: 3, CE: 20, TE: 75, result: "PASS" },
    { code: "BIT104", title: "Engineering Graphics", credits: 3, CE: 17, TE: 60, result: "PASS" },
    { code: "BIT105L", title: "Programming Lab in C", credits: 2, CE: 20, TE: 48, result: "PASS" }
  ],
  "Semester II": [
    { code: "BIT201", title: "Engineering Mathematics II", credits: 4, CE: 19, TE: 68, result: "PASS" },
    { code: "BIT202", title: "Engineering Chemistry", credits: 3, CE: 18, TE: 70, result: "PASS" },
    { code: "BIT203", title: "Data Structures", credits: 3, CE: 19, TE: 72, result: "PASS" },
    { code: "BIT204", title: "Basic Electrical Engineering", credits: 3, CE: 17, TE: 64, result: "PASS" },
    { code: "BIT205L", title: "Data Structures Lab", credits: 2, CE: 20, TE: 46, result: "PASS" }
  ],
  "Semester III": [
    { code: "BIT301", title: "Discrete Mathematics", credits: 4, CE: 18, TE: 75, result: "PASS" },
    { code: "BIT302", title: "Computer Organization", credits: 3, CE: 19, TE: 62, result: "PASS" },
    { code: "BIT303", title: "Object Oriented Programming", credits: 3, CE: 20, TE: 78, result: "PASS" },
    { code: "BIT304", title: "Digital Electronics", credits: 3, CE: 19, TE: 66, result: "PASS" },
    { code: "BIT305L", title: "OOP Lab using Java", credits: 2, CE: 20, TE: 49, result: "PASS" }
  ],
  "Semester IV": [
    { code: "BIT401", title: "Database Management Systems", credits: 4, CE: 19, TE: 74, result: "PASS" },
    { code: "BIT402", title: "Computer Networks", credits: 4, CE: 19, TE: 70, result: "PASS" },
    { code: "BIT403", title: "Operating Systems", credits: 3, CE: 19, TE: 65, result: "PASS" },
    { code: "BIT404", title: "Software Engineering", credits: 3, CE: 20, TE: 72, result: "PASS" },
    { code: "BIT405L", title: "DBMS Laboratory", credits: 2, CE: 20, TE: 45, result: "PASS" }
  ],
},

};

/* ================= HELPER ================= */

const clean = (obj) =>
  Object.fromEntries(
    Object.entries(obj || {}).map(([k, v]) => [k, v ?? ""])
  );

/* ================= STORE ================= */

export const useStore = create(
  persist(
    (set, get) => ({

      ...initialState,

      /* 🔐 LOGIN */
      login: (user, token) =>
        set({
          isLoggedIn: true,
          user,
          token,
        }),

      /* 🔓 LOGOUT */
      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          token: null,
        }),
setIsLoading: (val) => set({ isLoading: val }),

      /* 🔄 UPDATE */
      updateSection: (section, data) =>
        set((state) => ({
          [section]: {
            ...state[section],
            ...data,
          },
        })),
updateMark: (semester, code, newCE, newTE) => set((state) => ({
    marksData: {
      ...state.marksData,
      [semester]: state.marksData[semester].map((subject) =>
        subject.code === code 
          ? { ...subject, CE: Number(newCE) || subject.CE, TE: Number(newTE) || subject.TE }
          : subject
      ),
    },
  })),
      /* ⏳ LOADING */
      setLoading: (status) => set({ isLoading: status }),

      /* 🔐 SUBMIT */
      setSubmitted: (status) => set({ isSubmitted: status }),

      toggleSubmitted: () =>
        set((s) => ({ isSubmitted: !s.isSubmitted })),

      /* 🔒 DEMO LOCK */
      setDemoLocked: (status) => set({ isDemoLocked: status }),

      /* 📥 FETCH STUDENT (FIXED) */
      fetchStudent: async () => {
        try {
          const mail = get().user?.email;

          if (!mail) {
            console.warn("No email found, skipping fetch");
            return;
          }

          const res = await fetch(`http://localhost:7002/api/student?mail=${mail}`);
          const data = await res.json();

          set({
            academic: clean(data.academic_details),
            personal: clean(data.personal_details),
            contact: clean(data.contact_details),
            health: clean(data.health_details),
            family: clean(data.family_details),
            education: clean(data.education_details),
            financial: clean(data.financial_details),
            professional: clean(data.professional_details),
            residential: clean(data.residential_details),
            mentor: clean(data.mentor_details),
            documents: clean(data.documents_details),
          });

        } catch (err) {
          console.error("Fetch error:", err);
        }
      },

      /* 📂 FILE UPLOAD FIX */
      setMigrationFile: (file) => {
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
          set({
            education: {
              ...get().education,
              migrationDocName: "",
              migrationError: "Max 2MB allowed",
            },
          });
          return;
        }

        set({
          education: {
            ...get().education,
            migrationDocName: file.name,
            migrationError: "",
          },
        });
      },

    }),
    {
      name: "student-app-storage",
    }
  )
);