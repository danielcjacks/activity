/**
 * Linearly interpolates between a and b by a percentage t
 */
export const lerp = (a, b, t) => {
  return a*(1-t)+b*t
}

export const clamp = (t, min = 0, max = 1) => Math.min(max, Math.max(min, t));
export const invlerp = (a, b, t) => clamp((t - a) / (b - a));