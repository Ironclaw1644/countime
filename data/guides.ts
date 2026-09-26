/**
 * Evergreen explainers.
 *
 * Same rule as the calculator: every factual sentence is tied to a source that
 * was opened and read (2026-09-26). `cite` keys resolve against SOURCES in
 * lib/fsa/rules.ts plus the extra pages listed in GUIDE_SOURCES below. Where
 * the law is unsettled, the text says so rather than picking a side.
 */
import { SOURCES, type Source } from '@/lib/fsa/rules';

export type GuideSourceId =
  | keyof typeof SOURCES
  | 'bop-handout'
  | 'bop-faq'
  | 'bop-pattern'
  | 'bop-cutpoints'
  | 'bop-annual-2024'
  | 'bop-rrc'
  | 'cfr-570'
  | 'bop-sca-directive'
  | 'bop-voluntary-surrender'
  | 'ps-5580'
  | 'bop-designations'
  | 'cfr-550-56'
  | 'fr-2022-gct'
  | 'scotus-25-5930';

export const GUIDE_SOURCES: Record<GuideSourceId, Omit<Source, 'id'> & { id: GuideSourceId }> = {
  ...(SOURCES as Record<keyof typeof SOURCES, Omit<Source, 'id'> & { id: GuideSourceId }>),
  'bop-handout': {
    id: 'bop-handout',
    cite: 'BOP, FSA Time Credit Application Guide (2026)',
    title: 'FSA Time Credit Application Guide (handout)',
    url: 'https://www.bop.gov/resources/docs/fsa_time_credit_handout.pdf',
    quote:
      'All inmates come in earning at a rate of ten days per thirty days of programming. … The first 365 days of earned FSA Credits can be applied toward an early release to Supervised Release. Any credits earned beyond that first year are applied toward an earlier transfer to a Halfway House or Home Confinement.',
  },
  'bop-faq': {
    id: 'bop-faq',
    cite: 'BOP, First Step Act FAQ',
    title: 'First Step Act — Frequently Asked Questions',
    url: 'https://www.bop.gov/inmates/fsa/faq.jsp',
    quote:
      'Deportable aliens may earn FTC, but they are not eligible to apply these credits towards their release date if they are subject to a final order of removal under immigration laws. … generally inmates who are ineligible to earn qualifying time credits may only be placed into home confinement for the shorter of 10 percent of the term of imprisonment or six months.',
  },
  'bop-pattern': {
    id: 'bop-pattern',
    cite: 'BOP, PATTERN risk assessment',
    title: 'PATTERN Risk Assessment',
    url: 'https://www.bop.gov/inmates/fsa/pattern.jsp',
    quote:
      'emphasis was placed on a system that accurately measures an inmate’s change during incarceration, and provides opportunities for inmates to reduce their risk scores during periodic reassessments. Currently, PATTERN version 1.3 is being used.',
  },
  'bop-cutpoints': {
    id: 'bop-cutpoints',
    cite: 'BOP, Cut Points Used for PATTERN v. 1.3',
    title: 'Cut Points Used for PATTERN v. 1.3',
    url: 'https://www.bop.gov/inmates/fsa/docs/fsa_cut_points.pdf',
    quote: 'Male – General: Minimum 5 or less; Low 6 to 39; Medium 40 to 54; High 55 or more …',
  },
  'bop-annual-2024': {
    id: 'bop-annual-2024',
    cite: 'DOJ, First Step Act Annual Report (June 2024)',
    title: 'First Step Act Annual Report, June 2024',
    url: 'https://www.bop.gov/inmates/fsa/docs/first-step-act-annual-report-june-2024.pdf',
    quote: 'On May 5, 2022, the FBOP shifted to using PATTERN 1.3 and the revised cut points for the general risk assessment tool',
  },
  'bop-rrc': {
    id: 'bop-rrc',
    cite: 'BOP, Residential Reentry Management Centers',
    title: 'Residential Reentry Management Centers',
    url: 'https://www.bop.gov/about/facilities/residential_reentry_management_centers.jsp',
    quote:
      'The BOP contracts with residential reentry centers (RRCs), also known as halfway houses, to provide assistance to inmates who are nearing release. … Approximately 17-19 months prior to an inmate’s release, an RRC referral recommendation is made by the unit team … offenders are required to pay a subsistence fee … 25 percent of their gross income … Ordinarily, offenders are expected to be employed 40 hours/week within 15 calendar days after their arrival at the RRC.',
  },
  'cfr-570': {
    id: 'cfr-570',
    cite: '28 CFR §§ 570.20–570.21',
    title: 'Community confinement and home detention',
    url: 'https://www.ecfr.gov/current/title-28/chapter-V/subchapter-D/part-570/subpart-B',
    quote:
      'Home detention is defined as a program of confinement and supervision that restricts the defendant to his place of residence continuously, except for authorized absences, enforced by appropriate means of surveillance by the probation office or other monitoring authority.',
  },
  'bop-sca-directive': {
    id: 'bop-sca-directive',
    cite: 'BOP press release, June 17, 2025',
    title: 'FSA directive and Second Chance Act',
    url: 'https://www.bop.gov/news/pdfs/20250618-fsa-directive-and-sca.pdf',
    quote:
      'FSA Earned Time Credits and SCA eligibility will be treated as cumulative and stackable, allowing qualified individuals to serve meaningful portions of their sentences in home confinement when appropriate.',
  },
  'bop-voluntary-surrender': {
    id: 'bop-voluntary-surrender',
    cite: 'BOP, Voluntary Surrenders',
    title: 'Voluntary Surrenders',
    url: 'https://www.bop.gov/inmates/custody_and_care/voluntary_surrenders.jsp',
    quote:
      'When you are ordered by the Court to voluntarily surrender, you will be notified by the U.S. Marshals Service (USMS) of your surrender date and provided with the name of the institution where you are to surrender, OR you will be directed to surrender to the USMS.',
  },
  'ps-5580': {
    id: 'ps-5580',
    cite: 'BOP Program Statement 5580.10 §10 (May 7, 2026)',
    title: 'Inmate Personal Property — voluntary surrender property',
    url: 'https://www.bop.gov/policy/progstat/5580_010.pdf',
    quote:
      'When an inmate voluntarily surrenders to Bureau custody, they will be permitted to retain only the following items: plain wedding band (no stones or intricate markings), earrings for females only (one pair, no stones) with a declared value of less than $100, medical or orthopedic devices, legal documents, religious items approved by the Warden … and prescription glasses.',
  },
  'bop-designations': {
    id: 'bop-designations',
    cite: 'BOP, Designations',
    title: 'Designations',
    url: 'https://www.bop.gov/inmates/custody_and_care/designations.jsp',
    quote:
      'The Bureau attempts to designate inmates to facilities commensurate with their security and program needs within 500 driving miles of their release residence.',
  },
  'cfr-550-56': {
    id: 'cfr-550-56',
    cite: '28 CFR § 550.56',
    title: 'Community Treatment Services',
    url: 'https://www.ecfr.gov/current/title-28/chapter-V/subchapter-C/part-550/subpart-F/section-550.56',
    quote:
      'For inmates to successfully complete all components of RDAP, they must participate in CTS. If inmates refuse or fail to complete CTS, they fail RDAP and are disqualified for any additional incentives.',
  },
  'fr-2022-gct': {
    id: 'fr-2022-gct',
    cite: '87 FR 7938 (Feb. 11, 2022)',
    title: 'Good Conduct Time Credit Under the First Step Act (final rule)',
    url: 'https://www.federalregister.gov/documents/2022/02/11/2022-02876/good-conduct-time-credit-under-the-first-step-act',
    quote:
      'the Bureau adopts the Alternative 3 interpretation described in the proposed rule, under which it awards prorated credit for any partial year in an imposed sentence. … inmates sentenced to one year or less are not eligible for GCT credit.',
  },
  'scotus-25-5930': {
    id: 'scotus-25-5930',
    cite: 'Maxwell v. Dinis, No. 25-5930 (U.S., cert. granted)',
    title: 'Supreme Court docket 25-5930',
    url: 'https://www.supremecourt.gov/search.aspx?filename=/docket/docketfiles/html/public/25-5930.html',
    quote:
      'Whether a claim regarding application of time credits under the First Step Act of 2018 … seeking accelerated transfer to a halfway house or home confinement, can be brought in a habeas petition under 28 U. S. C. §2241.',
  },
};

export type Block =
  | { p: string; cite?: GuideSourceId[] }
  | { list: string[]; cite?: GuideSourceId[] }
  | { note: string; cite?: GuideSourceId[] };

export type Guide = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  readingTime: number;
  published: string;
  updated: string;
  lede: string;
  /** Short facts shown under the lede, e.g. a rule's citation and dates. */
  keyFacts?: { label: string; value: string }[];
  sections: { heading: string; blocks: Block[] }[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: 'fsa-credits-from-sentencing-2026-rule',
    title: 'The September 30, 2026 rule: FSA credits from the day your sentence starts',
    shortTitle: 'The Sept. 30, 2026 credit rule',
    description:
      'A Bureau of Prisons rule effective September 30, 2026 lets First Step Act time credits start when your federal sentence starts, not when you reach your prison. What changed, who it helps, and what is still unsettled.',
    readingTime: 6,
    published: '2026-09-26',
    updated: '2026-09-26',
    lede:
      'Starting September 30, 2026, the Bureau of Prisons’ regulation says you begin earning First Step Act time credits once your federal sentence starts. Before, it said earning began only when you arrived at the prison BOP sent you to. If you stayed locked up after sentencing, that can add weeks or months of earning time.',
    keyFacts: [
      { label: 'Takes effect', value: 'September 30, 2026' },
      { label: 'Published', value: 'August 31, 2026 · 91 FR 55740' },
      { label: 'Type', value: 'Interim final rule (BOP-1183-I)' },
      { label: 'Changes', value: '28 CFR 523.42(a) and 523.44(a)(3)' },
    ],
    sections: [
      {
        heading: 'What changed',
        blocks: [
          {
            p: 'The Bureau of Prisons published an interim final rule in the Federal Register on August 31, 2026 (91 FR 55740, FR Doc. 2026-17752). It takes effect September 30, 2026.',
            cite: ['fr-2026-17752'],
          },
          {
            p: 'It rewrites one sentence of the time-credit regulation, 28 CFR 523.42(a). The old version said earning begins after the term of imprisonment commences, and then defined that as “the date the inmate arrives or voluntarily surrenders at the designated Bureau facility where the sentence will be served.” The new version drops that definition. It now reads: “An eligible inmate begins earning FSA Time Credits after the inmate’s term of imprisonment commences.”',
            cite: ['cfr-523-42', 'fr-2026-17752'],
          },
          {
            p: 'That leaves the ordinary federal rule for when a sentence starts: the day you’re received in custody waiting to be taken to the prison where you’ll serve it, or the day you arrive there on your own.',
            cite: ['usc-3585', 'fr-2026-17752'],
          },
        ],
      },
      {
        heading: 'Why BOP changed it',
        blocks: [
          {
            p: 'BOP says the old wording didn’t match the First Step Act. The rule points to a 2026 First Circuit decision, Miles v. Bowers, which found the old definition “plainly conflicts with the text of the FSA,” and to federal district courts that reached the same result.',
            cite: ['fr-2026-17752'],
          },
          {
            p: 'The statute itself only rules out credits for programs finished “during official detention prior to the date that the prisoner’s sentence commences.” It says nothing about arriving at a particular prison.',
            cite: ['usc-3632d4'],
          },
        ],
      },
      {
        heading: 'Who it helps',
        blocks: [
          {
            p: 'People who were kept in custody at sentencing and then held in a county jail, a regional jail or a federal detention center while waiting to be moved. BOP looked at sentences that started in 2023 through 2025 and found an average of 66 days from sentencing to arrival at the designated prison. It estimates that works out to about 24 days of credits on average.',
            cite: ['fr-2026-17752'],
          },
          {
            p: 'If you self-surrender at your prison, nothing changes for you. Your sentence starts the day you arrive, so earning already started that day.',
            cite: ['usc-3585', 'fr-2026-17752'],
          },
          {
            p: 'Credits still do the same two things: start supervised release up to 12 months early, and move you to a halfway house or home confinement sooner. The rule doesn’t touch the earning rates, the list of offenses that can’t earn credits, or the risk-level requirements.',
            cite: ['usc-3624g', 'usc-3632d4', 'fr-2026-17752'],
          },
        ],
      },
      {
        heading: 'You still have to be in programs',
        blocks: [
          {
            p: 'Starting earlier isn’t automatic. In BOP’s words, the change “does not mean that every eligible inmate will automatically begin earning Time Credits immediately after their sentence is imposed.” You still have to complete the programs or productive activities assigned to you based on your needs assessment.',
            cite: ['fr-2026-17752', 'cfr-523-42'],
          },
          {
            note: 'BOP says the change “allows inmates awaiting transportation to their designated facilities to begin FSA-approved programming.” The rule doesn’t say which programs county jails or Marshals holding facilities will offer, or how that time will be tracked. When you get to your prison, ask your case manager how your time before arrival was counted.',
            cite: ['fr-2026-17752'],
          },
        ],
      },
      {
        heading: 'What isn’t settled yet',
        blocks: [
          {
            p: 'Time before September 30, 2026. The rule doesn’t say whether BOP will go back and count earning time for people whose sentences started before it took effect. The Countime calculator shows your date both ways when it makes a difference.',
            cite: ['fr-2026-17752'],
          },
          {
            p: 'It’s an interim rule. BOP put it in place without advance notice and comment, and took comments through September 30, 2026. A final rule could change the wording.',
            cite: ['fr-2026-17752'],
          },
          {
            p: 'State custody. If you were serving state time and were brought to federal court on a writ, your federal sentence may not start at sentencing. The rule repeats the test courts use: “A federal sentence commences when the defendant is received by the Attorney General for service of his federal sentence.”',
            cite: ['fr-2026-17752'],
          },
          {
            p: 'The Supreme Court case. Maxwell v. Dinis (No. 25-5930) is set for argument November 2, 2026. It asks whether a claim about applying First Step Act credits toward a halfway house or home confinement can be brought in a federal habeas petition under 28 U.S.C. § 2241. It isn’t about when credits start. It is about how people can take BOP’s credit decisions to court.',
            cite: ['scotus-25-5930'],
          },
        ],
      },
      {
        heading: 'The other change in the rule',
        blocks: [
          {
            p: 'The same rule adds a sentence to 28 CFR 523.44(a)(3): credits can be applied for people transferred to BOP under a treaty to serve a sentence imposed in another country, once the U.S. Parole Commission has set an equivalent U.S. Code sentence under 18 U.S.C. § 4106A. BOP says that was already its practice.',
            cite: ['fr-2026-17752'],
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'When does the new First Step Act credit rule take effect?',
        a: 'September 30, 2026. BOP published it on August 31, 2026 as an interim final rule (91 FR 55740).',
      },
      {
        q: 'Do I get First Step Act credits for county jail time before I was sentenced?',
        a: 'No. Time locked up before your federal sentence starts can come off the sentence itself (18 U.S.C. § 3585(b)), but the First Step Act rules out credits for programs finished before the sentence commences (18 U.S.C. § 3632(d)(4)(B)(ii)). The new rule covers the time after sentencing while you wait to be moved.',
      },
      {
        q: 'Does the rule help me if I was sentenced before September 30, 2026?',
        a: 'The rule doesn’t say. It takes effect September 30, 2026 and is silent about earlier time. Ask your unit team how your credits were counted, and use the calculator to see your date both ways.',
      },
      {
        q: 'I self-surrendered. Does this change anything for me?',
        a: 'No. When you self-surrender, your sentence starts the day you arrive at your prison, so your earning start date is the same under both versions of the rule.',
      },
    ],
    related: ['how-first-step-act-time-credits-work', 'pattern-risk-levels-explained'],
  },
  {
    slug: 'how-first-step-act-time-credits-work',
    title: 'How First Step Act time credits work',
    shortTitle: 'How FSA time credits work',
    description:
      'Who earns FSA time credits, how many, when they start, and how the Bureau of Prisons applies them to supervised release and home confinement. Each step is cited to the statute.',
    readingTime: 7,
    published: '2026-09-26',
    updated: '2026-09-26',
    lede:
      'Time credits are the main way the First Step Act moves a release date. They are earned by taking part in programs, and they are applied in two places: an earlier start to supervised release, and an earlier move to a halfway house or home confinement.',
    sections: [
      {
        heading: 'How many credits, and for what',
        blocks: [
          {
            p: 'A person earns 10 days of credit for every 30 days of successful participation in evidence-based recidivism reduction programs or productive activities. Someone the Bureau rates minimum or low risk, who has not increased their risk over two consecutive assessments, earns an additional 5 days for every 30, for 15 in all.',
            cite: ['usc-3632d4', 'cfr-523-42'],
          },
          {
            p: 'In practice the Bureau counts in 30-day blocks of “earning status,” not hours in a classroom. Credits post only for completed blocks; partial credit is not awarded, and leftover days carry into the next month.',
            cite: ['ps-5410'],
          },
          {
            p: 'The Bureau’s own guide says everyone starts at the 10-day rate and, in its worked examples, moves to 15 after the seventh 30-day block, once the assessments have confirmed a minimum or low risk level.',
            cite: ['bop-handout'],
          },
          {
            note: 'Earning pauses while a person is “opted out” of recommended programming, in disciplinary segregation, or away from the institution for a full day (an outside medical trip, for example).',
            cite: ['ps-5410'],
          },
        ],
      },
      {
        heading: 'When earning starts',
        blocks: [
          {
            p: 'A federal sentence commences the day the person is received in custody awaiting transport to the facility, or arrives voluntarily to serve it. Credits cannot be earned for time in detention before that date.',
            cite: ['usc-3585', 'usc-3632d4'],
          },
          {
            p: 'Until September 29, 2026 the regulation said earning began only on arrival at the designated facility. An interim rule effective September 30, 2026 removes that limit, after the First Circuit and a number of federal district courts held it conflicted with the statute. People who self-surrender are unaffected. For them, commencement and arrival are the same day. People remanded at sentencing may now earn during transit, though the Bureau says they still have to be in assigned programming.',
            cite: ['fr-2026-17752'],
          },
        ],
      },
      {
        heading: 'Where the credits go',
        blocks: [
          {
            p: 'Credits are applied once the credits earned equal the time left on the term. At that point, if the judgment includes supervised release, up to 12 months of them can start supervised release early. The rest move the person to prerelease custody (a halfway house or home confinement) sooner.',
            cite: ['usc-3624g', 'cfr-523-44', 'bop-handout'],
          },
          {
            p: 'Without a term of supervised release, credits cannot move the release date itself. They all go toward prerelease custody.',
            cite: ['cfr-523-44'],
          },
          {
            p: 'The Bureau treats credit time and Second Chance Act placement as additive: its policy says the halfway-house or home-confinement recommendation includes the days from the Second Chance Act review plus the credit days not used for supervised release, and a 2025 directive calls the two “cumulative and stackable.”',
            cite: ['ps-5410', 'bop-sca-directive'],
          },
        ],
      },
      {
        heading: 'Who can’t earn or use them',
        blocks: [
          {
            p: 'People serving a sentence for any of the offenses listed in § 3632(d)(4)(D) cannot earn credits. The list runs to 68 entries, including § 924(c) firearms offenses, most homicide, kidnapping, terrorism, sexual-abuse and child-exploitation offenses, and certain fentanyl and death-resulting drug offenses.',
            cite: ['usc-3632d4d'],
          },
          {
            p: 'People with a final order of removal may earn credits but cannot have them applied. The Bureau also will not apply credits while charges or detainers are pending, and treats unresolved immigration status the same way.',
            cite: ['usc-3632d4d', 'bop-faq', 'ps-5410'],
          },
          {
            p: 'Credits are applied only for people rated minimum or low risk in their last two assessments, or for medium- and high-risk people whose warden approves a petition. The Bureau gives medium- and high-risk people no projected FSA release date.',
            cite: ['usc-3624g', 'cfr-523-44', 'ps-5410'],
          },
        ],
      },
      {
        heading: 'What is still unsettled',
        blocks: [
          {
            p: 'The Supreme Court has agreed to decide whether people can use a federal habeas petition to challenge how their credits were applied to halfway-house or home-confinement placement (Maxwell v. Dinis, No. 25-5930). The case is about how these claims get to court, not how credits are counted.',
            cite: ['scotus-25-5930'],
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'How many days of First Step Act credit do you earn per month?',
        a: '10 days for every 30 days of successful participation in recommended programming, plus 5 more (15 total) for people rated minimum or low risk over two consecutive assessments (18 U.S.C. § 3632(d)(4)(A)).',
      },
      {
        q: 'Is there a cap on FSA time credits?',
        a: 'There is no cap on credits earned, but no more than 12 months of them can be applied to an early start of supervised release (18 U.S.C. § 3624(g)(3)). The rest move the date of transfer to a halfway house or home confinement earlier.',
      },
      {
        q: 'Can you earn FSA credits while waiting to be transferred after sentencing?',
        a: 'From September 30, 2026, the regulation says credits can be earned once the sentence commences (which includes being received in custody awaiting transport), if the person is in assigned programming (91 FR 55740).',
      },
    ],
    related: ['pattern-risk-levels-explained', 'home-confinement-vs-halfway-house'],
  },
  {
    slug: 'pattern-risk-levels-explained',
    title: 'PATTERN risk levels, explained',
    shortTitle: 'PATTERN risk levels',
    description:
      'What the Bureau of Prisons’ PATTERN score is, the minimum/low/medium/high cut points, how often it is reassessed, and why the level decides whether time credits are applied.',
    readingTime: 5,
    published: '2026-09-26',
    updated: '2026-09-26',
    lede:
      'PATTERN is the Bureau of Prisons’ recidivism risk tool. Its four levels (minimum, low, medium and high) decide how fast First Step Act credits are earned and whether they are applied at all.',
    sections: [
      {
        heading: 'What PATTERN is',
        blocks: [
          {
            p: 'The First Step Act required a risk-and-needs system that classifies each person as minimum, low, medium or high risk of recidivism. The Bureau’s tool for this is PATTERN (the Prisoner Assessment Tool Targeting Estimated Risk and Needs). The current version is 1.3. It is designed to measure change during incarceration and let people lower their scores at reassessment.',
            cite: ['bop-pattern', 'bop-annual-2024'],
          },
        ],
      },
      {
        heading: 'The cut points',
        blocks: [
          {
            p: 'PATTERN produces two scores, one for general and one for violent recidivism, with separate scales for men and women. The Bureau publishes these cut points for version 1.3:',
            cite: ['bop-cutpoints'],
          },
          {
            list: [
              'Male, general: minimum 5 or less · low 6–39 · medium 40–54 · high 55 or more',
              'Male, violent: minimum 7 or less · low 8–24 · medium 25–31 · high 32 or more',
              'Female, general: minimum 7 or less · low 8–38 · medium 39–52 · high 53 or more',
              'Female, violent: minimum 1 or less · low 2–11 · medium 12–17 · high 18 or more',
            ],
            cite: ['bop-cutpoints'],
          },
          {
            note: 'The published table doesn’t say how the general and violent scores combine into one level, so Countime doesn’t try to compute a PATTERN level. Ask the unit team for the level on record.',
          },
        ],
      },
      {
        heading: 'Why the level matters',
        blocks: [
          {
            p: 'Minimum- and low-risk people earn 15 days of credit per 30 instead of 10, once two consecutive assessments show they haven’t increased their risk.',
            cite: ['usc-3632d4', 'cfr-523-42'],
          },
          {
            p: 'The level also decides whether credits are applied. They go to prerelease custody only for people rated minimum or low in their last two assessments (or whose warden approves a petition), and to early supervised release only for people rated minimum or low in their last assessment.',
            cite: ['usc-3624g', 'cfr-523-44'],
          },
          {
            p: 'The Bureau reassesses risk at each regularly scheduled program review. Its guide describes the first assessment within 28 days of arrival and a second at 90 days (release within a year) or 180 days (release further out).',
            cite: ['ps-5410', 'bop-handout'],
          },
        ],
      },
      {
        heading: 'How the population splits',
        blocks: [
          {
            p: 'In the Justice Department’s June 2024 report, 12.06% of people assessed were minimum risk, 42.67% low, 19.11% medium and 26.16% high (as of January 31, 2024).',
            cite: ['bop-annual-2024'],
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What PATTERN score is low risk?',
        a: 'For men on the general tool, a score of 6 to 39 is low and 5 or less is minimum; for women on the general tool, 8 to 38 is low and 7 or less is minimum (BOP, Cut Points Used for PATTERN v. 1.3).',
      },
      {
        q: 'Can a medium-risk person use First Step Act credits?',
        a: 'They earn 10 days per 30, but credits are applied only if the risk level drops to minimum or low, or a warden approves a petition finding the person is not a danger, has made a good-faith effort to lower their risk, and is unlikely to recidivate (18 U.S.C. § 3624(g)(1)(D)).',
      },
    ],
    related: ['how-first-step-act-time-credits-work'],
  },
  {
    slug: 'home-confinement-vs-halfway-house',
    title: 'Home confinement vs. a halfway house (RRC)',
    shortTitle: 'Home confinement vs. RRC',
    description:
      'The difference between a residential reentry center and home confinement at the end of a federal sentence, the Second Chance Act limits, and how First Step Act credits extend them.',
    readingTime: 6,
    published: '2026-09-26',
    updated: '2026-09-26',
    lede:
      'Most federal sentences end in the community, not in a prison. First comes a halfway house or home confinement, then release. Two laws decide how long that stretch can be: the Second Chance Act and the First Step Act.',
    sections: [
      {
        heading: 'What each one is',
        blocks: [
          {
            p: 'A residential reentry center (RRC), or “halfway house,” is a contracted facility that provides a structured, supervised place to live near release, with help finding work and managing money. People there remain in federal custody.',
            cite: ['bop-rrc'],
          },
          {
            p: 'Home confinement (“home detention” in the regulation) restricts a person to their residence continuously, except for authorized absences, enforced by monitoring.',
            cite: ['cfr-570'],
          },
          {
            p: 'At an RRC, residents pay a subsistence fee of 25% of gross income, and are ordinarily expected to be working 40 hours a week within 15 days of arrival.',
            cite: ['bop-rrc'],
          },
        ],
      },
      {
        heading: 'The Second Chance Act limits',
        blocks: [
          {
            p: 'The Bureau must, “to the extent practicable,” let people spend a portion of the final months of the term, not more than 12 months, in conditions that prepare them for reentry, which may include a halfway house.',
            cite: ['usc-3624c'],
          },
          {
            p: 'Home confinement under this authority is limited to the shorter of 10% of the term or 6 months, and the Bureau is told to place lower-risk, lower-need people on home confinement for the maximum time allowed.',
            cite: ['usc-3624c', 'cfr-570'],
          },
          {
            p: 'The unit team makes the referral recommendation roughly 17–19 months before release, and weighs length of placement using the five factors in 18 U.S.C. § 3621(b).',
            cite: ['bop-rrc'],
          },
        ],
      },
      {
        heading: 'How First Step Act credits change the picture',
        blocks: [
          {
            p: 'The Second Chance Act time limits do not apply to prerelease custody earned with First Step Act credits. Credits beyond the 12 months used for early supervised release move the transfer to an RRC or home confinement earlier still.',
            cite: ['usc-3624g', 'bop-handout'],
          },
          {
            p: 'The Bureau’s 2025 directives treat the two as “cumulative and stackable” and say there is no restriction on how many credits may be applied toward home confinement.',
            cite: ['bop-sca-directive', 'ps-5410'],
          },
          {
            note: 'No public Bureau document spells out exactly how the Second Chance Act’s home-confinement cap interacts with credit days. Countime’s calculator shows Second Chance Act time as an assumption you choose, not a promise.',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'How long can you be in a halfway house at the end of a federal sentence?',
        a: 'Under the Second Chance Act, up to 12 months, to the extent practicable (18 U.S.C. § 3624(c)(1)). First Step Act time credits can add more, because those time limits do not apply to credit-based prerelease custody (18 U.S.C. § 3624(g)(10)).',
      },
      {
        q: 'How long can you be on home confinement?',
        a: 'Under the Second Chance Act, the shorter of 10% of the term or 6 months (18 U.S.C. § 3624(c)(2)). People with First Step Act credits can be placed on home confinement longer, and the Bureau says there is no cap on credits applied toward it.',
      },
    ],
    related: ['how-first-step-act-time-credits-work', 'rdap-sentence-reduction'],
  },
  {
    slug: 'rdap-sentence-reduction',
    title: 'RDAP: how the drug program can take up to a year off',
    shortTitle: 'RDAP sentence reduction',
    description:
      'Who qualifies for the Residential Drug Abuse Program’s early release, the 6/9/12-month limits by sentence length, and how RDAP combines with First Step Act credits.',
    readingTime: 5,
    published: '2026-09-26',
    updated: '2026-09-26',
    lede:
      'The Residential Drug Abuse Program is the one program that can shorten the sentence itself. The reduction is capped at a year by statute, and at less than that for shorter sentences by Bureau policy.',
    sections: [
      {
        heading: 'The reduction',
        blocks: [
          {
            p: 'For someone convicted of a nonviolent offense who completes the program, the Bureau may reduce the time left to serve by no more than one year.',
            cite: ['usc-3621e', 'cfr-550-55'],
          },
          {
            p: 'Bureau policy limits the reduction by sentence length: no more than 6 months for sentences of 30 months or less, 9 months for 31–36 months, and 12 months for 37 months or more. The table is not prorated by days.',
            cite: ['ps-5331'],
          },
        ],
      },
      {
        heading: 'Who is not eligible for early release',
        blocks: [
          {
            p: 'The regulation excludes, among others, people with a current felony conviction involving the use or threat of force, carrying or using a firearm or explosives, conduct presenting a serious risk of force, or sexual abuse of minors; people with certain prior convictions within ten years; and anyone who received a § 3621(e) release before.',
            cite: ['cfr-550-55'],
          },
        ],
      },
      {
        heading: 'Finishing the program',
        blocks: [
          {
            p: 'Completing RDAP includes community treatment services after the residential phase; refusing or failing that component fails the program.',
            cite: ['cfr-550-56'],
          },
          {
            p: 'When RDAP and time credits both apply, the Bureau takes the RDAP reduction first, then applies credits. It must leave time for at least the 120-day community-based component, and will cut the credits applied to supervised release if needed.',
            cite: ['ps-5410'],
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'How much time does RDAP take off a federal sentence?',
        a: 'Up to 12 months by statute (18 U.S.C. § 3621(e)(2)(B)). Bureau policy caps it at 6 months for sentences of 30 months or less and 9 months for 31–36 months (Program Statement 5331.02).',
      },
      {
        q: 'Can you get RDAP time off and First Step Act credits?',
        a: 'Yes. The Bureau applies the RDAP reduction first and then the time credits, while leaving room for the 120-day community treatment component (Program Statement 5410.01 §11).',
      },
    ],
    related: ['how-first-step-act-time-credits-work', 'home-confinement-vs-halfway-house'],
  },
  {
    slug: 'before-self-surrender',
    title: 'What to do before self-surrender',
    shortTitle: 'Before self-surrender',
    description:
      'How the surrender date and facility are set, what the Bureau lets you bring, and what happens to everything else, from Bureau of Prisons policy.',
    readingTime: 5,
    published: '2026-09-26',
    updated: '2026-09-26',
    lede:
      'Self-surrender is one of the few parts of a federal sentence you can plan for. These are the official rules; the full week-by-week plan is in the Countime checklist.',
    sections: [
      {
        heading: 'Where and when',
        blocks: [
          {
            p: 'After sentencing, the Bureau alone decides where a person serves the sentence. It tries to designate a facility that fits security and program needs within 500 driving miles of the release residence.',
            cite: ['bop-designations'],
          },
          {
            p: 'When the court orders voluntary surrender, the U.S. Marshals Service gives the surrender date and the institution, or directs the person to surrender to the Marshals instead. Questions about surrendering at an institution go to that institution.',
            cite: ['bop-voluntary-surrender'],
          },
          {
            p: 'The sentence commences the day the person arrives voluntarily to serve it; that is also the day First Step Act credits can begin.',
            cite: ['usc-3585', 'fr-2026-17752'],
          },
        ],
      },
      {
        heading: 'What you may bring',
        blocks: [
          {
            p: 'Under the Bureau’s current property policy, a person who voluntarily surrenders may keep only:',
            cite: ['ps-5580'],
          },
          {
            list: [
              'a plain wedding band (no stones or intricate markings)',
              'earrings, for women only (one pair, no stones, declared value under $100)',
              'medical or orthopedic devices',
              'legal documents',
              'religious items approved by the warden (medallions and chains under $100)',
              'prescription glasses',
            ],
            cite: ['ps-5580'],
          },
          {
            p: 'Identification such as a Social Security card, driver’s license or passport is kept in the central file until release, and money or checks are put on the person’s account. The institution pays to ship home the clothes worn on arrival; anything else is rejected and shipped at the person’s expense.',
            cite: ['ps-5580'],
          },
          {
            note: 'The Bureau’s own voluntary-surrender page still points to an older property policy (5580.08). The current one is 5580.10, dated May 7, 2026.',
            cite: ['bop-voluntary-surrender', 'ps-5580'],
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What can you bring when you self-surrender to federal prison?',
        a: 'A plain wedding band, one pair of earrings for women (no stones, under $100), medical or orthopedic devices, legal documents, warden-approved religious items, and prescription glasses (BOP Program Statement 5580.10 §10).',
      },
      {
        q: 'Who tells you where and when to self-surrender?',
        a: 'The U.S. Marshals Service notifies you of the date and the institution, or directs you to surrender to the Marshals (BOP, Voluntary Surrenders).',
      },
    ],
    related: ['how-first-step-act-time-credits-work'],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
