'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/cn';
import { InsideCard } from './InsideCard';
import type { InsideTerm } from '@/types/inside-term';

export function InsideLibrary({
  terms,
  categories,
}: {
  terms: InsideTerm[];
  categories: string[];
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | 'All'>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter((t) => {
      if (
        q &&
        !t.title.toLowerCase().includes(q) &&
        !t.shortDefinition.toLowerCase().includes(q) &&
        !t.category.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (category !== 'All' && t.category !== category) return false;
      return true;
    });
  }, [terms, query, category]);

  const grouped = useMemo(() => {
    const m = new Map<string, InsideTerm[]>();
    for (const t of filtered) {
      if (!m.has(t.category)) m.set(t.category, []);
      m.get(t.category)!.push(t);
    }
    return m;
  }, [filtered]);

  const activeCount = (query ? 1 : 0) + (category !== 'All' ? 1 : 0);

  return (
    <>
      {/* Filter bar */}
      <div className="sticky top-16 z-20 -mx-5 mb-10 border-y border-ink/10 bg-cream/85 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8 sm:top-20">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-ink/10 bg-cream-50/80 px-4 py-2.5 lg:max-w-md">
            <Icon icon={faMagnifyingGlass} className="text-ink-muted" />
            <input
              type="search"
              placeholder="Search terms"
              aria-label="Search inside terms"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-[14px] text-ink placeholder:text-ink-muted focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="text-ink-muted hover:text-ink"
              >
                <Icon icon={faXmark} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CategoryTab
              label="All"
              active={category === 'All'}
              onClick={() => setCategory('All')}
            />
            {categories.map((c) => (
              <CategoryTab
                key={c}
                label={c}
                active={category === c}
                onClick={() => setCategory(c)}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-[12px] text-ink-muted">
          <p>
            <span className="font-medium text-ink">{filtered.length}</span> of{' '}
            {terms.length} {terms.length === 1 ? 'entry' : 'entries'}
          </p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
              className="underline-offset-2 hover:text-ink hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-ink-muted">
          Nothing matches that yet. We&rsquo;re still building this section.
        </p>
      ) : (
        <div className="space-y-14">
          {[...grouped.entries()].map(([cat, list]) => (
            <section key={cat}>
              <header className="mb-6 flex items-end justify-between">
                <h2 className="font-display text-3xl leading-tight tracking-tightest text-ink sm:text-4xl">
                  {cat}
                </h2>
                <span className="small-caps text-[10px] text-ink-muted">
                  {list.length} {list.length === 1 ? 'entry' : 'entries'}
                </span>
              </header>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((t) => (
                  <InsideCard key={t.id} term={t} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function CategoryTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors',
        active
          ? 'bg-ink text-cream-50'
          : 'text-ink-soft hover:bg-cream-100 hover:text-ink',
      )}
    >
      {label}
    </button>
  );
}
