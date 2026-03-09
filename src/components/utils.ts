import moment from "moment-timezone";
import type { CalendarEvent } from "./types";

export const SLOT_HEIGHT = 64;

export const normalizeDate = (d: any, timezone: string) => moment.utc(d).tz(timezone);

export const getWorkingHoursRange = (enabledTimeInterval?: { start: string; end: string }[]) => {
    if (enabledTimeInterval?.length) {
        const start = enabledTimeInterval[0].start;
        const end = enabledTimeInterval[enabledTimeInterval.length - 1].end;

        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);

        return {
            startMinutes: sh * 60 + sm,
            endMinutes: eh * 60 + em,
        };
    }

    return {
        startMinutes: 0,
        endMinutes: 24 * 60,
    };
};

export const generateTimeSlots = (startOfDay: moment.Moment, slotInterval: number) => {
    const slots: moment.Moment[] = [];
    const start = startOfDay.clone().startOf("day");

    for (let mins = 0; mins < 24 * 60; mins += slotInterval) {
        slots.push(start.clone().add(mins, "minutes"));
    }

    return slots;
};

export const checkIsSlotEnabled = (
    slot: moment.Moment,
    enabledTimeSlots?: string[],
    disabledTimeSlots?: string[],
    enabledTimeInterval?: { start: string; end: string }[],
    disableTimeInterval?: { start: string; end: string }[]
) => {
    const timeStr = slot.format("HH:mm");

    if (enabledTimeSlots?.length) {
        return enabledTimeSlots.includes(timeStr);
    }

    if (disabledTimeSlots?.includes(timeStr)) {
        return false;
    }

    const isWithinInterval = (
        intervals?: { start: string; end: string }[],
        invert = false
    ) => {
        if (!intervals?.length) return invert ? true : false;
        const minutes = slot.hours() * 60 + slot.minutes();
        const match = intervals.some((int) => {
            const [sh, sm] = int.start.split(":").map(Number);
            const [eh, em] = int.end.split(":").map(Number);
            return minutes >= sh * 60 + sm && minutes < eh * 60 + em;
        });
        return invert ? !match : match;
    };

    if (enabledTimeInterval?.length) {
        return isWithinInterval(enabledTimeInterval);
    }
    if (disableTimeInterval?.length) {
        return isWithinInterval(disableTimeInterval, true);
    }
    return true;
};

// Expanded events filter for a specific day
export const getDayEvents = (
    safeEvents: CalendarEvent[],
    targetDate: moment.Moment,
    timezone: string
) => {
    const result: CalendarEvent[] = [];

    safeEvents.forEach((e) => {
        const start = normalizeDate(e.start, timezone);
        const end = normalizeDate(e.end, timezone);

        if (e.allDay) {
            if (start.isSame(targetDate, "day")) {
                result.push({ ...e, start, end, allDay: true });
            }
            return;
        }

        let current = start.clone().startOf("day");

        while (current.isBefore(end)) {
            const dayStart = current.clone();
            const dayEnd = current.clone().endOf("day");

            const chunkStart = moment.max(start, dayStart);
            const chunkEnd = moment.min(end, dayEnd);

            if (chunkStart.isSame(targetDate, "day")) {
                result.push({
                    ...e,
                    start: chunkStart,
                    end: chunkEnd,
                });
            }

            current.add(1, "day");
        }
    });

    return result;
};

export const calculateLayoutEvents = (
    dayEvents: CalendarEvent[],
    targetDate: moment.Moment,
    slotInterval: number
) => {
    const sorted = [...dayEvents].sort(
        (a, b) => (a.start as moment.Moment).valueOf() - (b.start as moment.Moment).valueOf()
    );

    const columns: any[][] = [];

    sorted.forEach((event) => {
        let placed = false;
        for (const column of columns) {
            const last = column[column.length - 1];
            if ((event.start as moment.Moment).isSameOrAfter(last.end as moment.Moment)) {
                column.push(event);
                placed = true;
                break;
            }
        }
        if (!placed) columns.push([event]);
    });

    const columnCount = columns.length;

    return sorted.map((event) => {
        let columnIndex = 0;
        columns.forEach((col, i) => {
            if (col.includes(event)) columnIndex = i;
        });

        const startMoment = event.start as moment.Moment;
        const endMoment = event.end as moment.Moment;

        const top =
            (startMoment.diff(targetDate.clone().startOf("day"), "minutes") /
                slotInterval) *
            SLOT_HEIGHT;

        const height =
            (endMoment.diff(startMoment, "minutes") / slotInterval) * SLOT_HEIGHT;

        return {
            ...event,
            columnIndex,
            columnCount,
            top,
            height,
        };
    });
};

export const detectConflicts = (events: CalendarEvent[], timezone: string) => {
    const conflicts: {
        eventId: string;
        withId: string;
        eventTitle: string;
        withTitle: string;
        overlapStart: string;
        overlapEnd: string;
    }[] = [];
    const sorted = [...events].sort((a, b) =>
        moment(a.start).tz(timezone).valueOf() - moment(b.start).tz(timezone).valueOf()
    );

    for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
            const aStart = moment(sorted[i].start).tz(timezone);
            const aEnd = moment(sorted[i].end).tz(timezone);
            const bStart = moment(sorted[j].start).tz(timezone);
            const bEnd = moment(sorted[j].end).tz(timezone);

            if (aStart.isBefore(bEnd) && aEnd.isAfter(bStart)) {
                const overlapStart = moment.max(aStart, bStart);
                const overlapEnd = moment.min(aEnd, bEnd);

                conflicts.push({
                    eventId: sorted[i].id,
                    withId: sorted[j].id,
                    eventTitle: sorted[i].title,
                    withTitle: sorted[j].title,
                    overlapStart: overlapStart.toISOString(),
                    overlapEnd: overlapEnd.toISOString()
                });
                conflicts.push({
                    eventId: sorted[j].id,
                    withId: sorted[i].id,
                    eventTitle: sorted[j].title,
                    withTitle: sorted[i].title,
                    overlapStart: overlapStart.toISOString(),
                    overlapEnd: overlapEnd.toISOString()
                });
            }
        }
    }
    return conflicts;
};
