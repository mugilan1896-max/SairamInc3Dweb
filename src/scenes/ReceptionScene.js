import * as THREE from 'three'
import { sceneConfig } from '../config/sceneConfig'

const gold = new THREE.MeshStandardMaterial({ color: 0xb78643, metalness: 0.84, roughness: 0.3 })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xe4ddd1, roughness: 0.76, metalness: 0 })
const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xdedbd4, roughness: 0.72, metalness: 0 })
const counterFrontMaterial = new THREE.MeshStandardMaterial({ color: 0xcfc6ba, roughness: 0.68, metalness: 0 })
const counterTopMaterial = new THREE.MeshStandardMaterial({ color: 0xf1ece4, roughness: 0.34, metalness: 0 })
const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x202124, roughness: 0.48, metalness: 0.08 })
const ledMaterial = new THREE.MeshStandardMaterial({ color: 0xfffbef, emissive: 0xfff4d5, emissiveIntensity: 3.8, roughness: 0.2 })

function curvedBand(name, centerZ, innerRadius, outerRadius, start, end, bottom, top, material, segments = 40) {
  material.side = THREE.DoubleSide
  const vertices = []
  const indices = []
  for (let level = 0; level < 2; level += 1) {
    const y = level ? top : bottom
    for (let side = 0; side < 2; side += 1) {
      const radius = side ? outerRadius : innerRadius
      for (let index = 0; index <= segments; index += 1) {
        const angle = start + ((end - start) * index) / segments
        vertices.push(Math.cos(angle) * radius, y, centerZ + Math.sin(angle) * radius)
      }
    }
  }
  const row = segments + 1
  for (let index = 0; index < segments; index += 1) {
    const next = index + 1
    const bottomInner = index
    const bottomInnerNext = next
    const bottomOuter = row + index
    const bottomOuterNext = row + next
    const topInner = row * 2 + index
    const topInnerNext = row * 2 + next
    const topOuter = row * 3 + index
    const topOuterNext = row * 3 + next
    indices.push(bottomInner, bottomOuter, bottomInnerNext, bottomInnerNext, bottomOuter, bottomOuterNext)
    indices.push(topInner, topInnerNext, topOuter, topInnerNext, topOuterNext, topOuter)
    indices.push(bottomInner, topInner, bottomInnerNext, bottomInnerNext, topInner, topInnerNext)
    indices.push(bottomOuter, bottomOuterNext, topOuter, bottomOuterNext, topOuterNext, topOuter)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices); geometry.computeVertexNormals()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = name; mesh.castShadow = true; mesh.receiveShadow = true
  return mesh
}

function textTexture() {
  const canvas = document.createElement('canvas'); canvas.width = 1000; canvas.height = 650
  const context = canvas.getContext('2d'); context.clearRect(0, 0, canvas.width, canvas.height); context.textAlign = 'center'; context.fillStyle = '#b78643'
  context.shadowColor = 'rgba(80, 46, 18, .3)'; context.shadowBlur = 8; context.shadowOffsetY = 8
  context.font = 'italic 42px Georgia'; context.fillText('Sri', 500, 290)
  context.font = '700 82px Georgia'; context.fillText('SAIRAM', 500, 370)
  context.font = '700 54px Georgia'; context.fillText('TECHNO INCUBATOR', 500, 440)
  context.font = '700 38px Georgia'; context.fillText('F  O  U  N  D  A  T  I  O  N', 500, 505)
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture
}

function createOriginalSymbol() {
  const texture = new THREE.TextureLoader().load('/branding/incubator-symbol-transparent.png')
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true, alphaTest: 0.04, roughness: 0.38, metalness: 0.62, side: THREE.DoubleSide })
  const symbol = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), material)
  symbol.name = 'reception original symbol'
  symbol.castShadow = true
  symbol.receiveShadow = true
  return symbol
}

function createBranding() {
  const group = new THREE.Group(); group.name = 'reception branding'
  const symbol = createOriginalSymbol(); symbol.position.set(0, 1.45, 0.04); group.add(symbol)
  const text = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.5), new THREE.MeshStandardMaterial({ map: textTexture(), transparent: true, metalness: 0.84, roughness: 0.3, side: THREE.DoubleSide }))
  text.position.set(0, -0.32, 0.02); group.add(text)
  return { group, symbol }
}

function createRingLight() {
  const group = new THREE.Group(); group.name = 'reception ring light'

  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x1f2021, roughness: 0.44, metalness: 0.38 })
  const glowMaterial = new THREE.MeshStandardMaterial({
    color: 0xfffef9,
    emissive: 0xfff7dc,
    emissiveIntensity: 2.6,
    roughness: 0.18,
    metalness: 0.1
  })
  const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x2b2c2d, roughness: 0.68, metalness: 0.2 })

  const cableLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 1.7, 12), cableMaterial)
  cableLeft.position.set(-1.1, 7.8, -8.2)
  cableLeft.rotation.z = 0.38
  const cableRight = cableLeft.clone(); cableRight.position.set(1.1, 7.8, -8.2); cableRight.rotation.z = -0.38

  const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.42, 18), frameMaterial)
  mount.position.set(0, 7.2, -8.2)

  const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.18, 18, 160), frameMaterial)
  ringOuter.rotation.x = Math.PI / 2
  ringOuter.position.set(0, 7.1, -8.2)

  const ringInner = new THREE.Mesh(new THREE.TorusGeometry(2.92, 0.11, 18, 160), glowMaterial)
  ringInner.rotation.x = Math.PI / 2
  ringInner.position.set(0, 7.08, -8.2)

  const ringGlow = new THREE.Mesh(new THREE.TorusGeometry(2.72, 0.17, 16, 220), glowMaterial)
  ringGlow.rotation.x = Math.PI / 2
  ringGlow.position.set(0, 7.1, -8.18)

  group.add(cableLeft, cableRight, mount, ringOuter, ringInner, ringGlow)
  return group
}

export class ReceptionScene {
  constructor() { this.group = new THREE.Group(); this.group.name = 'reception interior'; this.build() }

  build() {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(18, 7.4, 0.34), wallMaterial); wall.name = 'reception wall'; wall.position.set(0, 3.7, sceneConfig.reception.wallZ); wall.receiveShadow = true; this.group.add(wall)
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(18, 0.3, 15), ceilingMaterial); ceiling.name = 'reception ceiling'; ceiling.position.set(0, 7.2, -7); ceiling.receiveShadow = true; this.group.add(ceiling)
    const deskCenterZ = sceneConfig.reception.deskZ + 1.25
    const desk = curvedBand('reception desk fascia', deskCenterZ, 4.45, 5.75, Math.PI * 0.16, Math.PI * 0.84, 0.38, 1.92, counterFrontMaterial)
    const deskTop = curvedBand('reception desk top', deskCenterZ, 4.34, 5.9, Math.PI * 0.16, Math.PI * 0.84, 1.92, 2.22, counterTopMaterial)
    this.group.add(desk, deskTop)
    const seam = curvedBand('reception desk seam', deskCenterZ + 0.01, 4.46, 5.77, Math.PI * 0.16, Math.PI * 0.84, 1.34, 1.39, new THREE.MeshStandardMaterial({ color: 0xc1b8ae, roughness: 0.74 }))
    this.group.add(seam)

    const branding = createBranding(); branding.group.position.set(0, 3.6, sceneConfig.reception.wallZ + 0.22); this.group.add(branding.group)

    const ringLight = createRingLight(); this.group.add(ringLight)

    const opening = new THREE.Mesh(new THREE.BoxGeometry(2.1, 6.4, 0.32), blackMaterial); opening.name = 'right architectural opening'; opening.position.set(8.35, 3.2, -9.5); this.group.add(opening)
    const openingTop = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.25, 1.4), blackMaterial); openingTop.position.set(8.25, 6.15, -9.2); this.group.add(openingTop)
    const receptionHero = new THREE.Object3D(); receptionHero.name = 'reception hero camera waypoint'; receptionHero.position.set(sceneConfig.camera.receptionHero.x, sceneConfig.camera.receptionHero.y, sceneConfig.camera.receptionHero.z); this.group.add(receptionHero)

    const fill = new THREE.PointLight(0xfff0d2, 2.2, 15, 1.7); fill.position.set(0, 5.3, -8); this.group.add(fill)
    const counterFill = new THREE.PointLight(0xffe6c2, 1.1, 9, 2); counterFill.position.set(0, 2.4, -4.5); this.group.add(counterFill)
    this.objects = { desk, deskTop, wall, branding: branding.group, symbol: branding.symbol, ringLight, opening, receptionHero }
  }
}
