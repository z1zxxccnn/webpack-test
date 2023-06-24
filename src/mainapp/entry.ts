import './mainstyle.scss'
import { create_test_panel } from './testpanel/testmain'
import {
  Engine, type WebGPUEngine, Scene, Vector3,
  FreeCamera, HemisphericLight, MeshBuilder
} from '@babylonjs/core'

let engine: null | Engine | WebGPUEngine = null
let scene: null | Scene = null

export function main_entry (): void {
  const canvas = document.createElement('canvas')
  canvas.id = 'main_canvas'

  window.addEventListener('resize', updateCanvasSize)
  updateCanvasSize()

  document.body.appendChild(canvas)

  create_test_panel()

  function updateCanvasSize (): void {
    canvas.style.width = String(window.innerWidth) + 'px'
    canvas.style.height = String(window.innerHeight) + 'px'
    canvas.width = window.innerWidth * devicePixelRatio
    canvas.height = window.innerHeight * devicePixelRatio
    // redraw the canvas here
    if (engine != null) { engine.resize() }
  }

  engine = new Engine(canvas, true, undefined, true)
  const createScene = function (): Scene | null {
    if (engine === null) {
      return null
    }
    // Creates a basic Babylon Scene object
    const scene = new Scene(engine)
    // Creates and positions a free camera
    const camera = new FreeCamera('camera1',
      new Vector3(0, 5, -10), scene)
    // Targets the camera to scene origin
    camera.setTarget(Vector3.Zero())
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)
    // Creates a light, aiming 0,1,0 - to the sky
    const light = new HemisphericLight('light',
      new Vector3(0, 1, 0), scene)
    // Dim the light a small amount - 0 to 1
    light.intensity = 0.7
    // Built-in 'sphere' shape.
    const sphere = MeshBuilder.CreateSphere('sphere',
      { diameter: 2, segments: 32 }, scene)
    // Move the sphere upward 1/2 its height
    sphere.position.y = 1
    // Built-in 'ground' shape.
    MeshBuilder.CreateGround('ground',
      { width: 6, height: 6 }, scene)
    return scene
  }
  scene = createScene() // Call the createScene function
  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    if (scene !== null) {
      scene.render()
    }
  })
}
