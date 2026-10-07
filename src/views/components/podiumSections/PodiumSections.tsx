import { Link } from "react-router-dom";
import { FiArrowUpRight, FiPlus, FiMapPin, FiClock } from "react-icons/fi";
import { podiumContent } from "../../../content/podium";
import { danceStudioSite } from "../../../content/danceStudio";
import { useStudioDemo } from "../../../contexts/StudioDemoContext";
export function PlansSection() {
  const { plans } = useStudioDemo(); const content = podiumContent.plans;
  return <section className="podium-plans podium-section" id="formules"><div className="podium-section-heading"><p className="studio-label">{content.eyebrow}</p><h2>{content.title}</h2><p>{content.text}</p></div><div className="podium-plan-grid">{plans.map((plan, i) => <article key={plan.id} className={i === 1 ? "is-featured" : ""}><p className="studio-label">{plan.credits} cours techniques</p><h3>{plan.name}</h3><strong>{plan.price} €</strong><p>{plan.description}</p><Link className="studio-button" to="/account">Découvrir ce carnet <FiArrowUpRight aria-hidden="true" /></Link></article>)}</div><p className="podium-note">{content.note}</p></section>;
}
export function FaqSection() {
  return <section className="podium-faq podium-section" id="questions"><div><p className="studio-label">Tout commence par une question</p><h2>{podiumContent.faq.title}</h2><Link className="studio-button" to="/?section=reserve">Faire le premier pas <FiArrowUpRight aria-hidden="true" /></Link></div><div>{podiumContent.faq.items.map(item => <details key={item.question}><summary>{item.question}<FiPlus aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></section>;
}
export function VisitSection() {
  const visit = podiumContent.visit;
  return <section className="podium-visit podium-section" id="contact"><p className="studio-label">Nous trouver</p><h2>{visit.title}</h2><div className="podium-visit-grid"><article><FiMapPin aria-hidden="true" /><h3>Le studio</h3><p>{visit.address}</p><p className="podium-note">{visit.addressNote}</p><a href="https://www.google.com/maps/search/?api=1&query=Le+Podium+Pole+Dance+Tonnay-Charente" target="_blank" rel="noreferrer">Préparer mon trajet <FiArrowUpRight aria-hidden="true" /></a></article><article><FiClock aria-hidden="true" /><h3>Les horaires</h3><p>{visit.hours}</p><p className="podium-note">{visit.hoursNote}</p></article><article><h3>On en parle ?</h3><a href={`tel:${danceStudioSite.footer.phone.replaceAll(" ", "")}`}>{danceStudioSite.footer.phone}</a><a href={`mailto:${danceStudioSite.footer.email}`}>{danceStudioSite.footer.email}</a><a href="https://www.lepodiumpoledance.com/book-online" target="_blank" rel="noreferrer">Réserver sur le site actuel <FiArrowUpRight aria-hidden="true" /></a></article></div></section>;
}
