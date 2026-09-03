import React, { useState } from 'react';
import {
  School,
  Users,
  Plus,
  Trash2,
  Edit2,
  Search,
  ArrowUpDown,
  Upload,
  UserCheck,
  UserX,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Calendar,
  Check,
  X,
  Download,
} from 'lucide-react';
import { ClassRoom, Student } from '../types';
import { SoundEffects } from '../lib/sound';
import { ImportExcelModal } from '../components/classes/ImportExcelModal';
import { downloadSampleExcel } from '../lib/excel';

interface ClassesPageProps {
  classes: ClassRoom[];
  activeClass: ClassRoom | null;
  onSelectClass: (id: string) => void;
  onSaveClasses: (classes: ClassRoom[]) => void;
  onLogActivity: (title: string, details?: string) => void;
}

export const ClassesPage: React.FC<ClassesPageProps> = ({
  classes,
  activeClass,
  onSelectClass,
  onSaveClasses,
  onLogActivity,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassSubject, setNewClassSubject] = useState('');
  const [newClassYear, setNewClassYear] = useState('2025 - 2026');

  // Inline student add
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCode, setNewStudentCode] = useState('');

  // Inline student edit
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentCode, setEditStudentCode] = useState('');

  // Class Edit
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editClassName, setEditClassName] = useState('');
  const [editClassSubject, setEditClassSubject] = useState('');

  const currentClass = activeClass || classes[0] || null;

  // Filter and sort students
  const students = currentClass?.students || [];
  const filteredStudents = students
    .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.code && s.code.toLowerCase().includes(searchTerm.toLowerCase())))
    .sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, 'vi');
      return sortAsc ? cmp : -cmp;
    });

  const activeStudentsCount = students.filter((s) => !s.isAbsent).length;
  const absentStudentsCount = students.filter((s) => s.isAbsent).length;

  // Handlers
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass: ClassRoom = {
      id: `class-${Date.now()}`,
      name: newClassName.trim(),
      subject: newClassSubject.trim() || 'Môn học chung',
      schoolYear: newClassYear.trim() || '2025 - 2026',
      students: [],
      createdAt: Date.now(),
    };

    const updated = [...classes, newClass];
    onSaveClasses(updated);
    onSelectClass(newClass.id);
    onLogActivity(`Tạo lớp mới: ${newClass.name}`, `Môn: ${newClass.subject}`);
    SoundEffects.win();

    setNewClassName('');
    setNewClassSubject('');
    setIsNewClassModalOpen(false);
  };

  const handleDeleteClass = (classId: string) => {
    if (classes.length <= 1) {
      alert('Phải giữ lại ít nhất một lớp học trong hệ thống!');
      return;
    }
    const target = classes.find((c) => c.id === classId);
    if (confirm(`Bạn có chắc muốn xóa lớp "${target?.name}" cùng toàn bộ học sinh?`)) {
      const updated = classes.filter((c) => c.id !== classId);
      onSaveClasses(updated);
      if (activeClass?.id === classId) {
        onSelectClass(updated[0].id);
      }
      onLogActivity(`Đã xóa lớp: ${target?.name}`);
      SoundEffects.error();
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !currentClass) return;

    const newStudent: Student = {
      id: `hs-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: newStudentName.trim(),
      code: newStudentCode.trim() || `HS${String(currentClass.students.length + 1).padStart(3, '0')}`,
    };

    const updatedStudents = [...currentClass.students, newStudent];
    const updatedClasses = classes.map((c) =>
      c.id === currentClass.id ? { ...c, students: updatedStudents } : c
    );

    onSaveClasses(updatedClasses);
    onLogActivity(`Thêm học sinh ${newStudent.name} vào lớp ${currentClass.name}`);
    SoundEffects.success();

    setNewStudentName('');
    setNewStudentCode('');
  };

  const handleDeleteStudent = (studentId: string) => {
    if (!currentClass) return;
    const target = currentClass.students.find((s) => s.id === studentId);
    const updatedStudents = currentClass.students.filter((s) => s.id !== studentId);
    const updatedClasses = classes.map((c) =>
      c.id === currentClass.id ? { ...c, students: updatedStudents } : c
    );
    onSaveClasses(updatedClasses);
    onLogActivity(`Xóa học sinh ${target?.name} khỏi lớp ${currentClass.name}`);
    SoundEffects.click();
  };

  const handleToggleAbsent = (studentId: string) => {
    if (!currentClass) return;
    const updatedStudents = currentClass.students.map((s) =>
      s.id === studentId ? { ...s, isAbsent: !s.isAbsent } : s
    );
    const updatedClasses = classes.map((c) =>
      c.id === currentClass.id ? { ...c, students: updatedStudents } : c
    );
    onSaveClasses(updatedClasses);
    SoundEffects.click();
  };

  const handleStartEditStudent = (s: Student) => {
    setEditingStudentId(s.id);
    setEditStudentName(s.name);
    setEditStudentCode(s.code || '');
  };

  const handleSaveEditStudent = (studentId: string) => {
    if (!currentClass || !editStudentName.trim()) return;
    const updatedStudents = currentClass.students.map((s) =>
      s.id === studentId
        ? { ...s, name: editStudentName.trim(), code: editStudentCode.trim() }
        : s
    );
    const updatedClasses = classes.map((c) =>
      c.id === currentClass.id ? { ...c, students: updatedStudents } : c
    );
    onSaveClasses(updatedClasses);
    setEditingStudentId(null);
    SoundEffects.success();
  };

  const handleDeleteAllStudents = () => {
    if (!currentClass || currentClass.students.length === 0) return;
    if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ ${currentClass.students.length} học sinh trong lớp "${currentClass.name}"?`)) {
      const updatedClasses = classes.map((c) =>
        c.id === currentClass.id ? { ...c, students: [] } : c
      );
      onSaveClasses(updatedClasses);
      onLogActivity(`Đã xóa toàn bộ học sinh lớp ${currentClass.name}`);
      SoundEffects.error();
    }
  };

  const handleImportSuccess = (newStudents: Student[], mode: 'append' | 'replace') => {
    if (!currentClass) return;
    let finalStudents: Student[];
    if (mode === 'replace') {
      finalStudents = newStudents;
    } else {
      finalStudents = [...currentClass.students, ...newStudents];
    }

    const updatedClasses = classes.map((c) =>
      c.id === currentClass.id ? { ...c, students: finalStudents } : c
    );
    onSaveClasses(updatedClasses);
    onLogActivity(
      `Đã import ${newStudents.length} học sinh vào lớp ${currentClass.name} (${mode === 'replace' ? 'Ghi đè' : 'Thêm mới'})`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Section: Class Management & Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white">
                Quản lý lớp học & Danh sách học sinh
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thêm sửa lớp, import Excel, và quản lý danh sách học sinh tham gia trò chơi
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              SoundEffects.click();
              setIsNewClassModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs shadow-blue-500/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Tạo lớp mới
          </button>
        </div>

        {/* Class Cards Selector Bar */}
        <div className="pt-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            Danh sách các lớp ({classes.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {classes.map((cls) => {
              const isCurrent = currentClass?.id === cls.id;
              return (
                <div
                  key={cls.id}
                  onClick={() => {
                    SoundEffects.click();
                    onSelectClass(cls.id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                    isCurrent
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-sans font-bold text-base text-slate-900 dark:text-white">
                        {cls.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {cls.subject || 'Môn học'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-md">
                          <Users className="w-3 h-3" />
                          {cls.students.length} HS
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {cls.schoolYear}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {classes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClass(cls.id);
                          }}
                          className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500 transition-colors cursor-pointer"
                          title="Xóa lớp này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800 flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      <Check className="w-3 h-3" />
                      Lớp đang chọn
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Student Roster Card */}
      {currentClass && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          {/* Header of Active Class Roster */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans font-bold text-xl text-slate-900 dark:text-white">
                  Danh sách học sinh lớp {currentClass.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  👨‍🎓 Tổng: {students.length} HS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Có mặt: <span className="font-bold text-blue-600 dark:text-blue-400">{activeStudentsCount}</span> •
                Vắng: <span className="font-bold text-rose-500">{absentStudentsCount}</span> (HS vắng sẽ không bị gọi random hoặc chia nhóm)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  SoundEffects.click();
                  downloadSampleExcel();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                title="Tải mẫu Excel"
              >
                <Download className="w-3.5 h-3.5" />
                Mẫu Excel
              </button>

              <button
                onClick={() => {
                  SoundEffects.click();
                  setIsImportModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Import Excel / CSV
              </button>

              {students.length > 0 && (
                <button
                  onClick={handleDeleteAllStudents}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer border border-rose-200 dark:border-rose-800"
                  title="Xóa toàn bộ học sinh trong lớp"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa tất cả
                </button>
              )}
            </div>
          </div>

          {/* Inline Add Student Form */}
          <form
            onSubmit={handleAddStudent}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex-1">
              <input
                type="text"
                placeholder="Nhập họ và tên học sinh mới (ví dụ: Trần Minh Hoàng)..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full sm:w-36">
              <input
                type="text"
                placeholder="Mã HS (tùy chọn)"
                value={newStudentCode}
                onChange={(e) => setNewStudentCode(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm học sinh
            </button>
          </form>

          {/* Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm học sinh theo tên hoặc mã HS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                SoundEffects.click();
                setSortAsc(!sortAsc);
              }}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sắp xếp A-Z ({sortAsc ? 'A ➔ Z' : 'Z ➔ A'})
            </button>
          </div>

          {/* Student Table */}
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="font-sans font-bold text-slate-800 dark:text-white text-sm">
                {searchTerm ? 'Không tìm thấy học sinh nào phù hợp' : 'Chưa có học sinh trong lớp này'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Bạn có thể thêm thủ công hoặc import nhanh từ file Excel.
              </p>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Import từ Excel ngay
              </button>
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">STT</th>
                      <th className="py-3 px-4">Họ và tên</th>
                      <th className="py-3 px-4 w-28">Mã HS</th>
                      <th className="py-3 px-4 w-36 text-center">Điểm danh</th>
                      <th className="py-3 px-4 w-24 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredStudents.map((student, idx) => {
                      const isEditing = editingStudentId === student.id;
                      return (
                        <tr
                          key={student.id}
                          className={`transition-colors ${
                            student.isAbsent
                              ? 'bg-rose-50/40 dark:bg-rose-950/20 opacity-70'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <td className="py-3 px-4 text-center font-mono text-slate-400 font-medium">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editStudentName}
                                onChange={(e) => setEditStudentName(e.target.value)}
                                className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-blue-500 text-xs font-bold text-slate-900 dark:text-white"
                                autoFocus
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {student.name}
                                </span>
                                {student.isAbsent && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                    Vắng
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editStudentCode}
                                onChange={(e) => setEditStudentCode(e.target.value)}
                                className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-blue-500 text-xs font-mono text-slate-900 dark:text-white w-24"
                              />
                            ) : (
                              <span className="font-mono text-slate-400">
                                {student.code || '--'}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleAbsent(student.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                student.isAbsent
                                  ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              }`}
                              title={student.isAbsent ? 'Nhấn để đánh dấu Có mặt' : 'Nhấn để đánh dấu Vắng'}
                            >
                              {student.isAbsent ? (
                                <>
                                  <UserX className="w-3 h-3" />
                                  Vắng mặt
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3 h-3" />
                                  Có mặt
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleSaveEditStudent(student.id)}
                                  className="p-1 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                                  title="Lưu"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingStudentId(null)}
                                  className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                                  title="Hủy"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleStartEditStudent(student)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="Sửa tên học sinh"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(student.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="Xóa học sinh này"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Class Modal */}
      {isNewClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">
                Tạo lớp học mới
              </h3>
              <button
                onClick={() => setIsNewClassModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                  Tên lớp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 12A1, 11B2, Lớp Tin Học..."
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                  Môn học
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tin học, Tiếng Anh, Toán..."
                  value={newClassSubject}
                  onChange={(e) => setNewClassSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                  Năm học
                </label>
                <input
                  type="text"
                  placeholder="2025 - 2026"
                  value={newClassYear}
                  onChange={(e) => setNewClassYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Tạo lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {currentClass && (
        <ImportExcelModal
          isOpen={isImportModalOpen}
          className={currentClass.name}
          onClose={() => setIsImportModalOpen(false)}
          onImportSuccess={handleImportSuccess}
        />
      )}
    </div>
  );
};
