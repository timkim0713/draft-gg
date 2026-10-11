import React from 'react';
import { AIAnalysisResult } from '../types';
import { Bot, RefreshCw, Crosshair, ShieldAlert, Compass, Lightbulb } from 'lucide-react';

interface AICoachPanelProps {
  aiResult: AIAnalysisResult | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const AICoachPanel: React.FC<AICoachPanelProps> = ({
  aiResult,
  isLoading,
  onRefresh
}) => {
  if (isLoading) {
    return (
      <div className="bg-[#121620] border border-[#202738] rounded-xl p-8 flex flex-col items-center justify-center space-y-3">
        <RefreshCw size={24} className="animate-spin text-[#4a72ff]" />
        <span className="text-sm font-bold text-white">AI 모델이 10개 챔피언 조합 및 한타 상성을 심층 분석 중입니다...</span>
        <span className="text-xs text-gray-400">라인전 파워커브, 5:5 진형 붕괴각, 사이드 스플릿 위험도를 계산하고 있습니다.</span>
      </div>
    );
  }

  if (!aiResult) return null;

  const isBlueFavored = aiResult.favoredTeam === 'blue';
  const isRedFavored = aiResult.favoredTeam === 'red';

  return (
    <div className="bg-[#121620] border border-[#202738] rounded-xl p-5 shadow-lg space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1d2332] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#4a72ff]/10 text-[#4a72ff] border border-[#4a72ff]/20">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">AI 코치 심층 진단</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e2434] text-gray-300 border border-[#2c344a] font-mono">
                {aiResult.modelName}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{aiResult.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span
            className={`text-xs px-2.5 py-1 rounded font-bold border ${
              isBlueFavored
                ? 'bg-[#4a72ff]/10 text-[#719df0] border-[#4a72ff]/30'
                : isRedFavored
                ? 'bg-[#e0455f]/10 text-[#f56678] border-[#e0455f]/30'
                : 'bg-gray-800 text-gray-300 border-gray-700'
            }`}
          >
            {isBlueFavored
              ? `블루팀 조합 우세 (${aiResult.blueWinRate}%)`
              : isRedFavored
              ? `레드팀 조합 우세 (${aiResult.redWinRate}%)`
              : '팽팽한 호각 (50:50)'}
          </span>

          <button
            onClick={onRefresh}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1a202d] hover:bg-[#232b3d] border border-[#283247] text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="AI 재분석"
          >
            <RefreshCw size={12} />
            <span className="text-[11px]">재분석</span>
          </button>
        </div>
      </div>

      {/* 5:5 Teamfight Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Battle Plan & Target */}
        <div className="bg-[#0e121a] border border-[#1b2230] rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#4a72ff]">
            <span className="flex items-center gap-1.5">
              <Crosshair size={14} />
              5:5 한타 설계 및 타겟 우선순위
            </span>
            <span className="text-[10px] text-gray-400">
              판정: {aiResult.teamfightVerdict.winner === 'blue' ? '블루 우세' : aiResult.teamfightVerdict.winner === 'red' ? '레드 우세' : '호각'}
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {aiResult.teamfightVerdict.breakdown}
          </p>
          <div className="pt-2 border-t border-[#181e2b] text-[11px]">
            <span className="text-gray-400 font-semibold block mb-0.5">블루팀 핵심 집중 대상:</span>
            <span className="text-gray-200">{aiResult.teamfightVerdict.blueFocusTarget}</span>
          </div>
        </div>

        {/* Threat & Avoidance */}
        <div className="bg-[#0e121a] border border-[#1b2230] rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#e0455f]">
            <span className="flex items-center gap-1.5">
              <ShieldAlert size={14} />
              상대팀 위협 스킬 및 주의 구간
            </span>
            <span className="text-[10px] text-gray-400">카운터 경계</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {aiResult.teamfightVerdict.redThreatsToAvoid}
          </p>
          <div className="pt-2 border-t border-[#181e2b] text-[11px]">
            <span className="text-gray-400 font-semibold block mb-0.5">전술 스타일 가이드:</span>
            <span className="text-gray-200">{aiResult.macroRoadmap.recommendedStyle}</span>
          </div>
        </div>
      </div>

      {/* Macro Roadmap */}
      <div className="bg-[#0e121a] border border-[#1b2230] rounded-lg p-3.5 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-200">
          <Compass size={14} className="text-[#4a72ff]" />
          <span>단계별 운영 전략 (Macro Plan)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="bg-[#141824] p-2.5 rounded border border-[#1f2637]">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              [초반 0~14분]
            </span>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              {aiResult.macroRoadmap.earlyGame}
            </p>
          </div>
          <div className="bg-[#141824] p-2.5 rounded border border-[#1f2637]">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              [중반 15~25분]
            </span>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              {aiResult.macroRoadmap.midGame}
            </p>
          </div>
          <div className="bg-[#141824] p-2.5 rounded border border-[#1f2637]">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              [후반 25분+]
            </span>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              {aiResult.macroRoadmap.lateGame}
            </p>
          </div>
        </div>
      </div>

      {/* Critical Tips */}
      {aiResult.criticalTips && aiResult.criticalTips.length > 0 && (
        <div className="bg-[#0e121a] border border-[#1b2230] rounded-lg p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Lightbulb size={13} />
            <span>AI 코치 승리 체크리스트</span>
          </div>
          <ul className="space-y-1 pt-0.5">
            {aiResult.criticalTips.map((tip, idx) => (
              <li key={idx} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                <span className="text-gray-500 font-mono text-[10px]">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
