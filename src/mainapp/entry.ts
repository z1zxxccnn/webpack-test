import './mainstyle.scss'
import { create_test_panel } from './testpanel/testmain';

export function main_entry() {
  const canvas = document.createElement('canvas');
  canvas.id = 'main_canvas'

  window.addEventListener("resize", updateCanvasSize);
  updateCanvasSize();

  document.body.appendChild(canvas);
  
  create_test_panel();

  function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // redraw the canvas here
  }
}