import * as THREE from 'three'

export function createDoorLeaf(name, x, width, height, options = {}) {
  const { hasGlass = x > 0 } = options
  const pivot = new THREE.Group(); pivot.name = `${name} pivot`; pivot.position.set(x, height / 2, 0)
  const leaf = new THREE.Group(); leaf.name = name; leaf.position.x = x < 0 ? width / 2 : -width / 2
  const red = new THREE.MeshStandardMaterial({ color: 0xa71926, roughness: 0.34, metalness: 0.08 })
  const frame = new THREE.MeshStandardMaterial({ color: 0x6c1e24, roughness: 0.42, metalness: 0.2 })
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.18), red); body.castShadow = true; leaf.add(body)
  const inset = new THREE.Mesh(new THREE.BoxGeometry(width - 0.24, height - 0.24, 0.06), frame); inset.position.z = 0.12; leaf.add(inset)
  const panel = new THREE.Mesh(new THREE.BoxGeometry(width - 0.34, height - 0.34, 0.035), red); panel.position.z = 0.17; leaf.add(panel)

  if (hasGlass) {
    const window = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.86, 0.05), new THREE.MeshStandardMaterial({ color: 0xe9e4d7, roughness: 0.25, metalness: 0.1 }))
    window.position.set(-0.38, 1.42, 0.22); leaf.add(window)
  }

  const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.62, 8, 16), new THREE.MeshStandardMaterial({ color: 0xd5d8d3, roughness: 0.22, metalness: 0.9 }))
  handle.position.set(x < 0 ? 0.52 : -0.52, -0.2, 0.32); leaf.add(handle)
  const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.035, 20), new THREE.MeshStandardMaterial({ color: 0xd8d2bd, metalness: 0.85, roughness: 0.25 }))
  lock.rotation.x = Math.PI / 2; lock.position.set(x < 0 ? 0.52 : -0.52, -0.76, 0.28); leaf.add(lock)
  pivot.add(leaf)
  return { pivot, leaf }
}
