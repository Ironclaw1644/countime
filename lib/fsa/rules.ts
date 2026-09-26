/**
 * The rules behind the release-date calculator, each tied to the text it
 * comes from.
 *
 * House rule for this file: nothing goes in without a source someone actually
 * opened and read. Every `quote` below was copied from the fetched page on
 * 2026-09-26 (raw copies were kept during the build for checking). If a rule
 * changes, change the quote and the number together — `npm run verify:fsa-calc`
 * asserts the calculator against worked examples built from these numbers.
 */

export type SourceId =
  | 'usc-3585'
  | 'usc-3624a'
  | 'usc-3624b'
  | 'usc-3624c'
  | 'usc-3624g'
  | 'usc-3632d4'
  | 'usc-3632d4d'
  | 'usc-3621e'
  | 'cfr-523-20'
  | 'cfr-523-42'
  | 'cfr-523-44'
  | 'cfr-550-55'
  | 'ps-5410'
  | 'ps-5331'
  | 'fr-2026-17752';

export type Source = {
  id: SourceId;
  /** Short citation as a lawyer would write it. */
  cite: string;
  title: string;
  url: string;
  /** Operative words, verbatim. */
  quote: string;
};

export const SOURCES: Record<SourceId, Source> = {
  'usc-3585': {
    id: 'usc-3585',
    cite: '18 U.S.C. § 3585(a)–(b)',
    title: 'Calculation of a term of imprisonment',
    url: 'https://www.law.cornell.edu/uscode/text/18/3585',
    quote:
      'A sentence to a term of imprisonment commences on the date the defendant is received in custody awaiting transportation to, or arrives voluntarily to commence service of sentence at, the official detention facility at which the sentence is to be served. … A defendant shall be given credit toward the service of a term of imprisonment for any time he has spent in official detention prior to the date the sentence commences',
  },
  'usc-3624a': {
    id: 'usc-3624a',
    cite: '18 U.S.C. § 3624(a)',
    title: 'Date of release',
    url: 'https://www.law.cornell.edu/uscode/text/18/3624',
    quote:
      'If the date for a prisoner’s release falls on a Saturday, a Sunday, or a legal holiday at the place of confinement, the prisoner may be released by the Bureau on the last preceding weekday.',
  },
  'usc-3624b': {
    id: 'usc-3624b',
    cite: '18 U.S.C. § 3624(b)(1)',
    title: 'Good conduct time',
    url: 'https://www.law.cornell.edu/uscode/text/18/3624',
    quote:
      'a prisoner who is serving a term of imprisonment of more than 1 year … may receive credit toward the service of the prisoner’s sentence of up to 54 days for each year of the prisoner’s sentence imposed by the court',
  },
  'usc-3624c': {
    id: 'usc-3624c',
    cite: '18 U.S.C. § 3624(c)(1)–(2)',
    title: 'Prerelease custody (Second Chance Act)',
    url: 'https://www.law.cornell.edu/uscode/text/18/3624',
    quote:
      'The Director of the Bureau of Prisons shall, to the extent practicable, ensure that a prisoner serving a term of imprisonment spends a portion of the final months of that term (not to exceed 12 months) … The authority under this subsection may be used to place a prisoner in home confinement for the shorter of 10 percent of the term of imprisonment of that prisoner or 6 months.',
  },
  'usc-3624g': {
    id: 'usc-3624g',
    cite: '18 U.S.C. § 3624(g)(1), (g)(3)',
    title: 'Prerelease custody or supervised release for FSA participants',
    url: 'https://www.law.cornell.edu/uscode/text/18/3624',
    quote:
      'has earned time credits … in an amount that is equal to the remainder of the prisoner’s imposed term of imprisonment … the Director of the Bureau of Prisons may transfer the prisoner to begin any such term of supervised release at an earlier date, not to exceed 12 months, based on the application of time credits under section 3632.',
  },
  'usc-3632d4': {
    id: 'usc-3632d4',
    cite: '18 U.S.C. § 3632(d)(4)(A)–(C)',
    title: 'First Step Act time credits',
    url: 'https://www.law.cornell.edu/uscode/text/18/3632',
    quote:
      'A prisoner shall earn 10 days of time credits for every 30 days of successful participation … A prisoner determined by the Bureau of Prisons to be at a minimum or low risk for recidivating, who, over 2 consecutive assessments, has not increased their risk of recidivism, shall earn an additional 5 days of time credits for every 30 days of successful participation … A prisoner may not earn time credits under this paragraph for an evidence-based recidivism reduction program that the prisoner successfully completed— … (ii) during official detention prior to the date that the prisoner’s sentence commences under section 3585(a).',
  },
  'usc-3632d4d': {
    id: 'usc-3632d4d',
    cite: '18 U.S.C. § 3632(d)(4)(D)–(E)',
    title: 'Offenses that cannot earn credits; final orders of removal',
    url: 'https://www.law.cornell.edu/uscode/text/18/3632',
    quote:
      'A prisoner is ineligible to receive time credits under this paragraph if the prisoner is serving a sentence for a conviction under any of the following provisions of law … A prisoner is ineligible to apply time credits under subparagraph (C) if the prisoner is the subject of a final order of removal',
  },
  'usc-3621e': {
    id: 'usc-3621e',
    cite: '18 U.S.C. § 3621(e)(2)(B)',
    title: 'RDAP early release',
    url: 'https://www.law.cornell.edu/uscode/text/18/3621',
    quote:
      'The period a prisoner convicted of a nonviolent offense remains in custody after successfully completing a treatment program may be reduced by the Bureau of Prisons, but such reduction may not be more than one year from the term the prisoner must otherwise serve.',
  },
  'cfr-523-20': {
    id: 'cfr-523-20',
    cite: '28 CFR § 523.20(b), (d)(2)',
    title: 'Good conduct time — how BOP projects it',
    url: 'https://www.ecfr.gov/current/title-28/chapter-V/subchapter-B/part-523/subpart-C/section-523.20',
    quote:
      'the Bureau will initially determine a projected release date by calculating the maximum GCT credit possible based on the length of an inmate’s imposed sentence. … The Bureau will award prorated credit for any partial final year of the sentence imposed … Up to 42 days of GCT credit for each year of the sentence imposed … if the inmate does not meet conditions described in paragraph (d)(2)(i)',
  },
  'cfr-523-42': {
    id: 'cfr-523-42',
    cite: '28 CFR § 523.42',
    title: 'Earning FSA time credits',
    url: 'https://www.ecfr.gov/current/title-28/chapter-V/subchapter-B/part-523/subpart-E/section-523.42',
    quote:
      'For every thirty-day period that an eligible inmate has successfully participated in EBRR Programs or PAs … that inmate will earn ten days of FSA Time Credits. … an additional five days … if the inmate: (i) Is determined by the Bureau to be at a minimum or low risk for recidivating; and (ii) Has maintained a consistent minimum or low risk of recidivism over the most recent two consecutive risk and needs assessments',
  },
  'cfr-523-44': {
    id: 'cfr-523-44',
    cite: '28 CFR § 523.44',
    title: 'Applying FSA time credits',
    url: 'https://www.ecfr.gov/current/title-28/chapter-V/subchapter-B/part-523/subpart-E/section-523.44',
    quote:
      'The Bureau may apply FSA Time Credits toward early transfer to supervised release … only when an eligible inmate has … a term of supervised release after imprisonment included as part of his or her sentence … [and] The application of FSA Time Credits would result in transfer to supervised release no earlier than 12 months before the date that transfer to supervised release would otherwise have occurred.',
  },
  'cfr-550-55': {
    id: 'cfr-550-55',
    cite: '28 CFR § 550.55',
    title: 'RDAP early release eligibility',
    url: 'https://www.ecfr.gov/current/title-28/chapter-V/subchapter-C/part-550/subpart-F/section-550.55',
    quote:
      'Inmates may be eligible for early release by a period not to exceed twelve months if they: (1) Were sentenced … for a nonviolent offense … and (2) Successfully complete a RDAP',
  },
  'ps-5410': {
    id: 'ps-5410',
    cite: 'BOP Program Statement 5410.01 (CN-2)',
    title: 'First Step Act of 2018 – Time Credits: Procedures for Implementation of 18 U.S.C. § 3632(d)(4)',
    url: 'https://www.bop.gov/policy/progstat/5410.01_cn2.pdf',
    quote:
      'FTCs are auto-calculated based on 30-day increments in earning status. Partial credit will not be awarded. … the Bureau will calculate an inmate’s PRD by assuming that an inmate will remain in earning status throughout his or her sentence, including while in prerelease custody. … The RRC and/or HC recommendation will include the total number of days recommended based on the Five Factor Review … plus the remaining number of FTC days not applied to supervised release … The 3621(e) benefit will be applied first to the inmate’s sentence computation, followed by the application of FTCs',
  },
  'ps-5331': {
    id: 'ps-5331',
    cite: 'BOP Program Statement 5331.02 (CN-3, May 7, 2026)',
    title: 'Early Release Procedures Under 18 U.S.C. § 3621(e)',
    url: 'https://www.bop.gov/policy/progstat/5331_002_CN-3.pdf',
    quote:
      '30 MONTHS or LESS — No more than 6 months; 31-36 MONTHS — No more than 9 months; 37 MONTHS OR MORE — No more than 12 months. The early release time-frame reductions shown on the table are not pro-rated by days.',
  },
  'fr-2026-17752': {
    id: 'fr-2026-17752',
    cite: '91 FR 55740 (Aug. 31, 2026), effective Sept. 30, 2026',
    title: 'First Step Act Time Credits — Revisions (interim final rule)',
    url: 'https://www.govinfo.gov/content/pkg/FR-2026-08-31/html/2026-17752.htm',
    quote:
      'An eligible inmate begins earning FSA Time Credits after the inmate’s term of imprisonment commences. … by removing the parenthetical, we leave intact the understanding that a term of imprisonment begins either (1) on the date the defendant is received in custody pending transportation to the designated facility where the sentence will be served, or (2) on the date the defendant voluntarily surrenders at the institution where the sentence will be served. … this change does not mean that every eligible inmate will automatically begin earning Time Credits immediately after their sentence is imposed. … the inmate must still complete evidence-based recidivism reduction (EBRR) programming or productive activities assigned to them based on their assessed needs. … the average length of time from sentencing to arrival at the designated facility to be 66.06 days.',
  },
};

/** The numbers, each pointing at the source above that sets it. */
export const RULES = {
  /** § 3624(b)(1); 28 CFR 523.20(d)(2)(i) */
  gctDaysPerYear: 54,
  /** 28 CFR 523.20(d)(2)(ii) — no diploma/GED and not making progress. */
  gctDaysPerYearNoDiploma: 42,
  /** § 3632(d)(4)(A)(i) */
  ftcBaseDaysPer30: 10,
  /** § 3632(d)(4)(A)(ii) — minimum/low risk, two consecutive assessments. */
  ftcBonusDaysPer30: 5,
  /** PS 5410.01 §8 — credits post per completed 30 days, no partial credit. */
  ftcPeriodDays: 30,
  /** § 3624(g)(3); 28 CFR 523.44(d)(3) */
  ftcMaxTowardSupervisedReleaseDays: 365,
  /** § 3624(c)(1) — months, final portion of the term. */
  scaMaxMonths: 12,
  /** § 3624(c)(2) — home confinement: shorter of 10% of term or 6 months. */
  scaHomeConfinementPct: 0.1,
  scaHomeConfinementMaxMonths: 6,
  /** § 3621(e)(2)(B) — statutory ceiling. */
  rdapMaxMonths: 12,
  /** PS 5331.02 §11 — ceiling by sentence length in whole months. */
  rdapTiers: [
    { maxSentenceMonths: 30, maxReductionMonths: 6 },
    { maxSentenceMonths: 36, maxReductionMonths: 9 },
    { maxSentenceMonths: Infinity, maxReductionMonths: 12 },
  ],
  /** PS 5410.01 §11 — RDAP's community-based treatment component. */
  rdapCommunityTreatmentDays: 120,
  /** 91 FR 55740 — the interim rule that starts credits when the sentence commences. */
  ftcRuleEffective: '2026-09-30',
  /** 91 FR 55742 — BOP's average, sentencing to arrival at the designated prison, 2023–2025 (66.06 days). */
  avgDaysSentencingToArrival: 66,
} as const;

export const RULE_SOURCES: Record<keyof typeof RULES, SourceId[]> = {
  gctDaysPerYear: ['usc-3624b', 'cfr-523-20'],
  gctDaysPerYearNoDiploma: ['cfr-523-20'],
  ftcBaseDaysPer30: ['usc-3632d4', 'cfr-523-42'],
  ftcBonusDaysPer30: ['usc-3632d4', 'cfr-523-42'],
  ftcPeriodDays: ['ps-5410'],
  ftcMaxTowardSupervisedReleaseDays: ['usc-3624g', 'cfr-523-44'],
  scaMaxMonths: ['usc-3624c'],
  scaHomeConfinementPct: ['usc-3624c'],
  scaHomeConfinementMaxMonths: ['usc-3624c'],
  rdapMaxMonths: ['usc-3621e', 'cfr-550-55'],
  rdapTiers: ['ps-5331'],
  rdapCommunityTreatmentDays: ['ps-5410'],
  ftcRuleEffective: ['fr-2026-17752'],
  avgDaysSentencingToArrival: ['fr-2026-17752'],
};
