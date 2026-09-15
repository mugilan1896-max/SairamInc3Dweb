import * as THREE from 'three'

const point = (x, y, z) => ({ x, y, z })

export function createCameraWaypoints(model) {
  const positionOf = name => model.getObjectByName(name).getWorldPosition(new THREE.Vector3())
  const boundsOf = name => new THREE.Box3().setFromObject(model.getObjectByName(name))
  const receptionHome = positionOf('reception_hero_camera_waypoint')
  const display = positionOf('Downgo_44_inch_display_placeholder')
  const receptionWall = positionOf('reception_wall')
  const corridorGlass = boundsOf('Downgo_glass_door1')
  const corridorOpposite = boundsOf('Downgo_clean_design_wall_2')
  const corridorX = (corridorGlass.min.x + corridorOpposite.max.x) / 2 - 0.45
  const door = positionOf('Downgo_Door')
  const corridorY = receptionHome.y
  const corridorTarget = point(corridorX, corridorY, -42.2)

  return {
    receptionHome: { position: point(receptionHome.x, receptionHome.y, receptionHome.z), target: point(receptionWall.x, 2.18, receptionWall.z) },
    receptionLookRight: { position: point(receptionHome.x, receptionHome.y, receptionHome.z), target: point(display.x, display.y, display.z) },
    receptionCorridorAlign: { position: point(receptionHome.x, receptionHome.y, receptionHome.z), target: point(display.x + 1.68, corridorY, display.z - 7.15) },
    downgoEntry: { position: point(display.x + 0.68, corridorY, display.z - 9.04), target: point(display.x + 1.93, corridorY, display.z - 14.44) },
    downgoMid: { position: point(display.x + 1.48, corridorY, display.z - 17.04), target: point(display.x + 4.33, corridorY, display.z - 21.94) },
    downgoExit: { position: point(display.x + 5.43, corridorY, display.z - 23.64), target: point(display.x + 8.33, corridorY, display.z - 26.04) },
    curvedJunctionApproach: { position: point(corridorX - 0.32, corridorY, -30.8), target: point(corridorX + 0.78, corridorY, -34.3) },
    curvedJunctionTurn: { position: point(corridorX - 0.32, corridorY, -30.8), target: point(corridorX - 0.32, corridorY, -37.2) },
    corridorEntry: { position: point(corridorX - 0.32, corridorY, -35.5), target: corridorTarget },
    corridorMid: { position: point(corridorX - 0.32, corridorY, -49.8), target: point(corridorX - 0.32, corridorY, -57.4) },
    arvrApproach: { position: point(corridorX - 0.32, corridorY, door.z + 5.2), target: point(door.x, corridorY, door.z) },
    arvrDoorStop: { position: point(door.x - 2.71, corridorY, door.z), target: point(door.x, corridorY, door.z) }
  }
}

export const cameraPathSafetyRadius = 0.45