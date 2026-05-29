import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

import { useStore } from "./store";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

import AcademicForm from "./pages/forms/AcademicForm";
import PersonalForm from "./pages/forms/PersonalForm";
import ContactForm from "./pages/forms/ContactForm";
import HealthForm from "./pages/forms/HealthForm";
import FamilyForm from "./pages/forms/FamilyForm";
import EducationForm from "./pages/forms/EducationForm";
import FinancialForm from "./pages/forms/FinancialForm";
import ProfessionalForm from "./pages/forms/ProfessionalForm";
import ResidentialForm from "./pages/forms/ResidentialForm";
import DocumentsForm from "./pages/forms/DocumentsForm";
import MentorDetailsForm from "./pages/forms/MentorDetailsForm";
import FinalReviewForm from "./pages/forms/FinalReviewForm";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import GradeCardPage from "./pages/GradeCardPage";

import Navbar from "./components/Navbar";
import FormSidebar from "./components/FormSidebar";
import GlobalLoader from "./components/GlobalLoader";
import DemoToggleButton from "./components/DemoToggleButton";
import ChangePassword from "./pages/ChangePassword";
import RequestUnlockPage from "./pages/RequestUnlockPage";
import MarkRequestPage from "./pages/MarkRequestPage";

function Layout() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const location = useLocation();
  const isLoading = useStore((s) => s.isLoading);
  const setLoading = useStore((s) => s.setLoading);

  const isFormPage = location.pathname.startsWith("/forms");

  useEffect(() => {
    setLoading(false);
  }, []);

  const token = useStore((s) => s.token);

const fetchStudent = useStore(
  (s) => s.fetchStudent
);

useEffect(() => {

  if (token) {

    fetchStudent();

  }

}, [token]);

  return (
    <>
      {isLoading && <GlobalLoader />}

      <div className="min-h-screen flex flex-col bg-surface-background">

        {/* NAVBAR */}
        {isLoggedIn && <Navbar />}

        {/* MAIN AREA */}
        <div className="flex flex-1 flex-col md:flex-row">

          {/* SIDEBAR */}
          {isLoggedIn && isFormPage && <FormSidebar />}

          {/* CONTENT */}
          <main className="flex-1 px-3 md:px-6 py-4 md:py-6 w-full overflow-x-hidden">
            <Routes>

              {/* AUTH */}
              <Route
                path="/login"
                element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />}
              />

              <Route
                path="/forgot-password"
                element={!isLoggedIn ? <ForgotPasswordPage /> : <Navigate to="/" />}
              />

              {/* MAIN */}
              <Route
                path="/"
                element={isLoggedIn ? <DashboardPage /> : <Navigate to="/login" />}
              />

              <Route
                path="/grade-card"
                element={isLoggedIn ? <GradeCardPage /> : <Navigate to="/login" />}
              />

              {/* FORMS */}
              <Route path="/forms/personal" element={isLoggedIn ? <PersonalForm /> : <Navigate to="/login" />} />
              <Route path="/forms/education" element={isLoggedIn ? <EducationForm /> : <Navigate to="/login" />} />
              <Route path="/forms/academic" element={isLoggedIn ? <AcademicForm /> : <Navigate to="/login" />} />
              <Route path="/forms/contact" element={isLoggedIn ? <ContactForm /> : <Navigate to="/login" />} />
              <Route path="/forms/health" element={isLoggedIn ? <HealthForm /> : <Navigate to="/login" />} />
              <Route path="/forms/family" element={isLoggedIn ? <FamilyForm /> : <Navigate to="/login" />} />
              <Route path="/forms/financial" element={isLoggedIn ? <FinancialForm /> : <Navigate to="/login" />} />
              <Route path="/forms/professional" element={isLoggedIn ? <ProfessionalForm /> : <Navigate to="/login" />} />
              <Route path="/forms/residential" element={isLoggedIn ? <ResidentialForm /> : <Navigate to="/login" />} />
              <Route path="/forms/documents" element={isLoggedIn ? <DocumentsForm /> : <Navigate to="/login" />} />
              <Route path="/forms/mentor" element={isLoggedIn ? <MentorDetailsForm /> : <Navigate to="/login" />} />
              <Route path="/forms/review" element={isLoggedIn ? <FinalReviewForm /> : <Navigate to="/login" />} />
              <Route path="/grade-card" element={isLoggedIn ? <GradeCardPage /> : <Navigate to="/login" />} />
              <Route path="/change-password" element={isLoggedIn ? <ChangePassword /> : <Navigate to="/login" />} />
              <Route path="/request" element={isLoggedIn ? <RequestUnlockPage /> : <Navigate to="/login" />} />
              <Route path="/mark-request" element={isLoggedIn ? <MarkRequestPage/> : <Navigate to="/login"/>} />

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </main>

          <DemoToggleButton />
        </div>
      </div>
    </>
  );
}

export default function App() {

  return (
    <Router>
      <Layout />
    </Router>
  );
}