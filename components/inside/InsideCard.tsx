import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { InsideTerm } from '@/types/inside-term';

export function InsideCard({ term }: { term: InsideTerm }) {
  return (
    <article className="group relative flex h-full flex-col rounded border border-rule bg-paper-raised/80 p-6 shadow-raise backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <p className="eyebrow text-[10px] text-ink-muted">{term.category}</p>
      <h3 className="font-display mt-1 text-2xl leading-tight tracking-[-0.02em] text-ink">
        {term.title}
      </h3>
      <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
        {term.shortDefinition}
      </p>
      <div className="mt-auto pt-6">
        <Link
          href={`/the-inside/${term.id}`}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-accent-hover hover:gap-3 hover:text-accent"
        >
          Read the full entry
          <Icon icon={faArrowRight} className="text-[11px]" />
          <span aria-hidden className="absolute inset-0" />
        </Link>
      </div>
    </article>
  );
}
