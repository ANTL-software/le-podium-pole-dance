import danceHeroImage from "../assets/dance-hero.png";
import studioAmbiance from "../assets/studio-cocon.png";
import type { DanceStudioSite } from "../types/danceStudio.types";
export const danceStudioSite: DanceStudioSite = {
  theme: { id: "podium", className: "theme-podium", palette: { canvas: "#f7f1e8", surface: "#fffaf4", ink: "#40352f", muted: "#73645b", line: "#ddcec1", accent: "#1f9eb3", button: "#f2b0d6", buttonInk: "#40352f" }, typography: { body: '"DM Sans", Arial, sans-serif', mono: '"DM Mono", monospace' } },
  brand: "Le Podium", address: "Tonnay-Charente · près de Rochefort",
  navigation: [{ label: "Le studio", href: "#vision" }, { label: "Les cours", href: "#cours" }, { label: "Les formules", href: "#formules" }],
  hero: { title: "Votre moment.\nVotre mouvement.", cta: { label: "Trouver mon cours", href: "#reserve" }, image: { src: studioAmbiance, alt: "Illustration d’un studio de pole dance lumineux, aux tons beige et rosé", position: "center" } },
  ticker: ["Pole dance à Tonnay-Charente", "Débuter, progresser, se retrouver", "Des cours pour chaque étape"],
  vision: { eyebrow: "Un studio à taille humaine", title: "Un peu de force.\nBeaucoup de vous.", text: "Né d’une passion découverte en 2020, Le Podium a trouvé son studio à Tonnay-Charente en 2025. Un lieu pour apprendre la pole dance, prendre confiance et partager le plaisir du mouvement, à votre rythme.", cta: { label: "Découvrir les cours", href: "#cours" }, image: { src: danceHeroImage, alt: "Danseuse en mouvement — visuel provisoire du template, non réalisé au Podium", position: "70% top" } },
  classes: { eyebrow: "Les cours", title: "Une pratique qui vous ressemble.", text: "Un premier pas, une nouvelle figure ou simplement le plaisir de danser : trouvez le cours adapté à votre envie et à votre niveau.", cta: { label: "Voir le planning démo", href: "#reserve" }, items: [
    { number: "01", title: "Initiation & fondamentaux", text: "Découvrir la barre, les appuis et les premiers mouvements. Aucune expérience en danse n’est nécessaire pour commencer." },
    { number: "02", title: "Pole technique", text: "Des bases aux niveaux intermédiaires : construire sa force et sa technique, entre static, spinning et enchaînements." },
    { number: "03", title: "Choré & souplesse", text: "Explorer l’expression avec la pole choré, la chair dance et les cours de souplesse. Les formats varient selon le planning." }
  ] },
  founders: { eyebrow: "Le studio", quote: "Un lieu pour apprendre, partager et prendre confiance.", people: [] },
  reserve: { title: "On se retrouve\nau studio ?", text: "Essayez le parcours de réservation ci-dessous. Planning, places et inscriptions sont fictifs : aucune réservation réelle n’est envoyée au studio.", bookingDemo: { title: "Essayer la réservation", serviceId: "podium-decouverte", resourceId: "podium-studio", timeZone: "Europe/Paris", durationMinutes: 60, storageKey: "le-podium-booking-demo-v1" } },
  footer: { email: "goronbord.entreprise@gmail.com", phone: "06 84 55 79 04", city: "70 rue Alsace Lorraine · 17430 Tonnay-Charente" },
  sections: [{ id: "hero", enabled: true }, { id: "vision", enabled: true }, { id: "classes", enabled: true }, { id: "plans", enabled: true }, { id: "reserve", enabled: true }, { id: "faq", enabled: true }, { id: "visit", enabled: true }]
};
