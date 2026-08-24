/**
 * The ruled column grid.
 *
 * Thin vertical lines run the height of the page, aligned to the same
 * container the content sits in. Borrowed from architectural sites that draw
 * their grid rather than implying it — and apt here, where the whole subject
 * is counting off days on a ruled page.
 */
export function ColumnRules() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden md:block">
      <div className="mx-auto h-full max-w-[88rem] px-5 sm:px-8">
        <div className="grid h-full grid-cols-4">
          <div className="border-l border-rule" />
          <div className="border-l border-rule" />
          <div className="border-l border-rule" />
          <div className="border-x border-rule" />
        </div>
      </div>
    </div>
  );
}
