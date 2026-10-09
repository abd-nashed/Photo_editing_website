import { Header } from './components/Header'
import { UploadZone } from './components/UploadZone'
import { ImageCanvas } from './components/ImageCanvas'
import { FilterPresets } from './components/FilterPresets'
import { AdjustmentPanel } from './components/AdjustmentPanel'
import { Toolbar } from './components/Toolbar'
import { useEditorStore } from './store/useEditorStore'

export default function App() {
  const originalImage = useEditorStore((s) => s.originalImage)

  return (
    <div className="app">
      <Header />

      {!originalImage ? (
        <UploadZone />
      ) : (
        <div className="editor-layout">
          <aside className="sidebar">
            <FilterPresets />
            <AdjustmentPanel />
          </aside>

          <main className="canvas-area">
            <ImageCanvas />
            <Toolbar />
          </main>
        </div>
      )}
    </div>
  )
}