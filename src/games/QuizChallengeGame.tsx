import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Timer,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { QuizQuestion } from '../types';
import { SoundEffects } from '../lib/sound';
import { fireConfetti } from '../lib/confetti';
import { TeacherControlBar } from '../components/games/TeacherControlBar';

interface QuizChallengeGameProps {
  questions: QuizQuestion[];
  onSaveQuestions: (questions: QuizQuestion[]) => void;
  onBack: () => void;
  onLogActivity: (title: string, details?: string) => void;
}

export const QuizChallengeGame: React.FC<QuizChallengeGameProps> = ({
  questions,
  onSaveQuestions,
  onBack,
  onLogActivity,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | string | boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [inputAnswer, setInputAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(25);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);

  // Add question modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQText, setNewQText] = useState('');
  const [newQCategory, setNewQCategory] = useState('Chung');
  const [newQOptions, setNewQOptions] = useState(['', '', '', '']);
  const [newQAnswer, setNewQAnswer] = useState(0);

  const currentQ = questions[currentIndex] || null;

  // Question countdown
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && !isAnswered && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsAnswered(true);
            setIsCorrect(false);
            SoundEffects.error();
            return 0;
          }
          if (prev <= 5) SoundEffects.tick(1.5);
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isAnswered, timerSeconds]);

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(index);
    setIsAnswered(true);
    setIsTimerRunning(false);

    const correct = currentQ.answer === index;
    setIsCorrect(correct);

    if (correct) {
      SoundEffects.win();
      fireConfetti();
      setScore((s) => s + (currentQ.points || 10));
      onLogActivity(`Trả lời ĐÚNG câu hỏi: "${currentQ.question}"`, `+${currentQ.points || 10} điểm`);
    } else {
      SoundEffects.error();
      onLogActivity(`Trả lời SAI câu hỏi: "${currentQ.question}"`);
    }
  };

  const handleSelectBoolean = (val: boolean) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(val);
    setIsAnswered(true);
    setIsTimerRunning(false);

    const correct = currentQ.answer === val;
    setIsCorrect(correct);

    if (correct) {
      SoundEffects.win();
      fireConfetti();
      setScore((s) => s + (currentQ.points || 10));
      onLogActivity(`Trả lời ĐÚNG: "${currentQ.question}"`);
    } else {
      SoundEffects.error();
      onLogActivity(`Trả lời SAI: "${currentQ.question}"`);
    }
  };

  const handleSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || !currentQ || !inputAnswer.trim()) return;

    setIsAnswered(true);
    setIsTimerRunning(false);

    const cleanInput = inputAnswer.trim().toLowerCase();
    const cleanAnswer = String(currentQ.answer).trim().toLowerCase();
    const correct = cleanInput === cleanAnswer;
    setIsCorrect(correct);

    if (correct) {
      SoundEffects.win();
      fireConfetti();
      setScore((s) => s + (currentQ.points || 10));
      onLogActivity(`Điền đáp án ĐÚNG: "${currentQ.question}"`);
    } else {
      SoundEffects.error();
      onLogActivity(`Điền đáp án SAI: "${currentQ.question}"`);
    }
  };

  const handleNextQuestion = () => {
    SoundEffects.click();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setInputAnswer('');
      setTimerSeconds(25);
      setIsTimerRunning(true);
    }
  };

  const handleResetQuiz = () => {
    SoundEffects.click();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setInputAnswer('');
    setScore(0);
    setTimerSeconds(25);
    setIsTimerRunning(true);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim()) return;

    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      category: newQCategory.trim() || 'Chung',
      type: 'multiple',
      question: newQText.trim(),
      options: newQOptions.map((opt, i) => opt.trim() || `Lựa chọn ${i + 1}`),
      answer: newQAnswer,
      points: 10,
    };

    const updated = [...questions, newQuestion];
    onSaveQuestions(updated);
    setIsAddModalOpen(false);
    setNewQText('');
    setNewQOptions(['', '', '', '']);
    SoundEffects.success();
  };

  if (questions.length === 0) {
    return (
      <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl border">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="font-bold text-slate-800 dark:text-white">Chưa có câu hỏi nào trong ngân hàng</p>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Thêm câu hỏi mới
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Controls */}
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
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm câu hỏi
          </button>
          <button
            onClick={handleResetQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Làm lại
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        {/* Info & Countdown */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
              Câu {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Chủ đề: {currentQ?.category || 'Chung'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full">
              <Award className="w-4 h-4" />
              Điểm: {score}
            </div>

            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                timerSeconds <= 5
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              {timerSeconds}s
            </div>
          </div>
        </div>

        {/* Question Text */}
        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mb-6 leading-snug">
          {currentQ?.question}
        </h2>

        {/* Options */}
        {currentQ?.type === 'multiple' && currentQ.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isChosen = selectedOption === idx;
              const isTheAnswer = currentQ.answer === idx;

              let btnStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-500';
              if (isAnswered) {
                if (isTheAnswer) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20';
                } else if (isChosen && !isTheAnswer) {
                  btnStyle = 'bg-rose-500 text-white border-rose-500';
                } else {
                  btnStyle = 'opacity-40 border-slate-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 text-left font-semibold text-sm transition-all flex items-center gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-7 h-7 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                    {letter}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Boolean True/False */}
        {currentQ?.type === 'boolean' && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleSelectBoolean(true)}
              disabled={isAnswered}
              className={`py-6 rounded-2xl border-2 font-display font-black text-xl transition-all cursor-pointer ${
                isAnswered
                  ? currentQ.answer === true
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : selectedOption === true
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'opacity-40'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              ✅ ĐÚNG (TRUE)
            </button>
            <button
              onClick={() => handleSelectBoolean(false)}
              disabled={isAnswered}
              className={`py-6 rounded-2xl border-2 font-display font-black text-xl transition-all cursor-pointer ${
                isAnswered
                  ? currentQ.answer === false
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : selectedOption === false
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'opacity-40'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
              }`}
            >
              ❌ SAI (FALSE)
            </button>
          </div>
        )}

        {/* Input question */}
        {currentQ?.type === 'input' && (
          <form onSubmit={handleSubmitInput} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Nhập câu trả lời của bạn..."
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              disabled={isAnswered}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={isAnswered || !inputAnswer.trim()}
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs"
            >
              Xác nhận
            </button>
          </form>
        )}

        {/* Result banner & Explanation */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-in fade-in">
            <div className="flex items-center gap-2 mb-2 font-display font-bold text-base">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">
                    CHÍNH XÁC! (+{currentQ?.points || 10} điểm)
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <span className="text-rose-600 dark:text-rose-400">
                    CHƯA CHÍNH XÁC! Đáp án đúng:{' '}
                    {currentQ?.type === 'multiple' && currentQ.options
                      ? currentQ.options[Number(currentQ.answer)]
                      : String(currentQ?.answer)}
                  </span>
                </>
              )}
            </div>

            {currentQ?.explanation && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                💡 <b>Giải thích:</b> {currentQ.explanation}
              </p>
            )}

            <div className="mt-4 flex justify-end">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  Câu tiếp theo ➔
                </button>
              ) : (
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  🎉 Bạn đã hoàn thành tất cả câu hỏi! Tổng điểm: {score}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Question */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-2xl">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-3">
              Thêm câu hỏi trắc nghiệm mới
            </h3>
            <form onSubmit={handleAddQuestion} className="space-y-3">
              <input
                type="text"
                placeholder="Nội dung câu hỏi..."
                value={newQText}
                onChange={(e) => setNewQText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                required
              />
              <input
                type="text"
                placeholder="Chủ đề (ví dụ: Tin học, Địa lý, Tiếng Anh)..."
                value={newQCategory}
                onChange={(e) => setNewQCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
              />

              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold">4 Lựa chọn trả lời & Chọn đáp án đúng:</label>
                {newQOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={newQAnswer === i}
                      onChange={() => setNewQAnswer(i)}
                      className="text-indigo-600"
                    />
                    <span className="text-xs font-bold w-4">{String.fromCharCode(65 + i)}</span>
                    <input
                      type="text"
                      placeholder={`Đáp án ${String.fromCharCode(65 + i)}...`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newQOptions];
                        updated[i] = e.target.value;
                        setNewQOptions(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Lưu câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Control Bar */}
      <TeacherControlBar
        isPaused={!isTimerRunning}
        onTogglePause={() => setIsTimerRunning(!isTimerRunning)}
        onNextQuestion={handleNextQuestion}
        onSkipQuestion={() => {
          SoundEffects.click();
          if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          } else {
            setCurrentIndex(0);
          }
          setSelectedOption(null);
          setIsAnswered(false);
          setIsCorrect(false);
          setInputAnswer('');
          setTimerSeconds(25);
          setIsTimerRunning(true);
        }}
        showAnswer={isAnswered}
        onToggleShowAnswer={() => {
          if (!isAnswered && currentQ) {
            setSelectedOption(currentQ.answer);
            setIsAnswered(true);
            setIsCorrect(true);
          } else {
            setIsAnswered(false);
          }
        }}
        presentationMode={presentationMode}
        onTogglePresentationMode={() => setPresentationMode(!presentationMode)}
        currentQuestionIndex={currentIndex}
        totalQuestions={questions.length}
        timerSeconds={timerSeconds}
      />
    </div>
  );
};
