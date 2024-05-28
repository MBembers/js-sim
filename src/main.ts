import Simulation from "./Simulation.ts";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="main">
    <canvas id="sim-canvas" width="800" height="800"></canvas>
    <br>
    <button id="start-btn">Start</button>
    <button id="clear-btn">Clear</button>
    <div id="fps">FPS: 0</div>
  </div>
`;

const simulation = new Simulation();
simulation.start();
