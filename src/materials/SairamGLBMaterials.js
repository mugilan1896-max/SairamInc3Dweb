import * as THREE from 'three'

export const COLORS = {
  receptionWall: 0xe4ddd1,
  receptionCeiling: 0xdedbd4,
  receptionDesk: 0xcfc6ba,
  receptionDeskTop: 0xf1ece4,
  receptionSeam: 0xc1b8ae,
  downgoWall: 0xe7e4dc,
  downgoFloor: 0xb7b3ab,
  path: 0x555454,
  blueGreyWall: 0x9caab0,
  glassTint: 0x9fb8c2,
  metal: 0x202124,
  door: 0xd9d5cc,
  warmLED: 0xfff9e9
}

export function createSairamGLBMaterials() {
  return {
    receptionWallMaterial: new THREE.MeshStandardMaterial({ color: COLORS.receptionWall, roughness: 0.76 }),
    receptionCeilingMaterial: new THREE.MeshStandardMaterial({ color: COLORS.receptionCeiling, roughness: 0.72 }),
    receptionDeskMaterial: new THREE.MeshStandardMaterial({ color: COLORS.receptionDesk, roughness: 0.68 }),
    receptionDeskTopMaterial: new THREE.MeshStandardMaterial({ color: COLORS.receptionDeskTop, roughness: 0.34 }),
    receptionSeamMaterial: new THREE.MeshStandardMaterial({ color: COLORS.receptionSeam, roughness: 0.74 }),
    downgoWallMaterial: new THREE.MeshStandardMaterial({ color: COLORS.downgoWall, roughness: 0.86 }),
    downgoFloorMaterial: new THREE.MeshStandardMaterial({ color: COLORS.downgoFloor, roughness: 0.93 }),
    pathMaterial: new THREE.MeshStandardMaterial({ color: COLORS.path, roughness: 0.76 }),
    blueGreyWallMaterial: new THREE.MeshStandardMaterial({ color: COLORS.blueGreyWall, roughness: 0.82 }),
    glassMaterial: new THREE.MeshPhysicalMaterial({ color: COLORS.glassTint, roughness: 0.1, metalness: 0, transmission: 0.08, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide }),
    darkFrameMaterial: new THREE.MeshStandardMaterial({ color: COLORS.metal, roughness: 0.48, metalness: 0.08 }),
    doorMaterial: new THREE.MeshStandardMaterial({ color: COLORS.door, roughness: 0.62 }),
    metalHandleMaterial: new THREE.MeshStandardMaterial({ color: COLORS.metal, roughness: 0.22, metalness: 0.86 }),
    warmLEDMaterial: new THREE.MeshStandardMaterial({ color: COLORS.warmLED, emissive: 0xffedc9, emissiveIntensity: 2.4, roughness: 0.22 })
  }
}

export function applySairamGLBMaterials(model) {
  const materials = createSairamGLBMaterials()
  model.traverse(object => {
    if (!object.isMesh) return
    const name = `${object.name} ${object.parent?.name ?? ''}`.toLowerCase()
    if (name.includes('glass')) object.material = materials.glassMaterial
    else if (name.includes('handle')) object.material = materials.metalHandleMaterial
    else if (name.includes('door_rack') || name.includes('display_frame')) object.material = materials.darkFrameMaterial
    else if (name.includes('downgo_door')) object.material = materials.doorMaterial
    else if (name.includes('reception_ceiling')) object.material = materials.receptionCeilingMaterial
    else if (name.includes('reception_desk_top')) object.material = materials.receptionDeskTopMaterial
    else if (name.includes('reception_desk_seam')) object.material = materials.receptionSeamMaterial
    else if (name.includes('reception_desk')) object.material = materials.receptionDeskMaterial
    else if (name.includes('reception_wall') || name.includes('reception_branding')) object.material = materials.receptionWallMaterial
    else if (name.includes('ring_light')) object.material = materials.warmLEDMaterial
    else if (name.includes('floor') || name.includes('path')) object.material = materials.downgoFloorMaterial
    else if (name.includes('upper_wall') || name.includes('lower_wall') || name.includes('mini_wall') || name.includes('sidewall') || name.includes('clean_design_wall') || name.includes('white_side_wall')) object.material = materials.downgoWallMaterial
    else object.material = materials.downgoWallMaterial
    object.material.needsUpdate = true
    object.castShadow = false
    object.receiveShadow = true
  })
  return materials
}
