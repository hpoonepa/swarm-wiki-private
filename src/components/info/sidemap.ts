import { bindScene } from './motion/scroll';
import { onReducedMotionChange, prefersReducedMotion } from './motion/reduced';
import { SheetController } from './motion/sheet';

/** One entry of the section maps: an h2 or h3 of the article, in document order (LongForm builds the list). */
export interface Section { id: string; depth: 2 | 3; text: string }

/**
 * The reading line, as a share of the viewport height from its top. A heading above it is behind the reader: the last
 * such heading is the current section (the band of the side map's IntersectionObserver, '-30% 0px -60% 0px', ends
 * here), and a section whose bottom is above it has been read and blooms.
 */
const LINE = 0.4;
/**
 * The observer's root reaches this far above the viewport, so "above the line" is a single intersecting state. With
 * only the band, a heading that jumps from below the viewport to above the line (a keyboard jump, a restored scroll
 * position) never intersects it and the change would be missed.
 */
const FAR = 1_000_000;
/** Screen px between the closed sheet's top and the viewport's bottom edge, so its shadow is off screen too. */
const SHEET_CLEARANCE = 32;
/** Runs `fn` once the current state has been painted. */
const afterPaint = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));
/**
 * A click from the keyboard (Enter or Space): detail 0, or, where click is a PointerEvent, no pointer type (Firefox
 * reports detail 1 for Enter on a link).
 */
const byKeyboard = (e: Event) => (e as MouseEvent).detail === 0 || (e as PointerEvent).pointerType === '';

interface Tracked { id: string; heading: HTMLElement; end: Element }
interface List { el: HTMLElement; kind: string; vine: HTMLElement | null; track: HTMLElement | null; items: Map<string, HTMLElement>; links: HTMLAnchorElement[] }

function toList(el: HTMLElement): List {
  const items = new Map<string, HTMLElement>();
  for (const li of el.querySelectorAll<HTMLElement>('li[data-section]')) items.set(li.dataset.section!, li);
  return {
    el,
    kind: el.dataset.sectionList ?? '',
    vine: el.querySelector<HTMLElement>('.section-list__vine'),
    track: el.querySelector<HTMLElement>('.section-list__track'),
    items,
    links: [...el.querySelectorAll<HTMLAnchorElement>('a[data-section-link]')],
  };
}
const idOf = (a: HTMLAnchorElement) => decodeURIComponent(a.hash.slice(1));

/** Each listed heading with its section's end: the next heading of its level or above, else the article's end. */
function track(list: List, end: Element): Tracked[] {
  const rows = list.links.map((a) => ({ id: idOf(a), depth: Number(a.dataset.depth) }));
  return rows.flatMap((row, i) => {
    const heading = document.getElementById(row.id);
    if (!heading) return [];
    const next = rows.slice(i + 1).find((r) => r.depth <= row.depth);
    return [{ id: row.id, heading, end: (next && document.getElementById(next.id)) || end }];
  });
}

/**
 * Lays the track and vine from the first marker's center to the list's end and returns each marker's position along
 * the vine (0…1). Null while the list is not rendered (the closed sheet).
 */
function layoutRail(list: List): number[] | null {
  const markers = [...list.el.querySelectorAll<HTMLElement>('.section-list__marker')];
  const box = list.el.getBoundingClientRect();
  if (!list.vine || markers.length === 0 || box.height === 0) return null;
  const centers = markers.map((m) => {
    const r = m.getBoundingClientRect();
    return r.top + r.height / 2 - box.top;
  });
  const top = centers[0];
  const length = Math.max(1, box.height - top);
  for (const el of [list.track, list.vine]) {
    if (!el) continue;
    el.style.top = `${top}px`;
    el.style.height = `${length}px`;
  }
  return centers.map((c) => (c - top) / length);
}

/**
 * The side map's vine as scroll keyframes over the whole page scroll: its tip reaches a section's marker as that
 * section's heading crosses the reading line, and the vine's end as the article's end does.
 */
function railFrames(sections: Tracked[], marks: number[], end: Element): Keyframe[] | null {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (!(max > 0)) return null;
  const line = LINE * innerHeight;
  const at = (el: Element) => Math.min(1, Math.max(0, (el.getBoundingClientRect().top + scrollY - line) / max));
  const frames: Keyframe[] = [{ offset: 0, transform: 'scaleY(0)' }];
  let offset = 0;
  sections.forEach((s, i) => {
    offset = Math.max(offset, at(s.heading));
    frames.push({ offset, transform: `scaleY(${marks[i].toFixed(4)})` });
  });
  offset = Math.max(offset, at(end));
  frames.push({ offset, transform: 'scaleY(1)' });
  if (offset < 1) frames.push({ offset: 1, transform: 'scaleY(1)' });
  return frames;
}

interface Progress {
  /** Blooms caused in the next `ms` apply without animating (a keyboard jump). */
  instantFor(ms: number): void;
  /** Re-measures a list's vine (the sheet, once it is open) and paints it. */
  refresh(list: List): void;
}

/**
 * Current section, blooms and vines, for every list on the page (the side map and the sheet share one state).
 * A bloom is triggered once and never undone. One section end crossing the line while reading blooms with its
 * transition; several at once (a jump, a restored scroll position, the first reading) switch without animating.
 */
function readingProgress(sections: Tracked[], lists: List[], end: Element): Progress {
  const above = new Set<Element>();
  const bloomed = new Set<string>();
  const marks = new Map<List, number[]>();
  let current = -1;
  let first = true;
  let instantUntil = 0;
  const map = lists.find((l) => l.kind === 'map');
  let unbindRail: (() => void) | null = null;

  /** A vine that no scroll scene drives (the sheet's, or the map's under reduced motion) points at the current section. */
  const paintStill = (list: List) => {
    if (!list.vine || (list === map && unbindRail)) return;
    const m = marks.get(list);
    if (!m) return;
    const f = above.has(end) ? 1 : current >= 0 ? m[current] : 0;
    list.vine.style.transform = `scaleY(${f.toFixed(4)})`;
  };

  const update = () => {
    const fresh = sections.filter((s) => !bloomed.has(s.id) && above.has(s.end));
    if (fresh.length > 0) {
      const animate = !first && new Set(fresh.map((s) => s.end)).size === 1 && performance.now() >= instantUntil;
      for (const s of fresh) {
        bloomed.add(s.id);
        for (const list of lists) {
          const item = list.items.get(s.id);
          if (!item) continue;
          if (!animate) item.setAttribute('data-instant', '');
          item.setAttribute('data-bloomed', '');
          if (!animate) afterPaint(() => item.removeAttribute('data-instant'));
        }
      }
    }
    const now = sections.findLastIndex((s) => above.has(s.heading));
    if (now !== current) {
      current = now;
      const id = sections[now]?.id;
      for (const list of lists) {
        for (const a of list.links) {
          if (idOf(a) === id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        }
      }
    }
    for (const list of lists) paintStill(list);
    first = false;
  };

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) above.add(e.target);
      else above.delete(e.target);
    }
    update();
  }, { rootMargin: `${FAR}px 0px ${-(1 - LINE) * 100}% 0px` });
  for (const el of new Set<Element>([...sections.map((s) => s.heading), end])) io.observe(el);

  // The side map's vine: scroll keyframes, re-measured whenever the page's layout changes; none under reduced motion.
  let queued = false;
  const bindRail = () => {
    queued = false;
    unbindRail?.();
    unbindRail = null;
    if (!map?.vine) return;
    const m = layoutRail(map);
    if (!m) return;
    marks.set(map, m);
    const frames = prefersReducedMotion() ? null : railFrames(sections, m, end);
    if (frames) {
      map.vine.style.removeProperty('transform');
      unbindRail = bindScene({ target: map.vine, source: 'scroll', keyframes: frames });
    }
    paintStill(map);
  };
  const rebind = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(bindRail);
  };
  if (map) {
    const ro = new ResizeObserver(rebind);
    ro.observe(document.documentElement);
    ro.observe(map.el);
    addEventListener('resize', rebind);
    onReducedMotionChange(rebind);
  }

  return {
    instantFor(ms) { instantUntil = performance.now() + ms; },
    refresh(list) {
      const m = layoutRail(list);
      if (m) marks.set(list, m);
      paintStill(list);
    },
  };
}

function focusHeading(el: HTMLElement): void {
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/**
 * Scrolls a section's heading to its rest position (its scroll-margin-top), updates the address, and moves focus there
 * so Tab continues in the section. Keyboard jumps and reduced motion are instant; pointer jumps glide. There is no
 * site-wide smooth scrolling: the behavior is chosen per call.
 */
function jumpTo(target: HTMLElement, instant: boolean, focus = true): void {
  const hash = `#${target.id}`;
  if (location.hash !== hash) history.pushState(history.state, '', hash);
  target.scrollIntoView({ behavior: instant ? 'instant' : 'smooth', block: 'start' });
  if (focus) focusHeading(target);
}

interface SectionSheet { leaveTo(target: HTMLElement, keyboard: boolean): void }

/**
 * The phone section sheet: a modal <dialog> moved by a SheetController between a closed detent just below the viewport
 * and the open detent, where it shows 40% of the viewport (18rem at the least). It closes (dialog.close(), which gives
 * focus back to the pill) once a flight to the closed detent has finished. The pill opens it; Close, the scrim, Esc, a
 * drag down and picking a section close it. Keyboard-initiated opens and closes are instant.
 */
function initSheet(progress: Progress, list: List | undefined): SectionSheet | null {
  const dialog = document.querySelector<HTMLDialogElement>('dialog.section-sheet');
  const pill = document.querySelector<HTMLButtonElement>('button.sections-pill');
  const handle = dialog?.querySelector<HTMLElement>('.section-sheet__handle');
  if (!dialog || !pill || !handle) return null;

  let closedY = 0;
  const detents = () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const height = Math.min(innerHeight - 0.75 * rem, Math.max(0.4 * innerHeight, 18 * rem));
    dialog.style.height = `${height}px`;
    closedY = height + SHEET_CLEARANCE;
    return [closedY, 0];
  };
  let focusAfterClose: HTMLElement | null = null;
  const closeWhenSettled = (): void => {
    // A frame later: SheetController reports the new detent before it starts the flight there, and a cancelled flight
    // has been replaced by the time this runs.
    requestAnimationFrame(() => {
      if (sheet.index !== 0 || !dialog.open) return;
      const flights = dialog.getAnimations();
      if (flights.length > 0) Promise.all(flights.map((a) => a.finished)).then(closeWhenSettled, closeWhenSettled);
      // At rest on the closed detent: close, so no invisible modal holds the page inert. At rest anywhere else a press
      // is holding the sheet, and its release calls back here.
      else if (new DOMMatrixReadOnly(getComputedStyle(dialog).transform).m42 >= closedY - 1) dialog.close();
    });
  };
  const sheet = new SheetController(dialog, {
    detents,
    handle,
    onChange: (i) => {
      dialog.toggleAttribute('data-open', i === 1);
      if (i === 0) closeWhenSettled();
    },
  });
  // Catching the closing sheet and letting go sends it on to the closed detent without a detent change.
  const afterRelease = () => setTimeout(closeWhenSettled);
  handle.addEventListener('pointerup', afterRelease);
  handle.addEventListener('pointercancel', afterRelease);

  pill.addEventListener('click', (e) => {
    const instant = byKeyboard(e);
    dialog.toggleAttribute('data-instant', instant);
    dialog.removeAttribute('data-leaving');
    focusAfterClose = null;
    if (!dialog.open) dialog.showModal();
    if (list) progress.refresh(list);
    pill.setAttribute('aria-expanded', 'true');
    sheet.snapTo(1, 0, { instant });
    afterPaint(() => dialog.removeAttribute('data-instant'));
  });
  dialog.querySelector('[data-sheet-close]')?.addEventListener('click', (e) => {
    const instant = byKeyboard(e);
    dialog.toggleAttribute('data-instant', instant);
    sheet.snapTo(0, undefined, { instant });
  });
  // A tap on the scrim: the dialog element receives clicks on its ::backdrop, which lies outside the sheet's box (above
  // it, and beside it where the viewport is wider than the sheet).
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientY < r.top || e.clientX < r.left || e.clientX > r.right) sheet.snapTo(0);
  });
  // Every way out ends here: keep the controller and the pill in step, then hand focus to a picked section.
  dialog.addEventListener('close', () => {
    if (sheet.index !== 0) sheet.snapTo(0, 0, { instant: true });
    for (const a of ['data-open', 'data-instant', 'data-leaving']) dialog.removeAttribute(a);
    pill.setAttribute('aria-expanded', 'false');
    const target = focusAfterClose;
    focusAfterClose = null;
    if (target) focusHeading(target);
  });
  // Leaving the page: close before it is captured for a view transition or stored in the back/forward cache.
  for (const type of ['pageswap', 'pagehide']) {
    addEventListener(type, () => {
      if (!dialog.open) return;
      sheet.snapTo(0, 0, { instant: true });
      dialog.close();
    });
  }

  return {
    leaveTo(target, keyboard) {
      if (keyboard || prefersReducedMotion()) {
        sheet.snapTo(0, 0, { instant: true });
        dialog.close();
        jumpTo(target, true);
        return;
      }
      // The page scrolls behind the sheet as it slides away (data-leaving lifts the scroll lock); focus moves to the
      // heading once the modal has closed, since the page is inert until then.
      focusAfterClose = target;
      dialog.setAttribute('data-leaving', '');
      sheet.snapTo(0);
      jumpTo(target, false, false);
    },
  };
}

function init(): void {
  const lists = [...document.querySelectorAll<HTMLElement>('[data-section-list]')].map(toList);
  const end = document.querySelector('[data-longform-end]');
  if (lists.length === 0 || !end) return;
  const sections = track(lists[0], end);
  if (sections.length === 0) return;
  const progress = readingProgress(sections, lists, end);
  const sectionSheet = initSheet(progress, lists.find((l) => l.kind === 'sheet'));

  // Section links (side map, sheet rows) jump without a default anchor jump.
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[data-section-link]') : null;
    const target = link ? document.getElementById(idOf(link)) : null;
    if (!link || !target) return;
    e.preventDefault();
    const keyboard = byKeyboard(e);
    if (keyboard) progress.instantFor(400);
    if (sectionSheet && link.closest('dialog')) sectionSheet.leaveTo(target, keyboard);
    else jumpTo(target, keyboard || prefersReducedMotion());
  });

  // The pill steps aside once the article's end is on screen (the Continue links and the footer are below it).
  const pill = document.querySelector<HTMLElement>('button.sections-pill');
  if (pill) {
    new IntersectionObserver(([e]) => pill.toggleAttribute('data-hidden', e.isIntersecting), { rootMargin: `${FAR}px 0px 0px 0px` })
      .observe(end);
  }

}

init();
