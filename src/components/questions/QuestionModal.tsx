import React, { useState, useEffect } from 'react';
import {
  X, Check, AlertCircle, Plus, Trash2, HelpCircle,
  Sparkles, Image as ImageIcon, ArrowUpDown, Layers,
  Tag, BookOpen, Clock, Award, Star
} from 'lucide-react';
import { QuestionSet, QuestionType, QuizQuestion } from '../../types';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: QuizQuestion) => void;
  editingQuestion?: QuizQuestion | null;
  questionSets: QuestionSet[];
  defaultSetId?: string;
}

const QUESTION_TYPES: { type: QuestionType; label: string; desc: string; icon: string }[] = [
  { type: 'multiple-choice', label: 'Trắc nghiệm 1 đáp án', desc: 'Chọn 1 phương án đúng trong 4 đáp án', icon: '🔘' },
  { type: 'true-false', label: 'Đúng / Sai', desc: 'Chọn phương án Đúng (True) hoặc Sai (False)', icon: '⚖️' },
  { type: 'short-answer', label: 'Trả lời ngắn', desc: 'Học sinh gõ từ/câu trả lời chính xác', icon: '✍️' },
  { type: 'fill-blank', label: 'Điền vào chỗ trống', desc: 'Điền từ còn thiếu vào dấu ______', icon: '📝' },
  { type: 'matching', label: 'Ghép đôi nối từ', desc: 'Nối các cặp dữ liệu tương ứng ở 2 cột', icon: '🔄' },
  { type: 'ordering', label: 'Sắp xếp thứ tự', desc: 'Kéo thả sắp xếp quy trình hoặc dãy số', icon: '🔢' },
  { type: 'multiple-answer', label: 'Chọn nhiều đáp án', desc: 'Câu hỏi có thể có 2 hoặc nhiều đáp án đúng', icon: '☑️' },
  { type: 'image-question', label: 'Kèm hình ảnh', desc: 'Câu hỏi có ảnh minh họa trực quan', icon: '🖼️' },
];

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingQuestion,
  questionSets,
  defaultSetId,
}) => {
  const [type, setType] = useState<QuestionType>('multiple-choice');
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('Tin học');
  const [subject, setSubject] = useState('Tin học');
  const [chapter, setChapter] = useState('');
  const [topic, setTopic] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [points, setPoints] = useState(10);
  const [explanation, setExplanation] = useState('');
  const [hint, setHint] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [setId, setSetId] = useState<string>(defaultSetId || '');

  // Dynamic values per type
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [mcAnswer, setMcAnswer] = useState<number>(0);
  const [tfAnswer, setTfAnswer] = useState<boolean>(true);
  const [shortAnswer, setShortAnswer] = useState<string>('');
  const [multiAnswers, setMultiAnswers] = useState<number[]>([0]);
  const [matchingPairs, setMatchingPairs] = useState<{ left: string; right: string }[]>([
    { left: '', right: '' },
    { left: '', right: '' },
    { left: '', right: '' },
  ]);
  const [orderItems, setOrderItems] = useState<string[]>(['', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (editingQuestion) {
      setType(editingQuestion.type || 'multiple-choice');
      setQuestionText(editingQuestion.question || '');
      setCategory(editingQuestion.category || editingQuestion.subject || 'Tin học');
      setSubject(editingQuestion.subject || editingQuestion.category || 'Tin học');
      setChapter(editingQuestion.chapter || '');
      setTopic(editingQuestion.topic || '');
      setTags(editingQuestion.tags || []);
      setDifficulty(editingQuestion.difficulty || 'easy');
      setPoints(editingQuestion.points || 10);
      setExplanation(editingQuestion.explanation || '');
      setHint(editingQuestion.hint || '');
      setImageUrl(editingQuestion.imageUrl || '');
      setIsFavorite(!!editingQuestion.isFavorite);
      setSetId(editingQuestion.setId || '');

      if (editingQuestion.type === 'multiple' || editingQuestion.type === 'multiple-choice' || editingQuestion.type === 'image-question') {
        setOptions(editingQuestion.options && editingQuestion.options.length > 0 ? [...editingQuestion.options] : ['', '', '', '']);
        setMcAnswer(typeof editingQuestion.answer === 'number' ? editingQuestion.answer : 0);
      } else if (editingQuestion.type === 'boolean' || editingQuestion.type === 'true-false') {
        setTfAnswer(editingQuestion.answer === true);
      } else if (editingQuestion.type === 'input' || editingQuestion.type === 'short-answer' || editingQuestion.type === 'fill-blank') {
        setShortAnswer(String(editingQuestion.answer || ''));
      } else if (editingQuestion.type === 'multiple-answer') {
        setOptions(editingQuestion.options && editingQuestion.options.length > 0 ? [...editingQuestion.options] : ['', '', '', '']);
        setMultiAnswers(Array.isArray(editingQuestion.answer) ? (editingQuestion.answer as number[]) : [0]);
      } else if (editingQuestion.type === 'matching') {
        setMatchingPairs(editingQuestion.matchingPairs && editingQuestion.matchingPairs.length > 0
          ? [...editingQuestion.matchingPairs]
          : [{ left: '', right: '' }, { left: '', right: '' }]
        );
      } else if (editingQuestion.type === 'ordering') {
        setOrderItems(editingQuestion.orderItems && editingQuestion.orderItems.length > 0
          ? [...editingQuestion.orderItems]
          : ['', '', '']
        );
      }
    } else {
      // Reset defaults
      setType('multiple-choice');
      setQuestionText('');
      setCategory('Tin học');
      setSubject('Tin học');
      setChapter('');
      setTopic('');
      setTags([]);
      setDifficulty('easy');
      setPoints(10);
      setExplanation('');
      setHint('');
      setImageUrl('');
      setIsFavorite(false);
      setSetId(defaultSetId || '');
      setOptions(['', '', '', '']);
      setMcAnswer(0);
      setTfAnswer(true);
      setShortAnswer('');
      setMultiAnswers([0]);
      setMatchingPairs([{ left: '', right: '' }, { left: '', right: '' }, { left: '', right: '' }]);
      setOrderItems(['', '', '']);
    }
    setErrorMsg(null);
  }, [editingQuestion, isOpen, defaultSetId]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleOptionChange = (index: number, val: string) => {
    const next = [...options];
    next[index] = val;
    setOptions(next);
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const next = options.filter((_, i) => i !== index);
      setOptions(next);
      if (mcAnswer === index) setMcAnswer(0);
      else if (mcAnswer > index) setMcAnswer(mcAnswer - 1);
      setMultiAnswers(multiAnswers.filter((a) => a !== index).map((a) => (a > index ? a - 1 : a)));
    }
  };

  const toggleMultiAnswer = (index: number) => {
    if (multiAnswers.includes(index)) {
      if (multiAnswers.length > 1) {
        setMultiAnswers(multiAnswers.filter((i) => i !== index));
      }
    } else {
      setMultiAnswers([...multiAnswers, index].sort());
    }
  };

  const handleMatchingPairChange = (index: number, field: 'left' | 'right', val: string) => {
    const next = [...matchingPairs];
    next[index] = { ...next[index], [field]: val };
    setMatchingPairs(next);
  };

  const handleAddMatchingPair = () => {
    if (matchingPairs.length < 8) {
      setMatchingPairs([...matchingPairs, { left: '', right: '' }]);
    }
  };

  const handleRemoveMatchingPair = (index: number) => {
    if (matchingPairs.length > 2) {
      setMatchingPairs(matchingPairs.filter((_, i) => i !== index));
    }
  };

  const handleOrderItemChange = (index: number, val: string) => {
    const next = [...orderItems];
    next[index] = val;
    setOrderItems(next);
  };

  const handleAddOrderItem = () => {
    if (orderItems.length < 8) {
      setOrderItems([...orderItems, '']);
    }
  };

  const handleRemoveOrderItem = (index: number) => {
    if (orderItems.length > 2) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!questionText.trim()) {
      setErrorMsg('Vui lòng nhập nội dung câu hỏi!');
      return;
    }

    let calculatedAnswer: string | number | boolean | number[] | string[] = 0;

    if (type === 'multiple-choice' || type === 'multiple') {
      const validOpts = options.map((o) => o.trim());
      if (validOpts.some((o) => !o)) {
        setErrorMsg('Vui lòng điền đầy đủ tất cả các đáp án!');
        return;
      }
      calculatedAnswer = mcAnswer;
    } else if (type === 'image-question') {
      const validOpts = options.map((o) => o.trim());
      if (validOpts.some((o) => !o)) {
        setErrorMsg('Vui lòng điền đầy đủ tất cả các lựa chọn trắc nghiệm kèm ảnh!');
        return;
      }
      if (!imageUrl.trim()) {
        setErrorMsg('Vui lòng nhập đường dẫn hình ảnh (URL)!');
        return;
      }
      calculatedAnswer = mcAnswer;
    } else if (type === 'true-false' || type === 'boolean') {
      calculatedAnswer = tfAnswer;
    } else if (type === 'short-answer' || type === 'input' || type === 'fill-blank') {
      if (!shortAnswer.trim()) {
        setErrorMsg('Vui lòng nhập đáp án chuẩn xác cho câu hỏi!');
        return;
      }
      calculatedAnswer = shortAnswer.trim();
    } else if (type === 'multiple-answer') {
      const validOpts = options.map((o) => o.trim());
      if (validOpts.some((o) => !o)) {
        setErrorMsg('Vui lòng điền đầy đủ các đáp án lựa chọn!');
        return;
      }
      if (multiAnswers.length === 0) {
        setErrorMsg('Vui lòng chọn ít nhất 1 đáp án đúng!');
        return;
      }
      calculatedAnswer = multiAnswers;
    } else if (type === 'matching') {
      const invalid = matchingPairs.some((p) => !p.left.trim() || !p.right.trim());
      if (invalid) {
        setErrorMsg('Vui lòng điền đầy đủ cả 2 vế của các cặp ghép nối!');
        return;
      }
      calculatedAnswer = 'matched';
    } else if (type === 'ordering') {
      const invalid = orderItems.some((item) => !item.trim());
      if (invalid) {
        setErrorMsg('Vui lòng điền đầy đủ các bước cần sắp xếp theo thứ tự đúng!');
        return;
      }
      calculatedAnswer = orderItems.map((_, i) => i);
    }

    const newQuestion: QuizQuestion = {
      id: editingQuestion ? editingQuestion.id : `q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      question: questionText.trim(),
      category: category.trim() || subject.trim() || 'Chung',
      subject: subject.trim() || category.trim() || 'Chung',
      chapter: chapter.trim() || undefined,
      topic: topic.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      difficulty,
      points: Number(points) || 10,
      answer: calculatedAnswer,
      options: (type === 'multiple-choice' || type === 'multiple' || type === 'image-question' || type === 'multiple-answer')
        ? options.map((o) => o.trim())
        : (type === 'true-false' || type === 'boolean')
        ? ['Đúng (True)', 'Sai (False)']
        : undefined,
      matchingPairs: type === 'matching' ? matchingPairs.map((p) => ({ left: p.left.trim(), right: p.right.trim() })) : undefined,
      orderItems: type === 'ordering' ? orderItems.map((item) => item.trim()) : undefined,
      explanation: explanation.trim() || undefined,
      hint: hint.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      isFavorite,
      setId: setId || undefined,
      createdAt: editingQuestion?.createdAt || Date.now(),
    };

    onSave(newQuestion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {editingQuestion ? 'Chỉnh Sửa Câu Hỏi' : 'Tạo Câu Hỏi Mới'}
              </h2>
              <p className="text-xs text-slate-500">
                Hỗ trợ 8 dạng câu hỏi tương tác linh hoạt cho lớp học
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite ? 'bg-amber-50 text-amber-500' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title={isFavorite ? 'Bỏ gắn sao' : 'Gắn sao yêu thích'}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Question Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1. Chọn dạng câu hỏi ({QUESTION_TYPES.length} dạng)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {QUESTION_TYPES.map((t) => {
                const isSelected = type === t.type || (t.type === 'multiple-choice' && type === 'multiple') || (t.type === 'true-false' && type === 'boolean') || (t.type === 'short-answer' && type === 'input');
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setType(t.type)}
                    className={`flex flex-col items-start text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 font-medium text-slate-900 text-sm">
                      <span className="text-base">{t.icon}</span>
                      <span className="truncate">{t.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Content */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  2. Nội dung câu hỏi *
                </label>
                <span className="text-xs text-slate-400">
                  {type === 'fill-blank' ? 'Dùng ______ để đánh dấu chỗ trống cần điền' : ''}
                </span>
              </div>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder={
                  type === 'fill-blank'
                    ? 'Ví dụ: Thủ đô của nước Việt Nam là ______.'
                    : 'Nhập câu hỏi rõ ràng, dễ đọc cho học sinh trên máy chiếu...'
                }
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 text-base font-medium placeholder:text-slate-400 transition-all resize-none"
              />
            </div>

            {/* Image URL if image question */}
            {type === 'image-question' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Đường dẫn hình ảnh (Image URL) *
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... hoặc đường dẫn ảnh trực tuyến"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none"
                />
                {imageUrl && (
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 h-40 bg-slate-100 flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Lỗi+tải+ảnh';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Dynamic Type Answer Setup */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  3. Thiết lập câu trả lời & đáp án đúng
                </label>
                {(type === 'multiple-choice' || type === 'multiple' || type === 'image-question' || type === 'multiple-answer') && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    disabled={options.length >= 6}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm lựa chọn
                  </button>
                )}
                {type === 'matching' && (
                  <button
                    type="button"
                    onClick={handleAddMatchingPair}
                    disabled={matchingPairs.length >= 8}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm cặp ghép
                  </button>
                )}
                {type === 'ordering' && (
                  <button
                    type="button"
                    onClick={handleAddOrderItem}
                    disabled={orderItems.length >= 8}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm bước thứ tự
                  </button>
                )}
              </div>

              {/* Multiple Choice / Image Question Options */}
              {(type === 'multiple-choice' || type === 'multiple' || type === 'image-question') && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Bấm vào nút tròn bên trái đáp án để đánh dấu là <b>Đáp án đúng</b>:
                  </p>
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMcAnswer(idx)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                          mcAnswer === idx
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Đánh dấu đáp án đúng"
                      >
                        {String.fromCharCode(65 + idx)}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Lựa chọn ${String.fromCharCode(65 + idx)}`}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg border bg-white outline-none transition-all ${
                          mcAnswer === idx
                            ? 'border-emerald-500 ring-2 ring-emerald-100 text-slate-900 font-medium'
                            : 'border-slate-200 focus:border-blue-400'
                        }`}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          title="Xóa lựa chọn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Multiple Answer (Nhiều đáp án đúng) */}
              {type === 'multiple-answer' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Chọn các ô vuông bên trái để đánh dấu các <b>Đáp án đúng (chọn nhiều)</b>:
                  </p>
                  {options.map((opt, idx) => {
                    const isChecked = multiAnswers.includes(idx);
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleMultiAnswer(idx)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                            isChecked
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                          }`}
                          title="Bật/Tắt đáp án đúng"
                        >
                          {isChecked ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + idx)}
                        </button>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          placeholder={`Lựa chọn ${String.fromCharCode(65 + idx)}`}
                          className={`flex-1 px-3 py-2 text-sm rounded-lg border bg-white outline-none transition-all ${
                            isChecked
                              ? 'border-blue-500 ring-2 ring-blue-100 text-slate-900 font-medium'
                              : 'border-slate-200 focus:border-blue-400'
                          }`}
                        />
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* True / False */}
              {(type === 'true-false' || type === 'boolean') && (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setTfAnswer(true)}
                    className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-base transition-all ${
                      tfAnswer === true
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">✓</span>
                    Đúng (True)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTfAnswer(false)}
                    className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-base transition-all ${
                      tfAnswer === false
                        ? 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-200'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">✕</span>
                    Sai (False)
                  </button>
                </div>
              )}

              {/* Short Answer / Fill in the blank */}
              {(type === 'short-answer' || type === 'input' || type === 'fill-blank') && (
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    {type === 'fill-blank'
                      ? 'Từ hoặc cụm từ cần điền vào chỗ trống ______:'
                      : 'Câu trả lời mẫu chính xác (không phân biệt chữ hoa/thường khi chấm):'}
                  </label>
                  <input
                    type="text"
                    value={shortAnswer}
                    onChange={(e) => setShortAnswer(e.target.value)}
                    placeholder="Ví dụ: Hà Nội, Java, Ctrl + C..."
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 focus:border-blue-500 outline-none"
                  />
                </div>
              )}

              {/* Matching */}
              {type === 'matching' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500 px-1">
                    <span>Cột vế trái (Vấn đề / Thuật ngữ)</span>
                    <span>Cột vế phải (Nghĩa tương ứng / Khái niệm)</span>
                  </div>
                  {matchingPairs.map((pair, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pair.left}
                        onChange={(e) => handleMatchingPairChange(idx, 'left', e.target.value)}
                        placeholder={`Vế trái ${idx + 1}`}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:border-blue-500 outline-none"
                      />
                      <span className="text-slate-400 font-bold text-sm">➔</span>
                      <input
                        type="text"
                        value={pair.right}
                        onChange={(e) => handleMatchingPairChange(idx, 'right', e.target.value)}
                        placeholder={`Vế phải ${idx + 1}`}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:border-blue-500 outline-none"
                      />
                      {matchingPairs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMatchingPair(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Ordering */}
              {type === 'ordering' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Nhập các bước theo <b>thứ tự ĐÚNG từ trên xuống dưới</b> (hệ thống sẽ tự xáo trộn khi chơi):
                  </p>
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleOrderItemChange(idx, e.target.value)}
                        placeholder={`Bước ${idx + 1} (thứ tự đúng)`}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:border-blue-500 outline-none"
                      />
                      {orderItems.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOrderItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Metadata & Classification */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Question Set selection */}
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Bộ câu hỏi
                </label>
                <select
                  value={setId}
                  onChange={(e) => setSetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-800 focus:border-blue-500 outline-none"
                >
                  <option value="">-- Chưa gán bộ câu hỏi --</option>
                  {questionSets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.subject})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject / Môn học */}
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Môn học / Danh mục
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setCategory(e.target.value);
                  }}
                  placeholder="Ví dụ: Tin học, Tiếng Anh, Toán học..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Difficulty & Points */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Độ khó
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-800 focus:border-blue-500 outline-none"
                  >
                    <option value="easy">Dễ (Easy)</option>
                    <option value="medium">Vừa (Medium)</option>
                    <option value="hard">Khó (Hard)</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    Điểm số
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-800 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Chapter, Topic & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Chương / Bài
                  </label>
                  <input
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="Chương 1, Bài 2..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Chủ đề (Topic)
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Biến, Vòng lặp..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Thẻ phân loại (Tags)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Nhập tag và bấm Enter..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg"
                  >
                    Thêm
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="text-slate-400 hover:text-slate-600 ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Explanation & Hint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  Gợi ý cho học sinh (Hint)
                </label>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="Gợi ý ngắn khi học sinh cần trợ giúp..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Giải thích đáp án chi tiết
                </label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Lý do tại sao đáp án này đúng để chiếu sau câu hỏi..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            {editingQuestion ? 'Cập Nhật Câu Hỏi' : 'Lưu Vào Ngân Hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};
