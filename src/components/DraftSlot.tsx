import React from 'react';
import { Champion, Role } from '../types';
import { ROLE_LABELS } from '../data/champions';
import { Plus, X, Shield, Wand2, Crosshair, Sparkles } from 'lucide-react';

interface DraftSlotProps {
  role: Role;
  champion: Champion | null;
  team: 'blue' | 'red';
  onClick: () => void;
  onClear: () => void;
}

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  TOP: <Shield size={14} className="text-amber-400" />,
  JUG: <Sparkles size={14} className="text-emerald-400" />,
  MID: <Wand2 size={14} className="text-purple-400" />,
  BOT: <Crosshair size={14} className="text-sky-400" />,
  SUP: <Shield size={14} className="text-teal-400" />
};

export const DraftSlot: React.FC<DraftSlotProps> = ({
  role,
  champion,
  team,
  onClick,
  onClear
}) => {
  const isBlue = team === 'blue';
  const roleName = ROLE_LABELS[role];

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-all text-left cursor-pointer ${
          isBlue
            ? 'bg-[#151a24] hover:bg-[#1a2130] border-[#222a3a] hover:border-[#5383e8]/70'
            : 'bg-[#22171c] hover:bg-[#2b1d24] border-[#38232b] hover:border-[#e84057]/70'
        }`}
      >
        {/* Role Icon Badge */}
        <div className="flex flex-col items-center justify-center w-8 shrink-0 text-gray-400">
          <div className="p-1 rounded bg-[#10141d]/80 border border-white/5 mb-0.5">
            {ROLE_ICONS[role]}
          </div>
          <span className="text-[10px] font-bold tracking-wider">{roleName}</span>
        </div>

        {/* Champion Icon or Empty Placeholder */}
        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#2b3242] shadow-sm">
          {champion ? (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${champion.id}.png`}
              alt={champion.nameKo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full bg-[#1c2230]/60 flex items-center justify-center text-gray-500 group-hover:text-gray-300">
              <Plus size={20} className="stroke-[1.5]" />
            </div>
          )}
          {champion && (
            <span
              className={`absolute bottom-0 right-0 px-1 py-0.2 text-[8px] font-bold rounded-tl ${
                champion.damageType === 'AP'
                  ? 'bg-purple-900/90 text-purple-200'
                  : champion.damageType === 'AD'
                  ? 'bg-amber-900/90 text-amber-200'
                  : 'bg-emerald-900/90 text-emerald-200'
              }`}
            >
              {champion.damageType}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {champion ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-gray-100 truncate">
                  {champion.nameKo}
                </span>
                <span className="text-[11px] text-gray-400 truncate">
                  {champion.name}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-300 truncate max-w-[140px]">
                  {champion.tags[0]}
                </span>
                {champion.tags[1] && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 truncate max-w-[120px] hidden sm:inline-block">
                    {champion.tags[1]}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-xs">
              <span className="font-medium text-gray-400">챔피언 선택</span>
              <p className="text-[11px] text-gray-600 mt-0.5">클릭하여 선택</p>
            </div>
          )}
        </div>
      </button>

      {/* Remove Button */}
      {champion && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute right-2 top-2 p-1 rounded-full bg-black/60 hover:bg-red-600 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          title="챔피언 제거"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};
