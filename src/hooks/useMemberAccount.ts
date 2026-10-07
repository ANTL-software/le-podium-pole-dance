import { useEffect, useState } from "react";
import { createInitialMemberState, createMemberCourses, memberContent } from "../content/member";
import type { Course, MemberInvoice, MemberProfile, MemberState } from "../types/member";
import { useStudioDemo } from "../contexts/StudioDemoContext";

function loadState(): MemberState {
  try { const raw: unknown = JSON.parse(localStorage.getItem(memberContent.storageKey) ?? "null");
    if (typeof raw === "object" && raw !== null && "version" in raw && raw.version === 1 && "profile" in raw && "enrollments" in raw && "invoices" in raw && "credits" in raw && "planId" in raw && "renewal" in raw) {
      const candidate = raw as MemberState;
      if (typeof candidate.profile.firstName === "string" && Array.isArray(candidate.enrollments) && Array.isArray(candidate.invoices) && typeof candidate.credits === "number" && memberContent.plans.some(plan => plan.id === candidate.planId)) return candidate;
    }
  } catch { /* A damaged demo can be restarted safely. */ }
  return createInitialMemberState();
}
export function useMemberAccount() {
  const [state, setState] = useState(loadState);
  const { courses, plans } = useStudioDemo();
  const [notice, setNotice] = useState("");
  useEffect(() => { try { localStorage.setItem(memberContent.storageKey, JSON.stringify(state)); } catch { setNotice("Le navigateur ne permet pas de conserver cette démo. Votre session reste utilisable."); } }, [state]);
  const plan = plans.find(item => item.id === state.planId) ?? plans[0];
  function enroll(course: Course) {
    if (state.enrollments.some(item => item.courseId === course.id && item.status !== "cancelled")) return;
    const waiting = course.occupied >= course.capacity;
    if (!waiting && state.credits < 1) { setNotice("Votre solde est épuisé. Rechargez des crédits depuis Mon adhésion."); return; }
    setState(current => ({ ...current, credits: current.credits - (waiting ? 0 : 1), enrollments: [...current.enrollments.filter(item => item.courseId !== course.id), { courseId: course.id, status: waiting ? "waiting" : "confirmed" }] }));
    setNotice(waiting ? "Vous êtes sur la liste d’attente. Aucun crédit n’a été débité." : "Votre place est réservée. Un crédit a été utilisé.");
  }
  function cancel(course: Course) {
    const enrollment = state.enrollments.find(item => item.courseId === course.id);
    const refund = enrollment?.status === "confirmed" && new Date(course.startsAt).getTime() - Date.now() >= memberContent.cancellationHours * 3600000;
    setState(current => ({ ...current, credits: current.credits + (refund ? 1 : 0), enrollments: current.enrollments.map(item => item.courseId === course.id ? { ...item, status: "cancelled" } : item) }));
    setNotice(enrollment?.status === "waiting" ? "Vous avez quitté la liste d’attente. Aucun crédit n’avait été utilisé." : refund ? "Réservation annulée et crédit restitué." : `Inscription annulée. Les annulations à moins de ${memberContent.cancellationHours}h ne restituent pas de crédit.`);
  }
  function changePlan(id: string) {
    const selected = plans.find(item => item.id === id); if (!selected || id === state.planId) return;
    setState(current => ({ ...current, planId: id, credits: current.credits + selected.credits, invoices: [{ id: `DEMO-${Date.now()}`, date: new Date().toISOString(), label: `Activation ${selected.name}`, amount: selected.price }, ...current.invoices] }));
    setNotice("Formule activée en démo et crédits ajoutés. Aucun paiement réel.");
  }
  function topUp() { setState(current => ({ ...current, credits: current.credits + memberContent.extraCredits.quantity, invoices: [{ id: `DEMO-${Date.now()}`, date: new Date().toISOString(), label: "Carnet 5 cours", amount: memberContent.extraCredits.price }, ...current.invoices] })); setNotice("5 crédits ajoutés en démo. Aucun paiement réel."); }
  function saveProfile(profile: MemberProfile) { setState(current => ({ ...current, profile })); setNotice("Vos informations ont été enregistrées."); }
  function toggleRenewal() { setState(current => ({ ...current, renewal: !current.renewal })); setNotice("Préférence de renouvellement mise à jour en démo."); }
  function reset() { setState(createInitialMemberState()); setNotice("Le scénario de démonstration a été réinitialisé."); }
  function downloadInvoice(invoice: MemberInvoice) {
    const date = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris" }).format(new Date(invoice.date));
    const amount = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(invoice.amount);
    const blob = new Blob([`JUSTIFICATIF DE DÉMONSTRATION — NON COMPTABLE\n${invoice.id}\n${invoice.label}\n${date}\nMontant fictif : ${amount}\nAucun paiement réel.`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.id}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Votre justificatif de démonstration est prêt au téléchargement.");
  }
  return { state, plan, courses, plans, notice, enroll, cancel, changePlan, topUp, saveProfile, toggleRenewal, reset, downloadInvoice };
}
