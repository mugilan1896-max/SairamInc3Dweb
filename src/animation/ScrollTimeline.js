import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function createScrollTimeline({ camera, controls, doors, interiorDoor, lights, waypoints, reducedMotion = false }) {
  const timeline = gsap.timeline({ paused: true })
  const move = (waypoint, duration, position = timeline.duration()) => {
    timeline.to(camera.position, { ...waypoint.position, duration, ease: 'power1.inOut' }, position)
    timeline.to(controls.target, { ...waypoint.target, duration, ease: 'power1.inOut' }, position)
  }
  const look = (waypoint, duration, position = timeline.duration()) => {
    timeline.to(controls.target, { ...waypoint.target, duration, ease: 'power2.inOut' }, position)
  }

  move({ position: { x: 0, y: 3, z: 8.8 }, target: { x: 0, y: 2.9, z: 0 } }, 0.3, 0)
  move({ position: { x: 0, y: 3, z: 4.2 }, target: { x: 0, y: 2.8, z: -1 } }, 0.3)
  timeline.to(doors.left.rotation, { y: reducedMotion ? 0.72 : 1.32, duration: 0.18, ease: 'power2.inOut' }, 0.6)
  timeline.to(doors.right.rotation, { y: reducedMotion ? -0.72 : -1.32, duration: 0.18, ease: 'power2.inOut' }, 0.6)
  move({ position: { x: 0.58, y: 1.75, z: -0.84 }, target: { x: 0.58, y: 2.18, z: -6.99 } }, 0.28)
  timeline.to(lights.interior, { intensity: 1.8, duration: 0.48, ease: 'none' }, 0.52)
  timeline.to(lights.exterior, { intensity: 1.1, duration: 0.52, ease: 'none' }, 0.48)

  const receptionHomeTime = timeline.duration()
  look(waypoints.receptionLookRight, 0.16)
  look(waypoints.receptionCorridorAlign, 0.14)
  move(waypoints.downgoEntry, 0.22)
  move(waypoints.downgoMid, 0.22)
  move(waypoints.downgoExit, 0.16)
  move(waypoints.curvedJunctionApproach, 0.14)
  look(waypoints.curvedJunctionTurn, 0.12)
  move(waypoints.corridorEntry, 0.16)
  move(waypoints.corridorMid, 0.3)
  move(waypoints.arvrApproach, 0.2)
  move(waypoints.arvrDoorStop, 0.14)
  timeline.to(interiorDoor.rotation, { y: -Math.PI * 0.42, duration: 0.15, ease: 'power2.inOut' })
  timeline.eventCallback('onUpdate', () => {
    camera.lookAt(controls.target)
    camera.updateMatrixWorld()
  })
  const receptionScroll = 4300
  const totalScroll = 9800
  const trigger = ScrollTrigger.create({ trigger: '#experience-scroll', start: 'top top', end: `+=${totalScroll}`, pin: '#stage', anticipatePin: 1, invalidateOnRefresh: true })
  const syncProgress = scroll => {
    const time = scroll <= receptionScroll
      ? scroll / receptionScroll * receptionHomeTime
      : receptionHomeTime + ((scroll - receptionScroll) / (totalScroll - receptionScroll)) * (timeline.duration() - receptionHomeTime)
    timeline.time(THREEClamp(time / timeline.duration()) * timeline.duration())
  }
  return { timeline, trigger, syncProgress, waypoints }
}

function THREEClamp(value) { return Math.max(0, Math.min(1, value)) }
