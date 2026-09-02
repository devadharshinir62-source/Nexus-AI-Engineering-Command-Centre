import { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: 'default' | 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  isNew?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface CommandAction {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Actions' | 'Projects' | 'AI Commands';
  shortcut?: string[];
  onSelect: () => void;
  icon?: LucideIcon;
}
