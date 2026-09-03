import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Lightbulb, HelpCircle, CheckCircle2, Sparkles, Award } from 'lucide-react';
import { SoundEffects } from '../lib/sound';
import { fireConfetti, fireSuperConfetti } from '../lib/confetti';

interface WordGuessGameProps {
  onBack: () => void;
  onLogActivity: (title: string, details?: string) => void;
}

interface WordPuzzle {
  word: string;
  hints: string[];
  category: string;
}

const SAMPLE_PUZZLES: WordPuzzle[] = [
  {
    word: 'INTERNET',
    hints: [
      'Gợi ý 1: Mạng kết nối hàng tỷ máy tính trên toàn cầu.',
      'Gợi ý 2: Giúp bạn lướt web, gửi email, xem video.',
      'Gợi ý 3: Bắt đầu bằng chữ I, kết thúc bằng chữ T.',
    ],
    category: 'Công nghệ & Tin học',
  },
  {
    word: 'PYTHON',
    hints: [
      'Gợi ý 1: Tên một loài trăn khổng lồ.',
      'Gợi ý 2: Ngôn ngữ lập trình phổ biến bậc nhất thế giới hiện nay.',
      'Gợi ý 3: Logo có 2 con rắn màu xanh và vàng.',
    ],
    category: 'Lập trình',
  },
  {
    word: 'ROBOT',
    hints: [
      'Gợi ý 1: Cỗ máy tự động được lập trình để thực hiện công việc.',
      'Gợi ý 2: Có thể hình người hoặc cánh tay công nghiệp.',
      'Gợi ý 3: Có 5 chữ cái.',
    ],
    category: 'Khoa học kỹ thuật',
  },
  {
    word: 'HA LONG',
    hints: [
      'Gợi ý 1: Một kỳ quan thiên nhiên thế giới nổi tiếng của Việt Nam.',
      'Gợi ý 2: Nằm ở tỉnh Quảng Ninh.',
      'Gợi ý 3: Tên mang ý nghĩa "nơi Rồng đáp xuống".',
    ],
    category: 'Địa lý Việt Nam',
  },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const WordGuessGame: React.FC<WordGuessGameProps> = ({
  onBack,
  onLogActivity,
}) => {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set([' ']));
  const [revealedHints, setRevealedHints] = useState<number>(1);
  const [isWon, setIsWon] = useState(false);

  const currentPuzzle = SAMPLE_PUZZLES[puzzleIndex % SAMPLE_PUZZLES.length];
  const targetWord = currentPuzzle.word.toUpperCase();

  const handleGuessLetter = (char: string) => {
    if (guessedLetters.has(char) || isWon) return;

    const nextGuessed = new Set(guessedLetters);
    nextGuessed.add(char);
    setGuessedLetters(nextGuessed);

    if (targetWord.includes(char)) {
      SoundEffects.success();
      // Check if won
      const allRevealed = targetWord.split('').every((c) => nextGuessed.has(c));
      if (allRevealed) {
        setIsWon(true);
        SoundEffects.win();
        fireSuperConfetti();
        onLogActivity(`Đoán từ thành công: ${targetWord}`);
      }
    } else {
      SoundEffects.error();
    }
  };

  const handleRevealNextHint = () => {
    if (revealedHints < currentPuzzle.hints.length) {
      SoundEffects.click();
      setRevealedHints((prev) => prev + 1);
    }
  };

  const handleNextPuzzle = () => {
    SoundEffects.click();
    setPuzzleIndex((prev) => prev + 1);
    setGuessedLetters(new Set([' ']));
    setRevealedHints(1);
    setIsWon(false);
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
          onClick={handleNextPuzzle}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          Từ khóa tiếp theo ➔
        </button>
      </div>

      {/* Main Board */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xl text-center flex flex-col items-center">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
          Chủ đề: {currentPuzzle.category}
        </span>

        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-6">
          🕵️ AI ĐOÁN TỪ BÍ MẬT
        </h2>

        {/* Word Display with underscores */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 my-6">
          {targetWord.split('').map((char, idx) => {
            if (char === ' ') {
              return <div key={idx} className="w-6" />;
            }
            const isRevealed = guessedLetters.has(char) || isWon;

            return (
              <div
                key={idx}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center font-display font-black text-2xl sm:text-3xl border-2 transition-all ${
                  isRevealed
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 border-indigo-400 dark:border-indigo-600 shadow-md scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-transparent border-slate-300 dark:border-slate-700'
                }`}
              >
                {isRevealed ? char : ''}
              </div>
            );
          })}
        </div>

        {/* Hints Card */}
        <div className="w-full max-w-lg bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl p-4 border border-amber-200 dark:border-amber-800/60 text-left my-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              Gợi ý ({revealedHints}/{currentPuzzle.hints.length})
            </span>

            {revealedHints < currentPuzzle.hints.length && (
              <button
                onClick={handleRevealNextHint}
                className="text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
              >
                + Mở thêm gợi ý
              </button>
            )}
          </div>

          {currentPuzzle.hints.slice(0, revealedHints).map((hint, i) => (
            <p key={i} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {hint}
            </p>
          ))}
        </div>

        {/* Win Message */}
        {isWon && (
          <div className="my-4 p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm animate-in zoom-in-95">
            🎉 CHÚC MỪNG! BẠN ĐÃ ĐOÁN ĐÚNG TỪ KHÓA: {targetWord}!
          </div>
        )}

        {/* Virtual Keyboard */}
        <div className="w-full max-w-xl flex flex-wrap items-center justify-center gap-1.5 mt-4">
          {ALPHABET.map((letter) => {
            const isGuessed = guessedLetters.has(letter);
            const isHit = targetWord.includes(letter);

            return (
              <button
                key={letter}
                onClick={() => handleGuessLetter(letter)}
                disabled={isGuessed || isWon}
                className={`w-9 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isGuessed
                    ? isHit
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-40'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 shadow-2xs'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
