import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Database,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileJson,
} from 'lucide-react';
import { AppSettings, ClassRoom, QuizQuestion, TeamScore } from '../types';
import { SoundEffects } from '../lib/sound';
import { fireConfetti } from '../lib/confetti';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  classes: ClassRoom[];
  quizQuestions: QuizQuestion[];
  teamScores: TeamScore[];
  onRestoreAllData: (data: {
    classes?: ClassRoom[];
    quizQuestions?: QuizQuestion[];
    teamScores?: TeamScore[];
    settings?: AppSettings;
  }) => void;
  onResetToDefault: () => void;
  onLogActivity: (title: string, details?: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  classes,
  quizQuestions,
  teamScores,
  onRestoreAllData,
  onResetToDefault,
  onLogActivity,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportBackup = () => {
    SoundEffects.win();
    fireConfetti();

    const backupData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      appName: 'Classroom Game Hub',
      classes,
      quizQuestions,
      teamScores,
      settings,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `classroom-game-hub-backup-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onLogActivity('Xuất file sao lưu dữ liệu (.JSON)');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.classes && Array.isArray(parsed.classes)) {
          onRestoreAllData({
            classes: parsed.classes,
            quizQuestions: parsed.quizQuestions || [],
            teamScores: parsed.teamScores || [],
            settings: parsed.settings || settings,
          });

          SoundEffects.win();
          fireConfetti();
          setImportStatus('✅ Nhập dữ liệu sao lưu thành công!');
          onLogActivity('Khôi phục dữ liệu từ file sao lưu JSON');
        } else {
          setImportStatus('❌ File JSON không đúng định dạng sao lưu của ứng dụng!');
        }
      } catch (err) {
        setImportStatus('❌ Đã xảy ra lỗi khi đọc file sao lưu JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center shadow-xs">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white">
            Cài đặt & Sao lưu dữ liệu
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tùy biến âm thanh, hiệu ứng máy chiếu và sao lưu/khôi phục dữ liệu cá nhân
          </p>
        </div>
      </div>

      {/* System Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Âm thanh & Hiệu ứng trình chiếu
        </h3>

        <div className="space-y-4">
          {/* Sound toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-sans font-bold text-xs text-slate-900 dark:text-white">
                Âm thanh trò chơi (Sound Effects)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Hiệu ứng âm thanh khi quay thưởng, lật bài, đồng hồ đếm ngược và chuông báo
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-xs ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Confetti toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-sans font-bold text-xs text-slate-900 dark:text-white">
                Hiệu ứng pháo hoa chúc mừng (Confetti)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bắn pháo hoa rực rỡ khi học sinh hoặc đội giành chiến thắng
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ confettiEnabled: !settings.confettiEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.confettiEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-xs ${
                  settings.confettiEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Backup and Restore */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Sao lưu & Đồng bộ máy tính (Backup & Restore)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Vì ứng dụng chạy 100% trên trình duyệt và không cần tài khoản, thầy/cô hãy xuất file dự phòng định kỳ để lưu vào USB hoặc Google Drive cá nhân.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Export button */}
          <button
            onClick={handleExportBackup}
            className="p-5 rounded-xl border-2 border-blue-200 dark:border-blue-900 hover:border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-left transition-all cursor-pointer group"
          >
            <Download className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
              Xuất dữ liệu dự phòng (.JSON)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Tải toàn bộ danh sách {classes.length} lớp học, học sinh, câu hỏi về máy
            </p>
          </button>

          {/* Import button */}
          <label className="p-5 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50 dark:bg-slate-850 text-left transition-all cursor-pointer group block">
            <Upload className="w-6 h-6 text-slate-700 dark:text-slate-300 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
              Nhập dữ liệu dự phòng (.JSON)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Khôi phục danh sách lớp và câu hỏi từ file JSON đã lưu
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200">
            {importStatus}
          </div>
        )}
      </div>

      {/* Reset to factory defaults */}
      <div className="bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-sans font-bold text-sm text-rose-800 dark:text-rose-300">
            Khôi phục dữ liệu mẫu ban đầu
          </h4>
          <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
            Xóa dữ liệu hiện tại và tải lại 3 lớp học mẫu cùng ngân hàng câu hỏi chuẩn
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Bạn có chắc muốn đặt lại toàn bộ dữ liệu mẫu ban đầu?')) {
              onResetToDefault();
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0"
        >
          Đặt lại dữ liệu mẫu
        </button>
      </div>
    </div>
  );
};
