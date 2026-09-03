import React from 'react';
import { History, Clock, Trash2, Calendar, FileText } from 'lucide-react';
import { ActivityLog } from '../types';
import { SoundEffects } from '../lib/sound';

interface HistoryPageProps {
  activityLogs: ActivityLog[];
  onClearHistory?: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  activityLogs,
  onClearHistory,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              Lịch sử hoạt động lớp học
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                {activityLogs.length} ghi nhận
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nhật ký các lượt gọi tên, chia nhóm, tính điểm và trò chơi đã diễn ra
            </p>
          </div>
        </div>

        {activityLogs.length > 0 && onClearHistory && (
          <button
            onClick={() => {
              SoundEffects.click();
              if (confirm('Bạn có chắc chắn muốn dọn sạch nhật ký hoạt động không?')) {
                onClearHistory();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-bold text-xs transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Xóa nhật ký
          </button>
        )}
      </div>

      {/* Log list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        {activityLogs.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-200">
              Chưa có hoạt động nào được ghi lại
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Khi bạn tổ chức trò chơi, quay tên hoặc chia nhóm, lịch sử sẽ tự động hiển thị ở đây.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activityLogs.map((log) => {
              const date = new Date(log.timestamp);
              const formattedTime = date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const formattedDate = date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:border-blue-400"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {log.title}
                      </h4>
                      {log.details && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 dark:text-slate-500 sm:self-center shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formattedTime} • {formattedDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
