import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Target, Sparkles, Award } from 'lucide-react';
import { SoundEffects } from '../lib/sound';
import { fireConfetti, fireSuperConfetti } from '../lib/confetti';

interface BullseyeGameProps {
  onBack: () => void;
  onLogActivity: (title: string, details?: string) => void;
}

interface Hit {
  id: number;
  x: number;
  y: number;
  points: number;
}

export const BullseyeGame: React.FC<BullseyeGameProps> = ({
  onBack,
  onLogActivity,
}) => {
  const [hits, setHits] = useState<Hit[]>([]);
  const [lastHitScore, setLastHitScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);

  const handleTargetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    const maxRadius = rect.width / 2;
    let pts = 10;

    if (distance <= maxRadius * 0.15) {
      pts = 100; // Bullseye!
    } else if (distance <= maxRadius * 0.35) {
      pts = 60;
    } else if (distance <= maxRadius * 0.6) {
      pts = 40;
    } else if (distance <= maxRadius * 0.85) {
      pts = 20;
    } else {
      pts = 10;
    }

    if (pts >= 60) {
      SoundEffects.win();
      fireSuperConfetti();
    } else {
      SoundEffects.success();
      fireConfetti();
    }

    const newHit: Hit = {
      id: Date.now(),
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      points: pts,
    };

    setHits((prev) => [...prev, newHit]);
    setLastHitScore(pts);
    setTotalScore((prev) => prev + pts);

    onLogActivity(`Bắn bia trúng ${pts} điểm!`, `Tổng điểm bắn bia: ${totalScore + pts}`);
  };

  const handleResetTarget = () => {
    SoundEffects.click();
    setHits([]);
    setLastHitScore(null);
    setTotalScore(0);
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
          onClick={handleResetTarget}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Làm sạch bia bắn
        </button>
      </div>

      {/* Main Board */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl text-center flex flex-col items-center">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-1 flex items-center justify-center gap-2">
          🎯 BẮN BIA TÍNH ĐIỂM (BULLSEYE)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Nhấp chuột (hoặc chạm tay trên màn hình tương tác) để phóng phi tiêu vào tấm bia!
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-6">
          <div className="bg-amber-50 dark:bg-amber-950/40 px-4 py-2 rounded-2xl border border-amber-200 dark:border-amber-800">
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold block">
              Vừa bắn trúng
            </span>
            <span className="font-display font-black text-2xl text-amber-600 dark:text-amber-300">
              {lastHitScore !== null ? `+${lastHitScore} đ` : '--'}
            </span>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/40 px-4 py-2 rounded-2xl border border-indigo-200 dark:border-indigo-800">
            <span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-bold block">
              Tổng điểm lượt này
            </span>
            <span className="font-display font-black text-2xl text-indigo-600 dark:text-indigo-300">
              {totalScore} điểm
            </span>
          </div>
        </div>

        {/* Target Board */}
        <div
          onClick={handleTargetClick}
          className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full cursor-crosshair shadow-2xl border-4 border-slate-900 overflow-hidden flex items-center justify-center select-none"
          style={{
            background: 'radial-gradient(circle, #ef4444 0%, #ef4444 15%, #ffffff 15.1%, #ffffff 35%, #ef4444 35.1%, #ef4444 60%, #ffffff 60.1%, #ffffff 85%, #1e293b 85.1%, #1e293b 100%)',
          }}
        >
          {/* Ring Labels */}
          <span className="absolute text-[11px] font-black text-white font-mono top-4">10</span>
          <span className="absolute text-[11px] font-black text-slate-800 font-mono top-10">20</span>
          <span className="absolute text-[11px] font-black text-white font-mono top-16">40</span>
          <span className="absolute text-[11px] font-black text-slate-800 font-mono top-24">60</span>
          <span className="absolute text-sm font-black text-white font-mono z-10">100</span>

          {/* Darts / Hits */}
          {hits.map((hit) => (
            <div
              key={hit.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-in zoom-in-50 duration-150 z-20 flex flex-col items-center"
              style={{ left: `${hit.x}%`, top: `${hit.y}%` }}
            >
              <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-amber-950 shadow-md flex items-center justify-center text-[9px] font-black text-amber-950">
                🎯
              </div>
              <span className="text-[10px] font-black bg-black/80 text-amber-300 px-1.5 py-0.5 rounded-md mt-0.5 whitespace-nowrap">
                +{hit.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
