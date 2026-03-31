function isRoadColor([r, g, b, a]) {
  return r > 180 && g > 180 && b < 130 && a > 150;
}

function getPixelColor(xP, yP, width, imageData) {
  const index = (xP + yP * width) * 4;
  return [
    imageData[index],
    imageData[index + 1],
    imageData[index + 2],
    imageData[index + 3]
  ];
}

function isOnRoad(ctx, x0, y0, width = 70) {
  const checkRadius = Math.round(width * 0.48);
  const diameter = checkRadius * 2;
  const cx = x0 + Math.round(width / 2);
  const cy = y0 + Math.round(width / 2);
  const startX = cx - checkRadius;
  const startY = cy - checkRadius;

  const imageData = ctx.getImageData(startX, startY, diameter, diameter).data;

  let totalPoints = 0;
  let roadPoints = 0;

  // Sample 12 evenly spaced points at the check radius
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12;
    const px = Math.round(checkRadius + Math.cos(angle) * (checkRadius - 1));
    const py = Math.round(checkRadius + Math.sin(angle) * (checkRadius - 1));
    totalPoints++;
    if (isRoadColor(getPixelColor(px, py, diameter, imageData))) {
      roadPoints++;
    }
  }

  return roadPoints >= totalPoints * 0.85;
}
