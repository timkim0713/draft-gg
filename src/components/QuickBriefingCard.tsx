import React, { useState } from 'react';
import { AnalysisResult, AIAnalysisResult, TeamDraft, Role } from '../types';
import { ROLE_LABELS } from '../data/champions';
import { ShieldAlert, Copy, Check, UserCheck, Sparkles, Crosshair } from 'lucide-react';

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
  const { favoredTeam, blueWinRate, redWinRate, teamfight, winCondition, laneMatchups } = analysis;
  const [selectedMyRole, setSelectedMyRole] = useState<Role>('MID');
  const [copied, setCopied] = useState(false);

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

  // Generate 1-line Team Chat Macro
  const generateChatMacro = () => {
    const verdict = teamfight.winner === 'blue'
      ? '우리팀 5:5 한타 연계가 훨씬 좋으니 사이드 돌지 말고 용/바론 5:5 강제 한타 모여요!'
      : teamfight.winner === 'red'
      ? '상대 한타 연계가 좋으니 정면 5:5 피하고 사이드 흔들면서 잘라먹기 위주로 해요!'
      : '초반 라인 주도권 지키면서 오브젝트 1분 전 시야 먼저 잡아주세요!';

    const threatMention = topThreats.length > 0 ? ` (상대 ${topThreats[0].name} 궁 주의)` : '';
    return `[팀합] ${verdict}${threatMention}`;
  };

  const handleCopyChat = () => {
    const text = generateChatMacro();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Personalized Advice for Selected Role
  const myMatchup = laneMatchups.find(m => m.role === selectedMyRole);
  const myChamp = blueDraft[selectedMyRole];
  const enemyChamp = redDraft[selectedMyRole];

  // Recommended Summoner Spell heuristic
  const getRecommendedSpell = (role: Role) => {
    if (role === 'JUG') return '강타 + 점멸';
    if (role === 'SUP') return analysis.redStats.avgMobility >= 7 ? '탈진 + 점멸' : '점화 + 점멸';
    if (analysis.redStats.avgCC >= 7.5 && (role === 'MID' || role === 'BOT')) {
      return '점화/힐 대신 [정화(Cleanse)] 강력 추천 (상대 하드 CC 과다)';
    }
    if (role === 'TOP') return '순간이동 + 점멸';
    if (role === 'BOT') return '회복(또는 방어막) + 점멸';
    return '점화 또는 텔레포트 + 점멸';
  };

  return (
    <div className="bg-[#121620] border border-[#202738] rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* 1. Header: Big verdict & Teamfight Conclusion & Copy to Chat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b2230] pb-3.5">
        <div className="flex items-center gap-2.5 flex-wrap">
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
          <span className="text-xs text-gray-300 font-medium">
            {aiResult?.summary || analysis.headline}
          </span>
        </div>

        {/* Copy to Chat Button */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleCopyChat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#192233] hover:bg-[#223049] border border-[#263550] text-[#719df0] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="롤 픽창 채팅에 바로 붙여넣을 수 있는 1줄 브리핑 복사"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? '복사됨 (Ctrl+V)' : '팀 채팅용 1줄 오더 복사'}</span>
          </button>
        </div>
      </div>

      {/* 2. Three-Bullet Action Plan (초반, 중반, 주의점 3줄) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Step 1: Early */}
        <div className="bg-[#0e121a] border border-[#1a2130] p-3 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>1. 초반 오더 (0~14분)</span>
            <span className="text-[10px] text-gray-500 font-normal">라인전/오브젝트</span>
          </div>
          <p className="text-xs text-gray-200 font-medium leading-snug">
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
          <p className="text-xs text-gray-200 font-medium leading-snug">
            {teamfight.winner === 'blue' ? '5:5 강제 교전 유도 (블루 한타 대승)' : '사이드 분산 및 각개격파'}
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
          <p className="text-xs text-gray-200 font-medium leading-snug">
            {analysis.blueStats.warnings[0] || '무리한 바론 버스트 및 잘라먹기 주의'}
          </p>
          <p className="text-[11px] text-gray-400 line-clamp-2">
            {aiResult?.teamfightVerdict?.redThreatsToAvoid || teamfight.redThreats}
          </p>
        </div>
      </div>

      {/* 3. Personalized "My Role Focus" Bar (내 포지션 맞춤 행동 강령) */}
      <div className="bg-[#0e121a] p-3 rounded-lg border border-[#1a2130] space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#18202d] pb-2">
          <div className="flex items-center gap-2">
            <UserCheck size={14} className="text-[#4a72ff]" />
            <span className="text-xs font-bold text-gray-200">내 포지션 맞춤 미션:</span>
            <div className="flex items-center gap-1">
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedMyRole(r)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    selectedMyRole === r
                      ? 'bg-[#4a72ff] text-white shadow-sm'
                      : 'bg-[#151a26] text-gray-400 hover:text-white'
                  }`}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-gray-400">
            추천 스펠: <span className="text-amber-300 font-semibold">{getRecommendedSpell(selectedMyRole)}</span>
          </div>
        </div>

        {/* Matchup & Action Advice */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="font-bold text-white">
              {myChamp ? myChamp.nameKo : '내 챔피언'} vs {enemyChamp ? enemyChamp.nameKo : '상대'}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                myMatchup?.favored === 'blue'
                  ? 'bg-[#4a72ff]/20 text-[#719df0]'
                  : myMatchup?.favored === 'red'
                  ? 'bg-[#e0455f]/20 text-[#f56678]'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {myMatchup?.favored === 'blue' ? '주도권 우세' : myMatchup?.favored === 'red' ? '상대 주도권' : '호각'}
            </span>
            <span className="text-gray-400 text-[11px]">{myMatchup?.tip}</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Strip: Lane Advantage at a glance & Key Threat Badges */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#0a0d14] p-2.5 rounded-lg border border-[#161c28]">
        {/* Lane Advantage Strip */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-gray-400 shrink-0">
            전 라인 유불리:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {laneMatchups.map(m => (
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
