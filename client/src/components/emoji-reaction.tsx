import { useEffect, useState } from 'react';
import { socketManager } from '@/lib/socket';

interface EmojiReactionProps {
  emoji: string;
  x: number;
  y: number;
  onComplete: () => void;
}

function FlyingEmoji({ emoji, x, y, onComplete }: EmojiReactionProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute text-4xl animate-emoji-fly pointer-events-none z-50"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: 'emojifly 2s ease-out forwards',
      }}
    >
      {emoji}
    </div>
  );
}

export default function EmojiReactions() {
  const [reactions, setReactions] = useState<Array<{
    id: string;
    emoji: string;
    x: number;
    y: number;
  }>>([]);

  useEffect(() => {
    const handleNewReaction = (data: any) => {
      const emojiMap: Record<string, string> = {
        fire: '🔥',
        mind: '🤯',
        laugh: '😂',
        idea: '💡',
      };

      const newReaction = {
        id: Math.random().toString(36),
        emoji: emojiMap[data.reaction] || '👍',
        x: data.x || Math.random() * 100,
        y: data.y || Math.random() * 100,
      };

      setReactions(prev => [...prev, newReaction]);
    };

    socketManager.on('new_reaction', handleNewReaction);

    return () => {
      socketManager.off('new_reaction', handleNewReaction);
    };
  }, []);

  const removeReaction = (id: string) => {
    setReactions(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {reactions.map((reaction) => (
        <FlyingEmoji
          key={reaction.id}
          emoji={reaction.emoji}
          x={reaction.x}
          y={reaction.y}
          onComplete={() => removeReaction(reaction.id)}
        />
      ))}
    </div>
  );
}
