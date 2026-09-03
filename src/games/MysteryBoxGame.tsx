import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Sparkles, Gift, HelpCircle, Award, Check } from 'lucide-react';
import { SoundEffects } from '../lib/sound';
import { fireConfetti, fireSuperConfetti } from '../lib/confetti';

interface MysteryBoxGameProps {
  onBack: () => void;
  onLogActivity: (title: string, details?: string) => void;
}

interface BoxItem {
  id: number;
  title: string;
  type: 'points' | 'question' | 'dare' | 'gift';
  content: string;
  pointsAward?: number;
  isOpened: boolean;
}

const DEFAULT_BOXES: Omit<BoxItem, 'id' | 'isOpened'>[] = [
  { title: '+20 Điểm', type: 'points', content: '🌟 Chúc mừng bạn! Đội của bạn được cộng trực tiếp 20 điểm thưởng!', pointsAward: 20 },
  { title: 'Thử thách', type: 'dare', content: '🎤 Hãy hát một câu trong bài hát em yêu thích nhất trước cả lớp!', pointsAward: 10 },
  { title: 'Câu hỏi bí mật', type: 'question', content: '🧠 Kể tên 3 tỉnh/thành phố có biển ở Việt Nam trong 5 giây!', pointsAward: 15 },
  { title: '+50 Điểm Siêu Cấp', type: 'points', content: '💎 JACKPOT! Đội của bạn nhận được 50 điểm tuyệt đối!', pointsAward: 50 },
  { title: 'Hộp quà may mắn', type: 'gift', content: '🍬 Bạn nhận được 1 viên kẹo ngọt ngào từ thầy/cô giáo!', pointsAward: 5 },
  { title: 'Cơ hội trao tay', type: 'dare', content: '🤝 Bạn được quyền chỉ định một bạn bất kỳ trong lớp đứng dậy nhận thử thách!', pointsAward: 10 },
  { title: '+30 Điểm', type: 'points', content: '✨ Tuyệt vời! Đội bạn được cộng thêm 30 điểm thi đua!', pointsAward: 30 },
  { title: 'Câu hỏi hóc búa', type: 'question', content: '🔍 1 năm có bao nhiêu tháng có 28 ngày? (Gợi ý: Tất cả các tháng đều có ngày 28!)', pointsAward: 15 },
  { title: 'Thử thách thể lực', type: 'dare', content: '🏃 Nhảy lò cò 5 bước hoặc làm động tác siêu nhân!', pointsAward: 10 },
  { title: 'Nhân đôi lượt chơi', type: 'gift', content: '🎁 Bạn được mở thêm 1 chiếc hộp bí mật nữa ngay bây giờ!', pointsAward: 10 },
  { title: '+15 Điểm', type: 'points', content: '🎉 Thưởng 15 điểm khích lệ tinh thần học tập hăng hái!', pointsAward: 15 },
  { title: 'Hộp rỗng bí ẩn', type: 'gift', content: '💨 Ồ! Hộp này không có điểm, nhưng cả lớp hãy tặng bạn một tràng pháo tay!', pointsAward: 0 },
];

export const MysteryBoxGame: React.FC<MysteryBoxGameProps> = ({
  onBack,
  onLogActivity,
}) => {
  const [boxes, setBoxes] = useState<BoxItem[]>(
    DEFAULT_BOXES.map((b, i) => ({ ...b, id: i + 1, isOpened: false }))
  );
  const [activeBox, setActiveBox] = useState<BoxItem | null>(null);

  const handleOpenBox = (box: BoxItem) => {
    if (box.isOpened) {
      setActiveBox(box);
      return;
    }

    SoundEffects.boxOpen();
    const updated = boxes.map((b) => (b.id === box.id ? { ...b, isOpened: true } : b));
    setBoxes(updated);
    setActiveBox({ ...box, isOpened: true });

    if (box.type === 'points' && (box.pointsAward || 0) >= 20) {
      fireSuperConfetti();
      SoundEffects.win();
    } else {
      fireConfetti();
      SoundEffects.success();
    }

    onLogActivity(`Mở Hộp Bí Mật #${box.id}`, `${box.title}: ${box.content}`);
  };

  const handleResetBoxes = () => {
    SoundEffects.click();
    // Shuffle contents
    const shuffled = [...DEFAULT_BOXES].sort(() => 0.5 - Math.random());
    setBoxes(shuffled.map((b, i) => ({ ...b, id: i + 1, isOpened: false })));
    setActiveBox(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Kho trò chơi
        </button>

        <button
          onClick={handleResetBoxes}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Xáo trộn & Đóng lại các hộp
        </button>
      </div>

      {/* Main Board */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl text-center">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-1 flex items-center justify-center gap-2">
          🎁 CHIẾC HỘP BÍ MẬT
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
          Chọn một chiếc hộp bất kỳ để khám phá điều bất ngờ ẩn giấu bên trong!
        </p>

        {/* 12 Boxes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {boxes.map((box) => {
            return (
              <button
                key={box.id}
                onClick={() => handleOpenBox(box)}
                className={`p-5 rounded-3xl border-2 transition-all transform hover:-translate-y-1 active:scale-95 flex flex-col items-center justify-center cursor-pointer min-h-[140px] relative overflow-hidden ${
                  box.isOpened
                    ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 opacity-80'
                    : 'bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 border-amber-300 dark:border-orange-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-xl'
                }`}
              >
                {box.isOpened ? (
                  <div className="text-center animate-in zoom-in-75">
                    <span className="text-3xl mb-1 block">✨</span>
                    <p className="font-display font-bold text-xs text-slate-700 dark:text-slate-200">
                      {box.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block">
                      Đã mở (Xem lại)
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="text-4xl mb-2 animate-bounce">🎁</span>
                    <span className="font-display font-black text-xl tracking-tight text-white drop-shadow-sm">
                      HỘP #{box.id}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Box Modal */}
      {activeBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-400 text-center shadow-2xl relative">
            <div className="text-6xl mb-3 animate-bounce">
              {activeBox.type === 'points' ? '💎' : activeBox.type === 'question' ? '🧠' : '🎉'}
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
              Nội dung Hộp #{activeBox.id}
            </span>

            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-3">
              {activeBox.title}
            </h3>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed mb-6">
              {activeBox.content}
            </div>

            {activeBox.pointsAward !== undefined && activeBox.pointsAward > 0 && (
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-sm mb-6">
                <Award className="w-4 h-4" />
                Thưởng: +{activeBox.pointsAward} điểm
              </div>
            )}

            <div>
              <button
                onClick={() => setActiveBox(null)}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                Đóng hộp bí mật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
