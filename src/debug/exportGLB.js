import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'

export function exportGLB(object, filename = 'sairam-scene.glb') {
  const exporter = new GLTFExporter()

  exporter.parse(
    object,

    (result) => {
      const blob = new Blob([result], {
        type: 'application/octet-stream'
      })

      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = filename

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)

      console.log(`Exported: ${filename}`)
    },

    (error) => {
      console.error('GLB export failed:', error)
    },

    {
      binary: true,
      onlyVisible: false
    }
  )
}
