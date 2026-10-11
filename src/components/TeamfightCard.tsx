import React from 'react';
import { AnalysisResult } from '../types';
import { Swords, ShieldAlert, Target } from 'lucide-react';

interface TeamfightCardProps {
  analysis: AnalysisResult;
}

export const TeamfightCard: React.FC<TeamfightCardProps> = ({ analysis }) => {
  const { teamfight } = analysis;
  const isBlueWinner = teamfight.winner === 'blue';
  const isRedWinner = teamfight.winner === 'red';

  return (
    <div className="bg-[#121620] border border-[#202738] rounded-xl p-4 sm:p-5 shadow-lg space-y-3.5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Swords size={16} className="text-[#e0455f]" />
          5:5 한타 및 교전 구도 분석
        </h3>
        <span
          className={`text-[11px] px-2 py-0.5 rounded font-bold border ${
            isBlueWinner
              ? 'bg-[#4a72ff]/15 text-[#719df0] border-[#4a72ff]/30'
              : isRedWinner
              ? 'bg-[#e0455f]/15 text-[#f56678] border-[#e0455f]/30'
              : 'bg-gray-800 text-gray-300 border-gray-700'
          }`}
        >
          {isBlueWinner
            ? '블루팀 한타 우세'
            : isRedWinner
            ? '레드팀 한타 우세'
            : '한타 호각'}
        </span>
      </div>

      {/* Summary Box */}
      <div className="bg-[#0e121a] p-3 rounded-lg border border-[#1b2230] text-xs text-gray-300 leading-relaxed">
        <p className="font-medium text-gray-200">{teamfight.summary}</p>
      </div>

      {/* Blue Team Plan vs Red Team Threat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Blue Plan */}
        <div className="bg-[#0e121a] border border-[#1b2230] rounded-lg p-3 space-y-1.5">
          <span className="text-xs font-bold text-[#4a72ff] flex items-center gap-1.5">
            <Target size={13} />
            우리 팀(블루) 한타 승리 플랜
          </span>
          <p className="text-xs text-gray-300 leading-relaxed">
            {teamfight.bluePlan}
          </p>
        </div>

        {/* Red Threat */}
        <div className="bg-[#170f14] border border-[#2b1b22] rounded-lg p-3 space-y-1.5">
          <span className="text-xs font-bold text-[#e0455f] flex items-center gap-1.5">
            <ShieldAlert size={13} />
            상대(레드) 위협 스킬 및 주의점
          </span>
          <p className="text-xs text-gray-300 leading-relaxed">
            {teamfight.redThreats}
          </p>
        </div>
      </div>
    </div>
  );
};
