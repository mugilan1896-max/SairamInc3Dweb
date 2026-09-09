import * as THREE from 'three'
import { sceneConfig } from '../config/sceneConfig'
import { createImageBranding } from '../objects/Branding'
import { createDoorLeaf } from '../objects/Door'

export class EntranceScene {
  constructor() { this.group = new THREE.Group(); this.group.name = 'entrance façade'; this.doors = {}; this.build() }
  build() {
    const { width, height } = sceneConfig.entrance
    const stone = new THREE.MeshStandardMaterial({ color: 0x45484a, roughness: 0.82, metalness: 0.08 })
    const dark = new THREE.MeshStandardMaterial({ color: 0x1a1c1d, roughness: 0.75 })
    const wall = new THREE.Group(); wall.name = 'exterior stone wall'
    const openingWidth = sceneConfig.entrance.doorWidth + 0.16
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry((width - openingWidth) / 2, height, 0.34), stone); leftWall.position.set(-(width + openingWidth) / 4, height / 2, -0.35); leftWall.castShadow = true; wall.add(leftWall)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry((width - openingWidth) / 2, height, 0.34), stone); rightWall.position.set((width + openingWidth) / 4, height / 2, -0.35); rightWall.castShadow = true; wall.add(rightWall)
    const upperWall = new THREE.Mesh(new THREE.BoxGeometry(openingWidth, height - 6.45, 0.34), stone); upperWall.position.set(0, 6.45 + (height - 6.45) / 2, -0.35); upperWall.castShadow = true; wall.add(upperWall)
    this.group.add(wall)
    const openingHalf = openingWidth / 2
    // Keep panel seams well outside the moving door/reveal sightline.
    const seamClearHalf = openingHalf + 1.1
    const leftEdge = -width / 2
    const rightEdge = width / 2
    const seamFront = -0.16
    for (let x = -10; x <= 10; x += 2.25) {
      if (x > -seamClearHalf && x < seamClearHalf) continue
      const seam = new THREE.Mesh(new THREE.BoxGeometry(0.018, height - 0.12, 0.01), dark)
      seam.position.set(x, height / 2, seamFront)
      this.group.add(seam)
    }
    const recessMaterial = new THREE.MeshStandardMaterial({ color: 0x252326, roughness: 0.58 })
    const recess = new THREE.Group(); recess.name = 'doorway recess'
    const jambX = sceneConfig.doors.rightHinge + 0.08
    const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 6.45, 0.86), recessMaterial); leftJamb.position.set(-jambX, 3.1, -0.08); recess.add(leftJamb)
    const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 6.45, 0.86), recessMaterial); rightJamb.position.set(jambX, 3.1, -0.08); recess.add(rightJamb)
    const recessLintel = new THREE.Mesh(new THREE.BoxGeometry(sceneConfig.entrance.doorWidth + 0.28, 0.22, 0.86), recessMaterial); recessLintel.position.set(0, 6.34, -0.08); recess.add(recessLintel)
    this.group.add(recess)
    const floor = new THREE.Mesh(new THREE.BoxGeometry(32, 0.16, 40), new THREE.MeshStandardMaterial({ color: 0x8a8177, roughness: 0.74 })); floor.name = 'entrance ground'; floor.position.set(0, -0.08, 1); floor.receiveShadow = true; this.group.add(floor)
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x6f2529, roughness: 0.4, metalness: 0.18 })
    const frameX = sceneConfig.doors.rightHinge - 0.04
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6.15, 0.26), frameMaterial); frameLeft.position.set(-frameX, 3.1, 0.37)
    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6.15, 0.26), frameMaterial); frameRight.position.set(frameX, 3.1, 0.37)
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(sceneConfig.entrance.doorWidth + 0.24, 0.28, 0.26), frameMaterial); lintel.position.set(0, 6.25, 0.37); this.group.add(frameLeft, frameRight, lintel)
    const leftWidth = 1.9
    const rightWidth = 2.4
    const left = createDoorLeaf('door left', sceneConfig.doors.leftHinge, leftWidth, sceneConfig.entrance.doorHeight, { hasGlass: false })
    const right = createDoorLeaf('door right', sceneConfig.doors.rightHinge, rightWidth, sceneConfig.entrance.doorHeight, { hasGlass: true })
    left.pivot.position.z = 0.3; right.pivot.position.z = 0.3; this.doors.left = left.pivot; this.doors.right = right.pivot; this.group.add(left.pivot, right.pivot)
    const incubator = createImageBranding('/branding/sairam-entrance-left.png', 'left entrance branding', 5.7); incubator.position.set(-6.55, 3.75, 0.23); this.group.add(incubator)
    const institutions = createImageBranding('/branding/sairam-entrance-right.png', 'right entrance branding', 5.35); institutions.position.set(6.55, 3.75, 0.23); this.group.add(institutions)
    this.objects = { wall, incubator, institutions, floor }
  }
}
