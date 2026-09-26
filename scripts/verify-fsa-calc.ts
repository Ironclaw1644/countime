/**
 * npm run verify:fsa-calc
 *
 * Asserts the release-date calculator against worked examples published by
 * the Bureau of Prisons itself, plus edge cases derived from the statute.
 * Exits non-zero on any mismatch, so a rule change that breaks the maths
 * can't ship quietly.
 *
 * Primary examples:
 *  - GCT: 87 FR 7938 (Feb. 11, 2022), "Good Conduct Time Credit Under the
 *    First Step Act", Table 1, Alternative 3 rows (the method BOP adopted).
 *    https://www.federalregister.gov/documents/2022/02/11/2022-02876/good-conduct-time-credit-under-the-first-step-act
 *  - FTC: BOP "FSA Time Credit Application Guide" handout (2026).
 *    https://www.bop.gov/resources/docs/fsa_time_credit_handout.pdf
 *  - RDAP tiers: BOP Program Statement 5331.02 CN-3 §11.
 */
import { calculate, DEFAULT_INPUT, fromSearchParams, rdapCapFor, toSearchParams, type CalcInput } from '../lib/fsa/calc';
import { RULES, SOURCES } from '../lib/fsa/rules';

let failures = 0;
let passes = 0;

function eq<T>(label: string, actual: T, expected: T) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    passes++;
  } else {
    failures++;
    console.error(`✗ ${label}\n    expected ${JSON.stringify(expected)}\n    actual   ${JSON.stringify(actual)}`);
  }
}

const run = (over: Partial<CalcInput>) => calculate({ ...DEFAULT_INPUT, ...over });

// Isolate good conduct time: no credits in play.
const gctOnly = (start: string, months: number, days = 0) =>
  run({ start, years: Math.floor(months / 12), months: months % 12, days, fsaEligible: false });

// ── 1. BOP's GCT table (prison term starting Jan. 1, 2020) ────────────────
const table1: [number, number, number, string][] = [
  // months, days, total GCT, release date
  [24, 0, 108, '2021-09-14'],
  [24, 1, 108, '2021-09-15'],
  [25, 0, 112, '2021-10-11'],
  [26, 0, 116, '2021-11-04'],
  [32, 0, 143, '2022-04-10'],
  [36, 0, 162, '2022-07-22'],
  [37, 0, 166, '2022-08-18'],
];
for (const [m, d, gct, date] of table1) {
  const r = gctOnly('2020-01-01', m, d);
  eq(`GCT table: ${m} months + ${d} days → GCT`, r.gctDays, gct);
  eq(`GCT table: ${m} months + ${d} days → release`, r.statutoryRelease, date);
}

// ── 2. BOP handout, Example 1: 24 months, arrived Jan 1, 2025 ─────────────
{
  const r = run({ start: '2025-01-01', years: 2, risk: 'low' });
  eq('Handout ex. 1: GCT release date', r.statutoryRelease, '2026-09-14');
  eq('Handout ex. 1: FSA conditional release date', r.projectedRelease, '2026-03-23');
  eq('Handout ex. 1: credits earned', r.ftc.earnedByRelease, 175);
  eq('Handout ex. 1: all credits to supervised release (none left for RRC/HC)', r.ftc.prereleaseDate, null);
}

// ── 3. BOP handout, Example 2: 60 months, arrived Jan 1, 2025 ─────────────
{
  const r = run({ start: '2025-01-01', years: 5, risk: 'low' });
  eq('Handout ex. 2: full term', r.fullTerm, '2029-12-31');
  eq('Handout ex. 2: GCT days', r.gctDays, 270);
  eq('Handout ex. 2: GCT release date', r.statutoryRelease, '2029-04-05');
  eq('Handout ex. 2: conditional placement date', r.ftc.prereleaseDate, '2027-12-02');
  eq('Handout ex. 2: conditional release date', r.projectedRelease, '2028-04-05');
  eq('Handout ex. 2: credits earned', r.ftc.earnedByRelease, 490);
  eq('Handout ex. 2: credits left for RRC/HC', r.ftc.earnedByRelease - r.ftc.appliedToSupervisedRelease, 125);
}

// ── 4. BOP handout, Example 3: 60 months + § 3621(e) RDAP ─────────────────
{
  const r = run({ start: '2025-01-01', years: 5, risk: 'low', rdap: true, rdapMonths: 12 });
  eq('Handout ex. 3: 3621(e) RDAP release date', r.afterRdap, '2028-04-05');
  eq('Handout ex. 3: conditional placement date', r.ftc.prereleaseDate, '2027-04-01');
  eq('Handout ex. 3: FSRDAP conditional release date', r.projectedRelease, '2027-04-05');
  eq('Handout ex. 3: credits earned', r.ftc.earnedByRelease, 370);
}

// ── 5. BOP handout, 120 months, arrived Jan 1, 2025 ───────────────────────
{
  const r = run({ start: '2025-01-01', years: 10, risk: 'minimum' });
  eq('Handout 120 mo: full term', r.fullTerm, '2034-12-31');
  eq('Handout 120 mo: GCT days', r.gctDays, 540);
  eq('Handout 120 mo: GCT release date', r.statutoryRelease, '2033-07-09');
  eq('Handout 120 mo: conditional release date', r.projectedRelease, '2032-07-09');
  eq('Handout 120 mo: credits earned', r.ftc.earnedByRelease, 1015);
  eq('Handout 120 mo: credits left for RRC/HC', r.ftc.earnedByRelease - r.ftc.appliedToSupervisedRelease, 650);
  // The handout prints a placement date of Sept 28, 2030, but its own numbers
  // (GCT release July 9, 2033 less 1,015 credits) give Oct 2, 2030. We follow
  // the arithmetic and say so on the calculator page.
  eq('Handout 120 mo: placement (from BOP’s own credit count)', r.ftc.prereleaseDate, '2030-10-02');
}

// ── 6. Statutory edges ────────────────────────────────────────────────────
{
  const exact = gctOnly('2026-01-01', 12);
  eq('12 months exactly earns no GCT ("more than 1 year")', exact.gctDays, 0);
  eq('12 months exactly: release is the full term', exact.statutoryRelease, '2026-12-31');

  const dayOver = gctOnly('2026-01-01', 12, 1);
  eq('12 months and a day earns 54 days', dayOver.gctDays, 54);
  eq('12 months and a day: release date', dayOver.statutoryRelease, '2026-11-08');
  eq('…which is a Sunday, so § 3624(a) allows the Friday before', dayOver.releaseWeekday, '2026-11-06');

  const noGed = run({ start: '2026-01-01', years: 5, fsaEligible: false, diploma: false });
  eq('No diploma/GED progress: 42 days a year (28 CFR 523.20(d)(2)(ii))', noGed.gctDays, 210);

  const jail = run({ start: '2026-01-01', years: 5, fsaEligible: false, jailCreditDays: 30 });
  eq('Jail credit shortens the full term day for day', jail.fullTerm, '2030-12-01');
  eq('Jail credit does not change GCT (it is on the sentence imposed)', jail.gctDays, 270);
}

// ── 7. Eligibility ────────────────────────────────────────────────────────
{
  const excluded = run({ start: '2025-01-01', years: 5, fsaEligible: false });
  eq('Excluded offense: no credits', excluded.ftc.earnedByRelease, 0);
  eq('Excluded offense: release is the GCT date', excluded.projectedRelease, '2029-04-05');

  const medium = run({ start: '2025-01-01', years: 5, risk: 'medium' });
  eq('Medium risk: credits not applied', medium.ftc.canApply, false);
  eq('Medium risk: release stays at the GCT date', medium.projectedRelease, '2029-04-05');
  eq('Medium risk: still earns 10 per 30 served', medium.ftc.ratePer30, 10);

  const noSr = run({ start: '2025-01-01', years: 5, risk: 'low', supervisedRelease: false });
  eq('No supervised release term: release stays at the GCT date', noSr.projectedRelease, '2029-04-05');
  eq('No supervised release term: every credit goes to prerelease custody', noSr.ftc.prereleaseDate, '2027-12-02');
}

// ── 8. RDAP tiers (PS 5331.02 §11) ────────────────────────────────────────
eq('RDAP cap, 30 months', rdapCapFor(30), 6);
eq('RDAP cap, 31 months', rdapCapFor(31), 9);
eq('RDAP cap, 36 months', rdapCapFor(36), 9);
eq('RDAP cap, 37 months', rdapCapFor(37), 12);
{
  const r = run({ start: '2026-01-01', years: 2, months: 6, rdap: true, rdapMonths: 12, fsaEligible: false });
  eq('RDAP request above the tier is capped', r.rdapMonthsApplied, 6);
}

// ── 9. Second Chance Act ──────────────────────────────────────────────────
{
  const r = run({ start: '2025-01-01', years: 5, risk: 'low', scaMonths: 6 });
  eq('SCA months stack on the FTC placement date', r.earliestPrerelease, '2027-06-02');
  eq('Home confinement cap: shorter of 10% of term or 6 months', r.sca.homeConfinementCapDays, 182);
}

// ── 10. Numbers match their sources ───────────────────────────────────────
eq('54 days a year (§ 3624(b)(1))', RULES.gctDaysPerYear, 54);
eq('10 days per 30 (§ 3632(d)(4)(A)(i))', RULES.ftcBaseDaysPer30, 10);
eq('+5 per 30 for minimum/low (§ 3632(d)(4)(A)(ii))', RULES.ftcBonusDaysPer30, 5);
eq('12 months to supervised release (§ 3624(g)(3))', RULES.ftcMaxTowardSupervisedReleaseDays, 365);
eq('SCA ceiling 12 months (§ 3624(c)(1))', RULES.scaMaxMonths, 12);
eq('RDAP ceiling one year (§ 3621(e)(2)(B))', RULES.rdapMaxMonths, 12);
for (const s of Object.values(SOURCES)) {
  eq(`Source ${s.id} has an https URL and a quote`, /^https:\/\//.test(s.url) && s.quote.length > 40, true);
}

// ── 11. Shareable URLs round-trip ─────────────────────────────────────────
{
  const input: CalcInput = { ...DEFAULT_INPUT, start: '2027-02-15', years: 3, months: 4, risk: 'minimum', rdap: true, scaMonths: 3 };
  eq('URL params round-trip', fromSearchParams(toSearchParams(input)), input);
  eq('Garbage params fall back to safe values', fromSearchParams(new URLSearchParams('y=abc&s=nope&r=evil')).risk, DEFAULT_INPUT.risk);
}

console.log(`\nverify:fsa-calc — ${passes} passed, ${failures} failed`);
if (failures > 0) process.exit(1);
