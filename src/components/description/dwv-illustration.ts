// Art-directed color endpoints and staggered fades for the explicitly labeled
// illustrative transition. These are NOT case counts, suitability scores,
// country forecasts, or values extracted from the cited paper.
const pale = '#f8e7ad';
const neutral = '#e8e6db';
const groups = [
  { countries: 'USA CAN MEX', color: '#b85b2d', delay: .02 },
  { countries: 'GBR IRL FRA DEU BEL NLD LUX CHE AUT ITA ESP PRT DNK POL CZE SVK HUN SVN HRV', color: '#aa4727', delay: .04 },
  { countries: 'NOR SWE FIN EST LVA LTU ROU BGR GRC ALB MKD SRB BIH MNE UKR BLR MDA', color: '#d48432', delay: .14 },
  { countries: 'CHN JPN KOR IND PAK NPL BGD THA VNM MMR LAO KHM MYS IDN PHL', color: '#dfad43', delay: .18 },
  { countries: 'ARG BRA CHL URY PRY BOL PER ECU COL VEN', color: '#dd9b38', delay: .12 },
  { countries: 'AUS NZL', color: '#d99c37', delay: .1 },
  { countries: 'RUS TUR GEO ARM AZE KAZ UZB IRN', color: '#e7c563', delay: .28 },
  { countries: 'ETH KEN TZA ZAF UGA RWA MAR DZA TUN EGY', color: '#ebd38a', delay: .25 },
  { countries: 'GTM HND SLV NIC CRI PAN CUB DOM HTI JAM', color: '#e4ba58', delay: .2 },
];
const endpoints = new Map(groups.flatMap(group => group.countries.split(' ').map(iso => [iso, group] as const)));
const clamp = (value: number) => Math.max(0, Math.min(1, value));
function mix(from: string, to: string, amount: number) {
  const channels = [1, 3, 5].map(offset => Math.round(parseInt(from.slice(offset, offset + 2), 16) * (1 - amount) + parseInt(to.slice(offset, offset + 2), 16) * amount));
  return `rgb(${channels.join(',')})`;
}
export function illustrativeCountryFill(iso: string, progress: number, reported: boolean) {
  const endpoint = endpoints.get(iso);
  if (!endpoint) return reported ? pale : neutral;
  const local = clamp((progress - endpoint.delay) / (1 - endpoint.delay));
  if (reported) return mix(pale, endpoint.color, local);
  // Newly colored countries first emerge in pale yellow before deepening.
  return local < .24 ? mix(neutral, pale, local / .24) : mix(pale, endpoint.color, (local - .24) / .76);
}
