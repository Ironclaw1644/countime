import Link from 'next/link';
import { JsonLd, breadcrumbLd } from '@/lib/seo';
import { cn } from '@/lib/cn';

/** Visible breadcrumb trail plus its BreadcrumbList JSON-LD. */
export function Breadcrumbs({
  items,
  className,
}: {
  items: { name: string; path: string }[];
  className?: string;
}) {
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn('text-xs text-ink-muted', className)}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((it, i) => {
            const last = i === items.length - 1;
            return (
              <li key={it.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-ink-soft">
                    {it.name}
                  </span>
                ) : (
                  <>
                    <Link href={it.path} className="underline-offset-4 transition-colors hover:text-accent hover:underline">
                      {it.name}
                    </Link>
                    <span aria-hidden className="text-ink-faint">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(items)} />
    </>
  );
}
