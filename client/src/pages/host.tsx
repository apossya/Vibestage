import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { socketManager } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import Timer from '@/components/timer';
import EmojiReactions from '@/components/emoji-reaction';
import Confetti from '@/components/confetti';
import { Play, RotateCcw, Users, Home } from 'lucide-react';

export default function Host() {
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [reactionCounts, setReactionCounts] = useState({
    fire: 0,
    mind: 0,
    laugh: 0,
    idea: 0,
  });

  useEffect(() => {
    socketManager.connect('host');

    const handleInit = (data: any) => {
      setConnectedUsers(data.connectedUsers || 0);
      setReactionCounts(data.reactionCounts || { fire: 0, mind: 0, laugh: 0, idea: 0 });
    };

    const handleConnectionUpdate = (data: any) => {
      setConnectedUsers(data.connectedUsers);
    };

    const handleReactionCountsUpdate = (data: any) => {
      setReactionCounts(data);
    };

    socketManager.on('init', handleInit);
    socketManager.on('connection_update', handleConnectionUpdate);
    socketManager.on('reaction_counts_update', handleReactionCountsUpdate);

    return () => {
      socketManager.off('init', handleInit);
      socketManager.off('connection_update', handleConnectionUpdate);
      socketManager.off('reaction_counts_update', handleReactionCountsUpdate);
      socketManager.disconnect();
    };
  }, []);

  const startTimer = () => {
    socketManager.send('start_timer');
  };

  const resetTimer = () => {
    socketManager.send('reset_timer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary/20 to-secondary/20 relative overflow-hidden">
      <EmojiReactions />
      <Confetti />

      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                  <Home className="w-4 h-4 mr-2" />
                  Главная
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-white">VibeStage Ведущий</h1>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {connectedUsers} подключено
                </span>
              </div>
            </div>
            
            {/* Timer Controls */}
            <div className="flex items-center space-x-4">
              <Button onClick={startTimer} className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Запустить таймер
              </Button>
              <Button onClick={resetTimer} variant="secondary">
                <RotateCcw className="w-4 h-4 mr-2" />
                Сброс
              </Button>
            </div>
          </div>
        </div>

        {/* Main Timer Display */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center">
            <Timer variant="host" />

            {/* Status Messages */}
            <div className="text-center mt-8">
              <p className="text-xl text-white/90 mb-4">Презентация идёт</p>
              <div className="flex justify-center space-x-8 text-white/70">
                <div className="text-center">
                  <div className="text-3xl font-bold">{reactionCounts.fire}</div>
                  <div className="text-sm">🔥 Огонь</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{reactionCounts.mind}</div>
                  <div className="text-sm">🤯 Взрыв мозга</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{reactionCounts.laugh}</div>
                  <div className="text-sm">😂 Смешно</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{reactionCounts.idea}</div>
                  <div className="text-sm">💡 Идея</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reactions Feed */}
        <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Живые реакции</h3>
          <div className="flex space-x-4 overflow-x-auto">
            <div className="flex-shrink-0 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-xs text-white/80">Только что</div>
            </div>
            <div className="flex-shrink-0 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl mb-1">💡</div>
              <div className="text-xs text-white/80">2 сек назад</div>
            </div>
            <div className="flex-shrink-0 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl mb-1">😂</div>
              <div className="text-xs text-white/80">5 сек назад</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
