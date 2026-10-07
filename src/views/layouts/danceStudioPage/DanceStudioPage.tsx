import type { CSSProperties, ReactNode } from "react";
import { useDanceStudioPage } from "../../../hooks/useDanceStudioPage";
import type { DanceStudioSite, StudioSectionId } from "../../../types/danceStudio.types";
import { ClassesSection, FoundersSection, HeroSection, ReserveSection, SiteFooter, SiteHeader, StudioLink, Ticker, VisionSection } from "../../components";
import "./danceStudioPage.scss";
import { FaqSection, PlansSection, VisitSection } from "../../components/podiumSections";
import { InstallHelp } from "../../components/installHelp/InstallHelp";
import { Link } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";

const sectionComponents: Record<StudioSectionId, (site: DanceStudioSite) => ReactNode> = {
  hero: (site) => <><HeroSection hero={site.hero} /><Ticker items={site.ticker} /></>,
  vision: (site) => <VisionSection vision={site.vision} />,
  classes: (site) => <ClassesSection classes={site.classes} />,
  founders: (site) => <FoundersSection founders={site.founders} />,
  reserve: (site) => <ReserveSection reserve={site.reserve} />,
  plans: () => <PlansSection />,
  faq: () => <FaqSection />,
  visit: () => <VisitSection />,
};

type StudioThemeVariable = "--studio-canvas" | "--studio-surface" | "--studio-ink" | "--studio-muted" | "--studio-line" | "--studio-accent" | "--studio-button" | "--studio-button-ink" | "--studio-font-body" | "--studio-font-mono";
type StudioThemeStyle = CSSProperties & Record<StudioThemeVariable, string>;

function getThemeStyle(theme: DanceStudioSite["theme"]): StudioThemeStyle {
  const { palette, typography } = theme;

  return {
    "--studio-canvas": palette.canvas,
    "--studio-surface": palette.surface,
    "--studio-ink": palette.ink,
    "--studio-muted": palette.muted,
    "--studio-line": palette.line,
    "--studio-accent": palette.accent,
    "--studio-button": palette.button,
    "--studio-button-ink": palette.buttonInk,
    "--studio-font-body": typography.body,
    "--studio-font-mono": typography.mono,
  };
}

export function DanceStudioPage() {
  const { site } = useDanceStudioPage();
  const heroEnabled = site.sections.some((section) => section.id === "hero" && section.enabled);
  const sections = site.sections.filter((section) => section.enabled && section.id !== "hero");

  return <main className={`dance-studio ${site.theme.className}`} style={getThemeStyle(site.theme)}>
    <div className="podium-intro">
      <SiteHeader site={site} />
      {heroEnabled ? sectionComponents.hero(site) : null}
    </div>
    {sections.map((section) => <div key={section.id}>{sectionComponents[section.id](site)}</div>)}
    <SiteFooter brand={site.brand} footer={site.footer} />
    <InstallHelp />
    <Link className="podium-mobile-cta" to="/account"><FiCalendar aria-hidden="true" /> Planning & réservation <span>Démo</span></Link>
  </main>;
}

export function DanceNotFoundPage() {
  const { site } = useDanceStudioPage();

  return <main className={`dance-studio ${site.theme.className} dance-not-found`} style={getThemeStyle(site.theme)}><SiteHeader site={site} /><section><p className="studio-label">404</p><h1>Cette scène est vide.</h1><p>La page que vous cherchez ne fait plus partie de la programmation.</p><StudioLink className="studio-button" link={{ label: "Retour à l'accueil", href: "#top" }} showArrow /></section><SiteFooter brand={site.brand} footer={site.footer} /></main>;
}
