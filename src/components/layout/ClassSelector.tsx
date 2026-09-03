import React, { useState } from 'react';
import { ChevronDown, Check, Plus, Users, School } from 'lucide-react';
import { ClassRoom } from '../../types';

interface ClassSelectorProps {
  classes: ClassRoom[];
  activeClass: ClassRoom | null;
  onSelectClass: (id: string) => void;
  onManageClasses: () => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  activeClass,
  onSelectClass,
  onManageClasses,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-semibold transition-all shadow-2xs text-sm cursor-pointer"
        title="Chọn lớp học hiện tại"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-600 text-white shadow-xs shadow-blue-500/20">
          <School className="w-3.5 h-3.5" />
        </span>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">Lớp:</span>
        <span className="max-w-[120px] sm:max-w-[180px] truncate font-bold text-blue-700 dark:text-blue-400">
          {activeClass ? activeClass.name : 'Chưa chọn lớp'}
        </span>
        {activeClass && (
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/60 dark:border-blue-800/60">
            {activeClass.students.filter(s => !s.isAbsent).length} HS
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Danh sách lớp học
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto p-2 space-y-1 bg-white dark:bg-slate-900">
              {classes.map((c) => {
                const isSelected = activeClass?.id === c.id;
                const activeCount = c.students.filter((s) => !s.isAbsent).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectClass(c.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-sm truncate">{c.name}</p>
                      <p
                        className={`text-xs truncate ${
                          isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-400'
                        }`}
                      >
                        {c.subject || 'Lớp học'} • {c.schoolYear || '2025-2026'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          isSelected
                            ? 'bg-blue-700 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {activeCount} HS
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onManageClasses();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Quản lý & Thêm lớp học mới
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
