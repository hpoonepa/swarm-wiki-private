import {buildSync} from 'esbuild';
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const hash=file=>createHash('sha256').update(readFileSync(root+'static/home/'+file)).digest('hex').slice(0,12);
for(const [entry,out] of [['components/protein/scene.ts','capsid-engine'],['components/home/rna-sequence.ts','rna-player']]) {
  buildSync({absWorkingDir:root,entryPoints:['src/home/'+entry],bundle:true,format:'esm',minify:true,define:{'import.meta.env.DEV':'false'},outfile:'static/home/vendor/'+out+'.js'});
}
let controller=readFileSync(root+'static/home/mechanisms.js','utf8');
for(const file of ['vendor/capsid-engine.js','vendor/rna-player.js','journey.js']) {
  const pattern=new RegExp("\\./"+file.replaceAll('.','\\.')+"(?:\\?v=[^']*)?(?=')",'g');
  controller=controller.replace(pattern,'./'+file+'?v='+hash(file));
}
writeFileSync(root+'static/home/mechanisms.js',controller);
let html=readFileSync(root+'static/home/index.html','utf8');
for(const file of ['story.css','globe.js','earth-scroll.js','colony-loss.js','dwv-virus.js','menu.js','navbar.js','mechanisms.js','flight.js','cursor.js']) {
  html=html.replace(new RegExp(file.replaceAll('.','\\.')+'\\?v=[^"\\s]+','g'),file+'?v='+hash(file));
}
writeFileSync(root+'static/home/index.html',html);
console.log('Built both animation bundles and updated content hashes.');
