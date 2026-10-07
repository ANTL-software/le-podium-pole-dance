import type { DanceStudioSite } from "../../../types/danceStudio.types";
import { Link } from "react-router-dom";
import { StudioLink } from "../studioLink/StudioLink";
import "./siteHeader.scss";
import logo from "../../../assets/le-podium-logo.png";
import { FiArrowUpRight } from "react-icons/fi";

type SiteHeaderProps = { site: DanceStudioSite };

export function SiteHeader({ site }: SiteHeaderProps) {
  return <header className="podium-header"><Link className="podium-brand" to="/"><img src={logo} alt="" width="64" height="64" /><span>{site.brand}<small>Pole Dance</small></span></Link><nav aria-label="Navigation principale">{site.navigation.map(item => <StudioLink link={item} key={item.label} />)}</nav><Link className="studio-button" to="/account">Mon espace <FiArrowUpRight aria-hidden="true" /></Link></header>;
}
