export const playBeep = ({ duration = 100 }) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'square'; // "sine", "square", "sawtooth", "triangle"
  oscillator.frequency.setValueAtTime(900, ctx.currentTime); // 1000 Hz beep
  gainNode.gain.setValueAtTime(0.1, ctx.currentTime); // Lower the volume

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, duration); // Play for 100ms
};
