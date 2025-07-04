import { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCode({ value, size = 200, className = '' }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Simple QR code implementation using canvas
    // In a real implementation, you'd use a QR code library
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw QR code pattern (simplified)
    ctx.fillStyle = '#000000';
    const cellSize = size / 25; // 25x25 grid

    // Draw finder patterns (corners)
    const drawFinderPattern = (x: number, y: number) => {
      // Outer border
      ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
      // Inner white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      // Inner black
      ctx.fillStyle = '#000000';
      ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawFinderPattern(0, 0); // Top-left
    drawFinderPattern(18, 0); // Top-right
    drawFinderPattern(0, 18); // Bottom-left

    // Draw some data pattern (simplified)
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        // Skip finder patterns
        if ((i < 9 && j < 9) || (i < 9 && j > 15) || (i > 15 && j < 9)) continue;
        
        // Simple pattern based on coordinates and value
        const hash = value.charCodeAt((i + j) % value.length);
        if ((hash + i + j) % 3 === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [value, size]);

  return (
    <div className={`inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-200 rounded-lg bg-white"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
