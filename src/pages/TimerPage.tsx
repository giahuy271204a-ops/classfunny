import React, { useState, useEffect, useRef } from 'react';
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Minimize,
  Bell,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { SoundEffects } from '../lib/sound';
import { fireConfetti, fireSuperConfetti } from '../lib/confetti';

interface TimerPageProps {
  onLogActivity: (title: string, details?: string) => void;
}

export const TimerPage: React.FC<TimerPageProps> = ({ onLogActivity }) => {
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('2');
  const [customSeconds, setCustomSeconds] = useState('0');
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
            fireSuperConfetti();
            onLogActivity('Đồng hồ đếm ngược kết thúc', 'Hết giờ!');
            return 0;
          }
          if (prev <= 6) {
            SoundEffects.tick(1.6);
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

  const handleSetPreset = (sec: number) => {
    SoundEffects.click();
    setIsRunning(false);
    setIsTimeUp(false);
    setTotalSeconds(sec);
    setSecondsLeft(sec);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10) || 0;
    const secs = parseInt(customSeconds, 10) || 0;
    const total = mins * 60 + secs;
    if (total > 0) {
      handleSetPreset(total);
    }
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
            <TimerIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              Đồng hồ đếm ngược lớp học
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Định giờ làm bài tập, thảo luận nhóm, thi đấu trò chơi có âm thanh báo động
            </p>
          </div>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { label: '10s', sec: 10 },
            { label: '30s', sec: 30 },
            { label: '1 phút', sec: 60 },
            { label: '3 phút', sec: 180 },
            { label: '5 phút', sec: 300 },
          ].map((p) => (
            <button
              key={p.sec}
              onClick={() => handleSetPreset(p.sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                totalSeconds === p.sec && !isRunning
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Big Projector Screen Stage */}
      <div
        className={`rounded-3xl p-8 sm:p-16 text-center shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center min-h-[380px] ${
          isTimeUp
            ? 'bg-rose-600 text-white animate-bounce'
            : isUrgent
            ? 'bg-amber-600 text-white animate-pulse'
            : 'bg-slate-950 text-white border border-slate-800'
        }`}
      >
        {/* Glow orb */}
        <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {isTimeUp ? (
          <div className="space-y-4 animate-in zoom-in-75 duration-200">
            <div className="text-6xl sm:text-8xl animate-bounce">⏰</div>
            <h1 className="font-sans font-black text-4xl sm:text-7xl tracking-tight uppercase">
              HẾT GIỜ!
            </h1>
            <p className="font-bold text-xl sm:text-2xl text-rose-100">TIME'S UP!</p>
          </div>
        ) : (
          <>
            {isUrgent && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest mb-4 animate-bounce">
                <AlertTriangle className="w-4 h-4 text-yellow-300" />
                Sắp hết thời gian! Khẩn trương!
              </div>
            )}

            {/* Giant Digits */}
            <div className="font-mono font-black text-6xl sm:text-9xl md:text-[11rem] tracking-tight select-none drop-shadow-lg text-white">
              {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>

            {/* Progress line */}
            <div className="w-full max-w-xl h-3.5 bg-white/20 rounded-full overflow-hidden mt-6 backdrop-blur-xs">
              <div
                className={`h-full transition-all duration-300 ${
                  isUrgent ? 'bg-amber-300' : 'bg-blue-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </>
        )}

        {/* Big Action Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={handleStartPause}
            className={`px-8 py-4 rounded-2xl font-sans font-black text-lg text-white shadow-xl transition-all cursor-pointer flex items-center gap-3 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 hover:scale-105'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                TẠM DỪNG
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                {secondsLeft === 0 ? 'CHẠY LẠI' : 'BẮT ĐẦU'}
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Đặt lại từ đầu"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Custom Duration Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <TimerIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Thiết lập thời gian tùy chỉnh
        </h4>

        <form onSubmit={handleApplyCustom} className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              max="60"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              className="w-20 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
            <span className="font-medium text-slate-500 dark:text-slate-400">phút</span>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              max="59"
              value={customSeconds}
              onChange={(e) => setCustomSeconds(e.target.value)}
              className="w-20 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
            <span className="font-medium text-slate-500 dark:text-slate-400">giây</span>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs shadow-blue-500/20 cursor-pointer"
          >
            Áp dụng thời gian này
          </button>
        </form>
      </div>
    </div>
  );
};
