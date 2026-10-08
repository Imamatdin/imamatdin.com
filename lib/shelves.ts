/**
 * The library's bays, in the order you walk past them down the hall. Each
 * shelf owns one Flexoki hue (see the --sp-* tokens in styles/terminal.css);
 * books inherit it from their category rather than carrying their own colour.
 */
export interface Shelf {
  id: string;
  label: string;
  numeral: string;
  hue: string;
}

export const SHELVES: Shelf[] = [
  { id: 'Russian Literature', label: 'russian literature', numeral: 'I', hue: 'var(--sp-red)' },
  { id: 'Literature', label: 'literature', numeral: 'II', hue: 'var(--sp-blue)' },
  { id: 'Philosophy', label: 'philosophy', numeral: 'III', hue: 'var(--sp-purple)' },
  { id: 'Science', label: 'science', numeral: 'IV', hue: 'var(--sp-cyan)' },
  { id: 'Science Fiction', label: 'science fiction', numeral: 'V', hue: 'var(--sp-magenta)' },
  { id: 'Business', label: 'business', numeral: 'VI', hue: 'var(--sp-green)' },
];

const FALLBACK: Shelf = { id: 'Other', label: 'other', numeral: 'VII', hue: 'var(--sp-blue)' };

export const shelfFor = (category: string | string[] | null | undefined): Shelf => {
  const c = Array.isArray(category) ? category[0] : category;
  return SHELVES.find((s) => s.id === c) ?? FALLBACK;
};
