// Web Audio API Synthesizer for Cafe Quiz Sound Effects

class SoundEffects {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft ceramic tap sound for button clicks
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Liquid dip / plunge sound
  public playDip() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Frequency sweep for water plunge
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.25);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);

    // Add subtle filtered noise burst for splash
    this.playNoiseSplash(t, 0.2);
  }

  private playNoiseSplash(startTime: number, duration: number) {
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, startTime);
    filter.Q.setValueAtTime(2, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  // Soaking tea bubble sounds during 3s dunking
  public playBubbling() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Create 3 tiny bubble pops over 1 second
    for (let i = 0; i < 4; i++) {
      const bubbleTime = now + (i * 0.25) + (Math.random() * 0.1);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startFreq = 400 + Math.random() * 300;
      const endFreq = startFreq + 150 + Math.random() * 100;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, bubbleTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, bubbleTime + 0.06);

      gain.gain.setValueAtTime(0.05, bubbleTime);
      gain.gain.exponentialRampToValueAtTime(0.001, bubbleTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(bubbleTime);
      osc.stop(bubbleTime + 0.06);
    }
  }

  // Success sparkle chime when biscuit emerges intact (correct)
  public playSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6 pentatonic arpeggio

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const noteTime = t + idx * 0.08;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.18, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.4);
    });
  }

  // Crunch / crumble sound when biscuit breaks (incorrect)
  public playCrumble() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const duration = 0.4;

    // White noise for crunch texture
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Crackly noise
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.3 ? 1 : 0);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.linearRampToValueAtTime(300, t + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + duration);

    // Low pitch thud for break
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();

    thud.type = 'triangle';
    thud.frequency.setValueAtTime(160, t);
    thud.frequency.exponentialRampToValueAtTime(40, t + 0.25);

    thudGain.gain.setValueAtTime(0.2, t);
    thudGain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    thud.connect(thudGain);
    thudGain.connect(this.ctx.destination);

    thud.start(t);
    thud.stop(t + 0.25);
  }
}

export const soundFx = new SoundEffects();
