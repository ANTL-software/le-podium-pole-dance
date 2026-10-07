import { Link, Navigate } from "react-router-dom";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import logo from "../../../assets/le-podium-logo.png";
import { useDemoSession } from "../../../contexts/DemoSessionContext";
export function DemoAccessPage() {
  const session = useDemoSession();
  if (session.connected) return <Navigate to="/account" replace />;
  return <main className="podium-access"><Link to="/" className="podium-back"><FiArrowLeft aria-hidden="true" /> Le site du studio</Link><section><img src={logo} alt="Le Podium Pole Dance" width="105" height="105" /><p className="studio-label">Votre espace, tout simplement</p><h1>Votre prochain cours vous attend.</h1><p>Explorez le planning, les réservations et les carnets avec le compte fictif de Julie.</p><button className="studio-button" onClick={session.signIn}>Ouvrir le compte démo <FiArrowRight aria-hidden="true" /></button><p className="podium-note">Aucun mot de passe demandé. N’entrez aucune donnée personnelle. Ce parcours simule une connexion persistante, mais ne remplace pas une authentification sécurisée.</p></section></main>;
}
