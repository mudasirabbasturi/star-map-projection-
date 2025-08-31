const Antimeridian = (ctx, canvas) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Simple equirectangular projection
  const project = (lon, lat, width, height) => {
    const x = ((lon + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return [x, y];
  };

  // Example coordinates crossing the antimeridian
  const coords = [
    [170, 10],
    [-170, 15],
    [-160, 20],
    [160, -10],
  ];

  const drawLine = (coords) => {
    ctx.beginPath();

    let prev = null;
    coords.forEach(([lon, lat]) => {
      const [x, y] = project(lon, lat, canvas.width, canvas.height);

      if (prev) {
        const [plon] = prev;

        // Check crossing antimeridian
        if (Math.abs(lon - plon) > 180) {
          ctx.stroke(); // cut line
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      } else {
        ctx.moveTo(x, y);
      }

      prev = [lon, lat];
    });

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  drawLine(coords);
};

export default Antimeridian;
