/** Read the independently encoded frames in the team's VAPOR-X WebP.
 * Keep compressed frames in memory and only a few decoded images, so scrubbing
 * does not allocate all 144 full-resolution frames at once.
 */
export class WebPFrames {
  readonly frames: { x: number; y: number; blob: Blob }[] = [];
  readonly width: number;
  readonly height: number;
  private cache = new Map<number, ImageBitmap>();
  private closed = false;

  constructor(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);
    const tag = (at: number) => String.fromCharCode(...bytes.subarray(at, at + 4));
    const u24 = (at: number) => bytes[at] + bytes[at + 1] * 256 + bytes[at + 2] * 65536;
    if (tag(0) !== 'RIFF' || tag(8) !== 'WEBP') throw new Error('Invalid WebP file');
    let width = 0, height = 0;
    for (let at = 12; at + 8 <= bytes.length;) {
      const size = view.getUint32(at + 4, true);
      const start = at + 8, end = start + size;
      if (end > bytes.length) throw new Error('Incomplete WebP chunk');
      if (tag(at) === 'VP8X') {
        width = u24(start + 4) + 1;
        height = u24(start + 7) + 1;
      }
      if (tag(at) === 'ANMF') {
        if (size < 16 || !(bytes[start + 15] & 2)) throw new Error('Expected independent VAPOR-X frames');
        const frameWidth = u24(start + 6) + 1, frameHeight = u24(start + 9) + 1;
        // Wrap the original ALPH/VP8 chunks as a still WebP. No re-encoding.
        const header = new Uint8Array(30);
        const hv = new DataView(header.buffer);
        header.set(new TextEncoder().encode('RIFF'), 0);
        hv.setUint32(4, 22 + size - 16, true);
        header.set(new TextEncoder().encode('WEBPVP8X'), 8);
        hv.setUint32(16, 10, true);
        header[20] = 16; // Alpha channel, without the animation flag.
        for (let k = 0; k < 3; k++) {
          header[24 + k] = ((frameWidth - 1) >>> (k * 8)) & 255;
          header[27 + k] = ((frameHeight - 1) >>> (k * 8)) & 255;
        }
        this.frames.push({ x: u24(start) * 2, y: u24(start + 3) * 2,
          blob: new Blob([header, bytes.slice(start + 16, end)], { type: 'image/webp' }) });
      }
      at = end + (size & 1);
    }
    if (!width || !height || !this.frames.length) throw new Error('WebP animation has no frames');
    this.width = width;
    this.height = height;
  }

  async draw(index: number, canvas: HTMLCanvasElement): Promise<void> {
    if (this.closed) return;
    const frame = this.frames[index];
    let bitmap = this.cache.get(index);
    if (!bitmap) {
      bitmap = await createImageBitmap(frame.blob);
      if (this.closed) { bitmap.close(); return; }
    }
    this.cache.delete(index);
    this.cache.set(index, bitmap);
    while (this.cache.size > 8) {
      const oldest = this.cache.keys().next().value!;
      this.cache.get(oldest)!.close();
      this.cache.delete(oldest);
    }
    if (canvas.width !== this.width || canvas.height !== this.height) {
      canvas.width = this.width;
      canvas.height = this.height;
    }
    const context = canvas.getContext('2d')!;
    context.clearRect(0, 0, this.width, this.height);
    context.drawImage(bitmap, frame.x, frame.y);
  }

  close() {
    this.closed = true;
    for (const bitmap of this.cache.values()) bitmap.close();
    this.cache.clear();
  }
}
