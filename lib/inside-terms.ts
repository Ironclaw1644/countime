import termsJson from '@/data/inside-terms.json';
import type { InsideTerm } from '@/types/inside-term';

const TERMS = termsJson as InsideTerm[];

export function getAllInsideTerms(): InsideTerm[] {
  return TERMS;
}

export function getInsideTermById(id: string): InsideTerm | undefined {
  return TERMS.find((t) => t.id === id);
}

export function getInsideTermCategories(): string[] {
  return Array.from(new Set(TERMS.map((t) => t.category))).sort();
}
