import React from 'react';
import {
  Gamepad2,
  Dices,
  Users,
  Trophy,
  Timer,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Gift,
  Target,
  ListOrdered,
  Clock,
  Shuffle,
  Volume2,
  HelpCircle,
} from 'lucide-react';
import { ActivityLog, ClassRoom } from '../types';
import { SoundEffects } from '../lib/sound';

interface DashboardPageProps {
  classes: ClassRoom[];
  activeClass: ClassRoom | null;
  activityLogs: ActivityLog[];
  onNavigate: (tab: string) => void;
  onOpenQuickTimer: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  classes,
  activeClass,
  activityLogs,
  onNavigate,
  onOpenQuickTimer,
}) => {
  const totalStudents = classes.reduce((sum, c) => sum + c.students.length, 0);
  const activeClassPresentStudents =
    activeClass?.students.filter((s) => !s.isAbsent).length || 0;

  const quickLaunchGames = [
    {
      id: 'random-student',
      title: 'Gọi tên ngẫu nhiên',
      subtitle: 'Quay tên học sinh lên bảng phát biểu',
      icon: Dices,
      badge: 'Hot nhất',
    },
    {
      id: 'games',
      title: 'Kho 10+ Trò chơi',
      subtitle: 'Vòng quay, Hộp bí mật, Quiz, Gỡ bom',
      icon: Gamepad2,
      badge: '10 Game',
    },
    {
      id: 'questions',
      title: 'Ngân hàng câu hỏi',
      subtitle: 'Tạo bộ đề, import Excel/CSV & setup game',
      icon: HelpCircle,
      badge: 'Bộ đề mới',
    },
    {
      id: 'groups',
      title: 'Chia nhóm thần tốc',
      subtitle: 'Tự động phân nhóm thảo luận, bài tập',
      icon: Users,
      badge: 'Tiện lợi',
    },
    {
      id: 'scoreboard',
      title: 'Bảng điểm thi đua',
      subtitle: 'Cộng/trừ điểm các đội, vinh danh cúp',
      icon: Trophy,
      badge: 'Thi đua',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Hero Banner in Modern White & Blue */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
        {/* Decorative soft blue backdrop glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Classroom Game Hub • Dành riêng cho giáo viên
          </div>

          <h1 className="font-sans font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-slate-900 dark:text-white">
            Tạo Giờ Học Sôi Động & Tương Tác
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Nền tảng trò chơi máy chiếu cá nhân: Chọn lớp ➔ Chọn trò chơi ➔ Chiếu lên màn hình ➔ Chơi ngay! Không cần tài khoản, lưu trữ an toàn ngay trên trình duyệt của thầy/cô.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('random-student')}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Dices className="w-4 h-4" />
              Gọi Tên Ngẫu Nhiên Ngay
            </button>

            <button
              onClick={() => onNavigate('games')}
              className="px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
            >
              <Gamepad2 className="w-4 h-4" />
              Khám Phá Kho Trò Chơi
            </button>

            <button
              onClick={onOpenQuickTimer}
              className="px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Timer className="w-4 h-4 text-blue-600" />
              Đồng Hồ Nhanh
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total classes */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Tổng số lớp học
            </p>
            <p className="font-sans font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
              {classes.length}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Lớp đã thiết lập</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Total students */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Tổng học sinh
            </p>
            <p className="font-sans font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
              {totalStudents}
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
              Lớp đang chọn: {activeClassPresentStudents} HS
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total games */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Trò chơi sẵn sàng
            </p>
            <p className="font-sans font-black text-2xl sm:text-3xl text-blue-600 dark:text-blue-400 mt-1">
              10+
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Vòng quay, quiz, hộp quà...</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center">
            <Gamepad2 className="w-6 h-6" />
          </div>
        </div>

        {/* Current Class */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Lớp đang hoạt động
            </p>
            <p className="font-sans font-black text-xl sm:text-2xl text-slate-900 dark:text-white mt-1 truncate max-w-[120px]">
              {activeClass ? activeClass.name : 'Chưa chọn'}
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
              Môn: {activeClass?.subject || 'Chung'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-blue-600" />
            Công cụ tương tác thường dùng
          </h3>
          <span className="text-xs text-slate-400">Chiếu máy chiếu và bắt đầu trong 1 giây</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickLaunchGames.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs transform group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-sans font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Mở ngay</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Quick Game Highlights + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Highlights (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Kho trò chơi phong phú
            </h3>
            <button
              onClick={() => onNavigate('games')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Xem tất cả 10 game ➔
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'lucky-wheel', name: '🎡 Vòng Quay May Mắn', desc: 'Quay tên học sinh hoặc phần thưởng kẹo/điểm' },
              { id: 'mystery-box', name: '🎁 Chiếc Hộp Bí Mật', desc: '12 hộp quà chứa nhiệm vụ & điểm số kịch tính' },
              { id: 'quiz-challenge', name: '🧠 Đấu Trí Trắc Nghiệm', desc: 'Bộ câu hỏi trắc nghiệm A B C D tính giờ' },
              { id: 'fastest-finger', name: '🏃 Ai Nhanh Hơn', desc: 'Bấm chuông giành quyền trả lời câu hỏi tốc độ' },
              { id: 'bullseye', name: '🎯 Bắn Bia Tính Điểm', desc: 'Ném phi tiêu trúng hồng tâm 100 điểm' },
              { id: 'bomb-defusal', name: '💣 Gỡ Mìn Lớp Học', desc: '16 ô số bí mật, cẩn thận đừng chạm vào bom' },
            ].map((g) => (
              <div
                key={g.id}
                onClick={() => onNavigate('games')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer"
              >
                <h5 className="font-sans font-bold text-xs text-slate-900 dark:text-white">{g.name}</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Nhật ký hoạt động
              </h3>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {activityLogs.length > 0 ? (
                activityLogs.slice(0, 7).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <p className="font-bold text-slate-900 dark:text-white">{log.title}</p>
                    {log.details && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{log.details}</p>
                    )}
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {new Date(log.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Chưa có hoạt động nào trong phiên làm việc này.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onNavigate('classes')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              Quản lý danh sách lớp học
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
