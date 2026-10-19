var FACTORS=[
 {key:"stakeholder",name:"Stakeholder interactions",short:"Stakeholders",unit:"stakeholder",color:"var(--f-rose)",
  desc:"Score each stakeholder conversation.",
  metrics:[{k:"relevance",n:"Relevance",w:30,q:"Does this person relate to one or more SDGs?"},
   {k:"impact",n:"Impact",w:30,q:"Did we substantially alter our project based on their feedback?"},
   {k:"iterations",n:"Iterations",w:20,q:"How often did we go back to this person?"},
   {k:"influence",n:"Influence",w:10,q:"How much power does this person hold in their field?"},
   {k:"attitude",n:"Attitude",w:10,q:"What was their stance on the project's validity and impact?"}]},
 {key:"outreach",name:"Outreach & education",short:"Outreach",unit:"program",color:"var(--f-sand)",
  desc:"Score each educational program or resource.",
  metrics:[{k:"reach",n:"Reach",w:30,q:"How many people did it reach out of the target audience?"},
   {k:"inclusivity",n:"Inclusivity",w:30,q:"Was it easily accessible to the target audience?"},
   {k:"response",n:"Response",w:20,q:"How did attendees respond?"},
   {k:"iterations",n:"Iterations",w:10,q:"How many times did we run it, applying past feedback?"},
   {k:"method",n:"Method",w:5,q:"Did the way it was run affect its effectiveness?"},
   {k:"reproducibility",n:"Reproducibility",w:5,q:"Could other groups replicate it from our documentation?"}]},
 {key:"current",name:"Current effects",short:"Current effects",unit:"assessment",color:"var(--f-olive)",
  desc:"Score what the project does today: one row per component or claim, tagged with the goals it affects.",
  metrics:[{k:"environment",n:"Environment",w:30,q:"What is the project's current impact on the environment?"},
   {k:"efficiency",n:"Efficiency",w:30,q:"Does it use resources well compared with existing technologies?"},
   {k:"performance",n:"Performance",w:20,q:"How are the experimental results, and how do they move the SDGs?"},
   {k:"safety",n:"Safety",w:20,q:"What measures guard against unintended risks?"}]},
 {key:"projected",name:"Projected outlook",short:"Projected outlook",unit:"projection",color:"var(--f-ochre)",
  desc:"Score the expected impact after implementation, one row per scenario.",
  metrics:[{k:"environment",n:"Environment",w:30,q:"How will it affect the environment after implementation?"},
   {k:"agriculture",n:"Agriculture",w:20,q:"Projected agricultural impact; can it scale commercially?"},
   {k:"economics",n:"Economics",w:20,q:"How will it affect the community's economy?"},
   {k:"technology",n:"Technology",w:20,q:"How will it affect access to and affordability of technology?"},
   {k:"implementation",n:"Implementation",w:10,q:"How easily can stakeholders adopt it?"}]}
];
var SDGS=[
 /* Match the goal colors in the sustainability diagram. */
 {n:2,name:"Zero Hunger",layer:"fruit",color:"#D78794",ink:"#2A1F21"},
 {n:8,name:"Decent Work and Economic Growth",layer:"fruit",color:"#EBCEAD",ink:"#2A241C"},
 {n:11,name:"Sustainable Cities and Communities",layer:"fruit",color:"#E1AF70",ink:"#2A241C"},
 {n:15,name:"Life on Land",layer:"branches",color:"#5D695D",ink:"#FFFFFF"},
 {n:4,name:"Quality Education",layer:"roots",color:"#E48D36",ink:"#2A1E12"},
 {n:5,name:"Gender Equality",layer:"roots",color:"#F7B74E",ink:"#2A2112"},
 {n:17,name:"Partnerships for the Goals",layer:"soil",color:"#AAA06D",ink:"#22231A"}
];
var LAYERS=[{k:"fruit",n:"Fruit",d:"Spin-off benefits"},{k:"branches",n:"Branches",d:"Direct ecological impact"},
 {k:"roots",n:"Roots",d:"Education and inclusion"},{k:"soil",n:"Soil",d:"Partnerships"}];
var SDG_BY_N={};SDGS.forEach(function(s){SDG_BY_N[s.n]=s;});
var FACTOR_BY_KEY={};FACTORS.forEach(function(f){FACTOR_BY_KEY[f.key]=f;});


export { FACTORS, SDGS, LAYERS, SDG_BY_N, FACTOR_BY_KEY };
export function validScore(v){return typeof v==="number"&&isFinite(v)&&v>=1&&v<=10;}

/* ---- scoring ---- */
export function itemScore(it,state){
  var f=FACTOR_BY_KEY[it.factor], mw=state.metricWeights[f.key], sum=0, wsum=0;
  for(var i=0;i<f.metrics.length;i++){
    var m=f.metrics[i], v=it.scores[m.k];
    if(!validScore(v)) return null;
    sum+=mw[m.k]*v; wsum+=mw[m.k];
  }
  return wsum>0?sum/wsum:null;
}
export function factorScore(sdgN,fkey,state){
  var vals=[];
  state.items.forEach(function(it){
    if(it.factor===fkey&&it.sdgs.indexOf(sdgN)>=0){var s=itemScore(it,state);if(s!=null)vals.push(s);}
  });
  if(!vals.length) return {score:null,count:0};
  return {score:vals.reduce(function(a,b){return a+b;},0)/vals.length,count:vals.length};
}
export function weightsFor(sdgN,state){return state.sdgWeights[sdgN]||state.factorWeights;}
export function sdgScore(sdgN,state){
  var W=weightsFor(sdgN,state),sum=0,wsum=0,used=0,active=0,parts={};
  FACTORS.forEach(function(f){
    var fs=factorScore(sdgN,f.key,state); parts[f.key]=fs;
    var w=W[f.key]||0;
    if(w>0) active++;
    if(fs.score!=null&&w>0){sum+=w*fs.score;wsum+=w;used++;}
  });
  return {score:wsum>0?sum/wsum:null,used:used,active:active,parts:parts,weights:W};
}
