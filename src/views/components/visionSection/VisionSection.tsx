import type { DanceStudioSite } from "../../../types/danceStudio.types";
import { StudioLink } from "../studioLink/StudioLink";
import "./visionSection.scss";

type VisionSectionProps = { vision: DanceStudioSite["vision"] };

export function VisionSection({ vision }: VisionSectionProps) {
  return <section className="studio-split" id="vision"><div className="studio-split__image"><img alt={vision.image.alt} src={vision.image.src} style={{ objectPosition: vision.image.position }} /></div><div className="studio-split__copy"><p className="studio-label">{vision.eyebrow}</p><h2>{vision.title}</h2><p>{vision.text}</p><StudioLink className="studio-button" link={vision.cta} showArrow /></div></section>;
}
