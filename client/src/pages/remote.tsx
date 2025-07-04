import { useState, useEffect } from 'react';
import { socketManager } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Timer from '@/components/timer';
import { Wifi, Gamepad2 } from 'lucide-react';

export default function Remote() {
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [cheatCode, setCheatCode] = useState<string[]>([]);
  const [connectedUsers, setConnectedUsers] = useState(0);

  const texts = {
    en: {
      title: 'Remote Controller',
      subtitle: 'Connected to VibeStage',
      connected: 'Connected Successfully',
      connectedDesc: 'Your reactions will appear on the main screen',
      timerTitle: 'Presentation Timer',
      sendReactions: 'Send Reactions',
      quickPoll: 'Quick Poll',
      ratePresentation: 'Rate the current presentation:',
      cheatTitle: 'Secret Cheat Code',
      cheatDesc: 'Try the classic: ↑↑↓↓←→←→BA',
      cheatHint: 'Something magical might happen... 🎉',
      footer1: 'VibeStage Remote Controller',
      footer2: 'Swipe and tap to interact with the presentation',
      live: 'Live',
      reactions: {
        fire: { title: 'Fire!', subtitle: 'Tap to send' },
        mind: { title: 'Mind Blown!', subtitle: 'Tap to send' },
        laugh: { title: 'Hilarious!', subtitle: 'Tap to send' },
        idea: { title: 'Great Idea!', subtitle: 'Tap to send' },
      },
      pollOptions: {
        excellent: 'Excellent',
        good: 'Good',
        okay: 'Okay',
      },
    },
    ru: {
      title: 'Пульт управления',
      subtitle: 'Подключено к VibeStage',
      connected: 'Успешно подключено',
      connectedDesc: 'Ваши реакции будут отображаться на главном экране',
      timerTitle: 'Таймер презентации',
      sendReactions: 'Отправить реакции',
      quickPoll: 'Быстрый опрос',
      ratePresentation: 'Оцените текущую презентацию:',
      cheatTitle: 'Секретный чит-код',
      cheatDesc: 'Попробуйте классику: ↑↑↓↓←→←→BA',
      cheatHint: 'Что-то волшебное может произойти... 🎉',
      footer1: 'Пульт управления VibeStage',
      footer2: 'Свайпайте и нажимайте для взаимодействия с презентацией',
      live: 'В эфире',
      reactions: {
        fire: { title: 'Огонь!', subtitle: 'Нажмите для отправки' },
        mind: { title: 'Взрыв мозга!', subtitle: 'Нажмите для отправки' },
        laugh: { title: 'Уморительно!', subtitle: 'Нажмите для отправки' },
        idea: { title: 'Отличная идея!', subtitle: 'Нажмите для отправки' },
      },
      pollOptions: {
        excellent: 'Отлично',
        good: 'Хорошо',
        okay: 'Нормально',
      },
    },
  };

  const t = texts[language];

  useEffect(() => {
    socketManager.connect('remote');

    const handleInit = (data: any) => {
      setConnectedUsers(data.connectedUsers || 0);
    };

    const handleConnectionUpdate = (data: any) => {
      setConnectedUsers(data.connectedUsers);
    };

    socketManager.on('init', handleInit);
    socketManager.on('connection_update', handleConnectionUpdate);

    return () => {
      socketManager.off('init', handleInit);
      socketManager.off('connection_update', handleConnectionUpdate);
      socketManager.disconnect();
    };
  }, []);

  // Cheat code detection
  useEffect(() => {
    const targetSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...cheatCode, e.code].slice(-targetSequence.length);
      setCheatCode(newSequence);
      
      if (newSequence.length === targetSequence.length && 
          newSequence.every((key, i) => key === targetSequence[i])) {
        socketManager.send('confetti_cheat');
        setCheatCode([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cheatCode]);

  const sendReaction = (reaction: string) => {
    socketManager.send('send_reaction', { reaction });
  };

  const submitPollVote = (vote: string) => {
    socketManager.send('poll_vote', { vote });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{t.title}</h2>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
            >
              {language.toUpperCase()}
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">{t.live}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 m-4 rounded-r-lg">
        <div className="flex items-center">
          <Wifi className="text-green-500 w-5 h-5 mr-3" />
          <div>
            <p className="text-sm font-medium text-green-800">{t.connected}</p>
            <p className="text-xs text-green-600">{t.connectedDesc}</p>
          </div>
        </div>
      </div>

      {/* Timer Display (Mobile) */}
      <div className="m-4">
        <Timer variant="mobile" />
      </div>

      {/* Reaction Buttons */}
      <div className="m-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.sendReactions}</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => sendReaction('fire')}
            className="h-auto p-6 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-primary hover:shadow-lg active:scale-95 transition-all duration-200"
            variant="outline"
          >
            <div className="text-center">
              <div className="text-4xl mb-2 animate-bounce">🔥</div>
              <div className="text-sm font-semibold">{t.reactions.fire.title}</div>
              <div className="text-xs text-gray-500">{t.reactions.fire.subtitle}</div>
            </div>
          </Button>
          
          <Button
            onClick={() => sendReaction('mind')}
            className="h-auto p-6 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-primary hover:shadow-lg active:scale-95 transition-all duration-200"
            variant="outline"
          >
            <div className="text-center">
              <div className="text-4xl mb-2 animate-pulse">🤯</div>
              <div className="text-sm font-semibold">{t.reactions.mind.title}</div>
              <div className="text-xs text-gray-500">{t.reactions.mind.subtitle}</div>
            </div>
          </Button>
          
          <Button
            onClick={() => sendReaction('laugh')}
            className="h-auto p-6 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-primary hover:shadow-lg active:scale-95 transition-all duration-200"
            variant="outline"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">😂</div>
              <div className="text-sm font-semibold">{t.reactions.laugh.title}</div>
              <div className="text-xs text-gray-500">{t.reactions.laugh.subtitle}</div>
            </div>
          </Button>
          
          <Button
            onClick={() => sendReaction('idea')}
            className="h-auto p-6 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-primary hover:shadow-lg active:scale-95 transition-all duration-200"
            variant="outline"
          >
            <div className="text-center">
              <div className="text-4xl mb-2 animate-pulse">💡</div>
              <div className="text-sm font-semibold">{t.reactions.idea.title}</div>
              <div className="text-xs text-gray-500">{t.reactions.idea.subtitle}</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Quick Poll Participation */}
      <Card className="m-4">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.quickPoll}</h3>
          <p className="text-sm text-gray-600 mb-4">{t.ratePresentation}</p>
          
          <div className="space-y-3">
            <Button
              onClick={() => submitPollVote('excellent')}
              className="w-full justify-between h-auto p-4 bg-white hover:bg-primary/5 text-gray-900 border-2 border-gray-200 hover:border-primary"
              variant="outline"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">⭐</span>
                <span className="font-medium">{t.pollOptions.excellent}</span>
              </div>
              <span className="text-sm text-gray-500">45%</span>
            </Button>
            
            <Button
              onClick={() => submitPollVote('good')}
              className="w-full justify-between h-auto p-4 bg-white hover:bg-primary/5 text-gray-900 border-2 border-gray-200 hover:border-primary"
              variant="outline"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">👍</span>
                <span className="font-medium">{t.pollOptions.good}</span>
              </div>
              <span className="text-sm text-gray-500">30%</span>
            </Button>
            
            <Button
              onClick={() => submitPollVote('okay')}
              className="w-full justify-between h-auto p-4 bg-white hover:bg-primary/5 text-gray-900 border-2 border-gray-200 hover:border-primary"
              variant="outline"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">👌</span>
                <span className="font-medium">{t.pollOptions.okay}</span>
              </div>
              <span className="text-sm text-gray-500">25%</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cheat Code Info */}
      <Card className="m-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-2xl mb-2">
              <Gamepad2 className="w-6 h-6 mx-auto" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">{t.cheatTitle}</h3>
            <p className="text-xs text-gray-600 mb-3">{t.cheatDesc}</p>
            <div className="text-xs text-yellow-600 font-medium">{t.cheatHint}</div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-500">
        <p>{t.footer1}</p>
        <p>{t.footer2}</p>
      </div>
    </div>
  );
}
