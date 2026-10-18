export function initIhp() {
  const main = document.querySelector<HTMLElement>('#ihp-main');
  if (!main || main.dataset.ihpInitialized === 'true') return;
  main.dataset.ihpInitialized = 'true';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reveals = [...main.querySelectorAll<HTMLElement>('[data-ihp-reveal]')];
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    reveals.forEach(element => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    reveals.forEach(element => observer.observe(element));
    document.documentElement.classList.add('ihp-ready');
  }

  const dialog = main.querySelector<HTMLDialogElement>('#ihp-dialog');
  const content = dialog?.querySelector<HTMLElement>('[data-ihp-content]');
  const count = dialog?.querySelector<HTMLElement>('[data-ihp-count]');
  const triggers = [...main.querySelectorAll<HTMLButtonElement>('button[data-ihp-entry]')];
  const templates = [...main.querySelectorAll<HTMLTemplateElement>('template[data-ihp-template]')];
  if (!dialog || !content || !templates.length) return;

  let active = 0;
  let opener: HTMLButtonElement | null = null;
  let savedOverflow: string | null = null;
  let outsidePointer: number | null = null;
  let openingAnimation: Animation | null = null;
  let contentAnimation: Animation | null = null;

  function updateTriggers() {
    const id = templates[active].dataset.ihpTemplate;
    triggers.forEach(trigger => {
      const selected = dialog!.open && trigger.dataset.ihpEntry === id;
      trigger.classList.toggle('is-current', selected);
      trigger.setAttribute('aria-expanded', String(selected));
    });
  }

  function show(index: number) {
    active = (index + templates.length) % templates.length;
    contentAnimation?.cancel();
    content!.replaceChildren(templates[active].content.cloneNode(true));
    content!.scrollTop = 0;
    if (count) {
      count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(templates.length).padStart(2, '0')}`;
    }
    updateTriggers();
    if (dialog!.open && !reducedMotion.matches) {
      contentAnimation = content!.animate(
        [{ opacity: 0.35, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 180, easing: 'ease-out' },
      );
    }
  }

  triggers.forEach(trigger => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', () => {
      const index = templates.findIndex(template => template.dataset.ihpTemplate === trigger.dataset.ihpEntry);
      if (index < 0) return;
      if (dialog.open) {
        show(index);
        return;
      }

      opener = trigger;
      show(index);
      dialog.showModal();
      if (savedOverflow === null) savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      updateTriggers();
      openingAnimation?.cancel();

      if (!reducedMotion.matches) {
        openingAnimation = dialog.animate(
          [
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 180, easing: 'ease-out' },
        );
      }
    });
  });

  dialog.querySelector('[data-ihp-close]')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-ihp-prev]')?.addEventListener('click', () => show(active - 1));
  dialog.querySelector('[data-ihp-next]')?.addEventListener('click', () => show(active + 1));
  dialog.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.closest('input, textarea, select') || target.isContentEditable)) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  function isOutside(event: PointerEvent) {
    const rect = dialog!.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  }

  dialog.addEventListener('pointerdown', event => {
    outsidePointer = event.button === 0 && isOutside(event) ? event.pointerId : null;
  });
  dialog.addEventListener('pointerup', event => {
    const shouldClose = outsidePointer === event.pointerId && isOutside(event);
    outsidePointer = null;
    if (shouldClose) dialog.close();
  });
  dialog.addEventListener('pointercancel', () => { outsidePointer = null; });
  dialog.addEventListener('close', () => {
    // A queued close event must not unlock a modal that has already reopened.
    if (dialog.open) return;
    openingAnimation?.cancel();
    contentAnimation?.cancel();
    outsidePointer = null;
    if (savedOverflow !== null) {
      document.body.style.overflow = savedOverflow;
      savedOverflow = null;
    }
    updateTriggers();
    opener?.focus({ preventScroll: true });
    opener = null;
  });
}
