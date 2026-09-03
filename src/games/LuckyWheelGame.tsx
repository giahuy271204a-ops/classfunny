import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, ArrowLeft, Volume2, Sparkles, Users, Award, Play } from 'lucide-react';
import { ClassRoom } from '../types';
import { SoundEffects } from '../lib/sound';
import { fireConfetti, fireSuperConfetti } from '../lib/confetti';

interface LuckyWheelGameProps {
  activeClass: ClassRoom | null;
  onBack: () => void;
  onLogActivity: (title: string, details?: string) => void;
}

const DEFAULT_REWARDS = [
  '⭐ +10 Điểm',
  '🍬 Kẹo mút',
  '👏 Tràng pháo tay',
  '❓ Trả lời 1 câu',
  '🌟 +20 Điểm',
  '🎁 Hộp quà bí mật',
  '🎤 Hát 1 câu',
  '🍀 Nhân đôi điểm',
];

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#10b981',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#14b8a6', '#6366f1', '#d946ef', '#84cc16'
];

export const LuckyWheelGame: React.FC<LuckyWheelGameProps> = ({
  activeClass,
  onBack,
  onLogActivity,
}) => {
  const availableStudents = activeClass?.students.filter((s) => !s.isAbsent) || [];

  // Mode: Wheel of Students or Wheel of Rewards
  const [wheelMode, setWheelMode] = useState<'students' | 'rewards'>('students');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Slices
  const items = wheelMode === 'students' && availableStudents.length > 0
    ? availableStudents.map((s) => s.name)
    : DEFAULT_REWARDS;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationAngleRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Draw wheel on canvas
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 15;
    const centerX = width / 2;
    const centerY = height / 2;
    const numSlices = items.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    // Draw slices
    items.forEach((item, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = COLORS[index % COLORS.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Text
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = numSlices > 16 ? 'bold 11px sans-serif' : 'bold 14px sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 3;

      // Truncate if long
      const textToDraw = item.length > 18 ? item.substring(0, 16) + '...' : item;
      ctx.fillText(textToDraw, radius - 20, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e1b4b';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', 0, 1);

    ctx.restore();
  };

  useEffect(() => {
    drawWheel(rotationAngleRef.current);
  }, [items, wheelMode]);

  const handleSpin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    const spinDuration = 4500; // ms
    const startAngle = rotationAngleRef.current;
    // random extra turns: 5 to 9 full spins + random offset
    const totalExtraRotation = (5 + Math.random() * 4) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const targetAngle = startAngle + totalExtraRotation;
    const startTime = performance.now();

    let lastTickAngle = startAngle;
    const numSlices = items.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    const animateSpin = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + (targetAngle - startAngle) * easeOut;
      rotationAngleRef.current = currentAngle;

      // Play tick sound when passing slice
      if (Math.abs(currentAngle - lastTickAngle) >= sliceAngle) {
        SoundEffects.tick(1.2);
        lastTickAngle = currentAngle;
      }

      drawWheel(currentAngle);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateSpin);
      } else {
        setIsSpinning(false);
        // Calculate landed item (indicator is at the top, angle 3*PI/2)
        const normalizedAngle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        // The pointer is at angle 0 (3 o'clock) or top (270 deg)
        // Since pointer is at the top (angle = -PI/2 or 3*PI/2)
        const pointerAngle = (3 * Math.PI) / 2;
        const relativeAngle = (pointerAngle - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
        const winningIndex = Math.floor(relativeAngle / sliceAngle) % numSlices;

        const winResult = items[winningIndex] || items[0];
        setWinner(winResult);
        SoundEffects.win();
        fireSuperConfetti();

        onLogActivity(`Vòng quay may mắn: ${winResult}`, `Chế độ: ${wheelMode === 'students' ? 'Học sinh' : 'Phần thưởng'}`);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateSpin);
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              SoundEffects.click();
              setWheelMode('students');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              wheelMode === 'students'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Quay Học Sinh ({availableStudents.length})
          </button>
          <button
            onClick={() => {
              SoundEffects.click();
              setWheelMode('rewards');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              wheelMode === 'rewards'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Quay Phần Thưởng / Thử Thách
          </button>
        </div>
      </div>

      {/* Main Wheel Board */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl text-center flex flex-col items-center">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-1">
          🎡 VÒNG QUAY MAY MẮN
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          {wheelMode === 'students'
            ? `Vòng quay chứa tên các học sinh lớp ${activeClass?.name || ''}`
            : 'Vòng quay chứa các phần thưởng & nhiệm vụ hấp dẫn'}
        </p>

        {/* Wheel container with pointer */}
        <div className="relative my-2 inline-block">
          {/* Pointer needle at top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 pointer-events-none drop-shadow-md">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-400 animate-pulse" />
          </div>

          <canvas
            ref={canvasRef}
            width={440}
            height={440}
            className="max-w-[320px] sm:max-w-[420px] h-auto rounded-full shadow-2xl border-4 border-white dark:border-slate-800"
          />
        </div>

        {/* Winner announcement */}
        {winner && (
          <div className="my-6 p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white shadow-xl animate-in zoom-in-95 duration-200">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-100 mb-1">
              🎉 KẾT QUẢ VÒNG QUAY
            </div>
            <div className="font-display font-black text-3xl sm:text-4xl tracking-tight">
              {winner}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`px-10 py-4 rounded-2xl font-display font-black text-xl text-white shadow-xl transition-all cursor-pointer flex items-center gap-3 ${
              isSpinning
                ? 'bg-slate-400 opacity-70 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 via-amber-500 to-pink-500 hover:scale-105 shadow-orange-500/30'
            }`}
          >
            <Sparkles className="w-6 h-6 animate-spin" />
            {isSpinning ? 'ĐANG QUAY...' : 'QUAY NGAY 🎡'}
          </button>
        </div>
      </div>
    </div>
  );
};
