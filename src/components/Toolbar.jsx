import { useEditorStore } from '../store/useEditorStore'
import { processImage, downloadImage } from '../utils/imageProcessor'
import { CompareToggle } from './CompareSlider'

export function Toolbar() {
  const originalImage = useEditorStore((s) => s.originalImage)
  const adjustments = useEditorStore((s) => s.adjustments)
  const imageName = useEditorStore((s) => s.imageName)

  const handleDownload = () => {
    if (!originalImage) return
    const canvas = processImage(originalImage, adjustments)
    const name = imageName.replace(/\.[^.]+$/, '') || 'photo'
    downloadImage(canvas, `${name}-edited.jpg`)
  }

  const handleCopy = async () => {
    if (!originalImage) return
    try {
      const canvas = processImage(originalImage, adjustments)
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
          alert('Copied to clipboard!')
        } catch {
          alert('Copy not supported on this browser')
        }
      }, 'image/png')
    } catch (err) {
      console.error(err)
    }
  }

  if (!originalImage) return null

  return (
    <div className="toolbar">
      <CompareToggle />

      <div className="toolbar-actions">
        <button className="btn-secondary" onClick={handleCopy}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </button>

        <button className="btn-primary download-btn" onClick={handleDownload}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      </div>
    </div>
  )
}