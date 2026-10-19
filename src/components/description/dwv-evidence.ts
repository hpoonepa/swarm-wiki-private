// A selected evidence collection, NOT a global surveillance census.
// `year` filters by publication/report year, never by inferred arrival date.
// Coordinates position regional navigation markers; they are not apiary coordinates.
export const evidence = [
  {
    id: 'USA', name: 'United States', point: [-98, 39], year: 2017,
    sampled: 'May–November 2016', host: 'Western honey bee · Apis mellifera',
    value: '89.4%', measure: 'of 603 sampled apiaries tested positive for DWV',
    text: 'The national survey detected DWV in 539 apiaries. This is prevalence in the sampled apiaries, not a count of infected bees across the United States.',
    citation: 'Ryabov et al., 2017', url: 'https://www.nature.com/articles/s41598-017-17802-3',
  },
  {
    id: 'NZL', name: 'New Zealand', point: [173, -41], year: 2014,
    sampled: '2012–2013', host: 'Western honey bee · Apis mellifera',
    value: 'Detected', measure: 'along a transect spanning the Varroa invasion front',
    text: 'Researchers examined colonies across 22 apiaries. DWV was frequently detected in mite-infested regions; one colony also tested positive ahead of the recorded mite front.',
    citation: 'Mondet et al., 2014', url: 'https://doi.org/10.1371/journal.ppat.1004323',
  },
  {
    id: 'CHN', name: 'China', point: [104, 35], year: 2019,
    sampled: 'April 2015–March 2017', host: 'Western honey bee · Apis mellifera',
    value: '45.7%', measure: 'estimated DWV-A prevalence in sampled A. mellifera colonies',
    text: 'The study sampled 117 western honey bee colonies and 50 Asian honey bee colonies across 22 provinces. The 95% interval for the western honey bee estimate was 35.6–56.2%.',
    citation: 'Diao et al., 2019', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6700284/',
  },
  {
    id: 'ETH', name: 'Ethiopia', point: [39, 14], year: 2020,
    sampled: '2017', host: 'Ethiopian honey bee · Apis mellifera simensis',
    value: 'Detected', measure: 'DWV-B in sampled Ethiopian honey bees',
    text: 'This study found DWV-B in a selected set of 20 colonies. Viral detection alone does not establish symptomatic disease, colony loss, or a national prevalence estimate.',
    citation: 'Gebremedhn et al., 2020', url: 'https://doi.org/10.3390/v12111218',
  },
  {
    id: 'ARG', name: 'Argentina', point: [-63, -34], year: 2020,
    sampled: '2016', host: 'Western honey bee · Apis mellifera',
    value: '>90%', measure: 'of 45 apiary samples positive for DWV-A',
    text: 'Samples came from six beekeeping provinces. DWV-B was also detected in 47% of the samples. These overlapping genotype results must not be added together.',
    citation: 'Brasesco et al., online 2020 / issue 2021', url: 'https://doi.org/10.1017/S000748532000036X',
  },
  {
    id: 'GBR', name: 'United Kingdom', point: [-3, 55], year: 2022,
    sampled: '2011 and 2017', host: 'Western honey bee · Apis mellifera',
    value: 'Detected', measure: 'DWV genotypes in sampled foraging honey bees',
    text: 'Repeated sampling found a shift toward genotype B. This records a change in genotype composition, not a census of UK infections.',
    citation: 'Paxton et al., 2022 · original UK dataset', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9112108/#sec3.3',
  },
  {
    id: 'DEU', name: 'Germany', point: [10.5, 51.2], year: 2022,
    sampled: '2013 and 2019–2020', host: 'Western honey bee · Apis mellifera',
    value: 'Detected', measure: 'DWV-B in sampled collapsing colonies',
    text: 'Genotype B dominated this dataset in both sampling periods. Because these colonies were already collapsing, the results do not represent all German colonies.',
    citation: 'Paxton et al., 2022 · original German dataset', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9112108/#sec3.3',
  },
  {
    id: 'ITA', name: 'Italy', point: [12.5, 42.8], year: 2022,
    sampled: '2009–2013 and 2018–2020', host: 'Western honey bee · Apis mellifera',
    value: 'Detected', measure: 'DWV in sequencing datasets from northeast Italy',
    text: 'The later samples showed a greater representation of genotype B. Sequencing-library proportions are not national case counts.',
    citation: 'Paxton et al., 2022 · original Italian dataset', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9112108/#sec3.3',
  },
  {
    id: 'AUS', name: 'Western Australia', point: [116.8, -20.65], year: 2025,
    sampled: 'August 2023 · confirmed February 2025', host: 'Red dwarf honey bee · Apis florea',
    value: 'Confirmed', measure: 'DWV-A in a red dwarf honey bee sample near Dampier',
    text: 'Retesting an archived sample confirmed DWV-A. This record concerns an invasive bee species at the Burrup Peninsula; it does not establish infection throughout Australian managed honey bees.',
    citation: 'WA DPIRD, 4 February 2025; AHBIC, 5 February 2025', url: 'https://www.wa.gov.au/government/announcements/extra-surveillance-test-exotic-bee-virus',
    extraUrl: 'https://honeybee.org.au/wp-content/uploads/2025/02/AHBIC-Biosecurity-Update-DWV-WA.pdf',
  },
];

// Table 2, Akongte et al. (2026). Published values, not fitted or interpolated.
export const habitat = [
  { label: 'SSP2–4.5', area: 26.5, decline: 10.23 },
  { label: 'SSP3–7.0', area: 26.7, decline: 9.64 },
  { label: 'SSP5–8.5', area: 25.5, decline: 13.54 },
];
