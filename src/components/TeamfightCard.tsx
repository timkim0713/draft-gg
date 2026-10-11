import React from 'react';
import { AnalysisResult } from '../types';
import { Swords, ShieldAlert, Target, Award } from 'lucide-react';

interface TeamfightCardProps {
  analysis: AnalysisResult;
}

export const TeamfightCard: React.FC<TeamfightCardProps> = ({ analysis }) => {
  const { teamfight } = analysis;
  const isBlueWinner = teamfight.winner === 'blue';
  const isRedWinner = teamfight.winner === 'red';

  return (
    <div className="bg-[#161a23] border border-[#232936] rounded-xl p-5 shadow-lg space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Swords size={17} className="text-[#e84057]" />
          5:5 한타 및 교전 구도 집중 분석
        </h3>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
            isBlueWinner
              ? 'bg-[#5383e8]/20 text-[#719df0] border-[#5383e8]/40'
              : isRedWinner
              ? 'bg-[#e84057]/20 text-[#f56678] border-[#e84057]/40'
              : 'bg-gray-700/30 text-gray-300 border-gray-600'
          }`}
        >
          {isBlueWinner
            ? '🏆 블루팀 한타 우세'
            : isRedWinner
            ? '🏆 레드팀 한타 우세'
            : '⚔️ 한타 호각 (포지셔닝 승부)'}
        </span>
      </div>

      {/* Summary Box */}
      <div className="bg-[#10141e] p-3.5 rounded-lg border border-[#1e2535] text-xs text-gray-300 leading-relaxed">
        <div className="flex items-start gap-2">
          <Award size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="font-medium text-gray-200">{teamfight.summary}</p>
        </div>
      </div>

      {/* Blue Team Plan vs Red Team Threat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Blue Plan */}
        <div className="bg-[#121724] border border-[#1e273a] rounded-lg p-3.5 space-y-2">
          <span className="text-xs font-bold text-[#5383e8] flex items-center gap-1.5">
            <Target size={14} />
            우리 팀(블루) 한타 승리 플랜
          </span>
          <p className="text-xs text-gray-300 leading-relaxed">
            {teamfight.bluePlan}
          </p>
        </div>

        {/* Red Threat */}
        <div className="bg-[#1d1419] border border-[#361f28] rounded-lg p-3.5 space-y-2">
          <span className="text-xs font-bold text-[#e84057] flex items-center gap-1.5">
            <ShieldAlert size={14} />
            상대(레드) 위협 스킬 & 주의점
          </span>
          <p className="text-xs text-gray-300 leading-relaxed">
            {teamfight.redThreats}
          </p>
        </div>
      </div>
    </div>
  );
};
