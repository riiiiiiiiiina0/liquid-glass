import { applyLiquidGlass } from '../libs/liquid-glass.js';

const element = /** @type {HTMLElement} */ (document.querySelector('.glass'));
applyLiquidGlass(element, {
  radius: 10,
  depth: 8,
  blur: 3,
  strength: 80,
  chromaticAberration: 1,
  baseColor: 'rgba(255, 255, 255, 0.4)',
  autoResize: true,
});

// Make element follow mouse position
document.addEventListener('mousemove', (e) => {
  const x = e.clientX - element.offsetWidth / 2;
  const y = e.clientY - element.offsetHeight / 2;

  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
});
