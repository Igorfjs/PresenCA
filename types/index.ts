export type MemberPosition = "Consagrado" | "Aspirante" | "Vocacionado" | "Voluntário";
export type LastVisit = { date: string; event: string } | null;
export type Member = { id: number; name: string; phone: string; city: string; group: string; position: MemberPosition; status: "Ativo" | "Inativo"; since: string; email: string; avatar: string; attendance: number; lastVisit?: LastVisit };
export type EventItem = { id: number; name: string; type: string; date: string; time: string; location: string; owner: string; status: "Confirmado" | "Em breve" | "Cancelado" | "Concluído"; attendees: number; description?: string; capacity?: number; observations?: string; seriesId?: string; scheduleException?: boolean };
export type RecurringEventTemplate = { id: string; name: string; type: string; weekday: number; time: string; location: string; owner: string; capacity: number; description: string; observations: string };
export type Organizer = { id: number; name: string; permission: string; email: string; phone: string; status: "Ativo" | "Pendente" };
