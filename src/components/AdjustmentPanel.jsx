import { useEditorStore } from '../store/useEditorStore'

const ADJUSTMENTS = [
  { key: 'brightness', label: 'Brightness', min: 0, max: 200, step: 1 },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200, step: 1 },
  { key: 'saturation', label: 'Saturation', min: 0, max: 200, step: 1 },
  { key: 'exposure', label: 'Exposure', min: 50, max: 150, step: 1 },
  { key: 'temperature', label: 'Temperature', min: -100, max: 100, step: 1 },
  { key: 'tint', label: 'Tint', min: -100, max: 100, step: 1 },
  { key: 'hue', label: 'Hue', min: -180, max: 180, step: 1 },
  { key: 'blur', label: 'Blur', min: 0, max: 20, step: 0.5 },
  { key: 'sharpen', label: 'Sharpen', min: 0, max: 100, step: 1 },
  { key: 'vignette', label: 'Vignette', min: 0, max: 100, step: 1 },
  { key: 'grain', label: 'Grain', min: 0, max: 100, step: 1 },
  { key: 'sepia', label: 'Sepia', min: 0, max: 100, step: 1 },
  { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, step: 1 },
  { key: 'invert', label: 'Invert', min: 0, max: 100, step: 1 },
]

export function AdjustmentPanel() {
  const adjustments = useEditorStore((s) => s.adjustments)
  const updateAdjustment = useEditorStore((s) => s.updateAdjustment)
  const reset = useEditorStore((s) => s.reset)

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Adjustments</h3>
        <button className="btn-ghost" onClick={reset}>
          Reset All
        </button>
      </div>

      <div className="adjustments-list">
        {ADJUSTMENTS.map((adj) => (
          <AdjustmentSlider
            key={adj.key}
            label={adj.label}
            value={adjustments[adj.key]}
            min={adj.min}
            max={adj.max}
            step={adj.step}
            onChange={(val) => updateAdjustment(adj.key, val)}
            defaultValue={
              adj.key === 'brightness' ||
              adj.key === 'contrast' ||
              adj.key === 'saturation' ||
              adj.key === 'exposure'
                ? 100
                : 0
            }
          />
        ))}
      </div>
    </div>
  )
}

function AdjustmentSlider({ label, value, min, max, step, onChange, defaultValue }) {
  const isModified = value !== defaultValue
  const percent = ((value - min) / (max - min)) * 100

  return (
    <div className="adj-item">
      <div className="adj-header">
        <span className="adj-label">{label}</span>
        <span className={`adj-value ${isModified ? 'modified' : ''}`}>
          {typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="adj-slider"
        style={{ '--percent': `${percent}%` }}
      />
    </div>
  )
}