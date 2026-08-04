import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layout/MainLayout";

import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PlayersListPage from "./pages/PlayersListPage";
import EducationalDetailsPage from "./pages/EducationalDetailsPage";
import AchievementsPage from "./pages/AchievementsPage";
import PreviewPage from "./pages/PreviewPage";
import PersonalProfilePage from "./pages/PersonalProfilePage";
import TeamDetailsPage from "./pages/TeamDetailsPage";
import ClubDetailsPage from "./pages/ClubDetailsPage";
import SportProfileDetailPage from "./pages/SportProfileDetailPage";
import SportProfilesPage from "./pages/SportProfilesPage";

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
                  <PersonalProfilePage />
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
              path="/account/sports/:sportProfileId"
              element={
                <ProtectedRoute>
                  <SportProfileDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/sports"
              element={
                <ProtectedRoute>
                  <SportProfilesPage />
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
                  <TeamDetailsPage />
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
