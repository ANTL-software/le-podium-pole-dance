import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import type { StudioLink as StudioLinkData } from "../../../types/danceStudio.types";
import "./studioLink.scss";

type StudioLinkProps = { className?: string; link: StudioLinkData; showArrow?: boolean };

export function StudioLink({ className, link, showArrow = false }: StudioLinkProps) {
  const content = <>{link.label}{showArrow ? <FiArrowUpRight aria-hidden="true" /> : null}</>;

  if (link.href.startsWith("#")) {
    return <Link className={className} to={{ pathname: "/", search: `?section=${link.href.slice(1)}` }}>{content}</Link>;
  }

  return <a className={className} href={link.href}>{content}</a>;
}
