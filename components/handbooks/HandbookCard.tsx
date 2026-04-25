import { Icon } from '@/components/ui/Icon';
import {
  faDownload,
  faLocationDot,
  faStethoscope,
  faShieldHeart,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import type { Facility } from '@/types/facility';

const TYPE_LABEL: Record<Facility['type'], string> = {
  FPC: 'Federal Prison Camp',
  SCP: 'Satellite Prison Camp',
  FMC: 'Federal Medical Center',
  MCFP: 'Medical Center for Federal Prisoners',
  'FCI-CAMP': 'FCI Camp',
  'MIN-OTHER': 'Minimum-security Facility',
};

export function HandbookCard({ facility }: { facility: Facility }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-ink/10 bg-cream-50/80 p-6 shadow-paper backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="small-caps text-[10px] text-ink-muted">
            {TYPE_LABEL[facility.type]}
          </p>
          <h3 className="font-display mt-1 text-2xl leading-tight tracking-tightest text-ink">
            {facility.name}
          </h3>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {facility.isMedical && (
            <Pill icon={faStethoscope} tone="teal">
              Medical
            </Pill>
          )}
          {facility.hasRDAP && (
            <Pill icon={faShieldHeart} tone="gold">
              RDAP
            </Pill>
          )}
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 text-[13px] text-ink-soft">
        <Icon icon={faLocationDot} className="mt-0.5 text-clay" />
        <span>
          {facility.city}, {facility.state}
        </span>
      </p>

      {facility.notes && (
        <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
          {facility.notes}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <a
          href={facility.handbookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-clay px-4 py-2 text-[13px] font-medium text-cream-50 shadow-paper transition-colors hover:bg-clay-deep"
        >
          <Icon icon={faDownload} />
          Download A&amp;O Handbook
        </a>
        <a
          href={facility.bopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-soft hover:text-clay-deep"
        >
          BOP page
          <Icon icon={faArrowUpRightFromSquare} className="text-[10px]" />
        </a>
      </div>
    </article>
  );
}

function Pill({
  children,
  icon,
  tone,
}: {
  children: React.ReactNode;
  icon: import('@fortawesome/fontawesome-svg-core').IconDefinition;
  tone: 'gold' | 'teal';
}) {
  const tones = {
    gold: 'bg-gold/20 text-gold-deep',
    teal: 'bg-teal/15 text-teal-deep',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      <Icon icon={icon} className="text-[10px]" />
      {children}
    </span>
  );
}
