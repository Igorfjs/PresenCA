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

export function EmptyState({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) { return <div className="empty-state"><span><Icon size={21} /></span><strong>{title}</strong><p>{description}</p></div>; }
