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

export function ParticipantsPage({ participants, onNew }: { participants: Member[]; onNew: () => void }) {
  const [search, setSearch] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const people = participants.filter((person) => `${person.name} ${person.email} ${person.phone} ${person.city} ${person.lastVisit?.event || ""}`.toLowerCase().includes(search.toLowerCase()));

  return <>
    <SectionTitle eyebrow="ACESSO LIVRE" title="Participantes" subtitle="Acompanhe os visitantes cadastrados na comunidade." action={<button className="button button-primary" onClick={onNew}><Plus size={16} />Novo participante</button>} />
    <section className="card participant-hero">
      <div className="participant-hero-copy">
        <span className="eyebrow">GRUPO INFORMATIVO</span>
        <h2>Convide para o News</h2>
        <p>Adicione um participante ao grupo informativo no WhatsApp pelo botão abaixo</p>
        <button className="button button-primary participant-news-qr-button" onClick={() => setQrOpen(true)}><QrCode size={15} />Abrir QR Code</button>
      </div>
      <div className="participant-illustration"><div className="illustration-orbit orbit-one" /><div className="illustration-orbit orbit-two" /><div className="illustration-people"><Users size={55} /></div></div>
    </section>
    <div className="participant-stats"><div className="card"><span className="participant-stat-icon peach"><UserPlus size={16} /></span><strong>{participants.length}</strong><small>visitantes cadastrados</small></div><div className="card"><span className="participant-stat-icon lavender"><Users size={16} /></span><strong>{participants.filter((person) => person.lastVisit).length}</strong><small>com visita registrada</small></div><div className="card"><span className="participant-stat-icon mint"><CalendarDays size={16} /></span><strong>{participants.filter((person) => !person.lastVisit).length}</strong><small>sem visita registrada</small></div></div>
    <section className="card data-card participants-directory"><div className="table-toolbar"><div className="search-field"><Search size={15} /><input placeholder="Buscar por nome, telefone, cidade ou evento..." value={search} onChange={(e) => setSearch(e.target.value)} /></div></div><div className="table-wrap"><table><thead><tr><th>PESSOA</th><th>TELEFONE</th><th>CIDADE</th><th>ÚLTIMA VISITA</th></tr></thead><tbody>{people.map((person) => <tr key={`visitor-${person.id}`}><td><div className="person-cell"><Avatar name={person.name} src={person.avatar} /><div className="person-name"><strong>{person.name}</strong><small>{person.email}</small></div></div></td><td>{person.phone}</td><td>{person.city || "—"}</td><td><div className="last-visit-cell"><strong>{person.lastVisit?.date || "Sem visitas"}</strong><small>{person.lastVisit?.event || "Ainda não participou"}</small></div></td></tr>)}</tbody></table>{people.length === 0 && <EmptyState title="Nenhuma pessoa encontrada" description="Tente ajustar sua busca." icon={Users} />}</div><div className="table-pagination"><span>Mostrando <strong>{people.length}</strong> de <strong>{people.length}</strong> pessoas</span><div><button disabled><ChevronLeft size={15} /></button><button className="page-number active-page">1</button><button disabled><ChevronRight size={15} /></button></div></div></section>
    <AnimatePresence>{qrOpen && <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && setQrOpen(false)}><motion.section className="form-modal news-qr-modal" initial={{ opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}><div className="form-modal-head"><span className="form-modal-icon"><QrCode size={18} /></span><div><h2>QR Code do grupo News</h2><p>Aponte a câmera para entrar no grupo do WhatsApp.</p></div><button className="icon-btn" aria-label="Fechar" onClick={() => setQrOpen(false)}><X size={17} /></button></div><div className="news-qr-frame"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(NEWS_GROUP_INVITE_URL)}`} alt="QR Code de convite do grupo WhatsApp News" /></div><p className="news-qr-caption">Cristo Alegria · Grupo informativo</p><div className="form-modal-actions"><button className="button button-secondary" onClick={() => setQrOpen(false)}>Fechar</button></div></motion.section></motion.div>}</AnimatePresence>
  </>;
}
