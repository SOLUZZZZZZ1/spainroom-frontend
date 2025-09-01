// Kit de formularios SpainRoom: Field, Input, Select, Textarea, Button, FormCard, Alert
import { useEffect } from "react";

export function FormCard({ title, subtitle, children, footer }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/95 shadow-md p-5">
      {(title || subtitle) && (
        <header className="mb-4">
          {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </header>
      )}
      <div>{children}</div>
      {footer && <div className="mt-4 pt-4 border-t border-gray-100">{footer}</div>}
    </div>
  );
}

export function Alert({ kind = "info", children, onClose, autoHideMs = 0 }) {
  const styles = {
    success: "bg-green-50 text-green-800 border border-green-200",
    error: "bg-red-50 text-red-800 border border-red-200",
    info: "bg-blue-50 text-blue-800 border border-blue-200",
  };
  useEffect(() => {
    if (autoHideMs > 0 && onClose) {
      const t = setTimeout(onClose, autoHideMs);
      return () => clearTimeout(t);
    }
  }, [autoHideMs, onClose]);
  return (
    <div className={`rounded-xl px-4 py-3 ${styles[kind]} flex items-start justify-between gap-3`}>
      <div className="text-sm leading-relaxed">{children}</div>
      {onClose && (
        <button onClick={onClose} className="text-current/60 hover:text-current font-semibold">×</button>
      )}
    </div>
  );
}

export function Field({ label, hint, error, children, required }) {
  return (
    <label className="block">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-gray-800">
            {label} {required && <span className="text-red-500">*</span>}
          </span>
          {hint && <span className="text-xs text-gray-500">{hint}</span>}
        </div>
      )}
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}

const base =
  "w-full rounded-xl border px-3 py-2 outline-none transition placeholder-gray-400 bg-white/95 " +
  "border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300";

export function Input(props) {
  return <input {...props} className={`${base} ${props.className || ""}`} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${base} ${props.className || ""}`}>
      {children}
    </select>
  );
}

export function Textarea(props) {
  return <textarea {...props} className={`${base} ${props.className || ""}`} />;
}

export function Button({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={
        "inline-flex items-center justify-center rounded-xl bg-blue-600 text-white font-semibold px-5 py-3 " +
        "hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 " +
        (props.className || "")
      }
    >
      {loading ? "Enviando…" : children}
    </button>
  );
}
