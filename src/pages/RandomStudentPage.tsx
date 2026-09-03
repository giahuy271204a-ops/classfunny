import React, { useState, useEffect, useRef } from 'react';
import {
  Dices,
  RotateCcw,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  Settings2,
  Volume2,
  Flame,
  Shuffle,
} from 'lucide-react';
import { ClassRoom, Student } from '../types';
import { SoundEffects } from '../lib/sound';
import { fireConfetti, fireSuperConfetti } from '../lib/confetti';

interface RandomStudentPageProps {
  activeClass: ClassRoom | null;
  onLogActivity: (title: string, details?: string) => void;
  onAwardPointsToTeam?: (points: number) => void;
}

export const RandomStudentPage: React.FC<RandomStudentPageProps> = ({
  activeClass,
  onLogActivity,
}) => {
  // Active eligible students (excluding absent)
  const availableStudents = activeClass?.students.filter((s) => !s.isAbsent) || [];

  // Modes: normal vs no-repeat
  const [noRepeatMode, setNoRepeatMode] = useState(true);
  const [pickedIds, setPickedIds] = useState<string[]>([]);

  // Multi-pick count
  const [pickCount, setPickCount] = useState<number>(1);

  // Animation states
  const [isRolling, setIsRolling] = useState(false);
  const [displayName, setDisplayName] = useState<string>('Bấm "Quay ngẫu nhiên" để bắt đầu');
  const [winners, setWinners] = useState<Student[]>([]);
  const rollIntervalRef = useRef<number | null>(null);

  // Pool of students currently eligible
  const eligiblePool = noRepeatMode
    ? availableStudents.filter((s) => !pickedIds.includes(s.id))
    : availableStudents;

  // Cleanup rolling on unmount
  useEffect(() => {
    return () => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    };
  }, []);

  const handleStartRandom = () => {
    if (eligiblePool.length === 0) {
      alert('Tất cả học sinh đã được gọi! Vui lòng bấm "Đặt lại danh sách" để bắt đầu vòng mới.');
      return;
    }

    const countToPick = Math.min(pickCount, eligiblePool.length);
    setIsRolling(true);
    setWinners([]);

    let step = 0;
    const totalSteps = 28; // rolling cycles
    let currentSpeed = 50;

    const runRollStep = () => {
      step++;
      // Pick a random candidate for visual roll
      const randomCandidate = eligiblePool[Math.floor(Math.random() * eligiblePool.length)];
      setDisplayName(randomCandidate.name);
      SoundEffects.tick(1 + (step / totalSteps) * 0.5);

      if (step < totalSteps) {
        currentSpeed += 6; // slow down gradually
        rollIntervalRef.current = window.setTimeout(runRollStep, currentSpeed);
      } else {
        // Final selection
        const shuffled = [...eligiblePool].sort(() => 0.5 - Math.random());
        const selectedWinners = shuffled.slice(0, countToPick);

        setWinners(selectedWinners);
        setDisplayName(selectedWinners.map((w) => w.name).join(', '));
        setIsRolling(false);

        if (noRepeatMode) {
          setPickedIds((prev) => [...prev, ...selectedWinners.map((w) => w.id)]);
        }

        SoundEffects.win();
        fireSuperConfetti();

        onLogActivity(
          `Gọi ngẫu nhiên: ${selectedWinners.map((w) => w.name).join(', ')}`,
          `Lớp ${activeClass?.name} (${noRepeatMode ? 'Không lặp' : 'Bình thường'})`
        );
      }
    };

    runRollStep();
  };

  const handleResetPicked = () => {
    SoundEffects.click();
    setPickedIds([]);
    setWinners([]);
    setDisplayName('Đã đặt lại danh sách quay!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
            <Dices className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              Gọi tên ngẫu nhiên
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                Lớp {activeClass?.name || 'Chưa chọn'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vòng quay gọi tên học sinh trả lời câu hỏi, phát biểu bài hoặc nhận thử thách
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-slate-800 dark:text-slate-200">
            {noRepeatMode ? (
              <>
                Đã chọn: <span className="text-blue-600 dark:text-blue-400 font-black">{pickedIds.length}</span> / {availableStudents.length} HS
              </>
            ) : (
              <>Sẵn sàng: {availableStudents.length} HS</>
            )}
          </span>
        </div>
      </div>

      {/* Main Stage Display Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-12 shadow-xl border border-slate-800 text-center relative overflow-hidden">
        {/* Glow backdrop decoration */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Status label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest text-blue-200 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          {isRolling ? 'Đang quay ngẫu nhiên...' : winners.length > 0 ? 'Chúc mừng bạn!' : 'Học sinh may mắn'}
        </div>

        {/* Rolling Names Box */}
        <div className="min-h-[160px] sm:min-h-[220px] flex items-center justify-center p-4">
          {winners.length > 0 && !isRolling ? (
            <div className="animate-in zoom-in-90 duration-200 space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-4">
                {winners.map((winner, idx) => (
                  <div
                    key={winner.id}
                    className="p-4 sm:p-6 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 transform hover:scale-105 transition-transform"
                  >
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-100 opacity-90 mb-1">
                      🎉 Học sinh #{idx + 1}
                    </div>
                    <div className="font-sans font-black text-2xl sm:text-4xl tracking-tight">
                      {winner.name}
                    </div>
                    {winner.code && (
                      <div className="text-xs font-mono font-bold text-blue-100 mt-1">
                        Mã: {winner.code}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`font-sans font-black text-3xl sm:text-5xl md:text-6xl tracking-tight transition-all ${
                isRolling
                  ? 'text-sky-300 scale-105 animate-pulse'
                  : 'text-white'
              }`}
            >
              {displayName}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleStartRandom}
            disabled={isRolling || eligiblePool.length === 0}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-sans font-black text-base text-white shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 ${
              isRolling || eligiblePool.length === 0
                ? 'bg-slate-700 opacity-60 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-md shadow-blue-500/30 active:scale-95'
            }`}
          >
            <Dices className={`w-6 h-6 ${isRolling ? 'animate-spin' : ''}`} />
            {isRolling ? 'Đang quay...' : '🎲 QUAY NGẪU NHIÊN'}
          </button>

          {noRepeatMode && pickedIds.length > 0 && (
            <button
              onClick={handleResetPicked}
              className="px-5 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              title="Đặt lại danh sách đã chọn"
            >
              <RotateCcw className="w-4 h-4" />
              Đặt lại vòng quay ({pickedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Control Settings Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode Selector */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Chế độ quay
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                SoundEffects.click();
                setNoRepeatMode(false);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                !noRepeatMode
                  ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-200 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <p className="text-xs font-bold">1. Bình thường</p>
              <p className="text-[11px] opacity-80 mt-0.5">Một học sinh có thể được gọi nhiều lần</p>
            </button>

            <button
              onClick={() => {
                SoundEffects.click();
                setNoRepeatMode(true);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                noRepeatMode
                  ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-200 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <p className="text-xs font-bold">2. Không lặp lại ⭐</p>
              <p className="text-[11px] opacity-80 mt-0.5">Mỗi học sinh chỉ được gọi 1 lần mỗi đợt</p>
            </button>
          </div>
        </div>

        {/* Multi-student picker */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Số học sinh cần chọn cùng lúc
          </h4>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => {
                  SoundEffects.click();
                  setPickCount(num);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pickCount === num
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                {num} HS
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Chọn 1 hoặc nhiều bạn đồng thời (ví dụ: gọi 3 bạn lên bảng làm 3 bài tập).
          </p>
        </div>
      </div>

      {/* History of picked in this session */}
      {noRepeatMode && pickedIds.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400">
              Danh sách đã được gọi ({pickedIds.length} học sinh)
            </h4>
            <button
              onClick={handleResetPicked}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
            >
              Xóa lịch sử gọi
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {pickedIds.map((id, index) => {
              const student = availableStudents.find((s) => s.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 text-[10px] flex items-center justify-center font-bold text-blue-700 dark:text-blue-300">
                    {index + 1}
                  </span>
                  {student?.name || 'Học sinh'}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
