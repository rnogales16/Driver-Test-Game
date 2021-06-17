//Midpoint circle algorithm
//http://en.wikipedia.org/wiki/Midpoint_circle_algorithm

function isRoadColor([r,g,b,a]) {
  //console.log(r,g,b,a)
  //const [R, G, B, A] = [255,	251,	0, 255]
  //return r === R && g === G && b === B && a ===A
  return !(r+g+b+a === 0)
}

function getPixelColor(xP, yP, width, imageData){
  const index = (xP+yP*width)*4
  const R = imageData[index + 0]
  const G = imageData[index + 1]
  const B = imageData[index + 2]
  const A = imageData[index + 3]
  return [R,G,B,A]
}
	
function isOnRoad(ctx, x0, y0, width=70) {
  const diameter = width + 4
  const radius = Math.round(diameter / 2)
  const xS = x0 - 2 
  const yS = y0 - 2
  const imageData = ctx.getImageData(xS, yS, diameter, diameter).data

  let xI = radius;
  let yI = 0;
  const xC = radius
  const yC = radius
  let radiusError = 1 - xI;

  let allPixelsAreRoad = true
  while (xI>= yI) {
    allPixelsAreRoad = [
      getPixelColor(xI + xC, yI + yC, diameter, imageData),
      getPixelColor(yI + xC, xI + yC, diameter, imageData),
      getPixelColor(-xI + xC, yI + yC, diameter, imageData),
      getPixelColor(-yI + xC, xI + yC, diameter, imageData),
      getPixelColor(-xI + xC, -yI + yC, diameter, imageData),
      getPixelColor(-yI + xC, -xI + yC, diameter, imageData),
      getPixelColor(xI + xC, -yI + yC, diameter, imageData),
      getPixelColor(yI + xC, -xI + yC, diameter, imageData)
    ].every(isRoadColor)

  if(!allPixelsAreRoad) return false
  
  yI++;

  if (radiusError < 0) {
      radiusError += 2 * yI + 1;
  } else {
    xI--;
    radiusError+= 2 * (yI - xI + 1);
  }
}
  return true
};
