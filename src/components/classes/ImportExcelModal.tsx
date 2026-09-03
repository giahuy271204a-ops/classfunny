import React, { useState } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Users,
  Sparkles,
} from 'lucide-react';
import {
  ExcelPreviewResult,
  convertRowsToStudents,
  downloadSampleExcel,
  parseExcelFile,
} from '../../lib/excel';
import { Student } from '../../types';
import { SoundEffects } from '../../lib/sound';
import { fireConfetti } from '../../lib/confetti';

interface ImportExcelModalProps {
  isOpen: boolean;
  className: string;
  onClose: () => void;
  onImportSuccess: (newStudents: Student[], mode: 'append' | 'replace') => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  className,
  onClose,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ExcelPreviewResult | null>(null);
  const [nameColumn, setNameColumn] = useState('');
  const [codeColumn, setCodeColumn] = useState('');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (selectedFile: File) => {
    setError(null);
    setLoading(true);
    try {
      const result = await parseExcelFile(selectedFile);
      setFile(selectedFile);
      setPreview(result);
      setNameColumn(result.detectedNameCol);
      setCodeColumn(result.detectedCodeCol);
      SoundEffects.success();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể đọc file Excel/CSV.');
      SoundEffects.error();
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleExecuteImport = () => {
    if (!preview || !nameColumn) {
      setError('Vui lòng chọn cột chứa Họ và tên học sinh.');
      return;
    }

    const { students, duplicatesCount } = convertRowsToStudents(
      preview.rows,
      nameColumn,
      codeColumn
    );

    if (students.length === 0) {
      setError('Không tìm thấy học sinh hợp lệ nào từ file.');
      return;
    }

    SoundEffects.win();
    fireConfetti();
    onImportSuccess(students, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">
                Import danh sách học sinh
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thêm học sinh vào lớp <span className="font-bold text-blue-600 dark:text-blue-400">{className}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              SoundEffects.click();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 py-4 space-y-4">
          {!preview ? (
            <>
              {/* Drag drop upload box */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-8 text-center transition-colors bg-slate-50 dark:bg-slate-850 cursor-pointer"
                onClick={() => document.getElementById('excel-file-input')?.click()}
              >
                <input
                  id="excel-file-input"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                />
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="font-sans font-bold text-slate-900 dark:text-white text-base mb-1">
                  Kéo thả file Excel hoặc CSV vào đây
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Hỗ trợ định dạng .xlsx, .xls, .csv có các cột STT, Họ và tên, Mã học sinh
                </p>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Chọn tệp từ máy tính
                </button>
              </div>

              {/* Sample download & instructions */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                <div className="text-xs text-slate-900 dark:text-slate-100">
                  <p className="font-bold mb-0.5">Chưa có file mẫu?</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tải mẫu Excel chuẩn để điền danh sách học sinh nhanh nhất.
                  </p>
                </div>
                <button
                  onClick={() => {
                    SoundEffects.click();
                    downloadSampleExcel();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Tải file mẫu .xlsx
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Preview header */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-bold text-xs text-blue-900 dark:text-blue-200">
                      Đã đọc {preview.totalRows} dòng từ file <span className="underline">{file?.name}</span>
                    </p>
                    <p className="text-[11px] text-blue-700 dark:text-blue-400">
                      Vui lòng xác nhận các cột thông tin bên dưới:
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPreview(null);
                    setFile(null);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                >
                  Đổi file khác
                </button>
              </div>

              {/* Column Mapping Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Cột Họ và tên học sinh <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={nameColumn}
                    onChange={(e) => setNameColumn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    {preview.headers.map((h) => (
                      <option key={h} value={h}>
                        {h} {h === preview.detectedNameCol ? '(Khuyên dùng)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Cột Mã học sinh (Tùy chọn)
                  </label>
                  <select
                    value={codeColumn}
                    onChange={(e) => setCodeColumn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <option value="">-- Không sử dụng mã HS --</option>
                    {preview.headers.map((h) => (
                      <option key={h} value={h}>
                        {h} {h === preview.detectedCodeCol ? '(Khuyên dùng)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Import Mode Radio */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Tùy chọn lưu dữ liệu:
                </p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="accent-blue-600"
                    />
                    Thêm vào danh sách hiện có
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="accent-rose-600"
                    />
                    Ghi đè (Xóa danh sách cũ)
                  </label>
                </div>
              </div>

              {/* Table Preview of first 5 rows */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Xem trước 5 dòng đầu tiên:
                </p>
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Họ và tên</th>
                        <th className="p-2.5">Mã HS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {preview.rows.slice(0, 5).map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-2.5 text-slate-400">{i + 1}</td>
                          <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">
                            {String(row[nameColumn] || '--')}
                          </td>
                          <td className="p-2.5 text-slate-500 dark:text-slate-400">
                            {codeColumn ? String(row[codeColumn] || '--') : '--'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={() => {
              SoundEffects.click();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          {preview && (
            <button
              onClick={handleExecuteImport}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Xác nhận Import vào lớp
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
