// src/components/map/utils.js

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export const safeProject = (projection, ra, dec) => {
  if (ra == null || dec == null) return { x: NaN, y: NaN };
  try {
    const [x, y] = projection([ra, dec]) || [NaN, NaN];
    return { x, y };
  } catch {
    return { x: NaN, y: NaN };
  }
};
