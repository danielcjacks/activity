/**
 * Linearly interpolates between a and b by a percentage t
 */
export const lerp = (a, b, t) => {
  return a*(1-t)+b*t
}