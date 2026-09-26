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
 *      Earning starts when the sentence commences under the interim rule
 *      effective Sept. 30, 2026 (91 FR 55740), or on arrival at the
 *      designated prison under the old rule; both are computed so the page
 *      can show the difference.
 *   5. Second Chance Act placement (§ 3624(c)) is added on top of the FTC days,
 *      as PS 5410.01 describes the RRC/HC referral: Five-Factor days plus the
 *      FTC days not used for supervised release. BOP decides that number; the
 *      reader supplies an assumption, capped at 12 months.
 *
 * When the sentence commences (§ 3585(a), as the 2026 rule restates it):
 * on the day of sentencing for someone already in custody and remanded, or on
 * the day of self-surrender at the designated prison.
 *
 * Prior custody is asked for in years, months and days, because that is how
 * people remember it. It is turned into days by counting back from the
 * sentencing date on the calendar — 1 year before 15 June 2026 is 15 June
 * 2025, i.e. 365 days — not by assuming 30-day months. If the time was served
 * in an earlier stretch the true count can differ by a day or two around
 * short months and leap days; a BOP sentence computation's exact day count
 * can be entered instead.
 *
 * Where the rules leave a choice (rounding a prorated year, counting the
 * start date as day one), the choice is written down in NOTES and shown on
 * the page. All date maths is in UTC on calendar dates.
 */
import { RULES } from './rules';

export type Risk = 'minimum' | 'low' | 'medium' | 'high';
/** In custody when sentenced (remanded to the Marshals), or reporting on their own. */
export type StartMode = 'custody' | 'surrender';
/** Which rule decides when time credits start: the Sept. 30, 2026 interim rule, or the one it replaced. */
export type FtcRule = 'new' | 'old';

export type CalcInput = {
  /** ISO date the sentence was imposed. */
  sentenced: string;
  startMode: StartMode;
  /** ISO date of self-surrender at the designated prison (startMode 'surrender'). */
  surrender: string;
  /** ISO date of arrival at the designated prison (startMode 'custody'); '' = not known yet. */
  arrived: string;
  years: number;
  months: number;
  days: number;
  /** Time locked up before federal sentencing, as people remember it (§ 3585(b)). */
  priorYears: number;
  priorMonths: number;
  priorDays: number;
  /** Exact prior-custody days from a BOP sentence computation; overrides the above when > 0. */
  priorExactDays: number;
  rule: FtcRule;
  /** Earned or making progress toward a diploma/GED (28 CFR 523.20(d)(2)). */
  diploma: boolean;
  /** Not serving a sentence for a § 3632(d)(4)(D) offense and no final order of removal. */
  fsaEligible: boolean;
  risk: Risk;
  /** The judgment includes a term of supervised release. */
  supervisedRelease: boolean;
  /** Share of time in earning status, 0–1. BOP's projection assumes 1. */
  participation: number;
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
  sentenced: '2026-11-02',
  startMode: 'custody',
  surrender: '2027-01-04',
  arrived: '',
  years: 5,
  months: 0,
  days: 0,
  priorYears: 0,
  priorMonths: 0,
  priorDays: 0,
  priorExactDays: 0,
  rule: 'new',
  diploma: true,
  fsaEligible: true,
  risk: 'low',
  supervisedRelease: true,
  participation: 1,
  basePeriods: 7,
  rdap: false,
  rdapMonths: 12,
  scaMonths: 0,
};

export type Milestone = {
  key: 'sentenced' | 'start' | 'arrival' | 'prerelease-sca' | 'prerelease-ftc' | 'release' | 'srd' | 'full-term';
  label: string;
  date: string;
};

export type CalcResult = {
  input: CalcInput;
  /** The day the sentence commenced (§ 3585(a)). */
  commenced: string;
  /** The day of arrival at the designated prison. */
  arrival: string;
  /** Arrival wasn't given, so BOP's own average transit time was assumed. */
  arrivalAssumed: boolean;
  /** The day time credits start to be earned under the chosen rule. */
  earningFrom: string;
  /** § 3585(b) prior-custody credit, in days. */
  priorCustodyDays: number;
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
  /**
   * The same case under the other credit-start rule, when the two differ
   * (only possible when there is time between commencement and arrival).
   */
  compare: {
    rule: FtcRule;
    projectedRelease: string;
    earliestPrerelease: string;
    /** Days by which the new rule's earliest date beats the old rule's (≥ 0). */
    newRuleGainDays: number;
  } | null;
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
const isIsoDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(parseDate(v).getTime());

/**
 * Years/months/days of custody before sentencing → days, counted back from
 * the sentencing date on the calendar (see the header comment).
 */
export function priorCustodyDays(sentenced: string, years: number, months: number, days: number): number {
  const end = parseDate(sentenced);
  const from = addDays(addMonths(end, -(years * 12 + months)), -days);
  return diffDays(end, from);
}

/** When the sentence commenced and when the person reached the designated prison. */
export function startDates(input: CalcInput): { commenced: string; arrival: string; arrivalAssumed: boolean } {
  if (input.startMode === 'surrender') {
    // Self-surrender at the designated prison: both happen the same day.
    return { commenced: input.surrender, arrival: input.surrender, arrivalAssumed: false };
  }
  if (input.arrived) return { commenced: input.sentenced, arrival: input.arrived, arrivalAssumed: false };
  return {
    commenced: input.sentenced,
    arrival: iso(addDays(parseDate(input.sentenced), RULES.avgDaysSentencingToArrival)),
    arrivalAssumed: true,
  };
}

// ── The calculation ───────────────────────────────────────────────────────

export function rdapCapFor(sentenceMonths: number): number {
  const tier = RULES.rdapTiers.find((t) => sentenceMonths <= t.maxSentenceMonths)!;
  return Math.min(tier.maxReductionMonths, RULES.rdapMaxMonths);
}

export function calculate(raw: CalcInput): CalcResult {
  const input = sanitize(raw);
  const primary = project(input, input.rule);
  const other: FtcRule = input.rule === 'new' ? 'old' : 'new';
  if (primary.commenced === primary.arrival || !input.fsaEligible) return { ...primary, compare: null };
  const alt = project(input, other);
  const newer = input.rule === 'new' ? primary : alt;
  const older = input.rule === 'new' ? alt : primary;
  const gain = diffDays(parseDate(older.earliestPrerelease), parseDate(newer.earliestPrerelease));
  return {
    ...primary,
    compare: {
      rule: other,
      projectedRelease: alt.projectedRelease,
      earliestPrerelease: alt.earliestPrerelease,
      newRuleGainDays: Math.max(0, gain),
    },
  };
}

function project(input: CalcInput, rule: FtcRule): Omit<CalcResult, 'compare'> {
  const notes: string[] = [];
  const { commenced, arrival, arrivalAssumed } = startDates(input);
  const start = parseDate(commenced);
  const arrivalDate = parseDate(arrival);
  const earnFrom = rule === 'new' ? start : arrivalDate;
  const earningDelayDays = diffDays(earnFrom, start);

  const priorDays =
    input.priorExactDays > 0
      ? input.priorExactDays
      : priorCustodyDays(input.sentenced, input.priorYears, input.priorMonths, input.priorDays);

  // 1. Full term. The start date is day one, so a 12-month term that begins
  //    on 1 January ends on 31 December.
  const termEndNoCredit = addDays(addMonths(start, input.years * 12 + input.months), input.days - 1);
  const termDays = diffDays(termEndNoCredit, start) + 1;
  const fullTerm = addDays(termEndNoCredit, -priorDays);
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
    const earning = Math.max(0, daysServed - earningDelayDays) * input.participation;
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
  if (priorDays > 0) {
    notes.push(
      `Time locked up before sentencing (${priorDays.toLocaleString('en-US')} days) comes off the sentence day for day, as long as it wasn’t already counted toward another sentence (§ 3585(b)). It doesn’t earn First Step Act credits — those only start once the federal sentence does (§ 3632(d)(4)(B)(ii)).`,
    );
  }
  const effective = parseDate(RULES.ftcRuleEffective);
  if (input.fsaEligible && rule === 'new' && earningDelayDays === 0 && diffDays(arrivalDate, start) > 0) {
    notes.push(
      'Credits here start the day the sentence began, not the day of arrival at the prison. The Sept. 30, 2026 rule says people waiting to be moved can start programming, but they still have to complete the programs or activities they’ve been assigned — being held in a county jail doesn’t earn credits on its own.',
    );
    if (start < effective) {
      notes.push(
        'Some of the time before arrival falls before September 30, 2026, when the new rule took effect. The rule doesn’t say whether BOP will go back and count days from before then. Switch to the old rule to see the date if it doesn’t.',
      );
    }
  }
  if (input.startMode === 'custody' && arrivalAssumed) {
    notes.push(
      `Arrival date not given, so we assumed ${RULES.avgDaysSentencingToArrival} days from sentencing to arriving at the prison — BOP’s own average for 2023–2025.`,
    );
  }
  if (input.rdap && canApply) {
    notes.push(
      'With RDAP, BOP must leave room for at least 120 days of community-based treatment; if time runs short it reduces the credits applied to supervised release (PS 5410.01 §11).',
    );
  }

  const served = diffDays(projectedRelease, start) + 1 + priorDays;

  const milestones: Milestone[] = [];
  if (input.sentenced !== iso(start)) milestones.push({ key: 'sentenced', label: 'Sentenced', date: input.sentenced });
  milestones.push({ key: 'start', label: 'Sentence begins', date: iso(start) });
  if (diffDays(arrivalDate, start) > 0)
    milestones.push({ key: 'arrival', label: arrivalAssumed ? 'Arrives at the prison (estimated)' : 'Arrives at the prison', date: arrival });
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
    commenced,
    arrival,
    arrivalAssumed,
    earningFrom: iso(earnFrom),
    priorCustodyDays: priorDays,
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
  const sentenced = isIsoDate(i.sentenced) ? i.sentenced : DEFAULT_INPUT.sentenced;
  // Neither surrender nor arrival can come before the sentence is imposed.
  const notBefore = (v: string, fallback: string) => (isIsoDate(v) ? (v < sentenced ? sentenced : v) : fallback);
  return {
    ...i,
    sentenced,
    startMode: i.startMode === 'surrender' ? 'surrender' : 'custody',
    surrender: notBefore(i.surrender, sentenced),
    arrived: i.arrived ? notBefore(i.arrived, '') : '',
    rule: i.rule === 'old' ? 'old' : 'new',
    years: Math.floor(clamp(i.years, 0, 60)),
    months: Math.floor(clamp(i.months, 0, 11)),
    days: Math.floor(clamp(i.days, 0, 30)),
    priorYears: Math.floor(clamp(i.priorYears, 0, 20)),
    priorMonths: Math.floor(clamp(i.priorMonths, 0, 11)),
    priorDays: Math.floor(clamp(i.priorDays, 0, 30)),
    priorExactDays: Math.floor(clamp(i.priorExactDays, 0, 7300)),
    participation: clamp(i.participation, 0, 1),
    basePeriods: Math.floor(clamp(i.basePeriods, 0, 240)),
    rdapMonths: Math.floor(clamp(i.rdapMonths, 0, RULES.rdapMaxMonths)),
    scaMonths: Math.floor(clamp(i.scaMonths, 0, RULES.scaMaxMonths)),
  };
}

// ── URL state ─────────────────────────────────────────────────────────────

const KEYS: Record<keyof CalcInput, string> = {
  sentenced: 'sd',
  startMode: 'how',
  surrender: 'ss',
  arrived: 'ar',
  years: 'y',
  months: 'm',
  days: 'd',
  priorYears: 'py',
  priorMonths: 'pm',
  priorDays: 'pd',
  priorExactDays: 'px',
  rule: 'rule',
  diploma: 'ged',
  fsaEligible: 'fsa',
  risk: 'r',
  supervisedRelease: 'sr',
  participation: 'p',
  basePeriods: 'b',
  rdap: 'rdap',
  rdapMonths: 'rm',
  scaMonths: 'sca',
};

export function toSearchParams(i: CalcInput): URLSearchParams {
  const p = new URLSearchParams();
  for (const [k, short] of Object.entries(KEYS) as [keyof CalcInput, string][]) {
    const v = i[k];
    // The dates always travel, so a shared link survives a change of default.
    const isDate = k === 'sentenced' || (k === 'surrender' && i.startMode === 'surrender');
    if (v === DEFAULT_INPUT[k] && !isDate) continue;
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
  // Links shared before Sept. 2026 carried one start date (s) and jail credit
  // in days (jc). Read them as a self-surrender on that date, exact days.
  const legacyStart = get('s');
  if (legacyStart && get('sd') === undefined) {
    out.sentenced = legacyStart;
    out.surrender = legacyStart;
    out.startMode = 'surrender';
  }
  const legacyJail = get('jc');
  if (legacyJail && get('px') === undefined) out.priorExactDays = Number(legacyJail);
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
