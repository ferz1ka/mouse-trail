import "./style.css";
import { ParticleSystem } from "./core/ParticleSystem";
import { ControlPanel } from "./ui/ControlPanel";

document.addEventListener("DOMContentLoaded", () => {
  const particleSystem = new ParticleSystem("trail-canvas");
  new ControlPanel("control-panel");

  particleSystem.start();

  const menuToggle = document.getElementById("menu-toggle");
  const panelOverlay = document.getElementById("panel-overlay");
  const app = document.getElementById("app");

  menuToggle?.addEventListener("click", () => {
    app?.classList.toggle("menu-open");
  });

  panelOverlay?.addEventListener("click", () => {
    app?.classList.remove("menu-open");
  });
});
