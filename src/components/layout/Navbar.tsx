import React from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Timer as TimerIcon,
  Menu,
  Sparkles,
  Gamepad2,
} from 'lucide-react';
import { ClassRoom } from '../../types';
import { ClassSelector } from './ClassSelector';
import { SoundEffects } from '../../lib/sound';

interface NavbarProps {
  classes: ClassRoom[];
  activeClass: ClassRoom | null;
  onSelectClass: (id: string) => void;
  onManageClasses: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  presentationMode: boolean;
  onTogglePresentation: () => void;
  onOpenQuickTimer: () => void;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  classes,
  activeClass,
  onSelectClass,
  onManageClasses,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
  presentationMode,
  onTogglePresentation,
  onOpenQuickTimer,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between gap-2 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          title="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs shadow-blue-500/20">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-sans font-bold text-base sm:text-lg leading-tight tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              Classroom Game Hub
              <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                PRO
              </span>
            </h1>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Trò chơi & Quản lý lớp học thông minh
            </p>
          </div>
        </div>
      </div>

      {/* Center: Class Selector */}
      <div className="flex items-center gap-2">
        <ClassSelector
          classes={classes}
          activeClass={activeClass}
          onSelectClass={onSelectClass}
          onManageClasses={onManageClasses}
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Quick Timer Button */}
        <button
          onClick={() => {
            SoundEffects.click();
            onOpenQuickTimer();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 font-semibold text-xs transition-all shadow-2xs cursor-pointer"
          title="Mở đồng hồ bấm giờ nhanh"
        >
          <TimerIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
          <span className="hidden md:inline">Đồng hồ</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            SoundEffects.click();
            onToggleSound();
          }}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 border-slate-200 dark:border-slate-700'
          }`}
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Presentation Fullscreen Mode */}
        <button
          onClick={() => {
            SoundEffects.click();
            onTogglePresentation();
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
            presentationMode
              ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-900'
              : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 shadow-blue-500/20'
          }`}
          title="Chế độ Trình chiếu máy chiếu (Toàn màn hình)"
        >
          {presentationMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span className="hidden lg:inline">{presentationMode ? 'Thoát' : 'Chiếu máy chiếu'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => {
            SoundEffects.click();
            onToggleTheme();
          }}
          className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-2xs"
          title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
