import type { ComponentType, ReactNode } from "react";

interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-hover">
        <Icon className="h-5 w-5 text-text-tertiary" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        {description && <p className="mt-1 text-sm text-text-tertiary">{description}</p>}
      </div>
      {action}
    </div>
  );
}
