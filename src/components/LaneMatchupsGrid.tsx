import React from 'react';
import { LaneMatchup } from '../types';
import { Swords } from 'lucide-react';

interface LaneMatchupsGridProps {
  matchups: LaneMatchup[];
}

export const LaneMatchupsGrid: React.FC<LaneMatchupsGridProps> = ({ matchups }) => {
  return (
    <div className="bg-[#121620] border border-[#202738] rounded-xl p-4 sm:p-5 shadow-lg space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Swords size={16} className="text-amber-400" />
          라인별 1:1 맞대결 상성 및 코칭 팁
        </h3>
        <span className="text-[11px] text-gray-400">
          초반 라인전 주도권 기준
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {matchups.map(m => {
          const isBlueFavored = m.favored === 'blue';
          const isRedFavored = m.favored === 'red';

          return (
            <div
              key={m.role}
              className="bg-[#0e121a] border border-[#1b2230] rounded-lg p-3 flex flex-col justify-between space-y-2.5"
            >
              {/* Lane Header */}
              <div className="flex items-center justify-between border-b border-[#181e2b] pb-1.5">
                <span className="text-xs font-bold text-gray-300">
                  {m.roleName} 라인
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isBlueFavored
                      ? 'bg-[#4a72ff]/15 text-[#719df0]'
                      : isRedFavored
                      ? 'bg-[#e0455f]/15 text-[#f56678]'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {isBlueFavored ? '블루 우세' : isRedFavored ? '레드 우세' : '호각'}
                </span>
              </div>

              {/* 1v1 Portrait Face-off */}
              <div className="flex items-center justify-around py-1">
                {/* Blue Champ */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded overflow-hidden border border-[#242e42] bg-[#121622]">
                    {m.blueChamp ? (
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${m.blueChamp.id}.png`}
                        alt={m.blueChamp.nameKo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
                        미선택
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-gray-300 mt-1 truncate max-w-[60px]">
                    {m.blueChamp?.nameKo || '-'}
                  </span>
                </div>

                <span className="text-gray-600 text-[10px] font-bold">VS</span>

                {/* Red Champ */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded overflow-hidden border border-[#3b1f28] bg-[#1c1216]">
                    {m.redChamp ? (
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${m.redChamp.id}.png`}
                        alt={m.redChamp.nameKo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
                        미선택
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-gray-300 mt-1 truncate max-w-[60px]">
                    {m.redChamp?.nameKo || '-'}
                  </span>
                </div>
              </div>

              {/* Tip */}
              <div className="bg-[#0b0e14] p-2 rounded text-[11px] text-gray-400 leading-snug min-h-[44px] flex items-center">
                {m.tip}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
