import React, { useState, useMemo } from 'react';
import { AnalysisResult, AIAnalysisResult, TeamDraft, Role } from '../types';
import { getCounterPicks, getSituationalBuildAdvice } from '../utils/counterAndBuildAdvisor';
import { useLanguage } from '../context/LanguageContext';
import { ShieldAlert, Copy, Check, UserCheck, Target, ShieldCheck } from 'lucide-react';

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
  const { lang, getChampName, getRoleName, t } = useLanguage();
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
      name: getChampName(c),
      tip: c!.keySkillsTip!
    }));

  const roles: Role[] = ['TOP', 'JUG', 'MID', 'BOT', 'SUP'];

  // Generate 1-line Team Chat Macro
  const generateChatMacro = () => {
    if (lang === 'en') {
      const verdict = teamfight.winner === 'blue'
        ? 'Our 5v5 teamfight synergy is dominant! Group for Dragon/Baron instead of overextending side lanes!'
        : teamfight.winner === 'red'
        ? 'Enemy 5v5 engage is dangerous! Avoid direct 5v5, split side lanes and look for pickoffs!'
        : 'Maintain lane priority and secure river vision 1 minute before objectives!';
      const threatMention = topThreats.length > 0 ? ` (Watch out for enemy ${topThreats[0].name} ult)` : '';
      return `[Team Macro] ${verdict}${threatMention}`;
    }

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

  // Dynamic Runes and Items based on enemy comp
  const buildAdvice = useMemo(() => {
    return getSituationalBuildAdvice(myChamp, selectedMyRole, redDraft, analysis.redStats);
  }, [myChamp, selectedMyRole, redDraft, analysis.redStats]);

  // Dynamic Counter Picks for this role vs enemy
  const counterPicks = useMemo(() => {
    return getCounterPicks(enemyChamp, selectedMyRole);
  }, [enemyChamp, selectedMyRole]);

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
              ? t('blueFavored', { rate: blueWinRate })
              : isRedFavored
              ? t('redFavored', { rate: redWinRate })
              : t('evenFavored')}
          </div>
          <span className="text-xs text-gray-300 font-medium">
            {aiResult?.summary || analysis.headline}
          </span>
        </div>

        {/* Copy to Chat Button */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleCopyChat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#172033] hover:bg-[#202c46] border border-[#28385e] hover:border-[#4a72ff] rounded-lg text-xs font-bold text-[#719df0] hover:text-white transition-all cursor-pointer shadow-sm"
            title={lang === 'ko' ? '게임 시작 전 아군 채팅창에 붙여넣을 1줄 핵심 브리핑' : '1-line tactical order ready to paste into team chat'}
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? t('copied') : t('copyChat')}</span>
          </button>
        </div>
      </div>

      {/* 2. Three-Line Macro Roadmap (Early, Mid, Danger Zone) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Step 1: Early / Objective */}
        <div className="bg-[#0e121a] border border-[#1a2130] p-3 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>{t('step1Title')}</span>
            <span className="text-[10px] text-gray-500 font-normal">{t('step1Tag')}</span>
          </div>
          <p className="text-xs text-gray-200 font-medium leading-snug">
            {winCondition.earlyGame.objectiveFocus}
          </p>
          <p className="text-[11px] text-gray-400 line-clamp-2">
            {aiResult?.macroRoadmap?.earlyGame || winCondition.earlyGame.guide}
          </p>
        </div>

        {/* Step 2: Mid / Teamfight */}
        <div className="bg-[#0e121a] border border-[#1a2130] p-3 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#4a72ff]">
            <span>{t('step2Title')}</span>
            <span className="text-[10px] text-gray-500 font-normal">{t('step2Tag')}</span>
          </div>
          <p className="text-xs text-gray-200 font-medium leading-snug">
            {teamfight.winner === 'blue' ? t('blueWinTeamfight') : t('redAvoidTeamfight')}
          </p>
          <p className="text-[11px] text-gray-400 line-clamp-2">
            {aiResult?.teamfightVerdict?.blueFocusTarget || teamfight.bluePlan}
          </p>
        </div>

        {/* Step 3: Threat to avoid */}
        <div className="bg-[#0e121a] border border-[#1a2130] p-3 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#e0455f]">
            <span>{t('step3Title')}</span>
            <span className="text-[10px] text-gray-500 font-normal">{t('step3Tag')}</span>
          </div>
          <p className="text-xs text-gray-200 font-medium leading-snug">
            {analysis.blueStats.warnings[0] || (lang === 'ko' ? '무리한 바론 버스트 및 잘라먹기 주의' : 'Avoid overextending at Baron and being picked off')}
          </p>
          <p className="text-[11px] text-gray-400 line-clamp-2">
            {aiResult?.teamfightVerdict?.redThreatsToAvoid || teamfight.redThreats}
          </p>
        </div>
      </div>

      {/* 3. Personalized "My Role Focus" Bar with Dynamic Runes, Items & Counters */}
      <div className="bg-[#0e121a] p-3.5 rounded-lg border border-[#1a2130] space-y-3">
        {/* Role Selector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#18202d] pb-2.5">
          <div className="flex items-center gap-2">
            <UserCheck size={14} className="text-[#4a72ff]" />
            <span className="text-xs font-bold text-gray-200">{t('myRoleFocus')}</span>
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
                  {getRoleName(r)}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-gray-400">
            {t('recommendedSpell')} <span className="text-amber-300 font-semibold">{buildAdvice.recommendedSpell}</span>
          </div>
        </div>

        {/* Current Matchup Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-[#131824] p-2 rounded border border-[#1c2436]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">
              {myChamp ? getChampName(myChamp) : (lang === 'ko' ? '내 챔피언' : 'My Champion')} vs {enemyChamp ? getChampName(enemyChamp) : (lang === 'ko' ? '상대' : 'Opponent')}
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
              {myMatchup?.favored === 'blue' ? t('laneLeadBlue') : myMatchup?.favored === 'red' ? t('laneLeadRed') : t('laneLeadEven')}
            </span>
          </div>
          <span className="text-gray-300 text-[11px]">{myMatchup?.tip}</span>
        </div>

        {/* Sub-Grid: Left = Runes & Situational Items / Right = Counter Picks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
          {/* A. Situational Runes & Core Items */}
          <div className="bg-[#10141e] p-2.5 rounded border border-[#1c2436] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#719df0] border-b border-[#18202d] pb-1">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-sky-400" />
                {t('runesAndBuildTitle')}
              </span>
              <span className="text-[10px] text-gray-500 font-normal">{t('runesAndBuildTag')}</span>
            </div>

            {/* Runes */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">{t('secondaryTree')}</span>
                <span className="font-semibold text-white">{buildAdvice.secondaryRunes.treeName}</span>
              </div>
              <p className="text-[11px] text-amber-200/90 font-medium">
                {buildAdvice.secondaryRunes.runes.join(' + ')}
              </p>
              <p className="text-[10px] text-gray-400">
                {t('reason')} {buildAdvice.secondaryRunes.reason}
              </p>
              <div className="text-[10px] text-gray-500">
                {t('statShards')} {buildAdvice.shards}
              </div>
            </div>

            {/* Situational Items */}
            <div className="border-t border-[#18202d] pt-1.5 space-y-1">
              <span className="text-[11px] font-bold text-gray-300 block">
                {t('situationalCoreItems')}
              </span>
              <div className="space-y-1">
                {buildAdvice.situationalCoreItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded bg-[#151b27] border border-[#212a3d] text-[11px] flex items-start justify-between gap-1"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                            item.priority === '필수'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-sky-950 text-sky-300 border border-sky-800'
                          }`}
                        >
                          {lang === 'en' ? (item.priority === '필수' ? 'Core' : 'Rec') : item.priority}
                        </span>
                        <strong className="text-white font-semibold">{item.name}</strong>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.reason}</p>
                    </div>
                    <span className="text-[9px] text-gray-500 shrink-0 font-mono">
                      {item.timing}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* B. Top 3 Counter Picks vs Enemy Champ in this Lane */}
          <div className="bg-[#10141e] p-2.5 rounded border border-[#1c2436] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 border-b border-[#18202d] pb-1">
              <span className="flex items-center gap-1">
                <Target size={13} className="text-emerald-400" />
                {t('countersTop3Title', { champ: enemyChamp ? getChampName(enemyChamp) : (lang === 'ko' ? '적' : 'Enemy') })}
              </span>
              <span className="text-[10px] text-gray-500 font-normal">{t('countersTop3Tag')}</span>
            </div>

            {enemyChamp && counterPicks.length > 0 ? (
              <div className="space-y-1.5">
                {counterPicks.map((cp, idx) => {
                  const champName = getChampName(cp.champion);
                  return (
                    <div
                      key={cp.champion.id}
                      className="p-1.5 rounded bg-[#151b27] border border-[#212a3d] text-xs flex items-start gap-2"
                    >
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${cp.champion.id}.png`}
                        alt={champName}
                        className="w-7 h-7 rounded object-cover shrink-0 mt-0.5"
                        onError={e => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-[11px]">
                            {idx + 1}. {champName}
                          </span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 font-mono font-bold border border-emerald-800/40">
                            {cp.winRateAdvantage}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-300 leading-tight mt-0.5">
                          {cp.tacticalReason}
                        </p>
                        <p className="text-[9px] text-gray-500 mt-0.5">
                          {t('timing')} {cp.spikeTip}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-gray-500">
                {t('countersPlaceholder', { role: getRoleName(selectedMyRole) })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Bottom Strip: Lane Advantage at a glance & Key Threat Badges */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#0a0d14] p-2.5 rounded-lg border border-[#161c28]">
        {/* Lane Advantage Strip */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-gray-400 shrink-0">
            {t('laneAdvantage')}
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
                {getRoleName(m.role)}: {m.favored === 'blue' ? (lang === 'en' ? 'Blue' : '블루') : m.favored === 'red' ? (lang === 'en' ? 'Red' : '레드') : (lang === 'en' ? 'Even' : '호각')}
              </span>
            ))}
          </div>
        </div>

        {/* Top 2 Enemy Threat Skills Badges */}
        {topThreats.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-[#e0455f] shrink-0 flex items-center gap-1">
              <ShieldAlert size={12} />
              {t('keyThreatSkills')}
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
