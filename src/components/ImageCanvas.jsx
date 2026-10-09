import { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '../store/useEditorStore'
import { processImage } from '../utils/imageProcessor'

export function ImageCanvas() {
  const originalImage = useEditorStore((s) => s.originalImage)
  const adjustments = useEditorStore((s) => s.adjustments)
  const showOriginal = useEditorStore((s) => s.showOriginal)
  const canvasRef = useRef(null)
  const [displayUrl, setDisplayUrl] = useState('')

  useEffect(() => {
    if (!originalImage) return

    const timeout = setTimeout(() => {
      const canvas = processImage(originalImage, adjustments)
      setDisplayUrl(canvas.toDataURL('image/jpeg', 0.92))
    }, 80)

    return () => clearTimeout(timeout)
  }, [originalImage, adjustments])

  if (!originalImage) return null

  return (
    <div className="canvas-wrapper">
      <div className="canvas-container">
        <img
          ref={canvasRef}
          src={displayUrl}
          alt="Edited"
          className="canvas-image"
          style={{ display: showOriginal ? 'none' : 'block' }}
        />

        {showOriginal && (
          <img
            src={originalImage.src}
            alt="Original"
            className="canvas-image"
          />
        )}

        <div className="canvas-badge">
          {showOriginal ? 'ORIGINAL' : 'EDITED'}
        </div>
      </div>
    </div>
  )
}