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

import { Page, navigation, avatar, weekdayNames, localDateValue, nextDateForWeekday, IconButton, Badge, Avatar, SectionTitle, CardHead, Workspace, workspaces, registeredParticipants, WorkspaceSelector, EmptyState } from '@/features/shared';
import { DashboardPage } from '@/features/dashboard';
import { EventsPage } from '@/features/events';
import { MembersPage, MemberDrawer } from '@/features/members';
import { ParticipantsPage } from '@/features/participants';
import { OrganizersPage } from '@/features/organizers';
import { ReportsPage } from '@/features/reports';
import { SettingsPage } from '@/features/settings';
import { ProfilePage } from '@/features/profile';
import { QrPage } from '@/features/qr-code';
import { CommandPalette } from '@/features/shell/command-palette';
import { FormModal } from '@/features/shared/form-modal';

export default function PresencaApp() {
  const [page, setPage] = useState<Page>("Visão geral");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [notice, setNotice] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [modal, setModal] = useState<"event" | "member" | "participant" | "organizer" | null>(null);
  const [eventList, setEventList] = useState(events);
  const [recurringTemplates, setRecurringTemplates] = useState(recurringEventTemplates);
  const [memberList] = useState(members);
  const [participantList, setParticipantList] = useState(registeredParticipants);
  const [eventSearch, setEventSearch] = useState("");

  useEffect(() => { const onKeys = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen((v) => !v); } if (e.key === "Escape") { setSearchOpen(false); setModal(null); setMember(null); } }; window.addEventListener("keydown", onKeys); return () => window.removeEventListener("keydown", onKeys); }, []);
  useEffect(() => { if (notice) { const t = window.setTimeout(() => setNotice(""), 2800); return () => window.clearTimeout(t); } }, [notice]);

  const go = (next: Page) => { setPage(next); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submit = (e: React.FormEvent<HTMLFormElement>, label: string) => { e.preventDefault(); const form = new FormData(e.currentTarget); if (label === "Série") { const name = String(form.get("seriesName") || "Nova série").trim(); const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "serie"; const templateId = `${slug}-${Date.now().toString(36)}`; const weekday = Number(form.get("weekday")); const template = { id: templateId, name, type: String(form.get("seriesType") || "Encontro"), weekday, time: String(form.get("time") || "19:30"), location: String(form.get("location") || ""), owner: String(form.get("owner") || organizers[0].name), capacity: Number(form.get("capacity")) || 0, description: String(form.get("seriesDescription") || ""), observations: String(form.get("seriesObservations") || "") }; setRecurringTemplates((items) => [...items, template]); const firstEvent: EventItem = { id: Math.max(...eventList.map((item) => item.id), 0) + 1, name: template.name, type: template.type, date: nextDateForWeekday(template.weekday), time: template.time, location: template.location, owner: template.owner, capacity: template.capacity, description: template.description, observations: template.observations, status: "Confirmado", attendees: 0, seriesId: template.id }; setEventList((items) => [...items, firstEvent]); setModal(null); setNotice(`Série ${name} criada e adicionada à lista de eventos`); return; } if (label === "Cadastro") { const name = String(form.get("name") || "").trim(); const participant: Member = { id: Math.max(1000, ...participantList.map((item) => item.id)) + 1, name, phone: String(form.get("phone") || ""), email: String(form.get("email") || ""), city: String(form.get("city") || ""), group: "Participante", position: "Voluntário", status: "Ativo", since: new Date().toLocaleDateString("pt-BR"), avatar: avatar(name), attendance: 0, lastVisit: null }; setParticipantList((items) => [...items, participant]); } if (label === "Evento") { const seriesId = String(form.get("seriesId") || "") || undefined; const series = recurringTemplates.find((item) => item.id === seriesId); const selectedDate = String(form.get("date") || ""); const scheduleException = form.get("scheduleException") === "on"; if (series && new Date(`${selectedDate}T12:00:00`).getDay() !== series.weekday && !scheduleException) { setNotice(`Este evento acontece toda ${weekdayNames[series.weekday]}. Selecione uma data nesse dia.`); return; } const newEvent: EventItem = { id: Math.max(...eventList.map((item) => item.id), 0) + 1, name: String(form.get("name") || "Novo evento"), description: String(form.get("description") || ""), date: selectedDate, time: String(form.get("time") || ""), location: String(form.get("location") || ""), type: String(form.get("type") || "Encontro"), owner: String(form.get("owner") || organizers[0].name), capacity: Number(form.get("capacity")) || undefined, observations: String(form.get("observations") || ""), status: "Confirmado", attendees: 0, seriesId, scheduleException: scheduleException || undefined }; setEventList((items) => [...items, newEvent]); } setModal(null); setNotice(label === "Evento" ? "Evento criado com sucesso" : `${label} salvo com sucesso`); };
  const filteredMembers = useMemo(() => memberList.filter((m) => `${m.name} ${m.phone} ${m.group} ${m.city}`.toLowerCase().includes(query.toLowerCase())), [memberList, query]);
  const filteredEvents = eventList.filter((ev) => `${ev.name} ${ev.type} ${ev.location}`.toLowerCase().includes(eventSearch.toLowerCase()));

  const renderPage = () => {
    switch (page) {
      case "Eventos": return <EventsPage eventList={filteredEvents} participants={participantList} onParticipantCreated={(person) => setParticipantList((items) => items.some((item) => item.id === person.id || (!!person.email && item.email === person.email)) ? items : [...items, person])} eventSearch={eventSearch} setEventSearch={setEventSearch} onNew={() => setModal("event")} onNotice={setNotice} onEventStatusChange={(id, status) => setEventList((items) => items.map((event) => event.id === id ? { ...event, status } : event))} onAttendeeAdded={(id) => setEventList((items) => items.map((event) => event.id === id ? { ...event, attendees: event.attendees + 1 } : event))} onDelete={(id) => setEventList((items) => items.filter((event) => event.id !== id))} onDuplicate={(event) => { setEventList((items) => [...items, { ...event, id: Math.max(...items.map((item) => item.id), 0) + 1, name: `${event.name} (cópia)`, status: "Em breve" }]); setNotice("Evento duplicado com sucesso"); }} />;
      case "Membros": return <MembersPage rows={filteredMembers} query={query} setQuery={setQuery} onSelect={setMember} onNew={() => setModal("member")} />;
      case "Participantes": return <ParticipantsPage participants={participantList} onNew={() => setModal("participant")} />;
      case "Organizadores": return <OrganizersPage onNew={() => setModal("organizer")} onNotice={setNotice} />;
      case "Relatórios": return <ReportsPage eventList={eventList} recurringTemplates={recurringTemplates} onNotice={setNotice} />;
      case "Configurações": return <SettingsPage onNotice={setNotice} dark={dark} setDark={setDark} />;
      case "Meu perfil": return <ProfilePage onNotice={setNotice} />;
      case "QR Code": return <QrPage onNotice={setNotice} />;
      default: return <DashboardPage onGo={go} onNotice={setNotice} />;
    }
  };

  return <div className={dark ? "app-shell dark" : "app-shell"}>
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" />}
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <button className="brand" onClick={() => go("Visão geral")}><span className="brand-mark"><BrandLogo /></span><span className="brand-text">Presen<span className="brand-highlight">CA</span></span><span className="brand-dot">•</span></button>
      <WorkspaceSelector onNotice={setNotice} />
      <div className="nav-scroll">{["PRINCIPAL", "COMUNIDADE", "GESTÃO"].map((group) => <div className="nav-group" key={group}><div className="nav-label">{group}</div>{navigation.filter((item) => item.group === group).map(({ label, icon: Icon }) => <button key={label} onClick={() => go(label)} className={`nav-link ${page === label ? "nav-active" : ""}`}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === "Eventos" && <span className="nav-count">3</span>}</button>)}</div>)}
        <div className="nav-group nav-bottom-group"><div className="nav-label">PREFERÊNCIAS</div><button onClick={() => go("Configurações")} className={`nav-link ${page === "Configurações" ? "nav-active" : ""}`}><Settings size={17} strokeWidth={1.8} /><span>Configurações</span></button></div>
      </div>
      <div className="sidebar-footer"><div className="sidebar-help"><span className="help-mark"><CircleHelp size={16} /></span><div><strong>Precisa de ajuda?</strong><small>Estamos por aqui.</small></div><ArrowRight size={15} /></div><button className="profile-mini" onClick={() => go("Meu perfil")}><Avatar name="Igor Felipe" /><span className="profile-copy"><strong>Igor Felipe</strong><small>Administrador</small></span><MoreHorizontal size={18} /></button></div>
    </aside>
    <main className="main-area"><header className="topbar"><div className="topbar-left"><IconButton label="Abrir menu" className="mobile-menu-btn" onClick={() => setMobileOpen(true)}><Menu size={19} /></IconButton><div className="breadcrumbs"><span>Cristo Alegria</span><ChevronRight size={14} /><strong>{page === "Visão geral" ? "Visão geral" : page}</strong></div></div><div className="topbar-actions"><button className="search-trigger" onClick={() => setSearchOpen(true)}><Search size={15} /><span>Buscar qualquer coisa...</span><kbd><Command size={11} /> K</kbd></button><span className="topbar-divider" /><IconButton label="Alternar tema" onClick={() => setDark(!dark)}>{dark ? <Sun size={17} /> : <Moon size={17} />}</IconButton><span className="notification-wrap"><IconButton label="Notificações" onClick={() => setNotice("Você está em dia! Nenhuma notificação nova.")}><Bell size={17} /></IconButton><i className="notification-dot" /></span><button className="topbar-avatar" onClick={() => go("Meu perfil")}><Avatar name="Igor Felipe" /></button></div></header>
      <div className="page-content"><AnimatePresence mode="wait"><motion.div key={page} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>{renderPage()}</motion.div></AnimatePresence><footer className="page-footer"><span>Coloca no feedback!! <Heart size={12} fill="currentColor" /> - Comunidade Católica Cristo Alegria. </span><span>PresenCA <b>·</b> v1.0.0</span></footer></div></main>
    <AnimatePresence>{searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} onGo={(p) => { go(p); setSearchOpen(false); }} />}</AnimatePresence>
    <AnimatePresence>{member && <MemberDrawer member={member} onClose={() => setMember(null)} />}</AnimatePresence>
    <AnimatePresence>{modal && <FormModal type={modal} recurringTemplates={recurringTemplates} onClose={() => setModal(null)} onSubmit={submit} />}</AnimatePresence>
    <AnimatePresence>{notice && <motion.div className="toast" initial={{ opacity: 0, y: 15, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}><span className="toast-check"><Check size={15} /></span>{notice}<button onClick={() => setNotice("")} aria-label="Fechar"><X size={15} /></button></motion.div>}</AnimatePresence>
  </div>;
}
