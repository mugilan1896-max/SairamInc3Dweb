import './style.css'
import * as THREE from 'three'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EntranceScene } from './scenes/EntranceScene'
import { ReceptionScene } from './scenes/ReceptionScene'
import { createScrollTimeline } from './animation/ScrollTimeline'
import { createDebugMode } from './debug/DebugMode'
import { sceneConfig } from './config/sceneConfig'

const app = document.querySelector('#app')
app.innerHTML = `<div class="loading-screen" aria-live="polite"><span class="loader-kicker">SAIRAM INCUBATION</span><strong>Preparing the entrance</strong><div class="loader-line"><i></i></div><small>Loading 100%</small></div><main id="experience-scroll"><section id="stage" aria-label="Interactive Sairam Incubation entrance"><canvas id="webgl"></canvas><div class="scene-label"><span>SAIRAM TECHNO INCUBATOR FOUNDATION</span><b>01 / ENTRANCE</b></div><div class="scroll-cue"><span>Scroll to enter</span><i></i></div></section></main>`
const canvas = document.querySelector('#webgl')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12; renderer.setPixelRatio(Math.min(window.devicePixelRatio, reducedMotion ? 1 : 1.6)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x141719)
const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 80); camera.position.set(sceneConfig.camera.exteriorWide.x, sceneConfig.camera.exteriorWide.y, sceneConfig.camera.exteriorWide.z)
const controls = { target: new THREE.Vector3(0, 3, 0) }
const entrance = new EntranceScene(); const reception = new ReceptionScene(); scene.add(entrance.group, reception.group)
const exteriorLight = new THREE.DirectionalLight(sceneConfig.lighting.exterior.color, sceneConfig.lighting.exterior.intensity); exteriorLight.position.set(-8, 12, 10); exteriorLight.castShadow = true; exteriorLight.shadow.mapSize.set(1024, 1024); scene.add(exteriorLight)
const interiorLight = new THREE.PointLight(sceneConfig.lighting.interior.color, 0.35, 18, 1.5); interiorLight.position.set(0, 5.5, -8); scene.add(interiorLight); scene.add(new THREE.HemisphereLight(0xaebaca, 0x27201d, 1.1))
const timeline = createScrollTimeline({ camera, controls, doors: entrance.doors, lights: { exterior: exteriorLight, interior: interiorLight }, reducedMotion })
const debug = createDebugMode({ camera, domElement: canvas, scene, objects: { entrance: entrance.group, doorLeft: entrance.doors.left, doorRight: entrance.doors.right, entranceBranding: entrance.objects.incubator, sairamBranding: entrance.objects.institutions, receptionDesk: reception.objects.desk, receptionDeskTop: reception.objects.deskTop, receptionWall: reception.objects.wall, receptionBranding: reception.objects.branding, receptionOriginalSymbol: reception.objects.symbol, switchBoard: reception.objects.switchBoard, mainCeilingChannel: reception.objects.mainChannel, mainLED: reception.objects.mainLED, leftCeilingChannel: reception.objects.leftChannel, rightCeilingChannel: reception.objects.rightChannel, centralCeilingFixture: reception.objects.fixture, rightArchitecturalOpening: reception.objects.opening, receptionHero: reception.objects.receptionHero } })
const lenis = new Lenis({ duration: reducedMotion ? 0.2 : 1.05, smoothWheel: true, syncTouch: true }); lenis.on('scroll', ({ scroll }) => { timeline.syncProgress(scroll / 5200); ScrollTrigger.update() })
ScrollTrigger.refresh()
timeline.syncProgress(0)
function resize() { const { clientWidth, clientHeight } = canvas.parentElement; camera.aspect = clientWidth / clientHeight; camera.fov = clientWidth < 700 ? 48 : 42; camera.updateProjectionMatrix(); renderer.setSize(clientWidth, clientHeight, false) }
window.addEventListener('resize', resize); resize()
function frame(time) { lenis.raf(time); if (debug?.orbit) debug.orbit.update(); renderer.render(scene, camera); requestAnimationFrame(frame) }
requestAnimationFrame(frame); window.setTimeout(() => document.querySelector('.loading-screen')?.classList.add('is-ready'), reducedMotion ? 120 : 700)