import type { EventItem, Member, Organizer } from "@/types";

const names = ["João Gonzaga", "Andrezza Palmeira", "Jaine Negreiros", "Igor Felipe", "Ana Flávia", "Fernanda Santos", "Milena Apolinário", "Leon Rufino", "Giulia Maria", "Emily Alves", "Bárbara Vitória", "Endriu", "Felipe Almeida", "Mariana Lima", "Bruno Ferreira", "Isabela Rocha", "Matheus Gomes", "Sofia Nunes", "André Barbosa", "Valentina Ribeiro", "Gustavo Carvalho", "Helena Dias", "Leonardo Melo", "Laura Freitas", "Thiago Cardoso", "Manuela Moreira", "Daniel Correia", "Alice Monteiro", "Vinícius Mendes", "Cecília Araújo", "Samuel Fernandes", "Heloísa Teixeira", "Eduardo Batista", "Lívia Campos", "Henrique Vieira", "Antonella Reis", "Rodrigo Lopes", "Elisa Moraes", "Caio Pires", "Clara Cunha", "Murilo Fonseca", "Lorena Castro", "Otávio Azevedo", "Marina Tavares", "Enzo Dantas", "Yasmin Peixoto", "Breno Macedo", "Luiza Siqueira", "Davi Rezende", "Esther Farias"];
const cities = ["São Paulo", "Goiânia", "Belém"];
const groups = ["Comunicação", "Eventos", "Lanchonete", "Música", "Acolhida"];
const positions = ["Consagrado", "Aspirante", "Vocacionado", "Voluntário"] as const;
const avatar = (seed: string) => `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f3e8d5,e8e9f5,d6ede8`;
export const members: Member[] = names.map((name, i) => ({ id: i + 1, name, phone: `(11) 9${String(81342000 + i * 317).padStart(8, "0").slice(0, 4)}-${String(1000 + i * 43).slice(0, 4)}`, city: cities[i % cities.length], group: groups[i % groups.length], position: positions[i % positions.length], status: i === 12 || i === 31 ? "Inativo" : "Ativo", since: `${String((i % 27) + 1).padStart(2, "0")}/${String((i % 10) + 1).padStart(2, "0")}/${2021 + (i % 5)}`, email: `${name.toLowerCase().replaceAll(" ", ".").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@email.com`, avatar: avatar(name), attendance: 58 + ((i * 13) % 42) }));
export const events: EventItem[] = [
  { id: 1, name: "Anjos", type: "Encontro", date: "2026-11-12", time: "19:30", location: "Tenda das Padroeiras", owner: "Mariana Costa", status: "Confirmado", attendees: 42 },
  { id: 2, name: "Missa em Comunidade", type: "Celebração", date: "2026-11-14", time: "18:00", location: "Paróquia Nsa. Aparecida e Santa Edwiges", owner: "Pe. Rubens", status: "Confirmado", attendees: 86 },
  { id: 3, name: "Formação Consagrados", type: "Formação", date: "2026-11-17", time: "20:00", location: "Sala de encontros", owner: "João Pedro", status: "Em breve", attendees: 28 },
  { id: 4, name: "Ação Solidária", type: "Ação social", date: "2026-11-20", time: "09:00", location: "Centro comunitário", owner: "Ana Paula", status: "Confirmado", attendees: 31 },
  { id: 5, name: "Formação Aspirantes", type: "Formação", date: "2026-11-22", time: "15:00", location: "Casa Sede", owner: "Jaine Negreiros", status: "Em breve", attendees: 19 },
  { id: 6, name: "Confraternização", type: "Confraternização", date: "2026-11-25", time: "19:00", location: "Chácara Raio de Sol", owner: "Maria Clara", status: "Em breve", attendees: 54 },
  { id: 7, name: "Formação Vocacionados", type: "Formação", date: "2026-11-27", time: "19:30", location: "Casa Sede", owner: "Lucas Henrique", status: "Em breve", attendees: 36 },
  { id: 8, name: "Reunião de Alinhamento", type: "Celebração", date: "2026-12-05", time: "21:00", location: "Paróquia", owner: "Mariana Costa", status: "Em breve", attendees: 72 },
  { id: 9, name: "Retiro da comunidade", type: "Retiro", date: "2026-12-12", time: "08:00", location: "Chácara Raio de Sol", owner: "Ana Paula", status: "Em breve", attendees: 48 },
  { id: 10, name: "Natal solidário", type: "Ação social", date: "2026-12-19", time: "10:00", location: "Centro comunitário", owner: "João Pedro", status: "Em breve", attendees: 63 },
];
export const eventDetails: Record<number, { description: string; capacity: number; observations: string }> = {
  1: { description: "Um encontro para fortalecer a fé, criar novas amizades e compartilhar momentos de oração e alegria.", capacity: 60, observations: "Trazer Bíblia e garrafa de água. Acolhida a partir das 19h." },
  2: { description: "Celebração eucarística aberta a toda a comunidade, com momento de convivência ao final.", capacity: 120, observations: "A equipe de acolhida chega 30 minutos antes." },
  3: { description: "Uma noite de formação e oração para aprofundar a caminhada dos consagrados.", capacity: 40, observations: "Encontro na sala principal da Casa Sede." },
  4: { description: "Ação de serviço e partilha organizada pelos voluntários da comunidade.", capacity: 45, observations: "Usar camiseta da comunidade. Lanche será oferecido no local." },
  5: { description: "Encontro de formação e acompanhamento para os aspirantes da comunidade.", capacity: 30, observations: "Levar caderno e material de formação." },
  6: { description: "Um momento descontraído de convivência para celebrar a vida e a caminhada da comunidade.", capacity: 70, observations: "Cada família pode trazer um prato para compartilhar." },
  7: { description: "Momento de formação e discernimento para os vocacionados da comunidade.", capacity: 45, observations: "Confirmar presença com a equipe de organização." },
  8: { description: "Reunião de planejamento para alinhar as próximas atividades e iniciativas pastorais.", capacity: 35, observations: "Levar pautas dos respectivos ministérios." },
  9: { description: "Dias de oração, reflexão e convivência em comunidade em um espaço de acolhida e silêncio.", capacity: 60, observations: "Inscrição inclui transporte e alimentação." },
  10: { description: "Celebração do Natal com partilha, atividades para as famílias e entrega de doações.", capacity: 90, observations: "Aberto a toda a comunidade. Traga um alimento não perecível." },
};
export const organizers: Organizer[] = [
  { id: 1, name: "Igor Felipe", permission: "Administradora", email: "mariana@cristoalegria.org", phone: "(11) 98123-4567", status: "Ativo" },
  { id: 2, name: "Andrezza Palmeira", permission: "Organizador", email: "joao@cristoalegria.org", phone: "(11) 98456-7890", status: "Ativo" },
  { id: 3, name: "João Gonzaga", permission: "Organizadora", email: "ana@cristoalegria.org", phone: "(11) 98765-4321", status: "Ativo" },
  { id: 4, name: "Jaine Negreiros", permission: "Organizadora", email: "carlos@cristoalegria.org", phone: "(11) 98901-2345", status: "Ativo" },
  { id: 5, name: "Milena Apolinário", permission: "Visualização", email: "maria@cristoalegria.org", phone: "(11) 98234-5678", status: "Pendente" },
];
export const attendance = Array.from({ length: 200 }, (_, i) => ({ id: i + 1, member: members[i % members.length], event: events[i % 10], status: i % 7 === 0 ? "Ausente" : i % 13 === 0 ? "Justificado" : "Presente" }));
export const monthly = [{ name: "Jun", presenças: 148 }, { name: "Jul", presenças: 176 }, { name: "Ago", presenças: 162 }, { name: "Set", presenças: 213 }, { name: "Out", presenças: 198 }, { name: "Nov", presenças: 246 }];
export const eventAttendance = events.slice(0, 5).map((event) => ({ name: event.name.split(" ").slice(0, 2).join(" "), presentes: event.attendees - 7, ausentes: 7 }));
