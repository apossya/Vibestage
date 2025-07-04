import { useState, useEffect } from 'react';
import { socketManager } from '@/lib/socket';

interface TimerProps {
  onComplete?: () => void;
  variant?: 'host' | 'mobile';
}

export default function Timer({ onComplete, variant = 'host' }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const handleTimerUpdate = (data: any) => {
      setTimeLeft(data.timeLeft);
      setIsRunning(data.isRunning);
      setProgress((data.timeLeft / 300) * 100);
    };

    const handleTimerComplete = () => {
      setIsRunning(false);
      onComplete?.();
    };

    socketManager.on('timer_update', handleTimerUpdate);
    socketManager.on('timer_complete', handleTimerComplete);

    return () => {
      socketManager.off('timer_update', handleTimerUpdate);
      socketManager.off('timer_complete', handleTimerComplete);
    };
  }, [onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClasses = () => {
    if (variant === 'mobile') {
      return 'text-4xl font-bold text-gray-900 mb-2 font-mono';
    }
    return 'text-8xl font-black text-white mb-4 font-mono tracking-wider';
  };

  const getContainerClasses = () => {
    if (variant === 'mobile') {
      return 'bg-white rounded-2xl shadow-lg p-6 border border-gray-100';
    }
    return 'timer-glow bg-black/30 backdrop-blur-md rounded-3xl p-12 mb-8 border border-white/20';
  };

  const getStatusText = () => {
    if (timeLeft === 0) return 'Time\'s up!';
    if (isRunning) return 'Running...';
    return 'Ready to start';
  };

  return (
    <div className={getContainerClasses()}>
      <div className="text-center">
        <div className={getTimerClasses()}>
          {formatTime(timeLeft)}
        </div>
        <div className={variant === 'mobile' ? 'text-sm text-gray-600' : 'text-xl text-white/80 font-medium'}>
          {getStatusText()}
        </div>
        
        {/* Progress Bar */}
        <div className={`${variant === 'mobile' ? 'w-full h-2 bg-gray-200' : 'w-96 h-3 bg-white/20'} rounded-full mt-6 overflow-hidden mx-auto`}>
          <div 
            className={`h-full ${variant === 'mobile' ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gradient-to-r from-success to-accent'} rounded-full transition-all duration-1000`}
            style={{ width: `${100 - progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
