import React, { useState } from 'react';
import {
  X, Download, Upload, FileText, CheckCircle2, AlertTriangle,
  Copy, FileSpreadsheet, Sparkles, Check
} from 'lucide-react';
import { QuizQuestion } from '../../types';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  onImport: (importedQuestions: QuizQuestion[]) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  questions,
  onImport,
}) => {
  const [tab, setTab] = useState<'import' | 'export'>('import');
  const [rawInput, setRawInput] = useState('');
  const [parsedPreview, setParsedPreview] = useState<QuizQuestion[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleParseJSON = (jsonText: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const data = JSON.parse(jsonText);
      const list = Array.isArray(data) ? data : data.questions || [];
      if (!Array.isArray(list) || list.length === 0) {
        throw new Error('Dữ liệu JSON không chứa danh sách câu hỏi hợp lệ.');
      }
      const validated: QuizQuestion[] = list.map((item, idx) => ({
        id: item.id || `q-imported-${Date.now()}-${idx}`,
        category: item.category || item.subject || 'Chung',
        subject: item.subject || item.category || 'Chung',
        chapter: item.chapter || undefined,
        topic: item.topic || undefined,
        type: item.type || 'multiple-choice',
        question: item.question || `Câu hỏi ${idx + 1}`,
        options: item.options || (item.type === 'multiple-choice' ? ['A', 'B', 'C', 'D'] : undefined),
        answer: item.answer !== undefined ? item.answer : 0,
        matchingPairs: item.matchingPairs,
        orderItems: item.orderItems,
        explanation: item.explanation,
        hint: item.hint,
        points: Number(item.points) || 10,
        difficulty: item.difficulty || 'easy',
        imageUrl: item.imageUrl,
        setId: item.setId,
        createdAt: Date.now(),
      }));
      setParsedPreview(validated);
      setSuccessMsg(`Đã phân tích thành công ${validated.length} câu hỏi!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi phân tích cú pháp JSON. Vui lòng kiểm tra lại cấu trúc.');
      setParsedPreview([]);
    }
  };

  const handleParseCSV = (csvText: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        throw new Error('Tệp CSV cần ít nhất 1 dòng tiêu đề và 1 dòng dữ liệu.');
      }

      // Header parsing
      const questionsList: QuizQuestion[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 2) {
          const [cat, qText, optA, optB, optC, optD, ans, pts, diff] = parts;
          if (qText) {
            const opts = [optA, optB, optC, optD].filter(Boolean);
            let ansVal: any = 0;
            if (ans) {
              const upper = ans.toUpperCase();
              if (upper === 'A') ansVal = 0;
              else if (upper === 'B') ansVal = 1;
              else if (upper === 'C') ansVal = 2;
              else if (upper === 'D') ansVal = 3;
              else if (!isNaN(Number(ans))) ansVal = Number(ans);
              else ansVal = ans;
            }
            questionsList.push({
              id: `q-csv-${Date.now()}-${i}`,
              category: cat || 'Tin học',
              subject: cat || 'Tin học',
              type: opts.length > 0 ? 'multiple-choice' : 'short-answer',
              question: qText,
              options: opts.length > 0 ? opts : undefined,
              answer: ansVal,
              points: Number(pts) || 10,
              difficulty: (diff as any) || 'easy',
              createdAt: Date.now(),
            });
          }
        }
      }

      if (questionsList.length === 0) {
        throw new Error('Không trích xuất được câu hỏi nào từ file CSV.');
      }

      setParsedPreview(questionsList);
      setSuccessMsg(`Đã nhận diện ${questionsList.length} câu hỏi từ dữ liệu CSV!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi đọc dữ liệu CSV.');
      setParsedPreview([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setRawInput(content);
      if (file.name.endsWith('.json')) {
        handleParseJSON(content);
      } else {
        handleParseCSV(content);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    if (parsedPreview.length === 0) return;
    onImport(parsedPreview);
    onClose();
  };

  const downloadSampleTemplate = (type: 'csv' | 'json') => {
    if (type === 'csv') {
      const csvContent =
        'MonHoc,CauHoi,DapAnA,DapAnB,DapAnC,DapAnD,DapAnDung,Diem,DoKho\n' +
        '"Tin học","Thẻ HTML nào dùng để tạo liên kết?","<link>","<a>","<href>","<url>","B",10,"easy"\n' +
        '"Toán học","Căn bậc hai của 144 bằng bao nhiêu?","10","11","12","14","C",10,"easy"\n' +
        '"Tiếng Anh","Trái nghĩa với \"Hot\" là gì?","Cold","Warm","Cool","Dry","A",10,"easy"';
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Mau_Cau_Hoi_ClassroomHub.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const sampleJSON = [
        {
          subject: 'Tin học',
          category: 'Tin học',
          type: 'multiple-choice',
          question: 'Ngôn ngữ nào dùng để lập trình logic phía máy khách trên web?',
          options: ['PHP', 'HTML', 'JavaScript', 'CSS'],
          answer: 2,
          points: 10,
          difficulty: 'easy',
          explanation: 'JavaScript chạy trực tiếp trên trình duyệt máy khách.',
        },
        {
          subject: 'Tin học',
          category: 'Tin học',
          type: 'true-false',
          question: 'CPU là bộ não của máy tính điều khiển mọi phép tính.',
          answer: true,
          points: 10,
          difficulty: 'easy',
        },
      ];
      const blob = new Blob([JSON.stringify(sampleJSON, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Mau_Cau_Hoi_ClassroomHub.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Classroom_QuestionBank_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = 'ID,MonHoc,DangCauHoi,CauHoi,LuaChonA,LuaChonB,LuaChonC,LuaChonD,DapAnDung,Diem,DoKho\n';
    const rows = questions
      .map((q) => {
        const optA = q.options?.[0] ? `"${q.options[0].replace(/"/g, '""')}"` : '""';
        const optB = q.options?.[1] ? `"${q.options[1].replace(/"/g, '""')}"` : '""';
        const optC = q.options?.[2] ? `"${q.options[2].replace(/"/g, '""')}"` : '""';
        const optD = q.options?.[3] ? `"${q.options[3].replace(/"/g, '""')}"` : '""';
        const qText = `"${q.question.replace(/"/g, '""')}"`;
        const ans = `"${String(q.answer).replace(/"/g, '""')}"`;
        return `${q.id},"${q.category || q.subject || ''}","${q.type}",${qText},${optA},${optB},${optC},${optD},${ans},${q.points || 10},"${q.difficulty || 'easy'}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Classroom_QuestionBank_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(questions, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Nhập / Xuất Ngân Hàng Câu Hỏi</h2>
              <p className="text-xs text-slate-500">
                Hỗ trợ định dạng JSON và CSV/Excel để sao chép hoặc chia sẻ đề thi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switching */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-white">
          <button
            onClick={() => setTab('import')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              tab === 'import'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" /> Nhập dữ liệu (Import)
          </button>
          <button
            onClick={() => setTab('export')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              tab === 'export'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" /> Xuất dữ liệu ({questions.length} câu)
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === 'import' ? (
            <div className="space-y-4">
              {/* Sample Download Bar */}
              <div className="flex flex-wrap items-center justify-between p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs gap-2">
                <span className="text-blue-900 font-medium">
                  Chưa có mẫu câu hỏi chuẩn? Tải file mẫu tại đây:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadSampleTemplate('csv')}
                    className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Mẫu CSV / Excel
                  </button>
                  <button
                    onClick={() => downloadSampleTemplate('json')}
                    className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Mẫu JSON
                  </button>
                </div>
              </div>

              {/* Upload Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  1. Chọn tệp tệp tin (.json hoặc .csv)
                </label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    accept=".json,.csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <Upload className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">
                      Nhấn để tải tệp hoặc kéo thả tệp JSON / CSV vào đây
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Hỗ trợ tệp JSON chuẩn hoặc bảng tính CSV</p>
                  </div>
                </div>
              </div>

              {/* Or Paste Raw Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Hoặc dán trực tiếp nội dung JSON / CSV
                </label>
                <textarea
                  value={rawInput}
                  onChange={(e) => {
                    const text = e.target.value;
                    setRawInput(text);
                    if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
                      handleParseJSON(text);
                    } else if (text.includes(',')) {
                      handleParseCSV(text);
                    }
                  }}
                  placeholder='Dán chuỗi JSON hoặc dòng CSV vào đây...'
                  rows={4}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Status alerts */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Parsed Preview */}
              {parsedPreview.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Xem trước ({parsedPreview.length} câu hỏi sẵn sàng thêm)</span>
                    <span className="text-emerald-600 font-bold">Hợp lệ</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {parsedPreview.slice(0, 8).map((q, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                      >
                        <div className="truncate flex-1 pr-2">
                          <span className="font-bold text-slate-600 mr-2">#{idx + 1}</span>
                          <span className="text-slate-800 font-medium">{q.question}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 shrink-0">
                          {q.type}
                        </span>
                      </div>
                    ))}
                    {parsedPreview.length > 8 && (
                      <p className="text-center text-[11px] text-slate-400">
                        ... và {parsedPreview.length - 8} câu hỏi khác
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Xuất toàn bộ <b>{questions.length} câu hỏi</b> hiện có trong ngân hàng để lưu trữ dự phòng hoặc mang sang thiết bị lớp học khác:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/50 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      JSON
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-600 text-sm">
                        Xuất tệp .JSON đầy đủ
                      </h4>
                      <p className="text-xs text-slate-400">Đầy đủ thông tin, cặp ghép, thứ tự và media</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-blue-600">
                    Tải về máy (.json) ➔
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      CSV
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 text-sm">
                        Xuất tệp .CSV / Excel
                      </h4>
                      <p className="text-xs text-slate-400">Mở và chỉnh sửa trực tiếp trong Excel / Google Sheets</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-emerald-600">
                    Tải về máy (.csv) ➔
                  </div>
                </button>
              </div>

              {/* Copy Raw JSON */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Sao chép nhanh chuỗi JSON
                  </label>
                  <button
                    onClick={handleCopyJSON}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Đã sao chép!' : 'Sao chép vào Clipboard'}
                  </button>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl text-slate-200 font-mono text-[11px] max-h-32 overflow-y-auto">
                  {JSON.stringify(questions.slice(0, 3), null, 2)}
                  {questions.length > 3 && '\n// ... còn nhiều câu hỏi khác'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Đóng
          </button>
          {tab === 'import' && (
            <button
              type="button"
              onClick={handleApplyImport}
              disabled={parsedPreview.length === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Thêm {parsedPreview.length} Câu Vào Ngân Hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
