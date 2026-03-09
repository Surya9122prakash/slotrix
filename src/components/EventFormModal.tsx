import React, { useState } from "react";
import moment from "moment-timezone";
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

export const EventFormModal: React.FC<EventFormModalProps> = ({
    isOpen,
    onClose,
    editingEvent,
    formData,
    setFormData,
    formFields,
    timezone,
    onAddEvent,
    onEditEvent,
    onDeleteEvent,
    pluginManager,
    conflictTemplate,
}) => {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">
                    {editingEvent ? "Edit Event" : "Create Event"}
                </h3>

                {formFields?.map((field) => (
                    <div key={field.name} className="mb-4">
                        <label className="block text-sm mb-1">
                            {field.label}
                        </label>

                        {(() => {
                            switch (field.type) {
                                case "textarea":
                                    return <textarea required={field.required} value={formData[field.name] || ""} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} className="w-full border rounded px-3 py-2" rows={3} />;
                                case "dropdown":
                                case "singleSelect":
                                    return (
                                        <select required={field.required} value={formData[field.name] || ""} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} className="w-full border rounded px-3 py-2">
                                            <option value="">Select...</option>
                                            {field.options?.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                    );
                                case "multiselect":
                                    return (
                                        <select multiple required={field.required} value={formData[field.name] || []} onChange={(e) => {
                                            const values = Array.from(e.target.selectedOptions, option => option.value);
                                            setFormData({ ...formData, [field.name]: values });
                                        }} className="w-full border rounded px-3 py-2 h-24">
                                            {field.options?.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                    );
                                case "radio":
                                    return (
                                        <div className="flex gap-4 mt-1">
                                            {field.options?.map((o: any) => (
                                                <label key={o.value} className="flex items-center gap-1 cursor-pointer">
                                                    <input type="radio" name={field.name} value={o.value} checked={formData[field.name] === o.value} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} />
                                                    {o.label}
                                                </label>
                                            ))}
                                        </div>
                                    );
                                case "boolean":
                                    return (
                                        <input type="checkbox" checked={!!formData[field.name]} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })} className="w-5 h-5 mt-1 cursor-pointer" />
                                    );
                                case "attachment":
                                    return (
                                        <input type="file" required={field.required} onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setFormData({ ...formData, [field.name]: e.target.files[0].name });
                                            }
                                        }} className="w-full border rounded px-3 py-2" />
                                    );
                                case "colorPicker":
                                    return <input type="color" required={field.required} value={formData[field.name] || "#000000"} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} className="w-16 h-10 p-1 border rounded cursor-pointer" />;
                                case "year":
                                    return <input type="number" required={field.required} placeholder="YYYY" value={formData[field.name] || ""} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} className="w-full border rounded px-3 py-2" />;
                                case "day":
                                    return <input type="number" required={field.required} min="1" max="31" placeholder="DD" value={formData[field.name] || ""} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} className="w-full border rounded px-3 py-2" />;
                                default:
                                    return <input type={field.type} required={field.required} value={formData[field.name] || ""} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} className="w-full border rounded px-3 py-2" />;
                            }
                        })()}
                    </div>
                ))}

                <div className="flex justify-between mt-4">
                    {editingEvent && onDeleteEvent && (
                        <button
                            onClick={() => {
                                onDeleteEvent(editingEvent.id);
                                onClose();
                            }}
                            className="text-red-600 text-sm"
                        >
                            Delete
                        </button>
                    )}

                    <div className="flex gap-2 ml-auto">
                        <button
                            onClick={onClose}
                            className="px-3 py-1 border rounded"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => {
                                const parseInTimezone = (value: string) => {
                                    if (!value) return moment().utc().toISOString();
                                    // If it's already an ISO string (contains Z or T with full timestamp), don't re-parse with rigid format
                                    if (value.includes("T") && (value.includes("Z") || value.split(":").length > 2)) {
                                        return moment(value).toISOString();
                                    }
                                    return moment.tz(value, "YYYY-MM-DDTHH:mm", timezone).toISOString();
                                };

                                const finalData = {
                                    ...formData,
                                    start: formData.start ? parseInTimezone(formData.start) : formData.start,
                                    end: formData.end ? parseInTimezone(formData.end) : formData.end,
                                };

                                const errors = pluginManager.triggerValidateSave(finalData);
                                if (errors.length > 0) {
                                    setValidationErrors(errors);
                                    return;
                                }

                                if (editingEvent) {
                                    onEditEvent?.({
                                        ...editingEvent,
                                        ...finalData,
                                    });
                                } else {
                                    onAddEvent?.({
                                        id: Date.now().toString(),
                                        ...finalData,
                                    });
                                }

                                onClose();
                            }}
                            className="px-4 py-1 bg-blue-600 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* CUSTOM VALIDATION POPUP */}
            {validationErrors.length > 0 && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] animate-fadeIn">
                    <div
                        className="bg-white rounded-2xl p-8 w-[450px] shadow-2xl border transform animate-scaleIn"
                        style={{
                            borderColor: conflictTemplate?.theme?.borderColor || "#fee2e2",
                            backgroundColor: conflictTemplate?.theme?.backgroundColor || "#fff"
                        }}
                    >
                        {conflictTemplate?.renderHeader ? (
                            conflictTemplate.renderHeader(conflictTemplate.title || "Conflict Detected", conflictTemplate.theme || { primaryColor: "#dc2626", secondaryColor: "#ef4444", backgroundColor: "#fff", textColor: "#1f2937", borderColor: "#fee2e2" })
                        ) : (
                            <div className="flex items-center gap-4 mb-6" style={{ color: conflictTemplate?.theme?.primaryColor || "#dc2626" }}>
                                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: conflictTemplate?.theme?.secondaryColor + "10" || "#fef2f2" }}>
                                    {conflictTemplate?.theme?.icon || <span className="text-2xl">⚠️</span>}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">{conflictTemplate?.title || "Conflict Detected"}</h4>
                                    <p className="text-sm opacity-70">{conflictTemplate?.description || "Overlapping schedule found"}</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto border border-gray-100" style={{ backgroundColor: conflictTemplate?.theme?.backgroundColor === "#fff" ? "#f9fafb" : conflictTemplate?.theme?.backgroundColor }}>
                            {conflictTemplate?.renderDetails ? (
                                conflictTemplate.renderDetails(validationErrors)
                            ) : (
                                validationErrors.map((err: string, i: number) => (
                                    <div key={i} className="mb-3 last:mb-0">
                                        <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed" style={{ color: conflictTemplate?.theme?.textColor || "#1f2937" }}>
                                            {err}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {conflictTemplate?.renderFooter ? (
                            conflictTemplate.renderFooter(() => setValidationErrors([]), conflictTemplate.theme || { primaryColor: "#dc2626", secondaryColor: "#ef4444", backgroundColor: "#fff", textColor: "#1f2937", borderColor: "#fee2e2" })
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setValidationErrors([])}
                                    className="flex-1 px-6 py-3 text-white font-semibold rounded-xl transition-all shadow-lg"
                                    style={{
                                        backgroundColor: conflictTemplate?.theme?.primaryColor || "#dc2626",
                                        boxShadow: `0 10px 15px -3px ${conflictTemplate?.theme?.primaryColor}40` || "0 10px 15px -3px rgba(220, 38, 38, 0.4)"
                                    }}
                                >
                                    {conflictTemplate?.buttonText || "I'll Fix It"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
