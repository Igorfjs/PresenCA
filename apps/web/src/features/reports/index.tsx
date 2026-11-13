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
import { StatCard } from '@/features/dashboard';

export function ReportsPage({ eventList, recurringTemplates, onNotice }: { eventList: EventItem[]; recurringTemplates: RecurringEventTemplate[]; onNotice: (message: string) => void }) {
  const [eventSelection, setEventSelection] = useState("all");
  const [period, setPeriod] = useState("all");
  const [referenceDate, setReferenceDate] = useState(() => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; });
  const periodEvents = eventList.filter((event) => {
    if (event.status === "Cancelado") return false;
    if (period === "all") return true;
    const [year, month, day] = event.date.split("-").map(Number);
    const [referenceYear, referenceMonth, referenceDay] = referenceDate.split("-").map(Number);
    if (period === "day") return year === referenceYear && month === referenceMonth && day === referenceDay;
    if (period === "month") return year === referenceYear && month === referenceMonth;
    if (period === "semester") return year === referenceYear && Math.floor((month - 1) / 6) === Math.floor((referenceMonth - 1) / 6);
    return year === referenceYear;
  });
  const reportEvents = periodEvents.filter((event) => {
    if (eventSelection === "all") return true;
    if (eventSelection.startsWith("series:")) return event.seriesId === eventSelection.slice(7);
    return event.id === Number(eventSelection.slice(6));
  }).sort((a, b) => a.date.localeCompare(b.date));
  const totalParticipants = reportEvents.reduce((total, event) => total + event.attendees, 0);
  const averageParticipants = reportEvents.length ? Math.round(totalParticipants / reportEvents.length) : 0;
  const monthlyTotals = reportEvents.reduce<Record<string, { month: string; inscritos: number; eventos: number }>>((totals, event) => {
    const date = new Date(`${event.date}T12:00:00`);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const month = date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }).replace(".", "");
    totals[key] = totals[key] || { month, inscritos: 0, eventos: 0 };
    totals[key].inscritos += event.attendees;
    totals[key].eventos += 1;
    return totals;
  }, {});
  const chartData = Object.entries(monthlyTotals).sort(([a], [b]) => a.localeCompare(b)).map(([, value]) => value);
  const periodLabel = period === "all" ? "Desde o início" : period === "day" ? "Dia" : period === "month" ? "Mês" : period === "semester" ? "Semestre" : "Ano";

  return <>
    <SectionTitle eyebrow="DADOS DA COMUNIDADE" title="Relatórios" subtitle="Acompanhe as ocorrências e os resultados das séries recorrentes." action={<button className="button button-primary" onClick={() => onNotice("Relatório preparado para exportação")}><Download size={15} />Exportar relatório</button>} />
    <section className="card report-filters"><div className="report-filter-head"><div><h3>Filtros do relatório</h3><p>Veja uma série recorrente consolidada ou uma ocorrência específica.</p></div></div><div className="report-filter-grid report-event-filters">
      <label>SÉRIE OU EVENTO<select value={eventSelection} onChange={(e) => setEventSelection(e.target.value)}><option value="all">Todos os eventos</option><optgroup label="Séries recorrentes">{recurringTemplates.map((template) => <option key={template.id} value={`series:${template.id}`}>{template.name} · consolidado</option>)}</optgroup><optgroup label="Ocorrências individuais">{eventList.filter((event) => event.status !== "Cancelado").map((event) => <option key={event.id} value={`event:${event.id}`}>{event.name} · {formatDate(event.date)}</option>)}</optgroup></select></label>
      <label>PERÍODO<select value={period} onChange={(e) => setPeriod(e.target.value)}><option value="day">Dia</option><option value="month">Mês</option><option value="semester">Semestre</option><option value="year">Ano</option><option value="all">Desde o início</option></select></label>
      {period !== "all" && <label>DATA DE REFERÊNCIA<input className="report-date-input" type="date" value={referenceDate} onChange={(e) => setReferenceDate(e.target.value)} /></label>}
    </div></section>
    <div className="report-summary-grid"><StatCard label="Ocorrências no período" value={String(reportEvents.length)} delta={periodLabel} note="eventos incluídos" icon={CalendarDays} color="blue" trend="up" /><StatCard label="Inscritos acumulados" value={totalParticipants.toLocaleString("pt-BR")} delta="total" note="nas ocorrências filtradas" icon={Users} color="purple" trend="up" /><StatCard label="Média de inscritos" value={String(averageParticipants)} delta="por evento" note="nesta seleção" icon={ChartNoAxesCombined} color="green" trend="up" /></div>
    <section className="card report-chart-card"><CardHead title="Inscritos por mês" subtitle="Os valores somam todas as ocorrências da série selecionada." /><div className="report-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}><CartesianGrid strokeDasharray="3 4" vertical={false} stroke="var(--line)" /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 10 }} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 10 }} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--line)", fontSize: 11, background: "var(--surface)" }} /><Bar dataKey="inscritos" name="Inscritos" fill="#49856f" radius={[5, 5, 0, 0]} maxBarSize={36} /></BarChart></ResponsiveContainer>{chartData.length === 0 && <div className="report-chart-empty">Nenhum evento encontrado para esses filtros.</div>}</div></section>
    <section className="card report-detail-card"><CardHead title={eventSelection.startsWith("series:") ? `Ocorrências de ${recurringTemplates.find((item) => item.id === eventSelection.slice(7))?.name || "evento"}` : "Eventos no período"} subtitle="Cada linha representa uma ocorrência; a seleção de série soma seus resultados." /><div className="report-table"><div className="report-table-row report-table-head"><span>EVENTO</span><span>DATA</span><span>SÉRIE</span><span>INSCRITOS</span><span>STATUS</span></div>{reportEvents.map((event) => <div className="report-table-row" key={event.id}><strong>{event.name}</strong><span>{formatDate(event.date)}</span><span>{event.seriesId ? recurringTemplates.find((item) => item.id === event.seriesId)?.name : "Avulso"}{event.scheduleException ? " · exceção de data" : ""}</span><span>{event.attendees}</span><span><Badge dot tone={event.status === "Confirmado" ? "green" : event.status === "Concluído" ? "blue" : "neutral"}>{event.status}</Badge></span></div>)}{reportEvents.length === 0 && <div className="report-empty-state">Nenhum evento neste período. Escolha outra data ou série.</div>}</div></section>
  </>;
}
