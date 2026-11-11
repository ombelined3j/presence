import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { GuestOnly, ProtectedLayout, PublicLayout } from './components/Layouts';
import { AuthProvider } from './contexts/AuthContext';
import AdminPage from './pages/AdminPage';
import CenteringSessionPage from './pages/CenteringSessionPage';
import DashboardPage from './pages/DashboardPage';
import DiagnosticPage from './pages/DiagnosticPage';
import DiagnosticResultPage from './pages/DiagnosticResultPage';
import DojoExercisePage from './pages/DojoExercisePage';
import DojoPage from './pages/DojoPage';
import FocusPage from './pages/FocusPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import PrepareSituationPage from './pages/PrepareSituationPage';
import ProfilePage from './pages/ProfilePage';
import ReminderPage from './pages/ReminderPage';
import SignUpPage from './pages/SignUpPage';
import SOSPage from './pages/SOSPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/diagnostic" element={<DiagnosticPage />} />
            <Route path="/diagnostic/resultat" element={<DiagnosticResultPage />} />
            <Route path="/inscription" element={<GuestOnly><SignUpPage /></GuestOnly>} />
            <Route path="/connexion" element={<GuestOnly><LoginPage /></GuestOnly>} />
          </Route>

          {/* Protégé, sans navigation : accueil après inscription */}
          <Route element={<ProtectedLayout bare />}>
            <Route path="/bienvenue" element={<ReminderPage />} />
          </Route>

          {/* Protégé, avec navigation */}
          <Route element={<ProtectedLayout />}>
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/app/seance" element={<CenteringSessionPage source="daily" />} />
            <Route path="/app/seance/preparer" element={<PrepareSituationPage source="daily" />} />
            <Route path="/app/sos" element={<SOSPage />} />
            <Route path="/app/dojo" element={<DojoPage />} />
            <Route path="/app/dojo/:id" element={<DojoExercisePage />} />
            <Route path="/app/focus" element={<FocusPage />} />
            <Route path="/app/focus/audio/:id" element={<CenteringSessionPage source="focus" />} />
            <Route path="/app/focus/situation" element={<PrepareSituationPage source="focus" />} />
            <Route path="/app/profil" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
