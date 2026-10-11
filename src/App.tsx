import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { TeamDraft, Role, Champion, AIAnalysisResult, LiveGameInfo } from './types';
import { PRESET_COMPS, PresetComp } from './data/presets';
import { analyzeMatch } from './utils/analyzer';
import { fetchLiveGame, mapLiveGameToDraft } from './services/riotService';
import { requestAICompAnalysis } from './services/aiService';
import { Header } from './components/Header';
import { DraftSlot } from './components/DraftSlot';
import { QuickBriefingCard } from './components/QuickBriefingCard';
import { WinRateBar } from './components/WinRateBar';
import { TeamfightCard } from './components/TeamfightCard';
import { StatsRadarOrBars } from './components/StatsRadarOrBars';
import { MacroWinConditionCard } from './components/MacroWinConditionCard';
import { LaneMatchupsGrid } from './components/LaneMatchupsGrid';
import { ChampionSelectModal } from './components/ChampionSelectModal';
import { SettingsModal } from './components/SettingsModal';
import { AICoachPanel } from './components/AICoachPanel';
import { AlertCircle, Radio, Zap, Layers } from 'lucide-react';

const EMPTY_DRAFT: TeamDraft = {
  TOP: null,
  JUG: null,
  MID: null,
  BOT: null,
  SUP: null
};

export function App() {
  // Initialize with Preset 1
  const [blueDraft, setBlueDraft] = useState<TeamDraft>(PRESET_COMPS[0].blueDraft);
  const [redDraft, setRedDraft] = useState<TeamDraft>(PRESET_COMPS[0].redDraft);

  // View Mode: 'quick' (1-Minute Loading Screen mode) vs 'detailed'
  const [viewMode, setViewMode] = useState<'quick' | 'detailed'>('quick');

  // API Keys (saved in localStorage)
  const [riotApiKey, setRiotApiKey] = useState<string>(() => localStorage.getItem('lol_comp_riot_key') || '');
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('lol_comp_gemini_key') || '');

  // UI States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchingLiveGame, setIsSearchingLiveGame] = useState(false);
  const [liveGameNotice, setLiveGameNotice] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [activeLiveGame, setActiveLiveGame] = useState<LiveGameInfo | null>(null);

  // AI Analysis States
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);

  // Modal State for picking champion
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    team: 'blue' | 'red';
    role: Role | null;
  }>({
    isOpen: false,
    team: 'blue',
    role: null
  });

  // Real-time Analytic Engine (Fallback / Baseline)
  const analysis = useMemo(() => {
    return analyzeMatch(blueDraft, redDraft);
  }, [blueDraft, redDraft]);

  // Trigger AI Analysis
  const triggerAIAnalysis = useCallback(async (bDraft = blueDraft, rDraft = redDraft) => {
    setIsAILoading(true);
    try {
      const res = await requestAICompAnalysis({
        blueDraft: bDraft,
        redDraft: rDraft,
        apiKey: geminiApiKey,
        provider: 'gemini'
      });
      setAiResult(res);
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setIsAILoading(false);
    }
  }, [blueDraft, redDraft, geminiApiKey]);

  // Initial AI trigger
  useEffect(() => {
    triggerAIAnalysis(PRESET_COMPS[0].blueDraft, PRESET_COMPS[0].redDraft);
  }, [triggerAIAnalysis]);

  // Live Game Search Handler
  const handleSearchLiveGame = async (query: string) => {
    setIsSearchingLiveGame(true);
    setLiveGameNotice(null);

    try {
      const res = await fetchLiveGame(query, 'kr', riotApiKey);

      if (res.success && res.inGame && res.data) {
        const { blueDraft: b, redDraft: r } = mapLiveGameToDraft(res.data.participants);
        setBlueDraft(b);
        setRedDraft(r);
        setActiveLiveGame(res.data);
        setLiveGameNotice({
          type: 'success',
          message: `라이브 인게임 데이터 연동 완료: ${res.data.summonerQuery} (${res.data.gameMode})`
        });
        triggerAIAnalysis(b, r);
      } else {
        setActiveLiveGame(null);
        setLiveGameNotice({
          type: res.inGame ? 'info' : 'error',
          message: res.message || '인게임 정보를 찾을 수 없습니다.'
        });
      }
    } catch {
      setLiveGameNotice({
        type: 'error',
        message: '서버 통신 오류가 발생했습니다.'
      });
    } finally {
      setIsSearchingLiveGame(false);
    }
  };

  const handleSaveApiKeys = (rKey: string, gKey: string) => {
    setRiotApiKey(rKey);
    setGeminiApiKey(gKey);
    localStorage.setItem('lol_comp_riot_key', rKey);
    localStorage.setItem('lol_comp_gemini_key', gKey);
  };

  const openSelectModal = (team: 'blue' | 'red', role: Role) => {
    setModalState({
      isOpen: true,
      team,
      role
    });
  };

  const handleSelectChampion = (champion: Champion) => {
    if (!modalState.role) return;
    const role = modalState.role;

    if (modalState.team === 'blue') {
      const updated = { ...blueDraft, [role]: champion };
      setBlueDraft(updated);
      triggerAIAnalysis(updated, redDraft);
    } else {
      const updated = { ...redDraft, [role]: champion };
      setRedDraft(updated);
      triggerAIAnalysis(blueDraft, updated);
    }
  };

  const handleClearSlot = (team: 'blue' | 'red', role: Role) => {
    if (team === 'blue') {
      const updated = { ...blueDraft, [role]: null };
      setBlueDraft(updated);
      triggerAIAnalysis(updated, redDraft);
    } else {
      const updated = { ...redDraft, [role]: null };
      setRedDraft(updated);
      triggerAIAnalysis(blueDraft, updated);
    }
  };

  const handleReset = () => {
    setBlueDraft({ ...EMPTY_DRAFT });
    setRedDraft({ ...EMPTY_DRAFT });
    setActiveLiveGame(null);
    setLiveGameNotice(null);
  };

  const handleSwapTeams = () => {
    const nextBlue = redDraft;
    const nextRed = blueDraft;
    setBlueDraft(nextBlue);
    setRedDraft(nextRed);
    triggerAIAnalysis(nextBlue, nextRed);
  };

  const handleSelectPreset = (preset: PresetComp) => {
    setBlueDraft(preset.blueDraft);
    setRedDraft(preset.redDraft);
    setActiveLiveGame(null);
    setLiveGameNotice(null);
    triggerAIAnalysis(preset.blueDraft, preset.redDraft);
  };

  const roles: Role[] = ['TOP', 'JUG', 'MID', 'BOT', 'SUP'];

  return (
    <div className="min-h-screen bg-[#090b10] text-[#e6edf3] flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onSwapTeams={handleSwapTeams}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSearchLiveGame={handleSearchLiveGame}
        isSearchingLiveGame={isSearchingLiveGame}
        onTriggerAI={() => triggerAIAnalysis(blueDraft, redDraft)}
        isAILoading={isAILoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 space-y-3.5">
        {/* Live Game Status Banner */}
        {liveGameNotice && (
          <div
            className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
              liveGameNotice.type === 'success'
                ? 'bg-[#12241d] border-[#1d4231] text-emerald-300'
                : liveGameNotice.type === 'info'
                ? 'bg-[#141b29] border-[#1f2b42] text-sky-300'
                : 'bg-[#291417] border-[#441f25] text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {liveGameNotice.type === 'success' ? (
                <Radio size={14} className="text-emerald-400 animate-pulse" />
              ) : (
                <AlertCircle size={14} />
              )}
              <span className="font-semibold">{liveGameNotice.message}</span>
            </div>
            <button
              onClick={() => setLiveGameNotice(null)}
              className="text-gray-400 hover:text-white text-[11px] underline ml-2 cursor-pointer"
            >
              닫기
            </button>
          </div>
        )}

        {/* View Mode Toggle Bar */}
        <div className="flex items-center justify-between bg-[#10141e] border border-[#1d2434] p-1.5 rounded-lg">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('quick')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'quick'
                  ? 'bg-[#4a72ff] text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Zap size={13} />
              <span>1분 초간단 브리핑 (로딩창 추천)</span>
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'detailed'
                  ? 'bg-[#4a72ff] text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Layers size={13} />
              <span>상세 분석 모드</span>
            </button>
          </div>

          <span className="text-[11px] text-gray-500 hidden sm:inline mr-2">
            {viewMode === 'quick' ? '게임 시작 전 핵심 3줄과 한타 결론만 표시' : '스탯 차트 및 심층 리포트 표시'}
          </span>
        </div>

        {/* 5v5 Draft Pick Section */}
        <section className="bg-[#121620] border border-[#202738] rounded-xl p-3 sm:p-3.5 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 relative">
            {/* Blue Team (Our Team) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between border-b border-[#1c2333] pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-[#4a72ff]" />
                  <span className="font-extrabold text-xs tracking-wider text-[#4a72ff]">
                    BLUE TEAM
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">우리 팀</span>
                </div>
                <span className="text-[10px] text-gray-500">클릭하여 변경</span>
              </div>
              <div className="space-y-1">
                {roles.map(role => (
                  <DraftSlot
                    key={`blue-${role}`}
                    role={role}
                    champion={blueDraft[role]}
                    team="blue"
                    onClick={() => openSelectModal('blue', role)}
                    onClear={() => handleClearSlot('blue', role)}
                  />
                ))}
              </div>
            </div>

            {/* Red Team (Enemy Team) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between border-b border-[#29181f] pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-[#e0455f]" />
                  <span className="font-extrabold text-xs tracking-wider text-[#e0455f]">
                    RED TEAM
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">상대 팀</span>
                </div>
                <span className="text-[10px] text-gray-500">클릭하여 변경</span>
              </div>
              <div className="space-y-1">
                {roles.map(role => (
                  <DraftSlot
                    key={`red-${role}`}
                    role={role}
                    champion={redDraft[role]}
                    team="red"
                    onClick={() => openSelectModal('red', role)}
                    onClear={() => handleClearSlot('red', role)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MODE A: 1-Minute Quick Briefing (Default) */}
        {viewMode === 'quick' && (
          <QuickBriefingCard
            analysis={analysis}
            aiResult={aiResult}
            blueDraft={blueDraft}
            redDraft={redDraft}
          />
        )}

        {/* MODE B: Detailed Analysis View */}
        {viewMode === 'detailed' && (
          <div className="space-y-3.5">
            <AICoachPanel
              aiResult={aiResult}
              isLoading={isAILoading}
              onRefresh={() => triggerAIAnalysis(blueDraft, redDraft)}
            />
            <WinRateBar analysis={analysis} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              <TeamfightCard analysis={analysis} />
              <StatsRadarOrBars
                blueStats={analysis.blueStats}
                redStats={analysis.redStats}
              />
            </div>
            <MacroWinConditionCard analysis={analysis} />
            <LaneMatchupsGrid matchups={analysis.laneMatchups} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a2130] py-3 px-4 text-center text-[10px] text-gray-500 bg-[#0a0d14]">
        <p>
          DeepLoL Comp AI - 5:5 솔로랭크 픽창 및 인게임 초고속 1분 브리핑 도구
        </p>
      </footer>

      {/* Modals */}
      <ChampionSelectModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onSelect={handleSelectChampion}
        targetRole={modalState.role}
        team={modalState.team}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        riotApiKey={riotApiKey}
        geminiApiKey={geminiApiKey}
        onSave={handleSaveApiKeys}
      />
    </div>
  );
}

export default App;
