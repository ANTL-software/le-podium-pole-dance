import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createMemberCourses, memberContent } from "../content/member";
import { danceStudioSite } from "../content/danceStudio";
import type { Course, MemberPlan } from "../types/member";
import type { StudioFeature } from "../types/danceStudio.types";

export type StudioDemoSettings = { plans: MemberPlan[]; courses: Course[]; services: StudioFeature[] };
type StudioDemoContextValue = StudioDemoSettings & { save: (settings: StudioDemoSettings) => void; reset: () => void; notice: string };
const key = "le-podium-studio-demo-v1";
const StudioContext = createContext<StudioDemoContextValue | null>(null);
const initial = (): StudioDemoSettings => ({ plans: [...memberContent.plans], courses: createMemberCourses(), services: [...danceStudioSite.classes.items] });
function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
function valid(value: unknown): value is StudioDemoSettings {
  if (!record(value) || !Array.isArray(value.plans) || !Array.isArray(value.courses) || !Array.isArray(value.services)) return false;
  return value.plans.length > 0 && value.plans.every(p => record(p) && typeof p.id === "string" && typeof p.name === "string" && typeof p.description === "string" && typeof p.price === "number" && Number.isFinite(p.price) && p.price > 0 && Number.isSafeInteger(p.credits) && Number(p.credits) > 0) &&
    value.courses.every(c => record(c) && ["id", "title", "level", "instructor", "room", "startsAt"].every(k => typeof c[k] === "string") && Number.isFinite(Date.parse(String(c.startsAt))) && Number.isSafeInteger(c.duration) && Number(c.duration) > 0 && Number.isSafeInteger(c.capacity) && Number(c.capacity) > 0 && Number.isSafeInteger(c.occupied) && Number(c.occupied) >= 0 && Number(c.occupied) <= Number(c.capacity)) &&
    value.services.every(s => record(s) && ["number", "title", "text"].every(k => typeof s[k] === "string"));
}
function load(): StudioDemoSettings {
  try { const candidate: unknown = JSON.parse(localStorage.getItem(key) ?? "null"); if (valid(candidate)) return candidate; } catch { /* Start with the public demonstration. */ }
  return initial();
}
export function StudioDemoProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(load);
  const [notice, setNotice] = useState("");
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(settings)); } catch { setNotice("Stockage indisponible : modifications conservées uniquement pendant cette session."); } }, [settings]);
  function save(candidate: StudioDemoSettings) { if (!valid(candidate)) { setNotice("Vérifiez les dates, montants et capacités."); return; } setSettings({ courses: candidate.courses, plans: candidate.plans, services: candidate.services }); setNotice("Modifications enregistrées dans ce navigateur uniquement."); }
  return <StudioContext.Provider value={{ ...settings, save, reset: () => { setSettings(initial()); setNotice("Configuration de démonstration réinitialisée."); }, notice }}>{children}</StudioContext.Provider>;
}
export function useStudioDemo() { const context = useContext(StudioContext); if (!context) throw new Error("StudioDemoProvider is required"); return context; }
