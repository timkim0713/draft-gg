import React from 'react';
import { AnalysisResult, AIAnalysisResult, TeamDraft, Role } from '../types';
import { Swords, ShieldAlert, CheckCircle2, Target, ArrowRight } from 'lucide-react';

interface QuickBriefingCardProps {
  analysis: AnalysisResult;
  aiResult: AIAnalysisResult | null;
  blueDraft: TeamDraft;
  redDraft: TeamDraft;
}

export const QuickBriefingCard: React.FC<QuickBriefingCardProps> = ({
  analysis,
  aiResult,
  blueDraft,
  redDraft
}) => {
  const { favoredTeam, blueWinRate, redWinRate, teamfight, winCondition } = analysis;

  const isBlueFavored = favoredTeam === 'blue';
  const isRedFavored = favoredTeam === 'red';

  // Extract top 2 enemy threat skills
  const redChamps = Object.values(redDraft).filter(c => c !== null);
  const topThreats = redChamps
    .filter(c => c?.keySkillsTip)
    .slice(0, 2)
    .map(c => ({
      name: c!.nameKo,
      tip: c!.keySkillsTip!
    }));

  const roles: Role[] = ['TOP', 'JUG', 'MID', 'BOT', 'SUP'];

  return (
    <div className="bg-[#121620] border border-[#202738] rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* 1. Header: Big verdict & Teamfight Conclusion in 5 seconds */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b2230] pb-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1.5 rounded-lg font-black text-sm tracking-wide border ${
              isBlueFavored
                ? 'bg-[#4a72ff]/20 text-[#719df0] border-[#4a72ff]/40'
                : isRedFavored
                ? 'bg-[#e0455f]/20 text-[#f56678] border-[#e0455f]/40'
                : 'bg-gray-800 text-gray-300 border-gray-700'
            }`}
          >
            {isBlueFavored
              ? `블루팀 ${blueWinRate}% 조합 우세`
              : isRedFavored
              ? `레드팀 ${redWinRate}% 조합 우세`
              : '50:50 백중세 (피지컬 싸움)'}
          </div>
          <span className="text-xs text-gray-300 font-medium hidden sm:inline">
            {aiResult?.summary || analysis.headline}
          </span>
        </div>

        {/* 5:5 Teamfight One-Liner Verdict */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 font-medium">5:5 한타 판정:</span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded font-extrabold border ${
              teamfight.winner === 'blue'
                ? 'bg-[#4a72ff]/15 text-[#719df0] border-[#4a72ff]/30'
                : teamfight.winner === 'red'
                ? 'bg-[#e0455f]/15 text-[#f56678] border-[#e0455f]/30'
                : 'bg-gray-800 text-gray-300 border-gray-700'
            }`}
          >
            {teamfight.winner === 'blue'
              ? '블루팀 한타 대승 (5:5 강제 교전 추천)'
              : teamfight.winner === 'red'
              ? '레드팀 한타 우세 (5:5 회피, 사이드 추천)'
              : '한타 팽팽함 (포지셔닝 승부)'}
          </span>
        </div>
      </div>

      {/* 2. Three-Bullet Action Plan (초반, 중반, 한타 핵심 3줄) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Step 1: Early */}
        <div className="bg-[#0e121a] border border-[#1a2130] p-3 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>1. 초반 오더 (0~14분)</span>
            <span className="text-[10px] text-gray-500 font-normal">라인전/오브젝트</span>
          </div>
          <p className="text-xs text-gray-200 leading-snug">
            {winCondition.earlyGame.objectiveFocus}
          </p>
          <p className="text-[11px] text-gray-400 line-clamp-2">
            {aiResult?.macroRoadmap?.earlyGame || winCondition.earlyGame.guide}
          </p>
        </div>

        {/* Step 2: Mid/Teamfight */}
        <div className="bg-[#0e121a] border border-[#1a2130] p-3 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#4a72ff]">
            <span>2. 한타/중반 오더 (15~25분)</span>
            <span className="text-[10px] text-gray-500 font-normal">교전 설계</span>
          </div>
          <p className="text-xs text-gray-200 leading-snug">
            {winCondition.midGame.macroStyle}
          </p>
          <p className="text-[11px] text-gray-400 line-clamp-2">
            {aiResult?.teamfightVerdict?.blueFocusTarget || teamfight.bluePlan}
          </p>
        </div>

        {/* Step 3: Threat to avoid */}
        <div className="bg-[#0e121a] border border-[#1a2130] p-3 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#e0455f]">
            <span>3. 패배 위험 구간 (주의점)</span>
            <span className="text-[10px] text-gray-500 font-normal">역전 방지</span>
          </div>
          <p className="text-xs text-gray-200 leading-snug">
            {analysis.blueStats.warnings[0] || '무리한 바론 버스트 및 잘라먹기 주의'}
          </p>
          <p className="text-[11px] text-gray-400 line-clamp-2">
            {aiResult?.teamfightVerdict?.redThreatsToAvoid || teamfight.redThreats}
          </p>
        </div>
      </div>

      {/* 3. Bottom Strip: Lane Matchups at a glance & Key Threat Badges */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#0a0d14] p-3 rounded-lg border border-[#161c28]">
        {/* Lane Advantage Strip */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-gray-400 shrink-0">
            라인 주도권:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {analysis.laneMatchups.map(m => (
              <span
                key={m.role}
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${
                  m.favored === 'blue'
                    ? 'bg-[#4a72ff]/10 text-[#719df0] border-[#4a72ff]/30'
                    : m.favored === 'red'
                    ? 'bg-[#e0455f]/10 text-[#f56678] border-[#e0455f]/30'
                    : 'bg-gray-800 text-gray-400 border-gray-700'
                }`}
              >
                {m.roleName}: {m.favored === 'blue' ? '블루' : m.favored === 'red' ? '레드' : '호각'}
              </span>
            ))}
          </div>
        </div>

        {/* Top 2 Enemy Threat Skills Badges */}
        {topThreats.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-[#e0455f] shrink-0 flex items-center gap-1">
              <ShieldAlert size={12} />
              적 핵심 주의 스킬:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {topThreats.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#1e1015] text-rose-300 border border-[#3b1c24] max-w-[260px] truncate"
                  title={`${t.name}: ${t.tip}`}
                >
                  <strong className="text-white font-bold">{t.name}</strong> - {t.tip}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
