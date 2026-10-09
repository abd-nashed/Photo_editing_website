import { useEditorStore, FILTER_PRESETS } from '../store/useEditorStore'
import { processImage } from '../utils/imageProcessor'
import { useEffect, useState } from 'react'

export function FilterPresets() {
  const originalImage = useEditorStore((s) => s.originalImage)
  const activePreset = useEditorStore((s) => s.activePreset)
  const applyPreset = useEditorStore((s) => s.applyPreset)
  const adjustments = useEditorStore((s) => s.adjustments)
  const [thumbnails, setThumbnails] = useState({})

  useEffect(() => {
    if (!originalImage) return

    const generateThumbs = () => {
      const smallCanvas = document.createElement('canvas')
      const ratio = originalImage.naturalWidth / originalImage.naturalHeight
      smallCanvas.width = 120
      smallCanvas.height = 120 / ratio
      const smallCtx = smallCanvas.getContext('2d')
      smallCtx.drawImage(originalImage, 0, 0, smallCanvas.width, smallCanvas.height)

      const thumbs = {}
      FILTER_PRESETS.forEach((preset) => {
        const testAdjustments = { ...adjustments, ...preset.adjustments }
        const processed = processImage(
          { naturalWidth: smallCanvas.width, naturalHeight: smallCanvas.height, src: smallCanvas.toDataURL() },
          testAdjustments
        )
        thumbs[preset.id] = processed.toDataURL('image/jpeg', 0.7)
      })
      setThumbnails(thumbs)
    }

    const timeout = setTimeout(generateThumbs, 300)
    return () => clearTimeout(timeout)
  }, [originalImage])

  return (
    <div className="panel">
      <h3 className="panel-title">Filters</h3>
      <div className="presets-grid">
        {FILTER_PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`preset-btn ${activePreset === preset.id ? 'active' : ''}`}
            onClick={() => applyPreset(preset)}
          >
            <div className="preset-thumb">
              {thumbnails[preset.id] ? (
                <img src={thumbnails[preset.id]} alt={preset.name} />
              ) : (
                <div className="thumb-placeholder" />
              )}
            </div>
            <span>{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}