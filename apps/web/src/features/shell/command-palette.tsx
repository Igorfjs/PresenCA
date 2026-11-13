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

import { Page, navigation, avatar, weekdayNames, localDateValue, nextDateForWeekday, IconButton, Badge, Avatar, SectionTitle, CardHead, Workspace, workspaces, registeredParticipants, WorkspaceSelector } from '@/features/shared';

export function CommandPalette({ onClose, onGo }: { onClose: () => void; onGo: (p: Page) => void }) { const [q, setQ] = useState(""); const results = [...navigation.map((n) => ({ label: n.label, icon: n.icon, kind: "Página" })), { label: "QR Code", icon: QrCode, kind: "Ferramenta" }, { label: "Meu perfil", icon: UserRound, kind: "Conta" }].filter((r) => r.label.toLowerCase().includes(q.toLowerCase())); return <motion.div className="modal-overlay palette-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}><motion.div className="command-palette" initial={{ opacity: 0, y: -12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}><div className="palette-search"><Search size={18} /><input autoFocus placeholder="Para onde vamos?" value={q} onChange={(e) => setQ(e.target.value)} /><kbd>ESC</kbd></div><div className="palette-results"><span className="nav-label">NAVEGAÇÃO</span>{results.length ? results.map((r) => { const Icon = r.icon; return <button key={r.label} onClick={() => onGo(r.label as Page)}><Icon size={16} /><span>{r.label}</span><small>{r.kind}</small><ArrowRight size={14} /></button>; }) : <p className="palette-empty">Nenhum resultado encontrado.</p>}</div><div className="palette-footer"><span><kbd>↑</kbd><kbd>↓</kbd> para navegar</span><span><kbd>↵</kbd> para selecionar</span><span><kbd>ESC</kbd> para fechar</span></div></motion.div></motion.div>; }
