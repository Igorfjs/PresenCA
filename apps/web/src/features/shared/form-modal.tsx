'use client';


import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Bell, CalendarDays, ChartNoAxesCombined, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, CircleHelp, Clock3, Command, Download, Ellipsis, Heart, LayoutDashboard, ListFilter, LockKeyhole, LogOut, Mail, MapPin, Menu, MessageSquare, MoreHorizontal, Plus, QrCode, Search, Settings, Shield, SlidersHorizontal, Sparkles, Sun, Moon, Upload, UserRound, Users, UserPlus, X, Church, type LucideIcon } from "lucide-react";
import { attendance, eventAttendance, eventDetails, events, members, monthly, organizers, recurringEventTemplates } from "@/mocks/data";
import { BrandLogo } from "@/components/brand-logo";
import { formatDate } from "@/lib/utils";
import { NEWS_GROUP_INVITE_URL } from "@/lib/constants";
import type { EventItem, Member, Organizer, RecurringEventTemplate } from "@/types";

import { Page, navigation, avatar, weekdayNames, localDateValue, nextDateForWeekday, IconButton, Badge, Avatar, SectionTitle, CardHead, Workspace, workspaces, registeredParticipants, WorkspaceSelector } from '@/features/shared';

export function FormModal({ type, recurringTemplates, members: memberOptions, organizerList, onClose, onSubmit }: { type: "event" | "member" | "participant" | "organizer"; recurringTemplates: RecurringEventTemplate[]; members: Member[]; organizerList: Organizer[]; onClose: () => void; onSubmit: (e: React.FormEvent<HTMLFormElement>, label: string) => void }) {
  const [seriesId, setSeriesId] = useState("");
  const [creatingSeries, setCreatingSeries] = useState(false);
  const [scheduleException, setScheduleException] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [seriesValues, setSeriesValues] = useState({ name: "", type: "Encontro", weekday: "4", time: "19:30", location: "", owner: organizerList[0]?.name || "", capacity: "", description: "", observations: "" });
  const [eventValues, setEventValues] = useState({ name: "", description: "", date: localDateValue(), time: "19:30", location: "", category: "Encontro", owner: organizerList[0]?.name || "", capacity: "", observations: "" });
  const availableMembers = memberOptions.filter((member) => !organizerList.some((organizer) => organizer.memberId === member.id));
  const selectedMember = availableMembers.find((member) => member.id === Number(selectedMemberId));
  const selectedSeries = recurringTemplates.find((item) => item.id === seriesId);
  const updateEventValue = (field: keyof typeof eventValues, value: string) => setEventValues((values) => ({ ...values, [field]: value }));
  const updateSeriesValue = (field: keyof typeof seriesValues, value: string) => setSeriesValues((values) => ({ ...values, [field]: value }));
  const selectSeries = (id: string) => {
    setSeriesId(id);
    setScheduleException(false);
    const template = recurringTemplates.find((item) => item.id === id);
    if (!template) {
      setEventValues((values) => ({ ...values, name: "", description: "", date: localDateValue(), category: "Encontro", time: "19:30", location: "", owner: organizerList[0]?.name || "", capacity: "", observations: "" }));
      return;
    }
    setEventValues((values) => ({ ...values, name: template.name, description: template.description, date: nextDateForWeekday(template.weekday), time: template.time, location: template.location, category: template.type, owner: template.owner, capacity: String(template.capacity), observations: template.observations }));
  };
  const config = { event: ["Novo evento", "Agende um encontro avulso ou escolha uma série recorrente."], member: ["Novo membro", "Adicione uma pessoa à comunidade."], participant: ["Cadastro de participante", "Conte um pouco sobre você para participar."], organizer: ["Adicionar organizador", "Selecione um membro existente e defina o acesso ao sistema."] } as const;
  const [title, subtitle] = config[type];
  const label = type === "event" ? "Evento" : type === "member" ? "Membro" : type === "participant" ? "Cadastro" : "Organizador";
  return <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <motion.section className="form-modal" initial={{ opacity: 0, y: 15, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}>
      <div className="form-modal-head"><span className="form-modal-icon">{type === "event" ? <CalendarDays size={18} /> : type === "organizer" ? <Shield size={18} /> : <UserPlus size={18} />}</span><div><h2>{type === "event" && creatingSeries ? "Novo evento recorrente" : title}</h2><p>{type === "event" && creatingSeries ? "Defina os dados fixos da nova série recorrente." : subtitle}</p></div><IconButton label="Fechar" onClick={onClose}><X size={17} /></IconButton></div>
      <form onSubmit={(e) => onSubmit(e, creatingSeries ? "Série" : label)}>
        <div className="modal-form-grid">
          {type === "event" ? (creatingSeries ? <>
            <div className="series-create-banner field-full"><span>O primeiro encontro será agendado no próximo dia escolhido.</span><button type="button" className="text-link" onClick={() => setCreatingSeries(false)}><ChevronLeft size={13} />Voltar ao evento</button></div>
            <label className="settings-label field-full">NOME DA SÉRIE<input required name="seriesName" value={seriesValues.name} placeholder="Ex.: Grupo de Oração" onChange={(e) => updateSeriesValue("name", e.target.value)} /></label>
            <label className="settings-label">CATEGORIA<select name="seriesType" value={seriesValues.type} onChange={(e) => updateSeriesValue("type", e.target.value)}><option>Encontro</option><option>Celebração</option><option>Formação</option><option>Ação social</option><option>Confraternização</option><option>Retiro</option></select></label>
            <label className="settings-label">DIA DA SEMANA<select name="weekday" value={seriesValues.weekday} onChange={(e) => updateSeriesValue("weekday", e.target.value)}>{weekdayNames.map((day, index) => <option key={day} value={index}>{day}</option>)}</select></label>
            <label className="settings-label">HORÁRIO<input required name="time" type="time" value={seriesValues.time} onChange={(e) => updateSeriesValue("time", e.target.value)} /></label>
            <label className="settings-label field-full">LOCAL<input required name="location" value={seriesValues.location} placeholder="Endereço ou local do encontro" onChange={(e) => updateSeriesValue("location", e.target.value)} /></label>
            <label className="settings-label">RESPONSÁVEL<select name="owner" value={seriesValues.owner} onChange={(e) => updateSeriesValue("owner", e.target.value)}>{organizerList.map((organizer) => <option key={organizer.id}>{organizer.name}</option>)}</select></label>
            <label className="settings-label">CAPACIDADE<input name="capacity" type="number" min="1" value={seriesValues.capacity} placeholder="Sem limite" onChange={(e) => updateSeriesValue("capacity", e.target.value)} /></label>
            <label className="settings-label field-full">DESCRIÇÃO<textarea name="seriesDescription" rows={2} value={seriesValues.description} placeholder="Descrição padrão da série" onChange={(e) => updateSeriesValue("description", e.target.value)} /></label>
            <label className="settings-label field-full">OBSERVAÇÕES<input name="seriesObservations" value={seriesValues.observations} placeholder="Opcional" onChange={(e) => updateSeriesValue("observations", e.target.value)} /></label>
          </> : <>
            <div className="series-select-row field-full"><label className="settings-label">SÉRIE RECORRENTE<select value={seriesId} onChange={(e) => selectSeries(e.target.value)}><option value="">Evento avulso</option>{recurringTemplates.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><button type="button" className="button button-secondary" onClick={() => setCreatingSeries(true)}><Plus size={14} />Novo evento recorrente</button></div>
            <input type="hidden" name="seriesId" value={seriesId} />
            {selectedSeries && <div className="recurring-series-info field-full"><span className="series-info-icon"><CalendarDays size={16} /></span><div><strong>{selectedSeries.name} · toda {weekdayNames[selectedSeries.weekday]}</strong><small>Os dados padrão foram preenchidos. Para mudar o dia apenas nesta ocorrência, marque a opção de exceção.</small></div></div>}
            {selectedSeries && <label className="schedule-exception-toggle field-full"><input type="checkbox" name="scheduleException" checked={scheduleException} onChange={(e) => setScheduleException(e.target.checked)} /><span><strong>Alterar data apenas desta ocorrência</strong><small>A série continuará no dia habitual. Esta ocorrência permanecerá vinculada aos relatórios da série.</small></span></label>}
            <label className="settings-label field-full">NOME DO EVENTO<input required name="name" value={eventValues.name} placeholder="Ex.: Encontro de jovens" onChange={(e) => updateEventValue("name", e.target.value)} /></label>
            <label className="settings-label field-full">DESCRIÇÃO<textarea name="description" value={eventValues.description} placeholder="Conte um pouco sobre este evento..." rows={3} onChange={(e) => updateEventValue("description", e.target.value)} /></label>
            <label className="settings-label">DATA<input required name="date" type="date" value={eventValues.date} onChange={(e) => updateEventValue("date", e.target.value)} /></label>
            <label className="settings-label">HORÁRIO<input required name="time" type="time" value={eventValues.time} onChange={(e) => updateEventValue("time", e.target.value)} /></label>
            <label className="settings-label field-full">LOCAL<input required name="location" value={eventValues.location} placeholder="Endereço ou local do encontro" onChange={(e) => updateEventValue("location", e.target.value)} /></label>
            <label className="settings-label">CATEGORIA<select name="type" value={eventValues.category} onChange={(e) => updateEventValue("category", e.target.value)}><option>Encontro</option><option>Celebração</option><option>Formação</option><option>Ação social</option><option>Confraternização</option><option>Retiro</option></select></label>
            <label className="settings-label">RESPONSÁVEL<select name="owner" value={eventValues.owner} onChange={(e) => updateEventValue("owner", e.target.value)}>{selectedSeries && !organizerList.some((organizer) => organizer.name === selectedSeries.owner) && <option>{selectedSeries.owner}</option>}{organizerList.map((organizer) => <option key={organizer.id}>{organizer.name}</option>)}</select></label>
            <label className="settings-label">CAPACIDADE<input name="capacity" type="number" min="1" value={eventValues.capacity} placeholder="Sem limite" onChange={(e) => updateEventValue("capacity", e.target.value)} /></label>
            <label className="settings-label">OBSERVAÇÕES<input name="observations" value={eventValues.observations} placeholder="Opcional" onChange={(e) => updateEventValue("observations", e.target.value)} /></label>
          </>) : type === "organizer" ? <>
            <label className="settings-label field-full">MEMBRO DA COMUNIDADE
              <select required name="memberId" value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)}>
                <option value="">Selecione um membro</option>
                {availableMembers.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.position}</option>)}
              </select>
            </label>
            {selectedMember && <div className="recurring-series-info field-full"><Avatar name={selectedMember.name} src={selectedMember.avatar} /><div><strong>{selectedMember.name}</strong><small>{selectedMember.email} · {selectedMember.phone}</small></div></div>}
            {!availableMembers.length && <p className="field-full">Todos os membros já possuem acesso ao sistema.</p>}
            <label className="settings-label field-full">PERMISSÃO
              <select name="permission" defaultValue="Organizador">
                <option value="Organizador">Organizador</option>
                <option value="Administrador">Administrador</option>
              </select>
            </label>
          </> : <>
            <label className="settings-label field-full">NOME COMPLETO<input required name="name" placeholder="Como podemos te chamar?" /></label>
            {type !== "participant" && <label className="settings-label">EMAIL<input name="email" type="email" required placeholder="email@exemplo.com" /></label>}
            <label className="settings-label">TELEFONE<input required name="phone" type="tel" placeholder="(11) 99999-9999" /></label>
            {type === "participant" && <><label className="settings-label">EMAIL<input name="email" type="email" placeholder="voce@email.com" /></label><label className="settings-label field-full">CIDADE<input name="city" placeholder="Sua cidade" /></label></>}
            {type === "member" && <><label className="settings-label">CIDADE<input name="city" placeholder="Sua cidade" /></label><label className="settings-label">POSIÇÃO<select name="position" defaultValue="Consagrado"><option>Consagrado</option><option>Aspirante</option><option>Vocacionado</option><option>Voluntário</option></select></label></>}
          </>}
        </div>
        <div className="form-modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button><button type="submit" className="button button-primary" disabled={type === "organizer" && !availableMembers.length}><Check size={15} />{creatingSeries ? "Criar série e primeiro evento" : type === "organizer" ? "Conceder acesso" : type === "participant" ? "Salvar cadastro" : `Salvar ${label.toLowerCase()}`}</button></div>
      </form>
    </motion.section>
  </motion.div>;
}
