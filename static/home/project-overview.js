/* Keep the reading order left to right, with a connector returning to the next row. */
(() => {
  const list = document.querySelector('.swarm-overview__steps');
  if (!list) return;
  const cards = [...list.querySelectorAll(':scope > .swarm-overview__step')];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('swarm-overview__connectors');
  svg.setAttribute('aria-hidden', 'true');
  list.prepend(svg);
  function draw() {
    if (innerWidth <= 480) return;
    const box = list.getBoundingClientRect();
    const rows = cards.map(card => {
      const rect = card.getBoundingClientRect();
      const art = card.querySelector('.swarm-overview__art').getBoundingClientRect();
      return { left: rect.left - box.left, right: rect.right - box.left,
        top: rect.top - box.top, bottom: rect.bottom - box.top,
        y: art.top - box.top + art.height / 2 };
    });
    const paths = rows.slice(0, -1).map((a, index) => {
      const b = rows[index + 1], x = a.right + 3, end = b.left - 5;
      if (Math.abs(a.top - b.top) < 2) return `M${x},${a.y}H${end}`;
      const turn = (a.bottom + b.top) / 2, right = box.width - 2, left = 2, r = 8;
      return `M${x},${a.y}H${right-r}Q${right},${a.y} ${right},${a.y+r}` +
        `V${turn-r}Q${right},${turn} ${right-r},${turn}H${left+r}` +
        `Q${left},${turn} ${left},${turn+r}V${b.y-r}` +
        `Q${left},${b.y} ${left+r},${b.y}H${end}`;
    });
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.innerHTML = '<defs><marker id="project-path-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L6 4L1 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>' +
      paths.map(d => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#project-path-arrow)"/>`).join('');
  }
  new ResizeObserver(draw).observe(list);
  document.fonts.ready.then(draw);
  draw();
})();
