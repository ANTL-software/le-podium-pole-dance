import type { DanceStudioSite } from "../../../types/danceStudio.types";
import "./siteFooter.scss";
import { Link } from "react-router-dom";
import logo from "../../../assets/le-podium-logo.png";

type SiteFooterProps = { brand: string; footer: DanceStudioSite["footer"] };

export function SiteFooter({ brand, footer }: SiteFooterProps) {
  return <footer className="podium-footer"><div className="podium-brand"><img src={logo} alt="Logo Le Podium" width="72" height="72" /><span>{brand}<small>Pole Dance</small></span></div><div><a href={`mailto:${footer.email}`}>{footer.email}</a><a href={`tel:${footer.phone.replaceAll(" ", "")}`}>{footer.phone}</a><p>{footer.city}</p></div><div><Link to="/account">Espace adhérent</Link><Link to="/admin">Administration · démo</Link><Link to="/confidentialite">Confidentialité de la démo</Link><p>© {new Date().getFullYear()} {brand} · Préversion ANTL</p></div></footer>;
}
