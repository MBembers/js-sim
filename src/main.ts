import Simulation from "./Simulation.ts";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="main">
    <canvas id="sim-canvas" width="700" height="700"></canvas>
    <div class="side-right sidebar">
      <button id="start-btn">Start</button>
      <button id="clear-btn">Clear</button>
      <div id="fps">FPS: 0</div>
    </div>
  </div>
`;

const simulation = new Simulation();
simulation.start();
