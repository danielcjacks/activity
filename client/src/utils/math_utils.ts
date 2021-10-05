/**
 * Linearly interpolates between a and b by a percentage t
 */
export const lerp = (a, b, t) => {
  return a*(1-t)+b*t
}

export const clamp = (t, min = 0, max = 1) => Math.min(max, Math.max(min, t));
export const invlerp = (a, b, t) => clamp((t - a) / (b - a));

const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
// @ts-ignore
export const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a); 