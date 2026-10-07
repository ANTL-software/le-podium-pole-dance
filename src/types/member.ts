export type AccountTab = "overview" | "schedule" | "bookings" | "membership" | "billing" | "profile";
export type MemberProfile = { firstName: string; lastName: string; email: string; phone: string; emergencyContact: string; notifications: boolean };
export type Course = { id: string; title: string; level: string; instructor: string; startsAt: string; duration: number; capacity: number; occupied: number; room: string };
export type Enrollment = { courseId: string; status: "confirmed" | "waiting" | "cancelled" | "attended" };
export type MemberPlan = { id: string; name: string; price: number; credits: number; description: string };
export type MemberInvoice = { id: string; date: string; label: string; amount: number };
export type MemberState = { version: 1; profile: MemberProfile; planId: string; credits: number; renewal: boolean; enrollments: Enrollment[]; invoices: MemberInvoice[] };
