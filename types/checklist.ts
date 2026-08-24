export interface ChecklistItem {
  id: string;
  text: string;
  /** Optional extra context shown smaller beneath the item */
  detail?: string;
}

export interface ChecklistSubsection {
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistSection {
  /** e.g. "90 Days Out" */
  window: string;
  /** Short tagline shown below the window */
  tagline: string;
  /** Color tone token */
  tone: 'sage' | 'gold' | 'teal' | 'clay' | 'slate';
  subsections: ChecklistSubsection[];
}

export interface SurrenderChecklist {
  version: string;
  updatedAt: string;
  sections: ChecklistSection[];
}
