import type { AccountTab, Course, MemberPlan, MemberState } from "../types/member";
export const memberContent = {
  brand: "Le Podium", subtitle: "Votre espace · démonstration", storageKey: "le-podium-member-demo-v1",
  tabs: [{ id: "overview", label: "Mon espace" }, { id: "schedule", label: "Planning des cours" }, { id: "bookings", label: "Mes réservations" }, { id: "membership", label: "Mes carnets" }, { id: "billing", label: "Mes paiements" }, { id: "profile", label: "Mon profil" }] satisfies { id: AccountTab; label: string }[],
  plans: [
    { id: "discovery", name: "Carnet 5 cours", price: 90, credits: 5, description: "Pour commencer à votre rythme. Validité indicative : 3 mois." },
    { id: "regular", name: "Carnet 10 cours", price: 180, credits: 10, description: "Pour installer votre pratique. Validité indicative : 6 mois." },
    { id: "passion", name: "Carnet 15 cours", price: 260, credits: 15, description: "Pour poursuivre votre progression. Validité indicative : 8 mois." }
  ] satisfies MemberPlan[],
  cancellationHours: 24, extraCredits: { quantity: 5, price: 90 }
};
function dateAt(offset: number, hour: number): string {
  const date = new Date(); date.setDate(date.getDate() + offset); date.setHours(hour, 0, 0, 0); return date.toISOString();
}
export function createMemberCourses(): Course[] {
  return Array.from({ length: 7 }, (_, day) => [
    { id: `pole-${day}`, title: "Pole débutant", level: "Débutant", instructor: "Équipe Le Podium · démo", startsAt: dateAt(day + 1, 18), duration: 60, capacity: 8, occupied: day === 1 ? 8 : 4 + day % 3, room: "Studio Le Podium" },
    { id: `flow-${day}`, title: day % 2 ? "Souplesse" : "Pole choré", level: "Tous niveaux", instructor: "Équipe Le Podium · démo", startsAt: dateAt(day + 1, 19), duration: 60, capacity: 10, occupied: 5 + day % 4, room: "Studio Le Podium" },
    { id: `inter-${day}`, title: "Pole niveau 1", level: "Niveau 1", instructor: "Équipe Le Podium · démo", startsAt: dateAt(day + 1, 20), duration: 75, capacity: 8, occupied: day === 3 ? 8 : 3, room: "Studio Le Podium" }
  ]).flat();
}
export function createInitialMemberState(): MemberState {
  return { version: 1, profile: { firstName: "Julie", lastName: "Démo", email: "julie@example.com", phone: "06 00 00 00 00", emergencyContact: "Contact fictif", notifications: true }, planId: "regular", credits: 6, renewal: false,
    enrollments: [{ courseId: "pole-0", status: "confirmed" }, { courseId: "flow-2", status: "confirmed" }],
    invoices: [{ id: "DEMO-001", date: new Date().toISOString(), label: "Carnet 10 cours · achat ponctuel fictif", amount: 180 }] };
}
