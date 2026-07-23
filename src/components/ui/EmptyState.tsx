import { type ReactNode } from 'react';
import { Inbox, Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'inbox' | 'search';
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
  const Icon = icon === 'search' ? Search : Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1 max-w-md">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
