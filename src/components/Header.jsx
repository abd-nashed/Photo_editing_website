import { useEditorStore } from '../store/useEditorStore'

export function Header() {
  const clearImage = useEditorStore((s) => s.clearImage)
  const originalImage = useEditorStore((s) => s.originalImage)
  const imageName = useEditorStore((s) => s.imageName)

  return (
    <header className="header">
      <div className="header-brand">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <div>
          <h1>Pixel Studio</h1>
          <p>Professional Photo Editor</p>
        </div>
      </div>

      {originalImage && (
        <div className="header-actions">
          <span className="file-name">{imageName}</span>
          <button className="btn-secondary" onClick={clearImage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
            </svg>
            New Image
          </button>
        </div>
      )}
    </header>
  )
}