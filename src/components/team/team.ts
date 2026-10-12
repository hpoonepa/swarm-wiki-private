export function initTeam() {
  const dialog = document.querySelector<HTMLDialogElement>('#hive-profile');
  if (!dialog) return;
  const content = dialog.querySelector<HTMLElement>('[data-profile-content]')!;
  const count = dialog.querySelector<HTMLElement>('[data-profile-count]')!;
  const triggers = [...document.querySelectorAll<HTMLButtonElement>('[data-profile]')];
  const templates = [...document.querySelectorAll<HTMLTemplateElement>('[data-profile-template]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let opener: HTMLButtonElement | null = null;
  let savedOverflow = '';
  let gestureStartedOutside = false;
  function show(index: number) {
    active = (index + templates.length) % templates.length;
    content.replaceChildren(templates[active].content.cloneNode(true));
    content.scrollTop = 0;
    content.querySelectorAll<HTMLImageElement>('img').forEach(image => { image.loading = 'eager'; });
    count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(templates.length).padStart(2, '0')}`;
    if (dialog!.open && !reduced.matches) content.animate([{ opacity: .3, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 190, easing: 'ease-out' });
  }
  triggers.forEach(trigger => trigger.addEventListener('click', () => {
    const index = templates.findIndex(template => template.dataset.profileTemplate === trigger.dataset.profile);
    if (index < 0) return;
    opener = trigger; show(index);
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    if (!reduced.matches) {
      const rect = trigger.getBoundingClientRect();
      const drift = Math.max(-70, Math.min(70, rect.left + rect.width / 2 - innerWidth / 2));
      dialog.animate([{ opacity: 0, transform: `translate(${drift}px, 24px) scale(.91)` }, { opacity: 1, transform: 'translate(0, 0) scale(1)' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
  }));
  dialog.querySelector('[data-profile-close]')!.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-profile-prev]')!.addEventListener('click', () => show(active - 1));
  dialog.querySelector('[data-profile-next]')!.addEventListener('click', () => show(active + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); show(active + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(active - 1); }
  });
  const isOutside = (event: PointerEvent | MouseEvent) => {
    const box = dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  };
  dialog.addEventListener('pointerdown', event => { gestureStartedOutside = isOutside(event); });
  dialog.addEventListener('click', event => { if (gestureStartedOutside && isOutside(event)) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = savedOverflow; opener?.focus({ preventScroll: true }); });
}
