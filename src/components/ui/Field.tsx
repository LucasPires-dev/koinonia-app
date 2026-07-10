import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClasses =
  "w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

export function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-text-secondary">
      {children}
      {required && <span className="text-danger"> *</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClasses} ${props.className ?? ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldClasses} resize-none ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldClasses} ${props.className ?? ""}`} />;
}
