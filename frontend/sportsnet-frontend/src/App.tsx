import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layout/MainLayout";

import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PlayersListPage from "./pages/PlayersListPage";
import ProfilePage from "./pages/ProfilePage";
import EducationalDetailsPage from "./pages/EducationalDetailsPage";
import ClubDetailsPage from "./pages/ClubDetailsPage";
import TeamDetails from "./pages/TeamDetails";
import AchievementsPage from "./pages/AchievementsPage";
import PreviewPage from "./pages/PreviewPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />

          <Route element={<MainLayout />}>
            {/* Public routes — no login required */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/players" element={<PlayersListPage />} />

            {/* Protected routes — login required */}
            <Route
              path="/account/personal"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/education"
              element={
                <ProtectedRoute>
                  <EducationalDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/clubs"
              element={
                <ProtectedRoute>
                  <ClubDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/teams"
              element={
                <ProtectedRoute>
                  <TeamDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/achievements"
              element={
                <ProtectedRoute>
                  <AchievementsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/preview"
              element={
                <ProtectedRoute>
                  <PreviewPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
