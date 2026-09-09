import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

export function createDebugMode({ camera, domElement, scene, objects }) {
  if (new URLSearchParams(window.location.search).get('debug') !== '1') return null
  const orbit = new OrbitControls(camera, domElement); orbit.enableDamping = true; orbit.target.set(0, 3, 0)
  const transform = new TransformControls(camera, domElement); transform.addEventListener('dragging-changed', event => { orbit.enabled = !event.value }); scene.add(transform.getHelper())
  const gui = new GUI({ title: 'Sairam calibration' }); const selection = { object: 'camera' }; const entries = { camera, ...objects }; const folder = gui.addFolder('selected transform')
  const update = () => { const object = entries[selection.object]; transform.attach(object); folder.controllers.forEach(controller => controller.destroy()); ['x', 'y', 'z'].forEach(axis => folder.add(object.position, axis, -20, 20, 0.01).name(`position ${axis}`)); ['x', 'y', 'z'].forEach(axis => folder.add(object.rotation, axis, -Math.PI, Math.PI, 0.01).name(`rotation ${axis}`)); ['x', 'y', 'z'].forEach(axis => folder.add(object.scale, axis, 0.01, 5, 0.01).name(`scale ${axis}`)) }
  gui.add(selection, 'object', Object.keys(entries)).onChange(update); gui.add({ mode: 'translate' }, 'mode', ['translate', 'rotate', 'scale']).onChange(mode => transform.setMode(mode)); update()
  window.addEventListener('keydown', event => { if (event.key === 'w') transform.setMode('translate'); if (event.key === 'e') transform.setMode('rotate'); if (event.key === 'r') transform.setMode('scale') })
  return { orbit, transform, gui }
}
