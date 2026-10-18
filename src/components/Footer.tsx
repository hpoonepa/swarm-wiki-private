import React from 'react';
import footerHtml from '../../static/home/site-footer.html?raw';
import '../../static/home/site-footer.css';

// The static homepage uses this same template during build:home.
export default function Footer() {
  return <div className="swarm-footer__host" dangerouslySetInnerHTML={{ __html: footerHtml }} />;
}
