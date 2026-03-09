import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useMemo, useEffect, useRef, useState, useLayoutEffect } from "react";
import moment from "moment-timezone";
import { SLOT_HEIGHT, normalizeDate, getWorkingHoursRange, generateTimeSlots, checkIsSlotEnabled, getDayEvents, calculateLayoutEvents, } from "./utils";
import { EventFormModal } from "./EventFormModal";
import { PluginManager } from "./pluginSystem";
import { PREDEFINED_CONFLICT_TEMPLATES } from "./conflictTemplates";
import { PREDEFINED_CALENDAR_THEMES } from "./calendarThemes";
export const DayView = ({ timezone, timezoneLabelInclude = false, slotInterval, dateFormat, timeFormat, selectedDate, onDateChange, events, onEventChange, navigationPosition = "center", showTodayBelow = true, renderNavigation, showEmptyState = true, enabledTimeSlots, disabledTimeSlots, enabledTimeInterval, disableTimeInterval, emptyStateContent, emptyStateContentPopup, futureDaysOnly, pastDaysOnly, currentDayOnly, navigateToFirstEvent, onAddEvent, onEditEvent, onDeleteEvent, formFields, onlyCreateEditRequired, plugins, conflictTemplate, conflictThemeVariant, calendarTheme, calendarThemeVariant, }) => {
    const scrollRef = useRef(null);
    const gridRef = useRef(null);
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
    const now = useMemo(() => moment.utc().tz(timezone), [timezone]);
    const isToday = zonedDate.isSame(now, "day");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({});
    const bothEnabled = futureDaysOnly && pastDaysOnly;
    const isFutureRestricted = (!bothEnabled && futureDaysOnly && zonedDate.isBefore(moment().tz(timezone), "day")) ||
        (currentDayOnly && zonedDate.isBefore(moment().tz(timezone), "day"));
    const isPastRestricted = (!bothEnabled && pastDaysOnly && zonedDate.isAfter(moment().tz(timezone), "day")) ||
        (currentDayOnly && zonedDate.isAfter(moment().tz(timezone), "day"));
    const isDateRestricted = isFutureRestricted || isPastRestricted || (currentDayOnly && !isToday);
    const workingHoursRange = useMemo(() => getWorkingHoursRange(enabledTimeInterval), [enabledTimeInterval]);
    const resetForm = () => {
        setIsFormOpen(false);
        setEditingEvent(null);
        setFormData({});
    };
    /* -------------------------
       MULTI DAY SPLIT
    --------------------------*/
    /* -------------------------
       MULTI DAY SPLIT & OVERLAP LAYOUT
    --------------------------*/
    const expandedEvents = useMemo(() => getDayEvents(safeEvents, zonedDate, timezone), [safeEvents, zonedDate, timezone]);
    const dayEvents = expandedEvents.filter((e) => !e.allDay);
    const layoutEvents = useMemo(() => {
        pluginManager.triggerBeforeRender();
        const layout = calculateLayoutEvents(dayEvents, zonedDate, slotInterval);
        pluginManager.triggerAfterRender();
        return layout;
    }, [dayEvents, zonedDate, slotInterval, pluginManager]);
    /* -------------------------
       NAVIGATION
    --------------------------*/
    const canGoToPreviousDay = !currentDayOnly && (bothEnabled || !(futureDaysOnly && zonedDate.isSameOrBefore(now, "day")));
    const canGoToNextDay = !currentDayOnly && (bothEnabled || !(pastDaysOnly && zonedDate.isSameOrAfter(now, "day")));
    const goToPreviousDay = () => {
        if (canGoToPreviousDay) {
            onDateChange(zonedDate.clone().subtract(1, "day"));
        }
    };
    const goToNextDay = () => {
        if (canGoToNextDay) {
            onDateChange(zonedDate.clone().add(1, "day"));
        }
    };
    const goToToday = () => onDateChange(moment.utc().tz(timezone));
    /* -------------------------
       DRAG + RESIZE
    --------------------------*/
    const [dragging, setDragging] = useState(null);
    const [resizing, setResizing] = useState(null);
    const snapMinutes = (minutes) => Math.round(minutes / slotInterval) * slotInterval;
    useEffect(() => {
        const handleMove = (e) => {
            if (!gridRef.current)
                return;
            const rect = gridRef.current.getBoundingClientRect();
            const offsetY = e.clientY - rect.top;
            const minutes = (offsetY / SLOT_HEIGHT) * slotInterval;
            if (dragging) {
                const snapped = snapMinutes(minutes);
                const newStart = zonedDate
                    .clone()
                    .startOf("day")
                    .add(snapped, "minutes");
                const duration = dragging.end.diff(dragging.start, "minutes");
                onEventChange?.({
                    ...dragging,
                    start: newStart,
                    end: newStart.clone().add(duration, "minutes"),
                });
            }
            if (resizing) {
                const snapped = snapMinutes(minutes);
                const newEnd = zonedDate
                    .clone()
                    .startOf("day")
                    .add(snapped, "minutes");
                if (newEnd.isAfter(resizing.start)) {
                    onEventChange?.({
                        ...resizing,
                        end: newEnd,
                    });
                }
            }
        };
        const stop = () => {
            setDragging(null);
            setResizing(null);
        };
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", stop);
        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", stop);
        };
    }, [dragging, resizing, zonedDate, slotInterval, onEventChange]);
    /* -------------------------
       TIME SLOTS
    --------------------------*/
    /* -------------------------
       TIME SLOTS
    --------------------------*/
    const timeSlots = useMemo(() => generateTimeSlots(zonedDate, slotInterval), [zonedDate, slotInterval]);
    const isSlotEnabled = (slot) => checkIsSlotEnabled(slot, enabledTimeSlots, disabledTimeSlots, enabledTimeInterval, disableTimeInterval);
    /* -------------------------
       AUTO SCROLL TO FIRST EVENT
    --------------------------*/
    useLayoutEffect(() => {
        if (!scrollRef.current)
            return;
        // Always reset to top (12:00 AM) instantaneously when date changes BEFORE paint
        scrollRef.current.scrollTop = 0;
    }, [zonedDate, navigateToFirstEvent]);
    useEffect(() => {
        if (!scrollRef.current)
            return;
        if (!navigateToFirstEvent)
            return;
        // Use a timeout to ensure everything is rendered
        const scrollTimer = setTimeout(() => {
            if (!scrollRef.current)
                return;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (!scrollRef.current)
                        return;
                    let targetTop = 0;
                    if (layoutEvents.length > 0) {
                        targetTop = layoutEvents[0].top;
                    }
                    else {
                        // Find first enabled slot offset
                        const firstEnabledSlotIndex = timeSlots.findIndex(slot => isSlotEnabled(slot));
                        if (firstEnabledSlotIndex !== -1) {
                            targetTop = firstEnabledSlotIndex * SLOT_HEIGHT;
                        }
                    }
                    // Scroll somewhat above it so it's not glued to the top edge, unless targetTop is 0
                    if (targetTop > 0) {
                        const finalOffset = Math.max(0, targetTop - SLOT_HEIGHT);
                        const start = scrollRef.current.scrollTop;
                        const change = finalOffset - start;
                        const duration = 2000; // 2 seconds
                        let startTime = null;
                        const animateScroll = (currentTime) => {
                            if (startTime === null)
                                startTime = currentTime;
                            const elapsed = currentTime - startTime;
                            // Ease in-out cubic
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
    }, [zonedDate, layoutEvents.length, navigateToFirstEvent]);
    const dateNode = (_jsxs("div", { className: "text-center flex flex-col items-center", children: [_jsx("h2", { className: "text-xl font-semibold", children: zonedDate.format(dateFormat) }), timezoneLabelInclude && (_jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["GMT", zonedDate.format("Z"), " \u2022 ", timezone] })), showTodayBelow && (_jsx("button", { onClick: goToToday, className: "mt-1 text-sm font-medium", style: { color: "var(--calendar-primary)" }, children: "Today" }))] }));
    const prevNode = (_jsx("button", { onClick: goToPreviousDay, disabled: !canGoToPreviousDay, className: `px-3 py-1 rounded ${!canGoToPreviousDay ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`, children: "\u25C0" }));
    const nextNode = (_jsx("button", { onClick: goToNextDay, disabled: !canGoToNextDay, className: `px-3 py-1 rounded ${!canGoToNextDay ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`, children: "\u25B6" }));
    const defaultNav = (_jsxs("div", { className: "flex items-center gap-2", children: [prevNode, nextNode] }));
    const navNode = renderNavigation ? renderNavigation({ goToPreviousDay, goToNextDay, goToToday }) : null;
    return (_jsxs("div", { className: "flex flex-col flex-1 min-h-0", style: { ...themeStyles, backgroundColor: "var(--calendar-bg)", color: "var(--calendar-text)" }, children: [_jsxs("div", { className: "sticky top-0 z-20 border-b px-6 py-4 flex items-center min-h-[80px]", style: { backgroundColor: "var(--calendar-bg)", borderColor: "var(--calendar-grid)" }, children: [navigationPosition === "left" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex-1 flex justify-start items-center", children: navNode || defaultNav }), _jsx("div", { className: "flex-1 flex justify-center items-center", children: dateNode }), _jsx("div", { className: "flex-1 flex justify-end items-center" })] })), navigationPosition === "center" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex-1 flex justify-start items-center" }), _jsxs("div", { className: "flex-1 flex justify-center items-center gap-4", children: [navNode ? navNode : prevNode, dateNode, !navNode && nextNode] }), _jsx("div", { className: "flex-1 flex justify-end items-center" })] })), navigationPosition === "right" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex-1 flex justify-start items-center" }), _jsx("div", { className: "flex-1 flex justify-center items-center", children: dateNode }), _jsx("div", { className: "flex-1 flex justify-end items-center gap-4", children: navNode || defaultNav })] }))] }), _jsx("div", { className: "flex flex-1 min-h-0 m-5", children: _jsxs("div", { ref: scrollRef, className: "flex flex-1 overflow-y-auto no-scrollbar", children: [_jsx("div", { className: "w-24 flex-shrink-0", style: { backgroundColor: "var(--calendar-secondary-bg)" }, children: timeSlots.map((slot, i) => {
                                const enabled = isSlotEnabled(slot);
                                return (_jsx("div", { className: `relative text-xs text-right pr-3 border-b border-dotted border-r`, style: {
                                        height: SLOT_HEIGHT,
                                        borderColor: "var(--calendar-grid)",
                                        color: enabled ? "var(--calendar-secondary-text)" : "var(--calendar-grid)",
                                        backgroundColor: enabled ? "transparent" : "var(--calendar-secondary-bg)"
                                    }, children: _jsx("span", { className: "absolute top-1/2 -translate-y-1/2 right-2", children: slot.format(timeFormat) }) }, i));
                            }) }), _jsxs("div", { ref: gridRef, className: "flex-1 relative", children: [timeSlots.map((_, i) => (_jsx("div", { style: { height: SLOT_HEIGHT, borderColor: "var(--calendar-grid)" }, className: "border-b border-dotted" }, i))), layoutEvents.map((event) => (_jsxs("div", { ref: (el) => {
                                        if (el)
                                            pluginManager.triggerOnEventRender(event, el);
                                    }, onMouseDown: () => setDragging(event), onDoubleClick: () => {
                                        pluginManager.triggerOnEventClick(event);
                                        if (!onEditEvent)
                                            return;
                                        setEditingEvent(event);
                                        setFormData({
                                            ...event,
                                            start: moment(event.start).tz(timezone).format("YYYY-MM-DDTHH:mm"),
                                            end: moment(event.end).tz(timezone).format("YYYY-MM-DDTHH:mm"),
                                        });
                                        setIsFormOpen(true);
                                    }, className: "absolute rounded px-2 text-sm cursor-move", style: {
                                        top: event.top,
                                        height: event.height,
                                        left: `${(event.columnIndex /
                                            event.columnCount) *
                                            100}%`,
                                        width: `${100 / event.columnCount}%`,
                                        backgroundColor: "var(--calendar-event-bg)",
                                        color: "var(--calendar-event-text)"
                                    }, children: [event.title, onDeleteEvent && (_jsx("button", { onClick: (e) => {
                                                e.stopPropagation();
                                                onDeleteEvent(event.id);
                                            }, className: "absolute top-1 right-1 text-xs bg-red-500 rounded px-1", children: "\u2715" })), _jsx("div", { onMouseDown: (e) => {
                                                e.stopPropagation();
                                                setResizing(event);
                                            }, className: "absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize", style: { backgroundColor: "var(--calendar-primary)", opacity: 0.5 } })] }, event.id))), showEmptyState &&
                                    layoutEvents.length === 0 &&
                                    !isDateRestricted && (_jsx("div", { className: "absolute left-0 right-0 flex items-center justify-center animate-fadeIn", style: {
                                        top: (workingHoursRange.startMinutes /
                                            slotInterval) *
                                            SLOT_HEIGHT,
                                        height: ((workingHoursRange.endMinutes -
                                            workingHoursRange.startMinutes) /
                                            slotInterval) *
                                            SLOT_HEIGHT,
                                    }, children: _jsxs("div", { className: "bg-white shadow-xl rounded-2xl px-8 py-6 border text-center animate-scaleIn", children: [_jsx("p", { className: "text-gray-600 font-medium", children: emptyStateContent || "No events scheduled" }), emptyStateContentPopup ? emptyStateContentPopup : (onAddEvent && (_jsx("button", { onClick: () => {
                                                    setEditingEvent(null);
                                                    setFormData({});
                                                    setIsFormOpen(true);
                                                }, className: "mt-4 px-4 py-2 text-white rounded", style: { backgroundColor: "var(--calendar-primary)" }, children: "Add Event" })))] }) })), isToday && (_jsx("div", { className: "absolute left-0 right-0 border-t-2", style: {
                                        borderColor: "var(--calendar-primary)",
                                        top: ((now.hours() * 60 + now.minutes()) / slotInterval) * SLOT_HEIGHT,
                                    } }))] })] }) }), onlyCreateEditRequired && (_jsx(EventFormModal, { isOpen: isFormOpen, onClose: resetForm, editingEvent: editingEvent, formData: formData, setFormData: setFormData, formFields: formFields, timezone: timezone, onAddEvent: onAddEvent, onEditEvent: onEditEvent, onDeleteEvent: onDeleteEvent, pluginManager: pluginManager, conflictTemplate: conflictTemplate || (conflictThemeVariant ? PREDEFINED_CONFLICT_TEMPLATES[conflictThemeVariant] : undefined) }))] }));
};
export default DayView;
