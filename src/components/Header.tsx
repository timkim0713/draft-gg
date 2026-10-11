import React from 'react';
import { PRESET_COMPS, PresetComp } from '../data/presets';
import { RotateCcw, ArrowLeftRight, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onSelectPreset: (preset: PresetComp) => void;
  onReset: () => void;
  onSwapTeams: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onReset,
  onSwapTeams,
  onOpenHelp
}) => {
  return (
    <header className="border-b border-[#232936] bg-[#11141c]/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3b6ecc] to-[#5383e8] flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-lg">
            LC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-tight">
                LoL Comp Coach
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#5383e8]/20 text-[#5383e8] font-bold border border-[#5383e8]/30">
                OP.GG 스타일
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              5:5 솔랭 픽창 & 로딩창 실시간 조합 분석기
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Preset Comps Dropdown */}
          <div className="relative">
            <select
              onChange={(e) => {
                const found = PRESET_COMPS.find(p => p.id === e.target.value);
                if (found) onSelectPreset(found);
                e.target.value = '';
              }}
              defaultValue=""
              className="bg-[#1c2230] border border-[#2b3345] hover:border-[#5383e8] text-xs text-gray-200 py-1.5 px-3 rounded-lg focus:outline-none transition-colors cursor-pointer"
            >
              <option value="" disabled>
                ⭐ 추천 조합 프리셋 불러오기
              </option>
              {PRESET_COMPS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Blue/Red */}
          <button
            onClick={onSwapTeams}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1c2230] hover:bg-[#283247] border border-[#2b3345] text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
            title="우리 팀(블루)과 상대 팀(레드) 진영 맞바꾸기"
          >
            <ArrowLeftRight size={13} />
            <span className="hidden md:inline">진영 교체</span>
          </button>

          {/* Reset Draft */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1c2230] hover:bg-[#283247] border border-[#2b3345] text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
            title="전체 챔피언 선택 초기화"
          >
            <RotateCcw size={13} />
            <span className="hidden md:inline">초기화</span>
          </button>

          {/* Help modal */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg bg-[#1c2230] hover:bg-[#283247] border border-[#2b3345] text-gray-400 hover:text-white transition-all cursor-pointer"
            title="사용 방법"
          >
            <HelpCircle size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};
