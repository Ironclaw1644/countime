import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { cn } from '@/lib/cn';

export function Icon({
  icon,
  className,
  label,
  size,
}: {
  icon: IconDefinition;
  className?: string;
  /** When omitted the icon is treated as decorative (aria-hidden) */
  label?: string;
  /** Optional FA size shortcut */
  size?: 'xs' | 'sm' | 'lg' | 'xl' | '2xl';
}) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={cn('inline-block leading-none', className)}
      size={size}
      aria-hidden={!label}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
    />
  );
}
