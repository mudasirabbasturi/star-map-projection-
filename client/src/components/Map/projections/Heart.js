const Heart = (ctx, canvas) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let xMin = Infinity,
    xMax = -Infinity,
    yMin = Infinity,
    yMax = -Infinity;

  for (let t = 0; t < Math.PI * 2; t += 0.01) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    );
    if (x < xMin) xMin = x;
    if (x > xMax) xMax = x;
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  }
  const heartWidth = xMax - xMin;
  const heartHeight = yMax - yMin;
  const scaleX = canvas.width / heartWidth;
  const scaleY = canvas.height / heartHeight;
  const scale = Math.min(scaleX, scaleY) * 0.95;

  const offsetX = (xMin + xMax) / 2;
  const offsetY = (yMin + yMax) / 2;

  ctx.beginPath();
  for (let t = 0; t < Math.PI * 2; t += 0.01) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    );
    const px = x * scale + canvas.width / 2 - offsetX * scale;
    const py = y * scale + canvas.height / 2 - offsetY * scale;
    if (t === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";
  ctx.stroke();
};

export default Heart;
