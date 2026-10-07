import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useRouteScroll } from "./hooks";
import { DanceNotFoundPage, DanceStudioPage } from "./views/layouts/danceStudioPage";
import { MemberAccountPage } from "./views/layouts/memberAccount/MemberAccountPage";
import { DemoAccessPage } from "./views/layouts/demoAccess/DemoAccessPage";
import { AdminDemoPage } from "./views/layouts/adminDemo/AdminDemoPage";
import { PrivacyPage } from "./views/layouts/privacy/PrivacyPage";
import { DemoSessionProvider, useDemoSession } from "./contexts/DemoSessionContext";
import { StudioDemoProvider } from "./contexts/StudioDemoContext";
import { danceStudioSite } from "./content/danceStudio";
import { getThemeStyle } from "./utils/studioTheme";

function AccountRoute() { const session = useDemoSession(); return session.connected ? <MemberAccountPage /> : <Navigate to="/connexion" replace />; }

function RoutedApp() {
  useRouteScroll();

  return <Routes><Route path="/" element={<DanceStudioPage />} /><Route path="/connexion" element={<DemoAccessPage />} /><Route path="/account" element={<AccountRoute />} /><Route path="/admin" element={<AdminDemoPage />} /><Route path="/confidentialite" element={<PrivacyPage />} /><Route path="*" element={<DanceNotFoundPage />} /></Routes>;
}

export default function App() {
  return <div className="theme-podium" style={getThemeStyle(danceStudioSite.theme)}><DemoSessionProvider><StudioDemoProvider><HashRouter><RoutedApp /></HashRouter></StudioDemoProvider></DemoSessionProvider></div>;
}
