import type { DanceStudioSite } from "../../../types/danceStudio.types";
import { StudioLink } from "../studioLink/StudioLink";
import "./classesSection.scss";

type ClassesSectionProps = { classes: DanceStudioSite["classes"] };

export function ClassesSection({ classes }: ClassesSectionProps) {
  return <section className="studio-classes" id="cours"><div className="studio-classes__heading"><p className="studio-label">{classes.eyebrow}</p><h2>{classes.title}</h2><p>{classes.text}</p><StudioLink className="studio-button" link={classes.cta} showArrow /></div><div className="studio-classes__list">{classes.items.map((item) => <article key={item.number}><p>{item.number}</p><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>;
}
