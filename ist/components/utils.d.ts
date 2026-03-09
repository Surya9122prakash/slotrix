import moment from "moment-timezone";
import type { CalendarEvent } from "./types";
export declare const SLOT_HEIGHT = 64;
export declare const normalizeDate: (d: any, timezone: string) => moment.Moment;
export declare const getWorkingHoursRange: (enabledTimeInterval?: {
    start: string;
    end: string;
}[]) => {
    startMinutes: number;
    endMinutes: number;
};
export declare const generateTimeSlots: (startOfDay: moment.Moment, slotInterval: number) => moment.Moment[];
export declare const checkIsSlotEnabled: (slot: moment.Moment, enabledTimeSlots?: string[], disabledTimeSlots?: string[], enabledTimeInterval?: {
    start: string;
    end: string;
}[], disableTimeInterval?: {
    start: string;
    end: string;
}[]) => boolean;
export declare const getDayEvents: (safeEvents: CalendarEvent[], targetDate: moment.Moment, timezone: string) => CalendarEvent[];
export declare const calculateLayoutEvents: (dayEvents: CalendarEvent[], targetDate: moment.Moment, slotInterval: number) => {
    columnIndex: number;
    columnCount: number;
    top: number;
    height: number;
    id: string;
    title: string;
    start: string | Date | moment.Moment;
    end: string | Date | moment.Moment;
    allDay?: boolean;
}[];
export declare const detectConflicts: (events: CalendarEvent[], timezone: string) => {
    eventId: string;
    withId: string;
    eventTitle: string;
    withTitle: string;
    overlapStart: string;
    overlapEnd: string;
}[];
