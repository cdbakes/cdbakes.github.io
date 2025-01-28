interface Point {
  x: number;
  y: number;
}

interface LineSegment {
  start: Point;
  end: Point;
  progress: number;
  length: number;
}

export function drawLinePortrait(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  time: number,
  isDark = false
) {
  const width = imageData.width;
  const height = imageData.height;
  const lines: LineSegment[] = [];
  const gridSize = 6;
  const threshold = 128;

  // Create line segments based on edge detection
  for (let y = 0; y < height - 1; y += gridSize) {
    for (let x = 0; x < width - 1; x += gridSize) {
      const index = (y * width + x) * 4;
      const brightness = (
        imageData.data[index] +
        imageData.data[index + 1] +
        imageData.data[index + 2]
      ) / 3;

      if (brightness < threshold) {
        const start: Point = { x, y };
        const end: Point = { x: x + gridSize, y: y + gridSize };
        const length = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );
        
        lines.push({
          start,
          end,
          progress: Math.min(1, (time * 0.001) % 3),
          length
        });
      }
    }
  }

  // Draw lines with animation
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  ctx.lineWidth = 1;

  lines.forEach(line => {
    const currentEnd = {
      x: line.start.x + (line.end.x - line.start.x) * line.progress,
      y: line.start.y + (line.end.y - line.start.y) * line.progress
    };

    ctx.beginPath();
    ctx.moveTo(line.start.x, line.start.y);
    ctx.lineTo(currentEnd.x, currentEnd.y);
    ctx.stroke();
  });

  // Add some artistic flourish
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 0.5;
  
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];
    
    if (Math.random() < 0.1) {
      ctx.beginPath();
      ctx.moveTo(line.end.x, line.end.y);
      ctx.lineTo(nextLine.start.x, nextLine.start.y);
      ctx.stroke();
    }
  }
}
