import type { DanceStudioSite } from "../../../types/danceStudio.types";
import "./foundersSection.scss";

type FoundersSectionProps = { founders: DanceStudioSite["founders"] };

export function FoundersSection({ founders }: FoundersSectionProps) {
  return <section className="studio-founders" id="fondateurs"><div className="studio-founders__intro"><p className="studio-label">{founders.eyebrow}</p><blockquote>{founders.quote}</blockquote></div><div className="studio-founders__grid">{founders.people.map((person) => <article className={`studio-founder studio-founder--${person.panel}`} key={person.name}><div className="studio-founder__visual"><img alt={person.image.alt} src={person.image.src} /></div><p>{person.name}<small>{person.role}</small></p></article>)}</div></section>;
}
