import React from 'react';
import { TeamDraft, Role } from '../types';
import { getCounterPicks } from '../utils/counterAndBuildAdvisor';
import { useLanguage } from '../context/LanguageContext';
import { Swords, Target, ChevronRight } from 'lucide-react';

interface LaneCounterAdvisorCardProps {
  blueDraft: TeamDraft;
  redDraft: TeamDraft;
  onSelectCounter?: (role: Role, champId: string) => void;
}

const ROLES: Role[] = ['TOP', 'JUG', 'MID', 'BOT', 'SUP'];

export const LaneCounterAdvisorCard: React.FC<LaneCounterAdvisorCardProps> = ({
  blueDraft,
  redDraft,
  onSelectCounter
}) => {
  const { lang, getChampName, getRoleName, t } = useLanguage();

  return (
    <div className="bg-[#121620] border border-[#202738] rounded-xl p-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-[#1b2230] pb-2.5">
        <div className="flex items-center gap-2">
          <Swords size={16} className="text-[#4a72ff]" />
          <h3 className="font-bold text-sm text-gray-200">
            {t('counterAdvisorTitle')}
          </h3>
        </div>
        <span className="text-[11px] text-gray-500">
          {t('counterAdvisorSubtitle')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ROLES.map(role => {
          const blueChamp = blueDraft[role];
          const redChamp = redDraft[role];
          const counters = getCounterPicks(redChamp, role);

          const redChampName = redChamp ? getChampName(redChamp) : (lang === 'en' ? 'Unselected' : '미선택');
          const blueChampName = blueChamp ? getChampName(blueChamp) : '';

          return (
            <div
              key={role}
              className="bg-[#0e121a] border border-[#1a2130] rounded-lg p-3 space-y-2.5 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#161c28] pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#4a72ff] font-mono">
                    [{getRoleName(role)}]
                  </span>
                  <span className="text-xs text-gray-300">
                    {lang === 'en' ? 'Enemy:' : '상대:'} <strong className="text-[#f56678]">{redChampName}</strong>
                  </span>
                </div>
                {blueChamp && (
                  <span className="text-[11px] text-gray-400">
                    {lang === 'en' ? 'Our:' : '아군:'} <strong className="text-[#719df0]">{blueChampName}</strong>
                  </span>
                )}
              </div>

              {/* Counters List */}
              {redChamp ? (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                    <Target size={12} className="text-emerald-400" />
                    <span>
                      {lang === 'en'
                        ? `Top 3 Counters vs ${redChampName}:`
                        : `상대 ${redChampName} 파훼 카운터 TOP 3:`}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {counters.map((c, idx) => {
                      const isCurrentBluePick = blueChamp?.id === c.champion.id;
                      const counterChampName = getChampName(c.champion);
                      return (
                        <div
                          key={c.champion.id}
                          className={`p-2 rounded border text-xs transition-all ${
                            isCurrentBluePick
                              ? 'bg-[#12241d] border-[#1d4231] text-emerald-300'
                              : 'bg-[#141924] border-[#1d2538] hover:border-[#38486b] text-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${c.champion.id}.png`}
                                alt={counterChampName}
                                className="w-5 h-5 rounded object-cover"
                                onError={e => { (e.target as HTMLElement).style.display = 'none'; }}
                              />
                              <span className="font-bold text-white">
                                {idx + 1}. {counterChampName}
                              </span>
                              <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-950/80 text-emerald-400 font-mono font-bold border border-emerald-800/40">
                                {c.winRateAdvantage}
                              </span>
                            </div>
                            {onSelectCounter && !isCurrentBluePick && (
                              <button
                                onClick={() => onSelectCounter(role, c.champion.id)}
                                className="text-[10px] text-[#4a72ff] hover:text-white flex items-center gap-0.5 cursor-pointer font-bold"
                              >
                                <span>{t('selectBtn')}</span>
                                <ChevronRight size={11} />
                              </button>
                            )}
                          </div>

                          <p className="text-[11px] text-gray-400 mt-1 leading-tight">
                            {c.tacticalReason}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {t('timing')} {c.spikeTip}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-gray-500">
                  {t('opponentUnselected')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
