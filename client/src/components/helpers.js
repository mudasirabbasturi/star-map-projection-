export const wrapLon = (lon) => {
  let x = lon;
  while (x <= -180) x += 360;
  while (x > 180) x -= 360;
  return x;
};

export const raDecToXY = (lon, lat, centerRA = 0, invertRA = false) => {
  let shifted = wrapLon(lon - centerRA);
  if (invertRA) shifted = -shifted;
  const x = ((shifted + 180) / 360) * 1200;
  const y = 1200 - ((lat + 90) / 180) * 1200;
  return { x, y };
};

export const starRadius = (mag, sizeMult = 1) => {
  const r = 3.4 - 0.44 * mag;
  return Math.max(0.4, r) * sizeMult;
};
