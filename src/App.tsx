import React, { useState, useMemo } from 'react';
import { TeamDraft, Role, Champion } from './types';
import { PRESET_COMPS, PresetComp } from './data/presets';
import { analyzeMatch } from './utils/analyzer';
import { Header } from './components/Header';
import { DraftSlot } from './components/DraftSlot';
import { WinRateBar } from './components/WinRateBar';
import { TeamfightCard } from './components/TeamfightCard';
import { StatsRadarOrBars } from './components/StatsRadarOrBars';
import { MacroWinConditionCard } from './components/MacroWinConditionCard';
import { LaneMatchupsGrid } from './components/LaneMatchupsGrid';
import { ChampionSelectModal } from './components/ChampionSelectModal';
import { HelpModal } from './components/HelpModal';

const EMPTY_DRAFT: TeamDraft = {
  TOP: null,
  JUG: null,
  MID: null,
  BOT: null,
  SUP: null
};

export function App() {
  // Initialize with Preset 1 so the user gets instant visual delight and analysis
  const [blueDraft, setBlueDraft] = useState<TeamDraft>(PRESET_COMPS[0].blueDraft);
  const [redDraft, setRedDraft] = useState<TeamDraft>(PRESET_COMPS[0].redDraft);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    team: 'blue' | 'red';
    role: Role | null;
  }>({
    isOpen: false,
    team: 'blue',
    role: null
  });

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Real-time Match Analysis
  const analysis = useMemo(() => {
    return analyzeMatch(blueDraft, redDraft);
  }, [blueDraft, redDraft]);

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
      setBlueDraft(prev => ({ ...prev, [role]: champion }));
    } else {
      setRedDraft(prev => ({ ...prev, [role]: champion }));
    }
  };

  const handleClearSlot = (team: 'blue' | 'red', role: Role) => {
    if (team === 'blue') {
      setBlueDraft(prev => ({ ...prev, [role]: null }));
    } else {
      setRedDraft(prev => ({ ...prev, [role]: null }));
    }
  };

  const handleReset = () => {
    setBlueDraft({ ...EMPTY_DRAFT });
    setRedDraft({ ...EMPTY_DRAFT });
  };

  const handleSwapTeams = () => {
    setBlueDraft(redDraft);
    setRedDraft(blueDraft);
  };

  const handleSelectPreset = (preset: PresetComp) => {
    setBlueDraft(preset.blueDraft);
    setRedDraft(preset.redDraft);
  };

  const roles: Role[] = ['TOP', 'JUG', 'MID', 'BOT', 'SUP'];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#e6edf3] flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onSwapTeams={handleSwapTeams}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* 5v5 Draft Pick Section */}
        <section className="bg-[#121620] border border-[#202738] rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
            {/* Blue Team (Our Team) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#20283b] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5383e8] shadow-sm shadow-[#5383e8]" />
                  <span className="font-bold text-sm text-white">우리 팀 (블루 진영)</span>
                </div>
                <span className="text-xs text-[#719df0] font-medium">
                  클릭하여 챔피언 변경
                </span>
              </div>
              <div className="space-y-2">
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
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#36202a] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e84057] shadow-sm shadow-[#e84057]" />
                  <span className="font-bold text-sm text-white">상대 팀 (레드 진영)</span>
                </div>
                <span className="text-xs text-[#f56678] font-medium">
                  클릭하여 챔피언 변경
                </span>
              </div>
              <div className="space-y-2">
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

        {/* Dashboard 1: Overall Verdict & Win Rate Bar */}
        <WinRateBar analysis={analysis} />

        {/* Dashboard 2: Teamfight Analysis & Stats Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeamfightCard analysis={analysis} />
          <StatsRadarOrBars
            blueStats={analysis.blueStats}
            redStats={analysis.redStats}
          />
        </div>

        {/* Dashboard 3: Macro Roadmap (Early, Mid, Late) */}
        <MacroWinConditionCard analysis={analysis} />

        {/* Dashboard 4: Lane by Lane 1v1 Matchups */}
        <LaneMatchupsGrid matchups={analysis.laneMatchups} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e2432] py-5 px-4 text-center text-xs text-gray-500 bg-[#0e1118]">
        <p>
          LoL Comp Coach - League of Legends 5:5 솔랭 실시간 조합 분석 및 한타/운영 가이드
        </p>
        <p className="mt-1 text-[11px] text-gray-600">
          데이터 출처: Riot Games Data Dragon CDN (Non-commercial fan project)
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

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

export default App;
