import React, { useState, useEffect } from 'react';
import { X, Check, Layers, AlertCircle, Tag, BookOpen } from 'lucide-react';
import { QuestionSet } from '../../types';

interface QuestionSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (set: QuestionSet) => void;
  editingSet?: QuestionSet | null;
}

export const QuestionSetModal: React.FC<QuestionSetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSet,
}) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Tin học');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (editingSet) {
      setName(editingSet.name || '');
      setSubject(editingSet.subject || 'Tin học');
      setDescription(editingSet.description || '');
      setTags(editingSet.tags || []);
    } else {
      setName('');
      setSubject('Tin học');
      setDescription('');
      setTags([]);
    }
    setErrorMsg(null);
  }, [editingSet, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleSave = () => {
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên bộ câu hỏi!');
      return;
    }
    if (!subject.trim()) {
      setErrorMsg('Vui lòng nhập môn học / lĩnh vực!');
      return;
    }

    const newSet: QuestionSet = {
      id: editingSet ? editingSet.id : `set-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      subject: subject.trim(),
      description: description.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      createdAt: editingSet ? editingSet.createdAt : Date.now(),
      questionCount: editingSet?.questionCount || 0,
    };

    onSave(newSet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {editingSet ? 'Sửa Bộ Câu Hỏi' : 'Tạo Bộ Câu Hỏi Mới'}
              </h2>
              <p className="text-xs text-slate-500">
                Gom nhóm câu hỏi theo chủ đề, bài học hoặc đề thi
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

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên bộ câu hỏi *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Ôn tập Chương 1 - Mạng máy tính"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              Môn học / Phân môn *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ví dụ: Tin học, Tiếng Anh, Lịch sử, KHTN..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mô tả chi tiết
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả phạm vi kiến thức, mục tiêu hoặc đối tượng học sinh..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
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
                placeholder="Nhập thẻ và nhấn Enter..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Thêm
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-blue-400 hover:text-blue-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            {editingSet ? 'Cập Nhật Bộ' : 'Tạo Bộ Mới'}
          </button>
        </div>
      </div>
    </div>
  );
};
