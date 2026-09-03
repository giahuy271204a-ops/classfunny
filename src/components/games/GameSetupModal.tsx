import React, { useState, useEffect, useMemo } from 'react';
import {
  X, Play, Settings2, Sliders, Layers, Clock, Award,
  Shuffle, Bookmark, Check, AlertCircle, Users, Star,
  HelpCircle, ChevronRight, Save, RotateCcw
} from 'lucide-react';
import { GamePreset, GameSetupConfig, QuestionSet, QuizQuestion, TeamScore } from '../../types';

interface GameSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (preparedQuestions: QuizQuestion[], config: GameSetupConfig) => void;
  gameId: string;
  gameName: string;
  gameIcon?: string;
  allQuestions: QuizQuestion[];
  questionSets: QuestionSet[];
  teams: TeamScore[];
  presets: GamePreset[];
  onSavePreset?: (preset: GamePreset) => void;
}

export const GameSetupModal: React.FC<GameSetupModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
  gameId,
  gameName,
  gameIcon = '🎮',
  allQuestions,
  questionSets,
  teams,
  presets,
  onSavePreset,
}) => {
  // Source selection
  const [source, setSource] = useState<'all' | 'set' | 'favorite'>('all');
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulties, setDifficulties] = useState<('easy' | 'medium' | 'hard')[]>(['easy', 'medium', 'hard']);
  const [randomQuestions, setRandomQuestions] = useState<boolean>(true);
  const [randomOrder, setRandomOrder] = useState<boolean>(true);
  const [randomOptions, setRandomOptions] = useState<boolean>(true);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(30); // 0 = no timer
  const [pointsCorrect, setPointsCorrect] = useState<number>(10);
  const [pointsWrong, setPointsWrong] = useState<number>(0);

  // Preset modal state
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetSuccess, setPresetSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (questionSets.length > 0 && !selectedSetId) {
      setSelectedSetId(questionSets[0].id);
    }
  }, [questionSets, selectedSetId]);

  // Filter available pool
  const candidateQuestions = useMemo(() => {
    let list = [...allQuestions];

    if (source === 'set' && selectedSetId) {
      list = list.filter((q) => q.setId === selectedSetId);
    } else if (source === 'favorite') {
      list = list.filter((q) => q.isFavorite);
    }

    if (difficulties.length > 0) {
      list = list.filter((q) => !q.difficulty || difficulties.includes(q.difficulty));
    }

    return list;
  }, [allQuestions, source, selectedSetId, difficulties]);

  const toggleDifficulty = (diff: 'easy' | 'medium' | 'hard') => {
    if (difficulties.includes(diff)) {
      if (difficulties.length > 1) {
        setDifficulties(difficulties.filter((d) => d !== diff));
      }
    } else {
      setDifficulties([...difficulties, diff]);
    }
  };

  const handleApplyPreset = (preset: GamePreset) => {
    const cfg = preset.config;
    setSource(cfg.source === 'set' ? 'set' : 'all');
    if (cfg.setId) setSelectedSetId(cfg.setId);
    setQuestionCount(cfg.questionCount || 10);
    setDifficulties(cfg.difficulties || ['easy', 'medium', 'hard']);
    setRandomQuestions(cfg.randomQuestions ?? true);
    setRandomOrder(cfg.randomOrder ?? true);
    setRandomOptions(cfg.randomOptions ?? true);
    setTimePerQuestion(cfg.timePerQuestion ?? 30);
    setPointsCorrect(cfg.pointsCorrect ?? 10);
    setPointsWrong(cfg.pointsWrong ?? 0);
  };

  const handleSaveCurrentPreset = () => {
    if (!presetName.trim() || !onSavePreset) return;
    const newPreset: GamePreset = {
      id: `preset-${Date.now()}`,
      name: presetName.trim(),
      gameId,
      config: {
        gameId,
        gameName,
        source: source === 'set' ? 'set' : 'all',
        setId: source === 'set' ? selectedSetId : undefined,
        questionCount,
        difficulties,
        randomQuestions,
        randomOrder,
        randomOptions,
        timePerQuestion,
        pointsCorrect,
        pointsWrong,
      },
      createdAt: Date.now(),
    };
    onSavePreset(newPreset);
    setShowSavePreset(false);
    setPresetName('');
    setPresetSuccess('Đã lưu cấu hình preset thành công!');
    setTimeout(() => setPresetSuccess(null), 2500);
  };

  const handleStart = () => {
    let pool = [...candidateQuestions];

    if (pool.length === 0) {
      // Fallback to all questions if filter yielded 0
      pool = [...allQuestions];
    }

    // Shuffle pool if requested
    if (randomQuestions || randomOrder) {
      pool = pool.sort(() => Math.random() - 0.5);
    }

    // Slice to questionCount
    const selected = pool.slice(0, Math.min(questionCount, pool.length));

    // Process questions: customize points, options shuffling if multiple-choice
    const prepared = selected.map((q) => {
      let finalOpts = q.options ? [...q.options] : undefined;
      let finalAns = q.answer;

      if (randomOptions && finalOpts && (q.type === 'multiple-choice' || q.type === 'multiple') && typeof q.answer === 'number') {
        const originalCorrectAnswerText = finalOpts[q.answer];
        // Shuffle options
        finalOpts = finalOpts.sort(() => Math.random() - 0.5);
        finalAns = finalOpts.indexOf(originalCorrectAnswerText);
      }

      return {
        ...q,
        points: pointsCorrect,
        options: finalOpts,
        answer: finalAns,
      };
    });

    const config: GameSetupConfig = {
      gameId,
      gameName,
      source: source === 'set' ? 'set' : 'all',
      setId: source === 'set' ? selectedSetId : undefined,
      questionCount: prepared.length,
      difficulties,
      randomQuestions,
      randomOrder,
      randomOptions,
      timePerQuestion,
      pointsCorrect,
      pointsWrong,
    };

    onStartGame(prepared, config);
    onClose();
  };

  if (!isOpen) return null;

  const relevantPresets = presets.filter((p) => p.gameId === gameId || p.config?.gameId === gameId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              {gameIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">Cài Đặt Trò Chơi: {gameName}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  ⚙️ Setup Mode
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tùy chỉnh ngân hàng câu hỏi, luật tính điểm và thời gian trước khi chiếu cho lớp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {presetSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200">
              <Check className="w-4 h-4 shrink-0" />
              <span>{presetSuccess}</span>
            </div>
          )}

          {/* Quick Preset Selector */}
          {relevantPresets.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                  Cấu hình mẫu đã lưu (Presets):
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {relevantPresets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>⚡ {p.name}</span>
                    <span className="text-[10px] text-slate-400">({p.config.questionCount} câu)</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 1. Question Source */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              1. Chọn nguồn câu hỏi
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSource('all')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  source === 'all'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-5 h-5 mb-1 text-blue-600" />
                <span className="text-xs font-bold">Toàn bộ ngân hàng</span>
                <span className="text-[10px] text-slate-400">({allQuestions.length} câu hỏi)</span>
              </button>

              <button
                type="button"
                onClick={() => setSource('set')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  source === 'set'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-5 h-5 mb-1 text-emerald-600" />
                <span className="text-xs font-bold">Theo Bộ câu hỏi</span>
                <span className="text-[10px] text-slate-400">({questionSets.length} bộ có sẵn)</span>
              </button>

              <button
                type="button"
                onClick={() => setSource('favorite')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  source === 'favorite'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Star className="w-5 h-5 mb-1 text-amber-500 fill-amber-400" />
                <span className="text-xs font-bold">Câu hỏi Yêu thích ⭐</span>
                <span className="text-[10px] text-slate-400">
                  ({allQuestions.filter((q) => q.isFavorite).length} câu)
                </span>
              </button>
            </div>

            {/* If Set source selected, show dropdown */}
            {source === 'set' && (
              <div className="pt-2">
                <select
                  value={selectedSetId}
                  onChange={(e) => setSelectedSetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium bg-white text-slate-800 focus:border-blue-500 outline-none"
                >
                  {questionSets.map((s) => {
                    const count = allQuestions.filter((q) => q.setId === s.id).length;
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} - [{s.subject}] ({count} câu hỏi)
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>

          {/* 2. Filters & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  2. Số lượng câu sẽ chơi
                </label>
                <span className="text-xs text-blue-600 font-bold">
                  Khả dụng: {candidateQuestions.length} câu
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      questionCount === num
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {num} câu
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span>Hoặc tự nhập:</span>
                <input
                  type="number"
                  min="1"
                  max={Math.max(candidateQuestions.length, 50)}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Math.max(1, Number(e.target.value)))}
                  className="w-20 px-2.5 py-1 rounded-md border border-slate-200 text-slate-800 font-bold text-center"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                3. Lọc theo độ khó
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleDifficulty('easy')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                    difficulties.includes('easy')
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100'
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  Dễ
                </button>
                <button
                  type="button"
                  onClick={() => toggleDifficulty('medium')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                    difficulties.includes('medium')
                      ? 'border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-100'
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  Vừa
                </button>
                <button
                  type="button"
                  onClick={() => toggleDifficulty('hard')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                    difficulties.includes('hard')
                      ? 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-100'
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  Khó
                </button>
              </div>
            </div>
          </div>

          {/* 3. Random & Shuffle Rules */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              4. Cơ chế ngẫu nhiên & xáo trộn
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={randomQuestions}
                  onChange={(e) => setRandomQuestions(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-700">Lấy câu hỏi ngẫu nhiên</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={randomOrder}
                  onChange={(e) => setRandomOrder(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-700">Xáo trộn thứ tự câu hỏi</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={randomOptions}
                  onChange={(e) => setRandomOptions(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-700">Xáo trộn đáp án A, B, C, D</span>
              </label>
            </div>
          </div>

          {/* 4. Timer & Scoring Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Thời gian mỗi câu
              </label>
              <select
                value={timePerQuestion}
                onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white font-medium focus:border-blue-500 outline-none"
              >
                <option value={0}>Không giới hạn (Tự bấm chuyển)</option>
                <option value={15}>15 giây (Thử thách siêu tốc)</option>
                <option value={20}>20 giây (Nhanh)</option>
                <option value={30}>30 giây (Tiêu chuẩn)</option>
                <option value={45}>45 giây (Vừa phải)</option>
                <option value={60}>60 giây (Thoải mái suy nghĩ)</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                Điểm cộng khi đúng
              </label>
              <input
                type="number"
                value={pointsCorrect}
                onChange={(e) => setPointsCorrect(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white font-bold text-emerald-600 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                <Award className="w-3.5 h-3.5 text-red-600" />
                Điểm phạt khi sai
              </label>
              <input
                type="number"
                value={pointsWrong}
                onChange={(e) => setPointsWrong(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white font-bold text-red-600 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Save Preset Section */}
          {showSavePreset ? (
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center gap-3 animate-in fade-in duration-150">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Nhập tên mẫu cấu hình (VD: Tiết 3 - 11A1)..."
                className="flex-1 px-3 py-2 rounded-lg border border-blue-200 text-sm bg-white text-slate-800 outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleSaveCurrentPreset}
                disabled={!presetName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Lưu lại
              </button>
              <button
                type="button"
                onClick={() => setShowSavePreset(false)}
                className="px-3 py-2 text-slate-500 hover:bg-slate-200 text-xs font-semibold rounded-lg"
              >
                Hủy
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Muốn dùng lại cấu hình này cho các tiết sau?</span>
              <button
                type="button"
                onClick={() => setShowSavePreset(true)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Lưu thành Preset
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <div className="text-xs text-slate-500">
            Sẽ chuẩn bị <b>{Math.min(questionCount, candidateQuestions.length || allQuestions.length)} câu hỏi</b> cho trận đấu.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Bắt Đầu Trò Chơi Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
