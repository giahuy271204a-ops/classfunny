import React, { useState } from 'react';
import {
  Users,
  Shuffle,
  RotateCcw,
  Sparkles,
  Trophy,
  Palette,
  Check,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Flame,
  Droplet,
  Leaf,
  Zap,
} from 'lucide-react';
import { ClassRoom, Group, Student, TeamScore } from '../types';
import { SoundEffects } from '../lib/sound';
import { fireConfetti } from '../lib/confetti';

interface GroupGeneratorPageProps {
  activeClass: ClassRoom | null;
  onSyncToScoreboard: (newScores: TeamScore[]) => void;
  onLogActivity: (title: string, details?: string) => void;
}

const THEMES = [
  {
    id: 'elements',
    name: 'Ngũ Hành / Nguyên Tố',
    names: ['Team Lửa', 'Team Nước', 'Team Đất', 'Team Sấm Sét', 'Team Gió', 'Team Băng', 'Team Ánh Sáng', 'Team Bóng Tối'],
    emojis: ['🔥', '💧', '🌱', '⚡', '🌪️', '❄️', '✨', '🌑'],
    colors: ['bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-purple-500'],
  },
  {
    id: 'animals',
    name: 'Muông Thú Dũng Mãnh',
    names: ['Sư Tử', 'Đại Bàng', 'Rồng Lửa', 'Cá Mập', 'Báo Đốm', 'Sói Xám', 'Gấu Bắc Cực', 'Hổ Đông Dương'],
    emojis: ['🦁', '🦅', '🐉', '🦈', '🐆', '🐺', '🐻', '🐅'],
    colors: ['bg-orange-500', 'bg-sky-500', 'bg-rose-500', 'bg-teal-500', 'bg-amber-600', 'bg-slate-600', 'bg-blue-400', 'bg-red-600'],
  },
  {
    id: 'colors',
    name: 'Màu Sắc Rực Rỡ',
    names: ['Đội Đỏ', 'Đội Xanh Lam', 'Đội Xanh Lá', 'Đội Vàng', 'Đội Tím', 'Đội Cam', 'Đội Hồng', 'Đội Lam Ngọc'],
    emojis: ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '🌸', '💎'],
    colors: ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-500', 'bg-purple-600', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-600'],
  },
];

export const GroupGeneratorPage: React.FC<GroupGeneratorPageProps> = ({
  activeClass,
  onSyncToScoreboard,
  onLogActivity,
}) => {
  const availableStudents = activeClass?.students.filter((s) => !s.isAbsent) || [];

  const [mode, setMode] = useState<'byGroupCount' | 'byStudentCount'>('byGroupCount');
  const [groupCount, setGroupCount] = useState<number>(4);
  const [studentsPerGroup, setStudentsPerGroup] = useState<number>(4);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);

  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  // Moving student state
  const [selectedStudent, setSelectedStudent] = useState<{ student: Student; sourceGroupId: string } | null>(null);

  const handleGenerateGroups = () => {
    if (availableStudents.length === 0) {
      alert('Không có học sinh hợp lệ nào trong lớp hiện tại!');
      return;
    }

    SoundEffects.dice();

    // Shuffle students randomly
    const shuffled = [...availableStudents].sort(() => 0.5 - Math.random());

    let targetNumGroups = groupCount;
    if (mode === 'byStudentCount') {
      targetNumGroups = Math.max(1, Math.ceil(availableStudents.length / studentsPerGroup));
    }

    targetNumGroups = Math.max(1, Math.min(targetNumGroups, 12));

    const newGroups: Group[] = Array.from({ length: targetNumGroups }, (_, i) => {
      const themeName = activeTheme.names[i % activeTheme.names.length] || `Nhóm ${i + 1}`;
      const themeEmoji = activeTheme.emojis[i % activeTheme.emojis.length] || '👥';
      const themeColor = activeTheme.colors[i % activeTheme.colors.length] || 'bg-indigo-500';

      return {
        id: `group-${i + 1}`,
        name: themeName,
        emoji: themeEmoji,
        color: themeColor,
        students: [],
      };
    });

    // Distribute round-robin
    shuffled.forEach((student, index) => {
      const targetGroupIndex = index % targetNumGroups;
      newGroups[targetGroupIndex].students.push(student);
    });

    setGroups(newGroups);
    setIsGenerated(true);
    setSelectedStudent(null);
    SoundEffects.win();
    fireConfetti();

    onLogActivity(
      `Chia ${targetNumGroups} nhóm cho lớp ${activeClass?.name}`,
      `Chủ đề: ${activeTheme.name}, tổng ${availableStudents.length} học sinh`
    );
  };

  const handleMoveStudentToGroup = (targetGroupId: string) => {
    if (!selectedStudent || selectedStudent.sourceGroupId === targetGroupId) return;

    SoundEffects.click();
    const updated = groups.map((g) => {
      if (g.id === selectedStudent.sourceGroupId) {
        return {
          ...g,
          students: g.students.filter((s) => s.id !== selectedStudent.student.id),
        };
      }
      if (g.id === targetGroupId) {
        return {
          ...g,
          students: [...g.students, selectedStudent.student],
        };
      }
      return g;
    });

    setGroups(updated);
    setSelectedStudent(null);
  };

  const handleRenameGroup = (groupId: string, newName: string) => {
    if (!newName.trim()) return;
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: newName.trim() } : g))
    );
  };

  const handleSyncToScoreboard = () => {
    if (groups.length === 0) return;
    SoundEffects.win();
    fireConfetti();

    const teamScores: TeamScore[] = groups.map((g) => ({
      id: `score-${g.id}`,
      name: g.name,
      emoji: g.emoji,
      color: g.color,
      score: 0,
    }));

    onSyncToScoreboard(teamScores);
    alert(`Đã tạo thành công ${teamScores.length} đội trong Bảng Điểm Thi Đua! Hãy mở tab "Bảng điểm thi đua" để bắt đầu chấm điểm.`);
    onLogActivity(`Đồng bộ ${teamScores.length} nhóm sang Bảng điểm thi đua`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              Chia nhóm thông minh
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                Lớp {activeClass?.name || 'Chưa chọn'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tự động phân chia học sinh thành các nhóm thảo luận, bài tập nhóm hoặc trò chơi tiếp sức
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-slate-900 dark:text-white">
          Sẵn sàng: <span className="text-blue-600 dark:text-blue-400 font-black">{availableStudents.length}</span> học sinh
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Method Picker */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              1. Phương thức chia
            </label>
            <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  SoundEffects.click();
                  setMode('byGroupCount');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'byGroupCount'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Theo số nhóm
              </button>
              <button
                onClick={() => {
                  SoundEffects.click();
                  setMode('byStudentCount');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'byStudentCount'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Theo số HS/nhóm
              </button>
            </div>
          </div>

          {/* Number Selector */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {mode === 'byGroupCount' ? '2. Số lượng nhóm cần tạo' : '2. Số học sinh trong mỗi nhóm'}
            </label>
            {mode === 'byGroupCount' ? (
              <div className="flex items-center gap-2">
                {[2, 3, 4, 6, 8].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      SoundEffects.click();
                      setGroupCount(n);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      groupCount === n
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {n} nhóm
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {[2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      SoundEffects.click();
                      setStudentsPerGroup(n);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      studentsPerGroup === n
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {n} HS
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Selector */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              3. Tên & Chủ đề nhóm
            </label>
            <div className="flex items-center gap-1.5">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    SoundEffects.click();
                    setActiveTheme(theme);
                  }}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold truncate transition-all cursor-pointer ${
                    activeTheme.id === theme.id
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                  title={theme.name}
                >
                  {theme.emojis[0]} {theme.name.split('/')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button & Sync */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Dự kiến: khoảng{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {mode === 'byGroupCount'
                ? `${Math.ceil(availableStudents.length / groupCount)} HS/nhóm`
                : `${Math.ceil(availableStudents.length / studentsPerGroup)} nhóm`}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleGenerateGroups}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              🎲 BẮT ĐẦU CHIA NHÓM
            </button>

            {isGenerated && (
              <button
                onClick={handleSyncToScoreboard}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                title="Tạo các đội thi đua trên Bảng điểm từ danh sách nhóm này"
              >
                <Trophy className="w-4 h-4" />
                Đưa vào Bảng điểm
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Selected Student Swap Notification */}
      {selectedStudent && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs text-slate-900 dark:text-white animate-in fade-in">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-amber-600" />
            <span>
              Đang chọn: <b>{selectedStudent.student.name}</b>. Nhấn vào nút "Chuyển vào đây" ở nhóm mong muốn!
            </span>
          </div>
          <button
            onClick={() => setSelectedStudent(null)}
            className="px-2 py-1 rounded bg-amber-200 dark:bg-amber-800 text-slate-900 dark:text-white font-bold cursor-pointer"
          >
            Hủy chuyển
          </button>
        </div>
      )}

      {/* Results Groups Display */}
      {isGenerated && groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {groups.map((group) => {
            const isDestination = selectedStudent && selectedStudent.sourceGroupId !== group.id;

            return (
              <div
                key={group.id}
                className={`rounded-2xl border transition-all flex flex-col bg-white dark:bg-slate-900 overflow-hidden shadow-xs ${
                  isDestination
                    ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Group Header */}
                <div className={`p-4 text-white flex items-center justify-between ${group.color}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{group.emoji}</span>
                    <div>
                      <input
                        type="text"
                        defaultValue={group.name}
                        onBlur={(e) => handleRenameGroup(group.id, e.target.value)}
                        className="font-sans font-bold text-base bg-transparent border-b border-white/20 focus:border-white text-white focus:outline-none w-36"
                      />
                      <p className="text-[11px] text-white/80">
                        {group.students.length} học sinh
                      </p>
                    </div>
                  </div>

                  {isDestination && (
                    <button
                      onClick={() => handleMoveStudentToGroup(group.id)}
                      className="px-2.5 py-1 rounded-xl bg-white text-slate-900 font-black text-xs shadow-md animate-bounce cursor-pointer"
                    >
                      Chuyển vào đây
                    </button>
                  )}
                </div>

                {/* Students list in this group */}
                <div className="p-3 flex-1 overflow-y-auto max-h-72 space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800">
                  {group.students.map((student, idx) => {
                    const isBeingMoved = selectedStudent?.student.id === student.id;

                    return (
                      <div
                        key={student.id}
                        className={`pt-1.5 first:pt-0 flex items-center justify-between group rounded-xl px-2 py-1 transition-colors ${
                          isBeingMoved
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-slate-900 dark:text-white font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold">{student.name}</span>
                        </div>

                        <button
                          onClick={() => {
                            SoundEffects.click();
                            setSelectedStudent({
                              student,
                              sourceGroupId: group.id,
                            });
                          }}
                          className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          title="Chuyển học sinh này sang nhóm khác"
                        >
                          Đổi nhóm
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">
            Chưa có nhóm nào được tạo
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Chọn phương thức chia ở bảng bên trên rồi bấm "Bắt đầu chia nhóm" để xếp nhóm tự động.
          </p>
          <button
            onClick={handleGenerateGroups}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Chia nhóm ngay
          </button>
        </div>
      )}
    </div>
  );
};
