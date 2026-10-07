import { createContext, useContext, useState, type ReactNode } from "react";
const key = "le-podium-demo-session";
type DemoSession = { connected: boolean; signIn: () => void; signOut: () => void };
const SessionContext = createContext<DemoSession | null>(null);
function load() { try { return localStorage.getItem(key) === "demo"; } catch { return false; } }
export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(load);
  function signIn() { try { localStorage.setItem(key, "demo"); } catch { /* Session-only fallback. */ } setConnected(true); }
  function signOut() { try { localStorage.removeItem(key); } catch { /* Session-only fallback. */ } setConnected(false); }
  return <SessionContext.Provider value={{ connected, signIn, signOut }}>{children}</SessionContext.Provider>;
}
export function useDemoSession() { const session = useContext(SessionContext); if (!session) throw new Error("DemoSessionProvider is required"); return session; }
