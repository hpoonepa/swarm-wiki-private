/* dwv_widgets.js: built from dwv_widgets.js, the model diagram and the parameter notes. */
window.DWV_DIAGRAM_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 84 1200 726\" role=\"img\" aria-labelledby=\"w2-title w2-desc\" font-family=\"Arial, 'Liberation Sans', Helvetica, sans-serif\">\n<title id=\"w2-title\">How the model works: every population, process and parameter</title>\n<desc id=\"w2-desc\">Compartment diagram of the honeybee, Varroa mite, virus and RNAi model. Boxes are populations, arrows are processes and the labels on the arrows are the parameters that set each rate.</desc>\n<defs>\n<marker id=\"w2-ah-gray\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M 0 0 L 10 5 L 0 10 z\" fill=\"#6b6a66\"/></marker>\n<marker id=\"w2-ah-orange\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M 0 0 L 10 5 L 0 10 z\" fill=\"#b85e42\"/></marker>\n<marker id=\"w2-ah-violet\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M 0 0 L 10 5 L 0 10 z\" fill=\"#a97920\"/></marker>\n</defs>\n<rect x=\"0\" y=\"84\" width=\"1200\" height=\"810\" fill=\"#ffffff\"/>\n<g id=\"w2-season\">\n<rect x=\"30\" y=\"90\" width=\"1140\" height=\"84\" rx=\"14\" fill=\"#f6f4e9\"/>\n<text x=\"48\" y=\"116\" font-size=\"11.5\" fill=\"#6b6a66\" text-anchor=\"start\" font-weight=\"700\">SEASONS + WEATHER</text>\n<text x=\"48\" y=\"136\" font-size=\"12.5\" fill=\"#52514e\" text-anchor=\"start\" font-weight=\"400\">13 rates follow the year</text>\n<text x=\"48\" y=\"154\" font-size=\"12.5\" fill=\"#52514e\" text-anchor=\"start\" font-weight=\"400\">through four values each</text>\n<circle cx=\"243\" cy=\"112\" r=\"5\" fill=\"#467c87\"/>\n<text x=\"253\" y=\"116\" font-size=\"12.5\" fill=\"#1f1f1d\" text-anchor=\"start\" font-weight=\"700\">Brood rearing</text>\n<g class=\"w1-param\" data-param=\"L\" tabindex=\"0\" role=\"button\" aria-label=\"Most new adult bees per day\"><title>Most new adult bees per day</title><rect x=\"238.0\" y=\"134.5\" width=\"22.7\" height=\"21\" rx=\"10.5\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"245.0\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">L</tspan></text></g>\n<g><title>Colony size for half brood care</title><rect x=\"265.7\" y=\"134.5\" width=\"22.7\" height=\"21\" rx=\"10.5\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"272.7\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">K</tspan></text></g>\n<g><title>Colony size where crowding starts</title><rect x=\"293.4\" y=\"134.5\" width=\"52.1\" height=\"21\" rx=\"10.5\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"300.4\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">K</tspan><tspan dy=\"3.9\" font-size=\"9.5\" font-style=\"normal\">crowd</tspan></text></g>\n<g><title>Colony size for half mite reproduction</title><rect x=\"350.4\" y=\"134.5\" width=\"46.2\" height=\"21\" rx=\"10.5\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"357.4\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">K</tspan><tspan dy=\"3.9\" font-size=\"9.5\" font-style=\"normal\">mite</tspan></text></g>\n<circle cx=\"497\" cy=\"112\" r=\"5\" fill=\"#4b785a\"/>\n<text x=\"507\" y=\"116\" font-size=\"12.5\" fill=\"#1f1f1d\" text-anchor=\"start\" font-weight=\"700\">Bee survival</text>\n<g class=\"w1-param\" data-param=\"dS\" tabindex=\"0\" role=\"button\" aria-label=\"Natural death rate of adult bees\"><title>Natural death rate of adult bees</title><rect x=\"492.0\" y=\"134.5\" width=\"28.6\" height=\"21\" rx=\"10.5\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"499.0\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">d</tspan><tspan dy=\"3.9\" font-size=\"9.5\" font-style=\"normal\">S</tspan></text></g>\n<g class=\"w1-param\" data-param=\"dI\" tabindex=\"0\" role=\"button\" aria-label=\"Extra death rate of infected bees\"><title>Extra death rate of infected bees</title><rect x=\"525.6\" y=\"134.5\" width=\"28.6\" height=\"21\" rx=\"10.5\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"532.6\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">d</tspan><tspan dy=\"3.9\" font-size=\"9.5\" font-style=\"normal\">I</tspan></text></g>\n<g><title>Recovery from DWV</title><rect x=\"559.1\" y=\"134.5\" width=\"28.6\" height=\"21\" rx=\"10.5\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"566.1\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03b3</tspan><tspan dy=\"3.9\" font-size=\"9.5\" font-style=\"normal\">I</tspan></text></g>\n<circle cx=\"695\" cy=\"112\" r=\"5\" fill=\"#b8860b\"/>\n<text x=\"705\" y=\"116\" font-size=\"12.5\" fill=\"#1f1f1d\" text-anchor=\"start\" font-weight=\"700\">Mite growth</text>\n<g class=\"w1-param\" data-param=\"rM\" tabindex=\"0\" role=\"button\" aria-label=\"Mite growth rate\"><title>Mite growth rate</title><rect x=\"690.0\" y=\"134.5\" width=\"28.6\" height=\"21\" rx=\"10.5\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"697.0\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">r</tspan><tspan dy=\"3.9\" font-size=\"9.5\" font-style=\"normal\">M</tspan></text></g>\n<g><title>Mites per bee at carrying capacity</title><rect x=\"723.6\" y=\"134.5\" width=\"22.7\" height=\"21\" rx=\"10.5\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"730.6\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03b1</tspan></text></g>\n<g><title>Natural death rate of mites</title><rect x=\"751.2\" y=\"134.5\" width=\"28.6\" height=\"21\" rx=\"10.5\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"758.2\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">d</tspan><tspan dy=\"3.9\" font-size=\"9.5\" font-style=\"normal\">M</tspan></text></g>\n<circle cx=\"873\" cy=\"112\" r=\"5\" fill=\"#996770\"/>\n<text x=\"883\" y=\"116\" font-size=\"12.5\" fill=\"#1f1f1d\" text-anchor=\"start\" font-weight=\"700\">Virus contact</text>\n<g class=\"w1-param\" data-param=\"betaMB\" tabindex=\"0\" role=\"button\" aria-label=\"Mite-to-bee DWV transmission\"><title>Mite-to-bee DWV transmission</title><rect x=\"868.0\" y=\"134.5\" width=\"34.4\" height=\"21\" rx=\"10.5\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"875.0\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03b2</tspan><tspan dy=\"3.9\" font-size=\"9.5\" font-style=\"normal\">MB</tspan></text></g>\n<g class=\"w1-param\" data-param=\"betaBM\" tabindex=\"0\" role=\"button\" aria-label=\"Bee-to-mite DWV pick-up\"><title>Bee-to-mite DWV pick-up</title><rect x=\"907.4\" y=\"134.5\" width=\"34.4\" height=\"21\" rx=\"10.5\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"914.4\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03b2</tspan><tspan dy=\"3.9\" font-size=\"9.5\" font-style=\"normal\">BM</tspan></text></g>\n<g><title>Rate mites lose the virus</title><rect x=\"946.9\" y=\"134.5\" width=\"28.6\" height=\"21\" rx=\"10.5\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"953.9\" y=\"149.8\" font-size=\"14\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03bd</tspan><tspan dy=\"3.9\" font-size=\"9.5\" font-style=\"normal\">M</tspan></text></g>\n<text x=\"1052\" y=\"116\" font-size=\"12.5\" fill=\"#1f1f1d\" text-anchor=\"start\" font-weight=\"700\">Weather</text>\n<g><title>Day-to-day persistence of the weather</title><rect x=\"1052.0\" y=\"135.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"1059.0\" y=\"149.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03c6</tspan></text></g>\n<g><title>Size of daily weather changes</title><rect x=\"1079.1\" y=\"135.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"1086.1\" y=\"149.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03c3</tspan></text></g>\n<g><title>Size of weather events</title><rect x=\"1052.0\" y=\"157.0\" width=\"20.8\" height=\"18\" rx=\"9.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"1059.0\" y=\"169.7\" font-size=\"11\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">A</tspan></text></g>\n<g><title>Year-to-year weather offset</title><rect x=\"1075.8\" y=\"157.0\" width=\"30.1\" height=\"18\" rx=\"9.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"1082.8\" y=\"169.7\" font-size=\"11\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03c3</tspan><tspan dy=\"3.1\" font-size=\"7.5\" font-style=\"normal\">yr</tspan></text></g>\n<g><title>How strongly each group of rates follows the weather</title><rect x=\"1108.9\" y=\"157.0\" width=\"20.8\" height=\"18\" rx=\"9.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"1115.9\" y=\"169.7\" font-size=\"11\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03bb</tspan></text></g>\n</g>\n<text x=\"32\" y=\"214\" font-size=\"11.5\" fill=\"#6b6a66\" text-anchor=\"start\" font-weight=\"700\">HONEYBEES</text>\n<g class=\"w1-node\" data-node=\"NA\" tabindex=\"0\" role=\"button\" data-name=\"New adults\" data-tip=\"Workers emerging from capped brood. Emergence follows the seasonal maximum L, needs enough adult bees to care for the brood (K, n), and falls when virus-carrying mites infest cells (\u03b9, q).\"><title>New adults</title>\n<rect x=\"30\" y=\"236\" width=\"170\" height=\"72\" rx=\"12\" fill=\"#f6f5f2\" stroke=\"#bcbab4\" stroke-width=\"1.6\"/>\n<text x=\"44\" y=\"262\" font-size=\"15\" font-weight=\"700\" fill=\"#1f1f1d\">New adults</text>\n<text x=\"44\" y=\"282\" font-size=\"12.5\" fill=\"#52514e\">from capped brood</text>\n</g>\n<g class=\"w1-node\" data-node=\"S\" tabindex=\"0\" role=\"button\" data-name=\"Healthy bees (S)\" data-tip=\"Adult bees without deformed wing virus. They die naturally (d_S), from mite feeding damage (\u03ba_M per mite) and from crowding (c above K_crowd), and become infected when virus-carrying mites feed on them (\u03b2_MB).\"><title>Healthy bees</title>\n<rect x=\"340\" y=\"236\" width=\"180\" height=\"72\" rx=\"12\" fill=\"#edf4f2\" stroke=\"#467c87\" stroke-width=\"1.6\"/>\n<text x=\"354\" y=\"262\" font-size=\"15\" font-weight=\"700\" fill=\"#1f1f1d\">Healthy bees</text>\n<circle cx=\"502\" cy=\"254\" r=\"11\" fill=\"#467c87\"/>\n<text x=\"502\" y=\"258\" font-size=\"11.5\" font-weight=\"700\" fill=\"#fff\" text-anchor=\"middle\">S</text>\n<text x=\"354\" y=\"282\" font-size=\"12.5\" fill=\"#52514e\">adults without DWV</text>\n</g>\n<g class=\"w1-node\" data-node=\"I\" tabindex=\"0\" role=\"button\" data-name=\"Infected bees (I)\" data-tip=\"Adult bees carrying DWV. They die at the same rates as healthy bees plus an extra DWV death rate (d_I), and could recover at \u03b3_I, which is 0 in this parameter set.\"><title>Infected bees</title>\n<rect x=\"712\" y=\"236\" width=\"180\" height=\"72\" rx=\"12\" fill=\"#fbefe5\" stroke=\"#b85e42\" stroke-width=\"1.6\"/>\n<text x=\"726\" y=\"262\" font-size=\"15\" font-weight=\"700\" fill=\"#1f1f1d\">Infected bees</text>\n<circle cx=\"874\" cy=\"254\" r=\"11\" fill=\"#b85e42\"/>\n<text x=\"874\" y=\"258\" font-size=\"11.5\" font-weight=\"700\" fill=\"#fff\" text-anchor=\"middle\">I</text>\n<text x=\"726\" y=\"282\" font-size=\"12.5\" fill=\"#52514e\">carry DWV</text>\n</g>\n<path d=\"M 200 272 L 338 272\" fill=\"none\" stroke=\"#6b6a66\" stroke-width=\"1.8\" marker-end=\"url(#w2-ah-gray)\"/>\n<g class=\"w1-param\" data-param=\"L\" tabindex=\"0\" role=\"button\" aria-label=\"Most new adult bees per day\"><title>Most new adult bees per day</title><rect x=\"230.9\" y=\"246.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"237.9\" y=\"260.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">L</tspan></text></g>\n<g><title>Colony size for half brood care</title><rect x=\"258.0\" y=\"246.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"265.0\" y=\"260.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">K</tspan></text></g>\n<g><title>Steepness of the brood-care gates</title><rect x=\"285.0\" y=\"246.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"292.0\" y=\"260.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">n</tspan></text></g>\n<text x=\"228\" y=\"291\" font-size=\"12.5\" fill=\"#52514e\" text-anchor=\"middle\" font-weight=\"400\">emerge</text>\n<path d=\"M 520 284 L 710 284\" fill=\"none\" stroke=\"#b85e42\" stroke-width=\"2.2\" marker-end=\"url(#w2-ah-orange)\"/>\n<text x=\"615\" y=\"300\" font-size=\"12.5\" fill=\"#b85e42\" text-anchor=\"middle\" font-weight=\"700\">infection</text>\n<path d=\"M 712 254 L 522 254\" fill=\"none\" stroke=\"#8a8984\" stroke-width=\"1.4\" stroke-dasharray=\"5 4\" marker-end=\"url(#w2-ah-gray)\"/>\n<text x=\"560\" y=\"246\" font-size=\"12\" fill=\"#52514e\" text-anchor=\"start\" font-weight=\"400\">recovery</text>\n<g><title>Recovery from DWV</title><rect x=\"616.0\" y=\"236.0\" width=\"27.5\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"623.0\" y=\"250.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03b3</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">I</tspan></text></g>\n<text x=\"668\" y=\"250\" font-size=\"12\" fill=\"#52514e\" text-anchor=\"start\" font-weight=\"400\">= 0</text>\n<path d=\"M 380 236 L 380 207\" fill=\"none\" stroke=\"#6b6a66\" stroke-width=\"1.8\" marker-end=\"url(#w2-ah-gray)\"/>\n<circle cx=\"380\" cy=\"197\" r=\"9\" fill=\"#fff\" stroke=\"#9a9893\" stroke-width=\"1.4\"/><path d=\"M 375 202 L 385 192\" stroke=\"#9a9893\" stroke-width=\"1.4\"/>\n<path d=\"M 852 236 L 852 207\" fill=\"none\" stroke=\"#6b6a66\" stroke-width=\"1.8\" marker-end=\"url(#w2-ah-gray)\"/>\n<circle cx=\"852\" cy=\"197\" r=\"9\" fill=\"#fff\" stroke=\"#9a9893\" stroke-width=\"1.4\"/><path d=\"M 847 202 L 857 192\" stroke=\"#9a9893\" stroke-width=\"1.4\"/>\n<text x=\"398\" y=\"201\" font-size=\"12\" fill=\"#52514e\" text-anchor=\"start\" font-weight=\"400\">deaths</text>\n<g class=\"w1-param\" data-param=\"dS\" tabindex=\"0\" role=\"button\" aria-label=\"Natural death rate of adult bees\"><title>Natural death rate of adult bees</title><rect x=\"446.0\" y=\"186.0\" width=\"27.5\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"453.0\" y=\"200.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">d</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">S</tspan></text></g>\n<g><title>Extra adult death per feeding mite</title><rect x=\"478.5\" y=\"186.0\" width=\"27.5\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"485.5\" y=\"200.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03ba</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">M</tspan></text></g>\n<g><title>Highest crowding death rate</title><rect x=\"511.0\" y=\"186.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"518.0\" y=\"200.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">c</tspan></text></g>\n<g><title>Colony size where crowding starts</title><rect x=\"538.1\" y=\"186.0\" width=\"49.4\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"545.1\" y=\"200.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">K</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">crowd</tspan></text></g>\n<text x=\"870\" y=\"201\" font-size=\"12\" fill=\"#52514e\" text-anchor=\"start\" font-weight=\"400\">same deaths</text>\n<path d=\"M 892 284 L 1024 284\" fill=\"none\" stroke=\"#6b6a66\" stroke-width=\"1.8\" marker-end=\"url(#w2-ah-gray)\"/>\n<circle cx=\"1036\" cy=\"284\" r=\"9\" fill=\"#fff\" stroke=\"#9a9893\" stroke-width=\"1.4\"/><path d=\"M 1031 289 L 1041 279\" stroke=\"#9a9893\" stroke-width=\"1.4\"/>\n<text x=\"956\" y=\"276\" font-size=\"12\" fill=\"#52514e\" text-anchor=\"middle\" font-weight=\"400\">extra DWV deaths</text>\n<g class=\"w1-param\" data-param=\"dI\" tabindex=\"0\" role=\"button\" aria-label=\"Extra death rate of infected bees\"><title>Extra death rate of infected bees</title><rect x=\"1052.0\" y=\"274.0\" width=\"27.5\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"1059.0\" y=\"288.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">d</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">I</tspan></text></g>\n<text x=\"1036\" y=\"312\" font-size=\"11\" fill=\"#6b6a66\" text-anchor=\"middle\" font-weight=\"400\">counted in D</text>\n<text x=\"32\" y=\"418\" font-size=\"11.5\" fill=\"#6b6a66\" text-anchor=\"start\" font-weight=\"700\">VARROA MITES</text>\n<g class=\"w1-node\" data-node=\"B\" tabindex=\"0\" role=\"button\" data-name=\"Mite births\" data-tip=\"Varroa mites reproduce only in capped brood, so births (r_M) slow down when the colony is small (K_mite, n), for example in winter.\"><title>Mite births</title>\n<rect x=\"30\" y=\"440\" width=\"170\" height=\"72\" rx=\"12\" fill=\"#f6f5f2\" stroke=\"#bcbab4\" stroke-width=\"1.6\"/>\n<text x=\"44\" y=\"466\" font-size=\"15\" font-weight=\"700\" fill=\"#1f1f1d\">Mite births</text>\n<text x=\"44\" y=\"486\" font-size=\"12.5\" fill=\"#52514e\">in capped brood</text>\n</g>\n<g class=\"w1-node\" data-node=\"M\" tabindex=\"0\" role=\"button\" data-name=\"Feeding mites (M)\" data-tip=\"Living mites that can still feed. Some carry DWV (M_i). Crowding (r_M, \u03b1), natural death (d_M) and grooming (g, N_g) remove them; mites feeding on protected bees are disabled (\u03b4_max).\"><title>Feeding mites</title>\n<rect x=\"476\" y=\"430\" width=\"300\" height=\"98\" rx=\"12\" fill=\"#f5f0e9\" stroke=\"#8a6a4a\" stroke-width=\"1.6\"/>\n<text x=\"490\" y=\"456\" font-size=\"15\" font-weight=\"700\" fill=\"#1f1f1d\">Feeding mites</text>\n<circle cx=\"758\" cy=\"448\" r=\"11\" fill=\"#8a6a4a\"/>\n<text x=\"758\" y=\"452\" font-size=\"11.5\" font-weight=\"700\" fill=\"#fff\" text-anchor=\"middle\">M</text>\n</g>\n<g pointer-events=\"none\">\n<rect x=\"490\" y=\"474\" width=\"112\" height=\"40\" rx=\"10\" fill=\"#ffffff\" stroke=\"#467c87\" stroke-width=\"1.2\"/>\n<text x=\"546\" y=\"499\" font-size=\"12.5\" fill=\"#1f1f1d\" text-anchor=\"middle\" font-weight=\"400\">virus-free</text>\n<rect x=\"650\" y=\"474\" width=\"112\" height=\"40\" rx=\"10\" fill=\"#fbefe5\" stroke=\"#b85e42\" stroke-width=\"1.2\"/>\n<text x=\"706\" y=\"493\" font-size=\"12.5\" fill=\"#1f1f1d\" text-anchor=\"middle\" font-weight=\"400\">carry DWV</text>\n<text x=\"706\" y=\"508\" font-size=\"11.5\" fill=\"#52514e\" text-anchor=\"middle\">(<tspan font-style=\"italic\">M</tspan><tspan dy=\"3\" font-size=\"8.5\">i</tspan><tspan dy=\"-3\">)</tspan></text>\n</g>\n<path d=\"M 604 486 L 648 486\" fill=\"none\" stroke=\"#b85e42\" stroke-width=\"1.6\" marker-end=\"url(#w2-ah-orange)\"/>\n<path d=\"M 648 504 L 604 504\" fill=\"none\" stroke=\"#8a8984\" stroke-width=\"1.4\" marker-end=\"url(#w2-ah-gray)\"/>\n<path d=\"M 200 476 L 474 476\" fill=\"none\" stroke=\"#6b6a66\" stroke-width=\"1.8\" marker-end=\"url(#w2-ah-gray)\"/>\n<text x=\"338\" y=\"466\" font-size=\"12.5\" fill=\"#52514e\" text-anchor=\"middle\" font-weight=\"400\">births in capped brood</text>\n<g class=\"w1-param\" data-param=\"rM\" tabindex=\"0\" role=\"button\" aria-label=\"Mite growth rate\"><title>Mite growth rate</title><rect x=\"286.3\" y=\"484.0\" width=\"27.5\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"293.3\" y=\"498.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">r</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">M</tspan></text></g>\n<g><title>Colony size for half mite reproduction</title><rect x=\"318.8\" y=\"484.0\" width=\"43.9\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"325.8\" y=\"498.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">K</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">mite</tspan></text></g>\n<g><title>Steepness of the brood-care gates</title><rect x=\"367.7\" y=\"484.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"374.7\" y=\"498.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">n</tspan></text></g>\n<text x=\"626\" y=\"546\" font-size=\"12\" fill=\"#52514e\" text-anchor=\"end\" font-weight=\"400\">carriers lose DWV</text>\n<g><title>Rate mites lose the virus</title><rect x=\"632.0\" y=\"532.0\" width=\"27.5\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"639.0\" y=\"546.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03bd</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">M</tspan></text></g>\n<path d=\"M 516 528 L 516 586\" fill=\"none\" stroke=\"#6b6a66\" stroke-width=\"1.8\" marker-end=\"url(#w2-ah-gray)\"/>\n<circle cx=\"516\" cy=\"596\" r=\"9\" fill=\"#fff\" stroke=\"#9a9893\" stroke-width=\"1.4\"/><path d=\"M 511 601 L 521 591\" stroke=\"#9a9893\" stroke-width=\"1.4\"/>\n<text x=\"500\" y=\"592\" font-size=\"12\" fill=\"#52514e\" text-anchor=\"end\" font-weight=\"400\">removed by crowding, natural death, grooming</text>\n<g class=\"w1-param\" data-param=\"rM\" tabindex=\"0\" role=\"button\" aria-label=\"Mite growth rate\"><title>Mite growth rate</title><rect x=\"353.3\" y=\"602.0\" width=\"27.5\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"360.3\" y=\"616.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">r</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">M</tspan></text></g>\n<g><title>Mites per bee at carrying capacity</title><rect x=\"385.8\" y=\"602.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"392.8\" y=\"616.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03b1</tspan></text></g>\n<g><title>Natural death rate of mites</title><rect x=\"412.9\" y=\"602.0\" width=\"27.5\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"419.9\" y=\"616.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">d</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">M</tspan></text></g>\n<g><title>Highest grooming rate</title><rect x=\"445.4\" y=\"602.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"452.4\" y=\"616.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">g</tspan></text></g>\n<g><title>Colony size for half grooming</title><rect x=\"472.5\" y=\"602.0\" width=\"27.5\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"479.5\" y=\"616.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">N</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">g</tspan></text></g>\n<path d=\"M 686 430 L 686 288\" fill=\"none\" stroke=\"#b85e42\" stroke-width=\"2.2\" marker-end=\"url(#w2-ah-orange)\"/>\n<text x=\"674\" y=\"352\" font-size=\"12.5\" fill=\"#b85e42\" text-anchor=\"end\" font-weight=\"400\">mites carrying DWV</text>\n<text x=\"674\" y=\"368\" font-size=\"12.5\" fill=\"#b85e42\" text-anchor=\"end\" font-weight=\"400\">infect healthy bees</text>\n<g class=\"w1-param\" data-param=\"betaMB\" tabindex=\"0\" role=\"button\" aria-label=\"Mite-to-bee DWV transmission\"><title>Mite-to-bee DWV transmission</title><rect x=\"622.0\" y=\"378.0\" width=\"33.0\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"629.0\" y=\"392.4\" font-size=\"13\" fill=\"#b85e42\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03b2</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">MB</tspan></text></g>\n<path d=\"M 760 308 C 760 360, 626 380, 626 482\" fill=\"none\" stroke=\"#b85e42\" stroke-width=\"1.8\" stroke-dasharray=\"6 4\" marker-end=\"url(#w2-ah-orange)\"/>\n<text x=\"776\" y=\"352\" font-size=\"12.5\" fill=\"#b85e42\" text-anchor=\"start\" font-weight=\"400\">mites pick up DWV</text>\n<text x=\"776\" y=\"368\" font-size=\"12.5\" fill=\"#b85e42\" text-anchor=\"start\" font-weight=\"400\">from infected bees</text>\n<g class=\"w1-param\" data-param=\"betaBM\" tabindex=\"0\" role=\"button\" aria-label=\"Bee-to-mite DWV pick-up\"><title>Bee-to-mite DWV pick-up</title><rect x=\"776.0\" y=\"378.0\" width=\"33.0\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"783.0\" y=\"392.4\" font-size=\"13\" fill=\"#b85e42\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03b2</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">BM</tspan></text></g>\n<path d=\"M 482 452 C 400 390, 312 340, 306 280\" fill=\"none\" stroke=\"#b85e42\" stroke-width=\"1.6\" stroke-dasharray=\"2 4\" marker-end=\"url(#w2-ah-orange)\"/>\n<text x=\"214\" y=\"356\" font-size=\"12\" fill=\"#b85e42\" text-anchor=\"start\" font-weight=\"400\">infested brood</text>\n<text x=\"214\" y=\"371\" font-size=\"12\" fill=\"#b85e42\" text-anchor=\"start\" font-weight=\"400\">emerges less</text>\n<g><title>Brood cells entered per mite</title><rect x=\"214.0\" y=\"381.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"221.0\" y=\"395.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03b9</tspan></text></g>\n<g><title>Emergence lost from an infested cell</title><rect x=\"241.1\" y=\"381.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"248.1\" y=\"395.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">q</tspan></text></g>\n<g><title>Most cells that can be infested</title><rect x=\"268.1\" y=\"381.0\" width=\"38.4\" height=\"20\" rx=\"10.0\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"275.1\" y=\"395.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">f</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">max</tspan></text></g>\n<path d=\"M 776 476 L 918 476\" fill=\"none\" stroke=\"#a97920\" stroke-width=\"2.2\" marker-end=\"url(#w2-ah-violet)\"/>\n<g class=\"w1-node\" data-node=\"Ma\" tabindex=\"0\" role=\"button\" data-name=\"Disabled mites (Ma)\" data-tip=\"Mites that took up dsRNA by feeding on protected bees. They cannot feed, breed, harm bees or spread DWV, and die at k_die (counted in D_m).\"><title>Disabled mites</title>\n<rect x=\"920\" y=\"440\" width=\"170\" height=\"72\" rx=\"12\" fill=\"#efedf9\" stroke=\"#a97920\" stroke-width=\"1.6\"/>\n<text x=\"934\" y=\"466\" font-size=\"15\" font-weight=\"700\" fill=\"#1f1f1d\">Disabled mites</text>\n<circle cx=\"1072\" cy=\"458\" r=\"13\" fill=\"#a97920\"/>\n<text x=\"1072\" y=\"462\" font-size=\"11.5\" font-weight=\"700\" fill=\"#fff\" text-anchor=\"middle\">Ma</text>\n<text x=\"934\" y=\"486\" font-size=\"12.5\" fill=\"#52514e\">cannot feed</text>\n</g>\n<path d=\"M 1090 476 L 1138 476\" fill=\"none\" stroke=\"#6b6a66\" stroke-width=\"1.8\" marker-end=\"url(#w2-ah-gray)\"/>\n<circle cx=\"1150\" cy=\"476\" r=\"9\" fill=\"#fff\" stroke=\"#9a9893\" stroke-width=\"1.4\"/><path d=\"M 1145 481 L 1155 471\" stroke=\"#9a9893\" stroke-width=\"1.4\"/>\n<g class=\"w1-param\" data-param=\"kDie\" tabindex=\"0\" role=\"button\" aria-label=\"Death rate of disabled mites\"><title>Death rate of disabled mites</title><rect x=\"1092.0\" y=\"446.0\" width=\"38.4\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"1099.0\" y=\"460.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">k</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">die</tspan></text></g>\n<text x=\"1150\" y=\"504\" font-size=\"11\" fill=\"#6b6a66\" text-anchor=\"middle\" font-weight=\"400\">counted in Dm</text>\n<text x=\"32\" y=\"646\" font-size=\"11.5\" fill=\"#6b6a66\" text-anchor=\"start\" font-weight=\"700\">RNAi TREATMENT</text>\n<g class=\"w1-node\" data-node=\"F\" tabindex=\"0\" role=\"button\" data-name=\"dsRNA sucrose\" data-tip=\"The RNAi treatment: sucrose syrup carrying dsRNA against Varroa, supplied to the colony all year in the main scenario.\"><title>dsRNA sucrose</title>\n<rect x=\"30\" y=\"668\" width=\"170\" height=\"72\" rx=\"12\" fill=\"#efedf9\" stroke=\"#a97920\" stroke-width=\"1.6\"/>\n<text x=\"44\" y=\"694\" font-size=\"15\" font-weight=\"700\" fill=\"#1f1f1d\">dsRNA sucrose</text>\n<text x=\"44\" y=\"714\" font-size=\"12.5\" fill=\"#52514e\">fed all year</text>\n</g>\n<g class=\"w1-node\" data-node=\"Sh\" tabindex=\"0\" role=\"button\" data-name=\"Protected bees (Sh)\" data-tip=\"Adult bees (healthy or infected) carrying an effective dose of dsRNA. Bees take it up at u, it wears off at \u2113, and it is lost when the bee dies.\"><title>Protected bees</title>\n<rect x=\"770\" y=\"668\" width=\"180\" height=\"72\" rx=\"12\" fill=\"#efedf9\" stroke=\"#a97920\" stroke-width=\"1.6\"/>\n<text x=\"784\" y=\"694\" font-size=\"15\" font-weight=\"700\" fill=\"#1f1f1d\">Protected bees</text>\n<circle cx=\"932\" cy=\"686\" r=\"13\" fill=\"#a97920\"/>\n<text x=\"932\" y=\"690\" font-size=\"11.5\" font-weight=\"700\" fill=\"#fff\" text-anchor=\"middle\">Sh</text>\n<text x=\"784\" y=\"714\" font-size=\"12.5\" fill=\"#52514e\">share of all adults</text>\n</g>\n<path d=\"M 200 704 L 768 704\" fill=\"none\" stroke=\"#a97920\" stroke-width=\"2\" marker-end=\"url(#w2-ah-violet)\"/>\n<text x=\"470\" y=\"694\" font-size=\"12.5\" fill=\"#a97920\" text-anchor=\"middle\" font-weight=\"400\">bees drink the sucrose</text>\n<g class=\"w1-param\" data-param=\"u\" tabindex=\"0\" role=\"button\" aria-label=\"Sucrose uptake rate\"><title>Sucrose uptake rate</title><rect x=\"459.0\" y=\"712.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"466.0\" y=\"726.4\" font-size=\"13\" fill=\"#a97920\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">u</tspan></text></g>\n<path d=\"M 950 704 L 1028 704\" fill=\"none\" stroke=\"#6b6a66\" stroke-width=\"1.8\" marker-end=\"url(#w2-ah-gray)\"/>\n<circle cx=\"1040\" cy=\"704\" r=\"9\" fill=\"#fff\" stroke=\"#9a9893\" stroke-width=\"1.4\"/><path d=\"M 1035 709 L 1045 699\" stroke=\"#9a9893\" stroke-width=\"1.4\"/>\n<text x=\"988\" y=\"694\" font-size=\"12\" fill=\"#52514e\" text-anchor=\"middle\" font-weight=\"400\">wears off</text>\n<g class=\"w1-param\" data-param=\"loss\" tabindex=\"0\" role=\"button\" aria-label=\"dsRNA loss rate\"><title>dsRNA loss rate</title><rect x=\"1056.0\" y=\"694.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"1063.0\" y=\"708.4\" font-size=\"13\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u2113</tspan></text></g>\n<text x=\"1040\" y=\"732\" font-size=\"11\" fill=\"#6b6a66\" text-anchor=\"middle\" font-weight=\"400\">or bee dies</text>\n<path d=\"M 860 668 L 860 480\" fill=\"none\" stroke=\"#a97920\" stroke-width=\"2.2\" marker-end=\"url(#w2-ah-violet)\"/>\n<text x=\"874\" y=\"552\" font-size=\"12.5\" fill=\"#a97920\" text-anchor=\"start\" font-weight=\"400\">mites feeding on protected</text>\n<text x=\"874\" y=\"568\" font-size=\"12.5\" fill=\"#a97920\" text-anchor=\"start\" font-weight=\"400\">bees are disabled</text>\n<g class=\"w1-param\" data-param=\"deltaMax\" tabindex=\"0\" role=\"button\" aria-label=\"Highest mite-disabling rate\"><title>Highest mite-disabling rate</title><rect x=\"874.0\" y=\"580.0\" width=\"38.4\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"881.0\" y=\"594.4\" font-size=\"13\" fill=\"#a97920\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">\u03b4</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">max</tspan></text></g>\n<g class=\"w1-param\" data-param=\"EC50\" tabindex=\"0\" role=\"button\" aria-label=\"Protected share for half effect\"><title>Protected share for half effect</title><rect x=\"917.4\" y=\"580.0\" width=\"41.0\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"924.4\" y=\"594.4\" font-size=\"13\" fill=\"#a97920\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">EC</tspan><tspan dy=\"3.6\" font-size=\"8.8\" font-style=\"normal\">50</tspan></text></g>\n<g class=\"w1-param\" data-param=\"h\" tabindex=\"0\" role=\"button\" aria-label=\"Steepness of the dose-response\"><title>Steepness of the dose-response</title><rect x=\"963.5\" y=\"580.0\" width=\"22.1\" height=\"20\" rx=\"10.0\" fill=\"#fff4ce\" stroke=\"#b98a35\" stroke-width=\"1.5\"/><text x=\"970.5\" y=\"594.4\" font-size=\"13\" fill=\"#a97920\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">h</tspan></text></g>\n<text x=\"32\" y=\"772\" font-size=\"12\" fill=\"#52514e\" text-anchor=\"start\" font-weight=\"400\">Colony collapse: if adult bees fall below</text>\n<g><title>Collapse threshold</title><rect x=\"266.0\" y=\"758.5\" width=\"36.6\" height=\"19\" rx=\"9.5\" fill=\"#ffffff\" stroke=\"#bdbab2\" stroke-width=\"1\"/><text x=\"273.0\" y=\"772.1\" font-size=\"12\" fill=\"#1f1f1d\" font-family=\"'STIX Two Math', 'Cambria Math', 'Latin Modern Math', 'Times New Roman', Times, serif\"><tspan font-style=\"italic\">N</tspan><tspan dy=\"3.4\" font-size=\"8.2\" font-style=\"normal\">min</tspan></text></g>\n<text x=\"318\" y=\"772\" font-size=\"12\" fill=\"#52514e\" text-anchor=\"start\" font-weight=\"400\">= 200, all living bees and mites are set to 0 and the colony stays dead.</text>\n<text x=\"32\" y=\"792\" font-size=\"12\" fill=\"#52514e\" text-anchor=\"start\" font-weight=\"400\">Every run starts with 12,000 adult bees (750 infected) and 400 feeding mites (180 carrying DWV).</text>\n</svg>";
window.DWV_PARAMS = {"params":[{"key":"L","path":"seasonal:L","symbol":"L","name":"Most new adult bees per day","units":"bees per day","source":"Calculated from the seasonal egg-laying curve in [1]","refs":[1],"usedIn":"Emergence of new adults"},{"key":"K","path":"seasonal:K","symbol":"K","name":"Colony size for half brood care","units":"bees","source":"Calibrated: 20% of the upper limits in [2]","refs":[2],"usedIn":"Emergence of new adults"},{"key":"Kcrowd","path":"seasonal:Kcrowd","symbol":"K_crowd","name":"Colony size where crowding starts","units":"bees","source":"[3]","refs":[3],"usedIn":"Adult deaths (crowding)"},{"key":"Kmite","path":"seasonal:Kmite","symbol":"K_mite","name":"Colony size for half mite reproduction","units":"bees","source":"Estimated","refs":[],"usedIn":"Mite births"},{"key":"dS","path":"seasonal:dS","symbol":"d_S","name":"Natural death rate of adult bees","units":"per day","source":"[4]","refs":[4],"usedIn":"Adult deaths"},{"key":"dI","path":"seasonal:dI","symbol":"d_I","name":"Extra death rate of infected bees","units":"per day","source":"[5], [6]","refs":[5,6],"usedIn":"DWV deaths"},{"key":"gammaI","path":"seasonal:gammaI","symbol":"\u03b3_I","name":"Recovery from DWV","units":"per day","source":"Assumption: infected bees do not recover","refs":[],"usedIn":"Recovery"},{"key":"rM","path":"seasonal:rM","symbol":"r_M","name":"Mite growth rate","units":"per day","source":"[9], [4], [10]","refs":[9,4,10],"usedIn":"Mite births and crowding"},{"key":"alpha","path":"seasonal:alpha","symbol":"\u03b1","name":"Mites per bee at carrying capacity","units":"mites per bee","source":"[11]","refs":[11],"usedIn":"Mite crowding"},{"key":"dM","path":"seasonal:dM","symbol":"d_M","name":"Natural death rate of mites","units":"per day","source":"[12]","refs":[12],"usedIn":"Mite removal"},{"key":"betaMB","path":"seasonal:betaMB","symbol":"\u03b2_MB","name":"Mite-to-bee DWV transmission","units":"per virus-carrying mite per day","source":"[7]","refs":[7],"usedIn":"Infection of healthy bees"},{"key":"betaBM","path":"seasonal:betaBM","symbol":"\u03b2_BM","name":"Bee-to-mite DWV pick-up","units":"per virus-free mite per day","source":"Estimated","refs":[],"usedIn":"Mites picking up DWV"},{"key":"nuM","path":"seasonal:nuM","symbol":"\u03bd_M","name":"Rate mites lose the virus","units":"per day (times the healthy share)","source":"[8]","refs":[8],"usedIn":"Virus loss in mites"},{"key":"n","path":"n","symbol":"n","name":"Steepness of the brood-care gates","units":"no unit","source":"Calibrated by fitting; also the exponent of the brood term in [2]","refs":[2],"usedIn":"Emergence and mite births"},{"key":"kappaM","path":"kappaM","symbol":"\u03ba_M","name":"Extra adult death per feeding mite","units":"per mite per day","source":"[13]","refs":[13],"usedIn":"Adult deaths (mite damage)"},{"key":"crowd","path":"beeDensityDeathRate","symbol":"c","name":"Highest crowding death rate","units":"per day","source":"Estimated","refs":[],"usedIn":"Adult deaths (crowding)"},{"key":"groom","path":"groomingRate","symbol":"g","name":"Highest grooming rate","units":"per day","source":"[14]","refs":[14],"usedIn":"Mite removal (grooming)"},{"key":"groomHalf","path":"groomingHalfSat","symbol":"N_g","name":"Colony size for half grooming","units":"bees","source":"Estimated","refs":[],"usedIn":"Mite removal (grooming)"},{"key":"invasion","path":"invasionRate","symbol":"\u03b9","name":"Brood cells entered per mite","units":"per mite per day","source":"Estimated: one cell per 7.7-day phoretic phase (Rosenkranz et al. 2010 give 4.5 to 11 days)","refs":[],"usedIn":"Infested brood"},{"key":"emergLoss","path":"emergenceLoss","symbol":"q","name":"Emergence lost from an infested cell","units":"fraction","source":"[13]: 1 - 69/96, infested vs healthy brood","refs":[13],"usedIn":"Infested brood"},{"key":"maxInf","path":"maxInfested","symbol":"f_max","name":"Most cells that can be infested","units":"fraction","source":"A ceiling, not a measured value","refs":[],"usedIn":"Infested brood"},{"key":"collapse","path":"collapseThreshold","symbol":"N_min","name":"Collapse threshold","units":"adult bees","source":"Rule of the model: a colony this small is counted as dead","refs":[],"usedIn":"Colony collapse"},{"key":"u","path":"rnai:u","symbol":"u","name":"Sucrose uptake rate","units":"per day","source":"[15]","refs":[15],"usedIn":"Protection of bees"},{"key":"loss","path":"rnai:loss","symbol":"\u2113","name":"dsRNA loss rate","units":"per day","source":"[16]","refs":[16],"usedIn":"Protection of bees"},{"key":"deltaMax","path":"rnai:deltaMax","symbol":"\u03b4_max","name":"Highest mite-disabling rate","units":"per day","source":"[17]; the one potency parameter calibrated to data","refs":[17],"usedIn":"Mite disabling"},{"key":"EC50","path":"rnai:EC50","symbol":"EC_50","name":"Protected share for half effect","units":"share of adult bees","source":"Estimated; fixed shape of the dose-response","refs":[],"usedIn":"Mite disabling"},{"key":"h","path":"rnai:h","symbol":"h","name":"Steepness of the dose-response","units":"no unit","source":"Estimated; fixed shape of the dose-response","refs":[],"usedIn":"Mite disabling"},{"key":"kDie","path":"rnai:kDie","symbol":"k_die","name":"Death rate of disabled mites","units":"per day","source":"[18]","refs":[18],"usedIn":"Disabled mites"},{"key":"phi","path":"env:phi","symbol":"\u03c6","name":"Day-to-day persistence of the weather","units":"no unit","source":"Model choice (no direct source)","refs":[],"usedIn":"Weather"},{"key":"innovation","path":"env:innovation","symbol":"\u03c3","name":"Size of daily weather changes","units":"log scale","source":"Model choice (no direct source)","refs":[],"usedIn":"Weather"},{"key":"eventScale","path":"env:eventScale","symbol":"A","name":"Size of weather events","units":"log scale","source":"Model choice: one event every ~105 days, 5 to 25 days long","refs":[],"usedIn":"Weather"},{"key":"annualSD","path":"env:annualSD","symbol":"\u03c3_yr","name":"Year-to-year weather offset","units":"log scale","source":"Model choice (no direct source)","refs":[],"usedIn":"Weather"},{"key":"loading","path":"env:loading","symbol":"\u03bb","name":"How strongly each group of rates follows the weather","units":"brood, mite, survival, contact","source":"Chosen to match the size of the earlier model's weather drivers","refs":[],"usedIn":"Weather"}],"refs":{"1":"https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0130966","2":"https://arxiv.org/abs/2003.12089","3":"https://horizon.documentation.ird.fr/exl-doc/pleins_textes/divers21-03/010081011.pdf","4":"https://www.nature.com/articles/s41598-019-40725-0","5":"https://pmc.ncbi.nlm.nih.gov/articles/PMC5310602/","6":"https://pmc.ncbi.nlm.nih.gov/articles/PMC3776811/","7":"https://link.springer.com/article/10.1007/s40808-024-01974-9","8":"https://ejde.math.unt.edu/conf-proc/19/e1/eberl.pdf","9":"https://www.frontiersin.org/journals/ecology-and-evolution/articles/10.3389/fevo.2023.1102457/full","10":"https://link.springer.com/article/10.1007/s10493-014-9821-z","11":"https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0057540","12":"https://pubmed.ncbi.nlm.nih.gov/32967324/","13":"https://pubmed.ncbi.nlm.nih.gov/31034843/","14":"https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0179329","15":"https://pmc.ncbi.nlm.nih.gov/articles/PMC5371368/","16":"https://www.frontiersin.org/journals/insect-science/articles/10.3389/finsc.2026.1868457/full","17":"https://pmc.ncbi.nlm.nih.gov/articles/PMC11966912/","18":"https://pmc.ncbi.nlm.nih.gov/articles/PMC10644891/","19":"https://www.cambridge.org/core/journals/canadian-entomologist/article/abs/timing-acaricide-treatments-to-prevent-varroa-destructor-acari-varroidae-from-causing-economic-damage-to-honey-bee-colonies/887D7C98E3EDF54349D9529F72DC0406"}};

/* DWV / Varroa model widgets for the iGEM wiki.
 *
 * Put an empty <div class="dwv-viz" data-dwv="NAME"></div> wherever a widget
 * should appear. NAME is one of:
 *   diagram      the model diagram; the main parameters and every box open a short note
 *   explorer     results at a glance and the four population graphs (untreated / fed dsRNA,
 *                bees / mites), with a weather band on every line
 *   net          net effect: how many fewer feeding mites than the untreated colony, day by day
 *   dose         the dose-response slider
 *   sensitivity  which treatment properties matter most (+/-25%)
 *   uptake       how many bees need to drink the dsRNA syrup each day
 *   timing       when to start the dsRNA syrup (start month vs mites and the winter colony)
 *   stats        (optional) the results-at-a-glance numbers on their own
 *
 * Every number comes from window.DWV_DATA, which the MATLAB script writes as
 * dwv_wiki_data.js; load that file before this one. This file also carries the
 * diagram (DWV_DIAGRAM_SVG) and the parameter notes (DWV_PARAMS).
 * No libraries and no network requests.
 */
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONTH_START = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var GROUPS = ['ctrl', 'rnai'];
  var GROUP_NAME = { ctrl: 'Untreated', rnai: 'Fed dsRNA' };
  var GROUP_TITLE = { ctrl: 'Untreated colony', rnai: 'Fed dsRNA sucrose all year' };
  var WEATHER_GROUP = { brood: 'brood-rearing', mite: 'mite-growth', survival: 'bee-survival', contact: 'virus-contact' };
  var uid = 0;

  // ---------- DOM helpers ----------
  function svg(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    if (attrs) { Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); }); }
    if (parent) { parent.appendChild(n); }
    return n;
  }
  function svgText(parent, x, y, str, cls, anchor) {
    var t = svg('text', { x: x, y: y, 'class': cls, 'text-anchor': anchor || 'start' }, parent);
    t.textContent = str;
    return t;
  }
  function html(tag, attrs, parent, str) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') { n.className = attrs[k]; } else { n.setAttribute(k, attrs[k]); }
      });
    }
    if (str !== undefined && str !== null) { n.textContent = str; }
    if (parent) { parent.appendChild(n); }
    return n;
  }
  function text(parent, str) { parent.appendChild(document.createTextNode(str)); }
  function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }
  function clone(o) { var c = {}; Object.keys(o).forEach(function (k) { c[k] = o[k]; }); return c; }

  // ---------- numbers ----------
  function finite(v) { return v !== null && v !== undefined && isFinite(v); }
  var NF = {};
  function fixed(v, d) {
    var f = NF[d] || (NF[d] = new Intl.NumberFormat('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }));
    var s = f.format(v);
    return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s;
  }
  function int(v) { return finite(v) ? fixed(Math.round(v), 0) : '\u2013'; }
  function count(v) {                         // bees or mites
    if (!finite(v)) { return '\u2013'; }
    var a = Math.abs(v);
    if (a >= 10) { return int(v); }
    if (a === 0) { return '0'; }
    if (a >= 1) { return fixed(v, 1); }
    return a < 0.005 ? '< 0.01' : fixed(v, 2);
  }
  function per100(v) {                        // mites per 100 adult bees
    if (!finite(v)) { return '\u2013'; }
    var a = Math.abs(v);
    if (a === 0) { return '0'; }
    if (a < 0.005) { return '< 0.01'; }
    return fixed(v, a >= 10 ? 1 : 2);
  }
  function pct(v) {
    if (!finite(v)) { return '\u2013'; }
    if (v === 0) { return '0%'; }
    return fixed(v, Math.abs(v) >= 9.95 ? 0 : 1) + '%';
  }
  var SUPERSCRIPT = { '-': '\u207b', '0': '\u2070', '1': '\u00b9', '2': '\u00b2', '3': '\u00b3', '4': '\u2074',
                      '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079' };
  function paramNum(v) {                      // a parameter value as written in the model
    if (!finite(v)) { return '\u2013'; }
    if (v === 0) { return '0'; }
    var a = Math.abs(v);
    if (a < 1e-4) {
      var e = Math.floor(Math.log10(a)), mant = parseFloat((v / Math.pow(10, e)).toPrecision(3));
      return mant + ' \u00d7 10' + String(e).split('').map(function (c) { return SUPERSCRIPT[c]; }).join('');
    }
    var p = parseFloat(v.toPrecision(4));
    return a >= 1000 ? int(p) : String(p);
  }
  function decimalsFor(step) {
    for (var d = 0; d < 7; d++) {
      var x = step * Math.pow(10, d);
      if (Math.abs(x - Math.round(x)) < 1e-6 * Math.max(1, x)) { return d; }
    }
    return 6;
  }
  function maxOf(arr) {
    var m = -Infinity;
    for (var i = 0; i < arr.length; i++) { if (finite(arr[i]) && arr[i] > m) { m = arr[i]; } }
    return m;
  }
  function minOf(arr) {
    var m = Infinity;
    for (var i = 0; i < arr.length; i++) { if (finite(arr[i]) && arr[i] < m) { m = arr[i]; } }
    return m;
  }
  function anyPositive(arr) {
    for (var i = 0; i < arr.length; i++) { if (finite(arr[i]) && arr[i] > 0) { return true; } }
    return false;
  }
  // Lowest "nice" axis top >= maxVal that takes 3-6 steps (larger step on ties).
  function niceScale(maxVal) {
    if (!(maxVal > 0)) { maxVal = 1; }
    var mag = Math.pow(10, Math.floor(Math.log10(maxVal)));
    var best = null;
    [0.1, 0.2, 0.25, 0.5, 1, 2, 2.5, 5, 10].forEach(function (f) {
      var step = f * mag;
      var top = step * Math.ceil(maxVal / step - 1e-9);
      var n = Math.round(top / step);
      if (n >= 3 && n <= 6 && (!best || top < best.top - 1e-9 ||
          (Math.abs(top - best.top) < 1e-9 * Math.max(1, top) && step > best.step))) {
        best = { top: top, step: step };
      }
    });
    var ticks = [];
    for (var i = 0; i * best.step <= best.top * (1 + 1e-9); i++) { ticks.push(+(i * best.step).toFixed(10)); }
    return { top: best.top, step: best.step, ticks: ticks };
  }
  function rangeTicks(lo, hi, target) {
    var raw = (hi - lo) / target;
    var mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var step = [1, 2, 2.5, 5, 10].map(function (f) { return f * mag; }).filter(function (s) { return s >= raw; })[0];
    var out = [];
    for (var v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) { out.push(+v.toFixed(10)); }
    return { ticks: out, step: step };
  }
  function nearest(xs, v) {
    var lo = 0, hi = xs.length - 1;
    while (hi - lo > 1) {
      var mid = (lo + hi) >> 1;
      if (xs[mid] < v) { lo = mid; } else { hi = mid; }
    }
    return (Math.abs(xs[lo] - v) <= Math.abs(xs[hi] - v)) ? lo : hi;
  }
  function linePath(xs, ys, sx, sy) {
    var d = '', pen = false;
    for (var i = 0; i < xs.length; i++) {
      if (!finite(ys[i])) { pen = false; continue; }
      d += (pen ? 'L' : 'M') + sx(xs[i]).toFixed(1) + ' ' + sy(ys[i]).toFixed(1);
      pen = true;
    }
    return d;
  }
  function bandPath(xs, lo, hi, sx, sy) {
    // one closed shape per stretch where both edges exist
    var d = '', top = [], bottom = [];
    function flush() {
      if (top.length > 1) { d += 'M' + top.join('L') + 'L' + bottom.reverse().join('L') + 'Z'; }
      top = []; bottom = [];
    }
    for (var i = 0; i < xs.length; i++) {
      if (!finite(lo[i]) || !finite(hi[i])) { flush(); continue; }
      top.push(sx(xs[i]).toFixed(1) + ' ' + sy(hi[i]).toFixed(1));
      bottom.push(sx(xs[i]).toFixed(1) + ' ' + sy(lo[i]).toFixed(1));
    }
    flush();
    return d;
  }
  function onWidthChange(node, fn) {
    var last = node.clientWidth, frame = 0;
    function check() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        var w = node.clientWidth;
        if (w > 0 && w !== last) { last = w; fn(); }
      });
    }
    if ('ResizeObserver' in window) { new ResizeObserver(check).observe(node); } else { window.addEventListener('resize', check); }
  }

  // ---------- small UI pieces ----------
  function segmented(parent, label, options, current, onPick) {
    var box = html('div', { 'class': 'dwv-seg', role: 'group', 'aria-label': label }, parent);
    var buttons = options.map(function (o) {
      var b = html('button', { type: 'button', 'aria-pressed': String(o.value === current) }, box, o.label);
      b.addEventListener('click', function () {
        if (b.getAttribute('aria-pressed') === 'true') { return; }
        pick(o.value);
        onPick(o.value);
      });
      return b;
    });
    function pick(v) { options.forEach(function (o, i) { buttons[i].setAttribute('aria-pressed', String(o.value === v)); }); }
    box.pick = pick;
    return box;
  }
  function checkbox(parent, id, label, checked, onChange) {
    var lab = html('label', { 'class': 'dwv-check', 'for': id }, parent);
    var input = html('input', { type: 'checkbox', id: id }, lab);
    input.checked = checked;
    if (checked) { input.setAttribute('checked', ''); }       // so a saved still copy shows it ticked
    text(lab, label);
    input.addEventListener('change', function () {
      if (input.checked) { input.setAttribute('checked', ''); } else { input.removeAttribute('checked'); }
      onChange(input.checked);
    });
    return { label: lab, input: input };
  }
  // A line sample in the same style as the chart line (class names shared with the charts).
  function swatch(cls) {
    var s = svg('svg', { width: 26, height: 10, viewBox: '0 0 26 10', 'aria-hidden': 'true', 'class': 'dwv-sw' });
    svg('line', { x1: 1, x2: 25, y1: 5, y2: 5, 'class': 'dwv-ln dwv-s-' + cls }, s);
    return s;
  }
  // "K_crowd" -> italic K with subscript "crowd"
  function symbol(parent, sym) {
    var span = html('span', { 'class': 'dwv-sym' }, parent);
    var parts = String(sym).split('_');
    html('i', null, span, parts[0]);
    if (parts.length > 1) { html('sub', null, span, parts.slice(1).join('_')); }
    return span;
  }
  // Plain text in which symbols such as "r_M" or "\u03b4_max" are written as symbols.
  function richText(parent, str) {
    var re = /([A-Za-z\u0370-\u03ff\u2113]{1,2})_([A-Za-z0-9]+)/g, last = 0, mt;
    str = String(str || '');
    while ((mt = re.exec(str))) {
      if (mt.index > last) { text(parent, str.slice(last, mt.index)); }
      symbol(parent, mt[1] + '_' + mt[2]);
      last = re.lastIndex;
    }
    if (last < str.length) { text(parent, str.slice(last)); }
  }
  function hostOf(url) { return String(url).replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, ''); }
  // Source text with every [n] turned into a link to reference n.
  function sourceText(parent, txt, refs) {
    var re = /\[(\d+)\]/g, last = 0, mt;
    txt = String(txt || '');
    while ((mt = re.exec(txt))) {
      if (mt.index > last) { text(parent, txt.slice(last, mt.index)); }
      var url = refs && refs[mt[1]];
      if (url) {
        html('a', { href: url, target: '_blank', rel: 'noopener', title: hostOf(url) }, parent, '[' + mt[1] + ']');
      } else {
        text(parent, mt[0]);
      }
      last = re.lastIndex;
    }
    if (last < txt.length) { text(parent, txt.slice(last)); }
  }

  // ---------- widgets ----------
  function build(D) {
    var T = D.meta.daysPerYear, YEARS = D.meta.years, END = YEARS * T;
    var THRESH = D.meta.thresholdPer100;
    var X = D.day, NX = X.length;
    var HAS_BAND = !!(D.hasEnsemble && D.band);
    var NB = HAS_BAND ? D.ensemble.size : 0;
    var m = D.model || null;
    var PM = window.DWV_PARAMS || { params: [], refs: {} };
    var BYKEY = {};
    PM.params.forEach(function (p) { BYKEY[p.key] = p; });

    function dateText(day) {
      var y = Math.min(Math.floor(day / T), YEARS - 1);
      var doy = Math.min(Math.floor(day - y * T + 1e-9), 364);
      var mo = 11;
      while (mo > 0 && MONTH_START[mo] > doy) { mo--; }
      return 'Year ' + (y + 1) + ', ' + MONTHS[mo] + ' ' + (doy - MONTH_START[mo] + 1);
    }
    function dayOfYearText(d) {
      var doy = Math.min(Math.floor(d + 1e-9), 364), mo = 11;
      while (mo > 0 && MONTH_START[mo] > doy) { mo--; }
      return MONTHS[mo] + ' ' + (doy - MONTH_START[mo] + 1);
    }
    var ANCHOR_DATES = (m && m.seasonStart ? m.seasonStart : [0, 91.25, 182.5, 273.75]).map(dayOfYearText);

    // ---- results at a glance (also used by the explorer) ----
    function makeTiles(parent) {
      var box = html('div', { 'class': 'dwv-stats' }, parent);
      var parts = ['is-rnai', 'is-healthy', 'is-killed', 'is-thresh'].map(function (cls) {
        var card = html('div', { 'class': 'dwv-stat ' + cls }, box);
        return { big: html('div', { 'class': 'dwv-stat-big' }, card), label: html('div', { 'class': 'dwv-stat-label' }, card),
                 sub: html('div', { 'class': 'dwv-stat-sub' }, card) };
      });
      function set(i, big, label, sub) {
        parts[i].big.textContent = big;
        parts[i].label.textContent = label;
        parts[i].sub.textContent = sub;
      }
      return function update(s) {
        var mr = s.miteReduction, bg = s.beeGain;
        var died = finite(s.collapseCtrl) || finite(s.collapseRNAi);
        var avg = died ? 'Average while both colonies are alive: ' : '5-year average: ';
        set(0, finite(mr) ? pct(Math.abs(mr)) : '\u2013', finite(mr) && mr < 0 ? 'more feeding mites' : 'fewer feeding mites',
            avg + count(s.mitesCtrl) + ' untreated, ' + count(s.mitesRNAi) + ' fed dsRNA');
        set(1, finite(bg) ? pct(Math.abs(bg)) : '\u2013', finite(bg) && bg < 0 ? 'fewer adult bees' : 'more adult bees',
            avg + int(s.beesCtrl) + ' untreated, ' + int(s.beesRNAi) + ' fed dsRNA');
        set(2, int(s.dwvDeathsCtrl) + ' \u2192 ' + int(s.dwvDeathsRNAi), 'bees killed by DWV',
            'over five years, untreated \u2192 fed dsRNA');
        set(3, pct(s.pctDaysAboveThresholdCtrl) + ' \u2192 ' + pct(s.pctDaysAboveThresholdRNAi),
            'of days above the treatment threshold', THRESH + ' mites per 100 adult bees' +
            (died ? ', counting the days each colony is alive' : '') + ', untreated \u2192 fed dsRNA');
      };
    }
    function matlabSummary() {
      var s = clone(D.summary);
      s.collapseCtrl = D.main.ctrl.collapseDay;
      s.collapseRNAi = D.main.rnai.collapseDay;
      return s;
    }
    function renderStats(root) {
      makeTiles(root)(matlabSummary());
    }

    // ---- model diagram ----
    function seasonalIndex(name) { return m ? m.seasonal.names.indexOf(name) : -1; }
    function baseline(i, day) {             // the seasonal curve through the four quarterly values
      var b = m.seasonal.breaks, j = 0;
      while (j + 1 < b.length - 1 && b[j + 1] <= day) { j++; }
      var s = day - b[j];
      return ((m.seasonal.c3[i][j] * s + m.seasonal.c2[i][j]) * s + m.seasonal.c1[i][j]) * s + m.seasonal.c0[i][j];
    }
    function resolveValue(p) {
      if (!m) { return { kind: 'none' }; }
      var parts = String(p.path).split(':');
      if (parts[0] === 'seasonal') {
        var i = seasonalIndex(parts[1]);
        if (i < 0) { return { kind: 'none' }; }
        return { kind: 'seasonal', idx: i, anchors: m.seasonal.anchors[i], sens: m.seasonal.sensitivity[i],
                 group: m.env.names[m.seasonal.group[i] - 1] };
      }
      var src = parts.length > 1 ? (parts[0] === 'rnai' ? m.rnai : m.env) : m;
      var v = src ? src[parts[parts.length - 1]] : undefined;
      if (Array.isArray(v)) { return { kind: 'list', values: v, names: parts[1] === 'loading' ? m.env.names : null }; }
      return finite(v) ? { kind: 'scalar', value: v } : { kind: 'none' };
    }
    function unitsAfter(units) {
      if (!units || units === 'no unit') { return ''; }
      if (/^(share|fraction)/.test(units)) { return ' (' + units + ')'; }
      return ' ' + units;
    }
    function valueText(p) {
      var v = resolveValue(p);
      if (v.kind === 'seasonal') { return v.anchors.map(paramNum).join(' / '); }
      if (v.kind === 'list') { return v.values.map(paramNum).join(' / '); }
      if (v.kind === 'scalar') { return paramNum(v.value); }
      return '\u2013';
    }
    function weatherSentence(v) {
      if (!v.sens) { return 'Does not change with the weather.'; }
      var change = +(Math.abs(v.sens) * 10).toFixed(1);
      return 'It also follows the weather: when ' + (WEATHER_GROUP[v.group] || v.group) +
        ' conditions are 10% better than typical, it is ' + change + '% ' + (v.sens > 0 ? 'higher' : 'lower') + '.';
    }
    function miniCurve(parent, v) {
      var W = 288, H = 100, g = { l: 44, r: 8, t: 8, b: 20 };
      var vals = [], top = 0;
      for (var d = 0; d <= T; d++) { var y = baseline(v.idx, d); vals.push(y); top = Math.max(top, y); }
      var sc = niceScale(top || 1);
      var s = svg('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, 'class': 'dwv-mini dwv-grp-' + v.group,
                           'aria-hidden': 'true' }, parent);
      var sx = function (x) { return g.l + x / T * (W - g.l - g.r); };
      var sy = function (y) { return g.t + (1 - y / sc.top) * (H - g.t - g.b); };
      [0, sc.top].forEach(function (y) {
        svg('line', { x1: g.l, x2: W - g.r, y1: sy(y), y2: sy(y), 'class': y ? 'dwv-grid' : 'dwv-axis' }, s);
        svgText(s, g.l - 6, sy(y) + 4, paramNum(y), 'dwv-tick', 'end');
      });
      m.seasonStart.forEach(function (d) {
        svgText(s, sx(d), H - 5, dayOfYearText(d).split(' ')[0], 'dwv-tick', d ? 'middle' : 'start');
      });
      var xs = vals.map(function (_, i) { return i; });
      svg('path', { d: linePath(xs, vals, sx, sy), 'class': 'dwv-mini-line' }, s);
      m.seasonStart.forEach(function (d, i) {
        svg('circle', { cx: sx(d), cy: sy(v.anchors[i]), r: 3.5, 'class': 'dwv-mini-dot' }, s);
      });
    }
    function startText(node) {
      if (!m) { return ''; }
      var y = m.y0;
      if (node === 'S') { return 'At the start: ' + int(y[1]) + ' healthy adult bees.'; }
      if (node === 'I') { return 'At the start: ' + int(y[2]) + ' infected adult bees.'; }
      if (node === 'M') { return 'At the start: ' + int(y[5]) + ' feeding mites, ' + int(y[6]) + ' of them carrying DWV.'; }
      if (node === 'Ma') { return 'At the start: none. Mites are only disabled once bees carry dsRNA.'; }
      if (node === 'Sh') {
        return 'At the start: none. In the main run about ' + Math.round(D.coverage ? D.coverage.steadyPct : 0) +
          '% of adult bees carry dsRNA on a typical day once feeding is under way.';
      }
      if (node === 'F') { return 'In the model the treated colony has the sucrose every day of the year; the untreated colony never does.'; }
      return '';
    }

    function renderDiagram(root) {
      html('p', { 'class': 'dwv-hint' }, root, 'Select a population or a gold parameter to see its definition and source.');
      var wrap = html('div', { 'class': 'dwv-diagram' }, root);
      var inner = html('div', { 'class': 'dwv-diagram-inner' }, wrap);
      inner.innerHTML = window.DWV_DIAGRAM_SVG || '<p class="dwv-note">The diagram is missing from dwv_widgets.js.</p>';
      var pop = html('div', { 'class': 'dwv-pop', role: 'dialog', 'aria-label': 'Details' }, wrap);
      pop.hidden = true;
      var scrollHint = html('p', { 'class': 'dwv-scroll-hint' }, root, 'Scroll sideways to see the whole diagram.');
      var active = null, quiet = false;

      function open(el, fill, how) {
        if (active && active !== el) { active.classList.remove('is-active'); }
        active = el;
        el.classList.add('is-active');
        clear(pop);
        var close = html('button', { type: 'button', 'class': 'dwv-pop-close', 'aria-label': 'Close' }, pop, '\u00d7');
        close.addEventListener('click', function () { hide(true); });
        fill(html('div', { 'class': 'dwv-pop-body' }, pop));
        pop.setAttribute('aria-label', el.getAttribute('aria-label') || el.getAttribute('data-name') || 'Details');
        pop.hidden = false;
        place(el);
        if (how === 'key') {
          var first = pop.querySelector('.dwv-pop-body a, .dwv-pop-body button') || close;
          first.focus({ preventScroll: true });
        }
      }
      function hide(returnFocus) {
        var el = active;
        pop.hidden = true;
        active = null;
        if (el) {
          el.classList.remove('is-active');
          if (returnFocus) { quiet = true; el.focus({ preventScroll: true }); quiet = false; }
        }
      }
      // Beside the label on wide screens, below or above it on narrow ones; always inside the diagram.
      function place(el) {
        var wr = wrap.getBoundingClientRect(), r = el.getBoundingClientRect();
        var pw = pop.offsetWidth, ph = pop.offsetHeight;
        var sl = wrap.scrollLeft, cw = wrap.clientWidth, ch = inner.offsetHeight;
        var left = r.left - wr.left + sl, right = r.right - wr.left + sl;
        var top = r.top - wr.top, bottom = r.bottom - wr.top;
        var visL = sl + 8, visR = sl + cw - 8, x, y;
        if (cw >= 640) {
          if (right + 12 + pw <= visR) { x = right + 12; } else if (left - 12 - pw >= visL) { x = left - 12 - pw; } else {
            x = Math.max(visL, Math.min(visR - pw, (left + right - pw) / 2));
          }
          y = (top + bottom - ph) / 2;
        } else {
          x = Math.max(visL, Math.min(visR - pw, (left + right - pw) / 2));
          y = bottom + 10;
          if (y + ph > ch - 4) { y = top - 10 - ph; }
        }
        y = Math.max(4, Math.min(ch - ph - 4, y));
        pop.style.left = Math.round(x) + 'px';
        pop.style.top = Math.round(y) + 'px';
      }
      function showParam(el, how) {
        var p = BYKEY[el.getAttribute('data-param')];
        if (!p) { return; }
        open(el, function (box) {
          var head = html('div', { 'class': 'dwv-pop-head' }, box);
          symbol(html('span', { 'class': 'dwv-pop-sym' }, head), p.symbol);
          html('span', { 'class': 'dwv-pop-name' }, head, p.name);
          var v = resolveValue(p), val = html('div', { 'class': 'dwv-pop-value' }, box);
          if (v.kind === 'seasonal') {
            var allZero = v.anchors.every(function (a) { return a === 0; });
            if (allZero) {
              html('strong', null, val, '0');
              text(val, unitsAfter(p.units) + ', all year');
            } else {
              html('div', { 'class': 'dwv-pop-label' }, val, 'Changes through the year' + (p.units ? ' (' + p.units + ')' : ''));
              var row = html('div', { 'class': 'dwv-anchors' }, val);
              ANCHOR_DATES.forEach(function (lab, i) {
                var cell = html('div', { 'class': 'dwv-anchor' }, row);
                html('span', null, cell, lab);
                html('strong', null, cell, paramNum(v.anchors[i]));
              });
              miniCurve(val, v);
              html('p', { 'class': 'dwv-pop-note' }, val, weatherSentence(v));
            }
          } else if (v.kind === 'list') {
            var list = html('div', { 'class': 'dwv-anchors' }, val);
            v.values.forEach(function (x, i) {
              var cell = html('div', { 'class': 'dwv-anchor' }, list);
              html('span', null, cell, v.names ? (WEATHER_GROUP[v.names[i]] || v.names[i]) : '#' + (i + 1));
              html('strong', null, cell, paramNum(x));
            });
          } else if (v.kind === 'scalar') {
            html('strong', null, val, paramNum(v.value));
            text(val, unitsAfter(p.units));
          } else {
            text(val, 'See the parameter list in the MATLAB script.');
          }
          var facts = html('dl', { 'class': 'dwv-pop-facts' }, box);
          html('dt', null, facts, 'Used in');
          html('dd', null, facts, p.usedIn);
          html('dt', null, facts, 'Source');
          sourceText(html('dd', null, facts), p.source, PM.refs);
        }, how);
      }
      function showNode(el, how) {
        open(el, function (box) {
          var head = html('div', { 'class': 'dwv-pop-head' }, box);
          html('span', { 'class': 'dwv-pop-name is-node' }, head, el.getAttribute('data-name'));
          richText(html('p', { 'class': 'dwv-pop-text' }, box), el.getAttribute('data-tip'));
          var st = startText(el.getAttribute('data-node'));
          if (st) { html('p', { 'class': 'dwv-pop-note' }, box, st); }
        }, how);
      }
      Array.prototype.forEach.call(inner.querySelectorAll('.w1-param, .w1-node'), function (el) {
        var isParam = el.classList.contains('w1-param');
        function show(how) { if (isParam) { showParam(el, how); } else { showNode(el, how); } }
        el.addEventListener('click', function (e) { e.stopPropagation(); show('click'); });
        el.addEventListener('focus', function () { if (!quiet && active !== el) { show('focus'); } });
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show('key'); }
          if (e.key === 'Escape') { hide(true); }
        });
      });
      pop.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); hide(true); } });
      pop.addEventListener('click', function (e) { e.stopPropagation(); });
      wrap.addEventListener('click', function () { if (!pop.hidden) { hide(false); } });
      document.addEventListener('click', function (e) { if (!pop.hidden && !wrap.contains(e.target)) { hide(false); } });
      function checkScroll() { scrollHint.hidden = wrap.scrollWidth <= wrap.clientWidth + 2; }
      onWidthChange(wrap, function () { if (!pop.hidden) { hide(false); } checkScroll(); });
      checkScroll();
      paramTable(root);
    }
    function paramTable(root) {
      if (!PM.params.length) { return; }
      var det = html('details', { 'class': 'dwv-details' }, root);
      html('summary', null, det, 'Show all ' + PM.params.length + ' parameters in a table');
      var tw = html('div', { 'class': 'dwv-table-wrap' }, det);
      var tbl = html('table', { 'class': 'dwv-table dwv-param-table' }, tw);
      var hr = html('tr', null, html('thead', null, tbl));
      ['Symbol', 'Meaning', 'Value', 'Units', 'Source'].forEach(function (h) { html('th', { scope: 'col' }, hr, h); });
      var sections = [
        { title: 'Seasonal rates (values on ' + ANCHOR_DATES.join(', ') + ')', test: function (p) { return p.path.indexOf('seasonal:') === 0; } },
        { title: 'Bees, mites and brood', test: function (p) { return p.path.indexOf(':') < 0; } },
        { title: 'RNAi treatment', test: function (p) { return p.path.indexOf('rnai:') === 0; } },
        { title: 'Weather', test: function (p) { return p.path.indexOf('env:') === 0; } }
      ];
      var tb = html('tbody', null, tbl);
      sections.forEach(function (sec) {
        var list = PM.params.filter(sec.test);
        if (!list.length) { return; }
        html('th', { scope: 'colgroup', colspan: '5' }, html('tr', { 'class': 'dwv-table-section' }, tb), sec.title);
        list.forEach(function (p) {
          var row = html('tr', null, tb);
          symbol(html('td', { 'class': 'dwv-td-sym' }, row), p.symbol);
          html('td', null, row, p.name);
          html('td', { 'class': 'dwv-td-num' }, row, valueText(p));
          html('td', null, row, p.units);
          sourceText(html('td', null, row), p.source, PM.refs);
        });
      });
      var refs = Object.keys(PM.refs || {}).sort(function (a, b) { return a - b; });
      if (refs.length) {
        var rl = html('p', { 'class': 'dwv-refs' }, tw);
        html('strong', null, rl, 'References: ');
        refs.forEach(function (k, i) {
          if (i) { text(rl, ' \u00b7 '); }
          html('a', { href: PM.refs[k], target: '_blank', rel: 'noopener' }, rl, '[' + k + '] ' + hostOf(PM.refs[k]));
        });
      }
    }

    // ---- results at a glance and the four population graphs ----
    var LINES = {
      bees: [
        { k: 'N', name: 'Total adults', cls: 'total' },
        { k: 'S', name: 'Healthy', cls: 'healthy' },
        { k: 'I', name: 'Infected with DWV', cls: 'infected' },
        { k: 'D', name: 'Killed by DWV (running total)', cls: 'killed' }
      ],
      mites: [
        { k: 'M', name: 'Total able to feed', cls: 'total' },
        { k: 'Mf', name: 'Virus-free', cls: 'healthy' },
        { k: 'Mi', name: 'Carrying DWV', cls: 'infected' },
        { k: 'Dm', name: 'Killed by RNAi (running total)', cls: 'rnai' },
        { k: 'Ma', name: 'Disabled by RNAi, not yet dead', cls: 'disabled' }
      ],
      load: [
        { k: 'load', name: 'All feeding mites', cls: 'total' },
        { k: 'loadMf', name: 'Virus-free', cls: 'healthy' },
        { k: 'loadMi', name: 'Carrying DWV', cls: 'infected' }
      ]
    };
    var QUANT = {
      bees: { title: 'Adult honeybees', fmt: count },
      mites: { title: 'Varroa mites', fmt: count },
      load: { title: 'Mites per 100 adult bees', fmt: per100, threshold: THRESH }
    };
    function tickLabels(sc, mk) {
      if (mk === 'bees' && sc.top >= 2000) {
        var dk = decimalsFor(sc.step / 1000);
        return sc.ticks.map(function (v) { return v === 0 ? '0' : fixed(v / 1000, dk) + 'k'; });
      }
      var d = decimalsFor(sc.step);
      return sc.ticks.map(function (v) { return v === 0 ? '0' : fixed(v, d); });
    }

    function renderExplorer(root) {
      var id = 'dwv' + (++uid);
      var st = {
        tab: 'bees', view: 'split', band: NB > 0, per100: false,
        on: { bees: { N: true, S: true, I: true, D: true },
              mites: { M: true, Mf: true, Mi: true, Dm: true, Ma: false },
              load: { load: true, loadMf: true, loadMi: true } },
        pick: { bees: 'N', mites: 'M', load: 'load' },
        hover: null
      };
      var cur = { main: D.main, band: HAS_BAND ? D.band : null, sum: matlabSummary() };
      function modeKey() { return st.tab === 'bees' ? 'bees' : (st.per100 ? 'load' : 'mites'); }

      // results at a glance
      makeTiles(html('div', { 'class': 'dwv-glance' }, root))(cur.sum);
      var status = html('p', { 'class': 'dwv-status' }, root);
      (function () {
        var c = cur.sum.collapseCtrl, r = cur.sum.collapseRNAi;
        var bits = ['Same colony, same weather: the only difference is the dsRNA sucrose.'];
        if (!finite(c) && !finite(r)) {
          bits.push('Both colonies survive all five years.');
        } else {
          bits.push(finite(c) ? 'The untreated colony collapses (' + dateText(c) + ').' : 'The untreated colony survives.');
          bits.push(finite(r) ? 'The treated colony collapses (' + dateText(r) + ').' : 'The treated colony survives all five years.');
          status.className = 'dwv-status is-alert';
        }
        status.textContent = bits.join(' ');
      })();

      // what to show
      var bar = html('div', { 'class': 'dwv-toolbar' }, root);
      segmented(bar, 'Population', [{ value: 'bees', label: 'Honeybees' }, { value: 'mites', label: 'Varroa mites' }], st.tab,
        function (v) { st.tab = v; per100Box.label.hidden = v !== 'mites'; redrawAll(); });
      segmented(bar, 'Layout', [{ value: 'split', label: 'Side by side' }, { value: 'compare', label: 'On one graph' }], st.view,
        function (v) { st.view = v; redrawAll(); });
      var checks = html('div', { 'class': 'dwv-checks' }, bar);
      if (NB > 0) {
        checkbox(checks, id + '-band', 'Range over ' + NB + ' weathers', st.band, function (on) {
          st.band = on;
          drawCharts();
          writeFoot();
        });
      }
      var per100Box = checkbox(checks, id + '-per100', 'Per 100 adult bees', st.per100, function (on) {
        st.per100 = on;
        redrawAll();
      });
      per100Box.label.hidden = true;

      // legend + values on the chosen day
      var readout = html('div', { 'class': 'dwv-readout-wrap' }, root);
      var roCells = {}, roDate = null;
      function drawReadout() {
        clear(readout);
        var mk = modeKey(), Q = QUANT[mk], cmp = st.view === 'compare';
        var tbl = html('table', { 'class': 'dwv-readout' + (cmp ? ' is-compare' : '') }, readout);
        var hr = html('tr', null, html('thead', null, tbl));
        var th0 = html('th', { scope: 'col' }, hr);
        html('span', { 'class': 'dwv-ro-q' }, th0, Q.title);
        roDate = html('span', { 'class': 'dwv-ro-date' }, th0);
        GROUPS.forEach(function (g) {
          var th = html('th', { scope: 'col', 'class': 'dwv-ro-num' }, hr);
          if (cmp) { th.appendChild(swatch('grp-' + g)); }
          text(th, GROUP_NAME[g]);
        });
        var tb = html('tbody', null, tbl);
        roCells = {};
        LINES[mk].forEach(function (ln) {
          var on = cmp ? st.pick[mk] === ln.k : !!st.on[mk][ln.k];
          var tr = html('tr', { 'class': on ? 'is-on' : 'is-off' }, tb);
          var b = html('button', { type: 'button', 'class': 'dwv-ro-toggle', 'aria-pressed': String(on), 'data-k': ln.k },
                       html('th', { scope: 'row' }, tr));
          b.appendChild(swatch(ln.cls));
          html('span', null, b, ln.name);
          b.addEventListener('click', function () {
            if (cmp) {
              st.pick[mk] = ln.k;
            } else {
              var shown = LINES[mk].filter(function (x) { return st.on[mk][x.k]; }).length;
              if (st.on[mk][ln.k] && shown === 1) { return; }        // keep at least one line
              st.on[mk][ln.k] = !st.on[mk][ln.k];
            }
            drawReadout();
            drawCharts();
            var again = readout.querySelector('button[data-k="' + ln.k + '"]');
            if (again) { again.focus(); }
          });
          roCells[ln.k] = { ctrl: html('td', { 'class': 'dwv-ro-num' }, tr), rnai: html('td', { 'class': 'dwv-ro-num' }, tr) };
        });
        html('p', { 'class': 'dwv-ro-hint' }, readout, cmp ?
          'Pick a line to compare the two colonies. Point at or tap the graph to read another day.' :
          'Click a line\u2019s name to show or hide it. Point at or tap a graph to read another day.');
        fillReadout();
      }
      function fillReadout() {
        if (!roDate) { return; }
        var mk = modeKey(), Q = QUANT[mk];
        var j = st.hover === null ? NX - 1 : st.hover;
        roDate.textContent = dateText(X[j]) + (st.hover === null ? ' (last day)' : '');
        LINES[mk].forEach(function (ln) {
          var c = roCells[ln.k];
          if (!c) { return; }
          GROUPS.forEach(function (g) { c[g].textContent = Q.fmt(cur.main[g][ln.k][j]); });
        });
      }

      // graphs
      var charts = html('div', { 'class': 'dwv-charts' }, root);
      var geoms = [];
      function bandOf(g, k) {
        return st.band && cur.band && cur.band[g] && cur.band[g][k] ? cur.band[g][k] : null;
      }
      function scaleFor(keys, Q) {
        var top = 0;
        GROUPS.forEach(function (g) {
          keys.forEach(function (k) {
            top = Math.max(top, maxOf(cur.main[g][k]));
            var b = bandOf(g, k);
            if (b) { top = Math.max(top, maxOf(b.hi)); }
          });
        });
        if (Q.threshold) { top = Math.max(top, 1.5 * Q.threshold); }
        return niceScale(top > 0 ? top : 1);
      }
      function chartCard(title, cls, sub) {
        var card = html('figure', { 'class': 'dwv-card ' + cls }, charts);
        var cap = html('figcaption', { 'class': 'dwv-card-title' }, card, title);
        if (sub) { html('span', { 'class': 'dwv-card-sub' }, cap, ' \u00b7 ' + sub); }
        var body = html('div', { 'class': 'dwv-chart', tabindex: '0' }, card);
        body.addEventListener('keydown', keyNav);
        return body;
      }
      function drawCharts() {
        var mk = modeKey(), Q = QUANT[mk], lines = LINES[mk];
        var Wc = Math.max(280, charts.clientWidth || 640);
        var split = st.view === 'split', two = split && Wc >= 700;
        clear(charts);
        charts.className = 'dwv-charts' + (two ? ' is-two' : '');
        var w = two ? Math.floor((Wc - 24) / 2) : Wc;
        var H = split ? (two ? 280 : 240) : (Wc < 560 ? 260 : 330);
        var shown = lines.filter(function (ln) { return split ? st.on[mk][ln.k] : st.pick[mk] === ln.k; });
        var sc = scaleFor(shown.map(function (ln) { return ln.k; }), Q);
        var labels = tickLabels(sc, mk);
        var names = shown.map(function (ln) { return ln.name; }).join(', ');
        geoms = [];
        if (split) {
          GROUPS.forEach(function (g) {
            var body = chartCard(GROUP_TITLE[g], 'is-' + g, Q.title.toLowerCase());
            var col = cur.sum[g === 'ctrl' ? 'collapseCtrl' : 'collapseRNAi'];
            geoms.push(plot(body, {
              W: w, H: H, sc: sc, labels: labels, threshold: Q.threshold,
              series: shown.filter(function (ln) { return anyPositive(cur.main[g][ln.k]); }).map(function (ln) {
                return { y: cur.main[g][ln.k], band: bandOf(g, ln.k), cls: ln.cls };
              }),
              collapses: finite(col) ? [{ day: col, label: 'colony collapses' }] : [],
              aria: GROUP_TITLE[g] + ', ' + Q.title.toLowerCase() + ' over five years: ' + names +
                '. Use the left and right arrow keys to read the values.'
            }));
          });
        } else {
          var ln = shown[0];
          var body = chartCard(ln.name, 'is-compare', Q.title.toLowerCase() + ', untreated and fed dsRNA');
          var cols = [];
          GROUPS.forEach(function (g) {
            var c = cur.sum[g === 'ctrl' ? 'collapseCtrl' : 'collapseRNAi'];
            if (finite(c)) { cols.push({ day: c, label: (g === 'ctrl' ? 'untreated' : 'treated') + ' colony collapses' }); }
          });
          geoms.push(plot(body, {
            W: w, H: H, sc: sc, labels: labels, threshold: Q.threshold, collapses: cols,
            series: GROUPS.map(function (g) { return { y: cur.main[g][ln.k], band: bandOf(g, ln.k), cls: 'grp-' + g }; }),
            aria: ln.name + ' (' + Q.title.toLowerCase() + ') over five years, untreated and treated colony on one graph.' +
              ' Use the left and right arrow keys to read the values.'
          }));
        }
        showHover();
      }
      function plot(box, sp) {
        var W = sp.W, H = sp.H, g = { l: W < 440 ? 44 : 52, r: 10, t: 10, b: 26 };
        var iw = W - g.l - g.r, ih = H - g.t - g.b, top = sp.sc.top;
        var s = svg('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': sp.aria }, box);
        var sx = function (d) { return g.l + d / END * iw; };
        var sy = function (v) { return g.t + (1 - Math.min(v, top) / top) * ih; };
        for (var y = 0; y < YEARS; y++) {
          svg('rect', { x: sx(y * T), y: g.t, width: sx(y * T + D.meta.winterEndDay) - sx(y * T), height: ih,
                        'class': 'dwv-shade' }, s);
        }
        sp.sc.ticks.forEach(function (v, i) {
          if (v > 0) { svg('line', { x1: g.l, x2: W - g.r, y1: sy(v), y2: sy(v), 'class': 'dwv-grid' }, s); }
          svgText(s, g.l - 7, sy(v) + 4, sp.labels[i], 'dwv-tick', 'end');
        });
        for (var yr = 0; yr < YEARS; yr++) {
          svgText(s, sx((yr + 0.5) * T), H - 8, (W < 440 ? 'Yr ' : 'Year ') + (yr + 1), 'dwv-tick', 'middle');
        }
        if (sp.threshold) {
          svg('line', { x1: g.l, x2: W - g.r, y1: sy(sp.threshold), y2: sy(sp.threshold), 'class': 'dwv-thresh' }, s);
          svgText(s, W - g.r - 4, sy(sp.threshold) - 5, 'treatment threshold', 'dwv-thresh-label', 'end');
        }
        sp.series.forEach(function (se) {
          if (se.band) { svg('path', { d: bandPath(X, se.band.lo, se.band.hi, sx, sy), 'class': 'dwv-band dwv-b-' + se.cls }, s); }
        });
        sp.series.forEach(function (se) {
          svg('path', { d: linePath(X, se.y, sx, sy), 'class': 'dwv-ln dwv-s-' + se.cls }, s);
        });
        sp.collapses.forEach(function (c) {
          var x = sx(c.day), right = x < g.l + 0.7 * iw;
          svg('line', { x1: x, x2: x, y1: g.t, y2: g.t + ih, 'class': 'dwv-collapse' }, s);
          svgText(s, x + (right ? 5 : -5), g.t + 13, c.label, 'dwv-collapse-label', right ? 'start' : 'end');
        });
        svg('line', { x1: g.l, x2: W - g.r, y1: g.t + ih, y2: g.t + ih, 'class': 'dwv-axis' }, s);
        var guide = svg('line', { y1: g.t, y2: g.t + ih, 'class': 'dwv-guide', visibility: 'hidden' }, s);
        var dots = sp.series.map(function (se) {
          return { y: se.y, c: svg('circle', { r: 3.8, 'class': 'dwv-dot dwv-f-' + se.cls, visibility: 'hidden' }, s) };
        });
        var overlay = svg('rect', { x: g.l, y: g.t, width: iw, height: ih, 'class': 'dwv-overlay' }, s);
        function fromPointer(ev) {
          var rect = s.getBoundingClientRect(), k = rect.width / W || 1;
          var day = ((ev.clientX - rect.left) / k - g.l) / iw * END;
          setHover(nearest(X, Math.max(0, Math.min(END, day))));
        }
        overlay.addEventListener('pointermove', fromPointer);
        overlay.addEventListener('pointerdown', fromPointer);
        overlay.addEventListener('pointerleave', function (ev) { if (ev.pointerType === 'mouse') { setHover(null); } });
        return { sx: sx, sy: sy, guide: guide, dots: dots };
      }
      function setHover(j) { st.hover = j; showHover(); }
      function showHover() {
        var j = st.hover;
        geoms.forEach(function (gm) {
          if (j === null) {
            gm.guide.setAttribute('visibility', 'hidden');
            gm.dots.forEach(function (d) { d.c.setAttribute('visibility', 'hidden'); });
            return;
          }
          var x = gm.sx(X[j]);
          gm.guide.setAttribute('x1', x);
          gm.guide.setAttribute('x2', x);
          gm.guide.setAttribute('visibility', 'visible');
          gm.dots.forEach(function (d) {
            var v = d.y[j];
            if (finite(v)) {
              d.c.setAttribute('cx', x);
              d.c.setAttribute('cy', gm.sy(v));
              d.c.setAttribute('visibility', 'visible');
            } else {
              d.c.setAttribute('visibility', 'hidden');
            }
          });
        });
        fillReadout();
      }
      function keyNav(e) {
        var j = st.hover, step = e.shiftKey ? 30 : 2;
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          if (j === null) { j = e.key === 'ArrowRight' ? 0 : NX - 1; } else { j += e.key === 'ArrowRight' ? step : -step; }
          setHover(Math.max(0, Math.min(NX - 1, j)));
        } else if (e.key === 'Home' || e.key === 'End') {
          e.preventDefault();
          setHover(e.key === 'Home' ? 0 : NX - 1);
        } else if (e.key === 'Escape') {
          setHover(null);
        }
      }

      // notes and the year-by-year numbers
      var foot = html('p', { 'class': 'dwv-foot' }, root);
      function writeFoot() {
        var parts = ['Lines: one simulated colony in the main weather.'];
        if (NB > 0 && st.band) { parts.push('Shaded bands: 10\u201390% range over ' + NB + ' other random weathers.'); }
        parts.push('Gray columns: January to March.');
        if (modeKey() === 'load') { parts.push('Dotted red line: treatment threshold, ' + THRESH + ' mites per 100 adult bees.'); }
        foot.textContent = parts.join(' ');
      }
      var details = html('details', { 'class': 'dwv-details' }, root);
      html('summary', null, details, 'Show the numbers year by year');
      var tableWrap = html('div', { 'class': 'dwv-table-wrap' }, details);
      (function writeTable() {
        var tbl = html('table', { 'class': 'dwv-table dwv-year-table' }, tableWrap);
        var thead = html('thead', null, tbl), r1 = html('tr', null, thead), r2 = html('tr', null, thead);
        html('th', { scope: 'col', rowspan: '2' }, r1, 'Year');
        var cols = [['Most adult bees', 'N', 'max'], ['Fewest adult bees', 'N', 'min'],
                    ['Most feeding mites', 'M', 'max'], ['Bees killed by DWV', 'D', 'gain']];
        cols.forEach(function (c) {
          html('th', { scope: 'colgroup', colspan: '2', 'class': 'dwv-th-group' }, r1, c[0]);
          html('th', { scope: 'col' }, r2, 'Untreated');
          html('th', { scope: 'col', 'class': 'dwv-col-rnai' }, r2, 'Fed dsRNA');
        });
        var tb = html('tbody', null, tbl);
        for (var y = 0; y < YEARS; y++) {
          var tr = html('tr', null, tb);
          html('th', { scope: 'row' }, tr, 'Year ' + (y + 1));
          var a = nearest(X, y * T), b = nearest(X, (y + 1) * T);
          cols.forEach(function (c) {
            GROUPS.forEach(function (g) {
              var arr = cur.main[g][c[1]], v;
              if (c[2] === 'gain') { v = arr[b] - arr[a]; } else {
                var vals = [];
                for (var i = a; i <= b; i++) { vals.push(arr[i]); }
                v = c[2] === 'max' ? maxOf(vals) : minOf(vals);
              }
              html('td', { 'class': g === 'rnai' ? 'dwv-col-rnai' : '' }, tr, count(v));
            });
          });
        }
        html('p', { 'class': 'dwv-caption' }, tableWrap, 'From the MATLAB run in the main weather.');
      })();

      function redrawAll() {
        drawReadout();
        drawCharts();
        writeFoot();
      }
      // Lead with the graph, then its values and summary.
      root.insertBefore(charts, readout);
      root.insertBefore(foot, readout);
      root.insertBefore(root.querySelector('.dwv-glance'), details);
      redrawAll();
      onWidthChange(charts, drawCharts);
    }

    // ---- dose-response ----
    function renderDose(root) {
      var id = 'dwv' + (++uid);
      var wrap = html('div', { 'class': 'dwv-dose' }, root);
      var chart = html('div', { 'class': 'dwv-chart' }, wrap);
      var side = html('div', { 'class': 'dwv-dose-side' }, wrap);
      var big = html('p', { 'class': 'dwv-dose-big', 'aria-live': 'polite' }, side);
      var line = html('p', { 'class': 'dwv-dose-text' }, side);
      html('label', { 'class': 'dwv-range-label', 'for': id + '-cov' }, side, 'Adult bees carrying dsRNA');
      var range = html('input', { type: 'range', id: id + '-cov', 'class': 'dwv-range', min: '0', max: '100', step: '1' }, side);
      var op = 100 * D.dose.operatingCoverage;
      range.value = String(Math.round(op));
      range.setAttribute('value', range.value);
      function cover(day) { return D.coverage.pct[nearest(D.coverage.day, day)]; }
      html('p', { 'class': 'dwv-note' }, side,
        'In the simulated colony, ' + Math.round(cover(1)) + '% of adult bees carry dsRNA one day after feeding starts and ' +
        Math.round(cover(5)) + '% after five days. Over the five years the typical level is ' + Math.round(op) + '%.');
      function strength(c) {
        var x = c / 100;
        if (!D.dose.hill) { return 100 * x; }
        var h = D.dose.h, e = D.dose.EC50;
        return 100 * Math.pow(x, h) / (Math.pow(e, h) + Math.pow(x, h));
      }
      function draw() {
        var W = Math.max(260, chart.clientWidth || 400), H = Math.round(Math.min(300, Math.max(220, W * 0.62)));
        var g = { l: 44, r: 24, t: 14, b: 40 };
        clear(chart);
        var s = svg('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'img',
                             'aria-label': 'Dose-response curve: mite-disabling strength against the share of adult bees carrying dsRNA' }, chart);
        var sx = function (v) { return g.l + v / 100 * (W - g.l - g.r); };
        var sy = function (v) { return g.t + (1 - v / 100) * (H - g.t - g.b); };
        [0, 25, 50, 75, 100].forEach(function (v) {
          if (v > 0) { svg('line', { x1: g.l, x2: W - g.r, y1: sy(v), y2: sy(v), 'class': 'dwv-grid' }, s); }
          svgText(s, g.l - 7, sy(v) + 4, v + '%', 'dwv-tick', 'end');
          svgText(s, sx(v), H - g.b + 16, v + '%', 'dwv-tick', 'middle');
        });
        svg('line', { x1: g.l, x2: W - g.r, y1: sy(0), y2: sy(0), 'class': 'dwv-axis' }, s);
        svgText(s, (g.l + W - g.r) / 2, H - 4, 'Adult bees carrying dsRNA', 'dwv-axis-title', 'middle');
        if (D.dose.hill) {
          var e = 100 * D.dose.EC50;
          svg('line', { x1: sx(e), x2: sx(e), y1: sy(0), y2: sy(50), 'class': 'dwv-guide-dotted' }, s);
          svg('line', { x1: sx(0), x2: sx(e), y1: sy(50), y2: sy(50), 'class': 'dwv-guide-dotted' }, s);
          var t = svgText(s, sx(e) + 5, sy(0) - 8, 'EC', 'dwv-label-muted', 'start');
          svg('tspan', { dy: '3', 'font-size': '9' }, t).textContent = '50';
          svg('tspan', { dy: '-3' }, t).textContent = ' = ' + Math.round(e) + '%';
        }
        var xs = [], ys = [];
        for (var c = 0; c <= 100; c++) { xs.push(c); ys.push(strength(c)); }
        svg('path', { d: linePath(xs, ys, sx, sy), 'class': 'dwv-curve' }, s);
        svg('circle', { cx: sx(op), cy: sy(strength(op)), r: 5, 'class': 'dwv-point-op' }, s);
        svgText(s, sx(op) + 8, sy(strength(op)) + 16, 'typical colony', 'dwv-label-muted', 'start');
        var cur = +range.value;
        svg('line', { x1: sx(cur), x2: sx(cur), y1: sy(0), y2: sy(strength(cur)), 'class': 'dwv-guide' }, s);
        svg('circle', { cx: sx(cur), cy: sy(strength(cur)), r: 7, 'class': 'dwv-point' }, s);
        svgText(s, g.l + 4, g.t + 12, 'Mite-disabling strength (% of the highest rate)', 'dwv-axis-title', 'start');
      }
      function readout() {
        var cur = +range.value;
        big.textContent = Math.round(strength(cur)) + '%';
        clear(line);
        text(line, 'of the highest mite-disabling rate when ');
        html('strong', null, line, cur + '% of adult bees');
        text(line, ' carry dsRNA.');
      }
      range.addEventListener('input', function () { draw(); readout(); });
      draw();
      readout();
      onWidthChange(chart, draw);
    }

    // ---- net effect: how many fewer feeding mites than the untreated colony ----
    function addKey(parent, cls, label) {
      var k = html('span', { 'class': 'dwv-key' }, parent);
      k.appendChild(swatch(cls));
      text(k, label);
      return k;
    }
    function near100(v) {                    // 99.6 stays 99.6 instead of rounding up to 100
      var a = Math.abs(v);
      return fixed(v, a >= 99.5 && a < 100 ? 1 : (a >= 9.95 ? 0 : 1));
    }
    function yearDate(day) {                 // 'Sep 14 of year 1'
      var y = Math.floor(day / T);
      return dayOfYearText(day - y * T) + ' of year ' + (y + 1);
    }
    function renderNet(root) {
      var N = D.net;
      if (!N || !N.main) { html('p', { 'class': 'dwv-note' }, root, 'The net effect is not in the data file.'); return; }
      var band = N.lo && N.hi ? { lo: N.lo, hi: N.hi } : null;
      var nb = band && D.ensemble ? D.ensemble.size : 0;
      var legend = html('div', { 'class': 'dwv-legend' }, root);
      addKey(legend, 'net', 'Main simulation');
      if (band) {
        var bk = html('span', { 'class': 'dwv-key' }, legend);
        html('i', { 'class': 'dwv-band-swatch' }, bk);
        text(bk, 'Range over ' + nb + ' other weathers');
      }
      addKey(legend, 'avg', 'All five years together: ' + near100(N.average) + '% fewer');
      var chart = html('div', { 'class': 'dwv-chart', tabindex: '0' }, root);
      var info = html('p', { 'class': 'dwv-map-info' }, root);
      var hover = null, geo = null;
      var lowest = Math.min(minOf(N.main), band ? minOf(band.lo) : 0);
      var yLo = lowest < -1 ? 25 * Math.floor(lowest / 25) : 0;   // only a real increase gets a negative axis
      function draw() {
        clear(chart);
        var W = Math.max(280, chart.clientWidth || 700), narrow = W < 520;
        var H = Math.round(Math.min(320, Math.max(220, W * 0.36)));
        var g = { l: 46, r: 12, t: 12, b: 28 };
        var iw = W - g.l - g.r, ih = H - g.t - g.b;
        var sx = function (d) { return g.l + d / END * iw; };
        var sy = function (v) { return g.t + (100 - Math.max(yLo, Math.min(100, v))) / (100 - yLo) * ih; };
        var s = svg('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'img',
          'aria-label': 'How many fewer feeding mites the treated colony carries than the untreated colony, day by day ' +
            'over five years. Use the left and right arrow keys to read the values.' }, chart);
        for (var y = 0; y < YEARS; y++) {
          svg('rect', { x: sx(y * T), y: g.t, width: sx(y * T + D.meta.winterEndDay) - sx(y * T), height: ih,
                        'class': 'dwv-shade' }, s);
          svgText(s, sx((y + 0.5) * T), H - 8, (narrow ? 'Yr ' : 'Year ') + (y + 1), 'dwv-tick', 'middle');
        }
        for (var v = yLo; v <= 100; v += 25) {
          if (v !== 0) { svg('line', { x1: g.l, x2: W - g.r, y1: sy(v), y2: sy(v), 'class': 'dwv-grid' }, s); }
          svgText(s, g.l - 7, sy(v) + 4, v + '%', 'dwv-tick', 'end');
        }
        if (band) { svg('path', { d: bandPath(X, band.lo, band.hi, sx, sy), 'class': 'dwv-band dwv-b-net' }, s); }
        svg('line', { x1: g.l, x2: W - g.r, y1: sy(N.average), y2: sy(N.average), 'class': 'dwv-avg' }, s);
        svg('path', { d: linePath(X, N.main, sx, sy), 'class': 'dwv-ln dwv-s-net' }, s);
        if (finite(N.day90)) {
          var x90 = sx(N.day90), y90 = sy(90);
          svg('circle', { cx: x90, cy: y90, r: 4.5, 'class': 'dwv-dot dwv-f-net' }, s);
          svgText(s, x90 + 9, y90 + 19, (narrow ? '90% by ' : '90% fewer mites by ') + yearDate(N.day90),
                  'dwv-label dwv-halo', 'start');
        }
        svg('line', { x1: g.l, x2: W - g.r, y1: g.t + ih, y2: g.t + ih, 'class': 'dwv-axis' }, s);
        var guide = svg('line', { y1: g.t, y2: g.t + ih, 'class': 'dwv-guide', visibility: 'hidden' }, s);
        var dot = svg('circle', { r: 4, 'class': 'dwv-dot dwv-f-net', visibility: 'hidden' }, s);
        var overlay = svg('rect', { x: g.l, y: g.t, width: iw, height: ih, 'class': 'dwv-overlay' }, s);
        function fromPointer(ev) {
          var rect = s.getBoundingClientRect(), k = rect.width / W || 1;
          var day = ((ev.clientX - rect.left) / k - g.l) / iw * END;
          hover = nearest(X, Math.max(0, Math.min(END, day)));
          show();
        }
        overlay.addEventListener('pointermove', fromPointer);
        overlay.addEventListener('pointerdown', fromPointer);
        overlay.addEventListener('pointerleave', function (ev) { if (ev.pointerType === 'mouse') { hover = null; show(); } });
        geo = { sx: sx, sy: sy, guide: guide, dot: dot };
        show();
      }
      function show() {
        clear(info);
        var v = hover === null ? null : N.main[hover];
        if (!finite(v)) {
          geo.guide.setAttribute('visibility', 'hidden');
          geo.dot.setAttribute('visibility', 'hidden');
          text(info, 'Over the five years together, the treated colony carries ');
          html('strong', null, info, near100(N.average) + '% fewer feeding mites');
          text(info, ' than the untreated colony.' +
            (finite(N.day90) ? ' It first has 90% fewer on ' + yearDate(N.day90) + '.' : '') +
            ' Point at or tap the graph to read any day.');
          return;
        }
        var x = geo.sx(X[hover]);
        geo.guide.setAttribute('x1', x);
        geo.guide.setAttribute('x2', x);
        geo.guide.setAttribute('visibility', 'visible');
        geo.dot.setAttribute('cx', x);
        geo.dot.setAttribute('cy', geo.sy(v));
        geo.dot.setAttribute('visibility', 'visible');
        html('strong', null, info, dateText(X[hover]) + ': ');
        var range = '';
        if (band && finite(band.lo[hover]) && finite(band.hi[hover])) {
          var lo = near100(band.lo[hover]), hi = near100(band.hi[hover]);
          range = lo === hi ? ' (the same in the other weathers)' : ' (other weathers: ' + lo + '% to ' + hi + '%)';
        }
        text(info, (v < 0 ? near100(-v) + '% more' : near100(v) + '% fewer') + ' feeding mites than the untreated colony' +
          range + '.');
      }
      chart.addEventListener('keydown', function (e) {
        var step = e.shiftKey ? 30 : 2;
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          if (hover === null) { hover = e.key === 'ArrowRight' ? 0 : NX - 1; } else {
            hover = Math.max(0, Math.min(NX - 1, hover + (e.key === 'ArrowRight' ? step : -step)));
          }
          show();
        } else if (e.key === 'Home' || e.key === 'End') {
          e.preventDefault();
          hover = e.key === 'Home' ? 0 : NX - 1;
          show();
        } else if (e.key === 'Escape') {
          hover = null;
          show();
        }
      });
      draw();
      onWidthChange(chart, draw);
    }

    // ---- which treatment properties matter most ----
    function renderSensitivity(root) {
      if (!D.hasSensitivity) { html('p', { 'class': 'dwv-note' }, root, 'The sensitivity runs were not done.'); return; }
      var P = D.sensitivity, pctStep = Math.round(100 * P.step);
      var lo = P.low, hi = P.high, base = P.base;
      var head = html('div', { 'class': 'dwv-panel-head' }, root);
      html('div', { 'class': 'dwv-panel-title' }, head, 'Five-year average fewer feeding mites');
      var key = html('div', { 'class': 'dwv-torn-key' }, head);
      var k1 = html('span', null, key);
      html('i', null, k1).style.background = 'var(--dwv-low)';
      text(k1, 'Property ' + pctStep + '% lower');
      var k2 = html('span', null, key);
      html('i', null, k2).style.background = 'var(--dwv-high)';
      text(k2, 'Property ' + pctStep + '% higher');
      var body = html('div', { 'class': 'dwv-torn' }, root);
      var order = P.names.map(function (n, i) { return i; }).sort(function (a, b) {
        return Math.abs(hi[b] - lo[b]) - Math.abs(hi[a] - lo[a]);
      });
      var all = lo.concat(hi, [base]);
      var span = maxOf(all) - minOf(all), pad = Math.max(0.3 * span, 0.4);
      var x0 = minOf(all) - pad, x1 = maxOf(all) + pad;
      var pos = function (v) { return (v - x0) / (x1 - x0) * 100; };
      order.forEach(function (i) {
        var r = html('div', { 'class': 'dwv-torn-row' }, body);
        var name = html('div', { 'class': 'dwv-bar-name' }, r), pm = BYKEY[P.names[i]];
        if (pm) { text(name, pm.name + '\u00a0'); symbol(name, pm.symbol); } else { text(name, P.labels[i]); }
        var track = html('div', { 'class': 'dwv-torn-track' }, r);
        html('div', { 'class': 'dwv-torn-base' }, track).style.left = pos(base) + '%';
        if (Math.abs(hi[i] - lo[i]) < 1e-3 * Math.max(1, Math.abs(base)) &&
            Math.abs(hi[i] - base) < 1e-3 * Math.max(1, Math.abs(base))) {
          html('span', { 'class': 'dwv-torn-none' }, track, 'no effect').style.left = pos(base) + '%';
          return;
        }
        [['is-low', lo[i]], ['is-high', hi[i]]].forEach(function (spec) {
          var v = spec[1];
          var b = html('div', { 'class': 'dwv-torn-bar ' + spec[0] }, track);
          b.style.left = Math.min(pos(v), pos(base)) + '%';
          b.style.width = Math.abs(pos(v) - pos(base)) + '%';
          var t = html('span', { 'class': 'dwv-torn-val ' + spec[0] }, track, fixed(v, 1));
          if (v < base) { t.style.right = (100 - pos(v)) + '%'; t.style.paddingRight = '5px'; } else {
            t.style.left = pos(v) + '%'; t.style.paddingLeft = '5px';
          }
        });
      });
      var axisRow = html('div', { 'class': 'dwv-torn-row' }, body);
      html('div', null, axisRow);
      var axis = html('div', { 'class': 'dwv-torn-axis' }, axisRow);
      var rt = rangeTicks(x0, x1, 4), dd = decimalsFor(rt.step);
      rt.ticks.forEach(function (v) { html('span', null, axis, fixed(v, dd) + '%').style.left = pos(v) + '%'; });
      var top = BYKEY[P.names[order[0]]];
      var bees = P.beeLow.concat(P.beeHigh);
      html('p', { 'class': 'dwv-caption' }, root, 'Each treatment property lowered and raised by ' + pctStep +
        '%, one at a time, in the main weather. Baseline: ' + fixed(base, 1) + '% fewer feeding mites. Every change ' +
        'keeps it between ' + fixed(minOf(lo.concat(hi)), 1) + '% and ' + fixed(maxOf(lo.concat(hi)), 1) + '%' +
        (top ? ', and the ' + top.name.toLowerCase() + ' moves it most' : '') + '. The colony-size gain moves much ' +
        'less: ' + fixed(minOf(bees), 1) + '% to ' + fixed(maxOf(bees), 1) + '% more adult bees.');
    }

    // ---- how many bees need to drink the dsRNA syrup ----
    function renderUptake(root) {
      if (!D.hasUptake) { html('p', { 'class': 'dwv-note' }, root, 'The uptake runs were not done.'); return; }
      var U = D.uptake, xs = U.dailyPct, n = xs.length;
      var kOur = nearest(U.u, U.ourU), exact = Math.abs(U.u[kOur] - U.ourU) < 1e-9;
      var sel = kOur;
      function at(arr, x) {                  // straight line between the computed points
        for (var i = 1; i < n; i++) {
          if (xs[i] >= x) { return arr[i - 1] + (x - xs[i - 1]) / (xs[i] - xs[i - 1]) * (arr[i] - arr[i - 1]); }
        }
        return arr[n - 1];
      }
      var legend = html('div', { 'class': 'dwv-legend' }, root);
      addKey(legend, 'potm', 'Fewer feeding mites');
      addKey(legend, 'potb', 'More adult bees');
      var chart = html('div', { 'class': 'dwv-chart', tabindex: '0' }, root);
      var info = html('p', { 'class': 'dwv-map-info' }, root);
      var geo = null;
      function draw() {
        clear(chart);
        var W = Math.max(280, chart.clientWidth || 700), narrow = W < 560;
        var H = Math.round(Math.min(340, Math.max(240, W * 0.42)));
        var g = { l: 48, r: 16, t: 14, b: 42 };
        var xMax = 10 * Math.ceil(maxOf(xs) / 10), all = U.miteReduction.concat(U.beeGain);
        var yLo = minOf(all) < -1 ? 25 * Math.floor(minOf(all) / 25) : 0;   // only a real loss gets a negative axis
        var iw = W - g.l - g.r, ih = H - g.t - g.b;
        var sx = function (v) { return g.l + v / xMax * iw; };
        var sy = function (v) { return g.t + (100 - v) / (100 - yLo) * ih; };
        var s = svg('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'img',
          'aria-label': 'Five-year mite reduction and bee gain against the share of unprotected adult bees that take up ' +
            'an effective dose of dsRNA each day. Use the arrow keys to read the values.' }, chart);
        for (var v = yLo; v <= 100; v += 25) {
          if (v !== 0) { svg('line', { x1: g.l, x2: W - g.r, y1: sy(v), y2: sy(v), 'class': 'dwv-grid' }, s); }
          svgText(s, g.l - 7, sy(v) + 4, v + '%', 'dwv-tick', 'end');
        }
        var step = narrow ? 20 : 10;
        for (var x = 0; x <= xMax + 1e-9; x += step) {
          svgText(s, sx(x), H - g.b + 16, x + '%', 'dwv-tick', 'middle');
        }
        svgText(s, g.l + iw / 2, H - 5, narrow ? 'Bees taking up a dose each day' :
                'Unprotected adult bees that take up an effective dose each day', 'dwv-axis-title', 'middle');
        svg('line', { x1: g.l, x2: W - g.r, y1: sy(yLo), y2: sy(yLo), 'class': 'dwv-axis' }, s);
        svg('line', { x1: sx(U.ourPct), x2: sx(U.ourPct), y1: sy(100), y2: sy(yLo), 'class': 'dwv-pot-ref' }, s);
        svgText(s, sx(U.ourPct) + 5, sy(yLo) - 6, 'our feeding plan', 'dwv-label-muted', 'start');
        if (finite(U.neededPct)) {
          var xn = U.neededPct;
          svg('line', { x1: sx(0), x2: sx(xn), y1: sy(U.target), y2: sy(U.target), 'class': 'dwv-guide-dotted' }, s);
          svg('line', { x1: sx(xn), x2: sx(xn), y1: sy(U.target), y2: sy(yLo), 'class': 'dwv-guide-dotted' }, s);
          svgText(s, sx(xn) + 6, sy(U.target) + 18, (narrow ? U.target + '% from ' : U.target + '% fewer mites from ') +
                  Math.round(xn) + '% a day', 'dwv-label dwv-halo', 'start');
        }
        svg('path', { d: linePath(xs, U.beeGain, sx, sy), 'class': 'dwv-ln dwv-s-potb' }, s);
        svg('path', { d: linePath(xs, U.miteReduction, sx, sy), 'class': 'dwv-ln dwv-s-potm' }, s);
        [['potm', U.miteReduction], ['potb', U.beeGain]].forEach(function (spec) {
          var yv = exact ? spec[1][kOur] : at(spec[1], U.ourPct);
          svg('circle', { cx: sx(U.ourPct), cy: sy(yv), r: 4.5, 'class': 'dwv-dot dwv-f-' + spec[0] }, s);
          svgText(s, sx(U.ourPct) + 7, sy(yv) - 7, Math.round(yv) + '%', 'dwv-pot-value dwv-t-' + spec[0], 'start');
        });
        var guide = svg('line', { y1: g.t, y2: g.t + ih, 'class': 'dwv-guide' }, s);
        var dm = svg('circle', { r: 4, 'class': 'dwv-dot dwv-f-potm' }, s);
        var db = svg('circle', { r: 4, 'class': 'dwv-dot dwv-f-potb' }, s);
        var overlay = svg('rect', { x: g.l, y: g.t, width: iw, height: ih, 'class': 'dwv-overlay' }, s);
        function fromPointer(ev) {
          var rect = s.getBoundingClientRect(), k = rect.width / W || 1;
          var xv = ((ev.clientX - rect.left) / k - g.l) / iw * xMax;
          sel = nearest(xs, Math.max(0, Math.min(xMax, xv)));
          showSel();
        }
        overlay.addEventListener('pointermove', fromPointer);
        overlay.addEventListener('pointerdown', fromPointer);
        geo = { sx: sx, sy: sy, guide: guide, dm: dm, db: db };
        showSel();
      }
      function showSel() {
        var x = geo.sx(xs[sel]);
        geo.guide.setAttribute('x1', x);
        geo.guide.setAttribute('x2', x);
        geo.dm.setAttribute('cx', x);
        geo.dm.setAttribute('cy', geo.sy(U.miteReduction[sel]));
        geo.db.setAttribute('cx', x);
        geo.db.setAttribute('cy', geo.sy(U.beeGain[sel]));
        clear(info);
        var share = xs[sel] === 0 ? 'If no bees take up the dsRNA' : 'If ' + fixed(xs[sel], xs[sel] < 9.95 ? 1 : 0) +
          '% of the unprotected adult bees take up an effective dose each day';
        html('strong', null, info, share + (sel === kOur && exact ? ' (our feeding plan, u = ' + U.ourU + ' per day)' : '') + ': ');
        text(info, pct(U.miteReduction[sel]) + ' fewer feeding mites and ' + pct(U.beeGain[sel]) +
          ' more adult bees over five years' + (finite(U.collapse[sel]) ? ', but the treated colony collapses' : '') + '.');
      }
      chart.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') { return; }
        e.preventDefault();
        sel = Math.max(0, Math.min(n - 1, sel + (e.key === 'ArrowRight' ? 1 : -1)));
        showSel();
      });
      draw();
      onWidthChange(chart, draw);
    }

    // ---- when to start the dsRNA syrup ----
    var SEASONS = [['winter', 'Winter'], ['spring', 'Spring'], ['summer', 'Summer'], ['autumn', 'Autumn']];
    var SEASON_OF_MONTH = [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 0];     // Dec-Feb winter, Mar-May spring, ...
    function monthOf(day) {
      var d = Math.min(Math.floor(((day % T) + T) % T + 1e-9), 364), mo = 11;
      while (mo > 0 && MONTH_START[mo] > d) { mo--; }
      return mo;
    }
    function renderTiming(root) {
      if (!D.hasStart) { html('p', { 'class': 'dwv-note' }, root, 'The feeding-start runs were not done.'); return; }
      var S = D.start, n = S.startDay.length;
      var rows = Array.isArray(S.M[0]) ? S.M : [S.M];
      var shown = (Array.isArray(S.shown) ? S.shown : [S.shown]).map(function (k) { return k - 1; });
      var season = S.startDay.map(function (d) { return SEASON_OF_MONTH[monthOf(d)]; });
      var XA = S.day, NA = XA.length, XEND = XA[NA - 1];
      function cls(k) { return 'season-' + SEASONS[season[k]][0]; }
      var legend = html('div', { 'class': 'dwv-legend' }, root);
      shown.forEach(function (k) { addKey(legend, cls(k), SEASONS[season[k]][1] + ' start, ' + S.names[k] + ' 1'); });
      addKey(legend, 'grp-ctrl', 'Untreated');
      var grid = html('div', { 'class': 'dwv-timing' }, root);
      var cardA = html('figure', { 'class': 'dwv-tcard' }, grid);
      html('figcaption', { 'class': 'dwv-panel-title' }, cardA, 'Feeding mites in the first two years');
      var chartA = html('div', { 'class': 'dwv-chart', tabindex: '0' }, cardA);
      var readA = html('p', { 'class': 'dwv-map-info' }, cardA);
      var cardB = html('figure', { 'class': 'dwv-tcard' }, grid);
      var capB = html('figcaption', { 'class': 'dwv-panel-title' }, cardB, 'Smallest colony in the first winter');
      html('span', { 'class': 'dwv-panel-sub' }, capB, 'Fewest adult bees, January to April of year 2. Dashed: untreated.');
      var chartB = html('div', { 'class': 'dwv-chart', tabindex: '0' }, cardB);
      var readB = html('p', { 'class': 'dwv-map-info' }, cardB);
      var hover = null, pick = shown.length ? shown[0] : 0, gA = null, gB = null;

      function drawA() {
        clear(chartA);
        var W = Math.max(260, chartA.clientWidth || 560), narrow = W < 440;
        var H = Math.round(Math.min(300, Math.max(230, W * 0.55)));
        var g = { l: narrow ? 42 : 48, r: 10, t: 10, b: 42 };
        var iw = W - g.l - g.r, ih = H - g.t - g.b;
        var top = maxOf(S.ctrlM);
        rows.forEach(function (r) { top = Math.max(top, maxOf(r)); });
        var sc = niceScale(top), labels = tickLabels(sc, 'mites');
        var sx = function (d) { return g.l + d / XEND * iw; };
        var sy = function (v) { return g.t + (1 - Math.min(v, sc.top) / sc.top) * ih; };
        var s = svg('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'img',
          'aria-label': 'Feeding mites over the first two years, untreated and with the syrup started on ' +
            shown.map(function (k) { return S.names[k] + ' 1'; }).join(', ') +
            '. Use the left and right arrow keys to read the values.' }, chartA);
        for (var y = 0; y * T < XEND; y++) {
          svg('rect', { x: sx(y * T), y: g.t, width: sx(y * T + D.meta.winterEndDay) - sx(y * T), height: ih,
                        'class': 'dwv-shade' }, s);
          [0, 90, 181, 273].forEach(function (d) {
            svgText(s, sx(y * T + d), g.t + ih + 15, narrow ? MONTHS[monthOf(d)].charAt(0) : MONTHS[monthOf(d)],
                    'dwv-tick', 'middle');
          });
          svgText(s, sx((y + 0.5) * T), H - 4, 'Year ' + (y + 1), 'dwv-axis-title', 'middle');
        }
        sc.ticks.forEach(function (v, i) {
          if (v > 0) { svg('line', { x1: g.l, x2: W - g.r, y1: sy(v), y2: sy(v), 'class': 'dwv-grid' }, s); }
          svgText(s, g.l - 7, sy(v) + 4, labels[i], 'dwv-tick', 'end');
        });
        svg('path', { d: linePath(XA, S.ctrlM, sx, sy), 'class': 'dwv-ln dwv-s-grp-ctrl' }, s);
        shown.forEach(function (k, r) {
          svg('path', { d: linePath(XA, rows[r], sx, sy), 'class': 'dwv-ln dwv-s-' + cls(k) }, s);
          var j0 = 0;
          while (j0 < NA - 1 && XA[j0] < S.startDay[k]) { j0++; }
          svg('circle', { cx: sx(XA[j0]), cy: sy(rows[r][j0]), r: 4.5, 'class': 'dwv-dot dwv-f-' + cls(k) }, s);
        });
        svg('line', { x1: g.l, x2: W - g.r, y1: g.t + ih, y2: g.t + ih, 'class': 'dwv-axis' }, s);
        var guide = svg('line', { y1: g.t, y2: g.t + ih, 'class': 'dwv-guide', visibility: 'hidden' }, s);
        var dots = [{ y: S.ctrlM, c: svg('circle', { r: 3.8, 'class': 'dwv-dot dwv-f-grp-ctrl', visibility: 'hidden' }, s) }];
        shown.forEach(function (k, r) {
          dots.push({ y: rows[r], c: svg('circle', { r: 3.8, 'class': 'dwv-dot dwv-f-' + cls(k), visibility: 'hidden' }, s) });
        });
        var overlay = svg('rect', { x: g.l, y: g.t, width: iw, height: ih, 'class': 'dwv-overlay' }, s);
        function fromPointer(ev) {
          var rect = s.getBoundingClientRect(), k = rect.width / W || 1;
          var day = ((ev.clientX - rect.left) / k - g.l) / iw * XEND;
          hover = nearest(XA, Math.max(0, Math.min(XEND, day)));
          showA();
        }
        overlay.addEventListener('pointermove', fromPointer);
        overlay.addEventListener('pointerdown', fromPointer);
        overlay.addEventListener('pointerleave', function (ev) { if (ev.pointerType === 'mouse') { hover = null; showA(); } });
        gA = { sx: sx, sy: sy, guide: guide, dots: dots };
        showA();
      }
      function showA() {
        clear(readA);
        if (hover === null) {
          gA.guide.setAttribute('visibility', 'hidden');
          gA.dots.forEach(function (d) { d.c.setAttribute('visibility', 'hidden'); });
          text(readA, 'Dots: the day the syrup goes in. Point at or tap the graph to read the mites on any day.');
          return;
        }
        var x = gA.sx(XA[hover]);
        gA.guide.setAttribute('x1', x);
        gA.guide.setAttribute('x2', x);
        gA.guide.setAttribute('visibility', 'visible');
        gA.dots.forEach(function (d) {
          d.c.setAttribute('cx', x);
          d.c.setAttribute('cy', gA.sy(d.y[hover]));
          d.c.setAttribute('visibility', 'visible');
        });
        html('strong', null, readA, dateText(XA[hover]) + ', feeding mites: ');
        var parts = ['untreated ' + int(S.ctrlM[hover])];
        shown.forEach(function (k, r) { parts.push('from ' + S.names[k] + ' 1: ' + int(rows[r][hover])); });
        text(readA, parts.join(' \u00b7 '));
      }

      function drawB() {
        clear(chartB);
        var W = Math.max(260, chartB.clientWidth || 380);
        var H = Math.round(Math.min(300, Math.max(230, W * 0.62)));
        var g = { l: 44, r: 10, t: 22, b: 42 };
        var iw = W - g.l - g.r, ih = H - g.t - g.b, bw = iw / n;
        var cv = S.ctrl.winterLow;
        var sc = niceScale(1.08 * Math.max(maxOf(S.winterLow), cv)), labels = tickLabels(sc, 'bees');
        var cx = function (k) { return g.l + (k + 0.5) * bw; };
        var sy = function (v) { return g.t + (1 - Math.min(v, sc.top) / sc.top) * ih; };
        var s = svg('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'img',
          'aria-label': 'Fewest adult bees in the first winter for each month the syrup is first put out, and for the ' +
            'untreated colony. Use the left and right arrow keys to read each month.' }, chartB);
        sc.ticks.forEach(function (v, i) {
          if (v > 0) { svg('line', { x1: g.l, x2: W - g.r, y1: sy(v), y2: sy(v), 'class': 'dwv-grid' }, s); }
          svgText(s, g.l - 7, sy(v) + 4, labels[i], 'dwv-tick', 'end');
        });
        for (var k = 0; k < n; k++) {
          var v = finite(S.winterLow[k]) ? S.winterLow[k] : 0;
          svg('rect', { x: cx(k) - 0.34 * bw, y: sy(v), width: 0.68 * bw, height: Math.max(0, sy(0) - sy(v)), rx: 1.5,
                        'class': 'dwv-f-' + cls(k) }, s);
          if (bw >= 30) {
            svgText(s, cx(k), sy(v) - 5, fixed(v / 1000, 1) + 'k', 'dwv-bar-value', 'middle');
          }
          svgText(s, cx(k), g.t + ih + 15, bw >= 30 ? S.names[k] : S.names[k].charAt(0), 'dwv-tick', 'middle');
        }
        svgText(s, g.l + iw / 2, H - 4, 'Month the syrup goes in', 'dwv-axis-title', 'middle');
        svg('line', { x1: g.l, x2: W - g.r, y1: sy(0), y2: sy(0), 'class': 'dwv-axis' }, s);
        svg('line', { x1: g.l, x2: W - g.r, y1: sy(cv), y2: sy(cv), 'class': 'dwv-ln dwv-s-grp-ctrl' }, s);
        var outline = svg('rect', { y: g.t - 16, width: bw, height: ih + 16, rx: 4, 'class': 'dwv-map-sel' }, s);
        for (var h = 0; h < n; h++) {
          (function (k2) {
            var hit = svg('rect', { x: g.l + k2 * bw, y: g.t - 16, width: bw, height: ih + 16, 'class': 'dwv-hit' }, s);
            hit.addEventListener('pointerenter', function () { pick = k2; showB(); });
            hit.addEventListener('pointerdown', function () { pick = k2; showB(); });
          })(h);
        }
        gB = { g: g, bw: bw, outline: outline };
        showB();
      }
      function showB() {
        gB.outline.setAttribute('x', gB.g.l + pick * gB.bw);
        clear(readB);
        var k = pick, v = S.winterLow[k], cv = S.ctrl.winterLow;
        html('strong', null, readB, 'Syrup from ' + S.names[k] + ' 1: ');
        if (finite(S.collapse[k])) { text(readB, 'the colony collapses (' + dateText(S.collapse[k]) + ').'); return; }
        var d = 100 * (v / cv - 1);
        text(readB, 'at its smallest in the first winter the colony has ' + int(v) + ' adult bees, ' +
          (d >= 0 ? pct(d) + ' more' : pct(-d) + ' fewer') + ' than the untreated colony (' + int(cv) + '). On Dec 31 it carries ' +
          int(S.mitesDec31[k]) + ' feeding mites (untreated ' + int(S.ctrl.mitesDec31) + '), and on Mar 1, ' +
          (S.infectedMar1[k] < 0.5 ? 'almost none' : int(S.infectedMar1[k])) + ' of its bees carry DWV (untreated ' +
          int(S.ctrl.infectedMar1) + ').');
      }
      chartA.addEventListener('keydown', function (e) {
        var step = e.shiftKey ? 30 : 2;
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          if (hover === null) { hover = e.key === 'ArrowRight' ? 0 : NA - 1; } else {
            hover = Math.max(0, Math.min(NA - 1, hover + (e.key === 'ArrowRight' ? step : -step)));
          }
          showA();
        } else if (e.key === 'Escape') {
          hover = null;
          showA();
        }
      });
      chartB.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') { return; }
        e.preventDefault();
        pick = Math.max(0, Math.min(n - 1, pick + (e.key === 'ArrowRight' ? 1 : -1)));
        showB();
      });
      drawA();
      drawB();
      onWidthChange(chartA, drawA);
      onWidthChange(chartB, drawB);
    }

    var widgets = { stats: renderStats, diagram: renderDiagram, explorer: renderExplorer, net: renderNet,
                    dose: renderDose, sensitivity: renderSensitivity, uptake: renderUptake, timing: renderTiming };
    Array.prototype.forEach.call(document.querySelectorAll('[data-dwv]'), function (node) {
      var f = widgets[node.getAttribute('data-dwv')];
      if (f && !node.getAttribute('data-dwv-ready')) {
        node.setAttribute('data-dwv-ready', '1');
        clear(node);                // replace the still preview saved in the page, if there is one
        try { f(node); } catch (err) {
          node.textContent = 'This widget could not be drawn (' + err.message + ').';
          if (window.console) { console.error('[DWV]', err); }
        }
      }
    });
  }

  function start() {
    if (!window.DWV_DATA || !window.DWV_DATA.meta) {
      Array.prototype.forEach.call(document.querySelectorAll('[data-dwv]'), function (node) {
        node.textContent = 'Model data not found: load dwv_wiki_data.js before dwv_widgets.js.';
      });
      return;
    }
    build(window.DWV_DATA);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
