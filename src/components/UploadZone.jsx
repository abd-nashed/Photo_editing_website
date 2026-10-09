import { useState, useRef } from 'react'
import { useEditorStore } from '../store/useEditorStore'
import { loadImage } from '../utils/imageProcessor'

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef()
  const setImage = useEditorStore((s) => s.setImage)

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setIsLoading(true)
    try {
      const img = await loadImage(file)
      setImage(img, file.name)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <div className="upload-container">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])}
          hidden
        />

        {isLoading ? (
          <div className="upload-loading">
            <div className="spinner" />
            <p>Loading image...</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h2>Drop your image here</h2>
            <p>or click to browse — JPG, PNG, WebP up to 20 MB</p>
            <button className="btn-primary" type="button">
              Choose Image
            </button>
          </>
        )}
      </div>

      <div className="upload-features">
        <Feature icon="⚡" title="Fast Processing" desc="Instant real-time preview" />
        <Feature icon="🎨" title="Pro Filters" desc="10+ presets & adjustments" />
        <Feature icon="💾" title="HD Export" desc="Download in original quality" />
      </div>
    </div>
  )
}

function Feature({ icon, title, desc }) {
  return (
    <div className="feature">
      <div className="feature-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  )
}