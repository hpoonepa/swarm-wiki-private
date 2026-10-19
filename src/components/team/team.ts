const initialized = new WeakSet<HTMLElement>();

/** Keep source biographies readable without JavaScript; enhance cards with a modal. */
export function initTeam() {
  const root = document.querySelector<HTMLElement>('.team-directory#team-main');
  if (!root || initialized.has(root)) return;
  const panel = root.querySelector<HTMLDialogElement>('[data-team-profile]');
  const sheet = panel?.querySelector<HTMLElement>('[data-profile-sheet]');
  const name = panel?.querySelector<HTMLElement>('[data-profile-name]');
  const details = panel?.querySelector<HTMLElement>('[data-profile-details]');
  const biography = panel?.querySelector<HTMLElement>('[data-profile-bio]');
  const portraitSlot = panel?.querySelector<HTMLElement>('[data-profile-portrait]');
  const links = panel?.querySelector<HTMLElement>('[data-profile-links]');
  const closeButton = panel?.querySelector<HTMLButtonElement>('[data-profile-close]');
  const content = panel?.querySelector<HTMLElement>('.team-profile__content');
  const copy = panel?.querySelector<HTMLElement>('.team-profile__copy');
  const position = panel?.querySelector<HTMLElement>('[data-profile-position]');
  const announcement = panel?.querySelector<HTMLElement>('[data-profile-announcement]');
  const previousButton = panel?.querySelector<HTMLButtonElement>('[data-profile-previous]');
  const nextButton = panel?.querySelector<HTMLButtonElement>('[data-profile-next]');
  if (!panel || !sheet || !name || !details || !biography || !portraitSlot || !links || !closeButton
    || !content || !copy || !position || !announcement || !previousButton || !nextButton) return;
  initialized.add(root);

  const watchPortrait = (portrait: HTMLElement) => {
    const image = portrait.querySelector<HTMLImageElement>('img');
    if (!image) return;
    const update = () => {
      const loaded = image.naturalWidth > 0;
      portrait.dataset.imageState = loaded ? 'loaded' : 'error';
      portrait.classList.toggle('is-error', !loaded);
    };
    image.addEventListener('load', update, { once: true });
    image.addEventListener('error', update, { once: true });
    if (image.complete) update();
  };
  root.querySelectorAll<HTMLElement>('[data-portrait]').forEach(watchPortrait);
  if (typeof panel.showModal !== 'function') return;

  let opener: HTMLButtonElement | null = null;
  let previousOverflow = '';
  let previousGutter = '';
  let backdropPress = false;
  const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-member-open]'));
  let activeIndex = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motion: Animation[] = [];
  let motionPhase: 'opening' | 'closing' | 'browsing' | null = null;
  let motionId = 0;
  let flight: HTMLElement | null = null;
  let motionSource: HTMLElement | null = null;

  const clonePortrait = (source: HTMLElement, suffix: string) => {
    const portrait = source.cloneNode(true) as HTMLElement;
    const clip = portrait.querySelector<SVGClipPathElement>('clipPath');
    const surface = portrait.querySelector<HTMLElement>('.team-portrait__surface');
    if (clip && surface) {
      clip.id += suffix;
      surface.style.clipPath = 'url(#' + clip.id + ')';
    }
    const image = portrait.querySelector('img');
    if (image) image.loading = 'eager';
    watchPortrait(portrait);
    return portrait;
  };

  const stopMotion = () => {
    motionId++;
    motion.forEach(animation => animation.cancel());
    motion = [];
    motionPhase = null;
    delete panel.dataset.motion;
    flight?.remove();
    flight = null;
    motionSource?.removeAttribute('data-profile-source');
    motionSource = null;
  };

  const restorePage = () => {
    if (!opener) return;
    stopMotion();
    document.documentElement.style.overflow = previousOverflow;
    document.documentElement.style.scrollbarGutter = previousGutter;
    opener.setAttribute('aria-expanded', 'false');
    opener.focus({ preventScroll: true });
    opener = null;
    backdropPress = false;
  };

  const dismiss = () => {
    panel.close();
    // The native close event is queued; restore now so a quick reopen is safe.
    restorePage();
  };

  const finishMotion = (closing = false) => {
    const id = motionId;
    Promise.allSettled(motion.map(animation => animation.finished)).then(() => {
      if (id !== motionId) return;
      stopMotion();
      if (closing) dismiss();
    });
  };

  const flip = (direction: 'opening' | 'closing') => {
    if (reducedMotion.matches) {
      if (direction === 'closing') dismiss();
      return;
    }
    stopMotion();
    motionPhase = direction;
    panel.dataset.motion = direction;
    const opening = direction === 'opening';
    const source = triggers[activeIndex] === opener
      ? opener?.closest('[data-member]')?.querySelector<HTMLElement>('[data-portrait]') : null;
    const portrait = portraitSlot.querySelector<HTMLElement>('[data-portrait]');
    // The reading surface stays still; only the honeycomb portrait turns.
    motion = [sheet.animate([{ opacity: opening ? 0 : 1 }, { opacity: opening ? 1 : 0 }], {
      duration: opening ? 180 : 220, easing: 'ease-out', fill: 'both',
    })];
    if (!source || !portrait) {
      finishMotion(!opening);
      return;
    }
    const start = source.getBoundingClientRect();
    const end = portrait.getBoundingClientRect();
    const dx = end.left + end.width / 2 - start.left - start.width / 2;
    const dy = end.top + end.height / 2 - start.top - start.height / 2;
    const at = (x: number, y: number, turn: number, scaleX: number, scaleY: number) =>
      `translate3d(${x}px,${y}px,0) perspective(1200px) rotateY(${turn}deg) scale(${scaleX},${scaleY})`;

    flight = document.createElement('div');
    flight.className = 'team-profile__flight';
    flight.setAttribute('aria-hidden', 'true');
    flight.inert = true;
    Object.assign(flight.style, {
      left: `${start.left}px`, top: `${start.top}px`,
      width: `${start.width}px`, height: `${start.height}px`,
    });
    flight.append(clonePortrait(source, '-flight'));
    panel.append(flight);
    motionSource = source;
    source.setAttribute('data-profile-source', '');

    // Match both faces at the edge-on turn without stretching the photo into a panel.
    const timing: KeyframeAnimationOptions = {
      duration: opening ? 320 : 220,
      easing: opening ? 'cubic-bezier(.2,.75,.25,1)' : 'cubic-bezier(.4,0,.6,1)',
      fill: 'both',
    };
    const front = [
      { transform: at(0, 0, 0, 1, 1) },
      { transform: at(dx, dy, opening ? 180 : -180, end.width / start.width, end.height / start.height) },
    ];
    const back = [
      { transform: at(-dx, -dy, opening ? -180 : 180, start.width / end.width, start.height / end.height) },
      { transform: at(0, 0, 0, 1, 1) },
    ];
    motion.push(
      flight.animate(opening ? front : front.reverse(), timing),
      portrait.animate(opening ? back : back.reverse(), timing),
    );
    finishMotion(!opening);
  };

  const close = () => {
    // A second dismissal or Escape during the entrance should never wait for motion.
    if (motionPhase) {
      stopMotion();
      dismiss();
    } else flip('closing');
  };

  const renderProfile = (index: number, announce = false) => {
    activeIndex = (index + triggers.length) % triggers.length;
    const trigger = triggers[activeIndex];
    const member = trigger.closest<HTMLElement>('[data-member]')!;
    name.textContent = trigger.dataset.memberName ?? '';
    details.textContent = trigger.dataset.memberDetails ?? '';
    details.hidden = !details.textContent;

    const source = member.querySelector<HTMLElement>('[data-member-bio]');
    biography.replaceChildren();
    biography.hidden = !source;
    if (source) biography.append(source.cloneNode(true));

    const linkHadFocus = links.contains(document.activeElement);
    links.replaceChildren();
    const profileLink = member.querySelector<HTMLAnchorElement>('.team-advisor__link');
    links.hidden = !profileLink;
    if (profileLink) links.append(profileLink.cloneNode(true));
    if (linkHadFocus) (links.querySelector<HTMLAnchorElement>('a') ?? nextButton).focus({ preventScroll: true });

    portraitSlot.replaceChildren();
    const portrait = member.querySelector<HTMLElement>('[data-portrait]');
    if (portrait) portraitSlot.append(clonePortrait(portrait, '-profile'));

    const previous = triggers[(activeIndex - 1 + triggers.length) % triggers.length];
    const next = triggers[(activeIndex + 1) % triggers.length];
    // Warm the adjacent photos while the current profile is being read.
    for (const neighbor of [previous, next]) {
      const image = neighbor.closest('[data-member]')?.querySelector<HTMLImageElement>('img');
      if (image) image.loading = 'eager';
    }
    const section = member.closest('section')?.id;
    const group = section === 'the-team' ? 'Students' : section === 'advisors' ? 'Team advisor' : 'External advisors';
    position.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${triggers.length} · ${group}`;
    previousButton.setAttribute('aria-label', `Previous profile: ${previous.dataset.memberName}`);
    nextButton.setAttribute('aria-label', `Next profile: ${next.dataset.memberName}`);
    announcement.textContent = announce ? `${name.textContent}, ${activeIndex + 1} of ${triggers.length}` : '';
    content.scrollTop = 0;
  };

  const browse = (step: number) => {
    if (!panel.open || motionPhase === 'closing') return;
    stopMotion();
    const portrait = portraitSlot.querySelector<HTMLElement>('[data-portrait]');
    const outgoing = portrait && !reducedMotion.matches ? clonePortrait(portrait, '-outgoing') : null;
    renderProfile(activeIndex + step, true);
    const incoming = portraitSlot.querySelector<HTMLElement>('[data-portrait]');
    if (!outgoing || !incoming) return;
    motionPhase = 'browsing';
    panel.dataset.motion = 'browsing';
    flight = outgoing;
    outgoing.classList.add('team-profile__outgoing');
    outgoing.setAttribute('aria-hidden', 'true');
    outgoing.inert = true;
    portraitSlot.append(outgoing);
    const turn = (degrees: number) => `perspective(1200px) rotateY(${degrees}deg)`;
    const timing: KeyframeAnimationOptions = { duration: 260, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' };
    motion = [
      outgoing.animate([{ transform: turn(0) }, { transform: turn(180 * step) }], timing),
      incoming.animate([{ transform: turn(-180 * step) }, { transform: turn(0) }], timing),
      copy.animate([{ opacity: .25 }, { opacity: 1 }], { duration: 160, easing: 'ease-out', fill: 'both' }),
    ];
    finishMotion();
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => {
      if (panel.open) return;
      opener = trigger;
      renderProfile(index);
      const page = document.documentElement;
      previousOverflow = page.style.overflow;
      previousGutter = page.style.scrollbarGutter;
      page.style.scrollbarGutter = 'stable';
      page.style.overflow = 'hidden';
      trigger.setAttribute('aria-expanded', 'true');
      panel.showModal();
      flip('opening');
    });
    const member = trigger.closest('[data-member]')!;
    const fallback = member.querySelector<HTMLElement>('[data-bio-fallback]');
    if (fallback) fallback.hidden = true;
    trigger.hidden = false;
  });

  closeButton.addEventListener('click', close);
  previousButton.addEventListener('click', () => browse(-1));
  nextButton.addEventListener('click', () => browse(1));
  panel.addEventListener('cancel', event => {
    event.preventDefault();
    close();
  });
  panel.addEventListener('close', () => {
    if (!panel.open) restorePage();
  });
  panel.addEventListener('keydown', event => {
    if (!event.altKey && !event.ctrlKey && !event.metaKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      browse(event.key === 'ArrowLeft' ? -1 : 1);
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = Array.from(sheet.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'))
      .filter(control => control.getClientRects().length && !control.closest('[hidden], [inert]'));
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  let swipe: { x: number; y: number; time: number } | null = null;
  portraitSlot.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    swipe = { x: event.clientX, y: event.clientY, time: event.timeStamp };
    portraitSlot.setPointerCapture(event.pointerId);
  });
  portraitSlot.addEventListener('pointercancel', () => { swipe = null; });
  portraitSlot.addEventListener('pointerup', event => {
    if (!swipe) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    const elapsed = event.timeStamp - swipe.time;
    swipe = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3 && elapsed < 700) browse(dx < 0 ? 1 : -1);
  });
  reducedMotion.addEventListener('change', () => {
    const wasClosing = motionPhase === 'closing';
    stopMotion();
    if (wasClosing) dismiss();
  });
  window.addEventListener('resize', () => {
    // The flight uses viewport coordinates captured at its start. Let the
    // responsive dialog settle immediately if those coordinates change.
    if (!motionPhase) return;
    const wasClosing = motionPhase === 'closing';
    stopMotion();
    if (wasClosing) dismiss();
  });

  // Escape, background inertness, and focus containment use native modal behavior.
  const outside = (event: MouseEvent) => {
    const box = panel.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right
      || event.clientY < box.top || event.clientY > box.bottom;
  };
  panel.addEventListener('pointerdown', event => {
    backdropPress = event.target === panel && outside(event);
  });
  panel.addEventListener('click', event => {
    if (backdropPress && event.target === panel && outside(event)) close();
    backdropPress = false;
  });
}
