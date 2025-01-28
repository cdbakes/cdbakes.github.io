interface Point {
  x: number;
  y: number;
}

interface Triangle {
  points: [Point, Point, Point];
  color: string;
}

export function drawGeometricPortrait(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  time: number,
  isDark = false
) {
  const width = imageData.width;
  const height = imageData.height;
  const triangles: Triangle[] = [];
  const gridSize = 12;

  // Create triangular mesh
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      const jitter = Math.sin(time * 0.001 + x * 0.1 + y * 0.1) * 2;
      
      const points: [Point, Point, Point] = [
        { x: x + jitter, y: y + jitter },
        { x: x + gridSize + jitter, y: y + jitter },
        { x: x + gridSize / 2 + jitter, y: y + gridSize + jitter }
      ];

      // Get average color for triangle area
      const color = getAverageColor(imageData, points);
      triangles.push({ points, color });
    }
  }

  // Draw triangles
  triangles.forEach(triangle => {
    ctx.beginPath();
    ctx.moveTo(triangle.points[0].x, triangle.points[0].y);
    ctx.lineTo(triangle.points[1].x, triangle.points[1].y);
    ctx.lineTo(triangle.points[2].x, triangle.points[2].y);
    ctx.closePath();
    ctx.fillStyle = triangle.color;
    ctx.fill();
    
    // Add subtle stroke
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    ctx.stroke();
  });
}

function getAverageColor(imageData: ImageData, points: Point[]): string {
  let r = 0, g = 0, b = 0, count = 0;
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) continue;
      
      const index = (Math.floor(y) * imageData.width + Math.floor(x)) * 4;
      r += imageData.data[index];
      g += imageData.data[index + 1];
      b += imageData.data[index + 2];
      count++;
    }
  }

  if (count === 0) return 'rgba(0,0,0,0)';
  
  r = Math.floor(r / count);
  g = Math.floor(g / count);
  b = Math.floor(b / count);

  return `rgb(${r},${g},${b})`;
}
