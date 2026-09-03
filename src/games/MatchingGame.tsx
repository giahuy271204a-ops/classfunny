import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { SoundEffects } from '../lib/sound';
import { fireConfetti, fireSuperConfetti } from '../lib/confetti';

interface MatchingGameProps {
  onBack: () => void;
  onLogActivity: (title: string, details?: string) => void;
}

interface Pair {
  id: string;
  term: string;
  definition: string;
}

const DEFAULT_PAIRS: Pair[] = [
  { id: '1', term: 'HTML', definition: 'Ngôn ngữ đánh dấu tạo cấu trúc web' },
  { id: '2', term: 'CSS', definition: 'Định dạng màu sắc, giao diện và bố cục' },
  { id: '3', term: 'JavaScript', definition: 'Lập trình hành vi & tương tác động' },
  { id: '4', term: 'SQL', definition: 'Truy vấn cơ sở dữ liệu quan hệ' },
  { id: '5', term: 'Python', definition: 'Ngôn ngữ đa năng, phổ biến trong AI' },
];

export const MatchingGame: React.FC<MatchingGameProps> = ({
  onBack,
  onLogActivity,
}) => {
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [selectedDefId, setSelectedDefId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());

  // Shuffled definitions for the right column
  const [shuffledDefs, setShuffledDefs] = useState(() =>
    [...DEFAULT_PAIRS].sort(() => 0.5 - Math.random())
  );

  const handleSelectTerm = (id: string) => {
    if (matchedIds.has(id)) return;
    SoundEffects.click();
    setSelectedTermId(id);

    if (selectedDefId) {
      checkMatch(id, selectedDefId);
    }
  };

  const handleSelectDef = (id: string) => {
    if (matchedIds.has(id)) return;
    SoundEffects.click();
    setSelectedDefId(id);

    if (selectedTermId) {
      checkMatch(selectedTermId, id);
    }
  };

  const checkMatch = (termId: string, defId: string) => {
    if (termId === defId) {
      SoundEffects.win();
      fireConfetti();
      const updated = new Set(matchedIds);
      updated.add(termId);
      setMatchedIds(updated);
      setSelectedTermId(null);
      setSelectedDefId(null);

      if (updated.size === DEFAULT_PAIRS.length) {
        SoundEffects.win();
        fireSuperConfetti();
        onLogActivity('Hoàn thành xuất sắc Trò chơi Ghép Cặp!');
      }
    } else {
      SoundEffects.error();
      setTimeout(() => {
        setSelectedTermId(null);
        setSelectedDefId(null);
      }, 500);
    }
  };

  const handleReset = () => {
    SoundEffects.click();
    setMatchedIds(new Set());
    setSelectedTermId(null);
    setSelectedDefId(null);
    setShuffledDefs([...DEFAULT_PAIRS].sort(() => 0.5 - Math.random()));
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
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Chơi lại từ đầu
        </button>
      </div>

      {/* Main Board */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xl text-center">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-2">
          🧩 GHÉP CẶP KHÁI NIỆM (MATCHING)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
          Chọn 1 thuật ngữ ở Cột Trái rồi chọn định nghĩa tương ứng ở Cột Phải để ghép cặp!
        </p>

        {/* 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Column A: Terms */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
              Cột A: Thuật ngữ
            </h4>
            {DEFAULT_PAIRS.map((pair) => {
              const isMatched = matchedIds.has(pair.id);
              const isSelected = selectedTermId === pair.id;

              return (
                <button
                  key={pair.id}
                  onClick={() => handleSelectTerm(pair.id)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-2xl border-2 font-display font-bold text-base transition-all text-left flex items-center justify-between cursor-pointer ${
                    isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-200 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  <span>{pair.term}</span>
                  {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                </button>
              );
            })}
          </div>

          {/* Column B: Definitions */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
              Cột B: Định nghĩa & Ý nghĩa
            </h4>
            {shuffledDefs.map((pair) => {
              const isMatched = matchedIds.has(pair.id);
              const isSelected = selectedDefId === pair.id;

              return (
                <button
                  key={pair.id}
                  onClick={() => handleSelectDef(pair.id)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-2xl border-2 font-semibold text-xs leading-relaxed transition-all text-left flex items-center justify-between cursor-pointer min-h-[58px] ${
                    isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-200 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  <span>{pair.definition}</span>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Complete State */}
        {matchedIds.size === DEFAULT_PAIRS.length && (
          <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-base shadow-xl animate-in zoom-in-95">
            🎉 XUẤT SẮC! BẠN ĐÃ GHÉP ĐÚNG TOÀN BỘ CÁC CẶP KHÁI NIỆM!
          </div>
        )}
      </div>
    </div>
  );
};
