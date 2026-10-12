import React, { useState } from 'react';
import { PresetComp, PRESET_COMPS } from '../data/presets';
import { useLanguage } from '../context/LanguageContext';
import {
  RotateCcw,
  ArrowLeftRight,
  Settings,
  Radio,
  Search,
  Loader2,
  MousePointerClick,
  Bot,
  Languages
} from 'lucide-react';

interface HeaderProps {
  inputMode: 'manual' | 'live';
  onToggleInputMode: (mode: 'manual' | 'live') => void;
  onSelectPreset: (preset: PresetComp) => void;
  onReset: () => void;
  onSwapTeams: () => void;
  onOpenSettings: () => void;
  onSearchLiveGame: (summonerQuery: string, region: 'kr' | 'na' | 'euw') => void;
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
  const { lang, setLang, t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<'kr' | 'na' | 'euw'>('kr');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onToggleInputMode('live');
      onSearchLiveGame(searchQuery.trim(), selectedRegion);
    }
  };

  const handleQuickSample = (query: string) => {
    setSearchQuery(query);
    onToggleInputMode('live');
    onSearchLiveGame(query, 'kr');
  };

  return (
    <header className="border-b border-[#1d2332] bg-[#0c0f16]/95 backdrop-blur sticky top-0 z-40 px-3 sm:px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Brand & Mode Switcher */}
        <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4a72ff] flex items-center justify-center text-white font-extrabold text-sm tracking-wider shadow-sm">
              GG
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white tracking-tight">
                  {t('brandTitle')}<span className="text-[#4a72ff]">{t('brandSuffix')}</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#4a72ff]/20 text-[#719df0] border border-[#4a72ff]/40 text-[9px] font-bold font-mono">
                  {t('brandBadge')}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 hidden sm:block">
                {t('brandSubtitle')}
              </p>
            </div>
          </div>

          {/* 2 Modes Toggle */}
          <div className="flex items-center rounded-lg bg-[#121620] p-0.5 border border-[#1f2638]">
            <button
              onClick={() => onToggleInputMode('manual')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'manual'
                  ? 'bg-[#4a72ff] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
              title={lang === 'ko' ? '원클릭으로 챔피언을 직접 빠르게 선택하는 모드' : '1-click rapid manual champion pick mode'}
            >
              <MousePointerClick size={12} />
              <span>{t('manualMode')}</span>
            </button>
            <button
              onClick={() => onToggleInputMode('live')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'live'
                  ? 'bg-[#4a72ff] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
              title={lang === 'ko' ? '소환사명을 검색하여 현재 진행 중인 게임 10명을 자동 로드하는 모드' : 'Search summoner to inspect active live game'}
            >
              <Radio size={12} />
              <span>{t('liveMode')}</span>
            </button>
          </div>
        </div>

        {/* Live Search Bar (Always prominent and centered in the header!) */}
        <div className="flex items-center gap-2 flex-1 max-w-md xl:max-w-xl w-full min-w-0">
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full bg-[#121620] border border-[#232b3d] hover:border-[#3b4763] focus-within:border-[#4a72ff] focus-within:ring-1 focus-within:ring-[#4a72ff] rounded-lg overflow-hidden transition-all shadow-inner">
            <div className="flex items-center bg-[#161c28] border-r border-[#222a3d] px-2 py-1.5 shrink-0">
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value as 'kr' | 'na' | 'euw')}
                className="bg-transparent text-[11px] font-bold text-[#719df0] focus:outline-none cursor-pointer"
                title={lang === 'ko' ? '서버 선택 (Region)' : 'Select Region'}
              >
                <option value="kr" className="bg-[#121620] text-white">KR</option>
                <option value="na" className="bg-[#121620] text-white">NA</option>
                <option value="euw" className="bg-[#121620] text-white">EUW</option>
              </select>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('summonerPlaceholder')}
              className="flex-1 min-w-0 px-3 py-1.5 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSearchingLiveGame}
              className="bg-[#4a72ff] hover:bg-[#3b62ee] disabled:bg-gray-700 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              {isSearchingLiveGame ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
              <span className="hidden sm:inline">{isSearchingLiveGame ? t('searching') : t('searchLiveGame')}</span>
            </button>
          </form>

          <div className="hidden 2xl:flex items-center gap-1 text-[10px] text-gray-500 shrink-0">
            <button
              type="button"
              onClick={() => handleQuickSample('Hide on bush#KR1')}
              className="px-1.5 py-0.5 rounded bg-[#161c28] hover:bg-[#202738] text-gray-400 hover:text-white transition-colors cursor-pointer border border-[#1f2638]"
              title="Faker 라이브 인게임 샘플 로드"
            >
              Faker
            </button>
            <button
              type="button"
              onClick={() => handleQuickSample('Chovy#KR1')}
              className="px-1.5 py-0.5 rounded bg-[#161c28] hover:bg-[#202738] text-gray-400 hover:text-white transition-colors cursor-pointer border border-[#1f2638]"
              title="Chovy 라이브 인게임 샘플 로드"
            >
              Chovy
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0 justify-end">
          {/* AI Analyze Trigger */}
          <button
            onClick={onTriggerAI}
            disabled={isAILoading}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#4a72ff] hover:bg-[#3b62ee] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            title={lang === 'ko' ? 'AI 심층 분석 실행' : 'Trigger AI comp analysis'}
          >
            {isAILoading ? <Loader2 size={12} className="animate-spin" /> : <Bot size={12} />}
            <span>{isAILoading ? t('analyzingAI') : t('reanalyzeAI')}</span>
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
                {t('presetSample')}
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
            title={t('swapTeams')}
          >
            <ArrowLeftRight size={13} />
          </button>

          {/* Reset Draft */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-[#121620] hover:bg-[#1e2536] border border-[#232b3d] text-gray-400 hover:text-white transition-colors cursor-pointer"
            title={t('resetDraft')}
          >
            <RotateCcw size={13} />
          </button>

          {/* Language Switcher Toggle */}
          <button
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#121620] hover:bg-[#1e2536] border border-[#232b3d] hover:border-[#4a72ff] text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
            title={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
          >
            <Languages size={13} className="text-[#4a72ff]" />
            <span className="font-mono text-[11px]">{lang.toUpperCase()}</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-[#121620] hover:bg-[#1e2536] border border-[#232b3d] text-gray-400 hover:text-white transition-colors cursor-pointer"
            title={t('settings')}
          >
            <Settings size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
