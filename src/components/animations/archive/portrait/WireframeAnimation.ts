interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  start: Point3D;
  end: Point3D;
}

export function drawWireframePortrait(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  time: number,
  isDark = false
) {
  const width = imageData.width;
  const height = imageData.height;
  const gridSize = 10;
  const points: Point3D[] = [];
  const edges: Edge[] = [];

  // Create 3D points based on image brightness
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      const index = (y * width + x) * 4;
      const brightness = (
        imageData.data[index] +
        imageData.data[index + 1] +
        imageData.data[index + 2]
      ) / 3;

      // Convert brightness to Z coordinate
      const z = (brightness / 255) * 50;
      points.push({ x, y, z });
    }
  }

  // Create edges between points
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const nextInRow = points[i + 1];
    const nextInCol = points[i + Math.floor(width / gridSize)];

    if (nextInRow && i % Math.floor(width / gridSize) !== Math.floor(width / gridSize) - 1) {
      edges.push({ start: point, end: nextInRow });
    }
    if (nextInCol) {
      edges.push({ start: point, end: nextInCol });
    }
  }

  // 3D rotation matrices
  const rotateY = (point: Point3D, angle: number): Point3D => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x * cos - point.z * sin,
      y: point.y,
      z: point.x * sin + point.z * cos
    };
  };

  const rotateX = (point: Point3D, angle: number): Point3D => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x,
      y: point.y * cos - point.z * sin,
      z: point.y * sin + point.z * cos
    };
  };

  // Apply rotation
  const rotationX = Math.sin(time * 0.001) * 0.2;
  const rotationY = time * 0.001;

  edges.forEach(edge => {
    const start = rotateY(rotateX(edge.start, rotationX), rotationY);
    const end = rotateY(rotateX(edge.end, rotationX), rotationY);

    // Project 3D to 2D
    const focalLength = 400;
    const startZ = start.z + focalLength;
    const endZ = end.z + focalLength;
    
    const projectedStart = {
      x: start.x * (focalLength / startZ) + width / 2,
      y: start.y * (focalLength / startZ) + height / 2
    };
    
    const projectedEnd = {
      x: end.x * (focalLength / endZ) + width / 2,
      y: end.y * (focalLength / endZ) + height / 2
    };

    // Draw edge with depth-based opacity
    const depth = (startZ + endZ) / 2;
    const opacity = Math.min(1, Math.max(0.1, 1 - (depth - focalLength) / 400));
    
    ctx.beginPath();
    ctx.moveTo(projectedStart.x, projectedStart.y);
    ctx.lineTo(projectedEnd.x, projectedEnd.y);
    ctx.strokeStyle = isDark
      ? `rgba(255,255,255,${opacity * 0.5})`
      : `rgba(0,0,0,${opacity * 0.5})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}
