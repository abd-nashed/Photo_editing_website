
export function processImage(image, adjustments) {
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const ctx = canvas.getContext('2d')

  const filters = []

  if (adjustments.brightness !== 100)
    filters.push(`brightness(${adjustments.brightness}%)`)

  if (adjustments.contrast !== 100)
    filters.push(`contrast(${adjustments.contrast}%)`)

  if (adjustments.saturation !== 100)
    filters.push(`saturate(${adjustments.saturation}%)`)

  if (adjustments.grayscale > 0)
    filters.push(`grayscale(${adjustments.grayscale}%)`)

  if (adjustments.sepia > 0)
    filters.push(`sepia(${adjustments.sepia}%)`)

  if (adjustments.invert > 0)
    filters.push(`invert(${adjustments.invert}%)`)

  if (adjustments.hue !== 0)
    filters.push(`hue-rotate(${adjustments.hue}deg)`)

  if (adjustments.blur > 0)
    filters.push(`blur(${adjustments.blur}px)`)

  if (adjustments.exposure !== 100) {
    const extra = adjustments.exposure - 100
    filters.push(`brightness(${100 + extra / 2}%)`)
  }

  ctx.filter = filters.length > 0 ? filters.join(' ') : 'none'

  ctx.drawImage(image, 0, 0)
  ctx.filter = 'none'

  if (adjustments.temperature !== 0 || adjustments.tint !== 0) {
    const tempColor = getTemperatureColor(
      adjustments.temperature,
      adjustments.tint
    )
    ctx.globalCompositeOperation = 'overlay'
    ctx.fillStyle = tempColor
    ctx.globalAlpha = 0.15
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }

  if (adjustments.sharpen > 0) {
    applySharpen(ctx, canvas.width, canvas.height, adjustments.sharpen)
  }

  if (adjustments.grain > 0) {
    applyGrain(ctx, canvas.width, canvas.height, adjustments.grain)
  }

  if (adjustments.vignette > 0) {
    applyVignette(ctx, canvas.width, canvas.height, adjustments.vignette)
  }

  return canvas
}


function getTemperatureColor(temp, tint) {

  const r = 128 + temp
  const g = 128 + tint * 0.5
  const b = 128 - temp - tint * 0.5
  return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`
}

function clamp(v) {
  return Math.max(0, Math.min(255, Math.round(v)))
}


function applySharpen(ctx, width, height, amount) {
  const strength = amount / 100
  if (strength <= 0) return

  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const copy = new Uint8ClampedArray(data)

  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0]
  const side = 3
  const halfSide = 1

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const dstOff = (y * width + x) * 4

      for (let c = 0; c < 3; c++) {
        let val = 0
        for (let ky = 0; ky < side; ky++) {
          for (let kx = 0; kx < side; kx++) {
            const scy = y + ky - halfSide
            const scx = x + kx - halfSide
            const srcOff = (scy * width + scx) * 4 + c
            val += copy[srcOff] * kernel[ky * side + kx]
          }
        }
        const orig = copy[dstOff + c]
        data[dstOff + c] = orig + (val - orig) * strength
      }
    }
  }

  ctx.putImageData(imageData, 0, 0)
}


function applyGrain(ctx, width, height, amount) {
  const strength = amount / 100
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 60 * strength
    data[i] = clamp(data[i] + noise)
    data[i + 1] = clamp(data[i + 1] + noise)
    data[i + 2] = clamp(data[i + 2] + noise)
  }

  ctx.putImageData(imageData, 0, 0)
}


function applyVignette(ctx, width, height, amount) {
  const strength = amount / 100
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.2,
    width / 2, height / 2, Math.max(width, height) * 0.7
  )
  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(1, `rgba(0,0,0,${strength * 0.8})`)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}


export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}


export function downloadImage(canvas, filename = 'edited-photo.jpg') {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 'image/jpeg', 0.95)
}