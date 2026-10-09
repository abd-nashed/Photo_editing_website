import { create } from 'zustand'

export const DEFAULT_ADJUSTMENTS = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  exposure: 100,
  temperature: 0,    
  tint: 0,           
  blur: 0,
  sharpen: 0,
  vignette: 0,
  grain: 0,
  hue: 0,
  sepia: 0,
  grayscale: 0,
  invert: 0,
}

export const FILTER_PRESETS = [
  { id: 'original', name: 'Original', adjustments: {} },
  { id: 'vivid', name: 'Vivid', adjustments: { saturation: 140, contrast: 115, brightness: 105 } },
  { id: 'vintage', name: 'Vintage', adjustments: { sepia: 40, contrast: 90, brightness: 105, saturation: 85 } },
  { id: 'bw', name: 'B&W', adjustments: { grayscale: 100, contrast: 115 } },
  { id: 'cinema', name: 'Cinema', adjustments: { contrast: 120, saturation: 90, temperature: -10, vignette: 30 } },
  { id: 'warm', name: 'Warm', adjustments: { temperature: 25, saturation: 115, brightness: 105 } },
  { id: 'cool', name: 'Cool', adjustments: { temperature: -25, saturation: 110 } },
  { id: 'dramatic', name: 'Dramatic', adjustments: { contrast: 140, saturation: 85, sharpen: 30, vignette: 40 } },
  { id: 'fade', name: 'Fade', adjustments: { contrast: 85, saturation: 80, brightness: 110, sepia: 15 } },
  { id: 'noir', name: 'Noir', adjustments: { grayscale: 100, contrast: 140, brightness: 90, vignette: 50 } },
]

export const useEditorStore = create((set, get) => ({
  originalImage: null,
  imageName: '',
  imageSize: { width: 0, height: 0 },

  adjustments: { ...DEFAULT_ADJUSTMENTS },
  activePreset: 'original',

  showOriginal: false,
  isProcessing: false,

  setImage: (img, name) => set({
    originalImage: img,
    imageName: name,
    imageSize: { width: img.naturalWidth, height: img.naturalHeight },
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    activePreset: 'original',
  }),

  updateAdjustment: (key, value) =>
    set((state) => ({
      adjustments: { ...state.adjustments, [key]: value },
      activePreset: 'custom',
    })),

  applyPreset: (preset) =>
    set({
      adjustments: { ...DEFAULT_ADJUSTMENTS, ...preset.adjustments },
      activePreset: preset.id,
    }),

  reset: () =>
    set({
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      activePreset: 'original',
    }),

  setShowOriginal: (val) => set({ showOriginal: val }),

  clearImage: () =>
    set({
      originalImage: null,
      imageName: '',
      imageSize: { width: 0, height: 0 },
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      activePreset: 'original',
    }),
}))