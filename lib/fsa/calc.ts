/**
 * Federal release-date estimator.
 *
 * Mirrors, as closely as the published rules allow, how the Bureau of Prisons
 * says it projects release dates:
 *
 *   1. Full term: the sentence imposed, counted from the day it commences
 *      (18 U.S.C. § 3585(a)), less prior-custody credit (§ 3585(b)).
 *   2. Good conduct time: the maximum possible — 54 (or 42) days per year of
 *      the sentence *imposed*, prorated for a partial final year — because
 *      that is how BOP sets the initial projected date (28 CFR 523.20(b)).
 *   3. RDAP (§ 3621(e)) comes off next — PS 5410.01 §11 applies it before
 *      time credits — capped by PS 5331.02's sentence-length table.
 *   4. FSA time credits, projected the way BOP's 2026 "FSA Time Credit
 *      Application Guide" does it: per completed 30 days served (PS 5410.01
 *      §8), 10 each for the first seven increments and 15 after for minimum/
 *      low risk. The transfer happens on the first day credits earned equal
 *      what is left of the term (§ 3624(g)(1)(A)); up to 12 months of them
 *      go to early supervised release (§ 3624(g)(3)), the rest to prerelease
 *      custody. This model reproduces BOP's worked examples to the day.
 *   5. Second Chance Act placement (§ 3624(c)) is added on top of the FTC days,
 *      as PS 5410.01 describes the RRC/HC referral: Five-Factor days plus the
 *      FTC days not used for supervised release. BOP decides that number; the
 *      reader supplies an assumption, capped at 12 months.
 *
 * Where the rules leave a choice (rounding a prorated year, counting the
 * start date as day one), the choice is written down in NOTES and shown on
 * the page. All date maths is in UTC on calendar dates.
 */
import { RULES } from './rules';

export type Risk = 'minimum' | 'low' | 'medium' | 'high';

export type CalcInput = {
  /** ISO date the sentence commenced — self-surrender, or received in custody for service. */
  start: string;
  years: number;
  months: number;
  days: number;
  /** § 3585(b) prior-custody credit, in days. */
  jailCreditDays: number;
  /** Earned or making progress toward a diploma/GED (28 CFR 523.20(d)(2)). */
  diploma: boolean;
  /** Not serving a sentence for a § 3632(d)(4)(D) offense and no final order of removal. */
  fsaEligible: boolean;
  risk: Risk;
  /** The judgment includes a term of supervised release. */
  supervisedRelease: boolean;
  /** Share of time in earning status, 0–1. BOP's projection assumes 1. */
  participation: number;
  /** Days after commencement before earning status begins (assessments, transit). */
  earningDelayDays: number;
  /** 30-day increments at the base 10 before the +5 applies (min/low). BOP's handout uses 7. */
  basePeriods: number;
  /** Plans to complete RDAP and is eligible for the § 3621(e) reduction. */
  rdap: boolean;
  /** Months of RDAP reduction to assume; capped by the PS 5331.02 table. */
  rdapMonths: number;
  /** Months of Second Chance Act prerelease placement to assume (0–12). */
  scaMonths: number;
};

export const DEFAULT_INPUT: CalcInput = {
  start: '2026-11-02',
  years: 5,
  months: 0,
  days: 0,
  jailCreditDays: 0,
  diploma: true,
  fsaEligible: true,
  risk: 'low',
  supervisedRelease: true,
  participation: 1,
  earningDelayDays: 0,
  basePeriods: 7,
  rdap: false,
  rdapMonths: 12,
  scaMonths: 0,
};

export type Milestone = {
  key: 'start' | 'prerelease-sca' | 'prerelease-ftc' | 'release' | 'srd' | 'full-term';
  label: string;
  date: string;
};

export type CalcResult = {
  input: CalcInput;
  /** Total months imposed (years×12 + months), days ignored — used by RDAP tiers. */
  sentenceMonths: number;
  /** Length of the term imposed, in days, start date counted as day one. */
  termDays: number;
  fullTerm: string;
  gctDays: number;
  gctEligible: boolean;
  statutoryRelease: string;
  rdapMonthsApplied: number;
  rdapCapMonths: number;
  afterRdap: string;
  ftc: {
    eligible: boolean;
    canApply: boolean;
    /** Why credits aren't being applied, when they aren't. */
    blocker?: string;
    ratePer30: number;
    earnedByRelease: number;
    appliedToSupervisedRelease: number;
    towardPrerelease: number;
    prereleaseDate: string | null;
  };
  sca: {
    assumedDays: number;
    maxDate: string;
    homeConfinementCapDays: number;
    homeConfinementFrom: string;
  };
  /** Projected release from BOP custody (supervised release or full release), before weekend adjustment. */
  projectedRelease: string;
  /** § 3624(a): moved to the preceding weekday if it lands on a weekend. */
  releaseWeekday: string;
  earliestPrerelease: string;
  daysServedToRelease: number;
  percentOfTermServed: number;
  milestones: Milestone[];
  notes: string[];
};

// ── Date helpers (UTC calendar dates) ─────────────────────────────────────

const DAY = 86_400_000;

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
export function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}
export function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * DAY);
}
export function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / DAY);
}
/** Calendar-month arithmetic; a day that doesn't exist in the target month clamps to its last day. */
export function addMonths(d: Date, n: number): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + n;
  const target = new Date(Date.UTC(y, m, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d.getUTCDate(), last));
  return target;
}
function previousWeekday(d: Date): Date {
  const dow = d.getUTCDay();
  if (dow === 6) return addDays(d, -1);
  if (dow === 0) return addDays(d, -2);
  return d;
}
const max = (a: Date, b: Date) => (a > b ? a : b);

// ── The calculation ───────────────────────────────────────────────────────

export function rdapCapFor(sentenceMonths: number): number {
  const tier = RULES.rdapTiers.find((t) => sentenceMonths <= t.maxSentenceMonths)!;
  return Math.min(tier.maxReductionMonths, RULES.rdapMaxMonths);
}

export function calculate(raw: CalcInput): CalcResult {
  const input = sanitize(raw);
  const notes: string[] = [];
  const start = parseDate(input.start);

  // 1. Full term. The start date is day one, so a 12-month term that begins
  //    on 1 January ends on 31 December.
  const termEndNoCredit = addDays(addMonths(start, input.years * 12 + input.months), input.days - 1);
  const termDays = diffDays(termEndNoCredit, start) + 1;
  const fullTerm = addDays(termEndNoCredit, -input.jailCreditDays);
  const sentenceMonths = input.years * 12 + input.months;

  // 2. Good conduct time on the sentence imposed. "More than 1 year": a
  //    12-month sentence earns none; 12 months and a day does. The partial
  //    final year is prorated by its days and rounded down — the method that
  //    reproduces every row of BOP's own table in the 2022 GCT rule
  //    (87 FR 7938, Table 1, "Alternative 3").
  const gctEligible = sentenceMonths > 12 || (sentenceMonths === 12 && input.days > 0);
  const perYear = input.diploma ? RULES.gctDaysPerYear : RULES.gctDaysPerYearNoDiploma;
  const wholeYears = Math.floor(sentenceMonths / 12);
  const partialStart = addMonths(start, wholeYears * 12);
  const partialDays = termEndNoCredit >= partialStart ? diffDays(termEndNoCredit, partialStart) + 1 : 0;
  const gctDays = gctEligible
    ? wholeYears * perYear + Math.floor((partialDays * perYear) / 365)
    : 0;
  const statutoryRelease = addDays(fullTerm, -gctDays);

  // 3. RDAP, before credits, in calendar months (BOP's handout example takes
  //    a 60-month GCT date of Apr 5, 2029 to an RDAP date of Apr 5, 2028).
  const rdapCapMonths = rdapCapFor(sentenceMonths);
  const rdapMonthsApplied = input.rdap ? Math.min(input.rdapMonths, rdapCapMonths) : 0;
  const afterRdap = max(addMonths(statutoryRelease, -rdapMonthsApplied), start);
  if (input.rdap && input.rdapMonths > rdapCapMonths) {
    notes.push(
      `RDAP reduction capped at ${rdapCapMonths} months for a ${sentenceMonths}-month sentence (PS 5331.02 table).`,
    );
  }

  // 4. FSA time credits — BOP's own projection model, from its "FSA Time
  //    Credit Application Guide" (2026): credits post per completed 30 days
  //    served; everyone starts at 10 per 30 and moves to 15 after the 7th
  //    increment if minimum/low risk; "individuals have to serve the time to
  //    earn the credits, and they cannot earn additional credits while in the
  //    community on time credits". The transfer date is the first day on which
  //    days served plus credits earned reach the release date.
  const minLow = input.risk === 'minimum' || input.risk === 'low';
  const creditsAfter = (daysServed: number): number => {
    if (!input.fsaEligible) return 0;
    const earning = Math.max(0, daysServed - input.earningDelayDays) * input.participation;
    const n = Math.floor(earning / RULES.ftcPeriodDays);
    if (!minLow) return n * RULES.ftcBaseDaysPer30;
    const base = Math.min(n, input.basePeriods);
    return base * RULES.ftcBaseDaysPer30 + (n - base) * (RULES.ftcBaseDaysPer30 + RULES.ftcBonusDaysPer30);
  };

  let blocker: string | undefined;
  if (!input.fsaEligible) {
    blocker =
      'Not eligible to earn or apply credits: the offense is on the § 3632(d)(4)(D) list, or there is a final order of removal (§ 3632(d)(4)(E)).';
  } else if (!minLow) {
    blocker =
      'Credits are earned at 10 days per 30, but BOP applies them only once the PATTERN risk is minimum or low (or a warden approves a petition), and gives medium- and high-risk people no projected FSA date (PS 5410.01).';
  }
  const canApply = !blocker;

  let projectedRelease = afterRdap;
  let appliedToSR = 0;
  let placement: Date | null = null;
  let earned = 0;
  if (canApply) {
    // First day D with D + credits(D) ≥ the release date.
    let d = start;
    while (addDays(d, creditsAfter(diffDays(d, start))) < afterRdap) d = addDays(d, 1);
    earned = creditsAfter(diffDays(d, start));
    if (input.supervisedRelease) {
      // Up to 12 months toward supervised release (§ 3624(g)(3)). BOP says
      // "365 days"; its RDAP example subtracts a calendar year across a leap
      // day, so a full year is taken as 12 calendar months.
      const yearBack = addMonths(afterRdap, -12);
      projectedRelease = earned >= diffDays(afterRdap, yearBack) ? yearBack : addDays(afterRdap, -earned);
      if (projectedRelease < start) projectedRelease = start;
      appliedToSR = diffDays(afterRdap, projectedRelease);
    } else {
      notes.push(
        'No supervised release term: credits can only move the date of transfer to prerelease custody (RRC or home confinement), not the release date itself (28 CFR 523.44(d)(2)).',
      );
    }
    placement = d < projectedRelease ? d : null;
  } else if (input.fsaEligible) {
    earned = creditsAfter(diffDays(afterRdap, start));
  }
  const prereleaseFtc = placement;
  const towardPrerelease = prereleaseFtc ? diffDays(projectedRelease, prereleaseFtc) : 0;
  const earnedByRelease = earned;

  // 5. Second Chance Act placement, added to the FTC days.
  const ftcAnchor = prereleaseFtc ?? projectedRelease;
  const scaMaxDate = max(addMonths(ftcAnchor, -RULES.scaMaxMonths), start);
  const scaDate = max(addMonths(ftcAnchor, -input.scaMonths), start);
  const assumedScaDays = diffDays(ftcAnchor, scaDate);
  const hcCap = Math.min(
    Math.floor(termDays * RULES.scaHomeConfinementPct),
    diffDays(projectedRelease, addMonths(projectedRelease, -RULES.scaHomeConfinementMaxMonths)),
  );
  const hcFrom = addDays(projectedRelease, -hcCap);

  const earliestPrerelease = scaDate < ftcAnchor ? scaDate : ftcAnchor;
  const releaseWeekday = previousWeekday(projectedRelease);
  if (iso(releaseWeekday) !== iso(projectedRelease)) {
    notes.push(
      'The projected date falls on a weekend; § 3624(a) lets BOP release on the preceding weekday. Legal holidays at the place of confinement can move it too — we don’t adjust for those.',
    );
  }
  if (input.jailCreditDays > 0) {
    notes.push(
      'Prior-custody (jail) credit shortens the time to serve, but credits can’t be earned for time in detention before the sentence commenced (§ 3632(d)(4)(B)(ii)).',
    );
  }
  if (input.rdap && canApply) {
    notes.push(
      'With RDAP, BOP must leave room for at least 120 days of community-based treatment; if time runs short it reduces the credits applied to supervised release (PS 5410.01 §11).',
    );
  }

  const served = diffDays(projectedRelease, start) + 1 + input.jailCreditDays;

  const milestones: Milestone[] = [{ key: 'start', label: 'Sentence begins', date: iso(start) }];
  if (assumedScaDays > 0) milestones.push({ key: 'prerelease-sca', label: 'Prerelease with Second Chance Act time', date: iso(scaDate) });
  if (prereleaseFtc) milestones.push({ key: 'prerelease-ftc', label: 'Prerelease custody from FSA credits', date: iso(prereleaseFtc) });
  milestones.push({
    key: 'release',
    label: appliedToSR > 0 ? 'Early transfer to supervised release' : 'Projected release',
    date: iso(projectedRelease),
  });
  if (iso(statutoryRelease) !== iso(projectedRelease)) {
    milestones.push({ key: 'srd', label: 'Release with good conduct time only', date: iso(statutoryRelease) });
  }
  milestones.push({ key: 'full-term', label: 'Full term', date: iso(fullTerm) });

  return {
    input,
    sentenceMonths,
    termDays,
    fullTerm: iso(fullTerm),
    gctDays,
    gctEligible,
    statutoryRelease: iso(statutoryRelease),
    rdapMonthsApplied,
    rdapCapMonths,
    afterRdap: iso(afterRdap),
    ftc: {
      eligible: input.fsaEligible,
      canApply,
      blocker,
      ratePer30: !input.fsaEligible ? 0 : minLow ? RULES.ftcBaseDaysPer30 + RULES.ftcBonusDaysPer30 : RULES.ftcBaseDaysPer30,
      earnedByRelease,
      appliedToSupervisedRelease: appliedToSR,
      towardPrerelease,
      prereleaseDate: prereleaseFtc ? iso(prereleaseFtc) : null,
    },
    sca: {
      assumedDays: assumedScaDays,
      maxDate: iso(scaMaxDate),
      homeConfinementCapDays: hcCap,
      homeConfinementFrom: iso(hcFrom),
    },
    projectedRelease: iso(projectedRelease),
    releaseWeekday: iso(releaseWeekday),
    earliestPrerelease: iso(earliestPrerelease),
    daysServedToRelease: served,
    percentOfTermServed: Math.round((served / termDays) * 1000) / 10,
    milestones,
    notes,
  };
}

function clamp(n: number, lo: number, hi: number): number {
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo;
}

export function sanitize(i: CalcInput): CalcInput {
  const okDate = /^\d{4}-\d{2}-\d{2}$/.test(i.start) && !Number.isNaN(parseDate(i.start).getTime());
  return {
    ...i,
    start: okDate ? i.start : DEFAULT_INPUT.start,
    years: Math.floor(clamp(i.years, 0, 60)),
    months: Math.floor(clamp(i.months, 0, 11)),
    days: Math.floor(clamp(i.days, 0, 30)),
    jailCreditDays: Math.floor(clamp(i.jailCreditDays, 0, 3650)),
    participation: clamp(i.participation, 0, 1),
    earningDelayDays: Math.floor(clamp(i.earningDelayDays, 0, 365)),
    basePeriods: Math.floor(clamp(i.basePeriods, 0, 240)),
    rdapMonths: Math.floor(clamp(i.rdapMonths, 0, RULES.rdapMaxMonths)),
    scaMonths: Math.floor(clamp(i.scaMonths, 0, RULES.scaMaxMonths)),
  };
}

// ── URL state ─────────────────────────────────────────────────────────────

const KEYS: Record<keyof CalcInput, string> = {
  start: 's',
  years: 'y',
  months: 'm',
  days: 'd',
  jailCreditDays: 'jc',
  diploma: 'ged',
  fsaEligible: 'fsa',
  risk: 'r',
  supervisedRelease: 'sr',
  participation: 'p',
  earningDelayDays: 'dl',
  basePeriods: 'b',
  rdap: 'rdap',
  rdapMonths: 'rm',
  scaMonths: 'sca',
};

export function toSearchParams(i: CalcInput): URLSearchParams {
  const p = new URLSearchParams();
  for (const [k, short] of Object.entries(KEYS) as [keyof CalcInput, string][]) {
    const v = i[k];
    // The start date always travels, so a shared link survives a change of default.
    if (v === DEFAULT_INPUT[k] && k !== 'start') continue;
    p.set(short, typeof v === 'boolean' ? (v ? '1' : '0') : String(v));
  }
  return p;
}

export function fromSearchParams(p: URLSearchParams | Record<string, string | string[] | undefined>): CalcInput {
  const get = (short: string): string | undefined => {
    if (p instanceof URLSearchParams) return p.get(short) ?? undefined;
    const v = p[short];
    return Array.isArray(v) ? v[0] : v;
  };
  const out: CalcInput = { ...DEFAULT_INPUT };
  for (const [k, short] of Object.entries(KEYS) as [keyof CalcInput, string][]) {
    const v = get(short);
    if (v === undefined) continue;
    const def = DEFAULT_INPUT[k];
    if (typeof def === 'boolean') (out[k] as boolean) = v === '1';
    else if (typeof def === 'number') (out[k] as number) = Number(v);
    else if (k === 'risk') out.risk = (['minimum', 'low', 'medium', 'high'] as Risk[]).includes(v as Risk) ? (v as Risk) : def as Risk;
    else (out[k] as string) = v;
  }
  return sanitize(out);
}
