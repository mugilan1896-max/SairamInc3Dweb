import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { exportGLB } from './debug/exportGLB.js'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createScrollTimeline } from './animation/ScrollTimeline'
import { createDebugMode } from './debug/DebugMode'
import { createCameraWaypoints } from './config/cameraWaypoints'
import { sceneConfig } from './config/sceneConfig'

const app = document.querySelector('#app')
app.innerHTML = `<div class="loading-screen" aria-live="polite"><span class="loader-kicker">SAIRAM INCUBATION</span><strong>Preparing the entrance</strong><div class="loader-line"><i></i></div><small>Loading 100%</small></div><main id="experience-scroll"><section id="stage" aria-label="Interactive Sairam Incubation walkthrough"><canvas id="webgl"></canvas><div class="scene-label"><span>SAIRAM TECHNO INCUBATOR FOUNDATION</span><b>01 / ENTRANCE</b></div><div class="scroll-cue"><span>Scroll to enter</span><i></i></div></section></main>`
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
window.addEventListener('pageshow', () => window.setTimeout(() => window.scrollTo(0, 0), 0), { once: true })
const canvas = document.querySelector('#webgl')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12; renderer.setPixelRatio(Math.min(window.devicePixelRatio, reducedMotion ? 1 : 1.6)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x141719)
window.exportSairamGLB = () => { exportGLB(scene, 'sairam-current-scene.glb') }
const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 80); camera.position.set(sceneConfig.camera.exteriorWide.x, sceneConfig.camera.exteriorWide.y, sceneConfig.camera.exteriorWide.z)
scene.add(camera)
const controls = { target: new THREE.Vector3(0, 3, 0) }
const exteriorLight = new THREE.DirectionalLight(sceneConfig.lighting.exterior.color, sceneConfig.lighting.exterior.intensity); exteriorLight.position.set(-8, 12, 10); exteriorLight.castShadow = true; exteriorLight.shadow.mapSize.set(1024, 1024); scene.add(exteriorLight)
const interiorLight = new THREE.PointLight(sceneConfig.lighting.interior.color, 0.35, 18, 1.5); interiorLight.position.set(0, 5.5, -8); scene.add(interiorLight); scene.add(new THREE.HemisphereLight(0xaebaca, 0x27201d, 1.1))
let timeline
let debug
const lenis = new Lenis({ duration: reducedMotion ? 0.2 : 1.05, smoothWheel: true, syncTouch: true }); lenis.on('scroll', ({ scroll }) => { timeline?.syncProgress(scroll); ScrollTrigger.update() })

function createInteriorDoorHinge(model, door) {
	const hinge = new THREE.Group()
	hinge.name = 'InteriorDoorHinge'
	const doorBounds = new THREE.Box3().setFromObject(door)
	const doorPosition = door.getWorldPosition(new THREE.Vector3())
	hinge.position.set(doorPosition.x, 0, doorBounds.min.z + 0.35)
	model.parent.add(hinge)
	;['Downgo_Door', 'Downgo_Door_glass', 'Downgo_door_handle', 'Downgo_door_rack1', 'Downgo_door_rack2', 'Downgo_door_rack3'].forEach(name => {
		const part = model.getObjectByName(name)
		if (part) hinge.attach(part)
	})
	return hinge
}

function createWaypointMarkers(model, waypoints) {
	const markers = new THREE.Group()
	markers.name = 'camera waypoint debug markers'
	const material = new THREE.MeshBasicMaterial({ color: 0xff9f43, depthTest: false })
	Object.entries(waypoints).forEach(([name, waypoint]) => {
		const marker = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), material)
		marker.name = name
		marker.position.set(waypoint.position.x, waypoint.position.y, waypoint.position.z)
		markers.add(marker)
	})
	markers.visible = new URLSearchParams(window.location.search).get('debug') === '1'
	model.parent.add(markers)
	return markers
}

let modelReady = false
new GLTFLoader().load('/models/sairam-incubation-final.glb', gltf => {
	modelReady = true
	const model = gltf.scene
	model.name = 'sairam-incubation-final.glb'
	model.updateMatrixWorld(true)
	scene.add(model)
	model.traverse(object => {
		if (!object.isMesh) return
		object.castShadow = false
		object.receiveShadow = true
		if (object.material) object.material.needsUpdate = true
	})
	const doors = { left: model.getObjectByName('door_left_pivot'), right: model.getObjectByName('door_right_pivot') }
	const waypoints = createCameraWaypoints(model)
	const interiorDoor = createInteriorDoorHinge(model, model.getObjectByName('Downgo_Door'))
	createWaypointMarkers(model, waypoints)
	timeline = createScrollTimeline({ camera, controls, doors, interiorDoor, waypoints, lights: { exterior: exteriorLight, interior: interiorLight }, reducedMotion })
	debug = createDebugMode({ camera, target: controls.target, domElement: canvas, scene, objects: { model, entranceFacade: model.getObjectByName('entrance_façade'), reception: model.getObjectByName('reception_interior'), postReception: model.getObjectByName('postReceptionGroup'), display: model.getObjectByName('Downgo_44_inch_display_placeholder'), interiorDoor } })
	window.__sairamWalkthrough = { model, camera, controls, timeline, interiorDoor, doors, waypoints }
	ScrollTrigger.refresh()
	timeline.syncProgress(0)
	document.querySelector('.loading-screen small').textContent = 'Loaded final building'
}, error => {
	window.setTimeout(() => {
		if (modelReady) return
		console.error('Authoritative GLB failed to load:', error)
		document.querySelector('.loading-screen strong').textContent = 'Building failed to load'
		document.querySelector('.loading-screen small').textContent = 'Check public/models/sairam-incubation-final.glb'
	}, 1200)
})

function resize() { const { clientWidth, clientHeight } = canvas.parentElement; camera.aspect = clientWidth / clientHeight; camera.fov = clientWidth < 700 ? 48 : 42; camera.updateProjectionMatrix(); renderer.setSize(clientWidth, clientHeight, false) }
window.addEventListener('resize', resize); resize()
function frame(time) { lenis.raf(time); if (debug?.orbit) debug.orbit.update(); debug?.update?.(timeline); renderer.render(scene, camera); requestAnimationFrame(frame) }
requestAnimationFrame(frame); window.setTimeout(() => document.querySelector('.loading-screen')?.classList.add('is-ready'), reducedMotion ? 240 : 1200)