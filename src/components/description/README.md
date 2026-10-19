# Project description map

`DwvMap.astro` is rendered in the Introduction of `description.mdx`.

## Observed records

The historical view contains nine selected locations, not a global inventory or case census. `dwv-evidence.ts` stores primary sources and report/publication years. Autoplay takes 2.75 seconds through 2014, 2017, 2019, 2020, 2022, 2025 and stops. Country shading means a selected report exists; it is not national prevalence or arrival date. Markers are regional anchors, not apiaries. Australia concerns an archived 2023 Apis florea sample confirmed in 2025. Paxton entries use original datasets in the paper. Each marker and the source row link to the studies.

## Illustrative 2025–2050 transition

The user explicitly chose a labeled illustrative animation. The button advances the counter through every year in two seconds. `dwv-illustration.ts` contains art-directed country groups, color endpoints and onset offsets. They are not fitted predictions, case counts, suitability scores, or values extracted from the cited paper. Existing 2025 report countries start pale yellow; additional selected countries fade into yellow and then gold/rust. Uncolored countries do not imply absence. The visible “Illustrative transition” label and nonnumeric key remain on screen during playback and at 2050. Returning to 2025 clears all illustrative fills. Reduced motion skips directly to each endpoint.

## Separately cited published quantities

The endpoint also shows Table 2 from Akongte et al. (2026), https://pmc.ncbi.nlm.nih.gov/articles/PMC13358152/#Tab2. Thresholded suitable area is 25.5–26.7 million km² in the 2050s (2041–2060), versus 29.5 million km² under baseline 1970–2000 climate. Published declines are 9.64–13.54%. These ranges span three SSP scenarios, not confidence intervals. The figures are explicitly separated from the illustration and do not determine country colors. They describe climatic habitat, not DWV cases. No annual forecasts or spatial raster data were available. The original six-panel figure is not displayed, altered or traced.

Basemap: Natural Earth 1:110m admin-0 countries, public domain: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson. Properties reduced, coordinates rounded to three decimals, Antarctica omitted. D3 Natural Earth projection is computed at build time.
