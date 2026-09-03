import React, { useState } from 'react';
import {
  Play, Pause, SkipForward, Eye, EyeOff, Plus, Minus,
  Maximize2, Minimize2, Settings, Trophy, ShieldAlert,
  ChevronUp, ChevronDown, RotateCcw
} from 'lucide-react';
import { TeamScore } from '../../types';

interface TeacherControlBarProps {
  isPaused?: boolean;
  onTogglePause?: () => void;
  onNextQuestion?: () => void;
  onSkipQuestion?: () => void;
  showAnswer?: boolean;
  onToggleShowAnswer?: () => void;
  teams?: TeamScore[];
  onUpdateScore?: (teamId: string, delta: number) => void;
  presentationMode?: boolean;
  onTogglePresentationMode?: () => void;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  timerSeconds?: number;
}

export const TeacherControlBar: React.FC<TeacherControlBarProps> = ({
  isPaused = false,
  onTogglePause,
  onNextQuestion,
  onSkipQuestion,
  showAnswer = false,
  onToggleShowAnswer,
  teams = [],
  onUpdateScore,
  presentationMode = false,
  onTogglePresentationMode,
  currentQuestionIndex = 0,
  totalQuestions = 0,
  timerSeconds,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showScoreModal, setShowScoreModal] = useState(false);

  // In presentation mode, we only show a tiny floating trigger button in the corner for the teacher
  if (presentationMode) {
    return (
      <div className="fixed bottom-3 right-3 z-50">
        <button
          onClick={onTogglePresentationMode}
          className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg backdrop-blur-xs text-xs flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-all cursor-pointer"
          title="Thoát chế độ trình chiếu (Hiện bảng điều khiển)"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px]">Bảng GV</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 text-white border-t border-slate-700 shadow-2xl backdrop-blur-md px-4 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Indicator & Collapse */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Bảng Điều Khiển Giáo Viên
            </span>
          </div>

          {totalQuestions > 0 && (
            <div className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
              Câu <span className="text-white">{currentQuestionIndex + 1}</span> / {totalQuestions}
            </div>
          )}

          {timerSeconds !== undefined && timerSeconds > 0 && (
            <div className={`text-xs font-bold px-2.5 py-1 rounded-lg ${timerSeconds <= 5 ? 'bg-red-500 text-white animate-bounce' : 'bg-slate-800 text-amber-300'}`}>
              ⏱️ {timerSeconds}s
            </div>
          )}
        </div>

        {/* Center: Game Flow Controls */}
        <div className="flex items-center gap-2">
          {onTogglePause && (
            <button
              onClick={onTogglePause}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                isPaused
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-900'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
            </button>
          )}

          {onToggleShowAnswer && (
            <button
              onClick={onToggleShowAnswer}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                showAnswer
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {showAnswer ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {showAnswer ? 'Đang hiện đáp án' : 'Hiện đáp án'}
            </button>
          )}

          {onSkipQuestion && (
            <button
              onClick={onSkipQuestion}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Bỏ qua
            </button>
          )}

          {onNextQuestion && (
            <button
              onClick={onNextQuestion}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Câu tiếp ➔
            </button>
          )}
        </div>

        {/* Right: Score quick adjust & Presentation mode toggle */}
        <div className="flex items-center gap-2">
          {/* Quick Team Scores bar */}
          {teams && teams.length > 0 && onUpdateScore && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Cộng/Trừ điểm:</span>
              {teams.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-1">
                  <span className="text-xs font-bold truncate max-w-[70px]">
                    {t.emoji} {t.name}
                  </span>
                  <button
                    onClick={() => onUpdateScore(t.id, -5)}
                    className="w-5 h-5 rounded bg-slate-700 hover:bg-red-500 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer"
                    title="-5 điểm"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => onUpdateScore(t.id, 10)}
                    className="w-5 h-5 rounded bg-slate-700 hover:bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer"
                    title="+10 điểm"
                  >
                    +10
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Presentation Mode Button */}
          {onTogglePresentationMode && (
            <button
              onClick={onTogglePresentationMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
              title="Ẩn thanh điều khiển để học sinh chỉ nhìn thấy câu hỏi"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trình chiếu (Ẩn thanh)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
