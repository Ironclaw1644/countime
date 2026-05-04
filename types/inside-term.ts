export interface InsideTermSource {
  label: string;
  url: string;
}

export interface InsideTermTestimony {
  /** The quote itself, in the speaker's own words */
  quote: string;
  /** Who said it — person plus brief role, e.g. "Justin Paperny, federal camp inmate 2008–2010" */
  attribution: string;
  /** Citation label for sources without a clean URL (book + page, transcript, podcast) */
  sourceLabel?: string;
  /** Primary-source URL when available */
  sourceUrl?: string;
}

export interface InsideTermCoping {
  /** Short heading for the strategy (display-font in the renderer) */
  strategy: string;
  /** 2–4 sentences of practical detail */
  detail: string;
}

export interface InsideTerm {
  /** URL slug, e.g. 'diesel-therapy' */
  id: string;
  /** Display title, e.g. 'Diesel Therapy' */
  title: string;
  /** One-sentence preview shown on the index card */
  shortDefinition: string;
  /** Grouping bucket — "Movement & Transfers", "Lingo", "Daily Life", etc. */
  category: string;
  /** Full body, written as paragraphs (no markdown — render as <p> blocks) */
  body: string[];
  /** "Why this exists / what it accomplishes" — surfaces as a callout on the detail page */
  purpose?: string;
  /** Other term ids that pair with this one */
  related?: string[];
  /** Optional sources for further reading */
  sources?: InsideTermSource[];
  /** Named, sourced first-person testimony — rendered as a sage-tinted block between body and purpose */
  testimony?: InsideTermTestimony[];
  /** Practical coping strategies — rendered as a "Ways through it" section after purpose */
  coping?: InsideTermCoping[];
}
