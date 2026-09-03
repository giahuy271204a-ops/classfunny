import React, { useState } from 'react';
import {
  Trophy,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Award,
  Users,
  Medal,
  Crown,
  Trash2,
  Flame,
} from 'lucide-react';
import { TeamScore } from '../types';
import { SoundEffects } from '../lib/sound';
import { fireConfetti, fireSuperConfetti } from '../lib/confetti';

interface ScoreboardPageProps {
  scores: TeamScore[];
  onSaveScores: (scores: TeamScore[]) => void;
  onLogActivity: (title: string, details?: string) => void;
}

const COLOR_OPTIONS = [
  { name: 'Đỏ Lửa', val: 'bg-red-500', emoji: '🔥' },
  { name: 'Xanh Nước', val: 'bg-blue-500', emoji: '💧' },
  { name: 'Xanh Lá', val: 'bg-emerald-500', emoji: '🌱' },
  { name: 'Vàng Sấm Sét', val: 'bg-amber-500', emoji: '⚡' },
  { name: 'Tím Ma Thuật', val: 'bg-purple-500', emoji: '🔮' },
  { name: 'Hồng Ngọt Ngào', val: 'bg-pink-500', emoji: '🌸' },
];

export const ScoreboardPage: React.FC<ScoreboardPageProps> = ({
  scores,
  onSaveScores,
  onLogActivity,
}) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Sorted teams by score desc
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  const highestScore = sortedScores.length > 0 ? sortedScores[0].score : 0;

  const handleUpdateScore = (id: string, delta: number) => {
    if (delta > 0) {
      SoundEffects.success();
    } else {
      SoundEffects.error();
    }

    const updated = scores.map((team) =>
      team.id === id ? { ...team, score: Math.max(0, team.score + delta) } : team
    );
    onSaveScores(updated);

    const team = scores.find((t) => t.id === id);
    onLogActivity(
      `${delta > 0 ? 'Cộng' : 'Trừ'} ${Math.abs(delta)} điểm cho ${team?.name}`,
      `Tổng điểm mới: ${Math.max(0, (team?.score || 0) + delta)}`
    );
  };

  const handleResetScores = () => {
    if (confirm('Bạn có chắc muốn đặt lại điểm số của tất cả các đội về 0?')) {
      SoundEffects.click();
      const updated = scores.map((team) => ({ ...team, score: 0 }));
      onSaveScores(updated);
      onLogActivity('Đặt lại bảng điểm về 0');
    }
  };

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    SoundEffects.win();
    const newTeam: TeamScore = {
      id: `team-${Date.now()}`,
      name: newTeamName.trim(),
      emoji: selectedColor.emoji,
      color: selectedColor.val,
      score: 0,
    };

    onSaveScores([...scores, newTeam]);
    setNewTeamName('');
    onLogActivity(`Thêm đội thi đua mới: ${newTeam.name}`);
  };

  const handleDeleteTeam = (id: string) => {
    if (scores.length <= 1) {
      alert('Cần giữ lại ít nhất 1 đội trên bảng điểm!');
      return;
    }
    const target = scores.find((t) => t.id === id);
    if (confirm(`Bạn có chắc muốn xóa đội "${target?.name}"?`)) {
      SoundEffects.click();
      onSaveScores(scores.filter((t) => t.id !== id));
      onLogActivity(`Xóa đội: ${target?.name}`);
    }
  };

  const handleTriggerVictory = () => {
    SoundEffects.win();
    fireSuperConfetti();
    setShowCelebration(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center shadow-xs">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              Bảng điểm thi đua lớp học
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ghi nhận thành tích, khen thưởng điểm sao cho các tổ, đội nhóm trong các trò chơi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerVictory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            🏆 Vinh Danh Chiến Thắng
          </button>

          <button
            onClick={handleResetScores}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Đặt lại toàn bộ điểm về 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset điểm
          </button>
        </div>
      </div>

      {/* Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedScores.map((team, rankIdx) => {
          const isLeader = rankIdx === 0 && team.score > 0;
          const medal =
            rankIdx === 0 ? '🥇' : rankIdx === 1 ? '🥈' : rankIdx === 2 ? '🥉' : `#${rankIdx + 1}`;

          return (
            <div
              key={team.id}
              className={`rounded-2xl border transition-all flex flex-col bg-white dark:bg-slate-900 overflow-hidden shadow-xs relative ${
                isLeader
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Team banner */}
              <div className={`p-4 text-white flex items-center justify-between ${team.color}`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{team.emoji}</span>
                  <div>
                    <h3 className="font-sans font-bold text-base tracking-tight">{team.name}</h3>
                    <span className="text-xs text-white/90 font-semibold">Hạng {medal}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {isLeader && <Crown className="w-5 h-5 text-amber-200 animate-bounce" />}
                  {scores.length > 1 && (
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-1 rounded-lg hover:bg-black/20 text-white/80 transition-colors cursor-pointer"
                      title="Xóa đội"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Score Display */}
              <div className="p-6 text-center flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-800/30">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Tổng điểm hiện tại
                </div>
                <div className="font-sans font-black text-5xl tracking-tight text-slate-900 dark:text-white">
                  {team.score}
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-1">điểm</div>
              </div>

              {/* Point Buttons */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="grid grid-cols-4 gap-1">
                  {[1, 5, 10, 20].map((pts) => (
                    <button
                      key={pts}
                      onClick={() => handleUpdateScore(team.id, pts)}
                      className="py-1.5 rounded-lg bg-white hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                    >
                      +{pts}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => handleUpdateScore(team.id, 50)}
                    className="py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                  >
                    +50
                  </button>
                  <button
                    onClick={() => handleUpdateScore(team.id, -5)}
                    className="py-1.5 rounded-lg bg-white hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950 text-rose-500 border border-slate-200 dark:border-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => handleUpdateScore(team.id, -10)}
                    className="py-1.5 rounded-lg bg-white hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950 text-rose-500 border border-slate-200 dark:border-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                  >
                    -10
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Team Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Thêm đội thi đua mới
        </h3>

        <form onSubmit={handleAddTeam} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tên đội (ví dụ: Tổ 1, Team Đại Bàng, Biệt đội Siêu Nhân)..."
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              required
            />
          </div>

          {/* Color pick */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {COLOR_OPTIONS.map((c) => (
              <button
                type="button"
                key={c.name}
                onClick={() => setSelectedColor(c)}
                className={`w-8 h-8 rounded-xl ${c.val} flex items-center justify-center text-sm shadow-xs transition-transform cursor-pointer ${
                  selectedColor.name === c.name ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'opacity-80'
                }`}
                title={c.name}
              >
                {c.emoji}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            Thêm đội
          </button>
        </form>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-8 border border-amber-300 dark:border-amber-700 text-center shadow-2xl relative">
            <div className="text-6xl mb-3 animate-bounce">🏆</div>
            <h3 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white mb-1">
              CHÚC MỪNG QUÁN QUÂN!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Đội xuất sắc nhất bảng xếp hạng hôm nay
            </p>

            {sortedScores.length > 0 && (
              <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-slate-900 dark:text-white shadow-xs mb-6">
                <span className="text-4xl">{sortedScores[0].emoji}</span>
                <h4 className="font-sans font-black text-3xl mt-2 text-amber-600 dark:text-amber-400">{sortedScores[0].name}</h4>
                <div className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-200">{sortedScores[0].score} ĐIỂM</div>
              </div>
            )}

            <button
              onClick={() => setShowCelebration(false)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Đóng và tiếp tục
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
