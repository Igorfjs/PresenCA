import { attendance, events, members, organizers } from "@/mocks/data";

/** Mock service boundary: swap these methods for fetch calls when a backend is available. */
const wait = <T,>(value: T): Promise<T> => new Promise((resolve) => window.setTimeout(() => resolve(value), 250));

export const mockApi = {
  listMembers: (search = "") => wait(members.filter((member) => `${member.name} ${member.group} ${member.city}`.toLowerCase().includes(search.toLowerCase()))),
  listEvents: () => wait(events),
  listOrganizers: () => wait(organizers),
  listAttendance: () => wait(attendance),
};
