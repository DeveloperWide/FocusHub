export const playBeep = ({ frequency = 880, durationMs = 140, volume = 0.12 } = {}) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = frequency;

    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    const stopAt = ctx.currentTime + durationMs / 1000;
    osc.stop(stopAt);

    osc.onended = () => {
      ctx.close().catch(() => {});
    };
  } catch {
    // ignore
  }
};

