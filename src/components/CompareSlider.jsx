import { useEditorStore } from '../store/useEditorStore'

export function CompareToggle() {
  const showOriginal = useEditorStore((s) => s.showOriginal)
  const setShowOriginal = useEditorStore((s) => s.setShowOriginal)

  return (
    <button
      className={`btn-compare ${showOriginal ? 'active' : ''}`}
      onMouseDown={() => setShowOriginal(true)}
      onMouseUp={() => setShowOriginal(false)}
      onMouseLeave={() => setShowOriginal(false)}
      onTouchStart={() => setShowOriginal(true)}
      onTouchEnd={() => setShowOriginal(false)}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      Hold to Compare
    </button>
  )
}