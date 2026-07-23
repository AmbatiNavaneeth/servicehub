import { type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm overflow-x-auto scrollbar-hide">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
          {item.to ? (
            <Link
              to={item.to}
              className="text-gray-500 hover:text-primary-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-medium">{item.label}</span>
          )}
          {idx < items.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
        </div>
      ))}
    </nav>
  );
}

export function BreadcrumbContainer({ children }: { children: ReactNode }) {
  return <div className="container-app py-4">{children}</div>;
}
