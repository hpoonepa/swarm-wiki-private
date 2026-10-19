import {buildSync} from 'esbuild';
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const hash=file=>createHash('sha256').update(readFileSync(root+'static/home/'+file)).digest('hex').slice(0,12);
for(const [entry,out] of [['components/protein/scene.ts','capsid-engine'],['components/home/rna-sequence.ts','rna-player'],['components/protein/binder-illustration.js','binder-illustration']]) {
  buildSync({absWorkingDir:root,entryPoints:['src/home/'+entry],bundle:true,format:'esm',minify:true,define:{'import.meta.env.DEV':'false'},outfile:'static/home/vendor/'+out+'.js'});
}
writeFileSync(root+'static/home/binder-scene.js', "// Illustrated molecule renderer; see source for Denmark-GA attribution.\nexport { mountBinderScene } from './vendor/binder-illustration.js?v="+hash('vendor/binder-illustration.js')+"';\n");
let journey=readFileSync(root+'static/home/journey.js','utf8');
journey=journey.replace(/\.\/rnai-transition\.js(?:\?v=[^']*)?(?=')/g,'./rnai-transition.js?v='+hash('rnai-transition.js'));
writeFileSync(root+'static/home/journey.js',journey);
let controller=readFileSync(root+'static/home/mechanisms.js','utf8');
for(const file of ['vendor/capsid-engine.js','vendor/rna-player.js','journey.js','binder-scene.js']) {
  const pattern=new RegExp("\\./"+file.replaceAll('.','\\.')+"(?:\\?v=[^']*)?(?=')",'g');
  controller=controller.replace(pattern,'./'+file+'?v='+hash(file));
}
writeFileSync(root+'static/home/mechanisms.js',controller);
let search=readFileSync(root+'static/home/search.js','utf8');
search=search.replace(/\.\/nav-data\.js(?:\?v=[^']*)?(?=')/g,'./nav-data.js?v='+hash('nav-data.js'));
writeFileSync(root+'static/home/search.js',search);
let navbar=readFileSync(root+'static/home/navbar.js','utf8');
for(const file of ['nav-data.js','navmap.js','search.js']) {
  const pattern=new RegExp("\\./"+file.replaceAll('.','\\.')+"(?:\\?v=[^']*)?(?=')",'g');
  navbar=navbar.replace(pattern,'./'+file+'?v='+hash(file));
}
writeFileSync(root+'static/home/navbar.js',navbar);
for(const file of ['menu.js','section-nav.js']) {
  const text=readFileSync(root+'static/home/'+file,'utf8').replace(/\.\/journey-stops\.js(?:\?v=[^']*)?(?=')/g,'./journey-stops.js?v='+hash('journey-stops.js'));
  writeFileSync(root+'static/home/'+file,text);
}
let html=readFileSync(root+'static/home/index.html','utf8');
// Keep the homepage and article footers identical while retaining the homepage's references.
const oldFooter=html.match(/<footer class="(?:wiki-footer|swarm-footer)"[\s\S]*?<\/footer>/)?.[0];
const references=oldFooter?.match(/<details class="home-references">[\s\S]*?<\/details>/)?.[0];
if(!oldFooter || !references) throw new Error('Homepage footer references are missing.');
const footer=readFileSync(root+'static/home/site-footer.html','utf8').trim();
html=html.replace(oldFooter,footer.replace('<!-- HOME_REFERENCES -->',references));
for(const file of ['story.css','binder-illustration.css','project-overview.css','project-overview.js','scroll-pace.js','food-layout.css','site-footer.css','rnai-layout.css','ending.css','ending.js','globe.js','earth-scroll.js','colony-loss.js','dwv-virus.js','food.js','menu.js','navbar.js','mechanisms.js','flight.js','cursor.js','section-nav.css','section-nav.js','statement.js']) {
  html=html.replace(new RegExp(file.replaceAll('.','\\.')+'\\?v=[^"\\s]+','g'),file+'?v='+hash(file));
}
writeFileSync(root+'static/home/index.html',html);
for(const layout of ['src/layouts/InformationLayout.astro']) {
  const text=readFileSync(root+layout,'utf8').replace(/cursor\.js\?v=[^"\s]+/g,'cursor.js?v='+hash('cursor.js'));
  writeFileSync(root+layout,text);
}
console.log('Built homepage animation bundles and updated content hashes.');
