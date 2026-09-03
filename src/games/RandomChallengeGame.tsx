import React, { useState } from 'react';
import { ArrowLeft, Dices, RotateCcw, Sparkles, Award } from 'lucide-react';
import { SoundEffects } from '../lib/sound';
import { fireConfetti } from '../lib/confetti';

interface RandomChallengeGameProps {
  onBack: () => void;
  onLogActivity: (title: string, details?: string) => void;
}

const CHALLENGES = [
  { face: 1, title: 'Trả lời 1 câu hỏi', desc: 'Giáo viên hoặc lớp đặt 1 câu hỏi liên quan bài học để bạn trả lời.', pts: 10 },
  { face: 2, title: 'Hát 1 bài hát / Đọc thơ', desc: 'Hãy hát hoặc ngâm một đoạn thơ ngắn cho cả lớp cùng thưởng thức!', pts: 15 },
  { face: 3, title: 'Cộng 20 điểm miễn phí', desc: 'Siêu may mắn! Nhận ngay 20 điểm thưởng mà không cần thử thách nào!', pts: 20 },
  { face: 4, title: 'Chỉ định bạn khác', desc: 'Bạn được quyền chọn một bạn trong lớp thực hiện thử thách thay bạn.', pts: 10 },
  { face: 5, title: 'Đố vui nhanh trong 5s', desc: 'Kể tên 3 đồ vật có trong cặp sách của bạn trong 5 giây!', pts: 10 },
  { face: 6, title: 'Vũ điệu sôi động', desc: 'Thực hiện 3 động tác nhảy vui nhộn để khuấy động không khí cả lớp!', pts: 25 },
];

export const RandomChallengeGame: React.FC<RandomChallengeGameProps> = ({
  onBack,
  onLogActivity,
}) => {
  const [diceNumber, setDiceNumber] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [activeChallenge, setActiveChallenge] = useState(CHALLENGES[0]);

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const rand = Math.floor(Math.random() * 6) + 1;
      setDiceNumber(rand);
      SoundEffects.tick(1.3);

      if (step >= 18) {
        clearInterval(interval);
        const finalNum = Math.floor(Math.random() * 6) + 1;
        setDiceNumber(finalNum);
        setActiveChallenge(CHALLENGES[finalNum - 1]);
        setIsRolling(false);
        SoundEffects.win();
        fireConfetti();
        onLogActivity(`Lắc xúc xắc: Số ${finalNum} - ${CHALLENGES[finalNum - 1].title}`);
      }
    }, 70);
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
      </div>

      {/* Main Board */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xl text-center flex flex-col items-center">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-1">
          🎲 XÚC XẮC THỬ THÁCH
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
          Lắc viên xúc xắc may mắn để xác định thử thách dành cho học sinh hoặc đội chơi!
        </p>

        {/* 3D Dice Display */}
        <div
          className={`w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-2xl flex items-center justify-center font-display font-black text-6xl sm:text-7xl mb-8 border-4 border-white dark:border-slate-800 transition-all ${
            isRolling ? 'rotate-180 scale-110 animate-spin' : 'hover:scale-105'
          }`}
        >
          {diceNumber}
        </div>

        {/* Challenge details */}
        <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Thử thách mặt số {activeChallenge.face}
          </span>
          <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white mt-1 mb-2">
            {activeChallenge.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeChallenge.desc}
          </p>
          <div className="inline-block mt-3 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            +{activeChallenge.pts} Điểm thưởng
          </div>
        </div>

        {/* Roll Button */}
        <button
          onClick={handleRoll}
          disabled={isRolling}
          className={`px-8 py-4 rounded-2xl font-display font-black text-lg text-white shadow-xl transition-all cursor-pointer flex items-center gap-2 ${
            isRolling
              ? 'bg-slate-500 opacity-60'
              : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:scale-105 shadow-rose-500/25'
          }`}
        >
          <Dices className="w-6 h-6" />
          {isRolling ? 'ĐANG LẮC...' : '🎲 LẮC XÚC XẮC NGAY'}
        </button>
      </div>
    </div>
  );
};
