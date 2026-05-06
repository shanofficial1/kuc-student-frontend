// This replaces TypeScript interfaces with default state objects

export const academicDefault = {
  admissionAppNo: "",
  enrollmentNo: "",
  rollNo: "",
  faculty: "",
  department: "",
  programLevel: "",
  degreeName: "",
  year: "",
  semester: "",
  batch: "",
  academicCycle: "",
  modeOfStudy: "",
  admissionCategory: "",
  fellowshipNo: "",
};

export const personalDefault = {
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
};

export const contactDefault = {
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
};

export const healthDefault = {
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
};

export const familyDefault = {
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
};

export const educationDefault = {
  academicRecords: [],
  competitiveExams: [],
  migrationCertificateUploaded: false,
};

export const financialDefault = {
  scholarshipCategory: "",
  feeWaiverDocUrl: "",
  loanBankName: "",
  loanBranch: "",
  loanAmount: "",
  bankAccountHolder: "",
  panNumber: "",
  accountNumber: "",
  ifscCode: "",
};

export const professionalDefault = {
  publications: [],
  conferences: [],
  experience: [],
  skills: "",
};

export const residentialDefault = {
  type: "Day Scholar",
  hostelBlock: "",
  roomNo: "",
  bedType: "",
  messPreference: "",
  transportOpted: false,
  busRouteId: "",
  pickupPoint: "",
  vehicleReg: "",
};

export const documentsDefault = [];

export const mentorDefault = {
  tutorName: "",
  tutorEmail: "",
  hodName: "",
  hodEmail: "",
};