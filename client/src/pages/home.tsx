import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRCode from '@/components/qr-code';
import { Copy, Wifi, Clock, Zap, BarChart3, Monitor, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [qrData, setQrData] = useState<{ url: string; text: string } | null>(null);
  const { toast } = useToast();

  const texts = {
    en: {
      title: 'VibeStage',
      subtitle: 'Interactive Presentation Platform',
      heroTitle: 'Transform Your Presentations into',
      heroHighlight: 'Interactive Shows',
      heroDescription: 'VibeStage turns ordinary demo sessions into engaging experiences with real-time emoji reactions, live voting, and interactive timers.',
      getStarted: 'Get Started Instantly',
      scanQR: 'Scan the QR code with your mobile device to access the remote controller. Send live reactions, participate in polls, and engage with presentations in real-time.',
      orVisit: 'Or visit directly:',
      copy: 'Copy',
      features: {
        timer: {
          title: 'Smart Timer',
          description: '5-minute countdown with visual alerts and celebratory confetti when time\'s up.',
        },
        reactions: {
          title: 'Live Reactions',
          description: 'Send emoji reactions that fly across the screen with beautiful animations.',
        },
        polls: {
          title: 'Interactive Polls',
          description: 'Real-time audience voting with instant results and winner celebrations.',
        },
      },
      launchHost: 'Launch Host Display',
      openRemote: 'Open Remote Controller',
      connected: 'Connected',
    },
    ru: {
      title: 'VibeStage',
      subtitle: 'Интерактивная платформа презентаций',
      heroTitle: 'Превратите ваши презентации в',
      heroHighlight: 'Интерактивные шоу',
      heroDescription: 'VibeStage превращает обычные демо-сессии в увлекательные события с реакциями эмодзи в реальном времени, голосованиями и интерактивными таймерами.',
      getStarted: 'Начните мгновенно',
      scanQR: 'Отсканируйте QR-код мобильным устройством для доступа к пульту управления. Отправляйте реакции, участвуйте в опросах и взаимодействуйте с презентациями в реальном времени.',
      orVisit: 'Или перейдите напрямую:',
      copy: 'Копировать',
      features: {
        timer: {
          title: 'Умный таймер',
          description: '5-минутный обратный отсчёт с визуальными уведомлениями и праздничным конфетти по завершении.',
        },
        reactions: {
          title: 'Живые реакции',
          description: 'Отправляйте эмодзи-реакции, которые летят по экрану с красивыми анимациями.',
        },
        polls: {
          title: 'Интерактивные опросы',
          description: 'Голосование аудитории в реальном времени с мгновенными результатами и празднованием победителей.',
        },
      },
      launchHost: 'Запустить экран ведущего',
      openRemote: 'Открыть пульт управления',
      connected: 'Подключено',
    },
  };

  const t = texts[language];

  useEffect(() => {
    fetch('/api/qr-data')
      .then(res => res.json())
      .then(setQrData)
      .catch(console.error);
  }, []);

  const copyToClipboard = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData.url);
      toast({
        title: language === 'en' ? 'Copied!' : 'Скопировано!',
        description: language === 'en' ? 'Link copied to clipboard' : 'Ссылка скопирована в буфер обмена',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Zap className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
                className="flex items-center space-x-2"
              >
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">{t.connected}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.heroTitle}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {t.heroHighlight}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.heroDescription}
          </p>
        </div>

        {/* QR Code Section */}
        <Card className="mb-8 shadow-xl border-gray-100">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.getStarted}</h3>
                <p className="text-gray-600 mb-6">
                  {t.scanQR}
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.orVisit}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={qrData?.url || 'Loading...'}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-mono"
                    />
                    <Button onClick={copyToClipboard} size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl">
                  {qrData ? (
                    <QRCode value={qrData.url} size={200} />
                  ) : (
                    <div className="w-48 h-48 bg-gray-200 rounded-lg animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.features.timer.title}</h3>
              <p className="text-gray-600">{t.features.timer.description}</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">🔥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.features.reactions.title}</h3>
              <p className="text-gray-600">{t.features.reactions.description}</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.features.polls.title}</h3>
              <p className="text-gray-600">{t.features.polls.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <Link href="/host">
            <Button size="lg" className="mr-4">
              <Monitor className="w-5 h-5 mr-2" />
              {t.launchHost}
            </Button>
          </Link>
          <Link href="/remote">
            <Button variant="secondary" size="lg">
              <Smartphone className="w-5 h-5 mr-2" />
              {t.openRemote}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
