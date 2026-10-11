import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Champion, Role } from '../types';
import { CHAMPIONS, ROLE_LABELS } from '../data/champions';
import { Search, X } from 'lucide-react';

interface ChampionSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (champion: Champion) => void;
  targetRole: Role | null;
  team: 'blue' | 'red';
}

export const ChampionSelectModal: React.FC<ChampionSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  targetRole,
  team
}) => {
  const [search, setSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<Role | 'ALL'>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      if (targetRole) {
        setSelectedRoleFilter(targetRole);
      } else {
        setSelectedRoleFilter('ALL');
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, targetRole]);

  const filteredChampions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return CHAMPIONS.filter(c => {
      // Role filter
      if (selectedRoleFilter !== 'ALL' && !c.roles.includes(selectedRoleFilter)) {
        return false;
      }
      // Query filter (Korean name, English name, or Initials 초성)
      if (!query) return true;
      return (
        c.nameKo.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.initials.toLowerCase().includes(query)
      );
    });
  }, [search, selectedRoleFilter]);

  if (!isOpen) return null;

  const roleFilters: { label: string; value: Role | 'ALL' }[] = [
    { label: '전체', value: 'ALL' },
    { label: '탑', value: 'TOP' },
    { label: '정글', value: 'JUG' },
    { label: '미드', value: 'MID' },
    { label: '원딜', value: 'BOT' },
    { label: '서폿', value: 'SUP' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-3xl bg-[#161a23] border border-[#2c3240] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#232936] bg-[#1a1f2c]">
          <div className="flex items-center gap-3">
            <span className={`inline-block w-3 h-3 rounded-full ${team === 'blue' ? 'bg-[#5383e8]' : 'bg-[#e84057]'}`} />
            <h3 className="font-bold text-lg text-white">
              {team === 'blue' ? '블루팀' : '레드팀'}{' '}
              {targetRole ? `[${ROLE_LABELS[targetRole]}]` : ''} 챔피언 선택
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#2c3240] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-[#232936] space-y-3 bg-[#131720]">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="챔피언 검색 (한글, 영문, 초성 예: ㅇㅅㅇ, ㅁㅍㅇㅌ)"
              className="w-full pl-10 pr-4 py-2.5 bg-[#1e2330] border border-[#2c3240] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#5383e8] focus:ring-1 focus:ring-[#5383e8] text-sm"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex gap-2">
            {roleFilters.map(rf => (
              <button
                key={rf.value}
                onClick={() => setSelectedRoleFilter(rf.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  selectedRoleFilter === rf.value
                    ? 'bg-[#5383e8] text-white shadow-sm'
                    : 'bg-[#1e2330] text-gray-400 hover:text-gray-200 hover:bg-[#282e3f]'
                }`}
              >
                {rf.label}
              </button>
            ))}
            <span className="ml-auto text-xs text-gray-500 self-center">
              총 {filteredChampions.length}명
            </span>
          </div>
        </div>

        {/* Champions Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 custom-scrollbar">
          {filteredChampions.map(champ => (
            <button
              key={champ.id}
              onClick={() => {
                onSelect(champ);
                onClose();
              }}
              className="flex flex-col items-center p-2 rounded-lg bg-[#1a1f2c] hover:bg-[#242b3d] border border-transparent hover:border-[#5383e8]/60 transition-all text-center group cursor-pointer"
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#2c3240] group-hover:border-[#5383e8] mb-1.5 shadow-md">
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${champ.id}.png`}
                  alt={champ.nameKo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    // Fallback to text initials if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute bottom-0 right-0 px-1 py-0.2 text-[9px] font-bold rounded-tl bg-black/80 text-gray-300">
                  {champ.damageType}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-200 group-hover:text-white truncate w-full">
                {champ.nameKo}
              </span>
              <span className="text-[10px] text-gray-400 truncate w-full">
                {champ.tags[0] || champ.name}
              </span>
            </button>
          ))}
          {filteredChampions.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400">
              <p className="text-sm">검색 결과가 없습니다.</p>
              <p className="text-xs text-gray-600 mt-1">챔피언 이름이나 초성(예: ㅇㅅㅇ)을 확인해주세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
