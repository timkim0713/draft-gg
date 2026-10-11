import React, { useState } from 'react';
import { PRESET_COMPS, PresetComp } from '../data/presets';
import { RotateCcw, ArrowLeftRight, Settings, Search, Bot, Loader2 } from 'lucide-react';

interface HeaderProps {
  onSelectPreset: (preset: PresetComp) => void;
  onReset: () => void;
  onSwapTeams: () => void;
  onOpenSettings: () => void;
  onSearchLiveGame: (query: string) => void;
  isSearchingLiveGame: boolean;
  onTriggerAI: () => void;
  isAILoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onReset,
  onSwapTeams,
  onOpenSettings,
  onSearchLiveGame,
  isSearchingLiveGame,
  onTriggerAI,
  isAILoading
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchLiveGame(searchQuery.trim());
    }
  };

  const handleQuickSample = (name: string) => {
    setSearchQuery(name);
    onSearchLiveGame(name);
  };

  return (
    <header className="border-b border-[#1d2332] bg-[#0c0f16]/95 backdrop-blur sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#4a72ff] flex items-center justify-center text-white font-extrabold text-sm tracking-wider shadow-sm">
            DL
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-white tracking-tight">
                DeepLoL Comp AI
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#1e2434] text-gray-400 font-mono border border-[#2b3348]">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-gray-500">
              5:5 솔로랭크 픽창 및 라이브 인게임 분석기
            </p>
          </div>
        </div>

        {/* Live Game Search Bar (OP.GG / DeepLoL style) */}
        <div className="flex items-center gap-2 flex-1 max-w-xl w-full">
          <form onSubmit={handleSearchSubmit} className="flex items-center flex-1 relative">
            <span className="absolute left-2.5 text-[11px] font-bold text-gray-500 px-1 border-r border-[#242c3f] pr-2">
              KR
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="소환사명#태그 (예: Hide on bush#KR1)"
              className="w-full pl-14 pr-20 py-1.5 bg-[#121620] border border-[#232b3d] hover:border-[#3b4763] focus:border-[#4a72ff] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isSearchingLiveGame}
              className="absolute right-1 px-2.5 py-1 bg-[#4a72ff] hover:bg-[#3b62ee] disabled:bg-gray-700 text-white text-[11px] font-bold rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              {isSearchingLiveGame ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
              <span>인게임 조회</span>
            </button>
          </form>

          {/* Quick Demo Samples */}
          <div className="hidden lg:flex items-center gap-1 text-[10px] text-gray-500 shrink-0">
            <span>샘플:</span>
            <button
              type="button"
              onClick={() => handleQuickSample('Hide on bush#KR1')}
              className="px-1.5 py-0.5 rounded bg-[#161c28] hover:bg-[#202738] text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Faker
            </button>
            <button
              type="button"
              onClick={() => handleQuickSample('Chovy#KR1')}
              className="px-1.5 py-0.5 rounded bg-[#161c28] hover:bg-[#202738] text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Chovy
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* AI Analyze Trigger */}
          <button
            onClick={onTriggerAI}
            disabled={isAILoading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#3b5998] to-[#4a72ff] hover:opacity-95 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="LLM 모델 기반 심층 분석 실행"
          >
            {isAILoading ? <Loader2 size={13} className="animate-spin" /> : <Bot size={13} />}
            <span>AI 심층 분석</span>
          </button>

          {/* Preset Comps Dropdown */}
          <div className="relative">
            <select
              onChange={(e) => {
                const found = PRESET_COMPS.find(p => p.id === e.target.value);
                if (found) onSelectPreset(found);
                e.target.value = '';
              }}
              defaultValue=""
              className="bg-[#121620] border border-[#232b3d] hover:border-[#3b4763] text-xs text-gray-300 py-1.5 px-2.5 rounded-lg focus:outline-none transition-colors cursor-pointer"
            >
              <option value="" disabled>
                추천 프리셋
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
            className="p-1.5 rounded-lg bg-[#121620] hover:bg-[#1e2536] border border-[#232b3d] text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="진영 맞바꾸기"
          >
            <ArrowLeftRight size={14} />
          </button>

          {/* Reset Draft */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-[#121620] hover:bg-[#1e2536] border border-[#232b3d] text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="초기화"
          >
            <RotateCcw size={14} />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-[#121620] hover:bg-[#1e2536] border border-[#232b3d] text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="API 키 설정 (Riot / Gemini)"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
