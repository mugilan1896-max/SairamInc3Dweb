import * as THREE from 'three'

export function createImageBranding(path, name, width) {
  const texture = new THREE.TextureLoader().load(path, loadedTexture => {
    loadedTexture.colorSpace = THREE.SRGBColorSpace
    const aspect = loadedTexture.image.width / loadedTexture.image.height
    mesh.scale.y = width / aspect
  })
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true, alphaTest: 0.02, metalness: 0.62, roughness: 0.3, side: THREE.DoubleSide })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
  mesh.name = name
  mesh.scale.set(width, width * 0.4, 1)
  mesh.castShadow = true
  return mesh
}
