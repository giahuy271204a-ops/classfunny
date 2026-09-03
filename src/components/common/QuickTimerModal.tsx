import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Bell, AlertTriangle } from 'lucide-react';
import { SoundEffects } from '../../lib/sound';
import { fireConfetti } from '../../lib/confetti';

interface QuickTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickTimerModal: React.FC<QuickTimerModalProps> = ({ isOpen, onClose }) => {
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsTimeUp(true);
            SoundEffects.timeUp();
            fireConfetti();
            return 0;
          }
          if (prev <= 6) {
            SoundEffects.tick(1.5);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const setPreset = (sec: number) => {
    SoundEffects.click();
    setIsRunning(false);
    setIsTimeUp(false);
    setTotalSeconds(sec);
    setSecondsLeft(sec);
  };

  const handleStartPause = () => {
    SoundEffects.click();
    if (secondsLeft === 0) {
      setSecondsLeft(totalSeconds);
      setIsTimeUp(false);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    SoundEffects.click();
    setIsRunning(false);
    setIsTimeUp(false);
    setSecondsLeft(totalSeconds);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progressPercent = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;
  const isUrgent = isRunning && secondsLeft > 0 && secondsLeft <= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
              <Bell className="w-4 h-4" />
            </span>
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">
              Đồng hồ lớp học
            </h3>
          </div>
          <button
            onClick={() => {
              SoundEffects.click();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer display */}
        <div
          className={`py-6 my-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
            isTimeUp
              ? 'bg-rose-500 text-white animate-bounce'
              : isUrgent
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-blue-50/60 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-slate-900 dark:text-white'
          }`}
        >
          {isTimeUp ? (
            <div className="text-center font-sans">
              <div className="text-3xl font-extrabold mb-1">⏰ HẾT GIỜ!</div>
              <div className="text-sm font-medium opacity-90">Time's Up!</div>
            </div>
          ) : (
            <>
              <div className="font-bold text-5xl tracking-tight font-mono text-blue-600 dark:text-blue-400">
                {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </div>
              {isUrgent && (
                <div className="flex items-center gap-1 text-xs font-bold mt-1 text-white uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Sắp hết thời gian!
                </div>
              )}
            </>
          )}

          {/* Progress bar */}
          <div className="w-4/5 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isUrgent ? 'bg-white' : 'bg-blue-600 dark:bg-blue-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Preset buttons */}
        <div className="grid grid-cols-4 gap-1.5 my-4">
          {[
            { label: '30s', val: 30 },
            { label: '1m', val: 60 },
            { label: '2m', val: 120 },
            { label: '5m', val: 300 },
          ].map((p) => (
            <button
              key={p.val}
              onClick={() => setPreset(p.val)}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                totalSeconds === p.val && !isRunning
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartPause}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white shadow-sm transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                Tạm dừng
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                {secondsLeft === 0 ? 'Chạy lại' : 'Bắt đầu'}
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Đặt lại"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
