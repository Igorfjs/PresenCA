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

export function OrganizersPage({ onNew, onNotice }: { onNew: () => void; onNotice: (message: string) => void }) { return <><SectionTitle eyebrow="EQUIPE" title="Organizadores" subtitle="Gerencie os acessos e as permissões da equipe." action={<button className="button button-primary" onClick={onNew}><Plus size={16} />Adicionar organizador</button>} /><section className="card data-card"><div className="table-toolbar"><div className="table-toolbar-heading"><h3>Equipe de organizadores</h3><span>{organizers.length} pessoas</span></div></div><div className="table-wrap"><table><thead><tr><th>ORGANIZADOR</th><th>PERMISSÃO</th><th>EMAIL</th><th>TELEFONE</th><th>STATUS</th><th /></tr></thead><tbody>{organizers.map((item) => <tr key={item.id}><td><div className="person-cell"><Avatar name={item.name} /><strong>{item.name}</strong></div></td><td><Badge tone={item.permission === "Administradora" ? "purple" : "neutral"}>{item.permission}</Badge></td><td>{item.email}</td><td>{item.phone}</td><td><Badge dot tone={item.status === "Ativo" ? "green" : "orange"}>{item.status}</Badge></td><td><button className="table-menu" onClick={() => onNotice(`Gerenciar ${item.name}`)}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div></section></>; }
