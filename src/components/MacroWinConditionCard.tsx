import React from 'react';
import { AnalysisResult } from '../types';
import { Compass, Clock, MapPin, Flag } from 'lucide-react';

interface MacroWinConditionProps {
  analysis: AnalysisResult;
}

export const MacroWinConditionCard: React.FC<MacroWinConditionProps> = ({ analysis }) => {
  const { winCondition } = analysis;

  return (
    <div className="bg-[#161a23] border border-[#232936] rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Compass size={17} className="text-[#5383e8]" />
          단계별 운영 & 우리 팀 승리 플랜 (Macro Roadmap)
        </h3>
        <span className="text-[11px] text-gray-400">
          권장 전술: <span className="text-white font-semibold">{winCondition.midGame.macroStyle}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Phase 1: Early Game */}
        <div className="bg-[#11141c] border border-[#1e2432] rounded-lg p-3.5 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                1단계: 초반 (0~14분)
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                라인전 & 채굴
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {winCondition.earlyGame.guide}
            </p>
          </div>
          <div className="pt-2 border-t border-[#1a1f2b] mt-2">
            <span className="text-[11px] text-gray-400 block">
              🎯 오브젝트 포커스:
            </span>
            <span className="text-xs font-semibold text-amber-300">
              {winCondition.earlyGame.objectiveFocus}
            </span>
          </div>
        </div>

        {/* Phase 2: Mid Game */}
        <div className="bg-[#11141c] border border-[#1e2432] rounded-lg p-3.5 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-sky-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                2단계: 중반 (15~25분)
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                오브젝트 & 사이드
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {winCondition.midGame.guide}
            </p>
          </div>
          <div className="pt-2 border-t border-[#1a1f2b] mt-2">
            <span className="text-[11px] text-gray-400 block">
              🎯 매크로 운영 스타일:
            </span>
            <span className="text-xs font-semibold text-sky-300">
              {winCondition.midGame.macroStyle}
            </span>
          </div>
        </div>

        {/* Phase 3: Late Game */}
        <div className="bg-[#11141c] border border-[#1e2432] rounded-lg p-3.5 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Flag size={13} />
                3단계: 후반 (25분~)
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                바론 & 넥서스 엔딩
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {winCondition.lateGame.guide}
            </p>
          </div>
          <div className="pt-2 border-t border-[#1a1f2b] mt-2">
            <span className="text-[11px] text-gray-400 block">
              🎯 엔딩 핵심 팁:
            </span>
            <span className="text-xs font-semibold text-emerald-300">
              {winCondition.lateGame.endingTip}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
