import React from 'react';
import {
  LayoutDashboard,
  Gamepad2,
  Dices,
  Users,
  ListOrdered,
  GraduationCap,
  Trophy,
  Timer,
  History,
  Settings,
  Sparkles,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { SoundEffects } from '../../lib/sound';

export type NavTab =
  | 'dashboard'
  | 'games'
  | 'questions'
  | 'random-student'
  | 'groups'
  | 'random-order'
  | 'classes'
  | 'scoreboard'
  | 'timer'
  | 'history'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  gameCount?: number;
  questionCount?: number;
  studentCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  gameCount = 11,
  questionCount = 0,
  studentCount = 0,
}) => {
  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    {
      id: 'games',
      label: 'Kho trò chơi',
      icon: Gamepad2,
      badge: `${gameCount} game`,
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    },
    {
      id: 'questions',
      label: 'Ngân hàng câu hỏi',
      icon: HelpCircle,
      badge: questionCount > 0 ? `${questionCount} câu` : undefined,
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    },
    { id: 'random-student', label: 'Gọi tên ngẫu nhiên', icon: Dices },
    { id: 'groups', label: 'Chia nhóm thông minh', icon: Users },
    { id: 'random-order', label: 'Bốc thăm thứ tự', icon: ListOrdered },
    {
      id: 'classes',
      label: 'Quản lý lớp & HS',
      icon: GraduationCap,
      badge: studentCount > 0 ? `${studentCount} HS` : undefined,
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    },
    { id: 'scoreboard', label: 'Bảng điểm thi đua', icon: Trophy },
    { id: 'timer', label: 'Đồng hồ lớp học', icon: Timer },
    { id: 'history', label: 'Lịch sử hoạt động', icon: History },
    { id: 'settings', label: 'Cài đặt & Dữ liệu', icon: Settings },
  ];

  const handleNavClick = (id: NavTab) => {
    SoundEffects.click();
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation links */}
        <div className="p-4 space-y-1 overflow-y-auto flex-1">
          <div className="px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Chức năng chính
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom teacher tip styled as Quick Tools / Tips */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 shadow-2xs text-xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Mẹo giảng dạy
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Bật <b>Chế độ trình chiếu</b> trên thanh trên cùng để tối ưu không gian hiển thị cho học sinh trên máy chiếu!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
