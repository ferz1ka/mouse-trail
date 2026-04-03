import './style.css';
import { ParticleSystem } from './core/ParticleSystem';
import { ControlPanel } from './ui/ControlPanel';

document.addEventListener('DOMContentLoaded', () => {
  const particleSystem = new ParticleSystem('trail-canvas');
  new ControlPanel('control-panel');
  
  particleSystem.start();
});
