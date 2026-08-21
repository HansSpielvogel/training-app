function niceStep(roughStep: number): number {
  const exponent = Math.floor(Math.log10(roughStep))
  const magnitude = Math.pow(10, exponent)
  const residual = roughStep / magnitude
  let niceResidual: number
  if (residual <= 1) niceResidual = 1
  else if (residual <= 2) niceResidual = 2
  else if (residual <= 5) niceResidual = 5
  else niceResidual = 10
  return niceResidual * magnitude
}

export function computeNiceTicks(min: number, max: number, targetCount: number): number[] {
  if (min === max) return [min]

  const range = max - min
  const roughStep = range / Math.max(targetCount - 1, 1)
  const step = niceStep(roughStep)

  const niceMin = Math.floor(min / step) * step
  const niceMax = Math.ceil(max / step) * step

  const ticks: number[] = []
  for (let v = niceMin; v <= niceMax + step / 2; v += step) {
    ticks.push(Math.round(v * 1000) / 1000)
  }
  return ticks
}
