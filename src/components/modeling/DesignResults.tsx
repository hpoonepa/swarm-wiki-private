import { Fragment, useMemo, useState } from 'react';
import { designResults, type DesignResult } from './results';

const outcomeLabel = { confirmed: 'Binding confirmed', negative: 'Negative binding call', unresolved: 'No usable binding call' };
const score = (value: number | null | undefined) => value == null ? '—' : value.toFixed(3);
const outcomeOrder = { confirmed: 0, negative: 1, unresolved: 2 };
type SortKey = 'featured' | 'id' | 'campaign' | 'ipsae' | 'minIpsae' | 'iptm' | 'protenix';

export default function DesignResults() {
  const [query, setQuery] = useState('');
  const [campaign, setCampaign] = useState('all');
  const [outcome, setOutcome] = useState('all');
  const [sort, setSort] = useState<SortKey>('featured');
  const [ascending, setAscending] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const rows = useMemo(() => designResults.filter(row =>
    (campaign === 'all' || String(row.campaign) === campaign) &&
    (outcome === 'all' || row.outcome === outcome) &&
    `${row.id} ${row.method} ${row.site}`.toLowerCase().includes(query.trim().toLowerCase())
  ).sort((a, b) => {
    if (sort === 'featured') return outcomeOrder[a.outcome] - outcomeOrder[b.outcome] || b.campaign - a.campaign || (b.minIpsae ?? b.ipsae ?? -1) - (a.minIpsae ?? a.ipsae ?? -1);
    const av = a[sort], bv = b[sort];
    if (av == null) return bv == null ? 0 : 1;
    if (bv == null) return -1;
    const comparison = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
    return ascending ? comparison : -comparison;
  }), [query, campaign, outcome, sort, ascending]);

  function sortBy(key: SortKey) {
    setAscending(sort === key ? !ascending : key === 'id' || key === 'campaign');
    setSort(key);
  }

  function download() {
    const columns: (keyof DesignResult)[] = ['id', 'campaign', 'method', 'length', 'site', 'ipsae', 'minIpsae', 'iptm', 'iptmSource', 'protenix', 'complexPlddt', 'medianIpsae', 'predictionRuns', 'monomerPlddt', 'scrmsd', 'outcome', 'loading', 'kd', 'kdLow', 'kdHigh', 'metricSource'];
    const quote = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const csv = [columns.join(','), ...rows.map(row => columns.map(key => quote(row[key])).join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'swarm-submitted-minibinder-results.csv'; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const heading = (label: string, key: SortKey) => <th scope="col" aria-sort={sort === key ? ascending ? 'ascending' : 'descending' : 'none'}><button type="button" onClick={() => sortBy(key)}>{label}<span aria-hidden="true">{sort === key ? ascending ? ' ↑' : ' ↓' : ' ↕'}</span></button></th>;

  return <details className="md-results">
    <summary><span className="md-results-number">35</span><span><strong>Explore every submitted design</strong><small>Computational scores, assay outcomes, and available structures</small></span><span className="md-expand" aria-hidden="true">+</span></summary>
    <div className="md-results-body">
      <div className="md-result-controls">
        <label className="md-search">Find a design<input type="search" placeholder="Search ID, method, or site…" value={query} onChange={event => setQuery(event.target.value)} /></label>
        <label>Campaign<select value={campaign} onChange={event => setCampaign(event.target.value)}><option value="all">Both campaigns</option><option value="1">Round 1 · 15 designs</option><option value="2">Round 2 · 20 designs</option></select></label>
        <label>Experimental result<select value={outcome} onChange={event => setOutcome(event.target.value)}><option value="all">All outcomes</option><option value="confirmed">Binding confirmed</option><option value="negative">Negative binding call</option><option value="unresolved">No usable binding call</option></select></label>
      </div>
      <div className="md-table-meta"><p role="status" aria-live="polite">Showing {rows.length} of 35 submitted designs</p><button type="button" onClick={download}>Download these results ↓</button></div>
      <div className="md-table-scroll" tabIndex={0} role="region" aria-label="Scrollable design results">
        <table>
          <caption className="md-sr-only">All submitted minibinder designs. Select a column heading to sort, or expand a design for additional measurements.</caption>
          <thead><tr>{heading('Design', 'id')}{heading('Round', 'campaign')}{heading('ipSAE', 'ipsae')}{heading('Min. ipSAE', 'minIpsae')}{heading('ipTM', 'iptm')}{heading('Protenix ipTM', 'protenix')}<th scope="col">BLI outcome</th></tr></thead>
          <tbody>{rows.map(row => <Fragment key={row.id}>
            <tr className={row.outcome === 'confirmed' ? 'md-result-hit' : undefined}>
              <th scope="row"><button className="md-row-toggle" type="button" aria-expanded={expanded === row.id} aria-controls={`detail-${row.id}`} onClick={() => setExpanded(expanded === row.id ? null : row.id)}><span aria-hidden="true">{expanded === row.id ? '−' : '+'}</span><span>{row.id}<small>{row.length} aa · {row.method}</small></span></button></th>
              <td>{row.campaign}</td><td>{score(row.ipsae)}</td><td>{score(row.minIpsae)}</td><td title={row.iptmSource}>{score(row.iptm)}</td><td>{score(row.protenix)}</td>
              <td><span className={`md-outcome md-outcome--${row.outcome}`}>{outcomeLabel[row.outcome]}</span>{row.kd != null && <small className="md-kd">K<sub>D</sub> {row.kd.toFixed(1)} nM</small>}</td>
            </tr>
            <tr id={`detail-${row.id}`} hidden={expanded !== row.id} className="md-row-detail"><td colSpan={7}><div className="md-detail-grid">
              <dl><div><dt>Campaign site label</dt><dd>{row.site}</dd></div><div><dt>Complex pLDDT</dt><dd>{score(row.complexPlddt)}</dd></div><div><dt>ipTM source</dt><dd>{row.iptmSource}</dd></div></dl>
              <dl><div><dt>Repeated-prediction min. ipSAE median</dt><dd>{score(row.medianIpsae)}{row.predictionRuns != null ? ` (${row.predictionRuns} predictions)` : ''}</dd></div><div><dt>Monomer pLDDT</dt><dd>{score(row.monomerPlddt)}</dd></div><div><dt>Self-consistency RMSD</dt><dd>{row.scrmsd == null ? '—' : `${row.scrmsd.toFixed(3)} Å`}</dd></div></dl>
              <div><p><strong>BLI sensor loading:</strong> {row.loading || 'Not reported'}.</p><p>{row.outcome === 'unresolved' ? 'No usable binding call was available. This is not classified as a demonstrated non-binder.' : row.outcome === 'confirmed' ? `Combined fit from two BLI replicates. 95% confidence interval: ${row.kdLow?.toFixed(1)}–${row.kdHigh?.toFixed(1)} nM.` : 'The assay export reports a negative binding call. No fitted affinity was reported.'}</p>{row.viewer && <a href={`/lambert-ga/minibinder-viewer/?design=${row.viewer}`}>Inspect this predicted structure ↗</a>}</div>
            </div><p className="md-source-line">Scores: {row.metricSource}{row.protenix != null ? '; Protenix consensus export' : ''}. Outcome: Adaptyv Round {row.campaign} overall BLI record.</p></td></tr>
          </Fragment>)}</tbody>
        </table>
        {rows.length === 0 && <div className="md-empty"><p>No designs match these filters.</p><button type="button" onClick={() => { setQuery(''); setCampaign('all'); setOutcome('all'); }}>Clear filters</button></div>}
      </div>
      <p className="md-table-note">ipSAE and minimum ipSAE are shown separately because the two campaigns reported different metrics. Round 2 ipTM values are from Boltz-2; Round 1 values retain the campaign report’s label. A dash means no value was supplied. Confidence scores are not probabilities of experimental success.</p>
    </div>
  </details>;
}
