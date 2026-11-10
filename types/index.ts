export type MemberPosition = "Consagrado" | "Aspirante" | "Vocacionado" | "Voluntário";
export type Member = { id: number; name: string; phone: string; city: string; group: string; position: MemberPosition; status: "Ativo" | "Inativo"; since: string; email: string; avatar: string; attendance: number };
export type EventItem = { id: number; name: string; type: string; date: string; time: string; location: string; owner: string; status: "Confirmado" | "Em breve" | "Concluído"; attendees: number; description?: string; capacity?: number; observations?: string };
export type Organizer = { id: number; name: string; permission: string; email: string; phone: string; status: "Ativo" | "Pendente" };
