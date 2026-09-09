export const sceneConfig = {
  entrance: { width: 22, height: 8, depth: 1.2, doorWidth: 4.3, doorHeight: 6.2, doorDepth: 0.18, position: { x: 0, y: 0, z: 0 } },
  doors: { openAngle: Math.PI * 0.42, leftHinge: -2.15, rightHinge: 2.15 },
  reception: { wallZ: -12, deskZ: -9.4 },
  camera: {
    exteriorWide: { x: 0, y: 2.8, z: 14, target: { x: 0, y: 2.1, z: 0 } },
    exteriorApproach: { x: 0, y: 3, z: 8.8, target: { x: 0, y: 2.9, z: 0 } },
    doorway: { x: 0, y: 3, z: 4.2, target: { x: 0, y: 2.8, z: -1 } },
    threshold: { x: 0, y: 3, z: 0.7, target: { x: 0, y: 2.85, z: -5.5 } },
    receptionReveal: { x: 0, y: 3.25, z: -0.3, target: { x: 0, y: 2.45, z: -10 } },
    receptionHero: { x: 0, y: 3.1, z: -1.2, target: { x: 0, y: 2.35, z: -12 } },
  },
  lighting: { exterior: { color: 0xb8c6d4, intensity: 3.2 }, interior: { color: 0xffead0, intensity: 2.8 } },
}
