import { WebPFrames } from './webp-frames';
type Point = [number, number];
const keyframes = [0,12,24,36,48,60,72,84,96,108,120,132,143];
const lastFrame = 143;
const anchors: Record<string, Point[]> = {
  chamber: [[67,18],[71,19],[69,20],[51,18],[69,17],[75,21],[70,25],[58,27],[44,24],[42,17],[45,19],[57,19],[67,18]],
  cup: [[51,27],[54,28],[54,32],[50,38],[48,23],[44,17],[42,14],[40,13],[42,13],[42,39],[44,31],[47,27],[51,27]],
  platform: [[42,33],[45,34],[46,37],[50,46],[30,38],[17,29],[17,24],[25,18],[37,18],[45,45],[45,35],[42,32],[42,33]],
  controls: [[37,76],[31,70],[29,67],[36,60],[23,52],[30,45],[72,57],[78,62],[75,65],[56,65],[56,72],[47,76],[37,76]],
  enclosure: [[74,68],[74,74],[64,76],[50,79],[47,81],[45,82],[44,82],[45,80],[45,79],[45,81],[35,73],[34,81],[74,68]],
  board: [[47,70],[47,70],[47,70],[48,64],[34,64],[22,59],[20,54],[26,49],[31,49],[45,59],[45,65],[47,70],[47,70]],
  unit: [[59,78],[59,78],[59,78],[50,70],[61,76],[44,79],[29,77],[17,71],[13,64],[39,65],[42,71],[59,78],[59,78]],
};
export function initVaporExplorer(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-vapor-canvas]')!;
  const status = root.querySelector<HTMLElement>('[data-vapor-status]')!;
  const phase = root.querySelector<HTMLElement>('[data-vapor-phase]')!;
  const workspace = root.querySelector<HTMLElement>('.vapor-workspace')!;
  const hotspots = [...root.querySelectorAll<HTMLButtonElement>('[data-part]')];
  const details = [...root.querySelectorAll<HTMLElement>('[data-vapor-detail]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let ready = false, wanted = 0, shown = 0, raf = 0, manual = false;
  let smoothFrame = wanted, lastTick = 0;
  let openPart: string | null = null;
  let frames: WebPFrames | null = null, rendering = false, disposed = false;
  const abort = new AbortController();
  const clamp = (n:number, min=0, max=lastFrame) => Math.max(min, Math.min(max,n));

  function closeDetail(restoreFocus = false) {
    const previous = openPart;
    openPart = null;
    details.forEach(detail => { detail.hidden = true; });
    hotspots.forEach(button => button.setAttribute('aria-expanded','false'));
    if (restoreFocus) hotspots.find(button => button.dataset.part === previous)?.focus();
  }
  function placeDetail() {
    if (!openPart) return;
    const detail = details.find(item => item.dataset.vaporDetail === openPart)!;
    const marker = hotspots.find(item => item.dataset.part === openPart)!;
    const frame = workspace.getBoundingClientRect();
    const point = marker.getBoundingClientRect();
    detail.style.top = `${clamp(point.top - frame.top - 34, 0, Math.max(0, frame.height-detail.offsetHeight-16))}px`;
  }
  function placeMarkers(frame: number) {
    shown = frame;
    root.dataset.frame = String(frame);
    const step = Math.min(keyframes.length-2,Math.floor(frame/12));
    const mix = (frame-keyframes[step])/(keyframes[step+1]-keyframes[step]);
    hotspots.forEach(button => {
      const id = button.dataset.part!;
      const points = anchors[id];
      const a = points[step], b = points[step+1];
      button.style.setProperty('--x',`${a[0]+(b[0]-a[0])*mix}%`);
      button.style.setProperty('--y',`${a[1]+(b[1]-a[1])*mix}%`);
      button.hidden = ((id === 'board' || id === 'unit') && (frame < 35 || frame > 115))
        || (id === 'cup' && ((frame > 29 && frame < 43) || (frame > 101 && frame < 116)))
        || (id === 'board' && frame > 91 && frame < 104);
    });
    placeDetail();
  }
  async function renderFrame() {
    if (!ready || !frames || rendering || disposed) return;
    if (shown === wanted && root.dataset.ready === 'true') return;
    rendering = true;
    try {
      do {
        const frame = wanted;
        await frames.draw(frame, canvas);
        if (disposed) return;
        placeMarkers(frame);
        root.dataset.ready = 'true';
      } while (shown !== wanted);
    } catch (error) {
      ready = false;
      root.dataset.ready = 'false';
      placeMarkers(0);
      console.warn('VAPOR-X frame could not be displayed', error);
    } finally { rendering = false; }
  }
  function seek(frame:number) {
    wanted = Math.round(clamp(frame));
    root.style.setProperty('--journey',String(wanted/lastFrame));
    phase.textContent=wanted < 18 || wanted > 130 ? 'VAPOR-X' : wanted < 44 ? 'Opening the assembly' : wanted < 98 ? 'Exploded view' : 'Coming together';
    renderFrame();
  }
  function tick(time:number) {
    raf = 0;
    const dt=Math.min(50,lastTick ? time-lastTick : 16);
    lastTick=time;
    if (!manual && !reduced.matches && ready && !document.hidden) {
      const rect=root.getBoundingClientRect();
      if(rect.bottom < 0 || rect.top > innerHeight) return;
      const stageHeight=root.querySelector<HTMLElement>('.vapor-stage')!.offsetHeight;
      const p=clamp((-rect.top/Math.max(1,root.offsetHeight-stageHeight)-.06)/.86,0,1);
      const target=p*lastFrame;
      smoothFrame+=(target-smoothFrame)*(1-Math.exp(-dt/75));
      if(Math.abs(target-smoothFrame)<.08) smoothFrame=target;
      seek(smoothFrame);
      if(smoothFrame!==target) raf=requestAnimationFrame(tick);
    }
  }
  function kick() { if(!raf) raf=requestAnimationFrame(tick); }
  async function load() {
    if (ready || reduced.matches || disposed) return;
    try {
      const response = await fetch(canvas.dataset.src!, { signal: abort.signal });
      if (!response.ok) throw new Error(`WebP HTTP ${response.status}`);
      frames = new WebPFrames(await response.arrayBuffer());
      if (frames.frames.length !== lastFrame + 1) throw new Error('Unexpected VAPOR-X frame count');
      if (disposed) { frames.close(); return; }
      ready = true;
      seek(wanted); kick();
    } catch (error) {
      if (!disposed) console.warn('VAPOR-X animation could not be loaded', error);
      status.textContent = 'Select a part to inspect the device.';
    }
  }
  void load();

  hotspots.forEach(button => button.addEventListener('click',() => {
    const id=button.dataset.part!;
    if(openPart===id) { closeDetail(); return; }
    manual=true; smoothFrame=wanted=shown;
    closeDetail();
    openPart=id;
    const detail=details.find(item => item.dataset.vaporDetail===id)!;
    detail.hidden=false;
    button.setAttribute('aria-expanded','true');
    placeDetail();
  }));
  root.querySelectorAll<HTMLButtonElement>('[data-vapor-close]').forEach(button => button.addEventListener('click',() => closeDetail(true)));
  root.addEventListener('keydown',event => { if(event.key==='Escape') closeDetail(true); });
  root.addEventListener('click',event => {
    if(!(event.target as Element).closest('[data-part],.vapor-detail')) closeDetail();
  });
  addEventListener('scroll',() => { manual=false; closeDetail(); kick(); },{passive:true});
  addEventListener('resize',() => { placeDetail(); kick(); });
  document.addEventListener('visibilitychange',() => { if(!document.hidden) kick(); });
  reduced.addEventListener('change',() => { manual=reduced.matches; smoothFrame=0; seek(0); if(!reduced.matches) { if (!ready) void load(); kick(); } });
  addEventListener('pagehide',(event) => { if(raf) cancelAnimationFrame(raf); if (!event.persisted) { disposed=true; abort.abort(); frames?.close(); } });
  placeMarkers(wanted);
}
