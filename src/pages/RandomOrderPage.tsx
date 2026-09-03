import React, { useState } from 'react';
import {
  ListOrdered,
  Shuffle,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Users,
  Copy,
  Printer,
} from 'lucide-react';
import { ClassRoom, Student } from '../types';
import { SoundEffects } from '../lib/sound';
import { fireConfetti } from '../lib/confetti';

interface RandomOrderPageProps {
  activeClass: ClassRoom | null;
  onLogActivity: (title: string, details?: string) => void;
}

export const RandomOrderPage: React.FC<RandomOrderPageProps> = ({
  activeClass,
  onLogActivity,
}) => {
  const availableStudents = activeClass?.students.filter((s) => !s.isAbsent) || [];

  const [orderedStudents, setOrderedStudents] = useState<Student[]>(availableStudents);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [hasShuffled, setHasShuffled] = useState(false);

  const handleShuffleOrder = () => {
    if (availableStudents.length === 0) return;
    SoundEffects.dice();

    const shuffled = [...availableStudents].sort(() => 0.5 - Math.random());
    setOrderedStudents(shuffled);
    setCompletedIds(new Set());
    setHasShuffled(true);

    SoundEffects.win();
    fireConfetti();
    onLogActivity(
      `Bốc thăm thứ tự lớp ${activeClass?.name}`,
      `Tổng số: ${shuffled.length} học sinh`
    );
  };

  const handleToggleComplete = (id: string) => {
    SoundEffects.click();
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopyOrder = () => {
    SoundEffects.click();
    const text = orderedStudents
      .map((s, idx) => `${idx + 1}. ${s.name} ${s.code ? `(${s.code})` : ''}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    alert('Đã sao chép danh sách thứ tự vào bộ nhớ tạm!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
            <ListOrdered className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              Bốc thăm thứ tự học sinh
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                Lớp {activeClass?.name || 'Chưa chọn'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Xếp thứ tự thuyết trình, kiểm tra miệng hoặc lượt chơi ngẫu nhiên công bằng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasShuffled && (
            <button
              onClick={handleCopyOrder}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Sao chép danh sách"
            >
              <Copy className="w-3.5 h-3.5" />
              Sao chép
            </button>
          )}

          <button
            onClick={handleShuffleOrder}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
            🎲 BỐC THĂM THỨ TỰ
          </button>
        </div>
      </div>

      {/* Progress & Stats */}
      {hasShuffled && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs text-slate-900 dark:text-slate-100">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Tiến độ hoàn thành: {completedIds.size} / {orderedStudents.length} học sinh
          </div>
          <div className="w-48 h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-300"
              style={{
                width: `${orderedStudents.length ? (completedIds.size / orderedStudents.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="space-y-2">
          {orderedStudents.map((student, idx) => {
            const isDone = completedIds.has(student.id);

            return (
              <div
                key={student.id}
                onClick={() => handleToggleComplete(student.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isDone
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                    : 'bg-white hover:bg-blue-50/40 dark:bg-slate-850 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-sans font-black text-sm ${
                      idx === 0
                        ? 'bg-amber-500 text-white shadow-xs'
                        : idx === 1
                        ? 'bg-slate-400 text-white'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    #{idx + 1}
                  </div>

                  <div>
                    <span
                      className={`font-bold text-sm ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {student.name}
                    </span>
                    {student.code && (
                      <span className="ml-2 text-xs font-mono text-slate-400">
                        ({student.code})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isDone ? '✓ Đã xong' : 'Chưa xong'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
