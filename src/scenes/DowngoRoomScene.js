import * as THREE from 'three'
import { sceneConfig } from '../config/sceneConfig'

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xe7e4dc, emissive: 0x272621, emissiveIntensity: 0.28, roughness: 0.86 })
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xb7b3ab, roughness: 0.93 })
const pathMaterial = new THREE.MeshStandardMaterial({ color: 0x555454, roughness: 0.76 })
const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xd7d5cf, roughness: 0.8 })
const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xfff9e9, emissive: 0xffedc9, emissiveIntensity: 2.4, roughness: 0.22 })

function box(name, size, position, material, receiveShadow = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
  mesh.name = name
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = receiveShadow
  return mesh
}

function floorLine(group, x, z, depth) {
  group.add(box('Downgo floor path line', [0.12, 0.018, depth], [x, 0.012, z], pathMaterial, false))
}

function ceilingLight(group, x, z) {
  group.add(box('Downgo ceiling light', [0.18, 0.08, 2.8], [x, 6.86, z], lightMaterial, false))
}

function ceilingTray(group, x, z, length) {
  group.add(box('Downgo suspended cable tray', [0.22, 0.12, length], [x, 6.55, z], ceilingMaterial))
}

export class DowngoRoomScene {
  constructor() { this.group = new THREE.Group(); this.group.name = 'postReceptionGroup'; this.group.visible = false; this.build() }

  build() {
    const { origin, room } = sceneConfig.downgo
    this.group.position.set(origin.x, origin.y, origin.z)
    const roomGroup = new THREE.Group(); roomGroup.name = 'sairamincu4 Downgo room'

    roomGroup.add(box('Downgo floor', [room.width + 3.6, 0.16, room.depth], [room.centerX, -0.08, room.centerZ], floorMaterial))
    floorLine(roomGroup, room.pathLeftX, room.centerZ, room.depth - 0.8)
    floorLine(roomGroup, room.pathRightX, room.centerZ, room.depth - 0.8)
    roomGroup.add(box('Downgo clean design wall', [0.28, 6.8, room.depth], [room.rightWallX, 3.4, room.centerZ], wallMaterial))
    roomGroup.add(box('Downgo white side wall', [0.28, 6.8, room.depth - 1.2], [room.leftWallX, 3.4, room.centerZ + 0.6], wallMaterial))
    roomGroup.add(box('Downgo white end return', [room.width + 3.6, 6.6, 0.28], [room.centerX, 3.3, room.centerZ - room.depth / 2], wallMaterial))
    roomGroup.add(box('Downgo wall base trim', [0.34, 0.16, room.depth - 0.2], [room.rightWallX - 0.08, 0.08, room.centerZ], pathMaterial))
    roomGroup.add(box('Downgo display frame', [0.12, 2.05, 3.55], [room.rightWallX - 0.2, 4.15, room.displayZ], pathMaterial))
    roomGroup.add(box('Downgo 44 inch display placeholder', [0.08, 1.72, 3.2], [room.rightWallX - 0.27, 4.15, room.displayZ], wallMaterial, false))
    ceilingTray(roomGroup, room.centerX - 1.5, room.centerZ, room.depth - 1.5)
    ceilingTray(roomGroup, room.centerX + 1.1, room.centerZ, room.depth - 1.5)
    ceilingLight(roomGroup, room.centerX - 1.8, room.centerZ - 4.6)
    ceilingLight(roomGroup, room.centerX - 1.8, room.centerZ)
    ceilingLight(roomGroup, room.centerX - 1.8, room.centerZ + 4.6)
    this.group.add(roomGroup)
    const fill = new THREE.PointLight(0xfff1dc, 1.75, 18, 1.7); fill.position.set(room.centerX, 5.1, room.centerZ - 1); this.group.add(fill)
    const endFill = new THREE.PointLight(0xfff4df, 1.15, 12, 1.8); endFill.position.set(room.centerX, 4.2, room.centerZ - room.depth / 2 + 1.2); this.group.add(endFill)
    this.objects = { room: roomGroup }
  }
}