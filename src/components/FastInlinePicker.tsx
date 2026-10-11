import React, { useState, useMemo } from 'react';
import { Role, Champion } from '../types';
import { CHAMPIONS, ROLE_LABELS } from '../data/champions';
import { getCounterPicks } from '../utils/counterAndBuildAdvisor';
import { Search, Target, ArrowRight } from 'lucide-react';

interface FastInlinePickerProps {
  activeTeam: 'blue' | 'red';
  activeRole: Role;
  opponentChamp?: Champion | null;
  onSelectChampion: (champ: Champion) => void;
  onSelectSlot: (team: 'blue' | 'red', role: Role) => void;
}

export const FastInlinePicker: React.FC<FastInlinePickerProps> = ({
  activeTeam,
  activeRole,
  opponentChamp,
  onSelectChampion,
  onSelectSlot
}) => {
  const [search, setSearch] = useState('');

  // Champions filtered for this role
  const roleChampions = useMemo(() => {
    return CHAMPIONS.filter(c => c.roles.includes(activeRole));
  }, [activeRole]);

  // Search filtered champions
  const displayedChampions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roleChampions;
    return CHAMPIONS.filter(c =>
      c.nameKo.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.initials.toLowerCase().includes(q)
    );
  }, [search, roleChampions]);

  // Dynamic Counter Picks vs opponent champion in this slot
  const counterPicks = useMemo(() => {
    return getCounterPicks(opponentChamp || null, activeRole);
  }, [opponentChamp, activeRole]);

  const roles: Role[] = ['TOP', 'JUG', 'MID', 'BOT', 'SUP'];

  return (
    <div className="bg-[#10141e] border border-[#1e2535] rounded-xl p-3.5 space-y-2.5">
      {/* Target Slot Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#18202d] pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-300">선택 대상:</span>
          {/* Team Switcher */}
          <div className="flex items-center rounded bg-[#0a0d14] p-0.5 border border-[#1d2433]">
            <button
              onClick={() => onSelectSlot('blue', activeRole)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                activeTeam === 'blue'
                  ? 'bg-[#4a72ff] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              블루팀
            </button>
            <button
              onClick={() => onSelectSlot('red', activeRole)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                activeTeam === 'red'
                  ? 'bg-[#e0455f] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              레드팀
            </button>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-1">
            {roles.map(r => (
              <button
                key={r}
                onClick={() => onSelectSlot(activeTeam, r)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  activeRole === r
                    ? activeTeam === 'blue'
                      ? 'bg-[#4a72ff]/20 text-[#719df0] border border-[#4a72ff]/40'
                      : 'bg-[#e0455f]/20 text-[#f56678] border-[#e0455f]/40'
                    : 'bg-[#141a26] text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Search Input (Korean Initials Supported e.g. ㅇㅅㅇ, ㅋㅅㅌ, ㅎㅇㅇ) */}
        <div className="relative w-full sm:w-60">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="챔피언/초성 검색 (예: ㅇㅅㅇ, ㅋㅇㅅ)"
            className="w-full pl-8 pr-3 py-1 bg-[#0a0d14] border border-[#1f2737] focus:border-[#4a72ff] rounded text-xs text-white placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Recommended Counter Picks for immediate 1-click selection */}
      {opponentChamp && counterPicks.length > 0 && (
        <div className="flex items-center gap-2 bg-[#0c131d] px-2.5 py-1.5 rounded-lg border border-[#1b2f48] overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 shrink-0">
            <Target size={13} className="text-emerald-400" />
            <span>상대 {opponentChamp.nameKo} 카운터 추천:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {counterPicks.map(cp => (
              <button
                key={`counter-${cp.champion.id}`}
                onClick={() => onSelectChampion(cp.champion)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#10231c] hover:bg-[#163529] border border-[#1c4d37] hover:border-emerald-400 text-xs font-semibold text-emerald-200 hover:text-white transition-all cursor-pointer group shrink-0 shadow-sm"
                title={`${cp.champion.nameKo}: ${cp.tacticalReason} (클릭 시 즉시 픽)`}
              >
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${cp.champion.id}.png`}
                  alt={cp.champion.nameKo}
                  className="w-4 h-4 rounded object-cover"
                  onError={e => { (e.target as HTMLElement).style.display = 'none'; }}
                />
                <span>{cp.champion.nameKo}</span>
                <span className="text-[10px] px-1 py-0.1 rounded bg-emerald-950 font-mono text-emerald-400 font-bold border border-emerald-800/40">
                  {cp.winRateAdvantage}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Speed Champion Grid (Clicking immediately assigns and advances) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-[11px] font-bold text-gray-400 shrink-0">
          [{ROLE_LABELS[activeRole]} 전체]:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {displayedChampions.map(c => (
            <button
              key={c.id}
              onClick={() => onSelectChampion(c)}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#151b27] hover:bg-[#20293b] border border-[#21293c] hover:border-[#4a72ff] transition-all cursor-pointer group shrink-0"
              title={`${c.nameKo} (${c.name}) - 클릭 시 즉시 선택`}
            >
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${c.id}.png`}
                alt={c.nameKo}
                className="w-5 h-5 rounded object-cover"
                onError={e => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <span className="text-xs font-semibold text-gray-200 group-hover:text-white">
                {c.nameKo}
              </span>
              <span className="text-[10px] text-gray-500">
                {c.damageType}
              </span>
            </button>
          ))}
          {displayedChampions.length === 0 && (
            <span className="text-xs text-gray-500">검색 결과가 없습니다.</span>
          )}
        </div>
      </div>
    </div>
  );
};
