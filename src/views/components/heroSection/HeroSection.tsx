import type { DanceStudioSite } from "../../../types/danceStudio.types";
import { StudioLink } from "../studioLink/StudioLink";
import "./heroSection.scss";
import { podiumContent } from "../../../content/podium";

type HeroSectionProps = { hero: DanceStudioSite["hero"] };

export function HeroSection({ hero }: HeroSectionProps) {
  return <section className="podium-hero" id="top"><div className="podium-hero__copy"><p className="studio-label">{podiumContent.hero.eyebrow}</p><h1>{hero.title}</h1><p>{podiumContent.hero.intro}</p><div className="podium-hero__actions"><StudioLink className="studio-button" link={hero.cta} showArrow /><StudioLink className="podium-text-link" link={{ label: podiumContent.hero.secondary, href: "#vision" }} /></div><small>Pole dance · Confiance · Expression</small></div><figure><img alt={hero.image.alt} src={hero.image.src} style={{ objectPosition: hero.image.position }} fetchPriority="high" /><figcaption>{podiumContent.hero.imageCaption}</figcaption></figure></section>;
}
