import React from "react";
import type { CalendarEvent, CalendarFormField, ConflictTemplate } from "./types";
import { PluginManager } from "./pluginSystem";
interface EventFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingEvent: CalendarEvent | null;
    formData: any;
    setFormData: (data: any) => void;
    formFields?: CalendarFormField[];
    timezone: string;
    onAddEvent?: (event: CalendarEvent) => void;
    onEditEvent?: (event: CalendarEvent) => void;
    onDeleteEvent?: (eventId: string) => void;
    pluginManager: PluginManager;
    conflictTemplate?: ConflictTemplate;
}
export declare const EventFormModal: React.FC<EventFormModalProps>;
export {};
