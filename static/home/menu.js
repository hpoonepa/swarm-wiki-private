import { getDestination } from './journey-stops.js?v=7c0bd87a1a76';

function followHash() {
  const top = getDestination(location.hash.slice(1));
  if (Number.isFinite(top)) scrollTo({ top, behavior: 'instant' });
}

addEventListener('swarm-ready', followHash);
addEventListener('hashchange', followHash);
addEventListener('popstate', followHash);
if (!document.documentElement.classList.contains('loading')) followHash();
