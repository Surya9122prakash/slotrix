import tr, { useState as ee, useRef as Fe, useMemo as y, useEffect as Te, useLayoutEffect as Ze } from "react";
import C from "moment-timezone";
var Ye = { exports: {} }, we = {};
var ze;
function or() {
  if (ze) return we;
  ze = 1;
  var o = /* @__PURE__ */ Symbol.for("react.transitional.element"), a = /* @__PURE__ */ Symbol.for("react.fragment");
  function s(t, n, f) {
    var x = null;
    if (f !== void 0 && (x = "" + f), n.key !== void 0 && (x = "" + n.key), "key" in n) {
      f = {};
      for (var h in n)
        h !== "key" && (f[h] = n[h]);
    } else f = n;
    return n = f.ref, {
      $$typeof: o,
      type: t,
      key: x,
      ref: n !== void 0 ? n : null,
      props: f
    };
  }
  return we.Fragment = a, we.jsx = s, we.jsxs = s, we;
}
var Ee = {};
var Je;
function sr() {
  return Je || (Je = 1, process.env.NODE_ENV !== "production" && (function() {
    function o(r) {
      if (r == null) return null;
      if (typeof r == "function")
        return r.$$typeof === L ? null : r.displayName || r.name || null;
      if (typeof r == "string") return r;
      switch (r) {
        case T:
          return "Fragment";
        case B:
          return "Profiler";
        case N:
          return "StrictMode";
        case ae:
          return "Suspense";
        case te:
          return "SuspenseList";
        case H:
          return "Activity";
      }
      if (typeof r == "object")
        switch (typeof r.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), r.$$typeof) {
          case l:
            return "Portal";
          case re:
            return r.displayName || "Context";
          case S:
            return (r._context.displayName || "Context") + ".Consumer";
          case U:
            var c = r.render;
            return r = r.displayName, r || (r = c.displayName || c.name || "", r = r !== "" ? "ForwardRef(" + r + ")" : "ForwardRef"), r;
          case z:
            return c = r.displayName || null, c !== null ? c : o(r.type) || "Memo";
          case q:
            c = r._payload, r = r._init;
            try {
              return o(r(c));
            } catch {
            }
        }
      return null;
    }
    function a(r) {
      return "" + r;
    }
    function s(r) {
      try {
        a(r);
        var c = !1;
      } catch {
        c = !0;
      }
      if (c) {
        c = console;
        var d = c.error, g = typeof Symbol == "function" && Symbol.toStringTag && r[Symbol.toStringTag] || r.constructor.name || "Object";
        return d.call(
          c,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          g
        ), a(r);
      }
    }
    function t(r) {
      if (r === T) return "<>";
      if (typeof r == "object" && r !== null && r.$$typeof === q)
        return "<...>";
      try {
        var c = o(r);
        return c ? "<" + c + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function n() {
      var r = Z.A;
      return r === null ? null : r.getOwner();
    }
    function f() {
      return Error("react-stack-top-frame");
    }
    function x(r) {
      if (K.call(r, "key")) {
        var c = Object.getOwnPropertyDescriptor(r, "key").get;
        if (c && c.isReactWarning) return !1;
      }
      return r.key !== void 0;
    }
    function h(r, c) {
      function d() {
        M || (M = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          c
        ));
      }
      d.isReactWarning = !0, Object.defineProperty(r, "key", {
        get: d,
        configurable: !0
      });
    }
    function p() {
      var r = o(this.type);
      return R[r] || (R[r] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), r = this.props.ref, r !== void 0 ? r : null;
    }
    function v(r, c, d, g, J, Q) {
      var m = d.ref;
      return r = {
        $$typeof: i,
        type: r,
        key: c,
        props: d,
        _owner: g
      }, (m !== void 0 ? m : null) !== null ? Object.defineProperty(r, "ref", {
        enumerable: !1,
        get: p
      }) : Object.defineProperty(r, "ref", { enumerable: !1, value: null }), r._store = {}, Object.defineProperty(r._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(r, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(r, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: J
      }), Object.defineProperty(r, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: Q
      }), Object.freeze && (Object.freeze(r.props), Object.freeze(r)), r;
    }
    function j(r, c, d, g, J, Q) {
      var m = c.children;
      if (m !== void 0)
        if (g)
          if ($(m)) {
            for (g = 0; g < m.length; g++)
              u(m[g]);
            Object.freeze && Object.freeze(m);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else u(m);
      if (K.call(c, "key")) {
        m = o(r);
        var D = Object.keys(c).filter(function(le) {
          return le !== "key";
        });
        g = 0 < D.length ? "{key: someKey, " + D.join(": ..., ") + ": ...}" : "{key: someKey}", oe[m + g] || (D = 0 < D.length ? "{" + D.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          g,
          m,
          D,
          m
        ), oe[m + g] = !0);
      }
      if (m = null, d !== void 0 && (s(d), m = "" + d), x(c) && (s(c.key), m = "" + c.key), "key" in c) {
        d = {};
        for (var X in c)
          X !== "key" && (d[X] = c[X]);
      } else d = c;
      return m && h(
        d,
        typeof r == "function" ? r.displayName || r.name || "Unknown" : r
      ), v(
        r,
        m,
        d,
        n(),
        J,
        Q
      );
    }
    function u(r) {
      Y(r) ? r._store && (r._store.validated = 1) : typeof r == "object" && r !== null && r.$$typeof === q && (r._payload.status === "fulfilled" ? Y(r._payload.value) && r._payload.value._store && (r._payload.value._store.validated = 1) : r._store && (r._store.validated = 1));
    }
    function Y(r) {
      return typeof r == "object" && r !== null && r.$$typeof === i;
    }
    var E = tr, i = /* @__PURE__ */ Symbol.for("react.transitional.element"), l = /* @__PURE__ */ Symbol.for("react.portal"), T = /* @__PURE__ */ Symbol.for("react.fragment"), N = /* @__PURE__ */ Symbol.for("react.strict_mode"), B = /* @__PURE__ */ Symbol.for("react.profiler"), S = /* @__PURE__ */ Symbol.for("react.consumer"), re = /* @__PURE__ */ Symbol.for("react.context"), U = /* @__PURE__ */ Symbol.for("react.forward_ref"), ae = /* @__PURE__ */ Symbol.for("react.suspense"), te = /* @__PURE__ */ Symbol.for("react.suspense_list"), z = /* @__PURE__ */ Symbol.for("react.memo"), q = /* @__PURE__ */ Symbol.for("react.lazy"), H = /* @__PURE__ */ Symbol.for("react.activity"), L = /* @__PURE__ */ Symbol.for("react.client.reference"), Z = E.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, K = Object.prototype.hasOwnProperty, $ = Array.isArray, W = console.createTask ? console.createTask : function() {
      return null;
    };
    E = {
      react_stack_bottom_frame: function(r) {
        return r();
      }
    };
    var M, R = {}, V = E.react_stack_bottom_frame.bind(
      E,
      f
    )(), A = W(t(f)), oe = {};
    Ee.Fragment = T, Ee.jsx = function(r, c, d) {
      var g = 1e4 > Z.recentlyCreatedOwnerStacks++;
      return j(
        r,
        c,
        d,
        !1,
        g ? Error("react-stack-top-frame") : V,
        g ? W(t(r)) : A
      );
    }, Ee.jsxs = function(r, c, d) {
      var g = 1e4 > Z.recentlyCreatedOwnerStacks++;
      return j(
        r,
        c,
        d,
        !0,
        g ? Error("react-stack-top-frame") : V,
        g ? W(t(r)) : A
      );
    };
  })()), Ee;
}
var Xe;
function nr() {
  return Xe || (Xe = 1, process.env.NODE_ENV === "production" ? Ye.exports = or() : Ye.exports = sr()), Ye.exports;
}
var e = nr();
const I = 64, Se = (o, a) => C.utc(o).tz(a), Ve = (o) => {
  if (o?.length) {
    const a = o[0].start, s = o[o.length - 1].end, [t, n] = a.split(":").map(Number), [f, x] = s.split(":").map(Number);
    return {
      startMinutes: t * 60 + n,
      endMinutes: f * 60 + x
    };
  }
  return {
    startMinutes: 0,
    endMinutes: 1440
  };
}, Qe = (o, a) => {
  const s = [], t = o.clone().startOf("day");
  for (let n = 0; n < 1440; n += a)
    s.push(t.clone().add(n, "minutes"));
  return s;
}, Ke = (o, a, s, t, n) => {
  const f = o.format("HH:mm");
  if (a?.length)
    return a.includes(f);
  if (s?.includes(f))
    return !1;
  const x = (h, p = !1) => {
    if (!h?.length)
      return !!p;
    const v = o.hours() * 60 + o.minutes(), j = h.some((u) => {
      const [Y, E] = u.start.split(":").map(Number), [i, l] = u.end.split(":").map(Number);
      return v >= Y * 60 + E && v < i * 60 + l;
    });
    return p ? !j : j;
  };
  return t?.length ? x(t) : n?.length ? x(n, !0) : !0;
}, Pe = (o, a, s) => {
  const t = [];
  return o.forEach((n) => {
    const f = Se(n.start, s), x = Se(n.end, s);
    if (n.allDay) {
      f.isSame(a, "day") && t.push({ ...n, start: f, end: x, allDay: !0 });
      return;
    }
    let h = f.clone().startOf("day");
    for (; h.isBefore(x); ) {
      const p = h.clone(), v = h.clone().endOf("day"), j = C.max(f, p), u = C.min(x, v);
      j.isSame(a, "day") && t.push({
        ...n,
        start: j,
        end: u
      }), h.add(1, "day");
    }
  }), t;
}, er = (o, a, s) => {
  const t = [...o].sort((x, h) => x.start.valueOf() - h.start.valueOf()), n = [];
  t.forEach((x) => {
    let h = !1;
    for (const p of n) {
      const v = p[p.length - 1];
      if (x.start.isSameOrAfter(v.end)) {
        p.push(x), h = !0;
        break;
      }
    }
    h || n.push([x]);
  });
  const f = n.length;
  return t.map((x) => {
    let h = 0;
    n.forEach((Y, E) => {
      Y.includes(x) && (h = E);
    });
    const p = x.start, v = x.end, j = p.diff(a.clone().startOf("day"), "minutes") / s * I, u = v.diff(p, "minutes") / s * I;
    return {
      ...x,
      columnIndex: h,
      columnCount: f,
      top: j,
      height: u
    };
  });
}, cr = (o, a) => {
  const s = [], t = [...o].sort((n, f) => C(n.start).tz(a).valueOf() - C(f.start).tz(a).valueOf());
  for (let n = 0; n < t.length; n++)
    for (let f = n + 1; f < t.length; f++) {
      const x = C(t[n].start).tz(a), h = C(t[n].end).tz(a), p = C(t[f].start).tz(a), v = C(t[f].end).tz(a);
      if (x.isBefore(v) && h.isAfter(p)) {
        const j = C.max(x, p), u = C.min(h, v);
        s.push({
          eventId: t[n].id,
          withId: t[f].id,
          eventTitle: t[n].title,
          withTitle: t[f].title,
          overlapStart: j.toISOString(),
          overlapEnd: u.toISOString()
        }), s.push({
          eventId: t[f].id,
          withId: t[n].id,
          eventTitle: t[f].title,
          withTitle: t[n].title,
          overlapStart: j.toISOString(),
          overlapEnd: u.toISOString()
        });
      }
    }
  return s;
};
class He {
  plugins = [];
  context;
  constructor(a = [], s) {
    this.plugins = a, this.context = s;
  }
  setContext(a) {
    this.context = a;
  }
  init() {
    this.plugins.forEach((a) => {
      a.init && a.init(this.context);
    });
  }
  triggerBeforeRender() {
    this.plugins.forEach((a) => {
      a.hooks?.beforeRender && a.hooks.beforeRender(this.context);
    });
  }
  triggerOnEventRender(a, s) {
    this.plugins.forEach((t) => {
      t.hooks?.onEventRender && t.hooks.onEventRender(a, s);
    });
  }
  triggerOnEventClick(a) {
    this.plugins.forEach((s) => {
      s.hooks?.onEventClick && s.hooks.onEventClick(a);
    });
  }
  triggerAfterRender() {
    this.plugins.forEach((a) => {
      a.hooks?.afterRender && a.hooks.afterRender(this.context);
    });
  }
  triggerValidateSave(a) {
    const s = [];
    return this.plugins.forEach((t) => {
      if (t.hooks?.validateSave) {
        const n = t.hooks.validateSave(a, this.context);
        n && s.push(n);
      }
    }), s;
  }
}
const Ie = ({ isOpen: o, onClose: a, editingEvent: s, formData: t, setFormData: n, formFields: f, timezone: x, onAddEvent: h, onEditEvent: p, onDeleteEvent: v, pluginManager: j, conflictTemplate: u }) => {
  const [Y, E] = ee([]);
  return o ? e.jsxs("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50", children: [e.jsxs("div", { className: "bg-white rounded-xl p-6 w-96 shadow-xl max-h-[90vh] overflow-y-auto", children: [e.jsx("h3", { className: "text-lg font-semibold mb-4", children: s ? "Edit Event" : "Create Event" }), f?.map((i) => e.jsxs("div", { className: "mb-4", children: [e.jsx("label", { className: "block text-sm mb-1", children: i.label }), (() => {
    switch (i.type) {
      case "textarea":
        return e.jsx("textarea", { required: i.required, value: t[i.name] || "", onChange: (l) => n({ ...t, [i.name]: l.target.value }), className: "w-full border rounded px-3 py-2", rows: 3 });
      case "dropdown":
      case "singleSelect":
        return e.jsxs("select", { required: i.required, value: t[i.name] || "", onChange: (l) => n({ ...t, [i.name]: l.target.value }), className: "w-full border rounded px-3 py-2", children: [e.jsx("option", { value: "", children: "Select..." }), i.options?.map((l) => e.jsx("option", { value: l.value, children: l.label }, l.value))] });
      case "multiselect":
        return e.jsx("select", { multiple: !0, required: i.required, value: t[i.name] || [], onChange: (l) => {
          const T = Array.from(l.target.selectedOptions, (N) => N.value);
          n({ ...t, [i.name]: T });
        }, className: "w-full border rounded px-3 py-2 h-24", children: i.options?.map((l) => e.jsx("option", { value: l.value, children: l.label }, l.value)) });
      case "radio":
        return e.jsx("div", { className: "flex gap-4 mt-1", children: i.options?.map((l) => e.jsxs("label", { className: "flex items-center gap-1 cursor-pointer", children: [e.jsx("input", { type: "radio", name: i.name, value: l.value, checked: t[i.name] === l.value, onChange: (T) => n({ ...t, [i.name]: T.target.value }) }), l.label] }, l.value)) });
      case "boolean":
        return e.jsx("input", { type: "checkbox", checked: !!t[i.name], onChange: (l) => n({ ...t, [i.name]: l.target.checked }), className: "w-5 h-5 mt-1 cursor-pointer" });
      case "attachment":
        return e.jsx("input", { type: "file", required: i.required, onChange: (l) => {
          l.target.files && l.target.files.length > 0 && n({ ...t, [i.name]: l.target.files[0].name });
        }, className: "w-full border rounded px-3 py-2" });
      case "colorPicker":
        return e.jsx("input", { type: "color", required: i.required, value: t[i.name] || "#000000", onChange: (l) => n({ ...t, [i.name]: l.target.value }), className: "w-16 h-10 p-1 border rounded cursor-pointer" });
      case "year":
        return e.jsx("input", { type: "number", required: i.required, placeholder: "YYYY", value: t[i.name] || "", onChange: (l) => n({ ...t, [i.name]: l.target.value }), className: "w-full border rounded px-3 py-2" });
      case "day":
        return e.jsx("input", { type: "number", required: i.required, min: "1", max: "31", placeholder: "DD", value: t[i.name] || "", onChange: (l) => n({ ...t, [i.name]: l.target.value }), className: "w-full border rounded px-3 py-2" });
      default:
        return e.jsx("input", { type: i.type, required: i.required, value: t[i.name] || "", onChange: (l) => n({ ...t, [i.name]: l.target.value }), className: "w-full border rounded px-3 py-2" });
    }
  })()] }, i.name)), e.jsxs("div", { className: "flex justify-between mt-4", children: [s && v && e.jsx("button", { onClick: () => {
    v(s.id), a();
  }, className: "text-red-600 text-sm", children: "Delete" }), e.jsxs("div", { className: "flex gap-2 ml-auto", children: [e.jsx("button", { onClick: a, className: "px-3 py-1 border rounded", children: "Cancel" }), e.jsx("button", { onClick: () => {
    const i = (N) => N ? N.includes("T") && (N.includes("Z") || N.split(":").length > 2) ? C(N).toISOString() : C.tz(N, "YYYY-MM-DDTHH:mm", x).toISOString() : C().utc().toISOString(), l = {
      ...t,
      start: t.start ? i(t.start) : t.start,
      end: t.end ? i(t.end) : t.end
    }, T = j.triggerValidateSave(l);
    if (T.length > 0) {
      E(T);
      return;
    }
    s ? p?.({
      ...s,
      ...l
    }) : h?.({
      id: Date.now().toString(),
      ...l
    }), a();
  }, className: "px-4 py-1 bg-blue-600 text-white rounded", children: "Save" })] })] })] }), Y.length > 0 && e.jsx("div", { className: "fixed inset-0 bg-black/60 flex items-center justify-center z-[60] animate-fadeIn", children: e.jsxs("div", { className: "bg-white rounded-2xl p-8 w-[450px] shadow-2xl border transform animate-scaleIn", style: {
    borderColor: u?.theme?.borderColor || "#fee2e2",
    backgroundColor: u?.theme?.backgroundColor || "#fff"
  }, children: [u?.renderHeader ? u.renderHeader(u.title || "Conflict Detected", u.theme || { primaryColor: "#dc2626", secondaryColor: "#ef4444", backgroundColor: "#fff", textColor: "#1f2937", borderColor: "#fee2e2" }) : e.jsxs("div", { className: "flex items-center gap-4 mb-6", style: { color: u?.theme?.primaryColor || "#dc2626" }, children: [e.jsx("div", { className: "w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0", style: { backgroundColor: u?.theme?.secondaryColor + "10" || "#fef2f2" }, children: u?.theme?.icon || e.jsx("span", { className: "text-2xl", children: "⚠️" }) }), e.jsxs("div", { children: [e.jsx("h4", { className: "text-xl font-bold", children: u?.title || "Conflict Detected" }), e.jsx("p", { className: "text-sm opacity-70", children: u?.description || "Overlapping schedule found" })] })] }), e.jsx("div", { className: "bg-gray-50 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto border border-gray-100", style: { backgroundColor: u?.theme?.backgroundColor === "#fff" ? "#f9fafb" : u?.theme?.backgroundColor }, children: u?.renderDetails ? u.renderDetails(Y) : Y.map((i, l) => e.jsx("div", { className: "mb-3 last:mb-0", children: e.jsx("div", { className: "text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed", style: { color: u?.theme?.textColor || "#1f2937" }, children: i }) }, l)) }), u?.renderFooter ? u.renderFooter(() => E([]), u.theme || { primaryColor: "#dc2626", secondaryColor: "#ef4444", backgroundColor: "#fff", textColor: "#1f2937", borderColor: "#fee2e2" }) : e.jsx("div", { className: "flex gap-3", children: e.jsx("button", { onClick: () => E([]), className: "flex-1 px-6 py-3 text-white font-semibold rounded-xl transition-all shadow-lg", style: {
    backgroundColor: u?.theme?.primaryColor || "#dc2626",
    boxShadow: `0 10px 15px -3px ${u?.theme?.primaryColor}40` || "0 10px 15px -3px rgba(220, 38, 38, 0.4)"
  }, children: u?.buttonText || "I'll Fix It" }) })] }) })] }) : null;
}, Be = {
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
}, ie = {
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
}, ir = ({ timezone: o, timezoneLabelInclude: a = !1, slotInterval: s, dateFormat: t, timeFormat: n, selectedDate: f, onDateChange: x, events: h, onEventChange: p, navigationPosition: v = "center", showTodayBelow: j = !0, renderNavigation: u, showEmptyState: Y = !0, enabledTimeSlots: E, disabledTimeSlots: i, enabledTimeInterval: l, disableTimeInterval: T, emptyStateContent: N, emptyStateContentPopup: B, futureDaysOnly: S, pastDaysOnly: re, currentDayOnly: U, navigateToFirstEvent: ae, onAddEvent: te, onEditEvent: z, onDeleteEvent: q, formFields: H, onlyCreateEditRequired: L, plugins: Z, conflictTemplate: K, conflictThemeVariant: $, calendarTheme: W, calendarThemeVariant: M }) => {
  const R = Fe(null), V = Fe(null), A = y(() => W || (M && ie[M] ? ie[M] : ie.classic_light), [W, M]), oe = y(() => ({
    "--calendar-primary": A.primaryColor,
    "--calendar-bg": A.backgroundColor,
    "--calendar-secondary-bg": A.secondaryBackgroundColor,
    "--calendar-grid": A.gridColor,
    "--calendar-text": A.textColor,
    "--calendar-secondary-text": A.secondaryTextColor,
    "--calendar-accent": A.accentColor,
    "--calendar-event-bg": A.eventDefaultColor,
    "--calendar-event-text": A.eventDefaultTextColor
  }), [A]), r = y(() => h ?? [], [h]), c = y(() => new He(Z, {
    timezone: o,
    slotInterval: s,
    events: r,
    onEventChange: p,
    onAddEvent: te,
    onEditEvent: z,
    onDeleteEvent: q
  }), [Z, o, s, r, p, te, z, q]);
  Te(() => {
    c.init();
  }, [c]);
  const d = y(() => Se(f, o), [f, o]), g = y(() => C.utc().tz(o), [o]), J = d.isSame(g, "day"), [Q, m] = ee(!1), [D, X] = ee(null), [le, se] = ee({}), _ = S && re, xe = !_ && S && d.isBefore(C().tz(o), "day") || U && d.isBefore(C().tz(o), "day"), _e = !_ && re && d.isAfter(C().tz(o), "day") || U && d.isAfter(C().tz(o), "day"), Re = xe || _e || U && !J, ge = y(() => Ve(l), [l]), me = () => {
    m(!1), X(null), se({});
  }, w = y(() => Pe(r, d, o), [r, d, o]).filter((b) => !b.allDay), F = y(() => {
    c.triggerBeforeRender();
    const b = er(w, d, s);
    return c.triggerAfterRender(), b;
  }, [w, d, s, c]), G = !U && (_ || !(S && d.isSameOrBefore(g, "day"))), k = !U && (_ || !(re && d.isSameOrAfter(g, "day"))), ne = () => {
    G && x(d.clone().subtract(1, "day"));
  }, Ce = () => {
    k && x(d.clone().add(1, "day"));
  }, be = () => x(C.utc().tz(o)), [de, ve] = ee(null), [he, fe] = ee(null), Oe = (b) => Math.round(b / s) * s;
  Te(() => {
    const b = (ce) => {
      if (!V.current)
        return;
      const ye = V.current.getBoundingClientRect(), Ne = (ce.clientY - ye.top) / I * s;
      if (de) {
        const pe = Oe(Ne), ue = d.clone().startOf("day").add(pe, "minutes"), Me = de.end.diff(de.start, "minutes");
        p?.({
          ...de,
          start: ue,
          end: ue.clone().add(Me, "minutes")
        });
      }
      if (he) {
        const pe = Oe(Ne), ue = d.clone().startOf("day").add(pe, "minutes");
        ue.isAfter(he.start) && p?.({
          ...he,
          end: ue
        });
      }
    }, P = () => {
      ve(null), fe(null);
    };
    return window.addEventListener("mousemove", b), window.addEventListener("mouseup", P), () => {
      window.removeEventListener("mousemove", b), window.removeEventListener("mouseup", P);
    };
  }, [de, he, d, s, p]);
  const Ae = y(() => Qe(d, s), [d, s]), qe = (b) => Ke(b, E, i, l, T);
  Ze(() => {
    R.current && (R.current.scrollTop = 0);
  }, [d, ae]), Te(() => {
    if (!R.current || !ae)
      return;
    const b = setTimeout(() => {
      R.current && requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!R.current)
            return;
          let P = 0;
          if (F.length > 0)
            P = F[0].top;
          else {
            const ce = Ae.findIndex((ye) => qe(ye));
            ce !== -1 && (P = ce * I);
          }
          if (P > 0) {
            const ce = Math.max(0, P - I), ye = R.current.scrollTop, Ge = ce - ye, Ne = 2e3;
            let pe = null;
            const ue = (Me) => {
              pe === null && (pe = Me);
              const Ue = Me - pe, ke = Ue / Ne, rr = ke < 0.5 ? 4 * ke * ke * ke : 1 - Math.pow(-2 * ke + 2, 3) / 2;
              R.current && (R.current.scrollTop = ye + Ge * rr, Ue < Ne ? requestAnimationFrame(ue) : R.current.scrollTop = ce);
            };
            requestAnimationFrame(ue);
          }
        });
      });
    }, 100);
    return () => clearTimeout(b);
  }, [d, F.length, ae]);
  const De = e.jsxs("div", { className: "text-center flex flex-col items-center", children: [e.jsx("h2", { className: "text-xl font-semibold", children: d.format(t) }), a && e.jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["GMT", d.format("Z"), " • ", o] }), j && e.jsx("button", { onClick: be, className: "mt-1 text-sm font-medium", style: { color: "var(--calendar-primary)" }, children: "Today" })] }), Le = e.jsx("button", { onClick: ne, disabled: !G, className: `px-3 py-1 rounded ${G ? "hover:bg-gray-200" : "opacity-50 cursor-not-allowed"}`, children: "◀" }), $e = e.jsx("button", { onClick: Ce, disabled: !k, className: `px-3 py-1 rounded ${k ? "hover:bg-gray-200" : "opacity-50 cursor-not-allowed"}`, children: "▶" }), We = e.jsxs("div", { className: "flex items-center gap-2", children: [Le, $e] }), je = u ? u({ goToPreviousDay: ne, goToNextDay: Ce, goToToday: be }) : null;
  return e.jsxs("div", { className: "flex flex-col flex-1 min-h-0", style: { ...oe, backgroundColor: "var(--calendar-bg)", color: "var(--calendar-text)" }, children: [e.jsxs("div", { className: "sticky top-0 z-20 border-b px-6 py-4 flex items-center min-h-[80px]", style: { backgroundColor: "var(--calendar-bg)", borderColor: "var(--calendar-grid)" }, children: [v === "left" && e.jsxs(e.Fragment, { children: [e.jsx("div", { className: "flex-1 flex justify-start items-center", children: je || We }), e.jsx("div", { className: "flex-1 flex justify-center items-center", children: De }), e.jsx("div", { className: "flex-1 flex justify-end items-center" })] }), v === "center" && e.jsxs(e.Fragment, { children: [e.jsx("div", { className: "flex-1 flex justify-start items-center" }), e.jsxs("div", { className: "flex-1 flex justify-center items-center gap-4", children: [je || Le, De, !je && $e] }), e.jsx("div", { className: "flex-1 flex justify-end items-center" })] }), v === "right" && e.jsxs(e.Fragment, { children: [e.jsx("div", { className: "flex-1 flex justify-start items-center" }), e.jsx("div", { className: "flex-1 flex justify-center items-center", children: De }), e.jsx("div", { className: "flex-1 flex justify-end items-center gap-4", children: je || We })] })] }), e.jsx("div", { className: "flex flex-1 min-h-0 m-5", children: e.jsxs("div", { ref: R, className: "flex flex-1 overflow-y-auto no-scrollbar", children: [e.jsx("div", { className: "w-24 flex-shrink-0", style: { backgroundColor: "var(--calendar-secondary-bg)" }, children: Ae.map((b, P) => {
    const ce = qe(b);
    return e.jsx("div", { className: "relative text-xs text-right pr-3 border-b border-dotted border-r", style: {
      height: I,
      borderColor: "var(--calendar-grid)",
      color: ce ? "var(--calendar-secondary-text)" : "var(--calendar-grid)",
      backgroundColor: ce ? "transparent" : "var(--calendar-secondary-bg)"
    }, children: e.jsx("span", { className: "absolute top-1/2 -translate-y-1/2 right-2", children: b.format(n) }) }, P);
  }) }), e.jsxs("div", { ref: V, className: "flex-1 relative", children: [Ae.map((b, P) => e.jsx("div", { style: { height: I, borderColor: "var(--calendar-grid)" }, className: "border-b border-dotted" }, P)), F.map((b) => e.jsxs("div", { ref: (P) => {
    P && c.triggerOnEventRender(b, P);
  }, onMouseDown: () => ve(b), onDoubleClick: () => {
    c.triggerOnEventClick(b), z && (X(b), se({
      ...b,
      start: C(b.start).tz(o).format("YYYY-MM-DDTHH:mm"),
      end: C(b.end).tz(o).format("YYYY-MM-DDTHH:mm")
    }), m(!0));
  }, className: "absolute rounded px-2 text-sm cursor-move", style: {
    top: b.top,
    height: b.height,
    left: `${b.columnIndex / b.columnCount * 100}%`,
    width: `${100 / b.columnCount}%`,
    backgroundColor: "var(--calendar-event-bg)",
    color: "var(--calendar-event-text)"
  }, children: [b.title, q && e.jsx("button", { onClick: (P) => {
    P.stopPropagation(), q(b.id);
  }, className: "absolute top-1 right-1 text-xs bg-red-500 rounded px-1", children: "✕" }), e.jsx("div", { onMouseDown: (P) => {
    P.stopPropagation(), fe(b);
  }, className: "absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize", style: { backgroundColor: "var(--calendar-primary)", opacity: 0.5 } })] }, b.id)), Y && F.length === 0 && !Re && e.jsx("div", { className: "absolute left-0 right-0 flex items-center justify-center animate-fadeIn", style: {
    top: ge.startMinutes / s * I,
    height: (ge.endMinutes - ge.startMinutes) / s * I
  }, children: e.jsxs("div", { className: "bg-white shadow-xl rounded-2xl px-8 py-6 border text-center animate-scaleIn", children: [e.jsx("p", { className: "text-gray-600 font-medium", children: N || "No events scheduled" }), B || te && e.jsx("button", { onClick: () => {
    X(null), se({}), m(!0);
  }, className: "mt-4 px-4 py-2 text-white rounded", style: { backgroundColor: "var(--calendar-primary)" }, children: "Add Event" })] }) }), J && e.jsx("div", { className: "absolute left-0 right-0 border-t-2", style: {
    borderColor: "var(--calendar-primary)",
    top: (g.hours() * 60 + g.minutes()) / s * I
  } })] })] }) }), L && e.jsx(Ie, { isOpen: Q, onClose: me, editingEvent: D, formData: le, setFormData: se, formFields: H, timezone: o, onAddEvent: te, onEditEvent: z, onDeleteEvent: q, pluginManager: c, conflictTemplate: K || ($ ? Be[$] : void 0) })] });
}, dr = ({ timezone: o, timezoneLabelInclude: a = !1, slotInterval: s, timeFormat: t, selectedDate: n, onDateChange: f, events: x, onEventChange: h, navigationPosition: p = "center", renderNavigation: v, showEmptyState: j = !0, enabledTimeSlots: u, disabledTimeSlots: Y, enabledTimeInterval: E, disableTimeInterval: i, onAddEvent: l, onEditEvent: T, onDeleteEvent: N, formFields: B, onlyCreateEditRequired: S, navigateToFirstEvent: re, plugins: U, conflictTemplate: ae, conflictThemeVariant: te, calendarTheme: z, calendarThemeVariant: q }) => {
  const H = Fe(null), L = y(() => z || (q && ie[q] ? ie[q] : ie.classic_light), [z, q]), Z = y(() => ({
    "--calendar-primary": L.primaryColor,
    "--calendar-bg": L.backgroundColor,
    "--calendar-secondary-bg": L.secondaryBackgroundColor,
    "--calendar-grid": L.gridColor,
    "--calendar-text": L.textColor,
    "--calendar-secondary-text": L.secondaryTextColor,
    "--calendar-accent": L.accentColor,
    "--calendar-event-bg": L.eventDefaultColor,
    "--calendar-event-text": L.eventDefaultTextColor
  }), [L]), K = y(() => x ?? [], [x]), $ = y(() => new He(U, {
    timezone: o,
    slotInterval: s,
    events: K,
    onEventChange: h,
    onAddEvent: l,
    onEditEvent: T,
    onDeleteEvent: N
  }), [U, o, s, K, h, l, T, N]);
  Te(() => {
    $.init();
  }, [$]);
  const W = y(() => Se(n, o), [n, o]), M = y(() => W.clone().startOf("week"), [W]), R = y(() => {
    const O = [];
    for (let w = 0; w < 7; w++)
      O.push(M.clone().add(w, "days"));
    return O;
  }, [M]), V = y(() => C.utc().tz(o), [o]), [A, oe] = ee(!1), [r, c] = ee(null), [d, g] = ee({}), J = y(() => Ve(E), [E]), Q = () => {
    oe(!1), c(null), g({});
  }, m = () => f(W.clone().subtract(1, "week")), D = () => f(W.clone().add(1, "week")), X = () => f(C.utc().tz(o)), le = y(() => Qe(M, s), [M, s]), se = (O) => Ke(O, u, Y, E, i), _ = y(() => {
    $.triggerBeforeRender();
    const O = R.map((w) => {
      const F = Pe(K, w, o).filter((G) => !G.allDay);
      return er(F, w, s);
    });
    return $.triggerAfterRender(), O;
  }, [R, K, o, s, $]);
  Ze(() => {
    H.current && (H.current.scrollTop = 0);
  }, [M, re]), Te(() => {
    if (!H.current || !re)
      return;
    const O = setTimeout(() => {
      H.current && requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!H.current)
            return;
          let w = 1 / 0;
          _.forEach((G) => {
            G.length > 0 && (w = Math.min(w, G[0].top));
          });
          let F = 0;
          if (w !== 1 / 0)
            F = w;
          else {
            const G = le.findIndex((k) => se(k));
            G !== -1 && (F = G * I);
          }
          if (F > 0) {
            const G = Math.max(0, F - I), k = H.current.scrollTop, ne = G - k, Ce = 2e3;
            let be = null;
            const de = (ve) => {
              be === null && (be = ve);
              const he = ve - be, fe = he / Ce, Oe = fe < 0.5 ? 4 * fe * fe * fe : 1 - Math.pow(-2 * fe + 2, 3) / 2;
              H.current && (H.current.scrollTop = k + ne * Oe, he < Ce ? requestAnimationFrame(de) : H.current.scrollTop = G);
            };
            requestAnimationFrame(de);
          }
        });
      });
    }, 100);
    return () => clearTimeout(O);
  }, [M, _, re]);
  const xe = e.jsxs("div", { className: "text-center flex flex-col items-center", children: [e.jsx("h2", { className: "text-xl font-semibold", children: M.format("MMMM YYYY") }), a && e.jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["GMT", W.format("Z"), " • ", o] }), e.jsx("button", { onClick: X, className: "mt-1 text-sm font-medium", style: { color: "var(--calendar-primary)" }, children: "Today" })] }), _e = e.jsx("button", { onClick: m, className: "px-3 py-1 rounded hover:bg-gray-200", children: "◀" }), Re = e.jsx("button", { onClick: D, className: "px-3 py-1 rounded hover:bg-gray-200", children: "▶" }), ge = e.jsxs("div", { className: "flex items-center gap-2", children: [_e, Re] }), me = v ? v({ goToPreviousDay: m, goToNextDay: D, goToToday: X }) : null;
  return e.jsxs("div", { className: "flex flex-col flex-1 min-h-0", style: { ...Z, backgroundColor: "var(--calendar-bg)", color: "var(--calendar-text)" }, children: [e.jsxs("div", { className: "sticky top-0 z-20 border-b px-6 py-4 flex items-center min-h-[80px]", style: { backgroundColor: "var(--calendar-bg)", borderColor: "var(--calendar-grid)" }, children: [p === "left" && e.jsxs(e.Fragment, { children: [e.jsx("div", { className: "flex-1 flex justify-start items-center", children: me || ge }), e.jsx("div", { className: "flex-1 flex justify-center items-center", children: xe }), e.jsx("div", { className: "flex-1 flex justify-end items-center" })] }), p === "center" && e.jsxs(e.Fragment, { children: [e.jsx("div", { className: "flex-1 flex justify-start items-center" }), e.jsxs("div", { className: "flex-1 flex justify-center items-center gap-4", children: [me || _e, xe, !me && Re] }), e.jsx("div", { className: "flex-1 flex justify-end items-center" })] }), p === "right" && e.jsxs(e.Fragment, { children: [e.jsx("div", { className: "flex-1 flex justify-start items-center" }), e.jsx("div", { className: "flex-1 flex justify-center items-center", children: xe }), e.jsx("div", { className: "flex-1 flex justify-end items-center gap-4", children: me || ge })] })] }), e.jsxs("div", { className: "flex flex-1 flex-col min-h-0 m-5 mt-2 overflow-hidden", style: { backgroundColor: "var(--calendar-bg)" }, children: [e.jsxs("div", { className: "flex border-b", style: { borderColor: "var(--calendar-grid)" }, children: [e.jsx("div", { className: "w-24 flex-shrink-0" }), e.jsx("div", { className: "flex flex-1 min-w-[700px]", children: R.map((O, w) => e.jsxs("div", { className: "flex-1 text-center font-medium py-3", style: { color: "var(--calendar-text)" }, children: [e.jsx("div", { className: "text-xs uppercase tracking-wider", style: { color: "var(--calendar-secondary-text)" }, children: O.format("ddd") }), e.jsx("div", { className: "text-2xl mt-1", children: O.format("D") })] }, w)) })] }), e.jsxs("div", { ref: H, className: "flex flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative", children: [e.jsx("div", { className: "w-24 flex-shrink-0 z-10 sticky left-0 shadow-[1px_0_5px_rgba(0,0,0,0.02)]", style: { backgroundColor: "var(--calendar-bg)" }, children: le.map((O, w) => {
    const F = se(O);
    return e.jsx("div", { className: "relative text-xs text-right pr-3 border-b border-dotted", style: {
      height: I,
      borderColor: "var(--calendar-grid)",
      color: F ? "var(--calendar-secondary-text)" : "var(--calendar-grid)",
      backgroundColor: F ? "transparent" : "var(--calendar-secondary-bg)"
    }, children: e.jsx("span", { className: "absolute top-1/2 -translate-y-1/2 right-2 px-1", style: { backgroundColor: "var(--calendar-bg)" }, children: O.format(t) }) }, w);
  }) }), e.jsxs("div", { className: "flex flex-1 relative bg-white min-w-[700px]", children: [e.jsx("div", { className: "absolute inset-0 pointer-events-none", children: le.map((O, w) => e.jsx("div", { style: { height: I, borderColor: "var(--calendar-grid)" }, className: "border-b border-dotted w-full" }, `row-${w}`)) }), R.map((O, w) => {
    const F = _[w], G = O.isSame(V, "day");
    return e.jsxs("div", { className: "flex-1 relative", children: [e.jsx("div", { className: "absolute inset-0 z-0 bg-transparent cursor-pointer", onDoubleClick: () => {
      l && S && (g({ start: O.clone().hour(9).format("YYYY-MM-DDTHH:mm") }), oe(!0));
    } }), G && e.jsx("div", { className: "absolute left-0 right-0 border-t-2 z-10", style: {
      borderColor: "var(--calendar-primary)",
      top: (V.hours() * 60 + V.minutes()) / s * I,
      boxShadow: "0 0 8px var(--calendar-primary-alpha40)"
    }, children: e.jsx("div", { className: "absolute -left-1 -top-[5px] w-2 h-2 rounded-full", style: { backgroundColor: "var(--calendar-primary)" } }) }), j && F.length === 0 && e.jsx("div", { className: "absolute left-1 right-1 flex items-center justify-center animate-fadeIn opacity-50", style: {
      top: J.startMinutes / s * I,
      height: (J.endMinutes - J.startMinutes) / s * I
    }, children: e.jsx("div", { className: "text-xs font-medium", style: { color: "var(--calendar-secondary-text)" }, children: "Clear" }) }), e.jsx("div", { className: "absolute inset-0 z-10 pointer-events-none", children: F.map((k) => e.jsxs("div", { onDoubleClick: (ne) => {
      ne.stopPropagation(), $.triggerOnEventClick(k), !(!T || !S) && (c(k), g({
        ...k,
        start: C(k.start).tz(o).format("YYYY-MM-DDTHH:mm"),
        end: C(k.end).tz(o).format("YYYY-MM-DDTHH:mm")
      }), oe(!0));
    }, ref: (ne) => {
      ne && $.triggerOnEventRender(k, ne);
    }, className: "absolute rounded-[4px] px-2 text-xs font-medium cursor-pointer shadow-sm hover:z-20 border pointer-events-auto transition-all overflow-hidden", style: {
      top: k.top,
      height: Math.max(k.height, 20),
      left: `${k.columnIndex / k.columnCount * 100}%`,
      width: `calc(${100 / k.columnCount}% - 2px)`,
      // Small margin
      backgroundColor: "var(--calendar-event-bg)",
      color: "var(--calendar-event-text)",
      borderColor: "var(--calendar-grid)"
    }, children: [e.jsx("div", { className: "truncate", children: k.title }), N && S && e.jsx("button", { onClick: (ne) => {
      ne.stopPropagation(), N(k.id);
    }, className: "absolute top-[2px] right-[2px] w-4 h-4 text-[10px] leading-none bg-red-500 hover:bg-red-600 rounded flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity flex-shrink-0", children: "✕" })] }, k.id)) })] }, O.format("YYYY-MM-DD"));
  })] })] })] }), S && e.jsx(Ie, { isOpen: A, onClose: Q, editingEvent: r, formData: d, setFormData: g, formFields: B, timezone: o, onAddEvent: l, onEditEvent: T, onDeleteEvent: N, pluginManager: $, conflictTemplate: ae || (te ? Be[te] : void 0) })] });
}, fr = ({ timezone: o, timezoneLabelInclude: a = !1, selectedDate: s, onDateChange: t, events: n, onEventChange: f, navigationPosition: x = "center", renderNavigation: h, onAddEvent: p, onEditEvent: v, onDeleteEvent: j, formFields: u, onlyCreateEditRequired: Y, plugins: E, conflictTemplate: i, conflictThemeVariant: l, calendarTheme: T, calendarThemeVariant: N }) => {
  const B = y(() => Se(s, o), [s, o]), S = y(() => T || (N && ie[N] ? ie[N] : ie.classic_light), [T, N]), re = y(() => ({
    "--calendar-primary": S.primaryColor,
    "--calendar-bg": S.backgroundColor,
    "--calendar-secondary-bg": S.secondaryBackgroundColor,
    "--calendar-grid": S.gridColor,
    "--calendar-text": S.textColor,
    "--calendar-secondary-text": S.secondaryTextColor,
    "--calendar-accent": S.accentColor,
    "--calendar-event-bg": S.eventDefaultColor,
    "--calendar-event-text": S.eventDefaultTextColor
  }), [S]), U = y(() => n ?? [], [n]), ae = y(() => new He(E, {
    timezone: o,
    slotInterval: 30,
    // Placeholder for MonthView
    events: U,
    onEventChange: f,
    onAddEvent: p,
    onEditEvent: v,
    onDeleteEvent: j
  }), [E, o, U, f, p, v, j]), [te, z] = ee(!1), [q, H] = ee(null), [L, Z] = ee({}), K = y(() => B.clone().startOf("month"), [B]), $ = y(() => B.clone().endOf("month"), [B]), W = y(() => K.clone().startOf("week"), [K]), M = y(() => $.clone().endOf("week"), [$]), R = y(() => {
    const m = [];
    let D = W.clone();
    for (; D.isBefore(M) || D.isSame(M, "day"); )
      m.push(D.clone()), D.add(1, "day");
    return m;
  }, [W, M]), V = () => t(B.clone().subtract(1, "month")), A = () => t(B.clone().add(1, "month")), oe = () => t(C.utc().tz(o)), r = () => {
    z(!1), H(null), Z({});
  }, c = e.jsxs("div", { className: "text-center flex flex-col items-center", children: [e.jsx("h2", { className: "text-xl font-semibold", children: B.format("MMMM YYYY") }), a && e.jsxs("p", { className: "text-xs mt-1", style: { color: "var(--calendar-secondary-text)" }, children: ["GMT", B.format("Z"), " • ", o] }), e.jsx("button", { onClick: oe, className: "mt-1 text-sm font-medium", style: { color: "var(--calendar-primary)" }, children: "Today" })] }), d = e.jsx("button", { onClick: V, className: "px-3 py-1 rounded hover:opacity-70 transition-opacity", style: { color: "var(--calendar-text)" }, children: "◀" }), g = e.jsx("button", { onClick: A, className: "px-3 py-1 rounded hover:opacity-70 transition-opacity", style: { color: "var(--calendar-text)" }, children: "▶" }), J = e.jsxs("div", { className: "flex items-center gap-2", children: [d, g] }), Q = h ? h({ goToPreviousDay: V, goToNextDay: A, goToToday: oe }) : null;
  return e.jsxs("div", { className: "flex flex-col flex-1 min-h-0", style: { ...re, backgroundColor: "var(--calendar-bg)", color: "var(--calendar-text)" }, children: [e.jsxs("div", { className: "sticky top-0 z-20 border-b px-6 py-4 flex items-center min-h-[80px]", style: { backgroundColor: "var(--calendar-bg)", borderColor: "var(--calendar-grid)" }, children: [x === "left" && e.jsxs(e.Fragment, { children: [e.jsx("div", { className: "flex-1 flex justify-start items-center", children: Q || J }), e.jsx("div", { className: "flex-1 flex justify-center items-center", children: c }), e.jsx("div", { className: "flex-1 flex justify-end items-center" })] }), x === "center" && e.jsxs(e.Fragment, { children: [e.jsx("div", { className: "flex-1 flex justify-start items-center" }), e.jsxs("div", { className: "flex-1 flex justify-center items-center gap-4", children: [Q || d, c, !Q && g] }), e.jsx("div", { className: "flex-1 flex justify-end items-center" })] }), x === "right" && e.jsxs(e.Fragment, { children: [e.jsx("div", { className: "flex-1 flex justify-start items-center" }), e.jsx("div", { className: "flex-1 flex justify-center items-center", children: c }), e.jsx("div", { className: "flex-1 flex justify-end items-center gap-4", children: Q || J })] })] }), e.jsx("div", { className: "grid grid-cols-7 border-b", style: { borderColor: "var(--calendar-grid)" }, children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((m) => e.jsx("div", { className: "py-2 text-center text-xs font-semibold uppercase tracking-wider", style: { color: "var(--calendar-secondary-text)" }, children: m }, m)) }), e.jsx("div", { className: "flex-1 overflow-y-auto no-scrollbar", children: e.jsx("div", { className: "grid grid-cols-7 min-h-full", children: R.map((m, D) => {
    const X = m.isSame(B, "month"), le = m.isSame(C().tz(o), "day"), se = Pe(U, m, o);
    return e.jsxs("div", { className: "min-h-[120px] border-b border-r p-1 flex flex-col gap-1 transition-colors hover:bg-opacity-10", style: {
      borderColor: "var(--calendar-grid)",
      backgroundColor: X ? "transparent" : "var(--calendar-secondary-bg)",
      opacity: X ? 1 : 0.5
    }, onDoubleClick: () => {
      if (p && Y) {
        const _ = m.clone().hour(9).minute(0), xe = _.clone().add(1, "hour");
        Z({
          start: _.format("YYYY-MM-DDTHH:mm"),
          end: xe.format("YYYY-MM-DDTHH:mm")
        }), z(!0);
      }
    }, children: [e.jsx("div", { className: "flex justify-end pr-1", children: e.jsx("span", { className: `text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${le ? "text-white" : ""}`, style: le ? { backgroundColor: "var(--calendar-primary)" } : { color: X ? "var(--calendar-text)" : "var(--calendar-secondary-text)" }, children: m.date() }) }), e.jsxs("div", { className: "flex flex-col gap-1 flex-1 overflow-hidden", children: [se.slice(0, 4).map((_) => e.jsx("div", { onClick: () => {
      ae.triggerOnEventClick(_), v && Y && (H(_), Z({
        ..._,
        start: C(_.start).tz(o).format("YYYY-MM-DDTHH:mm"),
        end: C(_.end).tz(o).format("YYYY-MM-DDTHH:mm")
      }), z(!0));
    }, className: "px-1.5 py-0.5 rounded text-[10px] truncate cursor-pointer transition-transform hover:scale-[1.02]", style: {
      backgroundColor: "var(--calendar-event-bg)",
      color: "var(--calendar-event-text)",
      border: _.hasConflict ? "1px solid red" : "none"
    }, title: _.title, children: _.title }, _.id)), se.length > 4 && e.jsxs("div", { className: "text-[9px] px-1 font-bold", style: { color: "var(--calendar-secondary-text)" }, children: ["+", se.length - 4, " more"] })] })] }, D);
  }) }) }), Y && e.jsx(Ie, { isOpen: te, onClose: r, editingEvent: q, formData: L, setFormData: Z, formFields: u, timezone: o, onAddEvent: p, onEditEvent: v, onDeleteEvent: j, pluginManager: ae, conflictTemplate: i || (l ? Be[l] : void 0) })] });
};
export {
  ir as DayView,
  fr as MonthView,
  ie as PREDEFINED_CALENDAR_THEMES,
  Be as PREDEFINED_CONFLICT_TEMPLATES,
  I as SLOT_HEIGHT,
  dr as WeekView,
  er as calculateLayoutEvents,
  Ke as checkIsSlotEnabled,
  cr as detectConflicts,
  Qe as generateTimeSlots,
  Pe as getDayEvents,
  Ve as getWorkingHoursRange,
  Se as normalizeDate
};
