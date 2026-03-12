import { jsxs as a, jsx as e, Fragment as le } from "react/jsx-runtime";
import { useState as q, useMemo as y, useRef as et, useEffect as Ge, useLayoutEffect as lt } from "react";
import i from "moment-timezone";
const V = 64, Ae = (t, c) => i.utc(t).tz(c), ut = ["HH:mm", "hh:mm A", "h:mm a", "H:mm", "h:mmA", "h:mma", "hh:mm a", "HH:mm:ss"], at = (t) => i(t, ut, !0), Ue = (t) => {
  const c = at(t);
  return c.isValid() ? c.hours() * 60 + c.minutes() : 0;
}, st = (t) => {
  if (t?.length) {
    const c = t[0].start, n = t[t.length - 1].end;
    return {
      startMinutes: Ue(c),
      endMinutes: Ue(n)
    };
  }
  return {
    startMinutes: 0,
    endMinutes: 1440
  };
}, ct = (t, c) => {
  const n = [], r = t.clone().startOf("day");
  for (let o = 0; o < 1440; o += c)
    n.push(r.clone().add(o, "minutes"));
  return n;
}, tt = (t, c, n, r, o) => {
  const N = t.format("HH:mm"), u = (m) => m.some((h) => {
    const g = at(h);
    return g.isValid() && g.format("HH:mm") === N;
  });
  if (c?.length)
    return u(c);
  if (n?.length && u(n))
    return !1;
  const d = (m, h = !1) => {
    if (!m?.length) return !!h;
    const g = t.hours() * 60 + t.minutes(), j = m.some((T) => {
      const v = Ue(T.start), K = Ue(T.end);
      return g >= v && g < K;
    });
    return h ? !j : j;
  };
  return r?.length ? d(r) : o?.length ? d(o, !0) : !0;
}, rt = (t, c, n) => {
  const r = [];
  return t.forEach((o) => {
    const N = Ae(o.start, n), u = Ae(o.end, n);
    if (o.allDay) {
      N.isSame(c, "day") && r.push({ ...o, start: N, end: u, allDay: !0 });
      return;
    }
    let d = N.clone().startOf("day");
    for (; d.isBefore(u); ) {
      const m = d.clone(), h = d.clone().endOf("day"), g = i.max(N, m), j = i.min(u, h);
      g.isSame(c, "day") && r.push({
        ...o,
        start: g,
        end: j
      }), d.add(1, "day");
    }
  }), r;
}, dt = (t, c, n) => {
  const r = [...t].sort(
    (u, d) => u.start.valueOf() - d.start.valueOf()
  ), o = [];
  r.forEach((u) => {
    let d = !1;
    for (const m of o) {
      const h = m[m.length - 1];
      if (u.start.isSameOrAfter(h.end)) {
        m.push(u), d = !0;
        break;
      }
    }
    d || o.push([u]);
  });
  const N = o.length;
  return r.map((u) => {
    let d = 0;
    o.forEach((T, v) => {
      T.includes(u) && (d = v);
    });
    const m = u.start, h = u.end, g = m.diff(c.clone().startOf("day"), "minutes") / n * V, j = h.diff(m, "minutes") / n * V;
    return {
      ...u,
      columnIndex: d,
      columnCount: N,
      top: g,
      height: j
    };
  });
}, vt = (t, c) => {
  if (console.log("[detectConflicts] Checking events count:", t.length, "Timezone:", c), console.log("[detectConflicts] Events data:", t.map((o) => ({ id: o.id, title: o.title, start: o.start, end: o.end }))), t.length < 2) return [];
  const n = [], r = t.map((o) => ({
    ...o,
    _mStart: i.tz(o.start, c),
    _mEnd: i.tz(o.end, c)
  })).filter((o) => o._mStart.isValid() && o._mEnd.isValid());
  r.sort((o, N) => o._mStart.diff(N._mStart));
  for (let o = 0; o < r.length; o++)
    for (let N = o + 1; N < r.length; N++) {
      const u = r[o], d = r[N];
      if (u._mStart.isBefore(d._mEnd) && u._mEnd.isAfter(d._mStart)) {
        const m = i.max(u._mStart, d._mStart), h = i.min(u._mEnd, d._mEnd);
        n.push({
          eventId: u.id,
          withId: d.id,
          eventTitle: u.title,
          withTitle: d.title,
          overlapStart: m.toISOString(),
          overlapEnd: h.toISOString()
        }), n.push({
          eventId: d.id,
          withId: u.id,
          eventTitle: d.title,
          withTitle: u.title,
          overlapStart: m.toISOString(),
          overlapEnd: h.toISOString()
        });
      }
    }
  return console.log("[detectConflicts] Conflicts found:", n.length), n;
};
class ot {
  plugins = [];
  context;
  constructor(c = [], n) {
    this.plugins = c, this.context = n;
  }
  setContext(c) {
    this.context = c;
  }
  init() {
    this.plugins.forEach((c) => {
      c.init && c.init(this.context);
    });
  }
  triggerBeforeRender() {
    this.plugins.forEach((c) => {
      c.hooks?.beforeRender && c.hooks.beforeRender(this.context);
    });
  }
  triggerOnEventRender(c, n) {
    this.plugins.forEach((r) => {
      r.hooks?.onEventRender && r.hooks.onEventRender(c, n);
    });
  }
  triggerOnEventClick(c) {
    this.plugins.forEach((n) => {
      n.hooks?.onEventClick && n.hooks.onEventClick(c);
    });
  }
  triggerAfterRender() {
    this.plugins.forEach((c) => {
      c.hooks?.afterRender && c.hooks.afterRender(this.context);
    });
  }
  triggerOnEventChange(c) {
    this.plugins.forEach((n) => {
      n.hooks?.onEventChange && n.hooks.onEventChange(c);
    });
  }
  triggerValidateSave(c) {
    const n = [];
    return this.plugins.forEach((r) => {
      if (r.hooks?.validateSave) {
        const o = r.hooks.validateSave(c, this.context);
        o && n.push(o);
      }
    }), n;
  }
}
const mt = ({ onChange: t, timeFormat: c, slotInterval: n, timezone: r, enabledTimeSlots: o, disabledTimeSlots: N, enabledTimeInterval: u, disableTimeInterval: d, checkIsSlotEnabled: m }) => {
  const h = y(() => {
    const g = [], j = i.tz(r).startOf("day");
    for (let T = 0; T < 1440; T += n)
      g.push(j.clone().add(T, "minutes"));
    return g;
  }, [n, r]);
  return /* @__PURE__ */ e("div", { className: "absolute z-[70] bg-white border rounded shadow-xl mt-1 max-h-48 overflow-y-auto w-full no-scrollbar", children: h.map((g, j) => {
    const T = m(g, o, N, u, d);
    return /* @__PURE__ */ e(
      "div",
      {
        onClick: () => {
          T && t(g.format(c));
        },
        className: `px-3 py-2 text-sm border-b last:border-0 ${T ? "hover:bg-blue-50 cursor-pointer text-gray-800" : "bg-gray-50 text-gray-300 cursor-not-allowed"}`,
        children: g.format(c)
      },
      j
    );
  }) });
}, ht = ({ value: t, onChange: c, dateFormat: n, timezone: r }) => {
  const [o, N] = q(() => i.tz(t, n, r).isValid() ? i.tz(t, n, r) : i.tz(r)), u = y(() => {
    const d = o.clone().startOf("month").startOf("week"), m = o.clone().endOf("month").endOf("week"), h = [];
    let g = d.clone();
    for (; g.isBefore(m); )
      h.push(g.clone()), g.add(1, "day");
    return h;
  }, [o]);
  return /* @__PURE__ */ a("div", { className: "absolute z-[70] bg-white border rounded shadow-xl mt-1 p-3 w-64 animate-fadeIn", children: [
    /* @__PURE__ */ a("div", { className: "flex justify-between items-center mb-2", children: [
      /* @__PURE__ */ e("button", { onClick: () => N(o.clone().subtract(1, "month")), className: "p-1 hover:bg-gray-100 rounded", children: "←" }),
      /* @__PURE__ */ e("span", { className: "font-semibold", children: o.format("MMMM YYYY") }),
      /* @__PURE__ */ e("button", { onClick: () => N(o.clone().add(1, "month")), className: "p-1 hover:bg-gray-100 rounded", children: "→" })
    ] }),
    /* @__PURE__ */ e("div", { className: "grid grid-cols-7 gap-1 text-center text-xs mb-1 font-bold text-gray-500", children: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => /* @__PURE__ */ e("div", { children: d }, d)) }),
    /* @__PURE__ */ e("div", { className: "grid grid-cols-7 gap-1", children: u.map((d, m) => /* @__PURE__ */ e(
      "div",
      {
        onClick: () => c(d.format(n)),
        className: `p-1.5 text-xs rounded cursor-pointer transition-colors ${d.isSame(o, "month") ? "hover:bg-blue-100" : "text-gray-300"} ${t === d.format(n) ? "bg-blue-600 text-white" : ""}`,
        children: d.date()
      },
      m
    )) })
  ] });
}, nt = ({
  isOpen: t,
  onClose: c,
  editingEvent: n,
  formData: r,
  setFormData: o,
  formFields: N,
  timezone: u,
  dateFormat: d = "YYYY-MM-DD",
  timeFormat: m = "HH:mm",
  onAddEvent: h,
  onEditEvent: g,
  onDeleteEvent: j,
  pluginManager: T,
  conflictTemplate: v,
  slotInterval: K = 30,
  enabledTimeSlots: ie,
  disabledTimeSlots: ae,
  enabledTimeInterval: te,
  disableTimeInterval: W
}) => {
  console.log("[EventFormModal] LOADING COMPONENT - version 1.1.7-hardened");
  const [re, G] = q([]), [H, z] = q(null);
  return t ? /* @__PURE__ */ a("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50", children: [
    /* @__PURE__ */ a("div", { className: "bg-white rounded-xl p-6 w-96 shadow-xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ e("h3", { className: "text-lg font-semibold mb-4", children: n ? "Edit Event" : "Create Event" }),
      N?.map((l) => /* @__PURE__ */ a("div", { className: "mb-4", children: [
        /* @__PURE__ */ e("label", { className: "block text-sm mb-1", children: l.label }),
        (() => {
          switch (l.type) {
            case "textarea":
              return /* @__PURE__ */ e("textarea", { required: l.required, value: r[l.name] || "", onChange: (f) => o({ ...r, [l.name]: f.target.value }), className: "w-full border rounded px-3 py-2", rows: 3 });
            case "dropdown":
            case "singleSelect":
              return /* @__PURE__ */ a("select", { required: l.required, value: r[l.name] || "", onChange: (f) => o({ ...r, [l.name]: f.target.value }), className: "w-full border rounded px-3 py-2", children: [
                /* @__PURE__ */ e("option", { value: "", children: "Select..." }),
                l.options?.map((f) => /* @__PURE__ */ e("option", { value: f.value, children: f.label }, f.value))
              ] });
            case "multiselect":
              return /* @__PURE__ */ e("select", { multiple: !0, required: l.required, value: r[l.name] || [], onChange: (f) => {
                const b = Array.from(f.target.selectedOptions, (D) => D.value);
                o({ ...r, [l.name]: b });
              }, className: "w-full border rounded px-3 py-2 h-24", children: l.options?.map((f) => /* @__PURE__ */ e("option", { value: f.value, children: f.label }, f.value)) });
            case "radio":
              return /* @__PURE__ */ e("div", { className: "flex gap-4 mt-1", children: l.options?.map((f) => /* @__PURE__ */ a("label", { className: "flex items-center gap-1 cursor-pointer", children: [
                /* @__PURE__ */ e("input", { type: "radio", name: l.name, value: f.value, checked: r[l.name] === f.value, onChange: (b) => o({ ...r, [l.name]: b.target.value }) }),
                f.label
              ] }, f.value)) });
            case "boolean":
              return /* @__PURE__ */ e("input", { type: "checkbox", checked: !!r[l.name], onChange: (f) => o({ ...r, [l.name]: f.target.checked }), className: "w-5 h-5 mt-1 cursor-pointer" });
            case "attachment":
              return /* @__PURE__ */ e("input", { type: "file", required: l.required, onChange: (f) => {
                f.target.files && f.target.files.length > 0 && o({ ...r, [l.name]: f.target.files[0].name });
              }, className: "w-full border rounded px-3 py-2" });
            case "colorPicker":
              return /* @__PURE__ */ e("input", { type: "color", required: l.required, value: r[l.name] || "#000000", onChange: (f) => o({ ...r, [l.name]: f.target.value }), className: "w-16 h-10 p-1 border rounded cursor-pointer" });
            case "year":
              return /* @__PURE__ */ e("input", { type: "number", required: l.required, placeholder: "YYYY", value: r[l.name] || "", onChange: (f) => o({ ...r, [l.name]: f.target.value }), className: "w-full border rounded px-3 py-2" });
            case "day":
              return /* @__PURE__ */ e("input", { type: "number", required: l.required, min: "1", max: "31", placeholder: "DD", value: r[l.name] || "", onChange: (f) => o({ ...r, [l.name]: f.target.value }), className: "w-full border rounded px-3 py-2" });
            default:
              const S = !!((l.type === "datetime-local" || l.type === "datetime" || l.type === "date" || l.type === "time") && (d || m));
              return /* @__PURE__ */ a("div", { className: "relative", children: [
                /* @__PURE__ */ e(
                  "input",
                  {
                    type: S ? "text" : l.type,
                    required: l.required,
                    placeholder: l.type === "datetime-local" || l.type === "datetime" ? `${d || "YYYY-MM-DD"} ${m || "HH:mm"}` : l.type === "date" ? d || "YYYY-MM-DD" : l.type === "time" ? m || "HH:mm" : "",
                    value: r[l.name] || "",
                    onChange: (f) => o({ ...r, [l.name]: f.target.value }),
                    onClick: () => {
                      S && z({ name: l.name, type: l.type === "time" ? "time" : "date" });
                    },
                    className: `w-full border rounded px-3 py-2 cursor-pointer ${S ? "pr-8" : ""}`,
                    readOnly: S
                  }
                ),
                S && /* @__PURE__ */ e(
                  "div",
                  {
                    className: "absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 z-10",
                    onClick: () => {
                      z({ name: l.name, type: l.type === "time" ? "time" : "date" });
                    },
                    children: /* @__PURE__ */ a("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      /* @__PURE__ */ e("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
                      /* @__PURE__ */ e("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
                      /* @__PURE__ */ e("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
                      /* @__PURE__ */ e("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
                    ] })
                  }
                ),
                S && H?.name === l.name && H.type === "date" && /* @__PURE__ */ a(le, { children: [
                  /* @__PURE__ */ e("div", { className: "fixed inset-0 z-[60]", onClick: () => z(null) }),
                  /* @__PURE__ */ e(
                    ht,
                    {
                      value: r[l.name] ? i.tz(r[l.name], `${d || "YYYY-MM-DD"} ${m || "HH:mm"}`, u).format(d || "YYYY-MM-DD") : "",
                      onChange: (f) => {
                        let b = f;
                        if (l.type === "datetime-local" || l.type === "datetime") {
                          const D = r[l.name], C = i.tz(D, `${d || "YYYY-MM-DD"} ${m || "HH:mm"}`, u), $ = C.isValid() ? C.format(m || "HH:mm") : i().format(m || "HH:mm");
                          b = `${f} ${$}`, z({ name: l.name, type: "time" });
                        } else
                          z(null);
                        o({ ...r, [l.name]: b });
                      },
                      dateFormat: d || "YYYY-MM-DD",
                      timezone: u
                    }
                  )
                ] }),
                S && H?.name === l.name && H.type === "time" && /* @__PURE__ */ a(le, { children: [
                  /* @__PURE__ */ e("div", { className: "fixed inset-0 z-[60]", onClick: () => z(null) }),
                  /* @__PURE__ */ e(
                    mt,
                    {
                      value: r[l.name] ? i.tz(r[l.name], `${d || "YYYY-MM-DD"} ${m || "HH:mm"}`, u).format(m || "HH:mm") : "",
                      onChange: (f) => {
                        let b = f;
                        if (l.type === "datetime-local" || l.type === "datetime") {
                          const D = r[l.name], C = i.tz(D, `${d || "YYYY-MM-DD"} ${m || "HH:mm"}`, u);
                          b = `${C.isValid() ? C.format(d || "YYYY-MM-DD") : i().format(d || "YYYY-MM-DD")} ${f}`;
                        }
                        o({ ...r, [l.name]: b }), z(null);
                      },
                      timeFormat: m || "HH:mm",
                      slotInterval: K,
                      timezone: u,
                      enabledTimeSlots: ie,
                      disabledTimeSlots: ae,
                      enabledTimeInterval: te,
                      disableTimeInterval: W,
                      checkIsSlotEnabled: tt
                    }
                  )
                ] })
              ] });
          }
        })()
      ] }, l.name)),
      /* @__PURE__ */ a("div", { className: "flex justify-between mt-4", children: [
        n && j && /* @__PURE__ */ e(
          "button",
          {
            onClick: () => {
              j(n.id), c();
            },
            className: "text-red-600 text-sm",
            children: "Delete"
          }
        ),
        /* @__PURE__ */ a("div", { className: "flex gap-2 ml-auto", children: [
          /* @__PURE__ */ e(
            "button",
            {
              onClick: c,
              className: "px-3 py-1 border rounded",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              onClick: () => {
                try {
                  const l = (b) => {
                    if (console.log("[EventFormModal] parseInTimezone input:", b), !b) return i().utc().toISOString();
                    if (b.includes("T") && (b.includes("Z") || b.split(":").length > 2)) {
                      const C = i(b).toISOString();
                      return console.log("[EventFormModal] recognized ISO:", C), C;
                    }
                    if (d && m) {
                      const C = i.tz(b, `${d} ${m}`, u);
                      if (C.isValid()) {
                        const $ = C.toISOString();
                        return console.log("[EventFormModal] parsed via custom format:", $), $;
                      }
                    }
                    const D = i.tz(b, "YYYY-MM-DDTHH:mm", u);
                    if (D.isValid()) {
                      const C = D.toISOString();
                      return console.log("[EventFormModal] parsed via fallback format:", C), C;
                    }
                    return console.warn("[EventFormModal] failed to parse date, returning current time as fallback"), i().utc().toISOString();
                  }, S = {
                    ...r,
                    start: r.start ? l(r.start) : r.start,
                    end: r.end ? l(r.end) : r.end
                  };
                  console.log("[EventFormModal] finalData:", S);
                  const f = T.triggerValidateSave(S);
                  if (f.length > 0) {
                    G(f);
                    return;
                  }
                  if (n) {
                    const b = {
                      ...n,
                      ...S
                    };
                    g?.(b), T.triggerOnEventChange(b);
                  } else {
                    const b = {
                      id: Date.now().toString(),
                      ...S
                    };
                    h?.(b);
                  }
                  c();
                } catch (l) {
                  console.error("[EventFormModal] Save Error:", l), alert("SAVE ERROR: " + l.message);
                }
              },
              className: "px-4 py-1 bg-blue-600 text-white rounded",
              children: "Save"
            }
          )
        ] })
      ] })
    ] }),
    re.length > 0 && /* @__PURE__ */ e("div", { className: "fixed inset-0 bg-black/60 flex items-center justify-center z-[60] animate-fadeIn", children: /* @__PURE__ */ a(
      "div",
      {
        className: "bg-white rounded-2xl p-8 w-[450px] shadow-2xl border transform animate-scaleIn",
        style: {
          borderColor: v?.theme?.borderColor || "#fee2e2",
          backgroundColor: v?.theme?.backgroundColor || "#fff"
        },
        children: [
          v?.renderHeader ? v.renderHeader(v.title || "Conflict Detected", v.theme || { primaryColor: "#dc2626", secondaryColor: "#ef4444", backgroundColor: "#fff", textColor: "#1f2937", borderColor: "#fee2e2" }) : /* @__PURE__ */ a("div", { className: "flex items-center gap-4 mb-6", style: { color: v?.theme?.primaryColor || "#dc2626" }, children: [
            /* @__PURE__ */ e("div", { className: "w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0", style: { backgroundColor: v?.theme?.secondaryColor + "10" || "#fef2f2" }, children: v?.theme?.icon || /* @__PURE__ */ e("span", { className: "text-2xl", children: "⚠️" }) }),
            /* @__PURE__ */ a("div", { children: [
              /* @__PURE__ */ e("h4", { className: "text-xl font-bold", children: v?.title || "Conflict Detected" }),
              /* @__PURE__ */ e("p", { className: "text-sm opacity-70", children: v?.description || "Overlapping schedule found" })
            ] })
          ] }),
          /* @__PURE__ */ e("div", { className: "bg-gray-50 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto border border-gray-100", style: { backgroundColor: v?.theme?.backgroundColor === "#fff" ? "#f9fafb" : v?.theme?.backgroundColor }, children: v?.renderDetails ? v.renderDetails(re) : re.map((l, S) => /* @__PURE__ */ e("div", { className: "mb-3 last:mb-0", children: /* @__PURE__ */ e("div", { className: "text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed", style: { color: v?.theme?.textColor || "#1f2937" }, children: l }) }, S)) }),
          v?.renderFooter ? v.renderFooter(() => G([]), v.theme || { primaryColor: "#dc2626", secondaryColor: "#ef4444", backgroundColor: "#fff", textColor: "#1f2937", borderColor: "#fee2e2" }) : /* @__PURE__ */ e("div", { className: "flex gap-3", children: /* @__PURE__ */ e(
            "button",
            {
              onClick: () => G([]),
              className: "flex-1 px-6 py-3 text-white font-semibold rounded-xl transition-all shadow-lg",
              style: {
                backgroundColor: v?.theme?.primaryColor || "#dc2626",
                boxShadow: `0 10px 15px -3px ${v?.theme?.primaryColor}40` || "0 10px 15px -3px rgba(220, 38, 38, 0.4)"
              },
              children: v?.buttonText || "I'll Fix It"
            }
          ) })
        ]
      }
    ) })
  ] }) : null;
}, xt = {
  classic_red: {
    title: "Conflict Detected",
    description: "Your schedule has overlaps.",
    buttonText: "I'll Fix It",
    theme: {
      primaryColor: "#dc2626",
      secondaryColor: "#fee2e2",
      backgroundColor: "#fff",
      textColor: "#1f2937",
      borderColor: "#fee2e2"
    }
  },
  amber_warning: {
    title: "Scheduling Conflict",
    description: "We found some overlaps in your calendar.",
    buttonText: "Adjust Schedule",
    theme: {
      primaryColor: "#d97706",
      secondaryColor: "#fef3c7",
      backgroundColor: "#fff",
      textColor: "#92400e",
      borderColor: "#fde68a"
    }
  },
  indigo_modern: {
    title: "Overlapping Events",
    description: "Please resolve the following conflicts.",
    buttonText: "Got It",
    theme: {
      primaryColor: "#4f46e5",
      secondaryColor: "#e0e7ff",
      backgroundColor: "#f8fafc",
      textColor: "#1e1b4b",
      borderColor: "#c7d2fe"
    }
  },
  emerald_soft: {
    title: "Time Slot Conflict",
    description: "A few events are clashing.",
    buttonText: "Review",
    theme: {
      primaryColor: "#059669",
      secondaryColor: "#d1fae5",
      backgroundColor: "#fff",
      textColor: "#064e3b",
      borderColor: "#a7f3d0"
    }
  },
  dark_noir: {
    title: "Conflict Alert",
    description: "Overlapping periods detected.",
    buttonText: "Dismiss",
    theme: {
      primaryColor: "#f8fafc",
      secondaryColor: "#334155",
      backgroundColor: "#0f172a",
      textColor: "#f1f5f9",
      borderColor: "#1e293b"
    }
  },
  rose_elegant: {
    title: "Schedule Clash",
    description: "Heads up! Some events overlap.",
    buttonText: "Update Now",
    theme: {
      primaryColor: "#e11d48",
      secondaryColor: "#ffe4e6",
      backgroundColor: "#fff5f5",
      textColor: "#4c0519",
      borderColor: "#fecdd3"
    }
  },
  glassmorphism: {
    title: "Blurred Reality",
    description: "Your schedule is overlapping.",
    buttonText: "Clear Up",
    theme: {
      primaryColor: "#fff",
      secondaryColor: "rgba(255, 255, 255, 0.2)",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      textColor: "#fff",
      borderColor: "rgba(255, 255, 255, 0.3)"
    }
  },
  cyberpunk: {
    title: "SYSTEM NEON",
    description: "CONFLICT IN MATRIX DETECTED.",
    buttonText: "REBOOT",
    theme: {
      primaryColor: "#ff00ff",
      secondaryColor: "#00ffff",
      backgroundColor: "#1a1a1a",
      textColor: "#00ff00",
      borderColor: "#ff00ff"
    }
  },
  minimalist: {
    title: "Conflicts",
    description: "Events overlap.",
    buttonText: "Done",
    theme: {
      primaryColor: "#000",
      secondaryColor: "#f3f4f6",
      backgroundColor: "#fff",
      textColor: "#000",
      borderColor: "#e5e7eb"
    }
  },
  high_visibility: {
    title: "ALERT: CONFLICT",
    description: "YOUR EVENTS OVERLAP.",
    buttonText: "FIX NOW",
    theme: {
      primaryColor: "#000",
      secondaryColor: "#ff0",
      backgroundColor: "#ff0",
      textColor: "#000",
      borderColor: "#000"
    }
  }
}, xe = {
  classic_light: {
    primaryColor: "#3b82f6",
    // blue-500
    backgroundColor: "#ffffff",
    secondaryBackgroundColor: "#f9fafb",
    // gray-50
    gridColor: "#e5e7eb",
    // gray-200
    textColor: "#111827",
    // gray-900
    secondaryTextColor: "#6b7280",
    // gray-500
    accentColor: "#eff6ff",
    // blue-50
    eventDefaultColor: "#3b82f6",
    eventDefaultTextColor: "#ffffff"
  },
  dark_night: {
    primaryColor: "#6366f1",
    // indigo-500
    backgroundColor: "#0f172a",
    // slate-900
    secondaryBackgroundColor: "#1e293b",
    // slate-800
    gridColor: "#334155",
    // slate-700
    textColor: "#f8fafc",
    // slate-50
    secondaryTextColor: "#94a3b8",
    // slate-400
    accentColor: "#1e1b4b",
    // indigo-950
    eventDefaultColor: "#6366f1",
    eventDefaultTextColor: "#ffffff"
  },
  slate_modern: {
    primaryColor: "#0ea5e9",
    // sky-500
    backgroundColor: "#f8fafc",
    // slate-50
    secondaryBackgroundColor: "#f1f5f9",
    // slate-100
    gridColor: "#cbd5e1",
    // slate-300
    textColor: "#334155",
    // slate-700
    secondaryTextColor: "#64748b",
    // slate-500
    accentColor: "#e0f2fe",
    // sky-100
    eventDefaultColor: "#0ea5e9",
    eventDefaultTextColor: "#ffffff"
  },
  emerald_forest: {
    primaryColor: "#10b981",
    // emerald-500
    backgroundColor: "#f0fdf4",
    // emerald-50
    secondaryBackgroundColor: "#dcfce7",
    // emerald-100
    gridColor: "#a7f3d0",
    // emerald-200
    textColor: "#064e3b",
    // emerald-950
    secondaryTextColor: "#047857",
    // emerald-700
    accentColor: "#ecfdf5",
    // emerald-50
    eventDefaultColor: "#10b981",
    eventDefaultTextColor: "#ffffff"
  },
  ocean_breeze: {
    primaryColor: "#06b6d4",
    // cyan-500
    backgroundColor: "#ecfeff",
    // cyan-50
    secondaryBackgroundColor: "#cffafe",
    // cyan-100
    gridColor: "#a5f3fc",
    // cyan-200
    textColor: "#164e63",
    // cyan-950
    secondaryTextColor: "#0891b2",
    // cyan-700
    accentColor: "#f0fdfa",
    // teal-50
    eventDefaultColor: "#06b6d4",
    eventDefaultTextColor: "#ffffff"
  },
  midnight_purple: {
    primaryColor: "#a855f7",
    // purple-500
    backgroundColor: "#2e1065",
    // purple-950
    secondaryBackgroundColor: "#4c1d95",
    // purple-900
    gridColor: "#7e22ce",
    // purple-700
    textColor: "#faf5ff",
    // purple-50
    secondaryTextColor: "#d8b4fe",
    // purple-300
    accentColor: "#581c87",
    // purple-900
    eventDefaultColor: "#a855f7",
    eventDefaultTextColor: "#ffffff"
  },
  amber_gold: {
    primaryColor: "#f59e0b",
    // amber-500
    backgroundColor: "#fffbeb",
    // amber-50
    secondaryBackgroundColor: "#fef3c7",
    // amber-100
    gridColor: "#fcd34d",
    // amber-300
    textColor: "#78350f",
    // amber-950
    secondaryTextColor: "#b45309",
    // amber-700
    accentColor: "#fffbeb",
    eventDefaultColor: "#f59e0b",
    eventDefaultTextColor: "#ffffff"
  },
  rose_petal: {
    primaryColor: "#f43f5e",
    // rose-500
    backgroundColor: "#fff1f2",
    // rose-50
    secondaryBackgroundColor: "#ffe4e6",
    // rose-100
    gridColor: "#fda4af",
    // rose-300
    textColor: "#4c0519",
    // rose-950
    secondaryTextColor: "#be123c",
    // rose-700
    accentColor: "#fff1f2",
    eventDefaultColor: "#f43f5e",
    eventDefaultTextColor: "#ffffff"
  },
  minimal_mono: {
    primaryColor: "#18181b",
    // zinc-900
    backgroundColor: "#ffffff",
    secondaryBackgroundColor: "#f4f4f5",
    // zinc-100
    gridColor: "#e4e4e7",
    // zinc-200
    textColor: "#09090b",
    // zinc-950
    secondaryTextColor: "#71717a",
    // zinc-500
    accentColor: "#f4f4f5",
    eventDefaultColor: "#27272a",
    // zinc-800
    eventDefaultTextColor: "#ffffff"
  },
  cyber_punk: {
    primaryColor: "#ff00ff",
    // magenta
    backgroundColor: "#000000",
    secondaryBackgroundColor: "#1a1a1a",
    gridColor: "#3dfaeb",
    // neon cyan
    textColor: "#3dfaeb",
    secondaryTextColor: "#ff00ff",
    accentColor: "#ff00ff22",
    eventDefaultColor: "#ff00ff",
    eventDefaultTextColor: "#000000"
  }
}, gt = ({
  timezone: t = i.tz.guess() || "UTC",
  timezoneLabelInclude: c = !1,
  slotInterval: n = 30,
  dateFormat: r = "YYYY-MM-DD",
  timeFormat: o = "HH:mm",
  showTimeSlots: N = !0,
  selectedDate: u,
  onDateChange: d,
  events: m,
  onEventChange: h,
  navigationPosition: g = "center",
  showTodayBelow: j = !0,
  renderNavigation: T,
  showEmptyState: v = !0,
  enabledTimeSlots: K,
  disabledTimeSlots: ie,
  enabledTimeInterval: ae,
  disableTimeInterval: te,
  emptyStateContent: W,
  emptyStateContentPopup: re,
  futureDaysOnly: G,
  pastDaysOnly: H,
  currentDayOnly: z,
  navigateToFirstEvent: l,
  onAddEvent: S,
  onEditEvent: f,
  onDeleteEvent: b,
  formFields: D,
  onlyCreateEditRequired: C = !0,
  plugins: $,
  conflictTemplate: U,
  conflictThemeVariant: be,
  calendarTheme: fe,
  calendarThemeVariant: oe
}) => {
  const Z = et(null), ne = et(null), [ke, ce] = q(() => i.tz(u || /* @__PURE__ */ new Date(), t)), ge = u !== void 0 ? u : ke, _ = (s) => {
    d ? d(s) : ce(s);
  }, [ve, Q] = q(() => m || []), F = m !== void 0 ? m : ve, x = S || ((s) => Q((p) => [...p, s])), E = f || ((s) => Q((p) => p.map((M) => M.id === s.id ? s : M))), L = b || ((s) => Q((p) => p.filter((M) => M.id !== s))), ue = D || [
    { name: "title", label: "Event Title", type: "text", required: !0 },
    { name: "description", label: "Description", type: "textarea" },
    { name: "start", label: "Start Time", type: "datetime-local", required: !0 },
    { name: "end", label: "End Time", type: "datetime-local", required: !0 }
  ], X = y(() => fe || (oe && xe[oe] ? xe[oe] : xe.classic_light), [fe, oe]), Ce = y(() => ({
    "--calendar-primary": X.primaryColor,
    "--calendar-bg": X.backgroundColor,
    "--calendar-secondary-bg": X.secondaryBackgroundColor,
    "--calendar-grid": X.gridColor,
    "--calendar-text": X.textColor,
    "--calendar-secondary-text": X.secondaryTextColor,
    "--calendar-accent": X.accentColor,
    "--calendar-event-bg": X.eventDefaultColor,
    "--calendar-event-text": X.eventDefaultTextColor
  }), [X]), J = y(() => F ?? [], [F]), P = y(() => new ot($, {
    timezone: t,
    slotInterval: n,
    events: J,
    onEventChange: h,
    onAddEvent: x,
    onEditEvent: E,
    onDeleteEvent: L
  }), [$, t, n, J, h, x, E, L]);
  Ge(() => {
    P.init();
  }, [P]);
  const w = y(
    () => Ae(ge, t),
    [ge, t]
  ), se = y(() => i.utc().tz(t), [t]), we = w.isSame(se, "day"), [O, I] = q(!1), [de, me] = q(null), [Ye, A] = q({}), he = G && H, je = !he && G && w.isBefore(i().tz(t), "day") || z && w.isBefore(i().tz(t), "day"), Re = !he && H && w.isAfter(i().tz(t), "day") || z && w.isAfter(i().tz(t), "day"), Te = je || Re || z && !we, Se = y(
    () => st(ae),
    [ae]
  ), Ze = () => {
    I(!1), me(null), A({});
  }, Y = y(
    () => rt(J, w, t),
    [J, w, t]
  ).filter((s) => !s.allDay), R = y(() => {
    P.triggerBeforeRender();
    const s = dt(Y, w, n);
    return P.triggerAfterRender(), s;
  }, [Y, w, n, P]), ee = !z && (he || !(G && w.isSameOrBefore(se, "day"))), B = !z && (he || !(H && w.isSameOrAfter(se, "day"))), pe = () => {
    ee && _(w.clone().subtract(1, "day"));
  }, Be = () => {
    B && _(w.clone().add(1, "day"));
  }, $e = () => _(i.utc().tz(t)), [De, qe] = q(null), [Oe, Me] = q(null), Pe = (s) => Math.round(s / n) * n;
  Ge(() => {
    const s = (M) => {
      if (!ne.current) return;
      const ye = ne.current.getBoundingClientRect(), _e = (M.clientY - ye.top) / V * n;
      if (De) {
        const Ee = Pe(_e), Ne = w.clone().startOf("day").add(Ee, "minutes"), He = De.end.diff(
          De.start,
          "minutes"
        ), Ie = {
          ...De,
          start: Ne,
          end: Ne.clone().add(He, "minutes")
        };
        h?.(Ie), P.triggerOnEventChange(Ie);
      }
      if (Oe) {
        const Ee = Pe(_e), Ne = w.clone().startOf("day").add(Ee, "minutes");
        if (Ne.isAfter(Oe.start)) {
          const He = {
            ...Oe,
            end: Ne
          };
          h?.(He), P.triggerOnEventChange(He);
        }
      }
    }, p = () => {
      qe(null), Me(null);
    };
    return window.addEventListener("mousemove", s), window.addEventListener("mouseup", p), () => {
      window.removeEventListener("mousemove", s), window.removeEventListener("mouseup", p);
    };
  }, [De, Oe, w, n, h]);
  const Xe = (s, p) => {
    let M;
    if (p)
      M = p.clone();
    else if (ne.current) {
      const We = ne.current.getBoundingClientRect(), Ee = (s.clientY - We.top) / V * n, Ne = Pe(Ee);
      M = w.clone().startOf("day").add(Ne, "minutes");
    } else
      return;
    if (!ze(M)) return;
    const ye = M.clone().add(n, "minutes");
    me(null), A({
      start: M.format(`${r || "YYYY-MM-DD"} ${o || "HH:mm"}`),
      end: ye.format(`${r || "YYYY-MM-DD"} ${o || "HH:mm"}`)
    }), I(!0);
  }, Je = y(
    () => ct(w, n),
    [w, n]
  ), ze = (s) => tt(
    s,
    K,
    ie,
    ae,
    te
  );
  lt(() => {
    Z.current && (Z.current.scrollTop = 0);
  }, [w, l]), Ge(() => {
    if (!Z.current || !l) return;
    const s = setTimeout(() => {
      Z.current && requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!Z.current) return;
          let p = 0;
          if (R.length > 0)
            p = R[0].top;
          else {
            const M = Je.findIndex((ye) => ze(ye));
            M !== -1 && (p = M * V);
          }
          if (p > 0) {
            const M = Math.max(0, p - V), ye = Z.current.scrollTop, We = M - ye, _e = 2e3;
            let Ee = null;
            const Ne = (He) => {
              Ee === null && (Ee = He);
              const Ie = He - Ee, Le = Ie / _e, ft = Le < 0.5 ? 4 * Le * Le * Le : 1 - Math.pow(-2 * Le + 2, 3) / 2;
              Z.current && (Z.current.scrollTop = ye + We * ft, Ie < _e ? requestAnimationFrame(Ne) : Z.current.scrollTop = M);
            };
            requestAnimationFrame(Ne);
          }
        });
      });
    }, 100);
    return () => clearTimeout(s);
  }, [w, R.length, l]);
  const Ve = /* @__PURE__ */ a("div", { className: "text-center flex flex-col items-center", children: [
    /* @__PURE__ */ e("h2", { className: "text-xl font-semibold px-4 py-1 rounded-full text-white", style: we ? { backgroundColor: "var(--calendar-primary)" } : { color: "var(--calendar-text)" }, children: w.format(r) }),
    c && /* @__PURE__ */ a("p", { className: "text-xs text-gray-500 mt-1", children: [
      "GMT",
      w.format("Z"),
      " • ",
      t
    ] }),
    j && /* @__PURE__ */ e("button", { onClick: $e, className: "mt-1 text-sm font-medium", style: { color: "var(--calendar-primary)" }, children: "Today" })
  ] }), Ke = /* @__PURE__ */ e(
    "button",
    {
      onClick: pe,
      disabled: !ee,
      className: `px-3 py-1 rounded ${ee ? "hover:bg-gray-200" : "opacity-50 cursor-not-allowed"}`,
      children: "◀"
    }
  ), Qe = /* @__PURE__ */ e(
    "button",
    {
      onClick: Be,
      disabled: !B,
      className: `px-3 py-1 rounded ${B ? "hover:bg-gray-200" : "opacity-50 cursor-not-allowed"}`,
      children: "▶"
    }
  ), Fe = /* @__PURE__ */ a("div", { className: "flex items-center gap-2", children: [
    Ke,
    Qe
  ] }), it = T ? T({
    goToPreviousDay: pe,
    goToNextDay: Be,
    goToToday: $e,
    dateNode: Ve,
    prevNode: Ke,
    nextNode: Qe,
    defaultNav: Fe,
    currentDate: w,
    timezone: t
  }) : null;
  return /* @__PURE__ */ a("div", { className: "flex flex-col flex-1 h-full w-full min-h-0 no-scrollbar", style: { ...Ce, backgroundColor: "var(--calendar-bg)", color: "var(--calendar-text)" }, children: [
    T != null ? /* @__PURE__ */ e("div", { children: it }, "custom-nav-wrapper") : /* @__PURE__ */ a("div", { className: "sticky top-0 z-20 border-b px-6 py-4 flex items-center min-h-[80px]", style: { backgroundColor: "var(--calendar-bg)", borderColor: "var(--calendar-grid)" }, children: [
      g === "left" && /* @__PURE__ */ a(le, { children: [
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-start items-center", children: Fe }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-center items-center", children: Ve }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-end items-center" })
      ] }),
      g === "center" && /* @__PURE__ */ a(le, { children: [
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-start items-center" }),
        /* @__PURE__ */ a("div", { className: "flex-1 flex justify-center items-center gap-4", children: [
          Ke,
          Ve,
          Qe
        ] }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-end items-center" })
      ] }),
      g === "right" && /* @__PURE__ */ a(le, { children: [
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-start items-center" }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-center items-center", children: Ve }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-end items-center gap-4", children: Fe })
      ] })
    ] }),
    N === !1 ? /* @__PURE__ */ a("div", { className: "flex flex-col flex-1 min-h-0 m-5 p-4 overflow-y-auto no-scrollbar relative", children: [
      C && /* @__PURE__ */ e("div", { className: "flex justify-end mb-4", children: /* @__PURE__ */ e(
        "button",
        {
          onClick: () => {
            me(null);
            const s = w.clone().hour(9).minute(0), p = s.clone().add(n, "minutes");
            A({
              start: s.format("YYYY-MM-DDTHH:mm"),
              end: p.format("YYYY-MM-DDTHH:mm")
            }), I(!0);
          },
          className: "px-4 py-2 text-sm text-white rounded shadow transition-colors",
          style: { backgroundColor: "var(--calendar-primary)" },
          children: "+ Add Event"
        }
      ) }),
      Y.length === 0 ? /* @__PURE__ */ e("div", { className: "flex flex-col items-center justify-center flex-1 h-full min-h-[200px] border-2 border-dashed rounded-xl", style: { borderColor: "var(--calendar-grid)" }, children: /* @__PURE__ */ e("p", { className: "text-gray-500 font-medium mb-4", children: W || "No events scheduled" }) }) : /* @__PURE__ */ e("div", { className: "flex flex-col gap-3 pb-8", children: Y.sort((s, p) => i(s.start).diff(i(p.start))).map((s) => /* @__PURE__ */ a(
        "div",
        {
          onClick: (p) => {
            p.stopPropagation(), P.triggerOnEventClick(s), C && (me(s), A({
              ...s,
              start: i(s.start).tz(t).format("YYYY-MM-DDTHH:mm"),
              end: i(s.end).tz(t).format("YYYY-MM-DDTHH:mm")
            }), I(!0));
          },
          className: "p-4 rounded-xl border flex flex-col cursor-pointer transition-transform hover:scale-[1.01] shadow-sm relative group",
          style: {
            backgroundColor: "var(--calendar-event-bg)",
            color: "var(--calendar-event-text)",
            borderColor: "var(--calendar-grid)",
            borderLeft: "4px solid var(--calendar-primary)"
          },
          children: [
            /* @__PURE__ */ a("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ e("div", { className: "font-semibold text-base", children: s.title }),
              /* @__PURE__ */ e(
                "button",
                {
                  onClick: (p) => {
                    p.stopPropagation(), L(s.id);
                  },
                  className: "text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors",
                  title: "Delete Event",
                  children: "✕"
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "text-sm opacity-80 mt-1", children: [
              i(s.start).tz(t).format(o),
              " - ",
              i(s.end).tz(t).format(o)
            ] })
          ]
        },
        s.id
      )) })
    ] }) : /* @__PURE__ */ e("div", { ref: Z, className: "flex-1 overflow-y-auto no-scrollbar", children: /* @__PURE__ */ a("div", { className: "flex min-h-full", children: [
      /* @__PURE__ */ e("div", { className: "w-24 flex-shrink-0", style: { backgroundColor: "var(--calendar-secondary-bg)" }, children: Je.map((s, p) => {
        const M = ze(s);
        return /* @__PURE__ */ e(
          "div",
          {
            className: "relative text-xs text-right pr-3 border-b border-dotted border-r",
            style: {
              height: V,
              borderColor: "var(--calendar-grid)",
              color: M ? "var(--calendar-secondary-text)" : "var(--calendar-grid)",
              cursor: M ? "pointer" : "not-allowed",
              backgroundColor: M ? "transparent" : "var(--calendar-secondary-bg)"
            },
            children: /* @__PURE__ */ e("span", { className: "absolute top-1/2 -translate-y-1/2 right-2", children: s.format(o) })
          },
          p
        );
      }) }),
      /* @__PURE__ */ a("div", { ref: ne, className: "flex-1 relative", onDoubleClick: (s) => Xe(s), children: [
        Je.map((s, p) => {
          const M = ze(s);
          return /* @__PURE__ */ e(
            "div",
            {
              onDoubleClick: (ye) => {
                ye.stopPropagation(), M && Xe(ye, s);
              },
              style: {
                height: V,
                borderColor: "var(--calendar-grid)",
                cursor: M ? "pointer" : "not-allowed",
                backgroundColor: M ? "transparent" : "rgba(0,0,0,0.02)"
              },
              className: `border-b border-dotted transition-colors ${M ? "hover:bg-gray-50" : ""}`
            },
            p
          );
        }),
        R.map((s) => /* @__PURE__ */ a(
          "div",
          {
            ref: (p) => {
              p && P.triggerOnEventRender(s, p);
            },
            onMouseDown: () => qe(s),
            onDoubleClick: (p) => {
              p.stopPropagation(), P.triggerOnEventClick(s), E && (me(s), A({
                ...s,
                start: i(s.start).tz(t).format(`${r || "YYYY-MM-DD"} ${o || "HH:mm"}`),
                end: i(s.end).tz(t).format(`${r || "YYYY-MM-DD"} ${o || "HH:mm"}`)
              }), I(!0));
            },
            className: "absolute rounded px-2 text-sm cursor-move z-10",
            style: {
              top: s.top,
              height: s.height,
              left: `${s.columnIndex / s.columnCount * 100}%`,
              width: `${100 / s.columnCount}%`,
              backgroundColor: "var(--calendar-event-bg)",
              color: "var(--calendar-event-text)"
            },
            children: [
              s.title,
              L && /* @__PURE__ */ e(
                "button",
                {
                  onClick: (p) => {
                    p.stopPropagation(), L(s.id);
                  },
                  className: "absolute top-1 right-1 text-xs bg-red-500 rounded px-1",
                  children: "✕"
                }
              ),
              /* @__PURE__ */ e(
                "div",
                {
                  onMouseDown: (p) => {
                    p.stopPropagation(), Me(s);
                  },
                  className: "absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize",
                  style: { backgroundColor: "var(--calendar-primary)", opacity: 0.5 }
                }
              )
            ]
          },
          s.id
        )),
        v && R.length === 0 && !Te && /* @__PURE__ */ e(
          "div",
          {
            className: "absolute left-0 right-0 flex items-center justify-center animate-fadeIn",
            onDoubleClick: (s) => {
              Te || Xe(s);
            },
            style: {
              top: Se.startMinutes / n * V,
              height: (Se.endMinutes - Se.startMinutes) / n * V,
              cursor: Te ? "not-allowed" : "pointer"
            },
            children: /* @__PURE__ */ a("div", { className: "bg-white shadow-xl rounded-2xl px-8 py-6 border text-center animate-scaleIn", children: [
              /* @__PURE__ */ e("p", { className: "text-gray-600 font-medium", children: W || "No events scheduled" }),
              re || /* @__PURE__ */ e(
                "button",
                {
                  onClick: () => {
                    me(null), A({}), I(!0);
                  },
                  className: "mt-4 px-4 py-2 text-white rounded",
                  style: { backgroundColor: "var(--calendar-primary)" },
                  children: "Add Event"
                }
              )
            ] })
          }
        ),
        we && /* @__PURE__ */ e(
          "div",
          {
            className: "absolute left-0 right-0 border-t-2",
            style: {
              borderColor: "var(--calendar-primary)",
              top: (se.hours() * 60 + se.minutes()) / n * V
            }
          }
        )
      ] })
    ] }) }),
    C && /* @__PURE__ */ e(
      nt,
      {
        isOpen: O,
        onClose: Ze,
        editingEvent: de,
        formData: Ye,
        setFormData: A,
        formFields: ue,
        timezone: t,
        dateFormat: r,
        timeFormat: o,
        onAddEvent: x,
        onEditEvent: E,
        onDeleteEvent: L,
        pluginManager: P,
        conflictTemplate: U || (be ? xt[be] : void 0),
        slotInterval: n,
        enabledTimeSlots: K,
        disabledTimeSlots: ie,
        enabledTimeInterval: ae,
        disableTimeInterval: te,
        events: J
      }
    )
  ] });
}, Ct = ({
  timezone: t = i.tz.guess() || "UTC",
  timezoneLabelInclude: c = !1,
  slotInterval: n = 30,
  dateFormat: r = "YYYY-MM-DD",
  timeFormat: o = "HH:mm",
  selectedDate: N,
  onDateChange: u,
  events: d,
  onEventChange: m,
  navigationPosition: h = "center",
  renderNavigation: g,
  showEmptyState: j = !0,
  enabledTimeSlots: T,
  disabledTimeSlots: v,
  enabledTimeInterval: K,
  disableTimeInterval: ie,
  onAddEvent: ae,
  onEditEvent: te,
  onDeleteEvent: W,
  formFields: re,
  onlyCreateEditRequired: G = !0,
  navigateToFirstEvent: H,
  futureDaysOnly: z,
  pastDaysOnly: l,
  plugins: S,
  calendarTheme: f,
  calendarThemeVariant: b
}) => {
  const D = et(null), [C, $] = q(() => i.tz(N || /* @__PURE__ */ new Date(), t)), U = N !== void 0 ? N : C, be = (k) => {
    u ? u(k) : $(k);
  }, [fe, oe] = q(() => d || []), Z = d !== void 0 ? d : fe, ne = ae || ((k) => oe((Y) => [...Y, k])), ke = te || ((k) => oe((Y) => Y.map((R) => R.id === k.id ? k : R))), ce = W || ((k) => oe((Y) => Y.filter((R) => R.id !== k))), ge = re || [
    { name: "title", label: "Event Title", type: "text", required: !0 },
    { name: "description", label: "Description", type: "textarea" },
    { name: "start", label: "Start Time", type: "datetime-local", required: !0 },
    { name: "end", label: "End Time", type: "datetime-local", required: !0 }
  ], _ = y(() => f || (b && xe[b] ? xe[b] : xe.classic_light), [f, b]), ve = y(() => ({
    "--calendar-primary": _.primaryColor,
    "--calendar-bg": _.backgroundColor,
    "--calendar-secondary-bg": _.secondaryBackgroundColor,
    "--calendar-grid": _.gridColor,
    "--calendar-text": _.textColor,
    "--calendar-secondary-text": _.secondaryTextColor,
    "--calendar-accent": _.accentColor,
    "--calendar-event-bg": _.eventDefaultColor,
    "--calendar-event-text": _.eventDefaultTextColor
  }), [_]), Q = y(() => Z ?? [], [Z]), F = y(() => new ot(S, {
    timezone: t,
    slotInterval: n,
    events: Q,
    onEventChange: m,
    onAddEvent: ne,
    onEditEvent: ke,
    onDeleteEvent: ce
  }), [S, t, n, Q, m, ne, ke, ce]);
  Ge(() => {
    F.init();
  }, [F]);
  const x = y(
    () => Ae(U, t),
    [U, t]
  ), E = y(() => x.clone().startOf("week"), [x]), L = y(() => {
    const k = [];
    for (let Y = 0; Y < 7; Y++)
      k.push(E.clone().add(Y, "days"));
    return k;
  }, [E]), ue = y(() => i.utc().tz(t), [t]), [X, Ce] = q(!1), [J, P] = q(null), [w, se] = q({}), we = y(
    () => st(K),
    [K]
  ), O = () => {
    Ce(!1), P(null), se({});
  }, I = () => be(x.clone().subtract(1, "week")), de = () => be(x.clone().add(1, "week")), me = () => be(i.utc().tz(t)), Ye = y(
    () => ct(E, n),
    [E, n]
  ), A = (k) => tt(
    k,
    T,
    v,
    K,
    ie
  ), he = y(() => {
    F.triggerBeforeRender();
    const k = L.map((Y) => {
      const R = rt(Q, Y, t).filter((ee) => !ee.allDay);
      return dt(R, Y, n);
    });
    return F.triggerAfterRender(), k;
  }, [L, Q, t, n, F]);
  lt(() => {
    D.current && (D.current.scrollTop = 0);
  }, [E, H]), Ge(() => {
    if (!D.current || !H) return;
    const k = setTimeout(() => {
      D.current && requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!D.current) return;
          let Y = 1 / 0;
          he.forEach((ee) => {
            ee.length > 0 && (Y = Math.min(Y, ee[0].top));
          });
          let R = 0;
          if (Y !== 1 / 0)
            R = Y;
          else {
            const ee = Ye.findIndex((B) => A(B));
            ee !== -1 && (R = ee * V);
          }
          if (R > 0) {
            const ee = Math.max(0, R - V), B = D.current.scrollTop, pe = ee - B, Be = 2e3;
            let $e = null;
            const De = (qe) => {
              $e === null && ($e = qe);
              const Oe = qe - $e, Me = Oe / Be, Pe = Me < 0.5 ? 4 * Me * Me * Me : 1 - Math.pow(-2 * Me + 2, 3) / 2;
              D.current && (D.current.scrollTop = B + pe * Pe, Oe < Be ? requestAnimationFrame(De) : D.current.scrollTop = ee);
            };
            requestAnimationFrame(De);
          }
        });
      });
    }, 100);
    return () => clearTimeout(k);
  }, [E, he, H]);
  const je = /* @__PURE__ */ a("div", { className: "text-center flex flex-col items-center", children: [
    /* @__PURE__ */ e("h2", { className: "text-xl font-semibold", children: E.format("MMMM YYYY") }),
    c && /* @__PURE__ */ a("p", { className: "text-xs text-gray-500 mt-1", children: [
      "GMT",
      x.format("Z"),
      " • ",
      t
    ] }),
    /* @__PURE__ */ e("button", { onClick: me, className: "mt-1 text-sm font-medium", style: { color: "var(--calendar-primary)" }, children: "Today" })
  ] }), Re = /* @__PURE__ */ e(
    "button",
    {
      onClick: I,
      className: "px-3 py-1 rounded hover:bg-gray-200",
      children: "◀"
    }
  ), Te = /* @__PURE__ */ e(
    "button",
    {
      onClick: de,
      className: "px-3 py-1 rounded hover:bg-gray-200",
      children: "▶"
    }
  ), Se = /* @__PURE__ */ a("div", { className: "flex items-center gap-2", children: [
    Re,
    Te
  ] }), Ze = g ? g({
    goToPreviousDay: I,
    goToNextDay: de,
    goToToday: me,
    dateNode: je,
    prevNode: Re,
    nextNode: Te,
    defaultNav: Se,
    currentDate: E,
    timezone: t
  }) : null;
  return /* @__PURE__ */ a("div", { className: "flex flex-col flex-1 h-full w-full min-h-0 no-scrollbar", style: { ...ve, backgroundColor: "var(--calendar-bg)", color: "var(--calendar-text)" }, children: [
    g != null ? /* @__PURE__ */ e("div", { children: Ze }, "custom-nav-wrapper") : /* @__PURE__ */ a("div", { className: "sticky top-0 z-20 border-b px-6 py-4 flex items-center min-h-[80px]", style: { backgroundColor: "var(--calendar-bg)", borderColor: "var(--calendar-grid)" }, children: [
      h === "left" && /* @__PURE__ */ a(le, { children: [
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-start items-center", children: Se }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-center items-center", children: je }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-end items-center" })
      ] }),
      h === "center" && /* @__PURE__ */ a(le, { children: [
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-start items-center" }),
        /* @__PURE__ */ a("div", { className: "flex-1 flex justify-center items-center gap-4", children: [
          Re,
          je,
          Te
        ] }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-end items-center" })
      ] }),
      h === "right" && /* @__PURE__ */ a(le, { children: [
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-start items-center" }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-center items-center", children: je }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-end items-center gap-4", children: Se })
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "flex flex-1 flex-col min-h-0 m-5 mt-2 overflow-hidden", style: { backgroundColor: "var(--calendar-bg)" }, children: [
      /* @__PURE__ */ a("div", { className: "flex border-b", style: { borderColor: "var(--calendar-grid)" }, children: [
        /* @__PURE__ */ e("div", { className: "w-24 flex-shrink-0" }),
        /* @__PURE__ */ e("div", { className: "flex flex-1 min-w-[700px]", children: L.map((k, Y) => /* @__PURE__ */ a("div", { className: "flex-1 text-center font-medium py-3", style: { color: "var(--calendar-text)" }, children: [
          /* @__PURE__ */ e("div", { className: "text-xs uppercase tracking-wider", style: { color: "var(--calendar-secondary-text)" }, children: k.format("ddd") }),
          /* @__PURE__ */ e(
            "div",
            {
              className: `text-2xl mt-1 w-10 h-10 flex items-center justify-center mx-auto rounded-full ${k.isSame(ue, "day") ? "text-white" : ""}`,
              style: k.isSame(ue, "day") ? { backgroundColor: "var(--calendar-primary)" } : {},
              children: k.format("D")
            }
          )
        ] }, Y)) })
      ] }),
      /* @__PURE__ */ e("div", { ref: D, className: "flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative", children: /* @__PURE__ */ a("div", { className: "flex min-h-full", children: [
        /* @__PURE__ */ e("div", { className: "w-24 flex-shrink-0 z-10 sticky left-0 shadow-[1px_0_5px_rgba(0,0,0,0.02)]", style: { backgroundColor: "var(--calendar-bg)" }, children: Ye.map((k, Y) => {
          const R = A(k);
          return /* @__PURE__ */ e(
            "div",
            {
              className: "relative text-xs text-right pr-3 border-b border-dotted",
              style: {
                height: V,
                borderColor: "var(--calendar-grid)",
                color: R ? "var(--calendar-secondary-text)" : "var(--calendar-grid)",
                backgroundColor: R ? "transparent" : "var(--calendar-secondary-bg)"
              },
              children: /* @__PURE__ */ e("span", { className: "absolute top-1/2 -translate-y-1/2 right-2 px-1", style: { backgroundColor: "var(--calendar-bg)" }, children: k.format(o) })
            },
            Y
          );
        }) }),
        /* @__PURE__ */ a("div", { className: "flex flex-1 relative min-w-[700px]", style: { backgroundColor: "var(--calendar-bg)" }, children: [
          /* @__PURE__ */ e("div", { className: "absolute inset-0 pointer-events-none", children: Ye.map((k, Y) => /* @__PURE__ */ e(
            "div",
            {
              style: { height: V, borderColor: "var(--calendar-grid)" },
              className: "border-b border-dotted w-full"
            },
            `row-${Y}`
          )) }),
          L.map((k, Y) => {
            const R = he[Y], ee = k.isSame(ue, "day");
            return /* @__PURE__ */ a("div", { className: "flex-1 relative", children: [
              /* @__PURE__ */ e("div", { className: "absolute inset-0 z-0 bg-transparent cursor-pointer", onDoubleClick: () => {
                G && (se({ start: k.clone().hour(9).format(`${r || "YYYY-MM-DD"} ${o || "HH:mm"}`) }), Ce(!0));
              } }),
              ee && /* @__PURE__ */ e(
                "div",
                {
                  className: "absolute left-0 right-0 border-t-2 z-10",
                  style: {
                    borderColor: "var(--calendar-primary)",
                    top: (ue.hours() * 60 + ue.minutes()) / n * V,
                    boxShadow: "0 0 8px var(--calendar-primary-alpha40)"
                  },
                  children: /* @__PURE__ */ e("div", { className: "absolute -left-1 -top-[5px] w-2 h-2 rounded-full", style: { backgroundColor: "var(--calendar-primary)" } })
                }
              ),
              j && R.length === 0 && /* @__PURE__ */ e(
                "div",
                {
                  className: "absolute left-1 right-1 flex items-center justify-center animate-fadeIn opacity-50",
                  style: {
                    top: we.startMinutes / n * V,
                    height: (we.endMinutes - we.startMinutes) / n * V
                  },
                  children: /* @__PURE__ */ e("div", { className: "text-xs font-medium", style: { color: "var(--calendar-secondary-text)" }, children: "Clear" })
                }
              ),
              /* @__PURE__ */ e("div", { className: "absolute inset-0 z-10 pointer-events-none", children: R.map((B) => /* @__PURE__ */ a(
                "div",
                {
                  onDoubleClick: (pe) => {
                    pe.stopPropagation(), F.triggerOnEventClick(B), G && (P(B), se({
                      ...B,
                      start: i(B.start).tz(t).format(`${r || "YYYY-MM-DD"} ${o || "HH:mm"}`),
                      end: i(B.end).tz(t).format(`${r || "YYYY-MM-DD"} ${o || "HH:mm"}`)
                    }), Ce(!0));
                  },
                  ref: (pe) => {
                    pe && F.triggerOnEventRender(B, pe);
                  },
                  className: "absolute rounded-[4px] px-2 text-xs font-medium cursor-pointer shadow-sm hover:z-20 border pointer-events-auto transition-all overflow-hidden",
                  style: {
                    top: B.top,
                    height: Math.max(B.height, 20),
                    left: `${B.columnIndex / B.columnCount * 100}%`,
                    width: `calc(${100 / B.columnCount}% - 2px)`,
                    // Small margin
                    backgroundColor: "var(--calendar-event-bg)",
                    color: "var(--calendar-event-text)",
                    borderColor: "var(--calendar-grid)"
                  },
                  children: [
                    /* @__PURE__ */ e("div", { className: "truncate", children: B.title }),
                    ce && G && /* @__PURE__ */ e(
                      "button",
                      {
                        onClick: (pe) => {
                          pe.stopPropagation(), ce(B.id);
                        },
                        className: "absolute top-[2px] right-[2px] w-4 h-4 text-[10px] leading-none bg-red-500 hover:bg-red-600 rounded flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity flex-shrink-0",
                        children: "✕"
                      }
                    )
                  ]
                },
                B.id
              )) })
            ] }, k.format("YYYY-MM-DD"));
          })
        ] })
      ] }) }),
      G && /* @__PURE__ */ e(
        nt,
        {
          isOpen: X,
          onClose: O,
          editingEvent: J,
          formData: w,
          setFormData: se,
          formFields: ge,
          timezone: t,
          dateFormat: r,
          timeFormat: o,
          onAddEvent: ne,
          onEditEvent: ke,
          onDeleteEvent: ce,
          pluginManager: F,
          disableTimeInterval: ie,
          events: Q
        }
      )
    ] })
  ] });
}, Nt = ({
  timezone: t = i.tz.guess() || "UTC",
  timezoneLabelInclude: c = !1,
  dateFormat: n = "MMMM YYYY",
  timeFormat: r = "HH:mm",
  selectedDate: o,
  onDateChange: N,
  events: u,
  onEventChange: d,
  navigationPosition: m = "center",
  renderNavigation: h,
  onAddEvent: g,
  onEditEvent: j,
  onDeleteEvent: T,
  formFields: v,
  onlyCreateEditRequired: K = !0,
  plugins: ie,
  calendarTheme: ae,
  calendarThemeVariant: te
}) => {
  const [W, re] = q(() => i.tz(o || /* @__PURE__ */ new Date(), t)), G = o !== void 0 ? o : W, H = (O) => {
    N ? N(O) : re(O);
  }, [z, l] = q(() => u || []), S = u !== void 0 ? u : z, f = g || ((O) => l((I) => [...I, O])), b = j || ((O) => l((I) => I.map((de) => de.id === O.id ? O : de))), D = T || ((O) => l((I) => I.filter((de) => de.id !== O))), C = v || [
    { name: "title", label: "Event Title", type: "text", required: !0 },
    { name: "description", label: "Description", type: "textarea" },
    { name: "start", label: "Start Time", type: "datetime-local", required: !0 },
    { name: "end", label: "End Time", type: "datetime-local", required: !0 }
  ], $ = y(
    () => Ae(G, t),
    [G, t]
  ), U = y(() => ae || (te && xe[te] ? xe[te] : xe.classic_light), [ae, te]), be = y(() => ({
    "--calendar-primary": U.primaryColor,
    "--calendar-bg": U.backgroundColor,
    "--calendar-secondary-bg": U.secondaryBackgroundColor,
    "--calendar-grid": U.gridColor,
    "--calendar-text": U.textColor,
    "--calendar-secondary-text": U.secondaryTextColor,
    "--calendar-accent": U.accentColor,
    "--calendar-event-bg": U.eventDefaultColor,
    "--calendar-event-text": U.eventDefaultTextColor
  }), [U]), fe = y(() => S ?? [], [S]), oe = y(() => new ot(ie, {
    timezone: t,
    slotInterval: 30,
    // Placeholder for MonthView
    events: fe,
    onEventChange: d,
    onAddEvent: f,
    onEditEvent: b,
    onDeleteEvent: D
  }), [ie, t, fe, d, f, b, D]), [Z, ne] = q(!1), [ke, ce] = q(null), [ge, _] = q({}), ve = y(() => $.clone().startOf("month"), [$]), Q = y(() => $.clone().endOf("month"), [$]), F = y(() => ve.clone().startOf("week"), [ve]), x = y(() => Q.clone().endOf("week"), [Q]), E = y(() => {
    const O = [];
    let I = F.clone();
    for (; I.isBefore(x) || I.isSame(x, "day"); )
      O.push(I.clone()), I.add(1, "day");
    return O;
  }, [F, x]), L = () => H($.clone().subtract(1, "month")), ue = () => H($.clone().add(1, "month")), X = () => H(i.utc().tz(t)), Ce = () => {
    ne(!1), ce(null), _({});
  }, J = /* @__PURE__ */ a("div", { className: "text-center flex flex-col items-center", children: [
    /* @__PURE__ */ e("h2", { className: "text-xl font-semibold", children: $.format(n) }),
    c && /* @__PURE__ */ a("p", { className: "text-xs mt-1", style: { color: "var(--calendar-secondary-text)" }, children: [
      "GMT",
      $.format("Z"),
      " • ",
      t
    ] }),
    /* @__PURE__ */ e("button", { onClick: X, className: "mt-1 text-sm font-medium", style: { color: "var(--calendar-primary)" }, children: "Today" })
  ] }), P = /* @__PURE__ */ e("button", { onClick: L, className: "px-3 py-1 rounded hover:opacity-70 transition-opacity", style: { color: "var(--calendar-text)" }, children: "◀" }), w = /* @__PURE__ */ e("button", { onClick: ue, className: "px-3 py-1 rounded hover:opacity-70 transition-opacity", style: { color: "var(--calendar-text)" }, children: "▶" }), se = /* @__PURE__ */ a("div", { className: "flex items-center gap-2", children: [
    P,
    w
  ] }), we = h ? h({
    goToPreviousDay: L,
    goToNextDay: ue,
    goToToday: X,
    dateNode: J,
    prevNode: P,
    nextNode: w,
    defaultNav: se,
    currentDate: $,
    timezone: t
  }) : null;
  return /* @__PURE__ */ a("div", { className: "flex flex-col flex-1 h-full w-full min-h-0 no-scrollbar", style: { ...be, backgroundColor: "var(--calendar-bg)", color: "var(--calendar-text)" }, children: [
    h != null ? /* @__PURE__ */ e("div", { children: we }, "custom-nav-wrapper") : /* @__PURE__ */ a("div", { className: "sticky top-0 z-20 border-b px-6 py-4 flex items-center min-h-[80px]", style: { backgroundColor: "var(--calendar-bg)", borderColor: "var(--calendar-grid)" }, children: [
      m === "left" && /* @__PURE__ */ a(le, { children: [
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-start items-center", children: se }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-center items-center", children: J }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-end items-center" })
      ] }),
      m === "center" && /* @__PURE__ */ a(le, { children: [
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-start items-center" }),
        /* @__PURE__ */ a("div", { className: "flex-1 flex justify-center items-center gap-4", children: [
          P,
          J,
          w
        ] }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-end items-center" })
      ] }),
      m === "right" && /* @__PURE__ */ a(le, { children: [
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-start items-center" }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-center items-center", children: J }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-end items-center gap-4", children: se })
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "grid grid-cols-7 border-b", style: { borderColor: "var(--calendar-grid)" }, children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((O) => /* @__PURE__ */ e("div", { className: "py-2 text-center text-xs font-semibold uppercase tracking-wider", style: { color: "var(--calendar-secondary-text)" }, children: O }, O)) }),
    /* @__PURE__ */ e("div", { className: "flex-1 overflow-y-auto no-scrollbar", children: /* @__PURE__ */ e("div", { className: "grid grid-cols-7 min-h-full", children: E.map((O, I) => {
      const de = O.isSame($, "month"), me = O.isSame(i().tz(t), "day"), Ye = rt(fe, O, t);
      return /* @__PURE__ */ a(
        "div",
        {
          className: "min-h-[120px] border-b border-r p-1 flex flex-col gap-1 transition-colors hover:bg-opacity-10",
          style: {
            borderColor: "var(--calendar-grid)",
            backgroundColor: de ? "transparent" : "var(--calendar-secondary-bg)",
            opacity: de ? 1 : 0.5
          },
          onDoubleClick: () => {
            if (K) {
              const A = O.clone().hour(9).minute(0), he = A.clone().add(1, "hour");
              _({
                start: A.format(`${n || "YYYY-MM-DD"}T${r || "HH:mm"}`),
                end: he.format(`${n || "YYYY-MM-DD"}T${r || "HH:mm"}`)
              }), ne(!0);
            }
          },
          children: [
            /* @__PURE__ */ e("div", { className: "flex justify-end pr-1", children: /* @__PURE__ */ e(
              "span",
              {
                className: `text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${me ? "text-white" : ""}`,
                style: me ? { backgroundColor: "var(--calendar-primary)" } : { color: de ? "var(--calendar-text)" : "var(--calendar-secondary-text)" },
                children: O.date()
              }
            ) }),
            /* @__PURE__ */ a("div", { className: "flex flex-col gap-1 flex-1 overflow-hidden", children: [
              Ye.slice(0, 4).map((A) => /* @__PURE__ */ e(
                "div",
                {
                  onClick: (he) => {
                    he.stopPropagation(), oe.triggerOnEventClick(A), K && (ce(A), _({
                      ...A,
                      start: i(A.start).tz(t).format(`${n || "YYYY-MM-DD"}T${r || "HH:mm"}`),
                      end: i(A.end).tz(t).format(`${n || "YYYY-MM-DD"}T${r || "HH:mm"}`)
                    }), ne(!0));
                  },
                  className: "px-1.5 py-0.5 rounded text-[10px] truncate cursor-pointer transition-transform hover:scale-[1.02]",
                  style: {
                    backgroundColor: "var(--calendar-event-bg)",
                    color: "var(--calendar-event-text)",
                    border: A.hasConflict ? "1px solid red" : "none"
                  },
                  title: A.title,
                  children: A.title
                },
                A.id
              )),
              Ye.length > 4 && /* @__PURE__ */ a("div", { className: "text-[9px] px-1 font-bold", style: { color: "var(--calendar-secondary-text)" }, children: [
                "+",
                Ye.length - 4,
                " more"
              ] })
            ] })
          ]
        },
        I
      );
    }) }) }),
    K && /* @__PURE__ */ e(
      nt,
      {
        isOpen: Z,
        onClose: Ce,
        editingEvent: ke,
        formData: ge,
        setFormData: _,
        formFields: C,
        timezone: t,
        dateFormat: n,
        timeFormat: r,
        onAddEvent: f,
        onEditEvent: b,
        onDeleteEvent: D,
        pluginManager: oe,
        events: S
      }
    )
  ] });
}, kt = (t) => {
  const {
    timezone: c = i.tz.guess() || "UTC",
    selectedDate: n,
    onDateChange: r,
    events: o,
    onAddEvent: N,
    onEditEvent: u,
    onDeleteEvent: d,
    calendarTheme: m,
    calendarThemeVariant: h,
    navigationPosition: g = "center",
    renderNavigation: j,
    dateFormat: T = "MMMM YYYY",
    timeFormat: v = "HH:mm",
    showTimeSlots: K = !1
  } = t, [ie, ae] = q(() => i.tz(n || /* @__PURE__ */ new Date(), c)), te = n !== void 0 ? n : ie, W = y(
    () => Ae(te, c),
    [te, c]
  ), [re, G] = q(() => W.clone().startOf("month")), H = (x) => {
    r ? r(x) : ae(x), G(x.clone().startOf("month"));
  }, [z, l] = q(() => o || []), S = o !== void 0 ? o : z, f = N || ((x) => l((E) => [...E, x])), b = u || ((x) => l((E) => E.map((L) => L.id === x.id ? x : L))), D = d || ((x) => l((E) => E.filter((L) => L.id !== x))), C = y(() => m || (h && xe[h] ? xe[h] : xe.classic_light), [m, h]), $ = y(() => ({
    "--calendar-primary": C.primaryColor,
    "--calendar-bg": C.backgroundColor,
    "--calendar-secondary-bg": C.secondaryBackgroundColor,
    "--calendar-grid": C.gridColor,
    "--calendar-text": C.textColor,
    "--calendar-secondary-text": C.secondaryTextColor,
    "--calendar-accent": C.accentColor,
    "--calendar-event-bg": C.eventDefaultColor,
    "--calendar-event-text": C.eventDefaultTextColor
  }), [C]), U = re.clone().startOf("month"), be = re.clone().endOf("month"), fe = U.clone().startOf("week"), oe = be.clone().endOf("week"), Z = y(() => {
    const x = [];
    let E = fe.clone();
    for (; E.isBefore(oe) || E.isSame(oe, "day"); )
      x.push(E.clone()), E.add(1, "day");
    return x;
  }, [fe, oe]), ne = () => G((x) => x.clone().subtract(1, "month")), ke = () => G((x) => x.clone().add(1, "month")), ce = () => H(i.utc().tz(c)), ge = /* @__PURE__ */ a("div", { className: "text-center flex flex-col items-center", children: [
    /* @__PURE__ */ e("h2", { className: "text-xl font-semibold", style: { color: "var(--calendar-text)" }, children: W.format(T) }),
    /* @__PURE__ */ e("button", { onClick: ce, className: "mt-1 text-sm font-medium", style: { color: "var(--calendar-primary)" }, children: "Today" })
  ] }), _ = /* @__PURE__ */ e("button", { onClick: () => H(W.clone().subtract(1, "month")), className: "px-3 py-1 rounded hover:bg-gray-100 transition-colors", style: { color: "var(--calendar-text)" }, children: "◀" }), ve = /* @__PURE__ */ e("button", { onClick: () => H(W.clone().add(1, "month")), className: "px-3 py-1 rounded hover:bg-gray-100 transition-colors", style: { color: "var(--calendar-text)" }, children: "▶" }), Q = /* @__PURE__ */ a("div", { className: "flex items-center gap-2", children: [
    _,
    ve
  ] }), F = j ? j({
    goToPreviousDay: () => H(W.clone().subtract(1, "month")),
    goToNextDay: () => H(W.clone().add(1, "month")),
    goToToday: ce,
    dateNode: ge,
    prevNode: _,
    nextNode: ve,
    defaultNav: Q,
    currentDate: W,
    timezone: c
  }) : null;
  return /* @__PURE__ */ a("div", { className: "flex flex-col h-full w-full no-scrollbar", style: { ...$, backgroundColor: "var(--calendar-bg)" }, children: [
    j ? F : /* @__PURE__ */ a("div", { className: "sticky top-0 z-20 border-b px-6 py-4 flex items-center min-h-[80px]", style: { backgroundColor: "var(--calendar-bg)", borderColor: "var(--calendar-grid)" }, children: [
      g === "left" && /* @__PURE__ */ a(le, { children: [
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-start items-center", children: Q }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-center items-center", children: ge }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-end items-center" })
      ] }),
      g === "center" && /* @__PURE__ */ a(le, { children: [
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-start items-center" }),
        /* @__PURE__ */ a("div", { className: "flex-1 flex justify-center items-center gap-4", children: [
          _,
          ge,
          ve
        ] }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-end items-center" })
      ] }),
      g === "right" && /* @__PURE__ */ a(le, { children: [
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-start items-center" }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-center items-center", children: ge }),
        /* @__PURE__ */ e("div", { className: "flex-1 flex justify-end items-center gap-4", children: Q })
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "flex flex-col md:flex-row flex-1 overflow-hidden border shadow-lg rounded-xl bg-white no-scrollbar m-4 mt-2", style: { borderColor: "var(--calendar-grid)" }, children: [
      /* @__PURE__ */ a(
        "div",
        {
          className: "w-full md:w-80 flex-shrink-0 border-r flex flex-col p-4 bg-white",
          style: { borderColor: "var(--calendar-grid)", backgroundColor: "var(--calendar-secondary-bg)" },
          children: [
            /* @__PURE__ */ a("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  onClick: ne,
                  className: "p-1 hover:bg-gray-100 rounded transition-colors",
                  style: { color: "var(--calendar-text)" },
                  children: "◀"
                }
              ),
              /* @__PURE__ */ e("div", { className: "font-semibold text-sm", style: { color: "var(--calendar-text)" }, children: re.format("MMMM YYYY") }),
              /* @__PURE__ */ e(
                "button",
                {
                  onClick: ke,
                  className: "p-1 hover:bg-gray-100 rounded transition-colors",
                  style: { color: "var(--calendar-text)" },
                  children: "▶"
                }
              )
            ] }),
            /* @__PURE__ */ e("div", { className: "grid grid-cols-7 mb-2", children: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((x) => /* @__PURE__ */ e("div", { className: "text-center text-[10px] font-bold uppercase", style: { color: "var(--calendar-secondary-text)" }, children: x }, x)) }),
            /* @__PURE__ */ e("div", { className: "grid grid-cols-7 gap-1", children: Z.map((x, E) => {
              const L = x.isSame(re, "month"), ue = x.isSame(W, "day"), X = x.isSame(i().tz(c), "day");
              let Ce = "hover:bg-gray-200", J = { color: "var(--calendar-text)" }, P = {};
              return L || (J = { color: "var(--calendar-secondary-text)", opacity: 0.5 }), ue ? (Ce = "", P = { backgroundColor: "var(--calendar-primary)", color: "white" }, J = { color: "white" }) : X && (P = { border: "2px solid var(--calendar-primary)", fontWeight: "bold" }, J = { color: "var(--calendar-primary)" }), /* @__PURE__ */ e(
                "button",
                {
                  onClick: () => H(x),
                  className: `h-8 w-8 flex items-center justify-center rounded-full text-xs transition-colors ${Ce}`,
                  style: { ...J, ...P },
                  children: x.date()
                },
                E
              );
            }) })
          ]
        }
      ),
      /* @__PURE__ */ e("div", { className: "flex-1 min-w-0 h-full overflow-hidden bg-white", children: /* @__PURE__ */ e(
        gt,
        {
          ...t,
          selectedDate: te,
          onDateChange: H,
          events: S,
          showTimeSlots: K,
          onAddEvent: f,
          onEditEvent: b,
          onDeleteEvent: D,
          renderNavigation: () => /* @__PURE__ */ e(le, {}),
          showTodayBelow: !1,
          dateFormat: T,
          timeFormat: v
        }
      ) })
    ] })
  ] });
};
export {
  kt as Calendar,
  gt as DayView,
  Nt as MonthView,
  xe as PREDEFINED_CALENDAR_THEMES,
  xt as PREDEFINED_CONFLICT_TEMPLATES,
  V as SLOT_HEIGHT,
  Ct as WeekView,
  dt as calculateLayoutEvents,
  tt as checkIsSlotEnabled,
  vt as detectConflicts,
  ct as generateTimeSlots,
  rt as getDayEvents,
  st as getWorkingHoursRange,
  Ae as normalizeDate
};
