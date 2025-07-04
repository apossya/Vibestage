import { useEffect, useState } from 'react';
import { socketManager } from '@/lib/socket';

interface ConfettiPiece {
  id: string;
  x: number;
  y: number;
  color: string;
  rotation: number;
  velocity: { x: number; y: number };
}

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  const colors = ['#6366F1', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#06B6D4'];

  const createConfettiPiece = (): ConfettiPiece => ({
    id: Math.random().toString(36),
    x: Math.random() * window.innerWidth,
    y: -10,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    velocity: {
      x: (Math.random() - 0.5) * 4,
      y: Math.random() * 3 + 2,
    },
  });

  const triggerConfetti = () => {
    setIsActive(true);
    const newPieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < 100; i++) {
      newPieces.push(createConfettiPiece());
    }
    
    setPieces(newPieces);

    // Clear confetti after animation
    setTimeout(() => {
      setIsActive(false);
      setPieces([]);
    }, 3000);
  };

  useEffect(() => {
    const handleTimerComplete = () => {
      triggerConfetti();
    };

    const handleConfettiTrigger = () => {
      triggerConfetti();
    };

    socketManager.on('timer_complete', handleTimerComplete);
    socketManager.on('trigger_confetti', handleConfettiTrigger);

    return () => {
      socketManager.off('timer_complete', handleTimerComplete);
      socketManager.off('trigger_confetti', handleConfettiTrigger);
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPieces(prev => prev.map(piece => ({
        ...piece,
        x: piece.x + piece.velocity.x,
        y: piece.y + piece.velocity.y,
        rotation: piece.rotation + 5,
      })).filter(piece => piece.y < window.innerHeight + 50));
    }, 16);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 transition-transform"
          style={{
            left: piece.x,
            top: piece.y,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
