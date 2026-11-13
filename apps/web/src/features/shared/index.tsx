'use client';


import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Bell, CalendarDays, ChartNoAxesCombined, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, CircleHelp, Clock3, Command, Download, Ellipsis, Heart, LayoutDashboard, ListFilter, LockKeyhole, LogOut, Mail, MapPin, Menu, MessageSquare, MoreHorizontal, Plus, QrCode, Search, Settings, Shield, SlidersHorizontal, Sparkles, Sun, Moon, Upload, UserRound, Users, UserPlus, X, Church, type LucideIcon } from "lucide-react";
import { attendance, eventAttendance, eventDetails, events, members, monthly, organizers, recurringEventTemplates } from "@/mocks/data";
import { BrandLogo } from "@/components/brand-logo";
import { formatDate } from "@/lib/utils";
import { NEWS_GROUP_INVITE_URL } from "@/lib/constants";
import type { EventItem, Member, RecurringEventTemplate } from "@/types";


export type Page = "Visão geral" | "Eventos" | "Membros" | "Participantes" | "Organizadores" | "Relatórios" | "Configurações" | "Meu perfil" | "QR Code";

export const navigation: { label: Page; icon: LucideIcon; group: string }[] = [
  { label: "Visão geral", icon: LayoutDashboard, group: "PRINCIPAL" },
  { label: "Eventos", icon: CalendarDays, group: "PRINCIPAL" },
  { label: "Membros", icon: Users, group: "COMUNIDADE" },
  { label: "Participantes", icon: UserPlus, group: "COMUNIDADE" },
  { label: "Organizadores", icon: Shield, group: "COMUNIDADE" },
  { label: "Relatórios", icon: ChartNoAxesCombined, group: "GESTÃO" },
];

export const avatar = (seed: string) => `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f3e8d5,e8e9f5,d6ede8`;

export const weekdayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export function localDateValue() { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }

export function nextDateForWeekday(weekday: number) { const date = new Date(); date.setHours(12, 0, 0, 0); let offset = (weekday - date.getDay() + 7) % 7; if (!offset) offset = 7; date.setDate(date.getDate() + offset); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }

export function IconButton({ children, label, onClick, className = "" }: { children: React.ReactNode; label: string; onClick?: () => void; className?: string }) { return <button aria-label={label} title={label} onClick={onClick} className={`icon-btn ${className}`}>{children}</button>; }

export function Badge({ children, tone = "neutral", dot = false }: { children: React.ReactNode; tone?: string; dot?: boolean }) { return <span className={`badge badge-${tone}`}>{dot && <span className="badge-dot" />}{children}</span>; }

export function Avatar({ name, src, size = "normal" }: { name: string; src?: string; size?: "small" | "normal" | "large" }) { return <img className={`avatar avatar-${size}`} src={src || avatar(name)} alt={name} />; }

export function SectionTitle({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode }) { return <div className="section-title"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>; }

export function CardHead({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) { return <div className="card-head"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>{action}</div>; }

export type Workspace = { name: string; description: string };

export const workspaces: Workspace[] = [
  { name: "Cristo Alegria GYN", description: "Missão Goiânia" },
  { name: "Cristo Alegria SP", description: "Missão São Paulo" },
  { name: "Cristo Alegria Belém", description: "Missão Belém" },
  { name: "Cristo Alegria Brasil", description: "Membros externos" },
];

export const registeredParticipants: Member[] = [
  { id: 1001, name: "Pedro Augusto", phone: "(62) 99124-3344", city: "Goiânia", group: "Participante", position: "Voluntário", status: "Ativo", since: "12/04/2025", email: "pedro.augusto@email.com", avatar: avatar("Pedro Augusto"), attendance: 72, lastVisit: { date: "10/11/2026", event: "Encontro de Jovens" } },
  { id: 1002, name: "Beatriz Oliveira", phone: "(62) 99235-4455", city: "Goiânia", group: "Participante", position: "Aspirante", status: "Ativo", since: "03/08/2025", email: "beatriz.oliveira@email.com", avatar: avatar("Beatriz Oliveira"), attendance: 64, lastVisit: { date: "08/11/2026", event: "Missa da Comunidade" } },
  { id: 1003, name: "Rafael Martins", phone: "(62) 99346-5566", city: "Aparecida de Goiânia", group: "Participante", position: "Vocacionado", status: "Ativo", since: "19/01/2026", email: "rafael.martins@email.com", avatar: avatar("Rafael Martins"), attendance: 81, lastVisit: { date: "05/11/2026", event: "Grupo de Oração" } },
  { id: 1004, name: "Camila Rodrigues", phone: "(62) 99457-6677", city: "Goiânia", group: "Participante", position: "Consagrado", status: "Ativo", since: "07/06/2024", email: "camila.rodrigues@email.com", avatar: avatar("Camila Rodrigues"), attendance: 90, lastVisit: null },
];

export function WorkspaceSelector({ onNotice }: { onNotice: (message: string) => void }) {
  const [active, setActive] = useState(workspaces[0]);
  const [open, setOpen] = useState(false);

  return <div className="workspace-picker" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
    <button className="workspace-switch" type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      <span className="workspace-avatar">C</span>
      <span className="workspace-copy"><strong>{active.name}</strong><small>{active.description}</small></span>
      <ChevronDown size={15} />
    </button>
    <AnimatePresence>{open && <motion.div className="workspace-menu" role="listbox" aria-label="Selecionar workspace" initial={{ opacity: 0, y: -5, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .14 }}>
      <div className="workspace-menu-heading">SEUS WORKSPACES</div>
      {workspaces.map((workspace) => <button type="button" role="option" aria-selected={active.name === workspace.name} className={`workspace-option ${active.name === workspace.name ? "workspace-option-active" : ""}`} key={workspace.name} onClick={() => { setActive(workspace); setOpen(false); onNotice(`Workspace ativo: ${workspace.name}`); }}>
        <span className="workspace-option-mark">C</span><span className="workspace-option-copy"><strong>{workspace.name}</strong><small>{workspace.description}</small></span>{active.name === workspace.name && <Check size={15} />}
      </button>)}
    </motion.div>}</AnimatePresence>
  </div>;
}

export { EmptyState } from './empty-state';
