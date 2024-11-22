import Simulation from "./Simulation.ts";
import "./style.css";

let width = window.innerWidth * 0.7;
let height = window.innerHeight * 0.9;
width = Math.min(width, height);
height = Math.min(width, height);
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="main">
    <div class="side-left sidebar">
      <button id="start-btn">Start</button>
      <button id="clear-btn">Clear</button>
      <label for="mode">Mode: </label>
      <input type="number" id="mode" value=1>
      <label for="frames">Mode: </label>
      <input type="number" id="frames" value=20>
      <div id="fps">FPS: 0</div>
    </div>
    <canvas id="sim-canvas" width="${width}" height="${height}"></canvas>
  </div>
`;

const simulation = new Simulation();
simulation.start();
