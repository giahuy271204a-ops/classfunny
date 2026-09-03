import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Check, X, Award, Sparkles, HelpCircle } from 'lucide-react';
import { SoundEffects } from '../lib/sound';
import { fireConfetti } from '../lib/confetti';

interface TrueFalseGameProps {
  onBack: () => void;
  onLogActivity: (title: string, details?: string) => void;
}

interface TFQuestion {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

const SAMPLE_TF_QUESTIONS: TFQuestion[] = [
  {
    statement: 'Mặt Trời quay quanh Trái Đất.',
    isTrue: false,
    explanation: 'Sai! Trái Đất và các hành tinh trong Hệ Mặt Trời quay quanh Mặt Trời.',
  },
  {
    statement: 'Cá voi là loài động vật có vú, thở bằng phổi chứ không phải bằng mang.',
    isTrue: true,
    explanation: 'Đúng! Cá voi đẻ con, nuôi con bằng sữa mẹ và thở bằng phổi.',
  },
  {
    statement: 'Đỉnh núi Phan Xi Păng (Fansipan) là đỉnh núi cao nhất Việt Nam và Đông Dương.',
    isTrue: true,
    explanation: 'Đúng! Phan Xi Păng có độ cao 3.143 mét, được mệnh danh là nóc nhà Đông Dương.',
  },
  {
    statement: 'Số 0 là một số nguyên dương.',
    isTrue: false,
    explanation: 'Sai! Số 0 không phải là số nguyên dương cũng không phải là số nguyên âm.',
  },
  {
    statement: 'Vạn Lý Trường Thành của Trung Quốc có thể nhìn thấy rõ bằng mắt thường từ Mặt Trăng.',
    isTrue: false,
    explanation: 'Sai! Đây là một quan niệm sai lầm phổ biến. Các phi hành gia NASA đã khẳng định không thể nhìn thấy bằng mắt thường.',
  },
  {
    statement: 'Nước sôi ở nhiệt độ 100°C trong điều kiện áp suất tiêu chuẩn.',
    isTrue: true,
    explanation: 'Đúng! Ở áp suất khí quyển 1 atm, nước nguyên chất sôi ở 100°C.',
  },
];

export const TrueFalseGame: React.FC<TrueFalseGameProps> = ({
  onBack,
  onLogActivity,
}) => {
  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = SAMPLE_TF_QUESTIONS[index % SAMPLE_TF_QUESTIONS.length];

  const handleAnswer = (choice: boolean) => {
    if (isAnswered) return;

    setSelectedAnswer(choice);
    setIsAnswered(true);

    const isCorrect = choice === currentQ.isTrue;
    if (isCorrect) {
      SoundEffects.win();
      fireConfetti();
      setScore((s) => s + 10);
      onLogActivity(`Đúng hay Sai: Trả lời ĐÚNG câu "${currentQ.statement}"`);
    } else {
      SoundEffects.error();
      onLogActivity(`Đúng hay Sai: Trả lời SAI câu "${currentQ.statement}"`);
    }
  };

  const handleNext = () => {
    SoundEffects.click();
    setIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
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

        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
          <Award className="w-4 h-4" />
          Điểm tích lũy: {score}
        </div>
      </div>

      {/* Main Board */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xl text-center flex flex-col items-center">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
          Câu {index + 1} / {SAMPLE_TF_QUESTIONS.length}
        </span>

        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-8">
          ⚡ ĐÚNG HAY SAI? (TRUE OR FALSE)
        </h2>

        {/* Statement Box */}
        <div className="w-full max-w-2xl bg-slate-50 dark:bg-slate-800/60 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-700 mb-8 shadow-inner">
          <p className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white leading-relaxed">
            "{currentQ.statement}"
          </p>
        </div>

        {/* 2 Giant Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mb-6">
          <button
            onClick={() => handleAnswer(true)}
            disabled={isAnswered}
            className={`py-6 rounded-3xl border-2 font-display font-black text-2xl sm:text-3xl flex items-center justify-center gap-3 transition-all cursor-pointer ${
              isAnswered
                ? currentQ.isTrue
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : selectedAnswer === true
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'opacity-30 border-slate-200'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95'
            }`}
          >
            <Check className="w-8 h-8" />
            ĐÚNG (TRUE)
          </button>

          <button
            onClick={() => handleAnswer(false)}
            disabled={isAnswered}
            className={`py-6 rounded-3xl border-2 font-display font-black text-2xl sm:text-3xl flex items-center justify-center gap-3 transition-all cursor-pointer ${
              isAnswered
                ? !currentQ.isTrue
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : selectedAnswer === false
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'opacity-30 border-slate-200'
                : 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-500/20 hover:scale-105 active:scale-95'
            }`}
          >
            <X className="w-8 h-8" />
            SAI (FALSE)
          </button>
        </div>

        {/* Explanation & Next */}
        {isAnswered && (
          <div className="w-full max-w-xl p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-left animate-in zoom-in-95">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
              💡 <b>Giải thích:</b> {currentQ.explanation}
            </p>
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              Câu hỏi tiếp theo ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
