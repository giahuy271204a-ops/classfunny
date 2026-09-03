import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Timer,
  Users,
  Bell,
  Sparkles,
  Award,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { ClassRoom } from '../types';
import { SoundEffects } from '../lib/sound';
import { fireConfetti } from '../lib/confetti';

interface FastestFingerGameProps {
  activeClass: ClassRoom | null;
  onBack: () => void;
  onLogActivity: (title: string, details?: string) => void;
}

const SAMPLE_SPEED_QUESTIONS = [
  'Kể tên 5 con vật sống dưới nước trong 10 giây!',
  'Hãy đọc xuôi và đọc ngược từ "RADAR" thật nhanh!',
  'Tìm một đồ vật màu vàng trong phòng học này ngay lập tức!',
  'Viết nhanh kết quả của phép tính: 15 × 12 = ?',
  'Kể tên 3 hành tinh gần Mặt Trời nhất theo thứ tự!',
  'Hát một câu hát có từ "Mùa Hè" hoặc "Thầy Cô"!',
  'Nêu 3 thành phần chính của một trang web!',
];

export const FastestFingerGame: React.FC<FastestFingerGameProps> = ({
  activeClass,
  onBack,
  onLogActivity,
}) => {
  const availableStudents = activeClass?.students.filter((s) => !s.isAbsent) || [];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [buzzedContestant, setBuzzedContestant] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  const currentPrompt = SAMPLE_SPEED_QUESTIONS[questionIndex % SAMPLE_SPEED_QUESTIONS.length];

  useEffect(() => {
    if (isRunning && timerSeconds > 0) {
      timerRef.current = window.setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsTimeUp(true);
            SoundEffects.timeUp();
            return 0;
          }
          if (prev <= 5) SoundEffects.tick(1.6);
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timerSeconds]);

  const handleStartTimer = () => {
    SoundEffects.click();
    setIsRunning(true);
    setIsTimeUp(false);
  };

  const handleBuzzIn = () => {
    if (availableStudents.length === 0) return;
    SoundEffects.win();
    fireConfetti();
    setIsRunning(false);

    const randomContestant =
      availableStudents[Math.floor(Math.random() * availableStudents.length)];
    setBuzzedContestant(randomContestant.name);

    onLogActivity(`Ai Nhanh Hơn: ${randomContestant.name} bấm chuông giành quyền!`);
  };

  const handleNextQuestion = () => {
    SoundEffects.click();
    setQuestionIndex((prev) => prev + 1);
    setTimerSeconds(15);
    setIsRunning(false);
    setIsTimeUp(false);
    setBuzzedContestant(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Kho trò chơi
        </button>

        <button
          onClick={handleNextQuestion}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          Câu hỏi tiếp theo ➔
        </button>
      </div>

      {/* Main Board */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xl text-center flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold text-xs uppercase tracking-wider mb-4">
          <Flame className="w-4 h-4 text-orange-500" />
          FASTEST FINGER • AI NHANH HƠN
        </span>

        <h3 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white max-w-2xl mx-auto mb-8 leading-relaxed">
          "{currentPrompt}"
        </h3>

        {/* Big Countdown Badge */}
        <div
          className={`w-40 h-40 rounded-full flex flex-col items-center justify-center font-display font-black text-6xl shadow-2xl transition-all ${
            isTimeUp
              ? 'bg-rose-500 text-white animate-bounce'
              : timerSeconds <= 5
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-slate-900 text-white dark:bg-indigo-600'
          }`}
        >
          {isTimeUp ? (
            <div className="text-center">
              <span className="text-3xl block">⏰</span>
              <span className="text-sm font-bold">HẾT GIỜ!</span>
            </div>
          ) : (
            <>
              <span>{timerSeconds}</span>
              <span className="text-xs font-sans uppercase tracking-widest opacity-80">Giây</span>
            </>
          )}
        </div>

        {/* Buzzed Contestant Winner */}
        {buzzedContestant && (
          <div className="my-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl animate-in zoom-in-95">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              🔔 GIÀNH QUYỀN TRẢ LỜI ĐẦU TIÊN
            </span>
            <div className="font-display font-black text-3xl sm:text-4xl mt-1">
              🎉 {buzzedContestant}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleStartTimer}
            disabled={isRunning}
            className={`px-6 py-3.5 rounded-2xl font-bold text-xs text-white shadow-md transition-all cursor-pointer ${
              isRunning ? 'bg-slate-400 opacity-60' : 'bg-slate-900 dark:bg-slate-700 hover:bg-slate-800'
            }`}
          >
            ⏱ Bắt đầu đếm ngược 15s
          </button>

          <button
            onClick={handleBuzzIn}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-display font-black text-lg shadow-xl shadow-rose-500/25 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
          >
            <Bell className="w-5 h-5 animate-bounce" />
            🔔 BẤM CHUÔNG GIÀNH QUYỀN!
          </button>
        </div>
      </div>
    </div>
  );
};
