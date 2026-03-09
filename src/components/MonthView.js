import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useMemo, useState } from "react";
import moment from "moment-timezone";
import { normalizeDate, getDayEvents } from "./utils";
import { PREDEFINED_CALENDAR_THEMES } from "./calendarThemes";
import { EventFormModal } from "./EventFormModal";
import { PluginManager } from "./pluginSystem";
import { PREDEFINED_CONFLICT_TEMPLATES } from "./conflictTemplates";
export const MonthView = ({ timezone, timezoneLabelInclude = false, selectedDate, onDateChange, events, onEventChange, navigationPosition = "center", renderNavigation, onAddEvent, onEditEvent, onDeleteEvent, formFields, onlyCreateEditRequired, plugins, conflictTemplate, conflictThemeVariant, calendarTheme, calendarThemeVariant, }) => {
    const zonedDate = useMemo(() => normalizeDate(selectedDate, timezone), [selectedDate, timezone]);
    const activeTheme = useMemo(() => {
        if (calendarTheme)
            return calendarTheme;
        if (calendarThemeVariant && PREDEFINED_CALENDAR_THEMES[calendarThemeVariant]) {
            return PREDEFINED_CALENDAR_THEMES[calendarThemeVariant];
        }
        return PREDEFINED_CALENDAR_THEMES.classic_light;
    }, [calendarTheme, calendarThemeVariant]);
    const themeStyles = useMemo(() => ({
        "--calendar-primary": activeTheme.primaryColor,
        "--calendar-bg": activeTheme.backgroundColor,
        "--calendar-secondary-bg": activeTheme.secondaryBackgroundColor,
        "--calendar-grid": activeTheme.gridColor,
        "--calendar-text": activeTheme.textColor,
        "--calendar-secondary-text": activeTheme.secondaryTextColor,
        "--calendar-accent": activeTheme.accentColor,
        "--calendar-event-bg": activeTheme.eventDefaultColor,
        "--calendar-event-text": activeTheme.eventDefaultTextColor,
    }), [activeTheme]);
    const safeEvents = useMemo(() => events ?? [], [events]);
    const pluginManager = useMemo(() => {
        return new PluginManager(plugins, {
            timezone,
            slotInterval: 30, // Placeholder for MonthView
            events: safeEvents,
            onEventChange,
            onAddEvent,
            onEditEvent,
            onDeleteEvent,
        });
    }, [plugins, timezone, safeEvents, onEventChange, onAddEvent, onEditEvent, onDeleteEvent]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({});
    const startOfMonth = useMemo(() => zonedDate.clone().startOf("month"), [zonedDate]);
    const endOfMonth = useMemo(() => zonedDate.clone().endOf("month"), [zonedDate]);
    const startOfGrid = useMemo(() => startOfMonth.clone().startOf("week"), [startOfMonth]);
    const endOfGrid = useMemo(() => endOfMonth.clone().endOf("week"), [endOfMonth]);
    const calendarGrid = useMemo(() => {
        const grid = [];
        let current = startOfGrid.clone();
        while (current.isBefore(endOfGrid) || current.isSame(endOfGrid, "day")) {
            grid.push(current.clone());
            current.add(1, "day");
        }
        return grid;
    }, [startOfGrid, endOfGrid]);
    const goToPreviousMonth = () => onDateChange(zonedDate.clone().subtract(1, "month"));
    const goToNextMonth = () => onDateChange(zonedDate.clone().add(1, "month"));
    const goToToday = () => onDateChange(moment.utc().tz(timezone));
    const resetForm = () => {
        setIsFormOpen(false);
        setEditingEvent(null);
        setFormData({});
    };
    const dateNode = (_jsxs("div", { className: "text-center flex flex-col items-center", children: [_jsx("h2", { className: "text-xl font-semibold", children: zonedDate.format("MMMM YYYY") }), timezoneLabelInclude && (_jsxs("p", { className: "text-xs mt-1", style: { color: "var(--calendar-secondary-text)" }, children: ["GMT", zonedDate.format("Z"), " \u2022 ", timezone] })), _jsx("button", { onClick: goToToday, className: "mt-1 text-sm font-medium", style: { color: "var(--calendar-primary)" }, children: "Today" })] }));
    const prevNode = (_jsx("button", { onClick: goToPreviousMonth, className: "px-3 py-1 rounded hover:opacity-70 transition-opacity", style: { color: "var(--calendar-text)" }, children: "\u25C0" }));
    const nextNode = (_jsx("button", { onClick: goToNextMonth, className: "px-3 py-1 rounded hover:opacity-70 transition-opacity", style: { color: "var(--calendar-text)" }, children: "\u25B6" }));
    const defaultNav = (_jsxs("div", { className: "flex items-center gap-2", children: [prevNode, nextNode] }));
    const navNode = renderNavigation ? renderNavigation({ goToPreviousDay: goToPreviousMonth, goToNextDay: goToNextMonth, goToToday }) : null;
    return (_jsxs("div", { className: "flex flex-col flex-1 min-h-0", style: { ...themeStyles, backgroundColor: "var(--calendar-bg)", color: "var(--calendar-text)" }, children: [_jsxs("div", { className: "sticky top-0 z-20 border-b px-6 py-4 flex items-center min-h-[80px]", style: { backgroundColor: "var(--calendar-bg)", borderColor: "var(--calendar-grid)" }, children: [navigationPosition === "left" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex-1 flex justify-start items-center", children: navNode || defaultNav }), _jsx("div", { className: "flex-1 flex justify-center items-center", children: dateNode }), _jsx("div", { className: "flex-1 flex justify-end items-center" })] })), navigationPosition === "center" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex-1 flex justify-start items-center" }), _jsxs("div", { className: "flex-1 flex justify-center items-center gap-4", children: [navNode ? navNode : prevNode, dateNode, !navNode && nextNode] }), _jsx("div", { className: "flex-1 flex justify-end items-center" })] })), navigationPosition === "right" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex-1 flex justify-start items-center" }), _jsx("div", { className: "flex-1 flex justify-center items-center", children: dateNode }), _jsx("div", { className: "flex-1 flex justify-end items-center gap-4", children: navNode || defaultNav })] }))] }), _jsx("div", { className: "grid grid-cols-7 border-b", style: { borderColor: "var(--calendar-grid)" }, children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (_jsx("div", { className: "py-2 text-center text-xs font-semibold uppercase tracking-wider", style: { color: "var(--calendar-secondary-text)" }, children: day }, day))) }), _jsx("div", { className: "flex-1 overflow-y-auto no-scrollbar", children: _jsx("div", { className: "grid grid-cols-7 min-h-full", children: calendarGrid.map((day, idx) => {
                        const isCurrentMonth = day.isSame(zonedDate, "month");
                        const isToday = day.isSame(moment().tz(timezone), "day");
                        const dayEvents = getDayEvents(safeEvents, day, timezone);
                        return (_jsxs("div", { className: "min-h-[120px] border-b border-r p-1 flex flex-col gap-1 transition-colors hover:bg-opacity-10", style: {
                                borderColor: "var(--calendar-grid)",
                                backgroundColor: isCurrentMonth ? "transparent" : "var(--calendar-secondary-bg)",
                                opacity: isCurrentMonth ? 1 : 0.5
                            }, onDoubleClick: () => {
                                if (onAddEvent && onlyCreateEditRequired) {
                                    const start = day.clone().hour(9).minute(0);
                                    const end = start.clone().add(1, "hour");
                                    setFormData({
                                        start: start.format("YYYY-MM-DDTHH:mm"),
                                        end: end.format("YYYY-MM-DDTHH:mm")
                                    });
                                    setIsFormOpen(true);
                                }
                            }, children: [_jsx("div", { className: "flex justify-end pr-1", children: _jsx("span", { className: `text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? "text-white" : ""}`, style: isToday ? { backgroundColor: "var(--calendar-primary)" } : { color: isCurrentMonth ? "var(--calendar-text)" : "var(--calendar-secondary-text)" }, children: day.date() }) }), _jsxs("div", { className: "flex flex-col gap-1 flex-1 overflow-hidden", children: [dayEvents.slice(0, 4).map(event => (_jsx("div", { onClick: () => {
                                                pluginManager.triggerOnEventClick(event);
                                                if (onEditEvent && onlyCreateEditRequired) {
                                                    setEditingEvent(event);
                                                    setFormData({
                                                        ...event,
                                                        start: moment(event.start).tz(timezone).format("YYYY-MM-DDTHH:mm"),
                                                        end: moment(event.end).tz(timezone).format("YYYY-MM-DDTHH:mm"),
                                                    });
                                                    setIsFormOpen(true);
                                                }
                                            }, className: "px-1.5 py-0.5 rounded text-[10px] truncate cursor-pointer transition-transform hover:scale-[1.02]", style: {
                                                backgroundColor: "var(--calendar-event-bg)",
                                                color: "var(--calendar-event-text)",
                                                border: event.hasConflict ? "1px solid red" : "none"
                                            }, title: event.title, children: event.title }, event.id))), dayEvents.length > 4 && (_jsxs("div", { className: "text-[9px] px-1 font-bold", style: { color: "var(--calendar-secondary-text)" }, children: ["+", dayEvents.length - 4, " more"] }))] })] }, idx));
                    }) }) }), onlyCreateEditRequired && (_jsx(EventFormModal, { isOpen: isFormOpen, onClose: resetForm, editingEvent: editingEvent, formData: formData, setFormData: setFormData, formFields: formFields, timezone: timezone, onAddEvent: onAddEvent, onEditEvent: onEditEvent, onDeleteEvent: onDeleteEvent, pluginManager: pluginManager, conflictTemplate: conflictTemplate || (conflictThemeVariant ? PREDEFINED_CONFLICT_TEMPLATES[conflictThemeVariant] : undefined) }))] }));
};
