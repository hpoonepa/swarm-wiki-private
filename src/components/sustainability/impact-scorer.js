import { FACTORS, SDGS, LAYERS, SDG_BY_N, FACTOR_BY_KEY, validScore, itemScore as scoreItem, sdgScore as scoreGoal, weightsFor as goalWeights } from './scorer-model.js';

export function initImpactScorer(root) {
  if (root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const $ = id => root.querySelector('#impact-' + CSS.escape(id));
  const STATE_TEXT = $('state').textContent;
  const STORE_KEY = 'swarm-sustainability-scorer-20261018-v1';
  const uid = () => 'e' + crypto.randomUUID().replaceAll('-', '');
  let storageOK = true, saveTimer = null, state = JSON.parse(STATE_TEXT);
  normalize(state);
  try {
    const stored = localStorage.getItem(STORE_KEY);
    if (stored) { const saved = JSON.parse(stored); normalize(saved); state = saved; }
  } catch { storageOK = false; }
  let activeTab = 'stakeholder', editing = false, lastDeleted = null, toastTimer = null;
  const itemScore = item => scoreItem(item, state);
  const sdgScore = goal => scoreGoal(goal, state);
  const weightsFor = goal => goalWeights(goal, state);
  const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = value => value == null ? '–' : value.toFixed(1);
  function normalize(s) {
    if (!s || typeof s !== 'object' || !Array.isArray(s.items)) throw new Error('Invalid scorer data');
    const weight = (value, fallback) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100 ? value : fallback;
    const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    s.factorWeights = object(s.factorWeights); s.metricWeights = object(s.metricWeights);
    FACTORS.forEach(f => {
      s.factorWeights[f.key] = weight(s.factorWeights[f.key], 25);
      const weights = s.metricWeights[f.key] = object(s.metricWeights[f.key]);
      f.metrics.forEach(m => weights[m.k] = weight(weights[m.k], m.w));
    });
    s.sdgNotes = Object.fromEntries(Object.entries(object(s.sdgNotes)).filter(([key, value]) => SDG_BY_N[key] && typeof value === 'string'));
    s.sdgWeights = Object.fromEntries(Object.entries(object(s.sdgWeights)).filter(([key]) => SDG_BY_N[key]).map(([key, values]) => [key, Object.fromEntries(FACTORS.map(f => [f.key, weight(object(values)[f.key], s.factorWeights[f.key])]))]));
    const seen = new Set();
    s.items = s.items.filter(item => item && FACTORS.some(f => f.key === item.factor));
    s.items.forEach(item => {
      if (typeof item.id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(item.id) || seen.has(item.id)) item.id = uid();
      seen.add(item.id);
      item.sdgs = [...new Set((Array.isArray(item.sdgs) ? item.sdgs : []).filter(n => typeof n === 'number' && SDG_BY_N[n]))];
      item.scores = object(item.scores);
      item.name = typeof item.name === 'string' ? item.name : '';
      item.why = typeof item.why === 'string' ? item.why : '';
    });
  }
  function applyEditMode() {
    root.dataset.editing = String(editing);
    root.querySelectorAll('input[type=number]').forEach(input => { input.readOnly = !editing; input.tabIndex = editing ? 0 : -1; });
    root.querySelectorAll('[data-goal]').forEach(button => { button.disabled = !editing; });
  }
  $('btn-edit').addEventListener('click', () => {
    editing = !editing;
    $('btn-edit').textContent = editing ? 'Done editing' : 'Adjust scores';
    $('btn-edit').setAttribute('aria-pressed', String(editing));
    renderSummary(); renderTable();
    applyEditMode();
    note(editing ? 'Edits save in this browser. The published team data stays unchanged.' : '');
  });
  $('tabs').addEventListener('keydown', event => {
    const current = FACTORS.findIndex(f => f.key === activeTab);
    let next;
    if (event.key === 'ArrowRight') next = (current + 1) % FACTORS.length;
    else if (event.key === 'ArrowLeft') next = (current + FACTORS.length - 1) % FACTORS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = FACTORS.length - 1;
    else return;
    event.preventDefault(); activeTab = FACTORS[next].key;
    renderTabs(); renderTable(); $('tab-' + activeTab).focus();
  });

/* ---- rendering ---- */
function renderSummary(){
  var html="";
  LAYERS.forEach(function(L){
    html+='<div class="tier"><div class="tier-label"><b>'+L.n+'</b><span>'+L.d+'</span></div><div class="tier-cards">';
    SDGS.filter(function(s){return s.layer===L.k;}).forEach(function(s){
      var r=sdgScore(s.n);
      var covCls=r.used<r.active?"cov partial":"cov";
      html+='<article class="card"><div class="card-head"><div class="sdg-sq" style="background:'+s.color+';color:'+s.ink+'">'+s.n+'</div><div class="ttl"><h3>'+esc(s.name)+'</h3>'+
        ''+'</div></div>'+
        '<div class="score-row"><span class="score-big'+(r.score==null?' empty':'')+'">'+fmt(r.score)+'</span><span class="score-of">/ 10</span>'+
        '<span class="'+covCls+'">'+r.used+' / '+r.active+' factors</span></div><div class="bars">';
      FACTORS.forEach(function(f){
        var p=r.parts[f.key], w=r.weights[f.key]||0;
        var pct=p.score==null?0:(p.score/10*100);
        html+='<div class="bar'+(p.score==null?' none':'')+(w>0?'':' off')+'" title="'+esc(f.name)+': '+p.count+' item'+(p.count===1?'':'s')+', weight '+w+'%"><span class="lbl">'+esc(f.short)+' <span class="wt">'+w+'%</span></span>'+
          '<span class="track"><span class="fill" style="display:block;width:'+pct+'%;background:'+f.color+'"></span></span>'+
          '<span class="val">'+fmt(p.score)+'</span></div>';
      });
      html+='</div>'+(state.sdgNotes[s.n]?'<p class="score-note view-only">'+esc(state.sdgNotes[s.n])+'</p>':'')+'<div class="why edit-only"><label for="impact-why-'+s.n+'">Why this score</label>'+
        '<textarea id="impact-why-'+s.n+'" data-why="'+s.n+'" rows="3" placeholder="What drives this score? Which evidence matters most, and what’s missing?">'+esc(state.sdgNotes[s.n]||"")+'</textarea></div></article>';
    });
    html+='</div></div>';
  });
  $("tiers").innerHTML=html;applyEditMode();
}
function weightRowHTML(id,labelHTML,W){
  var h='<tr'+(id==="default"?' class="def"':'')+'><th scope="row">'+labelHTML+'</th>';
  FACTORS.forEach(function(f){
    h+='<td class="n"><span class="inp-pct"><input type="number" id="impact-fw-'+id+'-'+f.key+'" data-fw="'+f.key+'" data-sdg="'+id+'" min="0" max="100" step="5" value="'+W[f.key]+'" aria-label="'+esc(f.name)+' weight">%</span></td>';
  });
  h+='<td class="n"><span class="tot" id="impact-fwt-'+id+'"></span></td><td>'+
    (id==="default"?'':'<button type="button" class="del edit-only" id="impact-fwr-'+id+'" data-resetsdg="'+id+'">Use default</button>')+'</td></tr>';
  return h;
}
function renderWeights(){
  var fw='<caption class="sr-only">Factor weights for each Sustainable Development Goal</caption><thead><tr><th>Goal</th>';
  FACTORS.forEach(function(f){fw+='<th class="n"><span class="sw" style="background:'+f.color+'"></span>'+esc(f.short)+'</th>';});
  fw+='<th class="n">Total</th><th></th></tr></thead><tbody>';
  fw+=weightRowHTML("default",'<div class="goal-cell"><div>Default<small>Used by every goal you haven’t changed</small></div></div>',state.factorWeights);
  SDGS.forEach(function(s){
    fw+=weightRowHTML(String(s.n),'<div class="goal-cell"><span class="sdg-sm" style="background:'+s.color+';color:'+s.ink+'">'+s.n+'</span><div>'+esc(s.name)+
      ' <span class="cw" id="impact-fwc-'+s.n+'">Custom</span></div></div>',weightsFor(s.n));
  });
  fw+='</tbody>';
  $("fw").innerHTML=fw;
  refreshWeightTable();
  var mw="";
  FACTORS.forEach(function(f){
    mw+='<div><h4>'+esc(f.name)+'</h4>';
    f.metrics.forEach(function(m){
      mw+='<div class="mw-row"><label for="impact-mw-'+f.key+'-'+m.k+'">'+esc(m.n)+'<small>'+esc(m.q)+'</small></label>'+
        '<span class="inp-pct"><input type="number" id="impact-mw-'+f.key+'-'+m.k+'" data-mwf="'+f.key+'" data-mwk="'+m.k+'" min="0" max="100" step="5" value="'+state.metricWeights[f.key][m.k]+'">%</span></div>';
    });
    mw+='<p class="mw-sum" id="impact-mws-'+f.key+'"></p></div>';
  });
  $("mw").innerHTML=mw;
  updateWeightSums();
}
function refreshWeightTable(){
  var ids=["default"].concat(SDGS.map(function(s){return String(s.n);}));
  ids.forEach(function(id){
    var W=id==="default"?state.factorWeights:weightsFor(id), t=0;
    FACTORS.forEach(function(f){
      var el=$("fw-"+id+"-"+f.key);
      if(el&&el!==document.activeElement) el.value=W[f.key];
      t+=W[f.key]||0;
    });
    var tot=$("fwt-"+id);
    if(tot){tot.textContent=t+"%";tot.className="tot"+(t!==100?" off":"");tot.title=t!==100?"Scores rescale, so this still works. Totals of 100% are easier to explain.":"";}
    if(id!=="default"){
      var custom=!!state.sdgWeights[id];
      $("fwc-"+id).hidden=!custom;
      $("fwr-"+id).hidden=!custom;
    }
  });
}
function updateWeightSums(){
  FACTORS.forEach(function(f){
    var s=0;f.metrics.forEach(function(m){s+=state.metricWeights[f.key][m.k]||0;});
    var el=$("mws-"+f.key);
    el.textContent="Total "+s+"%"+(s!==100?". The write-up's weights add to 100; scores rescale either way.":"");
    el.className="mw-sum"+(s!==100?" off":"");
  });
}
function renderTabs(){
  var html="";
  FACTORS.forEach(function(f){
    var c=state.items.filter(function(it){return it.factor===f.key;}).length;
    html+='<button class="tab" role="tab" type="button" id="impact-tab-'+f.key+'" data-tab="'+f.key+'" aria-controls="impact-evidence-panel" tabindex="'+(f.key===activeTab?0:-1)+'" aria-selected="'+(f.key===activeTab)+'">'+
      '<span class="sw" style="background:'+f.color+'"></span>'+esc(f.name)+' <span class="ct">'+c+'</span></button>';
  });
  $("tabs").innerHTML=html;
  var f=FACTOR_BY_KEY[activeTab];
  $("factor-desc").textContent=f.desc;
  $("btn-add").textContent="Add "+f.unit;
}
function renderTable(){
  var f=FACTOR_BY_KEY[activeTab], mw=state.metricWeights[f.key];
  var html='<caption class="sr-only">'+esc(f.name)+' evidence and scores</caption><thead><tr><th>'+esc(f.unit)+'</th><th>Goals</th>';
  f.metrics.forEach(function(m){html+='<th class="n" title="'+esc(m.q)+'">'+esc(m.n)+'<span class="w">'+mw[m.k]+'%</span></th>';});
  html+='<th class="n">Score</th><th>Reasoning</th><th class="edit-only"><span class="sr" hidden>Remove</span></th></tr></thead><tbody>';
  var rows=state.items.filter(function(it){return it.factor===f.key;});
  if(!rows.length) html+='<tr class="empty-row"><td colspan="'+(f.metrics.length+5)+'">No '+esc(f.unit)+' rows yet. Add one to start scoring.</td></tr>';
  rows.forEach(function(it){
    html+='<tr data-row="'+it.id+'"><td><span class="item-name view-only">'+esc(it.name)+'</span><input class="edit-only" type="text" id="impact-n-'+it.id+'" data-name="'+it.id+'" value="'+esc(it.name)+'" placeholder="Name this '+esc(f.unit)+'" aria-label="Name"></td><td><div class="goals">';
    SDGS.slice().sort(function(a,b){return a.n-b.n;}).forEach(function(s){
      var on=it.sdgs.indexOf(s.n)>=0;
      html+='<button type="button" class="g" id="impact-g-'+it.id+'-'+s.n+'" data-goal="'+s.n+'" data-item="'+it.id+'" aria-pressed="'+on+'" title="SDG '+s.n+': '+esc(s.name)+'"'+(on?' style="background:'+s.color+';color:'+s.ink+'"':'')+'>'+s.n+'</button>';
    });
    html+='</div></td>';
    f.metrics.forEach(function(m){
      var v=it.scores[m.k];
      html+='<td class="n"><input type="number" id="impact-s-'+it.id+'-'+m.k+'" data-item="'+it.id+'" data-metric="'+m.k+'" min="1" max="10" step="0.5" inputmode="decimal"'+
        (validScore(v)?' value="'+v+'"':' class="empty"')+' aria-label="'+esc(m.n)+'"></td>';
    });
    html+='<td class="n"><span id="impact-sc-'+it.id+'"></span></td>'+
      '<td><span class="item-reason view-only">'+esc(it.why)+'</span><input type="text" class="why-in edit-only" id="impact-w-'+it.id+'" data-itemwhy="'+it.id+'" value="'+esc(it.why)+'" placeholder="Brief reason for these scores" aria-label="Why these scores"></td><td class="edit-only"><button type="button" class="del" id="impact-d-'+it.id+'" data-del="'+it.id+'" aria-label="Remove row">Remove</button></td></tr>';
  });
  html+='</tbody>';
  $("tbl").innerHTML=html;$("evidence-panel").setAttribute("aria-labelledby", "impact-tab-"+activeTab);
  rows.forEach(function(it){updateRowScore(it.id);});applyEditMode();
}
function updateRowScore(id){
  var it=findItem(id), el=$("sc-"+id); if(!it||!el) return;
  var s=itemScore(it);
  el.className=s==null?"item-score empty":"item-score";
  el.textContent=s==null?"incomplete":s.toFixed(2);
}
function renderStatus(){
  clearTimeout(saveTimer);
  saveTimer=setTimeout(function(){
    try{localStorage.setItem(STORE_KEY,JSON.stringify(state));}
    catch(x){if(storageOK){storageOK=false;note("This browser isn\u2019t keeping your changes. Use Export data to save a copy.");}}
  },400);
}
function renderAll(){renderSummary();renderWeights();renderTabs();renderTable();applyEditMode();renderStatus();}
function findItem(id){for(var i=0;i<state.items.length;i++) if(state.items[i].id===id) return state.items[i];return null;}

function toast(msg,actionLabel,action){
  var t=$("toast");
  t.innerHTML="";var s=document.createElement("span");s.textContent=msg;t.appendChild(s);
  if(actionLabel){var b=document.createElement("button");b.type="button";b.textContent=actionLabel;b.onclick=function(){t.hidden=true;action();};t.appendChild(b);}
  t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.hidden=true;},6000);
}
function note(msg){var n=$("save-note");n.textContent=msg||"";n.hidden=!msg;}

/* ---- events ---- */
root.addEventListener("input",function(e){
  var t=e.target, d=t.dataset;
  if(d.metric){
    var it=findItem(d.item); if(!it) return;
    var v=t.value===""?null:parseFloat(t.value);
    it.scores[d.metric]=validScore(v)?v:null;
    t.classList.toggle("empty",!validScore(v));
    updateRowScore(it.id);renderSummary();renderStatus();
  }else if(d.name){
    var it2=findItem(d.name); if(it2){it2.name=t.value;renderStatus();}
  }else if(d.itemwhy){
    var it3=findItem(d.itemwhy); if(it3){it3.why=t.value;renderStatus();}
  }else if(d.why){
    if(t.value.trim()) state.sdgNotes[d.why]=t.value; else delete state.sdgNotes[d.why];
    renderStatus();
  }else if(d.fw){
    var w=parseFloat(t.value);w=isFinite(w)?Math.min(100,Math.max(0,w)):0;
    if(d.sdg==="default") state.factorWeights[d.fw]=w;
    else{
      if(!state.sdgWeights[d.sdg]){var copy={};FACTORS.forEach(function(f){copy[f.key]=state.factorWeights[f.key];});state.sdgWeights[d.sdg]=copy;}
      state.sdgWeights[d.sdg][d.fw]=w;
    }
    refreshWeightTable();renderSummary();renderStatus();
  }else if(d.mwf){
    var w2=parseFloat(t.value);state.metricWeights[d.mwf][d.mwk]=isFinite(w2)?Math.min(100,Math.max(0,w2)):0;
    updateWeightSums();renderSummary();
    if(d.mwf===activeTab){
      state.items.forEach(function(it){if(it.factor===activeTab)updateRowScore(it.id);});
      var f=FACTOR_BY_KEY[activeTab], idx=f.metrics.map(function(m){return m.k;}).indexOf(d.mwk);
      var th=$("tbl").querySelectorAll("thead th")[idx+2]; if(th) th.querySelector(".w").textContent=state.metricWeights[d.mwf][d.mwk]+"%";
    }
    renderStatus();
  }
});
root.addEventListener("change",function(e){
  var t=e.target;
  if(t.dataset.metric&&t.value!==""){
    var v=parseFloat(t.value);
    if(isFinite(v)&&!validScore(v)){
      v=Math.min(10,Math.max(1,v));t.value=v;
      findItem(t.dataset.item).scores[t.dataset.metric]=v;t.classList.remove("empty");
      updateRowScore(t.dataset.item);renderSummary();renderStatus();
      toast("Scores run from 1 to 10, so that value was set to "+v+".");
    }
  }
});
root.addEventListener("click",function(e){
  var b=e.target.closest("button"); if(!b) return;
  var d=b.dataset;
  if(d.tab){activeTab=d.tab;renderTabs();renderTable();$("tab-"+d.tab).focus();}
  else if(d.resetsdg){
    delete state.sdgWeights[d.resetsdg];refreshWeightTable();renderSummary();renderStatus();
    toast("SDG "+d.resetsdg+" now follows the default weights.");
  }
  else if(d.goal){
    var it=findItem(d.item),n=+d.goal,i=it.sdgs.indexOf(n);
    if(i>=0)it.sdgs.splice(i,1);else{it.sdgs.push(n);it.sdgs.sort(function(a,b){return a-b;});}
    var on=i<0;b.setAttribute("aria-pressed",on);b.style.background=on?SDG_BY_N[n].color:"";b.style.color=on?SDG_BY_N[n].ink:"";
    renderSummary();renderStatus();
  }else if(d.del){
    var idx=-1;state.items.forEach(function(x,j){if(x.id===d.del)idx=j;});
    if(idx<0)return;
    lastDeleted={item:state.items[idx],index:idx};
    state.items.splice(idx,1);
    renderTabs();renderTable();renderSummary();renderStatus();
    toast("Removed “"+(lastDeleted.item.name||"untitled row")+"”.","Undo",function(){
      state.items.splice(lastDeleted.index,0,lastDeleted.item);lastDeleted=null;
      renderTabs();renderTable();renderSummary();renderStatus();
    });
  }
});
$("btn-add").addEventListener("click",function(){
  var it={id:uid(),factor:activeTab,name:"",sdgs:[],scores:{}};
  state.items.push(it);renderTabs();renderTable();renderStatus();
  var inp=$("n-"+it.id); if(inp) inp.focus();
});
/* ---- export ---- */
function tableRows(){
  var rows=[["SWARM SDG impact scores"],[],["SDG","Goal","Layer"].concat(FACTORS.map(function(f){return f.name;})).concat(["Final score (1-10)","Factors with data","Why this score"])];
  SDGS.forEach(function(s){
    var r=sdgScore(s.n);
    rows.push([s.n,s.name,s.layer].concat(FACTORS.map(function(f){var p=r.parts[f.key];return p.score==null?"":+p.score.toFixed(2);})).concat([r.score==null?"":+r.score.toFixed(2),r.used+" of "+r.active,state.sdgNotes[s.n]||""]));
  });
  rows.push([],["Factor weights (%)","Goal"].concat(FACTORS.map(function(f){return f.name;})));
  rows.push(["","Default"].concat(FACTORS.map(function(f){return state.factorWeights[f.key];})));
  SDGS.forEach(function(s){
    var W=weightsFor(s.n);
    rows.push([s.n,s.name+(state.sdgWeights[s.n]?" (custom)":" (default)")].concat(FACTORS.map(function(f){return W[f.key];})));
  });
  FACTORS.forEach(function(f){
    rows.push([],[f.name,"Goals"].concat(f.metrics.map(function(m){return m.n+" ("+state.metricWeights[f.key][m.k]+"%)";})).concat(["Item score","Why these scores"]));
    state.items.filter(function(it){return it.factor===f.key;}).forEach(function(it){
      var s=itemScore(it);
      rows.push([it.name,it.sdgs.map(function(n){return "SDG "+n;}).join(", ")].concat(f.metrics.map(function(m){return validScore(it.scores[m.k])?it.scores[m.k]:"";})).concat([s==null?"incomplete":+s.toFixed(2),it.why]));
    });
  });
  return rows;
}
function safeCell(value){var text=String(value);return /^[=+@\-]/.test(text)?"'"+text:text;}
function toCSV(rows){return rows.map(function(r){return r.map(function(c){c=safeCell(c);return /[",\r\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c;}).join(",");}).join("\r\n");}
function toTSV(rows){return rows.map(function(r){return r.map(function(c){return safeCell(c).replace(/[\t\r\n]/g," ");}).join("\t");}).join("\n");}
$("btn-copy").addEventListener("click",function(){
  var text=toTSV(tableRows());
  try{
    navigator.clipboard.writeText(text).then(function(){toast("Copied. Click cell A1 in a Google Sheet and paste.");},
      function(){toast("Your browser blocked copying here. Use Download CSV, then File › Import in Google Sheets.");});
  }catch(err){toast("Your browser blocked copying here. Use Download CSV, then File › Import in Google Sheets.");}
});
function saveFile(name,text,type){
  var url=URL.createObjectURL(new Blob([text],{type:type}));
  var a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(url);},1000);
}
$("btn-csv").addEventListener("click",function(){
  saveFile("swarm-sdg-scores.csv","\uFEFF"+toCSV(tableRows()),"text/csv;charset=utf-8");
  toast("CSV downloaded.");
});
$("btn-export").addEventListener("click",function(){
  saveFile("swarm-scorer-data.json",JSON.stringify(state,null,2),"application/json");
  toast("Scorer data downloaded.");
});
$("file-import").addEventListener("change",function(e){
  var file=e.target.files[0]; if(!file) return;
  var reader=new FileReader();
  reader.onload=function(){
    try{
      var next=JSON.parse(reader.result);
      if(!next||!Array.isArray(next.items)) throw new Error("no items");
      var prev=JSON.stringify(state);
      normalize(next);state=next;renderAll();
      toast("Loaded "+file.name+".","Undo",function(){state=JSON.parse(prev);renderAll();});
    }catch(x){toast("That file isn\u2019t scorer data. Choose a file made with Export data.");}
    e.target.value="";
  };
  reader.readAsText(file);
});
$("btn-reset").addEventListener("click",function(){
  var prev=JSON.stringify(state);
  state=JSON.parse(STATE_TEXT);normalize(state);renderAll();
  toast("Original team scores restored.","Undo",function(){state=JSON.parse(prev);renderAll();});
});

renderAll();

if(!storageOK) note("This browser isn\u2019t keeping your changes. Use Export data to save a copy.");


}
