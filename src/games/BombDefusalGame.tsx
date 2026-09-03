import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Bomb, Sparkles, Award, ShieldAlert } from 'lucide-react';
import { SoundEffects } from '../lib/sound';
import { fireConfetti, fireSuperConfetti } from '../lib/confetti';

interface BombDefusalGameProps {
  onBack: () => void;
  onLogActivity: (title: string, details?: string) => void;
}

interface Tile {
  id: number;
  isBomb: boolean;
  points: number;
  isRevealed: boolean;
}

const GENERATE_TILES = (): Tile[] => {
  const tiles: Tile[] = [];
  // 16 tiles: 3 bombs, rest points
  const bombIndices = new Set<number>();
  while (bombIndices.size < 4) {
    bombIndices.add(Math.floor(Math.random() * 16));
  }

  const pointOptions = [10, 20, 30, 50, 15, 25];

  for (let i = 0; i < 16; i++) {
    const isBomb = bombIndices.has(i);
    tiles.push({
      id: i + 1,
      isBomb,
      points: isBomb ? -20 : pointOptions[Math.floor(Math.random() * pointOptions.length)],
      isRevealed: false,
    });
  }

  return tiles;
};

export const BombDefusalGame: React.FC<BombDefusalGameProps> = ({
  onBack,
  onLogActivity,
}) => {
  const [tiles, setTiles] = useState<Tile[]>(GENERATE_TILES);
  const [totalScore, setTotalScore] = useState(0);
  const [isExploded, setIsExploded] = useState(false);

  const handleTileClick = (tile: Tile) => {
    if (tile.isRevealed) return;

    const updated = tiles.map((t) => (t.id === tile.id ? { ...t, isRevealed: true } : t));
    setTiles(updated);

    if (tile.isBomb) {
      SoundEffects.timeUp();
      setIsExploded(true);
      setTotalScore((s) => Math.max(0, s - 20));
      onLogActivity(`💥 ĐẠP TRÚNG BOM! Hộp số #${tile.id}`, 'Trừ 20 điểm!');
    } else {
      SoundEffects.win();
      fireConfetti();
      setTotalScore((s) => s + tile.points);
      onLogActivity(`Gỡ mìn an toàn: Hộp #${tile.id} (+${tile.points} điểm)`);
    }
  };

  const handleReset = () => {
    SoundEffects.click();
    setTiles(GENERATE_TILES());
    setTotalScore(0);
    setIsExploded(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Kho trò chơi
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <Award className="w-4 h-4" />
            Điểm an toàn: {totalScore}
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Làm mới bãi mìn
          </button>
        </div>
      </div>

      {/* Main Board */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xl text-center flex flex-col items-center">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-1 flex items-center justify-center gap-2">
          💣 TRÒ CHƠI GỠ MÌN (BOMB GAME)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
          Chọn các ô số may mắn để nhận điểm thưởng. Cẩn thận, có 4 quả bom ẩn giấu sẽ nổ tung!
        </p>

        {/* 4x4 Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto w-full">
          {tiles.map((tile) => {
            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                disabled={tile.isRevealed}
                className={`aspect-square rounded-2xl font-display font-black text-xl sm:text-2xl transition-all flex flex-col items-center justify-center border-2 cursor-pointer ${
                  tile.isRevealed
                    ? tile.isBomb
                      ? 'bg-rose-600 text-white border-rose-700 shadow-inner animate-pulse'
                      : 'bg-emerald-500 text-white border-emerald-600 shadow-inner'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400 shadow-xs'
                }`}
              >
                {tile.isRevealed ? (
                  tile.isBomb ? (
                    <div className="animate-in zoom-in-75">
                      <span className="text-2xl">💥</span>
                      <span className="text-[10px] font-bold block mt-0.5">-20đ</span>
                    </div>
                  ) : (
                    <div className="animate-in zoom-in-75">
                      <span className="text-2xl">💎</span>
                      <span className="text-[11px] font-bold block mt-0.5">+{tile.points}đ</span>
                    </div>
                  )
                ) : (
                  <span>{tile.id}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
