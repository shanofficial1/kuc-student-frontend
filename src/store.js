import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ================= INITIAL STATE ================= */

const initialState = {
  /* APP */
  isLoggedIn: false,
  isSubmitted: false,
  isLoading: false,
  isDemoLocked: false,
notifications: [],
notificationLoading: false,
faculty: [],
programLevels: [],
departments: [],
degreeNames: [],
specializations: [],
currentYears: [],
currentSemesters: [],
studyModes: [],
admissionCategories: [],
genders: [],
nationalities: [],
countries: [],
states: {},
socialCategories: [],
castes: [],
visaTypes: [],
visaStatuses: [],
motherTongues: [],
languages: [],
relations: [],
bloodGroups: [],
vaccinations: [],
qualifications: [],
qualificationLevels: [],
qualificationModes: [],
examNames: [],
scholarshipCategories: [],
grantCategories: [],
bankNames: [],
indexingServices: [],
presentationTypes: [],
conferenceTypes: [],
patentStatuses: [],
membershipTypes: [],
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
    specializationCustom: "",

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

  physicalDimensions: {
    height: "",
    weight: "",
  },

  disabilityStatus: false,

  disabilityDetails: {
    disabilityType: "",
    percentage: "",
  },

  disabilityCertificate: {
    name: "",
    url: "",
  },

  chronicConditions: "",

  regularMedications: "",

  insurance: {
    provider: "",
    policyNumber: "",
  },


disabilityFile: null,

uploadError: "",
},

  /* FAMILY */
  family: {
  father: {
    name: "",
    qualification: "",
    occupation: "",
  },

  mother: {
    name: "",
    qualification: "",
    occupation: "",
  },

  annualFamilyIncome: "",

  siblings: [],

  parentContact: {
    countryCode: "+91",
    number: "",
  },

  parentEmail: "",

  guardian: {
    name: "",
    relation: "",

    contact: {
      countryCode: "+91",
      number: "",
    },

    address: {
      addressLine: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
    },
  },

  guardianResidentialAddress: "",
  guardianOfficeAddress: "",
},

  /* EDUCATION */
 education: {
  education: [],

  competitiveExams: [],

  migrationUrl: {
    name: "",
    url: "",
  },

  migrationFile: null,

  migrationError: "",
},


  /* FINANCIAL */
  financial: {

  scholarships: [],

  grants: [],

  educationLoan: {
    bankName: "",
    branchName: "",
    amount: "",
  },

  bankAccount: {
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    ifscCode: "",
  },

  pan: "",

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

  profileSnapshot: {},
};

/* ================= HELPERS ================= */

const clean = (obj) =>
  Object.fromEntries(
    Object.entries(obj || {}).map(([k, v]) => [k, v ?? ""])
  );


/* ================= LOCAL DRAFT STORAGE ================= */

/*
  Unsubmitted form data is stored locally per user.

  Example:
  student-form-draft:<user-id-or-email>

  Only form sections are stored. Authentication, dropdowns,
  notifications, loading flags, etc. are NOT stored in the draft.
*/

const LOCAL_DRAFT_PREFIX = "student-form-draft:";

const DRAFT_SECTIONS = [
  "academic",
  "personal",
  "contact",
  "health",
  "family",
  "education",
  "financial",
  "professional",
  "residential",
  "mentor",
  "documents",
];

const getDraftUserKey = (user) => {
  if (!user) return null;

  // Prefer a stable database/user id when available.
  const id =
    user._id ||
    user.id ||
    user.userId ||
    user.studentId ||
    user.email;

  if (!id) return null;

  return `${LOCAL_DRAFT_PREFIX}${String(id).trim().toLowerCase()}`;
};

const removeFilesForStorage = (value) => {
  if (typeof File !== "undefined" && value instanceof File) {
    return undefined;
  }

  if (typeof Blob !== "undefined" && value instanceof Blob) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value
      .map(removeFilesForStorage)
      .filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, removeFilesForStorage(item)])
        .filter(([, item]) => item !== undefined)
    );
  }

  return value;
};

const getDraftSections = (state) => {
  const draft = {};

  DRAFT_SECTIONS.forEach((section) => {
    if (state[section] !== undefined) {
      draft[section] = removeFilesForStorage(state[section]);
    }
  });

  return draft;
};

const getLocalDraft = (user) => {
  if (typeof window === "undefined") return null;

  const key = getDraftUserKey(user);
  if (!key) return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed?.draft || null;
  } catch (error) {
    console.error("Failed to read local student draft:", error);
    return null;
  }
};

const saveLocalDraft = (user, state) => {
  if (typeof window === "undefined") return;

  const key = getDraftUserKey(user);
  if (!key) return;

  try {
    const draft = getDraftSections(state);

    window.localStorage.setItem(
      key,
      JSON.stringify({
        version: 1,
        updatedAt: new Date().toISOString(),
        draft,
      })
    );
  } catch (error) {
    console.error("Failed to save local student draft:", error);
  }
};

const clearLocalDraftForUser = (user) => {
  if (typeof window === "undefined") return;

  const key = getDraftUserKey(user);
  if (!key) return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to clear local student draft:", error);
  }
};

/*
  Deep merge is required because several form sections contain
  nested objects such as health.physicalDimensions, family.guardian,
  financial.bankAccount, etc.
*/
const mergeLocalDraft = (base, draft) => {
  if (!draft || typeof draft !== "object") {
    return base;
  }

  const merge = (target, source) => {
    if (!source || typeof source !== "object") {
      return target;
    }

    if (Array.isArray(source)) {
      return source;
    }

    const result = {
      ...(target && typeof target === "object" && !Array.isArray(target)
        ? target
        : {}),
    };

    Object.entries(source).forEach(([key, value]) => {
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        result[key] = merge(result[key], value);
      } else {
        result[key] = value;
      }
    });

    return result;
  };

  return merge(base, draft);
};

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

const createProfileState = (data = {}) => {
  const academicData = data.academic_details || {};
  const personalData = clean(data.personal_details);
  const visa = personalData?.visaDetails || {};
  const formattedAadhaar = personalData?.aadhaarNumber
    ? personalData.aadhaarNumber
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
    : "";

  const profile = {
    academic: {
      ...clean(academicData),
      fellowshipLetter: academicData.fellowshipLetter || {},
    },
    personal: {
      ...personalData,
      aadhaarNo: formattedAadhaar,
      dob: formatDate(personalData?.dob),
      passportExpiry: formatDate(personalData?.passportExpiry),
      passportCountry: visa?.issuingCountry || "",
      passportDoc: personalData?.passportDoc || "",
      visaType: visa?.visaType || "",
      visaNo: visa?.visaNumber || "",
      visaCountry: visa?.issuingCountry || "",
      visaIssueDate: formatDate(visa?.issueDate),
      visaExpiryDate: formatDate(visa?.expiryDate),
      visaStatus: visa?.status || "",
      visaDoc: personalData?.visaDoc || "",
      birthCertificateDoc: personalData?.birthCertificateDoc || "",
isInternational:
  personalData?.isInternational ||
  (visa?.visaType ? "yes" : "no"),    },
    contact: clean(data.contact_details),
   health: {
  bloodGroup:
    data.health_details?.bloodGroup || "",

  physicalDimensions:
    data.health_details?.physicalDimensions || {
      height: "",
      weight: "",
    },

  disabilityStatus:
    data.health_details?.disabilityStatus || false,

  disabilityDetails:
    data.health_details?.disabilityDetails || {
      disabilityType: "",
      percentage: "",
    },

  disabilityCertificate:
    data.health_details?.disabilityCertificate || {
      name: "",
      url: "",
    },

  chronicConditions:
    data.health_details?.chronicConditions || "",

  regularMedications:
    data.health_details?.regularMedications || "",

  insurance:
    data.health_details?.insurance || {
      provider: "",
      policyNumber: "",
    },

 vaccinations:
  Array.isArray(data.health_details?.vaccinations)
    ? data.health_details.vaccinations
    : [],

  disabilityFile: null,
  vaccinationFile: null,

  uploadError: "",
  vaccinationUploadError: "",
},
family: {
  father:
    data.family_details?.father || {
      name: "",
      qualification: "",
      occupation: "",
    },

  mother:
    data.family_details?.mother || {
      name: "",
      qualification: "",
      occupation: "",
    },

  annualFamilyIncome:
    data.family_details?.annualFamilyIncome || "",

  siblings:
    data.family_details?.siblings || [],

  parentContact:
    data.family_details?.parentContact || {
      countryCode: "+91",
      number: "",
    },

  parentEmail:
    data.family_details?.parentEmail || "",

  guardian:
    data.family_details?.guardian || {
      name: "",
      relation: "",

      contact: {
        countryCode: "+91",
        number: "",
      },

      address: {
        addressLine: "",
        city: "",
        district: "",
        state: "",
        pinCode: "",
      },
    },

  guardianResidentialAddress:
    data.family_details?.guardianResidentialAddress || "",

  guardianOfficeAddress:
    data.family_details?.guardianOfficeAddress || "",
},
education: {
  education:
    data.education_details?.education || [],

  competitiveExams:
    data.education_details?.competitiveExams || [],

  migrationUrl:
    data.education_details?.migrationUrl || {
      name: "",
      url: "",
    },

  migrationFile: null,

  migrationError: "",
},    financial: clean(data.financial_details),
    professional: clean(data.professional_details),
    residential: clean(data.residential_details),
    mentor: clean(data.mentor_details),
    documents: clean(data.documents),
  };

  return {
    ...profile,
    profileSnapshot: {
      academic: profile.academic,
      personal: profile.personal,
      contact: profile.contact,
      health: profile.health,
      family: profile.family,
      education: profile.education,
      financial: profile.financial,
      professional: profile.professional,
      residential: profile.residential,
      mentor: profile.mentor,
      documents: profile.documents,
    },
  };
};

export const useStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      /* LOGIN */
      login: (user, token) => {
        const localDraft = getLocalDraft(user);

        set((state) => ({
          isLoggedIn: true,
          user,
          token,

          // Restore the unfinished local draft immediately.
          ...(localDraft
            ? mergeLocalDraft(state, localDraft)
            : {}),
        }));
      },

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
deleteProfileRecord: async (section, recordId) => {
  try {
    const token = get().token;

    const response = await fetch(`${import.meta.env.VITE_SERVER}/api/student/record/${section}/${recordId}`,{
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete record.",
      };
    }

    return {
      success: true,
      data,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };

  }
},
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
if (res.status === 401) {
  get().logout();

  window.location.href = "/login";

  return;
}
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


    // A successful profile save is a committed server-side save.
    // Remove the unfinished local draft only after the API succeeds.
    clearLocalDraftForUser(get().user);

    console.log(
      "FETCHED LATEST PROFILE FROM DB"
    );

  } catch (err) {

    console.error(err);

  } finally {

    get().setLoading(false);

  }

  await get().fetchStudent();

await get().fetchCanEdit();

},
submitUnlockRequest: async (payload) => {

  try {

    const token = get().token;

    const res = await fetch(
      `${import.meta.env.VITE_SERVER}/api/unlock-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.message || "Unlock request failed"
      );
    }

    return result;

  } catch (err) {

    console.error(err);

    throw err;

  }

},
submitProfileUpdateRequest: async (payload) => {

  try {

    const token = get().token;

    const res = await fetch(
      `${import.meta.env.VITE_SERVER}/api/profile-update-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.message || "Profile update request failed"
      );
    }

    return result;

  } catch (err) {

    console.error(err);

    throw err;

  }

},
submitFieldCorrectionRequest: async (corrections, remarks = "") => {
  try {
    const token = get().token;

    const payload = {
      updateType: "field_correction",
      changes: corrections,
      remarks,
    };

    const res = await fetch(
      `${import.meta.env.VITE_SERVER}/api/profile-update-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.message || "Field correction request failed"
      );
    }

    return result;

  } catch (err) {
    console.error(err);
    throw err;
  }
},
fetchNotifications: async () => {

  try {

    const token = get().token;

    set({
      notificationLoading: true,
    });

    const res = await fetch(
      `${import.meta.env.VITE_SERVER}/api/notifications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.message || "Failed to fetch notifications."
      );
    }

    set({

      notifications: result.notifications || [],

      notificationLoading: false,

    });

    return result;

  } catch (err) {

    set({
      notificationLoading: false,
    });

    console.error(err);

    throw err;

  }

},
deleteMyNotifications: async () => {

  try {

    const token = get().token;

    const res = await fetch(
      `${import.meta.env.VITE_SERVER}/api/notifications`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.message || "Failed to delete notifications."
      );
    }

    set({
      notifications: [],
    });

    return result;

  } catch (err) {

    console.error(err);

    throw err;

  }

},

getMyUnlockRequests:
async () => {

  const SERVER =
    import.meta.env.VITE_SERVER;

  const token =
    get().token;

  const res = await fetch(
    `${SERVER}/api/unlock-request/my`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  return await res.json();

},
getMyProfileRequests: async () => {

  const SERVER =
    import.meta.env.VITE_SERVER;

  const token =
    get().token;

  const res = await fetch(
    `${SERVER}/api/student/my-requests`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  return await res.json();

},

getMyUnlockRequests: async () => {

  const SERVER =
    import.meta.env.VITE_SERVER;

  const token =
    get().token;

  const res = await fetch(
    `${SERVER}/api/unlock-request/my`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  return await res.json();

},

fetchDropdowns: async () => {
  try {
    const SERVER = import.meta.env.VITE_SERVER;

    const res = await fetch(
      `${SERVER}/api/dropdowns`
    );

    const result = await res.json();

    if (!result.success) {
      return result;
    }

    const data = result.data;

    set({
      faculty: data.faculty || [],
      programLevels: data.programLevels || [],
      departments: data.departments || [],
      degreeNames: data.degreeNames || [],
      specializations: data.specializations || [],
      currentYears: data.currentYears || [],
      currentSemesters: data.currentSemesters || [],
      studyModes: data.studyModes || [],
      admissionCategories: data.admissionCategories || [],
      genders: data.genders || [],
      nationalities: data.nationalities || [],
      religions: data.religions ||[],
      countries: data.countries || [],
      states: data.states || {},
      socialCategories: data.socialCategories || [],
      castes: data.castes || [],
      visaTypes: data.visaTypes || [],
      visaStatuses: data.visaStatuses || [],
      motherTongues: data.motherTongues || [],
      languages: data.languages || [],
      relations: data.relations || [],
      bloodGroups: data.bloodGroups || [],
      vaccinationStatuses: data.vaccinationStatuses || [],
      qualifications: data.qualifications || [],
      qualificationLevels: data.qualificationLevels || [],
      qualificationModes: data.qualificationModes || [],
      examNames: data.examNames || [],
      scholarshipCategories: data.scholarshipCategories || [],
      grantCategories: data.grantCategories || [],
      bankNames: data.bankNames || [],
      indexingServices: data.indexingServices || [],
      presentationTypes: data.presentationTypes || [],
      conferenceTypes: data.conferenceTypes || [],
      patentStatuses: data.patentStatuses || [],
      membershipTypes: data.membershipTypes || [],
      publicationTypes: data.publicationTypes || [],
publicationIndexedIn: data.publicationIndexedIn || [],
publicationStatuses: data.publicationStatuses || []
    });

    return result;

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message
    };
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
      updateSection: (section, data) => {
        set((state) => {
          const nextState = {
            ...state,
            [section]: {
              ...state[section],
              ...data,
            },
          };

          // Save automatically whenever the user changes a form section.
          // The draft is keyed to the logged-in user.
          saveLocalDraft(state.user, nextState);

          return {
            [section]: nextState[section],
          };
        });
      },

      /* LOCAL DRAFT */
      saveLocalDraft: () => {
        saveLocalDraft(get().user, get());
      },

      clearLocalDraft: () => {
        clearLocalDraftForUser(get().user);
      },

         setProfileData: (data) => {
    const serverProfile = createProfileState(data);
    const localDraft = getLocalDraft(get().user);

    set(
      localDraft
        ? mergeLocalDraft(serverProfile, localDraft)
        : serverProfile
    );

    set({ isSubmitted: !get().user?.canEdit });
  },

fetchCanEdit: async () => {
  try {
    const token = get().token;

    const email = get().user?.email;

    if (!email) {
      console.log("Email missing");
      return;
    }

    const response = await fetch(
  `${import.meta.env.VITE_SERVER}/api/user/can-edit`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      console.log("Token expired. Logging out...");

      get().logout();

      window.location.href = "/login";

      return;
    }

    const data = await response.json();

    console.log("API RESPONSE", data);

    set({
      isSubmitted: !data.canEdit,
    });
  } catch (error) {
    console.log(error);
  }
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
        updateUser: (data) =>
  set((state) => ({
    user: {
      ...state.user,
      ...data,
    },
  })),

      /* FETCH STUDENT */
fetchStudent: async () => {
  try {
    const token = get().token;

    if (!token) {
      get().logout();
      window.location.href = "/login";
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_SERVER}/api/student/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Token expired or invalid
    if (res.status === 401) {
      console.log("Token expired. Logging out...");

      get().logout();

      window.location.href = "/login";

      return;
    }

    const result = await res.json();
console.log(result);  
    console.log("STUDENT DATA", result);

    if (!result.success) {
      throw new Error(
        result.message || "Fetch failed"
      );
    }

    const data = result.data || {};

    console.log(
      "CONFERENCES FROM DB",
      data.professional_details?.conferences
    );

    const serverProfile = createProfileState(data);
    const localDraft = getLocalDraft(get().user);

    // Database remains the base profile.
    // Any unfinished local edits are applied on top.
    set(
      localDraft
        ? mergeLocalDraft(serverProfile, localDraft)
        : serverProfile
    );

    console.log(
      localDraft
        ? "FETCHED PROFILE + RESTORED LOCAL DRAFT"
        : "FETCHED LATEST PROFILE FROM DB"
    );

  } catch (err) {

    console.error(
      "Fetch error:",
      err
    );

    get().logout();

    window.location.href = "/login";
  }

  try {
    await get().fetchCanEdit();
  } catch (error) {
    console.error(error);
  }
},
submitForgotPasswordRequest: async (email) => {
  try {

    const res = await fetch(
      `${import.meta.env.VITE_SERVER}/api/forgot-password-request`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      }
    );

    const result = await res.json();

    console.log("FORGOT PASSWORD RESPONSE", result);

    if (!result.success) {
      throw new Error(
        result.message || "Request failed."
      );
    }

    return result;

  } catch (err) {

    console.error(
      "Forgot Password Error:",
      err
    );

    throw err;

  }
},
getRequestEligibility:
async () => {

  const SERVER =
    import.meta.env.VITE_SERVER;

  const token =
    get().token;

  const res =
    await fetch(

      `${SERVER}/api/unlock-request/eligibility`,

      {

        headers: {

          Authorization:
            `Bearer ${token}`

        }

      }

    );

  return await res.json();

},
      /* RESET */
      resetStore: () => {
        clearLocalDraftForUser(get().user);

        set({
          ...initialState,
        });
      },
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