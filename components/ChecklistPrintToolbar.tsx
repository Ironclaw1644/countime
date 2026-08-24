'use client';

import { Icon } from '@/components/ui/Icon';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

interface Props {
  version: string;
  updatedAt: string;
}

export function ChecklistPrintToolbar({ version, updatedAt }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-rule bg-paper-raised px-5 py-3">
      <p className="text-[12px] text-ink-muted">
        Version {version} · updated {updatedAt}
      </p>
      <button
        type="button"
        onClick={() => {
          if (typeof window !== 'undefined') window.print();
        }}
        className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-4 py-2 text-[13px] text-ink-soft hover:bg-paper-sunk hover:text-ink"
      >
        <Icon icon={faPrint} />
        Print or save as PDF
      </button>
    </div>
  );
}
