import React, { useState, useMemo } from 'react';
import {
  HelpCircle, Plus, Search, Filter, Layers, BookOpen,
  Star, Trash2, Edit3, Copy, Download, Upload, Eye,
  Tag, Award, CheckCircle2, ChevronRight, Sparkles,
  ArrowUpDown, Image as ImageIcon, CheckSquare, Square,
  FolderPlus, Play, AlertCircle, X
} from 'lucide-react';
import { GamePreset, QuestionSet, QuestionType, QuizQuestion } from '../types';
import { QuestionModal } from '../components/questions/QuestionModal';
import { QuestionSetModal } from '../components/questions/QuestionSetModal';
import { ImportExportModal } from '../components/questions/ImportExportModal';

interface QuestionBankPageProps {
  questions: QuizQuestion[];
  questionSets: QuestionSet[];
  onSaveQuestion: (q: QuizQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onBulkDeleteQuestions: (ids: string[]) => void;
  onSaveQuestionSet: (set: QuestionSet) => void;
  onDeleteQuestionSet: (id: string) => void;
  onImportQuestions: (imported: QuizQuestion[]) => void;
  onLaunchGameWithSet?: (setId: string) => void;
}

export const QuestionBankPage: React.FC<QuestionBankPageProps> = ({
  questions,
  questionSets,
  onSaveQuestion,
  onDeleteQuestion,
  onBulkDeleteQuestions,
  onSaveQuestionSet,
  onDeleteQuestionSet,
  onImportQuestions,
  onLaunchGameWithSet,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'sets'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterSet, setFilterSet] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  // Selection & Bulk
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [assignSetTarget, setAssignSetTarget] = useState<string>('');

  // Modals
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [defaultSetForNew, setDefaultSetForNew] = useState<string | undefined>(undefined);

  const [isSetModalOpen, setIsSetModalOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<QuestionSet | null>(null);

  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<QuizQuestion | null>(null);

  // Unique subjects for filter
  const subjects = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      const s = q.subject || q.category;
      if (s) set.add(s);
    });
    return Array.from(set);
  }, [questions]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesQuestion = q.question.toLowerCase().includes(query);
        const matchesTopic = q.topic?.toLowerCase().includes(query) || false;
        const matchesTags = q.tags?.some((t) => t.toLowerCase().includes(query)) || false;
        const matchesExpl = q.explanation?.toLowerCase().includes(query) || false;
        if (!matchesQuestion && !matchesTopic && !matchesTags && !matchesExpl) return false;
      }

      // Subject
      if (filterSubject !== 'all') {
        const subj = q.subject || q.category;
        if (subj !== filterSubject) return false;
      }

      // Type
      if (filterType !== 'all') {
        if (filterType === 'multiple-choice' && q.type !== 'multiple-choice' && q.type !== 'multiple') return false;
        else if (filterType === 'true-false' && q.type !== 'true-false' && q.type !== 'boolean') return false;
        else if (filterType === 'short-answer' && q.type !== 'short-answer' && q.type !== 'input') return false;
        else if (filterType !== q.type && !q.type.includes(filterType)) return false;
      }

      // Difficulty
      if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;

      // Set
      if (filterSet !== 'all' && q.setId !== filterSet) return false;

      // Favorite
      if (onlyFavorites && !q.isFavorite) return false;

      return true;
    });
  }, [questions, searchTerm, filterSubject, filterType, filterDifficulty, filterSet, onlyFavorites]);

  // Bulk handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredQuestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQuestions.map((q) => q.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} câu hỏi đã chọn không?`)) {
      onBulkDeleteQuestions(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkDuplicate = () => {
    selectedIds.forEach((id) => {
      const original = questions.find((q) => q.id === id);
      if (original) {
        onSaveQuestion({
          ...original,
          id: `q-dup-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          question: `${original.question} (Bản sao)`,
          createdAt: Date.now(),
        });
      }
    });
    setSelectedIds([]);
  };

  const handleBulkAssignSet = () => {
    if (!assignSetTarget || selectedIds.length === 0) return;
    selectedIds.forEach((id) => {
      const original = questions.find((q) => q.id === id);
      if (original) {
        onSaveQuestion({
          ...original,
          setId: assignSetTarget,
        });
      }
    });
    setSelectedIds([]);
    setAssignSetTarget('');
  };

  const handleToggleFavorite = (q: QuizQuestion) => {
    onSaveQuestion({
      ...q,
      isFavorite: !q.isFavorite,
    });
  };

  const handleDuplicateOne = (q: QuizQuestion) => {
    onSaveQuestion({
      ...q,
      id: `q-dup-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      question: `${q.question} (Bản sao)`,
      createdAt: Date.now(),
    });
  };

  const getTypeBadge = (type: QuestionType) => {
    switch (type) {
      case 'multiple':
      case 'multiple-choice':
        return { label: 'Trắc nghiệm', icon: '🔘', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'boolean':
      case 'true-false':
        return { label: 'Đúng / Sai', icon: '⚖️', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'input':
      case 'short-answer':
        return { label: 'Trả lời ngắn', icon: '✍️', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'fill-blank':
        return { label: 'Điền chỗ trống', icon: '📝', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'matching':
        return { label: 'Ghép đôi', icon: '🔄', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'ordering':
        return { label: 'Sắp xếp thứ tự', icon: '🔢', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'multiple-answer':
        return { label: 'Nhiều đáp án', icon: '☑️', bg: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'image-question':
        return { label: 'Kèm hình ảnh', icon: '🖼️', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Trắc nghiệm', icon: '🔘', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const getDifficultyBadge = (diff?: 'easy' | 'medium' | 'hard') => {
    switch (diff) {
      case 'easy':
        return { label: 'Dễ', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'medium':
        return { label: 'Vừa', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'hard':
        return { label: 'Khó', color: 'text-red-700 bg-red-50 border-red-200' };
      default:
        return { label: 'Dễ', color: 'text-slate-600 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              Ngân Hàng Câu Hỏi & Bộ Đề
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
              {questions.length} câu hỏi
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý câu hỏi linh hoạt, phân loại theo môn học, chương bài và gán vào các trò chơi lớp học
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsImportExportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Nhập / Xuất
          </button>

          <button
            onClick={() => {
              setEditingSet(null);
              setIsSetModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-600" />
            Tạo Bộ Câu Hỏi
          </button>

          <button
            onClick={() => {
              setEditingQuestion(null);
              setDefaultSetForNew(undefined);
              setIsQuestionModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tạo Câu Hỏi Mới
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Tất cả câu hỏi ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('sets')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'sets'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Bộ câu hỏi theo chủ đề ({questionSets.length})
        </button>
      </div>

      {/* TAB 1: ALL QUESTIONS */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm nội dung câu hỏi, chủ đề, thẻ tag..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Subject Filter */}
              <div>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-blue-500 outline-none"
                >
                  <option value="all">Tất cả môn học</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      Môn: {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-blue-500 outline-none"
                >
                  <option value="all">Tất cả dạng câu hỏi (8 dạng)</option>
                  <option value="multiple-choice">🔘 Trắc nghiệm 1 đáp án</option>
                  <option value="true-false">⚖️ Đúng / Sai</option>
                  <option value="short-answer">✍️ Trả lời ngắn</option>
                  <option value="fill-blank">📝 Điền vào chỗ trống</option>
                  <option value="matching">🔄 Ghép đôi</option>
                  <option value="ordering">🔢 Sắp xếp thứ tự</option>
                  <option value="multiple-answer">☑️ Nhiều đáp án đúng</option>
                  <option value="image-question">🖼️ Kèm hình ảnh</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-blue-500 outline-none"
                >
                  <option value="all">Tất cả độ khó</option>
                  <option value="easy">Độ khó: Dễ</option>
                  <option value="medium">Độ khó: Vừa</option>
                  <option value="hard">Độ khó: Khó</option>
                </select>
              </div>
            </div>

            {/* Sub-bar: Set filter & favorite toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-medium">Lọc theo bộ:</span>
                  <select
                    value={filterSet}
                    onChange={(e) => setFilterSet(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs outline-none"
                  >
                    <option value="all">Tất cả bộ câu hỏi</option>
                    {questionSets.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setOnlyFavorites(!onlyFavorites)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    onlyFavorites
                      ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                  Chỉ câu hỏi yêu thích
                </button>
              </div>

              <div className="flex items-center gap-2 text-slate-500">
                <span>
                  Hiển thị <b>{filteredQuestions.length}</b> / {questions.length} câu hỏi
                </span>
                {(filterSubject !== 'all' || filterType !== 'all' || filterDifficulty !== 'all' || filterSet !== 'all' || onlyFavorites || searchTerm) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterSubject('all');
                      setFilterType('all');
                      setFilterDifficulty('all');
                      setFilterSet('all');
                      setOnlyFavorites(false);
                    }}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bulk Action Toolbar (Floating/Inline) */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-blue-600 text-white rounded-xl shadow-md animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm">
                  Đã chọn {selectedIds.length} câu hỏi
                </span>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-blue-100 hover:text-white underline cursor-pointer"
                >
                  Bỏ chọn tất cả
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-blue-700/80 px-2 py-1 rounded-lg">
                  <span className="text-xs text-blue-100">Gán vào bộ:</span>
                  <select
                    value={assignSetTarget}
                    onChange={(e) => setAssignSetTarget(e.target.value)}
                    className="bg-white text-slate-800 text-xs px-2 py-1 rounded-md outline-none"
                  >
                    <option value="">-- Chọn bộ --</option>
                    {questionSets.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleBulkAssignSet}
                    disabled={!assignSetTarget}
                    className="px-2 py-1 bg-white text-blue-700 font-bold text-xs rounded-md disabled:opacity-40 hover:bg-blue-50 cursor-pointer"
                  >
                    Gán
                  </button>
                </div>

                <button
                  onClick={handleBulkDuplicate}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Nhân bản
                </button>

                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa ({selectedIds.length})
                </button>
              </div>
            </div>
          )}

          {/* Select All Checkbox & Header */}
          <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 hover:text-slate-800 cursor-pointer"
            >
              {selectedIds.length > 0 && selectedIds.length === filteredQuestions.length ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Chọn tất cả {filteredQuestions.length} câu hiển thị</span>
            </button>
          </div>

          {/* Questions List */}
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Không tìm thấy câu hỏi phù hợp</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc phân loại bên trên
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => {
                const typeBadge = getTypeBadge(q.type);
                const diffBadge = getDifficultyBadge(q.difficulty);
                const isSelected = selectedIds.includes(q.id);
                const assignedSet = questionSets.find((s) => s.id === q.setId);

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border transition-all bg-white hover:border-slate-300 ${
                      isSelected ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/10' : 'border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(q.id)}
                        className="mt-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      {/* Question Core Content */}
                      <div className="flex-1 min-w-0">
                        {/* Meta Tags Row */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeBadge.bg}`}>
                            <span>{typeBadge.icon}</span> {typeBadge.label}
                          </span>

                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {q.subject || q.category}
                          </span>

                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${diffBadge.color}`}>
                            {diffBadge.label}
                          </span>

                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            +{q.points || 10} điểm
                          </span>

                          {assignedSet && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              <Layers className="w-3 h-3" /> {assignedSet.name}
                            </span>
                          )}

                          {q.chapter && (
                            <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                              {q.chapter}
                            </span>
                          )}
                        </div>

                        {/* Question Text */}
                        <h3 className="text-base font-bold text-slate-800 leading-snug">
                          {q.question}
                        </h3>

                        {/* Image Preview if image question */}
                        {q.imageUrl && (
                          <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                            <img
                              src={q.imageUrl}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Answers representation */}
                        <div className="mt-2.5">
                          {/* Multiple choice options */}
                          {(q.type === 'multiple-choice' || q.type === 'multiple' || q.type === 'image-question') && q.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                              {q.options.map((opt, oIdx) => {
                                const isCorrect = q.answer === oIdx;
                                return (
                                  <div
                                    key={oIdx}
                                    className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-2 ${
                                      isCorrect
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                        : 'bg-slate-50 border-slate-200 text-slate-600'
                                    }`}
                                  >
                                    <span
                                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                                      }`}
                                    >
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span className="truncate">{opt}</span>
                                    {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-auto" />}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Multiple answer options */}
                          {q.type === 'multiple-answer' && q.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                              {q.options.map((opt, oIdx) => {
                                const isCorrect = Array.isArray(q.answer) && q.answer.includes(oIdx);
                                return (
                                  <div
                                    key={oIdx}
                                    className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-2 ${
                                      isCorrect
                                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                                        : 'bg-slate-50 border-slate-200 text-slate-600'
                                    }`}
                                  >
                                    <span
                                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                        isCorrect ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                                      }`}
                                    >
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span className="truncate">{opt}</span>
                                    {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-auto" />}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* True / False answer */}
                          {(q.type === 'true-false' || q.type === 'boolean') && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-500">Đáp án:</span>
                              <span
                                className={`px-2.5 py-1 rounded-lg font-bold border ${
                                  q.answer === true
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                    : 'bg-red-50 text-red-700 border-red-300'
                                }`}
                              >
                                {q.answer === true ? '✓ Đúng (True)' : '✕ Sai (False)'}
                              </span>
                            </div>
                          )}

                          {/* Short answer / Fill blank */}
                          {(q.type === 'short-answer' || q.type === 'input' || q.type === 'fill-blank') && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-500">Đáp án chuẩn:</span>
                              <span className="px-2.5 py-1 rounded-lg font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                {String(q.answer)}
                              </span>
                            </div>
                          )}

                          {/* Matching preview */}
                          {q.type === 'matching' && q.matchingPairs && (
                            <div className="flex flex-wrap gap-2 text-xs">
                              {q.matchingPairs.map((pair, pIdx) => (
                                <span
                                  key={pIdx}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-medium"
                                >
                                  {pair.left} ➔ {pair.right}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Ordering preview */}
                          {q.type === 'ordering' && q.orderItems && (
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              {q.orderItems.map((item, oIdx) => (
                                <span
                                  key={oIdx}
                                  className="px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 font-medium flex items-center gap-1"
                                >
                                  <span className="font-bold text-[10px] text-cyan-600">{oIdx + 1}.</span> {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Explanation / Hint footer */}
                        {(q.explanation || q.hint) && (
                          <div className="mt-2 text-xs text-slate-500 flex flex-wrap items-center gap-3">
                            {q.hint && (
                              <span className="text-amber-600">
                                💡 <b>Gợi ý:</b> {q.hint}
                              </span>
                            )}
                            {q.explanation && (
                              <span className="text-slate-500">
                                💬 <b>Giải thích:</b> {q.explanation}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Action Icons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleFavorite(q)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            q.isFavorite
                              ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title={q.isFavorite ? 'Bỏ gắn sao' : 'Gắn sao yêu thích'}
                        >
                          <Star className={`w-4 h-4 ${q.isFavorite ? 'fill-amber-400' : ''}`} />
                        </button>

                        <button
                          onClick={() => handleDuplicateOne(q)}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Nhân bản câu hỏi"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingQuestion(q);
                            setIsQuestionModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Chỉnh sửa câu hỏi"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm('Bạn có chắc muốn xóa câu hỏi này không?')) {
                              onDeleteQuestion(q.id);
                            }
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUESTION SETS */}
      {activeTab === 'sets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Các bộ câu hỏi được phân loại theo môn học, từng bài học hoặc các đề kiểm tra 15 phút, 1 tiết
            </p>
            <button
              onClick={() => {
                setEditingSet(null);
                setIsSetModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tạo Bộ Câu Hỏi Mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questionSets.map((set) => {
              const questionCount = questions.filter((q) => q.setId === set.id).length;

              return (
                <div
                  key={set.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {set.subject}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {questionCount} câu hỏi
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {set.name}
                    </h3>

                    {set.description && (
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                        {set.description}
                      </p>
                    )}

                    {set.tags && set.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {set.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions bar on Set Card */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setFilterSet(set.id);
                        setActiveTab('all');
                      }}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem {questionCount} câu
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setDefaultSetForNew(set.id);
                          setEditingQuestion(null);
                          setIsQuestionModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Thêm câu hỏi vào bộ này"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingSet(set);
                          setIsSetModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Sửa thông tin bộ"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn xóa bộ câu hỏi "${set.name}" không? Các câu hỏi bên trong sẽ không bị xóa mà chỉ gỡ nhãn bộ.`)) {
                            onDeleteQuestionSet(set.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Xóa bộ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODALS */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={onSaveQuestion}
        editingQuestion={editingQuestion}
        questionSets={questionSets}
        defaultSetId={defaultSetForNew}
      />

      <QuestionSetModal
        isOpen={isSetModalOpen}
        onClose={() => setIsSetModalOpen(false)}
        onSave={onSaveQuestionSet}
        editingSet={editingSet}
      />

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        questions={questions}
        onImport={onImportQuestions}
      />
    </div>
  );
};
