import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sceneConfig } from '../config/sceneConfig'
gsap.registerPlugin(ScrollTrigger)

export function createScrollTimeline({ camera, controls, doors, interiorDoor, lights, waypoints, postReception, reducedMotion = false }) {
  const entranceWaypoints = sceneConfig.camera
  const timeline = gsap.timeline({ paused: true })
  timeline.to(camera.position, { x: entranceWaypoints.exteriorApproach.x, y: entranceWaypoints.exteriorApproach.y, z: entranceWaypoints.exteriorApproach.z, duration: 0.3, ease: 'none' })
  timeline.to(camera.position, { x: entranceWaypoints.doorway.x, y: entranceWaypoints.doorway.y, z: entranceWaypoints.doorway.z, duration: 0.3, ease: 'none' })
  timeline.to(controls.target, { x: entranceWaypoints.exteriorApproach.target.x, y: entranceWaypoints.exteriorApproach.target.y, z: entranceWaypoints.exteriorApproach.target.z, duration: 0.3, ease: 'none' }, 0)
  timeline.to(controls.target, { x: entranceWaypoints.doorway.target.x, y: entranceWaypoints.doorway.target.y, z: entranceWaypoints.doorway.target.z, duration: 0.3, ease: 'none' }, 0.3)
  timeline.to(doors.left.rotation, { y: reducedMotion ? sceneConfig.doors.openAngle * 0.8 : sceneConfig.doors.openAngle, duration: 0.18, ease: 'power2.inOut' }, 0.42)
  timeline.to(doors.right.rotation, { y: reducedMotion ? -sceneConfig.doors.openAngle * 0.8 : -sceneConfig.doors.openAngle, duration: 0.18, ease: 'power2.inOut' }, 0.42)
  timeline.to(camera.position, { x: entranceWaypoints.receptionReveal.x, y: entranceWaypoints.receptionReveal.y, z: entranceWaypoints.receptionReveal.z, duration: 0.18, ease: 'none' }, 0.6)
  timeline.to(camera.position, { x: entranceWaypoints.receptionHero.x, y: entranceWaypoints.receptionHero.y, z: entranceWaypoints.receptionHero.z, duration: 0.22, ease: 'power2.out' }, 0.78)
  timeline.to(controls.target, { x: entranceWaypoints.threshold.target.x, y: entranceWaypoints.threshold.target.y, z: entranceWaypoints.threshold.target.z, duration: 0.18, ease: 'none' }, 0.6)
  timeline.to(controls.target, { x: entranceWaypoints.receptionHero.target.x, y: entranceWaypoints.receptionHero.target.y, z: entranceWaypoints.receptionHero.target.z, duration: 0.22, ease: 'power2.out' }, 0.78)
  timeline.to(lights.interior, { intensity: 2.85, duration: 0.48, ease: 'none' }, 0.52)
  timeline.to(lights.exterior, { intensity: 1.1, duration: 0.52, ease: 'none' }, 0.48)

  const move = (waypoint, duration) => {
    timeline.to(camera.position, { ...waypoint.position, duration, ease: 'power1.inOut' })
    timeline.to(controls.target, { ...waypoint.target, duration, ease: 'power1.inOut' }, `-=${duration}`)
  }
  const look = (waypoint, duration) => timeline.to(controls.target, { ...waypoint.target, duration, ease: 'power2.inOut' })
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
    if (postReception) postReception.visible = timeline.time() >= 1
  })
  const initialScroll = 5200
  const totalScroll = 9800
  const trigger = ScrollTrigger.create({ trigger: '#experience-scroll', start: 'top top', end: `+=${totalScroll}`, pin: '#stage', anticipatePin: 1, invalidateOnRefresh: true })
  const syncProgress = scroll => {
    const postProgress = Math.max(0, (scroll - initialScroll) / (totalScroll - initialScroll))
    const time = scroll <= initialScroll ? scroll / initialScroll : 1 + postProgress * (timeline.duration() - 1)
    timeline.time(THREEClamp(time / timeline.duration()) * timeline.duration())
  }
  return { timeline, trigger, syncProgress, waypoints }
}

function THREEClamp(value) { return Math.max(0, Math.min(1, value)) }
