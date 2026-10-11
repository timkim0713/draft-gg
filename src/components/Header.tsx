import React, { useState } from 'react';
import { PRESET_COMPS, PresetComp } from '../data/presets';
import { RotateCcw, ArrowLeftRight, Settings, Search, Bot, Loader2, MousePointerClick, Radio } from 'lucide-react';

interface HeaderProps {
  inputMode: 'manual' | 'live';
  onToggleInputMode: (mode: 'manual' | 'live') => void;
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
  inputMode,
  onToggleInputMode,
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
    <header className="border-b border-[#1d2332] bg-[#0c0f16]/95 backdrop-blur sticky top-0 z-40 px-3 sm:px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Brand & Mode Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#4a72ff] flex items-center justify-center text-white font-extrabold text-sm tracking-wider shadow-sm">
            DL
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-white tracking-tight">
                DeepLoL Comp AI
              </span>
            </div>
            <p className="text-[10px] text-gray-500">
              5:5 솔로랭크 픽창 및 인게임 분석기
            </p>
          </div>

          {/* 2 Modes Toggle */}
          <div className="flex items-center rounded-lg bg-[#121620] p-0.5 border border-[#1f2638] ml-2">
            <button
              onClick={() => onToggleInputMode('manual')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'manual'
                  ? 'bg-[#4a72ff] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="원클릭으로 챔피언을 직접 빠르게 선택하는 모드"
            >
              <MousePointerClick size={12} />
              <span>수동 픽 모드</span>
            </button>
            <button
              onClick={() => onToggleInputMode('live')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'live'
                  ? 'bg-[#4a72ff] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="소환사명을 검색하여 현재 진행 중인 게임 10명을 자동 로드하는 모드"
            >
              <Radio size={12} />
              <span>라이브 인게임 모드</span>
            </button>
          </div>
        </div>

        {/* Live Search Bar (Active in live mode or accessible) */}
        {inputMode === 'live' ? (
          <div className="flex items-center gap-2 flex-1 max-w-md w-full animate-in fade-in">
            <form onSubmit={handleSearchSubmit} className="flex items-center flex-1 relative">
              <span className="absolute left-2.5 text-[11px] font-bold text-gray-500 px-1 border-r border-[#242c3f] pr-2">
                KR
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="소환사명#태그 (예: Hide on bush#KR1)"
                className="w-full pl-14 pr-20 py-1.5 bg-[#121620] border border-[#232b3d] hover:border-[#3b4763] focus:border-[#4a72ff] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSearchingLiveGame}
                className="absolute right-1 px-2 py-1 bg-[#4a72ff] hover:bg-[#3b62ee] disabled:bg-gray-700 text-white text-[11px] font-bold rounded-md transition-colors flex items-center gap-1 cursor-pointer"
              >
                {isSearchingLiveGame ? <Loader2 size={11} className="animate-spin" /> : <Search size={11} />}
                <span>조회</span>
              </button>
            </form>

            <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-500 shrink-0">
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
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
            <span>슬롯을 클릭하거나 하단 추천 챔피언을 눌러 즉시 픽하세요.</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* AI Analyze Trigger */}
          <button
            onClick={onTriggerAI}
            disabled={isAILoading}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#4a72ff] hover:bg-[#3b62ee] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            title="AI 심층 분석 실행"
          >
            {isAILoading ? <Loader2 size={12} className="animate-spin" /> : <Bot size={12} />}
            <span>AI 분석</span>
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
              className="bg-[#121620] border border-[#232b3d] hover:border-[#3b4763] text-xs text-gray-300 py-1.5 px-2 rounded-lg focus:outline-none transition-colors cursor-pointer"
            >
              <option value="" disabled>
                프리셋
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
            <ArrowLeftRight size={13} />
          </button>

          {/* Reset Draft */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-[#121620] hover:bg-[#1e2536] border border-[#232b3d] text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="초기화"
          >
            <RotateCcw size={13} />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-[#121620] hover:bg-[#1e2536] border border-[#232b3d] text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="API 키 설정"
          >
            <Settings size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
