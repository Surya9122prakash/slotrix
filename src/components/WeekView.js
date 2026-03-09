import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useMemo, useEffect, useRef, useState, useLayoutEffect } from "react";
import moment from "moment-timezone";
import { SLOT_HEIGHT, normalizeDate, getWorkingHoursRange, generateTimeSlots, checkIsSlotEnabled, getDayEvents, calculateLayoutEvents, } from "./utils";
import { EventFormModal } from "./EventFormModal";
import { PluginManager } from "./pluginSystem";
import { PREDEFINED_CONFLICT_TEMPLATES } from "./conflictTemplates";
import { PREDEFINED_CALENDAR_THEMES } from "./calendarThemes";
export const WeekView = ({ timezone, timezoneLabelInclude = false, slotInterval, timeFormat, selectedDate, onDateChange, events, onEventChange, navigationPosition = "center", renderNavigation, showEmptyState = true, enabledTimeSlots, disabledTimeSlots, enabledTimeInterval, disableTimeInterval, onAddEvent, onEditEvent, onDeleteEvent, formFields, onlyCreateEditRequired, navigateToFirstEvent, plugins, conflictTemplate, conflictThemeVariant, calendarTheme, calendarThemeVariant, }) => {
    const scrollRef = useRef(null);
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
            slotInterval,
            events: safeEvents,
            onEventChange,
            onAddEvent,
            onEditEvent,
            onDeleteEvent,
        });
    }, [plugins, timezone, slotInterval, safeEvents, onEventChange, onAddEvent, onEditEvent, onDeleteEvent]);
    useEffect(() => {
        pluginManager.init();
    }, [pluginManager]);
    const zonedDate = useMemo(() => normalizeDate(selectedDate, timezone), [selectedDate, timezone]);
    const startOfWeek = useMemo(() => zonedDate.clone().startOf("week"), [zonedDate]);
    const weekDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(startOfWeek.clone().add(i, "days"));
        }
        return days;
    }, [startOfWeek]);
    const now = useMemo(() => moment.utc().tz(timezone), [timezone]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({});
    const workingHoursRange = useMemo(() => getWorkingHoursRange(enabledTimeInterval), [enabledTimeInterval]);
    const resetForm = () => {
        setIsFormOpen(false);
        setEditingEvent(null);
        setFormData({});
    };
    /* -------------------------
       NAVIGATION
    --------------------------*/
    const goToPreviousWeek = () => onDateChange(zonedDate.clone().subtract(1, "week"));
    const goToNextWeek = () => onDateChange(zonedDate.clone().add(1, "week"));
    const goToToday = () => onDateChange(moment.utc().tz(timezone));
    /* -------------------------
       TIME SLOTS
    --------------------------*/
    const timeSlots = useMemo(() => generateTimeSlots(startOfWeek, slotInterval), [startOfWeek, slotInterval]);
    const isSlotEnabled = (slot) => checkIsSlotEnabled(slot, enabledTimeSlots, disabledTimeSlots, enabledTimeInterval, disableTimeInterval);
    /* -------------------------
       PER-DAY LAYOUTS
    --------------------------*/
    // We calculate the layout mapping per-day.
    const layoutEventsPerDay = useMemo(() => {
        pluginManager.triggerBeforeRender();
        const layouts = weekDays.map((day) => {
            const dayEventsList = getDayEvents(safeEvents, day, timezone).filter(e => !e.allDay);
            return calculateLayoutEvents(dayEventsList, day, slotInterval);
        });
        pluginManager.triggerAfterRender();
        return layouts;
    }, [weekDays, safeEvents, timezone, slotInterval, pluginManager]);
    /* -------------------------
       AUTO SCROLL TO FIRST EVENT
    --------------------------*/
    useLayoutEffect(() => {
        if (!scrollRef.current)
            return;
        scrollRef.current.scrollTop = 0;
    }, [startOfWeek, navigateToFirstEvent]);
    useEffect(() => {
        if (!scrollRef.current || !navigateToFirstEvent)
            return;
        const scrollTimer = setTimeout(() => {
            if (!scrollRef.current)
                return;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (!scrollRef.current)
                        return;
                    let minTop = Infinity;
                    layoutEventsPerDay.forEach(dayEvents => {
                        if (dayEvents.length > 0) {
                            minTop = Math.min(minTop, dayEvents[0].top);
                        }
                    });
                    let targetTop = 0;
                    if (minTop !== Infinity) {
                        targetTop = minTop;
                    }
                    else {
                        const firstEnabledSlotIndex = timeSlots.findIndex(slot => isSlotEnabled(slot));
                        if (firstEnabledSlotIndex !== -1) {
                            targetTop = firstEnabledSlotIndex * SLOT_HEIGHT;
                        }
                    }
                    if (targetTop > 0) {
                        const finalOffset = Math.max(0, targetTop - SLOT_HEIGHT);
                        const start = scrollRef.current.scrollTop;
                        const change = finalOffset - start;
                        const duration = 2000;
                        let startTime = null;
                        const animateScroll = (currentTime) => {
                            if (startTime === null)
                                startTime = currentTime;
                            const elapsed = currentTime - startTime;
                            const progress = elapsed / duration;
                            const ease = progress < 0.5
                                ? 4 * progress * progress * progress
                                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                            if (!scrollRef.current)
                                return;
                            scrollRef.current.scrollTop = start + (change * ease);
                            if (elapsed < duration) {
                                requestAnimationFrame(animateScroll);
                            }
                            else {
                                scrollRef.current.scrollTop = finalOffset;
                            }
                        };
                        requestAnimationFrame(animateScroll);
                    }
                });
            });
        }, 100);
        return () => clearTimeout(scrollTimer);
    }, [startOfWeek, layoutEventsPerDay, navigateToFirstEvent]);
    const dateNode = (_jsxs("div", { className: "text-center flex flex-col items-center", children: [_jsx("h2", { className: "text-xl font-semibold", children: startOfWeek.format("MMMM YYYY") }), timezoneLabelInclude && (_jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["GMT", zonedDate.format("Z"), " \u2022 ", timezone] })), _jsx("button", { onClick: goToToday, className: "mt-1 text-sm font-medium", style: { color: "var(--calendar-primary)" }, children: "Today" })] }));
    const prevNode = (_jsx("button", { onClick: goToPreviousWeek, className: "px-3 py-1 rounded hover:bg-gray-200", children: "\u25C0" }));
    const nextNode = (_jsx("button", { onClick: goToNextWeek, className: "px-3 py-1 rounded hover:bg-gray-200", children: "\u25B6" }));
    const defaultNav = (_jsxs("div", { className: "flex items-center gap-2", children: [prevNode, nextNode] }));
    const navNode = renderNavigation ? renderNavigation({ goToPreviousDay: goToPreviousWeek, goToNextDay: goToNextWeek, goToToday }) : null;
    return (_jsxs("div", { className: "flex flex-col flex-1 min-h-0", style: { ...themeStyles, backgroundColor: "var(--calendar-bg)", color: "var(--calendar-text)" }, children: [_jsxs("div", { className: "sticky top-0 z-20 border-b px-6 py-4 flex items-center min-h-[80px]", style: { backgroundColor: "var(--calendar-bg)", borderColor: "var(--calendar-grid)" }, children: [navigationPosition === "left" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex-1 flex justify-start items-center", children: navNode || defaultNav }), _jsx("div", { className: "flex-1 flex justify-center items-center", children: dateNode }), _jsx("div", { className: "flex-1 flex justify-end items-center" })] })), navigationPosition === "center" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex-1 flex justify-start items-center" }), _jsxs("div", { className: "flex-1 flex justify-center items-center gap-4", children: [navNode ? navNode : prevNode, dateNode, !navNode && nextNode] }), _jsx("div", { className: "flex-1 flex justify-end items-center" })] })), navigationPosition === "right" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex-1 flex justify-start items-center" }), _jsx("div", { className: "flex-1 flex justify-center items-center", children: dateNode }), _jsx("div", { className: "flex-1 flex justify-end items-center gap-4", children: navNode || defaultNav })] }))] }), _jsxs("div", { className: "flex flex-1 flex-col min-h-0 m-5 mt-2 overflow-hidden", style: { backgroundColor: "var(--calendar-bg)" }, children: [_jsxs("div", { className: "flex border-b", style: { borderColor: "var(--calendar-grid)" }, children: [_jsx("div", { className: "w-24 flex-shrink-0" }), _jsx("div", { className: "flex flex-1 min-w-[700px]", children: weekDays.map((day, i) => {
                                    return (_jsxs("div", { className: "flex-1 text-center font-medium py-3", style: { color: "var(--calendar-text)" }, children: [_jsx("div", { className: "text-xs uppercase tracking-wider", style: { color: "var(--calendar-secondary-text)" }, children: day.format("ddd") }), _jsx("div", { className: "text-2xl mt-1", children: day.format("D") })] }, i));
                                }) })] }), _jsxs("div", { ref: scrollRef, className: "flex flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative", children: [_jsx("div", { className: "w-24 flex-shrink-0 z-10 sticky left-0 shadow-[1px_0_5px_rgba(0,0,0,0.02)]", style: { backgroundColor: "var(--calendar-bg)" }, children: timeSlots.map((slot, i) => {
                                    const enabled = isSlotEnabled(slot);
                                    return (_jsx("div", { className: `relative text-xs text-right pr-3 border-b border-dotted`, style: {
                                            height: SLOT_HEIGHT,
                                            borderColor: "var(--calendar-grid)",
                                            color: enabled ? "var(--calendar-secondary-text)" : "var(--calendar-grid)",
                                            backgroundColor: enabled ? "transparent" : "var(--calendar-secondary-bg)"
                                        }, children: _jsx("span", { className: "absolute top-1/2 -translate-y-1/2 right-2 px-1", style: { backgroundColor: "var(--calendar-bg)" }, children: slot.format(timeFormat) }) }, i));
                                }) }), _jsxs("div", { className: "flex flex-1 relative bg-white min-w-[700px]", children: [_jsx("div", { className: "absolute inset-0 pointer-events-none", children: timeSlots.map((_, i) => (_jsx("div", { style: { height: SLOT_HEIGHT, borderColor: "var(--calendar-grid)" }, className: "border-b border-dotted w-full" }, `row-${i}`))) }), weekDays.map((day, dayIndex) => {
                                        const dayLayoutEvents = layoutEventsPerDay[dayIndex];
                                        const isToday = day.isSame(now, "day");
                                        return (_jsxs("div", { className: "flex-1 relative", children: [_jsx("div", { className: "absolute inset-0 z-0 bg-transparent cursor-pointer", onDoubleClick: () => {
                                                        if (onAddEvent && onlyCreateEditRequired) {
                                                            setFormData({ start: day.clone().hour(9).format("YYYY-MM-DDTHH:mm") });
                                                            setIsFormOpen(true);
                                                        }
                                                    } }), isToday && (_jsx("div", { className: "absolute left-0 right-0 border-t-2 z-10", style: {
                                                        borderColor: "var(--calendar-primary)",
                                                        top: ((now.hours() * 60 + now.minutes()) / slotInterval) * SLOT_HEIGHT,
                                                        boxShadow: "0 0 8px var(--calendar-primary-alpha40)"
                                                    }, children: _jsx("div", { className: "absolute -left-1 -top-[5px] w-2 h-2 rounded-full", style: { backgroundColor: "var(--calendar-primary)" } }) })), showEmptyState && dayLayoutEvents.length === 0 && (_jsx("div", { className: "absolute left-1 right-1 flex items-center justify-center animate-fadeIn opacity-50", style: {
                                                        top: (workingHoursRange.startMinutes / slotInterval) * SLOT_HEIGHT,
                                                        height: ((workingHoursRange.endMinutes - workingHoursRange.startMinutes) / slotInterval) * SLOT_HEIGHT,
                                                    }, children: _jsx("div", { className: "text-xs font-medium", style: { color: "var(--calendar-secondary-text)" }, children: "Clear" }) })), _jsx("div", { className: "absolute inset-0 z-10 pointer-events-none", children: dayLayoutEvents.map((event) => (_jsxs("div", { onDoubleClick: (e) => {
                                                            e.stopPropagation();
                                                            pluginManager.triggerOnEventClick(event);
                                                            if (!onEditEvent || !onlyCreateEditRequired)
                                                                return;
                                                            setEditingEvent(event);
                                                            setFormData({
                                                                ...event,
                                                                start: moment(event.start).tz(timezone).format("YYYY-MM-DDTHH:mm"),
                                                                end: moment(event.end).tz(timezone).format("YYYY-MM-DDTHH:mm"),
                                                            });
                                                            setIsFormOpen(true);
                                                        }, ref: (el) => {
                                                            if (el)
                                                                pluginManager.triggerOnEventRender(event, el);
                                                        }, className: "absolute rounded-[4px] px-2 text-xs font-medium cursor-pointer shadow-sm hover:z-20 border pointer-events-auto transition-all overflow-hidden", style: {
                                                            top: event.top,
                                                            height: Math.max(event.height, 20),
                                                            left: `${(event.columnIndex / event.columnCount) * 100}%`,
                                                            width: `calc(${100 / event.columnCount}% - 2px)`, // Small margin
                                                            backgroundColor: "var(--calendar-event-bg)",
                                                            color: "var(--calendar-event-text)",
                                                            borderColor: "var(--calendar-grid)"
                                                        }, children: [_jsx("div", { className: "truncate", children: event.title }), onDeleteEvent && onlyCreateEditRequired && (_jsx("button", { onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    onDeleteEvent(event.id);
                                                                }, className: "absolute top-[2px] right-[2px] w-4 h-4 text-[10px] leading-none bg-red-500 hover:bg-red-600 rounded flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity flex-shrink-0", children: "\u2715" }))] }, event.id))) })] }, day.format("YYYY-MM-DD")));
                                    })] })] })] }), onlyCreateEditRequired && (_jsx(EventFormModal, { isOpen: isFormOpen, onClose: resetForm, editingEvent: editingEvent, formData: formData, setFormData: setFormData, formFields: formFields, timezone: timezone, onAddEvent: onAddEvent, onEditEvent: onEditEvent, onDeleteEvent: onDeleteEvent, pluginManager: pluginManager, conflictTemplate: conflictTemplate || (conflictThemeVariant ? PREDEFINED_CONFLICT_TEMPLATES[conflictThemeVariant] : undefined) }))] }));
};
