import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LiveGameInfo } from '../types';
import {
  Search,
  Radio,
  Loader2,
  Clock,
  Gamepad2,
  Key,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

interface LiveGameSearchCardProps {
  onSearch: (query: string, region: 'kr' | 'na' | 'euw') => void;
  isSearching: boolean;
  activeLiveGame: LiveGameInfo | null;
  hasApiKey: boolean;
  onOpenSettings: () => void;
}

export const LiveGameSearchCard: React.FC<LiveGameSearchCardProps> = ({
  onSearch,
  isSearching,
  activeLiveGame,
  hasApiKey,
  onOpenSettings
}) => {
  const { lang, t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<'kr' | 'na' | 'euw'>('kr');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), selectedRegion);
    }
  };

  const handleQuickClick = (summonerWithTag: string, region: 'kr' | 'na' | 'euw' = 'kr') => {
    setQuery(summonerWithTag);
    setSelectedRegion(region);
    onSearch(summonerWithTag, region);
  };

  const formatGameTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[#10141e] border border-[#1f283d] rounded-xl p-4 shadow-lg space-y-3.5 transition-all">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c2334] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4a72ff]/15 border border-[#4a72ff]/40 flex items-center justify-center text-[#719df0]">
            <Radio size={16} className={activeLiveGame ? 'animate-pulse text-emerald-400' : ''} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>{t('liveSearchTitle')}</span>
              {activeLiveGame && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 font-mono">
                  <CheckCircle2 size={10} />
                  {t('liveGameActive')}
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {t('liveSearchSubtitle')}
            </p>
          </div>
        </div>

        {/* Live Game Quick Stats if active */}
        {activeLiveGame && (
          <div className="flex items-center gap-3 bg-[#151c2a] border border-[#232c40] px-3 py-1.5 rounded-lg text-xs font-mono shrink-0">
            <div className="flex items-center gap-1 text-gray-400">
              <Gamepad2 size={12} className="text-[#719df0]" />
              <span className="text-gray-300 font-semibold">{activeLiveGame.gameMode}</span>
            </div>
            <div className="w-px h-3 bg-[#242d42]" />
            <div className="flex items-center gap-1 text-gray-400">
              <Clock size={12} className="text-amber-400" />
              <span className="text-amber-300 font-bold">{formatGameTime(activeLiveGame.gameLength)}</span>
            </div>
            <div className="w-px h-3 bg-[#242d42]" />
            <div className="flex items-center gap-1 text-gray-400">
              <UserCheck size={12} className="text-emerald-400" />
              <span className="text-emerald-300 font-bold">{activeLiveGame.summonerQuery}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Big Search Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex items-center flex-1 bg-[#131824] border border-[#232b3d] hover:border-[#3b4763] focus-within:border-[#4a72ff] focus-within:ring-1 focus-within:ring-[#4a72ff] rounded-lg overflow-hidden transition-all shadow-inner">
          {/* Region Dropdown */}
          <div className="flex items-center bg-[#171e2e] border-r border-[#242d42] px-2.5 py-2 shrink-0">
            <span className="text-[10px] font-bold text-gray-500 mr-1.5 hidden md:inline">REGION</span>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value as 'kr' | 'na' | 'euw')}
              className="bg-transparent text-xs font-bold text-[#719df0] focus:outline-none cursor-pointer"
              title="서버 선택"
            >
              <option value="kr" className="bg-[#131824] text-white">KR (한국)</option>
              <option value="na" className="bg-[#131824] text-white">NA (북미)</option>
              <option value="euw" className="bg-[#131824] text-white">EUW (유럽 서부)</option>
            </select>
          </div>

          {/* Large Text Input */}
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === 'ko' ? '소환사명#태그를 입력하세요 (예: Hide on bush#KR1, Chovy#KR1)' : 'Enter Summoner Name#Tag (e.g. Hide on bush#KR1, Faker#KR1)'}
            className="flex-1 min-w-0 px-3.5 py-2.5 bg-transparent text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none"
          />

          {/* Submit Search Button */}
          <button
            type="submit"
            disabled={isSearching}
            className="bg-[#4a72ff] hover:bg-[#3b62ee] disabled:bg-gray-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
          >
            {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            <span>{isSearching ? t('searching') : t('liveSearchBtn')}</span>
          </button>
        </div>
      </form>

      {/* 1-Click Pro Samples & Riot API Key Helper */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pt-1 text-xs">
        {/* Pro Samples */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-gray-400 mr-1">
            {t('quickProSamples')}
          </span>
          <button
            type="button"
            onClick={() => handleQuickClick('Hide on bush#KR1', 'kr')}
            className="px-2.5 py-1 rounded bg-[#161c28] hover:bg-[#222a3d] border border-[#222b3e] hover:border-[#4a72ff]/50 text-gray-300 hover:text-white transition-all cursor-pointer font-medium text-[11px] flex items-center gap-1.5"
            title="T1 Faker (Hide on bush#KR1) 라이브 인게임 로드"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>Faker (Hide on bush#KR1)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickClick('Chovy#KR1', 'kr')}
            className="px-2.5 py-1 rounded bg-[#161c28] hover:bg-[#222a3d] border border-[#222b3e] hover:border-[#4a72ff]/50 text-gray-300 hover:text-white transition-all cursor-pointer font-medium text-[11px] flex items-center gap-1.5"
            title="Gen.G Chovy (Chovy#KR1) 라이브 인게임 로드"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Chovy#KR1</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickClick('ShowMaker#KR1', 'kr')}
            className="px-2.5 py-1 rounded bg-[#161c28] hover:bg-[#222a3d] border border-[#222b3e] hover:border-[#4a72ff]/50 text-gray-300 hover:text-white transition-all cursor-pointer font-medium text-[11px] flex items-center gap-1.5"
            title="DK ShowMaker (ShowMaker#KR1) 라이브 인게임 로드"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>ShowMaker#KR1</span>
          </button>
        </div>

        {/* API Key Hint */}
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          {!hasApiKey ? (
            <div className="flex items-center gap-1.5 bg-[#171d2b] px-2.5 py-1 rounded-md border border-[#232b3f]">
              <Key size={11} className="text-amber-400 shrink-0" />
              <span>{t('noApiKeyNotice')}</span>
              <button
                type="button"
                onClick={onOpenSettings}
                className="text-[#719df0] hover:underline font-bold ml-1 cursor-pointer"
              >
                {t('settings')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-emerald-400/80 bg-emerald-950/20 px-2.5 py-1 rounded-md border border-emerald-900/40">
              <CheckCircle2 size={11} />
              <span>Riot API Key 활성화됨</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
