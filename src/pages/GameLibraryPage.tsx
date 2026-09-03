import React, { useState } from 'react';
import {
  Gamepad2,
  Play,
  Sparkles,
  Users,
  Timer,
  Award,
  HelpCircle,
  Gift,
  Target,
  Flame,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { ClassRoom, GamePreset, GameSetupConfig, QuestionSet, QuizQuestion, TeamScore } from '../types';
import { LuckyWheelGame } from '../games/LuckyWheelGame';
import { MysteryBoxGame } from '../games/MysteryBoxGame';
import { QuizChallengeGame } from '../games/QuizChallengeGame';
import { FastestFingerGame } from '../games/FastestFingerGame';
import { BullseyeGame } from '../games/BullseyeGame';
import { WordGuessGame } from '../games/WordGuessGame';
import { TrueFalseGame } from '../games/TrueFalseGame';
import { MatchingGame } from '../games/MatchingGame';
import { RandomChallengeGame } from '../games/RandomChallengeGame';
import { BombDefusalGame } from '../games/BombDefusalGame';
import { SoundEffects } from '../lib/sound';
import { GameSetupModal } from '../components/games/GameSetupModal';
import { Settings2, Layers } from 'lucide-react';

interface GameLibraryPageProps {
  activeClass: ClassRoom | null;
  quizQuestions: QuizQuestion[];
  questionSets?: QuestionSet[];
  gamePresets?: GamePreset[];
  teams?: TeamScore[];
  onSaveQuizQuestions: (questions: QuizQuestion[]) => void;
  onSaveGamePreset?: (preset: GamePreset) => void;
  onLogActivity: (title: string, details?: string) => void;
  onNavigateToQuestionBank?: () => void;
}

interface GameDefinition {
  id: string;
  name: string;
  category: 'luck' | 'quiz' | 'speed' | 'strategy';
  icon: string;
  badge: string;
  description: string;
  color: string;
  recommendedFor: string;
}

const GAMES: GameDefinition[] = [
  {
    id: 'lucky-wheel',
    name: 'Vòng Quay May Mắn',
    category: 'luck',
    icon: '🎡',
    badge: 'Phổ biến nhất',
    description: 'Vòng quay gọi tên học sinh hoặc bốc thăm phần thưởng kẹo bánh, điểm thưởng cực kỳ hào hứng.',
    color: 'from-amber-500 to-orange-500',
    recommendedFor: 'Khởi động đầu giờ, kiểm tra bài cũ',
  },
  {
    id: 'mystery-box',
    name: 'Hộp Quà Bí Mật',
    category: 'luck',
    icon: '🎁',
    badge: 'Kịch tính',
    description: '12 chiếc hộp chứa câu hỏi, thử thách hát/múa hoặc điểm thưởng khổng lồ. Mở hộp đầy bất ngờ!',
    color: 'from-pink-500 to-rose-600',
    recommendedFor: 'Tổng kết bài học, phần thưởng đội thi đua',
  },
  {
    id: 'quiz-challenge',
    name: 'Đấu Trí Trắc Nghiệm',
    category: 'quiz',
    icon: '🧠',
    badge: 'Học tập',
    description: 'Ngân hàng câu hỏi trắc nghiệm A B C D, đếm ngược thời gian, giải thích chi tiết và cộng điểm.',
    color: 'from-indigo-500 to-purple-600',
    recommendedFor: 'Ôn tập kiến thức, kiểm tra 15 phút',
  },
  {
    id: 'fastest-finger',
    name: 'Ai Nhanh Hơn',
    category: 'speed',
    icon: '🏃',
    badge: 'Tốc độ',
    description: 'Đếm ngược 15 giây dồn dập, bấm chuông giành quyền trả lời đầu tiên cho các đội!',
    color: 'from-red-500 to-orange-600',
    recommendedFor: 'Thi đấu tiếp sức, giải cứu đồng đội',
  },
  {
    id: 'bullseye',
    name: 'Bắn Bia Tính Điểm',
    category: 'speed',
    icon: '🎯',
    badge: 'Tương tác',
    description: 'Chạm hoặc nhấp chuột ném phi tiêu vào hồng tâm 100 điểm với âm thanh chân thực.',
    color: 'from-emerald-500 to-teal-600',
    recommendedFor: 'Trò chơi giải lao, cộng điểm may mắn',
  },
  {
    id: 'word-guess',
    name: 'Ai Đoán Từ Bí Mật',
    category: 'quiz',
    icon: '🕵️',
    badge: 'Tư duy',
    description: 'Giải mã từ khóa ẩn với 3 gợi ý mở dần từng nấc và bàn phím tương tác đoán chữ cái.',
    color: 'from-blue-600 to-indigo-700',
    recommendedFor: 'Khám phá chủ đề bài mới, từ khóa trọng tâm',
  },
  {
    id: 'true-false',
    name: 'Đúng Hay Sai?',
    category: 'quiz',
    icon: '⚡',
    badge: 'Phản xạ',
    description: 'Mệnh đề xuất hiện trên màn hình máy chiếu, học sinh phán đoán nhanh với 2 nút Đúng/Sai cực lớn.',
    color: 'from-amber-600 to-yellow-500',
    recommendedFor: 'Củng cố định nghĩa, phá tan các ngộ nhận',
  },
  {
    id: 'matching',
    name: 'Ghép Cặp Khái Niệm',
    category: 'strategy',
    icon: '🧩',
    badge: 'Ghi nhớ',
    description: 'Nối thuật ngữ cột trái với định nghĩa cột phải tương ứng, kiểm tra mức độ hiểu bài.',
    color: 'from-teal-600 to-emerald-700',
    recommendedFor: 'Học từ vựng, công thức, thuật ngữ khoa học',
  },
  {
    id: 'random-challenge',
    name: 'Xúc Xắc Thử Thách',
    category: 'luck',
    icon: '🎲',
    badge: 'Sôi động',
    description: 'Lắc viên xúc xắc 6 mặt nhận các thử thách biểu diễn hài hước hoặc câu hỏi kiến thức.',
    color: 'from-violet-600 to-purple-700',
    recommendedFor: 'Hoạt náo giờ sinh hoạt lớp, giải tỏa căng thẳng',
  },
  {
    id: 'bomb-defusal',
    name: 'Gỡ Mìn Lớp Học',
    category: 'luck',
    icon: '💣',
    badge: 'Cực vui',
    description: 'Lưới 16 ô số bí mật, cẩn thận đừng đạp trúng bom! Kịch tính tột cùng cho các tổ thi đấu.',
    color: 'from-slate-700 to-slate-900',
    recommendedFor: 'Thi đua tính điểm giữa các tổ',
  },
];

export const GameLibraryPage: React.FC<GameLibraryPageProps> = ({
  activeClass,
  quizQuestions,
  questionSets = [],
  gamePresets = [],
  teams = [],
  onSaveQuizQuestions,
  onSaveGamePreset,
  onLogActivity,
  onNavigateToQuestionBank,
}) => {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [setupModalGame, setSetupModalGame] = useState<GameDefinition | null>(null);
  const [preparedQuestions, setPreparedQuestions] = useState<QuizQuestion[] | null>(null);
  const [activeGameConfig, setActiveGameConfig] = useState<GameSetupConfig | null>(null);

  const filteredGames = GAMES.filter((g) => {
    const matchCat = filterCategory === 'all' || g.category === filterCategory;
    const matchSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleLaunchGame = (id: string, customQuestions?: QuizQuestion[], config?: GameSetupConfig) => {
    SoundEffects.click();
    if (customQuestions) setPreparedQuestions(customQuestions);
    if (config) setActiveGameConfig(config);
    setSelectedGameId(id);
    const game = GAMES.find((g) => g.id === id);
    onLogActivity(`Khởi động trò chơi: ${game?.name}`);
  };

  const handleOpenSetup = (game: GameDefinition, e?: React.MouseEvent) => {
    e?.stopPropagation();
    SoundEffects.click();
    setSetupModalGame(game);
  };

  // Render individual game screen if active
  if (selectedGameId === 'lucky-wheel') {
    return (
      <LuckyWheelGame
        activeClass={activeClass}
        onBack={() => {
          setSelectedGameId(null);
          setPreparedQuestions(null);
        }}
        onLogActivity={onLogActivity}
      />
    );
  }

  if (selectedGameId === 'mystery-box') {
    return (
      <MysteryBoxGame
        onBack={() => {
          setSelectedGameId(null);
          setPreparedQuestions(null);
        }}
        onLogActivity={onLogActivity}
      />
    );
  }

  if (selectedGameId === 'quiz-challenge') {
    return (
      <QuizChallengeGame
        questions={preparedQuestions || quizQuestions}
        onSaveQuestions={onSaveQuizQuestions}
        onBack={() => {
          setSelectedGameId(null);
          setPreparedQuestions(null);
        }}
        onLogActivity={onLogActivity}
      />
    );
  }

  if (selectedGameId === 'fastest-finger') {
    return (
      <FastestFingerGame
        activeClass={activeClass}
        onBack={() => setSelectedGameId(null)}
        onLogActivity={onLogActivity}
      />
    );
  }

  if (selectedGameId === 'bullseye') {
    return (
      <BullseyeGame
        onBack={() => setSelectedGameId(null)}
        onLogActivity={onLogActivity}
      />
    );
  }

  if (selectedGameId === 'word-guess') {
    return (
      <WordGuessGame
        onBack={() => setSelectedGameId(null)}
        onLogActivity={onLogActivity}
      />
    );
  }

  if (selectedGameId === 'true-false') {
    return (
      <TrueFalseGame
        onBack={() => setSelectedGameId(null)}
        onLogActivity={onLogActivity}
      />
    );
  }

  if (selectedGameId === 'matching') {
    return (
      <MatchingGame
        onBack={() => setSelectedGameId(null)}
        onLogActivity={onLogActivity}
      />
    );
  }

  if (selectedGameId === 'random-challenge') {
    return (
      <RandomChallengeGame
        onBack={() => setSelectedGameId(null)}
        onLogActivity={onLogActivity}
      />
    );
  }

  if (selectedGameId === 'bomb-defusal') {
    return (
      <BombDefusalGame
        onBack={() => setSelectedGameId(null)}
        onLogActivity={onLogActivity}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner in Modern White & Blue */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            10+ Trò chơi tương tác lớp học
          </div>
          <h2 className="text-3xl font-sans font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kho Trò Chơi Lớp Học
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Tuyển tập các trò chơi tương tác sôi động được thiết kế riêng để chiếu lên máy chiếu, tạo không khí học tập hào hứng và gắn kết học sinh.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">Thư viện</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">10 trò chơi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'Tất cả trò chơi' },
            { id: 'luck', label: '🎡 May mắn & Quà' },
            { id: 'quiz', label: '🧠 Đố vui & Trắc nghiệm' },
            { id: 'speed', label: '⚡ Tốc độ & Phản xạ' },
            { id: 'strategy', label: '🧩 Ghép đôi & Tư duy' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                SoundEffects.click();
                setFilterCategory(tab.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tên trò chơi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Game Cards Grid in Modern White & Blue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => handleLaunchGame(game.id)}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Header row of card */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shadow-2xs">
                  {game.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                  {game.badge}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                {game.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                {game.description}
              </p>

              <div className="mb-4">
                <span className="inline-block text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900">
                  Phù hợp: {game.recommendedFor}
                </span>
              </div>
            </div>

            {/* Action Buttons: Setup & Play */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={(e) => handleOpenSetup(game, e)}
                className="flex-1 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
                title="Cài đặt nguồn câu hỏi, thời gian & luật chơi"
              >
                <Settings2 className="w-3.5 h-3.5 text-blue-600" />
                <span>⚙️ Setup</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLaunchGame(game.id);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold text-white shadow-xs shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Chơi ngay</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Game Setup Modal */}
      {setupModalGame && (
        <GameSetupModal
          isOpen={!!setupModalGame}
          onClose={() => setSetupModalGame(null)}
          onStartGame={(prepared, config) => {
            handleLaunchGame(setupModalGame.id, prepared, config);
          }}
          gameId={setupModalGame.id}
          gameName={setupModalGame.name}
          gameIcon={setupModalGame.icon}
          allQuestions={quizQuestions}
          questionSets={questionSets}
          teams={teams}
          presets={gamePresets}
          onSavePreset={onSaveGamePreset}
        />
      )}

      {/* Modern White & Blue Footer Bar */}
      <footer className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Lớp đang chọn</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {activeClass ? activeClass.name : 'Chưa chọn lớp'}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Sĩ số tham gia</div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {activeClass ? activeClass.students.filter((s) => !s.isAbsent).length : 0} Học sinh
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Hỗ trợ đầy đủ phím tắt và chế độ chiếu toàn màn hình</span>
        </div>
      </footer>
    </div>
  );
};
