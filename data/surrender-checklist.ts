import type { SurrenderChecklist } from '@/types/checklist';

/**
 * The Countime Self-Surrender Prep Checklist
 *
 * Written for a person who has been ordered by a federal court to voluntarily
 * surrender to a Bureau of Prisons facility. Calm voice, practical items,
 * BOP-cited where applicable.
 *
 * This list reflects the broad self-surrender experience. Every case is
 * different — read it as a starting point, not a rulebook. The official BOP
 * Voluntary Surrenders page is the source of truth:
 *   https://www.bop.gov/inmates/custody_and_care/voluntary_surrenders.jsp
 */
export const SURRENDER_CHECKLIST: SurrenderChecklist = {
  version: 'v1',
  updatedAt: '2026-05-14',
  sections: [
    {
      window: '90 Days Out',
      tagline: 'Get the legal, financial, and family architecture in place — while you still have time.',
      tone: 'sage',
      subsections: [
        {
          title: 'Legal & court',
          items: [
            { id: 'l1', text: 'Confirm the self-surrender date and reporting time in writing.', detail: 'The court order is the legal source; the U.S. Marshals Service will follow up with the facility name once BOP designates.' },
            { id: 'l2', text: 'Confirm with your attorney that designation has been requested with BOP.' },
            { id: 'l3', text: 'Sign a durable power of attorney — financial AND medical.', detail: 'Pick the most level-headed person you trust. Notarize. Give copies to your attorney and to that person.' },
            { id: 'l4', text: 'Update your will. Even a simple one. Even now.' },
            { id: 'l5', text: 'Save attorney contact info somewhere your spouse can find it without you.' },
          ],
        },
        {
          title: 'Finances',
          items: [
            { id: 'f1', text: 'Build a complete inventory of every account, debt, recurring payment, and subscription.', detail: 'Spreadsheet. Print it. Your spouse will need this on day 1 of you being gone.' },
            { id: 'f2', text: 'Designate the household financial decision-maker. One person, not a committee.' },
            { id: 'f3', text: 'Move critical bills to autopay or pre-pay 6 months.', detail: 'Mortgage, insurance, utilities, phone for spouse, tuition.' },
            { id: 'f4', text: 'Plan the income gap honestly.', detail: 'Severance, unemployment, savings drawdown, family support — write the actual numbers.' },
            { id: 'f5', text: 'Set aside a commissary fund.', detail: 'BOP currently caps monthly commissary spending at $360 per inmate. Plan for 12 months.' },
            { id: 'f6', text: 'Talk to a CPA about tax filings during incarceration.' },
          ],
        },
        {
          title: 'Family',
          items: [
            { id: 'fa1', text: 'Decide who is told, when, and by whom.', detail: 'Spouse and immediate family first. A phone tree prevents 40 chaotic conversations.' },
            { id: 'fa2', text: 'Find a family therapist if you don’t have one.', detail: 'Kids especially. Don’t try to absorb this alone.' },
            { id: 'fa3', text: 'Plan the conversation with children.', detail: 'Age-appropriate, honest, and brief. Promise nothing you can’t deliver from inside.' },
            { id: 'fa4', text: 'Decide what schools and youth coaches are told and by whom.' },
            { id: 'fa5', text: 'Sketch the post-surrender visit cadence with your spouse.' },
          ],
        },
      ],
    },
    {
      window: '60 Days Out',
      tagline: 'Medical, records, and digital — the things that take time to retrieve and harder to fix once you’re inside.',
      tone: 'teal',
      subsections: [
        {
          title: 'Medical',
          items: [
            { id: 'm1', text: 'Get a full physical, dental cleaning, and eye exam.' },
            { id: 'm2', text: 'Refill every prescription. Ask your doctor for a documented list of current medications and dosages.', detail: 'You will be asked at intake. Mistakes can interrupt your supply for weeks.' },
            { id: 'm3', text: 'Get a copy of your medical records and a signed letter for any chronic condition.', detail: 'BOP intake will ask. Bring documentation.' },
            { id: 'm4', text: 'Schedule the dental work you’ve been putting off.', detail: 'BOP dental focuses on extractions, not preservation.' },
            { id: 'm5', text: 'Get prescription eyeglasses you can bring with you.', detail: 'Plain frames. No designer logos. Bring the case.' },
          ],
        },
        {
          title: 'Documents',
          items: [
            { id: 'd1', text: 'Birth certificate, Social Security card, passport → lockbox at home.' },
            { id: 'd2', text: 'Tax returns up to date.' },
            { id: 'd3', text: 'Memorize the 5 phone numbers that matter.', detail: 'Spouse, attorney, parents, two adult children or siblings. You cannot bring a contact list.' },
            { id: 'd4', text: 'Write a sealed letter for your kids.', detail: 'Optional. Dated. Read on day 1, day 30, day 90, or never.' },
          ],
        },
        {
          title: 'Digital',
          items: [
            { id: 'di1', text: 'Set up email forwarding from your accounts to your spouse.' },
            { id: 'di2', text: 'Hand off your password manager and 2FA recovery codes.' },
            { id: 'di3', text: 'Forward postal mail to a trusted person.' },
            { id: 'di4', text: 'Pause or hand off social media. Decide consciously.' },
            { id: 'di5', text: 'Cancel or transfer business accounts (LLC banking, payroll, vendor portals).' },
          ],
        },
      ],
    },
    {
      window: '30 Days Out',
      tagline: 'Practical, BOP-facing, and unglamorous. This is the part people skip and regret.',
      tone: 'gold',
      subsections: [
        {
          title: 'BOP prep',
          items: [
            { id: 'b1', text: 'Confirm your designated facility and report time.' },
            { id: 'b2', text: 'Read the facility’s A&O handbook cover to cover.', detail: 'Linked from every facility profile on countime.net.' },
            { id: 'b3', text: 'Read the facility’s voluntary-surrender instructions if they publish one.' },
            { id: 'b4', text: 'Build your TRULINCS contact list (people who can email you inside).', detail: 'Up to ~30 names. Spouse, attorney, employer if relevant, family, 2–3 close friends.' },
            { id: 'b5', text: 'Build your phone list separately. Some facilities require it pre-approved.' },
            { id: 'b6', text: 'Send approved visitors a heads-up to expect a BP-629 visitor form.' },
          ],
        },
        {
          title: 'The walk-in plan',
          items: [
            { id: 'w1', text: 'Identify your ride to the facility.', detail: 'Someone calm. Not someone you’ll want to hug for 20 minutes at the door.' },
            { id: 'w2', text: 'Pack exactly what BOP allows: eyeglasses (in case), wedding ring, religious medallion. Nothing else.', detail: 'Most facilities will send anything else home at your expense.' },
            { id: 'w3', text: 'Send your wallet contents home in advance. Cards. Cash. License goes with you for ID.' },
            { id: 'w4', text: 'Confirm your spouse has the facility’s commissary deposit instructions.', detail: 'Western Union, MoneyGram, or check via Lockbox — facility-specific.' },
            { id: 'w5', text: 'Write down the facility’s address, phone, and your inmate-locator-search name (last, first, middle).' },
          ],
        },
      ],
    },
    {
      window: '7 Days Out',
      tagline: 'Wind down. Don’t over-engineer the last week.',
      tone: 'clay',
      subsections: [
        {
          title: 'Last week',
          items: [
            { id: 'la1', text: 'A real family meal. However your family does that.' },
            { id: 'la2', text: 'Sleep. Real sleep. Not Ambien-and-wine sleep.' },
            { id: 'la3', text: 'Confirm transportation and the route.' },
            { id: 'la4', text: 'Final attorney call — any last questions about the report itself.' },
            { id: 'la5', text: 'Quiet day before. Not a goodbye party. A movie. A walk. Sleep.' },
          ],
        },
      ],
    },
    {
      window: 'Day Of',
      tagline: 'The walk-in. Hours 0 through ~24.',
      tone: 'slate',
      subsections: [
        {
          title: 'The day',
          items: [
            { id: 'do1', text: 'Arrive 60–90 minutes before your reporting time.' },
            { id: 'do2', text: 'Bring: government photo ID + court report letter. That is it.' },
            { id: 'do3', text: 'Do NOT bring: phone, wallet, watch, jewelry beyond a plain wedding ring, cash, snacks, books, anything else.' },
            { id: 'do4', text: 'Tell the front desk your name and that you are reporting under court order. Hand them the letter.' },
            { id: 'do5', text: 'Trust the intake process. R&D (Receiving & Discharge) takes 4–8 hours.' },
            { id: 'do6', text: 'Your first phone call home is typically allowed within 24–72 hours.' },
          ],
        },
      ],
    },
    {
      window: 'For the family — Week 1',
      tagline: 'What spouses and family members do on their side while intake plays out.',
      tone: 'sage',
      subsections: [
        {
          title: 'On the outside',
          items: [
            { id: 'sp1', text: 'Set up commissary deposits. BOP currently caps spending at $360/month.' },
            { id: 'sp2', text: 'Create your TRULINCS account (corrlinks.com) so your person can email you.' },
            { id: 'sp3', text: 'Mail a letter on day 1. Even one paragraph. Mail counts.' },
            { id: 'sp4', text: 'Order books only through approved publisher channels (Amazon ships to BOP at most facilities; paperback only).' },
            { id: 'sp5', text: 'Plan your first visit. Usually after intake clears, ~30–60 days.' },
            { id: 'sp6', text: 'Get yourself a therapist if you don’t have one. This is hard on you too.' },
          ],
        },
      ],
    },
  ],
};
