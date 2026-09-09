import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sceneConfig } from '../config/sceneConfig'
gsap.registerPlugin(ScrollTrigger)

export function createScrollTimeline({ camera, controls, doors, lights, reducedMotion = false }) {
  const waypoints = sceneConfig.camera; const timeline = gsap.timeline({ paused: true })
  timeline.to(camera.position, { x: waypoints.exteriorApproach.x, y: waypoints.exteriorApproach.y, z: waypoints.exteriorApproach.z, duration: 0.3, ease: 'none' })
  timeline.to(camera.position, { x: waypoints.doorway.x, y: waypoints.doorway.y, z: waypoints.doorway.z, duration: 0.3, ease: 'none' })
  timeline.to(controls.target, { x: waypoints.exteriorApproach.target.x, y: waypoints.exteriorApproach.target.y, z: waypoints.exteriorApproach.target.z, duration: 0.3, ease: 'none' }, 0)
  timeline.to(controls.target, { x: waypoints.doorway.target.x, y: waypoints.doorway.target.y, z: waypoints.doorway.target.z, duration: 0.3, ease: 'none' }, 0.3)
  timeline.to(doors.left.rotation, { y: reducedMotion ? sceneConfig.doors.openAngle * 0.8 : sceneConfig.doors.openAngle, duration: 0.18, ease: 'power2.inOut' }, 0.42)
  timeline.to(doors.right.rotation, { y: reducedMotion ? -sceneConfig.doors.openAngle * 0.8 : -sceneConfig.doors.openAngle, duration: 0.18, ease: 'power2.inOut' }, 0.42)
  timeline.to(camera.position, { x: waypoints.receptionReveal.x, y: waypoints.receptionReveal.y, z: waypoints.receptionReveal.z, duration: 0.18, ease: 'none' }, 0.6)
  timeline.to(camera.position, { x: waypoints.receptionHero.x, y: waypoints.receptionHero.y, z: waypoints.receptionHero.z, duration: 0.22, ease: 'power2.out' }, 0.78)
  timeline.to(controls.target, { x: waypoints.threshold.target.x, y: waypoints.threshold.target.y, z: waypoints.threshold.target.z, duration: 0.18, ease: 'none' }, 0.6)
  timeline.to(controls.target, { x: waypoints.receptionHero.target.x, y: waypoints.receptionHero.target.y, z: waypoints.receptionHero.target.z, duration: 0.22, ease: 'power2.out' }, 0.78)
  timeline.to(lights.interior, { intensity: 2.85, duration: 0.48, ease: 'none' }, 0.52)
  timeline.to(lights.exterior, { intensity: 1.1, duration: 0.52, ease: 'none' }, 0.48)
  timeline.eventCallback('onUpdate', () => { camera.lookAt(controls.target); camera.updateMatrixWorld() })
  const trigger = ScrollTrigger.create({ trigger: '#experience-scroll', start: 'top top', end: '+=5200', pin: '#stage', anticipatePin: 1, invalidateOnRefresh: true })
  const syncProgress = progress => timeline.progress(THREEClamp(progress))
  return { timeline, trigger, syncProgress }
}

function THREEClamp(value) { return Math.max(0, Math.min(1, value)) }
