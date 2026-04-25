export interface InsideTermSource {
  label: string;
  url: string;
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
}
