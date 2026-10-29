/**
 * Spray hiss for the wash game: filtered white noise, no audio files. The
 * AudioContext is created on the first "Sound" toggle (a user gesture), so
 * nothing plays or loads until someone asks for it.
 */
type Win = Window & { webkitAudioContext?: typeof AudioContext };

export class SpraySound {
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private on = false;

  enable() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as Win).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 900;
      filter.Q.value = 0.6;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
      this.ctx = ctx;
      this.gain = gain;
      this.filter = filter;
    }
    void this.ctx.resume();
    this.on = true;
  }

  disable() {
    this.set(false, "surface");
    this.on = false;
    void this.ctx?.suspend();
  }

  /** Water on/off. The wand is louder and brighter than the surface cleaner's rumble. */
  set(active: boolean, tool: string) {
    if (!this.ctx || !this.gain || !this.filter) return;
    const t = this.ctx.currentTime;
    const wand = tool !== "surface";
    this.filter.frequency.setTargetAtTime(wand ? 3200 : 750, t, 0.05);
    this.filter.Q.setTargetAtTime(wand ? 0.9 : 0.5, t, 0.05);
    this.gain.gain.setTargetAtTime(active && this.on ? (wand ? 0.16 : 0.11) : 0, t, active ? 0.03 : 0.08);
  }

  destroy() {
    void this.ctx?.close();
    this.ctx = null;
  }
}
