import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import {
  faArrowLeft,
  faArrowUpRightFromSquare,
  faBuildingShield,
  faDownload,
  faGraduationCap,
  faLocationDot,
  faPersonRunning,
  faPhone,
  faShieldHeart,
  faStethoscope,
  faStore,
  faVenus,
} from '@fortawesome/free-solid-svg-icons';
import { getAllFacilities, getFacilityById, isHoldingFacility } from '@/lib/facilities';
import {
  getCommissaryFor,
  getAmenitiesFor,
  getClassesFor,
  commissaryIsTypical,
  amenitiesAreTypical,
  classesAreTypical,
} from '@/lib/facility-defaults';
import type { Facility } from '@/types/facility';

const TYPE_LABEL: Record<Facility['type'], string> = {
  FPC: 'Federal Prison Camp',
  SCP: 'Satellite Prison Camp',
  FMC: 'Federal Medical Center',
  MCFP: 'Medical Center for Federal Prisoners',
  'FCI-CAMP': 'FCI Camp',
  'MIN-OTHER': 'Minimum-security Facility',
  FDC: 'Federal Detention Center',
  MCC: 'Metropolitan Correctional Center',
  MDC: 'Metropolitan Detention Center',
  FTC: 'Federal Transfer Center',
};

const SECURITY_LABEL: Record<Facility['securityLevel'], string> = {
  MINIMUM: 'Minimum',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  ADMIN: 'Administrative',
};

export async function generateStaticParams() {
  return getAllFacilities().map((f) => ({ id: f.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const f = getFacilityById(id);
  if (!f) return { title: 'Facility not found' };
  return {
    title: `${f.name} — facility profile`,
    description: `${TYPE_LABEL[f.type]} in ${f.city}, ${f.state}. Address, programs, commissary, amenities, classes, and the official BOP A&O handbook.`,
  };
}

export default async function FacilityProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const facility = getFacilityById(id);
  if (!facility) notFound();

  const isHolding = isHoldingFacility(facility);
  const commissary = getCommissaryFor(facility);
  const amenities = getAmenitiesFor(facility);
  const classes = getClassesFor(facility);
  const commissaryTypical = commissaryIsTypical(facility);
  const amenitiesTypical = amenitiesAreTypical(facility);
  const classesTypical = classesAreTypical(facility);

  return (
    <>
      <Section className="pt-10 pb-6 sm:pt-14">
        <Container>
          <div className="mb-6">
            <Link
              href="/#map"
              className="inline-flex items-center gap-1.5 text-[12px] text-ink-muted transition-colors hover:text-ink"
            >
              <Icon icon={faArrowLeft} className="text-[10px]" />
              Back to map
            </Link>
          </div>

          <div className="max-w-3xl">
            <p className="small-caps text-[11px] text-ink-muted">
              {TYPE_LABEL[facility.type]}
            </p>
            <h1 className="font-display mt-2 text-balance text-5xl leading-[1.05] tracking-tightest text-ink sm:text-6xl">
              {facility.name}
            </h1>
            <p className="mt-4 inline-flex items-center gap-2 text-[15px] text-ink-soft">
              <Icon icon={faLocationDot} className="text-clay" />
              {facility.city}, {facility.state}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {facility.gender === 'FEMALE' && (
                <Badge icon={faVenus} tone="pink">
                  Women&rsquo;s
                </Badge>
              )}
              {facility.gender === 'COED' && <Badge>Coed</Badge>}
              {isHolding && (
                <Badge icon={faBuildingShield} tone="slate">
                  Holding / detention
                </Badge>
              )}
              {facility.isMedical && (
                <Badge icon={faStethoscope} tone="teal">
                  Medical
                </Badge>
              )}
              {facility.hasRDAP && (
                <Badge icon={faShieldHeart} tone="gold">
                  RDAP
                </Badge>
              )}
              {facility.totalPopulation && (
                <Badge>~{facility.totalPopulation} people housed</Badge>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            {/* Left column */}
            <div className="space-y-10">
              {/* At a glance */}
              <Card title="At a glance">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <Field label="Address">
                    {facility.address}
                    <br />
                    {facility.city}, {facility.state} {facility.zip}
                  </Field>
                  <Field label="Phone">
                    <a
                      href={`tel:${facility.phone.replace(/\D/g, '')}`}
                      className="hover:text-clay-deep"
                    >
                      {facility.phone}
                    </a>
                  </Field>
                  <Field label="Security level">
                    {SECURITY_LABEL[facility.securityLevel]}
                  </Field>
                  <Field label="Region">{facility.region}</Field>
                  {facility.totalPopulation && (
                    <Field label="Approximate population">
                      ~{facility.totalPopulation}
                    </Field>
                  )}
                  {facility.parentFacility && (
                    <Field label="Parent facility">
                      <Link
                        href={`/facilities/${facility.parentFacility}`}
                        className="hover:text-clay-deep"
                      >
                        {facility.parentFacility}
                      </Link>
                    </Field>
                  )}
                </dl>
              </Card>

              {/* Programs */}
              {facility.programs && facility.programs.length > 0 && (
                <Card title="Programs">
                  <div className="flex flex-wrap gap-2">
                    {facility.programs.map((p) => (
                      <span
                        key={p}
                        className="rounded-full border border-ink/10 bg-cream-50/80 px-3 py-1 text-[12px] text-ink-soft"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Commissary */}
              <Card
                title="Commissary"
                icon={faStore}
                subtitle={
                  commissaryTypical
                    ? "Typical of federal facilities like this one. Specific items rotate weekly and vary by facility — what's on the shelves the week your person arrives may differ."
                    : "What this facility's commissary stocks. Items rotate; specifics may shift week to week."
                }
              >
                <div className="space-y-3">
                  {commissary.map((section) => (
                    <details
                      key={section.category}
                      className="group rounded-xl border border-ink/10 bg-cream-50/60 open:bg-cream-50/90"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[14px] font-medium text-ink">
                        <span>{section.category}</span>
                        <span className="text-[11px] text-ink-muted group-open:hidden">
                          {section.items.length} items
                        </span>
                        <span className="hidden text-[11px] text-ink-muted group-open:inline">
                          Hide
                        </span>
                      </summary>
                      <ul className="grid gap-1 px-4 pb-4 pt-1 text-[13px] leading-relaxed text-ink-soft sm:grid-cols-2">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span aria-hidden className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-clay/60" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </Card>

              {/* Amenities & Rec */}
              <Card
                title="Amenities & rec"
                icon={faPersonRunning}
                subtitle={
                  amenitiesTypical
                    ? 'Typical for facilities like this one. Specific equipment and access varies.'
                    : undefined
                }
              >
                <ul className="grid gap-2 sm:grid-cols-2">
                  {amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-start gap-2 text-[14px] leading-relaxed text-ink-soft"
                    >
                      <span aria-hidden className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-clay/60" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Classes */}
              <Card
                title="Classes & education"
                icon={faGraduationCap}
                subtitle={
                  classesTypical
                    ? 'Typical at a facility like this one. Course catalogs change each quarter and depend on staffing.'
                    : undefined
                }
              >
                <ul className="grid gap-2 sm:grid-cols-2">
                  {classes.map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-2 text-[14px] leading-relaxed text-ink-soft"
                    >
                      <span aria-hidden className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-clay/60" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Notes */}
              {facility.notes && (
                <Card title="Notes">
                  <p className="text-[15px] leading-relaxed text-ink-soft">
                    {facility.notes}
                  </p>
                </Card>
              )}
            </div>

            {/* Right column */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <Card title="Documents">
                <div className="flex flex-col gap-3">
                  <ButtonLink
                    href={facility.handbookUrl}
                    external
                    variant="primary"
                    size="md"
                  >
                    <Icon icon={faDownload} />
                    A&amp;O Handbook (PDF)
                  </ButtonLink>
                  <ButtonLink
                    href={facility.bopUrl}
                    external
                    variant="outline"
                    size="md"
                  >
                    Official BOP page
                    <Icon icon={faArrowUpRightFromSquare} className="text-[11px]" />
                  </ButtonLink>
                </div>
                <p className="mt-4 text-[12px] leading-relaxed text-ink-muted">
                  The Admission &amp; Orientation handbook is the camp&rsquo;s own
                  rulebook — issued to every new arrival in their first week.
                </p>
              </Card>

              <Card title="Get in touch">
                <p className="text-[14px] leading-relaxed text-ink-soft">
                  Calls to a federal facility ring through the front desk, not the
                  housing units. Use this number for general questions —
                  visitation, mail policy, intake schedule.
                </p>
                <a
                  href={`tel:${facility.phone.replace(/\D/g, '')}`}
                  className="mt-3 inline-flex items-center gap-2 text-[15px] font-medium text-ink hover:text-clay-deep"
                >
                  <Icon icon={faPhone} className="text-clay" />
                  {facility.phone}
                </a>
              </Card>

              <p className="rounded-xl border border-ink/10 bg-cream-50/60 px-4 py-3 text-[12px] italic leading-relaxed text-ink-muted">
                Compiled from public BOP sources
                {facility.dataLastVerified
                  ? `, last reviewed ${formatDate(facility.dataLastVerified)}`
                  : ''}
                . Things change quickly inside — verify with the facility before
                making decisions.
              </p>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Card({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: import('@fortawesome/fontawesome-svg-core').IconDefinition;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-cream-50/80 p-6 shadow-paper backdrop-blur sm:p-7">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl leading-tight tracking-tightest text-ink">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream-100 text-clay">
            <Icon icon={icon} />
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="small-caps text-[10px] text-ink-muted">{label}</dt>
      <dd className="mt-1 text-[14px] leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

function Badge({
  children,
  icon,
  tone = 'sage',
}: {
  children: React.ReactNode;
  icon?: import('@fortawesome/fontawesome-svg-core').IconDefinition;
  tone?: 'sage' | 'gold' | 'teal' | 'pink' | 'slate';
}) {
  const tones = {
    sage: 'bg-sage/15 text-sage-deep',
    gold: 'bg-gold/20 text-gold-deep',
    teal: 'bg-teal/15 text-teal-deep',
    pink: 'bg-pink/20 text-pink-deep',
    slate: 'bg-slate/15 text-slate-deep',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${tones[tone]}`}
    >
      {icon && <Icon icon={icon} className="text-[11px]" />}
      {children}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
